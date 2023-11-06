"use strict";
/**
 * A function to detect contour lines from 3D terrain data.
 *
 * @author  Ikaros Kappler
 * @date    2023-11-04
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContourLineDetection = void 0;
var Line_1 = require("../../Line");
var Vertex_1 = require("../../Vertex");
var detectPaths_1 = require("./detectPaths");
var clearDuplicateVertices_1 = require("./clearDuplicateVertices");
var ContourLineDetection = /** @class */ (function () {
    function ContourLineDetection(dataGrid) {
        this.rawLinearPathSegments = [];
        this.dataGrid = dataGrid;
    }
    /**
     * Detect contour paths from the underlying data source.
     *
     * @param {number} criticalHeightValue - The height value. If above data's maximum or below data's minimum then the result will be empty (no intersections).
     * @param {number} options.closeGapType - `CLOSE_GAP_TYPE_NONE` or `CLOSE_GAP_TYPE_ABOVE` or `CLOSE_GAP_TYPE_BELOW`.
     * @param {function?} onRawSegmentsDetected - (optional) Get the interim result of all detected single lines before path detection starts; DO NOT MODIFY the array.
     * @returns {Array<GenericPath>} - A list of connected paths that resemble the contour lines of the data/terrain at the given height value.
     */
    ContourLineDetection.prototype.detectContourPaths = function (criticalHeightValue, options) {
        // First: clear the buffer
        this.rawLinearPathSegments = [];
        // Imagine a face4 element like this
        //    (x,y)       (x+1,y)
        //         A-----B
        //         |     |
        //         |     |
        //         D-----C
        //  (x,y+1)        (x+1,y+1)
        //	   then result in the buffer will be
        //   [ [A,B],
        //     [D,C] ]
        var heightFace = [
            [0, 0],
            [0, 0]
        ];
        for (var y = 0; y + 1 < this.dataGrid.ySegmentCount; y++) {
            for (var x = 0; x + 1 < this.dataGrid.xSegmentCount; x++) {
                this.dataGrid.getDataFace4At(x, y, heightFace);
                var line = this.findHeightFaceIntersectionLine(x, y, heightFace, criticalHeightValue);
                if (line) {
                    // pathSegments.push(new GenericPath(line));
                    this.rawLinearPathSegments.push(line);
                }
            }
        }
        // Collect value above/below on the y axis
        if (options.closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE ||
            options.closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW) {
            var xExtremes = [0, this.dataGrid.xSegmentCount - 1];
            for (var i = 0; i < xExtremes.length; i++) {
                var x_1 = xExtremes[i];
                for (var y = 0; y + 1 < this.dataGrid.ySegmentCount; y++) {
                    var nextX = x_1;
                    var nextY = y + 1;
                    this.detectAboveBelowLerpSegment(x_1, y, nextX, nextY, criticalHeightValue, options.closeGapType);
                }
            }
            var yExtremes = [0, this.dataGrid.ySegmentCount - 1];
            for (var j = 0; j < yExtremes.length; j++) {
                var y = yExtremes[j];
                for (var x = 0; x + 1 < this.dataGrid.xSegmentCount; x++) {
                    var nextX = x + 1;
                    var nextY = y;
                    this.detectAboveBelowLerpSegment(x, y, nextX, nextY, criticalHeightValue, options.closeGapType);
                }
            }
        }
        if (options.onRawSegmentsDetected) {
            options.onRawSegmentsDetected(this.rawLinearPathSegments);
        }
        // Detect connected paths
        var pathSegments = detectPaths_1.detectPaths(this.rawLinearPathSegments, 0.1); // Epsilon?
        // Filter out segments with only a single line of length~=0
        pathSegments = pathSegments.filter(function (pathSegment) {
            return (pathSegment.segments.length != 1 ||
                (pathSegment.segments.length === 1 && pathSegment.segments[0].length() > 0.1));
        });
        //   console.log(pathSegments);
        return pathSegments;
    };
    /**
     * This function will calculate a single intersecion line of the given face4 data
     * segment. If the given face does not intersect with the plane at the given `heightValue`
     * then `null` is returned.
     *
     * @param {number} xIndex - The x position (index) of the data face.
     * @param {number} yIndex - The y position (index) of the data face.
     * @param {[[number,number],[number,number]]} heightFace - The data sample that composes the face4 as a two-dimensional number array.
     * @param {number} heightValue - The height value of the intersection plane to check for.
     * @returns {Line|null}
     */
    ContourLineDetection.prototype.findHeightFaceIntersectionLine = function (xIndex, yIndex, heightFace, heightValue) {
        var heightValueA = heightFace[0][0]; // value at (x,y)
        var heightValueB = heightFace[1][0];
        var heightValueC = heightFace[1][1];
        var heightValueD = heightFace[0][1];
        if (heightValueA === null || heightValueB === null || heightValueC === null || heightValueD === null) {
            throw "[findHeightFaceIntersectionLine] Cannot extract data face at (" + xIndex + "," + yIndex + "). Some values are null.";
        }
        var points = [];
        if (this.isBetween(heightValueA, heightValueB, heightValue)) {
            var lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, heightValue);
            points.push(new Vertex_1.Vertex(this.lerp(xIndex, xIndex + 1, lerpValueByHeight), yIndex));
        }
        if (this.isBetween(heightValueB, heightValueC, heightValue)) {
            var lerpValueByHeight = this.getLerpRatio(heightValueB, heightValueC, heightValue);
            points.push(new Vertex_1.Vertex(xIndex + 1, this.lerp(yIndex, yIndex + 1, lerpValueByHeight)));
        }
        if (this.isBetween(heightValueC, heightValueD, heightValue)) {
            var lerpValueByHeight = this.getLerpRatio(heightValueC, heightValueD, heightValue);
            points.push(new Vertex_1.Vertex(this.lerp(xIndex + 1, xIndex, lerpValueByHeight), yIndex + 1));
        }
        if (this.isBetween(heightValueD, heightValueA, heightValue)) {
            var lerpValueByHeight = this.getLerpRatio(heightValueD, heightValueA, heightValue);
            points.push(new Vertex_1.Vertex(xIndex, this.lerp(yIndex + 1, yIndex, lerpValueByHeight)));
        }
        // Warning: if a plane intersection point is located EXACTLY on the corner
        // edge of a face, then the two adjacent edges will result in 2x the same
        // intersecion point. This must be handled as one, so filter the point list
        // by an epsilon.
        points = clearDuplicateVertices_1.clearDuplicateVertices(points, 0.000001);
        if (points.length >= 2) {
            var startPoint = points[0];
            var endPoint = points[1];
            if (points.length > 2) {
                console.warn("[findHeightFaceIntersectionLine] Detected more than 2 points on one face whre only 0 or 2 should appear. At ", xIndex, yIndex, points);
            }
            return new Line_1.Line(startPoint, endPoint);
        }
        else {
            if (points.length === 1) {
                console.warn("[findHeightFaceIntersectionLine] Point list has only one point (should not happen).");
            }
            return null;
        }
    };
    /**
     * This procedure will look at the face4 at the ((x,y),(nextX,nextY)) position – which are four values –
     * and determines the local contour lines for these cases.
     *
     * This is used to detect and calculate edge cases on the borders of the underliying height data:
     *  * left and right border (x=0, x=data.xSegmentCount)
     *  * top and bottom border (x=y, x=data.ySegmentCount)
     *
     * Resulting path segments will be stored in the global `segments` array.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} nextX
     * @param {number} nextY
     * @param {number} criticalHeightValue
     * @param {number} closeGapType - CLOSE_GAP_TYPE_ABOVE or CLOSE_GAP_TYPE_BELOW.
     * @return {void}
     */
    ContourLineDetection.prototype.detectAboveBelowLerpSegment = function (x, y, nextX, nextY, criticalHeightValue, closeGapType) {
        var heightValueA = this.dataGrid.getDataValueAt(x, y);
        var heightValueB = this.dataGrid.getDataValueAt(nextX, nextY);
        //   if (heightValueA >= criticalHeightValue && heightValueB >= criticalHeightValue) {
        if (this.areBothValuesOnRequiredPlaneSide(heightValueA, heightValueB, criticalHeightValue, closeGapType)) {
            //  Both above
            var line = new Line_1.Line(new Vertex_1.Vertex(x, y), new Vertex_1.Vertex(nextX, nextY));
            this.rawLinearPathSegments.push(line);
        }
        else if ((closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE &&
            heightValueA >= criticalHeightValue &&
            heightValueB <= criticalHeightValue) ||
            (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW &&
                heightValueA <= criticalHeightValue &&
                heightValueB >= criticalHeightValue)) {
            // Only one of both (first) is above -> interpolate to find exact intersection point
            var lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, criticalHeightValue);
            var interpLine = new Line_1.Line(new Vertex_1.Vertex(x, y), new Vertex_1.Vertex(this.lerp(x, nextX, lerpValueByHeight), this.lerp(y, nextY, lerpValueByHeight)));
            this.rawLinearPathSegments.push(interpLine);
        }
        else if ((closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE &&
            heightValueA <= criticalHeightValue &&
            heightValueB >= criticalHeightValue) ||
            (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW &&
                heightValueA >= criticalHeightValue &&
                heightValueB <= criticalHeightValue)) {
            // Only one of both (second) is above -> interpolate to find exact intersection point
            var lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, criticalHeightValue);
            var interpLine = new Line_1.Line(new Vertex_1.Vertex(this.lerp(x, nextX, lerpValueByHeight), this.lerp(y, nextY, lerpValueByHeight)), new Vertex_1.Vertex(nextX, nextY));
            this.rawLinearPathSegments.push(interpLine);
        }
    };
    /**
     * Checks if both value are on the same side of the critical value (above or below). The `closeGapType`
     * indictes if `CLOSE_GAP_TYPE_BELOW` or `CLOSE_GAP_TYPE_ABOVE` should be used as a rule.
     *
     * @param {number} valueA
     * @param {number} valueB
     * @param {number} criticalValue
     * @param {number} closeGapType
     * @returns {boolean}
     */
    ContourLineDetection.prototype.areBothValuesOnRequiredPlaneSide = function (valueA, valueB, criticalValue, closeGapType) {
        return ((closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW && valueA <= criticalValue && valueB <= criticalValue) ||
            (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE && valueA >= criticalValue && valueB >= criticalValue));
    };
    /**
     * Test if a given numeric value (`curValue`) is between the given values `valA` and `valB`.
     * Value A and B don't need to be in ascending order, so `valA <= curValue <= valB` and `valB <= curvalue <= valA`
     * will do the job.
     *
     * @param {number} valA - The first of the two bounds.
     * @param {number} valB - The second of the two bounds.
     * @param {number} curValue - The value to check if it is between (or equal) to the given bounds.
     * @returns {boolean}
     */
    ContourLineDetection.prototype.isBetween = function (valA, valB, curValue) {
        return (valA <= curValue && curValue <= valB) || (valB <= curValue && curValue <= valA);
    };
    /**
     * Get a 'lerp' value - which is some sort of percentage/ratio for the `curValue` inside the
     * range of the given interval `[valA ... valB]`.
     *
     * Examples:
     *  * getLerpRatio(0,100,50) === 0.5
     *  * getLerpRatio(50,100,75) === 0.5
     *  * getLerpRatio(0,100,0) === 0.0
     *  * getLerpRatio(0,100,100) === 1.0
     *  * getLerpRatio(0,100,-50) === -0.5
     *
     * @param {number} valA
     * @param {number} valB
     * @param {number} curValue
     * @returns
     */
    ContourLineDetection.prototype.getLerpRatio = function (valA, valB, curValue) {
        return (curValue - valA) / (valB - valA);
    };
    ContourLineDetection.prototype.lerp = function (min, max, ratio) {
        return min + (max - min) * ratio;
    };
    ContourLineDetection.CLOSE_GAP_TYPE_NONE = 0;
    ContourLineDetection.CLOSE_GAP_TYPE_ABOVE = 1;
    ContourLineDetection.CLOSE_GAP_TYPE_BELOW = 2;
    return ContourLineDetection;
}());
exports.ContourLineDetection = ContourLineDetection;
//# sourceMappingURL=ContourLineDetection.js.map