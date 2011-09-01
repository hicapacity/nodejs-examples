var sys = require("sys"),
    http = require("http"),
    url = require("url"), 
    static = require("node-static"),
    sio = require("socket.io"),
    Twitter = require("twitter-node").TwitterNode,
    config = require('./lib/config').config,
    port = 3000;

var USERNAME = config.twitter_sampleuser_screen_name 
var PASSWORD = config.twitter_sampleuser_password

var twit = new Twitter({
user: USERNAME, 
password:  PASSWORD,
follow: [26003862,2467791,236488883,21447363,35094637,43815496,14117843,24727891,16425197,15818391,17338082,
297169759,227837742,15222806,15670515,6070762,1068831,14372486,9493322,811377,19571299,112508240,24019308,
20108560,52146755,50374439,2883841,17461978,31953,9491862,19373710,3013511,66528154,16727535,30313925,
12044602,36880083,34720571,14230524,28706024,24963961,22461427,6815302,74580436,8963722,1435461,11348282,
19397785,759251,28785486,17471979,20710809,21324258,30278532,30973,19195914,16190898,197913616,203138105,
206084198,169927844,22940219,3004231,20479321,19248106,26565946,49717874,25589776,14671170,126424795,51241574,
807095,1367531,428333],
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
		console.log('From @' + tweet.user.screen_name);
		console.log(tweet.text);
		io.sockets.emit('message', tweet);
		}).stream();

twit.addListener('error', function(error) {
		console.log(error.message);
		});
