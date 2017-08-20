/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", { value: true });
	var model_1 = __webpack_require__(1);
	var model = new model_1.default(5, 3);
	model.boardInit();
	model.getBoard();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", { value: true });
	var Model = function () {
	    function Model(width, height) {
	        this.board = {};
	        this.width = width;
	        this.height = height;
	    }
	    Model.prototype.boardInit = function () {
	        for (var i = 0; i < this.width; i++) {
	            for (var j = 0; j < this.height; j++) {
	                this.board[getCellRepresentation(i, j)] = { x: i, y: j, alive: true };
	            }
	        }
	        return;
	    };
	    Model.prototype.getBoard = function () {
	        console.log(this.board);
	    };
	    return Model;
	}();
	exports.default = Model;
	function getCellRepresentation(x, y) {
	    return 'x' + x + 'y' + y;
	}

/***/ }
/******/ ]);