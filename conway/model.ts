export default class Model {
	listeners: object;
	constructor () {
		this.listeners = {listener: "sad"};
	}
	getListeners () {
		return this.listeners;
	}
}