import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
let expect = chai.expect;
import Model from './../src/mvc/model';
interface ICell {
    x: number;
    y: number;
    alive: boolean;
}
interface IBoard {
    [index: string]: ICell;
}
interface IModel {
    boardInit(): void;
    nextBoardState(): void;
    editCellAliveState(key: string): void;
    changeWidth(newWidth: number): void;
    changeHeight(newHeight: number): void;
    changeStopGame(stopGame: boolean): void;
    isGameStop(): boolean;
    getCurrentBoard(): IBoard;
    getBoardWidth(): number;
    clearBoardStates(): void;
}

let model: IModel;
let width: number = 3;
let height: number = 3;

describe('model', () => {
    beforeEach(function() {
        width = 3;
        height = 3;
        model = (new Model(width, height)).getModel();
        model.boardInit();
    });
    it('model should be an object', () => {
        expect(model).to.be.an('object');
    });
    describe('model.boardInit', () => {
        it('model.boardInit should be a function', () => {
            expect(model.boardInit).to.be.an('function');
        });
        it('model.boardInit should fill model.board with objects', () => {
            expect((model.getCurrentBoard())["x1y1"]).to.be.an('object');
        });
        it(`length of model.board should equal to ${width}*${height}`, () => {
            let result = objectLength(model.getCurrentBoard());
            expect(result).to.eql(width*height);
        });
    });
    describe('model.getBoardWidth', () => {
        it('model.getBoardWidth should be a function', () => {
            expect(model.getBoardWidth).to.be.an('function');
        });
        it('model.getBoardWidth should return model\'s width' , () => {
            model.getBoardWidth();
            let result = model.getBoardWidth();
            expect(result).to.eql(width);
        });
    });
    describe('model.changeWidth', () => {
        it('model.changeWidth should be a function', () => {
            expect(model.changeWidth).to.be.an('function');
        });
        it('model.changeWidth should change model\'s width' , () => {
            let newWidth = 5;
            model.changeWidth(newWidth);
            let result = objectLength(model.getCurrentBoard());
            expect(result).to.eql(height * newWidth);
        });
    });
    describe('model.changeHeight', () => {
        it('model.changeHeight should be a function', () => {
            expect(model.changeHeight).to.be.an('function');
        });
        it('model.changeHeight should change model\'s height' , () => {
            let newHeight = 5;
            model.changeHeight(newHeight);
            let result = objectLength(model.getCurrentBoard());
            expect(result).to.eql(width * newHeight);
        });
    });
    describe('model.editCellAliveState', () => {
        it('model.editCellAliveState should be a function', () => {
            expect(model.editCellAliveState).to.be.an('function');
        });
        it('model.editCellAliveState should change the property alive of a particular cell', () => {
            let cell = (model.getCurrentBoard())["x1y1"];
            expect(cell.alive).equal(false);
            model.editCellAliveState("x1y1");
            expect(cell.alive).equal(true);
        });
    });
    describe('model.changeStopGame', () => {
        it('model.changeStopGame should be a function', () => {
            expect(model.changeStopGame).to.be.an('function');
        });
        it('model.changeStopGame should change the game\' stopStatus', () => {
            let stopStatus = model.isGameStop();
            expect(stopStatus).equal(false);
            model.changeStopGame(true);
            expect(model.isGameStop()).equal(true);
        });
    });
});

function objectLength(object: IBoard): number {
    return Object.keys(object).length;
}