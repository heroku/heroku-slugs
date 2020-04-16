let fs          = require('fs')
let https       = require('https')
let progress    = require('smooth-progress')
let bytes       = require('bytes')
let tunnel      = require('tunnel-agent')

function showProgress (rsp) {
  let bar = progress({
    tmpl: 'Downloading... :bar :percent :eta :data',
    width: 25,
    total: parseInt(rsp.headers['content-length'])
  })
  let total = 0
  rsp.on('data', function (chunk) {
    total += chunk.length;
    bar.tick(chunk.length, {data: bytes(total)});
  })
}

function download(url, path, opts) {
  return new Promise(function (fulfill, reject) {
    let file = fs.createWriteStream(path)
    let agent = makeAgent()

    https.get(url, { agent }, function (rsp) {
      if (opts.progress) showProgress(rsp)
      rsp.pipe(file)
      .on('error', reject)
      .on('close', fulfill);
    })
  })
}

function makeAgent() {
  let host = process.env.HEROKU_HTTP_PROXY_HOST

  if (!host) {
    return
  }

  let port = process.env.HEROKU_HTTP_PROXY_PORT || 8080
  let auth = process.env.HEROKU_HTTP_PROXY_AUTH
  let opts = { proxy: { host, port, proxyAuth: auth } }

  return tunnel.httpsOverHttp(opts)
}

module.exports = download
