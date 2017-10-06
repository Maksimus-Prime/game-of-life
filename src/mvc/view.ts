import * as $ from "jquery";
import "./../jquery.tmpl.ts";
import "./../jquery.tmpl.js";

export default class View {
    $startButton: HTMLButtonElement;
    $pauseButton: HTMLButtonElement;
    $restartButton: HTMLButtonElement;
    $widthInput: HTMLInputElement;
    $heightInput: HTMLInputElement;
    $cells: HTMLCollection;
    pubsub: object;
    updateCellClickHandlers: VoidFunction;
    constructor() {
        let self = this;
        this.pubsub = {};
        this.$startButton = $("#startButton")[0];
        this.$pauseButton = $("#pauseButton")[0];
        this.$restartButton = $("#restartButton")[0];
        this.$widthInput = $("#widthInput")[0];
        this.$heightInput = $("#heightInput")[0];
        
        $(this.$startButton).on('click', function () {
            self.publish('startGame');
        });
        $(this.$pauseButton).on('click', function () {
            self.publish('pauseGame');
        });
        $(this.$restartButton).on('click', function () {
            self.publish('restartGame');
        });
        $(this.$widthInput).on('blur', function () {
            self.publish('changeWidth', this.value);
        });
        $(this.$heightInput).on('blur', function () {
            self.publish('changeHeight', this.value);
        });
        this.updateCellClickHandlers = function () {
            this.$cells = $(".cell");
            $(this.$cells).on('click', function () {
                let cellKey = self.toggleCellClass(this);
                self.publish('cellClicked', cellKey);
            });
        }
    }
    draw(model):void {
        $("#board").html("");
        $.template("sample", '<i class="cell" id="' + 'x' + '${x}' + 'y' + '${y}"></i>');
        $.template("sampleDead", '<i class="cell dead" id="' + 'x' + '${x}' + 'y' + '${y}"></i>');
        let len: number = objectLength(model.board);
        for ( let key in model.board ) {
            if (model.board[key]["alive"]) {
                $.tmpl("sample", model.board[key]).appendTo("#board");
            } else {
                $.tmpl("sampleDead", model.board[key]).appendTo("#board");
            }
        }
        $("#board").attr("style", "width: " + (model.width * 20) + "px");
        this.updateCellClickHandlers();
    }
    toggleCellClass(cell: HTMLHtmlElement):string {
        $(cell).toggleClass("dead");
        let key: string = $(cell).attr("id");
        return key;
    }
    subscribe(eventName: string, fn):void {
        this.pubsub[eventName] = this.pubsub[eventName] || [];
        this.pubsub[eventName].push(fn);
    }
    unsubscribe(eventName: string, fn):void {
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
            this.pubsub[eventName].forEach(function(fn) {
                fn(data);
            });
        }
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