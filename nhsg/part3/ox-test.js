var OX = require('./ox');
var nodemock = require('nodemock');

exports.testWinningCombos = function (test) {
	
	for (var i=1; i<=2; i++) {

	test.equal(OX.isWon(new Array(i,i,i, 0,0,0, 0,0,0)), i);
	test.equal(OX.isWon(new Array(0,0,0, i,i,i, 0,0,0)), i);
	test.equal(OX.isWon(new Array(0,0,0, 0,0,0, i,i,i)), i);
	
	test.equal(OX.isWon(new Array(i,0,0, i,0,0, i,0,0)), i);
	test.equal(OX.isWon(new Array(0,i,0, 0,i,0, 0,i,0)), i);
	test.equal(OX.isWon(new Array(0,0,i, 0,0,i, 0,0,i)), i);

	test.equal(OX.isWon(new Array(i,0,0, 0,i,0, 0,0,i)), i);
	test.equal(OX.isWon(new Array(0,0,i, 0,i,0, i,0,0)), i);
	}

	test.done();
}

exports.testNonWinningCombos = function (test) {

	test.equal(OX.isWon(new Array(0,0,0, 0,0,0, 0,0,0)), 0);
	test.equal(OX.isWon(new Array(0,1,0, 0,2,0, 1,2,0)), 0);
	test.equal(OX.isWon(new Array(0,0,0, 0,0,1, 0,2,1)), 0);

	test.done();
}

exports.testFullBoard = function (test) {

	test.ok(OX.isFull(new Array(1,2,1,2,2,2,1,1,2)));
	test.done();
}

exports.testNotFullBoard = function (test) {
	test.equal(OX.isFull(new Array(1,2,0,2,2,2,1,1,2)), false);
	test.done();
}

exports.testCreateGame = function (test) {

	var games = new Object();
	var socket = nodemock.mock('emit').takes('gameCreated', { game_id: 'GAME_ID' });

	OX.createGame(games, socket, 'GAME_ID');

	test.ok(games['GAME_ID'] instanceof OX.Game);

	socket.assert();
	test.done();
}

exports.testRequestGameNoGames = function (test) {

	var socket = nodemock.mock('emit').takes('noFreeGames');
	OX.requestGame(new Object(), socket);
	socket.assert();
	test.done();
	
}

exports.testRequestGame = function (test) {
	
	var games = Object();;
	
	var player1 = nodemock.mock('emit').takes('gameCreated', {game_id: 'GAME_ID'});
	player1.mock('emit').takes('gameStart', {game_id: 'GAME_ID', turn: true});
	
	var socket = nodemock.mock('emit').takes('gameStart', {game_id: 'GAME_ID', turn: false});

	OX.createGame(games, player1, 'GAME_ID');

	OX.requestGame(games, socket);
	player1.assert();
	socket.assert();
	test.done();
}

exports.testInvalidMoveNotTurn = function (test) {
	var game = new OX.Game();
	game.player1 = nodemock.mock('emit').takes('error', {description: 'Not your turn'});
	game.player2 = new Object();
	game.p1_turn = false;


	OX.move(game, game.player1, {});

	game.player1.assert();
	test.done();
}

exports.testInvalidMoveNotTurn2 = function (test) {
	var game = new OX.Game();
	game.player2 = nodemock.mock('emit').takes('error', {description: 'Not your turn'});
	game.player1 = new Object();
	game.p1_turn = true;

	OX.move(game, game.player2, {});

	game.player2.assert();
	test.done();
}

exports.testInvalidMoveSquareFull = function (test) {
	var game = new OX.Game();
	game.player1 = nodemock.mock('emit').takes('error', {description: 'Invalid square selection'});
	game.player2 = new Object();
	game.p1_turn = true;
	game.board[0] = 1;

	OX.move(game, game.player1, {square: 0});

	game.player1.assert();
	test.done();
}


exports.testValidMoveP1 = function (test) {
	
	var data = {square: 0};
	
	var game = new OX.Game();
	game.player1 = nodemock.mock('emit').takes('move', data);
	game.player2 = nodemock.mock('emit').takes('move', data);
	game.p1_turn = true;

	test.equal(OX.move(game, game.player1, data), false);

	test.equal(game.board[0], 1);
	test.equal(game.p1_turn, false)

	game.player1.assert();
	game.player2.assert();
	test.done();
}

exports.testValidMoveP2 = function (test) {
	
	var data = {square: 0};
	
	var game = new OX.Game();
	game.player1 = nodemock.mock('emit').takes('move', data);
	game.player2 = nodemock.mock('emit').takes('move', data);
	game.p1_turn = false;

	test.equal(OX.move(game, game.player2, data), false);

	test.equal(game.board[0], 2);
	test.equal(game.p1_turn, true);

	game.player1.assert();
	game.player2.assert();
	test.done();
}


exports.testWinner = function (test) {
	
	var data = {square: 0};
	
	var game = new OX.Game();
	game.player1 = nodemock.mock('emit').takes('move', data);
	game.player2 = nodemock.mock('emit').takes('move', data);
	
	game.player1.mock('emit').takes('gameOver', {winner: 1});
	game.player2.mock('emit').takes('gameOver', {winner: 1});
	
	game.p1_turn = true;
	game.board[1] = 1;
	game.board[2] = 1;

	test.ok(OX.move(game, game.player1, data));

	test.equal(game.board[0], 1);
	test.equal(game.p1_turn, false)

	game.player1.assert();
	game.player2.assert();
	test.done();
}


exports.testDraw = function (test) {
	
	var data = {square: 0};
	
	var game = new OX.Game();
	game.player1 = nodemock.mock('emit').takes('move', data);
	game.player2 = nodemock.mock('emit').takes('move', data);
	
	game.player1.mock('emit').takes('gameOver', {winner: 0});
	game.player2.mock('emit').takes('gameOver', {winner: 0});
	
	game.p1_turn = true;
	game.board = new Array(0,2,3, 4,5,6, 7,8,9);

	test.ok(OX.move(game, game.player1, data));

	test.equal(game.board[0], 1);
	test.equal(game.p1_turn, false)

	game.player1.assert();
	game.player2.assert();
	test.done();
}

exports.testDispatchUndefined = function (test) {

	var games = new Object();
	var socket = nodemock.mock('emit').takes('error', {description: 'Invalid game ID'});
	var data = ({game_id:'NOT_THERE'});

	OX.dispatchMove(games, socket, data);

	socket.assert();
	test.done();
}

exports.testDispatchRunHandler = function (test) {

	var games = new Object();
	games['GAME_ID'] = new OX.Game();

	var data = ({game_id: 'GAME_ID'});
	var socket = new Object();

	test.expect(2);

	var handler = function () { test.ok(true); return false; };

	OX.dispatchMove(games, socket, data, handler);

	test.notEqual(games['GAME_ID'], undefined);

	test.done();
}

exports.testDispatchRunHandlerDeleteGame = function (test) {

	var games = new Object();
	games['GAME_ID'] = new OX.Game();

	var data = ({game_id: 'GAME_ID'});
	var socket = new Object();

	test.expect(2);

	var handler = function () { test.ok(true); return true; };

	OX.dispatchMove(games, socket, data, handler);

	test.equal(games['GAME_ID'], undefined);

	test.done();
}
