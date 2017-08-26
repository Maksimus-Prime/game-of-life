import Model from './model';
import View from './view';


let model: Model = new Model(3, 3);
let view: View = new View(model);
model.boardInit();
view.draw(model.board);
//let result:object = model.getCellAt('x1y1');
//let resultNum:number = model.getAliveNeighbors('x1y1');
console.log(model.board);
//model.board["x0y0"]["alive"] = true;
//model.board["x0y1"]["alive"] = true;
//model.board["x0y2"]["alive"] = true;
//model.board["x1y0"]["alive"] = true;
//model.board["x1y1"]["alive"] = true;
//model.board["x1y2"]["alive"] = true;
//model.board["x2y0"]["alive"] = true;
//model.board["x2y1"]["alive"] = true;
//model.board["x2y2"]["alive"] = true;
//model.nextBoardState();
let result:object = model.getCellAt('x1y1');
let resultNum:number = model.getAliveNeighbors('x1y1');
console.log(result);

console.log(model.board);
console.log(resultNum);