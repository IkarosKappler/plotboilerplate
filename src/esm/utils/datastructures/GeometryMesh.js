/**
 * Adapted from the 3D geometry datastuctured from demo-33 (depth mesh).
 *
 * Refactored the strucure into a class.
 *
 * @author   Ikaros Kappler
 * @date     2025-11-14
 * @modified 2025-11-17 Moved `getBounds` and `normalizeGeometry` from helper functions to this class.
 * @version  1.0.0
 */
export class GeometryMesh {
    constructor(vertices, edges) {
        this.vertices = vertices || [];
        this.edges = edges || [];
    }
    normalize() {
        // Desired bounds is a max bounding box. The object will be scaled keeping aspect ratio
        // in that way that the largest axis size touches the desired bounds.
        var desiredBounds = { min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } };
        var bounds = this.getGeometryBounds();
        var sizeX = bounds.max.x - bounds.min.x;
        var sizeY = bounds.max.y - bounds.min.y;
        var sizeZ = bounds.max.z - bounds.min.z;
        // Scale uniform so the dimension with the max expansion fits into [-1,1]
        var maxDimension = Math.max(sizeX, sizeY, sizeZ);
        var desiredSizeX = (desiredBounds.max.x - desiredBounds.min.x) / maxDimension;
        var desiredSizeY = (desiredBounds.max.y - desiredBounds.min.y) / maxDimension;
        var desiredSizeZ = (desiredBounds.max.z - desiredBounds.min.z) / maxDimension;
        for (var i in this.vertices) {
            var vert = this.vertices[i]; // TODO: Check if this is safe
            vert.x = desiredBounds.min.x + (bounds.max.x - vert.x) * desiredSizeX;
            vert.y = desiredBounds.min.y + (bounds.max.y - vert.y) * desiredSizeY;
            vert.z = desiredBounds.min.z + (bounds.max.z - vert.z) * desiredSizeZ;
        }
    }
    getGeometryBounds() {
        // var min = new Vert3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        // var max = new Vert3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
        var min = { x: Number.MAX_VALUE, y: Number.MAX_VALUE, z: Number.MAX_VALUE };
        var max = { x: Number.MIN_VALUE, y: Number.MIN_VALUE, z: Number.MIN_VALUE };
        for (var i in this.vertices) {
            var vert = this.vertices[i];
            min.x = Math.min(vert.x, min.x);
            min.y = Math.min(vert.y, min.y);
            min.z = Math.min(vert.z, min.z);
            max.x = Math.max(vert.x, max.x);
            max.y = Math.max(vert.y, max.y);
            max.z = Math.max(vert.z, max.z);
        }
        return { min: min, max: max };
    }
}
//# sourceMappingURL=GeometryMesh.js.map