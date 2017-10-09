import * as $ from "jquery";

export default class Controller {
    public model: any;
    public view: any;
    timer;
    constructor() {
    }
    init() {
        console.log(this.view, this.model);
        this.initGame()
        this.view.subscribe('startGame', this.startGame.bind(this));
        this.view.subscribe('pauseGame', this.pauseGame.bind(this));
        this.view.subscribe('restartGame', this.restartGame.bind(this));
        this.view.subscribe('changeWidth', this.changeWidth.bind(this));
        this.view.subscribe('changeHeight', this.changeHeight.bind(this));
        this.view.subscribe('cellClicked', this.cellClicked.bind(this));        
    }
    initGame() {
        console.log('I was fired!');
        this.model.boardInit();
        let currentBoard = this.model.getCurrentBoard();
        let boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);   
    }
    startGame():void {
        this.timer = setInterval( () => {
            let gameStopStatus = this.model.isGameStop();
            if (!gameStopStatus) {
                this.model.changeStopGame(false);
                this.model.nextBoardState();
                let currentBoard = this.model.getCurrentBoard();
                let boardWidth = this.model.getBoardWidth();
                this.view.draw(currentBoard, boardWidth);
            } else {
                alert('Game is over!');
                clearTimeout(this.timer);
                this.model.changeStopGame(true);
                this.model.clearBoard();
            }
        }, 1000);
    }
    pauseGame():void {
        clearTimeout(this.timer);
        let currentBoard = this.model.getCurrentBoard();
        let boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);
    }
    restartGame():void {
        clearTimeout(this.timer);
        this.model.boardInit();
        this.model.clearBoard();
        this.model.changeStopGame(false);
        let currentBoard = this.model.getCurrentBoard();
        let boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);
    }
    changeHeight(newHeight: number):void {
        this.model.changeHeight(newHeight);
        let currentBoard = this.model.getCurrentBoard();
        let boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);
    }
    changeWidth(newWidth: number):void {
        this.model.changeWidth(newWidth);
        let currentBoard = this.model.getCurrentBoard();
        let boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);
    }
    cellClicked(cellKey: string):void {
        this.model.editCellAliveState(cellKey);
    }
    setModel(model: object) {
        this.model = model;
    }
    setView(view: object) {
        this.view = view;
    }
}
