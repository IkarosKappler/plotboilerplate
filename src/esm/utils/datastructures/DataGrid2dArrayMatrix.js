/**
 * A DataGrid2d implementation on 2 dimensional arrays.
 *
 * @author   Ikaros Kappler
 * @date     2025-10-16
 * @version  1.0.0
 **/
import { arrayFill } from "../algorithms/arrayFill";
export class DataGrid2dArrayMatrix {
    /**
     * Create a new DataGrid2d from the given
     * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
     * @param list
     * @param xSegmentCount
     * @param ySegmentCount
     */
    constructor(xSegmentCount, ySegmentCount, initialValue) {
        if (xSegmentCount <= 0) {
            throw `Cannot create DataGrid2dArray, xSegmentCount (${xSegmentCount}) must be > 0.`;
        }
        if (ySegmentCount <= 0) {
            throw `Cannot create DataGrid2dArray, ySegmentCount (${xSegmentCount}) must be > 0.`;
        }
        // this.canvas = document.getElementById(canvasId);
        this.xSegmentCount = xSegmentCount;
        this.ySegmentCount = ySegmentCount;
        this._matrix = [];
        for (var i = 0; i < ySegmentCount; i++) {
            this._matrix.push(arrayFill(xSegmentCount, initialValue));
        }
    }
    set(xIndex, yIndex, value) {
        this._matrix[yIndex][xIndex] = value;
    }
    get(xIndex, yIndex) {
        return this.getDataValueAt(xIndex, yIndex);
    }
    find(condition) {
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
    }
    /**
     * @override
     */
    getMinDataValue() {
        return this.minDataValue;
    }
    /**
     * @override
     */
    getMaxDataValue() {
        return this.maxDataValue;
    }
    /**
     * @override
     */
    getDataValueAt(xIndex, yIndex, isDebug) {
        return this._matrix[yIndex][xIndex];
    }
    /**
     * @override
     */
    getDataFace4At(xIndex, yIndex, buffer) {
        // buffer: array[2][2]
        buffer[0][0] = this.getDataValueAt(xIndex, yIndex);
        buffer[1][0] = this.getDataValueAt(xIndex + 1, yIndex);
        buffer[1][1] = this.getDataValueAt(xIndex + 1, yIndex + 1);
        buffer[0][1] = this.getDataValueAt(xIndex, yIndex + 1);
    }
}
//# sourceMappingURL=DataGrid2dArrayMatrix.js.map