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
     * @param {Object} mat - Object with each component of the matrix, all components must be present.
     * @public
     */
    setFromObject(mat: Matrix4x4 | IMatrix4x4): void;
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
    setIdentity(): Matrix4x4;
    /**
     * Sets this matrix to a rotation matrix.
     * @param {Vec3} axis - The vector to rotate around.
     * @param {Number} angle - The angle to rotate in radians.
     * @public
     */
    setRotation(axis: Vec3, angle: number): Matrix4x4;
    /**
     * Sets this matrix to a rotation matrix.
     * @param {Number} x - Scaling factor in the x axis.
     * @param {Number} y - Scaling factor in the y axis.
     * @param {Number} z - Scaling factor in the z axis.
     * @public
     */
    setScaling(x: number, y: number, z: number): Matrix4x4;
    /**
     * Sets the translation elements of this matrix while leaving the
     * rest of the matrix untouched.
     * @param {Number} x - Translation amount in the x axis.
     * @param {Number} y - Translation amount in the y axis.
     * @param {Number} z - Translation amount in the z axis.
     */
    setTranslation(x: number, y: number, z: number): Matrix4x4;
    /**
     * Sets this matrix to the dot product between this matrix and the
     * matrix specified by rhs.
     * @param {Matrix4x4} matrix - The matrix on the right hand side of the dot product.
     */
    multiply(matrix: Matrix4x4): Matrix4x4;
    /**
     * Create the rotation matrix from the given axis and angle.
     *
     * @param {Vec3} axis - The axis to rotate around.
     * @param {number} angle - The angle to use for rotation (in radians).
     * @returns Matrix4x4
     */
    static makeRotationMatrix(axis: Vec3, angle: number): Matrix4x4;
    /**
     * Create the scaling matrix from the given x-, y- and z- scaling factors (use 1.0 for no scaling).
     *
     * @param {number} scaleX - The x scaling factor.
     * @param {number} scaleY - The y scaling factor.
     * @param {number} scaleZ - The z scaling factor.
     * @returns Matrix4x4
     */
    static makeScalingMatrix(scaleX: number, scaleY: number, scaleZ: number): Matrix4x4;
    /**
     * Create the translation matrix from the given x-, y- and z- translation amounts (use 0.0 for no translation).
     *
     * @param {number} translateX - The x translation amount.
     * @param {number} translateY - The y translation amount.
     * @param {number} translateZ - The z translation amount.
     * @returns Matrix4x4
     */
    static makeTranslationMatrix(translateX: number, translateY: number, translateZ: number): Matrix4x4;
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
    static makeTransformationMatrix(rotateX: number, rotateY: number, rotateZ: number, scaleX: number, scaleY: number, scaleZ: number, translateX: number, translateY: number, translateZ: number): Matrix4x4;
    /**
     * Returns a deep copy of this matrix.
     * @return {Matrix4x4} A deep copy of this matrix.
     */
    clone(): Matrix4x4;
    /**
     * Returns a pretty print string representation of the matrix.
     * @return {String} Pretty printed string of the matrix.
     */
    toJSON(): string;
}
export {};
