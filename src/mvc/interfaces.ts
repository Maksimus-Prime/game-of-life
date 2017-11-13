export interface ICell {
  x: number;
  y: number;
  alive: boolean;
}
export interface IBoard {
  [index: string]: ICell;
}
export interface IModel {
  boardInit(): void;
  nextBoardState(): void;
  editCellAliveState(key: string): void;
  changeWidth(newWidth: number): void;
  changeHeight(newHeight: number): void;
  changeStopGame(stopGame: boolean): void;
  isGameStop(): boolean;
  getCurrentBoard(): IBoard;
  getBoardWidth(): number;
  clearBoardStates(): void;
}
export interface IDOMView {
  draw(board: IBoard, boardWidth: number): void;
  toggleCellClass(cell: HTMLHtmlElement): string | void;
  addPublisher(el: HTMLElement, eventType: PublisherEventType, publisherMessage: string, param?: {passValue: boolean}): void;
  getView(): IView;
  }
export interface IView {
  draw(board: IBoard, boardWidth: number): void;
  toggleCellClass(cell: HTMLHtmlElement): string | void;
  subscribe(eventName: string, fn: CallbackSub | CallbackSubNum | CallbackSubStr): void;
  unsubscribe(eventName: string, fn: CallbackSub | CallbackSubNum | CallbackSubStr): void;
}
export interface IController {
  init(): void;
  startGame(): void;
  pauseGame(): void;
  restartGame(): void;
  changeHeight(newHeight: number): void;
  changeWidth(newWidth: number): void;
  cellClicked(cellKey: string): void;
  setModel(model: IModel): void;
  setView(view: IView): void;
}
export type PublisherEventType = "click" | "blur";
export type CallbackSub = (data?: number | string | void) => void;
export type CallbackSubNum = (data: number) => void;
export type CallbackSubStr = (data: string) => void;
export interface IPubSub {
  subscribe(eventName: string, fn: CallbackSub): void;
  unsubscribe(eventName: string, fn: CallbackSub): void;
  publish(eventName: string, data?: string | number | void): void;
}
export interface IPubsubInner {
  [index: string]: [(data?: string | number | void) => void];
}
