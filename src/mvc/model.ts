interface ICell {
    x: number;
    y: number;
    alive: boolean;
}
interface IBoard {
    [index: string]: ICell
}

export default class Model {
    public board: IBoard;
    public boardStates: object[] = [];
    public width: number;
    public height: number;
    public stopGame: boolean;
    
    constructor (width: number, height: number) {
        this.board = {};
        this.width = width;
        this.height = height;
        this.stopGame = false;
    }
    boardInit (): void {
        let currentCell: ICell;
        this.board = {};
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                currentCell = {
                    x: i,
                    y: j,
                    alive: false
                };
                this.board[getCellRepresentation(i, j)] = currentCell;
            }
        }
    }
    getCellAt (key: string): ICell {
        return this.board[key];
    }
    getAliveNeighbors (key: string): number {
        let x: number = this.board[key]["x"];
        let y: number = this.board[key]["y"];
        let alive: number = 0;
        let currentCell: ICell;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && i === j) {
                    continue;
                }
                currentCell = this.getCellAt(getCellRepresentation(x + i, y + j));
                if (currentCell && currentCell["alive"]) {
                    alive++;
                }
            }
        }
        return alive;
    }
    calculateNextCellState (key: string): ICell {
        let cell: ICell = this.board[key];
        let tempCell: ICell = {x: this.board[key]["x"], y: this.board[key]["y"], alive: this.board[key]["alive"]};
        let livingNeighbours: number = this.getAliveNeighbors(key);
        if (tempCell["alive"]) {
            if (livingNeighbours === 2 || livingNeighbours === 3) {
                tempCell["alive"] = true;
            } else {
                tempCell["alive"] = false;
            }
        } else {
            if (livingNeighbours === 3) {
                tempCell["alive"] = true;
            }
        }

        return tempCell;
    }
    nextBoardState() {
        let currentBoard: IBoard = this.board;
        let tempBoard: IBoard = {};
        let key: string;
        let flag: boolean = false;
        let flagNum: number = 0;
        for (key in this.board) {
            if (this.board.hasOwnProperty(key)) {
                let currentCell: ICell = this.board[key];
                let tempCell: ICell = this.calculateNextCellState(key);
                tempBoard[key] = tempCell;              
            }
        }
        // check 1
        for (let i = 0; i < this.boardStates.length; i++) {
            if (jsonEqual(this.boardStates[i], tempBoard)){
                flag = true;
            }
        }
        if (flag) {
            this.stopGame = true;
            return;
        }
        // check 2
        for (let j in this.board) {
            if (this.board[j]["alive"]) {
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
    editCellAliveState(key: string):void {
        let cellAlive = this.board[key]["alive"];
        if (cellAlive) {
            this.board[key]["alive"] = false;
        }else {
            this.board[key]["alive"] = true;
        }
    }
    changeWidth(newWidth: number):void {
        var temObj = jQuery.extend(true, {}, this.board);
        var temWidth = this.width;

        this.width = newWidth;
        this.boardInit();
        for (let keyy in this.board ) {
            if (this.board.hasOwnProperty(keyy)) {
                for (let key in temObj) {
                    if (keyy === key) {
                        this.board[getCellRepresentation(temObj[keyy]["x"], temObj[keyy]["y"])] = temObj[keyy];
                    }
                }
            }
        }
    }
    changeHeight(newHeight: number):void {
        var temObj = jQuery.extend(true, {}, this.board);
        var temHeight = this.height;

        this.height = newHeight;
        this.boardInit();
        for (let keyy in this.board ) {
            if (this.board.hasOwnProperty(keyy)) {
                for (let key in temObj) {
                    if (keyy === key) {
                        this.board[getCellRepresentation(temObj[keyy]["x"], temObj[keyy]["y"])] = temObj[keyy];
                    }
                }
            }
        }
    }
    changeStopGame(stopGame: boolean):void {
        this.stopGame = stopGame;
    }
    isGameStop():boolean {
        return this.stopGame;
    }
    getCurrentBoard():IBoard {
        return this.board;
    }
    getBoardWidth():number {
        return this.width;
    }
    clearBoard():void {
        this.boardStates = [];
    }
    getModelFacade() {
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
            clearBoard: this.clearBoard.bind(this)
        };
    }
}

function getCellRepresentation(x: number, y: number): string {
    return 'x' + x + 'y' + y;
}

function objectLength( object: object): number {
    let length: number = 0;
    for ( let key in object ) {
        if ( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

function jsonEqual(a: object, b: object):boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}
