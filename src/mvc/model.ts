import equal = require("deep-equal");

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
class Model {
  private boardStates: IBoard[] = [];
  public board: IBoard;
  public width: number;
  public height: number;
  public stopGame: boolean;
  constructor(width: number, height: number) {
    this.board = {};
    this.width = width;
    this.height = height;
    this.stopGame = false;
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
    let key: string;
    let flag: boolean = false;
    let flagNum: number = 0;
    for (key in this.board) {
      if (this.board.hasOwnProperty(key)) {
        const currentCell: ICell = this.board[key];
        const tempCell: ICell = this.calculateNextCellState(key);
        tempBoard[key] = tempCell;
      }
    }
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
    for (const j in this.board) {
      if (this.board[j].alive) {
        flagNum++;
      }
    }
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
    }else {
      this.board[key].alive = true;
    }
  }
  public changeWidth(newWidth: number): void {
    const temObj = jQuery.extend(true, {}, this.board);
    const temWidth = this.width;
    this.width = newWidth;
    this.boardInit();
    for (const keyy in this.board ) {
      if (this.board.hasOwnProperty(keyy)) {
        for (const key in temObj) {
          if (keyy === key) {
              this.board[getCellRepresentation(temObj[keyy].x, temObj[keyy].y)] = temObj[keyy];
          }
        }
      }
    }
  }
  public changeHeight(newHeight: number): void {
    const temObj = jQuery.extend(true, {}, this.board);
    const temHeight = this.height;
    this.height = newHeight;
    this.boardInit();
    for (const keyy in this.board ) {
      if (this.board.hasOwnProperty(keyy)) {
        for (const key in temObj) {
          if (keyy === key) {
            this.board[getCellRepresentation(temObj[keyy].x, temObj[keyy].y)] = temObj[keyy];
          }
        }
      }
    }
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
      boardInit: this.boardInit.bind(this),
      nextBoardState: this.nextBoardState.bind(this),
      editCellAliveState: this.editCellAliveState.bind(this),
      changeWidth: this.changeWidth.bind(this),
      changeHeight: this.changeHeight.bind(this),
      changeStopGame: this.changeStopGame.bind(this),
      isGameStop: this.isGameStop.bind(this),
      getCurrentBoard: this.getCurrentBoard.bind(this),
      getBoardWidth: this.getBoardWidth.bind(this),
      clearBoardStates: this.clearBoardStates.bind(this),
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
