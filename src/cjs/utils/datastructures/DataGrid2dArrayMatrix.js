"use strict";
/**
 * A DataGrid2d implementation on 2 dimensional arrays.
 *
 * @author   Ikaros Kappler
 * @date     2025-10-16
 * @modified 2015-10-28 Added `DataGrid2dArrayMatrix.setAll(function)`.
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGrid2dArrayMatrix = void 0;
var arrayFill_1 = require("../algorithms/arrayFill");
var DataGrid2dArrayMatrix = /** @class */ (function () {
    /**
     * Create a new DataGrid2d from the given
     * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
     * @param list
     * @param xSegmentCount
     * @param ySegmentCount
     */
    function DataGrid2dArrayMatrix(xSegmentCount, ySegmentCount, initialValue) {
        if (xSegmentCount <= 0) {
            throw "Cannot create DataGrid2dArray, xSegmentCount (".concat(xSegmentCount, ") must be > 0.");
        }
        if (ySegmentCount <= 0) {
            throw "Cannot create DataGrid2dArray, ySegmentCount (".concat(ySegmentCount, ") must be > 0.");
        }
        // this.canvas = document.getElementById(canvasId);
        this.xSegmentCount = xSegmentCount;
        this.ySegmentCount = ySegmentCount;
        this._matrix = [];
        for (var i = 0; i < ySegmentCount; i++) {
            this._matrix.push((0, arrayFill_1.arrayFill)(xSegmentCount, initialValue));
        }
    }
    /**
     * Set the matrix value at the given (x,y) position to a new value.
     *
     * @param {number} xIndex - The horizontal matrix position to set.
     * @param {number} yIndex - The vertical matrix position to set.
     * @param {T} value - The new value.
     */
    DataGrid2dArrayMatrix.prototype.set = function (xIndex, yIndex, value) {
        this._matrix[yIndex][xIndex] = value;
    };
    /**
     * Getthe matrix value at the given (x,y) position.
     *
     * @param {number} xIndex - The horizontal matrix position to set.
     * @param {number} yIndex - The vertical matrix position to set.
     * @return {T} value - The new value.
     */
    DataGrid2dArrayMatrix.prototype.get = function (xIndex, yIndex) {
        return this.getDataValueAt(xIndex, yIndex);
    };
    /**
     * Set all matrix values. The passed factory function must accept respective (x,y) positions.
     *
     * @param {Function} factory - The factory function to determine the new values to set.
     * @return {DataGrid2dArrayMatrix<T>} this - for chaning.
     */
    DataGrid2dArrayMatrix.prototype.setAll = function (factory) {
        for (var x = 0; x < this.xSegmentCount; x++) {
            for (var y = 0; y < this.ySegmentCount; y++) {
                this.set(x, y, factory(x, y));
            }
        }
        return this;
    };
    DataGrid2dArrayMatrix.prototype.find = function (condition) {
        for (var x = 0; x < this.xSegmentCount; x++) {
            for (var y = 0; y < this.ySegmentCount; y++) {
                if (condition(this.get(x, y), x, y, this)) {
                    return {
                        xIndex: x,
                        yIndex: y,
                        xRel: x / this.xSegmentCount,
                        yRel: y / this.ySegmentCount
                    };
                }
            }
        }
        return null;
    };
    /**
     * @override
     */
    DataGrid2dArrayMatrix.prototype.getMinDataValue = function () {
        return this.minDataValue;
    };
    /**
     * @override
     */
    DataGrid2dArrayMatrix.prototype.getMaxDataValue = function () {
        return this.maxDataValue;
    };
    /**
     * @override
     */
    DataGrid2dArrayMatrix.prototype.getDataValueAt = function (xIndex, yIndex, isDebug) {
        return this._matrix[yIndex][xIndex];
    };
    /**
     * @override
     */
    DataGrid2dArrayMatrix.prototype.getDataFace4At = function (xIndex, yIndex, buffer) {
        // buffer: array[2][2]
        buffer[0][0] = this.getDataValueAt(xIndex, yIndex);
        buffer[1][0] = this.getDataValueAt(xIndex + 1, yIndex);
        buffer[1][1] = this.getDataValueAt(xIndex + 1, yIndex + 1);
        buffer[0][1] = this.getDataValueAt(xIndex, yIndex + 1);
    };
    /**
     * A helper method to convert a boolean matrix to a parsable string.
     *
     * @param {DataGrid2dArrayMatrix<boolean>} matrix
     * @returns {string}
     */
    DataGrid2dArrayMatrix.toString = function (matrix) {
        var buffer = [];
        for (var y = 0; y < matrix.ySegmentCount; y++) {
            for (var x = 0; x < matrix.xSegmentCount; x++) {
                buffer.push(matrix.get(x, y) ? "X" : ".");
            }
            buffer.push("\n");
        }
        return buffer.join("");
    };
    /**
     * Simple way to parse a data matrix from a string. `false` should be coded as '.' character,
     * `true` must be coded as 'X' character.
     *
     * @param {string} str - The input string.
     * @param {number} width - The desired width of the matrix (xSegmentCount).
     * @param {number} height - The desired height of the matrix (ySegmentCount).
     * @returns {DataGrid2dArrayMatrix<boolean>}
     */
    DataGrid2dArrayMatrix.parseBooleanMatrix = function (str, width, height) {
        var matrix = new DataGrid2dArrayMatrix(width, height, false);
        var lines = str.trim().split("\n");
        for (var y = 0; y < lines.length && y < height; y++) {
            lines[y] = lines[y].trim();
            for (var x = 0; x < lines[y].length && x < width; x++) {
                if (y < height && x < width && lines[y].charAt(x) === "X") {
                    matrix.set(x, y, true);
                }
            }
        }
        return matrix;
    };
    return DataGrid2dArrayMatrix;
}());
exports.DataGrid2dArrayMatrix = DataGrid2dArrayMatrix;
//# sourceMappingURL=DataGrid2dArrayMatrix.js.map