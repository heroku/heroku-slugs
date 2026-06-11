import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import * as path from 'node:path'

export const getConfig = async () => {
  const conf = new Config({root: path.resolve(__dirname, '..', 'fixtures')})
  await conf.load()
  return conf
}

export const getHerokuAPI = async () => {
  const conf = await getConfig()
  return new APIClient(conf)
}
