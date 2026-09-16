/**
 * A mutable point set datastructure for holding a finite but variable set of vertices.
 *
 * @date    2026-09-12
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
import PlotBoilerplate from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";
export declare class PointSet {
    private readonly pb;
    points: Array<Vertex>;
    readonly dragListeners: Array<Function>;
    constructor(pb: PlotBoilerplate);
    private fireDragEvent;
    /**
     * Adds a random point to the point list.
     *
     * @name addRandomPoint
     * @instance
     * @override
     * @memberof PointSet
     * @return {void}
     */
    addRandomPoint(horizontalSafeArea?: number, verticalSafeArea?: number): void;
    /**
     * Adds the given point/vertex to the point list.
     *
     * @name addVertex
     * @instance
     * @override
     * @memberof PointSet
     * @param {Vertex} vert - The vertex to add.
     * @return {void}
     */
    addVertex(vert: Vertex): void;
    /**
     * Remove all vertices from this set and from the plotboilerplate instance.
     *
     * @name clear
     * @instance
     * @override
     * @memberof PointSet
     * @return {void}
     */
    clear(): void;
    /**
     * Add or remove n random points; depends on the config settings.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    randomPoints(pointCount: number, horizontalSafeArea?: number, verticalSafeArea?: number): void;
    /**
     * Add random points and be sure they cover the whole viewport.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    randomFullCover(pointCount: number): void;
    /**
     * Call when the desired number of points changes.
     **/
    updatePointCount(newPointCount: number, horizontalSafeArea?: number, verticalSafeArea?: number): void;
}
