"use strict";
const webpack = require("webpack");
var expect = require('expect.js');

module.exports = {
	entry: {
		app: './src/app'
	},
	output: {
		path: __dirname + "/src/compiled/",
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

	resolve: {
		modules: [
			'src',
			'node_modules'
		],
		extensions: ['.json', '.js', '.jsx', '.ts', '.tsx']
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery/dist/jquery.js",
			jQuery: "jquery/dist/jquery.js"
		})
	]
};