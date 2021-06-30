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
    },

    /**
     * TODO: move to helper class
     *
     * @param {Array<XYCoords>} vertices2d
     * @returns
     */
    flattenVert2dArray: function (vertices2d) {
      // Array<number>
      var coordinates = [];
      for (var i = 0; i < vertices2d.length; i++) {
        coordinates.push(vertices2d[i].x, vertices2d[i].y);
      }
      return coordinates;
    }

    /**
     * Convert the triangles (array of vertex indices) from a triangulation result to face3 elements
     * inside the geometry.
     *
     * It is required that the vertices were already added; the mapping from the triangles to the
     * vertices must be in the `flatIndices` array.
     *
     * The `triangleIndices` is expected to be a flat mapping:
     *  [t1a, t1b, t1c,   t2a, t2b, t2c,  ...,  tna, tnb, tnc]
     *   -Triplet 1-      -Triplet 2-     ...   -Triplet n-
     *
     * @param {THREE.Geometry} geometry - The geometry to add the faces to.
     * @param {Array<number>} triangleIndices - A flat sequence of index triplets.
     * @param {Array<number>} flatIndices - A mapping of triangle vertex indices in [0...m] to vertex indices [0...k] inside the geometry.
     * @param {Array<[number,number,number]>} resultTriangleIndices - Remember the result mapping of final triangle faces.
     */
    // addTriangleFaces: function (geometry, triangleIndices, flatIndices, resultTriangleIndices) {
    //   // var resultTriangleIndices = [];
    //   for (var i = 0; i + 2 < triangleIndices.length; i += 3) {
    //     var a = triangleIndices[i];
    //     var b = triangleIndices[i + 1];
    //     var c = triangleIndices[i + 2];
    //     // this.makeFace3(this.leftFlatIndices[a], this.leftFlatIndices[b], this.leftFlatIndices[c]);
    //     GeometryGenerationHelpers.makeFace3(geometry, flatIndices[a], flatIndices[b], flatIndices[c]);
    //     // this.leftFlatTriangleIndices.push([this.leftFlatIndices[a], this.leftFlatIndices[b], this.leftFlatIndices[c]]);
    //     resultTriangleIndices.push([flatIndices[a], flatIndices[b], flatIndices[c]]);
    //   }
    //   return resultTriangleIndices;
    // }
  };
})(globalThis);
