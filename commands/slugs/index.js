'use strict'

let cli = require('heroku-cli-util')
let co = require('co')

function* run (context, heroku) {
    let releases = yield heroku.request({
          path: `/apps/${context.app}/releases`,
          headers: { 'Range': 'version ..; order=desc' }
        })
    cli.log(`Slugs in ${context.app}`)
    for (let r of releases.filter((r) => r.slug)) cli.log(`v${r.version}: ${r.slug.id}`)
}

module.exports = {
    topic: 'slugs',
    description: 'list recent slugs on application',
    needsAuth: true,
    needsApp: true,
    run: cli.command(co.wrap(run))
}
