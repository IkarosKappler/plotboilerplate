/**
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
 * @modified  2020-06-18 Added the `getIncenter` function.
 * @modified  2020-12-28 Added the `getArea` function.
 * @modified  2021-01-20 Added UID.
 * @modified  2021-01-22 Always updating circumcircle when retieving it.
 * @modified  2022-02-02 Added the `destroy` method.
 * @modified  2022-02-02 Cleared the `Triangle.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified  2024-11-22 Added static utility function Triangle.utils.determinant; adapted method `determinant`.
 * @modified  2024-11-22 Changing visibility of `Triangle.utils` from `private` to `public`.
 * @modified  2025-14-16 Class `Triangle` now implements interface `Intersectable`.
 * @modified  2025-14-16 Class `Triangle` now implements interface `IBounded`.
 * @modified  2025-14-16 Class `Triangle` now implements interface `Intersectable`.
 * @modified  2025-14-16 Added method `Triangle.move`.
 * @version   2.10.0
 *
 * @file Triangle
 * @fileoverview A simple triangle class: three vertices.
 * @public
 **/

import { Bounds } from "./Bounds";
import { Circle } from "./Circle";
import { Line } from "./Line";
import { Polygon } from "./Polygon";
import { UIDGenerator } from "./UIDGenerator";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { geomutils } from "./geomutils";
import { IBounded, Intersectable, SVGSerializable, UID, XYCoords } from "./interfaces";

/**
 * @classdesc A triangle class for triangulations.
 *
 * The class was written for a Delaunay trinagulation demo so it might
 * contain some strange and unexpected functions.
 *
 * @requires Bounds
 * @requires Circle
 * @requires Line
 * @requires Vertex
 * @requires Polygon
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires geomutils
 *
 */
export class Triangle implements IBounded, SVGSerializable, Intersectable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "Triangle";

  /**
   * The UID of this drawable object.
   *
   * @member {UID}
   * @memberof Triangle
   * @instance
   * @readonly
   */
  readonly uid: UID;

  /**
   * An epsilon for comparison.
   * This should be the same epsilon as in Vertex.
   *
   * @private
   **/
  static readonly EPSILON: number = 1.0e-6;

  /**
   * @member {Vertex}
   * @memberof Triangle
   * @instance
   */
  a: Vertex;

  /**
   * @member {Vertex}
   * @memberof Triangle
   * @instance
   */
  b: Vertex;

  /**
   * @member {Vertex}
   * @memberof Triangle
   * @instance
   */
  c: Vertex;

  /**
   * @member {Vertex}
   * @memberof Triangle
   * @instance
   * @private
   */
  private center: Vertex;

  /**
   * @member {number}
   * @memberof Triangle
   * @instance
   * @private
   */
  private radius_squared: number;

  /**
   * @member {number}
   * @memberof Triangle
   * @instance
   * @private
   */
  private radius: number;

  /**
   * @member isDestroyed
   * @memberof Triangle
   * @type {boolean}
   * @instance
   */
  isDestroyed: boolean;

  /**
   * The constructor.
   *
   * @constructor
   * @name Triangle
   * @param {Vertex} a - The first vertex of the triangle.
   * @param {Vertex} b - The second vertex of the triangle.
   * @param {Vertex} c - The third vertex of the triangle.
   **/
  constructor(a: Vertex, b: Vertex, c: Vertex) {
    this.uid = UIDGenerator.next();
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
  static fromArray(arr: Array<Vertex>): Triangle {
    if (arr.length < 3) throw `Cannot create triangle from array with less than three vertices (${arr.length})`;
    return new Triangle(arr[0], arr[1], arr[2]);
  }

  /**
   * Get the area of this triangle. The returned area is never negative.
   *
   * If you are interested in the signed area, please consider using the
   * `Triangle.utils.signedArea` helper function. This method just returns
   * the absolute value of the signed area.
   *
   * @method getArea
   * @instance
   * @memberof Triangle
   * @return {number} The non-negative area of this triangle.
   */
  getArea(): number {
    return Math.abs(Triangle.utils.signedArea(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y));
  }

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
  getCentroid(): Vertex {
    return new Vertex((this.a.x + this.b.x + this.c.x) / 3, (this.a.y + this.b.y + this.c.y) / 3);
  }

  /**
   * Scale the triangle towards its centroid.
   *
   * @method scaleToCentroid
   * @param {number} - The scale factor to use. That can be any scalar.
   * @return {Triangle} this (for chaining)
   * @instance
   * @memberof Triangle
   */
  scaleToCentroid(factor: number): Triangle {
    let centroid: Vertex = this.getCentroid();
    this.a.scale(factor, centroid);
    this.b.scale(factor, centroid);
    this.c.scale(factor, centroid);
    return this;
  }

  //--- BEGIN --- Implement interface `IBounded`
  /**
   * Get the bounding box (bounds) of this Triangle.
   *
   * @method getBounds
   * @instance
   * @memberof Triangle
   * @return {Bounds} The rectangular bounds of this Triangle.
   **/
  getBounds(): Bounds {
    // return Bounds.computeFromVertices([this.a, this.b, this.c]);
    return this.bounds();
  }
  //--- END --- Implement interface `IBounded`

  /**
   * Move the Triangle's vertices by the given amount.
   *
   * @method move
   * @param {XYCoords} amount - The amount to move.
   * @instance
   * @memberof Triangle
   * @return {Triangle} this for chaining
   **/
  move(amount: XYCoords): Triangle {
    this.a.add(amount);
    this.b.add(amount);
    this.c.add(amount);
    return this;
  }

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
  getCircumcircle(): Circle {
    // if( !this.center || !this.radius )
    this.calcCircumcircle();
    return new Circle(this.center.clone(), this.radius);
  }

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
  isAdjacent(tri: Triangle): boolean {
    var a: boolean = this.a.equals(tri.a) || this.a.equals(tri.b) || this.a.equals(tri.c);
    var b: boolean = this.b.equals(tri.a) || this.b.equals(tri.b) || this.b.equals(tri.c);
    var c: boolean = this.c.equals(tri.a) || this.c.equals(tri.b) || this.c.equals(tri.c);
    return (a && b) || (a && c) || (b && c);
  }

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
  getThirdVertex(vert1: Vertex, vert2: Vertex): Vertex {
    if ((this.a.equals(vert1) && this.b.equals(vert2)) || (this.a.equals(vert2) && this.b.equals(vert1))) return this.c;
    if ((this.b.equals(vert1) && this.c.equals(vert2)) || (this.b.equals(vert2) && this.c.equals(vert1))) return this.a;
    //if( this.c.equals(vert1) && this.a.equals(vert2) || this.c.equals(vert2) && this.a.equals(vert1) )
    return this.b;
  }

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
  calcCircumcircle() {
    // From
    //    http://www.exaflop.org/docs/cgafaq/cga1.html

    const A: number = this.b.x - this.a.x;
    const B: number = this.b.y - this.a.y;
    const C: number = this.c.x - this.a.x;
    const D: number = this.c.y - this.a.y;

    const E: number = A * (this.a.x + this.b.x) + B * (this.a.y + this.b.y);
    const F: number = C * (this.a.x + this.c.x) + D * (this.a.y + this.c.y);

    const G: number = 2.0 * (A * (this.c.y - this.b.y) - B * (this.c.x - this.b.x));

    let dx: number, dy: number;

    if (Math.abs(G) < Triangle.EPSILON) {
      // Collinear - find extremes and use the midpoint
      const bounds: Bounds = this.bounds();
      this.center = new Vertex((bounds.min.x + bounds.max.x) / 2, (bounds.min.y + bounds.max.y) / 2);
      dx = this.center.x - bounds.min.x;
      dy = this.center.y - bounds.min.y;
    } else {
      const cx: number = (D * E - B * F) / G;
      const cy: number = (A * F - C * E) / G;
      this.center = new Vertex(cx, cy);
      dx = this.center.x - this.a.x;
      dy = this.center.y - this.a.y;
    }

    this.radius_squared = dx * dx + dy * dy;
    this.radius = Math.sqrt(this.radius_squared);
  } // END calcCircumcircle

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
  inCircumcircle(v: Vertex): boolean {
    const dx: number = this.center.x - v.x;
    const dy: number = this.center.y - v.y;
    const dist_squared: number = dx * dx + dy * dy;
    return dist_squared <= this.radius_squared;
  }

  /**
   * Get the rectangular bounds for this triangle.
   *
   * @method bounds
   * @return {Bounds} - The min/max bounds of this triangle.
   * @instance
   * @memberof Triangle
   */
  bounds(): Bounds {
    return new Bounds(
      new Vertex(Triangle.utils.min3(this.a.x, this.b.x, this.c.x), Triangle.utils.min3(this.a.y, this.b.y, this.c.y)),
      new Vertex(Triangle.utils.max3(this.a.x, this.b.x, this.c.x), Triangle.utils.max3(this.a.y, this.b.y, this.c.y))
    );
  }

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
    return Polygon.utils
      .locateLineIntersecion(line, [this.a, this.b, this.c], false, inVectorBoundsOnly)
      .map(intersectionTuple => intersectionTuple.intersectionPoint);
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
    return Polygon.utils
      .locateLineIntersecion(line, [this.a, this.b, this.c], false, inVectorBoundsOnly)
      .map(intersectionTuple => {
        // const polyLine = this.getEdgeAt(intersectionTuple.edgeIndex);
        const polyLine = this.getEdgeAt(intersectionTuple.edgeIndex);
        return new Vector(polyLine.a.clone(), polyLine.b.clone()).moveTo(intersectionTuple.intersectionPoint) as Vector;
      });
  }
  //--- END --- Implement interface `Intersectable`

  getEdgeAt(edgeIndex: number): Line {
    var modIndex = edgeIndex % 3;
    return modIndex === 0 ? new Line(this.a, this.b) : modIndex === 1 ? new Line(this.b, this.c) : new Line(this.c, this.a);
  }

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
  toPolygon(): Polygon {
    return new Polygon([this.a, this.b, this.c]);
  }

  /**
   * Get the determinant of this triangle.
   *
   * @method determinant
   * @return {number} - The determinant (float).
   * @instance
   * @memberof Triangle
   */
  determinant(): number {
    // (b.y - a.y)*(c.x - b.x) - (c.y - b.y)*(b.x - a.x);
    // return (this.b.y - this.a.y) * (this.c.x - this.b.x) - (this.c.y - this.b.y) * (this.b.x - this.a.x);
    return Triangle.utils.determinant(this.a, this.b, this.c);
  }

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
  containsPoint(p: Vertex): boolean {
    return Triangle.utils.pointIsInTriangle(p.x, p.y, this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
  }

  /**
   * Get that inner triangle which defines the maximal incircle.
   *
   * @return {Triangle} The triangle of those points in this triangle that define the incircle.
   */
  getIncircularTriangle(): Triangle {
    const lineA = new Line(this.a, this.b);
    const lineB = new Line(this.b, this.c);
    const lineC = new Line(this.c, this.a);

    const bisector1 = geomutils.nsectAngle(this.b, this.a, this.c, 2)[0]; // bisector of first angle (in b)
    const bisector2 = geomutils.nsectAngle(this.c, this.b, this.a, 2)[0]; // bisector of second angle (in c)
    // Cast to non-null here because we know there _is_ an intersection
    const intersection = bisector1.intersection(bisector2) as Vertex;

    // Find the closest points on one of the polygon lines (all have same distance by construction)
    const circleIntersA = lineA.getClosestPoint(intersection);
    const circleIntersB = lineB.getClosestPoint(intersection);
    const circleIntersC = lineC.getClosestPoint(intersection);

    return new Triangle(circleIntersA, circleIntersB, circleIntersC);
  }

  /**
   * Get the incircle of this triangle. That is the circle that touches each side
   * of this triangle in exactly one point.
   *
   * Note this just calls getIncircularTriangle().getCircumcircle()
   *
   * @return {Circle} The incircle of this triangle.
   */
  getIncircle(): Circle {
    return this.getIncircularTriangle().getCircumcircle();
  }

  /**
   * Get the incenter of this triangle (which is the center of the circumcircle).
   *
   * Note: due to performance reasonst the incenter is buffered inside the triangle because
   *       computing it is relatively expensive. If a, b or c have changed you should call the
   *       calcCircumcircle() function first, otherwise you might get wrong results.
   * @return Vertex The incenter of this triangle.
   **/
  getIncenter(): Vertex {
    if (!this.center || !this.radius) this.calcCircumcircle();
    return this.center.clone();
  }

  /**
   * Converts this triangle into a human-readable string.
   *
   * @method toString
   * @return {string}
   * @instance
   * @memberof Triangle
   */
  toString(): string {
    return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + ", c : " + this.c.toString() + "}";
  }

  /**
   * This function should invalidate any installed listeners and invalidate this object.
   * After calling this function the object might not hold valid data any more and
   * should not be used.
   */
  destroy() {
    this.a.destroy();
    this.b.destroy();
    this.c.destroy();
    this.isDestroyed = true;
  }

  public static utils = {
    // Used in the bounds() function.
    max3(a: number, b: number, c: number): number {
      return a >= b && a >= c ? a : b >= a && b >= c ? b : c;
    },
    min3(a: number, b: number, c: number): number {
      return a <= b && a <= c ? a : b <= a && b <= c ? b : c;
    },
    signedArea(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number): number {
      return 0.5 * (-p1y * p2x + p0y * (-p1x + p2x) + p0x * (p1y - p2y) + p1x * p2y);
    },
    /**
     * Used by the containsPoint() function.
     *
     * @private
     **/
    pointIsInTriangle(
      px: number,
      py: number,
      p0x: number,
      p0y: number,
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number
    ): boolean {
      //
      // Point-in-Triangle test found at
      //   http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-2d-triangle
      // var area : number = 1/2*(-p1y*p2x + p0y*(-p1x + p2x) + p0x*(p1y - p2y) + p1x*p2y);
      var area: number = Triangle.utils.signedArea(p0x, p0y, p1x, p1y, p2x, p2y);

      var s: number = (1 / (2 * area)) * (p0y * p2x - p0x * p2y + (p2y - p0y) * px + (p0x - p2x) * py);
      var t: number = (1 / (2 * area)) * (p0x * p1y - p0y * p1x + (p0y - p1y) * px + (p1x - p0x) * py);

      return s > 0 && t > 0 && 1 - s - t > 0;
    },

    /**
     * Calculate the determinant of the three vertices a, b and c (in this order).
     * @param {XYCords} a - The first vertex.
     * @param {XYCords} b - The first vertex.
     * @param {XYCords} c - The first vertex.
     * @returns {nmber}
     */
    determinant(a: XYCoords, b: XYCoords, c: XYCoords): number {
      return (b.y - a.y) * (c.x - b.x) - (c.y - b.y) * (b.x - a.x);
    }
  };
}
