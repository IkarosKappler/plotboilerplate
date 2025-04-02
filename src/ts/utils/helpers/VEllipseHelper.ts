/**
 * A helper for VEllipses.
 *
 * @author   Ikaros Kappler
 * @date     2025-03-31
 * @modified 2025-04-02 Adding `VEllipseHelper.drawHandleLines()`.
 * @version  1.0.0
 */

import { Line } from "../../Line";
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
import { VertEvent } from "../../VertexListeners";
import { DrawLib } from "../../interfaces";

export class VEllipseHelper {
  private readonly ellipse: VEllipse;
  private readonly rotationControlPoint: Vertex;

  constructor(ellipse: VEllipse, rotationControlPoint: Vertex) {
    this.ellipse = ellipse;
    this.rotationControlPoint = rotationControlPoint;

    const rotationControlLine: Line = new Line(ellipse.center, rotationControlPoint);

    // +---------------------------------------------------------------------
    // | Listen for the center to be moved.
    // +-------------------------------------------
    ellipse.center.listeners.addDragListener((event: VertEvent) => {
      rotationControlPoint.add(event.params.dragAmount);
    });

    // +---------------------------------------------------------------------
    // | Listen for rotation changes.
    // +-------------------------------------------
    rotationControlPoint.listeners.addDragListener((_event: VertEvent) => {
      var newRotation = rotationControlLine.angle();
      var rDiff = newRotation - ellipse.rotation;
      ellipse.rotation = newRotation;
      ellipse.axis.rotate(rDiff, ellipse.center);
    });
  }

  /**
   * Draw grey handle lines.
   *
   * @param {DrawLib<any>} draw - The draw library instance to use.
   * @param {DrawLib<any>} fill - The fill library instance to use.
   */
  drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>) {
    // Draw rotation handle line
    draw.line(this.ellipse.center, this.rotationControlPoint, "rgba(64,192,128,0.333)", 1.0, {
      dashOffset: 0.0,
      dashArray: [4, 2]
    });
  }
}
