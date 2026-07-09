import type * as Heroku from '@heroku-cli/schema'

import * as color from '@heroku/heroku-cli-util/color'
import nock from 'nock'
import {stdout} from 'stdout-stderr'
import stripAnsi from 'strip-ansi'
import tsheredoc from 'tsheredoc'
import {afterEach, describe, it} from 'vitest'

import Cmd from '../../../src/commands/slugs/index.js'
import expectOutput from '../../helpers/expect-output.js'
import runCommand from '../../helpers/run-command.js'

const heredoc = tsheredoc.default

describe('slugs:index', () => {
  const app = {
    id: 'my-app-id',
    name: 'my-app',
  }

  const releases: Heroku.Release[]  = [
    {
      id: 'release1',
      slug: {
        id: 'slug1',
      },
      version: 1,
    },
    {
      id: 'release2',
      slug: {
        id: 'slug2',
      },
      version: 2,
    },
  ]

  afterEach(() => {
    nock.cleanAll()
  })

  it('returns slugs', async () => {
    nock('https://api.heroku.com')
    .get(`/apps/${app.name}/releases`)
    .reply(200, releases)

    await runCommand(Cmd, [
      '--app',
      app.name,
    ])
    expectOutput(stdout.output, heredoc(`
      === ${stripAnsi(color.app(app.name))} Slugs

      v1: slug1
      v2: slug2
    `))
  })
})
