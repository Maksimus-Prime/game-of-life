import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
let expect = chai.expect;
import Model from './../src/mvc/model';
import View from './../src/mvc/view';

interface ICell {
    x: number;
    y: number;
    alive: boolean;
}
interface IBoard {
    [index: string]: ICell;
}
type CallBackData = number | string | void | undefined;
type CallbackSub = (data?: CallBackData) => void;
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
interface IView {
    draw(board: IBoard, boardWidth: number): void;
    toggleCellClass(cell: HTMLHtmlElement): string | void;
    subscribe(eventName: string, fn: CallbackSub): void;
    unsubscribe(eventName: string, fn: CallbackSub): void;
}

let model: IModel;
let width: number = 3;
let height: number = 3;
let view: IView;

describe('view', () => {
    beforeEach(function() {
        width = 3;
        height = 3;
        model = (new Model(width, height)).getModel();
        view = (new View()).getView();
        model.boardInit();
    });
    describe('view.toggleCellClass', () => {
        it('view.toggleCellClass should be a function', () => {
            expect(view.toggleCellClass).to.be.an('function');
        });
    });
});