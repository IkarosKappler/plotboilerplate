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
    addRandomPoint(): void;
    addVertex(vert: Vertex): void;
    /**
     * Add or remove n random points; depends on the config settings.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    randomPoints(pointCount: number, clear: boolean, fullCover: boolean): void;
    private randomInt;
}
