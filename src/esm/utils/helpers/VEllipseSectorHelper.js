/**
 * A helper for VEllipseSectors.
 *
 * @author  Ikaros Kappler
 * @date    2021-03-24
 * @version 1.0.0
 */
import { Line } from "../../Line";
export class VEllipseSectorHelper {
    constructor(sector, startAngleControlPoint, endAngleControlPoint, rotationControlPoint) {
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
            var newRotation = rotationControlLine.angle();
            var rDiff = newRotation - sector.ellipse.rotation;
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
}
//# sourceMappingURL=VEllipseSectorHelper.js.map