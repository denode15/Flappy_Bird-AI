function calculateFitness() {

	for(let i = 0; i < allBirds.length; ++i) {
		allBirds[i].scoreB = pow(allBirds[i].scoreB, 2);
	}

	let sum = 0;
	for(let i = 0; i < allBirds.length; ++i) {
		sum += allBirds[i].scoreB;
	}

	for(let i = 0; i < allBirds.length; ++i) {
		allBirds[i].fitness = allBirds[i].scoreB / sum;
	}
}

function resetGame() {
	pipes = [];
	counter = 1;
	score = 0;
	let pipe = new Pipe();
	pipes.push(pipe);
}

function resetGameForPlayer() {
	pipesPlayer = [];
	counterP = 1;
	scoreP = 0;
	let pipe = new Pipe();
	pipesPlayer.push(pipe);
	player[0] = new Bird();
}

function nextGeneration() {

	resetGame();
	calculateFitness();
	activeBirds = generate(allBirds);
	allBirds = activeBirds.slice();
}

function generate(oldBirds) {

	let newBirds = [];
	for(let i = 0; i < oldBirds.length; ++i) {
		let bird = poolSelection(oldBirds);
		newBirds.push(bird);
		//console.log(newBirds);
	}
	return newBirds;
}

function poolSelection(birds) {

	let index = 0;
	let r = random(1);
	while(r > 0) {
		r -= birds[index].fitness;
		index++;
	}
	index--;

	return birds[index].copy();
}