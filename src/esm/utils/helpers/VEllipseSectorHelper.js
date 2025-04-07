/**
 * A helper for VEllipseSectors.
 *
 * @author   Ikaros Kappler
 * @date     2021-03-24
 * @modified 2025-04-02 Adding `VEllipseSectorHelper.drawHandleLines`.
 * @version  1.1.0
 */
import { Line } from "../../Line";
export class VEllipseSectorHelper {
    constructor(sector, startAngleControlPoint, endAngleControlPoint, rotationControlPoint) {
        this.sector = sector;
        this.startAngleControlPoint = startAngleControlPoint;
        this.endAngleControlPoint = endAngleControlPoint;
        this.rotationControlPoint = rotationControlPoint;
        const rotationControlLine = new Line(sector.ellipse.center, rotationControlPoint);
        const startAngleControlLine = new Line(sector.ellipse.center, startAngleControlPoint);
        const endAngleControlLine = new Line(sector.ellipse.center, endAngleControlPoint);
        // +---------------------------------------------------------------------
        // | Listen for the center to be moved.
        // +-------------------------------------------
        sector.ellipse.center.listeners.addDragListener((event) => {
            startAngleControlPoint.add(event.params.dragAmount);
            endAngleControlPoint.add(event.params.dragAmount);
            rotationControlPoint.add(event.params.dragAmount);
        });
        // +---------------------------------------------------------------------
        // | Listen for rotation changes.
        // +-------------------------------------------
        rotationControlPoint.listeners.addDragListener((event) => {
            const newRotation = rotationControlLine.angle();
            const rDiff = newRotation - sector.ellipse.rotation;
            sector.ellipse.rotation = newRotation;
            sector.ellipse.axis.rotate(rDiff, sector.ellipse.center);
            startAngleControlPoint.rotate(rDiff, sector.ellipse.center);
            endAngleControlPoint.rotate(rDiff, sector.ellipse.center);
        });
        // +---------------------------------------------------------------------
        // | Listen for start angle changes.
        // +-------------------------------------------
        startAngleControlPoint.listeners.addDragListener((event) => {
            sector.startAngle = startAngleControlLine.angle() - sector.ellipse.rotation;
        });
        // +---------------------------------------------------------------------
        // | Listen for end angle changes.
        // +-------------------------------------------
        endAngleControlPoint.listeners.addDragListener((event) => {
            sector.endAngle = endAngleControlLine.angle() - sector.ellipse.rotation;
        });
    }
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw, fill) {
        draw.line(this.sector.ellipse.center, this.startAngleControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.line(this.sector.ellipse.center, this.endAngleControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw rotation handle line
        draw.line(this.sector.ellipse.center, this.rotationControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
    }
}
//# sourceMappingURL=VEllipseSectorHelper.js.map