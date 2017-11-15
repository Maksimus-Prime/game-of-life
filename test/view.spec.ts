import Model from "./../src/mvc/model";
import View from "./../src/mvc/view";
import {ICell, IBoard, IModel, IView} from "./../src/mvc/interfaces";
import * as $ from "jquery";
import * as jsdom from "mocha-jsdom";
import * as chai from "chai";
import * as sinon from "sinon";
chai.use(require("chai-dom"));
const expect = chai.expect;

function makeDOM(): void {
    createDOMElement("div", "board");
    createDOMElement("button", "startButton");
    createDOMElement("button", "pauseButton");
    createDOMElement("button", "restartButton");
    createDOMElement("input", "widthInput");
    createDOMElement("input", "heightInput");
}
function createDOMElement(element: string, id: string): void {
    const el: HTMLElement = document.createElement(element);
    el.id = id;
    document.body.appendChild(el);
}

describe("view", function() {
    let model: IModel;
    let width: number = 3;
    let height: number = 3;
    let view: IView;
    beforeEach(function() {
        makeDOM();
        width = 3;
        height = 3;
        model = (new Model(width, height)).getModel();
        view = (new View()).getView();
        model.boardInit();
    });
    describe("view.draw", () => {
        it("#board should be empty before view.draw will be executed", () => {
            expect(document.getElementById("board")).to.be.empty;
        });
        it(`view.draw should fill DOM element with id #board with ${width * height}(width*height) i tags`, () => {
            view.draw(model.getCurrentBoard(), model.getBoardWidth());
            expect(document.getElementById("board")).to.have.html('<i class="cell dead" id="x0y0"></i><i class="cell dead" id="x0y1"></i><i class="cell dead" id="x0y2"></i><i class="cell dead" id="x1y0"></i><i class="cell dead" id="x1y1"></i><i class="cell dead" id="x1y2"></i><i class="cell dead" id="x2y0"></i><i class="cell dead" id="x2y1"></i><i class="cell dead" id="x2y2"></i>');
        });
    });
    describe("view.toggleCellClass", () => {
        it(`view.toggleCellClass should toggle class "dead" of a particular cell`, () => {
            view.draw(model.getCurrentBoard(), model.getBoardWidth());
            const x1y1 = document.getElementById("x1y1");
            x1y1.classList.remove("dead");
            expect(x1y1).to.have.attribute("class", "cell");
            view.toggleCellClass(x1y1);
            expect(x1y1).to.have.attribute("class", "cell dead");
        });
    });
    describe("view.subscribe", () => {
        it(`view.subscribe should subscribe a callback on a custom event`, () => {
            const callback = sinon.spy();
            view.subscribe("startGame", callback);
            $("#startButton").trigger("click");
            expect(callback.called).equals(true);
        });
        it(`view.subscribe should subscribe a callback on a custom event that invokes when `, () => {
            const callback = sinon.spy();
            view.subscribe("changeWidth", callback);
            $("#widthInput").trigger("blur");
            expect(callback.called).equals(true);
        });
    });
    describe("view.unsubscribe", () => {
        it(`view.unsubscribe should unsubscribe the callback from the custom event (click)`, () => {
            const callback = sinon.spy();
            view.subscribe("startGame", callback);
            view.unsubscribe("startGame", callback);
            $("#startButton").trigger("click");
            expect(callback.called).equals(false);
        });
        it(`view.unsubscribe should unsubscribe the callback from the custom event (blur)`, () => {
            const callback = sinon.spy();
            view.subscribe("changeWidth", callback);
            view.unsubscribe("changeWidth", callback);
            $("#widthInput").trigger("blur");
            expect(callback.called).equals(false);
        });
    });
});
