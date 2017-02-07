exports.topic = {
  name: 'slugs',
  description: 'List and download compiled slugs'
}

exports.commands = [
  require('./commands/slugs/download.js'),
  require('./commands/slugs/index.js')
]
