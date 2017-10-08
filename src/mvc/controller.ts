import * as $ from "jquery";

export default class Controller {
    public modelFacade: any;
    public viewFacade: any;
    timer;
    constructor(Model: any, View: any) {
        this.modelFacade = (new Model(5,5)).getModelFacade();
        this.viewFacade = (new View()).getViewFacade();
        this.viewFacade.subscribe('startGame', this.startGame.bind(this));
        this.viewFacade.subscribe('pauseGame', this.pauseGame.bind(this));
        this.viewFacade.subscribe('restartGame', this.restartGame.bind(this));
        this.viewFacade.subscribe('changeWidth', this.changeWidth.bind(this));
        this.viewFacade.subscribe('changeHeight', this.changeHeight.bind(this));
        this.viewFacade.subscribe('cellClicked', this.cellClicked.bind(this));

        window.onload = () => {
            this.modelFacade.boardInit();
            let currentBoard = this.modelFacade.getCurrentBoard();
            let boardWidth = this.modelFacade.getBoardWidth();
            this.viewFacade.draw(currentBoard, boardWidth);
        };
    }
    startGame():void {
        this.timer = setInterval( () => {
            let gameStopStatus = this.modelFacade.isGameStop();
            if (!gameStopStatus) {
                this.modelFacade.changeStopGame(false);
                this.modelFacade.nextBoardState();
                let currentBoard = this.modelFacade.getCurrentBoard();
                let boardWidth = this.modelFacade.getBoardWidth();
                this.viewFacade.draw(currentBoard, boardWidth);
            } else {
                alert('Game is over!');
                clearTimeout(this.timer);
                this.modelFacade.changeStopGame(true);
                this.modelFacade.clearBoard();
            }
        }, 1000);
    }
    pauseGame():void {
        clearTimeout(this.timer);
        let currentBoard = this.modelFacade.getCurrentBoard();
        let boardWidth = this.modelFacade.getBoardWidth();
        this.viewFacade.draw(currentBoard, boardWidth);
    }
    restartGame():void {
        clearTimeout(this.timer);
        this.modelFacade.boardInit();
        this.modelFacade.clearBoard();
        this.modelFacade.changeStopGame(false);
        let currentBoard = this.modelFacade.getCurrentBoard();
        let boardWidth = this.modelFacade.getBoardWidth();
        this.viewFacade.draw(currentBoard, boardWidth);
    }
    changeHeight(newHeight: number):void {
        this.modelFacade.changeHeight(newHeight);
        let currentBoard = this.modelFacade.getCurrentBoard();
        let boardWidth = this.modelFacade.getBoardWidth();
        this.viewFacade.draw(currentBoard, boardWidth);
    }
    changeWidth(newWidth: number):void {
        this.modelFacade.changeWidth(newWidth);
        let currentBoard = this.modelFacade.getCurrentBoard();
        let boardWidth = this.modelFacade.getBoardWidth();
        this.viewFacade.draw(currentBoard, boardWidth);
    }
    cellClicked(cellKey: string):void {
        this.modelFacade.editCellAliveState(cellKey);
    }
}
