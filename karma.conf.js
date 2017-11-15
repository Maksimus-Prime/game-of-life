var webpackConfig = require("./webpack.config.js");

module.exports = function(config) {
  config.set({
    basePath: "",
    autoWatch:  true,
    singleRun: false,

    plugins: [
      "mocha",
      "karma-webpack",
      "karma-mocha",
      "karma-sinon",
      "karma-chrome-launcher",
      "karma-mocha-reporter"
    ],

    frameworks: ["mocha", "sinon"],

    mime: {
      "text/x-typescript": ["ts","tsx"]
    },
    
    files: [
      {pattern: "test/view.spec.ts", watched: true},
      {pattern: "test/**.spec.ts", watched: true}
    ],
    
    node: {
      fs: "empty"
    },
    watch: true,

    reporters: ["mocha"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity,
    browsers: ["Chrome"],
    webpack: webpackConfig,

    preprocessors: {
      "test/view.spec.ts": ["webpack"],
      "test/**.spec.ts": ["webpack"]
    },

    mochaReporter: {
      colors: {
        success: "blue",
        info: "bgGreen",
        warning: "cyan",
        error: "bgRed"
      }
    }
  });
};