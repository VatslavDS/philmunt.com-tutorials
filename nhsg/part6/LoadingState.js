var LoadingState = State.extend({
	load: function (loader) {
		this.width = this.game.width;
		this.height = this.game.height;
		counter = 0;
	},

	tick: function (input) {
		if (++counter > 200) counter = 0;
	},

	draw: function (ctx) {

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, this.width, this.height);

		ctx.font = "28pt Arial";
		ctx.fillStyle = "white";
		var metrics = ctx.measureText("Loading");
		ctx.fillText("Loading", (this.width-metrics.width)/2, this.height/2);

		if (counter > 40) ctx.fillRect(274+0, 280, 20, 10);			
		if (counter > 80) ctx.fillRect(274+24, 280, 20, 10);			
		if (counter > 120) ctx.fillRect(274+48, 280, 20, 10);			
		if (counter > 160) ctx.fillRect(274+72, 280, 20, 10);			
	}
});
