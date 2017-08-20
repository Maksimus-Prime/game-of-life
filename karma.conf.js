var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-mocha-reporter',
      'karma-chrome-launcher'
    ],

    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      "test/spec.ts"
    ],

    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,

    webpack: webpackConfig,

    preprocessors: {
      "test/spec.ts": ['webpack']
    }
  })
}