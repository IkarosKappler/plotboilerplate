(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pb", [], factory);
	else if(typeof exports === 'object')
		exports["pb"] = factory();
	else
		root["pb"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
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
 * @modified 2020-03-06 Added functions invX() and invY().
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-05-26 Added functions addX(number) and addY(number).
 * @version  2.4.0
 *
 * @file Vertex
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr_1 = __webpack_require__(4);
var VertexListeners_1 = __webpack_require__(10);
var Vertex = /** @class */ (function () {
    /**
     * The constructor for the vertex class.
     *
     * @constructor
     * @name Vertex
     * @param {number} x - The x-coordinate of the new vertex.
     * @param {number} y - The y-coordinate of the new vertex.
     **/
    function Vertex(x, y) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Vertex";
        /*if( x instanceof Vertex ) {
            this.x = x.x;
            this.y = x.y;
            } */
        if (typeof x == 'undefined') {
            this.x = 0;
            this.y = 0;
        }
        else if (typeof x == 'number' && typeof y == 'number') {
            this.x = x;
            this.y = y;
        }
        else {
            var tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x = tuple.x;
                this.y = tuple.y;
            }
            else {
                if (typeof x == 'number')
                    this.x = x;
                else if (typeof x == 'undefined')
                    this.x = 0;
                else
                    this.x = NaN;
                if (typeof y == 'number')
                    this.y = y;
                else if (typeof y == 'undefined')
                    this.y = 0;
                else
                    this.y = NaN;
            }
        }
        this.attr = new VertexAttr_1.VertexAttr();
        this.listeners = new VertexListeners_1.VertexListeners(this);
    }
    ;
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
    Vertex.prototype.set = function (x, y) {
        /* if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
            }*/
        if (typeof x == 'number' && typeof y == 'number') {
            this.x = x;
            this.y = y;
        }
        else {
            var tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x = tuple.x;
                this.y = tuple.y;
            }
            else {
                if (typeof x == 'number')
                    this.x = x;
                else if (typeof x == 'undefined')
                    this.x = 0;
                else
                    this.x = NaN;
                if (typeof y == 'number')
                    this.y = y;
                else if (typeof y == 'undefined')
                    this.y = 0;
                else
                    this.y = NaN;
            }
        }
        return this;
    };
    ;
    /**
     * Set the x-component of this vertex.
     *
     * @method setX
     * @param {number} x - The new x-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    ;
    /**
     * Set the y-component of this vertex.
     *
     * @method setY
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    ;
    /**
     * Set the x-component if this vertex to the inverse of its value.
     *
     * @method invX
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.invX = function () {
        this.x = -this.x;
        return this;
    };
    ;
    /**
     * Set the y-component if this vertex to the inverse of its value.
     *
     * @method invy
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.invY = function () {
        this.y = -this.y;
        return this;
    };
    ;
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
    Vertex.prototype.add = function (x, y) {
        if (typeof x == 'number' && typeof y == 'number') {
            this.x += x;
            this.y += y;
        }
        else {
            var tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x += tuple.x;
                this.y += tuple.y;
            }
            else {
                if (typeof x == 'number')
                    this.x += x;
                else
                    console.warn("Cannot add " + typeof x + " to numeric x component!");
                if (typeof y == 'number')
                    this.y += y;
                else
                    console.warn("Cannot add " + typeof y + " to numeric y component!");
            }
        }
        return this;
    };
    ;
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
    Vertex.prototype.addXY = function (amountX, amountY) {
        this.x += amountX;
        this.y += amountY;
        return this;
    };
    ;
    /**
     * Add the passed amounts to the x-component of this vertex.
     *
     * @method addX
     * @param {number} x - The amount to add to x.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.addX = function (amountX) {
        this.x += amountX;
        return this;
    };
    ;
    /**
     * Add the passed amounts to the y-component of this vertex.
     *
     * @method addY
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.addY = function (amountY) {
        this.y += amountY;
        return this;
    };
    ;
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
    Vertex.prototype.sub = function (x, y) {
        /* if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
            } */
        if (typeof x == 'number' && typeof y == 'number') {
            this.x -= x;
            this.y -= y;
        }
        else {
            var tuple = x;
            if (typeof tuple.x == "number" && typeof tuple.y == "number") {
                this.x -= tuple.x;
                this.y -= tuple.y;
            }
            else {
                if (typeof x == 'number')
                    this.x -= x;
                else
                    console.warn("Cannot add " + typeof x + " to numeric x component!");
                if (typeof y == 'number')
                    this.y -= y;
                else
                    console.warn("Cannot add " + typeof y + " to numeric y component!");
            }
        }
        return this;
    };
    ;
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
    Vertex.prototype.equals = function (vertex) {
        var eqX = (Math.abs(this.x - vertex.x) < Vertex.EPSILON);
        var eqY = (Math.abs(this.y - vertex.y) < Vertex.EPSILON);
        var result = eqX && eqY;
        return result;
    };
    ;
    /**
     * Create a copy of this vertex.
     *
     * @method clone
     * @return {Vertex} A new vertex, an exact copy of this.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.clone = function () {
        return new Vertex(this.x, this.y);
    };
    ;
    /**
     * Get the distance to the passed point (in euclidean metric)
     *
     * @method distance
     * @param {Vertex} vert - The vertex to measure the distance to.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.distance = function (vert) {
        return Math.sqrt(Math.pow(vert.x - this.x, 2) + Math.pow(vert.y - this.y, 2));
    };
    ;
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
    Vertex.prototype.difference = function (vert) {
        return new Vertex(vert.x - this.x, vert.y - this.y);
    };
    ;
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
    Vertex.prototype.scale = function (factor, center) {
        if (!center || typeof center === "undefined")
            center = new Vertex(0, 0);
        this.x = center.x + (this.x - center.x) * factor;
        this.y = center.y + (this.y - center.y) * factor;
        return this;
    };
    ;
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
    Vertex.prototype.rotate = function (angle, center) {
        if (!center || typeof center === "undefined")
            center = new Vertex(0, 0);
        this.sub(center);
        angle += Math.atan2(this.y, this.x);
        var len = this.distance(Vertex.ZERO); // {x:0,y:0});
        var lenX = this.x;
        var lenY = this.y;
        this.x = len * Math.cos(angle);
        this.y = len * Math.sin(angle);
        this.add(center);
        return this;
    };
    ;
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
    Vertex.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    ;
    /**
     * Round the two components x and y of this vertex.
     *
     * @method round
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };
    ;
    /**
     * Change this vertex (x,y) to its inverse (-x,-y).
     *
     * @method inv
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.inv = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    ;
    /**
     * Get a string representation of this vertex.
     *
     * @method toString
     * @return {string} The string representation of this vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.toString = function () {
        return '(' + this.x + ',' + this.y + ')';
    };
    ;
    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<circle');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' cx="' + this.x + '"');
        buffer.push(' cy="' + this.y + '"');
        buffer.push(' r="2"');
        buffer.push(' />');
        return buffer.join('');
    };
    ;
    // END Vertex
    /**
     * Create a new random vertex inside the given viewport.
     *
     * @param {ViewPort} viewPort - A {min:Vertex, max:Vertex} viewport specifying the bounds.
     * @return A new vertex with a random position.
     **/
    Vertex.randomVertex = function (viewPort) {
        return new Vertex(viewPort.min.x + Math.random() * (viewPort.max.x - viewPort.min.x), viewPort.min.y + Math.random() * (viewPort.max.y - viewPort.min.y));
    };
    ;
    Vertex.ZERO = new Vertex(0, 0);
    /**
     * An epsilon for comparison
     *
     * @private
     **/
    Vertex.EPSILON = 1.0e-6;
    Vertex.utils = {
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
        // @DEPRECATED: use Vector.utils.buildArrowHead instead!!!
        buildArrowHead: function (zA, zB, headlen, scaleX, scaleY) {
            // console.warn('This function is deprecated! Use Vector.utils.buildArrowHead instead!');
            var angle = Math.atan2((zB.y - zA.y) * scaleY, (zB.x - zA.x) * scaleX);
            var vertices = [];
            vertices.push(new Vertex(zB.x * scaleX - (headlen) * Math.cos(angle), zB.y * scaleY - (headlen) * Math.sin(angle)));
            vertices.push(new Vertex(zB.x * scaleX - (headlen * 1.35) * Math.cos(angle - Math.PI / 8), zB.y * scaleY - (headlen * 1.35) * Math.sin(angle - Math.PI / 8)));
            vertices.push(new Vertex(zB.x * scaleX, zB.y * scaleY));
            vertices.push(new Vertex(zB.x * scaleX - (headlen * 1.35) * Math.cos(angle + Math.PI / 8), zB.y * scaleY - (headlen * 1.35) * Math.sin(angle + Math.PI / 8)));
            return vertices;
        }
    };
    return Vertex;
}());
exports.Vertex = Vertex;
//# sourceMappingURL=Vertex.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc A bounds class with min and max values.
 *
 * @requires XYCoords, Vertex, IBounds
 *
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @version  1.0.0
 *
 * @file Bopunds
 * @fileoverview A simple bounds class implementing IBounds.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Bounds
     * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
     **/
    function Bounds(min, max) {
        this.min = min;
        this.max = max;
        this.width = max.x - min.x;
        this.height = max.y - min.y;
    }
    ;
    return Bounds;
}()); // END class bounds
exports.Bounds = Bounds;
//# sourceMappingURL=Bounds.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
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
 * @modified 2019-12-15 Added the Line.moveTo(Vertex) function.
 * @modified 2020-03-16 The Line.angle(Line) parameter is now optional. The baseline (x-axis) will be used if not defined.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  2.1.2
 *
 * @file Line
 * @public
 **/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var VertTuple_1 = __webpack_require__(12);
var Vertex_1 = __webpack_require__(0);
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    /**
     * Creates an instance of Line.
     *
     * @constructor
     * @name Line
     * @param {Vertex} a The line's first point.
     * @param {Vertex} b The line's second point.
     **/
    function Line(a, b) {
        var _this = _super.call(this, a, b, function (a, b) { return new Line(a, b); }) || this;
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        _this.className = "Line";
        return _this;
    }
    /**
     * Get the intersection if this line and the specified line.
     *
     * @method intersection
     * @param {Line} line The second line.
     * @return {Vertex} The intersection (may lie outside the end-points).
     * @instance
     * @memberof Line
     **/
    // !!! DO NOT MOVE TO VertTuple
    Line.prototype.intersection = function (line) {
        var denominator = this.denominator(line);
        if (denominator == 0)
            return null;
        var a = this.a.y - line.a.y;
        var b = this.a.x - line.a.x;
        var numerator1 = ((line.b.x - line.a.x) * a) - ((line.b.y - line.a.y) * b);
        var numerator2 = ((this.b.x - this.a.x) * a) - ((this.b.y - this.a.y) * b);
        a = numerator1 / denominator; // NaN if parallel lines
        b = numerator2 / denominator;
        // if we cast these lines infinitely in both directions, they intersect here:
        return new Vertex_1.Vertex(this.a.x + (a * (this.b.x - this.a.x)), this.a.y + (a * (this.b.y - this.a.y)));
    };
    ;
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
    Line.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<line');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' x1="' + this.a.x + '"');
        buffer.push(' y1="' + this.a.y + '"');
        buffer.push(' x2="' + this.b.x + '"');
        buffer.push(' y2="' + this.b.y + '"');
        buffer.push(' />');
        return buffer.join('');
    };
    ;
    return Line;
}(VertTuple_1.VertTuple));
exports.Line = Line;
//# sourceMappingURL=Line.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
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
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  1.2.1
 *
 * @file Vector
 * @public
 **/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var VertTuple_1 = __webpack_require__(12);
var Vertex_1 = __webpack_require__(0);
var Vector = /** @class */ (function (_super) {
    __extends(Vector, _super);
    /**
     * The constructor.
     *
     * @constructor
     * @name Vector
     * @extends Line
     * @param {Vertex} vertA - The start vertex of the vector.
     * @param {Vertex} vertB - The end vertex of the vector.
     **/
    function Vector(vertA, vertB) {
        var _this = _super.call(this, vertA, vertB, function (a, b) { return new Vector(a, b); }) || this;
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        _this.className = "Vector";
        return _this;
    }
    ;
    /**
     * Get the perpendicular of this vector which is located at a.
     *
     * @param {Number} t The position on the vector.
     * @return {Vector} A new vector being the perpendicular of this vector sitting on a.
     **/
    Vector.prototype.perp = function () {
        var v = this.clone();
        v.sub(this.a);
        v = new Vector(new Vertex_1.Vertex(), new Vertex_1.Vertex(-v.b.y, v.b.x));
        v.a.add(this.a);
        v.b.add(this.a);
        return v;
    };
    ;
    /**
     * The inverse of a vector is a vector witht the same magnitude but oppose direction.
     *
     * Please not that the origin of this vector changes here: a->b becomes b->a.
     *
     * @return {Vector}
     **/
    Vector.prototype.inverse = function () {
        var tmp = this.a;
        this.a = this.b;
        this.b = tmp;
        return this;
    };
    ;
    /**
     * This function computes the inverse of the vector, which means 'a' stays untouched.
     *
     * @return {Vector} this for chaining.
     **/
    Vector.prototype.inv = function () {
        this.b.x = this.a.x - (this.b.x - this.a.x);
        this.b.y = this.a.y - (this.b.y - this.a.y);
        return this;
    };
    ;
    /**
     * Get the intersection if this vector and the specified vector.
     *
     * @method intersection
     * @param {Vector} line The second vector.
     * @return {Vertex} The intersection (may lie outside the end-points).
     * @instance
     * @memberof Line
     **/
    Vector.prototype.intersection = function (line) {
        var denominator = this.denominator(line);
        if (denominator == 0)
            return null;
        var a = this.a.y - line.a.y;
        var b = this.a.x - line.a.x;
        var numerator1 = ((line.b.x - line.a.x) * a) - ((line.b.y - line.a.y) * b);
        var numerator2 = ((this.b.x - this.a.x) * a) - ((this.b.y - this.a.y) * b);
        a = numerator1 / denominator; // NaN if parallel lines
        b = numerator2 / denominator;
        // TODO:
        // FOR A VECTOR THE LINE-INTERSECTION MUST BE ON BOTH VECTORS
        // if we cast these lines infinitely in both directions, they intersect here:
        return new Vertex_1.Vertex(this.a.x + (a * (this.b.x - this.a.x)), this.a.y + (a * (this.b.y - this.a.y)));
    };
    ;
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
    Vector.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        var vertices = Vector.utils.buildArrowHead(this.a, this.b, 8, 1.0, 1.0);
        buffer.push('<g');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push('>');
        buffer.push('   <line');
        buffer.push(' x1="' + this.a.x + '"');
        buffer.push(' y1="' + this.a.y + '"');
        buffer.push(' x2="' + vertices[0].x + '"');
        buffer.push(' y2="' + vertices[0].y + '"');
        buffer.push(' />');
        // Add arrow head
        buffer.push('   <polygon points="');
        for (var i = 0; i < vertices.length; i++) {
            if (i > 0)
                buffer.push(' ');
            buffer.push('' + vertices[i].x + ',' + vertices[i].y);
        }
        buffer.push('"/>');
        buffer.push('</g>');
        return buffer.join('');
    };
    ;
    Vector.utils = {
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
        buildArrowHead: function (zA, zB, headlen, scaleX, scaleY) {
            var angle = Math.atan2((zB.y - zA.y) * scaleY, (zB.x - zA.x) * scaleX);
            var vertices = [];
            vertices.push(new Vertex_1.Vertex(zB.x * scaleX - (headlen) * Math.cos(angle), zB.y * scaleY - (headlen) * Math.sin(angle)));
            vertices.push(new Vertex_1.Vertex(zB.x * scaleX - (headlen * 1.35) * Math.cos(angle - Math.PI / 8), zB.y * scaleY - (headlen * 1.35) * Math.sin(angle - Math.PI / 8)));
            vertices.push(new Vertex_1.Vertex(zB.x * scaleX, zB.y * scaleY));
            vertices.push(new Vertex_1.Vertex(zB.x * scaleX - (headlen * 1.35) * Math.cos(angle + Math.PI / 8), zB.y * scaleY - (headlen * 1.35) * Math.sin(angle + Math.PI / 8)));
            return vertices;
        }
    };
    return Vector;
}(VertTuple_1.VertTuple));
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
 * @modified 2020-02-29 Added the 'selectable' attribute.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  1.1.1
 *
 * @file VertexAttr
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr = /** @class */ (function () {
    /**
     * The constructor.
     *
     * Attributes will be initialized as defined in the model object
     * which serves as a singleton.
     *
     * @constructor
     * @name VertexAttr
     **/
    function VertexAttr() {
        this.draggable = true;
        this.selectable = true;
        this.isSelected = false;
        for (var key in VertexAttr.model)
            this[key] = VertexAttr.model[key];
    }
    ;
    /**
     * This is the global attribute model. Set these object on the initialization
     * of your app to gain all VertexAttr instances have these attributes.
     *
     * @type {object}
     **/
    VertexAttr.model = {
        draggable: true,
        selectable: true,
        isSelected: false
    };
    return VertexAttr;
}());
exports.VertexAttr = VertexAttr;
//# sourceMappingURL=VertexAttr.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc A refactored cubic bezier curve class.
 *
 * @requires Vertex, Vector
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
 * @modified 2020-02-06 Added the getSubCurveAt(number,number) function.
 * @modified 2020-02-06 Fixed a serious bug in the arc lenght calculation (length was never reset, urgh).
 * @modified 2020-02-07 Added the isInstance(any) function.
 * @modified 2020-02-10 Added the reverse() function.
 * @modified 2020-02-10 Fixed the translate(...) function (returning 'this' was missing).
 * @modified 2020-03-24 Ported this class from vanilla JS to Typescript.
 * @modified 2020-06-03 Added the getBounds() function.
 * @modified 2020-07-14 Changed the moveCurvePoint(...,Vertex) to moveCurvePoint(...,XYCoords), which is more generic.
 * @version 2.4.1
 *
 * @file CubicBezierCurve
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds_1 = __webpack_require__(1);
var Vertex_1 = __webpack_require__(0);
var Vector_1 = __webpack_require__(3);
var CubicBezierCurve = /** @class */ (function () {
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
    function CubicBezierCurve(startPoint, endPoint, startControlPoint, endControlPoint) {
        /** @constant {number} */
        this.START_POINT = CubicBezierCurve.START_POINT;
        /** @constant {number} */
        this.START_CONTROL_POINT = CubicBezierCurve.START_CONTROL_POINT;
        /** @constant {number} */
        this.END_CONTROL_POINT = CubicBezierCurve.END_CONTROL_POINT;
        /** @constant {number} */
        this.END_POINT = CubicBezierCurve.END_POINT;
        this.startPoint = startPoint;
        this.startControlPoint = startControlPoint;
        this.endPoint = endPoint;
        this.endControlPoint = endControlPoint;
        this.curveIntervals = 30;
        // An array of vertices
        this.segmentCache = [];
        // An array of floats
        this.segmentLengths = [];
        // float
        this.arcLength = null;
        this.updateArcLengths();
    }
    ;
    /**
     * Move the given curve point (the start point, end point or one of the two
     * control points).
     *
     * @method moveCurvePoint
     * @param {number} pointID - The numeric identicator of the point to move. Use one of the four eBezierPoint constants.
     * @param {XYCoords} moveAmount - The amount to move the specified point by.
     * @param {boolean} moveControlPoint - Move the control points along with their path point (if specified point is a path point).
     * @param {boolean} updateArcLengths - Specifiy if the internal arc segment buffer should be updated.
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    CubicBezierCurve.prototype.moveCurvePoint = function (pointID, moveAmount, moveControlPoint, updateArcLengths) {
        if (pointID == this.START_POINT) {
            this.getStartPoint().add(moveAmount);
            if (moveControlPoint)
                this.getStartControlPoint().add(moveAmount);
        }
        else if (pointID == this.START_CONTROL_POINT) {
            this.getStartControlPoint().add(moveAmount);
        }
        else if (pointID == this.END_CONTROL_POINT) {
            this.getEndControlPoint().add(moveAmount);
        }
        else if (pointID == this.END_POINT) {
            this.getEndPoint().add(moveAmount);
            if (moveControlPoint)
                this.getEndControlPoint().add(moveAmount);
        }
        else {
            console.log("[CubicBezierCurve.moveCurvePoint] pointID '" + pointID + "' invalid.");
        }
        if (updateArcLengths)
            this.updateArcLengths();
    };
    ;
    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {Vertex} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    CubicBezierCurve.prototype.translate = function (amount) {
        this.startPoint.add(amount);
        this.startControlPoint.add(amount);
        this.endControlPoint.add(amount);
        this.endPoint.add(amount);
        return this;
    };
    ;
    /**
     * Reverse this curve, means swapping start- and end-point and swapping
     * start-control- and end-control-point.
     *
     * @method reverse
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    CubicBezierCurve.prototype.reverse = function () {
        var tmp = this.startPoint;
        this.startPoint = this.endPoint;
        this.endPoint = tmp;
        tmp = this.startControlPoint;
        this.startControlPoint = this.endControlPoint;
        this.endControlPoint = tmp;
        return this;
    };
    ;
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
    CubicBezierCurve.prototype.getLength = function () {
        return this.arcLength;
    };
    ;
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
    CubicBezierCurve.prototype.updateArcLengths = function () {
        var pointA = this.startPoint.clone(), pointB = new Vertex_1.Vertex(0, 0), curveStep = 1.0 / this.curveIntervals;
        var u = curveStep;
        // Clear segment cache
        this.segmentCache = [];
        // Push start point into buffer
        this.segmentCache.push(this.startPoint);
        this.segmentLengths = [];
        var newLength = 0.0;
        var t = 0.0;
        var tmpLength;
        while (t <= 1.0) {
            pointB = this.getPointAt(t);
            // Store point into cache
            this.segmentCache.push(pointB);
            // Calculate segment length
            tmpLength = pointA.distance(pointB);
            this.segmentLengths.push(tmpLength);
            newLength += tmpLength;
            pointA = pointB;
            t += curveStep;
        }
        this.arcLength = newLength;
    };
    ;
    /**
     * Get the bounds of this bezier curve.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @return {Bounds} The bounds of this curve.
     **/
    CubicBezierCurve.prototype.getBounds = function () {
        var min = new Vertex_1.Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        var max = new Vertex_1.Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        var v;
        for (var i = 0; i < this.segmentCache.length; i++) {
            v = this.segmentCache[i];
            min.x = Math.min(min.x, v.x);
            min.y = Math.min(min.y, v.y);
            max.x = Math.max(max.x, v.x);
            max.y = Math.max(max.y, v.y);
        }
        return new Bounds_1.Bounds(min, max);
    };
    ;
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
    CubicBezierCurve.prototype.getStartPoint = function () {
        return this.startPoint;
    };
    ;
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
    CubicBezierCurve.prototype.getEndPoint = function () {
        return this.endPoint;
    };
    ;
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
    CubicBezierCurve.prototype.getStartControlPoint = function () {
        return this.startControlPoint;
    };
    ;
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
    CubicBezierCurve.prototype.getEndControlPoint = function () {
        return this.endControlPoint;
    };
    ;
    /**
     * Get one of the four curve points specified by the passt point ID.
     *
     * @method getEndControlPoint
     * @param {number} id - One of START_POINT, START_CONTROL_POINT, END_CONTROL_POINT or END_POINT.
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    CubicBezierCurve.prototype.getPointByID = function (id) {
        if (id == this.START_POINT)
            return this.startPoint;
        if (id == this.END_POINT)
            return this.endPoint;
        if (id == this.START_CONTROL_POINT)
            return this.startControlPoint;
        if (id == this.END_CONTROL_POINT)
            return this.endControlPoint;
        throw new Error("Invalid point ID '" + id + "'.");
    };
    ;
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
    CubicBezierCurve.prototype.getPointAt = function (t) {
        // Perform some powerful math magic
        var x = this.startPoint.x * Math.pow(1.0 - t, 3) + this.startControlPoint.x * 3 * t * Math.pow(1.0 - t, 2)
            + this.endControlPoint.x * 3 * Math.pow(t, 2) * (1.0 - t) + this.endPoint.x * Math.pow(t, 3);
        var y = this.startPoint.y * Math.pow(1.0 - t, 3) + this.startControlPoint.y * 3 * t * Math.pow(1.0 - t, 2)
            + this.endControlPoint.y * 3 * Math.pow(t, 2) * (1.0 - t) + this.endPoint.y * Math.pow(t, 3);
        return new Vertex_1.Vertex(x, y);
    };
    ;
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
    CubicBezierCurve.prototype.getPoint = function (u) {
        return this.getPointAt(u / this.arcLength);
    };
    ;
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
    CubicBezierCurve.prototype.getTangentAt = function (t) {
        var a = this.getStartPoint();
        var b = this.getStartControlPoint();
        var c = this.getEndControlPoint();
        var d = this.getEndPoint();
        // This is the shortened one
        var t2 = t * t;
        var t3 = t * t2;
        // (1 - t)^2 = (1-t)*(1-t) = 1 - t - t + t^2 = 1 - 2*t + t^2
        var nt2 = 1 - 2 * t + t2;
        var tX = -3 * a.x * nt2 +
            b.x * (3 * nt2 - 6 * (t - t2)) +
            c.x * (6 * (t - t2) - 3 * t2) +
            3 * d.x * t2;
        var tY = -3 * a.y * nt2 +
            b.y * (3 * nt2 - 6 * (t - t2)) +
            c.y * (6 * (t - t2) - 3 * t2) +
            3 * d.y * t2;
        // Note: my implementation does NOT normalize tangent vectors!
        return new Vertex_1.Vertex(tX, tY);
    };
    ;
    /**
     * Get a sub curve at the given start end end offsets (values between 0.0 and 1.0).
     *
     * tStart >= tEnd is allowed, you will get a reversed sub curve then.
     *
     * @method getSubCurveAt
     * @param {number} tStart – The start offset of the desired sub curve (must be in [0..1]).
     * @param {number} tEnd – The end offset if the desired cub curve (must be in [0..1]).
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} The sub curve as a new curve.
     **/
    CubicBezierCurve.prototype.getSubCurveAt = function (tStart, tEnd) {
        var startVec = new Vector_1.Vector(this.getPointAt(tStart), this.getTangentAt(tStart));
        var endVec = new Vector_1.Vector(this.getPointAt(tEnd), this.getTangentAt(tEnd).inv());
        // Tangents are relative. Make absolute.
        startVec.b.add(startVec.a);
        endVec.b.add(endVec.a);
        // This 'splits' the curve at the given point at t.
        startVec.scale(0.33333333 * (tEnd - tStart));
        endVec.scale(0.33333333 * (tEnd - tStart));
        // Draw the bezier curve
        // pb.draw.cubicBezier( startVec.a, endVec.a, startVec.b, endVec.b, '#8800ff', 2 );
        return new CubicBezierCurve(startVec.a, endVec.a, startVec.b, endVec.b);
    };
    ;
    /**
     * Convert a relative curve position u to the absolute curve position t.
     *
     * @method convertU2t
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {number}
     **/
    CubicBezierCurve.prototype.convertU2T = function (u) {
        return Math.max(0.0, Math.min(1.0, (u / this.arcLength)));
    };
    ;
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
    CubicBezierCurve.prototype.getTangent = function (u) {
        return this.getTangentAt(this.convertU2T(u));
    };
    ;
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
    CubicBezierCurve.prototype.getPerpendicular = function (u) {
        return this.getPerpendicularAt(this.convertU2T(u));
    };
    ;
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
    CubicBezierCurve.prototype.getPerpendicularAt = function (t) {
        var tangentVector = this.getTangentAt(t);
        return new Vertex_1.Vertex(tangentVector.y, -tangentVector.x);
    };
    ;
    /**
     * Clone this Bézier curve (deep clone).
     *
     * @method clone
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.prototype.clone = function () {
        return new CubicBezierCurve(this.getStartPoint().clone(), this.getEndPoint().clone(), this.getStartControlPoint().clone(), this.getEndControlPoint().clone());
    };
    ;
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
    CubicBezierCurve.prototype.equals = function (curve) {
        // Note: in the earlier vanilla-JS version this was callable with plain objects.
        //       Let's see if this restricted version works out.
        if (!curve)
            return false;
        if (!curve.startPoint ||
            !curve.endPoint ||
            !curve.startControlPoint ||
            !curve.endControlPoint)
            return false;
        return this.startPoint.equals(curve.startPoint)
            && this.endPoint.equals(curve.endPoint)
            && this.startControlPoint.equals(curve.startControlPoint)
            && this.endControlPoint.equals(curve.endControlPoint);
    };
    ;
    /**
     * Quick check for class instance.
     * Is there a better way?
     *
     * @method isInstance
     * @param {any} obj - Check if the passed object/value is an instance of CubicBezierCurve.
     * @instance
     * @memberof CubicBezierCurve
     * @return {boolean}
     **/
    CubicBezierCurve.isInstance = function (obj) {
        // Note: check this again
        /* OLD VANILLA JS IMPLEMENTATION */
        /* if( typeof obj != "object" )
            return false;
        function hasXY(v) {
            return typeof v != "undefined" && typeof v.x == "number" && typeof v.y == "number";
        }
        return typeof obj.startPoint == "object" && hasXY(obj.startPoint)
            && typeof obj.endPoint == "object" && hasXY(obj.endPoint)
            && typeof obj.startControlPoint == "object" && hasXY(obj.startControlPoint)
            && typeof obj.endControlPoint == "object" && hasXY(obj.endControlPoint);
        */
        return obj instanceof CubicBezierCurve;
    };
    ;
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
    CubicBezierCurve.prototype.toSVGPathData = function () {
        var buffer = [];
        buffer.push('M ');
        buffer.push(this.startPoint.x.toString());
        buffer.push(' ');
        buffer.push(this.startPoint.y.toString());
        buffer.push(' C ');
        buffer.push(this.startControlPoint.x.toString());
        buffer.push(' ');
        buffer.push(this.startControlPoint.y.toString());
        buffer.push(' ');
        buffer.push(this.endControlPoint.x.toString());
        buffer.push(' ');
        buffer.push(this.endControlPoint.y.toString());
        buffer.push(' ');
        buffer.push(this.endPoint.x.toString());
        buffer.push(' ');
        buffer.push(this.endPoint.y.toString());
        return buffer.join('');
    };
    ;
    /**
     * Convert this curve to a JSON string.
     *
     * @method toJSON
     * @param {boolean=} [prettyFormat=false] - If set to true the function will add line breaks.
     * @instance
     * @memberof CubicBezierCurve
     * @return {string} The JSON data.
     **/
    CubicBezierCurve.prototype.toJSON = function (prettyFormat) {
        var jsonString = "{ " + // begin object
            (prettyFormat ? "\n\t" : "") +
            "\"startPoint\" : [" + this.getStartPoint().x + "," + this.getStartPoint().y + "], " +
            (prettyFormat ? "\n\t" : "") +
            "\"endPoint\" : [" + this.getEndPoint().x + "," + this.getEndPoint().y + "], " +
            (prettyFormat ? "\n\t" : "") +
            "\"startControlPoint\": [" + this.getStartControlPoint().x + "," + this.getStartControlPoint().y + "], " +
            (prettyFormat ? "\n\t" : "") +
            "\"endControlPoint\" : [" + this.getEndControlPoint().x + "," + this.getEndControlPoint().y + "]" +
            (prettyFormat ? "\n\t" : "") +
            " }"; // end object
        return jsonString;
    };
    ;
    /**
     * Parse a Bézier curve from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The JSON data to parse.
     * @memberof CubicBezierCurve
     * @static
     * @throws An exception if the JSON string is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromJSON = function (jsonString) {
        var obj = JSON.parse(jsonString);
        return CubicBezierCurve.fromObject(obj);
    };
    ;
    /**
     * Try to convert the passed object to a CubicBezierCurve.
     *
     * @method fromObject
     * @param {object} obj - The object to convert.
     * @memberof CubicBezierCurve
     * @static
     * @throws An exception if the passed object is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromObject = function (obj) {
        if (typeof obj !== "object")
            throw "Can only build from object.";
        if (!obj.startPoint)
            throw "Object member \"startPoint\" missing.";
        if (!obj.endPoint)
            throw "Object member \"endPoint\" missing.";
        if (!obj.startControlPoint)
            throw "Object member \"startControlPoint\" missing.";
        if (!obj.endControlPoint)
            throw "Object member \"endControlPoint\" missing.";
        return new CubicBezierCurve(new Vertex_1.Vertex(obj.startPoint[0], obj.startPoint[1]), new Vertex_1.Vertex(obj.endPoint[0], obj.endPoint[1]), new Vertex_1.Vertex(obj.startControlPoint[0], obj.startControlPoint[1]), new Vertex_1.Vertex(obj.endControlPoint[0], obj.endControlPoint[1]));
    };
    ;
    /**
     * Convert a 4-element array of vertices to a cubic bézier curve.
     *
     * @method fromArray
     * @param {Vertex[]} arr -  [ startVertex, endVertex, startControlVertex, endControlVertex ]
     * @memberof CubicBezierCurve
     * @throws An exception if the passed array is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromArray = function (arr) {
        if (!Array.isArray(arr))
            throw "Can only build from object.";
        if (arr.length != 4)
            throw "Can only build from array with four elements.";
        return new CubicBezierCurve(arr[0], arr[1], arr[2], arr[3]);
    };
    ;
    /** @constant {number} */
    CubicBezierCurve.START_POINT = 0;
    /** @constant {number} */
    CubicBezierCurve.START_CONTROL_POINT = 1;
    /** @constant {number} */
    CubicBezierCurve.END_CONTROL_POINT = 2;
    /** @constant {number} */
    CubicBezierCurve.END_POINT = 3;
    return CubicBezierCurve;
}());
exports.CubicBezierCurve = CubicBezierCurve;
//# sourceMappingURL=CubicBezierCurve.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc A refactored BezierPath class.
 *
 * @require Bounds, Vertex, CubicBezierCurve, XYCoords, SVGSerializable
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
 * @modified 2020-02-06 Added function locateCurveByEndPoint( Vertex ).
 * @modified 2020-02-11 Added 'return this' to the scale(Vertex,number) and to the translate(Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-06-03 Made the private helper function _locateUIndex to a private function.
 * @modified 2020-06-03 Added the getBounds() function.
 * @modified 2020-07-14 Changed the moveCurvePoint(...,Vertex) to moveCurvePoint(...,XYCoords).
 * @version 2.2.1
 *
 * @file BezierPath
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds_1 = __webpack_require__(1);
var CubicBezierCurve_1 = __webpack_require__(5);
var Vertex_1 = __webpack_require__(0);
var BezierPath = /** @class */ (function () {
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
    function BezierPath(pathPoints) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "BezierPath";
        /** @constant {number} */
        this.START_POINT = 0;
        /** @constant {number} */
        this.START_CONTROL_POINT = 1;
        /** @constant {number} */
        this.END_CONTROL_POINT = 2;
        /** @constant {number} */
        this.END_POINT = 3;
        if (!pathPoints)
            pathPoints = [];
        this.totalArcLength = 0.0;
        // Set this flag to true if you want the first point and
        // last point of the path to be auto adjusted, too.
        this.adjustCircular = false;
        this.bezierCurves = [];
        //console.error( "THIS CONSTRUCTOR IS DEPRECATED. USE .fromArray INSTEAD." );
        //throw Error("THIS CONSTRUCTOR IS DEPRECATED. USE .fromArray INSTEAD.");
        /*
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
        */
    }
    ;
    /**
     * Add a cubic bezier curve to the end of this path.
     *
     * @method addCurve
     * @param {CubicBezierCurve} curve - The curve to be added to the end of the path.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.addCurve = function (curve) {
        if (curve == null || typeof curve == 'undefined')
            throw "Cannot add null curve to bézier path.";
        this.bezierCurves.push(curve);
        if (this.bezierCurves.length > 1) {
            curve.startPoint = this.bezierCurves[this.bezierCurves.length - 2].endPoint;
            this.adjustSuccessorControlPoint(this.bezierCurves.length - 2, // curveIndex,
            true, // obtainHandleLength,  
            true // updateArcLengths  
            );
        }
        else {
            this.totalArcLength += curve.getLength();
        }
    };
    ;
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartPoint
     * @param {Vertex} point - The (curve start-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (start-) point not found
     **/
    BezierPath.prototype.locateCurveByStartPoint = function (point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].startPoint.equals(point))
                return i;
        }
        return -1;
    };
    ;
    /**
     * Locate the curve with the given end point (function returns the index).
     *
     * @method locateCurveByEndPoint
     * @param {Vertex} point - The (curve end-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    BezierPath.prototype.locateCurveByEndPoint = function (point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].endPoint.equals(point))
                return i;
        }
        return -1;
    };
    ;
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartControlPoint
     * @param {Vertex} point - The (curve endt-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    BezierPath.prototype.locateCurveByStartControlPoint = function (point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].startControlPoint.equals(point))
                return i;
        }
        return -1;
    };
    ;
    // +---------------------------------------------------------------------------------
    // | Locate the curve with the given end control point.
    // |
    // | @param point:Vertex The point to look for.
    // | @return Number The index or -1 if not found.
    // +-------------------------------
    BezierPath.prototype.locateCurveByEndControlPoint = function (point) {
        // for( var i in this.bezierCurves ) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (this.bezierCurves[i].endControlPoint.equals(point))
                return i;
        }
        return -1;
    };
    ;
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
    BezierPath.prototype.getLength = function () {
        return this.totalArcLength;
    };
    ;
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
    BezierPath.prototype.updateArcLengths = function () {
        this.totalArcLength = 0.0;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            this.bezierCurves[i].updateArcLengths();
            this.totalArcLength += this.bezierCurves[i].getLength();
        }
    };
    ;
    /**
     * Get the number of curves in this path.
     *
     * @method getCurveCount
     * @instance
     * @memberof BezierPath
     * @return {number} The number of curves in this path.
     **/
    BezierPath.prototype.getCurveCount = function () {
        return this.bezierCurves.length;
    };
    ;
    /**
     * Get the cubic bezier curve at the given index.
     *
     * @method getCurveAt
     * @param {number} index - The curve index from 0 to getCurveCount()-1.
     * @instance
     * @memberof BezierPath
     * @return {CubicBezierCurve} The curve at the specified index.
     **/
    BezierPath.prototype.getCurveAt = function (curveIndex) {
        return this.bezierCurves[curveIndex];
    };
    ;
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
     * @return {BezierPath} this for chaining
     **/
    BezierPath.prototype.translate = function (amount) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            curve.getStartPoint().add(amount);
            curve.getStartControlPoint().add(amount);
            curve.getEndControlPoint().add(amount);
        }
        // Don't forget to translate the last curve's last point
        var curve = this.bezierCurves[this.bezierCurves.length - 1];
        curve.getEndPoint().add(amount);
        this.updateArcLengths();
        return this;
    };
    ;
    /**
     * Scale the whole bezier path by the given (x,y)-factors.
     *
     * @method scale
     * @param {Vertex} anchor - The scale origin to scale from.
     * @param {number} amount - The scalar to be multiplied with.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining.
     **/
    BezierPath.prototype.scale = function (anchor, scaling) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            curve.getStartPoint().scale(scaling, anchor);
            curve.getStartControlPoint().scale(scaling, anchor);
            curve.getEndControlPoint().scale(scaling, anchor);
            // Do NOT scale the end point here!
            // Don't forget that the curves are connected and on curve's end point
            // the the successor's start point (same instance)!
        }
        // Finally move the last end point (was not scaled yet)
        if (this.bezierCurves.length > 0 && !this.adjustCircular) {
            this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().scale(scaling, anchor);
        }
        this.updateArcLengths();
        return this;
    };
    ;
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
    BezierPath.prototype.rotate = function (angle, center) {
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            curve.getStartPoint().rotate(angle, center);
            curve.getStartControlPoint().rotate(angle, center);
            curve.getEndControlPoint().rotate(angle, center);
            // Do NOT rotate the end point here!
            // Don't forget that the curves are connected and on curve's end point
            // the the successor's start point (same instance)!
        }
        // Finally move the last end point (was not scaled yet)
        if (this.bezierCurves.length > 0 && !this.adjustCircular) {
            this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().rotate(angle, center);
        }
    };
    ;
    /**
     * Get the point on the bézier path at the given relative path location.
     *
     * @method getPoint
     * @param {number} u - The relative path position: <pre>0 <= u <= this.getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the relative path position.
     **/
    BezierPath.prototype.getPoint = function (u) {
        if (u < 0 || u > this.totalArcLength) {
            console.log("[BezierPath.getPoint(u)] u is out of bounds: " + u + ".");
            return null;
        }
        // Find the spline to extract the value from
        var i = 0;
        var uTemp = 0.0;
        while (i < this.bezierCurves.length &&
            (uTemp + this.bezierCurves[i].getLength()) < u) {
            uTemp += this.bezierCurves[i].getLength();
            i++;
        }
        // if u == arcLength
        //   -> i is max
        if (i >= this.bezierCurves.length)
            return this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().clone();
        var bCurve = this.bezierCurves[i];
        var relativeU = u - uTemp;
        return bCurve.getPoint(relativeU);
    };
    ;
    /**
     * Get the point on the bézier path at the given path fraction.
     *
     * @method getPointAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the absolute path position.
     **/
    BezierPath.prototype.getPointAt = function (t) {
        return this.getPoint(t * this.totalArcLength);
    };
    ;
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
    BezierPath.prototype.getTangentAt = function (t) {
        return this.getTangent(t * this.totalArcLength);
    };
    ;
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
    BezierPath.prototype.getTangent = function (u) {
        if (u < 0 || u > this.totalArcLength) {
            console.warn("[BezierPath.getTangent(u)] u is out of bounds: " + u + ".");
            return null;
        }
        // Find the spline to extract the value from
        var i = 0;
        var uTemp = 0.0;
        while (i < this.bezierCurves.length &&
            (uTemp + this.bezierCurves[i].getLength()) < u) {
            uTemp += this.bezierCurves[i].getLength();
            i++;
        }
        var bCurve = this.bezierCurves[i];
        var relativeU = u - uTemp;
        return bCurve.getTangent(relativeU);
    };
    ;
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
    BezierPath.prototype.getPerpendicularAt = function (t) {
        return this.getPerpendicular(t * this.totalArcLength);
    };
    ;
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
    BezierPath.prototype.getPerpendicular = function (u) {
        if (u < 0 || u > this.totalArcLength) {
            console.log("[BezierPath.getPerpendicular(u)] u is out of bounds: " + u + ".");
            return null;
        }
        // Find the spline to extract the value from
        var i = 0;
        var uTemp = 0.0;
        var uResult = BezierPath._locateUIndex(this, u);
        var bCurve = this.bezierCurves[uResult.i];
        var relativeU = u - uResult.uPart;
        return bCurve.getPerpendicular(relativeU);
    };
    ;
    /**
     * This is a helper function to locate the curve index for a given
     * absolute path position u.
     *
     * I decided to put this into privat scope as it is really specific. Maybe
     * put this into a utils wrapper.
     *
     * Returns:
     * - {number} i - the index of the containing curve.
     * - {number} uPart - the absolute curve length sum (length from the beginning to u, should equal u itself).
     * - {number} uBefore - the absolute curve length for all segments _before_ the matched curve (usually uBefore <= uPart).
     **/
    BezierPath._locateUIndex = function (path, u) {
        var i = 0;
        var uTemp = 0.0;
        var uBefore = 0.0;
        while (i < path.bezierCurves.length &&
            (uTemp + path.bezierCurves[i].getLength()) < u) {
            uTemp += path.bezierCurves[i].getLength();
            if (i + 1 < path.bezierCurves.length)
                uBefore += path.bezierCurves[i].getLength();
            i++;
        }
        return { i: i, uPart: uTemp, uBefore: uBefore };
    };
    ;
    /**
     * Get a specific sub path from this path. The start and end position are specified by
     * ratio number in [0..1].
     *
     * 0.0 is at the beginning of the path.
     * 1.0 is at the end of the path.
     *
     * Values below 0 or beyond 1 are cropped down to the [0..1] interval.
     *
     * startT > endT is allowed, the returned sub path will have inverse direction then.
     *
     * @method getSubPathAt
     * @param {number} startT - The start position of the sub path.
     * @param {number} endT - The end position of the sub path.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The desired sub path in the bounds [startT..endT].
     **/
    BezierPath.prototype.getSubPathAt = function (startT, endT) {
        startT = Math.max(0, startT);
        endT = Math.min(1.0, endT);
        var startU = startT * this.totalArcLength;
        var endU = endT * this.totalArcLength;
        var uStartResult = BezierPath._locateUIndex(this, startU); // { i:int, uPart:float, uBefore:float }
        var uEndResult = BezierPath._locateUIndex(this, endU); // { i:int, uPart:float, uBefore:float }
        var firstT = (startU - uStartResult.uBefore) / this.bezierCurves[uStartResult.i].getLength();
        if (uStartResult.i == uEndResult.i) {
            // Subpath begins and ends in the same path segment (just get a simple sub curve from that path element).
            var lastT = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
            var firstCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, lastT);
            return BezierPath.fromArray([firstCurve]);
        }
        else {
            var curves = [];
            if (uStartResult.i > uEndResult.i) {
                // Back to front direction
                var firstCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 0.0);
                curves.push(firstCurve);
                for (var i = uStartResult.i - 1; i > uEndResult.i; i--) {
                    curves.push(this.bezierCurves[i].clone().reverse());
                }
                var lastT = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
                curves.push(this.bezierCurves[uEndResult.i].getSubCurveAt(1.0, lastT));
            }
            else {
                // Front to back direction
                var firstCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 1.0);
                curves.push(firstCurve);
                for (var i = uStartResult.i + 1; i < uEndResult.i && i < this.bezierCurves.length; i++) {
                    curves.push(this.bezierCurves[i].clone());
                }
                var lastT = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
                curves.push(this.bezierCurves[uEndResult.i].getSubCurveAt(0, lastT));
            }
            return BezierPath.fromArray(curves);
        }
    };
    ;
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
     * @param {XYCoords} moveAmount - The amount to move the addressed vertex by.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    BezierPath.prototype.moveCurvePoint = function (curveIndex, pointID, moveAmount) {
        var bCurve = this.getCurveAt(curveIndex);
        bCurve.moveCurvePoint(pointID, moveAmount, true, // move control point, too
        true // updateArcLengths
        );
        // If inner point and NOT control point
        //  --> move neightbour
        if (pointID == this.START_POINT && (curveIndex > 0 || this.adjustCircular)) {
            // Set predecessor's control point!
            var predecessor = this.getCurveAt(curveIndex - 1 < 0 ? this.bezierCurves.length + (curveIndex - 1) : curveIndex - 1);
            predecessor.moveCurvePoint(this.END_CONTROL_POINT, moveAmount, true, // move control point, too
            false // updateArcLengths
            );
        }
        else if (pointID == this.END_POINT && (curveIndex + 1 < this.bezierCurves.length || this.adjustCircular)) {
            // Set successcor
            var successor = this.getCurveAt((curveIndex + 1) % this.bezierCurves.length);
            successor.moveCurvePoint(this.START_CONTROL_POINT, moveAmount, true, // move control point, too
            false // updateArcLengths
            );
        }
        else if (pointID == this.START_CONTROL_POINT && curveIndex > 0) {
            this.adjustPredecessorControlPoint(curveIndex, true, // obtain handle length?
            false // update arc lengths
            );
        }
        else if (pointID == this.END_CONTROL_POINT && curveIndex + 1 < this.getCurveCount()) {
            this.adjustSuccessorControlPoint(curveIndex, true, // obtain handle length?
            false // update arc lengths
            );
        }
        // Don't forget to update the arc lengths!
        // Note: this can be optimized as only two curves have changed their lengths!
        this.updateArcLengths();
    };
    ;
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
    BezierPath.prototype.adjustPredecessorControlPoint = function (curveIndex, obtainHandleLength, updateArcLengths) {
        if (!this.adjustCircular && curveIndex <= 0)
            return; // false;
        var mainCurve = this.getCurveAt(curveIndex);
        var neighbourCurve = this.getCurveAt(curveIndex - 1 < 0 ? this.getCurveCount() + (curveIndex - 1) : curveIndex - 1);
        BezierPath.adjustNeighbourControlPoint(mainCurve, neighbourCurve, mainCurve.getStartPoint(), // the reference point
        mainCurve.getStartControlPoint(), // the dragged control point
        neighbourCurve.getEndPoint(), // the neighbour's point
        neighbourCurve.getEndControlPoint(), // the neighbour's control point to adjust
        obtainHandleLength, updateArcLengths);
    };
    ;
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
    BezierPath.prototype.adjustSuccessorControlPoint = function (curveIndex, obtainHandleLength, updateArcLengths) {
        if (!this.adjustCircular && curveIndex + 1 > this.getCurveCount())
            return; //  false; 
        var mainCurve = this.getCurveAt(curveIndex);
        var neighbourCurve = this.getCurveAt((curveIndex + 1) % this.getCurveCount());
        /* return */ BezierPath.adjustNeighbourControlPoint(mainCurve, neighbourCurve, mainCurve.getEndPoint(), // the reference point
        mainCurve.getEndControlPoint(), // the dragged control point
        neighbourCurve.getStartPoint(), // the neighbour's point
        neighbourCurve.getStartControlPoint(), // the neighbour's control point to adjust
        obtainHandleLength, updateArcLengths);
    };
    ;
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
    BezierPath.adjustNeighbourControlPoint = function (mainCurve, neighbourCurve, mainPoint, mainControlPoint, neighbourPoint, neighbourControlPoint, obtainHandleLengths, updateArcLengths) {
        // Calculate start handle length
        var mainHandleBounds = new Vertex_1.Vertex(mainControlPoint.x - mainPoint.x, mainControlPoint.y - mainPoint.y);
        var neighbourHandleBounds = new Vertex_1.Vertex(neighbourControlPoint.x - neighbourPoint.x, neighbourControlPoint.y - neighbourPoint.y);
        var mainHandleLength = Math.sqrt(Math.pow(mainHandleBounds.x, 2) + Math.pow(mainHandleBounds.y, 2));
        var neighbourHandleLength = Math.sqrt(Math.pow(neighbourHandleBounds.x, 2) + Math.pow(neighbourHandleBounds.y, 2));
        if (mainHandleLength <= 0.1)
            return; // no secure length available for division? What about zoom? Use EPSILON?	
        // Just invert the main handle (keep length or not?
        if (obtainHandleLengths) {
            neighbourControlPoint.set(neighbourPoint.x - mainHandleBounds.x * (neighbourHandleLength / mainHandleLength), neighbourPoint.y - mainHandleBounds.y * (neighbourHandleLength / mainHandleLength));
        }
        else {
            neighbourControlPoint.set(neighbourPoint.x - mainHandleBounds.x, neighbourPoint.y - mainHandleBounds.y);
        }
        neighbourCurve.updateArcLengths();
    };
    ;
    /**
     * Get the bounds of this Bézier path.
     *
     * Note the the curves' underlyung segment buffers are used to determine the bounds. The more
     * elements the segment buffers have, the more precise the returned bounds will be.
     *
     * @return {Bounds} The bounds of this Bézier path.
     **/
    BezierPath.prototype.getBounds = function () {
        var min = new Vertex_1.Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        var max = new Vertex_1.Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        var b;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            b = this.bezierCurves[i].getBounds();
            min.x = Math.min(min.x, b.min.x);
            min.y = Math.min(min.y, b.min.y);
            max.x = Math.max(max.x, b.max.x);
            max.y = Math.max(max.y, b.max.y);
        }
        return new Bounds_1.Bounds(min, max);
    };
    ;
    /**
     * Clone this BezierPath (deep clone).
     *
     * @method clone
     * @instance
     * @memberof BezierPath
     * @return {BezierPath}
     **/
    BezierPath.prototype.clone = function () {
        var path = new BezierPath(null);
        for (var i = 0; i < this.bezierCurves.length; i++) {
            path.bezierCurves.push(this.bezierCurves[i].clone());
            // Connect splines
            if (i > 0)
                path.bezierCurves[i - 1].endPoint = path.bezierCurves[i].startPoint;
        }
        path.updateArcLengths();
        path.adjustCircular = this.adjustCircular;
        return path;
    };
    ;
    /**
     * Compare this and the passed Bézier path.
     *
     * @method equals
     * @param {BezierPath} path - The pass to compare with.
     * @instance
     * @memberof BezierPath
     * @return {boolean}
     **/
    BezierPath.prototype.equals = function (path) {
        if (!path)
            return false;
        // Check if path contains the credentials
        if (!path.bezierCurves)
            return false;
        if (typeof path.bezierCurves.length == "undefined")
            return false;
        if (path.bezierCurves.length != this.bezierCurves.length)
            return false;
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (!this.bezierCurves[i].equals(path.bezierCurves[i]))
                return false;
        }
        return true;
    };
    ;
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
    BezierPath.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<path');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' d="');
        for (var c = 0; c < this.bezierCurves.length; c++) {
            if (c > 0)
                buffer.push(' ');
            buffer.push(this.bezierCurves[c].toSVGPathData());
        }
        buffer.push('" />');
        return buffer.join('');
    };
    ;
    /**
     * Create a JSON string representation of this bézier curve.
     *
     * @method toJSON
     * @param {boolean} prettyFormat - If true then the function will add line breaks.
     * @instance
     * @memberof BezierPath
     * @return {string} The JSON string.
     **/
    BezierPath.prototype.toJSON = function (prettyFormat) {
        var buffer = [];
        buffer.push("["); // array begin
        for (var i = 0; i < this.bezierCurves.length; i++) {
            if (i > 0)
                buffer.push(",");
            if (prettyFormat)
                buffer.push("\n\t");
            else
                buffer.push(" ");
            buffer.push(this.bezierCurves[i].toJSON(prettyFormat));
        }
        if (this.bezierCurves.length != 0)
            buffer.push(" ");
        buffer.push("]"); // array end
        return buffer.join(""); // Convert to string, with empty separator.
    };
    ;
    /**
     * Parse a BezierPath from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The string with the JSON data.
     * @throw An error if the string is not JSON or does not contain a bezier path object.
     * @static
     * @memberof BezierPath
     * @return {BezierPath} The parsed bezier path instance.
     **/
    BezierPath.fromJSON = function (jsonString) {
        var obj = JSON.parse(jsonString);
        return BezierPath.fromArray(obj);
    };
    ;
    /**
     * Create a BezierPath instance from the given array.
     *
     * @method fromArray
     * @param {Vertex[][]} arr - A two-dimensional array containing the bezier path vertices.
     * @throw An error if the array does not contain proper bezier path data.
     * @static
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the array data.
     **/
    BezierPath.fromArray = function (obj) {
        if (!Array.isArray(obj))
            throw "[BezierPath.fromArray] Passed object must be an array.";
        var arr = obj; // FORCE?
        if (arr.length < 1)
            throw "[BezierPath.fromArray] Passed array must contain at least one bezier curve (has " + arr.length + ").";
        // Create an empty bezier path
        var bPath = new BezierPath(null);
        var lastCurve = null;
        for (var i = 0; i < arr.length; i++) {
            // Convert object (or array?) to bezier curve
            var bCurve = null;
            if (CubicBezierCurve_1.CubicBezierCurve.isInstance(arr[i])) {
                bCurve = arr[i].clone();
            }
            else if (0 in arr[i] && 1 in arr[i] && 2 in arr[i] && 3 in arr[i]) {
                if (!arr[i][0] || !arr[i][1] || !arr[i][2] || !arr[i][3])
                    throw "Cannot convert path data to BezierPath instance. At least one element is undefined (index=" + i + "): " + arr[i];
                bCurve = CubicBezierCurve_1.CubicBezierCurve.fromArray(arr[i]);
            }
            else {
                bCurve = CubicBezierCurve_1.CubicBezierCurve.fromObject(arr[i]);
            }
            // Set curve start point?
            // (avoid duplicate point instances!)
            if (lastCurve)
                bCurve.startPoint = lastCurve.endPoint;
            // Add to path's internal list
            bPath.bezierCurves.push(bCurve);
            // bPath.totalArcLength += bCurve.getLength(); 	    
            lastCurve = bCurve;
        }
        bPath.updateArcLengths();
        // Bezier segments added. Done
        return bPath;
    };
    ;
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
    BezierPath.prototype.toReducedListRepresentation = function (digits) {
        if (typeof digits == "undefined")
            digits = 1;
        var buffer = [];
        buffer.push("["); // array begin
        for (var i = 0; i < this.bezierCurves.length; i++) {
            var curve = this.bezierCurves[i];
            buffer.push(curve.getStartPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getStartPoint().y.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getStartControlPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getStartControlPoint().y.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getEndControlPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getEndControlPoint().y.toFixed(digits));
            buffer.push(",");
        }
        if (this.bezierCurves.length != 0) {
            var curve = this.bezierCurves[this.bezierCurves.length - 1];
            buffer.push(curve.getEndPoint().x.toFixed(digits));
            buffer.push(",");
            buffer.push(curve.getEndPoint().y.toFixed(digits));
        }
        buffer.push("]"); // array end
        return buffer.join(""); // Convert to string, with empty separator.
    };
    ;
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
    BezierPath.fromReducedListRepresentation = function (listJSON) {
        // Parse the array
        var pointArray = JSON.parse(listJSON);
        if (!pointArray.length) {
            console.log("Cannot parse bezier path from non-array object nor from empty point list.");
            throw "Cannot parse bezier path from non-array object nor from empty point list.";
        }
        if (pointArray.length < 8) {
            console.log("Cannot build bezier path. The passed array must contain at least 8 elements (numbers).");
            throw "Cannot build bezier path. The passed array must contain at least 8 elements (numbers).";
        }
        // Convert to object
        var bezierPath = new BezierPath(null); // No points yet
        var startPoint = null;
        var startControlPoint = null;
        var endControlPoint = null;
        var endPoint = null;
        var i = 0;
        do {
            if (i == 0)
                startPoint = new Vertex_1.Vertex(pointArray[i], pointArray[i + 1]);
            startControlPoint = new Vertex_1.Vertex(pointArray[i + 2], pointArray[i + 3]);
            endControlPoint = new Vertex_1.Vertex(pointArray[i + 4], pointArray[i + 5]);
            endPoint = new Vertex_1.Vertex(pointArray[i + 6], pointArray[i + 7]);
            var bCurve = new CubicBezierCurve_1.CubicBezierCurve(startPoint, endPoint, startControlPoint, endControlPoint);
            bezierPath.bezierCurves.push(bCurve);
            startPoint = endPoint;
            i += 6;
        } while (i + 2 < pointArray.length);
        bezierPath.updateArcLengths();
        return bezierPath;
    };
    ;
    // +---------------------------------------------------------------------------------
    // | These constants equal the values from CubicBezierCurve.
    // +-------------------------------
    /** @constant {number} */
    BezierPath.START_POINT = 0;
    /** @constant {number} */
    BezierPath.START_CONTROL_POINT = 1;
    /** @constant {number} */
    BezierPath.END_CONTROL_POINT = 2;
    /** @constant {number} */
    BezierPath.END_POINT = 3;
    return BezierPath;
}());
exports.BezierPath = BezierPath;
//# sourceMappingURL=BezierPath.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
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
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @version 1.1.1
 *
 * @file Polygon
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var BezierPath_1 = __webpack_require__(6);
var Vertex_1 = __webpack_require__(0);
var Polygon = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Polygon
     * @param {Vertex[]} vertices - An array of 2d vertices that shape the polygon.
     * @param {boolean} isOpen - Indicates if the polygon should be rendered as an open or closed shape.
     **/
    function Polygon(vertices, isOpen) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Polygon";
        if (typeof vertices == 'undefined')
            vertices = [];
        this.vertices = vertices;
        this.isOpen = isOpen;
    }
    ;
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
    Polygon.prototype.containsVert = function (vert) {
        //    // ray-casting algorithm based on
        //    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var inside = false;
        for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            var xi = this.vertices[i].x, yi = this.vertices[i].y;
            var xj = this.vertices[j].x, yj = this.vertices[j].y;
            var intersect = ((yi > vert.y) != (yj > vert.y))
                && (vert.x < (xj - xi) * (vert.y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    };
    ;
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
    Polygon.prototype.scale = function (factor, center) {
        for (var i in this.vertices) {
            if (typeof this.vertices[i].scale == 'function')
                this.vertices[i].scale(factor, center);
            else
                console.log('There seems to be a null vertex!', this.vertices[i]);
        }
        return this;
    };
    ;
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
    Polygon.prototype.rotate = function (angle, center) {
        for (var i in this.vertices) {
            this.vertices[i].rotate(angle, center);
        }
        return this;
    };
    ;
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
    Polygon.prototype.toQuadraticBezierData = function () {
        if (this.vertices.length < 3)
            return [];
        var qbezier = [];
        var cc0 = this.vertices[0];
        var cc1 = this.vertices[1];
        var edgeCenter = new Vertex_1.Vertex(cc0.x + (cc1.x - cc0.x) / 2, cc0.y + (cc1.y - cc0.y) / 2);
        qbezier.push(edgeCenter);
        var limit = this.isOpen ? this.vertices.length : this.vertices.length + 1;
        for (var t = 1; t < limit; t++) {
            cc0 = this.vertices[t % this.vertices.length];
            cc1 = this.vertices[(t + 1) % this.vertices.length];
            var edgeCenter = new Vertex_1.Vertex(cc0.x + (cc1.x - cc0.x) / 2, cc0.y + (cc1.y - cc0.y) / 2);
            qbezier.push(cc0);
            qbezier.push(edgeCenter);
            cc0 = cc1;
        }
        return qbezier;
    };
    ;
    /**
     * Convert this polygon to a quadratic bezier curve, represented as an SVG data string.
     *
     * @method toQuadraticBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toQuadraticBezierSVGString = function () {
        var qdata = this.toQuadraticBezierData();
        if (qdata.length == 0)
            return "";
        var buffer = ['M ' + qdata[0].x + ' ' + qdata[0].y];
        for (var i = 1; i < qdata.length; i += 2) {
            buffer.push('Q ' + qdata[i].x + ' ' + qdata[i].y + ', ' + qdata[i + 1].x + ' ' + qdata[i + 1].y);
        }
        return buffer.join(' ');
    };
    ;
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
    Polygon.prototype.toCubicBezierData = function (threshold) {
        if (typeof threshold == 'undefined')
            threshold = 1.0;
        if (this.vertices.length < 3)
            return [];
        var cbezier = [];
        var a = this.vertices[0];
        var b = this.vertices[1];
        var edgeCenter = new Vertex_1.Vertex(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2);
        cbezier.push(edgeCenter);
        var limit = this.isOpen ? this.vertices.length - 1 : this.vertices.length;
        for (var t = 0; t < limit; t++) {
            var a = this.vertices[t % this.vertices.length];
            var b = this.vertices[(t + 1) % this.vertices.length];
            var c = this.vertices[(t + 2) % this.vertices.length];
            var aCenter = new Vertex_1.Vertex(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2);
            var bCenter = new Vertex_1.Vertex(b.x + (c.x - b.x) / 2, b.y + (c.y - b.y) / 2);
            var a2 = new Vertex_1.Vertex(aCenter.x + (b.x - aCenter.x) * threshold, aCenter.y + (b.y - aCenter.y) * threshold);
            var b0 = new Vertex_1.Vertex(bCenter.x + (b.x - bCenter.x) * threshold, bCenter.y + (b.y - bCenter.y) * threshold);
            cbezier.push(a2);
            cbezier.push(b0);
            cbezier.push(bCenter);
        }
        return cbezier;
    };
    ;
    /**
     * Convert this polygon to a cubic bezier curve, represented as an SVG data string.
     *
     * @method toCubicBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toCubicBezierSVGString = function (threshold) {
        var qdata = this.toCubicBezierData(threshold);
        if (qdata.length == 0)
            return "";
        var buffer = ['M ' + qdata[0].x + ' ' + qdata[0].y];
        for (var i = 1; i < qdata.length; i += 3) {
            buffer.push('C ' + qdata[i].x + ' ' + qdata[i].y + ', ' + qdata[i + 1].x + ' ' + qdata[i + 1].y + ', ' + qdata[i + 2].x + ' ' + qdata[i + 2].y);
        }
        return buffer.join(' ');
    };
    ;
    /**
     * Convert this polygon to a cubic bezier path instance.
     *
     * @method toCubicBezierPath
     * @param {number} threshold - The threshold, usually from 0.0 to 1.0.
     * @return {BezierPath}      - A bezier path instance.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toCubicBezierPath = function (threshold) {
        var qdata = this.toCubicBezierData(threshold);
        // Conver the linear path vertices to a two-dimensional path array
        var pathdata = [];
        for (var i = 0; i + 3 < qdata.length; i += 3) {
            pathdata.push([qdata[i], qdata[i + 3], qdata[i + 1], qdata[i + 2]]);
        }
        return BezierPath_1.BezierPath.fromArray(pathdata);
    };
    ;
    /**
     * Create an SVG representation of this polygon.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} The SVG string.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<path');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' d="');
        if (this.vertices.length > 0) {
            buffer.push('M ');
            buffer.push(this.vertices[0].x.toString());
            buffer.push(' ');
            buffer.push(this.vertices[0].y.toString());
            for (var i = 1; i < this.vertices.length; i++) {
                buffer.push(' L ');
                buffer.push(this.vertices[i].x.toString());
                buffer.push(' ');
                buffer.push(this.vertices[i].y.toString());
            }
            if (!this.isOpen) {
                buffer.push(' Z');
            }
        }
        buffer.push('" />');
        return buffer.join('');
    };
    ;
    return Polygon;
}());
exports.Polygon = Polygon;
//# sourceMappingURL=Polygon.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc A triangle class for triangulations.
 *
 * The class was written for a Delaunay trinagulation demo so it might
 * contain some strange and unexpected functions.
 *
 * @requires Vertex, Polygon, SVGSerializale
 *
 *
 * @author    Ikaros Kappler
 * @date_init 2012-10-17 (Wrote a first version of this in that year).
 * @date      2018-04-03 (Refactored the code into a new class).
 * @modified  2018-04-28 Added some documentation.
 * @modified  2019-09-11 Added the scaleToCentroid(Number) function (used by the walking triangle demo).
 * @modified  2019-09-12 Added beautiful JSDoc compliable comments.
 * @modified  2019-11-07 Added to toSVG(options) function to make Triangles renderable as SVG.
 * @modified  2019-12-09 Fixed the determinant() function. The calculation was just wrong.
 * @modified  2020-03-16 (Corona times) Added the 'fromArray' function.
 * @modified  2020-03-17 Added the Triangle.toPolygon() function.
 * @modified  2020-03-17 Added proper JSDoc comments.
 * @modified  2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified  2020-05-09 Added the new Circle class (ported to Typescript from the demos).
 * @modified  2020-05-12 Added getIncircularTriangle() function.
 * @modified  2020-05-12 Added getIncircle() function.
 * @modified  2020-05-12 Fixed the signature of getCircumcirle(). Was still a generic object.
 * @modified  2020-06-18 Added the getIncenter function.
 * @version   2.3.0
 *
 * @file Triangle
 * @fileoverview A simple triangle class: three vertices.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds_1 = __webpack_require__(1);
var Circle_1 = __webpack_require__(9);
var Line_1 = __webpack_require__(2);
var Polygon_1 = __webpack_require__(7);
var Vertex_1 = __webpack_require__(0);
var geomutils_1 = __webpack_require__(13);
var Triangle = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Triangle
     * @param {Vertex} a - The first vertex of the triangle.
     * @param {Vertex} b - The second vertex of the triangle.
     * @param {Vertex} c - The third vertex of the triangle.
     **/
    function Triangle(a, b, c) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Triangle";
        this.a = a;
        this.b = b;
        this.c = c;
        this.calcCircumcircle();
    }
    /**
     * Create a new triangle from the given array of vertices.
     *
     * The array must have at least three vertices, otherwise an error will be raised.
     * This function will not create copies of the vertices.
     *
     * @method fromArray
     * @static
     * @param {Array<Vertex>} arr - The required array with at least three vertices.
     * @memberof Vertex
     * @return {Triangle}
     **/
    Triangle.fromArray = function (arr) {
        //if( !Array.isArray(arr) )
        //    throw new Exception("Cannot create triangle fromArray from non-array.");
        if (arr.length < 3)
            throw "Cannot create triangle from array with less than three vertices (" + arr.length + ")";
        return new Triangle(arr[0], arr[1], arr[2]);
    };
    ;
    /**
     * Get the centroid of this triangle.
     *
     * The centroid is the average midpoint for each side.
     *
     * @method getCentroid
     * @return {Vertex} The centroid
     * @instance
     * @memberof Triangle
     **/
    Triangle.prototype.getCentroid = function () {
        return new Vertex_1.Vertex((this.a.x + this.b.x + this.c.x) / 3, (this.a.y + this.b.y + this.c.y) / 3);
    };
    ;
    /**
     * Scale the triangle towards its centroid.
     *
     * @method scaleToCentroid
     * @param {number} - The scale factor to use. That can be any scalar.
     * @return {Triangle} this (for chaining)
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.scaleToCentroid = function (factor) {
        var centroid = this.getCentroid();
        this.a.scale(factor, centroid);
        this.b.scale(factor, centroid);
        this.c.scale(factor, centroid);
        return this;
    };
    ;
    /**
     * Get the circumcircle of this triangle.
     *
     * The circumcircle is that unique circle on which all three
     * vertices of this triangle are located on.
     *
     * Please note that for performance reasons any changes to vertices will not reflect in changes
     * of the circumcircle (center or radius). Please call the calcCirumcircle() function
     * after triangle vertex changes.
     *
     * @method getCircumcircle
     * @return {Object} - { center:Vertex, radius:float }
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.getCircumcircle = function () {
        if (!this.center || !this.radius)
            this.calcCircumcircle();
        return new Circle_1.Circle(this.center.clone(), this.radius);
    };
    ;
    /**
     * Check if this triangle and the passed triangle share an
     * adjacent edge.
     *
     * For edge-checking Vertex.equals is used which uses an
     * an epsilon for comparison.
     *
     * @method isAdjacent
     * @param {Triangle} tri - The second triangle to check adjacency with.
     * @return {boolean} - True if this and the passed triangle have at least one common edge.
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.isAdjacent = function (tri) {
        var a = this.a.equals(tri.a) || this.a.equals(tri.b) || this.a.equals(tri.c);
        var b = this.b.equals(tri.a) || this.b.equals(tri.b) || this.b.equals(tri.c);
        var c = this.c.equals(tri.a) || this.c.equals(tri.b) || this.c.equals(tri.c);
        return (a && b) || (a && c) || (b && c);
    };
    ;
    /**
     * Get that vertex of this triangle (a,b,c) that is not vert1 nor vert2 of
     * the passed two.
     *
     * @method getThirdVertex
     * @param {Vertex} vert1 - The first vertex.
     * @param {Vertex} vert2 - The second vertex.
     * @return {Vertex} - The third vertex of this triangle that makes up the whole triangle with vert1 and vert2.
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.getThirdVertex = function (vert1, vert2) {
        if (this.a.equals(vert1) && this.b.equals(vert2) || this.a.equals(vert2) && this.b.equals(vert1))
            return this.c;
        if (this.b.equals(vert1) && this.c.equals(vert2) || this.b.equals(vert2) && this.c.equals(vert1))
            return this.a;
        //if( this.c.equals(vert1) && this.a.equals(vert2) || this.c.equals(vert2) && this.a.equals(vert1) )
        return this.b;
    };
    ;
    /**
     * Re-compute the circumcircle of this triangle (if the vertices
     * have changed).
     *
     * The circumcenter and radius are stored in this.center and
     * this.radius. There is a third result: radius_squared (for internal computations).
     *
     * @method calcCircumcircle
     * @return void
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.calcCircumcircle = function () {
        // From
        //    http://www.exaflop.org/docs/cgafaq/cga1.html
        var A = this.b.x - this.a.x;
        var B = this.b.y - this.a.y;
        var C = this.c.x - this.a.x;
        var D = this.c.y - this.a.y;
        var E = A * (this.a.x + this.b.x) + B * (this.a.y + this.b.y);
        var F = C * (this.a.x + this.c.x) + D * (this.a.y + this.c.y);
        var G = 2.0 * (A * (this.c.y - this.b.y) - B * (this.c.x - this.b.x));
        var dx, dy;
        if (Math.abs(G) < Triangle.EPSILON) {
            // Collinear - find extremes and use the midpoint
            var bounds = this.bounds();
            this.center = new Vertex_1.Vertex((bounds.min.x + bounds.max.x) / 2, (bounds.min.y + bounds.max.y) / 2);
            dx = this.center.x - bounds.min.x;
            dy = this.center.y - bounds.min.y;
        }
        else {
            var cx = (D * E - B * F) / G;
            var cy = (A * F - C * E) / G;
            this.center = new Vertex_1.Vertex(cx, cy);
            dx = this.center.x - this.a.x;
            dy = this.center.y - this.a.y;
        }
        this.radius_squared = dx * dx + dy * dy;
        this.radius = Math.sqrt(this.radius_squared);
    };
    ; // END calcCircumcircle
    /**
     * Check if the passed vertex is inside this triangle's
     * circumcircle.
     *
     * @method inCircumcircle
     * @param {Vertex} v - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.inCircumcircle = function (v) {
        var dx = this.center.x - v.x;
        var dy = this.center.y - v.y;
        var dist_squared = dx * dx + dy * dy;
        return (dist_squared <= this.radius_squared);
    };
    ;
    /**
     * Get the rectangular bounds for this triangle.
     *
     * @method bounds
     * @return {Bounds} - The min/max bounds of this triangle.
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.bounds = function () {
        return new Bounds_1.Bounds(new Vertex_1.Vertex(Triangle.utils.min3(this.a.x, this.b.x, this.c.x), Triangle.utils.min3(this.a.y, this.b.y, this.c.y)), new Vertex_1.Vertex(Triangle.utils.max3(this.a.x, this.b.x, this.c.x), Triangle.utils.max3(this.a.y, this.b.y, this.c.y)));
    };
    ;
    /**
     * Convert this triangle to a polygon instance.
     *
     * Plase note that this conversion does not perform a deep clone.
     *
     * @method toPolygon
     * @return {Polygon} A new polygon representing this triangle.
     * @instance
     * @memberof Triangle
     **/
    Triangle.prototype.toPolygon = function () {
        return new Polygon_1.Polygon([this.a, this.b, this.c]);
    };
    ;
    /**
     * Get the determinant of this triangle.
     *
     * @method determinant
     * @return {number} - The determinant (float).
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.determinant = function () {
        // (b.y - a.y)*(c.x - b.x) - (c.y - b.y)*(b.x - a.x);
        return (this.b.y - this.a.y) * (this.c.x - this.b.x) - (this.c.y - this.b.y) * (this.b.x - this.a.x);
    };
    ;
    /**
     * Checks if the passed vertex (p) is inside this triangle.
     *
     * Note: matrix determinants rock.
     *
     * @method containsPoint
     * @param {Vertex} p - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.containsPoint = function (p) {
        return Triangle.utils.pointIsInTriangle(p.x, p.y, this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
    };
    ;
    /**
     * Get that inner triangle which defines the maximal incircle.
     *
     * @return {Triangle} The triangle of those points in this triangle that define the incircle.
     */
    Triangle.prototype.getIncircularTriangle = function () {
        var lineA = new Line_1.Line(this.a, this.b);
        var lineB = new Line_1.Line(this.b, this.c);
        var lineC = new Line_1.Line(this.c, this.a);
        var bisector1 = geomutils_1.geomutils.nsectAngle(this.b, this.a, this.c, 2)[0]; // bisector of first angle (in b)
        var bisector2 = geomutils_1.geomutils.nsectAngle(this.c, this.b, this.a, 2)[0]; // bisector of second angle (in c)
        var intersection = bisector1.intersection(bisector2);
        // Find the closest points on one of the polygon lines (all have same distance by construction)
        var circleIntersA = lineA.getClosestPoint(intersection);
        var circleIntersB = lineB.getClosestPoint(intersection);
        var circleIntersC = lineC.getClosestPoint(intersection);
        return new Triangle(circleIntersA, circleIntersB, circleIntersC);
    };
    ;
    /**
     * Get the incircle of this triangle. That is the circle that touches each side
     * of this triangle in exactly one point.
     *
     * Note this just calls getIncircularTriangle().getCircumcircle()
     *
     * @return {Circle} The incircle of this triangle.
     */
    Triangle.prototype.getIncircle = function () {
        return this.getIncircularTriangle().getCircumcircle();
    };
    ;
    /**
     * Get the incenter of this triangle (which is the center of the circumcircle).
     *
     * Note: due to performance reasonst the incenter is buffered inside the triangle because
     *       computing it is relatively expensive. If a, b or c have changed you should call the
     *       calcCircumcircle() function first, otherwise you might get wrong results.
     * @return Vertex The incenter of this triangle.
     **/
    Triangle.prototype.getIncenter = function () {
        if (!this.center || !this.radius)
            this.calcCircumcircle();
        return this.center.clone();
    };
    ;
    /**
     * Converts this triangle into a human-readable string.
     *
     * @method toString
     * @return {string}
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.toString = function () {
        return '{ a : ' + this.a.toString() + ', b : ' + this.b.toString() + ', c : ' + this.c.toString() + '}';
    };
    ;
    /**
     * Create an SVG representation of this triangle.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} The SVG string.
     * @instance
     * @memberof Triangle
     **/
    Triangle.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<path');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' d="');
        var vertices = [this.a, this.b, this.c];
        if (vertices.length > 0) {
            buffer.push('M ');
            buffer.push(vertices[0].x);
            buffer.push(' ');
            buffer.push(vertices[0].y);
            for (var i = 1; i < vertices.length; i++) {
                buffer.push(' L ');
                buffer.push(vertices[i].x);
                buffer.push(' ');
                buffer.push(vertices[i].y);
            }
            //if( !this.isOpen ) {
            buffer.push(' Z');
            //}
        }
        buffer.push('" />');
        return buffer.join('');
    };
    ;
    /**
     * An epsilon for comparison.
     * This should be the same epsilon as in Vertex.
     *
     * @private
     **/
    Triangle.EPSILON = 1.0e-6;
    Triangle.utils = {
        // Used in the bounds() function.
        max3: function (a, b, c) {
            return (a >= b && a >= c) ? a : (b >= a && b >= c) ? b : c;
        },
        min3: function (a, b, c) {
            return (a <= b && a <= c) ? a : (b <= a && b <= c) ? b : c;
        },
        /**
         * Used by the containsPoint() function.
         *
         * @private
         **/
        pointIsInTriangle: function (px, py, p0x, p0y, p1x, p1y, p2x, p2y) {
            //
            // Point-in-Triangle test found at
            //   http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-2d-triangle
            //
            var area = 1 / 2 * (-p1y * p2x + p0y * (-p1x + p2x) + p0x * (p1y - p2y) + p1x * p2y);
            var s = 1 / (2 * area) * (p0y * p2x - p0x * p2y + (p2y - p0y) * px + (p0x - p2x) * py);
            var t = 1 / (2 * area) * (p0x * p1y - p0y * p1x + (p0y - p1y) * px + (p1x - p0x) * py);
            return s > 0 && t > 0 && (1 - s - t) > 0;
        }
    };
    return Triangle;
}());
exports.Triangle = Triangle;
//# sourceMappingURL=Triangle.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Line, Vector, VertTuple, Vertex, SVGSerializale
 *
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 * @modified 2020-05-25 Added the vertAt and tangentAt functions.
 *
 * @file Circle
 * @fileoverview A simple circle class: center point and radius.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = __webpack_require__(3);
var Vertex_1 = __webpack_require__(0);
var Circle = /** @class */ (function () {
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    function Circle(center, radius) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Circle";
        this.center = center;
        this.radius = radius;
    }
    ;
    /**
     * Calculate the distance from this circle to the given line.
     *
     * * If the line does not intersect this ciecle then the returned
     *   value will be the minimal distance.
     * * If the line goes through this circle then the returned value
     *   will be max inner distance and it will be negative.
     *
     * @method lineDistance
     * @param {Line} line - The line to measure the distance to.
     * @return {number} The minimal distance from the outline of this circle to the given line.
     * @instance
     * @memberof Circle
     */
    Circle.prototype.lineDistance = function (line) {
        var closestPointOnLine = line.getClosestPoint(this.center);
        return closestPointOnLine.distance(this.center) - this.radius;
    };
    ;
    /**
     * Get the vertex on the this circle for the given angle.
     *
     * @param {number} angle - The angle (in radians) to use.
     * @retrn {Vertex} Te the vertex (point) at the given angle.
     **/
    Circle.prototype.vertAt = function (angle) {
        // Find the point on the circle respective the angle. Then move relative to center.
        return Circle.circleUtils.vertAt(angle, this.radius).add(this.center);
    };
    ;
    /**
     * Get a tangent line of this circle for a given angle.
     *
     * Point a of the returned line is located on the circle, the length equals the radius.
     *
     * @param {number} angle - The angle (in radians) to use.
     * @return {Line} The tangent line.
     **/
    Circle.prototype.tangentAt = function (angle) {
        var pointA = Circle.circleUtils.vertAt(angle, this.radius);
        // Construct the perpendicular of the line in point a. Then move relative to center.
        return new Vector_1.Vector(pointA, new Vertex_1.Vertex(0, 0)).add(this.center).perp();
    };
    ;
    /**
      * Create an SVG representation of this circle.
      *
      * @method toSVGString
      * @param {object=} options - An optional set of options, like 'className'.
      * @return {string} A string representing the SVG code for this vertex.
      * @instance
      * @memberof Circle
      */
    Circle.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<circle');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' cx="' + this.center.x + '"');
        buffer.push(' cy="' + this.center.y + '"');
        buffer.push(' r="' + this.radius + '"');
        buffer.push(' />');
        return buffer.join('');
    };
    ;
    Circle.circleUtils = {
        vertAt: function (angle, radius) {
            return new Vertex_1.Vertex(Math.sin(angle) * radius, Math.cos(angle) * radius);
        }
    };
    return Circle;
}()); // END class
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc An event listeners wrapper. This is just a set of three listener
 *              queues (drag, dragStart, dragEnd) and their respective firing
 *              functions.
 *
 * @author   Ikaros Kappler
 * @date     2018-08-27
 * @modified 2018-11-28 Added the vertex-param to the constructor and extended the event. Vertex events now have a 'params' attribute object.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2020-02-22 Added 'return this' to the add* functions (for chanining).
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  1.0.4
 *
 * @file VertexListeners
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var VertexListeners = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name VertexListeners
     * @param {Vertex} vertex - The vertex to use these listeners on (just a backward reference).
     **/
    function VertexListeners(vertex) {
        this.drag = [];
        this.dragStart = [];
        this.dragEnd = [];
        this.vertex = vertex;
    }
    ;
    /**
     * Add a drag listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragListener = function (listener) {
        // this.drag.push( listener );
        VertexListeners._addListener(this.drag, listener);
        return this;
    };
    ;
    /**
     * The drag listener is a function with a single drag event param.
     * @callback VertexListeners~dragListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.removeDragListener = function (listener) {
        // this.drag.push( listener );
        this.drag = VertexListeners._removeListener(this.drag, listener);
        return this;
    };
    ;
    /**
     * Add a dragStart listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragStartListener} listener - The drag-start listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragStartListener = function (listener) {
        //this.dragStart.push( listener );
        VertexListeners._addListener(this.dragStart, listener);
        return this;
    };
    ;
    /**
     * The drag-start listener is a function with a single drag event param.
     * @callback VertexListeners~dragStartListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a dragStart listener.
     *
     * @method addDragStartListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.removeDragStartListener = function (listener) {
        // this.drag.push( listener );
        this.dragStart = VertexListeners._removeListener(this.dragStart, listener);
        return this;
    };
    ;
    /**
     * Add a dragEnd listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragEndListener} listener - The drag-end listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragEndListener = function (listener) {
        // this.dragEnd.push( listener );
        VertexListeners._addListener(this.dragEnd, listener);
        return this;
    };
    ;
    /**
     * The drag-end listener is a function with a single drag event param.
     * @callback VertexListeners~dragEndListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a dragEnd listener.
     *
     * @method addDragEndListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.removeDragEndListener = function (listener) {
        // this.drag.push( listener );
        this.dragEnd = VertexListeners._removeListener(this.dragEnd, listener);
        return this;
    };
    ;
    /**
     * Fire a drag event with the given event instance to all
     * installed drag listeners.
     *
     * @method fireDragEvent
     * @param {VertEvent|XMouseEvent} e - The drag event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragEvent = function (e) {
        VertexListeners._fireEvent(this, this.drag, e);
    };
    ;
    /**
     * Fire a dragStart event with the given event instance to all
     * installed drag-start listeners.
     *
     * @method fireDragStartEvent
     * @param {VertEvent|XMouseEvent} e - The drag-start event itself to be fired to all installed dragStart listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragStartEvent = function (e) {
        VertexListeners._fireEvent(this, this.dragStart, e);
    };
    ;
    /**
     * Fire a dragEnd event with the given event instance to all
     * installed drag-end listeners.
     *
     * @method fireDragEndEvent
     * @param {VertEvent|XMouseEvent} e - The drag-end event itself to be fired to all installed dragEnd listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragEndEvent = function (e) {
        VertexListeners._fireEvent(this, this.dragEnd, e);
    };
    ;
    /**
     * @private
     **/
    VertexListeners._fireEvent = function (_self, listeners, e) {
        var ve = e;
        if (typeof ve.params == 'undefined')
            ve.params = { vertex: _self.vertex };
        else
            ve.params.vertex = _self.vertex;
        for (var i in listeners) {
            listeners[i](ve);
        }
    };
    ;
    /**
     * @private
     */
    VertexListeners._addListener = function (listeners, newListener) {
        for (var i in listeners) {
            if (listeners[i] == newListener)
                return false;
        }
        listeners.push(newListener);
        return true;
    };
    ;
    /**
     * @private
     */
    VertexListeners._removeListener = function (listeners, oldListener) {
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == oldListener)
                return listeners.splice(i, 1);
        }
        return listeners;
    };
    ;
    return VertexListeners;
}());
exports.VertexListeners = VertexListeners;
//# sourceMappingURL=VertexListeners.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
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
Object.defineProperty(exports, "__esModule", { value: true });
var Grid = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Grid
     * @param {Vertex} center - The offset of the grid (default is [0,0]).
     * @param {Vertex} size   - The x- and y-size of the grid.
     **/
    function Grid(center, size) {
        this.center = center;
        this.size = size;
    }
    ;
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
        baseLog: function (base, num) { return Math.log(base) / Math.log(num); },
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
        mapRasterScale: function (adjustFactor, scale) {
            var gf = 1.0;
            if (scale >= 1) {
                gf = Math.abs(Math.floor(1 / Grid.utils.baseLog(adjustFactor, scale)));
                gf = 1 / Math.pow(adjustFactor, gf);
            }
            else {
                gf = Math.abs(Math.floor(Grid.utils.baseLog(1 / adjustFactor, 1 / (scale + 1))));
                //gf = Math.pow( adjustFactor, gf );
            }
            return gf;
        }
    };
    return Grid;
}());
exports.Grid = Grid;
//# sourceMappingURL=Grid.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc An abstract base classes for vertex tuple constructs, like Lines or Vectors.
 * @abstract
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date   2020-03-24
 * @modified 2020-05-04 Fixed a serious bug in the pointDistance function.
 * @modofied 2020-05-12 The angle(line) param was still not optional. Changed that.
 * @version 1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Vertex_1 = __webpack_require__(0);
var VertTuple = /** @class */ (function () {
    /**
     * Creates an instance.
     *
     * @constructor
     * @name VertTuple
     * @param {Vertex} a The tuple's first point.
     * @param {Vertex} b The tuple's second point.
     **/
    function VertTuple(a, b, factory) {
        this.a = a;
        this.b = b;
        this.factory = factory;
    }
    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.length = function () {
        return Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
    };
    ;
    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @memberof VertTuple
     * @return {T} this (for chaining)
     **/
    VertTuple.prototype.setLength = function (length) {
        return this.scale(length / this.length());
    };
    ;
    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {Vertex} amount The amount (x,y) to substract.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.sub = function (amount) {
        this.a.sub(amount);
        this.b.sub(amount);
        return this;
    };
    ;
    /**
     * Add the given vertex to this line's end points.
     *
     * @method add
     * @param {Vertex} amount The amount (x,y) to add.
     * @return {Line} this
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.add = function (amount) {
        this.a.add(amount);
        this.b.add(amount);
        return this;
    };
    ;
    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.normalize = function () {
        this.b.set(this.a.x + (this.b.x - this.a.x) / this.length(), this.a.y + (this.b.y - this.a.y) / this.length());
        return this;
    };
    ;
    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.scale = function (factor) {
        this.b.set(this.a.x + (this.b.x - this.a.x) * factor, this.a.y + (this.b.y - this.a.y) * factor);
        return this;
    };
    ;
    /**
     * Move this line to a new location.
     *
     * @method moveTo
     * @param {Vertex} newA - The new desired location of 'a'. Vertex 'b' will be moved, too.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.moveTo = function (newA) {
        var diff = this.a.difference(newA);
        this.a.add(diff);
        this.b.add(diff);
        return this;
    };
    ;
    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {VertTuple} line - (optional) The line to calculate the angle to. If null the baseline (x-axis) will be used.
     * @return {number} this
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.angle = function (line) {
        if (typeof line == 'undefined')
            line = this.factory(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(100, 0));
        // Compute the angle from x axis and the return the difference :)
        var v0 = this.b.clone().sub(this.a);
        var v1 = line.b.clone().sub(line.a);
        // Thank you, Javascript, for this second atan function. No additional math is needed here!
        // The result might be negative, but isn't it usually nicer to determine angles in positive values only?
        return Math.atan2(v1.x, v1.y) - Math.atan2(v0.x, v0.y);
    };
    ;
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
     * @memberof VertTuple
     **/
    VertTuple.prototype.vertAt = function (t) {
        return new Vertex_1.Vertex(this.a.x + (this.b.x - this.a.x) * t, this.a.y + (this.b.y - this.a.y) * t);
    };
    ;
    /**
     * Get the denominator of this and the given line.
     *
     * If the denominator is zero (or close to zero) both line are co-linear.
     *
     * @method denominator
     * @param {VertTuple} line
     * @instance
     * @memberof VertTuple
     * @return {Number}
     **/
    VertTuple.prototype.denominator = function (line) {
        // http://jsfiddle.net/justin_c_rounds/Gd2S2/
        return ((line.b.y - line.a.y) * (this.b.x - this.a.x)) - ((line.b.x - line.a.x) * (this.b.y - this.a.y));
    };
    ;
    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @method colinear
     * @param {VertTuple} line
     * @instance
     * @memberof VertTuple
     * @return true if both lines are co-linear.
     */
    VertTuple.prototype.colinear = function (line) {
        return Math.abs(this.denominator(line)) < Vertex_1.Vertex.EPSILON;
    };
    ;
    /**
     * Get the closest position T from this line to the specified point.
     *
     * The counterpart for this function is Line.vertAt(Number).
     *
     * @method getClosestT
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The line position t of minimal distance to p.
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.getClosestT = function (p) {
        var l2 = VertTuple.vtutils.dist2(this.a, this.b);
        if (l2 === 0)
            return 0;
        var t = ((p.x - this.a.x) * (this.b.x - this.a.x) + (p.y - this.a.y) * (this.b.y - this.a.y)) / l2;
        // Wrap to [0,1]?
        // t = Math.max(0, Math.min(1, t));
        return t;
    };
    ;
    /**
     * Get the closest point on this line to the specified point.
     *
     * @method getClosestPoint
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {Vertex} The point on the line that is closest to p.
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.getClosestPoint = function (p) {
        var t = this.getClosestT(p);
        return this.vertAt(t);
    };
    ;
    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.pointDistance = function (p) {
        // Taken From:
        // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        //function dist2(v, w) {
        //    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
        //}
        return Math.sqrt(VertTuple.vtutils.dist2(p, this.vertAt(this.getClosestT(p))));
    };
    ;
    /**
     * Create a deep clone of this instance.
     *
     * @method cloneLine
     * @return {T} A type safe clone if this instance.
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.clone = function () {
        return this.factory(this.a.clone(), this.b.clone());
    };
    ;
    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof VertTuple
     **/
    VertTuple.prototype.toString = function () {
        return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + " }";
    };
    ;
    /**
     * @private
     **/
    VertTuple.vtutils = {
        dist2: function (v, w) {
            return (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
        }
    };
    return VertTuple;
}());
exports.VertTuple = VertTuple;
//# sourceMappingURL=VertTuple.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Line_1 = __webpack_require__(2);
var Triangle_1 = __webpack_require__(8);
exports.geomutils = {
    /**
     * Compute the n-section of the angle – described as a triangle (A,B,C) – in point A.
     *
     * @param {Vertex} pA - The first triangle point.
     * @param {Vertex} pB - The second triangle point.
     * @param {Vertex} pC - The third triangle point.
     * @param {number} n - The number of desired angle sections (example: 2 means the angle will be divided into two sections,
     *                      means an returned array with length 1, the middle line).
     *
     * @return {Line[]} An array of n-1 lines secting the given angle in point A into n equal sized angle sections. The lines' first vertex is A.
     */
    nsectAngle: function (pA, pB, pC, n) {
        var triangle = new Triangle_1.Triangle(pA, pB, pC);
        var lineAB = new Line_1.Line(pA, pB);
        var lineAC = new Line_1.Line(pA, pC);
        // Compute the slope (theta) of line AB and line AC
        var thetaAB = lineAB.angle();
        var thetaAC = lineAC.angle();
        // Compute the difference; this is the angle between AB and AC
        var insideAngle = lineAB.angle(lineAC);
        // We want the inner angles of the triangle, not the outer angle;
        //   which one is which depends on the triangle 'direction'
        var clockwise = triangle.determinant() > 0;
        // For convenience convert the angle [-PI,PI] to [0,2*PI]
        if (insideAngle < 0)
            insideAngle = 2 * Math.PI + insideAngle;
        if (!clockwise)
            insideAngle = (2 * Math.PI - insideAngle) * (-1);
        // Scale the rotated lines to the max leg length (looks better)
        var lineLength = Math.max(lineAB.length(), lineAC.length());
        var scaleFactor = lineLength / lineAB.length();
        var result = [];
        for (var i = 1; i < n; i++) {
            // Compute the i-th inner sector line
            result.push(new Line_1.Line(pA, pB.clone().rotate((-i * (insideAngle / n)), pA)).scale(scaleFactor));
        }
        return result;
    }
};
//# sourceMappingURL=geomutils.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version  1.0.1
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var VEllipse = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center The ellipses center.
     * @param {Vertex} axis The x- and y-axis.
     * @name VEllipse
     **/
    function VEllipse(center, axis) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipse";
        this.center = center;
        this.axis = axis;
    }
    ;
    /**
     * Create an SVG representation of this ellipse.
     *
     * @param {object} options { className?:string }
     * @return string The SVG string
     */
    VEllipse.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<ellipse');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' cx="' + this.center.x + '"');
        buffer.push(' cy="' + this.center.y + '"');
        buffer.push(' rx="' + this.axis.x + '"');
        buffer.push(' ry="' + this.axis.y + '"');
        buffer.push(' />');
        return buffer.join('');
    };
    ;
    return VEllipse;
}());
exports.VEllipse = VEllipse;
//# sourceMappingURL=VEllipse.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc A wrapper for image objects.
 *
 * @requires Vertex, SVGSerializable
 *
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version 1.0.2
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var PBImage = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    function PBImage(image, upperLeft, lowerRight) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "PBImage";
        /* if( typeof image == 'undefined' )
            throw Error('image must not be null.');
        if( typeof upperLeft == 'undefined' )
            throw Error('upperLeft must not be null.');
        if( typeof lowerRight == 'undefined' )
            throw Error('lowerRight must not be null.'); */
        this.image = image;
        this.upperLeft = upperLeft;
        this.lowerRight = lowerRight;
    }
    ;
    // Implement SVGSerializable
    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof PBImage
     **/
    PBImage.prototype.toSVGString = function (options) {
        console.warn("PBImage is not yet SVG serializable. Returning empty SVG string.");
        return "";
    };
    ;
    return PBImage;
}());
exports.PBImage = PBImage;
//# sourceMappingURL=PBImage.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A simple mouse handler for demos.
 * Use to avoid load massive libraries like jQuery.
 *
 *
 * Usage
 * =====
 * Javascript:
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
 *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
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
 * Typescript:
 *   new MouseHandler( document.getElementById('mycanvas') )
 *	    .drag( (e:XMouseEvent) => {
 *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
 *		if( e.params.leftMouse ) ;
 *		else if( e.params.rightMouse ) ;
 *	    } )
 *	    .move( (e:XMouseEvent) => {
 *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
 *	    } )
 *          .up( (e:XMouseEvent) => {
 *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
 *          } )
 *          .down( (e:XMouseEvent) => {
 *              console.log( 'Mouse down.' );
 *          } )
 *          .click( (e:XMouseEvent) => {
 *              console.log( 'Click.' );
 *          } )
 *          .wheel( (e:XMouseEvent) => {
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
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-04-08 Fixed the click event (internally fired a 'mouseup' event) (1.0.10)
 * @modified 2020-04-08 Added the optional 'name' property. (1.0.11)
 * @modified 2020-04-08 The new version always installs internal listenrs to track drag events even
 *                      if there is no external drag listener installed (1.1.0).
 * @version  1.1.0
 **/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var XMouseEvent = /** @class */ (function (_super) {
    __extends(XMouseEvent, _super);
    function XMouseEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XMouseEvent;
}(MouseEvent));
exports.XMouseEvent = XMouseEvent;
var XWheelEvent = /** @class */ (function (_super) {
    __extends(XWheelEvent, _super);
    function XWheelEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XWheelEvent;
}(WheelEvent));
exports.XWheelEvent = XWheelEvent;
var MouseHandler = /** @class */ (function () {
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * @param {HTMLElement} element
     **/
    function MouseHandler(element, name) {
        this.mouseDownPos = undefined;
        this.mouseDragPos = undefined;
        this.mousePos = undefined;
        this.mouseButton = -1;
        this.listeners = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Some private vars to store the current mouse/position/button state.
        // +-------------------------------------------------
        this.name = name;
        this.element = element;
        this.mouseDownPos = null;
        this.mouseDragPos = null;
        this.mousePos = null;
        this.mouseButton = -1;
        this.listeners = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Define the internal event handlers.
        // |
        // | They will dispatch the modified event (relative mouse position,
        // | drag offset, ...) to the callbacks.
        // +-------------------------------------------------
        var _self = this;
        this.handlers['mousemove'] = function (e) {
            if (_self.listeners.mousemove)
                _self.listeners.mousemove(_self.mkParams(e, 'mousemove'));
            if (_self.mouseDragPos && _self.listeners.drag)
                _self.listeners.drag(_self.mkParams(e, 'drag'));
            if (_self.mouseDownPos)
                _self.mouseDragPos = _self.relPos(e);
        };
        this.handlers['mouseup'] = function (e) {
            if (_self.listeners.mouseup)
                _self.listeners.mouseup(_self.mkParams(e, 'mouseup'));
            _self.mouseDragPos = undefined;
            _self.mouseDownPos = undefined;
            _self.mouseButton = -1;
        };
        this.handlers['mousedown'] = function (e) {
            _self.mouseDragPos = _self.relPos(e);
            _self.mouseDownPos = _self.relPos(e);
            _self.mouseButton = e.button;
            if (_self.listeners.mousedown)
                _self.listeners.mousedown(_self.mkParams(e, 'mousedown'));
        };
        this.handlers['click'] = function (e) {
            if (_self.listeners.click)
                _self.listeners.click(_self.mkParams(e, 'click'));
        };
        this.handlers['wheel'] = function (e) {
            if (_self.listeners.wheel)
                _self.listeners.wheel(_self.mkParams(e, 'wheel'));
        };
        this.element.addEventListener('mousemove', this.handlers['mousemove']);
        this.element.addEventListener('mouseup', this.handlers['mouseup']);
        this.element.addEventListener('mousedown', this.handlers['mousedown']);
        this.element.addEventListener('click', this.handlers['click']);
        this.element.addEventListener('wheel', this.handlers['wheel']);
    }
    // +----------------------------------------------------------------------
    // | Some private vars to store the current mouse/position/button state.
    // +-------------------------------------------------
    MouseHandler.prototype.relPos = function (e) {
        return { x: e.offsetX,
            y: e.offsetY // e.pageY - e.target.offsetTop
        };
    };
    MouseHandler.prototype.mkParams = function (e, eventName) {
        var rel = this.relPos(e);
        var xEvent = e;
        xEvent.params = {
            element: this.element,
            name: eventName,
            pos: rel,
            button: this.mouseButton,
            leftButton: this.mouseButton == 0,
            middleButton: this.mouseButton == 1,
            rightButton: this.mouseButton == 2,
            mouseDownPos: this.mouseDownPos,
            draggedFrom: this.mouseDragPos,
            wasDragged: (this.mouseDownPos != null && (this.mouseDownPos.x != rel.x || this.mouseDownPos.y != rel.y)),
            dragAmount: (this.mouseDownPos != null ? { x: rel.x - this.mouseDragPos.x, y: rel.y - this.mouseDragPos.y } : { x: 0, y: 0 })
        };
        return xEvent;
    };
    MouseHandler.prototype.listenFor = function (eventName) {
        if (this.installed[eventName])
            return;
        // In the new version 1.1.0 has all internal listeners installed by default.
        // this.element.addEventListener(eventName,this.handlers[eventName]);
        this.installed[eventName] = true;
    };
    MouseHandler.prototype.unlistenFor = function (eventName) {
        if (!this.installed[eventName])
            return;
        // In the new version 1.1.0 has all internal listeners installed by default.
        // this.element.removeEventListener(eventName,this.handlers[eventName]);
        delete this.installed[eventName];
    };
    // +----------------------------------------------------------------------
    // | The installer functions.
    // |
    // | Pass your callbacks here.
    // | Note: they support chaining.
    // +-------------------------------------------------
    MouseHandler.prototype.drag = function (callback) {
        if (this.listeners.drag)
            this.throwAlreadyInstalled('drag');
        this.listeners.drag = callback;
        this.listenFor('mousedown');
        this.listenFor('mousemove');
        this.listenFor('mouseup');
        //listeners.drag = callback;
        return this;
    };
    ;
    MouseHandler.prototype.move = function (callback) {
        if (this.listeners.mousemove)
            this.throwAlreadyInstalled('mousemove');
        this.listenFor('mousemove');
        this.listeners.mousemove = callback;
        return this;
    };
    ;
    MouseHandler.prototype.up = function (callback) {
        if (this.listeners.mouseup)
            this.throwAlreadyInstalled('mouseup');
        this.listenFor('mouseup');
        this.listeners.mouseup = callback;
        return this;
    };
    ;
    MouseHandler.prototype.down = function (callback) {
        if (this.listeners.mousedown)
            this.throwAlreadyInstalled('mousedown');
        this.listenFor('mousedown');
        this.listeners.mousedown = callback;
        return this;
    };
    ;
    MouseHandler.prototype.click = function (callback) {
        if (this.listeners.click)
            this.throwAlreadyInstalled('click');
        this.listenFor('click');
        this.listeners.click = callback;
        return this;
    };
    ;
    MouseHandler.prototype.wheel = function (callback) {
        if (this.listeners.wheel)
            this.throwAlreadyInstalled('wheel');
        this.listenFor('wheel');
        this.listeners.wheel = callback;
        return this;
    };
    ;
    MouseHandler.prototype.throwAlreadyInstalled = function (name) {
        throw "This MouseHandler already has a '" + name + "' callback. To keep the code simple there is only room for one.";
    };
    // +----------------------------------------------------------------------
    // | Call this when your work is done.
    // |
    // | The function will un-install all event listeners.
    // +-------------------------------------------------
    MouseHandler.prototype.destroy = function () {
        this.unlistenFor('mousedown');
        this.unlistenFor('mousemove');
        this.unlistenFor('moseup');
        this.unlistenFor('click');
        this.unlistenFor('wheel');
        this.element.removeEventListener('mousemove', this.handlers['mousemove']);
        this.element.removeEventListener('mouseup', this.handlers['mousedown']);
        this.element.removeEventListener('mousedown', this.handlers['mousedown']);
        this.element.removeEventListener('click', this.handlers['click']);
        this.element.removeEventListener('wheel', this.handlers['wheel']);
    };
    return MouseHandler;
}());
exports.MouseHandler = MouseHandler;
//# sourceMappingURL=MouseHandler.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
 * @author   Ikaros Kappler
 * @date     2018-11-11 (Alaaf)
 * @modified 2020-03-28 Ported this class from vanilla-JS to Typescript.
 * @version  1.0.1
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var KeyHandler = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @param options.element (optional) The HTML element to listen on; if null then 'window' will be used.
     * @param options.trackAll (optional) Set to true if you want to keep track of _all_ keys (keyStatus).
    **/
    function KeyHandler(options) {
        this.downListeners = [];
        this.pressListeners = [];
        this.upListeners = [];
        this.keyStates = {};
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
        // Install the listeners
        this.installListeners();
    }
    ;
    /**
     * A helper function to fire key events from this KeyHandler.
     *
     * @param {KeyboardEvent} event - The key event to fire.
     * @param {Array<XKeyListener>} listener - The listeners to fire to.
     */
    KeyHandler.prototype.fireEvent = function (event, listeners) {
        var hasListener = false;
        for (var i in listeners) {
            var lis = listeners[i];
            if (lis.keyCode != event.keyCode)
                continue;
            lis.listener(event);
            hasListener = true;
        }
        return hasListener;
    };
    ;
    /**
     * Internal function to fire a new keydown event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     */
    KeyHandler.prototype.fireDownEvent = function (e, handler) {
        if (handler.fireEvent(e, handler.downListeners) || handler.trackAllKeys) {
            // Down event has listeners. Update key state.
            handler.keyStates[e.keyCode] = 'down';
        }
    };
    ;
    /**
     * Internal function to fire a new keypress event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     */
    KeyHandler.prototype.firePressEvent = function (e, handler) {
        handler.fireEvent(e, handler.pressListeners);
    };
    ;
    /**
     * Internal function to fire a new keyup event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     */
    KeyHandler.prototype.fireUpEvent = function (e, handler) {
        if (handler.fireEvent(e, handler.upListeners) || handler.trackAllKeys) {
            // Up event has listeners. Clear key state.
            delete handler.keyStates[e.keyCode];
        }
    };
    ;
    /**
     * Resolve the key/name code.
     */
    KeyHandler.key2code = function (key) {
        if (typeof key == 'number')
            return key;
        if (typeof key != 'string')
            throw "Unknown key name or key type (should be a string or integer): " + key;
        if (KeyHandler.KEY_CODES[key])
            return KeyHandler.KEY_CODES[key];
        throw "Unknown key (cannot resolve key code): " + key;
    };
    ;
    /**
     * Install the required listeners into the initially passed element.
     *
     * By default the listeners are installed into the root element specified on
     * construction (or 'window').
     */
    KeyHandler.prototype.installListeners = function () {
        var _self = this;
        this.element.addEventListener('keydown', this._keyDownListener = function (e) { _self.fireDownEvent(e, _self); });
        this.element.addEventListener('keypress', this._keyPressListener = function (e) { _self.firePressEvent(e, _self); });
        this.element.addEventListener('keyup', this._keyUpListener = function (e) { _self.fireUpEvent(e, _self); });
    };
    ;
    /**
     *  Remove all installed event listeners from the underlying element.
     */
    KeyHandler.prototype.releaseListeners = function () {
        this.element.removeEventListener('keydown', this._keyDownListener);
        this.element.removeEventListener('keypress', this._keyPressListener);
        this.element.removeEventListener('keyup', this._keyUpListener);
    };
    ;
    /**
     * Listen for key down. This function allows chaining.
     *
     * Example: new KeyHandler().down('enter',function() {console.log('Enter hit.')});
     *
     * @param {string|number} key -  Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void} e -  The callback to be triggered.
     */
    KeyHandler.prototype.down = function (key, listener) {
        this.downListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    };
    ;
    /**
     * Listen for key press.
     *
     * Example: new KeyHandler().press('enter',function() {console.log('Enter pressed.')});
     *
     * @param {string|number} key - Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void} listener - The callback to be triggered.
     */
    KeyHandler.prototype.press = function (key, listener) {
        this.pressListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    };
    ;
    /**
     * Listen for key up.
     *
     * Example: new KeyHandler().up('enter',function() {console.log('Enter released.')});
     *
     *  @param {string} key - Any key identifier, key code or one from the KEY_CODES list.
     *  @param {(e:KeyboardEvent)=>void) e - The callback to be triggered.
     */
    KeyHandler.prototype.up = function (key, listener) {
        this.upListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    };
    ;
    /**
     *  Check if a specific key is currently held pressed.
     *
     * @param {string|number} key - Any key identifier, key code or one from the KEY_CODES list.
     */
    KeyHandler.prototype.isDown = function (key) {
        if (typeof key == 'number')
            return this.keyStates[key] ? true : false;
        else
            return this.keyStates[KeyHandler.key2code(key)] ? true : false;
    };
    /**
     * Source:
     * https://keycode.info/
     */
    KeyHandler.KEY_CODES = {
        'break': 3,
        'backspace': 8,
        'delete': 8,
        'tab': 9,
        'clear': 12,
        'enter': 13,
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'pause': 19,
        // 'break'	         : 19,
        'capslock': 20,
        'hangul': 21,
        'hanja': 25,
        'escape': 27,
        'conversion': 28,
        'non-conversion': 29,
        'spacebar': 32,
        'pageup': 33,
        'pagedown': 34,
        'end': 35,
        'home': 36,
        'leftarrow': 37,
        'uparrow': 38,
        'rightarrow': 39,
        'downarrow': 40,
        'select': 41,
        'print': 42,
        'execute': 43,
        'printscreen': 44,
        'insert': 45,
        // 'delete'	 : 46,
        'help': 47,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        ':': 58,
        'semicolon (firefox)': 59,
        'equals': 59,
        '<': 60,
        'equals (firefox)': 61,
        'ß': 63,
        '@ (firefox)': 64,
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,
        'windows': 91,
        'leftcommand': 91,
        'chromebooksearch': 91,
        'rightwindowkey': 92,
        'windowsmenu': 93,
        'rightcommant': 93,
        'sleep': 95,
        'numpad0': 96,
        'numpad1': 97,
        'numpad2': 98,
        'numpad3': 99,
        'numpad4': 100,
        'numpad5': 101,
        'numpad6': 102,
        'numpad7': 103,
        'numpad8': 104,
        'numpad9': 105,
        'multiply': 106,
        'add': 107,
        'numpadperiod': 108,
        'subtract': 109,
        'decimalpoint': 110,
        'divide': 111,
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123,
        'f13': 124,
        'f14': 125,
        'f15': 126,
        'f16': 127,
        'f17': 128,
        'f18': 129,
        'f19': 130,
        'f20': 131,
        'f21': 132,
        'f22': 133,
        'f23': 134,
        'f24': 135,
        'numlock': 144,
        'scrolllock': 145,
        '^': 160,
        '!': 161,
        // '؛' 	 : 162 // (arabic semicolon)
        '#': 163,
        '$': 164,
        'ù': 165,
        'pagebackward': 166,
        'pageforward': 167,
        'refresh': 168,
        'closingparen': 169,
        '*': 170,
        '~+*': 171,
        // 'home'	         : 172,
        'minus': 173,
        // 'mute'           : 173,
        // 'unmute'	 : 173,
        'decreasevolumelevel': 174,
        'increasevolumelevel': 175,
        'next': 176,
        'previous': 177,
        'stop': 178,
        'play/pause': 179,
        'email': 180,
        'mute': 181,
        'unmute': 181,
        //'decreasevolumelevel'	182 // firefox
        //'increasevolumelevel'	183 // firefox
        'semicolon': 186,
        'ñ': 186,
        'equal': 187,
        'comma': 188,
        'dash': 189,
        'period': 190,
        'forwardslash': 191,
        'ç': 191,
        'grave accent': 192,
        //'ñ' 192,
        'æ': 192,
        'ö': 192,
        '?': 193,
        '/': 193,
        '°': 193,
        // 'numpadperiod'	 : 194, // chrome
        'openbracket': 219,
        'backslash': 220,
        'closebracket': 221,
        'å': 221,
        'singlequote': 222,
        'ø': 222,
        'ä': 222,
        '`': 223,
        // 'left or right ⌘ key (firefox)'	224
        'altgr': 225,
        // '< /git >, left back slash'	226
        'GNOME Compose Key': 230,
        'XF86Forward': 233,
        'XF86Back': 234,
        'alphanumeric': 240,
        'hiragana': 242,
        'katakana': 242,
        'half-width': 243,
        'full-width': 243,
        'kanji': 244,
        'unlocktrackpad': 251,
        'toggletouchpad': 255
    };
    return KeyHandler;
}());
exports.KeyHandler = KeyHandler;
//# sourceMappingURL=KeyHandler.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
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
 * @modified 2019-12-18 Added the quadraticBezier(...) function (for the sake of approximating Lissajous curves).
 * @modified 2019-12-20 Added the 'lineWidth' param to the polyline(...) function.
 * @modified 2020-01-09 Added the 'lineWidth' param to the ellipse(...) function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-05-05 Added the 'lineWidth' param to the circle(...) function.
 * @modified 2020-05-12 Drawing any handles (square, circle, diamond) with lineWidth 1 now; this was not reset before.
 * @modified 2020-06-22 Added a context.clearRect() call to the clear() function; clearing with alpha channel did not work as expected.
 * @version  1.5.6
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var CubicBezierCurve_1 = __webpack_require__(5);
var Vertex_1 = __webpack_require__(0);
// Todo: rename this class to Drawutils
var drawutils = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {anvasRenderingContext2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    function drawutils(context, fillShapes) {
        this.ctx = context;
        this.offset = new Vertex_1.Vertex(0, 0);
        this.scale = new Vertex_1.Vertex(1, 1);
        this.fillShapes = fillShapes;
    }
    ;
    /**
     * Called before each draw cycle.
     **/
    drawutils.prototype.beginDrawCycle = function () {
        // NOOP
    };
    ;
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
    drawutils.prototype.line = function (zA, zB, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + zA.x * this.scale.x, this.offset.y + zA.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + zB.x * this.scale.x, this.offset.y + zB.y * this.scale.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 1;
        this.ctx.stroke();
        this.ctx.restore();
    };
    ;
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
    drawutils.prototype.arrow = function (zA, zB, color) {
        var headlen = 8; // length of head in pixels
        // var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
        // var vertices : Array<Vertex> = Vertex.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
        this.ctx.save();
        this.ctx.beginPath();
        var vertices = Vertex_1.Vertex.utils.buildArrowHead(zA, zB, headlen, this.scale.x, this.scale.y);
        this.ctx.moveTo(this.offset.x + zA.x * this.scale.x, this.offset.y + zA.y * this.scale.y);
        for (var i = 0; i < vertices.length; i++) {
            this.ctx.lineTo(this.offset.x + vertices[i].x, this.offset.y + vertices[i].y);
        }
        this.ctx.lineTo(this.offset.x + vertices[0].x, this.offset.y + vertices[0].y);
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    ;
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
    drawutils.prototype.image = function (image, position, size) {
        this.ctx.save();
        // Note that there is a Safari bug with the 3 or 5 params variant.
        // Only the 9-param varaint works.
        this.ctx.drawImage(image, 0, 0, image.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        image.naturalHeight - 1, // To avoid errors substract 1 here.
        this.offset.x + position.x * this.scale.x, this.offset.y + position.y * this.scale.y, size.x * this.scale.x, size.y * this.scale.y);
        this.ctx.restore();
    };
    ;
    /**
     * Draw a rectangle.
     *
     * @param {Vertex} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    drawutils.prototype.rect = function (position, width, height, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + position.x * this.scale.x, this.offset.y + position.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + (position.x + width) * this.scale.x, this.offset.y + position.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + (position.x + width) * this.scale.x, this.offset.y + (position.y + height) * this.scale.y);
        this.ctx.lineTo(this.offset.x + position.x * this.scale.x, this.offset.y + (position.y + height) * this.scale.y);
        // this.ctx.lineTo( this.offset.x+position.x*this.scale.x, this.offset.y+position.y*this.scale.y );
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    ;
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
    // TODO: convert this to a STATIC function.
    drawutils.prototype._fillOrDraw = function (color) {
        if (this.fillShapes) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    };
    ;
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
    drawutils.prototype.cubicBezier = function (startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
        if (startPoint instanceof CubicBezierCurve_1.CubicBezierCurve) {
            this.cubicBezier(startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, color, lineWidth);
            return;
        }
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + startPoint.x * this.scale.x, this.offset.y + startPoint.y * this.scale.y);
        this.ctx.bezierCurveTo(this.offset.x + startControlPoint.x * this.scale.x, this.offset.y + startControlPoint.y * this.scale.y, this.offset.x + endControlPoint.x * this.scale.x, this.offset.y + endControlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        //this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 2;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    ;
    /**
     * Draw the given (quadratic) bézier curve.
     *
     * @method quadraticBezier
     * @param {Vertex} startPoint   - The start point of the cubic Bézier curve
     * @param {Vertex} controlPoint - The control point the cubic Bézier curve.
     * @param {Vertex} endPoint     - The end control point the cubic Bézier curve.
     * @param {string} color        - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.quadraticBezier = function (startPoint, controlPoint, endPoint, color, lineWidth) {
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + startPoint.x * this.scale.x, this.offset.y + startPoint.y * this.scale.y);
        this.ctx.quadraticCurveTo(this.offset.x + controlPoint.x * this.scale.x, this.offset.y + controlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        this.ctx.lineWidth = lineWidth || 2;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    ;
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
    drawutils.prototype.cubicBezierPath = function (path, color) {
        if (!path || path.length == 0)
            return;
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        var curve, startPoint, endPoint, startControlPoint, endControlPoint;
        this.ctx.moveTo(this.offset.x + path[0].x * this.scale.x, this.offset.y + path[0].y * this.scale.y);
        for (var i = 1; i < path.length; i += 3) {
            startControlPoint = path[i];
            endControlPoint = path[i + 1];
            endPoint = path[i + 2];
            this.ctx.bezierCurveTo(this.offset.x + startControlPoint.x * this.scale.x, this.offset.y + startControlPoint.y * this.scale.y, this.offset.x + endControlPoint.x * this.scale.x, this.offset.y + endControlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        }
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    ;
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
    drawutils.prototype.handle = function (startPoint, endPoint) {
        // Draw handles
        // (No need to save and restore here)
        this.point(startPoint, 'rgb(0,32,192)');
        this.square(endPoint, 5, 'rgba(0,128,192,0.5)');
    };
    ;
    /**
     * Draw the given handle cubic Bézier curve handle lines.
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method cubicBezierCurveHandleLines
     * @param {CubicBezierCurve} curve - The curve.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    /* cubicBezierCurveHandleLines( curve:CubicBezierCurve ) {
    // Draw handle lines
    this.cubicBezierHandleLines( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint );
    // this.draw.line( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
    // this.draw.line( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
    }; */
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
    drawutils.prototype.handleLine = function (startPoint, endPoint) {
        // Draw handle lines
        this.line(startPoint, endPoint, 'rgb(192,192,192)');
    };
    ;
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
    drawutils.prototype.dot = function (p, color) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(Math.round(this.offset.x + this.scale.x * p.x), Math.round(this.offset.y + this.scale.y * p.y));
        this.ctx.lineTo(Math.round(this.offset.x + this.scale.x * p.x + 1), Math.round(this.offset.y + this.scale.y * p.y + 1));
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    ;
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
    drawutils.prototype.point = function (p, color) {
        var radius = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x + p.x * this.scale.x, this.offset.y + p.y * this.scale.y, radius, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    };
    ;
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number} lineWidth - The line width (optional, default=1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.circle = function (center, radius, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius * this.scale.x, radius * this.scale.y, 0.0, 0.0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    };
    ;
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number} lineWidth=1 - An optional line width param (default is 1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.ellipse = function (center, radiusX, radiusY, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radiusX * this.scale.x, radiusY * this.scale.y, 0.0, 0.0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    };
    ;
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number} lineWidth - The line with to use (optional, default is 1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.square = function (center, size, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.rect(this.offset.x + (center.x - size / 2.0) * this.scale.x, this.offset.y + (center.y - size / 2.0) * this.scale.y, size * this.scale.x, size * this.scale.y);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    };
    ;
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
    drawutils.prototype.grid = function (center, width, height, sizeX, sizeY, color) {
        this.ctx.beginPath();
        var yMin = -Math.ceil((height * 0.5) / sizeY) * sizeY;
        var yMax = height / 2;
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + yMin) * this.scale.y);
            this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + yMax) * this.scale.y);
        }
        var xMin = -Math.ceil((width * 0.5) / sizeX) * sizeX; // -Math.ceil((height*0.5)/sizeY)*sizeY;
        var xMax = width / 2; // height/2;
        for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
            this.ctx.moveTo(this.offset.x + (center.x + xMin) * this.scale.x - 4, this.offset.y + (center.y + y) * this.scale.y);
            this.ctx.lineTo(this.offset.x + (center.x + xMax) * this.scale.x + 4, this.offset.y + (center.y + y) * this.scale.y);
        }
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
    };
    ;
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
    drawutils.prototype.raster = function (center, width, height, sizeX, sizeY, color) {
        this.ctx.save();
        this.ctx.beginPath();
        var cx = 0, cy = 0;
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            cx++;
            for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
                if (cx == 1)
                    cy++;
                // Draw a crosshair
                this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x - 4, this.offset.y + (center.y + y) * this.scale.y);
                this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x + 4, this.offset.y + (center.y + y) * this.scale.y);
                this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + y) * this.scale.y - 4);
                this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + y) * this.scale.y + 4);
            }
        }
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    ;
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
    drawutils.prototype.diamondHandle = function (center, size, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - size / 2.0, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y - size / 2.0);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + size / 2.0, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y + size / 2.0);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    };
    ;
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
    drawutils.prototype.squareHandle = function (center, size, color) {
        this.ctx.beginPath();
        this.ctx.rect(this.offset.x + center.x * this.scale.x - size / 2.0, this.offset.y + center.y * this.scale.y - size / 2.0, size, size);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    };
    ;
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
    drawutils.prototype.circleHandle = function (center, radius, color) {
        radius = radius || 3;
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    };
    ;
    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.crosshair = function (center, radius, color) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y);
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    ;
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon}  polygon - The polygon to draw.
     * @param {string}   color - The CSS color to draw the polygon with.
     * @param {string}   lineWidth - The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.polygon = function (polygon, color, lineWidth) {
        this.polyline(polygon.vertices, polygon.isOpen, color, lineWidth);
    };
    ;
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices   - The polygon vertices to draw.
     * @param {boolan}   isOpen     - If true the polyline will not be closed at its end.
     * @param {string}   color      - The CSS color to draw the polygon with.
     * @param {number}   lineWidth  - The line width (default is 1.0);
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.polyline = function (vertices, isOpen, color, lineWidth) {
        if (vertices.length <= 1)
            return;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidth || 1.0;
        this.ctx.moveTo(this.offset.x + vertices[0].x * this.scale.x, this.offset.y + vertices[0].y * this.scale.y);
        for (var i = 0; i < vertices.length; i++) {
            this.ctx.lineTo(this.offset.x + vertices[i].x * this.scale.x, this.offset.y + vertices[i].y * this.scale.y);
        }
        if (!isOpen && vertices.length > 2)
            this.ctx.closePath();
        this._fillOrDraw(color);
        this.ctx.setLineDash([]);
        this.ctx.restore();
    };
    ;
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
     * @param {number=} rotation - The (optional) rotation in radians (default=0).
     * @param {string=} color - The color to render the text with (default=black).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.label = function (text, x, y, rotation, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        if (typeof rotation != 'undefined')
            this.ctx.rotate(rotation);
        this.ctx.fillStyle = color || 'black';
        if (this.fillShapes) {
            this.ctx.fillText(text, 0, 0);
        }
        else {
            this.ctx.strokeText(text, 0, 0);
        }
        this.ctx.restore();
    };
    ;
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    drawutils.prototype.clear = function (color) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };
    ;
    return drawutils;
}());
exports.drawutils = drawutils;
//# sourceMappingURL=draw.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A wrapper class for basic drawing operations. This is the WebGL
 * implementation whih sould work with shaders.
 *
 * @require Vertex
 *
 * @author   Ikaros Kappler
 * @date     2019-09-18
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2020-03-25 Ported stub to Typescript.
 * @version  0.0.3
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Vertex_1 = __webpack_require__(0);
var drawutilsgl = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {WebGLRenderingContext} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    function drawutilsgl(context, fillShapes) {
        this.gl = context;
        this.offset = new Vertex_1.Vertex(0, 0);
        this.scale = new Vertex_1.Vertex(1, 1);
        this.fillShapes = fillShapes;
        this._zindex = 0.0;
        if (context == null || typeof context === 'undefined')
            return;
        this.glutils = new GLU(context);
        // PROBLEM: CANNOT USE MULTIPLE SHADER PROGRAM INSTANCES ON THE SAME CONTEXT!
        // SOLUTION: USE SHARED SHADER PROGRAM!!! ... somehow ...
        // This needs to be considered in the overlying component; both draw-instances need to
        // share their gl context.
        // That's what the copyInstace(boolean) method is good for.
        this._vertShader = this.glutils.compileShader(drawutilsgl.vertCode, this.gl.VERTEX_SHADER);
        this._fragShader = this.glutils.compileShader(drawutilsgl.fragCode, this.gl.FRAGMENT_SHADER);
        this._program = this.glutils.makeProgram(this._vertShader, this._fragShader);
        // Create an empty buffer object
        this.vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        console.log('gl initialized');
    }
    ;
    /**
     * Called before each draw cycle.
     **/
    drawutilsgl.prototype.beginDrawCycle = function () {
        this._zindex = 0.0;
    };
    ;
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    drawutilsgl.prototype.copyInstance = function (fillShapes) {
        var copy = new drawutilsgl(null, fillShapes);
        copy.gl = this.gl;
        copy.glutils = this.glutils;
        copy._vertShader = this._vertShader;
        copy._fragShader = this._fragShader;
        copy._program = this._program;
        return copy;
    };
    ;
    drawutilsgl.prototype._x2rel = function (x) { return (this.scale.x * x + this.offset.x) / this.gl.canvas.width * 2.0 - 1.0; };
    ;
    drawutilsgl.prototype._y2rel = function (y) { return (this.offset.y - this.scale.y * y) / this.gl.canvas.height * 2.0 - 1.0; };
    ;
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutilsgl.prototype.line = function (zA, zB, color) {
        var vertices = new Float32Array(6);
        vertices[0] = this._x2rel(zA.x);
        vertices[1] = this._y2rel(zA.y);
        vertices[2] = this._zindex;
        vertices[3] = this._x2rel(zB.x);
        vertices[4] = this._y2rel(zB.y);
        vertices[5] = this._zindex;
        this._zindex += 0.001;
        // Create an empty buffer object
        // const vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        // Bind vertex buffer object
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
        // Get the attribute location
        var coord = this.gl.getAttribLocation(this._program, "position");
        // Point an attribute to the currently bound VBO
        this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the attribute
        this.gl.enableVertexAttribArray(coord);
        // Unbind the buffer?
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        // Set the view port
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        var uRotationVector = this.gl.getUniformLocation(this._program, "uRotationVector");
        // let radians = currentAngle * Math.PI / 180.0;
        var currentRotation = [0.0, 1.0];
        //currentRotation[0] = Math.sin(radians);
        //currentRotation[1] = Math.cos(radians);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        // Draw the line
        this.gl.drawArrays(this.gl.LINES, 0, vertices.length / 3);
        // POINTS, LINE_STRIP, LINE_LOOP, LINES,
        // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    };
    ;
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
    drawutilsgl.prototype.arrow = function (zA, zB, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.image = function (image, position, size) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype._fillOrDraw = function (color) {
        // NOT YET IMPLEMENTED
    };
    ;
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.cubicBezier = function (startPoint, endPoint, startControlPoint, endControlPoint, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.cubicBezierPath = function (path, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.handle = function (startPoint, endPoint) {
        // NOT YET IMPLEMENTED
    };
    ;
    /**
     * Draw the given handle cubic Bézier curve handle lines.
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method cubicBezierCurveHandleLines
     * @param {CubicBezierCurve} curve - The curve.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.cubicBezierCurveHandleLines = function (curve) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.handleLine = function (startPoint, endPoint) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.dot = function (p, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.point = function (p, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.circle = function (center, radius, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.ellipse = function (center, radiusX, radiusY, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.square = function (center, size, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.grid = function (center, width, height, sizeX, sizeY, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.raster = function (center, width, height, sizeX, sizeY, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.diamondHandle = function (center, size, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.squareHandle = function (center, size, color) {
        // NOT YET IMPLEMENTED
    };
    ;
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
    drawutilsgl.prototype.circleHandle = function (center, size, color) {
        // NOT YET IMPLEMENTED
    };
    ;
    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.crosshair = function (center, radius, color) {
        // NOT YET IMPLEMENTED	
    };
    ;
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.polygon = function (polygon, color, lineWidth) {
        var vertices = new Float32Array(polygon.vertices.length * 3);
        for (var i = 0; i < polygon.vertices.length; i++) {
            vertices[i * 3 + 0] = this._x2rel(polygon.vertices[i].x);
            vertices[i * 3 + 1] = this._y2rel(polygon.vertices[i].y);
            vertices[i * 3 + 2] = this._zindex;
        }
        this._zindex += 0.001;
        //console.log( vertices );
        // Create an empty buffer object
        // const vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        // Bind vertex buffer object
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
        // Get the attribute location
        var coord = this.gl.getAttribLocation(this._program, "position");
        // Point an attribute to the currently bound VBO
        this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the attribute
        this.gl.enableVertexAttribArray(coord);
        // Unbind the buffer?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        // Set the view port
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        var uRotationVector = this.gl.getUniformLocation(this._program, "uRotationVector");
        // let radians = currentAngle * Math.PI / 180.0;
        var currentRotation = [0.0, 1.0];
        //currentRotation[0] = Math.sin(radians);
        //currentRotation[1] = Math.cos(radians);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        // Draw the polygon
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, vertices.length / 3);
        // POINTS, LINE_STRIP, LINE_LOOP, LINES,
        // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    };
    ;
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
    drawutilsgl.prototype.polyline = function (vertices, isOpen, color) {
        // NOT YET IMPLEMENTED
    };
    ;
    /**
     * Draw a non-scaling text label at the given position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (aoptional) rotation in radians.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    // +---------------------------------------------------------------------------------
    // | Draw a non-scaling text label at the given position.
    // +-------------------------------
    drawutilsgl.prototype.label = function (text, x, y, rotation) {
        // NOT YET IMPLEMENTED
    };
    ;
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    drawutilsgl.prototype.clear = function (color) {
        // NOT YET IMPLEMENTED
        // if( typeof color == 'string' )
        // color = Color.parse(color); // Color class does not yet exist in TS
        // Clear the canvas
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // Enable the depth test
        this.gl.enable(this.gl.DEPTH_TEST);
        // Clear the color and depth buffer
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    ;
    // Vertex shader source code
    drawutilsgl.vertCode = "\n    precision mediump float;\n\n    attribute vec3 position;\n\n    uniform vec2 uRotationVector;\n\n    void main(void) {\n\tvec2 rotatedPosition = vec2(\n\t    position.x * uRotationVector.y +\n\t\tposition.y * uRotationVector.x,\n\t    position.y * uRotationVector.y -\n\t\tposition.x * uRotationVector.x\n\t);\n\n\tgl_Position = vec4(rotatedPosition, position.z, 1.0);\n    }";
    // Fragment shader source code
    drawutilsgl.fragCode = "\n    precision highp float;\n\n    void main(void) {\n\tgl_FragColor = vec4(0.0,0.75,1.0,1.0);\n    }";
    return drawutilsgl;
}());
exports.drawutilsgl = drawutilsgl;
/**
 * Some GL helper utils.
 **/
var GLU = /** @class */ (function () {
    function GLU(gl) {
        this.gl = gl;
    }
    ;
    GLU.prototype.bufferData = function (verts) {
        // Create an empty buffer object
        var vbuffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.STATIC_DRAW);
        // Unbind the buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        return vbuffer;
    };
    ;
    /*=================== Shaders ====================*/
    GLU.prototype.compileShader = function (shaderCode, shaderType) {
        // Create a vertex shader object
        var shader = this.gl.createShader(shaderType);
        // Attach vertex shader source code
        this.gl.shaderSource(shader, shaderCode);
        // Compile the vertex shader
        this.gl.compileShader(shader);
        var vertStatus = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!vertStatus) {
            console.warn("Error in shader:" + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    ;
    GLU.prototype.makeProgram = function (vertShader, fragShader) {
        // Create a shader program object to store
        // the combined shader program
        var program = this.gl.createProgram();
        // Attach a vertex shader
        this.gl.attachShader(program, vertShader);
        // Attach a fragment shader
        this.gl.attachShader(program, fragShader);
        // Link both the programs
        this.gl.linkProgram(program);
        // Use the combined shader program object
        this.gl.useProgram(program);
        /*======= Do some cleanup ======*/
        this.gl.detachShader(program, vertShader);
        this.gl.detachShader(program, fragShader);
        this.gl.deleteShader(vertShader);
        this.gl.deleteShader(fragShader);
        return program;
    };
    ;
    return GLU;
}());
//# sourceMappingURL=drawgl.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Imports for webpack */

window.VertexAttr = __webpack_require__(4).VertexAttr;
window.VertexListeners = __webpack_require__(10).VertexListeners;
window.Vertex = __webpack_require__(0).Vertex;

window.Bounds = __webpack_require__(1).Bounds;
window.Grid = __webpack_require__(11).Grid;
window.Line = __webpack_require__(2).Line;
window.Vector = __webpack_require__(3).Vector;
window.CubicBezierCurve = __webpack_require__(5).CubicBezierCurve;
window.BezierPath = __webpack_require__(6).BezierPath;
window.Polygon = __webpack_require__(7).Polygon;
window.Triangle = __webpack_require__(8).Triangle;
window.VEllipse = __webpack_require__(14).VEllipse;
window.Circle = __webpack_require__(9).Circle;
window.PBImage = __webpack_require__(15).PBImage;
window.MouseHandler = __webpack_require__(16).MouseHandler;
window.KeyHandler = __webpack_require__(17).KeyHandler;
window.drawutils = __webpack_require__(18).drawutils;
window.drawutilsgl = __webpack_require__(19).drawutilsgl;
window.geomutils = __webpack_require__(13).geomutils;
window.PlotBoilerplate = __webpack_require__(21).PlotBoilerplate;



/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @classdesc The main class of the PlotBoilerplate.
 *
 * @requires Vertex, Line, Vector, Polygon, PBImage, VEllipse, Circle, MouseHandler, KeyHandler, VertexAttr, CubicBezierCurve, BezierPath, Triangle, drawutils, drawutilsgl
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
 * @modified 2020-02-06 Added handling for the end- and end-control-points of non-cirular Bézier paths (was still missing).
 * @modified 2020-02-06 Fixed a drag-amount bug in the move handling of end points of Bezier paths (control points was not properly moved when non circular).
 * @modified 2020-03-28 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-03-29 Fixed the enableSVGExport flag (read enableEport before).
 * @modified 2020-05-09 Included the Cirlcle class.
 * @modified 2020-06-22 Added the rasterScaleX and rasterScaleY config params.
 * @modified 2020-06-03 Fixed the selectedVerticesOnPolyon(Polygon) function: non-selectable vertices were selected too, before.
 * @modified 2020-06-06 Replacing Touchy.js by AlloyFinger.js
 * @version  1.8.2
 *
 * @file PlotBoilerplate
 * @fileoverview The main class.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var draw_1 = __webpack_require__(18);
var drawgl_1 = __webpack_require__(19);
var BezierPath_1 = __webpack_require__(6);
var Bounds_1 = __webpack_require__(1);
var Circle_1 = __webpack_require__(9);
var Grid_1 = __webpack_require__(11);
var KeyHandler_1 = __webpack_require__(17);
var Line_1 = __webpack_require__(2);
var MouseHandler_1 = __webpack_require__(16);
var PBImage_1 = __webpack_require__(15);
var Polygon_1 = __webpack_require__(7);
var SVGBuilder_1 = __webpack_require__(22);
var Triangle_1 = __webpack_require__(8);
var VEllipse_1 = __webpack_require__(14);
var Vector_1 = __webpack_require__(3);
var Vertex_1 = __webpack_require__(0);
var VertexAttr_1 = __webpack_require__(4);
var PlotBoilerplate = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name PlotBoilerplate
     * @public
     * @param {object} config={} - The configuration.
     * @param {HTMLCanvasElement} config.canvas - Your canvas element in the DOM (required).
     * @param {boolean=} [config.fullSize=true] - If set to true the canvas will gain full window size.
     * @param {boolean=} [config.fitToParent=true] - If set to true the canvas will gain the size of its parent container (overrides fullSize).
     * @param {number=}  [config.scaleX=1.0] - The initial x-zoom. Default is 1.0.
     * @param {number=}  [config.scaleY=1.0] - The initial y-zoom. Default is 1.0.
     * @param {number=}  [config.offsetX=1.0] - The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {number=}  [config.offsetY=1.0] - The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {boolean=} [config.rasterGrid=true] - If set to true the background grid will be drawn rastered.
     * @param {boolean=} [config.rasterScaleX=1.0] - Define the default horizontal raster scale (default=1.0).
     * @param {boolean=} [config.rasterScaleY=1.0] - Define the default vertical raster scale (default=1.0).
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
     * @param {boolean=} [config.autoDetectRetina=true] - When set to true (default) the canvas will try to use the display's pixel ratio.
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
     * @param {boolean=} [config.enableKeys=true] - Indicates if the application should handle key events for you.
     * @param {boolean=} [config.enableMouseWheel=true] - Indicates if the application should handle mouse wheel events for you.
     * @param {boolean=} [config.enableGL=false] - Indicates if the application should use the experimental WebGL features (not recommended).
     * @param {boolean=} [config.enableSVGExport=true] - Indicates if the SVG export should be enabled (default is true).
     *                                                   Note that changes from the postDraw hook might not be visible in the export.
     */
    function PlotBoilerplate(config) {
        // This should be in some static block ...
        VertexAttr_1.VertexAttr.model = { bezierAutoAdjust: false, renderTime: 0, selectable: true, isSelected: false, draggable: true };
        if (typeof config.canvas == 'undefined')
            throw "No canvas specified.";
        /**
         * A global config that's attached to the dat.gui control interface.
         *
         * @member {Object}
         * @memberof PlotBoilerplate
         * @instance
         */
        this.config = {
            canvas: config.canvas,
            fullSize: PlotBoilerplate.utils.fetch.val(config, 'fullSize', true),
            fitToParent: PlotBoilerplate.utils.fetch.bool(config, 'fitToParent', true),
            scaleX: PlotBoilerplate.utils.fetch.num(config, 'scaleX', 1.0),
            scaleY: PlotBoilerplate.utils.fetch.num(config, 'scaleY', 1.0),
            offsetX: PlotBoilerplate.utils.fetch.num(config, 'offsetX', 0.0),
            offsetY: PlotBoilerplate.utils.fetch.num(config, 'offsetY', 0.0),
            rasterGrid: PlotBoilerplate.utils.fetch.bool(config, 'rasterGrid', true),
            rasterScaleX: PlotBoilerplate.utils.fetch.num(config, 'rasterScaleX', 1.0),
            rasterScaleY: PlotBoilerplate.utils.fetch.num(config, 'rasterScaleY', 1.0),
            rasterAdjustFactor: PlotBoilerplate.utils.fetch.num(config, 'rasterAdjustdFactror', 2.0),
            drawOrigin: PlotBoilerplate.utils.fetch.bool(config, 'drawOrigin', false),
            autoAdjustOffset: PlotBoilerplate.utils.fetch.val(config, 'autoAdjustOffset', true),
            offsetAdjustXPercent: PlotBoilerplate.utils.fetch.num(config, 'offsetAdjustXPercent', 50),
            offsetAdjustYPercent: PlotBoilerplate.utils.fetch.num(config, 'offsetAdjustYPercent', 50),
            backgroundColor: config.backgroundColor || '#ffffff',
            redrawOnResize: PlotBoilerplate.utils.fetch.bool(config, 'redrawOnResize', true),
            defaultCanvasWidth: PlotBoilerplate.utils.fetch.num(config, 'defaultCanvasWidth', PlotBoilerplate.DEFAULT_CANVAS_WIDTH),
            defaultCanvasHeight: PlotBoilerplate.utils.fetch.num(config, 'defaultCanvasHeight', PlotBoilerplate.DEFAULT_CANVAS_HEIGHT),
            canvasWidthFactor: PlotBoilerplate.utils.fetch.num(config, 'canvasWidthFactor', 1.0),
            canvasHeightFactor: PlotBoilerplate.utils.fetch.num(config, 'canvasHeightFactor', 1.0),
            cssScaleX: PlotBoilerplate.utils.fetch.num(config, 'cssScaleX', 1.0),
            cssScaleY: PlotBoilerplate.utils.fetch.num(config, 'cssScaleY', 1.0),
            cssUniformScale: PlotBoilerplate.utils.fetch.bool(config, 'cssUniformScale', true),
            saveFile: function () { _self.hooks.saveFile(_self); },
            setToRetina: function () { _self._setToRetina(); },
            autoDetectRetina: PlotBoilerplate.utils.fetch.bool(config, 'autoDetectRetina', true),
            enableSVGExport: PlotBoilerplate.utils.fetch.bool(config, 'enableSVGExport', true),
            // Listeners/observers
            preClear: PlotBoilerplate.utils.fetch.func(config, 'preClear', null),
            preDraw: PlotBoilerplate.utils.fetch.func(config, 'preDraw', null),
            postDraw: PlotBoilerplate.utils.fetch.func(config, 'postDraw', null),
            // Interaction
            enableMouse: PlotBoilerplate.utils.fetch.bool(config, 'enableMouse', true),
            enableTouch: PlotBoilerplate.utils.fetch.bool(config, 'enableTouch', true),
            enableKeys: PlotBoilerplate.utils.fetch.bool(config, 'enableKeys', true),
            enableMouseWheel: PlotBoilerplate.utils.fetch.bool(config, 'enableMouseWheel', true),
            // Experimental (and unfinished)
            enableGL: PlotBoilerplate.utils.fetch.bool(config, 'enableGL', false)
        }; // END confog
        /**
         * Configuration for drawing things.
         *
         * @member {Object}
         * @memberof PlotBoilerplate
         * @instance
         */
        this.drawConfig = {
            drawVertices: true,
            drawBezierHandleLines: PlotBoilerplate.utils.fetch.bool(config, 'drawBezierHandleLines', true),
            drawBezierHandlePoints: PlotBoilerplate.utils.fetch.bool(config, 'drawBezierHandlePoints', true),
            drawHandleLines: PlotBoilerplate.utils.fetch.bool(config, 'drawHandleLines', true),
            drawHandlePoints: PlotBoilerplate.utils.fetch.bool(config, 'drawHandlePoints', true),
            drawGrid: PlotBoilerplate.utils.fetch.bool(config, 'drawGrid', true),
            bezier: {
                color: '#00a822',
                lineWidth: 2,
                handleLine: {
                    color: 'rgba(180,180,180,0.5)',
                    lineWidth: 1
                }
            },
            polygon: {
                color: '#0022a8',
                lineWidth: 1
            },
            triangle: {
                color: '#6600ff',
                lineWidth: 1
            },
            ellipse: {
                color: '#2222a8',
                lineWidth: 1
            },
            circle: {
                color: '#22a8a8',
                lineWidth: 2
            },
            vertex: {
                color: '#a8a8a8',
                lineWidth: 1
            },
            line: {
                color: '#a844a8',
                lineWidth: 1
            },
            vector: {
                color: '#ff44a8',
                lineWidth: 1
            },
            image: {
                color: '#a8a8a8',
                lineWidth: 1
            }
        }; // END drawConfig
        // +---------------------------------------------------------------------------------
        // | Object members.
        // +-------------------------------
        this.canvas = typeof config.canvas == 'string' ? document.getElementById(config.canvas) : config.canvas;
        if (this.config.enableGL) {
            this.ctx = this.canvas.getContext('webgl'); // webgl-experimental?
            this.draw = new drawgl_1.drawutilsgl(this.ctx, false);
            // PROBLEM: same instance of fill and draw when using WebGL. Shader program cannot be duplicated on the same context
            this.fill = this.draw.copyInstance(true);
            console.warn('Initialized with experimental mode enableGL=true. Note that this is not yet fully implemented.');
        }
        else {
            this.ctx = this.canvas.getContext('2d');
            this.draw = new draw_1.drawutils(this.ctx, false);
            this.fill = new draw_1.drawutils(this.ctx, true);
        }
        this.draw.scale.set(this.config.scaleX, this.config.scaleY);
        this.fill.scale.set(this.config.scaleX, this.config.scaleY);
        this.grid = new Grid_1.Grid(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(50, 50));
        this.canvasSize = { width: PlotBoilerplate.DEFAULT_CANVAS_WIDTH, height: PlotBoilerplate.DEFAULT_CANVAS_HEIGHT };
        this.vertices = [];
        this.selectPolygon = null;
        this.draggedElements = [];
        this.drawables = [];
        this.console = console;
        this.hooks = {
            // This is changable from the outside
            saveFile: PlotBoilerplate._saveFile
        };
        var _self = this;
        // TODO: this should be placed in the caller and work for modules/global, too!
        if (window)
            window.addEventListener('resize', function () { return _self.resizeCanvas(); });
        this.resizeCanvas();
        if (config.autoDetectRetina) {
            this._setToRetina();
        }
        this.installInputListeners();
        // Apply the configured CSS scale.
        this.updateCSSscale();
        // Init	
        this.redraw();
        // Gain focus
        this.canvas.focus();
    }
    ; // END constructor
    /**
     * This function opens a save-as file dialog and – once an output file is
     * selected – stores the current canvas contents as an SVG image.
     *
     * It is the default hook for saving files and can be overwritten.
     *
     * @method _saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    PlotBoilerplate._saveFile = function (pb) {
        var svgCode = new SVGBuilder_1.SVGBuilder().build(pb.drawables, { canvasSize: pb.canvasSize, offset: pb.draw.offset, zoom: pb.draw.scale });
        var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" });
        // See documentation for FileSaver.js for usage.
        //    https://github.com/eligrey/FileSaver.js
        if (typeof window["saveAs"] != "function")
            throw "Cannot save file; did you load the ./utils/savefile helper function an the eligrey/SaveFile library?";
        var _saveAs = window["saveAs"];
        _saveAs(blob, "plotboilerplate.svg");
    };
    ;
    /**
     * This function sets the canvas resolution to factor 2.0 (or the preferred pixel ratio of your device) for retina displays.
     * Please not that in non-GL mode this might result in very slow rendering as the canvas buffer size may increase.
     *
     * @method _setToRetina
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    PlotBoilerplate.prototype._setToRetina = function () {
        this.config.autoDetectRetina = true;
        var pixelRatio = window.devicePixelRatio || 1;
        this.config.cssScaleX = this.config.cssScaleY = 1.0 / pixelRatio; // 0.5;
        this.config.canvasWidthFactor = this.config.canvasHeightFactor = pixelRatio; // 2.0;
        // this.config.fullSize = false;
        // this.config.fitToParent = false;
        //console.log( 'pixelRatio', pixelRatio );
        this.resizeCanvas();
        this.updateCSSscale();
    };
    ;
    /**
     * Set the current zoom and draw offset to fit the given bounds.
     *
     * This method currently restores the aspect zoom ratio.
     *
     **/
    PlotBoilerplate.prototype.fitToView = function (bounds) {
        //const viewport:Bounds = this.viewport();
        var canvasCenter = new Vertex_1.Vertex(this.canvasSize.width / 2.0, this.canvasSize.height / 2.0);
        var canvasRatio = this.canvasSize.width / this.canvasSize.height;
        var ratio = bounds.width / bounds.height;
        // Find the new draw offset
        // const center:Vertex = new Vertex( bounds.max.x - bounds.width/2.0, bounds.max.y - bounds.height/2.0 );
        var center = new Vertex_1.Vertex(bounds.max.x - bounds.width / 2.0, bounds.max.y - bounds.height / 2.0)
            .inv()
            .addXY(this.canvasSize.width / 2.0, this.canvasSize.height / 2.0);
        //center.addXY( this.canvasSize.width/2.0, this.canvasSize.height/2.0 );
        // But keep the old center of bounds
        //this.setOffset( center.clone().inv().addXY( this.canvasSize.width/2.0, this.canvasSize.height/2.0 ) );
        this.setOffset(center);
        if (canvasRatio < ratio) {
            var newUniformZoom = this.canvasSize.width / bounds.width;
            this.setZoom(newUniformZoom, newUniformZoom, canvasCenter);
            // this.setZoom( viewport.height/bounds.height, viewport.height/bounds.height, center );
            //this.setZoom( viewport.width/bounds.width, viewport.width/bounds.width, center );
        }
        else {
            var newUniformZoom = this.canvasSize.height / bounds.height;
            this.setZoom(newUniformZoom, newUniformZoom, canvasCenter);
            // this.setZoom( this.canvasSize.width/bounds.width, this.canvasSize.width/bounds.width, center );
        }
        this.redraw();
    };
    ;
    /**
     * Set the console for this instance.
     *
     * @method setConsole
     * @param {Console} con - The new console object (default is window.console).
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.setConsole = function (con) {
        if (typeof con.log != 'function')
            throw "Console object must have a 'log' function.";
        if (typeof con.warn != 'function')
            throw "Console object must have a 'warn' function.";
        if (typeof con.error != 'function')
            throw "Console object must have a 'error' function.";
        this.console = con;
    };
    ;
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
    PlotBoilerplate.prototype.updateCSSscale = function () {
        if (this.config.cssUniformScale) {
            PlotBoilerplate.utils.setCSSscale(this.canvas, this.config.cssScaleX, this.config.cssScaleX);
        }
        else {
            PlotBoilerplate.utils.setCSSscale(this.canvas, this.config.cssScaleX, this.config.cssScaleY);
        }
    };
    ;
    /**
     * Add a drawable object.<br>
     * <br>
     * This must be either:<br>
     * <pre>
     *  * a Vertex
     *  * a Line
     *  * a Vector
     *  * a VEllipse
     *  * a Circle
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
    PlotBoilerplate.prototype.add = function (drawable, redraw) {
        if (Array.isArray(drawable)) {
            var arr = drawable;
            // for( var i in arr )
            for (var i = 0; i < arr.length; i++)
                this.add(arr[i]);
        }
        else if (drawable instanceof Vertex_1.Vertex) {
            this.drawables.push(drawable);
            this.vertices.push(drawable);
        }
        else if (drawable instanceof Line_1.Line) {
            // Add some lines
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
        }
        else if (drawable instanceof Vector_1.Vector) {
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
        }
        else if (drawable instanceof VEllipse_1.VEllipse) {
            this.vertices.push(drawable.center);
            this.vertices.push(drawable.axis);
            this.drawables.push(drawable);
            drawable.center.listeners.addDragListener(function (e) {
                drawable.axis.add(e.params.dragAmount);
            });
        }
        else if (drawable instanceof Circle_1.Circle) {
            this.vertices.push(drawable.center);
            this.drawables.push(drawable);
        }
        else if (drawable instanceof Polygon_1.Polygon) {
            this.drawables.push(drawable);
            // for( var i in drawable.vertices )
            for (var i = 0; i < drawable.vertices.length; i++)
                this.vertices.push(drawable.vertices[i]);
        }
        else if (drawable instanceof Triangle_1.Triangle) {
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
            this.vertices.push(drawable.c);
        }
        else if (drawable instanceof BezierPath_1.BezierPath) {
            this.drawables.push(drawable);
            var bezierPath = drawable;
            for (var i = 0; i < bezierPath.bezierCurves.length; i++) {
                if (!drawable.adjustCircular && i == 0)
                    this.vertices.push(bezierPath.bezierCurves[i].startPoint);
                this.vertices.push(bezierPath.bezierCurves[i].endPoint);
                this.vertices.push(bezierPath.bezierCurves[i].startControlPoint);
                this.vertices.push(bezierPath.bezierCurves[i].endControlPoint);
                bezierPath.bezierCurves[i].startControlPoint.attr.selectable = false;
                bezierPath.bezierCurves[i].endControlPoint.attr.selectable = false;
            }
            PlotBoilerplate.utils.enableBezierPathAutoAdjust(drawable);
        }
        else if (drawable instanceof PBImage_1.PBImage) {
            this.vertices.push(drawable.upperLeft);
            this.vertices.push(drawable.lowerRight);
            this.drawables.push(drawable);
            // Todo: think about a IDragEvent interface
            drawable.upperLeft.listeners.addDragListener(function (e) {
                drawable.lowerRight.add(e.params.dragAmount);
            });
            drawable.lowerRight.attr.selectable = false;
        }
        else {
            throw "Cannot add drawable of unrecognized type: " + (typeof drawable) + ".";
        }
        // This is a workaround for backwards compatibility when the 'redraw' param was not yet present.
        if (redraw || typeof redraw == 'undefined')
            this.redraw();
    };
    ;
    /**
     * Remove a drawable object.<br>
     * <br>
     * This must be either:<br>
     * <pre>
     *  * a Vertex
     *  * a Line
     *  * a Vector
     *  * a VEllipse
     *  * a Circle
     *  * a Polygon
     *  * a BezierPath
     *  * a BPImage
     *  * a Triangle
     * </pre>
     *
     * @param {Object} drawable - The drawable (of one of the allowed class instance) to remove.
     * @param {boolean} [redraw=false]
     * @method remove
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.remove = function (drawable, redraw) {
        if (drawable instanceof Vertex_1.Vertex)
            this.removeVertex(drawable, false);
        for (var i = 0; i < this.drawables.length; i++) {
            if (this.drawables[i] === drawable) {
                this.drawables.splice(i, 1);
                // Check if some listeners need to be removed
                if (drawable instanceof BezierPath_1.BezierPath)
                    PlotBoilerplate.utils.disableBezierPathAutoAdjust(drawable);
                if (redraw)
                    this.redraw();
                return;
            }
        }
    };
    ;
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
    PlotBoilerplate.prototype.removeVertex = function (vert, redraw) {
        // for( var i in this.drawables ) {
        for (var i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i] === vert) {
                this.vertices.splice(i, 1);
                if (redraw)
                    this.redraw();
                return;
            }
        }
    };
    ;
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
    PlotBoilerplate.prototype.drawGrid = function () {
        var gScale = {
            x: Grid_1.Grid.utils.mapRasterScale(this.config.rasterAdjustFactor, this.draw.scale.x) * this.config.rasterScaleX / this.config.cssScaleX,
            y: Grid_1.Grid.utils.mapRasterScale(this.config.rasterAdjustFactor, this.draw.scale.y) * this.config.rasterScaleY / this.config.cssScaleY
        };
        var gSize = { width: this.grid.size.x * gScale.x, height: this.grid.size.y * gScale.y };
        var cs = { width: this.canvasSize.width / 2, height: this.canvasSize.height / 2 };
        var offset = this.draw.offset.clone().inv();
        offset.x = (Math.round(offset.x + cs.width) / Math.round(gSize.width)) * (gSize.width) / this.draw.scale.x + (((this.draw.offset.x - cs.width) / this.draw.scale.x) % gSize.width);
        offset.y = (Math.round(offset.y + cs.height) / Math.round(gSize.height)) * (gSize.height) / this.draw.scale.y + (((this.draw.offset.y - cs.height) / this.draw.scale.x) % gSize.height);
        if (this.drawConfig.drawGrid) {
            if (this.config.rasterGrid) // TODO: move config member to drawConfig
                this.draw.raster(offset, (this.canvasSize.width) / this.draw.scale.x, (this.canvasSize.height) / this.draw.scale.y, gSize.width, gSize.height, 'rgba(0,128,255,0.125)');
            else
                this.draw.grid(offset, (this.canvasSize.width) / this.draw.scale.x, (this.canvasSize.height) / this.draw.scale.y, gSize.width, gSize.height, 'rgba(0,128,255,0.095)');
        }
    };
    ;
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
    PlotBoilerplate.prototype.drawOrigin = function () {
        // Add a crosshair to mark the origin
        this.draw.crosshair({ x: 0, y: 0 }, 10, '#000000');
    };
    ;
    /**
     * This is just a tiny helper function to determine the render color of vertices.
     **/
    PlotBoilerplate.prototype._handleColor = function (h, color) {
        return h.attr.draggable ? color : 'rgba(128,128,128,0.5)';
    };
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
    PlotBoilerplate.prototype.drawDrawables = function (renderTime) {
        // Draw drawables
        for (var i in this.drawables) {
            var d = this.drawables[i];
            if (d instanceof BezierPath_1.BezierPath) {
                for (var c in d.bezierCurves) {
                    this.draw.cubicBezier(d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.color, this.drawConfig.bezier.lineWidth);
                    if (this.drawConfig.drawBezierHandlePoints && this.drawConfig.drawHandlePoints) {
                        if (!d.bezierCurves[c].startPoint.attr.bezierAutoAdjust) {
                            this.draw.diamondHandle(d.bezierCurves[c].startPoint, 7, this._handleColor(d.bezierCurves[c].startPoint, 'orange'));
                            d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                        }
                        if (!d.bezierCurves[c].endPoint.attr.bezierAutoAdjust) {
                            this.draw.diamondHandle(d.bezierCurves[c].endPoint, 7, this._handleColor(d.bezierCurves[c].endPoint, 'orange'));
                            d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                        }
                        this.draw.circleHandle(d.bezierCurves[c].startControlPoint, 3, this._handleColor(d.bezierCurves[c].startControlPoint, '#008888'));
                        this.draw.circleHandle(d.bezierCurves[c].endControlPoint, 3, this._handleColor(d.bezierCurves[c].endControlPoint, '#008888'));
                        d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                        d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                    }
                    else {
                        d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                        d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                        d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                        d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                    }
                    if (this.drawConfig.drawBezierHandleLines && this.drawConfig.drawHandleLines) {
                        this.draw.line(d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth);
                        this.draw.line(d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth);
                    }
                }
            }
            else if (d instanceof Polygon_1.Polygon) {
                this.draw.polygon(d, this.drawConfig.polygon.color, this.drawConfig.polygon.lineWidth);
                if (!this.drawConfig.drawHandlePoints) {
                    for (var i in d.vertices)
                        d.vertices[i].attr.renderTime = renderTime;
                }
            }
            else if (d instanceof Triangle_1.Triangle) {
                this.draw.polyline([d.a, d.b, d.c], false, this.drawConfig.triangle.color, this.drawConfig.triangle.lineWidth);
                if (!this.drawConfig.drawHandlePoints)
                    d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
            }
            else if (d instanceof VEllipse_1.VEllipse) {
                if (this.drawConfig.drawHandleLines) {
                    this.draw.line(d.center.clone().add(0, d.axis.y - d.center.y), d.axis, '#c8c8c8');
                    this.draw.line(d.center.clone().add(d.axis.x - d.center.x, 0), d.axis, '#c8c8c8');
                }
                this.draw.ellipse(d.center, Math.abs(d.axis.x - d.center.x), Math.abs(d.axis.y - d.center.y), this.drawConfig.ellipse.color, this.drawConfig.ellipse.lineWidth);
                if (!this.drawConfig.drawHandlePoints) {
                    d.center.attr.renderTime = renderTime;
                    d.axis.attr.renderTime = renderTime;
                }
            }
            else if (d instanceof Circle_1.Circle) {
                this.draw.circle(d.center, d.radius, this.drawConfig.circle.color, this.drawConfig.circle.lineWidth);
            }
            else if (d instanceof Vertex_1.Vertex) {
                if (this.drawConfig.drawVertices &&
                    (!d.attr.selectable || !d.attr.draggable)) {
                    // Draw as special point (grey)
                    this.draw.circleHandle(d, 7, this.drawConfig.vertex.color);
                    d.attr.renderTime = renderTime;
                }
            }
            else if (d instanceof Line_1.Line) {
                this.draw.line(d.a, d.b, this.drawConfig.line.color, this.drawConfig.line.lineWidth);
                if (!this.drawConfig.drawHandlePoints || !d.a.attr.selectable)
                    d.a.attr.renderTime = renderTime;
                if (!this.drawConfig.drawHandlePoints || !d.b.attr.selectable)
                    d.b.attr.renderTime = renderTime;
            }
            else if (d instanceof Vector_1.Vector) {
                this.draw.arrow(d.a, d.b, this.drawConfig.vector.color); // , this.drawConfig.vector.lineWidth );
                if (this.drawConfig.drawHandlePoints && d.b.attr.selectable) {
                    this.draw.circleHandle(d.b, 3, '#a8a8a8');
                }
                else {
                    d.b.attr.renderTime = renderTime;
                }
                if (!this.drawConfig.drawHandlePoints || !d.a.attr.selectable)
                    d.a.attr.renderTime = renderTime;
                if (!this.drawConfig.drawHandlePoints || !d.b.attr.selectable)
                    d.b.attr.renderTime = renderTime;
            }
            else if (d instanceof PBImage_1.PBImage) {
                if (this.drawConfig.drawHandleLines)
                    this.draw.line(d.upperLeft, d.lowerRight, this.drawConfig.image.color, this.drawConfig.image.lineWidth);
                this.fill.image(d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft));
                if (this.drawConfig.drawHandlePoints) {
                    this.draw.circleHandle(d.lowerRight, 3, this.drawConfig.image.color);
                    d.lowerRight.attr.renderTime = renderTime;
                }
            }
            else {
                this.console.error('Cannot draw object. Unknown class.'); //  ' + d.constructor.name + '.' );
            }
        }
    };
    ;
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
    PlotBoilerplate.prototype.drawSelectPolygon = function () {
        // Draw select polygon?
        if (this.selectPolygon != null && this.selectPolygon.vertices.length > 0) {
            this.draw.polygon(this.selectPolygon, '#888888');
            this.draw.crosshair(this.selectPolygon.vertices[0], 3, '#008888');
        }
    };
    ;
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
    PlotBoilerplate.prototype.drawVertices = function (renderTime) {
        // Draw all vertices as small squares if they were not already drawn by other objects
        for (var i in this.vertices) {
            if (this.drawConfig.drawVertices && this.vertices[i].attr.renderTime != renderTime) {
                this.draw.squareHandle(this.vertices[i], 5, this.vertices[i].attr.isSelected ? 'rgba(192,128,0)' : this._handleColor(this.vertices[i], 'rgb(0,128,192)'));
            }
        }
    };
    ;
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
    PlotBoilerplate.prototype.redraw = function () {
        var renderTime = new Date().getTime();
        if (this.config.preClear)
            this.config.preClear();
        this.clear();
        if (this.config.preDraw)
            this.config.preDraw();
        // Tell the drawing library that a new drawing cycle begins (required for the GL lib).
        this.draw.beginDrawCycle();
        this.fill.beginDrawCycle();
        this.drawGrid();
        if (this.config.drawOrigin)
            this.drawOrigin();
        this.drawDrawables(renderTime);
        this.drawVertices(renderTime);
        this.drawSelectPolygon();
        if (this.config.postDraw)
            this.config.postDraw();
    };
    ; // END redraw
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
    PlotBoilerplate.prototype.clear = function () {
        // Note that elements might have an alpha channel. Clear the scene first.
        this.draw.clear(this.config.backgroundColor);
    };
    ;
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
    PlotBoilerplate.prototype.clearSelection = function (redraw) {
        for (var i in this.vertices)
            this.vertices[i].attr.isSelected = false;
        if (redraw)
            this.redraw();
        return this;
    };
    ;
    /**
     * Get the current view port.
     *
     * @method viewPort
     * @instance
     * @memberof PlotBoilerplate
     * @return {Bounds} The current viewport.
     **/
    PlotBoilerplate.prototype.viewport = function () {
        return new Bounds_1.Bounds(this.transformMousePosition(0, 0), this.transformMousePosition(this.canvasSize.width * this.config.cssScaleX, this.canvasSize.height * this.config.cssScaleY));
    };
    ;
    /**
     * Trigger the saveFile.hook.
     *
     * @method saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.saveFile = function () {
        this.hooks.saveFile(this);
    };
    ;
    /**
     * Get the available inner space of the given container.
     *
     * Size minus padding minus border.
     **/
    PlotBoilerplate.prototype.getAvailableContainerSpace = function () {
        var _self = this;
        // var container : HTMLElement = _self.canvas.parentNode;
        var container = _self.canvas.parentNode; // Element | Document | DocumentFragment;
        var canvas = _self.canvas;
        canvas.style.display = 'none';
        var padding = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding')) || 0, border = parseFloat(window.getComputedStyle(canvas, null).getPropertyValue('border-width')) || 0, pl = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-left')) || padding, pr = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-right')) || padding, pt = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-top')) || padding, pb = parseFloat(window.getComputedStyle(container, null).getPropertyValue('padding-bottom')) || padding, bl = parseFloat(window.getComputedStyle(canvas, null).getPropertyValue('border-left-width')) || border, br = parseFloat(window.getComputedStyle(canvas, null).getPropertyValue('border-right-width')) || border, bt = parseFloat(window.getComputedStyle(canvas, null).getPropertyValue('border-top-width')) || border, bb = parseFloat(window.getComputedStyle(canvas, null).getPropertyValue('border-bottom-width')) || border;
        var w = container.clientWidth;
        var h = container.clientHeight;
        canvas.style.display = 'block';
        return { width: (w - pl - pr - bl - br), height: (h - pt - pb - bt - bb) };
    };
    ;
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
    PlotBoilerplate.prototype.resizeCanvas = function () {
        var _self = this;
        var _setSize = function (w, h) {
            w *= _self.config.canvasWidthFactor;
            h *= _self.config.canvasHeightFactor;
            _self.canvas.width = w;
            _self.canvas.height = h;
            _self.canvasSize.width = w;
            _self.canvasSize.height = h;
            if (_self.config.autoAdjustOffset) {
                _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX = w * (_self.config.offsetAdjustXPercent / 100);
                _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY = h * (_self.config.offsetAdjustYPercent / 100);
            }
        };
        if (_self.config.fullSize && !_self.config.fitToParent) {
            // Set editor size
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            _self.canvas.style.position = 'absolute';
            _self.canvas.style.width = (_self.config.canvasWidthFactor * width) + 'px';
            _self.canvas.style.height = (_self.config.canvasWidthFactor * height) + 'px';
            _self.canvas.style.top = '0px';
            _self.canvas.style.left = '0px';
            _setSize(width, height);
        }
        else if (_self.config.fitToParent) {
            // Set editor size
            _self.canvas.style.position = 'absolute';
            var space = this.getAvailableContainerSpace();
            // window.alert( space.width + " " + space.height );
            _self.canvas.style.width = (_self.config.canvasWidthFactor * space.width) + 'px';
            _self.canvas.style.height = (_self.config.canvasHeightFactor * space.height) + 'px';
            _self.canvas.style.top = null;
            _self.canvas.style.left = null;
            _setSize(space.width, space.height);
        }
        else {
            _self.canvas.style.width = null;
            _self.canvas.style.height = null;
            _setSize(_self.config.defaultCanvasWidth, _self.config.defaultCanvasHeight);
        }
        if (_self.config.redrawOnResize)
            _self.redraw();
    };
    ;
    /**
     *  Add all vertices inside the polygon to the current selection.<br>
     *
     * @method selectVerticesInPolygon
     * @param {Polygon} polygon - The polygonal selection area.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.selectVerticesInPolygon = function (polygon) {
        for (var i in this.vertices) {
            if (this.vertices[i].attr.selectable && polygon.containsVert(this.vertices[i]))
                this.vertices[i].attr.isSelected = true;
        }
    };
    ;
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
     * @return {IDraggable} Or false if none found.
     **/
    PlotBoilerplate.prototype.locatePointNear = function (point, tolerance) {
        var _self = this;
        // var tolerance = 7;
        if (typeof tolerance == 'undefined')
            tolerance = 7;
        // Apply the zoom (the tolerant area should not shrink or grow when zooming)
        tolerance /= _self.draw.scale.x;
        // Search in vertices
        // for( var vindex in _self.vertices ) {
        for (var vindex = 0; vindex < _self.vertices.length; vindex++) {
            var vert = _self.vertices[vindex];
            if ((vert.attr.draggable || vert.attr.selectable) && vert.distance(point) < tolerance) {
                // { type : 'vertex', vindex : vindex };
                return new PlotBoilerplate.Draggable(vert, PlotBoilerplate.Draggable.VERTEX).setVIndex(vindex);
            }
        }
        return null;
    };
    /**
     * Handle left-click event.<br>
     *
     * @method handleClick
     * @param {number} x - The click X position on the canvas.
     * @param {number} y - The click Y position on the canvas.
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.handleClick = function (x, y) {
        var _self = this;
        var p = this.locatePointNear(_self.transformMousePosition(x, y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
        if (p) {
            if (this.keyHandler && this.keyHandler.isDown('shift')) {
                if (p.typeName == 'bpath') {
                    var vert = _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid);
                    if (vert.attr.selectable)
                        vert.attr.isSelected = !vert.attr.isSelected;
                }
                else if (p.typeName == 'vertex') {
                    var vert = _self.vertices[p.vindex];
                    if (vert.attr.selectable)
                        vert.attr.isSelected = !vert.attr.isSelected;
                }
                _self.redraw();
            }
            else if (this.keyHandler.isDown('y') /* && p.type=='bpath' && (p.pid==BezierPath.START_POINT || p.pid==BezierPath.END_POINT) */) {
                _self.vertices[p.vindex].attr.bezierAutoAdjust = !_self.vertices[p.vindex].attr.bezierAutoAdjust;
                _self.redraw();
            }
        }
        else if (_self.selectPolygon != null) {
            var vert = _self.transformMousePosition(x, y);
            _self.selectPolygon.vertices.push(new Vertex_1.Vertex(vert.x, vert.y));
            _self.redraw();
        }
    };
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
    PlotBoilerplate.prototype.transformMousePosition = function (x, y) {
        return { x: (x / this.config.cssScaleX - this.config.offsetX) / (this.config.scaleX),
            y: (y / this.config.cssScaleY - this.config.offsetY) / (this.config.scaleY) };
    };
    ;
    /**
     * (Helper) The mouse-down handler.
     *
     * It selects vertices for dragging.
     *
     * @method mouseDownHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.mouseDownHandler = function (e) {
        var _self = this;
        if (e.which != 1) // && !(window.TouchEvent && e.originalEvent instanceof TouchEvent) )
            return; // Only react on left mouse or touch events
        var p = _self.locatePointNear(_self.transformMousePosition(e.params.pos.x, e.params.pos.y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
        if (!p)
            return;
        // Drag all selected elements?
        if (p.typeName == 'vertex' && _self.vertices[p.vindex].attr.isSelected) {
            // Multi drag
            // for( var i in _self.vertices ) {
            for (var i = 0; i < _self.vertices.length; i++) {
                if (_self.vertices[i].attr.isSelected) {
                    _self.draggedElements.push(new PlotBoilerplate.Draggable(_self.vertices[i], PlotBoilerplate.Draggable.VERTEX).setVIndex(i));
                    _self.vertices[i].listeners.fireDragStartEvent(e);
                }
            }
        }
        else {
            // Single drag
            if (!_self.vertices[p.vindex].attr.draggable)
                return;
            _self.draggedElements.push(p);
            if (p.typeName == 'bpath')
                _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent(e);
            else if (p.typeName == 'vertex')
                _self.vertices[p.vindex].listeners.fireDragStartEvent(e);
        }
        _self.redraw();
    };
    ;
    /**
     * The mouse-drag handler.
     *
     * It moves selected elements around or performs the panning if the ctrl-key if
     * hold down.
     *
     * @method mouseDownHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.mouseDragHandler = function (e) {
        var _self = this;
        var oldDragAmount = { x: e.params.dragAmount.x, y: e.params.dragAmount.y };
        e.params.dragAmount.x /= _self.config.cssScaleX;
        e.params.dragAmount.y /= _self.config.cssScaleY;
        // Important note to: this.keyHandler.isDown('ctrl')
        //    We should not use this for any input.
        //    Reason: most browsers use [Ctrl]+[t] to create new browser tabs.
        //            If so, the key-up event for [Ctrl] will be fired in the _new tab_,
        //            not this one. So this tab will never receive any [Ctrl-down] events
        //            until next keypress; the implication is, that [Ctrl] would still
        //            considered to be pressed which is not true.
        if (this.keyHandler.isDown('alt') || this.keyHandler.isDown('spacebar')) {
            _self.setOffset(_self.draw.offset.clone().add(e.params.dragAmount));
            _self.redraw();
        }
        else {
            // Convert drag amount by scaling
            // Warning: this possibly invalidates the dragEvent for other listeners!
            //          Rethink the solution when other features are added.
            e.params.dragAmount.x /= _self.draw.scale.x;
            e.params.dragAmount.y /= _self.draw.scale.y;
            for (var i in _self.draggedElements) {
                var p = _self.draggedElements[i];
                if (p.typeName == 'bpath') {
                    _self.paths[p.pindex].moveCurvePoint(p.cindex, p.pid, new Vertex_1.Vertex(e.params.dragAmount.x, e.params.dragAmount.y));
                    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent(e);
                }
                else if (p.typeName == 'vertex') {
                    if (!_self.vertices[p.vindex].attr.draggable)
                        continue;
                    _self.vertices[p.vindex].add(e.params.dragAmount);
                    _self.vertices[p.vindex].listeners.fireDragEvent(e);
                }
            }
        }
        // Restore old event values!
        e.params.dragAmount.x = oldDragAmount.x;
        e.params.dragAmount.y = oldDragAmount.y;
        _self.redraw();
    };
    ;
    /**
     * The mouse-up handler.
     *
     * It clears the dragging-selection.
     *
     * @method mouseUpHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.mouseUpHandler = function (e) {
        var _self = this;
        if (e.which != 1)
            return; // Only react on left mouse;
        if (!e.params.wasDragged)
            _self.handleClick(e.params.pos.x, e.params.pos.y);
        for (var i in _self.draggedElements) {
            var p = _self.draggedElements[i];
            if (p.typeName == 'bpath') {
                _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent(e);
            }
            else if (p.typeName == 'vertex') {
                _self.vertices[p.vindex].listeners.fireDragEndEvent(e);
            }
        }
        _self.draggedElements = [];
        _self.redraw();
    };
    ;
    /**
     * The mouse-wheel handler.
     *
     * It performs the zooming.
     *
     * @method mouseWheelHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.mouseWheelHandler = function (e) {
        var zoomStep = 1.25; // Make configurable?
        // CHANGED replaced _self by this
        var _self = this;
        var we = e;
        if (we.deltaY < 0) {
            _self.setZoom(_self.config.scaleX * zoomStep, _self.config.scaleY * zoomStep, new Vertex_1.Vertex(e.params.pos.x, e.params.pos.y));
        }
        else if (we.deltaY > 0) {
            _self.setZoom(_self.config.scaleX / zoomStep, _self.config.scaleY / zoomStep, new Vertex_1.Vertex(e.params.pos.x, e.params.pos.y));
        }
        e.preventDefault();
        _self.redraw();
    };
    ;
    /**
     * Set the new draw offset.
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {Vertex} newOffset - The new draw offset to use.
     **/
    PlotBoilerplate.prototype.setOffset = function (newOffset) {
        this.draw.offset.set(newOffset);
        this.fill.offset.set(newOffset);
        this.config.offsetX = newOffset.x;
        this.config.offsetY = newOffset.y;
    };
    ;
    /**
    * Set a new zoom value (and re-adjust the draw offset).
    *
    * Note: the function will not trigger any redraws.
    *
    * @param {number} zoomFactorX - The new horizontal zoom value.
    * @param {number} zoomFactorY - The new vertical zoom value.
    * @param {Vertex} interactionPos - The position of mouse/touch interaction.
    **/
    PlotBoilerplate.prototype.setZoom = function (zoomFactorX, zoomFactorY, interactionPos) {
        var oldPos = this.transformMousePosition(interactionPos.x, interactionPos.y);
        this.draw.scale.x = this.fill.scale.x = this.config.scaleX = Math.max(zoomFactorX, 0.01);
        this.draw.scale.y = this.fill.scale.y = this.config.scaleY = Math.max(zoomFactorY, 0.01);
        var newPos = this.transformMousePosition(interactionPos.x, interactionPos.y);
        var newOffsetX = this.draw.offset.x + (newPos.x - oldPos.x) * this.draw.scale.x;
        var newOffsetY = this.draw.offset.y + (newPos.y - oldPos.y) * this.draw.scale.y;
        this.setOffset({ x: newOffsetX, y: newOffsetY });
    };
    PlotBoilerplate.prototype.installInputListeners = function () {
        var _self = this;
        if (this.config.enableMouse) {
            // Install a mouse handler on the canvas.
            new MouseHandler_1.MouseHandler(this.canvas)
                .down(function (e) { _self.mouseDownHandler(e); })
                .drag(function (e) { _self.mouseDragHandler(e); })
                .up(function (e) { _self.mouseUpHandler(e); });
        }
        else {
            _self.console.log('Mouse interaction disabled.');
        }
        if (this.config.enableMouseWheel) {
            // Install a mouse handler on the canvas.
            new MouseHandler_1.MouseHandler(this.canvas)
                .wheel(function (e) { _self.mouseWheelHandler(e); });
        }
        else {
            _self.console.log('Mouse wheel interaction disabled.');
        }
        if (this.config.enableTouch) {
            // Install a touch handler on the canvas.
            var relPos_1 = function (pos) {
                return { x: pos.x - _self.canvas.offsetLeft,
                    y: pos.y - _self.canvas.offsetTop
                };
            };
            if (window["AlloyFinger"] && typeof window["AlloyFinger"] == "function") {
                // console.log('Alloy finger found.');
                try {
                    // Do not include AlloyFinger itself to the library
                    // (17kb, but we want to keep this lib as tiny as possible).
                    var AF = window["AlloyFinger"];
                    var touchMovePos = null;
                    var touchDownPos = null;
                    var draggedElement = null;
                    var multiTouchStartScale = null;
                    var clearTouch = function () {
                        touchMovePos = null;
                        touchDownPos = null;
                        draggedElement = null;
                        multiTouchStartScale = null;
                    };
                    var af = new AF(this.canvas, {
                        touchStart: function (e) {
                            if (e.touches.length == 1) {
                                touchMovePos = new Vertex_1.Vertex(relPos_1({ x: e.touches[0].clientX, y: e.touches[0].clientY }));
                                touchDownPos = new Vertex_1.Vertex(relPos_1({ x: e.touches[0].clientX, y: e.touches[0].clientY }));
                                draggedElement = _self.locatePointNear(_self.transformMousePosition(touchMovePos.x, touchMovePos.y), PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
                            }
                        },
                        touchMove: function (e) {
                            if (e.touches.length == 1 && draggedElement) {
                                e.preventDefault();
                                e.stopPropagation();
                                var rel = relPos_1({ x: e.touches[0].clientX, y: e.touches[0].clientY }); //  points[0] );
                                var trans = _self.transformMousePosition(rel.x, rel.y);
                                var diff = new Vertex_1.Vertex(_self.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
                                if (draggedElement.typeName == 'vertex') {
                                    if (!_self.vertices[draggedElement.vindex].attr.draggable)
                                        return;
                                    _self.vertices[draggedElement.vindex].add(diff);
                                    var draggingVertex = _self.vertices[draggedElement.vindex];
                                    var fakeEvent = { params: { dragAmount: diff.clone(), wasDragged: true, mouseDownPos: touchDownPos.clone(), mouseDragPos: touchDownPos.clone().add(diff), vertex: draggingVertex } };
                                    draggingVertex.listeners.fireDragEvent(fakeEvent);
                                    _self.redraw();
                                }
                                touchMovePos = new Vertex_1.Vertex(rel);
                            }
                            else if (e.touches.length == 2) {
                                // If at least two fingers touch and move, then change the draw offset (panning).
                                e.preventDefault();
                                e.stopPropagation();
                                _self.setOffset(_self.draw.offset.clone().addXY(e.deltaX, e.deltaY)); // Apply zoom?
                                _self.redraw();
                            }
                        },
                        touchEnd: function (e) {
                            clearTouch();
                        },
                        touchCancel: function (e) {
                            clearTouch();
                        },
                        multipointStart: function (e) {
                            multiTouchStartScale = _self.draw.scale.clone();
                        },
                        multipointEnd: function (e) {
                            multiTouchStartScale = null;
                        },
                        pinch: function (e) {
                            // For pinching there must be at least two touch items
                            var fingerA = new Vertex_1.Vertex(e.touches.item(0).clientX, e.touches.item(0).clientY);
                            var fingerB = new Vertex_1.Vertex(e.touches.item(1).clientX, e.touches.item(1).clientY);
                            var center = new Line_1.Line(fingerA, fingerB).vertAt(0.5);
                            _self.setZoom(multiTouchStartScale.x * e.zoom, multiTouchStartScale.y * e.zoom, center);
                            _self.redraw();
                        }
                    });
                }
                catch (e) {
                    console.error("Failed to initialize AlloyFinger!");
                    console.error(e);
                }
                ;
            }
            else if (window["Touchy"] && typeof window["Touchy"] == "function") {
                console.warn('(Deprecation) Found Touchy which support will stop soon. Please use AlloyFinger instead.');
                // Convert absolute touch positions to relative DOM element position (relative to canvas)
                // Some private vars to store the current mouse/position/button state.
                var touchMovePos = null;
                var touchDownPos = null;
                var draggedElement = null;
                var Touchy = (window["Touchy"]);
                new Touchy(this.canvas, { one: function (hand, finger) {
                        touchMovePos = new Vertex_1.Vertex(relPos_1(finger.lastPoint));
                        touchDownPos = new Vertex_1.Vertex(relPos_1(finger.lastPoint));
                        draggedElement = _self.locatePointNear(_self.transformMousePosition(touchMovePos.x, touchMovePos.y), PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
                        if (draggedElement) {
                            // The Touchy-points also have 'id' and 'time' attributes
                            // which we are not interested in here.
                            hand.on('move', function (points) {
                                var rel = relPos_1(points[0]);
                                var trans = _self.transformMousePosition(rel.x, rel.y);
                                var diff = new Vertex_1.Vertex(_self.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
                                if (draggedElement.typeName == 'vertex') {
                                    if (!_self.vertices[draggedElement.vindex].attr.draggable)
                                        return;
                                    _self.vertices[draggedElement.vindex].add(diff);
                                    var draggingVertex = _self.vertices[draggedElement.vindex];
                                    var fakeEvent = { params: { dragAmount: diff.clone(), wasDragged: true, mouseDownPos: touchDownPos.clone(), mouseDragPos: touchDownPos.clone().add(diff), vertex: draggingVertex } };
                                    draggingVertex.listeners.fireDragEvent(fakeEvent);
                                    _self.redraw();
                                }
                                touchMovePos = new Vertex_1.Vertex(rel);
                            });
                        }
                    }
                });
            }
            else {
                console.warn("Cannot initialize the touch handler. Touchy and AlloyFinger are missig. Did you include at least one of them?");
            }
        }
        else {
            _self.console.log('Touch interaction disabled.');
        }
        if (this.config.enableKeys) {
            // Install key handler
            this.keyHandler = new KeyHandler_1.KeyHandler({ trackAll: true })
                .down('escape', function () {
                _self.clearSelection(true);
            })
                .down('shift', function () {
                _self.selectPolygon = new Polygon_1.Polygon();
                _self.redraw();
            })
                .up('shift', function () {
                // Find and select vertices in the drawn area
                if (_self.selectPolygon == null)
                    return;
                _self.selectVerticesInPolygon(_self.selectPolygon);
                _self.selectPolygon = null;
                _self.redraw();
            });
        } // END IF enableKeys?
        else {
            _self.console.log('Keyboard interaction disabled.');
        }
    };
    /**
     * Creates a control GUI (a dat.gui instance) for this
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui.GUI}
     **/
    PlotBoilerplate.prototype.createGUI = function () {
        // This function moved to the helper utils.
        // We do not want to include the whole dat.GUI package.
        // TODO: move to demos.
        if (window["utils"] && typeof window["utils"].createGUI == "function")
            return window["utils"].createGUI(this);
        else
            throw "Cannot create dat.GUI instance; did you load the ./utils/creategui helper function an the dat.GUI library?";
    };
    ;
    var _a;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_CANVAS_WIDTH = 1024;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_CANVAS_HEIGHT = 768;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_CLICK_TOLERANCE = 8;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE = 32;
    /**
     * A wrapper class for draggable items (mostly vertices).
     * @private
     **/
    PlotBoilerplate.Draggable = (_a = /** @class */ (function () {
            function class_1(item, typeName) {
                this.item = item;
                this.typeName = typeName;
            }
            ;
            class_1.prototype.isVertex = function () { return this.typeName == PlotBoilerplate.Draggable.VERTEX; };
            ;
            class_1.prototype.setVIndex = function (vindex) { this.vindex = vindex; return this; };
            ;
            return class_1;
        }()),
        _a.VERTEX = 'vertex',
        _a);
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
        safeMergeByKeys: function (base, extension) {
            for (var k in base) {
                if (!extension.hasOwnProperty(k))
                    continue;
                var typ = typeof base[k];
                try {
                    if (typ == 'boolean')
                        base[k] = !!JSON.parse(extension[k]);
                    else if (typ == 'number')
                        base[k] = JSON.parse(extension[k]) * 1;
                    else if (typ == 'function' && typeof extension[k] == 'function')
                        base[k] = extension[k];
                    else
                        base[k] = extension[k];
                }
                catch (e) {
                    console.error('error in key ', k, extension[k], e);
                }
            }
            return base;
        },
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
        setCSSscale: function (element, scaleX, scaleY) {
            element.style['transform-origin'] = '0 0';
            if (scaleX == 1.0 && scaleY == 1.0)
                element.style.transform = null;
            else
                element.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
        },
        // A helper for fetching data from objects.
        fetch: {
            /**
             * A helper function to the the object property value specified by the given key.
             *
             * @param {any} object   - The object to get the property's value from. Must not be null.
             * @param {string} key      - The key of the object property (the name).
             * @param {any}    fallback - A default value if the key does not exist.
             **/
            val: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] == 'undefined')
                    return fallback;
                return obj[key];
            },
            /**
             * A helper function to the the object property numeric value specified by the given key.
             *
             * @param {any}    object   - The object to get the property's value from. Must not be null.
             * @param {string} key      - The key of the object property (the name).
             * @param {number} fallback - A default value if the key does not exist.
             * @return {number}
             **/
            num: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] !== 'number')
                    return fallback;
                return obj[key];
            },
            /**
             * A helper function to the the object property boolean value specified by the given key.
             *
             * @param {any}     object   - The object to get the property's value from. Must not be null.
             * @param {string}  key      - The key of the object property (the name).
             * @param {boolean} fallback - A default value if the key does not exist.
             * @return {boolean}
             **/
            bool: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] !== 'boolean')
                    return fallback;
                return obj[key];
            },
            /**
             * A helper function to the the object property function-value specified by the given key.
             *
             * @param {any}      object   - The object to get the property's value from. Must not be null.
             * @param {string}   key      - The key of the object property (the name).
             * @param {function} fallback - A default value if the key does not exist.
             * @return {function}
             **/
            func: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] !== 'function')
                    return fallback;
                return obj[key];
            }
        },
        /**
         * Installs vertex listeners to the path's vertices so that controlpoints
         * move with their path points when dragged.
         *
         * Bézier path points with attr.bezierAutoAdjust==true will have their
         * two control points audo-updated if moved, too (keep path connections smooth).
         *
         * @param {BezierPath} bezierPath - The path to use auto-adjustment for.
         **/
        enableBezierPathAutoAdjust: function (bezierPath) {
            for (var i = 0; i < bezierPath.bezierCurves.length; i++) {
                // This should be wrapped into the BezierPath implementation.
                bezierPath.bezierCurves[i].startPoint.listeners.addDragListener(function (e) {
                    var cindex = bezierPath.locateCurveByStartPoint(e.params.vertex);
                    bezierPath.bezierCurves[cindex].startPoint.addXY(-e.params.dragAmount.x, -e.params.dragAmount.y);
                    bezierPath.moveCurvePoint(cindex * 1, bezierPath.START_POINT, e.params.dragAmount);
                    bezierPath.updateArcLengths();
                });
                bezierPath.bezierCurves[i].startControlPoint.listeners.addDragListener(function (e) {
                    var cindex = bezierPath.locateCurveByStartControlPoint(e.params.vertex);
                    if (!bezierPath.bezierCurves[cindex].startPoint.attr.bezierAutoAdjust)
                        return;
                    bezierPath.adjustPredecessorControlPoint(cindex * 1, true, // obtain handle length?
                    false // update arc lengths
                    );
                    bezierPath.updateArcLengths();
                });
                bezierPath.bezierCurves[i].endControlPoint.listeners.addDragListener(function (e) {
                    var cindex = bezierPath.locateCurveByEndControlPoint(e.params.vertex);
                    if (!bezierPath.bezierCurves[cindex % bezierPath.bezierCurves.length].endPoint.attr.bezierAutoAdjust)
                        return;
                    bezierPath.adjustSuccessorControlPoint(cindex * 1, true, // obtain handle length?
                    false // update arc lengths
                    );
                    bezierPath.updateArcLengths();
                });
                if (i + 1 == bezierPath.bezierCurves.length) { // && !bezierPath.adjustCircular ) { 
                    // Move last control point with the end point (if not circular)
                    bezierPath.bezierCurves[bezierPath.bezierCurves.length - 1].endPoint.listeners.addDragListener(function (e) {
                        if (!bezierPath.adjustCircular) {
                            var cindex = bezierPath.locateCurveByEndPoint(e.params.vertex);
                            bezierPath.moveCurvePoint(cindex * 1, bezierPath.END_CONTROL_POINT, new Vertex_1.Vertex({ x: e.params.dragAmount.x, y: e.params.dragAmount.y }));
                        }
                        bezierPath.updateArcLengths();
                    });
                }
            } // END for
        },
        /**
         * Removes vertex listeners from the path's vertices. This needs to be called
         * when BezierPaths are removed from the canvas.
         *
         * Sorry, this is not yet implemented.
         *
         * @param {BezierPath} bezierPath - The path to use un-auto-adjustment for.
         **/
        disableBezierPathAutoAdjust: function (bezierPath) {
            // How to determine which listeners are mine???
            /*
              for( var i = 0; i < bezierPath.bezierCurves.length; i++ ) {
            // Just try to remove listeners from all vertices on the Bézier path.
            // No matter if there are not listeners installed for some reason.
            bezierPath.bezierCurves[i].startPoint.listeners.removeDragListener( );
            }
            */
        }
    }; // END utils
    return PlotBoilerplate;
}()); // END class PlotBoilerplate
exports.PlotBoilerplate = PlotBoilerplate;
//# sourceMappingURL=PlotBoilerplate.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A default SVG builder.
 *
 * Todos:
 *  + use a Drawable interface
 *  + use a SVGSerializable interface
 *
 * @require Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-12-04
 * @modified 2019-11-07 Added the 'Triangle' style class.
 * @modified 2019-11-13 Added the <?xml ...?> tag.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version  1.0.3
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var SVGBuilder = /** @class */ (function () {
    function SVGBuilder() {
    }
    ;
    /**
     *  Builds the SVG code from the given list of drawables.
     *
     * @param {object[]} drawables - The drawable elements (should implement Drawable) to be converted (each must have a toSVGString-function).
     * @param {object}   options  - { canvasSize, zoom, offset }
     * @return {string}
     **/
    SVGBuilder.prototype.build = function (drawables, options) {
        var nl = '\n';
        var indent = '  ';
        var buffer = [];
        buffer.push('<?xml version="1.0" encoding="UTF-8"?>' + nl);
        buffer.push('<svg width="' + options.canvasSize.width + '" height="' + options.canvasSize.height + '"');
        buffer.push(' viewBox="');
        buffer.push('0');
        buffer.push(' ');
        buffer.push('0');
        buffer.push(' ');
        buffer.push(options.canvasSize.width.toString());
        buffer.push(' ');
        buffer.push(options.canvasSize.height.toString());
        buffer.push('"');
        buffer.push(' xmlns="http://www.w3.org/2000/svg">' + nl);
        buffer.push(indent + '<defs>' + nl);
        buffer.push(indent + '<style>' + nl);
        buffer.push(indent + indent + ' .Vertex { fill : blue; stroke : none; } ' + nl);
        buffer.push(indent + indent + ' .Triangle { fill : none; stroke : turquoise; stroke-width : 1px; } ' + nl);
        buffer.push(indent + indent + ' .Polygon { fill : none; stroke : green; stroke-width : 2px; } ' + nl);
        buffer.push(indent + indent + ' .BezierPath { fill : none; stroke : blue; stroke-width : 2px; } ' + nl);
        buffer.push(indent + indent + ' .VEllipse { fill : none; stroke : black; stroke-width : 1px; } ' + nl);
        buffer.push(indent + indent + ' .Line { fill : none; stroke : purple; stroke-width : 1px; } ' + nl);
        buffer.push(indent + '</style>' + nl);
        buffer.push(indent + '</defs>' + nl);
        buffer.push(indent + '<g class="main-g"');
        if (options.zoom || options.offset) {
            buffer.push(' transform="');
            if (options.zoom)
                buffer.push('scale(' + options.zoom.x + ',' + options.zoom.y + ')');
            if (options.offset)
                buffer.push(' translate(' + options.offset.x + ',' + options.offset.y + ')');
            buffer.push('"');
        }
        buffer.push('>' + nl);
        for (var i in drawables) {
            var d = drawables[i];
            if (typeof d.toSVGString == 'function') {
                buffer.push(indent + indent);
                buffer.push(d.toSVGString({ 'className': d.className }));
                buffer.push(nl);
            }
            else {
                console.warn('Unrecognized drawable type has no toSVGString()-function. Ignoring: ' + d.className);
            }
        }
        buffer.push(indent + '</g>' + nl);
        buffer.push('</svg>' + nl);
        return buffer.join('');
    };
    ;
    return SVGBuilder;
}());
exports.SVGBuilder = SVGBuilder;
//# sourceMappingURL=SVGBuilder.js.map

/***/ })
/******/ ]);
});