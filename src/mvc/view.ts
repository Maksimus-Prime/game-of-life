import * as $ from "jquery";
import "./../jquery.tmpl.ts";
import "./../jquery.tmpl.js";
interface ICell {
    x: number;
    y: number;
    alive: boolean;
}
interface IBoard {
    [index: string]: ICell
}
interface IPubsub {
    [index: string]: any 
}
export default class View {
    $startButton: HTMLButtonElement;
    $pauseButton: HTMLButtonElement;
    $restartButton: HTMLButtonElement;
    $widthInput: HTMLInputElement;
    $heightInput: HTMLInputElement;
    $cells: JQuery<HTMLElement>;
    pubsub: IPubsub;
    updateCellClickHandlers: VoidFunction;
    constructor() {
        let self = this;
        this.pubsub = {};
        this.$startButton = $("#startButton")[0] as HTMLButtonElement;
        this.$pauseButton = $("#pauseButton")[0] as HTMLButtonElement;
        this.$restartButton = $("#restartButton")[0] as HTMLButtonElement;
        this.$widthInput = $("#widthInput")[0] as HTMLInputElement;
        this.$heightInput = $("#heightInput")[0] as HTMLInputElement;
        
        this.addPublisher(self, this.$startButton, 'click', 'startGame');
        this.addPublisher(self, this.$pauseButton, 'click', 'pauseGame');
        this.addPublisher(self, this.$restartButton, 'click', 'restartGame');
        this.addPublisher(self, this.$widthInput, 'blur', 'changeWidth', {passValue: true});
        this.addPublisher(self, this.$heightInput, 'blur', 'changeHeight', {passValue: true});
        this.updateCellClickHandlers = function () {
            this.$cells = $(".cell");
            $(this.$cells).on('click', function () {
                let cellKey = self.toggleCellClass(this);
                self.publish('cellClicked', cellKey);
            });
        }
    }
    draw(board: IBoard, boardWidth: number):void {
        $("#board").html("");
        $.template("sample", '<i class="cell" id="' + 'x' + '${x}' + 'y' + '${y}"></i>');
        $.template("sampleDead", '<i class="cell dead" id="' + 'x' + '${x}' + 'y' + '${y}"></i>');
        let len: number = objectLength(board);
        for ( let key in board ) {
            if (board[key]["alive"]) {
                $.tmpl("sample", board[key]).appendTo("#board");
            } else {
                $.tmpl("sampleDead", board[key]).appendTo("#board");
            }
        }
        $("#board").attr("style", "width: " + (boardWidth * 20) + "px");
        this.updateCellClickHandlers();
    }
    toggleCellClass(cell: HTMLHtmlElement):string {
        $(cell).toggleClass("dead");
        let key: string = $(cell).attr("id");
        return key;
    }
    addPublisher(context: any, el: HTMLElement, eventType: string, publisherMessage: string, param?: {passValue: boolean}) {
        if(param && param.passValue) {
            $(el).on(eventType, function (e) {
                context.publish(publisherMessage, e.currentTarget.value);
            });
            return;
        }
        $(el).on(eventType, function () {
            context.publish(publisherMessage);
        });
    }
    subscribe(eventName: string, fn: (data?:any) => void):void {
        this.pubsub[eventName] = this.pubsub[eventName] || [];
        this.pubsub[eventName].push(fn);
    }
    unsubscribe(eventName: string, fn: (data?:any) => void):void {
        if(this.pubsub[eventName]) {
            for (let i: number = 0; i < this.pubsub[eventName].length; i++) {
                if(this.pubsub[eventName][i] === fn) {
                    this.pubsub[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }
    publish(eventName: string, data?: any):void {
        if(this.pubsub[eventName]) {
            this.pubsub[eventName].forEach(function(fn: (data?:any) => void) {
                fn(data);
            });
        }
    }
    getViewFacade() {
        return {
            draw: this.draw.bind(this),
            toggleCellClass: this.toggleCellClass.bind(this),
            subscribe: this.subscribe.bind(this),
            unsubscribe: this.unsubscribe.bind(this)
        };
    }
}

function objectLength( object: any): number {
    let length: number = 0;
    for ( let key in object ) {
        if ( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}