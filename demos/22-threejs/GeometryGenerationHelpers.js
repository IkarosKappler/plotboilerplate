/**
 * A collection of helper function used to generate dildo meshes.
 *
 * @require sliceGeometry
 *
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
     * @param {THREE.Geometry} geometry - The geometry to add the new faces to.
     * @param {number} a - The current base shape segment index, must be inside [0,baseShapeSegmentCount-1].
     * @param {number} baseShapeSegmentCount - The total number of base shape segments.
     */
    addPyramidalBaseUV3: function (geometry, a, baseShapeSegmentCount) {
      // Create a mirrored texture to avoid hard visual cuts
      var ratioA = 1.0 - Math.abs(0.5 - a / baseShapeSegmentCount) * 2;
      var ratioB = 1.0 - Math.abs(0.5 - (a + 1) / baseShapeSegmentCount) * 2;
      geometry.faceVertexUvs[0].push([new THREE.Vector2(ratioA, 0), new THREE.Vector2(0.5, 1), new THREE.Vector2(ratioB, 0)]);
    },

    /**
     * Flatten an array of 2d vertices into a flat array of coordinates.
     * (required by the earcut algorithm for example).
     *
     * @param {Array<XYCoords>} vertices2d
     * @returns {Array<number>}
     */
    flattenVert2dArray: function (vertices2d) {
      // Array<number>
      var coordinates = [];
      for (var i = 0; i < vertices2d.length; i++) {
        coordinates.push(vertices2d[i].x, vertices2d[i].y);
      }
      return coordinates;
    },

    /**
     * A helper function to create (discrete) circular 2d shapes.
     *
     * @param {number} radius - The radius of the circle.
     * @param {number} pointCount - The number of vertices to construct the circle with.
     * @returns {Polygon}
     */
    mkCircularPolygon: function (radius, pointCount) {
      var vertices = [];
      var phi;
      for (var i = 0; i < pointCount; i++) {
        phi = Math.PI * 2 * (i / pointCount);
        vertices.push(new Vertex(Math.cos(phi) * radius, Math.sin(phi) * radius));
      }
      return new Polygon(vertices, false);
    },

    /**
     * Slice a geometry at the given plane.
     * Note that only the right half (on the positive z axis is kept. To obtain both you
     * need to run the algorithm twice with two flipped planes.
     *
     * @param {DildoGeneration} thisGenerator - The generator to add the mesh to.
     * @param {THREE.Geometry} unbufferedGeometry - The geometry to slice.
     * @param {THREE.PlaneGeometry} plane
     * @param {number} zOffset - The z offset to use for the slice result position.
     */
    makeAndAddSlice: function (thisGenerator, unbufferedGeometry, plane, zOffset) {
      // Slice mesh into two
      // See https://github.com/tdhooper/threejs-slice-geometry
      var closeHoles = false;
      var sliceMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
      var slicedGeometry = sliceGeometry(unbufferedGeometry, plane, closeHoles);
      var slicedMesh = new THREE.Mesh(slicedGeometry, sliceMaterial);
      slicedMesh.position.y = -100;
      slicedMesh.position.z = zOffset;
      slicedMesh.userData["isExportable"] = true;
      thisGenerator.addMesh(slicedMesh);
    },

    makeAndAddPlaneIntersection: function (thisGenerator, mesh, unbufferedGeometry, planeMesh) {
      GeometryGenerationHelpers.makeAndAddMassivePlaneIntersection(thisGenerator, mesh, unbufferedGeometry, planeMesh);
      GeometryGenerationHelpers.makeAndAddHollowPlaneIntersection(thisGenerator, mesh, unbufferedGeometry, planeMesh);
    },

    makeAndAddMassivePlaneIntersection: function (thisGenerator, mesh, unbufferedGeometry, planeMesh) {
      var intersectionPoints = unbufferedGeometry.getPerpendicularPathVertices(true, true); // includeBottom=true, getInner=true
      var pointGeometry = new THREE.Geometry();
      pointGeometry.vertices = intersectionPoints;
      var pointsMaterial = new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 0xff0000,
        opacity: 0.5,
        side: THREE.DoubleSide,
        transparent: true
      });

      // Array<number,number,number,...>
      var polygonData = GeometryGenerationHelpers.flattenVert2dArray(intersectionPoints);

      // Step 3: run Earcut
      var triangleIndices = earcut(polygonData);

      // Step 4: process the earcut result;
      //         add the retrieved triangles as geometry faces.
      for (var i = 0; i + 2 < triangleIndices.length; i += 3) {
        var a = triangleIndices[i];
        var b = triangleIndices[i + 1];
        var c = triangleIndices[i + 2];
        GeometryGenerationHelpers.makeFace3(pointGeometry, a, b, c);
      }

      var pointsMesh = new THREE.Mesh(pointGeometry, pointsMaterial);
      pointsMesh.position.y = -100;
      pointsMesh.position.z = 50;
      thisGenerator.addMesh(pointsMesh);
    },

    makeAndAddHollowPlaneIntersection: function (thisGenerator, mesh, unbufferedGeometry, planeMesh) {
      var pointGeometry = new THREE.Geometry();
      var perpLines = unbufferedGeometry.getPerpendicularHullLines();
      for (var i = 0; i < perpLines.length; i++) {
        var innerPoint = perpLines[i].start;
        var outerPoint = perpLines[i].end;
        pointGeometry.vertices.push(innerPoint, outerPoint);
        var vertIndex = pointGeometry.vertices.length;
        if (i > 0) {
          pointGeometry.faces.push(new THREE.Face3(vertIndex - 4, vertIndex - 2, vertIndex - 3));
          pointGeometry.faces.push(new THREE.Face3(vertIndex - 3, vertIndex - 2, vertIndex - 1));
        }
      }
      var pointsMaterial = new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 0xff0000,
        opacity: 0.5,
        side: THREE.DoubleSide,
        transparent: true
      });
      var pointsMesh = new THREE.Mesh(pointGeometry, pointsMaterial);
      pointsMesh.position.y = -100;
      pointsMesh.position.z = -50;
      thisGenerator.addMesh(pointsMesh);
    },

    /**
     * Add an orange colored line mesh from a spine geometry..
     *
     * @param {DildoGeneration} thisGenerator - The generator to add the new mesh to.
     * @param {THREE.Geometry} spineGeometry - The spine geometry itself.
     */
    addSpine: function (thisGenerator, spineGeometry) {
      var spineMesh = new THREE.LineSegments(
        spineGeometry,
        new THREE.LineBasicMaterial({
          color: 0xff8800
        })
      );
      spineMesh.position.y = -100;
      thisGenerator.addMesh(spineMesh);
    },

    /**
     * This function creates two line-meshes in red and green indicating the perpendicular cut
     * path along the geometry to be sliced.
     *
     * @param {DildoGeneration} thisGenerator - The generator to add the new two meshes to.
     * @param {DildoGeometry} unbufferedLatheGeometry - The dildo geometry to retrieve the perpendicular path from.
     */
    addPerpendicularPaths: function (thisGenerator, unbufferedLatheGeometry) {
      GeometryGenerationHelpers.addPerpendicularPath(thisGenerator, unbufferedLatheGeometry.outerPerpLines, 0xff0000);
      GeometryGenerationHelpers.addPerpendicularPath(thisGenerator, unbufferedLatheGeometry.innerPerpLines, 0x00ff00);
    },

    /**
     * Add the given array of perpendicular lines (perpendicular to the mesh surface along the cut path)
     * as a THREE.LineSegments geometry.
     *
     * @param {DildoGeneration} thisGenerator - The generator to add the created line mesh to.
     * @param {Array<THREE.Line3>} perpLines - The lines to
     * @param {number} materialColor - A color for the material to use (like 0xff0000 for red).
     */
    addPerpendicularPath: function (thisGenerator, perpLines, materialColor) {
      var outerPerpGeometry = new THREE.Geometry();
      perpLines.forEach(function (perpLine) {
        outerPerpGeometry.vertices.push(perpLine.start.clone());
        outerPerpGeometry.vertices.push(perpLine.end.clone());
      });
      var outerPerpMesh = new THREE.LineSegments(
        outerPerpGeometry,
        new THREE.LineBasicMaterial({
          color: materialColor
        })
      );
      outerPerpMesh.position.y = -100;
      thisGenerator.addMesh(outerPerpMesh);
    }
  };
})(globalThis);
