import es6BindAll = require("es6bindall");
import {ICell} from "./interfaces";

class Cell implements ICell {
  public x: number;
  public y: number;
  public alive: boolean;
  private bindMethods: string[] = ["isAlive"];
  constructor(x: number, y: number, alive: boolean) {
    es6BindAll(this, this.bindMethods);
    this.x = x;
    this.y = y;
    this.alive = alive;
  }
  public isAlive(): boolean {
    return this.alive;
  }
}

export default Cell;
