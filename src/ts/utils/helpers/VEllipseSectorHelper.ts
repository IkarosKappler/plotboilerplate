/**
 * A helper for VEllipseSectors.
 *
 * @author  Ikaros Kappler
 * @date    2021-03-24
 * @version 1.0.0
 */

import { Line } from "../../Line";
import { VEllipseSector } from "../../VEllipseSector";
import { Vertex } from "../../Vertex";
import { VertEvent } from "../../VertexListeners";

export class VEllipseSectorHelper {
  constructor(
    sector: VEllipseSector,
    startAngleControlPoint: Vertex,
    endAngleControlPoint: Vertex,
    rotationControlPoint: Vertex
  ) {
    const rotationControlLine: Line = new Line(sector.ellipse.center, rotationControlPoint);
    const startAngleControlLine: Line = new Line(sector.ellipse.center, startAngleControlPoint);
    const endAngleControlLine: Line = new Line(sector.ellipse.center, endAngleControlPoint);

    // +---------------------------------------------------------------------
    // | Listen for the center to be moved.
    // +-------------------------------------------
    sector.ellipse.center.listeners.addDragListener((event: VertEvent) => {
      startAngleControlPoint.add(event.params.dragAmount);
      endAngleControlPoint.add(event.params.dragAmount);
      rotationControlPoint.add(event.params.dragAmount);
    });

    // +---------------------------------------------------------------------
    // | Listen for rotation changes.
    // +-------------------------------------------
    rotationControlPoint.listeners.addDragListener((event: VertEvent) => {
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
    startAngleControlPoint.listeners.addDragListener((event: VertEvent) => {
      sector.startAngle = startAngleControlLine.angle() - sector.ellipse.rotation;
    });

    // +---------------------------------------------------------------------
    // | Listen for end angle changes.
    // +-------------------------------------------
    endAngleControlPoint.listeners.addDragListener((event: VertEvent) => {
      sector.endAngle = endAngleControlLine.angle() - sector.ellipse.rotation;
    });
  }
}
