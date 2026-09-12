/**
 * A mutable point set datastructure for holding a finite but variable set of vertices.
 *
 * @date    2026-09-12
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

import PlotBoilerplate from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";
import { XYCoords } from "../../interfaces";

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

  // +---------------------------------------------------------------------------------
  // | Adds a random point to the point list. Needed for initialization.
  // +-------------------------------
  addRandomPoint() {
    this.addVertex(Vertex.randomVertex(this.pb.viewport()).scale(0.5));
  }

  addVertex(vert: Vertex) {
    this.points.push(vert);
    this.pb.add(vert);
    var _self = this;
    vert.listeners.addDragListener(function () {
      //   rebuild();
      _self.fireDragEvent();
    });
  }

  /**
   * Add or remove n random points; depends on the config settings.
   *
   * I have no idea how tired I was when I wrote this function but it seems working pretty well.
   */
  randomPoints(pointCount: number, clear: boolean, fullCover: boolean) {
    if (clear) {
      for (var i = 0; i < this.points.length; i++) {
        this.pb.remove(this.points[i], false);
      }
      this.points = [];
    }
    // Generate random points on image border?
    if (fullCover) {
      var remainingPoints = pointCount - this.points.length;
      var borderPoints = Math.sqrt(remainingPoints);
      var ratio = this.pb.canvasSize.height / this.pb.canvasSize.width;
      var hCount = Math.round((borderPoints / 2) * ratio);
      var vCount = borderPoints / 2 - hCount;

      while (vCount > 0) {
        this.addVertex(
          new Vertex(-this.pb.canvasSize.width / 2, this.randomInt(this.pb.canvasSize.height / 2) - this.pb.canvasSize.height / 2)
        );
        this.addVertex(
          new Vertex(this.pb.canvasSize.width / 2, this.randomInt(this.pb.canvasSize.height / 2) - this.pb.canvasSize.height / 2)
        );
        vCount--;
      }

      while (hCount > 0) {
        this.addVertex(new Vertex(this.randomInt(this.pb.canvasSize.width / 2) - this.pb.canvasSize.width / 2, 0));
        this.addVertex(
          new Vertex(this.randomInt(this.pb.canvasSize.width / 2) - this.pb.canvasSize.width / 2, this.pb.canvasSize.height / 2)
        );
        hCount--;
      }

      // Additionally add 4 points to the corners
      this.addVertex(new Vertex(0, 0));
      this.addVertex(new Vertex(this.pb.canvasSize.width / 2, 0));
      this.addVertex(new Vertex(this.pb.canvasSize.width / 2, this.pb.canvasSize.height / 2));
      this.addVertex(new Vertex(0, this.pb.canvasSize.height / 2));
    }

    // Generate random points.
    for (var i = this.points.length; i < pointCount; i++) {
      this.addRandomPoint();
    }
    // updateAnimator();
    // if (doRebuild) rebuild();
  }

  // +---------------------------------------------------------------------------------
  // | Generates a random int value between 0 and max (both inclusive).
  // +-------------------------------
  private randomInt(max: number): number {
    return Math.round(Math.random() * max);
  }
}
