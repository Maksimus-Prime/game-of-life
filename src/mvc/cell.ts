import { ICell } from "./Interfaces";

class Cell implements ICell {
  public x: number;
  public y: number;
  public alive: boolean;
  constructor(x: number, y: number, alive: boolean) {
    this.x = x;
    this.y = y;
    this.alive = alive;
  }
}

export default Cell;
