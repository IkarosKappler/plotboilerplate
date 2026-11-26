/**
 * Approximate ellipses for three points: two points from the longest edge and a third one on the defining circle.
 *
 * @date    2026-11-25
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import { Circle } from "../../Circle";
import { CircleSector } from "../../CircleSector";
import { Line } from "../../Line";
import { Triangle } from "../../Triangle";
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180.0 / Math.PI;

export class EllipseFromThreePointsApproximation {
  public inputPointA: Vertex;
  public inputPointB: Vertex;
  public inputPointC: Vertex;

  /**
   * The following three points form a triangle with the following conditions:
   *  - A->B is the longest edge (hypotenuse).
   *  - A->B->C are arranged clockwise.
   */
  public pointA: Vertex;
  public pointB: Vertex;
  public pointC: Vertex;

  /**
   * A helper line connection A->B.
   */
  public lineAB: Line;

  /**
   * A helper circle with the condition:
   *  - The middle point of line A->B is the center of the circle.
   *  - The radius is half the length of A->B (points A and B are located on the circle).
   */
  public circle: Circle;

  /**
   * A helper circle sector with the condition:
   *  - The underlying circle is the one defined by A->B.
   *  - The point at `startAngle` is identical with A.
   *  - The point at `endAngle` is identical with B.
   */
  public circleSector: CircleSector;

  /**
   * A helper control point that is located somewhere on the circle sector (depending on some input angle).
   */
  public focalControlPoint: Vertex;

  /**
   * The constructor. Creates a new ellipse approximation helper from the given threee input point.
   * @param {Vertex} inputPointA - The first random input point.
   * @param {Vertex} inputPointB - The second random input point.
   * @param {Vertex} inputPointC - The thrird random input point.
   */
  constructor(inputPointA: Vertex, inputPointB: Vertex, inputPointC: Vertex) {
    this.inputPointA = inputPointA;
    this.inputPointB = inputPointB;
    this.inputPointC = inputPointC;

    this.pointA = this.inputPointA.clone();
    this.pointB = this.inputPointB.clone();
    this.pointC = this.inputPointC.clone();

    this.lineAB = new Line(this.pointA, this.pointB);

    // Init helper circle and circleSector with random start values.
    this.circle = new Circle(new Vertex(0.0), 100.0);
    this.circleSector = new CircleSector(this.circle, -Math.PI / 2.0, Math.PI / 2.0);
    this.focalControlPoint = new Vertex(0.0);
  }

  /**
   * Whenever any of the input points changes call this method.
   * It will re-arrage `pointA`, `pointB`, and `pointC` to meet the triangle condition.
   */
  arrangeInputPoints() {
    // We define folliwing two conditions to the three points:
    //  (a) The line A→B must be the longest one from the triangle.
    //  (b) The trinangle (A,B,C) must be in clockwise winding order.
    var lengthAB = this.inputPointA.distance(this.inputPointB);
    var lengthBC = this.inputPointB.distance(this.inputPointC);
    var lengthCA = this.inputPointC.distance(this.inputPointA);
    if (lengthAB >= lengthBC && lengthAB >= lengthCA) {
      this.pointA.set(this.inputPointA);
      this.pointB.set(this.inputPointB);
      this.pointC.set(this.inputPointC);
    } else if (lengthBC >= lengthCA && lengthBC >= lengthAB) {
      this.pointA.set(this.inputPointB);
      this.pointB.set(this.inputPointC);
      this.pointC.set(this.inputPointA);
    } else {
      // CA is the longest edge
      this.pointA.set(this.inputPointC);
      this.pointB.set(this.inputPointA);
      this.pointC.set(this.inputPointB);
    }

    // Triangle must be clockwise.
    if (!Triangle.utils.isClockwise(this.pointA, this.pointB, this.pointC)) {
      // Swap A and B
      var tmp = this.pointA.clone();
      this.pointA.set(this.pointB);
      this.pointB.set(tmp);
    }
  }

  /**
   * Update the focal control point on the circle sector to be located at the given input angle.
   * The angle is relative: 0 means, identical point with the sectors start angle.
   *
   * @param {number} focalControlAngleRad - The circle sector angle in radians.
   */
  updateFocalControlPoint(focalControlAngleRad: number) {
    this.focalControlPoint.set(
      this.circle.vertAt(
        this.circleSector.startAngle + Math.PI / 2.0 - focalControlAngleRad //  appContext.config.focalControlAngleDeg * DEG_TO_RAD
      )
    );
  }

  /**
   * Updates the helper circle depending on points A and B.
   */
  updateHelperCircle() {
    this.circle.center.set(this.lineAB.vertAt(0.5));
    this.circle.radius = this.lineAB.length() / 2.0;
    // cirleSector = new CircleSector(circle, lineAB.angle(), lineAB.angle() + Math.PI);
    this.circleSector.startAngle = this.lineAB.angle();
    this.circleSector.endAngle = this.lineAB.angle() + Math.PI;
  }

  /**
   * Approximate the desired elliptic focal angle recursively (inside the given angle range).
   * To get the resulting ellipse use method `calculateEllipseFromFocalAngle`.
   *
   * The `iterCount` param determines the recursion depth:
   *  - a higher value gives more precise results (but bad performance).
   *  - a lower value is quicker but gives bad results.
   *
   * A value between 10 and 20 is usually pretty sufficient for pure visual applications.
   *
   * @param {number} beginAngleRad - The range's begin angle (in radians).
   * @param {number} endAngleRad - The range's end angle (in radians).
   * @param {number} iterCount - The number of iterations.
   * @param {number} cachedEllipses - An optional array to store temporary results in each iteration step.
   * @returns
   */
  findCorrectAngleRecursive(
    beginAngleRad: number,
    endAngleRad: number,
    iterCount: number,
    cachedEllipses?: Array<{ ellipse: VEllipse; focalAngle: number }>
  ) {
    // var newFocalControlAngleDeg = Math.PI / 4.0;
    // Bisect the begin- and end-angle
    var newFocalControlAngleRad = beginAngleRad + (endAngleRad - beginAngleRad) / 2.0;
    if (iterCount <= 0) {
      return newFocalControlAngleRad;
    }
    var nextEllipse = this.calculateEllipseFromFocalAngle(newFocalControlAngleRad); // TODO TEST * RAD_TO_DEG);
    var focalAngleDeg = newFocalControlAngleRad * RAD_TO_DEG;
    if (cachedEllipses) {
      cachedEllipses.push({ ellipse: nextEllipse, focalAngle: focalAngleDeg });
    }
    // Why is this not working
    if (nextEllipse.containsPoint(this.pointC)) {
      // ...
      return this.findCorrectAngleRecursive(newFocalControlAngleRad, endAngleRad, iterCount - 1, cachedEllipses);
    } else {
      return this.findCorrectAngleRecursive(beginAngleRad, newFocalControlAngleRad, iterCount - 1, cachedEllipses);
    }
  }

  /**
   * Get the ellipse from the current point settings of `pointA` and `pointB` and the given focal angle.
   * The angle is relative to the underlying circle sector and should be in [-PI/2, +PI/2].
   *
   * @param {number} focalControlAngleRad - The focal angle in radians.
   * @returns {VEllipse} The ellipse at the given focal angle.
   */
  calculateEllipseFromFocalAngle(focalControlAngleRad: number) {
    // Create ellipse
    var localFocalControlPoint = this.circle.vertAt(this.circleSector.startAngle + Math.PI / 2.0 - focalControlAngleRad);
    var axis1 = new Line(this.pointA, localFocalControlPoint);
    var axis2 = new Line(this.pointB, localFocalControlPoint);
    var axisControlPoint = localFocalControlPoint.clone().scale(-1.0, this.circle.center);
    var ellipse = new VEllipse(localFocalControlPoint, axisControlPoint, axis1.angle());
    return ellipse;
  }
}
