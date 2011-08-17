var  io = require("socket.io"),
express = require('express'),
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
    app.use(express.static(__dirname + '/public', { maxAge: 31557600000 }));
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.render('index.ejs', {
        locals: {}
    });
});

app.get('/favicon.ico', function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end();
});

var sio = io.listen(app); 
sio.sockets.on('connection', function(socket) {
    
  var random = setInterval(function () {
    socket.volatile.emit('message', '');
  }, 1000);

  socket.on('disconnect', function () {
    clearInterval(random);
  });
}); 

app.listen(port);
