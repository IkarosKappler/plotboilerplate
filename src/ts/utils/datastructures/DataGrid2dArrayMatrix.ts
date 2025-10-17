/**
 * A DataGrid2d implementation on 2 dimensional arrays.
 *
 * @author   Ikaros Kappler
 * @date     2025-10-16
 * @version  1.0.0
 **/

import { arrayFill } from "../algorithms/arrayFill";
import { DataGridFace4, IDataGrid2d, RasterPosition } from "./DataGrid2d";

export class DataGrid2dArrayMatrix<T> implements IDataGrid2d<T> {
  /**
   * @override
   */
  readonly xSegmentCount: number;

  /**
   * @override
   */
  readonly ySegmentCount: number;

  // This is not really useful here ...
  minDataValue: T;
  maxDataValue: T;

  private _matrix: Array<Array<T>>;

  /**
   * Create a new DataGrid2d from the given
   * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
   * @param list
   * @param xSegmentCount
   * @param ySegmentCount
   */
  constructor(xSegmentCount: number, ySegmentCount: number, initialValue: T) {
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

  public set(xIndex: number, yIndex: number, value: T) {
    this._matrix[yIndex][xIndex] = value;
  }

  public get(xIndex: number, yIndex: number): T {
    return this.getDataValueAt(xIndex, yIndex);
  }

  public find(
    condition: (value: T, xIndex: number, yIndex: number, sourceMatrix: DataGrid2dArrayMatrix<T>) => boolean
  ): RasterPosition {
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
    return this._matrix[yIndex][xIndex];
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
