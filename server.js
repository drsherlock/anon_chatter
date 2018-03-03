var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
var exphbs  = require('express-handlebars');

const config = require('./config');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var pusher = new Pusher({
  appId: '477484',
  key: '2ee263535b67d5cdf084',
  secret: config.PUSHER_SECRET,
  cluster: 'ap2',
  encrypted: false
});

let onlineMembers = new Set();

app.post('/message', function(req, res) {
  var message = req.body.message;
  var userDisplayName = req.body.userDisplayName;
  var userPhotoURL = req.body.userPhotoURL;

  pusher.trigger( 'public-chat', 'message-added', { message, userDisplayName, userPhotoURL });
  res.sendStatus(200);
});

app.post('/member-joined', function(req, res) {
  var userDisplayName = req.body.userDisplayName;
  var userPhotoURL = req.body.userPhotoURL;

  onlineMembers.add(userDisplayName);
  var onlineMembersArray = Array.from(onlineMembers);
  
  pusher.trigger( 'public-chat', 'member-joined', { userDisplayName, userPhotoURL, onlineMembersArray });
  res.sendStatus(200);
});

app.post('/member-left', function(req, res) {
  var userDisplayName = req.body.userDisplayName;
  var userPhotoURL = req.body.userPhotoURL;

  onlineMembers.delete(userDisplayName);
  var onlineMembersArray = Array.from(onlineMembers);
  
  pusher.trigger( 'public-chat', 'member-left', { userDisplayName, userPhotoURL, onlineMembersArray });
  res.sendStatus(200);
});

app.get('/chat', function(req, res) {
  res.render('chat', {root: __dirname });
});

app.get('/', function(req, res) {
  res.render('index', {root: __dirname });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});
