'use strict'
exports.topic = {
  name: 'slugs',
  // this is the help text that shows up under `heroku help`
  description: 'a topic for the hello world plugin'
}

exports.commands = [
  require('./commands/download.js')
]
