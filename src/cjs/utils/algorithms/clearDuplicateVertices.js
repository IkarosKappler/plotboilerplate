"use strict";
/**
 * Remove duplicate vertices (2d) from an array.
 *
 * This method war taken and refactored from an older demo.
 *
 * @author   Ikaros Kappler
 * @date     2021-07-13
 * @modified 2023-10-28 Refactored and ported to Typescript.
 * @version  1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDuplicateVertices = void 0;
var EPS = 0.000001;
/**
 * Filter the array and clear all duplicates.
 *
 * The original array is left unchanged. The vertices in the array are not cloned.
 *
 * @param {Vertex[]} vertices
 * @param {number=EPS} epsilon
 * @return {Vertex[]}
 */
var clearDuplicateVertices = function (vertices, epsilon) {
    if (typeof epsilon === "undefined") {
        epsilon = EPS;
    }
    var result = [];
    for (var i = 0; i < vertices.length; i++) {
        if (!containsElementFrom(vertices, vertices[i], i + 1, epsilon)) {
            result.push(vertices[i]);
        }
    }
    return result;
};
exports.clearDuplicateVertices = clearDuplicateVertices;
var isCloseTo = function (vertA, vertB, eps) {
    return vertA.distance(vertB) < eps;
};
var containsElementFrom = function (vertices, vertex, fromIndex, epsilon) {
    for (var i = fromIndex; i < vertices.length; i++) {
        if (isCloseTo(vertices[i], vertex, epsilon)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=clearDuplicateVertices.js.map