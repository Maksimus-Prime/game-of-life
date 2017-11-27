import Model from "./mvc/Model";
import View from "./mvc/View";
import Controller from "./mvc/Controller";
import * as $ from "jquery";

$(document).ready(() => {
  const model = (new Model(5,5)).getModel();
  const view = (new View()).getView();
  const controller: Controller = new Controller(model, view);
});
