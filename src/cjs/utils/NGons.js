"use strict";
/**
 * Generate regular polygons (N-Gons) and stars (N-Stars).
 *
 * @author   Ikaros Kappler
 * @date     2023-11-24 (plain Javascript)
 * @modified 2024-01-29 Ported to Typescript.
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NGons = void 0;
var Polygon_1 = require("../Polygon");
var Vertex_1 = require("../Vertex");
exports.NGons = {
    ngon: function (n, radius) {
        var center = new Vertex_1.Vertex(0, 0);
        var verts = [];
        for (var i = 0; i < n; i++) {
            var vert = new Vertex_1.Vertex(radius, 0);
            vert.rotate(((Math.PI * 2) / n) * i, center);
            verts.push(vert);
        }
        return new Polygon_1.Polygon(verts);
    },
    nstar: function (n, radiusA, radiusB) {
        var center = new Vertex_1.Vertex(0, 0);
        var verts = [];
        for (var i = 0; i < n; i++) {
            var vert = new Vertex_1.Vertex(i % 2 === 0 ? radiusA : radiusB, 0);
            vert.rotate(((Math.PI * 2) / n) * i, center);
            verts.push(vert);
        }
        return new Polygon_1.Polygon(verts);
    }
};
//# sourceMappingURL=NGons.js.map