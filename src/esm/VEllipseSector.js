/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author  Ikaros Kappler
 * @date    2021-02-26
 * @version 1.0.0
 */
// TODO: add class to all demos
// TODO: add to PlotBoilerplate.add(...)
import { CubicBezierCurve } from "./CubicBezierCurve";
import { geomutils } from "./geomutils";
import { UIDGenerator } from "./UIDGenerator";
import { VEllipse } from "./VEllipse";
import { Vertex } from "./Vertex";
/**
 * @classdesc A class for elliptic sectors.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export class VEllipseSector {
    /**
     * Create a new elliptic sector from the given ellipse and two angles.
     *
     * Note that the direction from start to end goes clockwise.
     *
     * @constructor
     * @name VEllipseSector
     * @param {VEllipse} - The underlying ellipse to use.
     * @param {number} startAngle - The start angle of the sector.
     * @param {numner} endAngle - The end angle of the sector.
     */
    constructor(ellipse, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipseSector";
        this.uid = UIDGenerator.next();
        this.ellipse = ellipse;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    /**
     * Convert this elliptic sector into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing the elliptic sector.
     */
    toCubicBezier(quarterSegmentCount, threshold) {
        // There are at least 4 segments required (dour quarters) to approximate a whole
        // ellipse with Bézier curves.
        // A visually 'good' approximation should have 12; this seems to be a good value (anything multiple of 4).
        const segmentCount = Math.max(1, quarterSegmentCount || 3) * 4;
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        const radiusH = this.ellipse.radiusH();
        const radiusV = this.ellipse.radiusV();
        // // Note that ellipses with radiusH=0 or radiusV=0 cannot be represented as Bézier curves.
        // // Return a single line here (as a Bézier curve)
        // if (Math.abs(radiusV) < 0.00001) {
        //   return [
        //     // TODO: construct linear approximations for both cases
        //     // new CubicBezierCurve(
        //     //   this.center.clone().addX(radiusH),
        //     //   this.center.clone().addX(-radiusH),
        //     //   this.center.clone(),
        //     //   this.center.clone()
        //     // )
        //   ]; // TODO: test horizontal line ellipse
        // }
        // if (Math.abs(radiusH) < 0.00001) {
        //   return [
        //     // new CubicBezierCurve(
        //     //   this.center.clone().addY(radiusV),
        //     //   this.center.clone().addY(-radiusV),
        //     //   this.center.clone(),
        //     //   this.center.clone()
        //     // )
        //   ]; // TODO: test vertical line ellipse
        // }
        var startAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.startAngle);
        var endAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.endAngle);
        // Find all angles inside start and end
        var angles = VEllipseSector.ellipseSectorUtils.equidistantVertAngles(radiusH, radiusV, startAngle, endAngle, segmentCount);
        angles = [startAngle].concat(angles).concat([endAngle]);
        const curves = [];
        let curAngle = angles[0];
        let startPoint = this.ellipse.vertAt(curAngle);
        for (var i = 0; i + 1 < angles.length; i++) {
            let nextAngle = angles[(i + 1) % angles.length];
            let endPoint = this.ellipse.vertAt(nextAngle);
            let startTangent = this.ellipse.tangentAt(curAngle);
            let endTangent = this.ellipse.tangentAt(nextAngle);
            if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
                // Distorted ellipses can only be approximated by linear Bézier segments
                let diff = startPoint.difference(endPoint);
                let curve = new CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333), endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333));
                curves.push(curve);
            }
            else {
                // Find intersection
                let intersection = startTangent.intersection(endTangent);
                // What if intersection is undefined?
                // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
                let startDiff = startPoint.difference(intersection);
                let endDiff = endPoint.difference(intersection);
                let curve = new CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
                curves.push(curve);
            }
            startPoint = endPoint;
            curAngle = nextAngle;
        }
        return curves;
    }
}
VEllipseSector.ellipseSectorUtils = {
    /**
     * Helper function to convert an elliptic section to SVG arc params (for the `d` attribute).
     * Inspiration found at:
     *    https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
     *
     * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
     * @return [ 'A', radiusH, radiusV, rotation, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
     */
    describeSVGArc: (x, y, radiusH, radiusV, startAngle, endAngle, rotation, options) => {
        if (typeof options === "undefined")
            options = { moveToStart: true };
        if (typeof rotation === "undefined")
            rotation = 0.0;
        // Important note: this function only works if start- and end-angle are within
        // one whole circle [x,x+2*PI].
        // Revelations of more than 2*PI might result in unexpected arcs.
        // -> Use the geomutils.wrapMax( angle, 2*PI )
        startAngle = geomutils.wrapMax(startAngle, Math.PI * 2);
        endAngle = geomutils.wrapMax(endAngle, Math.PI * 2);
        // Find the start- and end-point on the rotated ellipse
        // XYCoords to Vertex (for rotation)
        var end = new Vertex(VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, endAngle));
        var start = new Vertex(VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, startAngle));
        end.rotate(rotation, { x: x, y: y });
        start.rotate(rotation, { x: x, y: y });
        // Boolean stored as integers (0|1).
        var diff = endAngle - startAngle;
        var largeArcFlag;
        if (diff < 0) {
            largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
        }
        else {
            largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
        }
        const sweepFlag = 1;
        const pathData = [];
        if (options.moveToStart) {
            pathData.push("M", start.x, start.y);
        }
        // Arc rotation in degrees, not radians.
        const r2d = 180 / Math.PI;
        pathData.push("A", radiusH, radiusV, rotation * r2d, largeArcFlag, sweepFlag, end.x, end.y);
        return pathData;
    },
    /**
     * Helper function to find second-kind elliptic angles, so that the euclidean distance along the the
     * elliptic sector is the same for all.
     *
     * Note that this is based on the full ellipse calculuation and start and end will be cropped; so the
     * distance from the start angle to the first angle and/or the distance from the last angle to
     * the end angle may be different to the others.
     *
     * Furthermore the computation is only possible on un-rotated ellipses; if your source ellipse has
     * a rotation on the plane please 'rotate' the result angles afterwards to find matching angles.
     *
     * Returned angles are normalized to the interval `[ 0, PI*2 ]`.
     *
     * @param {number} radiusH - The first (horizonal) radius of the ellipse.
     * @param {number} radiusV - The second (vertical) radius of the ellipse.
     * @param {number} startAngle - The opening angle of your elliptic sector (please use normalized angles).
     * @param {number} endAngle - The closing angle of your elliptic sector (please use normalized angles).
     * @param {number} fullEllipsePointCount - The number of base segments to use from the source ellipse (12 or 16 are good numbers).
     * @return {Array<number>} An array of n angles inside startAngle and endAngle (where n <= fullEllipsePointCount).
     */
    equidistantVertAngles: (radiusH, radiusV, startAngle, endAngle, fullEllipsePointCount) => {
        var ellipseAngles = VEllipse.utils.equidistantVertAngles(radiusH, radiusV, fullEllipsePointCount);
        ellipseAngles = ellipseAngles.map((angle) => VEllipseSector.ellipseSectorUtils.normalizeAngle(angle));
        var angleIsInRange = (angle) => {
            if (startAngle < endAngle)
                return angle >= startAngle && angle <= endAngle;
            // else return (angle >= startAngle && angle <= Math.PI * 2) || (angle <= endAngle && angle >= 0);
            else
                return (angle >= startAngle) || (angle <= endAngle && angle >= 0);
        };
        // Drop all angles outside the sector
        var ellipseAngles = ellipseAngles.filter(angleIsInRange);
        var findClosestToStartAngle = () => {
            // endAngle > 0 && startAngle > 0
            if (startAngle > endAngle) {
                var startIndex = -1; // 0;
                const n = ellipseAngles.length;
                for (var i = 0; i < n; i++) {
                    const ea = geomutils.wrapMinMax(ellipseAngles[i], 0, Math.PI * 2);
                    const en = geomutils.wrapMinMax(ellipseAngles[(i + 1) % n], 0, Math.PI * 2);
                    var diff = ea - startAngle;
                    var curDiff = ellipseAngles[startIndex] - startAngle;
                    // console.log(i, ea, en)
                    //if (startAngle < ellipseAngles[i] && diff < curDiff) {
                    // if ((startAngle < ellipseAngles[i] && Math.abs(diff) < Math.abs(curDiff)) || (startAngle >= ellipseAngles[i] && Math.abs(diff) <= Math.abs(curDiff)) ) {
                    // if ((startAngle < ellipseAngles[i] && Math.abs(diff) < Math.abs(curDiff)) && ellipseAngles[i] > endAngle ) {
                    //if (ea > endAngle && en > endAngle && startIndex == -1 && ea < startAngle && en >= startAngle ) {
                    if (ea >= startAngle && ea >= endAngle) {
                        // startIndex = i+1;
                        return i; //+1;
                    }
                }
                // console.log('startIndex',startIndex);
                if (startIndex == -1)
                    startIndex = 0; // ellipseAngles.length - 1;
                return startIndex;
            }
            else {
                return 0;
            }
        };
        // Now we need to sort the angles to the first one in the array is the closest to startAngle.
        // --> find the angle that is closest to the start angle
        var startIndex = findClosestToStartAngle();
        console.log("startIndex", startIndex, "startAngle", startAngle, "endAngle", endAngle, 'ellipseAngles', ellipseAngles);
        // Bring all angles into the correct order
        //    Idea: use splice or slice here?
        var angles = [];
        for (var i = 0; i < ellipseAngles.length; i++) {
            angles.push(ellipseAngles[(startIndex + i) % ellipseAngles.length]);
        }
        return angles;
    },
    normalizeAngle: (angle) => (angle < 0 ? Math.PI * 2 + angle : angle)
}; // END ellipseSectorUtils
//# sourceMappingURL=VEllipseSector.js.map