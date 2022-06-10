const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];

const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };
const points = { R: 0, B: 0 };

const playersTurnText = (turn) =>
	`It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) =>
	line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName(
		"game-grid-container"
	)[0];

	const rows = Array(N)
		.fill(0)
		.map((_, i) => i);
	const cols = Array(M)
		.fill(0)
		.map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement("div");
			dot.setAttribute("class", "dot");

			const hLine = document.createElement("div");
			hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute("id", `h-${row}-${col}`);
			hLine.addEventListener("click", handleLineClick);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement("div");
				vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute("id", `v-${row}-${col}`);
				vLine.addEventListener("click", handleLineClick);

				const box = document.createElement("div");
				box.setAttribute("class", "box");
				box.setAttribute("id", `box-${row}-${col}`);

				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	turnManager(turn);
};

const changeTurn = () => {
	const nextTurn = turn === "R" ? "B" : "R";

	const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

	lines.forEach((l) => {
		//if line was not already selected, change it's hover color according to the next turn
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
	turnManager(turn);
};

const handleLineClick = (e) => {
	const lineId = e.target.id;

	const selectedLine = document.getElementById(lineId);

	if (isLineSelected(selectedLine)) {
		//if line was already selected, return
		return;
	}

	selectedLines = [...selectedLines, lineId];

	colorLine(selectedLine);
	let changeTurnCondition = checkFullSquare(e);
	if (!checkEnd() && !changeTurnCondition)
		changeTurn();
	if (checkEnd()) {
		showRes();
	}
};

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};

const turnManager = (t) => {
	document.getElementById("game-status").innerHTML = playersTurnText(t);
}

const checkFullSquare = (e) => {
	let condition = false;
	const lineId = e.target.id;
	let colum = parseInt(lineId[2]);
	let row = parseInt(lineId[4]);

	if (lineId[0] === 'v') {

		if (Object.values(selectedLines).includes(`v-${colum}-${row + 1}`)) {
			if (Object.values(selectedLines).includes(`h-${colum}-${row}`) && Object.values(selectedLines).includes(`h-${colum + 1}-${row}`)) {
				paintSquar(colum, row);
				increasePoint();
				condition = true;
			}

		}
		if (Object.values(selectedLines).includes(`v-${colum}-${row - 1}`)) {
			if (Object.values(selectedLines).includes(`h-${colum}-${row - 1}`) && Object.values(selectedLines).includes(`h-${colum + 1}-${row - 1}`)) {
				paintSquar(colum, row - 1);
				increasePoint();
				condition = true;
			}
		}
	}
	else {
		if (Object.values(selectedLines).includes(`h-${colum + 1}-${row}`)) {
			if (Object.values(selectedLines).includes(`v-${colum}-${row}`) && Object.values(selectedLines).includes(`v-${colum}-${row + 1}`)) {
				paintSquar(colum, row);
				increasePoint();
				condition = true;
			}

		}
		if (Object.values(selectedLines).includes(`h-${colum - 1}-${row}`)) {
			if (Object.values(selectedLines).includes(`v-${colum - 1}-${row}`) && Object.values(selectedLines).includes(`v-${colum - 1}-${row + 1}`)) {
				paintSquar(colum - 1, row);
				increasePoint();
				condition = true;
			}
		}
	}
	return condition;
}

const paintSquar = (r, c) => {
	const target = document.getElementById(`box-${r}-${c}`);
	target.classList.add(bgClasses[turn]);
}

const increasePoint = () => {
	if (turn === 'R') {
		points['R']++;
	}
	else {
		points['B']++;
	}
}

const checkEnd = () => {
	var count = 0;
	for (var prop in selectedLines) {
		if (selectedLines.hasOwnProperty(prop)) {
			count++;
		}
	}
	if (count == 24)
		return true;
	else
		return false;
}

const showRes = () => {
	let res = document.getElementById("game-status");

	if (points['R'] > points['B'])
		res.innerHTML = "Red won";
	else if (points['R'] < points['B'])
		res.innerHTML = "Blue won";
	else
		res.innerHTML = "equal!";
}








createGameGrid();
