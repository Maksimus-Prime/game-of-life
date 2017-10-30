import * as $ from "jquery";
import "./../jquery.tmpl.js";
import "./../jquery.tmpl.ts";

interface ICell {
    x: number;
    y: number;
    alive: boolean;
}
type CallBackData = number | string | void | undefined;
type CallbackSub = (data?: CallBackData) => void;
interface IBoard {
    [index: string]: ICell;
}
interface IPubsub {
    [index: string]: [(data?: CallBackData) => void];
}
type EventType = "click" | "blur";
class View {
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

        this.addPublisher(this.$startButton, "click", "startGame");
        this.addPublisher(this.$pauseButton, "click", "pauseGame");
        this.addPublisher(this.$restartButton, "click", "restartGame");
        this.addPublisher(this.$widthInput, "blur", "changeWidth", {passValue: true});
        this.addPublisher(this.$heightInput, "blur", "changeHeight", {passValue: true});
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
    public addPublisher(el: HTMLElement, eventType: EventType, publisherMessage: string, param?: {passValue: boolean}) {
        if (param && param.passValue) {
            $(el).on(eventType, (e: JQuery.Event) => {
                this.publish(publisherMessage, (e.currentTarget as HTMLInputElement).value);
            });
            return;
        }
        $(el).on(eventType, () => {
            this.publish(publisherMessage);
        });
    }
    public subscribe(eventName: string, fn: CallbackSub): void {
        this.pubsub[eventName] = this.pubsub[eventName] || [];
        this.pubsub[eventName].push(fn);
    }
    public unsubscribe(eventName: string, fn: CallbackSub): void {
        if (this.pubsub[eventName]) {
            for (let i: number = 0; i < this.pubsub[eventName].length; i++) {
                if (this.pubsub[eventName][i] === fn) {
                    this.pubsub[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }
    public publish(eventName: string, data?: CallBackData): void {
        if (this.pubsub[eventName]) {
            this.pubsub[eventName].forEach(function(fn: CallbackSub) {
                fn(data);
            });
        }
    }
    public getView() {
        return {
            draw: this.draw.bind(this),
            toggleCellClass: this.toggleCellClass.bind(this),
            subscribe: this.subscribe.bind(this),
            unsubscribe: this.unsubscribe.bind(this),
        };
    }
}

function objectLength(object: IBoard): number {
    return Object.keys(object).length;
}

export default View;
