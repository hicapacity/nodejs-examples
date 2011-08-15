var express = require('express'),
sys = require('sys'),
jade = require('jade'),
port = 8000;

// Create server
var app = express.createServer();

app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});

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

// Routes example
app.get('/user/:id', function(req, res) {
	var people = [
	    { name: 'Dave', location: 'Atlanta' },
	    { name: 'Santa Claus', location: 'North Pole' },
	    { name: 'Man in the Moon', location: 'The Moon' }
	  ];
	res.send(JSON.stringify(people));
});

// Playing with invoking callbacks on route
app.get('/status', check_status, function(req, res) {
});

function check_status(req, res) {
	res.send('status has been checked at:' + new Date());
};

// Playing with Jade
app.get('/register', function(req, res) {
	res.render('register_form');
});

app.post('/register', function(req,res) {
	res.render('user_registered', {email: req.body.email});
});

// Param pre-conditions
app.get('/precond/:user_id', function(req, res) {
	res.send("user validated in precondition: " + req.user);
});

app.param('user_id', function(req, res, next, id){
	req.user = 'austen.ito@omg.net';
	next();
});	

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);