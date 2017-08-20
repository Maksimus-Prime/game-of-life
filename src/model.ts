interface Board {
	board: object;
	width: number;
	height: number;
	boardInit(): any;
	getBoard(): object;
}

interface Cell {
	x: number;
	y: number;
	alive: boolean;
}

export default class Model {
	board: object;
	width: number;
	height: number;
	constructor (width: number, height: number) {
		this.board = {};
		this.width = width;
		this.height = height;
	}
	boardInit ():any {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				this.board[getCellRepresentation(i, j)] = {x: i, y: j, alive: true};
			}
		}
		return;
	}
	getBoard () {
		console.log(this.board);
	}
}

function getCellRepresentation(x: number, y: number):string {
	return 'x' + x + 'y' + y;
}