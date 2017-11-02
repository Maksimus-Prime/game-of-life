"use strict";
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: './src/app'
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js"
  },

  watch: true,

  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx', '.ts', '.tsx']
  },

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
      test: /\.(css)$/,
      loader: ExtractTextPlugin.extract("style-loader","css-loader")
    }, {
      test: /\.pug$/,
      loader: "pug-loader",
      query: {
        pretty: true
      }
    }]
  },
  devServer: {
    contentBase: __dirname,
    host: 'localhost',
    port: 3003
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.pug'
    }),
    new webpack.ProvidePlugin({
      $: "jquery/dist/jquery.js",
      jQuery: "jquery/dist/jquery.js"
    }),
    new ExtractTextPlugin("main.css", {allChunks: true})
  ]
};