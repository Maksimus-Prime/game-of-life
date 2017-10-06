import Model from './mvc/model';
import View from './mvc/view';
import Controller from './mvc/controller';


let model: Model = new Model(5, 5);
let view: View = new View();
let controller: Controller = new Controller(model, view);