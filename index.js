var request = require('request')
  , transfuse = require('transfuse')
  , url = 'http://isaacs.couchone.com/registry/_design/app/_view/browseUpdated?descending=true&limit=10&skip=0&group_level=3'
  , http = require('http')
  , Json2Csv = require('json2csv-stream')

function mapper (doc, map) {
  map({
    title: doc[1],
    updated: doc[0],
    description: doc[2]
  })
}

function transfused () {
  return request(url).pipe(transfuse(['rows', /./, 'key'], mapper))
}

http.createServer(function (req, res) {
  if (req.url === '/recent.json') {
    res.writeHead(200, {'Content-Type': 'application/json'})
    transfused().pipe(res)
  } else if (req.url === '/recent.csv') {
    res.writeHead(200, {'Content-Type': 'text/csv'})
    var parser = new Json2Csv
    transfused().pipe(parser).pipe(res)
  } else {
    res.writeHead(400)
    res.end()
  }
}).listen(1337, '127.0.0.1')
