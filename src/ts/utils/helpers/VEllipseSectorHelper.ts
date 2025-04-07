/**
 * A helper for VEllipseSectors.
 *
 * @author   Ikaros Kappler
 * @date     2021-03-24
 * @modified 2025-04-02 Adding `VEllipseSectorHelper.drawHandleLines`.
 * @version  1.1.0
 */

import { Line } from "../../Line";
import { VEllipseSector } from "../../VEllipseSector";
import { Vertex } from "../../Vertex";
import { VertEvent } from "../../VertexListeners";
import { DrawLib } from "../../interfaces";

export class VEllipseSectorHelper {
  private sector: VEllipseSector;
  private startAngleControlPoint: Vertex;
  private endAngleControlPoint: Vertex;
  private rotationControlPoint: Vertex;

  constructor(
    sector: VEllipseSector,
    startAngleControlPoint: Vertex,
    endAngleControlPoint: Vertex,
    rotationControlPoint: Vertex
  ) {
    this.sector = sector;
    this.startAngleControlPoint = startAngleControlPoint;
    this.endAngleControlPoint = endAngleControlPoint;
    this.rotationControlPoint = rotationControlPoint;

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
      const newRotation: number = rotationControlLine.angle();
      const rDiff: number = newRotation - sector.ellipse.rotation;
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

  /**
   * Draw grey handle lines.
   *
   * @param {DrawLib<any>} draw - The draw library instance to use.
   * @param {DrawLib<any>} fill - The fill library instance to use.
   */
  drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>) {
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
    // Draw helper box
    const xAxisPoint = this.sector.ellipse.vertAt(0.0);
    const yAxisPoint = this.sector.ellipse.vertAt(-Math.PI / 2.0);
    // Draw rotation handle line
    // draw.line(xAxisPoint, this.sector.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
    //   dashOffset: 0.0,
    //   dashArray: [4, 2]
    // });
    // draw.line(yAxisPoint, this.sector.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
    //   dashOffset: 0.0,
    //   dashArray: [4, 2]
    // });
    draw.line(
      this.sector.ellipse.center
        .clone()
        .add(0, this.sector.ellipse.signedRadiusV())
        .rotate(this.sector.ellipse.rotation, this.sector.ellipse.center),
      this.sector.ellipse.axis,
      "rgba(64,128,192,0.333)",
      1.0,
      {
        dashOffset: 0.0,
        dashArray: [4, 2]
      }
    );
    draw.line(
      this.sector.ellipse.center
        .clone()
        .add(this.sector.ellipse.signedRadiusH(), 0)
        .rotate(this.sector.ellipse.rotation, this.sector.ellipse.center),
      this.sector.ellipse.axis,
      "rgba(64,128,192,0.333)",
      1.0,
      {
        dashOffset: 0.0,
        dashArray: [4, 2]
      }
    );
  }
}
