import equal = require("deep-equal");
import es6BindAll = require("es6bindall");
import {ICell, IBoard, IModel} from "./interfaces";

class Model implements IModel {
  private boardStates: IBoard[] = [];
  public board: IBoard;
  public width: number;
  public height: number;
  public stopGame: boolean;
  private bindMethods: string[] = ["boardInit", "nextBoardState", "editCellAliveState", "changeWidth", "changeHeight", "changeStopGame", "isGameStop", "getCurrentBoard", "getBoardWidth", "clearBoardStates"];
  constructor(width: number, height: number) {
    this.board = {};
    this.width = width;
    this.height = height;
    this.stopGame = false;
    es6BindAll(this, this.bindMethods);
  }
  public boardInit(): void {
    let currentCell: ICell;
    this.board = {};
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        currentCell = {
          x: i,
          y: j,
          alive: false,
        };
        this.board[getCellRepresentation(i, j)] = currentCell;
      }
    }
  }
  private getCellAt(key: string): ICell {
    return this.board[key];
  }
  private getAliveNeighbors(key: string): number {
    const x: number = this.board[key].x;
    const y: number = this.board[key].y;
    let alive: number = 0;
    let currentCell: ICell;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && i === j) {
          continue;
        }
        currentCell = this.getCellAt(getCellRepresentation(x + i, y + j));
        if (currentCell && currentCell.alive) {
          alive++;
        }
      }
    }
    return alive;
  }
  private calculateNextCellState(key: string): ICell {
    const cell: ICell = this.board[key];
    const tempCell: ICell = {x: this.board[key].x, y: this.board[key].y, alive: this.board[key].alive};
    const livingNeighbours: number = this.getAliveNeighbors(key);
    if (tempCell.alive) {
      if (livingNeighbours === 2 || livingNeighbours === 3) {
        tempCell.alive = true;
      } else {
          tempCell.alive = false;
      }
    } else {
      if (livingNeighbours === 3) {
        tempCell.alive = true;
      }
    }

    return tempCell;
  }
  public nextBoardState() {
    const currentBoard: IBoard = this.board;
    const tempBoard: IBoard = {};
    let flag: boolean = false;
    let flagNum: number = 0;
    Object.keys(this.board).map((cell) => {
      if (this.board.hasOwnProperty(cell)) {
        const currentCell: ICell = this.board[cell];
        const tempCell: ICell = this.calculateNextCellState(cell);
        tempBoard[cell] = tempCell;
      }
    });
    // check 1
    this.boardStates.map(function(boardState: IBoard) {
      if (objectsEqual(boardState, tempBoard)) {
        flag = true;
      }
    });
    if (flag) {
      this.stopGame = true;
      return;
    }
    // check 2
    Object.keys(this.board).map((cell) => {
      if (this.board[cell].alive) {
        flagNum++;
      }
    });
    if (flagNum === 0) {
      this.stopGame = true;
      return;
    }
    this.boardStates.push(tempBoard);
    this.board = tempBoard;
  }
  public editCellAliveState(key: string): void {
    const cellAlive = this.board[key].alive;
    if (cellAlive) {
      this.board[key].alive = false;
    } else {
      this.board[key].alive = true;
    }
  }
  public changeWidth(newWidth: number): void {
    const temObj = jQuery.extend(true, {}, this.board);
    const temWidth = this.width;
    this.width = newWidth;
    this.boardInit();
    Object.keys(this.board).map((cell) => {
      if (this.board.hasOwnProperty(cell)) {
        Object.keys(temObj).map((tempCell) => {
          if (cell === tempCell) {
              this.board[getCellRepresentation(temObj[cell].x, temObj[cell].y)] = temObj[cell];
          }
        });
      }
    });
  }
  public changeHeight(newHeight: number): void {
    const temObj = jQuery.extend(true, {}, this.board);
    const temHeight = this.height;
    this.height = newHeight;
    this.boardInit();
    Object.keys(this.board).map((cell) => {
      if (this.board.hasOwnProperty(cell)) {
        Object.keys(temObj).map((tempCell) => {
          if (cell === tempCell) {
              this.board[getCellRepresentation(temObj[cell].x, temObj[cell].y)] = temObj[cell];
          }
        });
      }
    });
  }
  public changeStopGame(stopGame: boolean): void {
    this.stopGame = stopGame;
  }
  public isGameStop(): boolean {
    return this.stopGame;
  }
  public getCurrentBoard(): IBoard {
    return this.board;
  }
  public getBoardWidth(): number {
    return this.width;
  }
  public clearBoardStates(): void {
    this.boardStates = [];
  }
  public getModel(): IModel {
    return {
      boardInit: this.boardInit,
      nextBoardState: this.nextBoardState,
      editCellAliveState: this.editCellAliveState,
      changeWidth: this.changeWidth,
      changeHeight: this.changeHeight,
      changeStopGame: this.changeStopGame,
      isGameStop: this.isGameStop,
      getCurrentBoard: this.getCurrentBoard,
      getBoardWidth: this.getBoardWidth,
      clearBoardStates: this.clearBoardStates,
    };
  }
}

function getCellRepresentation(x: number, y: number): string {
  return "x" + x + "y" + y;
}

function objectsEqual(a: IBoard, b: IBoard): boolean {
  return equal(a, b);
}

export default Model;
