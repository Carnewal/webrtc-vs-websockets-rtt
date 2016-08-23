var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 3000;

app.set('view engine', 'pug');

var IDs = 0;
var screenWebsockets = {}
var controllerWebsockets = {}
var currentSpammingController = null;


app.get('/controller', function (req, res) {
  res.render('controller', { peerId: IDs});
  IDs++;
});

app.get('/screen', function (req, res) {
  res.render('screen', { peerId: IDs});
  IDs++;
});
//app.use(express.static('public'));


wss.on('connection', function connection(ws) {

  var location = url.parse(ws.upgradeReq.url, true);
  var type = location.query.type
  var id = location.query.id
  var screenid = location.query.screenid

  console.log('WS connection from: ', id, type, screenid)

  if (type === 'controller') {
    controllerWebsockets[id] = ws
    ws.on('message', function incoming(data) {
      currentSpammingController = id
      screenWebsockets[screenid].send(data)
    });
  } else if (type === 'screen') {
    screenWebsockets[id] = ws
    ws.on('message', function incoming(data) {
      controllerWebsockets[currentSpammingController].send(data)
    });
  }
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
