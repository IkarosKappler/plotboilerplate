/**
 * A helper for VEllipses.
 *
 * @author   Ikaros Kappler
 * @date     2025-03-31
 * @modified 2025-04-02 Adding `VEllipseHelper.drawHandleLines()`.
 * @modified 2025-04-09 Adding `VEllipseHelper.destroy()`.
 * @modified 2025-05-05 Fixed a typo in the `VEllipseHelper.destroy` method (was named `detroy`).
 * @modified 2025-05-05 `VEllipseHelper` is now implementing `IShapeInteractionHelper`.
 * @version  1.0.1
 */
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
import { DrawLib, IShapeInteractionHelper } from "../../interfaces";
export declare class VEllipseHelper implements IShapeInteractionHelper {
    private readonly ellipse;
    private readonly rotationControlPoint;
    private _rotationControlLine;
    private _centerPointHandler;
    private _rotationPointHandler;
    constructor(ellipse: VEllipse, rotationControlPoint: Vertex);
    private _handleDragCenterPoint;
    private _handleRotationCenterPoint;
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>): void;
    destroy(): void;
}
