import {ux} from '@oclif/core/ux'
import * as fs from 'fs-extra'
import nock from 'nock'
import {stderr, stdout} from 'stdout-stderr'
import stripAnsi from 'strip-ansi'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const originalActionStart = ux.action.start
const originalActionStop = ux.action.stop

const execSyncMock = vi.fn()
const downloadMock = vi.fn()
const notifyMock = vi.fn()

vi.mock('node:child_process', async importOriginal => {
  const actual = await importOriginal<typeof import('node:child_process')>()
  return {
    ...actual,
    execSync: (...args: Parameters<typeof actual.execSync>) => execSyncMock(...args),
  }
})

vi.mock('../../../src/lib/download.js', () => ({
  download: (...args: unknown[]) => downloadMock(...args),
}))

vi.mock('@heroku-cli/notifications', async importOriginal => {
  const actual = await importOriginal<typeof import('@heroku-cli/notifications')>()
  return {
    ...actual,
    notify: (...args: Parameters<typeof actual.notify>) => notifyMock(...args),
  }
})

const Cmd = (await import('../../../src/commands/slugs/download.js')).default
const {default: runCommand} = await import('../../helpers/run-command.js')

describe('slugs:download', () => {
  beforeEach(() => {
    nock.cleanAll()
    execSyncMock.mockReset()
    downloadMock.mockReset()
    downloadMock.mockResolvedValue(null)
    notifyMock.mockReset()
    ux.action.start = (message: string) => {
      process.stderr.write(`${stripAnsi(message)}... `)
    }

    ux.action.stop = (messageToWrite = 'done') => {
      process.stderr.write(`${stripAnsi(messageToWrite)}\n`)
    }
  })

  afterEach(async () => {
    ux.action.start = originalActionStart
    ux.action.stop = originalActionStop
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

    await runCommand(Cmd, [
      '--app',
      'myapp',
      'slug-id',
    ])

    expect(execSyncMock).toHaveBeenCalledWith('mkdir myapp')
    expect(execSyncMock).toHaveBeenCalledWith('tar -xf myapp/slug.tar.gz -C myapp')
    expect(downloadMock).toHaveBeenCalledWith('https://slug-url.com/slug.tgz', 'myapp/slug.tar.gz', {progress: true})
    expect(stdout.output).toContain('Downloading slug slug-id to myapp/slug.tar.gz')
    expect(stderr.output).toContain('Extracting myapp/slug.tar.gz... done')
  })

  it('resolves the latest slug from releases when no slug is given', async () => {
    nock('https://api.heroku.com')
    .get('/apps/myapp/releases')
    .reply(200, [
      {id: 'release1', slug: {id: 'resolved-slug-id'}, version: 1},
    ])
    .get('/apps/myapp/slugs/resolved-slug-id')
    .reply(200, {
      blob: {
        url: 'https://slug-url.com/slug.tgz',
      },
    })

    await runCommand(Cmd, [
      '--app',
      'myapp',
    ])

    expect(downloadMock).toHaveBeenCalledWith('https://slug-url.com/slug.tgz', 'myapp/slug.tar.gz', {progress: true})
    expect(stdout.output).toContain('Downloading slug resolved-slug-id to myapp/slug.tar.gz')
  })

  it('errors when no slug is given and no release has a slug', async () => {
    nock('https://api.heroku.com')
    .get('/apps/myapp/releases')
    .reply(200, [
      {id: 'release1', version: 1},
    ])

    await expect(runCommand(Cmd, [
      '--app',
      'myapp',
    ])).rejects.toThrow('No slug found. Specify the slug to download by its name or ID.')
  })

  it('errors when the slug has no downloadable blob', async () => {
    nock('https://api.heroku.com')
    .get('/apps/myapp/slugs/slug-id')
    .reply(200, {})

    await expect(runCommand(Cmd, [
      '--app',
      'myapp',
      'slug-id',
    ])).rejects.toThrow('This slug has no blob to download.')
  })

  it('does not extract the slug when --no-extract-slug is passed', async () => {
    nock('https://api.heroku.com')
    .get('/apps/myapp/slugs/slug-id')
    .reply(200, {
      blob: {
        url: 'https://slug-url.com/slug.tgz',
      },
    })

    await runCommand(Cmd, [
      '--app',
      'myapp',
      'slug-id',
      '--no-extract-slug',
    ])

    expect(execSyncMock).toHaveBeenCalledWith('mkdir myapp')
    expect(execSyncMock).not.toHaveBeenCalledWith('tar -xf myapp/slug.tar.gz -C myapp')
    expect(stderr.output).not.toContain('Extracting')
  })

  it('sends a notification when the download takes longer than 10 seconds', async () => {
    nock('https://api.heroku.com')
    .get('/apps/myapp/slugs/slug-id')
    .reply(200, {
      blob: {
        url: 'https://slug-url.com/slug.tgz',
      },
    })

    // Simulate a download that pushes elapsed time past the 10s notification threshold.
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValueOnce(0).mockReturnValue(11 * 1000)

    try {
      await runCommand(Cmd, [
        '--app',
        'myapp',
        'slug-id',
      ])
    } finally {
      nowSpy.mockRestore()
    }

    expect(notifyMock).toHaveBeenCalledWith({
      message: 'download is finished',
      subtitle: 'heroku slugs:download',
      title: 'myapp',
    })
  })
})
