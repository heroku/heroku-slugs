import type * as Heroku from '@heroku-cli/schema'

import {expectOutput, runCommand} from '@heroku-cli/test-utils'
import * as color from '@heroku/heroku-cli-util/color'
import nock from 'nock'
import stripAnsi from 'strip-ansi'
import heredoc from 'tsheredoc'
import {afterEach, describe, it} from 'vitest'

import Cmd from '../../../src/commands/slugs/index.js'

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

    const {stdout} = await runCommand(Cmd, [
      '--app',
      app.name,
    ])
    expectOutput(stdout, heredoc`
      === ${stripAnsi(color.app(app.name))} Slugs

      v1: slug1
      v2: slug2
    `)
  })
})
