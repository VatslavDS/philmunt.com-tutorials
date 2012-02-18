var PlayState = State.extend({
	load: function (loader) {
		this.images = new Object();
		this.images['SHIP'] = loader.add('img/ships/player0-64.png');
		this.images['ENEMY1'] = loader.add('img/ships/1-64.png');
		this.images['EXPLOSION'] = loader.add('img/explosion.png');
		this.send({type: 'ADD', entity: new Starfield(this, {x:0, y:0})});
		this.send({type: 'ADD', entity: new Ship(this, {x: 320, y:480})});
	},

	tick: function (input) {
		this._super(input);

		if (Math.random() < 0.01)
				this.send({type: 'ADD', entity: new Enemy(this, { x: Math.floor(Math.random()*(this.game.width-64))+32, y: -32 })});
						
	}

});
