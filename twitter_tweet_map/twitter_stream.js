var sys = require("sys"),
   http = require("http"),
    url = require("url"), 
 static = require("node-static"),
express = require("express"),
    sio = require("socket.io"),
Twitter = require("twitter-node").TwitterNode,
     db = require("redis").createClient(),
   port = 8000;

var USERNAME = process.ARGV[2];
var PASSWORD = process.ARGV[3];

if (!USERNAME || !PASSWORD)
	return sys.puts("Usage: node twitter_stream.js <twitter_username> <twitter_password>");

var twit = new Twitter({
	user: USERNAME, 
	password:  PASSWORD,
	follow: [],
    locations: [-122.75, 36.8, -121.75, 37.8] // tweets in SF
});

var ignored = ['a', 'the', 'is', 'and', 'an', 'in', 'on', 'i', 'at'];

// Create server
var app = express.createServer();

app.get('/favicon.ico', function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end();
});

app.get('/', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    db.zrevrange('top20', 0, 20, function(err, result) {
        result.forEach(function (item) {
            res.write(item);
            res.write('<br/>');
        })
        res.end();
    });
});

// socket.io 
var io = sio.listen(app); 

io.sockets.on('connection', function(client) {}); 

twit.addListener('tweet', function(tweet) {
    console.log("New tweet");
    var text = tweet['text'];
    var split_text = text.split(" ");
    split_text.forEach(function(item) { 
        var normalized = item.toLowerCase();

        if (0 > ignored.indexOf(item) && item.length > 1) {
            db.incr(normalized, function(err, result) {});
            db.get(normalized, function(err, result) {
                console.log("Adding " + normalized + " with score:" + result);
                db.zadd('top20', result, normalized, function(err, result) {});
            });
        } 
    });
}).stream();

twit.addListener('error', function(error) {
    console.log(error.message);
});

app.listen(port);
