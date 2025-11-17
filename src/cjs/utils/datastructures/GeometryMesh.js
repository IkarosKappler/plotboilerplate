"use strict";
/**
 * Adapted from the 3D geometry datastuctured from demo-33 (depth mesh).
 *
 * Refactored the strucure into a class.
 *
 * @author  Ikaros Kappler
 * @date    2025-11-14
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryMesh = void 0;
var GeometryMesh = /** @class */ (function () {
    function GeometryMesh(vertices, edges) {
        this.vertices = vertices || [];
        this.edges = edges || [];
    }
    return GeometryMesh;
}());
exports.GeometryMesh = GeometryMesh;
//# sourceMappingURL=GeometryMesh.js.map