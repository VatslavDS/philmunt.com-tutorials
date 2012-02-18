var Game = Class.extend({
	init: function (canvas, input) {
		this.canvas = canvas;
		this.input = input;
		this.states = new Object();

		this.width = canvas.width;
		this.height = canvas.height;
	},

	addState: function (name, state) {
		this.states[name] = state;
	},

	setState: function (name) {

		var game = this;
		var toState = name;
		var loader = new Loader();

		this.states['LOADING'].load();
		this.state = 'LOADING';

		this.states[toState].load(loader);

		loader.onComplete(function () {
			game.state = toState;
		});

		loader.start();
	},

	tick: function (input) {
		this.states[this.state].tick(input);
	},

	draw: function (ctx) {
		this.states[this.state].draw(ctx);
	},

	start: function (startState) {
 	  this._stop = false;
		var game = this;

		if (this.states['LOADING'] === undefined)
			throw "Loading State Required";

		game.setState(startState);

		(function draw() {
		 if (!game._stop) requestAnimationFrame(draw, game.canvas);
		 game.input.tick();
		 game.tick(game.input);
		 game.draw(game.canvas.getContext('2d'));
		 })();
	},

	stop: function () {
		this._stop = true;
	}

});
