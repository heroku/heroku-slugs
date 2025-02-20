import color from '@heroku-cli/color'
import * as Heroku from '@heroku-cli/schema'
import * as nock from 'nock'
import {stdout} from 'stdout-stderr'
import heredoc from 'tsheredoc'

import Cmd from '../../../src/commands/slugs/index'
import expectOutput from '../../helpers/expect-output'
import runCommand from '../../helpers/run-command'

import stripAnsi = require('strip-ansi')

describe('slugs:index', function () {
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

  afterEach(function () {
    nock.cleanAll()
  })

  it('returns slugs', async function () {
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
