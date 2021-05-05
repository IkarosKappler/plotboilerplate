"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix4x4 = void 0;
var Matrix4x4 = /** @class */ (function () {
    /**
     * Generic class for representing 4x4 matrices.
     * @constructor
     * @param {Object} matrix - An object with the initial values for the Matrix4x4.
     * Can be either an Object or Matrix4x4.
     */
    function Matrix4x4(matrix) {
        if (matrix) {
            this.setFromObject(matrix);
        }
        else {
            this.setIdentity();
        }
    }
    /**
     * Set matrix components from object
     * @param {Object} mat - Object with each component of the matrix, all components must be present.
     * @public
     */
    Matrix4x4.prototype.setFromObject = function (mat) {
        this.xx = mat.xx;
        this.xy = mat.xy;
        this.xz = mat.xz;
        this.xw = mat.xw;
        this.yx = mat.yx;
        this.yy = mat.yy;
        this.yz = mat.yz;
        this.yw = mat.yw;
        this.zx = mat.zx;
        this.zy = mat.zy;
        this.zz = mat.zz;
        this.zw = mat.zw;
        this.wx = mat.wx;
        this.wy = mat.wy;
        this.wz = mat.wz;
        this.ww = mat.ww;
    };
    // A vector {x,y,z,w=1}
    Matrix4x4.prototype.apply4 = function (vec4) {
        return {
            x: vec4.x * this.xx + vec4.y * this.xy + vec4.z * this.xz + vec4.w * this.xw,
            y: vec4.x * this.yx + vec4.y * this.yy + vec4.z * this.yz + vec4.w * this.yw,
            z: vec4.x * this.zx + vec4.y * this.zy + vec4.z * this.zz + vec4.w * this.zw,
            w: vec4.x * this.wx + vec4.y * this.wy + vec4.z * this.wz + vec4.w * this.ww
        };
    };
    Matrix4x4.prototype.apply3 = function (vec3) {
        var vec4 = __assign(__assign({}, vec3), { w: 1.0 });
        var result4 = this.apply4(vec4);
        // Divide by w: project result on the 4d sphere into 3d space.
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
    Matrix4x4.prototype.setIdentity = function () {
        this.clear();
        this.xx = this.yy = this.zz = this.ww = 1;
        return this;
    };
    /**
     * Sets this matrix to a rotation matrix.
     * @param {Vec3} axis - The vector to rotate around.
     * @param {Number} angle - The angle to rotate in radians.
     * @public
     */
    Matrix4x4.prototype.setRotation = function (axis, angle) {
        this.setIdentity();
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
    };
    /**
     * Sets this matrix to a rotation matrix.
     * @param {Number} x - Scaling factor in the x axis.
     * @param {Number} y - Scaling factor in the y axis.
     * @param {Number} z - Scaling factor in the z axis.
     * @public
     */
    Matrix4x4.prototype.setScaling = function (x, y, z) {
        this.setIdentity();
        this.xx = x;
        this.yy = y;
        this.zz = z;
        return this;
    };
    /**
     * Sets the translation elements of this matrix while leaving the
     * rest of the matrix untouched.
     * @param {Number} x - Translation amount in the x axis.
     * @param {Number} y - Translation amount in the y axis.
     * @param {Number} z - Translation amount in the z axis.
     */
    Matrix4x4.prototype.setTranslation = function (x, y, z) {
        this.setIdentity();
        // There was an error in the original implementation.
        //    See https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/geometry/geo-tran.html
        // This is fixed:
        this.xw = x;
        this.yw = y;
        this.zw = z;
        return this;
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
        return this;
    };
    /**
     * Create the rotation matrix from the given axis and angle.
     *
     * @param {Vec3} axis - The axis to rotate around.
     * @param {number} angle - The angle to use for rotation (in radians).
     * @returns Matrix4x4
     */
    Matrix4x4.makeRotationMatrix = function (axis, angle) {
        return new Matrix4x4().setRotation(axis, angle);
    };
    /**
     * Create the scaling matrix from the given x-, y- and z- scaling factors (use 1.0 for no scaling).
     *
     * @param {number} scaleX - The x scaling factor.
     * @param {number} scaleY - The y scaling factor.
     * @param {number} scaleZ - The z scaling factor.
     * @returns Matrix4x4
     */
    Matrix4x4.makeScalingMatrix = function (scaleX, scaleY, scaleZ) {
        return new Matrix4x4().setScaling(scaleX, scaleY, scaleZ);
    };
    /**
     * Create the translation matrix from the given x-, y- and z- translation amounts (use 0.0 for no translation).
     *
     * @param {number} translateX - The x translation amount.
     * @param {number} translateY - The y translation amount.
     * @param {number} translateZ - The z translation amount.
     * @returns Matrix4x4
     */
    Matrix4x4.makeTranslationMatrix = function (translateX, translateY, translateZ) {
        return new Matrix4x4().setTranslation(translateX, translateY, translateZ);
    };
    /**
     * Create a full transform matrix from the rotation, scaling and translation params.
     *
     * @param {number} rotateX - The rotation angle around the x axis.
     * @param {number} rotateY - The rotation angle around the y axis.
     * @param {number} rotateZ - The rotation angle around the z axis.
     * @param {number} scaleX - The x scaling factor.
     * @param {number} scaleY - The y scaling factor.
     * @param {number} scaleZ - The z scaling factor.
     * @param {number} translateX - The x translation amount.
     * @param {number} translateY - The y translation amount.
     * @param {number} translateZ - The z translation amount.
     * @returns Matrix4x4
     */
    Matrix4x4.makeTransformationMatrix = function (rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ) {
        var matrixRx = new Matrix4x4().setRotation({ x: 1, y: 0, z: 0 }, rotateX);
        var matrixRy = new Matrix4x4().setRotation({ x: 0, y: 1, z: 0 }, rotateY);
        var matrixRz = new Matrix4x4().setRotation({ x: 0, y: 0, z: 1 }, rotateZ);
        var matrixS = new Matrix4x4().setScaling(scaleX, scaleY, scaleZ);
        var matrixT0 = new Matrix4x4().setTranslation(translateX, translateY, translateZ);
        var transformMatrix = new Matrix4x4()
            .multiply(matrixRx)
            .multiply(matrixRy)
            .multiply(matrixRz)
            .multiply(matrixS)
            .multiply(matrixT0);
        return transformMatrix;
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
    Matrix4x4.prototype.toJSON = function () {
        // prettier-ignore
        return ("{\n" +
            '\t"xx": ' + this.xx + ', "xy": ' + this.xy + ', "xz": ' + this.xz + ', "xw": ' + this.xw + ",\n" +
            '\t"yx": ' + this.yx + ', "yy": ' + this.yy + ', "yz": ' + this.yz + ', "yw": ' + this.yw + ",\n" +
            '\t"zx": ' + this.zx + ', "zy": ' + this.zy + ', "zz": ' + this.zz + ', "zw": ' + this.zw + ",\n" +
            '\t"wx": ' + this.wx + ', "wy": ' + this.wy + ', "wz": ' + this.wz + ', "ww": ' + this.ww + "\n" +
            "}");
    };
    return Matrix4x4;
}());
exports.Matrix4x4 = Matrix4x4;
//# sourceMappingURL=Matrix4x4.js.map