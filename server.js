var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');

const config = require('./config');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var pusher = new Pusher({
  appId: '477484',
  key: '2ee263535b67d5cdf084',
  secret: config.PUSHER_SECRET,
  cluster: 'ap2',
  encrypted: false
});

app.post('/message', function(req, res) {
  var message = req.body.message;
  pusher.trigger( 'public-chat', 'message-added', { message });
  res.sendStatus(200);
});

app.get('/', function(req, res) {
  res.sendFile('/public/index.html', {root: __dirname });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`app listening on port ${port}!`)
});
