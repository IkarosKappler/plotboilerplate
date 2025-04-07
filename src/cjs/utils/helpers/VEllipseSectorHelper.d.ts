/**
 * A helper for VEllipseSectors.
 *
 * @author   Ikaros Kappler
 * @date     2021-03-24
 * @modified 2025-04-02 Adding `VEllipseSectorHelper.drawHandleLines`.
 * @modified 2025-05-07 Modifying the calculation of `startAngle` and `endAngle` from the rotation control point: wrapping result into [0,TWO_PI).
 * @version  1.1.0
 */
import { VEllipseSector } from "../../VEllipseSector";
import { Vertex } from "../../Vertex";
import { DrawLib } from "../../interfaces";
export declare class VEllipseSectorHelper {
    private sector;
    private startAngleControlPoint;
    private endAngleControlPoint;
    private rotationControlPoint;
    constructor(sector: VEllipseSector, startAngleControlPoint: Vertex, endAngleControlPoint: Vertex, rotationControlPoint: Vertex);
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>): void;
}
