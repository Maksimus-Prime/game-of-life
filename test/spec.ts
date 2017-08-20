import {} from 'mocha';
import * as chai from 'chai';
let expect = chai.expect;
import Model from './../src/model';

let model: Model;
model = new Model(5, 3);

describe('boardInit', () => {
	it('boardInit should be a function', () => {
		expect(model.boardInit).to.be.a('object');
	});
});