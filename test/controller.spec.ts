import * as mocha from "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
const expect = chai.expect;

chai.use(require("chai-dom"));
import Model from "./../src/mvc/model";
import View from "./../src/mvc/view";
import Controller from "./../src/mvc/controller";

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
interface IController {
  init(): void;
  startGame(): void;
  pauseGame(): void;
  restartGame(): void;
  changeHeight(newHeight: number): void;
  changeWidth(newWidth: number): void;
  cellClicked(cellKey: string): void;
  setModel(model: IModel): void;
  setView(view: IView): void;
}

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

describe("controller", function() {
  let model: IModel;
  let view: IView;
  const width: number = 3;
  const height: number = 3;
  let controller: IController;
  beforeEach(function() {
    makeDOM();
    model = (new Model(width, height)).getModel();
    view = (new View()).getView();
    controller = new Controller();
    controller.setModel(model);
    controller.setView(view);
    controller.init();
   });
  describe("controller.cellClicked", function() {
    it('controller.cellClicked should change property "alive" of cell in model and add/remove class "dead" to/from HTMLElement in DOM', function() {
      expect(model.getCurrentBoard().x0y0.alive).equals(false);
      controller.cellClicked("x0y0");
      expect(model.getCurrentBoard().x0y0.alive).equals(true);
    });
  });
  describe("controller.changeWidth", function() {
    it(`controller.changeWidth should change width of board`, function() {
      const newWidth = 10;
      controller.changeWidth(newWidth);
      expect(model.getBoardWidth()).equals(newWidth);
      expect(document.getElementById("board")).to.have.attribute("style", `width: ${newWidth * 20}px`);
    });
  });
  describe("controller.changeHeight", function() {
    it(`controller.changeHeight should change height of board`, function() {
      const newHeight = 8;
      expect(document.getElementById("board")).length(width * height);
      controller.changeHeight(newHeight);
      expect(document.getElementById("board")).length(width * newHeight);
    });
  });
  describe("controller.startGame", function() {
    it("controller.startGame should change state of game", function(done) {
      controller.cellClicked("x0y0");
      controller.cellClicked("x0y1");
      controller.cellClicked("x2y1");
      controller.startGame();
      setTimeout(function() {
         controller.pauseGame();
         expect(model.getCurrentBoard().x1y0.alive).equals(true);
         expect(model.getCurrentBoard().x1y1.alive).equals(true);
         expect(model.getCurrentBoard().x1y2.alive).equals(false);
         expect(model.getCurrentBoard().x0y0.alive).equals(false);
         expect(model.getCurrentBoard().x0y1.alive).equals(false);
         expect(model.getCurrentBoard().x0y2.alive).equals(false);
         expect(model.getCurrentBoard().x2y0.alive).equals(false);
         expect(model.getCurrentBoard().x2y1.alive).equals(false);
         expect(model.getCurrentBoard().x2y2.alive).equals(false);

         expect(document.getElementById("x1y0")).to.have.attribute("class", "cell");
         expect(document.getElementById("x1y1")).to.have.attribute("class", "cell");
         expect(document.getElementById("x1y2")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x0y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x0y1")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x0y2")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y1")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y2")).to.have.attribute("class", "cell dead");
         done();
      }, 1600);
    });
  });
  describe("controller.pauseGame", function() {
    it("controller.pauseGame should pause the game", function(done) {
      controller.cellClicked("x0y0");
      controller.cellClicked("x0y1");
      controller.cellClicked("x2y1");
      controller.startGame();
      setTimeout(function() {
         controller.pauseGame();
         expect(model.getCurrentBoard().x0y0.alive).equals(true);
         expect(model.getCurrentBoard().x0y1.alive).equals(true);
         expect(model.getCurrentBoard().x2y1.alive).equals(true);
         expect(model.getCurrentBoard().x1y0.alive).equals(false);
         expect(model.getCurrentBoard().x1y1.alive).equals(false);
         expect(model.getCurrentBoard().x1y2.alive).equals(false);
         expect(model.getCurrentBoard().x0y2.alive).equals(false);
         expect(model.getCurrentBoard().x2y0.alive).equals(false);
         expect(model.getCurrentBoard().x2y2.alive).equals(false);

         expect(document.getElementById("x0y0")).to.have.attribute("class", "cell");
         expect(document.getElementById("x0y1")).to.have.attribute("class", "cell");
         expect(document.getElementById("x2y1")).to.have.attribute("class", "cell");
         expect(document.getElementById("x1y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x1y1")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x1y2")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x0y2")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y2")).to.have.attribute("class", "cell dead");
         done();
      }, 0);
    });
  });
  describe("controller.restartGame", function() {
    it(`controller.restartGame should make all cells again dead, stop the game and let to start again`, function(done) {
      controller.cellClicked("x0y0");
      controller.cellClicked("x0y1");
      controller.cellClicked("x2y1");
      controller.startGame();
      setTimeout(function() {
         controller.restartGame();
         expect(model.getCurrentBoard().x0y0.alive).equals(false);
         expect(model.getCurrentBoard().x0y1.alive).equals(false);
         expect(model.getCurrentBoard().x2y1.alive).equals(false);
         expect(model.getCurrentBoard().x1y0.alive).equals(false);
         expect(model.getCurrentBoard().x1y1.alive).equals(false);
         expect(model.getCurrentBoard().x1y2.alive).equals(false);
         expect(model.getCurrentBoard().x0y2.alive).equals(false);
         expect(model.getCurrentBoard().x2y0.alive).equals(false);
         expect(model.getCurrentBoard().x2y2.alive).equals(false);

         expect(document.getElementById("x0y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x0y1")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y1")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x1y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x1y1")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x1y2")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x0y2")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y0")).to.have.attribute("class", "cell dead");
         expect(document.getElementById("x2y2")).to.have.attribute("class", "cell dead");
         done();
      }, 1600);
    });
  });
});
