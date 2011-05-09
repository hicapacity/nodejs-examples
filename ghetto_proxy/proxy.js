var  sys = require('sys'), 
 express = require('express'),
 request = require('request'),
    port = 8000;

// Create server
var app = express.createServer();

app.configure(function() {
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: "hicapacityrocks"}));
});

app.configure('development', function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.static(__dirname + '/public', { maxAge: 31557600000 }));
    app.use(express.errorHandler());
});

app.get('/favicon.ico', function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end();
});

app.get('/:domain.:tld', function(req, res) {
	var url = "http://" + req.params.domain + "." + req.params.tld;

	console.log("Starting call out to: " + url);

	request({uri:url}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Finished call out to: " + url);
			res.send(body);
		}
	});

	console.log("Waiting for next call");
});

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);
