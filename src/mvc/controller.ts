import * as $ from "jquery";

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
class Controller {
    private model: IModel;
    private view: IView;
    private timer: number;
    public init() {
        this.initGame();
        this.view.subscribe("startGame", this.startGame.bind(this));
        this.view.subscribe("pauseGame", this.pauseGame.bind(this));
        this.view.subscribe("restartGame", this.restartGame.bind(this));
        this.view.subscribe("changeWidth", this.changeWidth.bind(this));
        this.view.subscribe("changeHeight", this.changeHeight.bind(this));
        this.view.subscribe("cellClicked", this.cellClicked.bind(this));
    }
    public initGame() {
        this.model.boardInit();
        const currentBoard = this.model.getCurrentBoard();
        const boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);
    }
    public startGame(): void {
        this.timer = window.setInterval( () => {
            const gameStopStatus = this.model.isGameStop();
            if (!gameStopStatus) {
                this.model.changeStopGame(false);
                this.model.nextBoardState();
                const currentBoard = this.model.getCurrentBoard();
                const boardWidth = this.model.getBoardWidth();
                this.view.draw(currentBoard, boardWidth);
            } else {
                alert("Game is over!");
                clearTimeout(this.timer);
                this.model.changeStopGame(true);
                this.model.clearBoardStates();
            }
        }, 1000);
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
        this.model.changeStopGame(false);
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
    public cellClicked(cellKey: string): void {
        this.model.editCellAliveState(cellKey);
    }
    public setModel(model: IModel): void {
        this.model = model;
    }
    public setView(view: IView): void {
        this.view = view;
    }
}

export default Controller;
