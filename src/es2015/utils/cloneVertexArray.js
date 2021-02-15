"use strict";
/**
 * The name says it.
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2020-12-20
 * @modified 2021-02-09 Ported to TypeScript.
 * @version  1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneVertexArray = void 0;
const Vertex_1 = require("../Vertex");
const cloneVertexArray = (vertices) => {
    const result = [];
    for (var i = 0; i < vertices.length; i++) {
        result.push(new Vertex_1.Vertex(vertices[i].x, vertices[i].y));
    }
    return result;
};
exports.cloneVertexArray = cloneVertexArray;
//# sourceMappingURL=cloneVertexArray.js.map