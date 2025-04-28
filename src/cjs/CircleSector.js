"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-26 Fixed an error in the svg-arc-calculation (case angle<90deg and anti-clockwise).
 * @modified 2024-01-30 Added a missing type in the `describeSVGArc` function.
 * @modified 2024-03-01 Added the `getStartPoint` and `getEndPoint` methods.
 * @modified 2024-03-08 Added the `containsAngle` method.
 * @modified 2024-03-09 Added the `circleSectorIntersection` method to find coherent sector intersections..
 * @modified 2024-03-09 Added the `angleAt` method to determine any angle at some ratio.
 * @modified 2025-04-02 Adding the `CircleSector.lineIntersections` and `CircleSector.lineIntersectionTangents` and implementing `Intersectable`.
 * @modified 2025-04-09 Adding the `CircleSector.move()` method.
 * @modified 2025-04-19 Tweaking the `CircleSector.containsAngle` method: all values (input angle, start- and end- angle) are wrapped into [0,2*PI) now.
 * @modified 2025-04-19 Class `CircleSector` implements interface `Bounded` now (method `getBounds` added).
 * @version  1.2.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleSector = void 0;
var Bounds_1 = require("./Bounds");
var Circle_1 = require("./Circle");
var Line_1 = require("./Line");
var UIDGenerator_1 = require("./UIDGenerator");
var Vertex_1 = require("./Vertex");
var geomutils_1 = require("./geomutils");
/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
var CircleSector = /** @class */ (function () {
    /**
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    function CircleSector(circle, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "CircleSector";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.circle = circle;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    //--- BEGIN --- Implement interface `IBounded`
    /**
     * Get the bounds of this ellipse.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @method getBounds
     * @instance
     * @memberof VEllipse
     * @return {Bounds} The bounds of this curve.
     **/
    CircleSector.prototype.getBounds = function () {
        var _self = this;
        var circleBounds = this.circle.getBounds();
        // Calculage angles from east, west, north and south box points and check if they are inside
        var candidates = [
            circleBounds.getNorthPoint(),
            circleBounds.getSouthPoint(),
            circleBounds.getWestPoint(),
            circleBounds.getEastPoint()
        ].filter(function (point) {
            // Check for each candidate points if they are contained in this sector. Drop if not.
            var angle = new Line_1.Line(_self.circle.center, point).angle();
            return _self.containsAngle(angle);
        });
        // Compute bounds and inlcude start end end point (they are definitely part of the bounds)
        return Bounds_1.Bounds.computeFromVertices(candidates.concat([this.getStartPoint(), this.getEndPoint()]));
    };
    //--- BEGIN --- Implement interface `IBounded`
    /**
     * Move the circle sector by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof CircleSector
     * @return {CircleSector} this for chaining
     **/
    CircleSector.prototype.move = function (amount) {
        this.circle.move(amount);
        return this;
    };
    /**
     * Checks wether the given angle (must be inside 0 and PI*2) is contained inside this sector.
     *
     * @param {number} angle - The numeric angle to check.
     * @method containsAngle
     * @instance
     * @memberof CircleSector
     * @return {boolean} True if (and only if) this sector contains the given angle.
     */
    CircleSector.prototype.containsAngle = function (angle) {
        var wrappedAngle = geomutils_1.geomutils.mapAngleTo2PI(angle);
        var wrappedStart = geomutils_1.geomutils.mapAngleTo2PI(this.startAngle);
        var wrappedEnd = geomutils_1.geomutils.mapAngleTo2PI(this.endAngle);
        // TODO: cleanup
        // if (this.startAngle <= this.endAngle) {
        //   return angle >= this.startAngle && angle < this.endAngle;
        // } else {
        //   // startAngle > endAngle
        //   return angle >= this.startAngle || angle < this.endAngle;
        // }
        if (wrappedStart <= wrappedEnd) {
            return wrappedAngle >= wrappedStart && wrappedAngle < wrappedEnd;
        }
        else {
            // startAngle > endAngle
            return wrappedAngle >= wrappedStart || wrappedAngle < wrappedEnd;
        }
    };
    /**
     * Get the angle inside this sector for a given ratio. 0.0 means startAngle, and 1.0 means endAngle.
     *
     * @param {number} t - The ratio inside [0..1].
     * @method angleAt
     * @instance
     * @memberof CircleSector
     * @return {number} The angle inside this sector at a given ratio.
     */
    CircleSector.prototype.angleAt = function (t) {
        if (this.startAngle <= this.endAngle) {
            var angleAtRatio = this.startAngle + (this.endAngle - this.startAngle) * t;
            return angleAtRatio % (Math.PI * 2.0);
        }
        else {
            // startAngle > endAngle
            var angleAtRatio = this.startAngle + (Math.PI * 2 - this.startAngle + this.endAngle) * t;
            return angleAtRatio % (Math.PI * 2.0);
        }
    };
    /**
     * Get the sectors starting point (on the underlying circle, located at the start angle).
     *
     * @method getStartPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's stating point.
     */
    CircleSector.prototype.getStartPoint = function () {
        return this.circle.vertAt(this.startAngle);
    };
    /**
     * Get the sectors ending point (on the underlying circle, located at the end angle).
     *
     * @method getEndPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's ending point.
     */
    CircleSector.prototype.getEndPoint = function () {
        return this.circle.vertAt(this.endAngle);
    };
    /**
     * Calculate the intersection of this circle sector and some other sector.
     *
     * If the two sectors do not corerently intersect (when not both points of the
     * radical line are containted in both source sectors) then null is returned.
     *
     * See demo/53-circle-sector-intersections for a geometric visualisation.
     *
     * @method circleSectorIntersection
     * @instance
     * @memberof CircleSector
     * @return {CircleSector | null} The intersecion of both sectors or null if they don't intersect.
     */
    CircleSector.prototype.circleSectorIntersection = function (sector) {
        var radicalLine = this.circle.circleIntersection(sector.circle);
        if (!radicalLine) {
            // The circles to not intersect at all.
            return null;
        }
        // Circles intersect. Check if this sector interval intersects, too.
        var thisIntersectionAngleA = this.circle.center.angle(radicalLine.a);
        var thisIntersectionAngleB = this.circle.center.angle(radicalLine.b);
        // Is intersection inside this sector?
        if (!this.containsAngle(thisIntersectionAngleA) || !this.containsAngle(thisIntersectionAngleB)) {
            // At least one circle intersection point is not located in this sector.
            //  -> no valid intersection at all
            return null;
        }
        // Circles intersect. Check if the passed sector interval intersects, too.
        var thatIntersectionAngleA = sector.circle.center.angle(radicalLine.a);
        var thatIntersectionAngleB = sector.circle.center.angle(radicalLine.b);
        // Is intersection inside this sector?
        if (!sector.containsAngle(thatIntersectionAngleA) || !sector.containsAngle(thatIntersectionAngleB)) {
            // At least one circle intersection point is not located in this sector.
            //  -> no valid intersection at all
            return null;
        }
        // The radical line has no direction. Thus the resulting sector _might_ be in reverse order.
        // Make a quick logical check: the center of the gap must still be located inside the result sector.
        // If not: reverse result.
        var gapSector = new CircleSector(this.circle, this.endAngle, this.startAngle);
        var centerOfOriginalGap = gapSector.angleAt(0.5);
        var resultSector = new CircleSector(new Circle_1.Circle(this.circle.center.clone(), this.circle.radius), thisIntersectionAngleA, thisIntersectionAngleB);
        if (resultSector.containsAngle(centerOfOriginalGap)) {
            resultSector.startAngle = thisIntersectionAngleB;
            resultSector.endAngle = thisIntersectionAngleA;
        }
        return resultSector;
    };
    //--- BEGIN --- Implement interface `Intersectable`
    /**
     * Get the line intersections as vectors with this ellipse.
     *
     * @method lineIntersections
     * @instance
     * @param {VertTuple<Vector> ray - The line/ray to intersect this ellipse with.
     * @param {boolean} inVectorBoundsOnly - (default=false) Set to true if only intersections within the vector bounds are of interest.
     * @returns
     */
    CircleSector.prototype.lineIntersections = function (ray, inVectorBoundsOnly) {
        var _this = this;
        if (inVectorBoundsOnly === void 0) { inVectorBoundsOnly = false; }
        // First get all line intersections from underlying ellipse.
        var ellipseIntersections = this.circle.lineIntersections(ray, inVectorBoundsOnly);
        // Drop all intersection points that are not contained in the circle sectors bounds.
        var tmpLine = new Line_1.Line(this.circle.center, new Vertex_1.Vertex());
        return ellipseIntersections.filter(function (intersectionPoint) {
            tmpLine.b.set(intersectionPoint);
            var lineAngle = tmpLine.angle();
            return _this.containsAngle(geomutils_1.geomutils.wrapMinMax(lineAngle, 0, Math.PI * 2));
        });
    };
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    CircleSector.prototype.lineIntersectionTangents = function (line, inVectorBoundsOnly) {
        var _this = this;
        if (inVectorBoundsOnly === void 0) { inVectorBoundsOnly = false; }
        // Find the intersections of all lines plus their tangents inside the circle bounds
        var interSectionPoints = this.lineIntersections(line, inVectorBoundsOnly);
        return interSectionPoints.map(function (vert) {
            // Calculate angle
            var lineFromCenter = new Line_1.Line(_this.circle.center, vert);
            var angle = lineFromCenter.angle();
            // console.log("angle", (angle / Math.PI) * 180.0);
            // const angle = Math.random() * Math.PI * 2; // TODO
            // Calculate tangent at angle
            return _this.circle.tangentAt(angle);
        });
    };
    //--- END --- Implement interface `Intersectable`
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     *
     * @method destroy
     * @instance
     * @memberof CircleSector
     * @return {void}
     */
    CircleSector.prototype.destroy = function () {
        this.circle.destroy();
        this.isDestroyed = true;
    };
    CircleSector.circleSectorUtils = {
        /**
         * Helper function to convert polar circle coordinates to cartesian coordinates.
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {number} angle - The angle in radians.
         */
        polarToCartesian: function (centerX, centerY, radius, angle) {
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        },
        /**
         * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
         * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
         * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
         */
        describeSVGArc: function (x, y, radius, startAngle, endAngle, options) {
            if (typeof options === "undefined")
                options = { moveToStart: true };
            var end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
            var start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
            // Split full circles into two halves.
            // Some browsers have problems to render full circles (described by start==end).
            if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
                var firstHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / 2, options);
                var secondHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle + (endAngle - startAngle) / 2, endAngle, options);
                return firstHalf.concat(secondHalf);
            }
            // Boolean stored as integers (0|1).
            var diff = endAngle - startAngle;
            var largeArcFlag;
            var sweepFlag;
            if (diff < 0) {
                largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
                sweepFlag = 1;
            }
            else {
                largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
                sweepFlag = 1;
            }
            var pathData = [];
            if (options.moveToStart) {
                pathData.push("M", start.x, start.y);
            }
            pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
            return pathData;
        }
    };
    return CircleSector;
}()); // END class
exports.CircleSector = CircleSector;
//# sourceMappingURL=CircleSector.js.map