import {} from 'mocha';
import * as chai from 'chai';
let expect = chai.expect;
import Model from './../src/mvc/model';
import View from './../src/mvc/view';
import Controller from './../src/mvc/controller';

let model: Model;
let width: number = 3;
let height: number = 3;
let view: View;
let controller: Controller;
model = new Model(width, height);
view = new View(view);
controller = new Controller(model, view);

describe('model', () => {
	it('model should be an object', () => {
		expect(model).to.be.an('object');
	});
	describe('model.boardInit', () => {
		it('model.boardInit should be a function', () => {
			expect(model.boardInit).to.be.an('function');
		});
		it('model.boardInit should fill model.board with objects', () => {
			model.boardInit();
			expect(model.board["x1y1"]).to.be.an('object');
		});
		it(`length of model.board should equal to ${width}*${height}`, () => {
			model.boardInit();
			let result = objectLength(model.board);
			
			expect(result).to.eql(width*height);
		});
	});
	describe('model.getAliveNeighbors', () => {
		it('model.getAliveNeighbors should be a function', () => {
			expect(model.getAliveNeighbors).to.be.an('function');
		});
		it('return 0 if there are no alive cells', () => {
			for( let key in model.board ) {
			    if( model.board[key] !== model.board["x1y1"] ) {
			        model.board[key]["alive"] = false;
			    }
			}
			expect(model.getAliveNeighbors("x1y1")).to.eql(0);
		});
		it('return 8 if there are eight dead neighbours', () => {
			model.boardInit();
			let neighbours: number = model.getAliveNeighbors("x1y1");
			expect(neighbours).to.eql(0);
		});
		it('return 3 if there are three alive neighbours', () => {
			model.boardInit();
			model.board["x0y0"]["alive"] = true;
			model.board["x1y0"]["alive"] = true;
			model.board["x2y1"]["alive"] = true;
			let neighbours: number = model.getAliveNeighbors("x1y1");
			expect(neighbours).to.eql(3);
		});
	});
	describe('calculateNextState', () => {
		it('model.calculateNextState should be a function', () => {
			expect(model.calculateNextState).to.be.an('function');
		});
		it('dies if there are less than 2 living neighbors', () => {
			model.board["x0y0"]["alive"] = false;
			model.board["x1y0"]["alive"] = false;
			model.board["x2y1"]["alive"] = true;
			let neighbours: number = model.getAliveNeighbors("x1y1");
			expect(neighbours).to.eql(1);
			let result: object = model.calculateNextState('x1y1');
			expect(result["alive"]).to.eql(false);
		});
		it('live if there are 2 living neighbors', () => {
			model.board["x1y1"]["alive"] = true;
			model.board["x0y0"]["alive"] = false;
			model.board["x1y0"]["alive"] = true;
			model.board["x2y1"]["alive"] = true;
			let neighbours: number = model.getAliveNeighbors("x1y1");
			expect(neighbours).to.eql(2);
			let result: object = model.calculateNextState('x1y1');
			expect(result["alive"]).to.eql(true);
		});
		it('live if there are 3 living neighbors', () => {
			model.board["x1y1"]["alive"] = true;
			model.board["x0y0"]["alive"] = true;
			model.board["x1y0"]["alive"] = true;
			model.board["x2y1"]["alive"] = true;
			let neighbours: number = model.getAliveNeighbors("x1y1");
			expect(neighbours).to.eql(3);
			let result: object = model.calculateNextState('x1y1');
			expect(result["alive"]).to.eql(true);
		});
		it('dies if there are more than 3 living neighbors', () => {
			model.board["x1y1"]["alive"] = true;
			model.board["x0y0"]["alive"] = true;
			model.board["x1y0"]["alive"] = true;
			model.board["x2y1"]["alive"] = true;
			model.board["x2y2"]["alive"] = true;
			let neighbours: number = model.getAliveNeighbors("x1y1");
			expect(neighbours).to.eql(4);
			let result: object = model.calculateNextState('x1y1');
			expect(result["alive"]).to.eql(false);
		});
	});

	describe('nextBoardState', () => {
		it('model.nextBoardState should be a function', () => {
			expect(model.nextBoardState).to.be.an('function');
		});
		it('model.nextBoardState should calculate new state of board', () => {
			model.board["x0y0"]["alive"] = false;
			model.board["x0y0"]["alive"] = false;
			model.board["x0y0"]["alive"] = false;
			model.board["x0y0"]["alive"] = false;
			model.board["x0y0"]["alive"] = false;
			model.board["x0y0"]["alive"] = false;
			model.board["x0y0"]["alive"] = false;
			model.nextBoardState();
			expect(model.nextBoardState).to.be.an('function');
		});
	});
	describe('editLifeState', () => {
		it('editCell should be a function', () => {
			expect(model.editLifeState).to.be.an('function');
		});
		it('editCell should change cell"s life state', () => {
			model.board["x0y0"]["alive"] = false;
			model.editLifeState("x0y0");
			expect(model.board["x0y0"]["alive"]).to.eql(true);
		});
	});
	describe('changeWidth', () => {
		it('changeWidth should be a function', () => {
			expect(model.editLifeState).to.be.an('function');
		});
		it('changeWidth should change boards"s width', () => {
			model.board["x0y0"]["alive"] = false;
			model.changeWidth(7);
			expect(model.width).to.eql(7);
		});
	});
	describe('changeHeight', () => {
		it('changeHeight should be a function', () => {
			expect(model.editLifeState).to.be.an('function');
		});
		it('changeHeight should change boards"s width', () => {
			model.board["x0y0"]["alive"] = false;
			model.changeHeight(9);
			expect(model.height).to.eql(9);
		});
	});
});

describe('view', () => {
	it('view should be an object', () => {
		expect(view).to.be.an('object');
	});
	describe('model.draw', () => {
		
	});	
});

describe('controller', () => {
	it('controller should be an object', () => {
		expect(controller).to.be.an('object');
	});
	describe('model.controller', () => {
		
	});	
});

function objectLength( object: any):number {
	let length: number = 0;
	for( let key in object ) {
	    if( object.hasOwnProperty(key) ) {
	        ++length;
	    }
	}
	return length;
}