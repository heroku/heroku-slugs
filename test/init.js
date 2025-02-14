const path = require('path')
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
const nock = require('nock')
nock.disableNetConnect()
