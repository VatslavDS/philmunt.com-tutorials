var Ship = Entity.extend({
	init: function (state, params) {
		this._super(state, params);
		this.fireDelay = 46;
		this.radius = 32;
	},
	tick: function (input) {
		this._super(input);

		if (input != null) {
			if (input.isDown(74)) this.y += 5;
			if (input.isDown(75)) this.y -= 5;
			if (input.isDown(76)) this.x += 5;
			if (input.isDown(72)) this.x -= 5;

			if (input.isDown(68)) {
				if (this.fireDelay > 30) {
					this.fireDelay = 0;

					this.state.send({type: 'ADD', entity: new Bullet(this.state, {x: this.x, y: this.y-32})});
				}	
			}
		}	

		this.fireDelay++;
	},

	draw: function (ctx) {
		ctx.drawImage(this.state.images['SHIP'], this.x-32, this.y-32);
	}
});


