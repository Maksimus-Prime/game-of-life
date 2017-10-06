import * as $ from "jquery";

export default class Controller {
    public model: any;
    public view: any;
    timer;
    constructor(model: any, view: any) {
        let self = this;
        this.model = model;
        this.view = view;
        this.view.subscribe('startGame', this.startGame.bind(this));
        this.view.subscribe('pauseGame', this.pauseGame.bind(this));
        this.view.subscribe('restartGame', this.restartGame.bind(this));
        this.view.subscribe('changeWidth', this.changeWidth.bind(this));
        this.view.subscribe('changeHeight', this.changeHeight.bind(this));
        this.view.subscribe('cellClicked', this.cellClicked.bind(this));

        window.onload = () => {
            this.model.boardInit();
            this.view.draw(this.model);
        };
    }
    toggleCellClass(model, cell: HTMLElement):void {
        this.view.toggleCellClass(model, cell);
    }
    startGame():void {
        this.timer = setInterval( () => {
            if (this.model.stop) {
                this.model.nextBoardState();
                this.view.draw(this.model);
            } else {
                alert('Game is over!');
                clearTimeout(this.timer);
                this.model.boardStates = [];
            }
        }, 1000);
    }
    pauseGame():void {
        clearTimeout(this.timer);
        this.model.stop = true;
        this.view.draw(this.model);
    }
    restartGame():void {
        clearTimeout(this.timer);
        this.model.boardInit();
        this.model.stop = true;
        this.view.draw(this.model);
    }
    changeHeight(newHeight: number):void {
        this.model.changeHeight(newHeight);
        this.view.draw(this.model);
    }
    changeWidth(newWidth: number):void {
        this.model.changeWidth(newWidth);
        this.view.draw(this.model);
    }
    cellClicked(cellKey: string):void {
        this.model.editLifeState(cellKey);
    }
}
