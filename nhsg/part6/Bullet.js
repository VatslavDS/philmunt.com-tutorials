var Bullet = Entity.extend({
	init: function (state, params) {
		this._super(state, params);

		this.radius = 1;
	},


	tick: function (input) {
		this._super(input);

		this.y -= 5;
		if (this.y < 0) this.state.send({type: 'DESTROY', entity: this});

	},

	draw: function (ctx) {
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillRect(this.x-2, this.y, 4, 4);
	},


	processMessage: function (msg) {

			switch (msg.type) {
				case 'COLLISION':
					this.state.send({type: 'DESTROY', entity: this});
					break;

				default:
					this._super(msg);
			}

	}


});


