"use strict";
/**
 * A helper function to generate randmoized non-intersecting polygons.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-23 (ported to Typescript from a helper script from 2024)
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomizedPolygon = void 0;
var Polygon_1 = require("../Polygon");
var Vertex_1 = require("../Vertex");
/**
 * @param numVertices
 * @returns
 */
var createRandomizedPolygon = function (numVertices, viewport, createClockwise) {
    var polygon = new Polygon_1.Polygon();
    for (var i = 0; i < numVertices; i++) {
        var vert = new Vertex_1.Vertex(viewport.getMinDimension() * 0.33, 0.0);
        vert.rotate(((Math.PI * 2) / numVertices) * i);
        vert.addXY(viewport.width * 0.1 * (1.0 - Math.random() * 2), viewport.height * 0.1 * (1.0 - Math.random() * 2));
        polygon.addVertex(vert);
    }
    if (createClockwise && !polygon.isClockwise()) {
        // Reverse
        polygon.vertices = polygon.vertices.reverse();
    }
    return polygon;
};
exports.createRandomizedPolygon = createRandomizedPolygon;
//# sourceMappingURL=createRandomizedPolygon.js.map