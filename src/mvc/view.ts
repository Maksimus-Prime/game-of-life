import * as $ from "jquery";
import "./../vendor/jquery.tmpl.js";
import "./../vendor/jquery.tmpl.ts";
import "./view.css";
import es6BindAll = require("es6bindall");
import Pubsub from "./../pubsub/Pubsub";
import { IBoard, IView, IDOMView, IPubSub, PublisherEventType } from "./interfaces";

class View implements IDOMView {
  private startButton: HTMLButtonElement;
  private pauseButton: HTMLButtonElement;
  private restartButton: HTMLButtonElement;
  private widthInput: HTMLInputElement;
  private heightInput: HTMLInputElement;
  private $cells: JQuery<HTMLElement>;
  private $board: JQuery<HTMLElement>;
  private pubsub: IPubSub;
  private errorMessage: HTMLParagraphElement;
  private updateCellClickHandlers: VoidFunction;
  private bindMethods: string[] = ["draw", "toggleCellClass", "toggleDisplayErrorMessage"];
  constructor() {
    this.pubsub = new Pubsub();
    es6BindAll(this, this.bindMethods);
    this.initDOMElements();
    this.initPublishers();
  }
  public draw(board: IBoard, boardWidth: number): void {
    this.$board.html("");
    $.template("sample", "<i class=\"cell\" id=\"" + "x" + "${x}" + "y" + "${y}\"></i>");
    $.template("sampleDead", "<i class=\"cell dead\" id=\"" + "x" + "${x}" + "y" + "${y}\"></i>");
    Object.keys(board).map((cell) => {
      if (board[cell].alive) {
        $.tmpl("sample", board[cell]).appendTo("#board");
      } else {
        $.tmpl("sampleDead", board[cell]).appendTo("#board");
      }
    });
    this.$board.attr("style", "width: " + (boardWidth * 20) + "px");
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
  public addPublisher(el: HTMLElement, eventType: PublisherEventType, publisherMessage: string, param?: {passValue: boolean}): void {
    if (param && param.passValue) {
      $(el).on(eventType, (e: JQuery.Event) => {
        this.pubsub.publish(publisherMessage, (e.currentTarget as HTMLInputElement).value);
      });
      return;
    }
    $(el).on(eventType, () => {
      this.pubsub.publish(publisherMessage);
    });
  }
  public toggleDisplayErrorMessage(gameStopStatus: boolean): void {
    const className: string = "error-message_display";
    (gameStopStatus) ? $(this.errorMessage).addClass(className) : $(this.errorMessage).removeClass(className);
  }
  public getView(): IView {
    return {
      draw: this.draw,
      toggleCellClass: this.toggleCellClass,
      toggleDisplayErrorMessage: this.toggleDisplayErrorMessage,
      subscribe: this.pubsub.subscribe,
      unsubscribe: this.pubsub.unsubscribe,
    };
  }
  private initPublishers(): void {
    this.addPublisher(this.startButton, "click", "startGame");
    this.addPublisher(this.pauseButton, "click", "pauseGame");
    this.addPublisher(this.restartButton, "click", "restartGame");
    this.addPublisher(this.widthInput, "blur", "changeWidth", { passValue: true });
    this.addPublisher(this.heightInput, "blur", "changeHeight", { passValue: true });
    this.updateCellClickHandlers = function () {
      this.$cells = $(".cell");
      $(this.$cells).on("click", (e: JQuery.Event) => {
        const cellKey = this.toggleCellClass(e.currentTarget as HTMLHtmlElement);
        this.pubsub.publish("cellClicked", cellKey);
      });
    };
  }
  private initDOMElements(): void {
    this.startButton = $("#startButton")[0] as HTMLButtonElement;
    this.pauseButton = $("#pauseButton")[0] as HTMLButtonElement;
    this.restartButton = $("#restartButton")[0] as HTMLButtonElement;
    this.widthInput = $("#widthInput")[0] as HTMLInputElement;
    this.heightInput = $("#heightInput")[0] as HTMLInputElement;
    this.$board = $("#board");
    this.errorMessage = this.createErrorMessage();
  }
  private createErrorMessage(): HTMLParagraphElement {
    const errorMessage = document.createElement("p");
    $(errorMessage).addClass("error-message");
    $(errorMessage).text("Game is over!");
    $(document.body).append(errorMessage);
    return errorMessage;
  }
}

function objectLength(object: IBoard): number {
  return Object.keys(object).length;
}

export default View;
