function Loader() {

	this.images = new Array();
	this.onCompleteCallback = function () { };	
	this.numLoaded = 0;

	this.add = function (path) {
		var loader = this;
		var img = new Image();

		img.onload = function () {
			loader.loaded();
		}

		this.images.push({img: img, path: path});

		return img;
	}

	this.onComplete = function (callback) {
		this.onCompleteCallback = callback;
	}

	this.loaded = function () {
		this.numLoaded++;

		if (this.images.length == this.numLoaded) {
			this.onCompleteCallback();
		}
	}

	this.start = function () {
		for (var i=0; i<this.images.length; i++)
			this.images[i].img.src = this.images[i].path;
	}

	return this;
}
