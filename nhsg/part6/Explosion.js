var Explosion = Entity.extend({
	init: function (state, params) {
		this._super(state, params);			
		this.frame = 0;
		this.counter = 0;
		this.radius = 0;
	},


	tick: function (input) {
		this._super(input);

		if ((++this.counter % 4) == 0) this.frame++;
		if (this.frame > 15) this.state.send({type: 'DESTROY', entity: this});

	},

	draw: function (ctx) {
		ctx.drawImage(this.state.images['EXPLOSION'], 
									64*(this.frame%4),
								 	64*Math.floor(this.frame/4), 
									64, 64, this.x-32, this.y-32, 64, 64);
	}
});


