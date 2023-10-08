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
 * @version  1.7.0
 **/
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
/**
 * @classdesc A bounds class with min and max values. Implementing IBounds.
 *
 * @requires XYCoords
 * @requires Vertex
 * @requires IBounds
 **/
export class Bounds {
    /**
     * The constructor.
     *
     * @constructor
     * @name Bounds
     * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
     **/
    constructor(min, max) {
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
    toPolygon() {
        return new Polygon([new Vertex(this.min), new Vertex(this.max.x, this.min.y), new Vertex(this.max), new Vertex(this.min.x, this.max.y)], false);
    }
    /**
     * Get the center of this boinding box.
     *
     * @method getCenter
     * @instance
     * @memberof Bounds
     * @returns {Vertex} The center of these bounds.
     */
    getCenter() {
        return new Vertex(this.min.x + (this.max.x - this.min.x) / 2.0, this.min.y + (this.max.y - this.min.y) / 2);
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
    randomPoint(horizontalSafeArea = 0, verticalSafeArea = 0) {
        // Check if the safe areas are meant as percent
        const absHorizontalSafeArea = horizontalSafeArea > 0 && horizontalSafeArea < 1 ? this.width * horizontalSafeArea : horizontalSafeArea;
        const absVerticalSafeArea = verticalSafeArea > 0 && verticalSafeArea < 1 ? this.height * verticalSafeArea : verticalSafeArea;
        return new Vertex(this.min.x + absHorizontalSafeArea + Math.random() * (this.width - 2 * absHorizontalSafeArea), this.min.y + absVerticalSafeArea + Math.random() * (this.height - 2 * absVerticalSafeArea));
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
    toString() {
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
     * @param {Array<Vertex>} vertices - The set of vertices you want to get the bounding box for.
     * @return The minimal Bounds for the given vertices.
     **/
    static computeFromVertices(vertices) {
        if (vertices.length == 0)
            return new Bounds(new Vertex(0, 0), new Vertex(0, 0));
        let xMin = vertices[0].x;
        let xMax = vertices[0].x;
        let yMin = vertices[0].y;
        let yMax = vertices[0].y;
        let vert;
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
    static fromDimension(width, height, origin) {
        return new Bounds(origin !== null && origin !== void 0 ? origin : { x: 0, y: 0 }, { x: (origin ? origin.x : 0) + width, y: (origin ? origin.y : 0) + height });
    }
} // END class bounds
//# sourceMappingURL=Bounds.js.map