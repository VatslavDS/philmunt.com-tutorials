var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(3000);

app.get('/', function (req, res) {
		res.sendfile(__dirname + '/index.html');
		});

io.sockets.on('connection', function (socket) {
	socket.on('sendMessage', function (data) {
		socket.broadcast.emit('message', data);
		socket.emit('message', { text: '<strong>'+data.text+'</strong>' });		
	});
});
