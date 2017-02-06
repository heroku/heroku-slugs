exports.topic = {
  name: 'slugs',
  // this is the help text that shows up under `heroku help`
  description: 'A Heroku CLI plugin to manage and download slugs'
}

exports.commands = [
  require('./commands/download.js')
]
