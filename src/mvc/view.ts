import * as $ from "jquery";
import "./../jquery.tmpl.js";
import "./../jquery.tmpl.ts";
import "./view.css";

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
interface IView {
  draw(board: IBoard, boardWidth: number): void;
  toggleCellClass(cell: HTMLHtmlElement): string | void;
  subscribe(eventName: string, fn: CallbackSub): void;
  unsubscribe(eventName: string, fn: CallbackSub): void;
}
class View {
  private $startButton: HTMLButtonElement;
  private $pauseButton: HTMLButtonElement;
  private $restartButton: HTMLButtonElement;
  private $widthInput: HTMLInputElement;
  private $heightInput: HTMLInputElement;
  private $cells: JQuery<HTMLElement>;
  private pubsub: IPubsub;
  private updateCellClickHandlers: VoidFunction;
  private bindMethods: string[] = ["publish"];
  constructor() {
    this.pubsub = {};
    this.bindAllMethods(this, this.bindMethods);
    this.initDOMElements();
    this.initPublishers();
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
  public addPublisher(el: HTMLElement, eventType: EventType, publisherMessage: string, handler: any, param?: {passValue: boolean}) {
    if (param && param.passValue) {
      $(el).on(eventType, (e: JQuery.Event) => {
        handler(publisherMessage, (e.currentTarget as HTMLInputElement).value);
      });
      return;
    }
    $(el).on(eventType, () => {
      handler(publisherMessage);
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
  private bindAllMethods(context: any, methodNames: string[]): void {
    methodNames.map(function(methodName: string) {
      context[methodName] = context[methodName].bind(context);
    });
  }
  private initPublishers(): void {
    this.addPublisher(this.$startButton, "click", "startGame", this.publish);
    this.addPublisher(this.$pauseButton, "click", "pauseGame", this.publish);
    this.addPublisher(this.$restartButton, "click", "restartGame", this.publish);
    this.addPublisher(this.$widthInput, "blur", "changeWidth", this.publish, {passValue: true});
    this.addPublisher(this.$heightInput, "blur", "changeHeight", this.publish, {passValue: true});
    this.updateCellClickHandlers = function() {
      this.$cells = $(".cell");
      $(this.$cells).on("click", (e: JQuery.Event) => {
        const cellKey = this.toggleCellClass(e.currentTarget as HTMLHtmlElement);
        this.publish("cellClicked", cellKey);
      });
    };
  }
  private initDOMElements(): void {
    this.$startButton = $("#startButton")[0] as HTMLButtonElement;
    this.$pauseButton = $("#pauseButton")[0] as HTMLButtonElement;
    this.$restartButton = $("#restartButton")[0] as HTMLButtonElement;
    this.$widthInput = $("#widthInput")[0] as HTMLInputElement;
    this.$heightInput = $("#heightInput")[0] as HTMLInputElement;
  }
  public getView(): IView {
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
