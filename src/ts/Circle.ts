/**
 * @author   Ikaros Kappler
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 * @modified 2020-05-25 Added the vertAt and tangentAt functions.
 * @mofidied 2020-09-07 Added the circleIntersection(Circle) function.
 * @modified 2020-09-07 Changed the vertAt function by switching sin and cos! The old version did not return the correct vertex (by angle) accoring to the assumed circle math.
 * @modified 2020-10-16 Added the containsCircle(...) function.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-08-15 Added the `containsPoint` function.
 * @modified 2022-08-23 Added the `lineIntersection` function.
 * @modified 2022-08-23 Added the `closestPoint` function.
 * @version  1.4.0
 **/

import { Line } from "./Line";
import { UIDGenerator } from "./UIDGenerator";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGSerializable, UID, XYCoords } from "./interfaces";

/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export class Circle implements SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "Circle";

  /**
   * The UID of this drawable object.
   *
   * @member {UID}
   * @memberof Circle
   * @instance
   * @readonly
   */
  readonly uid: UID;

  /**
   * @member {Vertex}
   * @memberof Circle
   * @instance
   */
  center: Vertex;

  /**
   * @member {number}
   * @memberof Circle
   * @instance
   */
  radius: number;

  /**
   * @member isDestroyed
   * @memberof CubicBezierCurve
   * @type {boolean}
   * @instance
   */
  isDestroyed: boolean;

  /**
   * Create a new circle with given center point and radius.
   *
   * @constructor
   * @name Circle
   * @param {Vertex} center - The center point of the circle.
   * @param {number} radius - The radius of the circle.
   */
  constructor(center: Vertex, radius: number) {
    this.uid = UIDGenerator.next();
    this.center = center;
    this.radius = radius;
  }

  /**
   * Check if the given circle is fully contained inside this circle.
   *
   * @method containsPoint
   * @param {XYCoords} point - The point to check if it is contained in this circle.
   * @instance
   * @memberof Circle
   * @return {boolean} `true` if the given point is inside this circle.
   */
  containsPoint(point: XYCoords): boolean {
    return this.center.distance(point) < this.radius;
  }

  /**
   * Check if the given circle is fully contained inside this circle.
   *
   * @method containsCircle
   * @param {Circle} circle - The circle to check if it is contained in this circle.
   * @instance
   * @memberof Circle
   * @return {boolean} `true` if any only if the given circle is completely inside this circle.
   */
  containsCircle(circle: Circle): boolean {
    return this.center.distance(circle.center) + circle.radius < this.radius;
  }

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
  lineDistance(line: VertTuple<any>): number {
    const closestPointOnLine: Vertex = line.getClosestPoint(this.center);
    return closestPointOnLine.distance(this.center) - this.radius;
  }

  /**
   * Get the vertex on the this circle for the given angle.
   *
   * @method vertAt
   * @param {number} angle - The angle (in radians) to use.
   * @return {Vertex} The vertex (point) at the given angle.
   * @instance
   * @memberof Circle
   **/
  vertAt(angle: number): Vertex {
    // Find the point on the circle respective the angle. Then move relative to center.
    return Circle.circleUtils.vertAt(angle, this.radius).add(this.center);
  }

  /**
   * Get a tangent line of this circle for a given angle.
   *
   * Point a of the returned line is located on the circle, the length equals the radius.
   *
   * @method tangentAt
   * @instance
   * @param {number} angle - The angle (in radians) to use.
   * @return {Line} The tangent line.
   * @memberof Circle
   **/
  tangentAt(angle: number): Vector {
    const pointA: Vertex = Circle.circleUtils.vertAt(angle, this.radius);
    // Construct the perpendicular of the line in point a. Then move relative to center.
    return (new Vector(pointA, new Vertex(0, 0)).add(this.center) as Vector).perp() as Vector;
  }

  /**
   * Calculate the intersection points (if exists) with the given circle.
   *
   * @method circleIntersection
   * @instance
   * @memberof Circle
   * @param {Circle} circle
   * @return {Line|null} The intersection points (as a line) or null if the two circles do not intersect.
   **/
  circleIntersection(circle: Circle): Line | null {
    // Circles do not intersect at all?
    if (this.center.distance(circle.center) > this.radius + circle.radius) {
      return null;
    }
    // One circle is fully inside the other?
    if (this.center.distance(circle.center) < Math.abs(this.radius - circle.radius)) {
      return null;
    }
    // Based on the C++ implementation by Robert King
    //    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
    // and the 'Circles and spheres' article by Paul Bourke.
    //    http://paulbourke.net/geometry/circlesphere/
    //
    // This is the original C++ implementation:
    //
    // pair<Point, Point> intersections(Circle c) {
    //    Point P0(x, y);
    //    Point P1(c.x, c.y);
    //    float d, a, h;
    //    d = P0.distance(P1);
    //    a = (r*r - c.r*c.r + d*d)/(2*d);
    //    h = sqrt(r*r - a*a);
    //    Point P2 = P1.sub(P0).scale(a/d).add(P0);
    //    float x3, y3, x4, y4;
    //    x3 = P2.x + h*(P1.y - P0.y)/d;
    //    y3 = P2.y - h*(P1.x - P0.x)/d;
    //    x4 = P2.x - h*(P1.y - P0.y)/d;
    //    y4 = P2.y + h*(P1.x - P0.x)/d;
    //    return pair<Point, Point>(Point(x3, y3), Point(x4, y4));
    // }
    var p0 = this.center;
    var p1 = circle.center;
    var d = p0.distance(p1);
    var a = (this.radius * this.radius - circle.radius * circle.radius + d * d) / (2 * d);
    var h = Math.sqrt(this.radius * this.radius - a * a);
    var p2 = p1.clone().scale(a / d, p0);
    var x3 = p2.x + (h * (p1.y - p0.y)) / d;
    var y3 = p2.y - (h * (p1.x - p0.x)) / d;
    var x4 = p2.x - (h * (p1.y - p0.y)) / d;
    var y4 = p2.y + (h * (p1.x - p0.x)) / d;
    return new Line(new Vertex(x3, y3), new Vertex(x4, y4));
  }

  /**
   * Calculate the intersection points (if exists) with the given infinite line (defined by two points).
   *
   * @method lineIntersection
   * @instance
   * @memberof Circle
   * @param {Vertex} a- The first of the two points defining the line.
   * @param {Vertex} b - The second of the two points defining the line.
   * @return {Line|null} The intersection points (as a line) or null if this circle does not intersect the line given.
   **/
  lineIntersection(a: Vertex, b: XYCoords): Line | null {
    // Based on the math from
    //    https://mathworld.wolfram.com/Circle-LineIntersection.html
    const interA = new Vertex();
    const interB = new Vertex();

    // First do a transformation, because the calculation is based on a cicle at (0,0)
    const transA = new Vertex(a).sub(this.center);
    const transB = new Vertex(b).sub(this.center);

    const diff: XYCoords = transA.difference(transB);
    // There is a special case if diff.y=0, where the intersection is not calcuatable.
    // Use an non-zero epsilon here to approximate this case.
    // TODO for the future: find a better solution
    if (Math.abs(diff.y) === 0) {
      diff.y = 0.000001;
    }

    const dist: number = transA.distance(transB);
    const det: number = transA.x * transB.y - transA.y * transB.x;
    const distSquared: number = dist * dist;
    const radiusSquared: number = this.radius * this.radius;

    // Check if circle and line have an intersection at all
    if (radiusSquared * distSquared - det * det < 0) {
      return null;
    }

    const belowSqrt: number = this.radius * this.radius * dist * dist - det * det;
    const sqrt: number = Math.sqrt(belowSqrt);

    interA.x = (det * diff.y + Math.sign(diff.y) * diff.x * sqrt) / distSquared;
    interB.x = (det * diff.y - Math.sign(diff.y) * diff.x * sqrt) / distSquared;

    interA.y = (-det * diff.x + Math.abs(diff.y) * sqrt) / distSquared;
    interB.y = (-det * diff.x - Math.abs(diff.y) * sqrt) / distSquared;

    return new Line(interA.add(this.center), interB.add(this.center));
    // return new Line(interA, interB);
  }

  /**
   * Calculate the closest point on the outline of this circle to the given point.
   *
   * @method closestPoint
   * @instance
   * @memberof Circle
   * @param {XYCoords} vert - The point to find the closest circle point for.
   * @return {Vertex} The closest point on this circle.
   **/
  closestPoint(vert: XYCoords): Vertex {
    const lineIntersection = this.lineIntersection(this.center, vert);
    if (!lineIntersection) {
      // Note: this case should not happen as a radial from the center always intersect this circle.
      return new Vertex();
    }
    // Return closed of both
    if (lineIntersection.a.distance(vert) < lineIntersection.b.distance(vert)) {
      return lineIntersection.a;
    } else {
      return lineIntersection.b;
    }
  }

  /**
   * This function should invalidate any installed listeners and invalidate this object.
   * After calling this function the object might not hold valid data any more and
   * should not be used.
   */
  destroy() {
    this.center.destroy();
    this.isDestroyed = true;
  }

  static circleUtils = {
    vertAt: (angle: number, radius: number) => {
      /* return new Vertex( Math.sin(angle) * radius,
			       Math.cos(angle) * radius ); */
      return new Vertex(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
  };
} // END class
