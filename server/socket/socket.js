let io = require('socket.io');

exports.initialise = (http) => {

	io = io.listen(http);

	var self = this;

	this.generalChannel = io.of("/general_channel")
		.on("connection", function(socket) {
			console.log('a user from generalChannel is connected');

			// var app = this;

			socket.on('add user', function(username) {


				console.log(username)

				// we store the username in the socket session for this client
				socket.username = username;

				var data = {
					type: 'severMessage',
					owner: 'Server',
					message: 'Welcome ' + socket.username
				}

				socket.emit('user added', JSON.stringify(data));


				socket.broadcast.emit('user joined', JSON.stringify({
					type: 'serverMessage',
					owner: 'Server',
					message: socket.username + ' has joined the room'
				}));

				// console.log(generalUsers);
			});

			socket.on('message', function(message) {
				message = JSON.parse(message);
				if (message.type == "userMessage") {
					socket.broadcast.emit('message', JSON.stringify(message));
					message.type = "myMessage";
					message.owner = "Me";
					socket.emit('message', JSON.stringify(message));
				}
			});

		});

	this.sessionChannel = io.of("/session_channel")
		.on("connection", function(socket) {

			console.log('a user from sessionChannel is connected');
			// var self = this;

			socket.on('add user', function(username) {

				// we store the username in the socket session for this client

				socket.username = username;
				var data = {
					type: 'severMessage',
					owner: 'Server',
					message: 'Welcome ' + username
				}

				socket.emit('user added', JSON.stringify(data));

			});

			socket.on('okay', function(session) {
				var username = socket.username;
				socket.join(session.name);
				var comSocket = self.sessionChannel.sockets[socket.id];
				comSocket.join(session.name);
				comSocket.session = session.name;
				// socket.emit('test', { 'test': 'ok' });
			});

			socket.on('join_session', function(session) {
				// console.log('on session joined', session);
				var username = socket.username;
				socket.join(session.name);
				var comSocket = self.sessionChannel.sockets[socket.id];
				comSocket.join(session.name);
				comSocket.session = session.name;
				socket.in(session.name).broadcast.emit('user joined', JSON.stringify({
					type: 'severMessage',
					owner: 'Server',
					message: username + ' has joined this programming session'
				}));
			});

			socket.on('message', function(message) {
				message = JSON.parse(message);

				if (message.type == "userMessage") {
					socket.in(socket.session).broadcast.emit('message', JSON.stringify(message));
					message.type = "myMessage";
					message.owner = "Me";
					socket.emit('message', JSON.stringify(message));
				}
			});

			socket.on('editorUpdate', function(code) {
				code = JSON.parse(code);

				if (code.type == "userCode") {
					socket.in(socket.session).broadcast.emit('editorUpdate', JSON.stringify(code));
				}
			});

		});

}