export default class Controller {
	model: object;
	view: object;
	constructor (model: object, view: object) {
		this.model = model;
		this.view = view;
	}
}