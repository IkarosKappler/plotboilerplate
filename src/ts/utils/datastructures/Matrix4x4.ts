/**
 * This file defines a Matrix4x4 class for 3d transformations.
 *
 * [ xx xy yz xw
 *   yx yy yz yw
 *   zx zy zz zw
 *   wx wy wz ww ]
 *
 * Original class found at
 *    https://www.migenius.com/articles/3d-transformations-part1-matrices
 * by Paul Arden
 *
 * @file Matrix4x4.js
 */

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Vec4 extends Vec3 {
  w: number;
}

interface IMatrix4x4 {
  xx: number;
  xy: number;
  xz: number;
  xw: number;

  yx: number;
  yy: number;
  yz: number;
  yw: number;

  zx: number;
  zy: number;
  zz: number;
  zw: number;

  wx: number;
  wy: number;
  wz: number;
  ww: number;
}

export class Matrix4x4 {
  /**
   * xx component of the matrix.
   * @type {Number}
   * @private
   */
  xx: number;

  /**
   * xy component of the matrix.
   * @type {Number}
   * @private
   */
  xy: number;

  /**
   * xz component of the matrix.
   * @type {Number}
   * @private
   */
  xz: number;

  /**
   * xw component of the matrix.
   * @type {Number}
   * @private
   */
  xw: number;

  /**
   * yx component of the matrix.
   * @type {Number}
   * @private
   */
  yx: number;

  /**
   * yy component of the matrix.
   * @type {Number}
   * @private
   */
  yy: number;

  /**
   * yz component of the matrix.
   * @type {Number}
   * @private
   */
  yz: number;

  /**
   * yw component of the matrix.
   * @type {Number}
   * @private
   */
  yw: number;

  /**
   * zx component of the matrix.
   * @type {Number}
   * @private
   */
  zx: number;

  /**
   * zy component of the matrix.
   * @type {Number}
   * @private
   */
  zy: number;

  /**
   * zz component of the matrix.
   * @type {Number}
   * @private
   */
  zz: number;

  /**
   * zw component of the matrix.
   * @type {Number}
   * @private
   */
  zw: number;

  /**
   * wx component of the matrix.
   * @type {Number}
   * @private
   */
  wx: number;

  /**
   * wy component of the matrix.
   * @type {Number}
   * @private
   */
  wy: number;

  /**
   * wz component of the matrix.
   * @type {Number}
   * @private
   */
  wz: number;

  /**
   * ww component of the matrix.
   * @type {Number}
   * @private
   */
  ww: number;

  /**
   * Generic class for representing 4x4 matrices.
   * @constructor
   * @param {Object} matrix - An object with the initial values for the Matrix4x4.
   * Can be either an Object or Matrix4x4.
   */
  constructor(matrix?: Matrix4x4) {
    if (matrix) {
      this.set_from_object(matrix);
    } else {
      this.set_identity();
    }
  }

  /**
   * Set matrix components from object
   * @param {Object} obj - Object with each component of the matrix, all components must be present.
   * @public
   */
  set_from_object(obj: Matrix4x4 | IMatrix4x4) {
    this.xx = obj.xx;
    this.xy = obj.xy;
    this.xz = obj.xz;
    this.xw = obj.xw;
    this.yx = obj.yx;
    this.yy = obj.yy;
    this.yz = obj.yz;
    this.yw = obj.yw;
    this.zx = obj.zx;
    this.zy = obj.zy;
    this.zz = obj.zz;
    this.zw = obj.zw;
    this.wx = obj.wx;
    this.wy = obj.wy;
    this.wz = obj.wz;
    this.ww = obj.ww;
  }

  // A vector {x,y,z,w=1}
  apply4(vec4: Vec4): Vec4 {
    return {
      x: vec4.x * this.xx + vec4.y * this.xy + vec4.z * this.xz + vec4.w * this.xw,
      y: vec4.x * this.yx + vec4.y * this.yy + vec4.z * this.yz + vec4.w * this.yw,
      z: vec4.x * this.zx + vec4.y * this.zy + vec4.z * this.zz + vec4.w * this.zw,
      w: vec4.x * this.wx + vec4.y * this.wy + vec4.z * this.wz + vec4.w * this.ww
    };
  }

  apply3(vec3: Vec3): Vec3 {
    const vec4: Vec4 = { ...vec3, w: 1.0 };
    var result4 = this.apply4(vec4);
    // Divide by w: project result on the 4d sphere into 3d space.
    return { x: result4.x / result4.w, y: result4.y / result4.w, z: result4.z / result4.w };
  }

  /**
   * Set all matrix components to 0.
   * @public
   */
  clear() {
    this.xx = this.xy = this.xz = this.xw = this.yx = this.yy = this.yz = this.yw = this.zx = this.zy = this.zz = this.zw = this.wx = this.wy = this.wz = this.ww = 0;
  }

  /**
   * Set matrix to the identity matrix.
   * @public
   */
  set_identity(): Matrix4x4 {
    this.clear();
    this.xx = this.yy = this.zz = this.ww = 1;
    return this;
  }

  /**
   * Sets this matrix to a rotation matrix.
   * @param {Vec3} axis - The vector to rotate around.
   * @param {Number} angle - The angle to rotate in radians.
   * @public
   */
  set_rotation(axis: Vec3, angle: number): Matrix4x4 {
    this.set_identity();

    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var t = 1 - c;
    var X = axis.x;
    var Y = axis.y;
    var Z = axis.z;

    this.xx = t * X * X + c;
    this.xy = t * X * Y + s * Z;
    this.xz = t * X * Z - s * Y;

    this.yx = t * X * Y - s * Z;
    this.yy = t * Y * Y + c;
    this.yz = t * Y * Z + s * X;

    this.zx = t * X * Z + s * Y;
    this.zy = t * Y * Z - s * X;
    this.zz = t * Z * Z + c;

    return this;
  }

  /**
   * Sets this matrix to a rotation matrix.
   * @param {Number} x - Scaling factor in the x axis.
   * @param {Number} y - Scaling factor in the y axis.
   * @param {Number} z - Scaling factor in the z axis.
   * @public
   */
  set_scaling(x: number, y: number, z: number): Matrix4x4 {
    this.set_identity();

    this.xx = x;
    this.yy = y;
    this.zz = z;

    return this;
  }

  /**
   * Sets the translation elements of this matrix while leaving the
   * rest of the matrix untouched.
   * @param {Number} x - Translation amount in the x axis.
   * @param {Number} y - Translation amount in the y axis.
   * @param {Number} z - Translation amount in the z axis.
   */
  set_translation(x: number, y: number, z: number): Matrix4x4 {
    this.set_identity();

    // There was an error in the original implementation.
    //    See https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/geometry/geo-tran.html
    // This is fixed:
    this.xw = x;
    this.yw = y;
    this.zw = z;

    return this;
  }

  /**
   * Sets this matrix to the dot product between this matrix and the
   * matrix specified by rhs.
   * @param {Matrix4x4} matrix - The matrix on the right hand side of the dot product.
   */
  multiply(matrix: Matrix4x4): Matrix4x4 {
    var _mat = new Matrix4x4(this);

    this.xx = _mat.xx * matrix.xx + _mat.xy * matrix.yx + _mat.xz * matrix.zx + _mat.xw * matrix.wx;
    this.xy = _mat.xx * matrix.xy + _mat.xy * matrix.yy + _mat.xz * matrix.zy + _mat.xw * matrix.wy;
    this.xz = _mat.xx * matrix.xz + _mat.xy * matrix.yz + _mat.xz * matrix.zz + _mat.xw * matrix.wz;
    this.xw = _mat.xx * matrix.xw + _mat.xy * matrix.yw + _mat.xz * matrix.zw + _mat.xw * matrix.ww;

    this.yx = _mat.yx * matrix.xx + _mat.yy * matrix.yx + _mat.yz * matrix.zx + _mat.yw * matrix.wx;
    this.yy = _mat.yx * matrix.xy + _mat.yy * matrix.yy + _mat.yz * matrix.zy + _mat.yw * matrix.wy;
    this.yz = _mat.yx * matrix.xz + _mat.yy * matrix.yz + _mat.yz * matrix.zz + _mat.yw * matrix.wz;
    this.yw = _mat.yx * matrix.xw + _mat.yy * matrix.yw + _mat.yz * matrix.zw + _mat.yw * matrix.ww;

    this.zx = _mat.zx * matrix.xx + _mat.zy * matrix.yx + _mat.zz * matrix.zx + _mat.zw * matrix.wx;
    this.zy = _mat.zx * matrix.xy + _mat.zy * matrix.yy + _mat.zz * matrix.zy + _mat.zw * matrix.wy;
    this.zz = _mat.zx * matrix.xz + _mat.zy * matrix.yz + _mat.zz * matrix.zz + _mat.zw * matrix.wz;
    this.zw = _mat.zx * matrix.xw + _mat.zy * matrix.yw + _mat.zz * matrix.zw + _mat.zw * matrix.ww;

    this.wx = _mat.wx * matrix.xx + _mat.wy * matrix.yx + _mat.wz * matrix.zx + _mat.ww * matrix.wx;
    this.wy = _mat.wx * matrix.xy + _mat.wy * matrix.yy + _mat.wz * matrix.zy + _mat.ww * matrix.wy;
    this.wz = _mat.wx * matrix.xz + _mat.wy * matrix.yz + _mat.wz * matrix.zz + _mat.ww * matrix.wz;
    this.ww = _mat.wx * matrix.xw + _mat.wy * matrix.yw + _mat.wz * matrix.zw + _mat.ww * matrix.ww;

    return this;
  }

  /**
   * Returns a deep copy of this matrix.
   * @return {Matrix4x4} A deep copy of this matrix.
   */
  clone(): Matrix4x4 {
    return new Matrix4x4(this);
  }

  /**
   * Returns a pretty print string representation of the matrix.
   * @return {String} Pretty printed string of the matrix.
   */
  to_string(): string {
    return (
      "{\n" +
      '\t"xx": ' +
      this.xx +
      ', "xy": ' +
      this.xy +
      ', "xz": ' +
      this.xz +
      ', "xw": ' +
      this.xw +
      ",\n" +
      '\t"yx": ' +
      this.yx +
      ', "yy": ' +
      this.yy +
      ', "yz": ' +
      this.yz +
      ', "yw": ' +
      this.yw +
      ",\n" +
      '\t"zx": ' +
      this.zx +
      ', "zy": ' +
      this.zy +
      ', "zz": ' +
      this.zz +
      ', "zw": ' +
      this.zw +
      ",\n" +
      '\t"wx": ' +
      this.wx +
      ', "wy": ' +
      this.wy +
      ', "wz": ' +
      this.wz +
      ', "ww": ' +
      this.ww +
      "\n" +
      "}"
    );
  }
}
