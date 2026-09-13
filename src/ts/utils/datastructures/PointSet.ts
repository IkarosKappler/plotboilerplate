/**
 * A mutable point set datastructure for holding a finite but variable set of vertices.
 *
 * @date    2026-09-12
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import PlotBoilerplate from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";

export class PointSet {
  private readonly pb: PlotBoilerplate;
  public points: Array<Vertex>;
  readonly dragListeners: Array<Function> = [];

  constructor(pb: PlotBoilerplate) {
    this.pb = pb;
    this.points = [];
  }

  private fireDragEvent() {
    this.dragListeners.forEach(listener => {
      listener();
    });
  }

  /**
   * Adds a random point to the point list.
   *
   * @name addRandomPoint
   * @instance
   * @override
   * @memberof PointSet
   * @return {void}
   */
  addRandomPoint(horizontalSafeArea: number = 0, verticalSafeArea: number = 0) {
    // this.addVertex(Vertex.randomVertex(this.pb.viewport()).scale(0.5));
    this.addVertex(this.pb.viewport().randomPoint(horizontalSafeArea, verticalSafeArea));
  }

  /**
   * Adds the given point/vertex to the point list.
   *
   * @name addVertex
   * @instance
   * @override
   * @memberof PointSet
   * @param {Vertex} vert - The vertex to add.
   * @return {void}
   */
  addVertex(vert: Vertex) {
    this.points.push(vert);
    this.pb.add(vert);
    var _self = this;
    vert.listeners.addDragListener(function () {
      _self.fireDragEvent();
    });
    // vert.listeners.addDragListener(_self.fireDragEvent);
  }

  /**
   * Remove all vertices from this set and from the plotboilerplate instance.
   *
   * @name clear
   * @instance
   * @override
   * @memberof PointSet
   * @return {void}
   */
  clear() {
    for (var i = 0; i < this.points.length; i++) {
      this.pb.remove(this.points[i], false);
      // TODO: How to remove drag listener?
      //   this.points[i].listeners.removeDragListener(this.fireDragEvent);
    }
    this.points = [];
  }

  /**
   * Add or remove n random points; depends on the config settings.
   *
   * I have no idea how tired I was when I wrote this function but it seems working pretty well.
   */
  randomPoints(pointCount: number, horizontalSafeArea: number = 0, verticalSafeArea: number = 0) {
    // Generate random points.
    for (var i = this.points.length; i < pointCount; i++) {
      this.addRandomPoint(horizontalSafeArea, verticalSafeArea);
    }
  }

  // +---------------------------------------------------------------------------------
  // | Generates a random int value between 0 and max (both inclusive).
  // +-------------------------------
  //   private randomInt(max: number): number {
  //     return Math.round(Math.random() * max);
  //   }
}
