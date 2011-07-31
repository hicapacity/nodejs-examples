var express = require('express'),
        sys = require("sys"),
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

// Private vars
// TODO: Put your Twitter creds here
var _consumer_key = "";
var _consumer_sec = "";

if (!_consumer_key||!_consumer_sec)
	return sys.puts("Required to insert consumer key/secret into app.");

// Oauth vars
var request_token_url = "https://twitter.com/oauth/request_token";
var access_token_url  = "https://twitter.com/oauth/access_token";
var authorize_url     = "https://twitter.com/oauth/authorize";


app.get('/', function(req, res) {
    if (!req.session.oauth_access_token) {
        res.redirect("/twitter");
	}
	else {
		res.redirect("/favorites");
	}
});

// Request an OAuth Request Token, and redirects the user to authorize it
app.get('/twitter', function(req, res) {

	var oa = new OAuth(request_token_url,
                       access_token_url,
                       _consumer_key,
                       _consumer_sec,
	                  "1.0",
	                  "http://www.localhost.com:8000/twitter_cb/",
	                  "HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_req_token, oauth_req_token_secret, results){
        if (error) {
	 		console.log(error);
		}
        else { 
			// store the tokens in the session
			req.session.oa = oa;
			req.session.oauth_req_token = oauth_req_token;
			req.session.oauth_req_token_secret = oauth_req_token_secret;
		
			// redirect the user to authorize the token
            res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauth_req_token);
      }
    });
});

// Callback for the authorization page
app.get('/twitter_cb', function(req, res) {

    var oa = get_oauth_from_session(req.session.oa);
    
    oa.getOAuthAccessToken(
        req.session.oauth_req_token, 
		req.session.oauth_req_token_secret, 
		req.param('oauth_verifier'), 

		function(error, oauth_access_token, oauth_access_token_secret, results2) {
			if(error) {
				console.log(error);
	 		}
	 		else {
		
				// store the access token in the session
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;

	    		res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/favorites");
	 		}
	});
});


function get_oauth_from_session(oa_session) {
    return new OAuth(oa_session._requestUrl,
                     oa_session._accessUrl,
                     oa_session._consumerKey,
                     oa_session._consumerSecret,
                     oa_session._version,
                     oa_session._authorize_callback,
                     oa_session._signatureMethod);
}


function require_twitter_login(req, res, next) {
	if(!req.session.oauth_access_token) {
		res.redirect("/twitter");
		return;
	}
	next();
};

app.get('/favorites', require_twitter_login, function(req, res) {

    var oa = get_oauth_from_session(req.session.oa);
	
	oa.getProtectedResource(
        "http://api.twitter.com/1/favorites.json",
		"GET", 
		req.session.oauth_access_token, 
		req.session.oauth_access_token_secret,
		function (error, data, response) {
			var favorites = JSON.parse(data);
			res.render('twitter_favorites.ejs', {
				locals: {favorites: favorites }
			});
        }
	);
});


app.get('/favicon.ico', function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end();
});

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);
