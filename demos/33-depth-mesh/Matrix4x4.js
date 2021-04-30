// Class found at
//    https://www.migenius.com/articles/3d-transformations-part1-matrices
// by Paul Arden

/**
 * This file defines the Matrix4x4 class.
 *
 * [ xx xy yz xw
 *   yx yy yz yw
 *   zx zy zz zw
 *   wx wy wz ww ]
 *
 * @file Matrix4x4.js
 */

/**
 * Generic class for representing 4x4 matrices.
 * @constructor
 * @param {Object} matrix - An object with the initial values for the Matrix4x4.
 * Can be either an Object or Matrix4x4.
 */
var Matrix4x4 = function (matrix) {
  if (matrix) {
    this.set_from_object(matrix);
  } else {
    this.set_identity();
  }
};

/**
 * xx component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.xx;

/**
 * xy component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.xy;

/**
 * xz component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.xz;

/**
 * xw component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.xw;

/**
 * yx component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.yx;

/**
 * yy component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.yy;

/**
 * yz component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.yz;

/**
 * yw component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.yw;

/**
 * zx component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.zx;

/**
 * zy component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.zy;

/**
 * zz component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.zz;

/**
 * zw component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.zw;

/**
 * wx component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.wx;

/**
 * wy component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.wy;

/**
 * wz component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.wz;

/**
 * ww component of the matrix.
 * @type {Number}
 * @public
 */
Matrix4x4.prototype.ww;

/**
 * xx component of the matrix.
 * @type {Number}
 * @public
 */

/**
 * Set matrix components from object
 * @param {Object} obj - Object with each component of the matrix, all components must be present.
 * @public
 */
Matrix4x4.prototype.set_from_object = function (obj) {
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
};

// A vector {x,y,z,w=1}
Matrix4x4.prototype._apply4 = function (vec4) {
  //     Vector transform (Vector v, Matrix m)
  // {
  //     Vector result;
  //     for ( int i = 0; i < 4; ++i )
  //        result[i] = v[0] * m[0][i] + v[1] * m[1][i] + v[2] + m[2][i] + v[3] * m[3][i];
  //     result[0] = result[0]/result[3];
  //     result[1] = result[1]/result[3];
  //     result[2] = result[2]/result[3];
  //     return result;
  // }

  //   return [
  //     vec4[0] * this.xx + vec4[1] * this.xy + vec4[2] * this.xz + vec4[3] * this.xw,
  //     vec4[0] * this.yx + vec4[1] * this.yy + vec4[2] * this.yz + vec4[3] * this.yw,
  //     vec4[0] * this.zx + vec4[1] * this.zy + vec4[2] * this.zz + vec4[3] * this.zw,
  //     vec4[0] * this.wx + vec4[1] * this.wy + vec4[2] * this.wz + vec4[3] * this.ww
  //   ];
  return [
    vec4.x * this.xx + vec4.y * this.xy + vec4.z * this.xz + vec4.w * this.xw,
    vec4.x * this.yx + vec4.y * this.yy + vec4.z * this.yz + vec4.w * this.yw,
    vec4.x * this.zx + vec4.y * this.zy + vec4.z * this.zz + vec4.w * this.zw,
    vec4.x * this.wx + vec4.y * this.wy + vec4.z * this.wz + vec4.w * this.ww
  ];
};

Matrix4x4.prototype.apply3 = function (vec3) {
  vec3.w = 1.0;
  var result4 = this._apply4(vec3);
  // Divide by w
  return { x: result4.x / result4.w, y: result4.y / result4.w, z: result4.z / result4.w };
};

/**
 * Set all matrix components to 0.
 * @public
 */
Matrix4x4.prototype.clear = function () {
  this.xx = this.xy = this.xz = this.xw = this.yx = this.yy = this.yz = this.yw = this.zx = this.zy = this.zz = this.zw = this.wx = this.wy = this.wz = this.ww = 0;
};

/**
 * Set matrix to the identity matrix.
 * @public
 */
Matrix4x4.prototype.set_identity = function () {
  this.clear();
  this.xx = this.yy = this.zz = this.ww = 1;
};

/**
 * Sets this matrix to a rotation matrix.
 * @param {Number} axis - The vector to rotate around.
 * @param {Number} angle - The angle to rotate in radians.
 * @public
 */
Matrix4x4.prototype.set_rotation = function (axis, angle) {
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
};

/**
 * Sets this matrix to a rotation matrix.
 * @param {Number} x - Scaling factor in the x axis.
 * @param {Number} y - Scaling factor in the y axis.
 * @param {Number} z - Scaling factor in the z axis.
 * @public
 */
Matrix4x4.prototype.set_scaling = function (x, y, z) {
  this.set_identity();

  this.xx = x;
  this.yy = y;
  this.zz = z;
};

/**
 * Sets the translation elements of this matrix while leaving the
 * rest of the matrix untouched.
 * @param {Number} x - Translation amount in the x axis.
 * @param {Number} y - Translation amount in the y axis.
 * @param {Number} z - Translation amount in the z axis.
 */
Matrix4x4.prototype.set_translation_elements = function (x, y, z) {
  this.wx = x;
  this.wy = y;
  this.wz = z;
};

/**
 * Sets this matrix to the dot product between this matrix and the
 * matrix specified by rhs.
 * @param {Matrix4x4} matrix - The matrix on the right hand side of the dot product.
 */
Matrix4x4.prototype.multiply = function (matrix) {
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
};

/**
 * Returns a deep copy of this matrix.
 * @return {Matrix4x4} A deep copy of this matrix.
 */
Matrix4x4.prototype.clone = function () {
  return new Matrix4x4(this);
};

/**
 * Returns a pretty print string representation of the matrix.
 * @return {String} Pretty printed string of the matrix.
 */
Matrix4x4.prototype.to_string = function () {
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
};

// module.exports = Matrix4x4;
