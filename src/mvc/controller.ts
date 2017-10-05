import * as $ from "jquery";
import {events} from "./pubsub";

export default class Controller {
    public model: any;
    public view: any;
    constructor(model: any, view: any) {
        this.model = model;
        this.view = view;
        events.on("restartGame", this.restartGame.bind(this));
        events.on("startGame", this.startGame.bind(this));
        events.on("changeHeight", this.changeHeight.bind(this));
        events.on("changeWidth", this.changeWidth.bind(this));
        events.on("draw", this.draw.bind(this));
        events.on("toggleCellClass", this.toggleCellClass.bind(this));
        events.on("updateCellClickHandler", this.updateCellClickHandler.bind(this));
        
        this.model.boardInit();

        window.onload = () => {
            events.emit('draw');
            let timer: any;

            events.emit('updateCellClickHandler');

            this.view.startButton.click( () => {
                timer = setInterval( () => {
                    if (!this.model.stop) {
                        events.emit('startGame', true);
                    } else {
                        clearTimeout(timer);
                        events.emit('startGame', false);
                    }
                }, 1000);
            });
            this.view.pauseButton.click( () => {
                clearTimeout(timer);
                events.emit('draw');
                events.emit('updateCellClickHandler');
            });
            this.view.restartButton.click( () => {
                clearTimeout(timer);
                events.emit('restartGame');
                events.emit('updateCellClickHandler');
            });
            this.view.widthInput.blur( function() {
                if ($(this).val()) {
                    let newWidth = +$(this).val();
                    events.emit('changeWidth', newWidth);
                }
                events.emit('updateCellClickHandler');
            });
            this.view.heigthInput.blur( function() {
                if ($(this).val()) {
                    let newHeight = +$(this).val();
                    events.emit('changeHeight', newHeight);
                }
                events.emit('updateCellClickHandler');
            });
        };
    }
    draw() {
        this.view.draw();
    }
    toggleCellClass(cell) {
        this.view.toggleCellClass(cell);
    }
    startGame(start) {
        if(start) {
            this.model.nextBoardState();
            this.view.draw();            
        }else {
            alert("Game is over!");
            this.model.boardStates = [];      
        }
    }
    restartGame() {
        this.model.boardInit();
        this.model.stop = false;
        this.view.draw();
    }
    changeHeight(newHeight) {
        this.model.changeHeight(newHeight);
        this.view.draw();
    }
    changeWidth(newWidth) {
        this.model.changeWidth(newWidth);
        this.view.draw();
    }
    updateCellClickHandler() {
        this.view.cells.on("click", function () {
            let cell = $(this);
            events.emit('toggleCellClass', cell);
        });
    }
}
