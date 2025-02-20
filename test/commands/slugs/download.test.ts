import {expect} from 'chai'
import * as nock from 'nock'
import * as childProcess from 'node:child_process'
import {stderr, stdout} from 'stdout-stderr'
import * as fs from 'fs-extra'
import Cmd from '../../../src/commands/slugs/download'
import runCommand from '../../helpers/run-command'

import sinon = require('sinon')

describe('slugs:download', function () {
  let extractTarStub: sinon.SinonStub

  beforeEach(function () {
    nock.cleanAll()
    extractTarStub = sinon.stub(childProcess, 'execSync')
  })

  afterEach(async function () {
    extractTarStub.restore()
    fs.remove('myapp')
  })

  it('downloads a slug', async function () {
    // Mock the Heroku API response
    nock('https://api.heroku.com')
      .get('/apps/myapp/slugs/slug-id')
      .reply(200, {
        blob: {
          url: 'https://slug-url.com/slug.tgz',
        },
      })

    // Mock the slug download URL
    const slugContent = 'mock-slug-content'
    nock('https://slug-url.com')
      .get('/slug.tgz')
      .reply(200, slugContent)

    await runCommand(Cmd, [
      '--app',
      'myapp',
      'slug-id',
    ])

    expect(extractTarStub.withArgs('mkdir myapp').calledOnce).to.eq(true)
    expect(extractTarStub.withArgs('tar -xf myapp/slug.tar.gz -C myapp').calledOnce).to.eq(true)
    expect(stdout.output).to.include('Downloading slug slug-id to myapp/slug.tar.gz')
    expect(stderr.output).to.include('Extracting myapp/slug.tar.gz... done')
  })
})
