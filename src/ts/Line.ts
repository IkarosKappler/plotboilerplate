/**
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
 * @modified 2020-12-04 The `intersection` function returns undefined if both lines are parallel.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-10-09 Changed the actual return value of the `intersection` function to null (was undefined before).
 * @modified 2022-10-17 Adding these methods from the `PathSegment` interface: getStartPoint, getEndPoint, revert.
 * @modified 2023-09-25 Changed param type of `intersection()` from Line to VertTuple.
 * @modified 2025-04-15 Class `Line` now implements interface `Intersectable`.
 * @modified 2025-04-16 Class `Line` now implements interface `IBounded`.
 * @version  2.4.0
 *
 * @file Line
 * @public
 **/

import { Bounds } from "./Bounds";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { IBounded, Intersectable, PathSegment, SVGSerializable } from "./interfaces";

/**
 * @classdesc A line consists of two vertices a and b.<br>
 * <br>
 * This is some refactored code from my 'Morley Triangle' test<br>
 *   https://github.com/IkarosKappler/morleys-trisector-theorem
 *
 * @requires Vertex
 */
export class Line extends VertTuple<Line> implements IBounded, Intersectable, PathSegment, SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "Line";

  /**
   * Creates an instance of Line.
   *
   * @constructor
   * @name Line
   * @param {Vertex} a The line's first point.
   * @param {Vertex} b The line's second point.
   **/
  constructor(a: Vertex, b: Vertex) {
    super(a, b, (a: Vertex, b: Vertex) => new Line(a, b));
  }

  /**
   * Get the intersection if this line and the specified line.
   *
   * @method intersection
   * @param {Line} line The second line.
   * @return {Vertex|undefined} The intersection (may lie outside the end-points) or `undefined` if both lines are parallel.
   * @instance
   * @memberof Line
   **/
  // !!! DO NOT MOVE TO VertTuple
  intersection(line: VertTuple<any>): Vertex | null {
    const denominator: number = this.denominator(line);
    if (denominator == 0) {
      return null;
    }

    let a: number = this.a.y - line.a.y;
    let b: number = this.a.x - line.a.x;
    const numerator1: number = (line.b.x - line.a.x) * a - (line.b.y - line.a.y) * b;
    const numerator2: number = (this.b.x - this.a.x) * a - (this.b.y - this.a.y) * b;
    a = numerator1 / denominator; // NaN if parallel lines
    b = numerator2 / denominator;

    // Catch NaN?
    const x: number = this.a.x + a * (this.b.x - this.a.x);
    const y: number = this.a.y + a * (this.b.y - this.a.y);

    if (isNaN(a) || isNaN(x) || isNaN(y)) {
      return null;
    }

    // if we cast these lines infinitely in both directions, they intersect here:
    return new Vertex(x, y);
  }

  //--- BEGIN --- Implement interface `IBounded`
  /**
   * Get the bounding box (bounds) of this Line.
   *
   * @method getBounds
   * @instance
   * @memberof Line
   * @return {Bounds} The rectangular bounds of this Line.
   **/
  getBounds(): Bounds {
    return Bounds.computeFromVertices([this.a, this.b]);
  }
  //--- END --- Implement interface `IBounded`

  //--- Implement PathSegment ---
  /**
   * Get the start point of this path segment.
   *
   * @method getStartPoint
   * @memberof PathSegment
   * @return {Vertex} The start point of this path segment.
   */
  getStartPoint(): Vertex {
    return this.a;
  }

  /**
   * Get the end point of this path segment.
   *
   * @method getEndPoint
   * @memberof PathSegment
   * @return {Vertex} The end point of this path segment.
   */
  getEndPoint(): Vertex {
    return this.b;
  }

  /**
   * Get the tangent's end point at the start point of this segment.
   *
   * @method getStartTangent
   * @memberof PathSegment
   * @return {Vertex} The end point of the starting point's tangent.
   */
  getStartTangent(): Vertex {
    return this.b;
  }

  /**
   * Get the tangent's end point at the end point of this segment.
   *
   * @method getEndTangent
   * @memberof PathSegment
   * @return {Vertex} The end point of the ending point's tangent.
   */
  getEndTangent(): Vertex {
    return this.a;
  }

  /**
   * Inverse this path segment (in-place) and return this same instance (useful for chaining).
   *
   * @method reverse
   * @memberof PathSegment
   * @return {PathSegment} This path segment instance (for chaining).
   */
  reverse(): Line {
    var tmp = this.a;
    this.a = this.b;
    this.b = tmp;
    return this;
  }
  //--- END Implement PathSegment ---

  //--- BEGIN --- Implement interface `Intersectable`
  /**
   * Get all line intersections with this polygon.
   *
   * This method returns all intersections (as vertices) with this shape. The returned array of vertices is in no specific order.
   *
   * See demo `47-closest-vector-projection-on-polygon` for how it works.
   *
   * @param {VertTuple} line - The line to find intersections with.
   * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
   * @returns {Array<Vertex>} - An array of all intersections within the polygon bounds.
   */
  lineIntersections(line: VertTuple<any>, inVectorBoundsOnly: boolean = false): Array<Vertex> {
    // Find the intersections of all lines inside the edge bounds
    const intersection: Vertex | null = this.intersection(line);
    if (!intersection) {
      return []; // Both lines parallel
    }
    if (this.hasPoint(intersection, true) && (!inVectorBoundsOnly || line.hasPoint(intersection, inVectorBoundsOnly))) {
      return [intersection];
    } else {
      return [];
    }
  }

  /**
   * Get all line intersections of this polygon and their tangents along the shape.
   *
   * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
   *
   * @param line
   * @param inVectorBoundsOnly
   * @returns
   */
  lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly: boolean = false): Array<Vector> {
    // Find the intersection tangents of all lines inside the edge bounds
    const intersections: Vertex[] = this.lineIntersections(line, inVectorBoundsOnly);
    if (intersections.length === 0) {
      return [];
    }
    const intrsctn = intersections[0];
    return [new Vector(this.a.clone(), this.b.clone()).moveTo(intrsctn) as Vector];
  }
  //--- END --- Implement interface `Intersectable`
}
