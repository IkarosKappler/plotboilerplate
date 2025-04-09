/**
 * A helper for VEllipseSectors.
 *
 * @author   Ikaros Kappler
 * @date     2021-03-24
 * @modified 2025-04-02 Adding `VEllipseSectorHelper.drawHandleLines`.
 * @modified 2025-04-07 Modifying the calculation of `startAngle` and `endAngle` from the rotation control point: wrapping result into [0,TWO_PI).
 * @modified 2025-04-09 Adding the `VEllipseSectorHelper.destroy` method.
 * @version  1.1.0
 */

import { Line } from "../../Line";
import { VEllipseSector } from "../../VEllipseSector";
import { Vertex } from "../../Vertex";
import { VertEvent, VertListener } from "../../VertexListeners";
import { geomutils } from "../../geomutils";
import { DrawLib } from "../../interfaces";

export class VEllipseSectorHelper {
  private sector: VEllipseSector;
  private startAngleControlPoint: Vertex;
  private endAngleControlPoint: Vertex;
  private rotationControlPoint: Vertex;

  private _rotationControlLine: Line;
  private _startAngleControlLine: Line;
  private _endAngleControlLine: Line;

  private _centerHandler: VertListener;
  private _rotationHandler: VertListener;
  private _startAngleHandler: VertListener;
  private _endAngleHandler: VertListener;

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

    // const rotationControlLine: Line = new Line(sector.ellipse.center, rotationControlPoint);
    this._rotationControlLine = new Line(sector.ellipse.center, rotationControlPoint);
    // const startAngleControlLine: Line = new Line(sector.ellipse.center, startAngleControlPoint);
    this._startAngleControlLine = new Line(sector.ellipse.center, startAngleControlPoint);
    // const endAngleControlLine: Line = new Line(sector.ellipse.center, endAngleControlPoint);
    this._endAngleControlLine = new Line(sector.ellipse.center, endAngleControlPoint);

    // +---------------------------------------------------------------------
    // | Listen for the center to be moved.
    // +-------------------------------------------
    sector.ellipse.center.listeners.addDragListener((this._centerHandler = this._handleDragCenterPoint()));

    // +---------------------------------------------------------------------
    // | Listen for rotation changes.
    // +-------------------------------------------
    rotationControlPoint.listeners.addDragListener((this._rotationHandler = this._handleDragRotationControlPoint()));

    // +---------------------------------------------------------------------
    // | Listen for start angle changes.
    // +-------------------------------------------
    startAngleControlPoint.listeners.addDragListener((this._startAngleHandler = this._handleDragStartAngleControlPoint()));

    // +---------------------------------------------------------------------
    // | Listen for end angle changes.
    // +-------------------------------------------
    endAngleControlPoint.listeners.addDragListener((this._endAngleHandler = this._handleDragEndAngleControlPoint()));
  }

  /**
   * Creates a new drag handler for the circle sector's start control point.
   *
   * @private
   * @method _handleDragStartControlPoint
   * @instance
   * @memberof CircleSectorHelper
   * @returns A new event handler.
   */
  private _handleDragCenterPoint(): VertListener {
    const _self = this;
    return (event: VertEvent) => {
      _self.startAngleControlPoint.add(event.params.dragAmount);
      _self.endAngleControlPoint.add(event.params.dragAmount);
      _self.rotationControlPoint.add(event.params.dragAmount);
    };
  }

  private _handleDragRotationControlPoint(): VertListener {
    const _self = this;
    return (event: VertEvent) => {
      const newRotation: number = _self._rotationControlLine.angle();
      const rDiff: number = newRotation - _self.sector.ellipse.rotation;
      _self.sector.ellipse.rotation = newRotation;
      _self.sector.ellipse.axis.rotate(rDiff, _self.sector.ellipse.center);
      _self.startAngleControlPoint.rotate(rDiff, _self.sector.ellipse.center);
      _self.endAngleControlPoint.rotate(rDiff, _self.sector.ellipse.center);
    };
  }

  private _handleDragStartAngleControlPoint(): VertListener {
    const _self = this;
    return (_event: VertEvent) => {
      // sector.startAngle = startAngleControlLine.angle() - sector.ellipse.rotation;
      _self.sector.startAngle = geomutils.mapAngleTo2PI(_self._startAngleControlLine.angle() - _self.sector.ellipse.rotation);
    };
  }

  private _handleDragEndAngleControlPoint(): VertListener {
    const _self = this;

    return (event: VertEvent) => {
      _self.sector.endAngle = geomutils.mapAngleTo2PI(_self._endAngleControlLine.angle() - _self.sector.ellipse.rotation);
    };
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
  } // END drawHandleLines

  /**
   * Destroy this VEllipseHandler which means: all listeners are being removed.
   */
  destroy(): void {
    this.sector.ellipse.center.listeners.removeDragListener(this._centerHandler);
    this.rotationControlPoint.listeners.removeDragListener(this._rotationHandler);
    this.startAngleControlPoint.listeners.removeDragListener(this._startAngleHandler);
    this.endAngleControlPoint.listeners.removeDragListener(this._endAngleHandler);
  }
}
