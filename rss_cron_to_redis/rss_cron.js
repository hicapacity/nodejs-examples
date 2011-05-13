var express = require('express'),
	  OAuth = require('oauth').OAuth,
	     qs = require('querystring'),
       port = 8000;

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

app.get('/', function(req, res) {
});

app.get('/favicon.ico', function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end();
});

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);
