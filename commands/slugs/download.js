let cli      = require('heroku-cli-util')
let co       = require('co')
let download = require('../../lib/download')

function* run (context, heroku) {
  const exec = require('child_process').execSync

  let id = context.args.slug_id
  if (!id) {
    let releases = yield heroku.request({
      path: `/apps/${context.app}/releases`,
      headers: { 'Range': 'version ..; order=desc' }
    })
    id = releases.filter((r) => r.slug)[0].slug.id
  }
  let slug = yield heroku.request({path: `/apps/${context.app}/slugs/${id}`})
  exec(`mkdir -p ${context.app}`)
  yield download(slug.blob.url, `${context.app}/slug.tar`, {progress: true})
  exec(`tar -xf ${context.app}/slug.tar -C ${context.app}`)
}

module.exports = {
  topic: 'slugs',
  command: 'download',
  description: 'downloads a slug to slug.dump',
  help: 'If SLUG_ID is not specified, returns the current slug.',
  args: [{name: 'slug_id', optional: true}],
  needsApp:  true,
  needsAuth: true,
  run: cli.command(co.wrap(run))
}
