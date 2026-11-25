/**
 * @date 2026-11-25
 */

import { Circle } from "../../Circle";
import { CircleSector } from "../../CircleSector";
import { Line } from "../../Line";
import { Triangle } from "../../Triangle";
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180.0 / Math.PI;

export class EllipseFromThreePoints {
  private inputPointA: Vertex;
  private inputPointB: Vertex;
  private inputPointC: Vertex;

  private pointA: Vertex;
  private pointB: Vertex;
  private pointC: Vertex;

  private circle: Circle;
  private circleSector: CircleSector;

  constructor(inputPointA: Vertex, inputPointB: Vertex, inputPointC: Vertex) {
    this.inputPointA = inputPointA;
    this.inputPointB = inputPointB;
    this.inputPointC = inputPointC;
  }

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

  // +---------------------------------------------------------------------------------
  // | Calculate the next iteration step.
  // +-------------------------------
  calculateNextStep(focalControlAngleDeg: number) {
    // Create ellipse
    var localFocalControlPoint = this.circle.vertAt(
      this.circleSector.startAngle + Math.PI / 2.0 - focalControlAngleDeg * DEG_TO_RAD
    );
    var axis1 = new Line(this.pointA, localFocalControlPoint);
    var axis2 = new Line(this.pointB, localFocalControlPoint);
    var axisControlPoint = localFocalControlPoint.clone().scale(-1.0, this.circle.center);
    var ellipse = new VEllipse(localFocalControlPoint, axisControlPoint, axis1.angle());
    return ellipse;
  }
}
