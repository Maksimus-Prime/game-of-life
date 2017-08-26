import * as $ from 'jquery';
import './jquery.tmpl.ts';
import './jquery.tmpl.js';

export default class View {
	model:  object;
	constructor (model: object) {
		this.model = model;
	}
	draw(board: any) {
		$.template('sample','<i class="cell" id="'+'x'+'${x}'+'y'+'${y}"></i>');
		let len: number = objectLength(board);
		for( let key in board ) {
		    $.tmpl('sample', board[key]).appendTo('#data');
		}

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