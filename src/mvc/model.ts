import equal = require("deep-equal");
import es6BindAll = require("es6bindall");
import {ICell, IBoard, IModel} from "./interfaces";
import Cell from "./cell";

class Model implements IModel {
  private boardStates: IBoard[] = [];
  public board: IBoard;
  public width: number;
  public height: number;
  private stopGame: boolean;
  private bindMethods: string[] = ["boardInit", "nextBoardState", "toggleCellAliveState", "getCellNeighborsNames", "changeWidth", "changeHeight", "changeStopGameStatus", "isGameStop", "getCurrentBoard", "getBoardWidth", "clearBoardStates"];
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
        currentCell = new Cell(i, j, false);
        this.board[getCellRepresentation(i, j)] = currentCell;
      }
    }
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
  public toggleCellAliveState(key: string): void {
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
  public changeStopGameStatus(stopGame: boolean): void {
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
      toggleCellAliveState: this.toggleCellAliveState,
      changeWidth: this.changeWidth,
      changeHeight: this.changeHeight,
      changeStopGameStatus: this.changeStopGameStatus,
      isGameStop: this.isGameStop,
      getCurrentBoard: this.getCurrentBoard,
      getBoardWidth: this.getBoardWidth,
      clearBoardStates: this.clearBoardStates,
    };
  }
  private getCellAt(key: string): ICell {
    return this.board[key];
  }
  private getAliveNeighborsCount(key: string): number {
    const x: number = this.board[key].x;
    const y: number = this.board[key].y;
    const cellNeighborsNames = this.getCellNeighborsNames(x, y);

    return cellNeighborsNames.reduce((aliveCount, cellName: string) => {
      if (this.board[cellName].alive) {
        aliveCount++;
      }
      return aliveCount;
    }, 0);
  }
  private getCellNeighborsNames(x: number, y: number): string[] {
    const neighbours = [-1, 0, 1];
    let result: string[] = [];
    neighbours.map((positionX) => {
      neighbours.map((positionY) => {
        if (positionX === 0 && positionX === positionY) {
          return;
        } else {
          const currentCell = this.getCellAt(getCellRepresentation(x + positionX, y + positionY));
          if (currentCell && currentCell.alive) {
            result.push(getCellRepresentation(x + positionX, y + positionY));
          }
        }
      });
    });
    return result;
  }
  private calculateNextCellState(key: string): ICell {
    const cell: ICell = this.board[key];
    const tempCell: ICell = {x: this.board[key].x, y: this.board[key].y, alive: this.board[key].alive};
    const livingNeighbours: number = this.getAliveNeighborsCount(key);
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
}

function getCellRepresentation(x: number, y: number): string {
  return "x" + x + "y" + y;
}

function objectsEqual(a: IBoard, b: IBoard): boolean {
  return equal(a, b);
}

export default Model;
