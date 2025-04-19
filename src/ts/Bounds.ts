/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @modified 2021-06-21 (mid-summer) Added `getCenter` method.
 * @modified 2022-02-01 Added the `toString` function.
 * @modified 2022-10-09 Added the `fromDimension` function.
 * @modified 2022-11-28 Added the `clone` method.
 * @modified 2023-09-29 Added the `randomPoint` method.
 * @modified 2025-03-23 Added the `getMinDimension` and `getMaxDimension` methods.
 * @modified 2025-04-18 Change parameter type in `Bounds.computeFromVertices` from `Vertex` to more general `XYCoords`.
 * @modified 2025-04-19 Added methods to `Bounds` class: `getNorthPoint`, `getSouthPoint`, `getEastPoint` and `getWestPoint`.
 * @version  1.8.0
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
   * Get the center point of the north bound.
   * 
   * @method getNorthPoint
   * @instance
   * @memberof Bounds
   * @return {Vertex} The "northmost" centered point of this bounding box.
   */
  getNorthPoint() : Vertex {
    return new Vertex(this.min.x + this.width/2.0,  this.min.y );
  };

  /**
   * Get the center point of the south bound.
   * 
   * @method getNorthPoint
   * @instance
   * @memberof Bounds
   * @return {Vertex} The "southhmost" centered point of this bounding box.
   */
  getSouthPoint() : Vertex {
    return new Vertex( this.min.x + this.width/2.0, this.max.y );
  };

   /**
   * Get the center point of the west bound.
   * 
   * @method getWestPoint
   * @instance
   * @memberof Bounds
   * @return {Vertex} The "westhmost" centered point of this bounding box.
   */
   getWestPoint() : Vertex {
    return new Vertex( this.min.x, this.min.y + this.height/2.0 );
  };

   /**
   * Get the center point of the east bound.
   * 
   * @method getEastPoint
   * @instance
   * @memberof Bounds
   * @return {Vertex} The "easthmost" centered point of this bounding box.
   */
   getEastPoint() : Vertex {
    return new Vertex( this.max.x, this.min.y + this.height/2.0 );
  };


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
   * Get the minimum of `width` and `height`.
   *
   * @returns {number} The value of Math.min( this.width, this.height )
   */
  getMinDimension(): number {
    return Math.min(this.width, this.height);
  }

  /**
   * Get the minimum of `width` and `height`.
   *
   * @returns {number} The value of Math.min( this.width, this.height )
   */
  getMaxDimension(): number {
    return Math.max(this.width, this.height);
  }

  /**
   * Generate a random point inside this bounds object. Safe areas at the border to avoid
   * included.
   *
   * @method randomPoint
   * @instance
   * @memberof Bounds
   * @param {horizontalSafeArea} - (optional) The horizonal (left and right) safe area. No vertex will be created here. Can be used as percent in (0.0 ... 0.1) interval.
   * @param {verticalSafeArea} - (optional) The vertical (top and bottom) safe area. No vertex will be created here. Can be used as percent in (0.0 ... 0.1) interval
   * @returns {Vertex} A pseudo random point inside these bounds.
   */
  randomPoint(horizontalSafeArea: number = 0, verticalSafeArea: number = 0): Vertex {
    // Check if the safe areas are meant as percent
    const absHorizontalSafeArea =
      horizontalSafeArea > 0 && horizontalSafeArea < 1 ? this.width * horizontalSafeArea : horizontalSafeArea;
    const absVerticalSafeArea = verticalSafeArea > 0 && verticalSafeArea < 1 ? this.height * verticalSafeArea : verticalSafeArea;
    return new Vertex(
      this.min.x + absHorizontalSafeArea + Math.random() * (this.width - 2 * absHorizontalSafeArea),
      this.min.y + absVerticalSafeArea + Math.random() * (this.height - 2 * absVerticalSafeArea)
    );
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
   * Clone this bounds object (create a deep clone).
   *
   * @method clone
   * @instance
   * @memberof Bounds
   * @returns {Bounds} Creates a deep clone of this bounds object.
   */
  clone() {
    return new Bounds({ x: this.min.x, y: this.min.y }, { x: this.max.x, y: this.max.y });
  }

  /**
   * Compute the minimal bounding box for a given set of vertices.
   *
   * An empty vertex array will return an empty bounding box located at (0,0).
   *
   * @static
   * @method computeFromVertices
   * @memberof Bounds
   * @param {Array<XYCoords>} vertices - The set of vertices you want to get the bounding box for.
   * @return The minimal Bounds for the given vertices.
   **/
  static computeFromVertices(vertices: Array<XYCoords>): Bounds {
    if (vertices.length == 0) return new Bounds(new Vertex(0, 0), new Vertex(0, 0));

    let xMin = vertices[0].x;
    let xMax = vertices[0].x;
    let yMin = vertices[0].y;
    let yMax = vertices[0].y;

    let vert: XYCoords;
    for (var i in vertices) {
      vert = vertices[i];
      xMin = Math.min(xMin, vert.x);
      xMax = Math.max(xMax, vert.x);
      yMin = Math.min(yMin, vert.y);
      yMax = Math.max(yMax, vert.y);
    }
    return new Bounds(new Vertex(xMin, yMin), new Vertex(xMax, yMax));
  }

  /**
   * Create a new `Bounds` instance just from `width` and `height`, located at (0,0) or the optionally given origin.
   *
   * @param {number} width - The width of the bounds
   * @param {number} height  - The height of the bounds
   * @param {XYCoords={x:0,y:0}} origin - [optional] A origin to locate the new Bounds object at.
   * @returns {Bounds} A new `Bounds` instance width given width and height, located at (0,0) or the given origin..
   */
  static fromDimension(width: number, height: number, origin?: XYCoords): Bounds {
    return new Bounds(origin ?? { x: 0, y: 0 }, { x: (origin ? origin.x : 0) + width, y: (origin ? origin.y : 0) + height });
  }
} // END class bounds
