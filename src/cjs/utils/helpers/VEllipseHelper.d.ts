/**
 * A helper for VEllipses.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-31
 * @version 1.0.0
 */
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
import { DrawLib } from "../../interfaces";
export declare class VEllipseHelper {
    private readonly ellipse;
    private readonly rotationControlPoint;
    constructor(ellipse: VEllipse, rotationControlPoint: Vertex);
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>): void;
}
