"use strict";
/**
 * @requires Line
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2020-12-04
 * @modified 2020-12-07 Ported from vanilla JS to typescript.
 * @modified 2024-11-22 Added the `insideBoundsOnly` param to the `splitPolygonToNonIntersecting` algorithm.
 * @version  1.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPolygonToNonIntersecting = void 0;
var Line_1 = require("../../Line");
var Vertex_1 = require("../../Vertex");
/**
 * This function cuts a given self-intersecting polygon into non-self-intersecting
 * sub polygons.
 *
 * The algorithm only works for non-self-overlapping polygons:
 * Please note that the union set of the sub polygons themselves will _not_ be disjunct if
 * the input polyon overlaps with itself!
 *
 * See this illustration for details:
 * ./demos/27-polygon-intersection-greinerhormann/splitting-polygon-types.png
 *
 * @name splitPolygonToNonIntersecting
 * @param {Array<Vertex>} vertices - The polygon as an array of vertices.
 * @param {number=10} maxDepth - Number of max recursive steps (default is 10).
 * @return {Array<Array<Vertex>>} A sequence of non-self-intersecting sub polygons.
 */
exports.splitPolygonToNonIntersecting = (function () {
    /**
     * @param {Array<Vertex>} vertices
     * @param {number=10} maxDepth
     */
    var splitPolygonToNonIntersecting = function (vertices, maxDepth, insideBoundsOnly) {
        if (typeof maxDepth === "undefined")
            maxDepth = 10;
        return _splitPolygonToNonIntersecting(vertices, maxDepth, insideBoundsOnly);
    };
    var _splitPolygonToNonIntersecting = function (vertices, maxDepth, insideBoundsOnly) {
        if (maxDepth <= 0) {
            // aborting at max depth
            return [vertices];
        }
        if (vertices.length <= 3) {
            // No intersections possible
            return [vertices];
        }
        var n = vertices.length;
        var lineA = new Line_1.Line(new Vertex_1.Vertex(), new Vertex_1.Vertex());
        var lineB = new Line_1.Line(new Vertex_1.Vertex(), new Vertex_1.Vertex());
        for (var a = 0; a < vertices.length; a++) {
            lineA.a.set(vertices[a]);
            lineA.b.set(vertices[(a + 1) % n]);
            for (var b = 0; b < vertices.length; b++) {
                // Equal edges or neighbour edges intersect by definition.
                // We ignore them.
                if (a == b || a + 1 == b || a == b + 1 || (a == 0 && b + 1 == vertices.length) || (b == 0 && a + 1 == vertices.length))
                    continue;
                lineB.a.set(vertices[b]);
                lineB.b.set(vertices[(b + 1) % n]);
                var intersectionPoint = lineA.intersection(lineB);
                if (intersectionPoint &&
                    lineA.hasPoint(intersectionPoint, insideBoundsOnly) &&
                    lineB.hasPoint(intersectionPoint, insideBoundsOnly)) {
                    // Cut polygon into two here
                    var split = splitPolygonAt(vertices, a, b, intersectionPoint);
                    // Split has 2 elements.
                    var leftCleaned = _splitPolygonToNonIntersecting(split[0], maxDepth - 1, insideBoundsOnly);
                    var rightCleaned = _splitPolygonToNonIntersecting(split[1], maxDepth - 1, insideBoundsOnly);
                    return leftCleaned.concat(rightCleaned);
                }
            }
        }
        // No intersection found:
        //    just return a list with the original
        //    polygon as its only element.
        return [vertices];
    };
    // Pre: edgeIndexA < edgeIndexB && vertices.length >= 4
    var splitPolygonAt = function (vertices, edgeIndexA, edgeIndexB, intersectionPoint) {
        var first = [];
        var second = [];
        for (var i = 0; i < vertices.length; i++) {
            if (i <= edgeIndexA)
                first.push(vertices[i]);
            if (i == edgeIndexA) {
                first.push(intersectionPoint);
                second.push(intersectionPoint); // clone???
            }
            if (i > edgeIndexA && i <= edgeIndexB)
                second.push(vertices[i]);
            if (i > edgeIndexB)
                first.push(vertices[i]);
        }
        return [first, second];
    };
    return splitPolygonToNonIntersecting;
})();
//# sourceMappingURL=splitPolygonToNonIntersecting.js.map