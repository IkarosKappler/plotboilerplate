/**
 * A 2D datagrid interface for getting/storing data in some 2 dimensional array style types.
 *
 *  _|---- xIndex --->
 *  |       d[0][0], d[1][0], d[2][0], ..., d[xSegmentCount-1][0]
 *  yIndex
 *  |       d[0][1], d[1][1], d[2][1], ..., d[xSegmentCount-1][1]
 *  |
 *  v       ...
 *
 *          d[0][ySegmentCount-1], ..., ..., d[xSegmentCount-1][ySegmentCount-1]
 *
 *
 * @date    2023-11-04
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
export type DataGridFace4<T> = [[T | null, T | null], [T | null, T | null]];
export interface IDataGrid2d<T> {
    readonly xSegmentCount: number;
    readonly ySegmentCount: number;
    getMinDataValue(): T;
    getMaxDataValue(): T;
    getDataValueAt(xIndex: number, yIndex: number): T | null;
    /**
     * Extract a 2x2 matrix (a "face4") from the underlyting data.
     *
     * Imagine a face4 element like this
     *     (x,y)       (x+1,y)
     *          A-----B
     *          |     |
     *          |     |
     *          D-----C
     *   (x,y+1)        (x+1,y+1)
     *
     * then result in the buffer will be
     *   [ [A,B],
     *     [D,C] ]
     *
     * If any index is invalid then the resulting buffer element will be null.
     *
     * @param {number} xIndex - The x index in `0 <= xIndex < xSegmentCount`.
     * @param {number} yIndex - The y index in `0 <= yIndex < ySegmentCount`.
     * @param {[[T,T],[T,T]]} buffer - The result buffer for four elements.
     */
    getDataFace4At(xIndex: number, yIndex: number, buffer: DataGridFace4<T>): void;
}
