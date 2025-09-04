/**
 * Easily handle triangles with this triangle interaction helper: always keep your
 * triangles equilateral.
 *
 * @author   Ikaros Kappler
 * @date     2025-05-05
 * @version  1.0.0
 **/

import { VertEvent, VertListener } from "../../VertexListeners";
import { Vertex } from "../../Vertex";
import { IShapeInteractionHelper } from "../../interfaces/core";
import { DrawLib } from "../../interfaces/DrawLib";
import { Triangle } from "../../Triangle";
import { Vector } from "../../Vector";

/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export class TriangleHelper implements IShapeInteractionHelper {
  triangle: Triangle;
  radiusPoint: Vertex;

  private handlerA: VertListener;
  private handlerB: VertListener;
  private handlerC: VertListener;

  /**
   * The constructor.
   *
   * @constructor
   * @name TriangleHelper
   * @param {Triangle} triangle - The triangle to handle.
   * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
   * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
   **/
  constructor(triangle: Triangle, setInitiallyEquilateral?: boolean) {
    this.triangle = triangle;

    triangle.a.listeners.addDragListener(
      (this.handlerA = this._handleTrianglePoint(this.triangle.a, this.triangle.b, this.triangle.c))
    );
    triangle.b.listeners.addDragListener(
      (this.handlerB = this._handleTrianglePoint(this.triangle.b, this.triangle.c, this.triangle.a))
    );
    triangle.c.listeners.addDragListener(
      (this.handlerC = this._handleTrianglePoint(this.triangle.c, this.triangle.a, this.triangle.b))
    );

    // Trigger to set equilateral
    if (setInitiallyEquilateral) {
      this.handlerC(null as any as VertEvent); // We know by construction that _here_ the param is optional!
    }
  }

  //--- BEGIN --- Implement ISHapeInteractionHelper ---
  /**
   * Let this shape helper draw it's handle lines. It's up to the helper what they look like.
   * @param {DrawLib<any>} draw - The draw library to use.
   * @param {DrawLib<any>} fill - The fill library to use.
   */
  drawHandleLines(_draw: DrawLib<any>, _fill: DrawLib<any>): void {
    // NOOP
  }

  /**
   * Destroy this circle helper.
   * The listeners will be removed from the circle points.
   *
   * @method destroy
   * @instance
   * @memberof TriangleHelper
   */
  destroy() {
    this.triangle.a.listeners.removeDragListener(this.handlerA);
    this.triangle.b.listeners.removeDragListener(this.handlerB);
    this.triangle.c.listeners.removeDragListener(this.handlerC);
  }
  //--- END --- Implement ISHapeInteractionHelper ---

  /**
   * Creates a new drag handler for the circle's radius control point.
   *
   * @private
   * @method _handleDragCenter
   * @instance
   * @memberof TriangleHelper
   * @returns A new event handler.
   */
  private _handleTrianglePoint(vertex1: Vertex, vertex2: Vertex, vertex3: Vertex): VertListener {
    const _self = this;
    return (_evt: VertEvent) => {
      //   _self.circle.radius = _self.circle.center.distance(_self.radiusPoint);
      // Calculate new side length: set equialateral
      const vec = new Vector(vertex1, vertex2);
      const mid = vec.vertAt(0.5);
      const perp = vec.perp().add(mid).sub(vec.a);
      perp.setLength((vec.length() * Math.sqrt(3)) / 2); // The height of a equilateral triangle
      vertex3.set(perp.b);
    };
  }
}
