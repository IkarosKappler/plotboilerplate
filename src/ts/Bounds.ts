/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @modified 2021-06-21 (mid-summer) Added `getCenter` method.
 * @modified 2022-02-01 Added the `toString` function.
 * @version  1.4.0
 **/

import { Polygon } from "./Polygon";
import { XYCoords, IBounds, XYDimension } from "./interfaces";
import { Vertex } from "./Vertex";

/**
 * @classdesc A bounds class with min and max values. Implementing IBounds.
 *
 * @requires XYCoords
 * @requires Vertex
 * @requires IBounds
 **/
export class Bounds implements IBounds, XYDimension {
  /**
   * @member {XYCoords}
   * @memberof Bounds
   * @instance
   * @public
   */
  readonly min: XYCoords;

  /**
   * @member {XYCoords}
   * @memberof Bounds
   * @instance
   * @public
   */
  readonly max: XYCoords;

  /**
   * @member {number}
   * @memberof Bounds
   * @instance
   * @public
   */
  readonly width: number;

  /**
   * @member {number}
   * @memberof Bounds
   * @instance
   * @public
   */
  readonly height: number;

  /**
   * The constructor.
   *
   * @constructor
   * @name Bounds
   * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
   * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
   **/
  constructor(min: XYCoords, max: XYCoords) {
    this.min = min;
    this.max = max;
    this.width = max.x - min.x;
    this.height = max.y - min.y;
  }

  /**
   * Convert this rectangular bounding box to a polygon with four vertices.
   *
   * @method toPolygon
   * @instance
   * @memberof Bounds
   * @return {Polygon} This bound rectangle as a polygon.
   */
  toPolygon(): Polygon {
    return new Polygon(
      [new Vertex(this.min), new Vertex(this.max.x, this.min.y), new Vertex(this.max), new Vertex(this.min.x, this.max.y)],
      false
    );
  }

  /**
   * Get the center of this boinding box.
   *
   * @method getCenter
   * @instance
   * @memberof Bounds
   * @returns {Vertex} The center of these bounds.
   */
  getCenter(): Vertex {
    return new Vertex(this.min.x + (this.max.x - this.min.x) / 2.0, this.min.y + (this.max.y - this.min.y) / 2);
  }

  /**
   * Convert these bounds to a human readable form.
   *
   * Note: the returned format might change in the future, so please do not
   * rely on the returned string format.
   *
   * @method toString
   * @instance
   * @memberof Bounds
   * @returns {string} Get these bounds in a human readable form.
   */
  toString(): string {
    return `{ min: ${this.min.toString()}, max : ${this.max.toString()}, width: ${this.width}, height : ${this.height} }`;
  }

  /**
   * Compute the minimal bounding box for a given set of vertices.
   *
   * An empty vertex array will return an empty bounding box located at (0,0).
   *
   * @static
   * @method computeFromVertices
   * @memberof Bounds
   * @param {Array<Vertex>} vertices - The set of vertices you want to get the bounding box for.
   * @return The minimal Bounds for the given vertices.
   **/
  static computeFromVertices(vertices: Array<Vertex>): Bounds {
    if (vertices.length == 0) return new Bounds(new Vertex(0, 0), new Vertex(0, 0));

    let xMin = vertices[0].x;
    let xMax = vertices[0].x;
    let yMin = vertices[0].y;
    let yMax = vertices[0].y;

    let vert: Vertex;
    for (var i in vertices) {
      vert = vertices[i];
      xMin = Math.min(xMin, vert.x);
      xMax = Math.max(xMax, vert.x);
      yMin = Math.min(yMin, vert.y);
      yMax = Math.max(yMax, vert.y);
    }
    return new Bounds(new Vertex(xMin, yMin), new Vertex(xMax, yMax));
  }
} // END class bounds
