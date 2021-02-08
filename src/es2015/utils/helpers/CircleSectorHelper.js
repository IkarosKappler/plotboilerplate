/**
 * @author   Ikaros Kappler
 * @modified 2021-01-22
 * @version  1.0.0
 */
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export class CircleSectorHelper {
    /**
     * The constructor.
     *
     * @constructor
     * @name CircleSectorHelper
     * @param {CircleSector} circleSector - The circle sector to handle.
     * @param {Vertex} controlPointStart - A point to define the radius and start angle (distance and angle from center).
     * @param {Vertex} controlPointEnd - A point to define the radius and end angle (distance and angle from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle sector and both points.
     **/
    constructor(circleSector, controlPointStart, controlPointEnd, pb) {
        circleSector.circle.center.listeners.addDragListener((e) => {
            controlPointStart.add(e.params.dragAmount);
            controlPointEnd.add(e.params.dragAmount);
        });
        controlPointStart.listeners.addDragListener((e) => {
            circleSector.circle.radius = circleSector.circle.center.distance(controlPointStart);
            controlPointEnd.set(circleSector.circle.vertAt(circleSector.endAngle));
            circleSector.startAngle = circleSector.circle.center.angle(controlPointStart);
        });
        controlPointEnd.listeners.addDragListener((e) => {
            circleSector.circle.radius = circleSector.circle.center.distance(controlPointEnd);
            controlPointStart.set(circleSector.circle.vertAt(circleSector.startAngle));
            circleSector.endAngle = circleSector.circle.center.angle(controlPointEnd);
        });
    }
}
;
//# sourceMappingURL=CircleSectorHelper.js.map