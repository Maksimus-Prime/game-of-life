import * as mocha from "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
const expect = chai.expect;
import Model from "./../src/mvc/model";
import {ICell, IBoard, IModel} from "./../src/mvc/interfaces";

describe("model", function() {
    let model: IModel;
    let width: number = 3;
    let height: number = 3;
    beforeEach(function() {
        width = 3;
        height = 3;
        model = (new Model(width, height)).getModel();
        model.boardInit();
    });
    it("model should be an object", () => {
        expect(model).to.be.an("object");
    });
    describe("model.boardInit", () => {
        it("model.boardInit should be a function", () => {
            expect(model.boardInit).to.be.an("function");
        });
        it("model.boardInit should fill model.board with objects", () => {
            expect((model.getCurrentBoard()).x1y1).to.be.an("object");
        });
        it(`length of model.board should equal to ${width}*${height}`, () => {
            const result = objectLength(model.getCurrentBoard());
            expect(result).to.eql(width * height);
        });
    });
    describe("model.getBoardWidth", () => {
        it("model.getBoardWidth should be a function", () => {
            expect(model.getBoardWidth).to.be.an("function");
        });
        it("model.getBoardWidth should return width of model" , () => {
            model.getBoardWidth();
            const result = model.getBoardWidth();
            expect(result).to.eql(width);
        });
    });
    describe("model.changeWidth", () => {
        it("model.changeWidth should be a function", () => {
            expect(model.changeWidth).to.be.an("function");
        });
        it("model.changeWidth should change width of model" , () => {
            const newWidth = 5;
            model.changeWidth(newWidth);
            const result = objectLength(model.getCurrentBoard());
            expect(result).to.eql(height * newWidth);
        });
    });
    describe("model.changeHeight", () => {
        it("model.changeHeight should be a function", () => {
            expect(model.changeHeight).to.be.an("function");
        });
        it("model.changeHeight should change model's height" , () => {
            const newHeight = 5;
            model.changeHeight(newHeight);
            const result = objectLength(model.getCurrentBoard());
            expect(result).to.eql(width * newHeight);
        });
    });
    describe("model.changeStopGame", () => {
        it("model.changeStopGame should be a function", () => {
            expect(model.changeStopGameStatus).to.be.an("function");
        });
        it("model.changeStopGame should change the stopStatus of game", () => {
            const stopStatus = model.isGameStop();
            expect(stopStatus).equal(false);
            model.changeStopGameStatus(true);
            expect(model.isGameStop()).equal(true);
        });
    });
});

function objectLength(object: IBoard): number {
    return Object.keys(object).length;
}
