"use strict";
/**
 * A DataGrid2d implementation on 2 dimensional arrays.
 *
 * @author   Ikaros Kappler
 * @date     2025-10-16
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
            throw "Cannot create DataGrid2dArray, ySegmentCount (".concat(xSegmentCount, ") must be > 0.");
        }
        // this.canvas = document.getElementById(canvasId);
        this.xSegmentCount = xSegmentCount;
        this.ySegmentCount = ySegmentCount;
        this._matrix = [];
        for (var i = 0; i < ySegmentCount; i++) {
            this._matrix.push((0, arrayFill_1.arrayFill)(xSegmentCount, initialValue));
        }
    }
    DataGrid2dArrayMatrix.prototype.set = function (xIndex, yIndex, value) {
        this._matrix[yIndex][xIndex] = value;
    };
    DataGrid2dArrayMatrix.prototype.get = function (xIndex, yIndex) {
        return this.getDataValueAt(xIndex, yIndex);
    };
    DataGrid2dArrayMatrix.prototype.find = function (condition) {
        for (var x = 0; x < this.xSegmentCount; x++) {
            for (var y = 0; y < this.ySegmentCount; y++) {
                if (condition(this.get(x, y), x, y)) {
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
    return DataGrid2dArrayMatrix;
}());
exports.DataGrid2dArrayMatrix = DataGrid2dArrayMatrix;
//# sourceMappingURL=DataGrid2dArrayMatrix.js.map