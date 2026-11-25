"use strict";
/**
 * @date 2026-11-25
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EllipseFromThreePoints = void 0;
var Line_1 = require("../../Line");
var Triangle_1 = require("../../Triangle");
var VEllipse_1 = require("../../VEllipse");
var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180.0 / Math.PI;
var EllipseFromThreePoints = /** @class */ (function () {
    function EllipseFromThreePoints(inputPointA, inputPointB, inputPointC) {
        this.inputPointA = inputPointA;
        this.inputPointB = inputPointB;
        this.inputPointC = inputPointC;
    }
    EllipseFromThreePoints.prototype.arrangeInputPoints = function () {
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
        }
        else if (lengthBC >= lengthCA && lengthBC >= lengthAB) {
            this.pointA.set(this.inputPointB);
            this.pointB.set(this.inputPointC);
            this.pointC.set(this.inputPointA);
        }
        else {
            // CA is the longest edge
            this.pointA.set(this.inputPointC);
            this.pointB.set(this.inputPointA);
            this.pointC.set(this.inputPointB);
        }
        // Triangle must be clockwise.
        if (!Triangle_1.Triangle.utils.isClockwise(this.pointA, this.pointB, this.pointC)) {
            // Swap A and B
            var tmp = this.pointA.clone();
            this.pointA.set(this.pointB);
            this.pointB.set(tmp);
        }
    };
    // +---------------------------------------------------------------------------------
    // | Calculate the next iteration step.
    // +-------------------------------
    EllipseFromThreePoints.prototype.calculateNextStep = function (focalControlAngleDeg) {
        // Create ellipse
        var localFocalControlPoint = this.circle.vertAt(this.circleSector.startAngle + Math.PI / 2.0 - focalControlAngleDeg * DEG_TO_RAD);
        var axis1 = new Line_1.Line(this.pointA, localFocalControlPoint);
        var axis2 = new Line_1.Line(this.pointB, localFocalControlPoint);
        var axisControlPoint = localFocalControlPoint.clone().scale(-1.0, this.circle.center);
        var ellipse = new VEllipse_1.VEllipse(localFocalControlPoint, axisControlPoint, axis1.angle());
        return ellipse;
    };
    return EllipseFromThreePoints;
}());
exports.EllipseFromThreePoints = EllipseFromThreePoints;
//# sourceMappingURL=EllipseFromThreePoints.js.map