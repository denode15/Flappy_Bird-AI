let background;
let baseImg;
let base;
let ctx;

//Score
let score = 0;
let bestScore = 0;

//Variables 
let playYourself = false;
let gen = 0;
let totalPopulation = 100;
let allBirds = [];
let activeBirds = [];
let pipes = [];
let pipe_bottom, pipe_top;

// Play Yourself
let player = [];
let pipesPlayer = [];
let baseP;
let scoreP = 0;
let bestScoreP = 0;

//Vision
let vision_button;
let show_the_vision = false;

// Play
let play_button;

//Frames for the bird
let birdFrames;

//Slider
let speedPar;
let slider;

// Counter
let counter = 1;
let counterP = 1;

function setup() {
	noCanvas();
	game = document.getElementById("game");
	ctx = game.getContext('2d');
	//Images
	background = document.getElementById("back");
	pipe_top = document.getElementById("pipe_top");
	pipe_bottom = document.getElementById("pipe_bottom");
	let birdFrame1 = document.getElementById("birdFrame1");
	let birdFrame2 = document.getElementById("birdFrame2");
	let birdFrame3 = document.getElementById("birdFrame3");
	baseImg = document.getElementById("base");
	base = new Base();
	baseP = new Base();
	playerB = new Bird();
	player.push(playerB);
	birdFrames = [birdFrame1, birdFrame2, birdFrame3];

	slider = createSlider(0.1, 10.1, 0.1);
	slider.parent("parent");
	slider.addClass("slider_value");

	vision_button = createButton("Show");
	vision_button.parent("parent");
	vision_button.addClass("vision_button");

	play_button = createButton("Play");
	play_button.parent("parent");
	play_button.addClass("play_button");

	train_button = createButton("Training");
	train_button.parent("parent");
	train_button.addClass("train_button");
	train_button.style('display', 'none');

	speedPar = document.getElementById("speedPar");

	// Birds
	for(let i = 0; i < totalPopulation; ++i) {
		let bird = new Bird();
		allBirds.push(bird);
		activeBirds.push(bird);
	}

	// Pipes
	let pipe = new Pipe();
	pipes.push(pipe);
}

function draw() {
	frameRate(60);
	for(let k = 0; k < slider.value(); ++k){
		if(counter % 120 == 0) {
			let pipe = new Pipe();
			pipes.push(pipe);
		}
		for(let i = pipes.length - 1; i >= 0; --i) {
			pipes[i].hits(activeBirds);
			if(pipes[i].x <= -pipes[i].width)
				pipes.splice(i, 1);

			pipes[i].update();
		}


		for(let i = 0; i < activeBirds.length; ++i) {
			activeBirds[i].think();
			activeBirds[i].update();
		}
		base.update();
		base.hits(activeBirds);
		pipes[0].behindTheBird(activeBirds, 1);
		vision_button.mousePressed(showVision);
		play_button.mousePressed(playYourselfFunc);
		++counter;
	}

	if(playYourself === true) {
		ctx.drawImage(background, 0, 0, 480, 640);
		if(counterP % 120 == 0) {
			let pipe = new Pipe();
			pipesPlayer.push(pipe);
		}
		for(let i = pipesPlayer.length - 1; i >= 0; --i) {
			pipesPlayer[i].hits(player);
			if(pipesPlayer[i].x <= -pipesPlayer[i].width)
				pipesPlayer.splice(i, 1);

			pipesPlayer[i].update();
			pipesPlayer[i].show();
		}
		if(player.length === 0) {
			if(scoreP > bestScoreP) {
				bestScoreP = scoreP;
			}
			scoreP = 0;
			resetGameForPlayer();
		}
		player[0].show();
		player[0].update();
		baseP.show();
		baseP.update();
		baseP.hits(player);
		if(pipesPlayer.length > 0)
			pipesPlayer[0].behindTheBird(player, 2);
		++counterP;

		ctx.fillStyle = "white";
		ctx.strokeStyle = "black"; 
		ctx.lineWidth = 1;
		ctx.font = "48px 'Yanone Kaffeesatz', sans-serif";
		ctx.fillText(scoreP, game.width / 2 - 10, 120); 
		ctx.strokeText(scoreP, game.width / 2 - 10, 120);
		ctx.font = "32px 'Yanone Kaffeesatz', sans-serif";
		ctx.fillText("Best score: " + bestScoreP, 10, 34); 
		ctx.strokeText("Best score: " + bestScoreP, 10, 34);
		train_button.mousePressed(playYourselfFunc);
	}
	else {
	//DRAWING ----------------------------------------
		ctx.drawImage(background, 0, 0, 480, 640);
		for(let i = pipes.length - 1; i >= 0; --i) {
			pipes[i].show();
		}
		for(let i = 0; i < activeBirds.length; ++i) {
			activeBirds[i].show();
		}
		base.show();
		ctx.fillStyle = "white";
		ctx.strokeStyle = "black"; 
		ctx.lineWidth = 1;
		ctx.font = "48px 'Yanone Kaffeesatz', sans-serif";
		ctx.fillText(score, game.width / 2 - 10, 120); 
		ctx.strokeText(score, game.width / 2 - 10, 120);
		ctx.font = "32px 'Yanone Kaffeesatz', sans-serif";
		ctx.fillText("Best score: " + bestScore, 10, 34); 
		ctx.strokeText("Best score: " + bestScore, 10, 34);
		ctx.fillText("Gen: " + gen, 10, 64); 
		ctx.strokeText("Gen: " + gen, 10, 64);
		//--------------------------------------------------
	}
	if(activeBirds.length == 0) {
		if(score > bestScore)
			bestScore = score;
		nextGeneration();
		gen++;
	}

	speedPar.innerHTML = "Speed: " + slider.value();
}

document.addEventListener("keypress", key => {
	if(key.code === "Space" && playYourself === true) {
		if(player.length > 0)
			player[0].jump();
	}
});

function showVision() {
	if(show_the_vision === false)
		show_the_vision = true;
	else
		show_the_vision = false;
}

function playYourselfFunc() {
	if(playYourself === false) {
		playYourself = true;
		vision_button.style('display', 'none');
		slider.style('display', 'none');
		train_button.style('display', 'block');
		play_button.style('display', 'none');
		speedPar.style.display = "none";
	}
	else {
		vision_button.style('display', 'block');
		slider.style('display', 'block');
		playYourself = false;
		train_button.style('display', 'none');
		play_button.style('display', 'block');
		speedPar.style.display = "block";
	}
}