"use strict";
/**
 * @author Ikaros Kappler
 * @date   2021-04-05
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawDrawables = void 0;
// import { Drawable } from "./interfaces";
var BezierPath_1 = require("./BezierPath");
// import { Bounds } from "./Bounds";
var Circle_1 = require("./Circle");
var CircleSector_1 = require("./CircleSector");
// import { Grid } from "./Grid";
// import { KeyHandler, XKeyListener } from "./KeyHandler";
var Line_1 = require("./Line");
// import { MouseHandler, XMouseEvent, XWheelEvent } from "./MouseHandler";
var PBImage_1 = require("./PBImage");
var Polygon_1 = require("./Polygon");
// import { SVGBuilder } from "./SVGBuilder";
var Triangle_1 = require("./Triangle");
var VEllipse_1 = require("./VEllipse");
var Vector_1 = require("./Vector");
var Vertex_1 = require("./Vertex");
/**
 * Draw all drawables.
 *
 * This function is used by the main draw procedure and some further tools (like svg-draw).
 *
 * @method drawDrawables
 * @param {number} renderTime - The current render time. It will be used to distinct
 *                              already draw vertices from non-draw-yet vertices.
 * @return {void}
 **/
var drawDrawables = function (drawables, draw, // TODO: put behind an interface
fill, drawConfig, renderTime, _handleColor) {
    for (var i in drawables) {
        var d = drawables[i];
        if (d instanceof BezierPath_1.BezierPath) {
            for (var c in d.bezierCurves) {
                draw.cubicBezier(d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, drawConfig.bezier.color, drawConfig.bezier.lineWidth);
                if (drawConfig.drawBezierHandlePoints && drawConfig.drawHandlePoints) {
                    if (!d.bezierCurves[c].startPoint.attr.bezierAutoAdjust) {
                        if (d.bezierCurves[c].startPoint.attr.visible)
                            draw.diamondHandle(d.bezierCurves[c].startPoint, 7, _handleColor(d.bezierCurves[c].startPoint, drawConfig.vertex.color));
                        d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    }
                    if (!d.bezierCurves[c].endPoint.attr.bezierAutoAdjust) {
                        if (d.bezierCurves[c].endPoint.attr.visible)
                            draw.diamondHandle(d.bezierCurves[c].endPoint, 7, _handleColor(d.bezierCurves[c].endPoint, drawConfig.vertex.color));
                        d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                    }
                    if (d.bezierCurves[c].startControlPoint.attr.visible)
                        draw.circleHandle(d.bezierCurves[c].startControlPoint, 3, _handleColor(d.bezierCurves[c].startControlPoint, '#008888'));
                    if (d.bezierCurves[c].endControlPoint.attr.visible)
                        draw.circleHandle(d.bezierCurves[c].endControlPoint, 3, _handleColor(d.bezierCurves[c].endControlPoint, '#008888'));
                    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                }
                else {
                    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                }
                if (drawConfig.drawBezierHandleLines && drawConfig.drawHandleLines) {
                    draw.line(d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, drawConfig.bezier.handleLine.color, drawConfig.bezier.handleLine.lineWidth);
                    draw.line(d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, drawConfig.bezier.handleLine.color, drawConfig.bezier.handleLine.lineWidth);
                }
            }
        }
        else if (d instanceof Polygon_1.Polygon) {
            draw.polygon(d, drawConfig.polygon.color, drawConfig.polygon.lineWidth);
            if (!drawConfig.drawHandlePoints) {
                for (var i in d.vertices) {
                    d.vertices[i].attr.renderTime = renderTime;
                }
            }
        }
        else if (d instanceof Triangle_1.Triangle) {
            draw.polyline([d.a, d.b, d.c], false, drawConfig.triangle.color, drawConfig.triangle.lineWidth);
            if (!drawConfig.drawHandlePoints)
                d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
        }
        else if (d instanceof VEllipse_1.VEllipse) {
            if (drawConfig.drawHandleLines) {
                draw.line(d.center.clone().add(0, d.axis.y - d.center.y), d.axis, '#c8c8c8');
                draw.line(d.center.clone().add(d.axis.x - d.center.x, 0), d.axis, '#c8c8c8');
            }
            draw.ellipse(d.center, Math.abs(d.axis.x - d.center.x), Math.abs(d.axis.y - d.center.y), drawConfig.ellipse.color, drawConfig.ellipse.lineWidth);
            if (!drawConfig.drawHandlePoints) {
                d.center.attr.renderTime = renderTime;
                d.axis.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof Circle_1.Circle) {
            draw.circle(d.center, d.radius, drawConfig.circle.color, drawConfig.circle.lineWidth);
        }
        else if (d instanceof CircleSector_1.CircleSector) {
            draw.circleArc(d.circle.center, d.circle.radius, d.startAngle, d.endAngle, drawConfig.circleSector.color, drawConfig.circleSector.lineWidth);
        }
        else if (d instanceof Vertex_1.Vertex) {
            if (drawConfig.drawVertices &&
                (!d.attr.selectable || !d.attr.draggable) && d.attr.visible) {
                // Draw as special point (grey)
                draw.circleHandle(d, 7, drawConfig.vertex.color);
                d.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof Line_1.Line) {
            draw.line(d.a, d.b, drawConfig.line.color, drawConfig.line.lineWidth);
            if (!drawConfig.drawHandlePoints || !d.a.attr.selectable)
                d.a.attr.renderTime = renderTime;
            if (!drawConfig.drawHandlePoints || !d.b.attr.selectable)
                d.b.attr.renderTime = renderTime;
        }
        else if (d instanceof Vector_1.Vector) {
            draw.arrow(d.a, d.b, drawConfig.vector.color);
            if (drawConfig.drawHandlePoints && d.b.attr.selectable && d.b.attr.visible) {
                draw.circleHandle(d.b, 3, '#a8a8a8');
            }
            else {
                d.b.attr.renderTime = renderTime;
            }
            if (!drawConfig.drawHandlePoints || !d.a.attr.selectable)
                d.a.attr.renderTime = renderTime;
            if (!drawConfig.drawHandlePoints || !d.b.attr.selectable)
                d.b.attr.renderTime = renderTime;
        }
        else if (d instanceof PBImage_1.PBImage) {
            if (drawConfig.drawHandleLines)
                draw.line(d.upperLeft, d.lowerRight, drawConfig.image.color, drawConfig.image.lineWidth);
            fill.image(d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft));
            if (drawConfig.drawHandlePoints) {
                draw.circleHandle(d.lowerRight, 3, drawConfig.image.color);
                d.lowerRight.attr.renderTime = renderTime;
            }
        }
        else {
            console.error('Cannot draw object. Unknown class.');
        }
    }
};
exports.drawDrawables = drawDrawables;
//# sourceMappingURL=utils.js.map