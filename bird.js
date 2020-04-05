function func(x) {
	if(random(1) < 0.1) {
		let offset = randomGaussian() * 0.5;
		let newx = x + offset;
		return newx;
	}
	else {
		return x;
	}
}

class Bird {

	constructor(newBrain) {
		this.x = 100;
		this.y = game.width / 2;
		this.velocity = 0;
		this.gravity = 0.9;
		this.lift = 24;
		this.width = 54;
		this.height = 40;
		this.speed = 0.2;
		this.index = 0;
		this.fitness = 0;
		this.scoreB = 0;
		this.fallRotation = 0;
		this.hitByPipe = false;
		if(newBrain instanceof NeuralNetwork) {
			this.brain = newBrain.copy();
			this.brain.mutate(func);
		}
		else {
			this.brain = new NeuralNetwork(5, 3, 1);
		}
	}

	show() {
		fill(51);
		let closestPipe;
		if(playYourself === false){
			closestPipe = this.closestPipe();
		}


		ctx.save();
		ctx.translate(this.x + 21, this.y + 28);
	    if (this.velocity < 6) {
	     // ctx.translate(this.x * 2, this.y * 2 -130);
	      ctx.rotate(-PI / 6);
	      this.fallRotation = -PI / 6;
	    }
	    else if(this.velocity <= 25) {
	    	this.fallRotation += PI / 70; 
	    	this.fallRotation = constrain(this.fallRotation, -PI / 6, PI / 2);
	    	ctx.rotate(this.fallRotation);
	    }
	    else {
	    	ctx.rotate(PI / 2);
	    }
	    ctx.drawImage(birdFrames[floor(this.index) % birdFrames.length], -this.height / 2, -this.width / 2, this.width, this.height);
	    ctx.restore();  


		//ctx.drawImage(birdFrames[floor(this.index) % birdFrames.length], this.x, this.y, this.width, this.height);
		//ctx.drawImage(birdFrames[0], this.x, this.y, this.width, this.height);
		this.index += this.speed;
		ctx.beginPath();
		if(show_the_vision === true && playYourself === false){
			ctx.rect(this.x + 10, this.y + 5, this.width - 25, this.height - 20);
			ctx.lineWidth = 2;
			ctx.strokeStyle = "red";
			if(closestPipe != null){
				ctx.moveTo(this.x + this.width, this.y + this.height / 2);
				ctx.lineTo(closestPipe.x, closestPipe.top);
				ctx.moveTo(this.x + this.width, this.y + this.height / 2);
				ctx.lineTo(closestPipe.x, closestPipe.bottom);
			}
			ctx.stroke();
		}
	}

	think() {
		let closestPipe = this.closestPipe();
		if(closestPipe != null){
			let inputs = [];
			inputs[0] = this.y;
			inputs[1] = abs(closestPipe.top - this.y);
			inputs[2] = abs(closestPipe.bottom - this.y);
			inputs[3] = abs(closestPipe.x - this.x);
			inputs[4] = this.velocity;
			let answer = this.brain.predict(inputs);
			if(answer > 0.5) 
				this.jump();
		}
	}

	update() {
		this.velocity += this.gravity;
		this.velocity *= 0.89;

		this.y += this.velocity;
		this.scoreB ++;
	}

	jump() {
		if(this.velocity > 0){
			this.velocity -= this.lift;
		}
	}

	closestPipe() {
		let record = Infinity;
		let closestPipe = null;
		for(let i = 0; i < pipes.length; ++i) {
			let head = this.x + this.width;
			let d = pipes[i].x - head;
			if(record > d && d > -pipes[i].width - this.width) {
				record = d;
				closestPipe = pipes[i];
			}
		}
		return closestPipe;
	}

	copy() {
		return new Bird(this.brain);
	}
}