"use strict";
/**
 * @date 2026-11-25
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EllipseFromThreePointsApproximation = void 0;
var Circle_1 = require("../../Circle");
var CircleSector_1 = require("../../CircleSector");
var Line_1 = require("../../Line");
var Triangle_1 = require("../../Triangle");
var VEllipse_1 = require("../../VEllipse");
var Vertex_1 = require("../../Vertex");
var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180.0 / Math.PI;
var EllipseFromThreePointsApproximation = /** @class */ (function () {
    function EllipseFromThreePointsApproximation(inputPointA, inputPointB, inputPointC) {
        this.inputPointA = inputPointA;
        this.inputPointB = inputPointB;
        this.inputPointC = inputPointC;
        this.pointA = this.inputPointA.clone();
        this.pointB = this.inputPointB.clone();
        this.pointC = this.inputPointC.clone();
        this.lineAB = new Line_1.Line(this.pointA, this.pointB);
        // Init helper circle and circleSector with random start values.
        this.circle = new Circle_1.Circle(new Vertex_1.Vertex(0.0), 100.0);
        this.circleSector = new CircleSector_1.CircleSector(this.circle, -Math.PI / 2.0, Math.PI / 2.0);
        this.focalControlPoint = new Vertex_1.Vertex(0.0);
    }
    EllipseFromThreePointsApproximation.prototype.arrangeInputPoints = function () {
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
    EllipseFromThreePointsApproximation.prototype.updateFocalControlPoint = function (focalControlAngleRad) {
        this.focalControlPoint.set(this.circle.vertAt(this.circleSector.startAngle + Math.PI / 2.0 - focalControlAngleRad //  appContext.config.focalControlAngleDeg * DEG_TO_RAD
        ));
    };
    EllipseFromThreePointsApproximation.prototype.updateHelperCircle = function () {
        this.circle.center.set(this.lineAB.vertAt(0.5));
        this.circle.radius = this.lineAB.length() / 2.0;
        // cirleSector = new CircleSector(circle, lineAB.angle(), lineAB.angle() + Math.PI);
        this.circleSector.startAngle = this.lineAB.angle();
        this.circleSector.endAngle = this.lineAB.angle() + Math.PI;
    };
    // +---------------------------------------------------------------------------------
    // | Find angle recursively.
    // +-------------------------------
    EllipseFromThreePointsApproximation.prototype.findCorrectAngleRecursive = function (beginAngleRad, endAngleRad, iterCount, cachedEllipses) {
        // var newFocalControlAngleDeg = Math.PI / 4.0;
        // Bisect the begin- and end-angle
        var newFocalControlAngleRad = beginAngleRad + (endAngleRad - beginAngleRad) / 2.0;
        if (iterCount <= 0) {
            return newFocalControlAngleRad;
        }
        var nextEllipse = this.calculateNextStep(newFocalControlAngleRad); // TODO TEST * RAD_TO_DEG);
        var focalAngleDeg = newFocalControlAngleRad * RAD_TO_DEG;
        if (cachedEllipses) {
            cachedEllipses.push({ ellipse: nextEllipse, focalAngle: focalAngleDeg });
        }
        // Why is this not working
        if (nextEllipse.containsPoint(this.pointC)) {
            // ...
            return this.findCorrectAngleRecursive(newFocalControlAngleRad, endAngleRad, iterCount - 1, cachedEllipses);
        }
        else {
            return this.findCorrectAngleRecursive(beginAngleRad, newFocalControlAngleRad, iterCount - 1, cachedEllipses);
        }
    };
    // +---------------------------------------------------------------------------------
    // | Calculate the next iteration step.
    // +-------------------------------
    EllipseFromThreePointsApproximation.prototype.calculateNextStep = function (focalControlAngleRad) {
        // Create ellipse
        var localFocalControlPoint = this.circle.vertAt(this.circleSector.startAngle + Math.PI / 2.0 - focalControlAngleRad //  focalControlAngleDeg * DEG_TO_RAD
        );
        var axis1 = new Line_1.Line(this.pointA, localFocalControlPoint);
        var axis2 = new Line_1.Line(this.pointB, localFocalControlPoint);
        var axisControlPoint = localFocalControlPoint.clone().scale(-1.0, this.circle.center);
        var ellipse = new VEllipse_1.VEllipse(localFocalControlPoint, axisControlPoint, axis1.angle());
        return ellipse;
    };
    return EllipseFromThreePointsApproximation;
}());
exports.EllipseFromThreePointsApproximation = EllipseFromThreePointsApproximation;
//# sourceMappingURL=EllipseFromThreePointsApproximation.js.map