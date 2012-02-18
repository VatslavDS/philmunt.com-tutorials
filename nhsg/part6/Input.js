var Input = Class.extend({
	init: function () {
		var input = this;
		this._pressed = {};

		window.addEventListener('keyup', function (event) {
			delete input._pressed[event.keyCode];
		}, false);

		window.addEventListener('keydown', function (event) {
			if (input._pressed[event.keyCode] === undefined)
				input._pressed[event.keyCode] = 1;		
		}, false);
	},

	isDown: function (keyCode) {
		if (this._pressed[keyCode] === undefined)
			return 0;

		return this._pressed[keyCode];

	},

	tick: function () {
		for (var i in this._pressed) {
			this._pressed[i]++;
		}
	}

});


