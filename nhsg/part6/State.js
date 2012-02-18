
var State = Entity.extend({
	init: function (game) {
		this.game = game;
		this.entities = new Array();
		this._super();
	},

	load: function (loader) {

	},

	tick: function (input) {
		this._super();

		for (var i=0; i<this.entities.length; i++) {
				this.entities[i].tick(input);
		}

		this.processCollisions();
	},

	draw: function (ctx) {
		for (var i=0; i<this.entities.length; i++) { 
			this.entities[i].draw(ctx);
		}
	},

	processMessage: function (msg) {

			switch (msg.type) {
				case 'ADD':
					this.entities.push(msg.entity);
					break;

				case 'DESTROY':
					for (var i=0; i<this.entities.length; i++)
						if (this.entities[i] === msg.entity)
							this.entities.splice(i, 1);

					break;

				default:
					this._super(msg);
			}

	},

	processCollisions: function () {

		for (var i=0; i<this.entities.length; i++)
			for (var j=i+1; j<this.entities.length; j++)
				if (this.entities[i].radius && this.entities[j].radius) {
					var x = this.entities[i].x - this.entities[j].x;
					var y = this.entities[i].y - this.entities[j].y;

					var distance = Math.sqrt(x*x + y*y);

					if (distance < (this.entities[i].radius + this.entities[j].radius)) {
						this.entities[i].send({type: 'COLLISION', entity: this.entities[j]});	
						this.entities[j].send({type: 'COLLISION', entity: this.entities[i]});	
					}
				}
	}
});
