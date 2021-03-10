/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-14 Added functions `radiusH` and `radiusV`.
 * @modified 2021-02-26 Added helper function `decribeSVGArc(...)`.
 * @modified 2021-03-01 Added attribute `rotation` to allow rotation of ellipses.
 * @modified 2021-03-03 Added the `vertAt` and `perimeter` methods.
 * @modified 2021-03-05 Added the `getFoci`, `normalAt` and `tangentAt` methods.
 * @modified 2021-03-09 Added the `clone` and `rotate` methods.
 * @modified 2021-03-10 Added the `toCubicBezier` method.
 * @version  1.2.2
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/

import { Line } from "./Line";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";
import { UIDGenerator } from "./UIDGenerator";
import { SVGSerializable, UID, XYCoords } from "./interfaces";
import { CubicBezierCurve } from "./CubicBezierCurve";

/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 */
export class VEllipse implements SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "VEllipse";

  /**
   * The UID of this drawable object.
   *
   * @member {UID}
   * @memberof VEllipse
   * @instance
   * @readonly
   */
  readonly uid: UID;

  /**
   * @member {Vertex}
   * @memberof VEllipse
   * @instance
   */
  center: Vertex;

  /**
   * @member {Vertex}
   * @memberof VEllipse
   * @instance
   */
  axis: Vertex;

  /**
   * @member {number}
   * @memberof VEllipse
   * @instance
   */
  rotation: number;

  /**
   * The constructor.
   *
   * @constructor
   * @param {Vertex} center - The ellipses center.
   * @param {Vertex} axis - The x- and y-axis (the two radii encoded in a control point).
   * @param {Vertex} rotation - [optional, default=0] The rotation of this ellipse.
   * @name VEllipse
   **/
  constructor(center: Vertex, axis: Vertex, rotation?: number) {
    this.uid = UIDGenerator.next();
    this.center = center;
    this.axis = axis;
    this.rotation = rotation | 0.0;
  }

  /**
   * Clone this ellipse (deep clone).
   *
   * @return {VEllipse} A copy of this ellipse.s
   */
  clone(): VEllipse {
    return new VEllipse(this.center.clone(), this.axis.clone(), this.rotation);
  }

  /**
   * Get the non-negative horizonal radius of this ellipse.
   *
   * @method radiusH
   * @instance
   * @memberof VEllipse
   * @return {number} The unsigned horizontal radius of this ellipse.
   */
  radiusH(): number {
    return Math.abs(this.signedRadiusH());
  }

  /**
   * Get the signed horizonal radius of this ellipse.
   *
   * @method signedRadiusH
   * @instance
   * @memberof VEllipse
   * @return {number} The signed horizontal radius of this ellipse.
   */
  signedRadiusH(): number {
    // return Math.abs(this.axis.x - this.center.x);
    // Rotate axis back to origin before calculating radius
    // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).x - this.center.x);
    return new Vertex(this.axis).rotate(-this.rotation, this.center).x - this.center.x;
  }

  /**
   * Get the non-negative vertical radius of this ellipse.
   *
   * @method radiusV
   * @instance
   * @memberof VEllipse
   * @return {number} The unsigned vertical radius of this ellipse.
   */
  radiusV(): number {
    return Math.abs(this.signedRadiusV());
  }

  /**
   * Get the signed vertical radius of this ellipse.
   *
   * @method radiusV
   * @instance
   * @memberof VEllipse
   * @return {number} The signed vertical radius of this ellipse.
   */
  signedRadiusV(): number {
    // return Math.abs(this.axis.y - this.center.y);
    // Rotate axis back to origin before calculating radius
    // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).y - this.center.y);
    return new Vertex(this.axis).rotate(-this.rotation, this.center).y - this.center.y;
  }

  /**
   * Get the vertex on the ellipse's outline at the given angle.
   *
   * @method vertAt
   * @instance
   * @memberof VEllipse
   * @param {number} angle - The angle to determine the vertex at.
   * @return {Vertex} The vertex on the outline at the given angle.
   */
  vertAt(angle: number): Vertex {
    // Tanks to Narasinham for the vertex-on-ellipse equations
    // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
    const a: number = this.radiusH();
    const b: number = this.radiusV();
    return new Vertex(VEllipse.utils.polarToCartesian(this.center.x, this.center.y, a, b, angle)).rotate(
      this.rotation,
      this.center
    );
  }

  /**
   * Get the normal vector at the given angle.
   * The normal vector is the vector that intersects the ellipse in a 90 degree angle
   * at the given point (speicified by the given angle).
   *
   * Length of desired normal vector can be specified, default is 1.0.
   *
   * @method normalAt
   * @instance
   * @memberof VEllipse
   * @param {number} angle - The angle to get the normal vector at.
   * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
   */

  normalAt(angle: number, length?: number): Vector {
    const point: Vertex = this.vertAt(angle);
    const foci: [Vertex, Vertex] = this.getFoci();
    // Calculate the angle between [point,focusA] and [point,focusB]
    const angleA: number = new Line(point, foci[0]).angle();
    const angleB: number = new Line(point, foci[1]).angle();
    const centerAngle: number = angleA + (angleB - angleA) / 2.0;
    const endPointA: Vertex = point.clone().addX(50).clone().rotate(centerAngle, point);
    const endPointB: Vertex = point
      .clone()
      .addX(50)
      .clone()
      .rotate(Math.PI + centerAngle, point);
    if (this.center.distance(endPointA) < this.center.distance(endPointB)) {
      return new Vector(point, endPointB);
    } else {
      return new Vector(point, endPointA);
    }
  }

  /**
   * Get the tangent vector at the given angle.
   * The tangent vector is the vector that touches the ellipse exactly at the given given
   * point (speicified by the given angle).
   *
   * Note that the tangent is just 90 degree rotated normal vector.
   *
   * Length of desired tangent vector can be specified, default is 1.0.
   *
   * @method tangentAt
   * @instance
   * @memberof VEllipse
   * @param {number} angle - The angle to get the tangent vector at.
   * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
   */
  tangentAt(angle: number, length?: number): Vector {
    const normal: Vector = this.normalAt(angle, length);
    // Rotate the normal by 90 degrees, then it is the tangent.
    normal.b.rotate(Math.PI / 2, normal.a);
    return normal;
  }

  /**
   * Get the slope of the
   * @param angle
   * @returns
   */
  //   slopeAt(angle:number) : number {
  //     return (this.radiusH() * Math.sin(angle)) / (this.radiusV() * Math.cos(angle));
  //   }

  /**
   * Get the perimeter of this ellipse.
   *
   * @method perimeter
   * @instance
   * @memberof VEllipse
   * @return {number}
   */
  perimeter(): number {
    // This method does not use an iterative approximation to determine the perimeter, but it uses
    // a wonderful closed approximation found by Srinivasa Ramanujan.
    // Matt Parker made a neat video about it:
    //    https://www.youtube.com/watch?v=5nW3nJhBHL0
    const a: number = this.radiusH();
    const b: number = this.radiusV();
    return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  }

  /**
   * Get the two foci of this ellipse.
   *
   * @method getFoci
   * @instance
   * @memberof VEllipse
   * @return {Array<Vertex>} An array with two elements, the two focal points of the ellipse (foci).
   */
  getFoci(): [Vertex, Vertex] {
    // https://www.mathopenref.com/ellipsefoci.html
    const rh: number = this.radiusH();
    const rv: number = this.radiusV();
    const sdiff: number = rh * rh - rv * rv;
    // f is the distance of each focs to the center.
    const f: number = Math.sqrt(Math.abs(sdiff));
    // Foci on x- or y-axis?
    if (sdiff < 0) {
      return [
        this.center.clone().addY(f).rotate(this.rotation, this.center),
        this.center.clone().addY(-f).rotate(this.rotation, this.center)
      ];
    } else {
      return [
        this.center.clone().addX(f).rotate(this.rotation, this.center),
        this.center.clone().addX(-f).rotate(this.rotation, this.center)
      ];
    }
  }

  /**
   * Get n equidistant points on the elliptic arc.
   *
   * @param pointCount
   * @returns
   */
  getEquidistantVertices(pointCount: number): Array<Vertex> {
    // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
    var a = this.radiusH();
    var b = this.radiusV();

    var vertices = [];
    for (var i = 0; i < pointCount; i++) {
      var phi = Math.PI / 2.0 + ((Math.PI * 2) / pointCount) * i;
      // var tanPhi = Math.tan(phi);
      // var tanPhi2 = tanPhi * tanPhi;
      // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
      let theta = VEllipse.utils.phiToTheta(a, b, phi);

      vertices[i] = this.vertAt(theta);
    }
    return vertices;
  }

  // getEquilateralSectors(sectorCount: number): Array<number> {
  //   // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
  //   var a = this.radiusH();
  //   var b = this.radiusV();

  //   var sectorAngles = [];
  //   for (var i = 0; i < sectorCount; i++) {
  //     var phi = Math.PI / 2.0 + ((Math.PI * 2) / sectorCount) * i;
  //     // var tanPhi = Math.tan(phi);
  //     // var tanPhi2 = tanPhi * tanPhi;
  //     // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
  //     var theta = VEllipse.utils.phiToTheta(a, b, phi);

  //     // vertices[i] = this.vertAt(theta);
  //     sectorAngles[i] = theta;
  //   }
  //   return sectorAngles;
  // }

  // getEquidistantVertices(pointCount: number, startAngle?: number, endAngle?: number, addEndPoint?: boolean): Array<Vertex> {
  //   // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc

  //   // var pointCount = config.bezierSegments;
  //   // var startAngle = ellipseSector.startAngle;
  //   // var endAngle = ellipseSector.endAngle;
  //   startAngle = typeof startAngle === "undefined" ? 0 : startAngle;
  //   endAngle = typeof endAngle === "undefined" ? 0 : endAngle;
  //   var a = this.radiusH();
  //   var b = this.radiusV();
  //   // var fullAngle = Math.PI * 2;
  //   var fullAngle = endAngle - startAngle; // Math.PI*2
  //   if (fullAngle < 0) {
  //     fullAngle = Math.PI * 2 + fullAngle;
  //   }

  //   var vertices = [];
  //   for (var i = 0; i < pointCount + (addEndPoint ? 1 : 0); i++) {
  //     // var phi = Math.PI / 2.0 + startAngle + (fullAngle / pointCount) * i;
  //     var phi = Math.PI / 2.0 + (fullAngle / pointCount) * i;

  //     var tanPhi = Math.tan(phi);
  //     var tanPhi2 = tanPhi * tanPhi;

  //     // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
  //     // var theta = startAngle - Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
  //     var theta = startAngle - Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));

  //     vertices[i] = this.vertAt(theta);
  //     // pb.draw.circleHandle(vertices[i], 5, "orange");
  //     // pb.draw.line(this.center, vertices[i], "grey", 1);
  //   }
  //   // Add the last vertice if not full circle
  //   // if( fullAngle < Math.PI*2 )
  //   // vertices.push[]

  //   return vertices;
  // }

  //   rotate(angle: number) {
  //     this.axis.rotate(angle, this.center);
  //     this.rotation += angle;
  //   }

  toCubicBezier(segmentCount?: number, threshold?: number, startAngle?: number, endAngle?: number): Array<CubicBezierCurve> {
    // Math by Luc Maisonobe
    //    http://www.spaceroots.org/documents/ellipse/node22.html

    // Note that ellipses with radiusH=0 or radiusV=0 cannot be represented as Bézier curves.
    // Return a single line here (as a Bézier curve)
    if (Math.abs(this.radiusV()) < 0.00001) {
      const radiusH = this.radiusH();
      return [
        new CubicBezierCurve(
          this.center.clone().addX(radiusH),
          this.center.clone().addX(-radiusH),
          this.center.clone(),
          this.center.clone()
        )
      ]; // TODO: test horizontal line ellipse
    }
    if (Math.abs(this.radiusH()) < 0.00001) {
      const radiusV = this.radiusV();
      return [
        new CubicBezierCurve(
          this.center.clone().addY(radiusV),
          this.center.clone().addY(-radiusV),
          this.center.clone(),
          this.center.clone()
        )
      ]; // TODO: test vertical line ellipse
    }

    segmentCount = Math.max(2, segmentCount || 12); // At least 2, but 12 seems to be a good value.
    threshold = typeof threshold === "undefined" ? 0.666666 : threshold;

    let fullAngle: number = endAngle - startAngle;
    if (fullAngle < 0) {
      fullAngle = Math.PI * 2 + fullAngle;
    }

    let curAngle: number = startAngle;
    let startPoint: Vertex = this.vertAt(curAngle);
    let curves: Array<CubicBezierCurve> = [];
    //let lastIntersection: Vertex | undefined;
    for (var i = 0; i < segmentCount; i++) {
      let nextAngle: number = startAngle + (fullAngle / segmentCount) * (i + 1);
      let endPoint: Vertex = this.vertAt(nextAngle);

      let startTangent: Vector = this.tangentAt(curAngle);
      let endTangent: Vector = this.tangentAt(nextAngle);

      // Find intersection
      let intersection: Vertex | undefined = startTangent.intersection(endTangent);

      // What if intersection is undefined?
      // --> This *can* not happen if segmentCount > 1 and height and width of the ellipse are not zero.

      let startDiff = startPoint.difference(intersection);
      let endDiff = endPoint.difference(intersection);
      let curve = new CubicBezierCurve(
        startPoint.clone(),
        endPoint.clone(),
        startPoint.clone().add(startDiff.scale(threshold)),
        endPoint.clone().add(endDiff.scale(threshold))
      );
      curves.push(curve);
      startPoint = endPoint;
      curAngle = nextAngle;
      //lastIntersection = intersection;
    }
    return curves;
  }

  /**
   * Create an SVG representation of this ellipse.
   *
   * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
   * @param {object} options { className?:string }
   * @return string The SVG string
   */
  toSVGString(options: { className?: string }) {
    options = options || {};
    var buffer: Array<string> = [];
    buffer.push("<ellipse");
    if (options.className) buffer.push(' class="' + options.className + '"');
    buffer.push(' cx="' + this.center.x + '"');
    buffer.push(' cy="' + this.center.y + '"');
    buffer.push(' rx="' + this.axis.x + '"');
    buffer.push(' ry="' + this.axis.y + '"');
    buffer.push(" />");
    return buffer.join("");
  }

  /**
   * A static collection of ellipse-related helper functions.
   * @static
   */
  static utils = {
    /**
     * Calculate a particular point on the outline of the given ellipse (center plus two radii plus angle).
     *
     * @name polarToCartesian
     * @param {number} centerX - The x coordinate of the elliptic center.
     * @param {number} centerY - The y coordinate of the elliptic center.
     * @param {number} radiusH - The horizontal radius of the ellipse.
     * @param {number} radiusV - The vertical radius of the ellipse.
     * @param {number} angle - The angle (in radians) to get the desired outline point for.
     * @reutn {XYCoords} The outlont point in absolute x-y-coordinates.
     */
    polarToCartesian: (centerX: number, centerY: number, radiusH: number, radiusV: number, angle: number): XYCoords => {
      // Tanks to Narasinham for the vertex-on-ellipse equations
      // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
      var s = Math.sin(Math.PI / 2 - angle);
      var c = Math.cos(Math.PI / 2 - angle);
      return {
        x: centerX + (radiusH * radiusV * s) / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2)),
        y: centerY + (radiusH * radiusV * c) / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2))
      };
    },

    phiToTheta: (radiusH: number, radiusV: number, phi: number): number => {
      // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
      // var phi = Math.PI / 2.0 + ((Math.PI * 2) / sectorCount) * i;
      var tanPhi = Math.tan(phi);
      var tanPhi2 = tanPhi * tanPhi;
      var theta = -Math.PI / 2 + phi + Math.atan(((radiusH - radiusV) * tanPhi) / (radiusV + radiusH * tanPhi2));
      return theta;
    }
  }; // END utils
}
