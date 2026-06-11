import * as fs from 'fs-extra'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const execSyncMock = vi.fn()

vi.mock('node:child_process', async importOriginal => {
  const actual = await importOriginal<typeof import('node:child_process')>()
  return {
    ...actual,
    execSync: (...args: Parameters<typeof actual.execSync>) => execSyncMock(...args),
  }
})

const Cmd = (await import('../../../src/commands/slugs/download')).default
const {default: runCommand} = await import('../../helpers/run-command')

describe('slugs:download', () => {
  beforeEach(() => {
    nock.cleanAll()
    execSyncMock.mockReset()
  })

  afterEach(async () => {
    fs.remove('myapp')
  })

  it('downloads a slug', async () => {
    nock('https://api.heroku.com')
      .get('/apps/myapp/slugs/slug-id')
      .reply(200, {
        blob: {
          url: 'https://slug-url.com/slug.tgz',
        },
      })

    const slugContent = 'mock-slug-content'
    nock('https://slug-url.com')
      .get('/slug.tgz')
      .reply(200, slugContent)

    await runCommand(Cmd, [
      '--app',
      'myapp',
      'slug-id',
    ])

    expect(execSyncMock).toHaveBeenCalledWith('mkdir myapp')
    expect(execSyncMock).toHaveBeenCalledWith('tar -xf myapp/slug.tar.gz -C myapp')
    expect(stdout.output).toContain('Downloading slug slug-id to myapp/slug.tar.gz')
    expect(stderr.output).toContain('Extracting myapp/slug.tar.gz... done')
  })
})
