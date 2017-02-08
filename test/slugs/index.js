'use strict'

let nock = require('nock')
let expect = require('chai').expect
let index = require('../../commands/slugs')

describe('slugs', function () {
  beforeEach(() => cli.mockConsole())

  it('lists the slug versions', function () {
    let api = nock('https://api.heroku.com:443')
      .get('/apps/example/releases')
      .reply(200, [
        {'version': '2', 'slug': {'id': '1234'}},
        {'version': '1', 'slug': {'id': '4321'}}
      ])
    return index.run({app: 'example'})
      .then(() => expect(cli.stdout).to.equal('Slugs in example\nv2: 1234\nv1: 4321\n'))
      .then(api.done)
  })
})
