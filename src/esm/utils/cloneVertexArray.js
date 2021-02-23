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
import { Vertex } from "../Vertex";
export const cloneVertexArray = (vertices) => {
    const result = [];
    for (var i = 0; i < vertices.length; i++) {
        result.push(new Vertex(vertices[i].x, vertices[i].y));
    }
    return result;
};
//# sourceMappingURL=cloneVertexArray.js.map