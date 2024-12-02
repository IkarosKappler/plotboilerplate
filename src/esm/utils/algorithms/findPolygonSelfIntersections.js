/**
 * @requires Line
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2020-12-04
 * @modified 2020-12-09 Ported from vanilla JS to Typescript.
 * @modified 2024-11-22 Fixed a type error in line 41.
 */
import { Line } from "../../Line";
import { Vertex } from "../../Vertex";
/**
 * Collect all self-intersection points of the given polygon.
 *
 * If the given polygon (vertices) is not self intersecting then the returned array is empty.
 *
 * @name findPolygonSelfIntersections
 * @param {Array<Vertex>} vertices - The vertices that form the polygon.
 * @return {Array<Vertex>}
 */
export const findPolygonSelfIntersections = (vertices) => {
    const pointList = [];
    const lineA = new Line(new Vertex(), new Vertex());
    const lineB = new Line(new Vertex(), new Vertex());
    const n = vertices.length;
    for (var a = 0; a < n; a++) {
        lineA.a.set(vertices[a]);
        lineA.b.set(vertices[(a + 1) % n]);
        for (var b = 0; b < n; b++) {
            // Same edge or neighbour edges intersect by definition.
            // Skip them.
            if (a == b || a + 1 == b || a == b + 1 || (a == 0 && b + 1 == n) || (b == 0 && a + 1 == n))
                continue;
            lineB.a.set(vertices[b]);
            lineB.b.set(vertices[(b + 1) % n]);
            // Commpute the intersection point of the (infinite) lines.
            // The point is undefined if and only if both line are parallel (co-linear).
            const intersectionPoint = lineA.intersection(lineB);
            // Check if the intersection point is on both (finite) edges of the polygon.
            if (intersectionPoint && lineA.hasPoint(intersectionPoint) && lineB.hasPoint(intersectionPoint)) {
                pointList.push(intersectionPoint);
            }
        }
    }
    return pointList;
};
//# sourceMappingURL=findPolygonSelfIntersections.js.map