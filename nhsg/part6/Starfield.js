var Starfield = Entity.extend({
	init: function (state, params) {

		this.width = state.game.width;
		this.height = state.game.height;

		// Defaults
		this.numStars = 70;
		this.velocities = new Array(1,2,4);
		this.colours = new Array('#777', '#bbb', '#fff');
		this.stars = new Array();

		this._super(state, params);

		for (var i=0; i<this.numStars; i++) { 
			var x = Math.floor(Math.random()*this.width);
			var y = Math.floor(Math.random()*this.height);
			var vel = Math.floor(Math.random()*3);

			this.stars.push({x: x, y: y, vel: vel});
		}   
	},

	tick: function (input) {
		this._super(input);

		for (var i=0; i<this.stars.length; i++) {
			this.stars[i].y += this.velocities[this.stars[i].vel];

			if (this.stars[i].y >= this.height) {
				this.stars[i].y = 0;
				this.stars[i].x = Math.floor(Math.random()*this.width);
			}
		}	
	},

	draw: function (ctx) {
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0, 0, this.width, this.height);

		for (i=0; i<this.stars.length; i++) {
			ctx.fillStyle = this.colours[this.stars[i].vel];
			ctx.fillRect(this.x+this.stars[i].x, 
									 this.y+this.stars[i].y, 1, 1);
		}
	}
});


