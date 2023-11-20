/**
 * A function to detect contour lines from 3D terrain data.
 *
 * For usage see demo `./demos/48-contour-plot`.
 *
 * @requires detectPaths
 * @requires GenericPath
 * @author   Ikaros Kappler
 * @date     2023-11-05
 * @modified 2023-11-20 Addig path detection on a triangle based grid.
 * @version  1.0.0
 */

import { Line } from "../../Line";
import { Vertex } from "../../Vertex";
import { DataGridFace4, IDataGrid2d } from "../datastructures/DataGrid2d";
import { detectPaths } from "./detectPaths";
import { clearDuplicateVertices } from "./clearDuplicateVertices";
import { GenericPath } from "../datastructures/GenericPath";

/**
 * Just a helper type for describing triangles on a surface.
 */
type DataGridFace3<T> = [T | null, T | null, T | null];

export class ContourLineDetection {
  private dataGrid;

  private rawLinearPathSegments: Array<Line> = [];

  static CLOSE_GAP_TYPE_NONE = 0;
  static CLOSE_GAP_TYPE_ABOVE = 1;
  static CLOSE_GAP_TYPE_BELOW = 2;

  // Activates/deactivates warning messages on rare edge cases where local path detection fails.
  public debugMode: boolean = false;

  /**
   * Creates a new instance for calculating contour lines from the given data grid.
   * @param {IDataGrid2d<number>} dataGrid - The data grid to use. Must not contain any NaN or null values.
   * @param {boolean=?} debugMode - (optional) Pass `true` to log warnings on (rare) critical edge cases where the algorithm might fail.
   */
  constructor(dataGrid: IDataGrid2d<number>, debugMode?: boolean) {
    this.dataGrid = dataGrid;
    this.debugMode = Boolean(debugMode);
  }

  /**
   * Detect contour paths from the underlying data source.
   *
   * @param {number} criticalHeightValue - The height value. If above data's maximum or below data's minimum then the result will be empty (no intersections).
   * @param {number} options.closeGapType - `CLOSE_GAP_TYPE_NONE` or `CLOSE_GAP_TYPE_ABOVE` or `CLOSE_GAP_TYPE_BELOW`.
   * @param {boolean=false} options.useTriangles - If set to true the detection will split each face3 quad into two triangle faces.
   * @param {pathDetectEpsilon=0.000001} options.pathDetectEpsilon - (optional) The epsilon to tell if two points are located 'in the same place'. Used for connected path detection. If not specified the value `0.0000001` is used.
   * @param {pointEliminationEpsilon=0.0000001} options.pointEliminationEpsilon - (optional) The epsilon for duplicate point elimination (default is 0.000001).
   * @param {function?} onRawSegmentsDetected - (optional) Get the interim result of all detected single lines before path detection starts; DO NOT MODIFY the array.
   * @returns {Array<GenericPath>} - A list of connected paths that resemble the contour lines of the data/terrain at the given height value.
   */
  detectContourPaths(
    criticalHeightValue: number,
    options?: {
      closeGapType: number;
      useTriangles?: boolean;
      pointEliminationEpsilon?: number;
      pathDetectEpsilon?: number;
      onRawSegmentsDetected?: (rawSegmentsDoNotModifiy: Array<Line>) => void;
    }
  ): Array<GenericPath> {
    options = options || { closeGapType: ContourLineDetection.CLOSE_GAP_TYPE_NONE };

    // First: clear the buffer
    this.rawLinearPathSegments = [];

    // Imagine a face4 element like this
    //    (x,y)       (x+1,y)
    //         A-----B
    //         |   / |
    //         | /   |
    //         D-----C
    //  (x,y+1)        (x+1,y+1)
    //	   then result in the buffer will be
    //   [ [A,B],
    //     [D,C] ]
    // Note that the diagonal line (used for triangles) is optional; depends on `options.useTriangles`.
    const heightFace: DataGridFace4<number> = [
      [0, 0],
      [0, 0]
    ];
    for (var y = 0; y + 1 < this.dataGrid.ySegmentCount; y++) {
      for (var x = 0; x + 1 < this.dataGrid.xSegmentCount; x++) {
        this.dataGrid.getDataFace4At(x, y, heightFace);
        this.findHeightFaceIntersectionLines(
          x,
          y,
          heightFace,
          criticalHeightValue,
          options.pointEliminationEpsilon ?? 0.0000001,
          options.useTriangles
        );
      }
    }

    // Collect value above/below on the y axis
    if (
      options.closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE ||
      options.closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW
    ) {
      const xExtremes = [0, this.dataGrid.xSegmentCount - 1];
      for (var i = 0; i < xExtremes.length; i++) {
        const x = xExtremes[i];
        for (var y = 0; y + 1 < this.dataGrid.ySegmentCount; y++) {
          const nextX = x;
          const nextY = y + 1;
          this.detectAboveBelowLerpSegment(x, y, nextX, nextY, criticalHeightValue, options.closeGapType);
        }
      }
      const yExtremes = [0, this.dataGrid.ySegmentCount - 1];
      for (var j = 0; j < yExtremes.length; j++) {
        var y = yExtremes[j];
        for (var x = 0; x + 1 < this.dataGrid.xSegmentCount; x++) {
          const nextX = x + 1;
          const nextY = y;
          this.detectAboveBelowLerpSegment(x, y, nextX, nextY, criticalHeightValue, options.closeGapType);
        }
      }
    }

    if (options.onRawSegmentsDetected) {
      options.onRawSegmentsDetected(this.rawLinearPathSegments);
    }

    // Detect connected paths
    let pathSegments: Array<GenericPath> = detectPaths(this.rawLinearPathSegments, options.pathDetectEpsilon ?? 0.0000001); // Epsilon
    // Filter out segments with only a single line of length~=0
    pathSegments = pathSegments.filter(function (pathSegment) {
      return (
        pathSegment.segments.length != 1 ||
        (pathSegment.segments.length === 1 && (pathSegment.segments[0] as Line).length() > 0.1)
      );
    });
    return pathSegments;
  }

  /**
   * This function will calculate a single intersecion line of the given face4 data
   * segment. If the given face does not intersect with the plane at the given `heightValue`
   * then no segments will be stored.
   *
   * @param {number} xIndex - The x position (index) of the data face.
   * @param {number} yIndex - The y position (index) of the data face.
   * @param {[[number,number],[number,number]]} heightFace - The data sample that composes the face4 as a two-dimensional number array.
   * @param {number} heightValue - The height value of the intersection plane to check for.
   * @returns {Line|null}
   */
  private findHeight4FaceIntersectionLine(
    xIndex: number,
    yIndex: number,
    heightFace: DataGridFace4<number>,
    heightValue: number,
    pointEliminationEpsilon: number
  ): Line | null {
    const heightValueA = heightFace[0][0]; // value at (x,y)
    const heightValueB = heightFace[1][0];
    const heightValueC = heightFace[1][1];
    const heightValueD = heightFace[0][1];

    if (heightValueA === null || heightValueB === null || heightValueC === null || heightValueD === null) {
      throw `[findHeightFace4IntersectionLine] Cannot extract data face at (${xIndex},${yIndex}). Some values are null.`;
    }

    let points: Array<Vertex> = [];

    // Case A: use full quad face
    if (this.isBetween(heightValueA, heightValueB, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, heightValue);
      points.push(new Vertex(this.lerp(xIndex, xIndex + 1, lerpValueByHeight), yIndex));
    }
    if (this.isBetween(heightValueB, heightValueC, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueB, heightValueC, heightValue);
      points.push(new Vertex(xIndex + 1, this.lerp(yIndex, yIndex + 1, lerpValueByHeight)));
    }
    if (this.isBetween(heightValueC, heightValueD, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueC, heightValueD, heightValue);
      points.push(new Vertex(this.lerp(xIndex + 1, xIndex, lerpValueByHeight), yIndex + 1));
    }
    if (this.isBetween(heightValueD, heightValueA, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueD, heightValueA, heightValue);
      points.push(new Vertex(xIndex, this.lerp(yIndex + 1, yIndex, lerpValueByHeight)));
    }

    // Warning: if a plane intersection point is located EXACTLY on the corner
    // edge of a face, then the two adjacent edges will result in 2x the same
    // intersecion point. This must be handled as one, so filter the point list
    // by an epsilon.
    points = clearDuplicateVertices(points, pointEliminationEpsilon); // 0.000001);

    if (points.length >= 2) {
      const startPoint = points[0];
      const endPoint = points[1];
      if (this.debugMode && points.length > 2) {
        console.warn(
          "[findHeightFace4IntersectionLine] Detected more than 2 points on one face whre only 0 or 2 should appear. At ",
          xIndex,
          yIndex,
          points
        );
      }
      return new Line(startPoint, endPoint);
    } else {
      if (this.debugMode && points.length === 1) {
        console.warn("[findHeightFace4IntersectionLine] Point list has only one point (should not happen).");
      }
      return null;
    }
  }

  /**
   * This function will calculate a single intersecion line of the given face4 data
   * segment. If the given face does not intersect with the plane at the given `heightValue`
   * then no segments will be stored.
   *
   * @param {number} xIndex - The x position (index) of the data face.
   * @param {number} yIndex - The y position (index) of the data face.
   * @param {[[number,number],[number,number]]} heightFace - The data sample that composes the face4 as a two-dimensional number array.
   * @param {number} heightValue - The height value of the intersection plane to check for.
   * @returns {Line|null}
   */
  private findHeightFaceIntersectionLines(
    xIndex: number,
    yIndex: number,
    heightFace: DataGridFace4<number>,
    criticalHeightValue: number,
    pointEliminationEpsilon: number,
    useTriangles?: boolean
  ): void {
    // Imagine a face4 element like this
    //    (x,y)       (x+1,y)
    //         A-----B
    //         |   / |
    //         | /   |
    //         D-----C
    //  (x,y+1)        (x+1,y+1)
    //	   then result in the buffer will be
    //   [ [A,B],
    //     [D,C] ]
    if (useTriangles) {
      const lineA = this.findHeighteFace3IntersectionLine(
        xIndex,
        yIndex,
        xIndex,
        yIndex + 1,
        xIndex + 1,
        yIndex,
        [heightFace[0][0], heightFace[0][1], heightFace[1][0]],
        criticalHeightValue,
        pointEliminationEpsilon
      );
      if (lineA) {
        this.rawLinearPathSegments.push(lineA);
      }
      const lineB = this.findHeighteFace3IntersectionLine(
        xIndex,
        yIndex + 1,
        xIndex + 1,
        yIndex + 1,
        xIndex + 1,
        yIndex,
        [heightFace[0][1], heightFace[1][1], heightFace[1][0]],
        criticalHeightValue,
        pointEliminationEpsilon
      );
      if (lineB) {
        this.rawLinearPathSegments.push(lineB);
      }
    } else {
      const line = this.findHeight4FaceIntersectionLine(xIndex, yIndex, heightFace, criticalHeightValue, pointEliminationEpsilon);
      if (line) {
        this.rawLinearPathSegments.push(line);
      }
    }
  }

  /**
   * This function will calculate a single intersecion line of the given face3 data
   * segment. If the given face does not intersect with the plane at the given `heightValue`
   * then no segments will be stored.
   *
   * @param {number} xIndexA - The x position (index) of the first triangle data point.
   * @param {number} yIndexA - The y position (index) of the first triangle data point.
   * @param {[[number,number],[number,number]]} heightFace - The data sample that composes the face4 as a two-dimensional number array.
   * @param {number} heightValue - The height value of the intersection plane to check for.
   * @returns {Line|null}
   */
  private findHeighteFace3IntersectionLine(
    xIndexA: number,
    yIndexA: number,
    xIndexB: number,
    yIndexB: number,
    xIndexC: number,
    yIndexC: number,
    heightFace: DataGridFace3<number>,
    heightValue: number,
    pointEliminationEpsilon: number
  ): Line | null {
    const heightValueA = heightFace[0]; // value at (x,y)
    const heightValueB = heightFace[1];
    const heightValueC = heightFace[2];

    if (heightValueA === null || heightValueB === null || heightValueC === null) {
      throw `[findHeightFace3IntersectionLine] Cannot extract data face at (${xIndexA},${yIndexA}). Some values are null.`;
    }

    let points: Array<Vertex> = [];

    // Case A: use full quad face
    if (this.isBetween(heightValueA, heightValueB, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, heightValue);
      points.push(new Vertex(this.lerp(xIndexA, xIndexB, lerpValueByHeight), this.lerp(yIndexA, yIndexB, lerpValueByHeight)));
    }
    if (this.isBetween(heightValueB, heightValueC, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueB, heightValueC, heightValue);
      // points.push(new Vertex(xIndex + 1, this.lerp(yIndex, yIndex + 1, lerpValueByHeight)));
      points.push(new Vertex(this.lerp(xIndexB, xIndexC, lerpValueByHeight), this.lerp(yIndexB, yIndexC, lerpValueByHeight)));
    }
    if (this.isBetween(heightValueC, heightValueA, heightValue)) {
      const lerpValueByHeight = this.getLerpRatio(heightValueC, heightValueA, heightValue);
      // points.push(new Vertex(this.lerp(xIndex + 1, xIndex, lerpValueByHeight), yIndex + 1));
      points.push(new Vertex(this.lerp(xIndexC, xIndexA, lerpValueByHeight), this.lerp(yIndexC, yIndexA, lerpValueByHeight)));
    }

    // Warning: if a plane intersection point is located EXACTLY on the corner
    // edge of a face, then the two adjacent edges will result in 2x the same
    // intersecion point. This must be handled as one, so filter the point list
    // by an epsilon.
    points = clearDuplicateVertices(points, pointEliminationEpsilon); // 0.0000001);

    if (points.length >= 2) {
      const startPoint = points[0];
      const endPoint = points[1];
      if (this.debugMode && points.length > 2) {
        console.warn(
          "[findHeightFace3IntersectionLine] Detected more than 2 points on one face whre only 0 or 2 should appear. At ",
          xIndexA,
          yIndexA,
          points
        );
      }
      return new Line(startPoint, endPoint);
    } else {
      if (this.debugMode && points.length === 1) {
        console.warn("[findHeightFace3IntersectionLine] Point list has only one point (should not happen).");
      }
      return null;
    }
  }

  /**
   * This procedure will look at the face4 at the ((x,y),(nextX,nextY)) position – which are four values –
   * and determines the local contour lines for these cases.
   *
   * This is used to detect and calculate edge cases on the borders of the underliying height data:
   *  * left and right border (x=0, x=data.xSegmentCount)
   *  * top and bottom border (x=y, x=data.ySegmentCount)
   *
   * Resulting path segments will be stored in the global `rawLinearPathSegments` array for further processing.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} nextX
   * @param {number} nextY
   * @param {number} criticalHeightValue
   * @param {number} closeGapType - CLOSE_GAP_TYPE_ABOVE or CLOSE_GAP_TYPE_BELOW.
   * @return {void}
   */
  detectAboveBelowLerpSegment(
    x: number,
    y: number,
    nextX: number,
    nextY: number,
    criticalHeightValue: number,
    closeGapType: number
  ): void {
    const heightValueA = this.dataGrid.getDataValueAt(x, y);
    const heightValueB = this.dataGrid.getDataValueAt(nextX, nextY);
    //   if (heightValueA >= criticalHeightValue && heightValueB >= criticalHeightValue) {
    if (this.areBothValuesOnRequiredPlaneSide(heightValueA, heightValueB, criticalHeightValue, closeGapType)) {
      //  Both above
      const line = new Line(new Vertex(x, y), new Vertex(nextX, nextY));
      this.rawLinearPathSegments.push(line);
    } else if (
      (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE &&
        heightValueA >= criticalHeightValue &&
        heightValueB <= criticalHeightValue) ||
      (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW &&
        heightValueA <= criticalHeightValue &&
        heightValueB >= criticalHeightValue)
    ) {
      // Only one of both (first) is above -> interpolate to find exact intersection point
      const lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, criticalHeightValue);
      const interpLine = new Line(
        new Vertex(x, y),
        new Vertex(this.lerp(x, nextX, lerpValueByHeight), this.lerp(y, nextY, lerpValueByHeight))
      );
      this.rawLinearPathSegments.push(interpLine);
    } else if (
      (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE &&
        heightValueA <= criticalHeightValue &&
        heightValueB >= criticalHeightValue) ||
      (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW &&
        heightValueA >= criticalHeightValue &&
        heightValueB <= criticalHeightValue)
    ) {
      // Only one of both (second) is above -> interpolate to find exact intersection point
      const lerpValueByHeight = this.getLerpRatio(heightValueA, heightValueB, criticalHeightValue);
      const interpLine = new Line(
        new Vertex(this.lerp(x, nextX, lerpValueByHeight), this.lerp(y, nextY, lerpValueByHeight)),
        new Vertex(nextX, nextY)
      );
      this.rawLinearPathSegments.push(interpLine);
    }
  }

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
  private areBothValuesOnRequiredPlaneSide(valueA: number, valueB: number, criticalValue: number, closeGapType: number): boolean {
    return (
      (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_BELOW && valueA <= criticalValue && valueB <= criticalValue) ||
      (closeGapType == ContourLineDetection.CLOSE_GAP_TYPE_ABOVE && valueA >= criticalValue && valueB >= criticalValue)
    );
  }

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
  private isBetween(valA: number, valB: number, curValue: number): boolean {
    return (valA <= curValue && curValue <= valB) || (valB <= curValue && curValue <= valA);
  }

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
  private getLerpRatio(valA: number, valB: number, curValue: number): number {
    return (curValue - valA) / (valB - valA);
  }

  /**
   * Helper function to lerp a numeric value.
   *
   * @param {number} min - The min (start) value. Doesn't necesarily need to be the smaller one.
   * @param {number} max - The max (end) value. Doesn't necesarily need to be the larger one.
   * @param {number} ratio - The lerp ratio; usually a value between 0.0 and 1.0, but other values a valid for linear interpolation, too.
   * @returns {number}
   */
  private lerp(min: number, max: number, ratio: number): number {
    return min + (max - min) * ratio;
  }
}
