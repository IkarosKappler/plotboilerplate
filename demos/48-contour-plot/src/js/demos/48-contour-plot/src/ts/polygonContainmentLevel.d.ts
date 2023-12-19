/**
 * Idea:
 * 1) Find all polygons on the 'lowest' level, that do not contain any others.
 * 2) Cross them out.
 *    They are on level 0.
 * 3) Then find those which contain these and only these.
 * 4) Cross those out, too.
 * 5) They are one level above.
 * 6) Continue recursively with step 3 until none are left. This is the upper level.
 *
 *
 * @author  Ikaros Kappler
 * @date    2023-11-24
 * @version 1.0.0
 */
import { Polygon } from "../../../../src/ts/Polygon";
interface PolygonContainmentTree {
    parentPolygon: PolygonContainmentTree | null;
    polygon: Polygon;
    polygonIndex: number;
    isVisited: boolean;
    childPolygons: Array<PolygonContainmentTree>;
}
export declare class PolygonContainmentLevel {
    private poylgonStatus;
    private unvisitedSet;
    private visitedCount;
    private containmentMatrix;
    constructor(polygons: Polygon[]);
    findContainmentTree(): PolygonContainmentTree[] | null;
    private buildContainmentMatrix;
    private processPolygonAt;
    private findMinContainigPoly;
    private findAnyContainigPoly;
    private containsPoly;
    private markVisited;
    private locateNonVisitedPolygon;
    toString(): string;
    toStringBuffer(buffer: string[]): void;
}
export {};
