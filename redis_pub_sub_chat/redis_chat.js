var express = require('express'),
         db = require("redis").createClient(),
        sys = require('sys'),
         io = require("socket.io"),
     static = require("node-static"),
       port = 8000;


// Create server
var app  = express.createServer();

// Serve static files
var file = new static.Server('./public');

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

// socket.io 
var socket = io.listen(app); 

socket.on('connection', function(client) {

    // Listen to message channel hicapacity
    db.subscribe('hicapacity');

    db.on("message", function(channel, message) {
        client.send(message);
    });

    client.on('message', function(message) {});

    client.on('disconnect', function() {
        db.quit();
    });
});

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);
