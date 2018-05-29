let cli      = require('heroku-cli-util')
let co       = require('co')

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
  cli.log(slug.blob.url);
}

module.exports = {
  topic: 'slugs',
  command: 'url',
  description: 'gets the url to a slug',
  help: 'If SLUG_ID is not specified, returns the current slug.',
  args: [{name: 'slug_id', optional: true}],
  needsApp:  true,
  needsAuth: true,
  run: cli.command(co.wrap(run))
}
