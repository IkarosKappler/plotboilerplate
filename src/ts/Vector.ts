/**
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-02-23 Added the toSVGString function, overriding Line.toSVGString.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-19 Added the clone function (overriding Line.clone()).
 * @modified 2019-09-02 Added the Vector.perp() function.
 * @modified 2019-09-02 Added the Vector.inverse() function.
 * @modified 2019-12-04 Added the Vector.inv() function.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Vector.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-10-25 Added the `getOrthogonal` method.
 * @version  1.5.0
 *
 * @file Vector
 * @public
 **/

import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGSerializable, XYCoords } from "./interfaces";

/**
 * @classdesc A vector (Vertex,Vertex) is a line with a visible direction.<br>
 *            <br>
 *            Vectors are drawn with an arrow at their end point.<br>
 *            <b>The Vector class extends the Line class.</b>
 *
 * @requires VertTuple
 * @requires Vertex
 **/
export class Vector extends VertTuple<Vector> implements SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string = "Vector";

  /**
   * The constructor.
   *
   * @constructor
   * @name Vector
   * @extends Line
   * @param {Vertex} vertA - The start vertex of the vector.
   * @param {Vertex} vertB - The end vertex of the vector.
   **/
  constructor(vertA: Vertex, vertB: Vertex) {
    super(vertA, vertB, (a: Vertex, b: Vertex) => new Vector(a, b));
  }

  /**
   * Get the perpendicular of this vector which is located at a.
   *
   * @return {Vector} A new vector being the perpendicular of this vector sitting on a.
   **/
  perp(): Vector {
    var v: Vector = this.clone();
    v.sub(this.a);
    v = new Vector(new Vertex(), new Vertex(-v.b.y, v.b.x));
    v.a.add(this.a);
    v.b.add(this.a);
    return v;
  }

  /**
   * The inverse of a vector is a vector with the same magnitude but oppose direction.
   *
   * Please not that the origin of this vector changes here: a->b becomes b->a.
   *
   * @return {Vector}
   **/
  inverse(): Vector {
    var tmp = this.a;
    this.a = this.b;
    this.b = tmp;
    return this;
  }

  /**
   * This function computes the inverse of the vector, which means 'a' stays untouched.
   *
   * @return {Vector} this for chaining.
   **/
  inv(): Vector {
    this.b.x = this.a.x - (this.b.x - this.a.x);
    this.b.y = this.a.y - (this.b.y - this.a.y);
    return this;
  }

  /**
   * Get the intersection if this vector and the specified vector.
   *
   * @method intersection
   * @param {Vector} line The second vector.
   * @return {Vertex} The intersection (may lie outside the end-points).
   * @instance
   * @memberof Line
   **/
  intersection(line: Vector): Vertex | null {
    var denominator = this.denominator(line);
    if (denominator == 0) return null;

    var a = this.a.y - line.a.y;
    var b = this.a.x - line.a.x;
    var numerator1 = (line.b.x - line.a.x) * a - (line.b.y - line.a.y) * b;
    var numerator2 = (this.b.x - this.a.x) * a - (this.b.y - this.a.y) * b;
    a = numerator1 / denominator; // NaN if parallel lines
    b = numerator2 / denominator;

    // TODO:
    // FOR A VECTOR THE LINE-INTERSECTION MUST BE ON BOTH VECTORS

    // if we cast these lines infinitely in both directions, they intersect here:
    return new Vertex(this.a.x + a * (this.b.x - this.a.x), this.a.y + a * (this.b.y - this.a.y));
  }

  /**
   * Get the orthogonal "vector" of this vector (rotated by 90° clockwise).
   *
   * @name getOrthogonal
   * @method getOrthogonal
   * @return {Vector} A new vector with the same length that stands on this vector's point a.
   * @instance
   * @memberof Vector
   **/
  getOrthogonal(): Vector {
    // Orthogonal of vector (0,0)->(x,y) is (0,0)->(-y,x)
    const linePoint = this.a.clone();
    const startPoint = this.b.clone().sub(this.a);
    const tmp = startPoint.x;
    startPoint.x = -startPoint.y;
    startPoint.y = tmp;
    return new Vector(linePoint, startPoint.add(this.a));
  }

  static utils = {
    /**
     * Generate a four-point arrow head, starting at the vector end minus the
     * arrow head length.
     *
     * The first vertex in the returned array is guaranteed to be the located
     * at the vector line end minus the arrow head length.
     *
     *
     * Due to performance all params are required.
     *
     * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
     * scaling different). Arrow heads should not look distored on non-uniform scaling.
     *
     * If unsure use 1.0 for scaleX and scaleY (=no distortion).
     * For headlen use 8, it's a good arrow head size.
     *
     * Example:
     *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
     *
     * @param {XYCoords} zA - The start vertex of the vector to calculate the arrow head for.
     * @param {XYCoords} zB - The end vertex of the vector.
     * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
     * @param {number} scaleX  - The horizontal scaling during draw.
     * @param {number} scaleY  - the vertical scaling during draw.
     **/
    buildArrowHead: (zA: XYCoords, zB: XYCoords, headlen: number, scaleX: number, scaleY: number): Array<Vertex> => {
      const angle = Math.atan2((zB.y - zA.y) * scaleY, (zB.x - zA.x) * scaleX);
      const vertices: Array<Vertex> = [];
      vertices.push(new Vertex(zB.x * scaleX - headlen * Math.cos(angle), zB.y * scaleY - headlen * Math.sin(angle)));
      vertices.push(
        new Vertex(
          zB.x * scaleX - headlen * 1.35 * Math.cos(angle - Math.PI / 8),
          zB.y * scaleY - headlen * 1.35 * Math.sin(angle - Math.PI / 8)
        )
      );
      vertices.push(new Vertex(zB.x * scaleX, zB.y * scaleY));
      vertices.push(
        new Vertex(
          zB.x * scaleX - headlen * 1.35 * Math.cos(angle + Math.PI / 8),
          zB.y * scaleY - headlen * 1.35 * Math.sin(angle + Math.PI / 8)
        )
      );

      return vertices;
    }
  };
}
