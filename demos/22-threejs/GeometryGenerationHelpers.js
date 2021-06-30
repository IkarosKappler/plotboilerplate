/**
 * @author Ikaros Kappler
 * @date 2021-06-30
 * @version 0.0.1-alpha
 */

(function (_context) {
  _context.GeometryGenerationHelpers = {
    /**
     * Create a (right-turning) triangle of the three vertices at index A, B and C.
     *
     * @param {number} vertIndexA
     * @param {number} vertIndexB
     * @param {number} vertIndexC
     * @param {boolean=false} inverseFaceDirection - If true then the face will have left winding order (instead of right which is the default).
     */
    makeFace3: function (geometry, vertIndexA, vertIndexB, vertIndexC, inverseFaceDirection) {
      // console.log("inverseFaceDirection", inverseFaceDirection);
      if (inverseFaceDirection) {
        geometry.faces.push(new THREE.Face3(vertIndexC, vertIndexB, vertIndexA));
        // this.faces.push(new THREE.Face3(vertIndexA, vertIndexB, vertIndexC));
      } else {
        geometry.faces.push(new THREE.Face3(vertIndexA, vertIndexB, vertIndexC));
      }
    },

    /**
     * Build a triangulated face4 (two face3) for the given vertex indices. The method will create
     * two right-turning triangles by default, or two left-turning triangles if `inverseFaceDirection`.
     *
     * <pre>
     *         A-----B
     *         |   / |
     *         |  /  |
     *         | /   |
     *         C-----D
     * </pre>
     *
     * @param {number} vertIndexA - The first vertex index.
     * @param {number} vertIndexB - The second vertex index.
     * @param {number} vertIndexC - The third vertex index.
     * @param {number} vertIndexD - The fourth vertex index.
     * @param {boolean=false} inverseFaceDirection - If true then the face will have left winding order (instead of right which is the default).
     */
    makeFace4: function (geometry, vertIndexA, vertIndexB, vertIndexC, vertIndexD, inverseFaceDirection) {
      if (inverseFaceDirection) {
        // Just inverse the winding order of both face3 elements
        GeometryGenerationHelpers.makeFace3(geometry, vertIndexA, vertIndexC, vertIndexB, false);
        GeometryGenerationHelpers.makeFace3(geometry, vertIndexC, vertIndexD, vertIndexB, false);
      } else {
        GeometryGenerationHelpers.makeFace3(geometry, vertIndexA, vertIndexB, vertIndexC, false);
        GeometryGenerationHelpers.makeFace3(geometry, vertIndexB, vertIndexD, vertIndexC, false);
      }
    },

    /**
     * Create texture UV coordinates for the rectangular two  triangles at matrix indices a, b, c and d.
     *
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @param {number} outlineSegmentCount - The total number of segments on the outline.
     * @param {number} baseShapeSegmentCount - The total number of segments on the base shape.
     * @param {boolean=false} inverseFaceDirection - If true then the UV mapping is applied in left winding order (instead of right which is the default).
     */
    addCylindricUV4: function (geometry, a, b, c, d, outlineSegmentCount, baseShapeSegmentCount, inverseFaceDirection) {
      if (inverseFaceDirection) {
        // change: abc -> acb
        // change: bdc -> cdb
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(a / outlineSegmentCount, b / baseShapeSegmentCount),
          new THREE.Vector2(a / outlineSegmentCount, d / baseShapeSegmentCount),
          new THREE.Vector2(c / outlineSegmentCount, b / baseShapeSegmentCount)
        ]);
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(a / outlineSegmentCount, d / baseShapeSegmentCount),
          new THREE.Vector2(c / outlineSegmentCount, d / baseShapeSegmentCount),
          new THREE.Vector2(c / outlineSegmentCount, b / baseShapeSegmentCount)
        ]);
      } else {
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(a / outlineSegmentCount, b / baseShapeSegmentCount),
          new THREE.Vector2(c / outlineSegmentCount, b / baseShapeSegmentCount),
          new THREE.Vector2(a / outlineSegmentCount, d / baseShapeSegmentCount)
        ]);
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(c / outlineSegmentCount, b / baseShapeSegmentCount),
          new THREE.Vector2(c / outlineSegmentCount, d / baseShapeSegmentCount),
          new THREE.Vector2(a / outlineSegmentCount, d / baseShapeSegmentCount)
        ]);
      }
    },

    /**
     * Create texture UV coordinates for the triangle at matrix indices a, b and c.
     *
     * @param {*} a
     * @param {*} b
     * @param {*} center
     * @param {*} outlineSegmentCount
     * @param {*} baseShapeSegmentCount
     */
    addPyramidalBaseUV3: function (geometry, a, baseShapeSegmentCount) {
      // Create a mirrored texture to avoid hard visual cuts
      var ratioA = 1.0 - Math.abs(0.5 - a / baseShapeSegmentCount) * 2;
      var ratioB = 1.0 - Math.abs(0.5 - (a + 1) / baseShapeSegmentCount) * 2;
      geometry.faceVertexUvs[0].push([new THREE.Vector2(ratioA, 0), new THREE.Vector2(0.5, 1), new THREE.Vector2(ratioB, 0)]);
    }
  };
})(globalThis);
