import * as $ from "jquery";
import es6BindAll = require("es6bindall");
import { IModel, IView, IController } from "./Interfaces";

class Controller implements IController {
  private model: IModel;
  private view: IView;
  private timer: number;
  private bindMethods: string[] = ["startGame", "pauseGame", "restartGame", "changeWidth", "changeHeight", "calculateNextState", "toggleCellAliveState"];
  constructor(model: IModel, view: IView) {
    es6BindAll(this, this.bindMethods);
    this.model = model;
    this.view = view;
    this.initGame();
    this.initSubscribers();
  }
  public startGame(): void {
    this.timer = window.setInterval(this.calculateNextState, 1000);
  }
  public pauseGame(): void {
    clearTimeout(this.timer);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public restartGame(): void {
    clearTimeout(this.timer);
    this.model.boardInit();
    this.model.clearBoardStates();
    this.model.changeStopGameStatus(false);
    this.view.toggleDisplayErrorMessage(this.model.isGameStop());
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public changeHeight(newHeight: number): void {
    this.model.changeHeight(newHeight);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public changeWidth(newWidth: number): void {
    this.model.changeWidth(newWidth);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public toggleCellAliveState(cellKey: string): void {
    this.model.toggleCellAliveState(cellKey);
  }
  private initGame(): void {
    try {
      this.model.boardInit();
      const currentBoard = this.model.getCurrentBoard();
      const boardWidth = this.model.getBoardWidth();
      this.view.draw(currentBoard, boardWidth);
    } catch (error) {
      this.throwError();
    }
  }
  private initSubscribers(): void {
    this.view.subscribe("startGame", this.startGame);
    this.view.subscribe("pauseGame", this.pauseGame);
    this.view.subscribe("restartGame", this.restartGame);
    this.view.subscribe("changeWidth", this.changeWidth);
    this.view.subscribe("changeHeight", this.changeHeight);
    this.view.subscribe("cellClicked", this.toggleCellAliveState);
  }
  private calculateNextState(): void {
    const gameStopStatus = this.model.isGameStop();
    if (!gameStopStatus) {
      this.model.changeStopGameStatus(false);
      this.model.nextBoardState();
      const currentBoard = this.model.getCurrentBoard();
      const boardWidth = this.model.getBoardWidth();
      this.view.draw(currentBoard, boardWidth);
    } else {
      clearTimeout(this.timer);
      this.model.changeStopGameStatus(true);
      this.view.toggleDisplayErrorMessage(this.model.isGameStop());
      this.model.clearBoardStates();
    }
  }
  private throwError(): void {
    throw new Error("Please check if you pass model and view into Controller function");
  }
}

export default Controller;
