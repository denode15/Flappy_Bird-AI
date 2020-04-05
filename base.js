class Base {

	constructor() {
		this.speed = 3;
		this.width = 1400;
		this.height = 112;
		this.x = 0;
		this.y = 528;
	}

	show() {
		ctx.drawImage(baseImg, this.x, 528, base.width, base.height);
	}

	update() {
		this.x -= this.speed;
		if(this.x < -600) {
			this.x = 0;
		}
	}

	hits(birds) {
		for(let i = birds.length - 1; i >= 0; --i) {
			if(birds[i].y + birds[i].height > this.y) {
				birds.splice(i, 1);
			}
		}
	}
}