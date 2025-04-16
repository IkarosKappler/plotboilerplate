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
 * @version 2.9.0
 *
 * @file CubicBezierCurve
 * @public
 **/
import { Bounds } from "./Bounds";
import { Vertex } from "./Vertex";
import { Vector } from "./Vector";
import { XYCoords, UID, PathSegment, Intersectable, IBounded } from "./interfaces";
import { VertTuple } from "./VertTuple";
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
export declare class CubicBezierCurve implements IBounded, Intersectable, PathSegment {
    /** @constant {number} */
    static readonly START_POINT: number;
    /** @constant {number} */
    static readonly START_CONTROL_POINT: number;
    /** @constant {number} */
    static readonly END_CONTROL_POINT: number;
    /** @constant {number} */
    static readonly END_POINT: number;
    /** @constant {number} */
    readonly START_POINT: number;
    /** @constant {number} */
    readonly START_CONTROL_POINT: number;
    /** @constant {number} */
    readonly END_CONTROL_POINT: number;
    /** @constant {number} */
    readonly END_POINT: number;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof CubicBezierCurve
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    startPoint: Vertex;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    endPoint: Vertex;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    startControlPoint: Vertex;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    endControlPoint: Vertex;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    curveIntervals: number;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    segmentCache: Array<Vertex>;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    segmentLengths: Array<number>;
    /**
     * @member {CubicBezierCurve}
     * @memberof CubicBezierCurve
     * @instance
     */
    arcLength: number;
    /**
     * @member isDestroyed
     * @memberof CubicBezierCurve
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
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
    constructor(startPoint: Vertex, endPoint: Vertex, startControlPoint: Vertex, endControlPoint: Vertex);
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
    moveCurvePoint(pointID: number, moveAmount: XYCoords, moveControlPoint: boolean, updateArcLengths: boolean): void;
    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {XYCoords} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    translate(amount: XYCoords): CubicBezierCurve;
    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {XYCoords} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    move(amount: XYCoords): CubicBezierCurve;
    /**
     * Reverse this curve, means swapping start- and end-point and swapping
     * start-control- and end-control-point.
     *
     * @method reverse
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this (for chaining).
     **/
    reverse(): CubicBezierCurve;
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
    getLength(): number;
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
    updateArcLengths(): void;
    /**
     * Get a 't' (relative position on curve) with the closest distance to point 'p'.
     *
     * The returned number is 0.0 <= t <= 1.0. Use the getPointAt(t) function to retrieve the actual curve point.
     *
     * This function uses a recursive approach by cutting the curve into several linear segments.
     *
     * @param {Vertex} p - The point to find the closest position ('t' on the curve).
     * @return {number}
     **/
    getClosestT(p: Vertex): number;
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
    private locateIntervalByDistance;
    /**
     * Get the bounds of this bezier curve.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @return {Bounds} The bounds of this curve.
     **/
    getBounds(): Bounds;
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
    getStartPoint(): Vertex;
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
    getEndPoint(): Vertex;
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
    getStartControlPoint(): Vertex;
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
    getEndControlPoint(): Vertex;
    /**
     * Get one of the four curve points specified by the passt point ID.
     *
     * @method getEndControlPoint
     * @param {number} id - One of START_POINT, START_CONTROL_POINT, END_CONTROL_POINT or END_POINT.
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex}
     **/
    getPointByID(id: number): Vertex;
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
    getPointAt(t: number): Vertex;
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
    getPoint(u: number): Vertex;
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
    getTangentAt(t: number): Vertex;
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
    trimStart(uValue: number): CubicBezierCurve;
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
    trimStartAt(t: number): CubicBezierCurve;
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
    trimEnd(uValue: number): CubicBezierCurve;
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
    trimEndAt(t: number): CubicBezierCurve;
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
    getSubCurve(uStart: number, uEnd: number): CubicBezierCurve;
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
    getSubCurveAt(tStart: number, tEnd: number): CubicBezierCurve;
    /**
     * Convert a relative curve position u to the absolute curve position t.
     *
     * @method convertU2t
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {number}
     **/
    convertU2T(u: number): number;
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
    getTangent(u: number): Vertex;
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
    getPerpendicular(u: number): Vertex;
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
    getPerpendicularAt(t: number): Vertex;
    /**
     * Clone this Bézier curve (deep clone).
     *
     * @method clone
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve}
     **/
    clone(): CubicBezierCurve;
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    getStartTangent(): Vertex;
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    getEndTangent(): Vertex;
    /**
     * Get all line intersections with this shape.
     *
     * This method returns all intersections (as vertices) with this shape. The returned array of vertices is in no specific order.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections with the shape outline.
     */
    lineIntersections(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vertex>;
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vector>;
    lineIntersectionTs(line: VertTuple<any>): Array<number>;
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
    equals(curve: CubicBezierCurve | undefined): boolean;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
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
    static isInstance(obj: any): boolean;
    /**
     * Convert this curve to a JSON string.
     *
     * @method toJSON
     * @param {boolean=} [prettyFormat=false] - If set to true the function will add line breaks.
     * @instance
     * @memberof CubicBezierCurve
     * @return {string} The JSON data.
     **/
    toJSON(prettyFormat: boolean): string;
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
    static fromJSON(jsonString: string): CubicBezierCurve;
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
    static fromObject(obj: any): CubicBezierCurve;
    /**
     * Convert a 4-element array of vertices to a cubic bézier curve.
     *
     * @method fromArray
     * @param {Vertex[]} arr -  [ startVertex, endVertex, startControlVertex, endControlVertex ]
     * @memberof CubicBezierCurve
     * @throws An exception if the passed array is malformed.
     * @return {CubicBezierCurve}
     **/
    static fromArray(arr: Array<Vertex>): CubicBezierCurve;
    /**
     * Helper utils.
     */
    static utils: {
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
        getSubCurvePointsAt: (curve: CubicBezierCurve, tStart: number, tEnd: number) => [Vertex, Vertex, Vertex, Vertex];
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
        cubicRoots: (poly: number[]) => number[];
        /**
         * Compute the Bézier coefficients from the given Bézier point coordinates.
         *
         * @param {number} p0 - The start point coordinate.
         * @param {number} p1 - The start point coordinate.
         * @param {number} p2 - The start point coordinate.
         * @param {number} p3 - The start point coordinate.
         * @returns {Array<number>}
         */
        bezierCoeffs: (p0: number, p1: number, p2: number, p3: number) => Array<number>;
        /**
         * sign of number, but is division safe: no zero returned :)
         */
        sgn(x: number): number;
    };
}
