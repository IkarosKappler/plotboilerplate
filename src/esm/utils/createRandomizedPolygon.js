/**
 * A helper function to generate randmoized non-intersecting polygons.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-23 (ported to Typescript from a helper script from 2024)
 * @version 1.0.0
 */
import { Polygon } from "../Polygon";
import { Vertex } from "../Vertex";
/**
 * @param numVertices
 * @returns
 */
export const createRandomizedPolygon = (numVertices, viewport, createClockwise) => {
    const polygon = new Polygon();
    for (var i = 0; i < numVertices; i++) {
        const vert = new Vertex(viewport.getMinDimension() * 0.33, 0.0);
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
//# sourceMappingURL=createRandomizedPolygon.js.map