var request = require('request')
  , transfuse = require('transfuse')
  , recentUrl = 'http://isaacs.couchone.com/registry/_design/app/_view/browseUpdated?descending=true&limit=10&skip=0&group_level=3'
  , http = require('http')
  , Json2Csv = require('json2csv-stream')
  , moment = require('moment')
  , url = require('url')

function recents () {
  return request(recentUrl).pipe(transfuse(['rows', /./, 'key'], function (doc, map) {
    map({
      title: doc[1],
      updated: moment(doc[0]).fromNow(),
      description: doc[2]
    })
  }))
}

function downloads (module) {
  return request({
    url: 'http://isaacs.iriscouch.com/downloads/_design/app/_view/pkg?',
    qs: {
      group_level: 2,
      start_key: '["' + module + '"]', // wtf
      end_key: '["' + module + '", {}]',
    }
  }).pipe(transfuse(['rows', /./], function (doc, map) {
    map({
      request: doc.key[1],
      downloads: doc.value
    })
  }))
}

http.createServer(function (req, res) {
  var _url = url.parse(req.url, true)
    , path = _url.pathname
  if (path === '/recent.json') {
    res.writeHead(200, {'Content-Type': 'application/json'})
    recents().pipe(res)
  } else if (path === '/recent.csv') {
    res.writeHead(200, {'Content-Type': 'text/csv'})
    var parser = new Json2Csv
    recents().pipe(parser).pipe(res)
  } else if (path === '/downloads.csv') {
    res.writeHead(200, {'Content-Type': 'text/csv'})
    var parser = new Json2Csv
    downloads(_url.query.module).pipe(parser).pipe(res)
  } else {
    res.writeHead(400)
    res.end()
  }
}).listen(1337, 'dash-dev.com')
