let fs          = require('fs')
let https       = require('https')
let progress    = require('smooth-progress')
let bytes       = require('bytes')

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
    https.get(url, function (rsp) {
      if (opts.progress) showProgress(rsp)
      rsp.pipe(file)
      .on('error', reject)
      .on('close', fulfill);
    })
  })
}

module.exports = download
