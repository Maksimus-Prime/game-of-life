import equal = require("deep-equal");
import { IBoard } from "../mvc/Interfaces";

function getCellRepresentation(x: number, y: number): string {
  return "x" + x + "y" + y;
}

function objectsEqual(a: IBoard, b: IBoard): boolean {
  return equal(a, b);
}

export { getCellRepresentation, objectsEqual };
