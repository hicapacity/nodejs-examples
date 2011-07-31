var sys = require("sys"),
   http = require("http"),
    url = require("url"), 
 static = require("node-static"),
    sio = require("socket.io"),
Twitter = require("twitter-node").TwitterNode,
   port = 8000;

var USERNAME = process.ARGV[2];
var PASSWORD = process.ARGV[3];

if (!USERNAME || !PASSWORD)
	return sys.puts("Usage: node twitter_stream.js <twitter_username> <twitter_password>");

var twit = new Twitter({
	user: USERNAME, 
	password:  PASSWORD,
	follow: [],
	locations: [-157.86, 21.31, -156.86, 22.31] // Track Hawaii
});

var file = new static.Server('./public');

var server = http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname;
	request.addListener("end", function() {
		file.serve(request, response);
	});
});
server.listen(port);

// socket.io 
var io = sio.listen(server); 

io.sockets.on('connection', function(client) {}); 

twit.addListener('tweet', function(tweet) {
	io.sockets.emit('message', tweet);
}).stream();

twit.addListener('error', function(error) {
    console.log(error.message);
});
