/**
 * Refactored all Voronoi helper functions for drawing the diagram (demo 07) into this class.
 *
 * @author   Ikaros Kappler
 * @date     2026-09-13
 * @modified 2026-09-15 Ported to Typescript.
 * @version  1.0.1
 */
import { Triangle } from "../../Triangle";
import { PointSet } from "../datastructures/PointSet";
import { VoronoiCell } from "../datastructures/VoronoiCell";
export interface IVoronoiConfig {
    makeVoronoiDiagram: boolean;
    drawPoints: boolean;
    drawTriangles: boolean;
    drawCircumCircles: boolean;
    drawCubicCurves: boolean;
    fillVoronoiCells: boolean;
    voronoiOutlineColor: string;
    voronoiCellColor: string;
    voronoiCubicThreshold: number;
    voronoiCellScale: number;
    clipVoronoiCells: boolean;
    drawClipBox: boolean;
    drawUnclippedVoronoiCells: boolean;
    drawVoronoiIncircles: boolean;
    drawVoronoiOutlines: boolean;
    pointCount: number;
    horizontalSafeArea: number;
    verticalSafeArea: number;
}
export interface IVoronoiContext {
    pointSet: PointSet;
    triangles: Array<Triangle>;
    voronoiCells: Array<VoronoiCell>;
    config: IVoronoiConfig;
}
export declare class VoronoiRenderer {
    voronoiContext: IVoronoiContext;
    constructor(voronoiContext: any);
    /**
     * Draw the given triangle with the specified (CSS-) color.
     *
     * @name draw
     * @instance
     * @memberof VoronoiRenderer
     * @param {DrawLib} draw
     * @param {Triangle} t
     * @param {string} color
     * @return {void}
     */
    draw(draw: any, fill: any): void;
    private _drawCell;
    /**
     * A function for drawing the triangles.
     *
     * @static
     */
    drawTriangles(draw: any): void;
    /**
     * Draw the given triangle with the specified (CSS-) color.
     *
     * @static
     * @name drawTriangle
     * @memberof VoronoiRenderer
     * @param {DrawLib} draw
     * @param {Triangle} t
     * @param {string} color
     * @return {void}
     */
    static drawTriangle(draw: any, t: any, color: any): void;
    /**
     * Draw the circumcircles of all triangles.
     */
    static drawCircumCircles(draw: any, triangles: any): void;
}
