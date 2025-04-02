/**
 * A helper for VEllipses.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-31
 * @modified 2025-04-02 Adding `VEllipseHelper.drawHandleLines()`.
 * @version 1.0.0
 */
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
import { DrawLib } from "../../interfaces";
export declare class VEllipseHelper {
    private readonly ellipse;
    private readonly rotationControlPoint;
    constructor(ellipse: VEllipse, rotationControlPoint: Vertex);
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>): void;
}
