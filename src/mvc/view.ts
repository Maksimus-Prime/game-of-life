import * as $ from "jquery";
import "./../jquery.tmpl.js";
import "./../jquery.tmpl.ts";
interface ICell {
    x: number;
    y: number;
    alive: boolean;
}
interface IBoard {
    [index: string]: ICell;
}
interface IPubsub {
    [index: string]: any;
}
interface IMyEventTarget extends EventTarget {
    value: number;
}
export default class View {
    private $startButton: HTMLButtonElement;
    private $pauseButton: HTMLButtonElement;
    private $restartButton: HTMLButtonElement;
    private $widthInput: HTMLInputElement;
    private $heightInput: HTMLInputElement;
    private $cells: JQuery<HTMLElement>;
    private pubsub: IPubsub;
    private updateCellClickHandlers: VoidFunction;
    constructor() {
        const self = this;
        this.pubsub = {};
        this.$startButton = $("#startButton")[0] as HTMLButtonElement;
        this.$pauseButton = $("#pauseButton")[0] as HTMLButtonElement;
        this.$restartButton = $("#restartButton")[0] as HTMLButtonElement;
        this.$widthInput = $("#widthInput")[0] as HTMLInputElement;
        this.$heightInput = $("#heightInput")[0] as HTMLInputElement;

        this.addPublisher(self, this.$startButton, "click", "startGame");
        this.addPublisher(self, this.$pauseButton, "click", "pauseGame");
        this.addPublisher(self, this.$restartButton, "click", "restartGame");
        this.addPublisher(self, this.$widthInput, "blur", "changeWidth", {passValue: true});
        this.addPublisher(self, this.$heightInput, "blur", "changeHeight", {passValue: true});
        this.updateCellClickHandlers = function() {
            this.$cells = $(".cell");
            $(this.$cells).on("click", function() {
                const cellKey = self.toggleCellClass(this as HTMLHtmlElement);
                self.publish("cellClicked", cellKey);
            });
        };
    }
    public draw(board: IBoard, boardWidth: number): void {
        $("#board").html("");
        $.template("sample", '<i class="cell" id="' + "x" + "${x}" + "y" + '${y}"></i>');
        $.template("sampleDead", '<i class="cell dead" id="' + "x" + "${x}" + "y" + '${y}"></i>');
        const len: number = objectLength(board);
        for ( const key in board ) {
            if (board[key].alive) {
                $.tmpl("sample", board[key]).appendTo("#board");
            } else {
                $.tmpl("sampleDead", board[key]).appendTo("#board");
            }
        }
        $("#board").attr("style", "width: " + (boardWidth * 20) + "px");
        this.updateCellClickHandlers();
    }
    public toggleCellClass(cell: HTMLHtmlElement): string | void {
        $(cell).toggleClass("dead");
        const checkUndefined: string | undefined = $(cell).attr("id");
        if (checkUndefined !== void 0) {
            const key: string = checkUndefined;
            return key;
        }
    }
    public addPublisher(context: any, el: HTMLElement, eventType: string, publisherMessage: string, param?: {passValue: boolean}) {
        if (param && param.passValue) {
            $(el).on(eventType, function(e: Event) {
                context.publish(publisherMessage, (e.currentTarget as IMyEventTarget).value);
            });
            return;
        }
        $(el).on(eventType, function() {
            context.publish(publisherMessage);
        });
    }
    public subscribe(eventName: string, fn: (data?: any) => void): void {
        this.pubsub[eventName] = this.pubsub[eventName] || [];
        this.pubsub[eventName].push(fn);
    }
    public unsubscribe(eventName: string, fn: (data?: any) => void): void {
        if (this.pubsub[eventName]) {
            for (let i: number = 0; i < this.pubsub[eventName].length; i++) {
                if (this.pubsub[eventName][i] === fn) {
                    this.pubsub[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }
    public publish(eventName: string, data?: any): void {
        if (this.pubsub[eventName]) {
            this.pubsub[eventName].forEach(function(fn: (data?: any) => void) {
                fn(data);
            });
        }
    }
    public getViewFacade() {
        return {
            draw: this.draw.bind(this),
            toggleCellClass: this.toggleCellClass.bind(this),
            subscribe: this.subscribe.bind(this),
            unsubscribe: this.unsubscribe.bind(this),
        };
    }
}

function objectLength( object: any): number {
    let length: number = 0;
    for ( const key in object ) {
        if ( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}
