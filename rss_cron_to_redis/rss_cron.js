var express = require('express'),
	  OAuth = require('oauth').OAuth,
	     qs = require('querystring'),
       cron = require('cron'),
    request = require('request'),
 htmlparser = require('htmlparser'),
        sys = require('sys'),
       port = 8000;

var RSS_FEED = process.ARGV[2];

if (!RSS_FEED)
	return sys.puts("Usage: node rss_cron.js <rss_feed>");

var rss_handler = new htmlparser.RssHandler(function (error, dom) {
    console.log(dom.items);
});

var parser = new htmlparser.Parser(rss_handler);

new cron.CronJob('*/30 * * * * *', function() {
    get_feed(RSS_FEED);
});

function get_feed(rss_feed) {
    request({uri:rss_feed}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parser.parseComplete(body);
        }
    })
};

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
