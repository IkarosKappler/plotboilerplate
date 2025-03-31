/**
 * A helper for VEllipses.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-31
 * @version 1.0.0
 */
import { Line } from "../../Line";
export class VEllipseHelper {
    constructor(ellipse, rotationControlPoint) {
        this.ellipse = ellipse;
        this.rotationControlPoint = rotationControlPoint;
        const rotationControlLine = new Line(ellipse.center, rotationControlPoint);
        // +---------------------------------------------------------------------
        // | Listen for the center to be moved.
        // +-------------------------------------------
        ellipse.center.listeners.addDragListener((event) => {
            rotationControlPoint.add(event.params.dragAmount);
        });
        // +---------------------------------------------------------------------
        // | Listen for rotation changes.
        // +-------------------------------------------
        rotationControlPoint.listeners.addDragListener((_event) => {
            var newRotation = rotationControlLine.angle();
            var rDiff = newRotation - ellipse.rotation;
            ellipse.rotation = newRotation;
            ellipse.axis.rotate(rDiff, ellipse.center);
        });
    }
    drawHandleLines(draw, fill) {
        // Draw rotation handle line
        draw.line(this.ellipse.center, this.rotationControlPoint, "rgba(64,192,128,0.333)", 1.0);
    }
}
//# sourceMappingURL=VEllipseHelper.js.map