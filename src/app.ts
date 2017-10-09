import Model from './mvc/model';
import View from './mvc/view';
import Controller from './mvc/controller';
import * as $ from "jquery";

$(document).ready(() => {
    let model = (new Model(5,5)).getModelFacade();
    let view = (new View()).getViewFacade();
    let controller: Controller = new Controller();
    controller.setModel(model);
    controller.setView(view);
    controller.init();
});
