exports.topic = {
  name: 'slugs',
  description: 'Lists and downloads application slugs'
}

exports.commands = [
  require('./commands/slugs/download.js'),
  require('./commands/slugs/index.js')
]
