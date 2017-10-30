var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch:  true,
    singleRun: false,

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-sinon',
      'karma-mocha-reporter',
      'karma-chrome-launcher'
    ],

    frameworks: ['mocha', 'sinon'],

    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    
    files: [
      {pattern: 'test/*spec.ts', watched: true}
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
      'test/*spec.ts': ['webpack']
    }
  })
}