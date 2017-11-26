import * as $ from "jquery";
import es6BindAll = require("es6bindall");
import { IModel, IView, IController } from "./Interfaces";

class Controller implements IController {
  private model?: IModel;
  private view?: IView;
  private timer: number;
  private bindMethods: string[] = ["startGame", "pauseGame", "restartGame", "changeWidth", "changeHeight", "calculateNextState", "toggleCellAliveState"];
  constructor() {
  }
  public init() {
    es6BindAll(this, this.bindMethods);
    this.initGame();
    this.initSubscribers();
  }
  public startGame(): void {
    const { model, view } = this;
    if (model && view) {
      this.timer = window.setInterval(this.calculateNextState, 1000);
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  public pauseGame(): void {
    const { model, view } = this;
    if (model && view) {
      clearTimeout(this.timer);
      const currentBoard = model.getCurrentBoard();
      const boardWidth = model.getBoardWidth();
      view.draw(currentBoard, boardWidth);
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  public restartGame(): void {
    const { model, view } = this;
    if (model && view) {
      clearTimeout(this.timer);
      model.boardInit();
      model.clearBoardStates();
      model.changeStopGameStatus(false);
      view.toggleDisplayErrorMessage(model.isGameStop());
      const currentBoard = model.getCurrentBoard();
      const boardWidth = model.getBoardWidth();
      view.draw(currentBoard, boardWidth);
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  public changeHeight(newHeight: number): void {
    const { model, view } = this;
    if (model && view) {
      model.changeHeight(newHeight);
      const currentBoard = model.getCurrentBoard();
      const boardWidth = model.getBoardWidth();
      view.draw(currentBoard, boardWidth);
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  public changeWidth(newWidth: number): void {
    const { model, view } = this;
    if (model && view) {
      model.changeWidth(newWidth);
      const currentBoard = model.getCurrentBoard();
      const boardWidth = model.getBoardWidth();
      view.draw(currentBoard, boardWidth);
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  public toggleCellAliveState(cellKey: string): void {
    const { model } = this;
    if (model) {
      model.toggleCellAliveState(cellKey);
    } else {
      this.throwConsoleError("Please check if you set a model using controller's method setModel()");
    }
  }
  public setModel(model: IModel): void {
    this.model = model;
  }
  public setView(view: IView): void {
    this.view = view;
  }
  private initGame(): void {
    if (this.model && this.view) {
      this.model.boardInit();
      const currentBoard = this.model.getCurrentBoard();
      const boardWidth = this.model.getBoardWidth();
      this.view.draw(currentBoard, boardWidth);
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  private initSubscribers(): void {
    if (this.view) {
      this.view.subscribe("startGame", this.startGame);
      this.view.subscribe("pauseGame", this.pauseGame);
      this.view.subscribe("restartGame", this.restartGame);
      this.view.subscribe("changeWidth", this.changeWidth);
      this.view.subscribe("changeHeight", this.changeHeight);
      this.view.subscribe("cellClicked", this.toggleCellAliveState);
    } else {
      this.throwConsoleError("Please check if you set a view using using controller's method setView()");
    }
  }
  private calculateNextState(): void {
    const { model, view } = this;
    if (model && view) {
      const gameStopStatus = model.isGameStop();
      if (!gameStopStatus) {
        model.changeStopGameStatus(false);
        model.nextBoardState();
        const currentBoard = model.getCurrentBoard();
        const boardWidth = model.getBoardWidth();
        view.draw(currentBoard, boardWidth);
      } else {
        clearTimeout(this.timer);
        model.changeStopGameStatus(true);
        view.toggleDisplayErrorMessage(model.isGameStop());
        model.clearBoardStates();
      }
    } else {
      this.throwConsoleError("Please check if you set a view and model using controller's methods setView() and setModel()");
    }
  }
  private throwConsoleError(message: string): void {
    console.error(message);
  }
}

export default Controller;
