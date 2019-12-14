() => banner/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _extend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _extend_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_extend_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _VertexAttr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _VertexAttr_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_VertexAttr_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _VertexListeners_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _VertexListeners_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_VertexListeners_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Vertex_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _Vertex_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Vertex_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Grid_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony import */ var _Grid_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Grid_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Line_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8);
/* harmony import */ var _Line_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Line_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Vector_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var _Vector_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_Vector_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _CubicBezierCurve_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(10);
/* harmony import */ var _CubicBezierCurve_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_CubicBezierCurve_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _BezierPath_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(11);
/* harmony import */ var _BezierPath_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_BezierPath_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Polygon_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(12);
/* harmony import */ var _Polygon_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_Polygon_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _Triangle_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(13);
/* harmony import */ var _Triangle_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Triangle_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _VEllipse_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(14);
/* harmony import */ var _VEllipse_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_VEllipse_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _PBImage_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(15);
/* harmony import */ var _PBImage_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_PBImage_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _MouseHandler_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(16);
/* harmony import */ var _MouseHandler_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_MouseHandler_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _KeyHandler_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(17);
/* harmony import */ var _KeyHandler_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_KeyHandler_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _draw_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(18);
/* harmony import */ var _draw_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_draw_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _PlotBoilerplate_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(19);
/* harmony import */ var _PlotBoilerplate_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_PlotBoilerplate_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _PlotBoilerplate_RectSelector_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(20);
/* harmony import */ var _PlotBoilerplate_RectSelector_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_PlotBoilerplate_RectSelector_js__WEBPACK_IMPORTED_MODULE_17__);























/***/ }),
/* 3 */
/***/ (function(module, exports) {

// A helper function for a simple class inheritance.

Object.extendClass = function( superClass, subClass ) {
    // Copy class functions/attributes.
    var propNames = Object.getOwnPropertyNames(superClass.prototype);
    for( var i in propNames ) {
	var e = propNames[i];
	// console.log(e);
	if( superClass.prototype.hasOwnProperty(e) && e !== Object.extendClass )
	    subClass.prototype[e] = superClass.prototype[e]; 
    }
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * @classdesc The VertexAttr is a helper class to wrap together additional attributes
 * to vertices that do not belong to the 'standard canonical' vertex implementation.<br>
 * <br>
 * This is some sort of 'userData' object, but the constructor uses a global model
 * to obtain a (configurable) default attribute set to all instances.<br>
 *
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-11-17 Added the 'isSelected' attribute.
 * @modified 2018-11-27 Added the global model for instantiating with custom attributes.
 * @modified 2019-03-20 Added JSDoc tags.
 * @version  1.0.3
 *
 * @file VertexAttr
 * @public
 **/

(function(_context) {
    "use strict";

    
    /**
     * The constructor.
     *
     * Attributes will be initialized as defined in the model object 
     * which serves as a singleton.
     *
     * @constructor
     * @name VertexAttr
     **/
    var VertexAttr = function() {
	this.draggable = true;
	this.isSelected = false;

	for( var key in VertexAttr.model ) 
	    this[key] = VertexAttr.model[key];
    };


    /**
     * This is the global attribute model. Set these object on the initialization
     * of your app to gain all VertexAttr instances have these attributes.
     *
     * @type {object}
     **/
    VertexAttr.model = {
	draggable : true,
	isSelected : false
    };

    // Export constructor to context.
    _context.VertexAttr = VertexAttr;
    
})(window);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * @classdesc An event listeners wrapper. This is just a set of three listener 
 *              queues (drag, dragStart, dragEnd) and their respective firing
 *              functions.
 *
 * @author   Ikaros Kappler
 * @date     2018-08-27
 * @modified 2018-11-28 Added the vertex-param to the constructor and extended the event. Vertex events now have a 'params' attribute object.
 * @modified 2019-03-20 Added JSDoc tags.
 * @version  1.0.2
 *
 * @file VertexListeners
 * @public
 **/

(function(_context) {
    "use strict";


    /**
     * The constructor.
     *
     * @constructor
     * @name VertexListeners
     * @param {Vertex} vertex - The vertex to use these listeners on (just a backward reference).
     **/
    var VertexListeners = function( vertex ) {
	this.drag = [];
	this.dragStart = [];
	this.dragEnd = [];
	this.vertex = vertex;
    };


    /**
     * Add a drag listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to add (a callback).
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragListener = function( listener ) {
	this.drag.push( listener );
    };
    /**
     * The drag listener is a function with a single drag event param.
     * @callback VertexListeners~dragListener
     * @param {Event} e - The (extended) drag event.
     */
    

    
    /**
     * Add a dragStart listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragStartListener} listener - The drag-start listener to add (a callback).
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragStartListener = function( listener ) {
	this.dragStart.push( listener );
    };
    /**
     * The drag-start listener is a function with a single drag event param.
     * @callback VertexListeners~dragStartListener
     * @param {Event} e - The (extended) drag event.
     */

    
 
    /**
     * Add a dragEnd listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragEndListener} listener - The drag-end listener to add (a callback).
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragEndListener = function( listener ) {
	this.dragEnd.push( listener );
    };
    /**
     * The drag-end listener is a function with a single drag event param.
     * @callback VertexListeners~dragEndListener
     * @param {Event} e - The (extended) drag event.
     */

    

 
    /**
     * Fire a drag event with the given event instance to all
     * installed drag listeners.
     *
     * @method fireDragEvent
     * @param {Event} e - The drag event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragEvent = function( e ) {
	_fireEvent(this,this.drag,e);
    };


    
    /**
     * Fire a dragStart event with the given event instance to all
     * installed drag-start listeners.
     *
     * @method fireDragStartEvent
     * @param {Event} e - The drag-start event itself to be fired to all installed dragStart listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragStartEvent = function( e ) {
	_fireEvent(this,this.dragStart,e);
    };


    
    /**
     * Fire a dragEnd event with the given event instance to all
     * installed drag-end listeners.
     *
     * @method fireDragEndEvent
     * @param {Event} e - The drag-end event itself to be fired to all installed dragEnd listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragEndEvent = function( e ) {
	_fireEvent(this,this.dragEnd,e);
    };


    
    /**
     * @private
     **/
    var _fireEvent = function( _self, listeners, e ) {
	if( typeof e.params == 'undefined' )
	    e.params = {};
	e.params.vertex = _self.vertex;
	for( var i in listeners ) {
	    listeners[i]( e );
	}
    };

    // Export constructor to context.
    _context.VertexListeners = VertexListeners;
    
})(window);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A vertex is a pair of two numbers.<br>
 * <br>
 * It is used to identify a 2-dimensional point on the x-y-plane.
 *
 * @requires VertexAttr
 * 
 * @author   Ikaros Kappler
 * @date     2012-10-17
 * @modified 2018-04-03 Refactored the code of october 2012 into a new class.
 * @modified 2018-04-28 Added some documentation.
 * @modified 2018-08-16 Added the set() function.
 * @modified 2018-08-26 Added VertexAttr.
 * @modified 2018-10-31 Extended the constructor by object{x,y}.
 * @modified 2018-11-19 Extended the set(number,number) function to set(Vertex).
 * @modified 2018-11-28 Added 'this' to the VertexAttr constructor.
 * @modified 2018-12-05 Added the sub(...) function. Changed the signature of the add() function! add(Vertex) and add(number,number) are now possible.
 * @modified 2018-12-21 (It's winter solstice) Added the inv()-function.
 * @modified 2019-01-30 Added the setX(Number) and setY(Number) functions.
 * @modified 2019-02-19 Added the difference(Vertex) function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-24 Added the randomVertex(ViewPort) function.
 * @modified 2019-11-07 Added toSVGString(object) function.
 * @modified 2019-11-18 Added the rotate(number,Vertex) function.
 * @modified 2019-11-21 Fixed a bug in the rotate(...) function (elements were moved).
 * @version  2.2.1
 *
 * @file Vertex
 * @public
 **/


(function(_context) {
    'use strict';

    /**
     * An epsilon for comparison
     *
     * @private
     **/
    var EPSILON = 1.0e-6;


    /**
     * The constructor for the vertex class.
     *
     * @constructor
     * @name Vertex
     * @param {number} x - The x-coordinate of the new vertex.
     * @param {number} y - The y-coordinate of the new vertex.
     **/
    var Vertex = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x = x.x;
	    this.y = x.y;
	} else {
	    if( typeof x == 'undefined' ) x = 0;
	    if( typeof y == 'undefined' ) y = 0;
	    this.x = x;
	    this.y = y;
	}
	this.attr = new VertexAttr();
	this.listeners = new VertexListeners( this );
    };


    /** 
     * @member {Vertex} 
     * @memberof Vertex
     * @instance
     */
    Vertex.prototype.x = null;

    /** 
     * @member {Vertex} 
     * @memberof Vertex
     * @instance
     */
    Vertex.prototype.y = null;


    /**
     * Set the x- and y- component of this vertex.
     *
     * @method set
     * @param {number} x - The new x-component.
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.set = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x = x.x;
	    this.y = x.y;
	} else {
	    this.x = x;
	    this.y = y;
	}
	return this;
    };


    /**
     * Set the x-component of this vertex.
     *
     * @method setX
     * @param {number} x - The new x-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.setX = function( x ) {
	this.x = x;
	return this;
    };


    /**
     * Set the y-component of this vertex.
     *
     * @method setY
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.setY = function( y ) {
	this.y = y;
	return this;
    };
    

    /**
     * Add the passed amount to x- and y- component of this vertex.<br>
     * <br>
     * This function works with add( {number}, {number} ) and 
     * add( {Vertex} ), as well.
     *
     * @method add
     * @param {(number|Vertex)} x - The amount to add to x (or a vertex itself).
     * @param {number=} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.add = function( x, y ) {
	if( typeof x == 'number' ) {
	    this.x += x;
	    if( typeof y == 'number' )
		this.y += y;
	} else {
	    this.x += x.x;
	    this.y += x.y;
	}
	return this;
    };


    /**
     * Add the passed amounts to the x- and y- components of this vertex.
     * 
     * @method addXY
     * @param {number} x - The amount to add to x.
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.addXY = function( amountX, amountY ) {
	this.x += amountX;
	this.y += amountY;
	return this;
    };


    /**
     * Substract the passed amount from x- and y- component of this vertex.<br>
     * <br>
     * This function works with sub( {number}, {number} ) and 
     * sub( {Vertex} ), as well.
     *
     * @method sub
     * @param {(number|Vertex)} x - The amount to substract from x (or a vertex itself).
     * @param {number=} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.sub = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x -= x.x;
	    this.y -= x.y;
	} else {
	    this.x -= x;
	    this.y -= y;
	}
	return this;
    };
    
    
    /**
     * Check if this vertex equals the passed one.
     * <br>
     * This function uses an internal epsilon as tolerance.
     *
     * @method equals
     * @param {Vertex} vertex - The vertex to compare this with.
     * @return {boolean}
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.equals = function( vertex ) {
	var eqX =  (Math.abs(this.x-vertex.x) < EPSILON);
	var eqY =  (Math.abs(this.y-vertex.y) < EPSILON);
	var result = eqX && eqY;
	return result;
    };


    /**
     * Create a copy of this vertex.
     * 
     * @method clone
     * @return {Vertex} A new vertex, an exact copy of this.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.clone = function() {
	return new Vertex(this.x,this.y);
    };


    /**
     * Get the distance to the passed point (in euclidean metric)
     *
     * @method distance
     * @param {Vertex} vert - The vertex to measure the distance to.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.distance = function( vert ) {
	return Math.sqrt( Math.pow(vert.x-this.x,2) + Math.pow(vert.y-this.y,2) );
    };


    /**
     * Get the difference to the passed point.<br>
     * <br>
     * The difference is (vert.x-this.x, vert.y-this.y).
     *
     * @method difference
     * @param {Vertex} vert - The vertex to measure the x-y-difference to.
     * @return {Vertex} A new vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.difference = function( vert ) {
	return new Vertex( vert.x-this.x, vert.y-this.y );
    };


    /**
     * This is a vector-like behavior and 'scales' this vertex
     * towards/from a given center.
     *
     * @method scale
     * @param {number} factor - The factor to 'scale' this vertex; 1.0 means no change.
     * @param {Vertex=} center - The origin of scaling; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.scale = function( factor, center ) {
	if( !center || typeof center === "undefined" )
	    center = new Vertex(0,0);
	this.x = center.x + (this.x-center.x)*factor;
	this.y = center.y + (this.y-center.y)*factor; 
	return this;
    };


    /**
     * This is a vector-like behavior and 'rotates' this vertex
     * around given center.
     *
     * @method rotate
     * @param {number} angle - The angle to 'rotate' this vertex; 0.0 means no change.
     * @param {Vertex=} center - The center of rotation; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.rotate = function( angle, center ) {
	if( !center || typeof center === "undefined" )
	    center = new Vertex(0,0);
	this.sub( center );
	angle += Math.atan2(this.y,this.x);
	// console.log( angle );
	let len = this.distance({x:0,y:0});
	let lenX = this.x;
	let lenY = this.y;
	//this.x = ( Math.cos(angle) * len + Math.sin(angle) * len);
	//this.y = ( -Math.sin(angle) * len + Math.cos(angle) * len);
	//this.x = ( Math.cos(angle) * lenX - Math.sin(angle) * lenY);
	//this.y = ( Math.sin(angle) * lenX + Math.cos(angle) * lenY);
	this.x = len * Math.cos(angle);
	this.y = len * Math.sin(angle);
	this.add( center );
	return this;
    };

    /**
     * Multiply both components of this vertex with the given scalar.<br>
     * <br>
     * Note: as in<br>
     *    https://threejs.org/docs/#api/math/Vector2.multiplyScalar
     *
     * @method multiplyScalar
     * @param {number} scalar - The scale factor; 1.0 means no change.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.multiplyScalar = function( scalar ) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
    };


    /**
     * Round the two components x and y of this vertex.
     *
     * @method round
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.round = function() {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this;
    };


    /**
     * Change this vertex (x,y) to its inverse (-x,-y).
     *
     * @method inv
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.inv = function() {
	this.x = -this.x;
	this.y = -this.y;
	return this;
    };
    
    
    /**
     * Get a string representation of this vertex.
     *
     * @method toString
     * @return {string} The string representation of this vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.toString = function() {
	return '('+this.x+','+this.y+')';
    };


    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<circle' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' cx="' + this.x + '"' );
	buffer.push( ' cy="' + this.y + '"' );
	buffer.push( ' r="2"' );
	buffer.push( ' />' );
	return buffer.join('');
    };
    // END Vertex


    /**
     * Create a new random vertex inside the given viewport.
     *
     * @param {ViewPort} viewPort - A {min:Vertex, max:Vertex} viewport specifying the bounds.
     * @return A new vertex with a random position.
     **/
    Vertex.randomVertex = function( viewPort ) {
	return new Vertex( viewPort.min.x + Math.random()*(viewPort.max.x-viewPort.min.x),
			   viewPort.min.y + Math.random()*(viewPort.max.y-viewPort.min.y)
			 );
    };
    
    
    _context.Vertex = Vertex;

})( window ? window : module.export );

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A grid class with vertical and horizontal lines.
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-09 Added the utils: baseLog(Number,Number) and mapRasterScale(Number,Number).
 * @version  1.0.1
 *
 * @file Grid
 * @fileoverview Note that the PlotBoilerplate already has a Grid instance member. The Grid is not meant 
 *               to be added to the canvas as a drawable as it encapsulates more an abstract concept of the canvas
 *               rather than a drawable object.
 * @public
 **/

(function(_context) {

    /**
     * The constructor.
     *
     * @constructor
     * @name Grid
     * @param {Vertex} center - The offset of the grid (default is [0,0]).
     * @param {Vertex} size   - The x- and y-size of the grid.
     **/
    var Grid = function( center, size ) {
	this.center = center;
	this.size = size;
    };

    /** 
     * @member {Vertex} 
     * @memberof Grid
     * @instance
     */
    Grid.prototype.center = null;

    /** 
     * @member {Vertex} 
     * @memberof Grid
     * @instance
     */
    Grid.prototype.size = null;
    


    /**
     * @memberof Grid
     **/
    Grid.utils = {

	/**
	 * Calculate the logarithm of the given number (num) to a given base.<br>
	 * <br>
	 * This function returns the number l with<br>
	 *  <pre>num == Math.pow(base,l)</pre>
	 *
	 * @member baseLog
	 * @function
	 * @memberof Grid
	 * @inner
	 * @param {number} base - The base to calculate the logarithm to.
	 * @param {number} num  - The number to calculate the logarithm for.
	 * @return {number} <pre>log(base)/log(num)</pre>
	 **/
	baseLog : function(base,num) { return Math.log(base) / Math.log(num); },


	/**
	 * Calculate the raster scale for a given logarithmic mapping.<br>
	 * <br>
	 * Example (with adjustFactor=2):<br>
	 * <pre>
	 * If scale is 4.33, then the mapping is 1/2 (because 2^2 <= 4.33 <= 2^3)<br>
	 * If scale is 0.33, then the mapping is 2 because (2^(1/2) >= 0.33 >= 2^(1/4)
	 * </pre>
	 *
	 * @member mapRasterScale
	 * @function
	 * @memberof Grid
	 * @inner
	 * @param {number} adjustFactor The base for the logarithmic raster scaling when zoomed.
	 * @param {number} scale        The currently used scale factor.
	 * @return {number} 
	 **/
	mapRasterScale : function( adjustFactor, scale ) {
	    var gf = 1.0;
	    if( scale >= 1 ) {
		gf = Math.abs( Math.floor( 1/Grid.utils.baseLog(adjustFactor,scale) ) );
		gf = 1 / Math.pow( adjustFactor, gf );
	    } else {
		gf = Math.abs( Math.floor( Grid.utils.baseLog(1/adjustFactor,1/(scale+1)) ) );
		//gf = Math.pow( adjustFactor, gf );
	    }
	    return gf;
	}
    };

    _context.Grid = Grid;
    
    
})(window ? window : module.export );

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A line consists of two vertices a and b.<br>
 * <br>
 * This is some refactored code from my 'Morley Triangle' test<br>
 *   https://github.com/IkarosKappler/morleys-trisector-theorem
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2016-03-12
 * @modified 2018-12-05 Refactored the code from the morley-triangle script.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-28 Fixed a bug in the Line.sub( Vertex ) function (was not working).
 * @modified 2019-09-02 Added the Line.add( Vertex ) function.
 * @modified 2019-09-02 Added the Line.denominator( Line ) function.
 * @modified 2019-09-02 Added the Line.colinear( Line ) function.
 * @modified 2019-09-02 Fixed an error in the Line.intersection( Line ) function (class Point was renamed to Vertex).
 * @version  2.0.4
 *
 * @file Line
 * @public
 **/


(function(_context) {

    /**
     * Creates an instance of Line.
     *
     * @constructor
     * @name Line
     * @param {Vertex} a The line's first point.
     * @param {Vertex} b The line's second point.
     **/
    var Line = function( a, b ) {
	this.a = a;
	this.b = b;
    };


    /** 
     * @member {Vertex} 
     * @memberof Line
     * @instance
     */
    Line.prototype.a = null;

    /** 
     * @member {Vertex} 
     * @memberof Line
     * @instance
     */
    Line.prototype.b = null;
    

    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof Line
     **/
    Line.prototype.length = function() {
	return Math.sqrt( Math.pow(this.b.x-this.a.x,2) + Math.pow(this.b.y-this.a.y,2) );
    };


    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @return {Line} this (for chaining)
     **/
    Line.prototype.setLength = function( length ) {
	return this.scale( length/this.length() );
    };
    
    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {Vertex} amount The amount (x,y) to substract.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    Line.prototype.sub = function( amount ) {
	this.a.sub( amount );
	this.b.sub( amount );
	return this;
    };


    /**
     * Add the given vertex from this line's end points.
     *
     * @method add
     * @param {Vertex} amount The amount (x,y) to add.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    Line.prototype.add = function( amount ) {
	this.a.add( amount );
	this.b.add( amount );
	return this;
    };

    
    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    Line.prototype.normalize = function() {
	this.b.set( this.a.x + (this.b.x-this.a.x)/this.length(),
		    this.a.y + (this.b.y-this.a.y)/this.length() );
	return this;
    }; 


    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    Line.prototype.scale = function( factor ) {
	this.b.set( this.a.x + (this.b.x-this.a.x)*factor,
		    this.a.y + (this.b.y-this.a.y)*factor );
	return this;
    };

    
    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {Line} line The line to calculate the angle to.
     * @return {number} this
     * @instance
     * @memberof Line
     **/
    Line.prototype.angle = function( line ) {	
	// Compute the angle from x axis and the return the difference :)
	var v0 = this.b.clone().sub( this.a );
	var v1 = line.b.clone().sub( line.a );
	// Thank you, Javascript, for this second atan function. No additional math is needed here!
	// The result might be negative, but isn't it usually nicer to determine angles in positive values only?
	return Math.atan2( v1.x, v1.y ) - Math.atan2( v0.x, v0.y );
    };

    
    /**
     * Get line point at position t in [0 ... 1]:<br>
     * <pre>[P(0)]=[A]--------------------[P(t)]------[B]=[P(1)]</pre><br>
     * <br>
     * The counterpart of this function is Line.getClosestT(Vertex).
     *
     * @method vertAt
     * @param {number} t The position scalar.
     * @return {Vertex} The vertex a position t. 
     * @instance
     * @memberof Line
     **/
    Line.prototype.vertAt = function( t ) {
	return new Vertex( this.a.x + (this.b.x-this.a.x)*t,
			  this.a.y + (this.b.y-this.a.y)*t );
    };
	    

    /**
     * Get the intersection if this line and the specified line.
     *
     * @method intersection
     * @param {Line} line The second line.
     * @return {Vertex} The intersection (may lie outside the end-points).
     * @instance
     * @memberof Line
     **/
    Line.prototype.intersection = function( line ) {
	var denominator = this.denominator(line);
	if( denominator == 0 ) 
	    return null;
	
	var a = this.a.y - line.a.y; 
	var b = this.a.x - line.a.x; 
	var numerator1 = ((line.b.x - line.a.x) * a) - ((line.b.y - line.a.y) * b);
	var numerator2 = ((this.b.x - this.a.x) * a) - ((this.b.y - this.a.y) * b);
	a = numerator1 / denominator; // NaN if parallel lines
	b = numerator2 / denominator;
	
	// if we cast these lines infinitely in both directions, they intersect here:
	return new Vertex( this.a.x + (a * (this.b.x - this.a.x)),
			   this.a.y + (a * (this.b.y - this.a.y)) );
    };


    /**
     * Get the denominator of this and the given line.
     * 
     * If the denominator is zero (or close to zero) both line are co-linear.
     *
     * @param {Line} line
     * @return {Number}
     **/
    Line.prototype.denominator = function( line ) {
	// http://jsfiddle.net/justin_c_rounds/Gd2S2/
	return ((line.b.y - line.a.y) * (this.b.x - this.a.x)) - ((line.b.x - line.a.x) * (this.b.y - this.a.y));
    };


    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @param {Line} line
     * @return true if both lines are co-linear.
     */
    Line.prototype.colinear = function( line ) {
	return Math.abs( this.denominator(line) ) < Vertex.EPSILON;
    };


    /**
     * Get the closest position T from this line to the specified point.
     *
     * The counterpart for this function is Line.vertAt(Number).
     *
     * @method getClosestT
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The line position t of minimal distance to p.
     * @instance
     * @memberof Line
     **/
    Line.prototype.getClosestT = function( p ) {
	var l2 = Line.util.dist2(this.a, this.b);
	if( l2 === 0 ) return 0; 
	var t = ((p.x - this.a.x) * (this.b.x - this.a.x) + (p.y - this.a.y) * (this.b.y - this.a.y)) / l2;
	// Wrap to [0,1]?
	// t = Math.max(0, Math.min(1, t));
	return t;
    };


    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof Line
     **/
    Line.prototype.pointDistance = function( p ) {
	// Taken From:
	// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment

	function dist2(v, w) {
	    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
	}

	// p - point
	// v - start point of segment
	// w - end point of segment
	function distToSegmentSquared (p, v, w) {
	    //var l2 = dist2(v, w);
	    //if( l2 === 0 ) return dist2(p, v);
	    //var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	    //t = Math.max(0, Math.min(1, t));
	    return dist2(p, this.vertAt(this.getClosestLineT(p))); // dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
	}

	// p - point
	// v - start point of segment
	// w - end point of segment
	//function distToSegment (p, v, w) {
	//    return Math.sqrt(distToSegmentSquared(p, v, w));
	//}

	return Math.sqrt( distToSegmentSquared(p, this.a, this.b) );
    }


    /**
     * Create a deep clone of this line.
     *
     * @method clone
     * @return {Line} A copy if this line.
     * @instance
     * @memberof Line
     **/
    Line.prototype.clone = function() {
	return new Line( this.a.clone(), this.b.clone() );
    };
    
    

    /**
     * Create an SVG representation of this line.
     *
     * @method toSVGString
     * @param {options} p - A set of options, like the 'classname' to use 
     *                      for the line object.
     * @return {string} The SVG string representing this line.
     * @instance
     * @memberof Line
     **/
    Line.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<line' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' x1="' + this.a.x + '"' );
	buffer.push( ' y1="' + this.a.y + '"' );
	buffer.push( ' x2="' + this.b.x + '"' );
	buffer.push( ' y2="' + this.b.y + '"' );
	buffer.push( ' />' );
	return buffer.join('');
    };


    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof Line
     **/
    this.toString = function() {
	return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + " }";
    };

    
    /**
     * @private
     **/
    Line.util = {
	dist2 : function(v, w) {
	    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
	}
    };

    _context.Line = Line;

})(window ? window : module.export);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A vector (Vertex,Vertex) is a line with a visible direction.<br>
 *            <br>
 *            Vectors are drawn with an arrow at their end point.<br>
 *            <b>The Vector class extends the Line class.</b>
 *
 * @requires Vertex, Line
 *
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-02-23 Added the toSVGString function, overriding Line.toSVGString.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-19 Added the clone function (overriding Line.clone()).
 * @modified 2019-09-02 Added the Vector.perp() function.
 * @modified 2019-09-02 Added the Vector.inverse() function.
 * @modified 2019-12-04 Added the Vector.inv() function.
 * @version  1.1.0
 *
 * @file Vector
 * @public
 **/

(function(_context) {
    'use strict';
    
    /**
     * The constructor.
     * 
     * @constructor
     * @name Vector
     * @extends Line
     * @param {Vertex} vertA - The start vertex of the vector.
     * @param {Vertex} vertB - The end vertex of the vector.
     **/
    var Vector = function( vertA, vertB ) {
	Line.call(this,vertA,vertB);
    };
    Object.extendClass(Line,Vector);


    /**
     * Get the perpendicular of this vector which is located at a.
     *
     * @param {Number} t The position on the vector.
     * @return {Vector} A new vector being the perpendicular of this vector sitting on a.
     **/
    Vector.prototype.perp = function() {
	var v = this.clone().sub( this.a );
	return new Vector( new Vertex(), new Vertex(-v.b.y,v.b.x) ).add( this.a );
    };

    
    /**
     * The inverse of a vector is a vector witht the same magnitude but oppose direction.
     *
     * Please not that the origin of this vector changes here: a->b becomes b->a.
     *
     * @return {Vector}
     **/
    Vector.prototype.inverse = function() {
	var tmp = this.a;
	this.a = this.b;
	this.b = tmp;
	return this;
    };

    /**
     * This function computes the inverse of the vector, which means a stays untouched.
     *
     * @return {Vector} this for chaining.
     **/
    Vector.prototype.inv = function() {
	this.b.x = this.a.x-(this.b.x-this.a.x);
	this.b.y = this.a.y-(this.b.y-this.a.y);
	return this;
    };
    

    /**
     * Create a deep clone of this Vector.
     *
     * @method clone
     * @override
     * @return {Vector} A copy if this line.
     * @instance
     * @memberof Vector
     **/
    Vector.prototype.clone = function() {
	return new Vector( this.a.clone(), this.b.clone() );
    };

    
    /**
     * Create an SVG representation of this line.
     *
     * @method toSVGString
     * @override
     * @param {object=} options - A set of options, like 'className'.
     * @return {string} The SVG string representation.
     * @instance
     * @memberof Vector
     **/
    Vector.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	var vertices = PlotBoilerplate.utils.buildArrowHead( this.a, this.b, 8, 1.0, 1.0 );
	buffer.push( '<g' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( '>' );
	buffer.push( '   <line' );
	buffer.push( ' x1="' + this.a.x + '"' );
	buffer.push( ' y1="' + this.a.y + '"' );
	buffer.push( ' x2="' + vertices[0].x + '"' );
	buffer.push( ' y2="' + vertices[0].y + '"' );
	buffer.push( ' />' );
	// Add arrow head
	
	buffer.push( '   <polygon points="' );
	for( var i = 0; i < vertices.length; i++ ) {
	    if( i > 0 )
		buffer.push( ' ' );
	    buffer.push( '' + vertices[i].x + ',' + vertices[i].y );
	}
	buffer.push( '"/>' );
	buffer.push( '</g>' );
	return buffer.join('');
    };
    
    _context.Vector = Vector;
    
})(window ? window : module.export);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * @classdesc A refactored cubic bezier curve class.
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2013-08-15
 * @modified 2018-08-16 Added a closure. Removed the wrapper class 'IKRS'. Replaced class THREE.Vector2 by Vertex class.
 * @modified 2018-11-19 Added the fromArray(Array) function.
 * @modified 2018-11-28 Added the locateCurveByPoint(Vertex) function.
 * @modified 2018-12-04 Added the toSVGPathData() function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-03-23 Changed the signatures of getPoint, getPointAt and getTangent (!version 2.0).
 * @modified 2019-12-02 Fixed the updateArcLength function. It used the wrong pointAt function (was renamed before).
 * @version  2.0.1
 *
 * @file CubicBezierCurve
 * @public
 **/


(function(_context) {
    'use strict';

    /**
     * The constructor.
     *
     * @constructor
     * @name CubicBezierCurve
     * @param {Vertex} startPoint - The Bézier curve's start point.
     * @param {Vertex} endPoint   - The Bézier curve's end point.
     * @param {Vertex} startControlPoint - The Bézier curve's start control point.
     * @param {Vertex} endControlPoint   - The Bézier curve's end control point.
     **/
    var CubicBezierCurve = function ( startPoint,
				      endPoint,
				      startControlPoint,
				      endControlPoint
				    ) {		
	
	this.startPoint         = startPoint;
	this.startControlPoint  = startControlPoint;
	this.endPoint           = endPoint;
	this.endControlPoint    = endControlPoint;	
	this.curveIntervals     = 30;
	// An array of points
	this.segmentCache       = [];
	// An array of floats
	this.segmentLengths     = [];
	// float
	this.arcLength          = null;
	
	this.updateArcLengths();
    };

    /** @constant {number} */
    CubicBezierCurve.START_POINT         = 0;
    /** @constant {number} */
    CubicBezierCurve.START_CONTROL_POINT = 1;
    /** @constant {number} */
    CubicBezierCurve.END_CONTROL_POINT   = 2;
    /** @constant {number} */
    CubicBezierCurve.END_POINT           = 3;

    
    // CubicBezierCurve.prototype = new Object();
    CubicBezierCurve.prototype.constructor = CubicBezierCurve; 

    /** @constant {number} */
    CubicBezierCurve.prototype.START_POINT         = 0;
    /** @constant {number} */
    CubicBezierCurve.prototype.START_CONTROL_POINT = 1;
    /** @constant {number} */
    CubicBezierCurve.prototype.END_CONTROL_POINT   = 2;
    /** @constant {number} */
    CubicBezierCurve.prototype.END_POINT           = 3;

    
    /**
     * Move the given curve point (the start point, end point or one of the two
     * control points).
     *
     * @method moveCurvePoint
     * @param {number} pointID - The numeric identicator of the point to move. Use one of the four constants.
     * @param {Vertex} moveAmount - The amount to move the specified point by.
     * @param {boolean} moveControlPoint - Move the control points along with their path point (if specified point is a path point).
     * @param {boolean} updateArcLengths - Specifiy if the internal arc segment buffer should be updated.
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    CubicBezierCurve.prototype.moveCurvePoint = function( pointID,           // int
							  moveAmount,        // Vertex
							  moveControlPoint,  // boolean
							  updateArcLengths   // boolean
							) {
	if( pointID == this.START_POINT ) {
	    this.getStartPoint().add( moveAmount );
	    if( moveControlPoint )
		this.getStartControlPoint().add( moveAmount );

	} else if( pointID == this.START_CONTROL_POINT ) {
	    this.getStartControlPoint().add( moveAmount );

	} else if( pointID == this.END_CONTROL_POINT ) {
	    this.getEndControlPoint().add( moveAmount );

	} else if( pointID == this.END_POINT ) {
	    this.getEndPoint().add( moveAmount );
	    if( moveControlPoint )
		this.getEndControlPoint().add( moveAmount );

	} else {
	    console.log( "[IKRS.CubicBezierCurve.moveCurvePoint] pointID '" + pointID +"' invalid." );
	}
	
	if( updateArcLengths )
	    this.updateArcLengths();
    }



    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {Vertex} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this
     **/
    CubicBezierCurve.prototype.translate = function( amount ) {
	this.startPoint.add( amount );
	this.startControlPoint.add( amount );
	this.endControlPoint.add( amount );
	this.endPoint.add( amount );   
    };


    
    /**
     * Get the total curve length.<br>
     * <br> 
     * As not all Bézier curved have a closed formula to calculate their lengths, this
     * implementation uses a segment buffer (with a length of 30 segments). So the 
     * returned length is taken from the arc segment buffer.<br>
     * <br>
     * Note that if the curve points were changed and the segment buffer was not
     * updated this function might return wrong (old) values.
     *
     * @method getLength
     * @instance
     * @memberof CubicBezierCurve
     * @return {number} >= 0
     **/
    CubicBezierCurve.prototype.getLength = function() {
	return this.arcLength;
    };

    
    /**
     * Uptate the internal arc segment buffer and their lengths.<br>
     * <br>
     * All class functions update the buffer automatically; if any
     * curve point is changed by other reasons you should call this
     * function to keep actual values in the buffer.
     *
     * @method updateArcLengths
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    CubicBezierCurve.prototype.updateArcLengths = function() {
	var 
	pointA = new Vertex( this.startPoint.x, this.startPoint.y ),
	pointB = new Vertex( 0, 0 ),
	curveStep = 1.0/this.curveIntervals;
	
	var   u = curveStep; 
	// Clear segment cache
	this.segmentCache = [];
	// Push start point into buffer
	this.segmentCache.push( this.startPoint );	
	this.segmentLengths = [];
	//this.arcLength = 0.0;
	let newLength = 0.0;

	/*
	for( var i = 0; i < this.curveIntervals; i++) {	    
	    pointB = this.getPointAt( (i+1) * curveStep );  // parameter is 'u' (not 't')
	    //pointB = this.getPoint( (i+1) * curveStep );  // parameter is 'u' (not 't')
	    
	    // Store point into cache
	    this.segmentCache.push( pointB ); 

	    // Calculate segment length
	    var tmpLength = pointA.distance(pointB); // Math.sqrt( Math.pow(pointA.x-pointB.x,2) + Math.pow(pointA.y-pointB.y,2) );
	    this.segmentLengths.push( tmpLength );
	    newLength += tmpLength;
	    
	    pointA = pointB;
            u += curveStep;
	} // END for
	this.arcLength = newLength;
*/
	
	
	var t = 0.0;
	while( t <= 1.0 ) { //console.log('x',t);
	    pointB = this.getPointAt(t); // (i+1) * curveStep );  // parameter is 'u' (not 't')
	    
	    // Store point into cache
	    this.segmentCache.push( pointB ); 

	    // Calculate segment length
	    var tmpLength = pointA.distance(pointB); // Math.sqrt( Math.pow(pointA.x-pointB.x,2) + Math.pow(pointA.y-pointB.y,2) );
	    this.segmentLengths.push( tmpLength );
	    this.arcLength += tmpLength;
	    
	    pointA = pointB;
            // u += curveStep;
	    
	    t += curveStep;
	}
	
    }; // END function


    /**
     * Get the start point of the curve.<br>
     * <br>
     * This function just returns this.startPoint.
     *
     * @method getStartPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.startPoint
     **/
    CubicBezierCurve.prototype.getStartPoint = function() {
	return this.startPoint;
    };

    /**
     * Get the end point of the curve.<br>
     * <br>
     * This function just returns this.endPoint.
     *
     * @method getEndPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.endPoint
     **/
    CubicBezierCurve.prototype.getEndPoint = function() {
	return this.endPoint;
    };

    /**
     * Get the start control point of the curve.<br>
     * <br>
     * This function just returns this.startControlPoint.
     *
     * @method getStartControlPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.startControlPoint
     **/
    CubicBezierCurve.prototype.getStartControlPoint = function() {
	return this.startControlPoint;
    };

    /**
     * Get the end control point of the curve.<br>
     * <br>
     * This function just returns this.endControlPoint.
     *
     * @method getEndControlPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.endControlPoint
     **/
    CubicBezierCurve.prototype.getEndControlPoint = function() {
	return this.endControlPoint;
    };


    /**
     * Get one of the four curve points specified by the passt point ID.
     *
     * @method getEndControlPoint
     * @param {number} id - One of START_POINT, START_CONTROL_POINT, END_CONTROL_POINT or END_POINT.
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPointByID = function( id ) {
	if( id == this.START_POINT ) return this.startPoint;
	if( id == this.END_POINT ) return this.endPoint;
	if( id == this.START_CONTROL_POINT ) return this.startControlPoint;
	if( id == this.END_CONTROL_POINT ) return this.endControlPoint;
	throw "Invalid point ID '" + id +"'.";
    };


    /**
     * Get the curve point at a given position t, where t is in [0,1].<br>
     * <br>
     * @see Line.pointAt
     *
     * @method getPointAt
     * @param {number} t - The position on the curve in [0,1] (0 means at 
     *                     start point, 1 means at end point, other values address points in bertween).
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPointAt = function( t ) {
	// Perform some powerful math magic
	var x = this.startPoint.x * Math.pow(1.0-t,3) + this.startControlPoint.x*3*t*Math.pow(1.0-t,2)
	    + this.endControlPoint.x*3*Math.pow(t,2)*(1.0-t)+this.endPoint.x*Math.pow(t,3);
	var y = this.startPoint.y*Math.pow(1.0-t,3)+this.startControlPoint.y*3*t*Math.pow(1.0-t,2)
	    + this.endControlPoint.y*3*Math.pow(t,2)*(1.0-t)+this.endPoint.y*Math.pow(t,3);
	return new Vertex( x, y );
    };


    /**
     * Get the curve point at a given position u, where u is in [0,arcLength].<br>
     * <br>
     * @see CubicBezierCurve.getPointAt
     *
     * @method getPoint
     * @param {number} u - The position on the curve in [0,arcLength] (0 means at 
     *                     start point, arcLength means at end point, other values address points in bertween).
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPoint = function( u ) {  
	return this.getPointAt( u / this.arcLength );
    };


    /**
     * Get the curve tangent vector at a given absolute curve position t in [0,1].<br>
     * <br>
     * Note that the returned tangent vector (end point) is not normalized and relative to (0,0).
     *
     * @method getTangent
     * @param {number} t - The position on the curve in [0,1].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getTangentAt = function( t ) {
	var a = this.getStartPoint();
	var b = this.getStartControlPoint();
	var c = this.getEndControlPoint();
	var d = this.getEndPoint();
	
	// This is the shortened one
	var t2 = t * t;
	var t3 = t * t2;
	// (1 - t)^2 = (1-t)*(1-t) = 1 - t - t + t^2 = 1 - 2*t + t^2
	var nt2 = 1 - 2*t + t2;

	var tX = -3 * a.x * nt2 + 
	    b.x * (3 * nt2 - 6 *(t-t2) ) +
	    c.x * (6 *(t-t2) - 3*t2) +
	    3*d.x*t2;
	var tY = -3 * a.y * nt2 + 
	    b.y * (3 * nt2 - 6 *(t-t2) ) +
	    c.y * (6 *(t-t2) - 3*t2) +
	    3*d.y*t2;
	
	// Note: my implementation does NOT normalize tangent vectors!
	return new Vertex( tX, tY );
    };


    /**
     * Convert a relative curve position u to the absolute curve position t.
     *
     * @method convertU2t
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {number} 
     **/
    CubicBezierCurve.prototype.convertU2T = function( u ) { 
	return Math.max( 0.0, 
			 Math.min( 1.0, 
				   ( u / this.arcLength ) 
				 )
		       );
    };

    
    /**
     * Get the curve tangent vector at a given relative position u in [0,arcLength].<br>
     * <br>
     * Note that the returned tangent vector (end point) is not normalized.
     *
     * @method getTangent
     * @param {number} u - The position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    //CubicBezierCurve.prototype.getTangentAt = function( u ) {
    CubicBezierCurve.prototype.getTangent = function( u ) {
	return this.getTangentAt( this.convertU2T(u) );
    };
    

    /**
     * Get the curve perpendicular at a given relative position u in [0,arcLength] as a vector.<br>
     * <br>
     * Note that the returned vector (end point) is not normalized.
     *
     * @method getPerpendicular
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPerpendicular = function( u ) {
	return this.getPerpendicularAt( this.convertU2T(u) );
    };


    /**
     * Get the curve perpendicular at a given absolute position t in [0,1] as a vector.<br>
     * <br>
     * Note that the returned vector (end point) is not normalized.
     *
     * @method getPerpendicularAt
     * @param {number} u - The absolute position on the curve in [0,1].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPerpendicularAt = function( t ) { 
	var tangentVector = this.getTangentAt( t );
	return new Vertex( tangentVector.y, - tangentVector.x );
    }




    /**
     * Clone this Bézier curve (deep clone).
     *
     * @method clone
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} 
     **/
    CubicBezierCurve.prototype.clone = function() {
	var curve = new CubicBezierCurve( this.getStartPoint().clone(),
					  this.getEndPoint().clone(),
					  this.getStartControlPoint().clone(),
					  this.getEndControlPoint().clone()
					);
	return curve;
    }


    /**
     * Check if this and the specified curve are equal.<br>
     * <br>
     * All four points need to be equal for this, the Vertex.equals function is used.<br>
     * <br>
     * Please note that this function is not type safe (comparison with any object will fail).
     *
     * @method clone
     * @param {CubicBezierCurve} curve - The curve to compare with.
     * @instance
     * @memberof CubicBezierCurve
     * @return {boolean} 
     **/
    CubicBezierCurve.prototype.equals = function( curve ) {	
	if( !curve )
	    return false;	
	if( !curve.startPoint ||
	    !curve.endPoint ||
	    !curve.startControlPoint ||
	    !curve.endControlPoint )
	    return false;	
	return this.startPoint.equals(curve.startPoint) 
	    && this.endPoint.equals(curve.endPoint)
	    && this.startControlPoint.equals(curve.startControlPoint)
	    && this.endControlPoint.equals(curve.endControlPoint);
	
    }


  
    /**
     * Create an SVG path data representation of this bézier curve.
     *
     * Path data string format is:<br>
     *  <pre>'M x0 y1 C dx0 dy1 dx1 dy1 x1 x2'</pre><br>
     * or in other words<br>
     *   <pre>'M startoint.x startPoint.y C startControlPoint.x startControlPoint.y endControlPoint.x endControlPoint.y endPoint.x endPoint.y'</pre>
     *
     * @method toSVGPathData
     * @instance
     * @memberof CubicBezierCurve
     * @return {string}  The SVG path data string.
     **/
    CubicBezierCurve.prototype.toSVGPathData = function() {
	var buffer = [];
	buffer.push( 'M ' );
	buffer.push( this.startPoint.x );
	buffer.push( ' ' );
	buffer.push( this.startPoint.y );
	buffer.push( ' C ' );
	buffer.push( this.startControlPoint.x );
	buffer.push( ' ' );
	buffer.push( this.startControlPoint.y );
	buffer.push( ' ' );
	buffer.push( this.endControlPoint.x );
	buffer.push( ' ' );
	buffer.push( this.endControlPoint.y );
	buffer.push( ' ' );
	buffer.push( this.endPoint.x );
	buffer.push( ' ' );
	buffer.push( this.endPoint.y );
	return buffer.join('');
    }


    /**
     * Convert this curve to a JSON string.
     *
     * @method toJSON
     * @param {boolean=} [prettyFormat=false] - If set to true the function will add line breaks.
     * @instance
     * @memberof CubicBezierCurve
     * @return {string} The JSON data.
     **/
    CubicBezierCurve.prototype.toJSON = function( prettyFormat ) {
	var jsonString = "{ " + // begin object
            ( prettyFormat ? "\n\t" : "" ) +
	    "\"startPoint\" : [" + this.getStartPoint().x + "," + this.getStartPoint().y + "], " +
	    ( prettyFormat ? "\n\t" : "" ) +
	    "\"endPoint\" : [" + this.getEndPoint().x + "," + this.getEndPoint().y + "], " +
	    ( prettyFormat ? "\n\t" : "" ) +
	    "\"startControlPoint\": [" + this.getStartControlPoint().x + "," + this.getStartControlPoint().y + "], " +
	    ( prettyFormat ? "\n\t" : "" ) +
	    "\"endControlPoint\" : [" + this.getEndControlPoint().x + "," + this.getEndControlPoint().y + "]" +
	    ( prettyFormat ? "\n\t" : "" ) +
	    " }";  // end object
	return jsonString;
    }

    
    /**
     * Parse a Bézier curve from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The JSON data to parse.
     * @memberof CubicBezierCurve
     * @throws An exception if the JSON string is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromJSON = function( jsonString ) {
	var obj = JSON.parse( jsonString );
	return CubicBezierCurve.fromObject( obj );
    }


    /**
     * Try to convert the passed object to a CubicBezierCurve.
     *
     * @method fromObject
     * @param {object} obj - The object to convert.
     * @memberof CubicBezierCurve
     * @throws An exception if the passed object is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromObject = function( obj ) {
	
	if( typeof obj !== "object" ) 
	    throw "[IKRS.CubicBezierCurve.fromObject] Can only build from object.";


	if( !obj.startPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"startPoint\" missing.";
	if( !obj.endPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"endPoint\" missing.";
	if( !obj.startControlPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"startControlPoint\" missing.";
	if( !obj.endControlPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"endControlPoint\" missing.";
	
	return new CubicBezierCurve( new Vertex(obj.startPoint[0],        obj.startPoint[1]),
				     new Vertex(obj.endPoint[0],          obj.endPoint[1]),
				     new Vertex(obj.startControlPoint[0], obj.startControlPoint[1]),
				     new Vertex(obj.endControlPoint[0],   obj.endControlPoint[1])
				   );
    };


    
    /**
     * Convert a 4-element array of vertices to a cubic bézier curve.
     *
     * @method fromArray
     * @param {Vertex[]} arr -  [ startVertex, endVertex, startControlVertex, endControlVertex ]
     * @memberof CubicBezierCurve
     * @throws An exception if the passed array is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromArray = function( arr ) {	
	if( !Array.isArray(arr) ) 
	    throw "[IKRS.CubicBezierCurve.fromArray] Can only build from object.";
	if( arr.length != 4 )
	    throw "[IKRS.CubicBezierCurve.fromArray] Can only build from array with four elements.";
	return new CubicBezierCurve( arr[0],
				     arr[1],
				     arr[2],
				     arr[3]
				   );
    };

    _context.CubicBezierCurve = CubicBezierCurve;
    
})(window); // END closure


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * @classdesc A refactored BezierPath class.
 *
 * @require Vertex, CubicBezierCurve
 * 
 * @author Ikaros Kappler
 * @date 2013-08-19
 * @modified 2018-08-16 Added closure. Removed the 'IKRS' wrapper.
 * @modified 2018-11-20 Added circular auto-adjustment.
 * @modified 2018-11-25 Added the point constants to the BezierPath class itself.
 * @modified 2018-11-28 Added the locateCurveByStartPoint() function.
 * @modified 2018-12-04 Added the toSVGString() function.
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2019-03-23 Changed the fuctions getPoint and getPointAt to match semantics in the Line class.
 * @modified 2019-11-18 Fixed the clone function: adjustCircular attribute was not cloned.
 * @modified 2019-12-02 Removed some excessive comments.
 * @modified 2019-12-04 Fixed the missing obtainHandleLengths behavior in the adjustNeightbourControlPoint function.
 * @version 2.0.3
 *
 * @file BezierPath
 * @public
 **/


(function(_context) {
    'use strict';

 
    /**
     * The constructor.<br>
     * <br>
     * This constructor expects a sequence of path points and will approximate
     * the location of control points by picking some between the points.<br>
     * You should consider just constructing empty paths and then add more curves later using
     * the addCurve() function.
     *
     * @constructor
     * @name BezierPath
     * @param {Vertex[]} pathPoints - An array of path vertices (no control points).
     **/
    var BezierPath = function( pathPoints ) {
	if( !pathPoints )
	    pathPoints = [];
	this.totalArcLength = 0.0;
	// Set this flag to true if you want the first point and
	// last point of the path to be auto adjusted, too.
	this.adjustCircular = false;
	this.bezierCurves = [];
	
	for( var i = 1; i < pathPoints.length; i++ ) {
	    var bounds = new THREE.Box2( pathPoints[i].x - pathPoints[i-1].x, 
					 pathPoints[i].y - pathPoints[i-1].y
				       );
	    // Create a new Bezier curve inside the box
	    var bCurve =  new CubicBezierCurve( pathPoints[i-1],
						pathPoints[i],
						new Vertex( pathPoints[i-1].x, 
							    pathPoints[i-1].y - bounds.min/2
							  ),
						// This control point will be auto-adjusted in the next step
						new Vertex( pathPoints[i].x + bounds.max/2,
							    pathPoints[i].y 
							  )
					      );
	    this.bezierCurves.push( bCurve );
	    this.totalArcLength += bCurve.getLength();
	    
	    // Auto adjust the second control point (should be on a linear sub-space)
	    if( this.bezierCurves.length >= 2 ) {
		this.adjustSuccessorControlPoint( this.bezierCurves.length-2, // curveIndex, 
						  true,                       // obtain handle length?
						  true                        // update arc lengths
						);
	    }
	}
    };

    BezierPath.prototype.constructor = BezierPath;

    // +---------------------------------------------------------------------------------
    // | These constants equal the values from CubicBezierCurve.
    // +-------------------------------
    /** @constant {number} */
    BezierPath.START_POINT         = 0;
    /** @constant {number} */
    BezierPath.START_CONTROL_POINT = 1;
    /** @constant {number} */
    BezierPath.END_CONTROL_POINT   = 2;
    /** @constant {number} */
    BezierPath.END_POINT           = 3;
    /** @constant {number} */
    BezierPath.prototype.START_POINT         = 0;
    /** @constant {number} */
    BezierPath.prototype.START_CONTROL_POINT = 1;
    /** @constant {number} */
    BezierPath.prototype.END_CONTROL_POINT   = 2;
    /** @constant {number} */
    BezierPath.prototype.END_POINT           = 3;



    /**
     * Add a cubic bezier curve to the end of this path.
     *
     * @method addCurve
     * @param {CubicBezierCurve} curve - The curve to be added to the end of the path.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.addCurve = function( curve ) {
	if( curve == null || typeof curve == 'undefined' )
	    throw "Cannot add null curve to bézier path.";
	this.bezierCurves.push( curve );
	if( this.bezierCurves.length > 1 ) {
	    curve.startPoint = this.bezierCurves[this.bezierCurves.length-2].endPoint;
	    this.adjustSuccessorControlPoint(
		this.bezierCurves.length-2, // curveIndex,
		true,                       // obtainHandleLength,  
		true                        // updateArcLengths  
	    );    
	} else {
	    this.totalArcLength += curve.getLength();
	}
    };


 
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartPoint
     * @param {Vertex} point - The (curve start-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (start-) point not found
     **/
    BezierPath.prototype.locateCurveByStartPoint = function( point ) {
	for( var i in this.bezierCurves ) {
	    if( this.bezierCurves[i].startPoint.equals(point) )
		return i;
	}
	return -1;
    };


    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByEndPoint
     * @param {Vertex} point - The (curve endt-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    BezierPath.prototype.locateCurveByStartControlPoint = function( point ) {
	for( var i in this.bezierCurves ) {
	    if( this.bezierCurves[i].startControlPoint.equals(point) )
		return i;
	}
	return -1;
    };
    

    // +---------------------------------------------------------------------------------
    // | Locate the curve with the given end control point.
    // |
    // | @param point:Vertex The point to look for.
    // | @return Number The index or -1 if not found.
    // +-------------------------------
    BezierPath.prototype.locateCurveByEndControlPoint = function( point ) {
	for( var i in this.bezierCurves ) {
	    if( this.bezierCurves[i].endControlPoint.equals(point) )
		return i;
	}
	return -1;
    };


    
    /**
     * Get the total length of this path.<br>
     * <br>
     * Note that the returned value comes from the curve buffer. Unregistered changes 
     * to the curve points will result in invalid path length values.
     *
     * @method getLength
     * @instance
     * @memberof BezierPath
     * @return {number} The (buffered) length of the path.
     **/
    BezierPath.prototype.getLength = function() {
	return this.totalArcLength;
    };

    
    
    /**
     * This function is internally called whenever the curve or path configuration
     * changed. It updates the attribute that stores the path length information.<br>
     * <br>
     * If you perform any unregistered changes to the curve points you should call
     * this function afterwards to update the curve buffer. Not updating may
     * result in unexpected behavior.
     *
     * @method updateArcLengths
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.updateArcLengths = function() {
	this.totalArcLength = 0.0;
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    this.bezierCurves[ i ].updateArcLengths();
	    this.totalArcLength += this.bezierCurves[ i ].getLength();
	}
    };


    /**
     * Get the number of curves in this path.
     *
     * @method getCurveCount
     * @instance
     * @memberof BezierPath
     * @return {number} The number of curves in this path.
     **/
    BezierPath.prototype.getCurveCount = function() {
	return this.bezierCurves.length;
    };



    /**
     * Get the cubic bezier curve at the given index.
     *
     * @method getCurveAt
     * @param {number} index - The curve index from 0 to getCurveCount()-1.
     * @instance
     * @memberof BezierPath
     * @return {CubicBezierCurve} The curve at the specified index.
     **/
    BezierPath.prototype.getCurveAt = function( curveIndex ) {
	return this.bezierCurves[ curveIndex ];
    };



    /**
     * Remove the end point of this path (which removes the last curve from this path).<br>
     * <br>
     * Please note that this function does never remove the first curve, thus the path
     * cannot be empty after this call.
     *
     * @method removeEndPoint
     * @instance
     * @memberof BezierPath
     * @return {boolean} Indicating if the last curve was removed.
     **/
    /*
    BezierPath.prototype.removeEndPoint = function() {
	if( this.bezierCurves.length <= 1 )
	    return false;
	
	var newArray = [ this.bezierCurves.length-1 ];
	for( var i = 0; i < this.bezierCurves.length-1; i++ ) {
	    newArray[i] = this.bezierCurves[i];
	}
	
	// Update arc length
	this.totalArcLength -= this.bezierCurves[ this.bezierCurves.length-1 ].getLength();
	this.bezierCurves = newArray;	
	return true;
    }
    */


    /**
     * Remove the start point of this path (which removes the first curve from this path).<br>
     * <br>
     * Please note that this function does never remove the last curve, thus the path
     * cannot be empty after this call.<br>
     *
     * @method removeStartPoint
     * @instance
     * @memberof BezierPath
     * @return {boolean} Indicating if the first curve was removed.
     **/
    /*
    BezierPath.prototype.removeStartPoint = function() {

	if( this.bezierCurves.length <= 1 )
	    return false;

	var newArray = [ this.bezierCurves.length-1 ];
	for( var i = 1; i < this.bezierCurves.length; i++ ) {

	    newArray[i-1] = this.bezierCurves[i];

	}
	
	// Update arc length
	this.totalArcLength -= this.bezierCurves[ 0 ].getLength();
	this.bezierCurves = newArray;
	
	return true;
    }
    */


    
    /**
     * Removes a path point inside the path.
     *
     * This function joins the bezier curve at the given index with
     * its predecessor, which means that the start point at the given
     * curve index will be removed.
     *
     * @method joinAt
     * @param {number} curveIndex - The index of the curve to be joined with its predecessor.
     * @instance
     * @memberof BezierPath
     * @return {boolean} True if the passed index indicated an inner vertex and the two curves were joined.
     **/
    /*
    BezierPath.prototype.joinAt = function( curveIndex ) {

	if( curveIndex < 0 || curveIndex >= this.bezierCurves.length )
	    return false;
	
	var leftCurve  = this.bezierCurves[ curveIndex-1 ];
	var rightCurve = this.bezierCurves[ curveIndex ];

	// Make the length of the new handle double that long
	var leftControlPoint = leftCurve.getStartControlPoint().clone();
	leftControlPoint.sub( leftCurve.getStartPoint() );
	leftControlPoint.multiplyScalar( 2.0 );
	leftControlPoint.add( leftCurve.getStartPoint() );
	
	var rightControlPoint = rightCurve.getEndControlPoint().clone();
	rightControlPoint.sub( rightCurve.getEndPoint() );
	rightControlPoint.multiplyScalar( 2.0 );
	rightControlPoint.add( rightCurve.getEndPoint() );	

	var newCurve = new IKRS.CubicBezierCurve( leftCurve.getStartPoint(),
						  rightCurve.getEndPoint(),
						  leftControlPoint,
						  rightControlPoint 
						);	
	// Place into array
	var newArray = [ this.bezierCurves.length - 1 ];

	for( var i = 0; i < curveIndex-1; i++ ) 
	    newArray[ i ] = this.bezierCurves[i];
	
	newArray[ curveIndex-1 ] = newCurve;
	
	// Shift trailing curves left
	for( var i = curveIndex; i+1 < this.bezierCurves.length; i++ ) 
	    newArray[ i ] = this.bezierCurves[ i+1 ];
		
	this.bezierCurves = newArray;
	this.updateArcLengths();

	return true;
    }
    */



    /**
     * Add a new inner curve point to the path.<br>
     * <br>
     * This function splits the bezier curve at the given index and given
     * curve segment index.
     *
     * @method splitAt
     * @param {number} curveIndex - The index of the curve to split.
     * @param {nunber} segmentIndex - The index of the curve segment where the split should be performed.
     * @instance
     * @memberof BezierPath
     * @return {boolean} True if the passed indices were valid and the path was split.
     **/
    /*
    BezierPath.prototype.splitAt = function( curveIndex,
					     segmentIndex 
					   ) {
	// Must be a valid curve index
	if( curveIndex < 0 || curveIndex >= this.bezierCurves.length )
	    return false;

	var oldCurve = this.bezierCurves[ curveIndex ];

	// Segment must be an INNER point!
	// (the outer points are already bezier end/start points!)
	if( segmentIndex < 1 || segmentIndex-1 >= oldCurve.segmentCache.length )
	    return false;

	// Make room for a new curve
	for( var c = this.bezierCurves.length; c > curveIndex; c-- ) {
	    // Move one position to the right
	    this.bezierCurves[ c ] = this.bezierCurves[ c-1 ];	    
	}

	// Accumulate segment lengths
	var u = 0;
	for( var i = 0; i < segmentIndex; i++ )
	    u += oldCurve.segmentLengths[i];
	//var tangent = oldCurve.getTangentAt( u );
	var tangent = oldCurve.getTangent( u );
	tangent = tangent.multiplyScalar( 0.25 ); 

	var leftEndControlPoint = oldCurve.segmentCache[ segmentIndex ].clone();
	leftEndControlPoint.sub( tangent );
	
	var rightStartControlPoint = oldCurve.segmentCache[ segmentIndex ].clone();
	rightStartControlPoint.add( tangent );
	
	// Make the old existing handles a quarter that long
	var leftStartControlPoint = oldCurve.getStartControlPoint().clone();
	// move to (0,0)
	leftStartControlPoint.sub( oldCurve.getStartPoint() );
	leftStartControlPoint.multiplyScalar( 0.25 );
	leftStartControlPoint.add( oldCurve.getStartPoint() );

	var rightEndControlPoint = oldCurve.getEndControlPoint().clone(); 
	// move to (0,0)
	rightEndControlPoint.sub( oldCurve.getEndPoint() );
	rightEndControlPoint.multiplyScalar( 0.25 );
	rightEndControlPoint.add( oldCurve.getEndPoint() );

	var newLeft  = new CubicBezierCurve( oldCurve.getStartPoint(),                      // old start point
					     oldCurve.segmentCache[ segmentIndex ],         // new end point
					     leftStartControlPoint,                         // old start control point 
					     leftEndControlPoint                            // new end control point
					   );
	var newRight = new CubicBezierCurve( oldCurve.segmentCache[ segmentIndex ],         // new start point
					     oldCurve.getEndPoint(),                        // old end point
					     rightStartControlPoint,                        // new start control point 
					     rightEndControlPoint                           // old end control point
					   );
	
	// Insert split curve(s) at free index
	this.bezierCurves[ curveIndex ]     = newLeft;
	this.bezierCurves[ curveIndex + 1 ] = newRight;
	
	// Update total arc length, even if there is only a very little change!
	this.totalArcLength -= oldCurve.getLength();
	this.totalArcLength += newLeft.getLength();
	this.totalArcLength += newRight.getLength();

	return true;
    };
    */


   
    /**
     * Move the whole bezier path by the given (x,y)-amount.
     *
     * @method translate
     * @param {Vertex} amount - The amount to be added (amount.x and amount.y) 
     *                          to each vertex of the curve.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.translate = function( amount ) {	
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    var curve = this.bezierCurves[ i ];	    
	    curve.getStartPoint().add( amount );
	    curve.getStartControlPoint().add( amount );
	    curve.getEndControlPoint().add( amount );    
	}
	
	// Don't forget to translate the last curve's last point
	var curve = this.bezierCurves[ this.bezierCurves.length-1 ];
	curve.getEndPoint().add( amount );

	this.updateArcLengths();
    };


    
    /**
     * Scale the whole bezier path by the given (x,y)-factors.
     *
     * @method scale
     * @param {Vertex} anchor - The scale origin to scale from.
     * @param {Vertex} amount - The scalars to be multiplied with (ascaling.x and scaling.y)
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.scale = function( anchor,  // Vertex
					   scaling  // Vertex
					 ) {
	
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    var curve = this.bezierCurves[ i ];
	    curve.getStartPoint().scale( scaling, anchor );
	    curve.getStartControlPoint().scale( scaling, anchor );
	    curve.getEndControlPoint().scale( scaling, anchor );
	    // Do NOT scale the end point here!
	    // Don't forget that the curves are connected and on curve's end point
	    // the the successor's start point (same instance)!
	}
	
	// Finally move the last end point (was not scaled yet)
	if( this.bezierCurves.length > 0 && !this.adjustCircular ) {
	    // !!! TODO: THIS CAN BE DROPPED BECAUSE Vertex.scale ALREADY DOES THIS
	    this.bezierCurves[ this.bezierCurves.length-1 ].getEndPoint().scale( scaling, anchor );
	}
	
	this.updateArcLengths();	
    };


    /**
     * Rotate the whole bezier path around a point..
     *
     * @method rotate
     * @param {Vertex} angle  - The angle to rotate this path by.
     * @param {Vertex} center - The rotation center.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.rotate = function( angle,  // float
					    center  // Vertex
					 ) {

	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    var curve = this.bezierCurves[ i ];	    
	    curve.getStartPoint().rotate( angle, center ); 
	    curve.getStartControlPoint().rotate( angle, center );
	    curve.getEndControlPoint().rotate( angle, center );
	    // Do NOT rotate the end point here!
	    // Don't forget that the curves are connected and on curve's end point
	    // the the successor's start point (same instance)!
	}
	
	// Finally move the last end point (was not scaled yet)
	if( this.bezierCurves.length > 0 && !this.adjustCircular ) {
	    this.bezierCurves[ this.bezierCurves.length-1 ].getEndPoint().rotate( angle, center );
	}
    };

    

    /**
     * Get the point on the bézier path at the given relative path location.
     *
     * @method getPoint
     * @param {number} u - The relative path position: <pre>0 <= u <= this.getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the relative path position.
     **/
    BezierPath.prototype.getPoint = function( u ) {
	if( u < 0 || u > this.totalArcLength ) {
	    console.log( "[BezierPath.getPoint(u)] u is out of bounds: " + u + "." );
	    return null;
	}
	// Find the spline to extract the value from
	var i = 0;
	var uTemp = 0.0;
	while( i < this.bezierCurves.length &&
	       (uTemp + this.bezierCurves[i].getLength()) < u 
	     ) {
	    
	    uTemp += this.bezierCurves[ i ].getLength();
	    i++;
	}
	
	// if u == arcLength
	//   -> i is max
	if( i >= this.bezierCurves.length )
	    return this.bezierCurves[ this.bezierCurves.length-1 ].getEndPoint().clone();
	
	var bCurve    = this.bezierCurves[ i ];
	var relativeU = u - uTemp;
	return bCurve.getPoint( relativeU );
    };


    
    /**
     * Get the point on the bézier path at the given path fraction.
     *
     * @method getPointAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the absolute path position.
     **/
    BezierPath.prototype.getPointAt = function( t ) {
	return this.getPoint( t * this.totalArcLength );
    };

    
  
    /**
     * Get the tangent of the bézier path at the given path fraction.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getTangentAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The tangent vector at the absolute path position.
     **/
    BezierPath.prototype.getTangentAt = function( t ) {
	return this.getTangent( t * this.totalArcLength );
    };

    
  
    /**
     *  Get the tangent of the bézier path at the given path location.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getTangent
     * @param {number} u - The relative path position: <pre>0 <= u <= getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The tangent vector at the relative path position.
     **/
    BezierPath.prototype.getTangent = function( u ) {
	if( u < 0 || u > this.totalArcLength ) {
	    console.warn( "[BezierPath.getTangent(u)] u is out of bounds: " + u + "." );
	    return null;
	}
	// Find the spline to extract the value from
	var i = 0;
	var uTemp = 0.0;
	while( i < this.bezierCurves.length &&
	       (uTemp + this.bezierCurves[i].getLength()) < u 
	     ) {   
	    uTemp += this.bezierCurves[ i ].getLength();
	    i++;
	}
	var bCurve    = this.bezierCurves[ i ];
	var relativeU = u - uTemp;
	return bCurve.getTangent( relativeU );
    };



    /**
     * Get the perpendicular of the bézier path at the given absolute path location (fraction).<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getPerpendicularAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The perpendicluar vector at the absolute path position.
     **/
    BezierPath.prototype.getPerpendicularAt = function( t ) { 
	return this.getPerpendicular( t * this.totalArcLength );
    };



    /**
     * Get the perpendicular of the bézier path at the given relative path location.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getPerpendicular
     * @param {number} u - The relative path position: <pre>0 <= u <= getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The perpendicluar vector at the relative path position.
     **/
    BezierPath.prototype.getPerpendicular = function( u ) {
	if( u < 0 || u > this.totalArcLength ) {
	    console.log( "[IKRS.BezierPath.getPerpendicular(u)] u is out of bounds: " + u + "." );
	    return null;
	}

	// Find the spline to extract the value from
	var i = 0;
	var uTemp = 0.0;
	
	while( i < this.bezierCurves.length &&
	       (uTemp + this.bezierCurves[i].getLength()) < u 
	     ) {
	    
	    uTemp += this.bezierCurves[ i ].getLength();
	    i++;

	}

	var bCurve    = this.bezierCurves[ i ];
	var relativeU = u - uTemp;
	return bCurve.getPerpendicular( relativeU );
    };    

    /**
     * This function moves the addressed curve point (or control point) with
     * keeping up the path's curve integrity.<br>
     * <br>
     * Thus is done by moving neighbour- and control- points as needed.
     *
     * @method moveCurvePoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {number} pointID - One of the curve's four point IDs (START_POINT, 
     *                           START_CONTROL_POINT, END_CONTRO_POINT or END_POINT).
     * @param {Vertex} moveAmount - The amount to move the addressed vertex by.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.moveCurvePoint = function( curveIndex,      // int
						    pointID,         // int
						    moveAmount       // Vertex
						  ) {
	var bCurve = this.getCurveAt( curveIndex );
	bCurve.moveCurvePoint( pointID,
			       moveAmount,
			       true,       // move control point, too
			       true        // updateArcLengths
			     );

	// If inner point and NOT control point
	//  --> move neightbour
	if( pointID == this.START_POINT && (curveIndex > 0 || this.adjustCircular) ) {

	    // Set predecessor's control point!
	    var predecessor = this.getCurveAt( curveIndex-1<0 ? this.bezierCurves.length+(curveIndex-1) : curveIndex-1 );
	    predecessor.moveCurvePoint( this.END_CONTROL_POINT, 
					moveAmount,
					true,                    // move control point, too
					false                    // updateArcLengths
				      );

	} else if( pointID == this.END_POINT && (curveIndex+1 < this.bezierCurves.length || this.adjustCircular) ) {
	    // Set successcor
	    var successor = this.getCurveAt( (curveIndex+1)%this.bezierCurves.length );
	    successor.moveCurvePoint( this.START_CONTROL_POINT, 
				      moveAmount, 
				      true,                  // move control point, too
				      false                  // updateArcLengths
				    );
	    
	} else if( pointID == this.START_CONTROL_POINT && curveIndex > 0 ) {
	    
	    this.adjustPredecessorControlPoint( curveIndex, 
						true,            // obtain handle length?
						false            // update arc lengths
					      );
	    
	} else if( pointID == this.END_CONTROL_POINT && curveIndex+1 < this.getCurveCount() ) {
	    
	    this.adjustSuccessorControlPoint( curveIndex, 
					      true,            // obtain handle length?
					      false            // update arc lengths
					    );
	    
	}

	// Don't forget to update the arc lengths!
	// Note: this can be optimized as only two curves have changed their lengths!
	this.updateArcLengths();
    };


    
    /**
     * This helper function adjusts the given point's predecessor's control point.
     *
     * @method adjustPredecessorControlPoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {boolean} obtainHandleLength - Moves the point with keeping the original handle length.
     * @param {boolean} updateArcLength - The amount to move the addressed vertex by.
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.adjustPredecessorControlPoint = function( curveIndex,          // int
								   obtainHandleLength,  // boolean
								   updateArcLengths     // boolean
								 ) {
	
	if( !this.adjustCircular && curveIndex <= 0 )
	    return false;

	var mainCurve      = this.getCurveAt( curveIndex );
	var neighbourCurve = this.getCurveAt( curveIndex-1<0 ? this.getCurveCount()+(curveIndex-1) : curveIndex-1 );
	/* return ? */ this.adjustNeighbourControlPoint( mainCurve,
						 neighbourCurve,
						 mainCurve.getStartPoint(),            // the reference point
						 mainCurve.getStartControlPoint(),     // the dragged control point
						 neighbourCurve.getEndPoint(),         // the neighbour's point
						 neighbourCurve.getEndControlPoint(),  // the neighbour's control point to adjust
						 obtainHandleLength,
						 updateArcLengths
					       );
    }


    
    /**
     * This helper function adjusts the given point's successor's control point.
     *
     * @method adjustSuccessorControlPoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {boolean} obtainHandleLength - Moves the point with keeping the original handle length.
     * @param {boolean} updateArcLength - The amount to move the addressed vertex by.
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.adjustSuccessorControlPoint = function( curveIndex,          // int
								 obtainHandleLength,  // boolean
								 updateArcLengths     // boolean
							       ) {
	if( !this.adjustCirculat && curveIndex+1 > this.getCurveCount() )
	    return false; 


	var mainCurve      = this.getCurveAt( curveIndex );
	var neighbourCurve = this.getCurveAt( (curveIndex+1)%this.getCurveCount() );
	return this.adjustNeighbourControlPoint( mainCurve,
						 neighbourCurve,
						 mainCurve.getEndPoint(),                // the reference point
						 mainCurve.getEndControlPoint(),         // the dragged control point
						 neighbourCurve.getStartPoint(),         // the neighbour's point
						 neighbourCurve.getStartControlPoint(),  // the neighbour's control point to adjust
						 obtainHandleLength,
						 updateArcLengths
					       );
    }

    /**
     * This helper function adjusts the given point's successor's control point.
     *
     * @method adjustNeighbourControlPoint
     * @param {CubicBezierCurve} mainCurve
     * @param {CubicBezierCurve} neighbourCurve
     * @param {Vertex} mainPoint
     * @param {Vertex} mainControlPoint
     * @param {Vertex} neighbourPoint
     * @param {Vertex} neighbourControlPoint
     * @param {boolean} obtainHandleLengths
     * @param {boolean} updateArcLengths
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    // !!! TODO: SHOULDNT THIS BE A STATIC FUNCTION ???
    BezierPath.prototype.adjustNeighbourControlPoint = function( mainCurve,
								 neighbourCurve,
								 mainPoint,
								 mainControlPoint,
								 neighbourPoint,
								 neighbourControlPoint,
								 obtainHandleLengths,  // boolean
								 updateArcLengths
							       ) {

	// Calculate start handle length
	var mainHandleBounds        = new Vertex( mainControlPoint.x - mainPoint.x,
						  mainControlPoint.y - mainPoint.y
						);
	var neighbourHandleBounds   = new Vertex( neighbourControlPoint.x - neighbourPoint.x,
						  neighbourControlPoint.y - neighbourPoint.y
						);
	var mainHandleLength        = Math.sqrt( Math.pow(mainHandleBounds.x,2) + Math.pow(mainHandleBounds.y,2) );
	var neighbourHandleLength   = Math.sqrt( Math.pow(neighbourHandleBounds.x,2) + Math.pow(neighbourHandleBounds.y,2) );

	if( mainHandleLength <= 0.1 ) 
	    return; // no secure length available for division
	
	
	// Just invert the main handle (keep length or not?
	if( obtainHandleLengths ) {
	    neighbourControlPoint.set( neighbourPoint.x - mainHandleBounds.x * (neighbourHandleLength/mainHandleLength),
				       neighbourPoint.y - mainHandleBounds.y * (neighbourHandleLength/mainHandleLength)
				     );
	} else {
	    neighbourControlPoint.set( neighbourPoint.x - mainHandleBounds.x, // * (neighbourHandleLength/mainHandleLength),
				       neighbourPoint.y - mainHandleBounds.y // * (neighbourHandleLength/mainHandleLength)
				     );
	}
	neighbourCurve.updateArcLengths();
    };


    
    /**
     * Clone this BezierPath (deep clone).
     *
     * @method clone
     * @instance
     * @memberof BezierPath
     * @return {BezierPath}
     **/
    BezierPath.prototype.clone = function() {
	var path = new BezierPath( null );
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    path.bezierCurves.push( this.bezierCurves[i].clone() );
	    // Connect splines
	    if( i > 0 )
		path.bezierCurves[i-1].endPoint = path.bezierCurves[i].startPoint;
	}
	path.updateArcLengths();
	path.adjustCircular = this.adjustCircular;
	return path;
    };


    
    /**
     * Compare this and the passed Bézier path.
     *
     * @method equals
     * @param {BezierPath} path - The pass to compare with.
     * @instance
     * @memberof BezierPath
     * @return {boolean}
     **/
    BezierPath.prototype.equals = function( path ) {
	if( !path )
	    return false;
	// Check if path contains the credentials
	if( !path.bezierCurves )
	    return false;
	if( typeof path.bezierCurves.length == "undefined" )
	    return false;
	if( path.bezierCurves.length != this.bezierCurves.length )
	    return false;
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    if( !this.bezierCurves[i].equals(path.bezierCurves[i]) )
		return false;
	}
	return true;
    };


    /**
     * Create a <pre>&lt;path&gt;</pre> SVG representation of this bézier curve.
     *
     * @method toSVGString
     * @param {object=} [options={}] - Like options.className
     * @param {string=} [options.className] - The classname to use for the SVG item.
     * @instance
     * @memberof BezierPath
     * @return {string} The SVG string.
     **/
    BezierPath.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<path' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' d="' );
	for( var c = 0; c < this.bezierCurves.length; c++ ) {
	    if( c > 0 )
		buffer.push( ' ' );
	    buffer.push( this.bezierCurves[c].toSVGPathData() );
	}
	buffer.push( '" />' );
	return buffer.join('');
    };



    /**
     * Create a JSON string representation of this bézier curve.
     *
     * @method toJSON
     * @param {boolean} prettyFormat - If true then the function will add line breaks.
     * @instance
     * @memberof BezierPath
     * @return {string} The JSON string.
     **/
    BezierPath.prototype.toJSON = function( prettyFormat ) {
	var buffer = [];
	buffer.push( "[" ); // array begin
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    if( i > 0 ) 
		buffer.push( "," );
	    if( prettyFormat)
		buffer.push( "\n\t" );
	    else
		buffer.push( " " );
	    buffer.push( this.bezierCurves[i].toJSON( prettyFormat ) );
	}
	if( this.bezierCurves.length != 0 )
	    buffer.push( " " );
	buffer.push( "]" ); // array end
	
	return buffer.join( "" ); // Convert to string, with empty separator.
    };


    /**
     * Parse a BezierPath from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The string with the JSON data.
     * @throw An error if the string is not JSON or does not contain a bezier path object.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The parsed bezier path instance.
     **/
    BezierPath.fromJSON = function( jsonString ) {

	var obj = JSON.parse( jsonString );

	return IKRS.BezierPath.fromArray( obj );
    };


    /**
     * Create a BezierPath instance from the given array.
     *
     * @method fromArray
     * @param {Vertex[][]} arr - A two-dimensional array containing the bezier path vertices.
     * @throw An error if the array does not contain proper bezier path data.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the array data.
     **/
    BezierPath.fromArray = function( arr ) {

	if( !Array.isArray(arr) )
	    throw "[BezierPath.fromArray] Passed object must be an array.";
	
	if( arr.length < 1 )
	    throw "[BezierPath.fromArray] Passed array must contain at least one bezier curve (has " + arr.length + ").";
	
	// Create an empty bezier path
	var bPath = new BezierPath( null );
	var lastCurve = null;
	for( var i = 0; i < arr.length; i++ ) {
	    
	    // Convert object (or array?) to bezier curve
	    var bCurve = null;
	    if( 0 in arr[i] && 1 in arr[i] && 2 in arr[i] && 3 in arr[i] ) {
		if( !arr[i][0] || !arr[i][1] || !arr[i][2] || !arr[i][3] )
		    throw "Cannot convert path data to BezierPath instance. At least one element is undefined (index="+i+"): " + arr[i];
		bCurve = CubicBezierCurve.fromArray( arr[i] );
	    } else {
		bCurve = CubicBezierCurve.fromObject( arr[i] );
	    }
	    // Set curve start point?
	    // (avoid duplicate point instances!)
	    if( lastCurve )
		bCurve.startPoint = lastCurve.endPoint;
	    
	    // Add to path's internal list
	    bPath.bezierCurves.push( bCurve );
	    bPath.totalArcLength += bCurve.getLength(); 	    
	    
	    lastCurve = bCurve;
	}   
	// Bezier segments added. Done
	return bPath;
    }


    
    /**
     * This function converts the bezier path into a string containing
     * integer values only.
     * The points' float values are rounded to 1 digit after the comma.
     *
     * The returned string represents a JSON array (with leading '[' and
     * trailing ']', the separator is ',').
     *
     * @method toReducedListRepresentation
     * @param {number} digits - The number of digits to be used after the comma '.'.
     * @instance
     * @memberof BezierPath
     * @return {string} The reduced list representation of this path.
     **/
    BezierPath.prototype.toReducedListRepresentation = function( digits ) {
	
	if( typeof digits == "undefined" )
	    digits = 1;
	
	var buffer = [];
	//var digits = 1;
	buffer.push( "[" ); // array begin
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    
	    var curve = this.bezierCurves[i];
	    buffer.push( BezierPath._roundToDigits(curve.getStartPoint().x,digits,false) );
	    buffer.push( "," );
	    buffer.push( BezierPath._roundToDigits(curve.getStartPoint().y,digits,false) );
	    buffer.push( "," );

	    buffer.push( BezierPath._roundToDigits(curve.getStartControlPoint().x,digits,false) );
	    buffer.push( "," );
	    buffer.push( IKRS.BezierPath._roundToDigits(curve.getStartControlPoint().y,digits,false) );
	    buffer.push( "," );
	    
	    buffer.push( BezierPath._roundToDigits(curve.getEndControlPoint().x,digits,false) );
	    buffer.push( "," );
	    buffer.push( BezierPath._roundToDigits(curve.getEndControlPoint().y,digits,false) );
	    buffer.push( "," );		

	}
	if( this.bezierCurves.length != 0 ) {
	    var curve = this.bezierCurves[ this.bezierCurves.length-1 ];
	    buffer.push( BezierPath._roundToDigits(curve.getEndPoint().x,digits,false) );
	    buffer.push( "," );
	    buffer.push( BezierPath._roundToDigits(curve.getEndPoint().y,digits,false) );
	}
	buffer.push( "]" ); // array end
	
	return buffer.join( "" ); // Convert to string, with empty separator.
    };


    /**
     * Parse a BezierPath instance from the reduced list representation.<br>
     * <br>
     * The passed string must represent a JSON array containing numbers only.
     *
     * @method fromReducedListRepresentation
     * @param {string} listJSON - The number of digits to be used after the floating point.
     * @throw An error if the string is malformed.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the string.
     **/
    BezierPath.fromReducedListRepresentation = function( listJSON ) {

	// Parse the array
	var pointArray = JSON.parse( listJSON );

	if( !pointArray.length ) {
	    console.log( "Cannot parse bezier path from non-array object nor from empty point list." );
	    throw "Cannot parse bezier path from non-array object nor from empty point list.";
	}
	
	if( pointArray.length < 8 ) {
	    console.log( "Cannot build bezier path. The passed array must contain at least 8 elements (numbers)." );
	    throw "Cannot build bezier path. The passed array must contain at least 8 elements (numbers).";
	}

	// Convert to object
	var bezierPath = new BezierPath( null ); // No points yet
        
	var startPoint        = null;
	var startControlPoint = null;
	var endControlPoint   = null;
	var endPoint          = null;
	var i = 0;

	do {
	    
	    if( i == 0 )
		startPoint        = new Vertex( pointArray[i], pointArray[i+1] );
	    startControlPoint = new Vertex( pointArray[i+2], pointArray[i+3] );
	    endControlPoint   = new Vertex( pointArray[i+4], pointArray[i+5] );
	    endPoint          = new Vertex( pointArray[i+6], pointArray[i+7] );

	    var bCurve =  new CubicBezierCurve( startPoint,
						endPoint,
						startControlPoint,
						endControlPoint
					      );
	    bezierPath.bezierCurves.push( bCurve );

	    startPoint = endPoint;
	    
	    i += 6;

	} while( i+2 < pointArray.length );

	bezierPath.updateArcLengths();


	return bezierPath;
    };


    /**
     * A helper function.
     *
     * @method _roundToDigits
     * @param {number} number - 
     * @param {number} digits -
     * @param {boolean} enforceInvisibleDigits -
     * @private
     * @memberof BezierPath
     * @return {string}
     **/
    // !!! TODO: isn't Number.toFixed(...) doing this job???
    BezierPath._roundToDigits = function( number, digits, enforceInvisibleDigits ) {
	if( digits <= 0 )
	    return Math.round(number); 

	var magnitude = Math.pow( 10, digits ); // This could be LARGE :/
	number = Math.round( number * magnitude );
	var result = "" + (number  /  magnitude);
	var index = result.lastIndexOf(".");
	if( index == -1 ) {
	    index = result.length;
	}
	if( enforceInvisibleDigits ) {
	    var digitsAfterPoint = result.length - index - 1;
	    var digitsMissing    = enforceInvisibleDigits - digitsAfterPoint;
	    while( digitsMissing-- > 0 )
		result += "&nbsp;";
	}
	
	return result;
    };

    _context.BezierPath = BezierPath;
})(window);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A polygon class.
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-04-14
 * @modified 2018-11-17 Added the containsVert function.
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-10-25 Added the scale function.
 * @modified 2019-11-06 JSDoc update.
 * @modified 2019-11-07 Added toCubicBezierPath(number) function.
 * @modified 2019-11-22 Added the rotate(number,Vertex) function.
 * @version 1.1.0
 *
 * @file Polygon
 * @public
 **/

(function(_context) {
    'use strict';

    /**
     * The constructor.
     *
     * @constructor
     * @name Polygon
     * @param {Vertex[]} vertices - An array of 2d vertices that shape the polygon.
     * @param {boolean} isOpen - Indicates if the polygon should be rendered as an open or closed shape.
     **/
    var Polygon = function( vertices, isOpen ) {
	if( typeof vertices == 'undefined' )
	    vertices = [];
	this.vertices = vertices;
	this.isOpen = isOpen;
    };

    /**
     * @memberof Polygon
     * @type {Vertex[]}
     **/
    Polygon.prototype.vertices = null;

    /**
     * @memberof Polygon
     * @type {boolean}
     **/
    Polygon.prototype.isOpen = false;

    _context.Polygon = Polygon;



    /**
     * Check if the given vertex is inside this polygon.<br>
     * <br>
     * Ray-casting algorithm found at<br>
     *    https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
     *
     * @method containsVert
     * @param {Vertex} vert - The vertex to check.The new x-component.
     * @return {boolean} True if the passed vertex is inside this polygon. The polygon is considered closed.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.containsVert = function( vert ) {
	// function inside(point, vs) {
	//    // ray-casting algorithm based on
	//    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	//
	//    var x = point[0], y = point[1];
	//
	//    var inside = false;
	//    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
	//	var xi = vs[i][0], yi = vs[i][1];
	//	var xj = vs[j][0], yj = vs[j][1];
	//
	//	var intersect = ((yi > y) != (yj > y))
	//	    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	//	if (intersect) inside = !inside;
	//    }
	//
	//    return inside;
	// };

	var inside = false;
	for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            var xi = this.vertices[i].x, yi = this.vertices[i].y;
            var xj = this.vertices[j].x, yj = this.vertices[j].y;

            var intersect = ((yi > vert.y) != (yj > vert.y))
		&& (vert.x < (xj - xi) * (vert.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
	}

	return inside;
    };



    /**
     * Scale the polygon relative to the given center.
     *
     * @method scale
     * @param {number} factor - The scale factor.
     * @param {Vertex} center - The center of scaling.
     * @return {Polygon} this, for chaining.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.scale = function( factor, center ) {
	for( var i in this.vertices ) {
	    if( typeof this.vertices[i].scale == 'function' ) 
		this.vertices[i].scale( factor, center );
	    else
		console.log( 'There seems to be a null vertex!', this.vertices[i] );
	}
	return this;
    };


    /**
     * Rotatee the polygon around the given center.
     *
     * @method rotate
     * @param {number} angle  - The rotation angle.
     * @param {Vertex} center - The center of rotation.
     * @return {Polygon} this, for chaining.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.rotate = function( angle, center ) {
	for( var i in this.vertices ) {
	    this.vertices[i].rotate( angle, center );
	}
	return this;
    };


    /**
     * Convert this polygon to a sequence of quadratic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are pairs of control-point-and-end-point:
     * <pre>startPoint, controlPoint0, pathPoint1, controlPoint1, pathPoint2, controlPoint2, ..., endPoint</pre>
     *
     * @method toQuadraticBezierData
     * @return {Vertex[]}  An array of 2d vertices that shape the quadratic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.toQuadraticBezierData = function() {
	if( this.vertices.length < 3 )
	    return [];
	var qbezier = [];
	var cc0 = this.vertices[0]; 
	var cc1 = this.vertices[1]; 
	var edgeCenter = new Vertex( cc0.x + (cc1.x-cc0.x)/2,
				     cc0.y + (cc1.y-cc0.y)/2 );
	qbezier.push( edgeCenter );
	var limit = this.isOpen ? this.vertices.length : this.vertices.length+1;
	for( var t = 1; t < limit; t++ ) {  
	    cc0 = this.vertices[ t%this.vertices.length ];
	    cc1 = this.vertices[ (t+1)%this.vertices.length ];
	    var edgeCenter = new Vertex( cc0.x + (cc1.x-cc0.x)/2,
					 cc0.y + (cc1.y-cc0.y)/2 );
	    qbezier.push( cc0 );
	    qbezier.push( edgeCenter );
	    cc0 = cc1;
	}
	return qbezier;
    };


    /**
     * Convert this polygon to a quadratic bezier curve, represented as an SVG data string.
     *
     * @method toQuadraticBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.toQuadraticBezierSVGString = function() {
	var qdata = this.toQuadraticBezierData();
	if( qdata.length == 0 )
	    return "";
	var buffer = [ 'M ' + qdata[0].x+' '+qdata[0].y ];
	for( var i = 1; i < qdata.length; i+=2 ) {
	    buffer.push( 'Q ' + qdata[i].x+' '+qdata[i].y + ', ' + qdata[i+1].x+' '+qdata[i+1].y );
	}
	return buffer.join(' ');
    };


    
    /**
     * Convert this polygon to a sequence of cubic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are triplets of (first-control-point, secnond-control-point, end-point):<br>
     * <pre>startPoint, controlPoint0_0, controlPoint1_1, pathPoint1, controlPoint1_0, controlPoint1_1, ..., endPoint</pre>
     *
     * @method toCubicBezierData
     * @param {number=} threshold - An optional threshold (default=1.0) how strong the curve segments 
     *                              should over-/under-drive. Should be between 0.0 and 1.0 for best 
     *                              results but other values are allowed.
     * @return {Vertex[]}  An array of 2d vertices that shape the cubic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.toCubicBezierData = function( threshold ) {

	if( typeof threshold == 'undefined' )
	    threshold = 1.0;
	
	if( this.vertices.length < 3 )
	    return [];
	var cbezier = [];
	var a = this.vertices[0]; 
	var b = this.vertices[1]; 
	var edgeCenter = new Vertex( a.x + (b.x-a.x)/2,   a.y + (b.y-a.y)/2 );
	cbezier.push( edgeCenter );
	
	var limit = this.isOpen ? this.vertices.length-1 : this.vertices.length;
	for( var t = 0; t < limit; t++ ) {
	    var a = this.vertices[ t%this.vertices.length ];
	    var b = this.vertices[ (t+1)%this.vertices.length ];
	    var c = this.vertices[ (t+2)%this.vertices.length ];

	    var aCenter = new Vertex( a.x + (b.x-a.x)/2,   a.y + (b.y-a.y)/2 );
	    var bCenter = new Vertex( b.x + (c.x-b.x)/2,   b.y + (c.y-b.y)/2 );
	    
	    var a2 = new Vertex( aCenter.x + (b.x-aCenter.x)*threshold, aCenter.y + (b.y-aCenter.y)*threshold );
	    var b0 = new Vertex( bCenter.x + (b.x-bCenter.x)*threshold, bCenter.y + (b.y-bCenter.y)*threshold );

	    cbezier.push( a2 );
	    cbezier.push( b0 );
	    cbezier.push( bCenter );
	    
	}
	return cbezier;
	
    };


    
    /**
     * Convert this polygon to a cubic bezier curve, represented as an SVG data string.
     *
     * @method toCubicBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.toCubicBezierSVGString = function( threshold ) {
	var qdata = this.toCubicBezierData( threshold );
	if( qdata.length == 0 )
	    return "";
	var buffer = [ 'M ' + qdata[0].x+' '+qdata[0].y ];
	for( var i = 1; i < qdata.length; i+=3 ) {
	    buffer.push( 'C ' + qdata[i].x+' '+qdata[i].y + ', ' + qdata[i+1].x+' '+qdata[i+1].y + ', ' + qdata[i+2].x + ' ' + qdata[i+2].y );
	}
	return buffer.join(' ');
    };

    

    /**
     * Convert this polygon to a cubic bezier path instance.
     *
     * @method toCubicBezierPath
     * @param {number} threshold - The threshold, usually from 0.0 to 1.0.
     * @return {BezierPath}      - A bezier path instance.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.toCubicBezierPath = function( threshold ) {
	var qdata = this.toCubicBezierData( threshold );
	// Conver the linear path vertices to a two-dimensional path array
	var pathdata = [];
	for( var i = 0; i+3 < qdata.length; i+=3 ) {
	    pathdata.push( [ qdata[i], qdata[i+3], qdata[i+1], qdata[i+2] ] );
	}
	return BezierPath.fromArray( pathdata );
    };

 
    /**
     * Create an SVG representation of this polygon.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} The SVG string.
     * @instance
     * @memberof Polygon
     **/
    _context.Polygon.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<path' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' d="' );
	if( this.vertices.length > 0 ) {
	    buffer.push( 'M ' );
	    buffer.push( this.vertices[0].x )
	    buffer.push( ' ' );
	    buffer.push( this.vertices[0].y );
	    for( var i = 1; i < this.vertices.length; i++ ) {
		buffer.push( ' L ' );
		buffer.push( this.vertices[i].x )
		buffer.push( ' ' );
		buffer.push( this.vertices[i].y );
	    }
	    if( !this.isOpen ) {
		buffer.push( ' Z' );
	    }
	}
	buffer.push( '" />' );
	return buffer.join('');
    };
    
})(window ? window : module.export );

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A triangle class for triangulations.
 *
 * The class was written for a Delaunay trinagulation demo so it might 
 * contain some strange and unexpected functions.
 *
 * @requires Vertex
 * 
 * Inspired by Delaunay at Travellermap
 *   http://www.travellermap.com/tmp/delaunay.htm
 *
 * @author    Ikaros Kappler
 * @date_init 2012-10-17 (Wrote a first version of this in that year).
 * @date      2018-04-03 (Refactored the code into a new class).
 * @modified  2018-04-28 Added some documentation.
 * @modified  2019-09-11 Added the scaleToCentroid(Number) function (used by the walking triangle demo).
 * @modified  2019-09-12 Added beautiful JSDoc compliable comments.
 * @modified  2019-11-07 Added to toSVG(options) function to make Triangles renderable as SVG.
 * @modified  2019-12-09 Fixed the determinant() function. The calculation was just wrong.
 * @version   2.0.5
 *
 * @file Triangle
 * @public
 **/


(function(_context) {

    /**
     * An epsilon for comparison.
     * This should be the same epsilon as in Vertex.
     *
     * @private
     **/
    var EPSILON = 1.0e-6;


    /**
     * The constructor.
     * 
     * @param {Vertex} a - The first vertex of the triangle.
     * @param {Vertex} b - The second vertex of the triangle.
     * @param {Vertex} c - The third vertex of the triangle.
     **/
    var Triangle = function( a, b, c )	{
	this.a = a;
	this.b = b;
	this.c = c;

	this.calcCircumcircle();
	
    }

    /**
     * Get the centroid of this triangle.
     *
     * The centroid is the average midpoint for each side.
     *
     * @return {Vertex} The centroid
     **/
    Triangle.prototype.getCentroid = function() {
	return new Vertex( (this.a.x + this.b.x + this.c.x)/3,
			   (this.a.y + this.b.y + this.c.y)/3
			 );
    };



    /**
     * Scale the triangle towards its centroid.
     *
     * @param {Number} - The scale factor to use. This can be any scalar.
     * @return {Triangle} this for chaining
     */
    Triangle.prototype.scaleToCentroid = function( factor ) {
	let centroid = this.getCentroid();
	this.a.scale( factor, centroid );
	this.b.scale( factor, centroid );
	this.c.scale( factor, centroid );
	return this;
    };
    
    

    /**
     * Get the circumcircle of this triangle.
     *
     * The circumcircle is that unique circle on which all three
     * vertices of this triangle are located on.
     *
     * @return {Object} - { center:Vertex, radius:float }
     */
    Triangle.prototype.getCircumcircle = function() {
	if( !this.center || !this.radius ) 
	    this.calcCircumcircle();
	return { center : this.center.clone(), radius : this.radius };
    };



    /**
     * Check if this triangle and the passed triangle share an
     * adjacent edge.
     *
     * For edge-checking Vertex.equals is used which uses an
     * an epsilon for comparison.
     *
     * @param {Triangle} tri - The second triangle to check adjacency with.
     *
     * @return {boolean} - True if this and the passed triangle have at least one common edge.
     */
    Triangle.prototype.isAdjacent = function( tri ) {
	var a = this.a.equals(tri.a) || this.a.equals(tri.b) || this.a.equals(tri.c);
	var b = this.b.equals(tri.a) || this.b.equals(tri.b) || this.b.equals(tri.c);
	var c = this.c.equals(tri.a) || this.c.equals(tri.b) || this.c.equals(tri.c);
	return (a&&b) || (a&&c) || (b&&c);
    };


    
    /**
     * Get that vertex of this triangle (a,b,c) that is not vert1 nor vert2 of 
     * the passed two.
     *
     * @param {Vertex} vert1 - The first vertex.
     * @param {Vertex} vert2 - The second vertex.
     * @return Vertex - The third vertex of this triangle that makes up the whole triangle with vert1 and vert2.
     */
    Triangle.prototype.getThirdVertex = function( vert1, vert2 ) {
	if( this.a.equals(vert1) && this.b.equals(vert2) || this.a.equals(vert2) && this.b.equals(vert1) ) return this.c;
	if( this.b.equals(vert1) && this.c.equals(vert2) || this.b.equals(vert2) && this.c.equals(vert1) ) return this.a;
	//if( this.c.equals(vert1) && this.a.equals(vert2) || this.c.equals(vert2) && this.a.equals(vert1) )
	return this.b;
    };


    /**
     * Re-compute the circumcircle of this triangle (if the vertices
     * have changed).
     *
     * The circumcenter and radius are stored in this.center and
     * this radius. There is a third result: radius_squared.
     *
     * @return void
     */
    Triangle.prototype.calcCircumcircle = function() {
	// From
	//    http://www.exaflop.org/docs/cgafaq/cga1.html

	var A = this.b.x - this.a.x; 
	var B = this.b.y - this.a.y; 
	var C = this.c.x - this.a.x; 
	var D = this.c.y - this.a.y; 

	var E = A*(this.a.x + this.b.x) + B*(this.a.y + this.b.y); 
	var F = C*(this.a.x + this.c.x) + D*(this.a.y + this.c.y); 

	var G = 2.0*(A*(this.c.y - this.b.y)-B*(this.c.x - this.b.x)); 
	
	var dx, dy;
	
	if( Math.abs(G) < EPSILON ) {
	    // Collinear - find extremes and use the midpoint		
	    var bounds = this.bounds();
	    this.center = new Vertex( ( bounds.xMin + bounds.xMax ) / 2, ( bounds.yMin + bounds.yMax ) / 2 );

	    dx = this.center.x - bounds.xMin;
	    dy = this.center.y - bounds.yMin;
	} else {
	    var cx = (D*E - B*F) / G; 
	    var cy = (A*F - C*E) / G;

	    this.center = new Vertex( cx, cy );

	    dx = this.center.x - this.a.x;
	    dy = this.center.y - this.a.y;
	}

	this.radius_squared = dx * dx + dy * dy;
	this.radius = Math.sqrt( this.radius_squared );
    }; // END calcCircumcircle



    /**
     * Check if the passed vertex is inside this triangle's
     * circumcircle.
     *
     * @param {Vertex} v - The vertex to check.
     * @return boolean
     */
    Triangle.prototype.inCircumcircle = function( v ) {
	var dx = this.center.x - v.x;
	var dy = this.center.y - v.y;
	var dist_squared = dx * dx + dy * dy;

	return ( dist_squared <= this.radius_squared );
	
    }; // inCircumcircle



    /**
     * Get the rectangular bounds for this triangle.
     *
     * @return {Object} - { xMin:float, xMax:float, yMin:float, yMax:float, width:float, height:float }
     */
    Triangle.prototype.bounds = function() {
	function max3( a, b, c ) { return ( a >= b && a >= c ) ? a : ( b >= a && b >= c ) ? b : c; }
	function min3( a, b, c ) { return ( a <= b && a <= c ) ? a : ( b <= a && b <= c ) ? b : c; }
	var minx = min3( this.a.x, this.b.x, this.c.x );
	var miny = min3( this.a.y, this.b.y, this.c.y );
	var maxx = max3( this.a.x, this.b.x, this.c.x );
	var maxy = max3( this.a.y, this.b.y, this.c.y );
	return { xMin : minx, yMin : miny, xMax : maxx, yMax : maxy, width : maxx-minx, height : maxy-miny };
    };


    /**
     * Get the determinant of this triangle.
     *
     * @return {Number} - The determinant (float).
     */
    Triangle.prototype.determinant = function() {
	// This is wrong.
	// return this.b.x*this.b.y* 0.5 * ( - this.b.x*this.a.y - this.a.x*this.b.y - this.b.x*this.c.y + this.c.x*this.a.y + this.a.x*this.c.y );
	// This is correct:
	// (b.y - a.y)*(c.x - b.x) - (c.y - b.y)*(b.x - a.x);
	return (this.b.y - this.a.y)*(this.c.x - this.b.x) - (this.c.y - this.b.y)*(this.b.x - this.a.x);
    };

    
    /**
     * Checks if the passed vertex (p) is inside this triangle.
     *
     * Note: matrix determinants rock.
     *
     * @param {Vertex} p - The vertex to check.
     * @return {boolean}
     */
    Triangle.prototype.containsPoint = function( p ) {
	//
	// Point-in-Triangle test found at
	//   http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-2d-triangle
	//
	function pointIsInTriangle( px, py, p0x, p0y, p1x, p1y, p2x, p2y ) {
	    
	    var area = 1/2*(-p1y*p2x + p0y*(-p1x + p2x) + p0x*(p1y - p2y) + p1x*p2y);

	    var s = 1/(2*area)*(p0y*p2x - p0x*p2y + (p2y - p0y)*px + (p0x - p2x)*py);
	    var t = 1/(2*area)*(p0x*p1y - p0y*p1x + (p0y - p1y)*px + (p1x - p0x)*py);

	    return s > 0 && t > 0 && (1-s-t) > 0;
	};

	return pointIsInTriangle( p.x, p.y, this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y );
    };


    
    /**
     * Converts this triangle into a human-readable string.
     *
     * @return {string}
     */
    Triangle.prototype.toString = function() {
	return '{ a : ' + this.a.toString () + ', b : ' + this.b.toString() + ', c : ' + this.c.toString() + '}';
    };


    /**
     * Create an SVG representation of this triangle.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} The SVG string.
     * @instance
     * @memberof Polygon
     **/
    Triangle.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<path' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' d="' );
	var vertices = [ this.a, this.b, this.c ];
	if( vertices.length > 0 ) {
	    buffer.push( 'M ' );
	    buffer.push( vertices[0].x )
	    buffer.push( ' ' );
	    buffer.push( vertices[0].y );
	    for( var i = 1; i < vertices.length; i++ ) {
		buffer.push( ' L ' );
		buffer.push( vertices[i].x )
		buffer.push( ' ' );
		buffer.push( vertices[i].y );
	    }
	    //if( !this.isOpen ) {
		buffer.push( ' Z' );
	    //}
	}
	buffer.push( '" />' );
	return buffer.join('');
    };

    _context.Triangle = Triangle;
    // END Triangle

})( window ? window : module.export );


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @version  1.0.1
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/

(function(_context) {

    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center The ellipses center.
     * @param {Vertex} axis The x- and y-axis.
     * @name VEllipse
     **/
    var VEllipse = function( center, axis ) {
	this.center = center;
	this.axis = axis;
    };


    /** 
     * @member {Vertex} 
     * @memberof VEllipse
     * @instance
     */
    VEllipse.prototype.center = null;

    /** 
     * @member {Vertex} 
     * @memberof VEllipse
     * @instance
     */
    VEllipse.prototype.axis = null;


    // +---------------------------------------------------------------------------------
    // | Create an SVG representation of this ellipse.
    // |
    // | @return string The SVG string
    // +-------------------------------
    VEllipse.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<ellipse' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' cx="' + this.center.x + '"' );
	buffer.push( ' cy="' + this.center.y + '"' );
	buffer.push( ' rx="' + this.axis.x + '"' );
	buffer.push( ' ry="' + this.axis.y + '"' );
	buffer.push( ' />' );
	return buffer.join('');
    };

    _context.VEllipse = VEllipse;
    
})(window ? window : module.export );

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * @classdesc A wrapper for image objects.
 *
 * @author  Ikaros Kappler
 * @date    2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @version 1.0.1
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with 
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/

(function(_context) {
    'use strict';

    /**
     * The constructor.
     * 
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    var PBImage = function( image, upperLeft, lowerRight ) {
	if( typeof image == 'undefined' )
	    throw Error('image must not be null.');
	if( typeof upperLeft == 'undefined' )
	    throw Error('upperLeft must not be null.');
	if( typeof lowerRight == 'undefined' )
	    throw Error('lowerRight must not be null.');
	this.image = image;
	this.upperLeft = upperLeft;
	this.lowerRight = lowerRight;
    };

    _context.PBImage = PBImage;
    
})(window ? window : module.export);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * A simple mouse handler for demos. 
 * Use to avoid load massive libraries like jQuery.
 *
 * Usage: 
 *   new MouseHandler( document.getElementById('mycanvas') )
 *	    .drag( function(e) {
 *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
 *		if( e.params.leftMouse ) ;
 *		else if( e.params.rightMouse ) ;
 *	    } )
 *	    .move( function(e) {
 *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
 *	    } )
 *          .up( function(e) {
 *              console.log( 'Mouse up.' );
 *          } )
 *          .down( function(e) {
 *              console.log( 'Mouse down.' );
 *          } )
 *          .click( function(e) {
 *              console.log( 'Click.' );
 *          } )
 *          .wheel( function(e) {
 *              console.log( 'Wheel. delta='+e.deltaY );
 *          } )
 *
 *
 * @author   Ikaros Kappler
 * @date     2018-03-19
 * @modified 2018-04-28 Added the param 'wasDragged'.
 * @modified 2018-08-16 Added the param 'dragAmount'.
 * @modified 2018-08-27 Added the param 'element'.
 * @modified 2018-11-11 Changed the scope from a simple global var to a member of window/_context.
 * @modified 2018-11-19 Renamed the 'mousedown' function to 'down' and the 'mouseup' function to 'up'.
 * @modified 2018-11-28 Added the 'wheel' listener.
 * @modified 2018-12-09 Cleaned up some code.
 * @modified 2019-02-10 Cleaned up some more code.
 * @version  1.0.8
 **/

(function(_context) {

    // +----------------------------------------------------------------------
    // | The constructor.
    // |
    // | Pass the DOM element you want to receive mouse events from.
    // +-------------------------------------------------
    function __constructor( element ) {

	// +----------------------------------------------------------------------
	// | Some private vars to store the current mouse/position/button state.
	// +-------------------------------------------------
	var mouseDownPos = null;
	var mouseDragPos = null;
	var mousePos     = null;
	var mouseButton  = -1;
	var listeners    = {};
	var installed    = {};
	var handlers     = {};


	// +----------------------------------------------------------------------
	// | Some private vars to store the current mouse/position/button state.
	// +-------------------------------------------------
	function relPos(e) {
	    return { x : e.pageX - e.target.offsetLeft,
		     y : e.pageY - e.target.offsetTop
		   };
	}
	function mkParams(e,eventName) {
	    var rel = relPos(e); 
	    e.params = { element : element, name : eventName, pos : rel, button : mouseButton, leftButton : mouseButton==0, middleButton : mouseButton==1, rightButton : mouseButton==2, mouseDownPos : mouseDownPos, draggedFrom : mouseDragPos, wasDragged : (mouseDownPos!=null&&(mouseDownPos.x!=rel.x||mouseDownPos.y!=rel.y)), dragAmount : (mouseDownPos!=null?{x:rel.x-mouseDragPos.x,y:rel.y-mouseDragPos.y}:{x:0,y:0}) };
	    return e;
	}

	function listenFor( eventName ) {
	    if( installed[eventName] ) return;
	    element.addEventListener(eventName,handlers[eventName]);
	    installed[eventName] = true;
	}

	function unlistenFor( eventName ) {
	    if( !installed[eventName] ) return;
	    element.removeEventListener(eventName,handlers[eventName]);
	    delete installed[eventName];
	}


	// +----------------------------------------------------------------------
	// | Define the internal event handlers.
	// |
	// | They will dispatch the modified event (relative mouse position,
	// | drag offset, ...) to the callbacks.
	// +-------------------------------------------------
	handlers['mousemove'] = function(e) {
	    if( listeners.mousemove ) listeners.mousemove( mkParams(e,'mousemove') );
	    if( mouseDragPos && listeners.drag ) listeners.drag( mkParams(e,'drag') );
	    if( mouseDownPos ) mouseDragPos = relPos(e);
	}
	handlers['mouseup'] = function(e) {
	    if( listeners.mouseup ) listeners.mouseup( mkParams(e,'mouseup') );
	    mouseDragPos = null;
	    mouseDownPos = null;
	    mouseButton  = -1;
	}
	handlers['mousedown'] = function(e) {
	    mouseDragPos = relPos(e);
	    mouseDownPos = relPos(e);
	    mouseButton = e.button;
	    if( listeners.mousedown ) listeners.mousedown( mkParams(e,'mousedown') );
	}
	handlers['click'] = function(e) {
	    if( listeners.click ) listeners.click( mkParams(e,'mousedown') );
	}
	handlers['wheel'] = function(e) {
	    if( listeners.wheel ) listeners.wheel( mkParams(e,'wheel') );
	}


	// +----------------------------------------------------------------------
	// | The installer functions.
	// |
	// | Pass your callbacks here.
	// | Note: they support chaining.
	// +-------------------------------------------------
	this.drag = function( callback ) {
	    if( listeners.drag ) throwAlreadyInstalled('drag');
	    listeners.drag = callback;
	    listenFor('mousedown');
	    listenFor('mousemove');
	    listenFor('mouseup');
	    //listeners.drag = callback;
	    return this;
	};
	this.move = function( callback ) {
	    if( listeners.mousemove ) throwAlreadyInstalled('mousemove');
	    listenFor('mousemove');
	    listeners.mousemove = callback;
	    return this;
	};
	this.up = function( callback ) {
	    if( listeners.mouseup ) throwAlreadyInstalled('mouseup'); 
	    listenFor('mouseup');
	    listeners.mouseup = callback;
	    return this;
	};
	this.down = function( callback ) {
	    if( listeners.mousedown ) throwAlreadyInstalled('mousedown'); 
	    listenFor('mousedown');
	    listeners.mousedown = callback;
	    return this;
	};
	this.click = function( callback ) {
	    if( listeners.click ) throwAlreadyInstalled('click'); 
	    listenFor('click');
	    listeners.click = callback;
	    return this;
	};
	this.wheel = function( callback ) {
	    if( listeners.wheel ) throwAlreadyInstalled('wheel');
	    listenFor('wheel');
	    listeners.wheel = callback;
	    return this;
	};

	function throwAlreadyInstalled( name ) {
	    throw "This MouseHandler already has a '"+name+"' callback. To keep the code simple there is only room for one.";
	}
	
	// +----------------------------------------------------------------------
	// | Call this when your work is done.
	// |
	// | The function will un-install all event listeners.
	// +-------------------------------------------------
	this.destroy = function() {
	    unlistenFor('mousedown');
	    unlistenFor('mousemove');
	    unlistenFor('moseup');
	    unlistenFor('click');
	    unlistenFor('wheel');
	}
    }

    _context.MouseHandler = __constructor;
})(window);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * A generic key handler.
 *
 * Example
 * =======
 * 
 *	new KeyHandler( { trackAll : true } )
 *	    .down('enter',function() { console.log('ENTER was hit.'); } )
 *	    .press('enter',function() { console.log('ENTER was pressed.'); } )
 *	    .up('enter',function() { console.log('ENTER was released.'); } )
 *
 *          .down('e',function() { console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } )
 *
 *	    .up('windows',function() { console.log('windows was released.'); } )
 *	;
 *
 * @author  Ikaros Kappler
 * @date    2018-11-11 (Alaaf)
 * @version 1.0.0
 **/

(function(_context) {
    'use strict';

    // +----------------------------------------------------------------------
    // | The constructor.
    // |
    // | @param options.element (optional) The HTML element to listen on; if null then 'window' will be used.
    // | @param options.trackAll (optional) Set to true if you want to keep track of _all_ keys (keyStatus).
    // +-------------------------------------------------
    var KeyHandler = function( options ) {
	options = options || {};
	this.element = options.element ? options.element : window;
	this.downListeners = [];
	this.pressListeners = [];
	this.upListeners = [];
	this.keyStates = [];
	// This could be made configurable in a later version. It allows to
	// keep track of the key status no matter if there are any listeners
	// on the key or not.
	this.trackAllKeys = options.trackAll || false;
	// For later retrieval
	this._keyDownListener = null;
	this._keyPressListener = null;
	this._keyUpListener = null;
	// Install the listeners
	this.installListeners();
    };

    
    // +----------------------------------------------------------------------
    // | A helper function to fire key events from this KeyHandler.
    // +-------------------------------------------------
    var fireEvent = function( event, listeners ) {
	var hasListener = false;
	for( var i in listeners ) {
	    var lis = listeners[i];
	    if( lis.keyCode != event.keyCode )
		continue;
	    lis.listener(event);
	    hasListener = true;
	}
	return hasListener;
    };


       
    // +----------------------------------------------------------------------
    // | Internal function to fire a new keydown event to all listeners.
    // | You should not call this function on your own unless you know what you do.
    // |
    // | @param e:KeyEvent
    // +-------------------------------------------------
    var fireDownEvent = function(e,handler) {
	if( fireEvent(e,handler.downListeners) || handler.trackAllKeys ) {
	    // Down event has listeners. Update key state.
	    handler.keyStates[e.keyCode] = 'down';
	}
    };
   
    // +----------------------------------------------------------------------
    // | Internal function to fire a new keypress event to all listeners.
    // | You should not call this function on your own unless you know what you do.
    // |
    // | @param e:KeyEvent
    // +-------------------------------------------------
    var firePressEvent = function(e,handler) {
	fireEvent(e,handler.pressListeners);
    };

    // +----------------------------------------------------------------------
    // | Internal function to fire a new keyup event to all listeners.
    // | You should not call this function on your own unless you know what you do.
    // |
    // | @param e:KeyEvent
    // +-------------------------------------------------
    var fireUpEvent = function(e,handler) {
	if( fireEvent(e,handler.upListeners) || handler.trackAllKeys ) {
	    // Up event has listeners. Clear key state.
	    delete handler.keyStates[e.keyCode];
	}
    };


    // +----------------------------------------------------------------------
    // | Resolve the key/name code.
    // +-------------------------------------------------
    var key2code = function( key ) {
	if( typeof key == 'number' ) 
	    return key;
	if( typeof key != 'string' )
	    throw "Unknown key name or key type (should be a string or integer): " + key;
	if( KeyHandler.KEY_CODES[key] )
	    return KeyHandler.KEY_CODES[key];
	throw "Unknown key (cannot resolve key code): " + key;
    };
    

    // +----------------------------------------------------------------------
    // | Source:
    // |    https://keycode.info/
    // +-------------------------------------------------
    KeyHandler.KEY_CODES = {
	'break'          : 3,
	'backspace'      : 8,
	'delete'	 : 8,
	'tab'	         : 9,
	'clear'	         : 12,
	'enter'	         : 13,
	'shift'	         : 16,
	'ctrl'	         : 17,
	'alt'	         : 18,
	'pause'          : 19,
	'break'	         : 19,
	'capslock'	 : 20,
	'hangul'	 : 21,
	'hanja'	         : 25,
	'escape'	 : 27,
	'conversion' 	 : 28,
	'non-conversion' : 29,
	'spacebar'	 : 32,
	'pageup'	 : 33,
	'pagedown'	 : 34,
	'end'	         : 35,
	'home'	         : 36,
	'leftarrow'	 : 37,
	'uparrow'	 : 38,
	'rightarrow'	 : 39,
	'downarrow'	 : 40,
	'select'	 : 41,
	'print'	         : 42,
	'execute'	 : 43,
	'printscreen'	 : 44,
	'insert'	 : 45,
	'delete'	 : 46,
	'help'	         : 47,
	'0'              : 48,
	'1'              : 49,
	'2'              : 50,
	'3'              : 51,
	'4'              : 52,
	'5'              : 53,
	'6'              : 54,
	'7'              : 55,
	'8'              : 56,
	'9'              : 57,
	':'              : 58,
	'semicolon (firefox)' : 59,
	'equals'	 : 59,
	'<'	         : 60,
	'equals (firefox)' : 61,
	'ß'	         : 63,
	'@ (firefox)'	 : 64,
	'a'	         : 65,
	'b'	         : 66,
	'c'	         : 67,
	'd'	         : 68,
	'e'	         : 69,
	'f'	         : 70,
	'g'	         : 71,
	'h'	         : 72,
	'i'	         : 73,
	'j'	         : 74,
	'k'	         : 75,
	'l'	         : 76,
	'm'	         : 77,
	'n'	         : 78,
	'o'	         : 79,
	'p'	         : 80,
	'q'	         : 81,
	'r'	         : 82,
	's'	         : 83,
	't'	         : 84,
	'u'	         : 85,
	'v'	         : 86,
	'w'	         : 87,
	'x'	         : 88,
	'y'	         : 89,
	'z'	         : 90,
	'windows'        : 91,
	'leftcommand'	 : 91, // left ⌘
	'chromebooksearch' : 91,
	'rightwindowkey' : 92,
	'windowsmenu'	 : 93,
	'rightcommant'   : 93, // right ⌘
	'sleep'	         : 95,
	'numpad0'	 : 96,
	'numpad1'	 : 97,
	'numpad2'	 : 98,
	'numpad3'	 : 99,
	'numpad4'	 : 100,
	'numpad5'	 : 101,
	'numpad6'	 : 102,
	'numpad7'	 : 103,
	'numpad8'	 : 104,
	'numpad9'	 : 105,
	'multiply'	 : 106,
	'add'	         : 107,
	'numpadperiod'	 : 108, // firefox
	'subtract'	 : 109,
	'decimalpoint'	 : 110,
	'divide'	 : 111,
	'f1'	         : 112,
	'f2'	         : 113,
	'f3'	         : 114,
	'f4'	         : 115,
	'f5'	         : 116,
	'f6'	         : 117,
	'f7'	         : 118,
	'f8'	         : 119,
	'f9'	         : 120,
	'f10'	         : 121,
	'f11'	         : 122,
	'f12'	         : 123,
	'f13'	         : 124,
	'f14'	         : 125,
	'f15'	         : 126,
	'f16'	         : 127,
	'f17'	         : 128,
	'f18'	         : 129,
	'f19'	         : 130,
	'f20'	         : 131,
	'f21'	         : 132,
	'f22'	         : 133,
	'f23'	         : 134,
	'f24'	         : 135,
	'numlock'	 : 144,
	'scrolllock'	 : 145,
	'^'	         : 160,
	'!'	         : 161,
	// '؛' 	 : 162 // (arabic semicolon)
	'#'	         : 163,
	'$'	         : 164,
	'ù'	         : 165,
	'pagebackward'	 : 166,
	'pageforward'	 : 167,
	'refresh'	 : 168,
	'closingparen'	 : 169, // (AZERTY)
	'*'         	 : 170,
	'~+*'	         : 171,
	'home'	         : 172,
	'minus'	         : 173, // firefox
	'mute'           : 173,
	'unmute'	 : 173,
	'decreasevolumelevel' : 174,
	'increasevolumelevel' :	175,
	'next'	         : 176,
	'previous'	 : 177,
	'stop'	         : 178,
	'play/pause'	 : 179,
	'email'	         : 180,
	'mute'	         : 181, // firefox
	'unmute'         : 181,
	//'decreasevolumelevel'	182 // firefox
	//'increasevolumelevel'	183 // firefox
	'semicolon'      : 186,
	'ñ'   	         : 186,
	'equal'	         : 187,
	'comma'	         : 188,
	'dash'	         : 189,
	'period'	 : 190,
	'forwardslash'   : 191,
	'ç'	         : 191,
	'grave accent'   : 192,
	//'ñ' 192,
	'æ'              : 192,
	'ö'	         : 192,
	'?'              : 193,
	'/'              : 193,
	'°'	         : 193,
	'numpadperiod'	 : 194, // chrome
	'openbracket'	 : 219,
	'backslash'	 : 220,
	'closebracket'   : 221,
	'å'   	         : 221,
	'singlequote'    : 222,
	'ø'              : 222,
	'ä'	         : 222,
	'`'	         : 223,
	// 'left or right ⌘ key (firefox)'	224
	'altgr'	         : 225,
	// '< /git >, left back slash'	226
	'GNOME Compose Key' : 230,
	'ç'	         : 231,
	'XF86Forward'	 : 233,
	'XF86Back'	 : 234,
	'non-conversion' : 235,
	'alphanumeric'	 : 240,
	'hiragana'       : 242,
	'katakana'	 : 242,
	'half-width'     : 243,
	'full-width'	 : 243,
	'kanji'	         : 244,
	'unlocktrackpad' : 251, // Chrome/Edge
	'toggletouchpad' : 255
    };

        
    // +----------------------------------------------------------------------
    // | Install the required listeners into the initially passed element.
    // |
    // | By default the listeners are installed into the root element specified on
    // | construction (or 'window').
    // +-------------------------------------------------
    KeyHandler.prototype.installListeners = function() {
	var _self = this;
	this.element.addEventListener('keydown',this.keyDownListener=function(e) { fireDownEvent(e,_self); });
	this.element.addEventListener('keypress',this.keyPressListener=function(e) { firePressEvent(e,_self); } );
	this.element.addEventListener('keyup',this.keyUpListener=function(e) { fireUpEvent(e,_self); } );
    };


    // +----------------------------------------------------------------------
    // | Remove all installed event listeners from the underlying element.
    // +-------------------------------------------------
    KeyHandler.prototype.releaseListeners = function() {
	this.element.removeEventListener('keydown',this.keyDownListener);
	this.element.removeEventListener('keypress',this.keyPressListener);
	this.element.removeEventListener('keyup',this.keyUpListener);
    };


    // +----------------------------------------------------------------------
    // | Listen for key down. This function allows chaining.
    // |
    // | Example: new KeyHandler().down('enter',function() {console.log('Enter hit.')});
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // | @param listener:function(e) The callback to be triggered.
    // +-------------------------------------------------
    KeyHandler.prototype.down = function( key, listener ) {
	this.downListeners.push( { key : key, keyCode : key2code(key), listener : listener } );
	return this;
    };

    // +----------------------------------------------------------------------
    // | Listen for key press.
    // |
    // | Example: new KeyHandler().press('enter',function() {console.log('Enter pressed.')});
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // | @param listener:function(e) The callback to be triggered.
    // +-------------------------------------------------
    KeyHandler.prototype.press = function( key, listener ) {
	this.pressListeners.push( { key : key, keyCode : key2code(key), listener : listener } );
	return this;
    };

    // +----------------------------------------------------------------------
    // | Listen for key up.
    // |
    // | Example: new KeyHandler().up('enter',function() {console.log('Enter released.')});
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // | @param listener:function(e) The callback to be triggered.
    // +-------------------------------------------------
    KeyHandler.prototype.up = function( key, listener ) {
	this.upListeners.push( { key : key, keyCode : key2code(key), listener : listener } );
	return this;
    };

    // +----------------------------------------------------------------------
    // | Check if a specific key is currently held pressed.
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // +-------------------------------------------------
    KeyHandler.prototype.isDown = function( key ) {
	return this.keyStates[ key2code(key) ] ? true : false;
    }

    
    _context.KeyHandler = KeyHandler;

})(window);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * A wrapper class for basic drawing operations.
 *
 * @require Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-04-22
 * @modified 2018-08-16 Added the curve() function to draw cubic bézier curves.
 * @modified 2018-10-23 Recognizing the offset param in the circle() function.
 * @modified 2018-11-27 Added the diamondHandle() function.
 * @modified 2018-11-28 Added the grid() function and the ellipse() function.
 * @modified 2018-11-30 Renamed the text() function to label() as it is not scaling.
 * @modified 2018-12-06 Added a test function for drawing arc in SVG style.
 * @modified 2018-12-09 Added the dot(Vertex,color) function (copied from Feigenbaum-plot-script).
 * @modified 2019-01-30 Added the arrow(Vertex,Vertex,color) function for drawing arrow heads.
 * @modified 2019-01-30 Added the image(Image,Vertex,Vertex) function for drawing images.
 * @modified 2019-04-27 Fixed a severe drawing bug in the arrow(...) function. Scaling arrows did not work properly.
 * @modified 2019-04-28 Added Math.round to the dot() drawing parameters to really draw a singlt dot.
 * @modified 2019-06-07 Fixed an issue in the cubicBezier() function. Paths were always closed.
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2019-10-25 Polygons are no longer drawn with dashed lines (solid lines instead).
 * @modified 2019-11-18 Added the polyline function.
 * @modified 2019-11-22 Added a second workaround for th drawImage bug in Safari.
 * @modified 2019-12-07 Added the 'lineWidth' param to the line(...) function.
 * @modified 2019-12-07 Added the 'lineWidth' param to the cubicBezier(...) function.
 * @modified 2019-12-11 Added the 'color' param to the label(...) function.
 * @version  1.4.0
 **/

(function(_context) {
    "use strict";

    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {Context2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    _context.drawutils = function( context, fillShapes ) {
	this.ctx = context;
	this.offset = new Vertex( 0, 0 );
	this.scale = new Vertex( 1, 1 );
	this.fillShapes = fillShapes;
    };

    /**
     * Called before each draw cycle.
     **/
    _context.drawutils.prototype.beginDrawCycle = function() {
	// NOOP
    };

    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number|string} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    _context.drawutils.prototype.line = function( zA, zB, color, lineWidth ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+zA.x*this.scale.x, this.offset.y+zA.y*this.scale.y );
	this.ctx.lineTo( this.offset.x+zB.x*this.scale.x, this.offset.y+zB.y*this.scale.y );
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = lineWidth || 1;
	this.ctx.stroke();
	this.ctx.restore();
    };

    

    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    _context.drawutils.prototype.arrow = function( zA, zB, color ) {
	var headlen = 8;   // length of head in pixels
	var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	
	this.ctx.save();
	this.ctx.beginPath();
	var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	
	this.ctx.moveTo( this.offset.x+zA.x*this.scale.x, this.offset.y+zA.y*this.scale.y );
	for( var i = 0; i < vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x+vertices[i].x, this.offset.y+vertices[i].y );
	}
	this.ctx.lineTo( this.offset.x+vertices[0].x, this.offset.y+vertices[0].y );
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {Vertex} position - The position to draw the the upper left corner at.
     * @param {Vertex} size - The x/y-size to draw the image with.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    _context.drawutils.prototype.image = function( image, position, size ) {
	this.ctx.save();
	// Note that there is a Safari bug with the 3 or 5 params variant.
	// Only the 9-param varaint works.
	this.ctx.drawImage( image,
			    0, 0,
			    image.naturalWidth-1,  // There is this horrible Safari bug (fixed in newer versions)
			    image.naturalHeight-1, // To avoid errors substract 1 here.
			    this.offset.x+position.x*this.scale.x,
			    this.offset.y+position.y*this.scale.y,
			    size.x*this.scale.x,
			    size.y*this.scale.y );
	this.ctx.restore();	
    };

    
    // +---------------------------------------------------------------------------------
    // | This is the final helper function for drawing and filling stuff. It is not
    // | intended to be used from the outside.
    // |
    // | When in draw mode it draws the current shape.
    // | When in fill mode it fills the current shape.
    // |
    // | This function is usually only called internally.
    // |
    // | @param color A stroke/fill color to use.
    // +-------------------------------
    _context.drawutils.prototype._fillOrDraw = function( color ) {
	if( this.fillShapes ) {
	    this.ctx.fillStyle = color;
	    this.ctx.fill();
	} else {
	    this.ctx.strokeStyle = color;
	    this.ctx.stroke();
	}
    };


    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.cubicBezier = function( startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth ) {
	if( startPoint instanceof CubicBezierCurve ) {
	    this.cubicBezier( startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, endPoint );
	    return;
	}
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+startPoint.x*this.scale.x, this.offset.y+startPoint.y*this.scale.y );
	this.ctx.bezierCurveTo( this.offset.x+startControlPoint.x*this.scale.x, this.offset.y+startControlPoint.y*this.scale.y,
				this.offset.x+endControlPoint.x*this.scale.x, this.offset.y+endControlPoint.y*this.scale.y,
				this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	//this.ctx.closePath();
	this.ctx.lineWidth = lineWidth || 2;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    /**
     * Draw the given (cubic) Bézier path.
     *
     * The given path must be an array with n*3+1 vertices, where n is the number of
     * curves in the path:
     * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre> 
     *
     * @method cubicBezierPath
     * @param {Vertex[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.cubicBezierPath = function( path, color ) {
	if( !path || path.length == 0 )
	    return;
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	var curve, startPoint, endPoint, startControlPoint, endControlPoint;
	this.ctx.moveTo( this.offset.x+path[0].x*this.scale.x, this.offset.y+path[0].y*this.scale.y );
	for( var i = 1; i < path.length; i+=3 ) {
	    startControlPoint = path[i];
	    endControlPoint = path[i+1];
	    endPoint = path[i+2];
	    this.ctx.bezierCurveTo( this.offset.x+startControlPoint.x*this.scale.x, this.offset.y+startControlPoint.y*this.scale.y,
				    this.offset.x+endControlPoint.x*this.scale.x, this.offset.y+endControlPoint.y*this.scale.y,
				    this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	}
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {Vertex} startPoint - The start of the handle.
     * @param {Vertex} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.handle = function( startPoint, endPoint ) { 
	// Draw handles
	// (No need to save and restore here)
	this.point( startPoint, 'rgb(0,32,192)' );
	this.square( endPoint, 5, 'rgba(0,128,192,0.5)' );
    };


    /**
     * Draw the given handle cubic Bézier curve handle lines.
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method cubicBezierCurveHandleLines
     * @param {BezierCurve} curve - The curve.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.cubicBezierCurveHandleLines = function( curve ) {
	// Draw handle lines
	this.cubicBezierHandleLines( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint );
    };

    
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {Vertex} startPoint - The start point to draw the handle at.
     * @param {Vertex} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.handleLine = function( startPoint, endPoint ) {
	// Draw handle lines
	this.line( startPoint, endPoint, 'rgb(192,192,192)' );	
    };


    
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {Vertex} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.dot = function( p, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( Math.round(this.offset.x + this.scale.x*p.x), Math.round(this.offset.y + this.scale.y*p.y) );
	this.ctx.lineTo( Math.round(this.offset.x + this.scale.x*p.x+1), Math.round(this.offset.y + this.scale.y*p.y+1) );
	this.ctx.closePath();
	this._fillOrDraw( color );
	this.ctx.restore();
    };

    
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.point = function( p, color ) {
	var radius = 3;
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x+p.x*this.scale.x, this.offset.y+p.y*this.scale.y, radius, 0, 2 * Math.PI, false );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.circle = function( center, radius, color ) {
	this.ctx.beginPath();
	this.ctx.ellipse( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radius*this.scale.x, radius*this.scale.y, 0.0, 0.0, Math.PI*2 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.ellipse = function( center, radiusX, radiusY, color ) {
	this.ctx.beginPath();
	this.ctx.ellipse( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radiusX*this.scale.x, radiusY*this.scale.y, 0.0, 0.0, Math.PI*2 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };   


    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.square = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+(center.x-size/2.0)*this.scale.x, this.offset.y+(center.y-size/2.0)*this.scale.y, size*this.scale.x, size*this.scale.y );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {Vertex} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.grid = function( center, width, height, sizeX, sizeY, color ) {
	this.ctx.beginPath();
	// center to right
	var x = 0;
	while( x < width/2 ) {
	    this.ctx.moveTo( this.offset.x + (center.x+x)*this.scale.x, this.offset.y - (center.y - height*0.5)*this.scale.y  );
	    this.ctx.lineTo( this.offset.x + (center.x+x)*this.scale.x, this.offset.y - (center.y + height*0.5)*this.scale.y  );
	    x+=sizeX;
	}
	x = sizeX;
	while( x < width/2 ) {
	    this.ctx.moveTo( this.offset.x + (center.x-x)*this.scale.x, this.offset.y - (center.y - height*0.5)*this.scale.y  );
	    this.ctx.lineTo( this.offset.x + (center.x-x)*this.scale.x, this.offset.y - (center.y + height*0.5)*this.scale.y  );
	    x+=sizeX;
	}
	var y = 0;
	while( y < height/2 ) {
	    this.ctx.moveTo( this.offset.x - (center.x - width*0.5)*this.scale.x, this.offset.y + (center.y+y)*this.scale.y );
	    this.ctx.lineTo( this.offset.x - (center.x + width*0.5)*this.scale.x, this.offset.y + (center.y+y)*this.scale.y );
	    y+=sizeY;
	}
	var y = sizeY;
	while( y < height/2 ) {
	    this.ctx.moveTo( this.offset.x - (center.x - width*0.5)*this.scale.x, this.offset.y + (center.y-y)*this.scale.y );
	    this.ctx.lineTo( this.offset.x - (center.x + width*0.5)*this.scale.x, this.offset.y + (center.y-y)*this.scale.y );
	    y+=sizeY;
	}
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {Vertex} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.raster = function( center, width, height, sizeX, sizeY, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	var cx = 0, cy = 0;
	for( var x = -Math.ceil((width*0.5)/sizeX)*sizeX; x < width/2; x+=sizeX ) {
	    cx++;
	    for( var y = -Math.ceil((height*0.5)/sizeY)*sizeY; y < height/2; y+=sizeY ) {
		if( cx == 1 ) cy++;
		// Draw a crosshair
		this.ctx.moveTo( this.offset.x+(center.x+x)*this.scale.x-4, this.offset.y+(center.y+y)*this.scale.y );
		this.ctx.lineTo( this.offset.x+(center.x+x)*this.scale.x+4, this.offset.y+(center.y+y)*this.scale.y );
		this.ctx.moveTo( this.offset.x+(center.x+x)*this.scale.x, this.offset.y+(center.y+y)*this.scale.y-4 );
		this.ctx.lineTo( this.offset.x+(center.x+x)*this.scale.x, this.offset.y+(center.y+y)*this.scale.y+4 );	
	    }
	}
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = 1.0; 
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
    };
    

    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.diamondHandle = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x + center.x*this.scale.x - size/2.0, this.offset.y + center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x,            this.offset.y + center.y*this.scale.y - size/2.0 );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x + size/2.0, this.offset.y + center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x,            this.offset.y + center.y*this.scale.y + size/2.0 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.squareHandle = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+center.x*this.scale.x-size/2.0, this.offset.y+center.y*this.scale.y-size/2.0, size, size );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.circleHandle = function( center, size, color ) {
	var radius = 3;
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y, radius, 0, 2 * Math.PI, false );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {Vertex} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.crosshair = function( center, radius, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+center.x*this.scale.x-radius, this.offset.y+center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x+center.x*this.scale.x+radius, this.offset.y+center.y*this.scale.y );
	this.ctx.moveTo( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y-radius );
	this.ctx.lineTo( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y+radius );
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = 0.5;
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
    };


    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon}  polygon - The polygon to draw.
     * @param {string}   color - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.polygon = function( polygon, color ) {
	/* if( polygon.vertices.length <= 1 )
	    return;
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.lineWidth = 1.0;
	this.ctx.moveTo( this.offset.x + polygon.vertices[0].x*this.scale.x, this.offset.y + polygon.vertices[0].y*this.scale.y );
	for( var i = 0; i < polygon.vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x + polygon.vertices[i].x*this.scale.x, this.offset.y + polygon.vertices[i].y*this.scale.y );
	}
	if( !polygon.isOpen && polygon.vertices.length > 2 )
	    this.ctx.closePath();
	this._fillOrDraw( color );
	this.ctx.setLineDash([]);
	this.ctx.restore();
	*/
	this.polyline( polygon.vertices, polygon.isOpen, color );
    };


    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.polyline = function( vertices, isOpen, color ) {
	if( vertices.length <= 1 )
	    return;
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.lineWidth = 1.0;
	this.ctx.moveTo( this.offset.x + vertices[0].x*this.scale.x, this.offset.y + vertices[0].y*this.scale.y );
	for( var i = 0; i < vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x + vertices[i].x*this.scale.x, this.offset.y + vertices[i].y*this.scale.y );
	}
	if( !isOpen && vertices.length > 2 )
	    this.ctx.closePath();
	this._fillOrDraw( color );
	this.ctx.setLineDash([]);
	this.ctx.restore();
    };

    
    // THIS FUNCTION IS CURRENTLY NOT IN USE, AS SVG TO CANVAS ARC CONVERSION IS UN-NECESSARY COMPLICATED.
    // BUT IT IS WORKING.
    // Found in an old version of
    //    https://github.com/canvg/canvg
    /*
    _context.drawutils.prototype.arcto = function(lastX,lastY,rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y, color)
    {
	lastX = this.offset.x + this.scale.x*lastX;
	lastY = this.offset.y + this.scale.y*lastY;
	x = this.offset.x + this.scale.x*x;
	y = this.offset.y + this.scale.y*y;
	rx *= this.scale.x;
	ry *= this.scale.y;
	//--------------------
	// rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y
	// are the 6 data items in the SVG path declaration following the A
	//
	// lastX and lastY are the previous point on the path before the arc
	//--------------------
	// useful functions
	var m   = function (   v) {return Math.sqrt (Math.pow (v[0],2) + Math.pow (v[1],2))};
	var r   = function (u, v) {return ( u[0]*v[0] + u[1]*v[1]) / (m(u) * m(v))};
	var ang = function (u, v) {return ((u[0]*v[1] < u[1]*v[0])? -1 : 1) * Math.acos (r (u,v))};
	//--------------------

	var currpX =  Math.cos (xAxisRotation) * (lastX - x) / 2.0 + Math.sin (xAxisRotation) * (lastY - y) / 2.0 ;
	var currpY = -Math.sin (xAxisRotation) * (lastX - x) / 2.0 + Math.cos (xAxisRotation) * (lastY - y) / 2.0 ;

	var l = Math.pow (currpX,2) / Math.pow (rx,2) + Math.pow (currpY,2) / Math.pow (ry,2);
	if (l > 1) {rx *= Math.sqrt (l); ry *= Math.sqrt (l)};
	var s = ((largeArcFlag == sweepFlag)? -1 : 1) * Math.sqrt 
	(( (Math.pow (rx,2) * Math.pow (ry    ,2)) - (Math.pow (rx,2) * Math.pow (currpY,2)) - (Math.pow (ry,2) * Math.pow (currpX,2))) 
	 / (Math.pow (rx,2) * Math.pow (currpY,2) +   Math.pow (ry,2) * Math.pow (currpX,2)));
	if (isNaN (s)) s = 0 ;

	var cppX = s *  rx * currpY / ry ;
	var cppY = s * -ry * currpX / rx ;
	var centpX = (lastX + x) / 2.0 + Math.cos (xAxisRotation) * cppX - Math.sin (xAxisRotation) * cppY ;
	var centpY = (lastY + y) / 2.0 + Math.sin (xAxisRotation) * cppX + Math.cos (xAxisRotation) * cppY ;

	var ang1 = ang ([1,0], [(currpX-cppX)/rx,(currpY-cppY)/ry]);
	var a = [(  currpX-cppX)/rx,(currpY-cppY)/ry];
	var b = [(-currpX-cppX)/rx,(-currpY-cppY)/ry];
	var angd = ang (a,b);
	if (r (a,b) <= -1) angd = Math.PI;
	if (r (a,b) >=  1) angd = 0;

	var rad = (rx > ry)? rx : ry;
	var sx  = (rx > ry)? 1 : rx / ry;
	var sy  = (rx > ry)? ry / rx : 1;

	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( lastX, lastY );
	this.ctx.translate (centpX,centpY);
	this.ctx.rotate (xAxisRotation);
	this.ctx.scale (sx, sy);
	this.ctx.arc (0, 0, rad, ang1, ang1 + angd, 1 - sweepFlag);
	this.ctx.scale (1/sx, 1/sy);
	this.ctx.rotate (-xAxisRotation);
	this.ctx.translate (-centpX, -centpY);
	this._fillOrDraw( color );
	this.ctx.restore();
    }; 
    */

    
    // THIS FUNCTION IS CURRENTLY NOT IN USE
    /*
    _context.drawutils.prototype.text = function( text, x, y, options ) {
	options = options || {};
	//this.ctx.save();
	x = this.offset.x+x*this.scale.x;
	y = this.offset.y+y*this.scale.y;
	var color = options.color || 'black';
	if( this.fillShapes ) {
	    this.ctx.fillStyle = color;
	    this.ctx.fillText( text, x, y );
	} else {
	    this.ctx.strokeStyle = color;
	    this.ctx.strokeText( text, x, y );
	}
	//this.ctx.restore();
    };
    */
    


    /**
     * Draw a non-scaling text label at the given position.
     *
     * Note that these are absolute label positions, they are not affected by offset or scale.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (aoptional) rotation in radians.
     * @param {string='black'} color - The color to render the text with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    _context.drawutils.prototype.label = function( text, x, y, rotation, color ) {
	this.ctx.save();
	this.ctx.translate(x, y);
	if( typeof rotation != 'undefined' )
	    this.ctx.rotate(rotation);
	this.ctx.fillStyle = color || 'black';
	if( this.fillShapes ) {
	    this.ctx.fillText( text, 0,0); 
	} else {
	    this.ctx.strokeText( text, 0,0);
	}
	this.ctx.restore();
    };


    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    _context.drawutils.prototype.clear = function( color ) {
	this.ctx.fillStyle = color; 
	this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    };
    
    
})(window ? window : module.export );

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * @classdesc The main class of the PlotBoilerplate.
 *
 * @requires Vertex, Line, Vector, Polygon, PBImage, MouseHandler, KeyHandler, VertexAttr, CubicBezierCurve, BezierPath, Triangle, drawutils, drawutilsgl
 *
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @modified 2018-11-19 Added multi-select and multi-drag.
 * @modified 2018-12-04 Added basic SVG export.
 * @modified 2018-12-09 Extended the constructor (canvas).
 * @modified 2018-12-18 Added the config.redrawOnResize param.
 * @modified 2018-12-18 Added the config.defaultCanvas{Width,Height} params.
 * @modified 2018-12-19 Added CSS scaling.
 * @modified 2018-12-28 Removed the unused 'drawLabel' param. Added the 'enableMouse' and 'enableKeys' params.
 * @modified 2018-12-29 Added the 'drawOrigin' param.
 * @modified 2018-12-29 Renamed the 'autoCenterOffset' param to 'autoAdjustOffset'. Added the params 'offsetAdjustXPercent' and 'offsetAdjustYPercent'.
 * @modified 2019-01-14 Added params 'drawBezierHandleLines' and 'drawBezierHandlePoints'. Added the 'redraw' praam to the add() function.
 * @modified 2019-01-16 Added params 'drawHandleLines' and 'drawHandlePoints'. Added the new params to the dat.gui interface.
 * @modified 2019-01-30 Added the 'Vector' type (extending the Line class).
 * @modified 2019-01-30 Added the 'PBImage' type (a wrapper for images).
 * @modified 2019-02-02 Added the 'canvasWidthFactor' and 'canvasHeightFactor' params.
 * @modified 2019-02-03 Removed the drawBackgroundImage() function, with had no purpose at all. Just add an image to the drawables-list.
 * @modified 2019-02-06 Vertices (instace of Vertex) can now be added. Added the 'draggable' attribute to the vertex attributes.
 * @modified 2019-02-10 Fixed a draggable-bug in PBImage handling (scaling was not possible).
 * @modified 2019-02-10 Added the 'enableTouch' option (default is true).
 * @modified 2019-02-14 Added the console for debugging (setConsole(object)).
 * @modified 2019-02-19 Added two new constants: DEFAULT_CLICK_TOLERANCE and DEFAULT_TOUCH_TOLERANCE.
 * @modified 2019-02-19 Added the second param to the locatePointNear(Vertex,Number) function.
 * @modified 2019-02-20 Removed the 'loadFile' entry from the GUI as it was experimental and never in use.
 * @modified 2019-02-23 Removed the 'rebuild' function as it had no purpose.
 * @modified 2019-02-23 Added scaling of the click-/touch-tolerance with the CSS scale.
 * @modified 2019-03-23 Added JSDoc tags. Changed the default value of config.drawOrigin to false.
 * @modified 2019-04-03 Fixed the touch-drag position detection for canvas elements that are not located at document position (0,0). 
 * @modified 2019-04-03 Tweaked the fit-to-parent function to work with paddings and borders.
 * @modified 2019-04-28 Added the preClear callback param (called before the canvas was cleared on redraw and before any elements are drawn).
 * @modified 2019-09-18 Added basics for WebGL support (strictly experimental).
 * @modified 2019-10-03 Added the .beginDrawCycle call in the redraw function.
 * @modified 2019-11-06 Added fetch.num, fetch.val, fetch.bool, fetch.func functions.
 * @modified 2019-11-13 Fixed an issue with the mouse-sensitive area around vertices (were affected by zoom).
 * @modified 2019-11-13 Added the 'enableMouseWheel' param.
 * @modified 2019-11-18 Added the Triangle class as a regular drawable element.
 * @modified 2019-11-18 The add function now works with arrays, too.
 * @modified 2019-11-18 Added the _handleColor helper function to determine the render color of non-draggable vertices.
 * @modified 2019-11-19 Fixed a bug in the resizeCanvas function; retina resolution was not possible.
 * @modified 2019-12-04 Added relative positioned zooming.
 * @modified 2019-12-04 Added offsetX and offsetY params.
 * @modified 2019-12-04 Added an 'Set to fullsize retina' button to the GUI config.
 * @modified 2019-12-07 Added the drawConfig for lines, polygons, ellipse, triangles, bezier curves and image control lines.
 * @modified 2019-12-08 Fixed a css scale bug in the viewport() function.
 * @modified 2019-12-08 Added the drawconfig UI panel (line colors and line widths).
 * @version  1.6.4
 *
 * @file PlotBoilerplate
 * @public
 **/


(function(_context) {
    "use strict";

    /** @constant {number} */
    const DEFAULT_CANVAS_WIDTH    = 1024;
    /** @constant {number} */
    const DEFAULT_CANVAS_HEIGHT   =  768;
    /** @constant {number} */
    const DEFAULT_CLICK_TOLERANCE =    8;
    /** @constant {number} */
    const DEFAULT_TOUCH_TOLERANCE =   32;


 
    /** 
     * A helper function to scale elements (usually the canvas) using CSS.
     *
     * transform-origin is at (0,0).
     *
     * @param {HTMLElement} element - The DOM element to scale.
     * @param {number} scaleX The - X scale factor.
     * @param {number} scaleY The - Y scale factor.
     * @return {void}
     **/ 
    var setCSSscale = function( element, scaleX, scaleY ) {
	element.style['transform-origin'] = '0 0';
	if( scaleX==1.0 && scaleY==1.0 ) element.style.transform = null;
	else                             element.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
    };


    /**
     * A wrapper class for draggable items (mostly vertices).
     * @private
     **/
    (function(_context) {
	var Draggable = function( item, type ) {
	    this.item = item;
	    this.type = type;
	    this.vindex = null;
	    this.pindex = null;
	    this.cindex = null;
	};
	Draggable.VERTEX = 'vertex';
	Draggable.prototype.isVertex = function() { return this.type == Draggable.VERTEX; };
	Draggable.prototype.setVIndex = function(vindex) { this.vindex = vindex; return this; };

	_context.Draggable = Draggable;
    })(_context);


    /**
     * Use a special custom attribute set for vertices.
     **/
    VertexAttr.model = { bezierAutoAdjust : false, renderTime : 0, selectable : true, isSelected : false, draggable : true };
    

    /** 
     * The constructor.
     *
     * @constructor
     * @name PlotBoilerplate
     * @param {object} config={} - The configuration.
     * @param {HTMLElement} config.canvas - Your canvas element in the DOM (required).
     * @param {boolean=} [config.fullSize=true] - If set to true the canvas will gain full window size.
     * @param {boolean=} [config.fitToParent=true] - If set to true the canvas will gain the size of its parent container (overrides fullSize).
     * @param {number=}  [config.scaleX=1.0] - The initial x-zoom. Default is 1.0.
     * @param {number=}  [config.scaleY=1.0] - The initial y-zoom. Default is 1.0.
     * @param {number=}  [config.offsetX=1.0] - The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {number=}  [config.offsetY=1.0] - The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {boolean=} [config.rasterGrid=true] - If set to true the background grid will be drawn rastered.
     * @param {number=}  [config.rasterAdjustFactor=1.0] - The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step).
     * @param {boolean=} [config.drawOrigin=false] - Draw a crosshair at (0,0).
     * @param {boolean=} [config.autoAdjustOffset=true] -  When set to true then the origin of the XY plane will
     *                         be re-adjusted automatically (see the params
     *                         offsetAdjust{X,Y}Percent for more).
     * @param {number=}  [config.offsetAdjustXPercent=50] - The x-fallback position for the origin after
     *                         resizing the canvas.
     * @param {number=}  [config.offsetAdjustYPercent=50] - The y-fallback position for the origin after
     *                         resizing the canvas.
     * @param {number=}  [config.defaultCanvasWidth=1024] - The canvas size fallback (width) if no automatic resizing
     *                         is switched on. 
     * @param {number=}  [config.defaultCanvasHeight=768] - The canvas size fallback (height) if no automatic resizing
     *                         is switched on. 
     * @param {number=}  [config.canvasWidthFactor=1.0] - Scaling factor (width) upon the canvas size.
     *                         In combination with cssScale{X,Y} this can be used to obtain
     *                         sub pixel resolutions for retina displays.
     * @param {number=}  [config.canvasHeightFactor=1.0] - Scaling factor (height) upon the canvas size.
     *                         In combination with cssScale{X,Y} this can be used to obtain
     *                         sub pixel resolutions for retina displays.
     * @param {number=}  [config.cssScaleX=1.0] - Visually resize the canvas (horizontally) using CSS transforms (scale).
     * @param {number=}  [config.cssScaleY=1.0] - Visually resize the canvas (vertically) using CSS transforms (scale).
     * @param {boolan=}  [config.cssUniformScale=true] - CSS scale x and y obtaining aspect ratio.
     * @param {string=}  [config.backgroundColor=#ffffff] - The backround color.
     * @param {boolean=} [config.redrawOnResize=true] - Switch auto-redrawing on resize on/off (some applications
     *                         might want to prevent automatic redrawing to avoid data loss from the draw buffer).
     * @param {boolean=} [config.drawBezierHandleLines=true] - Indicates if Bézier curve handles should be drawn (used for
     *                         editors, no required in pure visualizations).
     * @param {boolean=} [config.drawBezierHandlePoints=true] - Indicates if Bézier curve handle points should be drawn.
     * @param {function=} [config.preClear=null] - A callback function that will be triggered just before the
     *                         draw function clears the canvas (before anything else was drawn).
     * @param {function=} [config.preDraw=null] - A callback function that will be triggered just before the draw
     *                         function starts.
     * @param {function=} [config.postDraw=null] - A callback function that will be triggered right after the drawing
     *                         process finished.
     * @param {boolean=} [config.enableMouse=true] - Indicates if the application should handle mouse events for you.
     * @param {boolean=} [config.enableTouch=true] - Indicates if the application should handle touch events for you.
     * @param {boolean=} [config.enableTouch=true] - Indicates if the application should handle key events for you.
     * @param {boolean=} [config.enableMouseWheel=true] - Indicates if the application should handle mouse wheel events for you.
     * @param {boolean=} [config.enableGL=false] - Indicates if the application should use the experimental WebGL features (not recommended).
     * @param {boolean=} [config.enableSVGExport=true] - Indicates if the SVG export should be enabled (default is true). 
     *                                                   Note that changes from the postDraw hook might not be visible in the export.
     */
    var PlotBoilerplate = function( config ) {
	config = config || {};
	if( typeof config.canvas == 'undefined' )
	    throw "No canvas specified.";
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------

	/** 
	 * A config.
	 *
	 * @member {Object} 
	 * @memberof PlotBoilerplate
	 * @instance
	 */
	this.config = {
	    fullSize              : fetch.val(config,'fullSize',true), 
	    fitToParent           : fetch.bool(config,'fitToParent',true),
	    scaleX                : fetch.num(config,'scaleX',1.0), 
	    scaleY                : fetch.num(config,'scaleY',1.0),
	    offsetX               : fetch.num(config,'offsetX',0.0), 
	    offsetY               : fetch.num(config,'offsetY',0.0), 
	    drawGrid              : fetch.bool(config,'drawGrid',true),
	    rasterGrid            : fetch.bool(config,'rasterGrid',true),
	    rasterAdjustFactor    : fetch.num(config,'rasterAdjustdFactror',2.0),
	    drawOrigin            : fetch.bool(config,'drawOrigin',false),
	    autoAdjustOffset      : fetch.val(config,'autoAdjustOffset',true),
	    offsetAdjustXPercent  : fetch.num(config,'offsetAdjustXPercent',50),
	    offsetAdjustYPercent  : fetch.num(config,'offsetAdjustYPercent',50),
	    backgroundColor       : config.backgroundColor || '#ffffff',
	    redrawOnResize        : fetch.bool(config,'redrawOnResize',true), 
	    defaultCanvasWidth    : fetch.num(config,'defaultCanvasWidth',DEFAULT_CANVAS_WIDTH),
	    defaultCanvasHeight   : fetch.num(config,'defaultCanvasHeight',DEFAULT_CANVAS_HEIGHT),
	    canvasWidthFactor     : fetch.num(config,'canvasWidthFactor',1.0),
	    canvasHeightFactor    : fetch.num(config,'canvasHeightFactor',1.0),
	    cssScaleX             : fetch.num(config,'cssScaleX',1.0),
	    cssScaleY             : fetch.num(config,'cssScaleY',1.0),
	    cssUniformScale       : fetch.bool(config,'cssUniformScale',true),
	    rebuild               : function() { rebuild(); },
	    saveFile              : function() { _self.saveFile(); },
	    setToRetina           : function() { _self._setToRetina(); },
	    enableExport          : fetch.bool(config,'enableExport',true),

	    drawBezierHandleLines : fetch.bool(config,'drawBezierHandleLines',true),
	    drawBezierHandlePoints : fetch.bool(config,'drawBezierHandlePoints',true),
	    drawHandleLines       : fetch.bool(config,'drawHandleLines',true),
	    drawHandlePoints      : fetch.bool(config,'drawHandlePoints',true),
	    
	    // Listeners/observers
	    preClear              : fetch.func(config,'preClear',null),
	    preDraw               : fetch.func(config,'preDraw',null),
	    postDraw              : fetch.func(config,'postDraw',null),

	    // Interaction
	    enableMouse           : fetch.bool(config,'enableMouse',true),
	    enableTouch           : fetch.bool(config,'enableTouch',true),
	    enableKeys            : fetch.bool(config,'enableKeys',true),
	    enableMouseWheel      : fetch.bool(config,'enableMouseWheel',true),

	    // Experimental (and unfinished)
	    enableGL              : fetch.bool(config,'enableGL',false)
	};


	/** 
	 * Configuration for drawing things.
	 *
	 * @member {Object} 
	 * @memberof PlotBoilerplate
	 * @instance
	 */
	this.drawConfig = {
	    drawVertices : true,
	    bezier : {
		color : '#00a822',
		lineWidth : 2,
		handleLine : {
		    color : 'rgba(180,180,180,0.5)',
		    lineWidth : 1
		}
	    },
	    polygon : {
		color : '#0022a8',
		lineWidth : 1
	    },
	    triangle : {
		color : '#6600ff',
		lineWidth : 1
	    },
	    ellipse : {
		color : '#2222a8',
		lineWidth : 1
	    },
	    vertex : {
		color : '#a8a8a8',
		lineWidth : 1
	    },
	    line : {
		color : '#a844a8',
		lineWidth : 1
	    },
	    vector : {
		color : '#ff44a8',
		lineWidth : 1
	    },
	    image : {
		line : '#a8a8a8',
		lineWidth : 1
	    }
	};


	// +---------------------------------------------------------------------------------
	// | Object members.
	// +-------------------------------
	this.canvas              = typeof config.canvas == 'string' ? document.getElementById(config.canvas) : config.canvas;
	if( this.config.enableGL ) {
	    this.ctx                 = this.canvas.getContext( 'webgl' ); // webgl-experimental?
	    this.draw                = new drawutilsgl(this.ctx,false);
	    // PROBLEM: same instance of fill and draw when using WebGL. Shader program cannot be duplicated on the same context
	    this.fill                = this.draw.copyInstance(true);
	    console.warn('Initialized with experimental mode enableGL=true. Note that this is not yet fully implemented.');
	} else {
	    this.ctx                 = this.canvas.getContext( '2d' );
	    this.draw                = new drawutils(this.ctx,false);
	    this.fill                = new drawutils(this.ctx,true);
	}
	this.draw.scale.set(this.config.scaleX,this.config.scaleY);
	this.fill.scale.set(this.config.scaleX,this.config.scaleY);
	this.grid                = new Grid( new Vertex(0,0), new Vertex(50,50) );
	this.image               = null; // An image.
	this.imageBuffer         = null; // A canvas to read the pixel data from.
	this.canvasSize          = { width : DEFAULT_CANVAS_WIDTH, height : DEFAULT_CANVAS_HEIGHT };
	this.vertices            = [];
	this.selectPolygon       = null;
	this.draggedElements     = [];
	this.drawables           = [];
	this.console             = console;
	var _self = this;


	/**
	 * This function opens a save-as file dialog and – once an output file is
	 * selected – stores the current canvas contents as an SVG image.
	 *
	 * It is the default hook for saving files and can be overwritten.
	 *
	 * @method saveFile
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	var _saveFile = function() {
	    var svgCode = new SVGBuilder().build( _self.drawables, { canvasSize : _self.canvasSize, offset : _self.draw.offset, zoom : _self.draw.scale } );
	    // See documentation for FileSaver.js for usage.
	    //    https://github.com/eligrey/FileSaver.js
	    var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" } );
	    saveAs(blob, "plot-boilerplate.svg");
	};


	this._setToRetina = function() {
	    this.config.cssScaleX = this.config.cssScaleY = 0.5;
	    this.config.canvasWidthFactor = this.config.canvasHeightFactor = 2.0;
	    //this.config.fullSize = false;
	    this.config.fitToParent = false;
	    this.resizeCanvas();
	};

	/**
	 * A set of hook functions.
	 **/
	this.hooks = {
	    saveFile : _saveFile
	};

	
	// +---------------------------------------------------------------------------------
	// | After this line: object members.
	// +-------------------------------
	
	/**
	 * Set the console for this instance.
	 *
	 * @method setConsole
	 * @param {object} con - The new console object (default is window.console).
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.setConsole = function( con ) {
	    if( typeof con.log != 'function' ) throw "Console object must have a 'log' function.";
	    if( typeof con.warn != 'function' ) throw "Console object must have a 'warn' function.";
	    if( typeof con.error != 'function' ) throw "Console object must have a 'error' function.";
	    this.console = con;
	};

	
	/**
	 * Update the CSS scale for the canvas depending onf the cssScale{X,Y} settings.<br>
	 * <br>
	 * This function is usually only used inernally.
	 *
	 * @method updateCSSscale
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 * @private
	 **/
	PlotBoilerplate.prototype.updateCSSscale = function() {
	    if( this.config.cssUniformScale ) {
		setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleX );
	    } else {
		setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleY );
	    }
	};
	


	/**
	 * Add a drawable object.<br>
	 * <br>
	 * This must be either:<br>
	 * <pre>
	 *  * a Vertex
	 *  * a Line
	 *  * a Vector
	 *  * a VEllipse
	 *  * a Polygon
	 *  * a Triangle
	 *  * a BezierPath
	 *  * a BPImage
	 * </pre>
	 *
	 * @param {Drawable|Drawable[]} drawable - The drawable (of one of the allowed class instance) to add.
	 * @param {boolean} [redraw=true] - If true the function will trigger redraw after the drawable(s) was/were added.
	 * @method add
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.add = function( drawable, redraw ) {
	    if( Array.isArray(drawable) ) {
		for( var i in drawable )
		    this.add( drawable[i] );
	    } else if( drawable instanceof Vertex ) {
		this.drawables.push( drawable );
		this.vertices.push( drawable );
	    } else if( drawable instanceof Line ) {
		// Add some lines
		this.drawables.push( drawable );
		this.vertices.push( drawable.a );
		this.vertices.push( drawable.b );
	    } else if( drawable instanceof Vector ) {
		this.drawables.push( drawable );
		this.vertices.push( drawable.a );
		this.vertices.push( drawable.b );
	    } else if( drawable instanceof VEllipse ) {
		this.vertices.push( drawable.center );
		this.vertices.push( drawable.axis );
		this.drawables.push( drawable );
		drawable.center.listeners.addDragListener( function(e) {
		    drawable.axis.add( e.params.dragAmount );
		} ); 
	    } else if( drawable instanceof Polygon ) {
		this.drawables.push( drawable );
		for( var i in drawable.vertices )
		    this.vertices.push( drawable.vertices[i] );
	    } else if( drawable instanceof Triangle ) {
		this.drawables.push( drawable );
		this.vertices.push( drawable.a );
		this.vertices.push( drawable.b );
		this.vertices.push( drawable.c );
	    } else if( drawable instanceof BezierPath ) {
		this.drawables.push( drawable );
		for( var i in drawable.bezierCurves ) {
		    if( !drawable.adjustCircular && i == 0 )
			this.vertices.push( drawable.bezierCurves[i].startPoint );
		    this.vertices.push( drawable.bezierCurves[i].endPoint );
		    this.vertices.push( drawable.bezierCurves[i].startControlPoint );
		    this.vertices.push( drawable.bezierCurves[i].endControlPoint );
		    drawable.bezierCurves[i].startControlPoint.attr.selectable = false;
		    drawable.bezierCurves[i].endControlPoint.attr.selectable = false;
		}
		for( var i in drawable.bezierCurves ) {	
		    // This should be wrapped into the BezierPath implementation.
		    drawable.bezierCurves[i].startPoint.listeners.addDragListener( function(e) {
			var cindex = drawable.locateCurveByStartPoint( e.params.vertex );
			drawable.bezierCurves[cindex].startPoint.addXY( -e.params.dragAmount.x, -e.params.dragAmount.y );
			drawable.moveCurvePoint( cindex*1, 
						 drawable.START_POINT,         // obtain handle length?
						 e.params.dragAmount           // update arc lengths
					       );
		    } );
		    drawable.bezierCurves[i].startControlPoint.listeners.addDragListener( function(e) {
			var cindex = drawable.locateCurveByStartControlPoint( e.params.vertex );
			if( !drawable.bezierCurves[cindex].startPoint.attr.bezierAutoAdjust )
			    return;
			drawable.adjustPredecessorControlPoint( cindex*1, 
								true,          // obtain handle length?
								true           // update arc lengths
							      );
		    } );
		    drawable.bezierCurves[i].endControlPoint.listeners.addDragListener( function(e) {
			var cindex = drawable.locateCurveByEndControlPoint( e.params.vertex );
			if( !drawable.bezierCurves[(cindex)%drawable.bezierCurves.length].endPoint.attr.bezierAutoAdjust )
			    return;
			drawable.adjustSuccessorControlPoint( cindex*1, 
							      true,            // obtain handle length?
							      true             // update arc lengths
							    );
		    } );
		} // END for
	    } else if( drawable instanceof PBImage ) {
		this.vertices.push( drawable.upperLeft );
		this.vertices.push( drawable.lowerRight );
		this.drawables.push( drawable );
		drawable.upperLeft.listeners.addDragListener( function(e) {
		    drawable.lowerRight.add( e.params.dragAmount );
		} );
		drawable.lowerRight.attr.selectable = false
	    } else {
		throw "Cannot add drawable of unrecognized type: " + drawable.constructor.name;
	    }

	    // This is a workaround for backwards compatibility when the 'redraw' param was not yet present.
	    if( redraw || typeof redraw == 'undefined' )
		this.redraw();
	};


	/**
	 * Remove a drawable object.<br>
	 * <br>
	 * This must be either:<br>
	 * <pre>
	 *  * a Vertex
	 *  * a Line
	 *  * a Vector
	 *  * a VEllipse
	 *  * a Polygon
	 *  * a BezierPath
	 *  * a BPImage
	 * </pre>
	 *
	 * @param {Object} drawable - The drawable (of one of the allowed class instance) to remove.
	 * @param {boolean} [redraw=false]
	 * @method remove
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.remove = function( drawable, redraw ) {
	    if( drawable instanceof Vertex )
		this.removeVertex( drawable, false );
	    for( var i in this.drawables ) {
		if( this.drawables[i] === drawable ) {
		    this.drawables.splice(i,1);
		    if( redraw )
			this.redraw();
		    return;
		}
	    }
	};


	/**
	 * Remove a vertex from the vertex list.<br>
	 *
	 * @param {Vertex} vert - The vertex to remove.
	 * @param {boolean} [redraw=false]
	 * @method removeVertex
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.removeVertex = function( vert, redraw ) {
	    for( var i in this.drawables ) {
		if( this.vertices[i] === vert ) {
		    this.vertices.splice(i,1);
		    if( redraw )
			this.redraw();
		    return;
		}
	    }
	};
	

	/**
	 * Draw the grid with the current config settings.<br>
	 *
	 * This function is usually only used internally.
	 *
	 * @method drawGrid
	 * @private
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.drawGrid = function() {
	    var gScale = { x : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.x),
			   y : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.y) };
	    var gSize = { w : this.grid.size.x*gScale.x, h : this.grid.size.y*gScale.y };
	    var cs = { w : this.canvasSize.width/2, h : this.canvasSize.height/2 };
	    var offset = this.draw.offset.clone().inv();
	    offset.x = (Math.round(offset.x+cs.w)/Math.round(gSize.w))*(gSize.w)/this.draw.scale.x + (((this.draw.offset.x-cs.w)/this.draw.scale.x)%gSize.w);
	    offset.y = (Math.round(offset.y+cs.h)/Math.round(gSize.h))*(gSize.h)/this.draw.scale.y + (((this.draw.offset.y-cs.h)/this.draw.scale.x)%gSize.h);
	    if( this.config.drawGrid ) {
		if( this.config.rasterGrid )
		    this.draw.raster( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.w, gSize.h, 'rgba(0,128,255,0.125)' );
		else
		    this.draw.grid( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.w, gSize.h, 'rgba(0,128,255,0.095)' );
	    }
	};

	
	/**
	 * Draw the origin with the current config settings.<br>
	 *
	 * This function is usually only used internally.
	 *
	 * @method drawOrigin
	 * @private
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.drawOrigin = function() {
	    // Add a crosshair to mark the origin
	    this.draw.crosshair( { x : 0, y : 0 }, 10, '#000000' );
	};


	/**
	 * This is just a tiny helper function to determine the render color of vertices.
	 **/
	function _handleColor( h, color ) {
	    return h.attr.draggable ? color : 'rgba(128,128,128,0.5)';
	}


	/**
	 * Draw all drawables.
	 *
	 * This function is usually only used internally.
	 *
	 * @method drawDrawables
	 * @private
	 * @param {number} renderTime - The current render time. It will be used to distinct 
	 *                              already draw vertices from non-draw-yet vertices.
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.drawDrawables = function( renderTime ) {
	    
	    // Draw drawables
	    for( var i in this.drawables ) {
		var d = this.drawables[i];
		if( d instanceof BezierPath ) {
		    for( var c in d.bezierCurves ) {
			this.draw.cubicBezier( d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.color, this.drawConfig.bezier.lineWidth ); // '#00a822' );

			if( this.config.drawBezierHandlePoints && this.config.drawHandlePoints ) {
			    if( !d.bezierCurves[c].startPoint.attr.bezierAutoAdjust ) {
				this.draw.diamondHandle( d.bezierCurves[c].startPoint, 7, _handleColor(d.bezierCurves[c].startPoint,'orange') );
				d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			    }
			    if( !d.bezierCurves[c].endPoint.attr.bezierAutoAdjust ) {
				this.draw.diamondHandle( d.bezierCurves[c].endPoint, 7,  _handleColor(d.bezierCurves[c].endPoint,'orange') );
				d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			    }
			    this.draw.circleHandle( d.bezierCurves[c].startControlPoint, 7, _handleColor(d.bezierCurves[c].startControlPoint,'#008888') );
			    this.draw.circleHandle( d.bezierCurves[c].endControlPoint, 7, _handleColor(d.bezierCurves[c].endControlPoint,'#008888') );
			    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
			} else {
			    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
			}
			
			if( this.config.drawBezierHandleLines && this.config.drawHandleLines ) {
			    //this.draw.handleLine( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint );
			    //this.draw.handleLine( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint );
			    this.draw.line( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
			    this.draw.line( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
			}
			
		    }
		} else if( d instanceof Polygon ) {
		    this.draw.polygon( d, this.drawConfig.polygon.color ); //'#0022a8' );
		    if( !this.config.drawHandlePoints ) {
			for( var i in d.vertices )
			    d.vertices[i].attr.renderTime = renderTime;
		    }
		} else if( d instanceof Triangle ) {
		    this.draw.polyline( [d.a,d.b,d.c], false, this.drawConfig.triangle.color ); // '#6600ff' );
		    if( !this.config.drawHandlePoints ) 
			d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
		} else if( d instanceof VEllipse ) {
		    if( this.config.drawHandleLines ) {
			this.draw.line( d.center.clone().add(0,d.axis.y-d.center.y), d.axis, '#c8c8c8' );
			this.draw.line( d.center.clone().add(d.axis.x-d.center.x,0), d.axis, '#c8c8c8' );
		    }
		    this.draw.ellipse( d.center, Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y), this.drawConfig.ellipse.color ); //'#2222a8' );
		    if( !this.config.drawHandlePoints ) {
			d.center.attr.renderTime = renderTime;
			d.axis.attr.renderTime = renderTime;
		    }
		} else if( d instanceof Vertex ) {
		    if( this.drawConfig.drawVertices &&
			(!d.attr.selectable || !d.attr.draggable) ) {
			// Draw as special point (grey)
			this.draw.circleHandle( d, 7, this.drawConfig.vertex.color ); // '#a8a8a8' );
			d.attr.renderTime = renderTime;
		    }
		} else if( d instanceof Line ) {
		    this.draw.line( d.a, d.b, this.drawConfig.line.color ); // '#a844a8' );
		    if( !this.config.drawHandlePoints || !d.a.attr.selectable ) 
			d.a.attr.renderTime = renderTime;
		    if( !this.config.drawHandlePoints || !d.b.attr.selectable ) 
			d.b.attr.renderTime = renderTime;
		} else if( d instanceof Vector ) {
		    // this.draw.line( d.a, d.b, '#ff44a8' );
		    this.draw.arrow( d.a, d.b, this.drawConfig.vector.color ); // '#ff44a8' );
		    if( this.config.drawHandlePoints && d.b.attr.selectable ) {
			this.draw.circleHandle( d.b, 7, '#a8a8a8' );
		    } else {
			d.b.attr.renderTime = renderTime;	
		    }
		    // d.a.attr.renderTime = renderTime;
		    if( !this.config.drawHandlePoints || !d.a.attr.selectable ) 
			d.a.attr.renderTime = renderTime;
		    if( !this.config.drawHandlePoints || !d.b.attr.selectable ) 
			d.b.attr.renderTime = renderTime;
		    
		} else if( d instanceof PBImage ) {
		    if( this.config.drawHandleLines )
			this.draw.line( d.upperLeft, d.lowerRight, this.drawConfig.image.color ); // '#a8a8a8' );
		    this.fill.image( d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft) );
		    if( this.config.drawHandlePoints ) {
			this.draw.circleHandle( d.lowerRight, 7, this.drawConfig.image.color ); // '#a8a8a8' );
			d.lowerRight.attr.renderTime = renderTime;
		    }
		} else {
		    this.console.error( 'Cannot draw object. Unknown class ' + d.constructor.name + '.' );
		}
	    }
	};



	/**
	 * Draw the select-polygon (if there is one).
	 *
	 * This function is usually only used internally.
	 *
	 * @method drawSelectPolygon
	 * @private
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.drawSelectPolygon = function() {
	    // Draw select polygon?
	    if( this.selectPolygon != null && this.selectPolygon.vertices.length > 0 ) {
		this.draw.polygon( this.selectPolygon, '#888888' );
		this.draw.crosshair( this.selectPolygon.vertices[0], 3, '#008888' );
	    }
	};
	    

	
	/**
	 * Draw all vertices that were not yet drawn with the given render time.<br>
	 * <br>
	 * This function is usually only used internally.
	 *
	 * @method drawVertices
	 * @private
	 * @param {number} renderTime - The current render time. It is used to distinct 
	 *                              already draw vertices from non-draw-yet vertices.
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.drawVertices = function( renderTime ) {
	    // Draw all vertices as small squares if they were not already drawn by other objects
	    for( var i in this.vertices ) {
		if( this.drawConfig.drawVertices && this.vertices[i].attr.renderTime != renderTime ) {
		    this.draw.squareHandle( this.vertices[i], 5, this.vertices[i].attr.isSelected ? 'rgba(192,128,0)' : _handleColor(this.vertices[i],'rgb(0,128,192)') );
		}
	    }
	};
	

	
	/**
	 * Trigger redrawing of all objects.<br>
	 * <br>
	 * Usually this function is automatically called when objects change.
	 *
	 * @method redraw
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.redraw = function() {
	    var renderTime = new Date().getTime();

	    if( this.config.preClear ) this.config.preClear();
	    this.clear();
	    if( this.config.preDraw ) this.config.preDraw();

	    // Tell the drawing library that a new drawing cycle begins (required for the GL lib).
	    this.draw.beginDrawCycle();
	    this.fill.beginDrawCycle();
	    
	    this.drawGrid();
	    if( this.config.drawOrigin )
		this.drawOrigin(); 
	    this.drawDrawables(renderTime);
	    this.drawVertices(renderTime);
	    this.drawSelectPolygon();

	    if( this.config.postDraw ) this.config.postDraw();
	    
	}; // END redraw



	/**
	 * This function clears the canvas with the configured background color.<br>
	 * <br>
	 * This function is usually only used internally.
	 *
	 * @method clear
	 * @private
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.clear = function() {
	    // Note that the image might have an alpha channel. Clear the scene first.
	    this.draw.clear( this.config.backgroundColor );
	};


	/**
	 * Clear the selection.<br>
	 * <br>
	 * This function is usually only used internally.
	 *
	 * @method clearSelection
	 * @private
	 * @param {boolean=} [redraw=false] - Indicates if the redraw function should be triggered.
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {PlotBoilerplate} this
	 **/
	PlotBoilerplate.prototype.clearSelection = function( redraw ) {
	    for( var i in this.vertices ) 
		this.vertices[i].attr.isSelected = false;
	    if( redraw )
		this.redraw();
	    return this;
	};


	/**
	 * Get the current view port.
	 *
	 * @method viewPort
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {Bounds} The current viewport.
	 **/
	PlotBoilerplate.prototype.viewport = function() {
	    return { min : this.transformMousePosition(0,0),
		     max : this.transformMousePosition(this.canvasSize.width*this.config.cssScaleX,this.canvasSize.height*this.config.cssScaleY)
		   };
	};
	/**
	 * @typedef {Object} Bounds
	 * @property {Vertex} min The upper left position.
	 * @property {Vertex} max The lower right position;.
	 */


	
	/**
	 * Trigger the saveFile.hook.
	 *
	 * @method saveFile
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.saveFile = function() {
	    this.hooks.saveFile();
	};



	/**
	 * Get the available inner space of the given container.
	 *
	 * Size minus padding minus border.
	 **/	
	var getAvailableContainerSpace = function() {
	    var container = _self.canvas.parentNode;
	    var canvas = _self.canvas;
	    canvas.style.display = 'none';
	    var
	    padding = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding') ) || 0,
	    border = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-width') ) || 0,
	    pl = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-left') ) || padding,
	    pr = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-right') ) || padding,
	    pt = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-top') ) || padding,
	    pb = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-bottom') ) || padding,
	    bl = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-left-width') ) || border,
	    br = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-right-width') ) || border,
	    bt = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-top-width') ) || border,
	    bb = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-bottom-width') ) || border;
	    var w = container.clientWidth; 
	    var h = container.clientHeight;
	    // console.log( 'w', w, 'h', h, 'border', border, 'padding', padding, pl, pr, pt, pb, bl, br, bt, bb );
	    canvas.style.display = 'block';
	    return { width : (w-pl-pr-bl-br), height : (h-pt-pb-bt-bb) };
	}; 


	/**
	 * This function resizes the canvas to the required settings (toggles fullscreen).<br>
	 * <br>
	 * This function is usually only used internally but feel free to call it if resizing required.
	 *
	 * @method resizeCanvas
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.resizeCanvas = function() {
	    var _setSize = function(w,h) {
		w *= _self.config.canvasWidthFactor;
		h *= _self.config.canvasHeightFactor;
		_self.canvas.width      = w; 
		_self.canvas.height     = h; 
		_self.canvasSize.width  = w;
		_self.canvasSize.height = h;
		if( _self.config.autoAdjustOffset ) {
		    _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX = w*(_self.config.offsetAdjustXPercent/100); 
		    _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY = h*(_self.config.offsetAdjustYPercent/100);
		}
	    };
	    if( _self.config.fullSize && !_self.config.fitToParent ) {
		// Set editor size
		var width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		_self.canvas.style.position = 'absolute';
		_self.canvas.style.width = width+'px';
		_self.canvas.style.height = height+'px';
		_self.canvas.style.top = 0;
		_self.canvas.style.left = 0;
		_setSize( width, height );
	    } else if( _self.config.fitToParent ) {
		// Set editor size
		_self.canvas.style.position = 'absolute';
		var space = getAvailableContainerSpace( _self.canvas.parentNode );
		_self.canvas.style.width = (_self.config.canvasWidthFactor*space.width)+'px';
		_self.canvas.style.height = (_self.config.canvasHeightFactor*space.height)+'px';
		_self.canvas.style.top = null;
		_self.canvas.style.left = null;
		_setSize( space.width, space.height );		
	    } else {
		_self.canvas.style.width = null; // space.width+'px';
		_self.canvas.style.height = null; //space.height+'px';
                _setSize( _self.config.defaultCanvasWidth, _self.config.defaultCanvasHeight );
	    }
	    
	    if( _self.config.redrawOnResize )
		_self.redraw();
	};
	_context.addEventListener( 'resize', this.resizeCanvas );
	this.resizeCanvas();



	/**
	 *  Add all vertices inside the polygon to the current selection.<br>
	 *
	 * @method selectVerticesInPolygon
	 * @param {Polygon} polygon - The polygonal selection area.
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.selectVerticesInPolygon = function( polygon ) {
	    for( var i in this.vertices ) {
		if( polygon.containsVert(this.vertices[i]) ) 
		    this.vertices[i].attr.isSelected = true;
	    }
	};
	
	

	/**
	 * (Helper) Locates the point (index) at the passed position. Using an internal tolerance of 7 pixels.
	 *
	 * The result is an object { type : 'bpath', pindex, cindex, pid }
	 *
         * Returns false if no point is near the passed position.  
	 *
	 * @method locatePointNear
	 * @param {Vertex} point - The polygonal selection area.
	 * @param {number=} [tolerance=7] - The tolerance to use identtifying vertices.
	 * @private
	 * @return {Draggable} Or false if none found.
	 **/
        var locatePointNear = function( point, tolerance ) {
            // var tolerance = 7;
	    if( typeof tolerance == 'undefined' )
		tolerance = 7;
	    // Apply the zoom (the tolerant area should not shrink or grow when zooming)
	    tolerance /= _self.draw.scale.x;
	    // Search in vertices
	    for( var vindex in _self.vertices ) {
		var vert = _self.vertices[vindex];
		if( (vert.attr.draggable || vert.attr.selectable) && vert.distance(point) < tolerance ) {
		    // { type : 'vertex', vindex : vindex };
		    return new Draggable( vert, Draggable.VERTEX ).setVIndex(vindex); 
		}
	    } 
            return false;
        }


	/**
	 * Handle left-click event.<br> 
	 *
	 * @method handleClick
	 * @param {number} x - The click X position on the canvas.
	 * @param {number} y - The click Y position on the canvas.
	 * @private
	 * @return {void}
	 **/
	function handleClick(x,y) {
	    var p = locatePointNear( _self.transformMousePosition(x, y), DEFAULT_CLICK_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
	    if( p ) { 
		if( keyHandler.isDown('shift') ) {
		    if( p.type == 'bpath' ) {
			let vert = _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid);
			if( vert.attr.selectable )
			    vert.attr.isSelected = !vert.attr.isSelected;
		    } else if( p.type == 'vertex' ) {
			let vert = _self.vertices[p.vindex];
			if( vert.attr.selectable )
			    vert.attr.isSelected = !vert.attr.isSelected;
		    }
		    _self.redraw();
		} else if( keyHandler.isDown('y') /* && p.type=='bpath' && (p.pid==BezierPath.START_POINT || p.pid==BezierPath.END_POINT) */ ) {
		    _self.vertices[p.vindex].attr.bezierAutoAdjust = !_self.vertices[p.vindex].attr.bezierAutoAdjust;
		    _self.redraw();
		}
	    }
	    else if( _self.selectPolygon != null ) {
		var vert = _self.transformMousePosition( x, y );
		_self.selectPolygon.vertices.push( vert );
		_self.redraw();
	    }
	}


	
	/**
	 * Transforms the given x-y-(mouse-)point to coordinates respecting the view offset
	 * and the zoom settings.
	 *
	 * @method transformMousePosition
	 * @param {number} x - The x position relative to the canvas.
	 * @param {number} y - The y position relative to the canvas.
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {object} A simple object <pre>{ x : Number, y : Number }</pre> with the transformed coordinates.
	 **/
	PlotBoilerplate.prototype.transformMousePosition = function( x, y ) {
	    return { x : (x/this.config.cssScaleX-this.config.offsetX)/(this.config.scaleX),
		     y : (y/this.config.cssScaleY-this.config.offsetY)/(this.config.scaleY) };
	};
	


	/**
	 * (Helper) The mouse-down handler.
	 *
	 * It selects vertices for dragging.
	 *
	 * @method mouseDownHandler.
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseDownHandler = function(e) {
	    if( e.which != 1 && !(window.TouchEvent && e.originalEvent instanceof TouchEvent) )
		return; // Only react on left mouse or touch events
	    var p = locatePointNear( _self.transformMousePosition(e.params.pos.x, e.params.pos.y), DEFAULT_CLICK_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
	    if( !p ) return;
	    // Drag all selected elements?
	    if( p.type == 'vertex' && _self.vertices[p.vindex].attr.isSelected ) {
		// Multi drag
		for( var i in _self.vertices ) {
		    if( _self.vertices[i].attr.isSelected ) {
			_self.draggedElements.push( new Draggable( _self.vertices[i], Draggable.VERTEX ).setVIndex(i) );
			_self.vertices[i].listeners.fireDragStartEvent( e );
		    }
		}
	    } else {
		// Single drag
		if( !_self.vertices[p.vindex].attr.draggable )
		    return;
		_self.draggedElements.push( p );
		if( p.type == 'bpath' )
		    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent( e );
		else if( p.type == 'vertex' )
		    _self.vertices[p.vindex].listeners.fireDragStartEvent( e );
	    }
	    _self.redraw();
	};


	
	/**
	 * The mouse-drag handler.
	 *
	 * It moves selected elements around or performs the panning if the ctrl-key if
	 * hold down.
	 *
	 * @method mouseDownHandler.
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseDragHandler = function(e) {
	    var oldDragAmount = { x : e.params.dragAmount.x, y : e.params.dragAmount.y };
	    e.params.dragAmount.x /= _self.config.cssScaleX;
	    e.params.dragAmount.y /= _self.config.cssScaleY;
	    if( keyHandler.isDown('alt') || keyHandler.isDown('ctrl') || keyHandler.isDown('spacebar') ) {
		_self.draw.offset.add( e.params.dragAmount );
		_self.fill.offset.set( _self.draw.offset );
		_self.config.offsetX = _self.draw.offset.x;
		_self.config.offsetY = _self.draw.offset.y;
		_self.redraw();
	    } else {
		// Convert drag amount by scaling
		// Warning: this possibly invalidates the dragEvent for other listeners!
		//          Rethink the solution when other features are added.
		e.params.dragAmount.x /= _self.draw.scale.x;
		e.params.dragAmount.y /= _self.draw.scale.y;		
		for( var i in _self.draggedElements ) {
		    var p = _self.draggedElements[i];
		    if( p.type == 'bpath' ) {
			_self.paths[p.pindex].moveCurvePoint( p.cindex, p.pid, e.params.dragAmount );
			_self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent( e );
		    } else if( p.type == 'vertex' ) {
			if( !_self.vertices[p.vindex].attr.draggable )
			    continue;
			_self.vertices[p.vindex].add( e.params.dragAmount );
			_self.vertices[p.vindex].listeners.fireDragEvent( e );
		    }
		}
	    }
	    // Restore old event values!
	    e.params.dragAmount.x = oldDragAmount.x;
	    e.params.dragAmount.y = oldDragAmount.y;
	    _self.redraw();
	};

	

	/**
	  * The mouse-up handler.
	 *
	 * It clears the dragging-selection.
	 *
	 * @method mouseDownHandler.
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseUpHandler = function(e) {
	    if( e.which != 1 )
		return; // Only react on left mouse;
	    if( !e.params.wasDragged )
		handleClick( e.params.pos.x, e.params.pos.y );
	    for( var i in _self.draggedElements ) {
		var p = _self.draggedElements[i];
		if( p.type == 'bpath' ) {
		    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent( e );
		} else if( p.type == 'vertex' ) {
		    _self.vertices[p.vindex].listeners.fireDragEndEvent( e );
		}
	    }
	    _self.draggedElements = [];
	    _self.redraw();
	};


	
	/**
	 * The mouse-wheel handler.
	 *
	 * It performs the zooming.
	 *
	 * @method mouseWheelHandler.
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseWheelHandler = function(e) {
	    var zoomStep = 1.25;
	    let oldPos = _self.transformMousePosition(e.params.pos.x, e.params.pos.y);
	    if( e.deltaY < 0 ) {
		_self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX = _self.config.scaleX*zoomStep;
		_self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY = _self.config.scaleY*zoomStep;
	    } else if( e.deltaY > 0 ) {
		_self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX = Math.max(_self.config.scaleX/zoomStep,0.01);
		_self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY = Math.max(_self.config.scaleY/zoomStep,0.01);
	    }
	    let newPos = _self.transformMousePosition(e.params.pos.x, e.params.pos.y);
	    // Apply relative positioned zoom
	    let newOffsetX = _self.draw.offset.x + (newPos.x-oldPos.x)*_self.draw.scale.x;
	    let newOffsetY = _self.draw.offset.y + (newPos.y-oldPos.y)*_self.draw.scale.y;
	    _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX = newOffsetX;
	    _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY = newOffsetY;
	    
	    e.preventDefault();
	    _self.redraw();
	};


	if( this.config.enableMouse ) { 
	    // Install a mouse handler on the canvas.
	    new MouseHandler(this.canvas)
		.down( mouseDownHandler )
		.drag( mouseDragHandler )
		.up( mouseUpHandler )
	    ;
	} else { _self.console.log('Mouse interaction disabled.'); }


	if( this.config.enableMouseWheel ) { 
	    // Install a mouse handler on the canvas.
	    new MouseHandler(this.canvas)
		.wheel( mouseWheelHandler )
	    ;
	} else { _self.console.log('Mouse wheel interaction disabled.'); }


	
	if( this.config.enableTouch) { 
	    // Install a touch handler on the canvas.

	    // Convert absolute touch positions to relative DOM element position (relative to canvas)
	    function relPos(pos) {
		return { x : pos.x - _self.canvas.offsetLeft,
			 y : pos.y - _self.canvas.offsetTop
		       };
	    }
	    // Some private vars to store the current mouse/position/button state.
	    var touchMovePos = null;
	    var touchDownPos = null;
	    var draggedElement = null;
	    new Touchy( this.canvas,
			{ one : function( hand, finger ) {
			    touchMovePos = new Vertex( relPos(finger.lastPoint) );
			    touchDownPos = new Vertex( relPos(finger.lastPoint) );
			    draggedElement = locatePointNear( _self.transformMousePosition(touchMovePos.x, touchMovePos.y), DEFAULT_TOUCH_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
			    if( draggedElement ) {
				hand.on('move', function (points) {
				    var rel = relPos( points[0] );
				    var trans = _self.transformMousePosition( rel.x, rel.y ); 
				    var diff = new Vertex(_self.transformMousePosition( touchMovePos.x, touchMovePos.y )).difference(trans);
				    if( draggedElement.type == 'vertex' ) {
					if( !_self.vertices[draggedElement.vindex].attr.draggable )
					    return;
					_self.vertices[draggedElement.vindex].add( diff );
					var fakeEvent = { params : { dragAmount : diff.clone(), wasDragged : true, mouseDownPos : touchDownPos.clone(), mouseDragPos : touchDownPos.clone().add(diff) }};
					_self.vertices[draggedElement.vindex].listeners.fireDragEvent( fakeEvent );
					_self.redraw();
				    }
				    touchMovePos = new Vertex(rel);
				} );
			    }

			}
			} );
	} else { _self.console.log('Touch interaction disabled.'); }

	if( this.config.enableKeys ) {
	    // Install key handler
	    var keyHandler = new KeyHandler( { trackAll : true } )
		.down('escape',function() {
		    _self.clearSelection(true);
		} )
		.down('shift',function() {
		    _self.selectPolygon = new Polygon();
		    _self.redraw();
		} )
		.up('shift',function() {
		    // Find and select vertices in the drawn area
		    if( _self.selectPolygon == null )
			return;
		    _self.selectVerticesInPolygon( _self.selectPolygon );
		    _self.selectPolygon = null;
		    _self.redraw();
		} )
		.down('e',function() { _self.console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } ) 
	    ;
	} // END IF enableKeys?
	else  { _self.console.log('Keyboard interaction disabled.'); }
	
	// Apply the configured CSS scale.
	this.updateCSSscale();	
	// Init	
	this.redraw();
	// Gain focus
	this.canvas.focus();
	
    }; // END construcor 'PlotBoilerplate'



    /**
     * Creates a control GUI (a dat.gui instance) for this 
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui} 
     **/
    PlotBoilerplate.prototype.createGUI = function() {
	var gui = new dat.gui.GUI();
	var _self = this;
	gui.remember(this.config);
	var fold0 = gui.addFolder('Editor settings');
	var fold00 = fold0.addFolder('Canvas size');
	fold00.add(this.config, 'fullSize').onChange( function() { _self.resizeCanvas(); } ).title("Toggles the fullpage mode.").listen();
	fold00.add(this.config, 'fitToParent').onChange( function() { _self.resizeCanvas(); } ).title("Toggles the fit-to-parent mode to fit to parent container (overrides fullsize).").listen();
	fold00.add(this.config, 'defaultCanvasWidth').min(1).step(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies the fallback width.");
	fold00.add(this.config, 'defaultCanvasHeight').min(1).step(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies the fallback height.");
	fold00.add(this.config, 'canvasWidthFactor').min(0.1).step(0.1).max(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies a factor for the current width.").listen();
	fold00.add(this.config, 'canvasHeightFactor').min(0.1).step(0.1).max(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies a factor for the current height.").listen();
	fold00.add(this.config, 'cssScaleX').min(0.01).step(0.01).max(1.0).onChange( function() { if(_self.config.cssUniformScale) _self.config.cssScaleY = _self.config.cssScaleX; _self.updateCSSscale(); } ).title("Specifies the visual x scale (CSS).").listen();
	fold00.add(this.config, 'cssScaleY').min(0.01).step(0.01).max(1.0).onChange( function() { if(_self.config.cssUniformScale) _self.config.cssScaleX = _self.config.cssScaleY; _self.updateCSSscale(); } ).title("Specifies the visual y scale (CSS).").listen();
	fold00.add(this.config, 'cssUniformScale').onChange( function() { if(_self.config.cssUniformScale) _self.config.cssScaleY = _self.config.cssScaleX; _self.updateCSSscale(); } ).title("CSS uniform scale (x-scale equlsa y-scale).");
	fold00.add(this.config, 'setToRetina').name('Set to highres fullsize').title('Set canvas to high-res retina resoultion (x2).');
	
	var fold01 = fold0.addFolder('Draw settings');
	fold01.add(this.config, 'drawBezierHandlePoints').onChange( function() { _self.redraw(); } ).title("Draw Bézier handle points.");
	fold01.add(this.config, 'drawBezierHandleLines').onChange( function() { _self.redraw(); } ).title("Draw Bézier handle lines.");
	fold01.add(this.config, 'drawHandlePoints').onChange( function() { _self.redraw(); } ).title("Draw handle points (overrides all other settings).");
	fold01.add(this.config, 'drawHandleLines').onChange( function() { _self.redraw(); } ).title("Draw handle lines in general (overrides all other settings).");
	fold01.add(this.drawConfig, 'drawVertices').onChange( function() { _self.redraw(); } ).title("Draw vertices in general.");
	
	var fold0100 = fold01.addFolder('Colors and Lines');
	var _addDrawConfigElement = function( fold, basePath, conf ) {
	    for( var i in conf ) {
		if( typeof conf[i] == 'object' ) {
		    if( conf[i].hasOwnProperty('color') )
			fold.addColor(conf[i], 'color').onChange( function() { _self.redraw(); } ).name(basePath+i+'.color').title(basePath+i+'.color').listen();
		    if( conf[i].hasOwnProperty('lineWidth') )
			fold.add(conf[i], 'lineWidth').min(1).max(10).step(1).onChange( function() { _self.redraw(); } ).name(basePath+i+'.lineWidth').title(basePath+i+'.lineWidth').listen();
		    for( var e in conf[i] ) {
			if( conf[i].hasOwnProperty(e) && typeof conf[i][e] == 'object' ) { // console.log(e);
			    _addDrawConfigElement( fold, (basePath!=''?basePath+'.':'')+i+'.'+e, conf[i] );
			}
		    }
		}
	    }
	};
	_addDrawConfigElement(fold0100, '', this.drawConfig);
	
	
	
	fold0.add(this.config, 'scaleX').title("Scale x.").min(0.01).max(10.0).step(0.01).onChange( function() { _self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX; _self.redraw(); } ).listen();
	fold0.add(this.config, 'scaleY').title("Scale y.").min(0.01).max(10.0).step(0.01).onChange( function() { _self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY; _self.redraw(); } ).listen();
	fold0.add(this.config, 'offsetX').title("Offset x.").step(10.0).onChange( function() { _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX; _self.redraw(); } ).listen();
	fold0.add(this.config, 'offsetY').title("Offset y.").step(10.0).onChange( function() { _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY; _self.redraw(); } ).listen();
	fold0.add(this.config, 'rasterGrid').title("Draw a fine raster instead a full grid.").onChange( function() { _self.redraw(); } ).listen();
	fold0.add(this.config, 'redrawOnResize').title("Automatically redraw the data if window or canvas is resized.").listen();
	fold0.addColor(this.config, 'backgroundColor').onChange( function() { _self.redraw(); } ).title("Choose a background color.");
	// fold0.add(this.config, 'loadImage').name('Load Image').title("Load a background image.");

	if( this.config.enableExport ) {
	    var fold1 = gui.addFolder('Export');
	    fold1.add(this.config, 'saveFile').name('Save a file').title("Save as SVG.");
	}
	
	return gui;
    };



    /**
     * A set of helper functions.
     * @private
     **/
    PlotBoilerplate.utils = {
	
	/** 
	 * Merge the elements in the 'extension' object into the 'base' object based on
	 * the keys of 'base'.
	 *
	 * @param {Object} base
	 * @param {Object} extension
	 * @return {Object} base extended by the new attributes.
	 **/
	safeMergeByKeys : function( base, extension ) {
	    for( var k in base ) {
		if( !extension.hasOwnProperty(k) )
		    continue;
		var type = typeof base[k];
		try {
		    if( type == 'boolean' ) base[k] = !!JSON.parse(extension[k]);
		    else if( type == 'number' ) base[k] = JSON.parse(extension[k])*1;
		    else if( type == 'function' && typeofextension[k] == 'function' ) base[k] = extension[k] ;
		    else base[k] = extension[k];
		} catch( e ) {
		    _self.console.error( 'error in key ', k, extension[k], e );
		}
	    }
	    return base;
	},

	
	/**
	 * Generate a four-point arrow head, starting at the vector end minus the
	 * arrow head length.
	 *
	 * The first vertex in the returned array is guaranteed to be the located
	 * at the vector line end minus the arrow head length.
	 *
	 *
	 * Due to performance all params are required.
	 *
	 * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
	 * scaling different). Arrow heads should not look distored on non-uniform scaling.
	 *
	 * If unsure use 1.0 for scaleX and scaleY (=no distortion).
	 * For headlen use 8, it's a good arrow head size.
	 *
	 * Example:
	 *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
	 *
	 * @param {Vertex} zA - The start vertex of the vector to calculate the arrow head for.
	 * @param {Vertex} zB - The end vertex of the vector.
	 * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
	 * @param {number} scaleX  - The horizontal scaling during draw.
	 * @param {number} scaleY  - the vertical scaling during draw.
	 **/
	buildArrowHead : function( zA, zB, headlen, scaleX, scaleY ) {
	    var angle = Math.atan2( (zB.y-zA.y)*scaleY, (zB.x-zA.x)*scaleX );
	    
	    var vertices = [];
	    vertices.push( new Vertex(zB.x*scaleX-(headlen)*Math.cos(angle), zB.y*scaleY-(headlen)*Math.sin(angle)) );    
	    vertices.push( new Vertex(zB.x*scaleX-(headlen*1.35)*Math.cos(angle-Math.PI/8), zB.y*scaleY-(headlen*1.35)*Math.sin(angle-Math.PI/8) ) );
	    vertices.push( new Vertex(zB.x*scaleX, zB.y*scaleY) );
	    vertices.push( new Vertex(zB.x*scaleX-(headlen*1.35)*Math.cos(angle+Math.PI/8), zB.y*scaleY-(headlen*1.35)*Math.sin(angle+Math.PI/8)) );

	    return vertices;
	}
    };


    // A helper for fetching data from objects.
    let fetch = {
	/**
	 * A helper function to the the object property value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	val : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] == 'undefined' )
		return fallback;
	    return obj[key];
	},


	/**
	 * A helper function to the the object property numeric value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	num : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] !== 'number' )
		return fallback;
	    return obj[key];
	},

	/**
	 * A helper function to the the object property boolean value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	bool : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] !== 'boolean' )
		return fallback;
	    return obj[key];
	},


	/**
	 * A helper function to the the object property function-value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	func : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] !== 'function' )
		return fallback;
	    return obj[key];
	},
    };
    
    _context.PlotBoilerplate = PlotBoilerplate;
    
})(window); 







/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * A rectangular-selector tool for the plot-boilerplate using DIVs.
 * 
 * This is to avoid redraw-events to be fired during the selection process (for large content 
 * that takes long to redraw).
 *
 * @require PlotBoilerplate, MouseHandler
 *
 * @author  Ikaros Kappler
 * @date    2018-12-30
 * @version 1.0.0
 **/

(function(_context) {

    PlotBoilerplate.RectSelector = function( bp, divID, normalization, callback ) {
	
	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	var rect = document.getElementById(divID);
	var rectBounds = { xMin : 0, yMin : 0, xMax : 0, yMax : 0 };
	new MouseHandler(rect).up( function(e) {
	    if( e.button != 0 ) // Left mouse button?
		return;
	    rect.style.display = 'none';
	    console.log('xMin',rectBounds.xMin,'yMin',rectBounds.yMin,'xMax',rectBounds.xMax,'yMax',rectBounds.yMax);
	    if( rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax )
		callback( rectBounds );
	} );
	var mouseHandler = new MouseHandler(bp.canvas)
	    .down( function(e) {
		if( e.button != 0 ) // Left mouse button?
		    return;
		rect.style.display = 'inherit';
		rect.style.left = e.clientX+'px';
		rect.style.top = e.clientY+'px';
		rect.style.width = '1px';
		rect.style.height = '1px';
		var relPos = bp.transformMousePosition(e.params.mouseDownPos.x,e.params.mouseDownPos.y);
		rectBounds.xMin = rectBounds.xMax = normalization.unNormalizeX(relPos.x);
		rectBounds.yMin = rectBounds.yMax = normalization.unNormalizeY(relPos.y);
	    } )
	    .up( function(e) {
		if( e.button != 0 ) // Left mouse button?
		    return;
		console.log('up');
		rect.style.display = 'none';
		console.log('xMin',rectBounds.xStart,'yMin',rectBounds.yStart,'xMax',rectBounds.xEnd,'yMax',rectBounds.yEnd);
		//if( e.wasDragged )
		if( rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax )
		    callback( rectBounds );
	    } )
	    .drag( function(e) {
		if( e.button != 0 ) // Left mouse button?
		    return;
		var bounds = {
		    xStart : e.params.mouseDownPos.x,
		    yStart : e.params.mouseDownPos.y,
		    xEnd   : e.params.pos.x,
		    yEnd   : e.params.pos.y
		};
		var relPos = bp.transformMousePosition(e.params.pos.x,e.params.pos.y);
		rectBounds.xMax = normalization.unNormalizeX(relPos.x);
		rectBounds.yMax = normalization.unNormalizeY(relPos.y);
		rect.style.width = (bounds.xEnd-bounds.xStart)+'px';
		rect.style.height = (bounds.yEnd-bounds.yStart)+'px';
	    } )
	;
    };
})( true ? module.export : undefined );

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)(module)))

/***/ })
/******/ ]);