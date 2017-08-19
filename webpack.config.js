"use strict";
const webpack = require("webpack");
var expect = require('expect.js');

module.exports = {
	entry: {
		model: ['./conway/model.ts'],
		app: './conway/app.ts'
	},
	output: {
		path: __dirname + "/conway/compiled/",
		filename: "[name].js"
	},

	watch: true,

	module: {
		loaders: [{
			test: /\.(js)$/,
			exclude: /node_modules/,
			loader: "babel-loader"
		}, {
			test: /\.(ts)$/,
			exclude: /node_modules/,
			loader: "babel-loader!ts-loader"
		}, {
			test: /\.pug$/,
			loader: "pug-loader",
			query: {
				pretty: true
			}
		}]
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery/dist/jquery.js",
			jQuery: "jquery/dist/jquery.js"
		})
	]
};