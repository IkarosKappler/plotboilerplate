"use strict";
/**
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
 * @modified 2020-07-24 Added the getClosestT function and the helper function locateIntervalByDistance(...).
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGPathData` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-10-17 The `CubicBezierCurve` class now implements the new `PathSegment` interface.
 * @modified 2023-09-30 Added the function `CubicbezierCurve.getSubCurve(number,number)` – similar to `getSubCurveAt(...)` but with absolute position parameters.
 * @modified 2023-10-07 Added the `trimEnd`, `trimEndAt`, `trimStart`, `trimStartAt` methods.
 * @modified 2025-04-09 Added the `CubicBezierCurve.move` method to match the convention – which just calls `translate`.
 * @modified 2025-04-09 Modified the `CubicBezierCurve.translate` method: chaning parameter `Vertex` to more generalized `XYCoords`.
 * @modified 2025-04-13 Changed visibility of `CubicBezierCurve.utils` from 'private' to  'public'.
 * @modified 2025-04-13 Added helper function `CubicBezierCurve.utils.bezierCoeffs`.
 * @modified 2025-04-13 Added helper functopn `CubicBezierCurve.utils.sgn(number)` for division safe sign calculation.
 * @modified 2025-03-13 Class `CubicBezierCurve` is now implementing interface `Intersectable`.
 * @modified 2025-04-18 Added evaluation method for cubic Bézier curves `CubicBezierCurve.utils.evaluateT`.
 * @modified 2025-04-18 Refactored method `CubicBezierCurve.getPointAt` to use `evaluateT`.
 * @modified 2025-04-18 Fixed the `CubicBezierCurve.getBounds` method: now returning the real bounding box. Before it was an approximated one.
 * @modified 2025-ß4-18 Added helper methods for bounding box calculation `CubucBezierCurve.util.cubicPolyMinMax` and `cubicPoly`.
 * @version 2.9.0
 *
 * @file CubicBezierCurve
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicBezierCurve = void 0;
var Bounds_1 = require("./Bounds");
var UIDGenerator_1 = require("./UIDGenerator");
var Vertex_1 = require("./Vertex");
var Vector_1 = require("./Vector");
/**
 * @classdesc A refactored cubic bezier curve class.
 *
 * @requires Bounds
 * @requires Vertex
 * @requires Vector
 * @requires XYCoords
 * @requires UID
 * @requires UIDGenerator
 */
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
        this.uid = UIDGenerator_1.UIDGenerator.next();
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
        // this.arcLength = null;
        this.updateArcLengths();
    }
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
            console.log("[CubicBezierCurve.moveCurvePoint] pointID '".concat(pointID, "' invalid."));
        }
        if (updateArcLengths)
            this.updateArcLengths();
    };
    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {XYCoords} amount - The amount to translate this curve by.
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
    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {XYCoords} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    CubicBezierCurve.prototype.move = function (amount) {
        return this.translate(amount);
    };
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
        var pointA = this.startPoint.clone();
        var pointB = new Vertex_1.Vertex(0, 0);
        var curveStep = 1.0 / this.curveIntervals;
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
    /**
     * Get a 't' (relative position on curve) with the closest distance to point 'p'.
     *
     * The returned number is 0.0 <= t <= 1.0. Use the getPointAt(t) function to retrieve the actual curve point.
     *
     * This function uses a recursive approach by cutting the curve into several linear segments.
     *
     * @method getClosestT
     * @instance
     * @memberof CubicBezierCurve
     * @param {Vertex} p - The point to find the closest position ('t' on the curve).
     * @return {number}
     **/
    CubicBezierCurve.prototype.getClosestT = function (p) {
        // We would like to have an error that's not larger than 1.0.
        var desiredEpsilon = 1.0;
        var result = { t: 0, tPrev: 0.0, tNext: 1.0 };
        var iteration = 0;
        do {
            result = this.locateIntervalByDistance(p, result.tPrev, result.tNext, this.curveIntervals);
            iteration++;
            // Be sure: stop after 4 iterations
        } while (iteration < 4 && this.getPointAt(result.tPrev).distance(this.getPointAt(result.tNext)) > desiredEpsilon);
        return result.t;
    };
    /**
     * This helper function locates the 't' on a fixed step interval with the minimal distance
     * between the curve (at 't') and the given point.
     *
     * Furthermore you must specify a sub curve (start 't' and end 't') you want to search on.
     * Using tStart=0.0 and tEnd=1.0 will search on the full curve.
     *
     * @param {Vertex} p - The point to find the closest curve point for.
     * @param {number} tStart - The start position (start 't' of the sub curve). Should be >= 0.0.
     * @param {number} tEnd - The end position (end 't' of the sub curve). Should be <= 1.0.
     * @param {number} stepCount - The number of steps to check within the interval.
     *
     * @return {object} - An object with t, tPrev and tNext (numbers).
     **/
    CubicBezierCurve.prototype.locateIntervalByDistance = function (p, tStart, tEnd, stepCount) {
        var minIndex = -1;
        var minDist = 0;
        var t = 0.0;
        var tDiff = tEnd - tStart;
        for (var i = 0; i <= stepCount; i++) {
            t = tStart + tDiff * (i / stepCount);
            var vert = this.getPointAt(t);
            var dist = vert.distance(p);
            if (minIndex == -1 || dist < minDist) {
                minIndex = i;
                minDist = dist;
            }
        }
        return {
            t: tStart + tDiff * (minIndex / stepCount),
            tPrev: tStart + tDiff * (Math.max(0, minIndex - 1) / stepCount),
            tNext: tStart + tDiff * (Math.min(stepCount, minIndex + 1) / stepCount)
        };
    };
    //--- BEGIN --- Implement interface `IBounded`
    /**
     * Get the bounds of this bezier curve.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @method getClosestT
     * @instance
     * @memberof CubicBezierCurve
     * @return {Bounds} The bounds of this ellipse.
     **/
    CubicBezierCurve.prototype.getBounds = function () {
        // Thanks to Richard "RM" for the Bézier bounds calculatin
        //    https://jsfiddle.net/SalixAlba/QQnvm/4/
        var xMinMax = CubicBezierCurve.utils.cubicPolyMinMax(this.startPoint.x, this.startControlPoint.x, this.endControlPoint.x, this.endPoint.x);
        var xl = xMinMax.min;
        var xh = xMinMax.max;
        var yMinMax = CubicBezierCurve.utils.cubicPolyMinMax(this.startPoint.y, this.startControlPoint.y, this.endControlPoint.y, this.endPoint.y);
        var yl = yMinMax.min;
        var yh = yMinMax.max;
        return Bounds_1.Bounds.computeFromVertices([
            { x: xl, y: yl },
            { x: xl, y: yh },
            { x: xh, y: yh },
            { x: xh, y: yl }
        ]);
    };
    //--- END --- Implement interface `IBounded`
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
        throw new Error("Invalid point ID '".concat(id, "'."));
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
    CubicBezierCurve.prototype.getPointAt = function (t) {
        // Perform some powerful math magic
        // TODO: cleanup
        // const x: number =
        //   this.startPoint.x * Math.pow(1.0 - t, 3) +
        //   this.startControlPoint.x * 3 * t * Math.pow(1.0 - t, 2) +
        //   this.endControlPoint.x * 3 * Math.pow(t, 2) * (1.0 - t) +
        //   this.endPoint.x * Math.pow(t, 3);
        // const y: number =
        //   this.startPoint.y * Math.pow(1.0 - t, 3) +
        //   this.startControlPoint.y * 3 * t * Math.pow(1.0 - t, 2) +
        //   this.endControlPoint.y * 3 * Math.pow(t, 2) * (1.0 - t) +
        //   this.endPoint.y * Math.pow(t, 3);
        var x = CubicBezierCurve.utils.evaluateT(this.startPoint.x, this.startControlPoint.x, this.endControlPoint.x, this.endPoint.x, t);
        var y = CubicBezierCurve.utils.evaluateT(this.startPoint.y, this.startControlPoint.y, this.endControlPoint.y, this.endPoint.y, t);
        return new Vertex_1.Vertex(x, y);
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
    CubicBezierCurve.prototype.getPoint = function (u) {
        return this.getPointAt(u / this.arcLength);
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
    CubicBezierCurve.prototype.getTangentAt = function (t) {
        var a = this.getStartPoint();
        var b = this.getStartControlPoint();
        var c = this.getEndControlPoint();
        var d = this.getEndPoint();
        // This is the shortened one
        var t2 = t * t;
        // (1 - t)^2 = (1-t)*(1-t) = 1 - t - t + t^2 = 1 - 2*t + t^2
        var nt2 = 1 - 2 * t + t2;
        var tX = -3 * a.x * nt2 + b.x * (3 * nt2 - 6 * (t - t2)) + c.x * (6 * (t - t2) - 3 * t2) + 3 * d.x * t2;
        var tY = -3 * a.y * nt2 + b.y * (3 * nt2 - 6 * (t - t2)) + c.y * (6 * (t - t2) - 3 * t2) + 3 * d.y * t2;
        // Note: my implementation does NOT normalize tangent vectors!
        return new Vertex_1.Vertex(tX, tY);
    };
    /**
     * Trim off a start section of this curve. The position parameter `uValue` is the absolute position on the
     * curve in `[0...arcLength]`.
     * The remaining curve will be the one in the bounds `[uValue,1]` (so `[0.0,uValue]` is cut off).
     *
     * Note this function just converts the absolute parameter to a relative one and call `trimStartAt`.
     *
     * @method trimStart
     * @instance
     * @memberof CubicBezierCurve
     * @param {number} uValue - The absolute position parameter where to cut off the head curve.
     * @returns {CubicBezierCurve} `this` for chanining.
     */
    CubicBezierCurve.prototype.trimStart = function (uValue) {
        return this.trimStartAt(this.convertU2T(uValue));
    };
    /**
     * Trim off a start section of this curve. The position parameter `t` is the relative position in [0..1].
     * The remaining curve will be the one in the bounds `[uValue,1]` (so `[0.0,uValue]` is cut off).
     *
     * @method trimStartAt
     * @instance
     * @memberof CubicBezierCurve
     * @param {number} t - The relative position parameter where to cut off the head curve.
     * @returns {CubicBezierCurve} `this` for chanining.
     */
    CubicBezierCurve.prototype.trimStartAt = function (t) {
        var subCurbePoints = CubicBezierCurve.utils.getSubCurvePointsAt(this, t, 1.0);
        this.startPoint.set(subCurbePoints[0]);
        this.startControlPoint.set(subCurbePoints[2]);
        this.endPoint.set(subCurbePoints[1]);
        this.endControlPoint.set(subCurbePoints[3]);
        this.updateArcLengths();
        return this;
    };
    /**
     * Trim off the end of this curve. The position parameter `uValue` is the absolute position on the
     * curve in `[0...arcLength]`.
     * The remaining curve will be the one in the bounds `[0,uValue]` (so `[1.0-uValue,1.0]` is cut off).
     *
     * Note this function just converts the absolute parameter to a relative one and call `trimEndAt`.
     *
     * @method trimEnd
     * @instance
     * @memberof CubicBezierCurve
     * @param {number} uValue - The absolute position parameter where to cut off the tail curve.
     * @returns {CubicBezierCurve} `this` for chanining.
     */
    CubicBezierCurve.prototype.trimEnd = function (uValue) {
        return this.trimEndAt(this.convertU2T(uValue));
    };
    /**
     * Trim off the end of this curve. The position parameter `t` is the relative position in [0..1].
     * The remaining curve will be the one in the bounds `[0,t]` (so `[1.0-t,1.0]` is cut off).
     *
     * @method trimEndAt
     * @instance
     * @memberof CubicBezierCurve
     * @param {number} t - The relative position parameter where to cut off the tail curve.
     * @returns {CubicBezierCurve} `this` for chanining.
     */
    CubicBezierCurve.prototype.trimEndAt = function (t) {
        var subCurbePoints = CubicBezierCurve.utils.getSubCurvePointsAt(this, 0.0, t);
        this.startPoint.set(subCurbePoints[0]);
        this.startControlPoint.set(subCurbePoints[2]);
        this.endPoint.set(subCurbePoints[1]);
        this.endControlPoint.set(subCurbePoints[3]);
        this.updateArcLengths();
        return this;
    };
    /**
     * Get a sub curve at the given start end end positions (values on the curve's length, between 0 and curve.arcLength).
     *
     * tStart >= tEnd is allowed, you will get a reversed sub curve then.
     *
     * @method getSubCurve
     * @param {number} tStart – The start position of the desired sub curve (must be in [0..arcLength]).
     * @param {number} tEnd – The end position if the desired cub curve (must be in [0..arcLength]).
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} The sub curve as a new curve.
     **/
    CubicBezierCurve.prototype.getSubCurve = function (uStart, uEnd) {
        return this.getSubCurveAt(this.convertU2T(uStart), this.convertU2T(uEnd));
    };
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
        // This 'splits' the curve at the given point at t.
        var subCurbePoints = CubicBezierCurve.utils.getSubCurvePointsAt(this, tStart, tEnd);
        return new CubicBezierCurve(subCurbePoints[0], subCurbePoints[1], subCurbePoints[2], subCurbePoints[3]);
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
    CubicBezierCurve.prototype.convertU2T = function (u) {
        return Math.max(0.0, Math.min(1.0, u / this.arcLength));
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
    CubicBezierCurve.prototype.getTangent = function (u) {
        return this.getTangentAt(this.convertU2T(u));
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
    CubicBezierCurve.prototype.getPerpendicular = function (u) {
        return this.getPerpendicularAt(this.convertU2T(u));
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
    CubicBezierCurve.prototype.getPerpendicularAt = function (t) {
        var tangentVector = this.getTangentAt(t);
        return new Vertex_1.Vertex(tangentVector.y, -tangentVector.x);
    };
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
    //---BEGIN PathSegment-------------------------
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    CubicBezierCurve.prototype.getStartTangent = function () {
        return this.startControlPoint;
    };
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    CubicBezierCurve.prototype.getEndTangent = function () {
        return this.endControlPoint;
    };
    //---END PathSegment-------------------------
    //--- BEGIN --- Implement interface `Intersectable`
    /**
     * Get all line intersections with this shape.
     *
     * This method returns all intersections (as vertices) with this shape. The returned array of vertices is in no specific order.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections with the shape outline.
     */
    CubicBezierCurve.prototype.lineIntersections = function (line, inVectorBoundsOnly) {
        var _this = this;
        if (inVectorBoundsOnly === void 0) { inVectorBoundsOnly = false; }
        var intersectionTs = this.lineIntersectionTs(line);
        var intersectionPoints = intersectionTs.map(function (t) {
            return _this.getPointAt(t);
        });
        if (inVectorBoundsOnly) {
            // const maxDist = line.length();
            return intersectionPoints.filter(function (vert) { return line.hasPoint(vert, true); });
        }
        else {
            return intersectionPoints;
        }
    };
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    CubicBezierCurve.prototype.lineIntersectionTangents = function (line, inVectorBoundsOnly) {
        var _this = this;
        if (inVectorBoundsOnly === void 0) { inVectorBoundsOnly = false; }
        var intersectionTs = this.lineIntersectionTs(line);
        var intersectionTangents = intersectionTs.map(function (t) {
            var startPoint = _this.getPointAt(t);
            var endPoint = _this.getTangentAt(t);
            return new Vector_1.Vector(startPoint, endPoint.add(startPoint));
        });
        if (inVectorBoundsOnly) {
            return intersectionTangents.filter(function (vec) { return line.hasPoint(vec.a, true); });
        }
        else {
            return intersectionTangents;
        }
    };
    //--- END --- Implement interface `Intersectable`
    CubicBezierCurve.prototype.lineIntersectionTs = function (line) {
        var A = line.b.y - line.a.y; // A=y2-y1
        var B = line.a.x - line.b.x; // B=x1-x2
        var C = line.a.x * (line.a.y - line.b.y) + line.a.y * (line.b.x - line.a.x); //C=x1*(y1-y2)+y1*(x2-x1)
        // var bx = bezierCoeffs(px[0], px[1], px[2], px[3]);
        // var by = bezierCoeffs(py[0], py[1], py[2], py[3]);
        var bx = CubicBezierCurve.utils.bezierCoeffs(this.startPoint.x, this.startControlPoint.x, this.endControlPoint.x, this.endPoint.x);
        var by = CubicBezierCurve.utils.bezierCoeffs(this.startPoint.y, this.startControlPoint.y, this.endControlPoint.y, this.endPoint.y);
        var poly = Array(4);
        poly[0] = A * bx[0] + B * by[0]; /*t^3*/
        poly[1] = A * bx[1] + B * by[1]; /*t^2*/
        poly[2] = A * bx[2] + B * by[2]; /*t*/
        poly[3] = A * bx[3] + B * by[3] + C; /*1*/
        var roots = CubicBezierCurve.utils.cubicRoots(poly);
        return roots.filter(function (root) { return root != -1; });
    };
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
        if (!curve.startPoint || !curve.endPoint || !curve.startControlPoint || !curve.endControlPoint)
            return false;
        return (this.startPoint.equals(curve.startPoint) &&
            this.endPoint.equals(curve.endPoint) &&
            this.startControlPoint.equals(curve.startControlPoint) &&
            this.endControlPoint.equals(curve.endControlPoint));
    };
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    CubicBezierCurve.prototype.destroy = function () {
        this.startPoint.destroy();
        this.endPoint.destroy();
        this.startControlPoint.destroy();
        this.endControlPoint.destroy();
        this.isDestroyed = true;
    };
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
            '"startPoint" : [' +
            this.getStartPoint().x +
            "," +
            this.getStartPoint().y +
            "], " +
            (prettyFormat ? "\n\t" : "") +
            '"endPoint" : [' +
            this.getEndPoint().x +
            "," +
            this.getEndPoint().y +
            "], " +
            (prettyFormat ? "\n\t" : "") +
            '"startControlPoint": [' +
            this.getStartControlPoint().x +
            "," +
            this.getStartControlPoint().y +
            "], " +
            (prettyFormat ? "\n\t" : "") +
            '"endControlPoint" : [' +
            this.getEndControlPoint().x +
            "," +
            this.getEndControlPoint().y +
            "]" +
            (prettyFormat ? "\n\t" : "") +
            " }"; // end object
        return jsonString;
    };
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
            throw 'Object member "startPoint" missing.';
        if (!obj.endPoint)
            throw 'Object member "endPoint" missing.';
        if (!obj.startControlPoint)
            throw 'Object member "startControlPoint" missing.';
        if (!obj.endControlPoint)
            throw 'Object member "endControlPoint" missing.';
        return new CubicBezierCurve(new Vertex_1.Vertex(obj.startPoint[0], obj.startPoint[1]), new Vertex_1.Vertex(obj.endPoint[0], obj.endPoint[1]), new Vertex_1.Vertex(obj.startControlPoint[0], obj.startControlPoint[1]), new Vertex_1.Vertex(obj.endControlPoint[0], obj.endControlPoint[1]));
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
    CubicBezierCurve.fromArray = function (arr) {
        if (!Array.isArray(arr))
            throw "Can only build from object.";
        if (arr.length != 4)
            throw "Can only build from array with four elements.";
        return new CubicBezierCurve(arr[0], arr[1], arr[2], arr[3]);
    };
    /** @constant {number} */
    CubicBezierCurve.START_POINT = 0;
    /** @constant {number} */
    CubicBezierCurve.START_CONTROL_POINT = 1;
    /** @constant {number} */
    CubicBezierCurve.END_CONTROL_POINT = 2;
    /** @constant {number} */
    CubicBezierCurve.END_POINT = 3;
    /**
     * Helper utils.
     */
    CubicBezierCurve.utils = {
        evaluateT: function (p0, p1, p2, p3, t) {
            return p0 * Math.pow(1.0 - t, 3) +
                p1 * 3 * t * Math.pow(1.0 - t, 2) +
                p2 * 3 * Math.pow(t, 2) * (1.0 - t) +
                p3 * Math.pow(t, 3);
        },
        cubicPolyMinMax: function (p0, p1, p2, p3) {
            // var polyX = CubicBezierCurve.utils.cubicPoly2(
            //   p0, // P[0].X, // bezierCurve.startPoint.x,
            //   p1, // P[1].X, // bezierCurve.startControlPoint.x,
            //   p2, // P[2].X, // bezierCurve.endControlPoint.x,
            //   p3 // P[3].X // bezierCurve.endPoint.x
            // );
            // var a = polyX.a;
            // var b = polyX.b;
            // var c = polyX.c;
            // var disc = polyX.b * polyX.b - 4 * polyX.a * polyX.c;
            var polyX = CubicBezierCurve.utils.cubicPoly(p0, // P[0].X, // bezierCurve.startPoint.x,
            p1, // P[1].X, // bezierCurve.startControlPoint.x,
            p2, // P[2].X, // bezierCurve.endControlPoint.x,
            p3 // P[3].X // bezierCurve.endPoint.x
            );
            var a = polyX[0]; // .a;
            var b = polyX[1]; // .b;
            var c = polyX[2]; // .c;
            //alert("a "+a+" "+b+" "+c);
            // var disc = b * b - 4 * a * c;
            var disc = polyX[1] * polyX[1] - 4 * polyX[0] * polyX[2];
            // var polyX = CubicBezierCurve.utils.bezierCoeffs(p3,p2,p1,p0);
            // var a = polyX[0]; //polyX.a;
            // var b = polyX[1]; // .b;
            // var c = polyX[2]; //.c;
            // var disc = polyX[1] * polyX[1] - 4 * polyX[0] * polyX[2];
            // var xl = Math.min(bCurve.endPoint.x, bCurve.startPoint.x); // P[0].X;
            // var xh = Math.max(bCurve.endPoint.x, bCurve.startPoint.x); // P[0].X;
            var xl = Math.min(p3, p0); // P[0].X;
            var xh = Math.max(p3, p0); // P[0].X;
            // if (P[3].X < xl) xl = P[3].X;
            // if (P[3].X > xh) xh = P[3].X;
            if (disc >= 0) {
                var t1 = (-b + Math.sqrt(disc)) / (2 * a);
                // alert("t1 " + t1);
                if (t1 > 0 && t1 < 1) {
                    // var x1 = evalBez(PX, t1);
                    // var x1 = bCurve.getPointAt(t1).x;
                    var x1 = CubicBezierCurve.utils.evaluateT(p0, p1, p2, p3, t1); // bCurve.getPointAt(t1).x;
                    if (x1 < xl)
                        xl = x1;
                    if (x1 > xh)
                        xh = x1;
                }
                var t2 = (-b - Math.sqrt(disc)) / (2 * a);
                // alert("t2 " + t2);
                if (t2 > 0 && t2 < 1) {
                    // var x2 = evalBez(PX, t2);
                    // var x2 = bCurve.getPointAt(t2).x;
                    var x2 = CubicBezierCurve.utils.evaluateT(p0, p1, p2, p3, t2); //
                    if (x2 < xl)
                        xl = x2;
                    if (x2 > xh)
                        xh = x2;
                }
            }
            return { min: xl, max: xh };
        },
        /**
         * Get the points of a sub curve at the given start end end offsets (values between 0.0 and 1.0).
         *
         * tStart >= tEnd is allowed, you will get a reversed sub curve then.
         *
         * @method getSubCurvePointsAt
         * @param {CubicBezierCurve} curve – The curve to get the sub curve points from.
         * @param {number} tStart – The start offset of the desired sub curve (must be in [0..1]).
         * @param {number} tEnd – The end offset if the desired cub curve (must be in [0..1]).
         * @instance
         * @memberof CubicBezierCurve
         * @return {CubicBezierCurve} The sub curve as a new curve.
         **/
        getSubCurvePointsAt: function (curve, tStart, tEnd) {
            var startVec = new Vector_1.Vector(curve.getPointAt(tStart), curve.getTangentAt(tStart));
            var endVec = new Vector_1.Vector(curve.getPointAt(tEnd), curve.getTangentAt(tEnd).inv());
            // Tangents are relative. Make absolute.
            startVec.b.add(startVec.a);
            endVec.b.add(endVec.a);
            // This 'splits' the curve at the given point at t.
            startVec.scale(0.33333333 * (tEnd - tStart));
            endVec.scale(0.33333333 * (tEnd - tStart));
            return [startVec.a, endVec.a, startVec.b, endVec.b];
        },
        /**
         * Compute the cubic roots for the given cubic polynomial coefficients.
         *
         * Based on
         *   http://mysite.verizon.net/res148h4j/javascript/script_exact_cubic.html#the%20source%20code
         * Inspired by
         *   https://www.particleincell.com/2013/cubic-line-intersection/
         * Thanks to Stephan Schmitt and Particle-In-Cell!
         *
         * @param poly
         * @returns
         */
        cubicRoots: function (poly) {
            var a = poly[0];
            var b = poly[1];
            var c = poly[2];
            var d = poly[3];
            var A = b / a;
            var B = c / a;
            var C = d / a;
            var S, T, Im;
            var Q = (3 * B - Math.pow(A, 2)) / 9;
            var R = (9 * A * B - 27 * C - 2 * Math.pow(A, 3)) / 54;
            var D = Math.pow(Q, 3) + Math.pow(R, 2); // polynomial discriminant
            var ts = []; // Array();
            if (D >= 0) {
                // complex or duplicate roots
                S = CubicBezierCurve.utils.sgn(R + Math.sqrt(D)) * Math.pow(Math.abs(R + Math.sqrt(D)), 1 / 3);
                T = CubicBezierCurve.utils.sgn(R - Math.sqrt(D)) * Math.pow(Math.abs(R - Math.sqrt(D)), 1 / 3);
                ts[0] = -A / 3 + (S + T); // real root
                ts[1] = -A / 3 - (S + T) / 2; // real part of complex root
                ts[2] = -A / 3 - (S + T) / 2; // real part of complex root
                Im = Math.abs((Math.sqrt(3) * (S - T)) / 2); // complex part of root pair
                // Mark complex roots to be discarded
                if (Im != 0) {
                    ts[1] = -1;
                    ts[2] = -1;
                }
            } // distinct real roots
            else {
                var th = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));
                ts[0] = 2 * Math.sqrt(-Q) * Math.cos(th / 3) - A / 3;
                ts[1] = 2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI) / 3) - A / 3;
                ts[2] = 2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI) / 3) - A / 3;
                Im = 0.0;
            }
            // Discard all t's out of spec and sort the rest
            return ts.filter(function (t) { return t >= 0 && t <= 1.0; }).sort();
        },
        /**
         * Compute the Bézier coefficients from the given Bézier point coordinates.
         *
         * @param {number} p0 - The start point coordinate.
         * @param {number} p1 - The start control point coordinate.
         * @param {number} p2 - The end control point coordinate.
         * @param {number} p3 - The end point coordinate.
         * @returns {[number,number,number,number]}
         */
        bezierCoeffs: function (p0, p1, p2, p3) {
            var coeffs = [NaN, NaN, NaN, NaN]; //Array(4);
            coeffs[0] = -p0 + 3 * p1 + -3 * p2 + p3;
            coeffs[1] = 3 * p0 - 6 * p1 + 3 * p2;
            coeffs[2] = -3 * p0 + 3 * p1;
            coeffs[3] = p0;
            return coeffs;
        },
        /**
         * Calculate the cubic polynomial coefficients used to find the bounding box.
         *
         * @param {number} p0 - The start point coordinate.
         * @param {number} p1 - The start control point coordinate.
         * @param {number} p2 - The end control point coordinate.
         * @param {number} p3 - The end point coordinate.
         * @returns {[number,number,number]}
         */
        cubicPoly: function (p0, p1, p2, p3) {
            return [
                3 * p3 - 9 * p2 + 9 * p1 - 3 * p0,
                6 * p0 - 12 * p1 + 6 * p2,
                3 * p1 - 3 * p0
            ];
        },
        /**
         * sign of number, but is division safe: no zero returned :)
         */
        sgn: function (x) {
            return x < 0.0 ? -1 : 1;
        }
    };
    return CubicBezierCurve;
}());
exports.CubicBezierCurve = CubicBezierCurve;
//# sourceMappingURL=CubicBezierCurve.js.map