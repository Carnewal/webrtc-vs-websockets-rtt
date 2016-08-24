var bodyParser = require('body-parser');
var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 3000;

var jsonfile = require('jsonfile')


app.set('view engine', 'pug');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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


app.post('/result', function (req, res) {
  var json = Object.keys(req.body)[0];
  var data = JSON.parse(json)
  jsonfile.writeFile('/tmp/bp/' + new Date().getTime() + '.json', data, function (err) {
    console.error(err)
  })


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
