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

  /**
   * A helper method to convert a boolean matrix to a parsable string.
   *
   * @param {DataGrid2dArrayMatrix<boolean>} matrix
   * @returns {string}
   */
  static toString(matrix: DataGrid2dArrayMatrix<boolean>): string {
    const buffer: Array<string> = [];
    for (var y = 0; y < matrix.ySegmentCount; y++) {
      for (var x = 0; x < matrix.ySegmentCount; x++) {
        buffer.push(matrix.get(x, y) ? "X" : ".");
      }
      buffer.push("\n");
    }
    return buffer.join("");
  }

  /**
   * Simple way to parse a data matrix from a string. `false` should be coded as '.' character,
   * `true` must be coded as 'X' character.
   *
   * @param {string} str - The input string.
   * @param {number} width - The desired width of the matrix (xSegmentCount).
   * @param {number} height - The desired height of the matrix (ySegmentCount).
   * @returns {DataGrid2dArrayMatrix<boolean>}
   */
  static parseBooleanMatrix(str: string, width: number, height: number): DataGrid2dArrayMatrix<boolean> {
    const matrix = new DataGrid2dArrayMatrix<boolean>(width, height, false);
    const lines: String[] = str.trim().split("\n");
    for (var y = 0; y < lines.length && y < height; y++) {
      lines[y] = lines[y].trim();
      for (var x = 0; x < lines[y].length && x < width; x++) {
        if (y < height && x < width && lines[y].charAt(x) === "X") {
          matrix.set(x, y, true);
        }
      }
    }
    return matrix;
  }
}
