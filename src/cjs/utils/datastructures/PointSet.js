"use strict";
/**
 * A mutable point set datastructure for holding a finite but variable set of vertices.
 *
 * @date    2026-09-12
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointSet = void 0;
var Vertex_1 = require("../../Vertex");
var PointSet = /** @class */ (function () {
    function PointSet(pb) {
        this.dragListeners = [];
        this.pb = pb;
        this.points = [];
    }
    PointSet.prototype.fireDragEvent = function () {
        this.dragListeners.forEach(function (listener) {
            listener();
        });
    };
    // +---------------------------------------------------------------------------------
    // | Adds a random point to the point list. Needed for initialization.
    // +-------------------------------
    PointSet.prototype.addRandomPoint = function () {
        this.addVertex(Vertex_1.Vertex.randomVertex(this.pb.viewport()).scale(0.5));
    };
    PointSet.prototype.addVertex = function (vert) {
        this.points.push(vert);
        this.pb.add(vert);
        var _self = this;
        vert.listeners.addDragListener(function () {
            //   rebuild();
            _self.fireDragEvent();
        });
    };
    /**
     * Add or remove n random points; depends on the config settings.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    PointSet.prototype.randomPoints = function (pointCount, clear, fullCover) {
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
                this.addVertex(new Vertex_1.Vertex(-this.pb.canvasSize.width / 2, this.randomInt(this.pb.canvasSize.height / 2) - this.pb.canvasSize.height / 2));
                this.addVertex(new Vertex_1.Vertex(this.pb.canvasSize.width / 2, this.randomInt(this.pb.canvasSize.height / 2) - this.pb.canvasSize.height / 2));
                vCount--;
            }
            while (hCount > 0) {
                this.addVertex(new Vertex_1.Vertex(this.randomInt(this.pb.canvasSize.width / 2) - this.pb.canvasSize.width / 2, 0));
                this.addVertex(new Vertex_1.Vertex(this.randomInt(this.pb.canvasSize.width / 2) - this.pb.canvasSize.width / 2, this.pb.canvasSize.height / 2));
                hCount--;
            }
            // Additionally add 4 points to the corners
            this.addVertex(new Vertex_1.Vertex(0, 0));
            this.addVertex(new Vertex_1.Vertex(this.pb.canvasSize.width / 2, 0));
            this.addVertex(new Vertex_1.Vertex(this.pb.canvasSize.width / 2, this.pb.canvasSize.height / 2));
            this.addVertex(new Vertex_1.Vertex(0, this.pb.canvasSize.height / 2));
        }
        // Generate random points.
        for (var i = this.points.length; i < pointCount; i++) {
            this.addRandomPoint();
        }
        // updateAnimator();
        // if (doRebuild) rebuild();
    };
    // +---------------------------------------------------------------------------------
    // | Generates a random int value between 0 and max (both inclusive).
    // +-------------------------------
    PointSet.prototype.randomInt = function (max) {
        return Math.round(Math.random() * max);
    };
    return PointSet;
}());
exports.PointSet = PointSet;
//# sourceMappingURL=PointSet.js.map