import bytes from 'bytes'
import * as fs from 'node:fs'
import * as https from 'node:https'
import {dirname} from 'node:path'
import progress from 'smooth-progress'
import tunnel from 'tunnel-agent'

export function download(url: string, path: string, opts: {progress: boolean}) {
  return new Promise((fulfill, reject) => {
    fs.mkdirSync(dirname(path), {recursive: true})
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
    total: Number.parseInt(rsp.headers['content-length'], 10),
    width: 25,
  })
  let total = 0
  rsp.on('data', (chunk: any[] | string) => {
    total += chunk.length
    bar.tick(chunk.length, {data: bytes(total)})
  })
}
