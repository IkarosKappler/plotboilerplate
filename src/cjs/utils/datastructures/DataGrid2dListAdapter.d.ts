/**
 * A DataGrid2d implementation on a linear array of triplets/Vector3.
 *
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @modified 2023-11-04 Converted to a Typescript class.
 * @version  1.0.0
 **/
import { DataGridFace4, IDataGrid2d } from "./DataGrid2d";
declare type Triplet<T> = {
    x: T;
    y: any;
    T: any;
    z: T;
};
declare type RasterPosition = {
    xIndex: number;
    yIndex: number;
    xRel?: number;
    yRel?: number;
};
export declare class DataGrid2dListAdapter<T> implements IDataGrid2d<T> {
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
    private _dataList;
    /**
     * Create a new DataGrid2d from the given
     * @throws Error if xSegmentCount*ySegmentCount is larger than the capacity of the array/list.
     * @param list
     * @param xSegmentCount
     * @param ySegmentCount
     */
    constructor(list: Array<Triplet<T>>, xSegmentCount: number, ySegmentCount: number, minDataValue: T, maxDataValue: T, minXValue: T, maxXValue: T, minYValue: T, maxYValue: T);
    getIndicesFromBufferIndex(bufferIndex: number): RasterPosition;
    getCoordsFromBufferIndex(bufferIndex: number): RasterPosition;
    coordinateIndicesToBufferIndex(xIndex: number, yIndex: number): number;
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
}
export {};
