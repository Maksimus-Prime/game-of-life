import * as $ from "jquery";

export default class Controller {
    private model: any;
    private view: any;
    private timer: number;
    constructor() {
    }
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
                this.model.clearBoard();
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
        this.model.clearBoard();
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
    public setModel(model: object) {
        this.model = model;
    }
    public setView(view: object) {
        this.view = view;
    }
}
