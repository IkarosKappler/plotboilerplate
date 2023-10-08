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
import { UIDGenerator } from "./UIDGenerator";
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
export class BezierPath implements SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "BezierPath";

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

  // +---------------------------------------------------------------------------------
  // | These constants equal the values from CubicBezierCurve.
  // +-------------------------------
  /** @constant {number} */
  static START_POINT: number = 0;
  /** @constant {number} */
  static START_CONTROL_POINT: number = 1;
  /** @constant {number} */
  static END_CONTROL_POINT: number = 2;
  /** @constant {number} */
  static END_POINT: number = 3;
  /** @constant {number} */
  START_POINT: number = 0;
  /** @constant {number} */
  START_CONTROL_POINT: number = 1;
  /** @constant {number} */
  END_CONTROL_POINT: number = 2;
  /** @constant {number} */
  END_POINT: number = 3;

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
  private constructor() {
    // pathPoints: Array<Vertex> | undefined | null) {
    this.uid = UIDGenerator.next();

    // if (!pathPoints) {
    //   pathPoints = [];
    // }
    this.totalArcLength = 0.0;
    // Set this flag to true if you want the first point and
    // last point of the path to be auto adjusted, too.
    this.adjustCircular = false;
    this.bezierCurves = [];
  }

  /**
   * Add a cubic bezier curve to the end of this path.
   *
   * @method addCurve
   * @param {CubicBezierCurve} curve - The curve to be added to the end of the path.
   * @instance
   * @memberof BezierPath
   * @return {void}
   **/
  addCurve(curve: CubicBezierCurve): void {
    if (curve == null || typeof curve == "undefined") throw "Cannot add null curve to bézier path.";
    this.bezierCurves.push(curve);
    if (this.bezierCurves.length > 1) {
      curve.startPoint = this.bezierCurves[this.bezierCurves.length - 2].endPoint;
      this.adjustSuccessorControlPoint(
        this.bezierCurves.length - 2, // curveIndex,
        true, // obtainHandleLength,
        true // updateArcLengths
      );
    } else {
      this.totalArcLength += curve.getLength();
    }
  }

  /**
   * Locate the curve with the given start point (function returns the index).
   *
   * @method locateCurveByStartPoint
   * @param {Vertex} point - The (curve start-) point to look for.
   * @instance
   * @memberof BezierPath
   * @return {number} The curve index or -1 if curve (start-) point not found
   **/
  locateCurveByStartPoint(point: Vertex): number {
    // for( var i in this.bezierCurves ) {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      if (this.bezierCurves[i].startPoint.equals(point)) return i;
    }
    return -1;
  }

  /**
   * Locate the curve with the given end point (function returns the index).
   *
   * @method locateCurveByEndPoint
   * @param {Vertex} point - The (curve end-) point to look for.
   * @instance
   * @memberof BezierPath
   * @return {number} The curve index or -1 if curve (end-) point not found
   **/
  locateCurveByEndPoint(point: Vertex): number {
    // for( var i in this.bezierCurves ) {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      if (this.bezierCurves[i].endPoint.equals(point)) return i;
    }
    return -1;
  }

  /**
   * Locate the curve with the given start point (function returns the index).
   *
   * @method locateCurveByStartControlPoint
   * @param {Vertex} point - The (curve endt-) point to look for.
   * @instance
   * @memberof BezierPath
   * @return {number} The curve index or -1 if curve (end-) point not found
   **/
  locateCurveByStartControlPoint(point: Vertex): number {
    // for( var i in this.bezierCurves ) {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      if (this.bezierCurves[i].startControlPoint.equals(point)) return i;
    }
    return -1;
  }

  // +---------------------------------------------------------------------------------
  // | Locate the curve with the given end control point.
  // |
  // | @param point:Vertex The point to look for.
  // | @return Number The index or -1 if not found.
  // +-------------------------------
  locateCurveByEndControlPoint(point: Vertex): number {
    // for( var i in this.bezierCurves ) {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      if (this.bezierCurves[i].endControlPoint.equals(point)) return i;
    }
    return -1;
  }

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
  getLength(): number {
    return this.totalArcLength;
  }

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
  updateArcLengths(): void {
    this.totalArcLength = 0.0;
    for (var i = 0; i < this.bezierCurves.length; i++) {
      this.bezierCurves[i].updateArcLengths();
      this.totalArcLength += this.bezierCurves[i].getLength();
    }
  }

  /**
   * Get the number of curves in this path.
   *
   * @method getCurveCount
   * @instance
   * @memberof BezierPath
   * @return {number} The number of curves in this path.
   **/
  getCurveCount(): number {
    return this.bezierCurves.length;
  }

  /**
   * Get the cubic bezier curve at the given index.
   *
   * @method getCurveAt
   * @param {number} index - The curve index from 0 to getCurveCount()-1.
   * @instance
   * @memberof BezierPath
   * @return {CubicBezierCurve} The curve at the specified index.
   **/
  getCurveAt(curveIndex: number): CubicBezierCurve {
    return this.bezierCurves[curveIndex];
  }

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
  translate(amount: Vertex): BezierPath {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      var curve = this.bezierCurves[i];
      curve.getStartPoint().add(amount);
      curve.getStartControlPoint().add(amount);
      curve.getEndControlPoint().add(amount);
    }

    // Don't forget to translate the last curve's last point
    var curve: CubicBezierCurve = this.bezierCurves[this.bezierCurves.length - 1];
    curve.getEndPoint().add(amount);

    this.updateArcLengths();
    return this;
  }

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
  scale(anchor: Vertex, scaleFactor: number): BezierPath {
    return this.scaleXY({ x: scaleFactor, y: scaleFactor }, anchor);
  }

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
  scaleXY(scaleFactors: XYCoords, anchor?: XYCoords): BezierPath {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      var curve = this.bezierCurves[i];
      curve.getStartPoint().scaleXY(scaleFactors, anchor);
      curve.getStartControlPoint().scaleXY(scaleFactors, anchor);
      curve.getEndControlPoint().scaleXY(scaleFactors, anchor);
      // Do NOT scale the end point here!
      // Don't forget that the curves are connected and on curve's end point
      // the the successor's start point (same instance)!
    }

    // Finally move the last end point (was not scaled yet)
    if (this.bezierCurves.length > 0 && !this.adjustCircular) {
      this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().scaleXY(scaleFactors, anchor);
    }

    this.updateArcLengths();
    return this;
  }

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
  rotate(angle: number, center: Vertex): void {
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
  }

  /**
   * Get the 't' position on this curve with the minimal distance to point p.
   *
   * @param {Vertex} p - The point to find the closest curve point for.
   * @return {number} A value t with 0.0 <= t <= 1.0.
   **/
  getClosestT(p: Vertex): number {
    // Find the spline to extract the value from
    var minIndex: number = -1;
    var minDist: number = 0.0;
    var dist: number = 0.0;
    var curveT: number = 0.0;
    var uMin: number = 0.0;
    var u: number = 0.0;
    for (var i = 0; i < this.bezierCurves.length; i++) {
      curveT = this.bezierCurves[i].getClosestT(p);
      dist = this.bezierCurves[i].getPointAt(curveT).distance(p);
      if (minIndex == -1 || dist < minDist) {
        minIndex = i;
        minDist = dist;
        uMin = u + curveT * this.bezierCurves[i].getLength();
      }

      u += this.bezierCurves[i].getLength();
    }

    return Math.max(0.0, Math.min(1.0, uMin / this.totalArcLength));
  }

  /**
   * Get the point on the bézier path at the given relative path location.
   *
   * @method getPoint
   * @param {number} u - The relative path position: <pre>0 <= u <= this.getLength()</pre>
   * @instance
   * @memberof BezierPath
   * @return {Vertex} The point at the relative path position.
   **/
  getPoint(u: number): Vertex {
    if (u < 0 || u > this.totalArcLength) {
      console.warn("[BezierPath.getPoint(u)] u is out of bounds: " + u + ".");
      u = Math.min(this.totalArcLength, Math.max(u, 0));
    }
    // Find the spline to extract the value from
    var i: number = 0;
    var uTemp: number = 0.0;
    while (i < this.bezierCurves.length && uTemp + this.bezierCurves[i].getLength() < u) {
      uTemp += this.bezierCurves[i].getLength();
      i++;
    }

    // if u == arcLength
    //   -> i is max
    if (i >= this.bezierCurves.length) return this.bezierCurves[this.bezierCurves.length - 1].getEndPoint().clone();

    var bCurve: CubicBezierCurve = this.bezierCurves[i];
    var relativeU: number = u - uTemp;
    return bCurve.getPoint(relativeU);
  }

  /**
   * Get the point on the bézier path at the given path fraction.
   *
   * @method getPointAt
   * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
   * @instance
   * @memberof BezierPath
   * @return {Vertex} The point at the absolute path position.
   **/
  getPointAt(t: number): Vertex {
    return this.getPoint(t * this.totalArcLength);
  }

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
  getTangentAt(t: number): Vertex {
    return this.getTangent(t * this.totalArcLength);
  }

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
  getTangent(u: number): Vertex {
    if (u < 0 || u > this.totalArcLength) {
      console.warn("[BezierPath.getTangent(u)] u is out of bounds: " + u + ".");
      // return undefined;
      u = Math.min(this.totalArcLength, Math.max(0, u));
    }
    // Find the spline to extract the value from
    var i: number = 0;
    var uTemp: number = 0.0;
    while (i < this.bezierCurves.length && uTemp + this.bezierCurves[i].getLength() < u) {
      uTemp += this.bezierCurves[i].getLength();
      i++;
    }
    var bCurve: CubicBezierCurve = this.bezierCurves[i];
    var relativeU: number = u - uTemp;
    return bCurve.getTangent(relativeU);
  }

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
  getPerpendicularAt(t: number): Vertex {
    return this.getPerpendicular(t * this.totalArcLength);
  }

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
  getPerpendicular(u: number): Vertex {
    if (u < 0 || u > this.totalArcLength) {
      console.log("[BezierPath.getPerpendicular(u)] u is out of bounds: " + u + ".");
      u = Math.min(this.totalArcLength, Math.max(0, u));
    }

    // Find the spline to extract the value from
    var uResult: { i: number; uPart: number; uBefore: number } = BezierPath._locateUIndex(this, u);
    var bCurve: CubicBezierCurve = this.bezierCurves[uResult.i];
    var relativeU: number = u - uResult.uPart;

    return bCurve.getPerpendicular(relativeU);
  }

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
  private static _locateUIndex(path: BezierPath, u: number): { i: number; uPart: number; uBefore: number } {
    var i: number = 0;
    var uTemp: number = 0.0;
    var uBefore: number = 0.0;
    while (i < path.bezierCurves.length && uTemp + path.bezierCurves[i].getLength() < u) {
      uTemp += path.bezierCurves[i].getLength();
      if (i + 1 < path.bezierCurves.length) uBefore += path.bezierCurves[i].getLength();
      i++;
    }
    return { i: i, uPart: uTemp, uBefore: uBefore };
  }

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
  getSubPathAt(startT: number, endT: number): BezierPath {
    startT = Math.max(0, startT);
    endT = Math.min(1.0, endT);
    let startU: number = startT * this.totalArcLength;
    let endU: number = endT * this.totalArcLength;

    var uStartResult: { i: number; uPart: number; uBefore: number } = BezierPath._locateUIndex(this, startU); // { i:int, uPart:float, uBefore:float }
    var uEndResult: { i: number; uPart: number; uBefore: number } = BezierPath._locateUIndex(this, endU); // { i:int, uPart:float, uBefore:float }

    var firstT: number = (startU - uStartResult.uBefore) / this.bezierCurves[uStartResult.i].getLength();
    if (uStartResult.i == uEndResult.i) {
      // Subpath begins and ends in the same path segment (just get a simple sub curve from that path element).
      var lastT: number = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
      var firstCurve: CubicBezierCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, lastT);
      return BezierPath.fromArray([firstCurve]);
    } else {
      var curves: Array<CubicBezierCurve> = [];
      if (uStartResult.i > uEndResult.i) {
        // Back to front direction
        var firstCurve: CubicBezierCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 0.0);
        curves.push(firstCurve);
        for (var i = uStartResult.i - 1; i > uEndResult.i; i--) {
          curves.push(this.bezierCurves[i].clone().reverse());
        }
        var lastT: number = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
        curves.push(this.bezierCurves[uEndResult.i].getSubCurveAt(1.0, lastT));
      } else {
        // Front to back direction
        var firstCurve: CubicBezierCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 1.0);
        curves.push(firstCurve);

        for (var i = uStartResult.i + 1; i < uEndResult.i && i < this.bezierCurves.length; i++) {
          curves.push(this.bezierCurves[i].clone());
        }

        var lastT: number = (endU - uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
        curves.push(this.bezierCurves[uEndResult.i].getSubCurveAt(0, lastT));
      }
      return BezierPath.fromArray(curves);
    }
  }

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
  moveCurvePoint(curveIndex: number, pointID: number, moveAmount: XYCoords): void {
    var bCurve: CubicBezierCurve = this.getCurveAt(curveIndex);
    bCurve.moveCurvePoint(
      pointID,
      moveAmount,
      true, // move control point, too
      true // updateArcLengths
    );

    // If inner point and NOT control point
    //  --> move neightbour
    if (pointID == this.START_POINT && (curveIndex > 0 || this.adjustCircular)) {
      // Set predecessor's control point!
      var predecessor = this.getCurveAt(curveIndex - 1 < 0 ? this.bezierCurves.length + (curveIndex - 1) : curveIndex - 1);
      predecessor.moveCurvePoint(
        this.END_CONTROL_POINT,
        moveAmount,
        true, // move control point, too
        false // updateArcLengths
      );
    } else if (pointID == this.END_POINT && (curveIndex + 1 < this.bezierCurves.length || this.adjustCircular)) {
      // Set successcor
      var successor: CubicBezierCurve = this.getCurveAt((curveIndex + 1) % this.bezierCurves.length);
      successor.moveCurvePoint(
        this.START_CONTROL_POINT,
        moveAmount,
        true, // move control point, too
        false // updateArcLengths
      );
    } else if (pointID == this.START_CONTROL_POINT && curveIndex > 0) {
      this.adjustPredecessorControlPoint(
        curveIndex,
        true, // obtain handle length?
        false // update arc lengths
      );
    } else if (pointID == this.END_CONTROL_POINT && curveIndex + 1 < this.getCurveCount()) {
      this.adjustSuccessorControlPoint(
        curveIndex,
        true, // obtain handle length?
        false // update arc lengths
      );
    }

    // Don't forget to update the arc lengths!
    // Note: this can be optimized as only two curves have changed their lengths!
    this.updateArcLengths();
  }

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
  adjustPredecessorControlPoint(curveIndex: number, obtainHandleLength: boolean, updateArcLengths: boolean): void {
    if (!this.adjustCircular && curveIndex <= 0) return; // false;

    var mainCurve: CubicBezierCurve = this.getCurveAt(curveIndex);
    var neighbourCurve: CubicBezierCurve = this.getCurveAt(
      curveIndex - 1 < 0 ? this.getCurveCount() + (curveIndex - 1) : curveIndex - 1
    );
    BezierPath.adjustNeighbourControlPoint(
      mainCurve,
      neighbourCurve,
      mainCurve.getStartPoint(), // the reference point
      mainCurve.getStartControlPoint(), // the dragged control point
      neighbourCurve.getEndPoint(), // the neighbour's point
      neighbourCurve.getEndControlPoint(), // the neighbour's control point to adjust
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
  adjustSuccessorControlPoint(curveIndex: number, obtainHandleLength: boolean, updateArcLengths: boolean): void {
    if (!this.adjustCircular && curveIndex + 1 > this.getCurveCount()) return; //  false;

    var mainCurve: CubicBezierCurve = this.getCurveAt(curveIndex);
    var neighbourCurve: CubicBezierCurve = this.getCurveAt((curveIndex + 1) % this.getCurveCount());
    /* return */ BezierPath.adjustNeighbourControlPoint(
      mainCurve,
      neighbourCurve,
      mainCurve.getEndPoint(), // the reference point
      mainCurve.getEndControlPoint(), // the dragged control point
      neighbourCurve.getStartPoint(), // the neighbour's point
      neighbourCurve.getStartControlPoint(), // the neighbour's control point to adjust
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
  private static adjustNeighbourControlPoint(
    _mainCurve: CubicBezierCurve, // TODO: remove param
    neighbourCurve: CubicBezierCurve,
    mainPoint: Vertex,
    mainControlPoint: Vertex,
    neighbourPoint: Vertex,
    neighbourControlPoint: Vertex,
    obtainHandleLengths: boolean,
    _updateArcLengths: boolean // TODO: remove param
  ): void {
    // Calculate start handle length
    var mainHandleBounds: Vertex = new Vertex(mainControlPoint.x - mainPoint.x, mainControlPoint.y - mainPoint.y);
    var neighbourHandleBounds: Vertex = new Vertex(
      neighbourControlPoint.x - neighbourPoint.x,
      neighbourControlPoint.y - neighbourPoint.y
    );
    var mainHandleLength: number = Math.sqrt(Math.pow(mainHandleBounds.x, 2) + Math.pow(mainHandleBounds.y, 2));
    var neighbourHandleLength: number = Math.sqrt(Math.pow(neighbourHandleBounds.x, 2) + Math.pow(neighbourHandleBounds.y, 2));

    if (mainHandleLength <= 0.1) return; // no secure length available for division? What about zoom? Use EPSILON?

    // Just invert the main handle (keep length or not?
    if (obtainHandleLengths) {
      neighbourControlPoint.set(
        neighbourPoint.x - mainHandleBounds.x * (neighbourHandleLength / mainHandleLength),
        neighbourPoint.y - mainHandleBounds.y * (neighbourHandleLength / mainHandleLength)
      );
    } else {
      neighbourControlPoint.set(neighbourPoint.x - mainHandleBounds.x, neighbourPoint.y - mainHandleBounds.y);
    }
    neighbourCurve.updateArcLengths();
  }

  /**
   * Get the bounds of this Bézier path.
   *
   * Note the the curves' underlyung segment buffers are used to determine the bounds. The more
   * elements the segment buffers have, the more precise the returned bounds will be.
   *
   * @return {Bounds} The bounds of this Bézier path.
   **/
  getBounds(): Bounds {
    const min: Vertex = new Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    const max: Vertex = new Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    var b: Bounds;
    for (var i = 0; i < this.bezierCurves.length; i++) {
      b = this.bezierCurves[i].getBounds();
      min.x = Math.min(min.x, b.min.x);
      min.y = Math.min(min.y, b.min.y);
      max.x = Math.max(max.x, b.max.x);
      max.y = Math.max(max.y, b.max.y);
    }
    return new Bounds(min, max);
  }

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
  getEvenDistributionVertices(pointCount: number): Array<Vertex> {
    if (pointCount < 2) {
      throw new Error("pointCount must be larger than one; is " + pointCount + ".");
    }

    const result: Array<Vertex> = [];
    if (this.bezierCurves.length === 0) {
      return result;
    }

    // Fetch and add the start point from the source polygon
    var polygonPoint = new Vertex(this.bezierCurves[0].startPoint);
    result.push(polygonPoint);
    // if (this.bezierCurves.length === 1) {
    //   return result;
    // }

    const perimeter: number = this.totalArcLength;
    const stepSize: number = perimeter / (pointCount - 1);
    const n: number = this.bezierCurves.length;

    let curveIndex: number = 0;
    let segmentLength: number = this.bezierCurves[0].arcLength;
    let curSegmentU: number = stepSize;
    let i: number = 1;
    while (i < pointCount && curveIndex < n) {
      // Check if next eq point is inside this segment
      if (curSegmentU < segmentLength) {
        var newPoint = this.bezierCurves[curveIndex].getPoint(curSegmentU);
        result.push(newPoint);
        curSegmentU += stepSize;
        i++;
      } else {
        curveIndex++;
        curSegmentU = curSegmentU - segmentLength;
        segmentLength = curveIndex < n ? this.bezierCurves[curveIndex].arcLength : 0;
      }
    }

    result.push(new Vertex(this.bezierCurves[n - 1].endPoint));
    return result;
  }

  /**
   * Clone this BezierPath (deep clone).
   *
   * @method clone
   * @instance
   * @memberof BezierPath
   * @return {BezierPath}
   **/
  clone(): BezierPath {
    var path: BezierPath = new BezierPath(); // undefined);
    for (var i = 0; i < this.bezierCurves.length; i++) {
      path.bezierCurves.push(this.bezierCurves[i].clone());
      // Connect splines
      if (i > 0) path.bezierCurves[i - 1].endPoint = path.bezierCurves[i].startPoint;
    }
    path.updateArcLengths();
    path.adjustCircular = this.adjustCircular;
    return path;
  }

  /**
   * Compare this and the passed Bézier path.
   *
   * @method equals
   * @param {BezierPath} path - The pass to compare with.
   * @instance
   * @memberof BezierPath
   * @return {boolean}
   **/
  equals(path: BezierPath): boolean {
    if (!path) return false;
    // Check if path contains the credentials
    if (!path.bezierCurves) return false;
    if (typeof path.bezierCurves.length == "undefined") return false;
    if (path.bezierCurves.length != this.bezierCurves.length) return false;
    for (var i = 0; i < this.bezierCurves.length; i++) {
      if (!this.bezierCurves[i].equals(path.bezierCurves[i])) return false;
    }
    return true;
  }

  /**
   * This function should invalidate any installed listeners and invalidate this object.
   * After calling this function the object might not hold valid data any more and
   * should not be used.
   *
   * @method destroy
   * @instance
   * @memberof BezierPath
   */
  destroy() {
    for (var i = 0; i < this.bezierCurves.length; i++) {
      this.bezierCurves[i].destroy();
    }
    this.isDestroyed = true;
  }

  /**
   * Convert this path to an array of path points that can be drawn by the default DrawLib
   * implementations.
   *
   * @method toPathPoints
   * @instance
   * @memberof BezierPath
   * @return {Array<XYCoords>}
   */
  toPathPoints(): Array<XYCoords> {
    if (this.bezierCurves.length === 0) {
      return [];
    }
    if (this.bezierCurves.length === 1) {
      return [
        this.bezierCurves[0].startPoint,
        this.bezierCurves[0].startControlPoint,
        this.bezierCurves[0].endControlPoint,
        this.bezierCurves[0].endPoint
      ];
    }
    const arr: Array<XYCoords> = [];
    arr.push(this.bezierCurves[0].startPoint);
    arr.push(this.bezierCurves[0].startControlPoint);
    for (var i = 1; i < this.bezierCurves.length; i++) {
      arr.push(this.bezierCurves[i - 1].endControlPoint);
      arr.push(this.bezierCurves[i - 1].endPoint);
      arr.push(this.bezierCurves[i].startPoint);
      arr.push(this.bezierCurves[i].startControlPoint);
    }
    arr.push(this.bezierCurves[0].endControlPoint);
    arr.push(this.bezierCurves[0].endPoint);

    return arr;
  }

  /**
   * Create a JSON string representation of this bézier curve.
   *
   * @method toJSON
   * @param {boolean} prettyFormat - If true then the function will add line breaks.
   * @instance
   * @memberof BezierPath
   * @return {string} The JSON string.
   **/
  toJSON(prettyFormat: boolean): string {
    var buffer: Array<string> = [];
    buffer.push("["); // array begin
    for (var i = 0; i < this.bezierCurves.length; i++) {
      if (i > 0) buffer.push(",");
      if (prettyFormat) buffer.push("\n\t");
      else buffer.push(" ");
      buffer.push(this.bezierCurves[i].toJSON(prettyFormat));
    }
    if (this.bezierCurves.length != 0) buffer.push(" ");
    buffer.push("]"); // array end

    return buffer.join(""); // Convert to string, with empty separator.
  }

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
  static fromJSON(jsonString: string): BezierPath {
    var obj: any = JSON.parse(jsonString);
    return BezierPath.fromArray(obj);
  }

  /**
   * Construct a new path with a single curve. Adding more curves is always possible.
   *
   * @method fromCurve
   * @param {CubicBezierCurve} curve - The curve to construct a new path from.
   * @static
   * @memberof BezierPath
   * @return {BezierPath} The constructed bezier path instance.
   */
  static fromCurve(curve: CubicBezierCurve): BezierPath {
    const path = new BezierPath(); // []);
    path.addCurve(curve);
    return path;
  }

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
  static fromArray(obj: any): BezierPath {
    if (!Array.isArray(obj)) {
      throw "[BezierPath.fromArray] Passed object must be an array.";
    }

    const arr: Array<any> = obj as Array<Array<Vertex>>; // FORCE?

    if (arr.length < 1) {
      throw "[BezierPath.fromArray] Passed array must contain at least one bezier curve (has " + arr.length + ").";
    }

    // Create an empty bezier path
    var bPath: BezierPath = new BezierPath(); // undefined);
    var lastCurve: CubicBezierCurve | null = null;
    for (var i = 0; i < arr.length; i++) {
      // Convert object (or array?) to bezier curve
      var bCurve: CubicBezierCurve;
      if (CubicBezierCurve.isInstance(arr[i])) {
        bCurve = arr[i].clone();
      } else if (0 in arr[i] && 1 in arr[i] && 2 in arr[i] && 3 in arr[i]) {
        if (!arr[i][0] || !arr[i][1] || !arr[i][2] || !arr[i][3])
          throw "Cannot convert path data to BezierPath instance. At least one element is undefined (index=" + i + "): " + arr[i];
        bCurve = CubicBezierCurve.fromArray(arr[i]);
      } else {
        bCurve = CubicBezierCurve.fromObject(arr[i]);
      }
      // Set curve start point?
      // (avoid duplicate point instances!)
      if (lastCurve) bCurve.startPoint = lastCurve.endPoint;

      // Add to path's internal list
      bPath.bezierCurves.push(bCurve);
      // bPath.totalArcLength += bCurve.getLength();

      lastCurve = bCurve;
    }
    bPath.updateArcLengths();
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
  toReducedListRepresentation(digits: number): string {
    if (typeof digits == "undefined") digits = 1;

    var buffer: Array<string> = [];
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
  }

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
  static fromReducedListRepresentation(listJSON: string, adjustCircular?: boolean): BezierPath {
    // Parse the array
    var pointArray: Array<number> = JSON.parse(listJSON) as Array<number>;

    if (!pointArray.length) {
      console.log("Cannot parse bezier path from non-array object nor from empty point list.");
      throw "Cannot parse bezier path from non-array object nor from empty point list.";
    }

    if (pointArray.length < 8) {
      console.log("Cannot build bezier path. The passed array must contain at least 8 elements (numbers).");
      throw "Cannot build bezier path. The passed array must contain at least 8 elements (numbers).";
    }

    return BezierPath.fromReducedList(pointArray, adjustCircular);
  }

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
  static fromReducedList(pointArray: Array<number>, adjustCircular?: boolean): BezierPath {
    // Convert to object
    var bezierPath: BezierPath = new BezierPath(); // null); // No points yet

    var startPoint: Vertex = new Vertex();
    var startControlPoint: Vertex;
    var endControlPoint: Vertex;
    var endPoint: Vertex;
    var i: number = 0;

    do {
      if (i == 0) {
        // firstStartPoint =
        startPoint = new Vertex(pointArray[i], pointArray[i + 1]);
      }
      startControlPoint = new Vertex(pointArray[i + 2], pointArray[i + 3]);
      endControlPoint = new Vertex(pointArray[i + 4], pointArray[i + 5]);
      // if (i + 8 >= pointArray.length) {
      //   endPoint = firstStartPoint;
      // } else {
      endPoint = new Vertex(pointArray[i + 6], pointArray[i + 7]);
      // }

      var bCurve: CubicBezierCurve = new CubicBezierCurve(startPoint, endPoint, startControlPoint, endControlPoint);
      bezierPath.bezierCurves.push(bCurve);

      startPoint = endPoint;

      i += 6;
    } while (i + 2 < pointArray.length);
    bezierPath.adjustCircular = adjustCircular ?? false;
    if (adjustCircular) {
      bezierPath.bezierCurves[bezierPath.bezierCurves.length - 1].endPoint = bezierPath.bezierCurves[0].startPoint;
    }
    bezierPath.updateArcLengths();
    return bezierPath;
  }
}
