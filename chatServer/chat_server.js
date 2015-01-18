var net = require('net');
var server = net.createServer();

var sockets = [];

server.on('error', function(err) {
console.log('Server error:', err.message);
});

server.on('connection', function(socket) {
	console.log('got a new connection');
	sockets.push(socket);

	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	socket.write("Welcome " + socket.name + "\n");
	broadcast(socket.name + " joined the chat\n", socket); 

	socket.on('data', function(data) {
		console.log('got data:', data);
		broadcast(socket.name + " > " + data, socket);
	});

	socket.on('close', function() {
		console.log('connection closed');
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
		broadcast(socket.name + " left the chat.\n");
	});
});

server.on('close', function() {
	console.log('Server closed');
});

server.listen(4001);

function broadcast(message, sender) {
	sockets.forEach(function (client) {
		// Don't want to send it to sender
		if (client === sender) return;
		client.write(message);
	});
	// Log it to the server output too
	process.stdout.write(message)
} 