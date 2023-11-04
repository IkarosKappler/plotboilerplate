"use strict";
/**
 * A DataGrid2d implementation on a linear array of triplets/Vector3.
 *
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @modified 2023-11-04 Converted to a Typescript class.
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGrid2dListAdapter = void 0;
var DataGrid2dListAdapter = /** @class */ (function () {
    /**
     * Create a new DataGrid2d from the given
     * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
     * @param list
     * @param xSegmentCount
     * @param ySegmentCount
     */
    function DataGrid2dListAdapter(list, xSegmentCount, ySegmentCount
    // minDataValue?: T,
    // maxDataValue?: T,
    // minXValue?: T,
    // maxXValue?: T,
    // minYValue?: T,
    // maxYValue?: T
    ) {
        if (xSegmentCount * ySegmentCount > list.length) {
            throw "Cannot create DataGrid2dListAdapter, the list (length " + list.length + ") does not provide enough items for " + xSegmentCount + "x" + ySegmentCount + " required entries.";
        }
        // this.canvas = document.getElementById(canvasId);
        this.xSegmentCount = xSegmentCount;
        this.ySegmentCount = ySegmentCount;
        // this.minDataValue = minDataValue;
        // this.maxDataValue = maxDataValue;
        // this.minXValue = minXValue;
        // this.maxXValue = maxXValue;
        // this.minYValue = minYValue;
        // this.maxYValue = maxYValue;
        this._dataList = list;
        // @private
        // this._minHeight = 0;
        // this._maxHeight = 0;
        // this._minX = 0;
        // this._maxX = 0;
        // this._minY = 0;
        // this._maxY = 0;
        // Private
        // this._planeGeometry = null;
    }
    DataGrid2dListAdapter.prototype.getIndicesFromBufferIndex = function (bufferIndex) {
        return { xIndex: Math.floor(bufferIndex % this.xSegmentCount), yIndex: Math.floor(bufferIndex / this.xSegmentCount) };
    };
    DataGrid2dListAdapter.prototype.getCoordsFromBufferIndex = function (bufferIndex) {
        var index = this.getIndicesFromBufferIndex(bufferIndex);
        // Note that the xSegmentCount and ySegmentCount counts plane squares, each consisting of four vertices
        index.xRel = index.xIndex / (this.xSegmentCount - 1);
        index.yRel = index.yIndex / (this.ySegmentCount - 1);
        return index;
    };
    DataGrid2dListAdapter.prototype.coordinateIndicesToBufferIndex = function (xIndex, yIndex) {
        return yIndex * this.xSegmentCount + xIndex;
    };
    /**
     * @override
     */
    DataGrid2dListAdapter.prototype.getMinDataValue = function () {
        return this.minDataValue;
    };
    /**
     * @override
     */
    DataGrid2dListAdapter.prototype.getMaxDataValue = function () {
        return this.maxDataValue;
    };
    /**
     * @override
     */
    DataGrid2dListAdapter.prototype.getDataValueAt = function (xIndex, yIndex, isDebug) {
        // var bufferIndex = yIndex * this.xSegmentCount + xIndex;
        var bufferIndex = this.coordinateIndicesToBufferIndex(xIndex, yIndex);
        if (isDebug) {
            console.log("xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
        }
        if (bufferIndex > this._dataList.length) {
            console.error("ERR buffer index is out of bounds! xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
        }
        if (!this._dataList[bufferIndex]) {
            console.error("ERR buffer element is null! xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
        }
        return this._dataList && bufferIndex < this._dataList.length ? this._dataList[bufferIndex].z : null;
    };
    /**
     * @override
     */
    DataGrid2dListAdapter.prototype.getDataFace4At = function (xIndex, yIndex, buffer) {
        // buffer: array[2][2]
        buffer[0][0] = this.getDataValueAt(xIndex, yIndex);
        buffer[1][0] = this.getDataValueAt(xIndex + 1, yIndex);
        buffer[1][1] = this.getDataValueAt(xIndex + 1, yIndex + 1);
        buffer[0][1] = this.getDataValueAt(xIndex, yIndex + 1);
    };
    return DataGrid2dListAdapter;
}());
exports.DataGrid2dListAdapter = DataGrid2dListAdapter;
//# sourceMappingURL=DataGrid2dListAdapter.js.map