var crypto = require('crypto');

// Game Object Initializer
exports.Game = function (game_id, socket) {

	this.game_id = game_id;

	this.board = new Array(0,0,0,0,0,0,0,0,0);
	this.player1 = socket;
	this.player2 = undefined;

	this.p1_turn = true;

	return this;
}


// Check all possible winning combinations
exports.isWon = function (b) {
	
	// Across
	if ((b[0] == b[1] && b[1] == b[2]) && b[0])
		return b[0];

	if ((b[3] == b[4] && b[4] == b[5]) && b[3])
		return b[3];

	if ((b[6] == b[7] && b[7] == b[8]) && b[6])
		return b[6];

	// Down
	if ((b[0] == b[3] && b[3] == b[6]) && b[0])
		return b[0];

	if ((b[1] == b[4] && b[4] == b[7]) && b[1])
		return b[1];

	if ((b[2] == b[5] && b[5] == b[8]) && b[2])
		return b[2];

	// Diagonal

	if ((b[0] == b[4] && b[4] == b[8]) && b[0])
		return b[0];

	if ((b[6] == b[4] && b[4] == b[2]) && b[6])
		return b[6];

	return 0;

}

// Check if the board is full
exports.isFull = function (b) {

	for (var i=0; i<b.length; i++)
		if (b[i] == 0)
			return false;

	return true;
}

// Create a new game object and add it to the games object
exports.createGame = function (games, socket, hash) {

	var new_game_id = hash;

	if (new_game_id == null) {
		var u = 'uoasodf8a7yf8a89h89awrh'+(new Date()).getTime();
		new_game_id = crypto.createHash('md5').update(u).digest("hex");	
	}

	games[new_game_id] = new exports.Game(new_game_id, socket);

	socket.emit('gameCreated', { game_id: new_game_id });
}


// Assign to a game and start it if a game is available
exports.requestGame = function (games, socket) {

	for (var i in games)
		if (games[i].player2 === undefined)
		{
			games[i].player2 = socket;
			games[i].player1.emit('gameStart', 
					      { game_id: games[i].game_id,
									turn: games[i].p1_turn });

			games[i].player2.emit('gameStart',
				              { game_id: games[i].game_id, 
												turn: !games[i].p1_turn });

			return;
		}

	socket.emit('noFreeGames');
}

// Send a move to the relevant game
exports.dispatchMove = function (games, socket, data, handler) {

	var game = games[data.game_id];

	if (game === undefined) {
		socket.emit('error', { description: 'Invalid game ID'});
		return;
	}

	if (handler == null)
		handler = exports.move;

	if (handler(game, socket, data))
		delete games[data.game_id];
}

// Validate and execute a move
exports.move = function (game, socket, data) {
	
	var square = data.square;

	if (game.player1 === socket && !game.p1_turn) {
		socket.emit('error', { description: 'Not your turn'});
		return false;
	}

	if (game.player2 === socket && game.p1_turn) {
		socket.emit('error', { description: 'Not your turn'});
		return false;
	}

	if (game.board[square] != 0 || square < 0 || square > 8) {
		socket.emit('error', { description: 'Invalid square selection'});
		return false;
	}

	if (game.p1_turn)
		game.board[square] = 1;
	else
		game.board[square] = 2;

	data.sign = game.board[square];

	game.p1_turn = !game.p1_turn;

	game.player1.emit('move', data);
	game.player2.emit('move', data);

	var winner = exports.isWon(game.board);

	if (winner || exports.isFull(game.board)) {
		game.player1.emit('gameOver', { winner: winner });
		game.player2.emit('gameOver', { winner: winner });
		return true;
	}

	return false;
}
