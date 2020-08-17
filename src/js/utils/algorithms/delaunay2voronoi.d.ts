/**
 * Create the voronoi diagram from the given delaunay triangulation (they are dual graphs).
 *
 * @requires VoronoiCell, Triangle
 *
 * @author   Ikaros Kappler
 * @date     2018-04-07
 * @modified 2018-04-11 Using VoronoiCells now (was array before).
 * @modified 2020-08-15 Ported from vanilla JS to TypeScript.
 * @version  1.0.2
 **/
import { Triangle } from "../../Triangle";
import { Vertex } from "../../Vertex";
import { VoronoiCell } from "../datastructures/VoronoiCell";
export declare class delaunay2voronoi {
    failedTriangleSets: Array<Triangle>;
    hasErrors: boolean;
    private pointList;
    private triangles;
    constructor(pointList: Array<Vertex>, triangles: Array<Triangle>);
    build(): Array<VoronoiCell>;
    private subsetToPath;
}
