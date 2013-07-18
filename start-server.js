var application_root = __dirname
  , bunyan = require('bunyan')
  , restify = require('restify')
  , path = require('path')

var log = new bunyan(
  { name: 'blocking'
  , streams:
    [ { stream: process.stdout
      , level: 'debug'
      }
    ]
  , serializers: bunyan.stdSerializers
  }
)


//Restify
var server = restify.createServer(
  { name: 'Blocker'
  , log: log
  , version: '0.1.0'
  }
)

server.use(restify.fullResponse())
server.use(restify.acceptParser(server.acceptable))
server.use(restify.dateParser())
server.use(restify.jsonp())
server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(restify.authorizationParser())

server.pre(function envDebugStart(req, res, next) {
  req.log.debug({req: req}, 'start')
  return next()
})

server.on('after', function envDebugFinish(req, res, route) {
  req.log.debug({res: res}, 'finished')
})

var fibonacci = function(n) {
   if (n < 2) return 1
   else return fibonacci(n-2) + fibonacci(n-1)
}

server.get('/', function rootPath(req, res, next){
  if (!req.params['n']) {
    res.send('Must have "n" in query string')
    return next()
  } else {
    var fibResult = fibonacci(req.params['n'])
    res.send('Result: '+fibResult)
    return next()
  }
})

server.listen(8888, function serverStarter() {
  log.debug('Started server on port 8888')
})
