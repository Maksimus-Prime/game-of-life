import * as $ from 'jquery';
import './../jquery.tmpl.ts';
import './../jquery.tmpl.js';

export default class View {
	model:  any;
	startButton: any;
	pauseButton: any;
	restartButton: any;
	widthInput: any;
	heigthInput: any;
	cell: any;
	constructor (model: any) {
		this.model = model;
		this.startButton = $('#startButton');
		this.pauseButton = $('#pauseButton');
		this.restartButton = $('#restartButton');
		this.widthInput = $('#widthInput');
		this.heigthInput = $('#heightInput');
	}
	draw() {
		$('#data').html('');
		$.template('sample','<i class="cell" id="'+'x'+'${x}'+'y'+'${y}"></i>');
		$.template('sampleDead','<i class="cell dead" id="'+'x'+'${x}'+'y'+'${y}"></i>');
		let len: number = objectLength(this.model.board);
		for( let key in this.model.board ) {
			if (this.model.board[key]["alive"]) {
				$.tmpl('sample', this.model.board[key]).appendTo('#data');
			} else {
				$.tmpl('sampleDead', this.model.board[key]).appendTo('#data');
			}
		}
		$('#data').attr('style','width: '+(this.model.width * 20)+'px');
	}
	toggleCellClass(that) {
		that.toggleClass('dead');
		let key:any = that.attr('id');
		this.model.editLifeState(key);
	}
}

function objectLength( object: any):number {
	let length: number = 0;
	for( let key in object ) {
	    if( object.hasOwnProperty(key) ) {
	        ++length;
	    }
	}
	return length;
}