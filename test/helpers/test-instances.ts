import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const getConfig = async () => {
  const conf = new Config({root: resolve(__dirname, '..', 'fixtures')})
  await conf.load()
  return conf
}

export const getHerokuAPI = async () => {
  const conf = await getConfig()
  return new APIClient(conf)
}
