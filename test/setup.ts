import nock from 'nock'

process.env.HEROKU_API_KEY = 'test-api-key'
nock.disableNetConnect()
