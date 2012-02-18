var Enemy = Entity.extend({
	init: function (state, params) {
		this._super(state, params);

		this.width = 50;
		this.height = 50;
		this.radius = 32;
	},

	tick: function (input) {
		this._super();
		this.y++;

		if (this.y>(this.state.game.height+32))
				this.state.send({type: 'DESTROY', entity: this});		
	},

	draw: function (ctx) {
		ctx.drawImage(this.state.images['ENEMY1'], this.x-32, this.y-32);
	},


	processMessage: function (msg) {

			switch (msg.type) {
				case 'COLLISION':

					if (!(msg.entity instanceof Enemy)) { 
						this.state.send({type: 'DESTROY', entity: this});
						this.state.send({type: 'ADD', entity: new Explosion(this.state, {x: this.x, y:this.y})});
					}
					break;

				default:
					this._super(msg);
			}

	}

});
