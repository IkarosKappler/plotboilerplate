/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author  Ikaros Kappler
 * @date    2021-02-26
 * @version 1.0.0
 */

// TODO: add to PlotBoilerplate.add(...)
// Extend drawArc-demo (make arc points movale)
// Make ellipse helper lines hide-able
// Check demo-00 if alloy-finger works

import { CubicBezierCurve } from "./CubicBezierCurve";
import { geomutils } from "./geomutils";
import { SVGPathParams, UID, XYCoords } from "./interfaces";
import { Line } from "./Line";
import { UIDGenerator } from "./UIDGenerator";
import { Vector } from "./Vector";
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
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "VEllipseSector";

  /**
   * The UID of this drawable object.
   *
   * @member {UID}
   * @memberof VEllipseSector
   * @instance
   * @readonly
   */
  readonly uid: UID;

  /**
   * @member {VEllipse}
   * @memberof VEllipseSector
   * @instance
   */
  ellipse: VEllipse;

  /**
   * @member {number}
   * @memberof VEllipseSector
   * @instance
   */
  startAngle: number;

  /**
   * @member {number}
   * @memberof VEllipseSector
   * @instance
   */
  endAngle: number;

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
  constructor(ellipse: VEllipse, startAngle: number, endAngle: number) {
    this.uid = UIDGenerator.next();
    this.ellipse = ellipse;
    this.startAngle = geomutils.wrapMinMax(startAngle, 0, Math.PI * 2);
    this.endAngle = geomutils.wrapMinMax(endAngle, 0, Math.PI * 2);
  }

  /**
   * Convert this elliptic sector into cubic Bézier curves.
   *
   * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
   * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
   * but you might wish to use other values)
   * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing the elliptic sector.
   */
  toCubicBezier(quarterSegmentCount?: number, threshold?: number): Array<CubicBezierCurve> {
    // There are at least 4 segments required (dour quarters) to approximate a whole
    // ellipse with Bézier curves.
    // A visually 'good' approximation should have 12; this seems to be a good value (anything multiple of 4).
    const segmentCount = Math.max(1, quarterSegmentCount || 3) * 4;
    threshold = typeof threshold === "undefined" ? 0.666666 : threshold;

    const radiusH: number = this.ellipse.radiusH();
    const radiusV: number = this.ellipse.radiusV();

    var startAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.startAngle);
    var endAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.endAngle);

    // Find all angles inside start and end
    var angles = VEllipseSector.ellipseSectorUtils.equidistantVertAngles(radiusH, radiusV, startAngle, endAngle, segmentCount);
    angles = [startAngle].concat(angles).concat([endAngle]);

    const curves: Array<CubicBezierCurve> = [];
    let curAngle: number = angles[0];
    let startPoint: Vertex = this.ellipse.vertAt(curAngle);
    for (var i = 0; i + 1 < angles.length; i++) {
      let nextAngle = angles[(i + 1) % angles.length];
      let endPoint: Vertex = this.ellipse.vertAt(nextAngle);

      let startTangent: Vector = this.ellipse.tangentAt(curAngle);
      let endTangent: Vector = this.ellipse.tangentAt(nextAngle);

      // Distorted ellipses can only be approximated by linear Bézier segments
      if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
        let diff = startPoint.difference(endPoint);
        let curve: CubicBezierCurve = new CubicBezierCurve(
          startPoint.clone(),
          endPoint.clone(),
          startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333),
          endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333)
        );
        curves.push(curve);
      } else {
        // Find intersection
        let intersection: Vertex | undefined = startTangent.intersection(endTangent);
        // What if intersection is undefined?
        // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.

        let startDiff: Vertex = startPoint.difference(intersection);
        let endDiff: Vertex = endPoint.difference(intersection);
        let curve: CubicBezierCurve = new CubicBezierCurve(
          startPoint.clone(),
          endPoint.clone(),
          startPoint.clone().add(startDiff.scale(threshold)),
          endPoint.clone().add(endDiff.scale(threshold))
        );
        curves.push(curve);
      }
      startPoint = endPoint;
      curAngle = nextAngle;
    }
    return curves;
  }

  static ellipseSectorUtils = {
    /**
     * Helper function to convert an elliptic section to SVG arc params (for the `d` attribute).
     * Inspiration found at:
     *    https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
     *
     * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
     * @return [ 'A', radiusH, radiusV, rotation, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
     */
    describeSVGArc: (
      x: number,
      y: number,
      radiusH: number,
      radiusV: number,
      startAngle: number,
      endAngle: number,
      rotation?: number,
      options?: { moveToStart: boolean }
    ): SVGPathParams => {
      if (typeof options === "undefined") options = { moveToStart: true };
      if (typeof rotation === "undefined") rotation = 0.0;

      // Important note: this function only works if start- and end-angle are within
      // one whole circle [x,x+2*PI].
      // Revelations of more than 2*PI might result in unexpected arcs.
      // -> Use the geomutils.wrapMax( angle, 2*PI )
      startAngle = geomutils.wrapMax(startAngle, Math.PI * 2);
      endAngle = geomutils.wrapMax(endAngle, Math.PI * 2);

      // Find the start- and end-point on the rotated ellipse
      // XYCoords to Vertex (for rotation)
      var end: Vertex = new Vertex(VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, endAngle));
      var start: Vertex = new Vertex(VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, startAngle));
      end.rotate(rotation, { x: x, y: y });
      start.rotate(rotation, { x: x, y: y });

      // Boolean stored as integers (0|1).
      var diff: number = endAngle - startAngle;
      var largeArcFlag: number;
      if (diff < 0) {
        largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
      } else {
        largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
      }

      const sweepFlag: number = 1;
      const pathData: SVGPathParams = [];
      if (options.moveToStart) {
        pathData.push("M", start.x, start.y);
      }
      // Arc rotation in degrees, not radians.
      const r2d: number = 180 / Math.PI;
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
    equidistantVertAngles: (
      radiusH: number,
      radiusV: number,
      startAngle: number,
      endAngle: number,
      fullEllipsePointCount: number
    ): Array<number> => {
      var ellipseAngles = VEllipse.utils.equidistantVertAngles(radiusH, radiusV, fullEllipsePointCount);
      ellipseAngles = ellipseAngles.map((angle: number) => VEllipseSector.ellipseSectorUtils.normalizeAngle(angle));

      var angleIsInRange = (angle: number) => {
        if (startAngle < endAngle) return angle >= startAngle && angle <= endAngle;
        else return angle >= startAngle || (angle <= endAngle && angle >= 0);
      };
      // Drop all angles outside the sector
      var ellipseAngles = ellipseAngles.filter(angleIsInRange);

      // Now we need to sort the angles to the first one in the array is the closest to startAngle.
      // --> find the angle that is closest to the start angle
      var startIndex = VEllipseSector.ellipseSectorUtils.findClosestToStartAngle(startAngle, endAngle, ellipseAngles);

      // Bring all angles into the correct order
      //    Idea: use splice or slice here?
      var angles = [];
      for (var i = 0; i < ellipseAngles.length; i++) {
        angles.push(ellipseAngles[(startIndex + i) % ellipseAngles.length]);
      }

      return angles;
    },

    findClosestToStartAngle: (startAngle: number, endAngle: number, ellipseAngles: Array<number>): number => {
      // Note: endAngle > 0 && startAngle > 0
      if (startAngle > endAngle) {
        const n: number = ellipseAngles.length;
        for (var i = 0; i < n; i++) {
          const ea: number = geomutils.wrapMinMax(ellipseAngles[i], 0, Math.PI * 2);
          if (ea >= startAngle && ea >= endAngle) {
            return i;
          }
        }
      }
      return 0;
    },

    normalizeAngle: (angle: number): number => (angle < 0 ? Math.PI * 2 + angle : angle),

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
    endpointToCenterParameters(
      x1: number,
      y1: number,
      rx: number,
      ry: number,
      phi: number,
      fa: boolean,
      fs: boolean,
      x2: number,
      y2: number
    ): VEllipseSector {
      // console.log("endpointToCenterParameters", x1, y1, phi, rx, ry, fa, fs, x2, y2);
      // Thanks to
      //    https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
      const abs = Math.abs;
      const sin = Math.sin;
      const cos = Math.cos;
      const sqrt = Math.sqrt;
      const pow = (n: number): number => {
        return n * n;
      };

      const sinphi: number = sin(phi);
      const cosphi: number = cos(phi);

      // Step 1: simplify through translation/rotation
      const x: number = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2;
      const y: number = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;

      const px: number = pow(x),
        py: number = pow(y),
        prx: number = pow(rx),
        pry: number = pow(ry);

      // correct of out-of-range radii
      const L: number = px / prx + py / pry;
      if (L > 1) {
        rx = sqrt(L) * abs(rx);
        ry = sqrt(L) * abs(ry);
      } else {
        rx = abs(rx);
        ry = abs(ry);
      }

      // Step 2 + 3: compute center
      const sign: number = fa === fs ? -1 : 1;
      const M: number = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;

      const _cx: number = (M * (rx * y)) / ry;
      const _cy: number = (M * (-ry * x)) / rx;

      const cx: number = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2;
      const cy: number = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;

      // Step 4: Compute start and end angle
      const center: Vertex = new Vertex(cx, cy);
      const axis: Vertex = center.clone().addXY(rx, ry);
      const ellipse: VEllipse = new VEllipse(center, axis, 0);
      ellipse.rotate(phi);

      const startAngle: number = new Line(ellipse.center, new Vertex(x1, y1)).angle();
      const endAngle: number = new Line(ellipse.center, new Vertex(x2, y2)).angle();
      return new VEllipseSector(ellipse, startAngle - phi, endAngle - phi);
    }
  }; // END ellipseSectorUtils
}
