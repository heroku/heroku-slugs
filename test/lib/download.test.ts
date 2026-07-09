import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const httpsGetMock = vi.fn()

vi.mock('node:https', async importOriginal => {
  const actual = await importOriginal<typeof import('node:https')>()
  return {
    ...actual,
    get: (...args: unknown[]) => httpsGetMock(...args),
  }
})

vi.mock('node:fs', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return {
    ...actual,
    createWriteStream: vi.fn(() => ({})),
    mkdirSync: vi.fn(),
  }
})

const {download} = await import('../../src/lib/download')

// Fake response whose pipe().on('close') resolves the download promise immediately.
function fakeResponse() {
  const piped = {
    on(event: string, cb: () => void) {
      if (event === 'close') cb()
      return piped
    },
  }
  return {
    headers: {'content-length': '10'},
    on() {
      return this
    },
    pipe() {
      return piped
    },
  }
}

// Fake response that emits a single data chunk so the progress bar path runs.
function fakeResponseWithData() {
  const piped = {
    on(event: string, cb: () => void) {
      if (event === 'close') cb()
      return piped
    },
  }
  return {
    headers: {'content-length': '10'},
    on(event: string, cb: (chunk: string) => void) {
      if (event === 'data') cb('mock-chunk')
      return this
    },
    pipe() {
      return piped
    },
  }
}

function agentFromLastCall() {
  const [, options] = httpsGetMock.mock.calls.at(-1) as [string, {agent: unknown}]
  return options.agent
}

describe('lib/download', () => {
  const proxyEnvKeys = ['HEROKU_HTTP_PROXY_HOST', 'HEROKU_HTTP_PROXY_PORT', 'HEROKU_HTTP_PROXY_AUTH'] as const
  const originalEnv: Record<string, string | undefined> = {}

  beforeEach(() => {
    for (const key of proxyEnvKeys) {
      originalEnv[key] = process.env[key]
      delete process.env[key]
    }

    httpsGetMock.mockReset()
    httpsGetMock.mockImplementation((_url: string, _options: unknown, cb: (rsp: unknown) => void) => {
      cb(fakeResponse())
      return {
        on() {
          return this
        },
      }
    })
  })

  afterEach(() => {
    for (const key of proxyEnvKeys) {
      if (originalEnv[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = originalEnv[key]
      }
    }
  })

  it('uses no proxy agent when HEROKU_HTTP_PROXY_HOST is unset', async () => {
    await download('https://slug-url.com/slug.tgz', 'myapp/slug.tar.gz', {progress: false})

    expect(agentFromLastCall()).toBeUndefined()
  })

  it('reports progress while streaming when opts.progress is true', async () => {
    httpsGetMock.mockImplementation((_url: string, _options: unknown, cb: (rsp: unknown) => void) => {
      cb(fakeResponseWithData())
      return {
        on() {
          return this
        },
      }
    })

    await expect(download('https://slug-url.com/slug.tgz', 'myapp/slug.tar.gz', {progress: true})).resolves.toBeUndefined()
  })

  it('builds a tunnel proxy agent when HEROKU_HTTP_PROXY_HOST is set', async () => {
    process.env.HEROKU_HTTP_PROXY_HOST = 'proxy.example.com'
    process.env.HEROKU_HTTP_PROXY_PORT = '1234'
    process.env.HEROKU_HTTP_PROXY_AUTH = 'user:pass'

    await download('https://slug-url.com/slug.tgz', 'myapp/slug.tar.gz', {progress: false})

    const agent = agentFromLastCall() as {options: {proxy: unknown}; request: unknown}
    expect(typeof agent.request).toBe('function')
    expect(agent.options.proxy).toEqual({
      host: 'proxy.example.com',
      port: '1234',
      proxyAuth: 'user:pass',
    })
  })
})
