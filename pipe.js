class Pipe {
	constructor() {
		this.x = game.width;
		this.space = 150;
		this.speed = 3;
		this.top = random(30, game.height - this.space - base.height);
		this.bottom = this.top + this.space;
		this.width = 80;
		this.height = 640;
		this.behind = false;
	}

	show() {
		ctx.drawImage(pipe_top, this.x, -(game.height - this.top), this.width, this.height);
		ctx.drawImage(pipe_bottom, this.x, this.bottom, this.width, this.height);
		if(show_the_vision === true && playYourself === false){
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "red";
			//console.log(this.x, this.width, this.y);
			ctx.strokeRect(this.x, 0, this.width, this.top);
			ctx.strokeRect(this.x, this.bottom, this.width, game.height);
			ctx.stroke();
		}
	}

	update() {
		this.x -= this.speed;
	}

	hits(birds) {
		for(let i = birds.length - 1; i >= 0; --i) {
			if(birds[i].x + birds[i].width - 15 >= this.x && birds[i].x + 10 <= this.x + this.width) {
				if(birds[i].y + 5 <= this.top || birds[i].y + birds[i].height - 15 >= this.bottom) {
					birds.splice(i, 1);
				}
			}
		}
	}

	behindTheBird(birds, val) {
		if(birds.length > 0){
			if(this.behind === false){
				if(birds[0].x + birds[0].width > this.x + this.width) {
					if(val == 1)
						score++;
					else if(val == 2) {
						scoreP++;
					}
					this.behind = true;
				}
			}
		}
	}
}
