// TODO: Probably need to add a timeout to the resolve function and remove
// anything still connected after a certain period of time.

var  sys = require('sys'), 
 express = require('express'),
     dns = require('dns'),
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

app.get('/:sld.:tld', function(req, res) {
    var domain = req.params.sld + "." + req.params.tld;

    console.log("Starting DNS request for: " + domain);

    dns.resolve(domain, 'A', function (err, addresses) {
        console.log("Finished DNS request for: " + domain);
        var message = "is unavailable";

        if (err) {
            if (err.errno == 4) {
                message = "is available";
            } else {
                message = "status is unknown";
            }
        } 

        res.render('domain.ejs', {
            locals: {domain: domain, message: message}
        });
    });
    console.log("Ready for next request");
});

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);
