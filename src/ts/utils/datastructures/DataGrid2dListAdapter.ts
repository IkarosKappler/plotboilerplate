/**
 * A DataGrid2d implementation on a linear array of triplets/Vector3.
 *
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @modified 2023-11-04 Converted to a Typescript class.
 * @version  1.0.0
 **/

import { DataGridFace4, IDataGrid2d } from "./DataGrid2d";

type Triplet<T> = {
  x: T;
  y: T;
  z: T;
};

type RasterPosition = {
  xIndex: number;
  yIndex: number;
  xRel?: number;
  yRel?: number;
};

export class DataGrid2dListAdapter<T> implements IDataGrid2d<T> {
  /**
   * @override
   */
  readonly xSegmentCount: number;

  /**
   * @override
   */
  readonly ySegmentCount: number;

  minDataValue: T;
  maxDataValue: T;
  minXValue: T;
  maxXValue: T;
  minYValue: T;
  maxYValue: T;
  private _dataList: Array<Triplet<T>>;

  /**
   * Create a new DataGrid2d from the given
   * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
   * @param list
   * @param xSegmentCount
   * @param ySegmentCount
   */
  constructor(list: Array<Triplet<T>>, xSegmentCount: number, ySegmentCount: number) {
    if (xSegmentCount * ySegmentCount > list.length) {
      throw `Cannot create DataGrid2dListAdapter, the list (length ${list.length}) does not provide enough items for ${xSegmentCount}x${ySegmentCount} required entries.`;
    }

    // this.canvas = document.getElementById(canvasId);
    this.xSegmentCount = xSegmentCount;
    this.ySegmentCount = ySegmentCount;

    this._dataList = list;
  }

  getIndicesFromBufferIndex(bufferIndex: number): RasterPosition {
    return { xIndex: Math.floor(bufferIndex % this.xSegmentCount), yIndex: Math.floor(bufferIndex / this.xSegmentCount) };
  }

  getCoordsFromBufferIndex(bufferIndex: number): RasterPosition {
    var index = this.getIndicesFromBufferIndex(bufferIndex);
    // Note that the xSegmentCount and ySegmentCount counts plane squares, each consisting of four vertices
    index.xRel = index.xIndex / (this.xSegmentCount - 1);
    index.yRel = index.yIndex / (this.ySegmentCount - 1);
    return index;
  }

  coordinateIndicesToBufferIndex(xIndex: number, yIndex: number): number {
    return yIndex * this.xSegmentCount + xIndex;
  }

  /**
   * @override
   */
  getMinDataValue(): T {
    return this.minDataValue;
  }

  /**
   * @override
   */
  getMaxDataValue(): T {
    return this.maxDataValue;
  }

  /**
   * @override
   */
  getDataValueAt(xIndex: number, yIndex: number, isDebug?: boolean): T | null {
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
  }

  /**
   * @override
   */
  getDataFace4At(xIndex: number, yIndex: number, buffer: DataGridFace4<T>) {
    // buffer: array[2][2]
    buffer[0][0] = this.getDataValueAt(xIndex, yIndex);
    buffer[1][0] = this.getDataValueAt(xIndex + 1, yIndex);
    buffer[1][1] = this.getDataValueAt(xIndex + 1, yIndex + 1);
    buffer[0][1] = this.getDataValueAt(xIndex, yIndex + 1);
  }
}
