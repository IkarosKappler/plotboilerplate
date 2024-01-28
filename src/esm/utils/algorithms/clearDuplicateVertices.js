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
const EPS = 0.000001;
/**
 * Filter the array and clear all duplicates.
 *
 * The original array is left unchanged. The vertices in the array are not cloned.
 *
 * @param {Vertex[]} vertices
 * @param {number=EPS} epsilon
 * @return {Vertex[]}
 */
export const clearDuplicateVertices = (vertices, epsilon) => {
    if (typeof epsilon === "undefined") {
        epsilon = EPS;
    }
    const result = [];
    for (var i = 0; i < vertices.length; i++) {
        if (!containsElementFrom(vertices, vertices[i], i + 1, epsilon)) {
            result.push(vertices[i]);
        }
    }
    return result;
};
const isCloseTo = (vertA, vertB, eps) => {
    return vertA.distance(vertB) < eps;
};
const containsElementFrom = (vertices, vertex, fromIndex, epsilon) => {
    for (var i = fromIndex; i < vertices.length; i++) {
        if (isCloseTo(vertices[i], vertex, epsilon)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=clearDuplicateVertices.js.map