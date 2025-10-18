/**
 * A DataGrid2d implementation on 2 dimensional arrays.
 *
 * @author   Ikaros Kappler
 * @date     2025-10-16
 * @version  1.0.0
 **/
import { DataGridFace4, IDataGrid2d, RasterPosition } from "./DataGrid2d";
export declare class DataGrid2dArrayMatrix<T> implements IDataGrid2d<T> {
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
    private _matrix;
    /**
     * Create a new DataGrid2d from the given
     * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
     * @param list
     * @param xSegmentCount
     * @param ySegmentCount
     */
    constructor(xSegmentCount: number, ySegmentCount: number, initialValue: T);
    set(xIndex: number, yIndex: number, value: T): void;
    get(xIndex: number, yIndex: number): T;
    find(condition: (value: T, xIndex: number, yIndex: number, sourceMatrix: DataGrid2dArrayMatrix<T>) => boolean): RasterPosition;
    /**
     * @override
     */
    getMinDataValue(): T;
    /**
     * @override
     */
    getMaxDataValue(): T;
    /**
     * @override
     */
    getDataValueAt(xIndex: number, yIndex: number, isDebug?: boolean): T | null;
    /**
     * @override
     */
    getDataFace4At(xIndex: number, yIndex: number, buffer: DataGridFace4<T>): void;
    /**
     * A helper method to convert a boolean matrix to a parsable string.
     *
     * @param {DataGrid2dArrayMatrix<boolean>} matrix
     * @returns {string}
     */
    static toString(matrix: DataGrid2dArrayMatrix<boolean>): string;
    /**
     * Simple way to parse a data matrix from a string. `false` should be coded as '.' character,
     * `true` must be coded as 'X' character.
     *
     * @param {string} str - The input string.
     * @param {number} width - The desired width of the matrix (xSegmentCount).
     * @param {number} height - The desired height of the matrix (ySegmentCount).
     * @returns {DataGrid2dArrayMatrix<boolean>}
     */
    static parseBooleanMatrix(str: string, width: number, height: number): DataGrid2dArrayMatrix<boolean>;
}
