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
export declare class Matrix4x4 {
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
    constructor(matrix?: Matrix4x4);
    /**
     * Set matrix components from object
     * @param {Object} obj - Object with each component of the matrix, all components must be present.
     * @public
     */
    set_from_object(obj: Matrix4x4 | IMatrix4x4): void;
    apply4(vec4: Vec4): Vec4;
    apply3(vec3: Vec3): Vec3;
    /**
     * Set all matrix components to 0.
     * @public
     */
    clear(): void;
    /**
     * Set matrix to the identity matrix.
     * @public
     */
    set_identity(): Matrix4x4;
    /**
     * Sets this matrix to a rotation matrix.
     * @param {Vec3} axis - The vector to rotate around.
     * @param {Number} angle - The angle to rotate in radians.
     * @public
     */
    set_rotation(axis: Vec3, angle: number): Matrix4x4;
    /**
     * Sets this matrix to a rotation matrix.
     * @param {Number} x - Scaling factor in the x axis.
     * @param {Number} y - Scaling factor in the y axis.
     * @param {Number} z - Scaling factor in the z axis.
     * @public
     */
    set_scaling(x: number, y: number, z: number): Matrix4x4;
    /**
     * Sets the translation elements of this matrix while leaving the
     * rest of the matrix untouched.
     * @param {Number} x - Translation amount in the x axis.
     * @param {Number} y - Translation amount in the y axis.
     * @param {Number} z - Translation amount in the z axis.
     */
    set_translation(x: number, y: number, z: number): Matrix4x4;
    /**
     * Sets this matrix to the dot product between this matrix and the
     * matrix specified by rhs.
     * @param {Matrix4x4} matrix - The matrix on the right hand side of the dot product.
     */
    multiply(matrix: Matrix4x4): Matrix4x4;
    /**
     * Returns a deep copy of this matrix.
     * @return {Matrix4x4} A deep copy of this matrix.
     */
    clone(): Matrix4x4;
    /**
     * Returns a pretty print string representation of the matrix.
     * @return {String} Pretty printed string of the matrix.
     */
    to_string(): string;
}
export {};
