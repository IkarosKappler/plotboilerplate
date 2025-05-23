/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author   Ikaros Kappler
 * @date     2021-02-26
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-11-01 Tweaked the `endpointToCenterParameters` function to handle negative values, too, without errors.
 * @modified 2025-04-01 Adapting a the `toCubicBezier` calculation to match an underlying change in the vertAt and tangentAt calculation of ellipses (was required to hamonize both methods with circles).
 * @modified 2025-04-02 Adding `VEllipseSector.containsAngle` method.
 * @modified 2025-04-02 Adding `VEllipseSector.lineIntersections` and `VEllipseSector.lineIntersectionTangents` and implementing `Intersectable`.
 * @modified 2025-04-07 Adding value wrapping (0 to TWO_PI) to the `VEllipseSector.containsAngle` method.
 * @modified 2025-04-09 Adding the `VEllipseSector.move` method.
 * @modified 2025-04-19 Added the `VEllipseSector.getStartPoint` and `getEndPoint` methods.
 * @modified 2025-04-23 Added the `VEllipseSector.getBounds` method.
 * @version  1.2.0
 */
import { Bounds } from "./Bounds";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { geomutils } from "./geomutils";
import { Line } from "./Line";
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
     * Note that the direction from start to end goes clockwise, and that start and end angle
     * will be wrapped to [0,PI*2).
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
        this.startAngle = geomutils.wrapMinMax(startAngle, 0, Math.PI * 2);
        this.endAngle = geomutils.wrapMinMax(endAngle, 0, Math.PI * 2);
    }
    /**
     * Move the ellipse sector by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof VEllipseSector
     * @return {VEllipseSector} this for chaining
     **/
    move(amount) {
        this.ellipse.move(amount);
        return this;
    }
    /**
     * Checks wether the given angle (must be inside 0 and PI*2) is contained inside this sector.
     *
     * @param {number} angle - The numeric angle to check.
     * @method containsAngle
     * @instance
     * @memberof VEllipseSectpr
     * @return {boolean} True if (and only if) this sector contains the given angle.
     */
    containsAngle(angle) {
        angle = geomutils.mapAngleTo2PI(angle); // wrapMinMax(angle, 0, Math.PI * 2);
        const sAngle = geomutils.mapAngleTo2PI(this.startAngle);
        const eAngle = geomutils.mapAngleTo2PI(this.endAngle);
        // TODO: cleanup
        // if (this.startAngle <= this.endAngle) {
        //   return angle >= this.startAngle && angle < this.endAngle;
        // } else {
        //   // startAngle > endAngle
        //   return angle >= this.startAngle || angle < this.endAngle;
        // }
        if (sAngle <= eAngle) {
            return angle >= sAngle && angle < eAngle;
        }
        else {
            // startAngle > endAngle
            return angle >= sAngle || angle < eAngle;
        }
    }
    /**
     * Get the sectors starting point (on the underlying ellipse, located at the start angle).
     *
     * @method getStartPoint
     * @instance
     * @memberof VEllipseSector
     * @return {Vertex} The sector's stating point.
     */
    getStartPoint() {
        return this.ellipse.vertAt(this.startAngle);
    }
    /**
     * Get the sectors ending point (on the underlying ellipse, located at the end angle).
     *
     * @method getEndPoint
     * @instance
     * @memberof VEllipseSector
     * @return {Vertex} The sector's ending point.
     */
    getEndPoint() {
        return this.ellipse.vertAt(this.endAngle);
    }
    //--- BEGIN --- Implement interface `IBounded`
    /**
     * Get the bounds of this elliptic sector.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @method getBounds
     * @instance
     * @memberof VEllipse
     * @return {Bounds} The bounds of this elliptic sector.
     **/
    getBounds() {
        // Calculage angles from east, west, north and south box points and check if they are inside
        const extremes = this.ellipse.getExtremePoints();
        const candidates = extremes.filter(point => {
            const angle = new Line(this.ellipse.center, point).angle() - this.ellipse.rotation;
            return this.containsAngle(angle);
        });
        return Bounds.computeFromVertices([this.getStartPoint(), this.getEndPoint()].concat(candidates));
    }
    //--- BEGIN --- Implement interface `Intersectable`
    /**
     * Get the line intersections as vectors with this ellipse.
     *
     * @method lineIntersections
     * @instance
     * @memberof VEllipseSectpr
     * @param {VertTuple<Vector>} ray - The line/ray to intersect this ellipse with.
     * @param {boolean} inVectorBoundsOnly - (default=false) Set to true if only intersections within the vector bounds are of interest.
     * @returns
     */
    lineIntersections(ray, inVectorBoundsOnly = false) {
        // First get all line intersections from underlying ellipse.
        const ellipseIntersections = this.ellipse.lineIntersections(ray, inVectorBoundsOnly);
        // Drop all intersection points that are not contained in the circle sectors bounds.
        const tmpLine = new Line(this.ellipse.center, new Vertex());
        return ellipseIntersections.filter((intersectionPoint) => {
            tmpLine.b.set(intersectionPoint);
            const lineAngle = tmpLine.angle();
            return this.containsAngle(lineAngle - this.ellipse.rotation);
        });
    }
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @method lineIntersections
     * @memberof VEllipseSectpr
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    lineIntersectionTangents(line, inVectorBoundsOnly = false) {
        // Find the intersections of all lines plus their tangents inside the circle bounds
        const interSectionPoints = this.lineIntersections(line, inVectorBoundsOnly);
        return interSectionPoints.map((vert) => {
            // Calculate angle
            const lineFromCenter = new Line(this.ellipse.center, vert);
            const angle = lineFromCenter.angle();
            // console.log("angle", (angle / Math.PI) * 180.0);
            // const angle = Math.random() * Math.PI * 2; // TODO
            // Calculate tangent at angle
            return this.ellipse.tangentAt(angle);
        });
    }
    //--- END --- Implement interface `Intersectable`
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
            let startTangent = this.ellipse.tangentAt(curAngle + this.ellipse.rotation);
            let endTangent = this.ellipse.tangentAt(nextAngle + this.ellipse.rotation);
            // Distorted ellipses can only be approximated by linear Bézier segments
            if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
                let diff = startPoint.difference(endPoint);
                let curve = new CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333), endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333));
                curves.push(curve);
            }
            else {
                // Find intersection
                let intersection = startTangent.intersection(endTangent);
                // What if intersection is undefined?
                // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
                if (intersection) {
                    // It's VERY LIKELY hat this ALWAYS happens; it's just a typesave variant.
                    // Intersection cannot be null.
                    let startDiff = startPoint.difference(intersection);
                    let endDiff = endPoint.difference(intersection);
                    let curve = new CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
                    curves.push(curve);
                }
            }
            startPoint = endPoint;
            curAngle = nextAngle;
        }
        return curves;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.ellipse.destroy();
        this.isDestroyed = true;
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
    }, // END function describeSVGArc
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
        const angleIsInRange = (angle) => {
            if (startAngle < endAngle)
                return angle >= startAngle && angle <= endAngle;
            else
                return angle >= startAngle || (angle <= endAngle && angle >= 0);
        };
        // Drop all angles outside the sector
        ellipseAngles = ellipseAngles.filter(angleIsInRange);
        // Now we need to sort the angles to the first one in the array is the closest to startAngle.
        // --> find the angle that is closest to the start angle
        const startIndex = VEllipseSector.ellipseSectorUtils.findClosestToStartAngle(startAngle, endAngle, ellipseAngles);
        // Bring all angles into the correct order
        //    Idea: use splice or slice here?
        const angles = [];
        for (var i = 0; i < ellipseAngles.length; i++) {
            angles.push(ellipseAngles[(startIndex + i) % ellipseAngles.length]);
        }
        return angles;
    },
    findClosestToStartAngle: (startAngle, endAngle, ellipseAngles) => {
        // Note: endAngle > 0 && startAngle > 0
        if (startAngle > endAngle) {
            const n = ellipseAngles.length;
            for (var i = 0; i < n; i++) {
                const ea = geomutils.wrapMinMax(ellipseAngles[i], 0, Math.PI * 2);
                if (ea >= startAngle && ea >= endAngle) {
                    return i;
                }
            }
        }
        return 0;
    },
    normalizeAngle: (angle) => (angle < 0 ? Math.PI * 2 + angle : angle),
    /**
     * Convert the elliptic arc from endpoint parameters to center parameters as described
     * in the w3c svg arc implementation note.
     *
     * https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
     *
     * @param {number} x1 - The x component of the start point (end of last SVG command).
     * @param {number} y1 - The y component of the start point (end of last SVG command).
     * @param {number} rx - The first (horizontal) radius of the ellipse.
     * @param {number} ry - The second (vertical) radius of the ellipse.
     * @param {number} phi - The ellipse's rotational angle (angle of axis rotation) in radians (not in degrees as the SVG command uses!)
     * @param {boolean} fa - The large-arc-flag (boolean, not 0 or 1).
     * @param {boolean} fs - The sweep-flag (boolean, not 0 or 1).
     * @param {number} x2 - The x component of the end point (end of last SVG command).
     * @param {number} y2 - The y component of the end point (end of last SVG command).
     * @returns
     */
    endpointToCenterParameters(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
        // console.log("endpointToCenterParameters", x1, y1, phi, rx, ry, fa, fs, x2, y2);
        // Thanks to
        //    https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
        const abs = Math.abs;
        const sin = Math.sin;
        const cos = Math.cos;
        const sqrt = Math.sqrt;
        const pow = (n) => {
            return n * n;
        };
        const sinphi = sin(phi);
        const cosphi = cos(phi);
        // Step 1: simplify through translation/rotation
        const x = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2;
        const y = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;
        const px = pow(x), py = pow(y), prx = pow(rx), pry = pow(ry);
        // correct of out-of-range radii
        const L = px / prx + py / pry;
        if (L > 1) {
            rx = sqrt(L) * abs(rx);
            ry = sqrt(L) * abs(ry);
        }
        else {
            rx = abs(rx);
            ry = abs(ry);
        }
        // Step 2 + 3: compute center
        const sign = fa === fs ? -1 : 1;
        // const M: number = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;
        const M = sqrt(Math.abs((prx * pry - prx * py - pry * px) / (prx * py + pry * px))) * sign;
        const _cx = (M * (rx * y)) / ry;
        const _cy = (M * (-ry * x)) / rx;
        const cx = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2;
        const cy = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;
        // Step 4: Compute start and end angle
        const center = new Vertex(cx, cy);
        const axis = center.clone().addXY(rx, ry);
        const ellipse = new VEllipse(center, axis, 0);
        // console.log("VELLIPSE::::::", ellipse);
        ellipse.rotate(phi);
        const startAngle = new Line(ellipse.center, new Vertex(x1, y1)).angle();
        const endAngle = new Line(ellipse.center, new Vertex(x2, y2)).angle();
        return new VEllipseSector(ellipse, startAngle - phi, endAngle - phi);
    }
}; // END ellipseSectorUtils
//# sourceMappingURL=VEllipseSector.js.map