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
 * @modified 2025-04-02 Adding `CircleSector.lineIntersections` and `CircleSector.lineIntersectionTangents` and implementing `Intersectable`.
 * @version  1.2.0
 **/

import { Circle } from "./Circle";
import { Line } from "./Line";
import { UIDGenerator } from "./UIDGenerator";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { geomutils } from "./geomutils";
import { Intersectable, PathSegment, SVGPathParams, SVGSerializable, UID, XYCoords } from "./interfaces";

/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
export class CircleSector implements Intersectable, SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "CircleSector";

  /**
   * The UID of this drawable object.
   *
   * @member {UID}
   * @memberof CircleSector
   * @instance
   * @readonly
   */
  readonly uid: UID;

  /**
   * @member {Circle}
   * @memberof CircleSector
   * @instance
   */
  circle: Circle;

  /**
   * @member {number}
   * @memberof CircleSector
   * @instance
   */
  startAngle: number;

  /**
   * @member {number}
   * @memberof CircleSector
   * @instance
   */
  endAngle: number;

  /**
   * @member isDestroyed
   * @memberof CircleSector
   * @type {boolean}
   * @instance
   */
  isDestroyed: boolean;

  /**
   * Create a new circle sector with given circle, start- and end-angle.
   *
   * @constructor
   * @name CircleSector
   * @param {Circle} circle - The circle.
   * @param {number} startAngle - The start angle of the sector.
   * @param {number} endAngle - The end angle of the sector.
   */
  constructor(circle: Circle, startAngle: number, endAngle: number) {
    this.uid = UIDGenerator.next();
    this.circle = circle;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  /**
   * Checks wether the given angle (must be inside 0 and PI*2) is contained inside this sector.
   *
   * @param {number} angle - The numeric angle to check.
   * @method containsAngle
   * @instance
   * @memberof CircleSector
   * @return {boolean} True if (and only if) this sector contains the given angle.
   */
  containsAngle(angle: number) {
    if (this.startAngle <= this.endAngle) {
      return angle >= this.startAngle && angle < this.endAngle;
    } else {
      // startAngle > endAngle
      return angle >= this.startAngle || angle < this.endAngle;
    }
  }

  /**
   * Get the angle inside this sector for a given ratio. 0.0 means startAngle, and 1.0 means endAngle.
   *
   * @param {number} t - The ratio inside [0..1].
   * @method angleAt
   * @instance
   * @memberof CircleSector
   * @return {number} The angle inside this sector at a given ratio.
   */
  angleAt(t: number): number {
    if (this.startAngle <= this.endAngle) {
      const angleAtRatio: number = this.startAngle + (this.endAngle - this.startAngle) * t;
      return angleAtRatio % (Math.PI * 2.0);
    } else {
      // startAngle > endAngle
      const angleAtRatio: number = this.startAngle + (Math.PI * 2 - this.startAngle + this.endAngle) * t;
      return angleAtRatio % (Math.PI * 2.0);
    }
  }

  /**
   * Get the sectors starting point (on the underlying circle, located at the start angle).
   *
   * @method getStartPoint
   * @instance
   * @memberof CircleSector
   * @return {Vertex} The sector's stating point.
   */
  getStartPoint(): Vertex {
    return this.circle.vertAt(this.startAngle);
  }

  /**
   * Get the sectors ending point (on the underlying circle, located at the end angle).
   *
   * @method getEndPoint
   * @instance
   * @memberof CircleSector
   * @return {Vertex} The sector's ending point.
   */
  getEndPoint(): Vertex {
    return this.circle.vertAt(this.endAngle);
  }

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
  circleSectorIntersection(sector: CircleSector): CircleSector | null {
    const radicalLine: Line | null = this.circle.circleIntersection(sector.circle);
    if (!radicalLine) {
      // The circles to not intersect at all.
      return null;
    }
    // Circles intersect. Check if this sector interval intersects, too.
    const thisIntersectionAngleA = this.circle.center.angle(radicalLine.a);
    const thisIntersectionAngleB = this.circle.center.angle(radicalLine.b);
    // Is intersection inside this sector?
    if (!this.containsAngle(thisIntersectionAngleA) || !this.containsAngle(thisIntersectionAngleB)) {
      // At least one circle intersection point is not located in this sector.
      //  -> no valid intersection at all
      return null;
    }

    // Circles intersect. Check if the passed sector interval intersects, too.
    const thatIntersectionAngleA = sector.circle.center.angle(radicalLine.a);
    const thatIntersectionAngleB = sector.circle.center.angle(radicalLine.b);
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

    const resultSector = new CircleSector(
      new Circle(this.circle.center.clone(), this.circle.radius),
      thisIntersectionAngleA,
      thisIntersectionAngleB
    );
    if (resultSector.containsAngle(centerOfOriginalGap)) {
      resultSector.startAngle = thisIntersectionAngleB;
      resultSector.endAngle = thisIntersectionAngleA;
    }
    return resultSector;
  }

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
  lineIntersections(ray: VertTuple<Vector>, inVectorBoundsOnly: boolean = false): Array<Vertex> {
    // First get all line intersections from underlying ellipse.
    const ellipseIntersections: Array<Vertex> = this.circle.lineIntersections(ray, inVectorBoundsOnly);
    // Drop all intersection points that are not contained in the circle sectors bounds.
    const tmpLine = new Line(this.circle.center, new Vertex());
    return ellipseIntersections.filter((intersectionPoint: Vertex) => {
      tmpLine.b.set(intersectionPoint);
      const lineAngle = tmpLine.angle();
      return this.containsAngle(geomutils.wrapMinMax(lineAngle, 0, Math.PI * 2));
    });
  }

  /**
   * Get all line intersections of this polygon and their tangents along the shape.
   *
   * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
   *
   * @param line
   * @param lineIntersectionTangents
   * @returns
   */
  lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly: boolean = false): Array<Vector> {
    // Find the intersections of all lines plus their tangents inside the circle bounds
    const interSectionPoints: Array<Vertex> = this.lineIntersections(line, inVectorBoundsOnly);
    return interSectionPoints.map((vert: Vertex) => {
      // Calculate angle
      const lineFromCenter = new Line(this.circle.center, vert);
      const angle: number = lineFromCenter.angle();
      // console.log("angle", (angle / Math.PI) * 180.0);
      // const angle = Math.random() * Math.PI * 2; // TODO
      // Calculate tangent at angle
      return this.circle.tangentAt(angle);
    });
  }
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
  destroy() {
    this.circle.destroy();
    this.isDestroyed = true;
  }

  static circleSectorUtils = {
    /**
     * Helper function to convert polar circle coordinates to cartesian coordinates.
     *
     * TODO: generalize for ellipses (two radii).
     *
     * @param {number} angle - The angle in radians.
     */
    polarToCartesian: (centerX: number, centerY: number, radius: number, angle: number): XYCoords => {
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
    describeSVGArc: (
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      options?: { moveToStart: boolean }
    ): SVGPathParams => {
      if (typeof options === "undefined") options = { moveToStart: true };

      const end: XYCoords = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
      const start: XYCoords = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);

      // Split full circles into two halves.
      // Some browsers have problems to render full circles (described by start==end).
      if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
        const firstHalf: SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc(
          x,
          y,
          radius,
          startAngle,
          startAngle + (endAngle - startAngle) / 2,
          options
        );
        const secondHalf: SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc(
          x,
          y,
          radius,
          startAngle + (endAngle - startAngle) / 2,
          endAngle,
          options
        );
        return firstHalf.concat(secondHalf);
      }

      // Boolean stored as integers (0|1).
      const diff: number = endAngle - startAngle;
      var largeArcFlag: number;
      var sweepFlag: number;
      if (diff < 0) {
        largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
        sweepFlag = 1;
      } else {
        largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
        sweepFlag = 1;
      }

      const pathData: SVGPathParams = [];
      if (options.moveToStart) {
        pathData.push("M", start.x, start.y);
      }
      pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
      return pathData;
    }
  };
} // END class
