/**
 * A collection of SVG path generation tools.
 *
 * @author  Ikaros Kappler
 * @date    2025-04-04
 * @version 1.0.0
 */

import { Circle } from "../Circle";
import { Vertex } from "../Vertex";
import { geomutils } from "../geomutils";
import { SVGPathParams } from "../interfaces";

export const SVGPathUtils = {
  /**
   * Creates an SVG shape resembling a circlular ring sector.
   *
   * @param {Vertex} center - The center position of the ring.
   * @param {number} innerRadius - The inner radius of the ring.
   * @param {number} outerRadius - The outer radius of the ring.
   * @param {number} startAngle - The start angle of the ring.
   * @param {number} endAngle - The end angle of the ring.
   * @returns {SVGPathParams} SVG path parmams for a closed shape representing the circular ring sector.
   */
  mkCircularRingSector: (
    center: Vertex,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ): SVGPathParams => {
    const innerStart = Circle.circleUtils.vertAt(startAngle, innerRadius).add(center);
    const innerEnd = Circle.circleUtils.vertAt(endAngle, innerRadius).add(center);
    const outerStart = Circle.circleUtils.vertAt(startAngle, outerRadius).add(center);
    const outerEnd = Circle.circleUtils.vertAt(endAngle, outerRadius).add(center);

    const buffer = ["M", innerStart.x, innerStart.y];
    // var isLargeArcRequired = geomutils.mapAngleTo2PI(Math.abs(startAngle - endAngle)) >= Math.PI;
    // var isLargeArcRequired = Math.abs(geomutils.mapAngleTo2PI(startAngle) - geomutils.mapAngleTo2PI(endAngle)) >= Math.PI;
    var isLargeArcRequired =
      geomutils.mapAngleTo2PI(geomutils.mapAngleTo2PI(startAngle) - geomutils.mapAngleTo2PI(endAngle)) >= Math.PI;

    var rotation = 0.0;
    var innerLargeArcFlag = isLargeArcRequired ? 0 : 1;
    var innerSweepFlag = 1; // isLargeArcRequired ? 1 : 0; // 1;
    var outerLargeArcFlag = isLargeArcRequired ? 0 : 1;
    var outerSweepFlag = 0; // isLargeArcRequired ? 0 : 1; // 0;
    buffer.push("A", innerRadius, innerRadius, rotation, innerLargeArcFlag, innerSweepFlag, innerEnd.x, innerEnd.y);
    buffer.push("L", outerEnd.x, outerEnd.y);
    buffer.push("A", outerRadius, outerRadius, rotation, outerLargeArcFlag, outerSweepFlag, outerStart.x, outerStart.y);
    buffer.push("Z");

    return buffer;
  }
};
