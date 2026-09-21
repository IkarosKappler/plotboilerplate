"use strict";
/**
 * Refactored all Voronoi helper functions for drawing the diagram (demo 07) into this class.
 *
 * @author   Ikaros Kappler
 * @date     2026-09-13
 * @modified 2026-09-15 Ported to Typescript.
 * @version  1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoronoiRenderer = void 0;
var Bounds_1 = require("../../Bounds");
var Polygon_1 = require("../../Polygon");
var convexPolygonIncircle_1 = require("../algorithms/convexPolygonIncircle");
var sutherlandHodgman_1 = require("../algorithms/sutherlandHodgman");
var cloneVertexArray_1 = require("../cloneVertexArray");
var VoronoiRenderer = /** @class */ (function () {
    function VoronoiRenderer(voronoiContext) {
        this.voronoiContext = voronoiContext;
    }
    /**
     * Draw the given triangle with the specified (CSS-) color.
     *
     * @name draw
     * @instance
     * @memberof VoronoiRenderer
     * @param {DrawLib} draw
     * @param {Triangle} t
     * @param {string} color
     * @return {void}
     */
    VoronoiRenderer.prototype.draw = function (draw, fill) {
        // Draw circumcircles
        if (this.voronoiContext.config.drawCircumCircles) {
            VoronoiRenderer.drawCircumCircles(draw, this.voronoiContext.triangles);
        }
        // An array of VoronoiCells.
        var clipBoxPolygon = Bounds_1.Bounds.computeFromVertices(this.voronoiContext.pointSet.points).toPolygon();
        if (this.voronoiContext.config.drawClipBox) {
            draw.polygon(clipBoxPolygon, "rgba(192,192,192,0.25)");
        }
        for (var v in this.voronoiContext.voronoiCells) {
            var cell = this.voronoiContext.voronoiCells[v];
            this._drawCell(draw, fill, clipBoxPolygon, cell);
        }
    };
    /**
     * Draw the given triangle with the specified (CSS-) color.
     *
     * @name _drawCell
     * @instance
     * @private
     * @memberof VoronoiRenderer
     * @param {DrawLib} draw
     * @param {Polygon} clipBoxPolygon
     * @param {VoronoiCell} cell
     * @return {void}
     */
    VoronoiRenderer.prototype._drawCell = function (draw, fill, clipBoxPolygon, cell) {
        var _a, _b;
        var cellPolygon = cell.toPolygon();
        cellPolygon.scale(this.voronoiContext.config.voronoiCellScale, cell.sharedVertex);
        // Draw large (unclipped) Voronoi cell
        if (this.voronoiContext.config.drawVoronoiOutlines &&
            (!this.voronoiContext.config.clipVoronoiCells || this.voronoiContext.config.drawUnclippedVoronoiCells)) {
            draw.polyline(cellPolygon.vertices, false, this.voronoiContext.config.clipVoronoiCells ? "rgba(128,128,128,0.333)" : this.voronoiContext.config.voronoiOutlineColor, (_a = this.voronoiContext.config.voronoiCellLineWidth) !== null && _a !== void 0 ? _a : 2.0);
        }
        // Apply clipping?
        if (this.voronoiContext.config.clipVoronoiCells) {
            // Clone the array here: convert Array<XYCoords> to Array<Vertex>
            // polygon = new Polygon(cloneVertexArray(sutherlandHodgman(polygon.vertices, clipBoxPolygon.vertices)), false);
            cellPolygon = VoronoiRenderer.clipVoronoiPolygon(cellPolygon, clipBoxPolygon);
        }
        if (this.voronoiContext.config.drawVoronoiOutlines && this.voronoiContext.config.clipVoronoiCells) {
            draw.polygon(cellPolygon, this.voronoiContext.config.voronoiOutlineColor, (_b = this.voronoiContext.config.voronoiCellLineWidth) !== null && _b !== void 0 ? _b : 2.0);
        }
        if ((!cell.isOpen() || this.voronoiContext.config.clipVoronoiCells) && cell.triangles.length >= 3) {
            if (this.voronoiContext.config.drawCubicCurves) {
                var cbezier = cellPolygon.toCubicBezierData(this.voronoiContext.config.voronoiCubicThreshold);
                if (this.voronoiContext.config.fillVoronoiCells) {
                    fill.cubicBezierPath(cbezier, this.voronoiContext.config.voronoiCellColor);
                }
                else {
                    draw.cubicBezierPath(cbezier, this.voronoiContext.config.voronoiCellColor);
                }
            }
            if (this.voronoiContext.config.drawVoronoiIncircles) {
                var result = (0, convexPolygonIncircle_1.convexPolygonIncircle)(cellPolygon);
                var circle = result.circle;
                // var triangle = result.triangle;
                // Here we should have found the best inlying circle (and the corresponding triangle)
                // inside the Voronoi cell.
                draw.circle(circle.center, circle.radius, "rgba(255,192,0,1.0)", 2);
            }
        } // END cell is not open
    };
    /**
     * A function for drawing the triangles.
     *
     * @static
     */
    VoronoiRenderer.prototype.drawTriangles = function (draw) {
        for (var i in this.voronoiContext.triangles) {
            var t = this.voronoiContext.triangles[i];
            VoronoiRenderer.drawTriangle(draw, t, this.voronoiContext.config.makeVoronoiDiagram ? "rgba(0,128,224,0.33)" : "#0088d8");
        }
    };
    /**
     * Draw the given triangle with the specified (CSS-) color.
     *
     * @static
     * @name drawTriangle
     * @memberof VoronoiRenderer
     * @param {DrawLib} draw
     * @param {Triangle} tri
     * @param {string} color
     * @return {void}
     */
    VoronoiRenderer.drawTriangle = function (draw, tri, color) {
        // draw.line(t.a, t.b, color);
        // draw.line(t.b, t.c, color);
        // draw.line(t.c, t.a, color);
        draw.polyline([tri.a, tri.b, tri.c], false, color);
    };
    /**
     * Draw the circumcircles of all triangles.
     */
    VoronoiRenderer.drawCircumCircles = function (draw, triangles) {
        for (var t in triangles) {
            var cc = triangles[t].getCircumcircle();
            draw.circle(cc.center, cc.radius, "#e86800");
        }
    };
    /**
     * Clip the convex (!) cell polygon by the convex (!) clipping polygon.
     *
     * @param cellPolygon
     * @param clipBoxPolygon
     * @returns
     */
    VoronoiRenderer.clipVoronoiPolygon = function (cellPolygon, clipBoxPolygon) {
        return new Polygon_1.Polygon((0, cloneVertexArray_1.cloneVertexArray)((0, sutherlandHodgman_1.sutherlandHodgman)(cellPolygon.vertices, clipBoxPolygon.vertices)), false);
    };
    return VoronoiRenderer;
}());
exports.VoronoiRenderer = VoronoiRenderer;
//# sourceMappingURL=VoronoiRenderer.js.map