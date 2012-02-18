
var Entity = Class.extend({
	init: function (state, params) {
		this.state = state;
		this.messages = new Array();

		this.radius = 0;

		// params to override defaults
		if (params)
			for (var i in params)
				if (i.substring(0, 1) != '_')
					this[i] = params[i];
	},

	tick: function (input) {
		this.processMessages();
	},

	draw: function (ctx) {

	},

	send: function (msg) {
		this.messages.push(msg);
	},


	processMessages: function () {

		var msg = this.messages.shift();

		while (msg !== undefined) {
			this.processMessage(msg);
			msg = this.messages.shift();
		}

	},

	processMessage: function (msg) {

	}



});
