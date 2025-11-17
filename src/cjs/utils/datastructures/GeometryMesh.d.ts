/**
 * Adapted from the 3D geometry datastuctured from demo-33 (depth mesh).
 *
 * Refactored the strucure into a class.
 *
 * @author   Ikaros Kappler
 * @date     2025-11-14
 * @modified 2025-11-17 Moved `getBounds` and `normalizeGeometry` from helper functions to this class.
 * @version  1.0.0
 */
export type Vertex2 = {
    x: number;
    y: number;
};
export type Vertex3 = {
    x: number;
    y: number;
    z: number;
};
export declare class GeometryMesh<T extends Vertex2 | Vertex3> {
    /**
     * A set (array) of vertices (points) used in this mesh. Can be 2d or 3d.
     *
     * @member {Array<T>}
     * @memberof GeometryMesh
     * @type {Array<T>}
     * @instance
     */
    vertices: Array<T>;
    /**
     * A set (array) of edges used in this mesh.
     * Each edge consist of two indices indicating the vertex position.
     *
     * @member {Array<T>}
     * @memberof GeometryMesh
     * @type {Array<T>}
     * @instance
     */
    edges: Array<[number, number]>;
    constructor(vertices?: Array<T>, edges?: Array<[number, number]>);
    normalize(): void;
    getGeometryBounds(): {
        min: Vertex3;
        max: Vertex3;
        width: number;
        height: number;
        depth: number;
    };
}
