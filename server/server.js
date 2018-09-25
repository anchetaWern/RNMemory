var express = require("express");
var bodyParser = require("body-parser");
var Pusher = require("pusher");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("dotenv").config();

var users = [];

var pusher = new Pusher({
  // connect to pusher
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER
});

app.get("/", function(req, res) {
  // for testing if the server is running
  res.send("all green...");
});

function randomArrayIndex(max) {
  return Math.floor(Math.random() * max);
}

app.post("/pusher/auth", function(req, res) {
  var username = req.body.username;

  if (users.indexOf(username) === -1) {
    users.push(username);

    if (users.length >= 2) {
      var player_one_index = randomArrayIndex(users.length);
      var player_one = users.splice(player_one_index, 1)[0];

      var player_two_index = randomArrayIndex(users.length);
      var player_two = users.splice(player_two_index, 1)[0];

      // trigger a message to player one and player two on their own channels
      pusher.trigger(
        ["private-user-" + player_one, "private-user-" + player_two],
        "opponent-found",
        {
          player_one: player_one,
          player_two: player_two
        }
      );
    }

    var socketId = req.body.socket_id;
    var channel = req.body.channel_name;
    var auth = pusher.authenticate(socketId, channel);

    res.send(auth);
  } else {
    res.status(400);
  }
});

var port = process.env.PORT || 5000;
app.listen(port);
