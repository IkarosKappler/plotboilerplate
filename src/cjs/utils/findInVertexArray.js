"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2022-01-10
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInVertexArray = void 0;
/**
 * In an array of vertices find the first occurence of a specific vertex, using
 * and epsilon tolerance.
 *
 * @param {Array<Vertex>} vertexList - The vertex array to search in.
 * @param {XYCoords} vertex - A vertex/position to search for. This can be any x-y-tuple and does not
 *                              necessarily need to be an instance of Vertex.
 * @param {number} epsilon - The epsilon tolerance to use (should be >= 0). This is a required param to avoid excessive
 *                              is-undef checking if this function runs in a loop.
 * @returns {boolean} - The first index of a vertex that matched or -1 if no such vertex could be found.
 */
var findInVertexArray = function (vertexList, vertex, epsilon) {
    for (var i = 0; i < vertexList.length; i++) {
        if (vertexList[i].distance(vertex) < epsilon) {
            return i;
        }
    }
    return -1;
};
exports.findInVertexArray = findInVertexArray;
//# sourceMappingURL=findInVertexArray.js.map