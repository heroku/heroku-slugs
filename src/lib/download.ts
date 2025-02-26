import * as https from 'https'
import * as fs from 'node:fs'
import * as Path from 'node:path'

const progress = require('smooth-progress')
const bytes = require('bytes')
// eslint-disable-next-line n/no-extraneous-require
const tunnel = require('tunnel-agent')

export function download(url: string, path: string, opts: { progress: any }) {
  return new Promise((fulfill, reject) => {
    fs.mkdirSync(Path.dirname(path), {recursive: true})
    const file = fs.createWriteStream(path)
    const agent = makeAgent()

    https.get(url, {agent}, (rsp: any) => {
      if (opts.progress) showProgress(rsp)
      rsp.pipe(file)
        .on('error', reject)
        .on('close', fulfill)
    })
  })
}

function makeAgent() {
  const host = process.env.HEROKU_HTTP_PROXY_HOST

  if (!host) {
    return
  }

  const port = process.env.HEROKU_HTTP_PROXY_PORT || 8080
  const auth = process.env.HEROKU_HTTP_PROXY_AUTH
  const opts = {proxy: {host, port, proxyAuth: auth}}

  return tunnel.httpsOverHttp(opts)
}

function showProgress(rsp: any) {
  const bar = progress({
    tmpl: 'Downloading... :bar :percent :eta :data',
    total: parseInt(rsp.headers['content-length'], 10),
    width: 25,
  })
  let total = 0
  rsp.on('data', (chunk: any[] | string) => {
    total += chunk.length
    bar.tick(chunk.length, {data: bytes(total)})
  })
}
