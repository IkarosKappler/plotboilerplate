/**
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
 * @modified 2020-07-24 Added the getClosestT(Vertex) function.
 * @modified 2020-12-29 Constructor is now private (no explicit use intended).
 * @modified 2021-05-25 Added BezierPath.fromReducedList( Array<number> ).
 * @modified 2022-01-31 Added `BezierPath.getEvenDistributionVertices(number)`.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2023-10-06 Adding the `BezierPath.toPathPoints()` method.
 * @modified 2023-10-07 Adding the `BezierPath.fromCurve(CubicBezierCurve)` static function.
 * @version 2.6.0
 *
 * @file BezierPath
 * @public
 **/
import { Bounds } from "./Bounds";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable, UID } from "./interfaces";
/**
 * @classdesc A BezierPath class.
 *
 * This was refactored from an older project.
 *
 * @requires Bounds
 * @requires Vertex
 * @requires CubicBezierCurve
 * @requires XYCoords
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 **/
export declare class BezierPath implements SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof BezierCurve
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {Array<Vertex>}
     * @memberof BezierPath
     * @type {Array<Vertex>}
     * @instance
     */
    pathPoints: Array<Vertex>;
    /**
     * @member {number}
     * @memberof BezierPath
     * @type {number}
     * @instance
     */
    totalArcLength: number;
    /**
     * Set this flag to true if you want the first point and
     * last point of the path to be auto adjusted, too.
     *
     * @member {number}
     * @memberof BezierPath
     * @type {number}
     * @instance
     */
    adjustCircular: boolean;
    /**
     * @member {Array<CubicBezierCurve>}
     * @memberof BezierPath
     * @type {Array<CubicBezierCurve>}
     * @instance
     */
    bezierCurves: Array<CubicBezierCurve>;
    /**
     * @member {boolean}
     * @memberof BezierPath
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /** @constant {number} */
    static START_POINT: number;
    /** @constant {number} */
    static START_CONTROL_POINT: number;
    /** @constant {number} */
    static END_CONTROL_POINT: number;
    /** @constant {number} */
    static END_POINT: number;
    /** @constant {number} */
    START_POINT: number;
    /** @constant {number} */
    START_CONTROL_POINT: number;
    /** @constant {number} */
    END_CONTROL_POINT: number;
    /** @constant {number} */
    END_POINT: number;
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
    private constructor();
    /**
     * Add a cubic bezier curve to the end of this path.
     *
     * @method addCurve
     * @param {CubicBezierCurve} curve - The curve to be added to the end of the path.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    addCurve(curve: CubicBezierCurve): void;
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartPoint
     * @param {Vertex} point - The (curve start-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (start-) point not found
     **/
    locateCurveByStartPoint(point: Vertex): number;
    /**
     * Locate the curve with the given end point (function returns the index).
     *
     * @method locateCurveByEndPoint
     * @param {Vertex} point - The (curve end-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    locateCurveByEndPoint(point: Vertex): number;
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartControlPoint
     * @param {Vertex} point - The (curve endt-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    locateCurveByStartControlPoint(point: Vertex): number;
    locateCurveByEndControlPoint(point: Vertex): number;
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
    getLength(): number;
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
    updateArcLengths(): void;
    /**
     * Get the number of curves in this path.
     *
     * @method getCurveCount
     * @instance
     * @memberof BezierPath
     * @return {number} The number of curves in this path.
     **/
    getCurveCount(): number;
    /**
     * Get the cubic bezier curve at the given index.
     *
     * @method getCurveAt
     * @param {number} index - The curve index from 0 to getCurveCount()-1.
     * @instance
     * @memberof BezierPath
     * @return {CubicBezierCurve} The curve at the specified index.
     **/
    getCurveAt(curveIndex: number): CubicBezierCurve;
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
    translate(amount: Vertex): BezierPath;
    /**
     * Scale the whole bezier path by the given uniform factor.
     *
     * @method scale
     * @param {Vertex} anchor - The scale origin to scale from.
     * @param {number} scaleFactor - The scalar to be multiplied with.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining.
     **/
    scale(anchor: Vertex, scaleFactor: number): BezierPath;
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
    scaleXY(scaleFactors: XYCoords, anchor?: XYCoords): BezierPath;
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
    rotate(angle: number, center: Vertex): void;
    /**
     * Get the 't' position on this curve with the minimal distance to point p.
     *
     * @param {Vertex} p - The point to find the closest curve point for.
     * @return {number} A value t with 0.0 <= t <= 1.0.
     **/
    getClosestT(p: Vertex): number;
    /**
     * Get the point on the bézier path at the given relative path location.
     *
     * @method getPoint
     * @param {number} u - The relative path position: <pre>0 <= u <= this.getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the relative path position.
     **/
    getPoint(u: number): Vertex;
    /**
     * Get the point on the bézier path at the given path fraction.
     *
     * @method getPointAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the absolute path position.
     **/
    getPointAt(t: number): Vertex;
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
    getTangentAt(t: number): Vertex;
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
    getTangent(u: number): Vertex;
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
    getPerpendicularAt(t: number): Vertex;
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
    getPerpendicular(u: number): Vertex;
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
    private static _locateUIndex;
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
    getSubPathAt(startT: number, endT: number): BezierPath;
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
    moveCurvePoint(curveIndex: number, pointID: number, moveAmount: XYCoords): void;
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
    adjustPredecessorControlPoint(curveIndex: number, obtainHandleLength: boolean, updateArcLengths: boolean): void;
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
    adjustSuccessorControlPoint(curveIndex: number, obtainHandleLength: boolean, updateArcLengths: boolean): void;
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
    private static adjustNeighbourControlPoint;
    /**
     * Get the bounds of this Bézier path.
     *
     * Note the the curves' underlyung segment buffers are used to determine the bounds. The more
     * elements the segment buffers have, the more precise the returned bounds will be.
     *
     * @return {Bounds} The bounds of this Bézier path.
     **/
    getBounds(): Bounds;
    /**
     * Get n 'equally' distributed vertices along this Bézier path.
     *
     * As the changing curvature of the B slines makes prediction of distances difficult, the
     * returned vertices' distances are only relatively equal:
     *  - the distance grows where curvature is large.
     *  - the distance shrinks where curvature is small.
     *
     * Only the distance mean of all consecutive is 1/n-th of the total arc length.
     *
     * Usually this approximation is good enough for most use cases.
     *
     * @param {number} pointCount - (must be at least 2) The number of desired points (start and end point included).
     * @return {Array<Vertex>}
     */
    getEvenDistributionVertices(pointCount: number): Array<Vertex>;
    /**
     * Clone this BezierPath (deep clone).
     *
     * @method clone
     * @instance
     * @memberof BezierPath
     * @return {BezierPath}
     **/
    clone(): BezierPath;
    /**
     * Compare this and the passed Bézier path.
     *
     * @method equals
     * @param {BezierPath} path - The pass to compare with.
     * @instance
     * @memberof BezierPath
     * @return {boolean}
     **/
    equals(path: BezierPath): boolean;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     *
     * @method destroy
     * @instance
     * @memberof BezierPath
     */
    destroy(): void;
    /**
     * Convert this path to an array of path points that can be drawn by the default DrawLib
     * implementations.
     *
     * @method toPathPoints
     * @instance
     * @memberof BezierPath
     * @return {Array<XYCoords>}
     */
    toPathPoints(): Array<XYCoords>;
    /**
     * Create a JSON string representation of this bézier curve.
     *
     * @method toJSON
     * @param {boolean} prettyFormat - If true then the function will add line breaks.
     * @instance
     * @memberof BezierPath
     * @return {string} The JSON string.
     **/
    toJSON(prettyFormat: boolean): string;
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
    static fromJSON(jsonString: string): BezierPath;
    /**
     * Construct a new path with a single curve. Adding more curves is always possible.
     *
     * @method fromCurve
     * @param {CubicBezierCurve} curve - The curve to construct a new path from.
     * @static
     * @memberof BezierPath
     * @return {BezierPath} The constructed bezier path instance.
     */
    static fromCurve(curve: CubicBezierCurve): BezierPath;
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
    static fromArray(obj: any): BezierPath;
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
    toReducedListRepresentation(digits: number): string;
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
    static fromReducedListRepresentation(listJSON: string, adjustCircular?: boolean): BezierPath;
    /**
     * Convert a reduced list representation (array of numeric coordinates) to a BezierPath instance.
     *
     * The array's length must be 6*n + 2:
     *  - [sx, sy,  scx, scy,  ecx, ecy, ... , ex,  ey ]
     *     |                               |   |     |
     *     +--- sequence of curves --------+   +-end-+
     *
     * @param {number[]} pointArray
     * @returns BezierPath
     */
    static fromReducedList(pointArray: Array<number>, adjustCircular?: boolean): BezierPath;
}
