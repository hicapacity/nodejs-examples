var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

function beep(socket, timeout) {
	console.log("beep");
	socket.emit('news', { hello: 'beep<br/>' });
	setTimeout(beep, timeout, socket, timeout);
}


io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'hello world!<br/>' });
  socket.on('my other event', function (data) {
    console.log("from client: " + data);
  });
  beep(socket, 1000);
});


app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});

app.use("/public", express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('index', {title: 'hello world', foo: 'bar', baz: 'qux'});
});

app.listen(3000);
console.log("App on http://localhost:3000")