import {} from 'mocha';
import * as chai from 'chai';
let expect = chai.expect;
import Model from '../conway/model';

let model: Model;
model = new Model();

describe('getListeners', () => {
	it('getListeners should be a function', () => {
		expect(model.getListeners).to.be.a('object');
	});
	it('getListeners should return an object', () => {
		expect(model.getListeners()).to.be.an('object');
	});
});