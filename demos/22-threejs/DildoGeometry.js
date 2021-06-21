/**
 * @require THREE.Geometry
 *
 * @author   Ikaros Kappler
 * @date     2020-07-08
 * @modified 2021-06-11 Fixing top and bottom points; preparing slicing of mesh.
 * @version  1.0.1
 **/

(function () {
  /**
   * Create a new dildo geometry from the passed options..
   *
   * @param {Polygon} options.baseShape - The base shape to use (this is usually some regular polygon).
   * @param {BezierPath} options.outline - The lathe outline to use.
   * @param {number} options.bendAngle - A bend angle (in degrees!). Will only be applied if isBending=true.
   * @param {number} options.outlineSegmentCount (>= 2).
   * @param {boolean} options.isBending - Switch bending on/off no matter what the bend angle says.
   **/
  var DildoGeometry = function (options) {
    THREE.Geometry.call(this);

    // Array<Array<number>>
    this.vertexMatrix = [];
    this.topIndex = -1;
    this.bottomIndex = -1;

    this.buildVertices(options);
    this.buildFaces(options);
    this.buildUVMapping(options);
  };

  /**
   * Build up the vertices in this geometry.
   *
   * @param {} options
   */
  DildoGeometry.prototype.buildVertices = function (options) {
    var baseShape = options.baseShape;
    var outline = options.outline;
    var outlineSegmentCount = options.outlineSegmentCount;
    var bendAngleRad = (options.bendAngle / 180) * Math.PI;
    var outlineBounds = outline.getBounds();
    var shapeHeight = outlineBounds.height;

    // options.isBending = true;
    var arcLength = shapeHeight;
    var arcRadius = arcLength / bendAngleRad;
    var isBending =
      options.isBending &&
      !isNaN(arcRadius) &&
      arcRadius !== Number.POSITIVE_INFINITY &&
      arcRadius !== Number.NEGATIVE_INFINITY &&
      Math.abs(bendAngleRad) > 0.01;

    for (var s = 0; s < outlineSegmentCount; s++) {
      var t = Math.min(1.0, Math.max(0.0, s / (outlineSegmentCount - 1)));
      this.vertexMatrix[s] = [];
      var outlineVert = outline.getPointAt(t);
      var heightT = (outlineBounds.max.y - outlineVert.y) / shapeHeight;
      this.buildSlice(baseShape, outlineBounds, outlineVert, s, heightT, isBending, bendAngleRad, arcRadius);
    } // END for

    var topVertex = this._getTopVertex(outlineBounds, isBending, bendAngleRad, arcRadius);
    var bottomVertex = this._getBottomVertex(outlineBounds, isBending, bendAngleRad, arcRadius);

    this.topIndex = this.vertices.length;
    this.vertices.push(topVertex);

    this.bottomIndex = this.vertices.length;
    this.vertices.push(bottomVertex);
  };

  /**
   *
   * @param {Polygon} baseShape
   * @param {Bounds} outlineBounds
   * @param {THREE.Vertex3} outlineVert
   * @param {number} sliceIndex
   * @param {number} heightT A value between 0.0 and 1.0 (inclusive) to indicate the height position.
   * @param {boolean} isBending
   * @param {number=} bendAngle Must not be null, NaN or infinity if `isBending==true`
   * @param {number=} arcRadius
   * @return { yMin: number, yMax : number }
   */
  DildoGeometry.prototype.buildSlice = function (
    baseShape,
    outlineBounds,
    outlineVert,
    sliceIndex,
    heightT,
    isBending,
    bendAngle,
    arcRadius
  ) {
    for (var i = 0; i < baseShape.vertices.length; i++) {
      var shapeVert = baseShape.vertices[i];
      var outlineXPct = (outlineBounds.max.x - outlineVert.x) / outlineBounds.width;
      if (isBending) {
        var vert = new THREE.Vector3(shapeVert.x * outlineXPct, 0, shapeVert.y * outlineXPct);
        this._bendVertex(vert, bendAngle, arcRadius, heightT);
        vert.y += outlineBounds.max.y;
      } else {
        var vert = new THREE.Vector3(shapeVert.x * outlineXPct, outlineVert.y, shapeVert.y * outlineXPct);
      }
      this.vertexMatrix[sliceIndex][i] = this.vertices.length;
      this.vertices.push(vert);
      if (sliceIndex == 0) {
        if (i == 0) yMin = vert.y;
        if (i + 1 == baseShape.vertices.length) yMax = vert.y;
      }
    } // END for
  };

  DildoGeometry.prototype._getTopVertex = function (outlineBounds, isBending, bendAngle, arcRadius) {
    if (isBending) {
      var topPoint = new THREE.Vector3(0, 0, 0);
      this._bendVertex(topPoint, bendAngle, arcRadius, 1.0);
      topPoint.y += outlineBounds.max.y;
      return topPoint;
    } else {
      return new THREE.Vector3(0, outlineBounds.min.y, 0);
    }
  };

  DildoGeometry.prototype._getBottomVertex = function (outlineBounds, isBending, bendAngle, arcRadius) {
    var bottomPoint = new THREE.Vector3(0, outlineBounds.max.y, 0);
    if (isBending) {
      // No need to bend the bottom point (no effect)
      // this._bendVertex(bottomPoint, bendAngle, arcRadius, 0.0);
    }
    return bottomPoint;
  };

  /**
   * A helper function to 'bend' a vertex position around the desired bend axis (angle + radius).
   * @private
   * @param {} vert
   * @param {*} bendAngle
   * @param {*} arcRadius
   * @param {*} heightT
   */
  DildoGeometry.prototype._bendVertex = function (vert, bendAngle, arcRadius, heightT) {
    var axis = new THREE.Vector3(0, 0, 1);
    var angle = bendAngle * heightT;
    // Move slice point along radius, rotate, then move back
    // (equivalent to rotation around arc center)
    vert.x -= arcRadius;
    vert.applyAxisAngle(axis, angle);
    vert.x += arcRadius;
  };

  /**
   * Build up the faces for this geometry.
   * @param {*} options
   */
  DildoGeometry.prototype.buildFaces = function (options) {
    var baseShape = options.baseShape;
    var outlineSegmentCount = options.outlineSegmentCount;
    var baseShapeSegmentCount = baseShape.vertices.length;

    this.faceVertexUvs[0] = [];

    for (var s = 0; s < outlineSegmentCount; s++) {
      for (var i = 0; i < baseShapeSegmentCount; i++) {
        if (s > 0) {
          if (i > 0) {
            this.addFace4ByIndices(s, i - 1, s - 1, i, outlineSegmentCount, baseShape.vertices.length);
            if (i + 1 == baseShape.vertices.length) {
              // Close the gap on the shape
              this.addFace4ByIndices(s, i, s - 1, 0, outlineSegmentCount, baseShape.vertices.length);
            }
          }
        }
      } // END for
    } // END for

    // // Close at bottom.
    // for (var i = 1; i < baseShapeSegmentCount; i++) {
    //   this.makeFace3(
    //     this.vertexMatrix[0][i - 1], // s=0
    //     this.vertexMatrix[0][i],
    //     this.bottomIndex
    //   );
    //   if (i + 1 == baseShapeSegmentCount) {
    //     this.makeFace3(
    //       this.vertexMatrix[0][0], // s=0
    //       this.vertexMatrix[0][i],
    //       this.bottomIndex
    //     );
    //   }
    // }
    // this._buildBottomFaces(baseShapeSegmentCount);
    // // Close at top.
    // for (var i = 1; i < baseShapeSegmentCount; i++) {
    //   const lastIndex = this.vertexMatrix.length - 1;
    //   this.makeFace3(
    //     this.vertexMatrix[lastIndex][i - 1], // s=0
    //     this.vertexMatrix[lastIndex][i],
    //     this.topIndex
    //   );
    //   if (i + 1 == baseShapeSegmentCount) {
    //     this.makeFace3(
    //       this.vertexMatrix[lastIndex][0], // s=0
    //       this.vertexMatrix[lastIndex][i],
    //       this.topIndex
    //     );
    //   }
    // }
    // this._buildTopFaces(baseShapeSegmentCount);
    this._buildEndFaces(this.bottomIndex, 0, baseShapeSegmentCount);
    this._buildEndFaces(this.topIndex, this.vertexMatrix.length - 1, baseShapeSegmentCount);
  };

  // DildoGeometry.prototype._buildBottomFaces = function (baseShapeSegmentCount) {
  //   // Close at bottom.
  //   for (var i = 1; i < baseShapeSegmentCount; i++) {
  //     this.makeFace3(
  //       this.vertexMatrix[0][i - 1], // s=0
  //       this.vertexMatrix[0][i],
  //       this.bottomIndex
  //     );
  //     if (i + 1 == baseShapeSegmentCount) {
  //       this.makeFace3(
  //         this.vertexMatrix[0][0], // s=0
  //         this.vertexMatrix[0][i],
  //         this.bottomIndex
  //       );
  //     }
  //   }
  // };

  // DildoGeometry.prototype._buildTopFaces = function (baseShapeSegmentCount) {
  //   // Close at top.
  //   for (var i = 1; i < baseShapeSegmentCount; i++) {
  //     const lastIndex = this.vertexMatrix.length - 1;
  //     this.makeFace3(
  //       this.vertexMatrix[lastIndex][i - 1], // s=0
  //       this.vertexMatrix[lastIndex][i],
  //       this.topIndex
  //     );
  //     if (i + 1 == baseShapeSegmentCount) {
  //       this.makeFace3(
  //         this.vertexMatrix[lastIndex][0], // s=0
  //         this.vertexMatrix[lastIndex][i],
  //         this.topIndex
  //       );
  //     }
  //   }
  // };

  /**
   * Build the face and the top or bottom end of the geometry. Imagine the dildo geometry
   * as a closed cylinder: this function created the top or the bottom 'circle'.
   *
   * @param {number} endVertexIndex - This should be `this.topIndex` or `this.bottomIndex`.
   * @param {number} shapeIndex - This should be `0` (top) or `outlineSegmentCount-1` (bottom).
   * @param {number} baseShapeSegmentCount - The number of shape segments.
   */
  DildoGeometry.prototype._buildEndFaces = function (endVertexIndex, shapeIndex, baseShapeSegmentCount) {
    // Close at top.
    for (var i = 1; i < baseShapeSegmentCount; i++) {
      this.makeFace3(this.vertexMatrix[shapeIndex][i - 1], this.vertexMatrix[shapeIndex][i], endVertexIndex);
      if (i + 1 == baseShapeSegmentCount) {
        this.makeFace3(this.vertexMatrix[shapeIndex][0], this.vertexMatrix[shapeIndex][i], endVertexIndex);
      }
    }
  };

  /**
   * Build the texture UV mapping for all faces.
   *
   * @param {Polygon} options.baseShape
   * @param {number} options.outlineSegmentCount
   * @param {number} options.vertices.length
   */
  DildoGeometry.prototype.buildUVMapping = function (options) {
    var baseShape = options.baseShape;
    var outlineSegmentCount = options.outlineSegmentCount;
    var baseShapeSegmentCount = baseShape.vertices.length;

    // https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
    for (var s = 1; s < outlineSegmentCount; s++) {
      for (var i = 1; i < baseShape.vertices.length; i++) {
        this.addUV4(s, i - 1, s - 1, i, outlineSegmentCount, baseShapeSegmentCount);
        if (i + 1 == baseShape.vertices.length) {
          // Close the gap on the shape
          this.addUV4(s, i, s - 1, 0, outlineSegmentCount, baseShapeSegmentCount);
        }
      }
    }

    // Build UV mapping for the base
    for (var i = 1; i < baseShapeSegmentCount; i++) {
      this.addBaseUV3(i - 1, /* i, 0, outlineSegmentCount, */ baseShapeSegmentCount);
      if (i + 1 == baseShapeSegmentCount) {
        // Close the gap on the shape
        this.addBaseUV3(0, /* 0, i, outlineSegmentCount, */ baseShapeSegmentCount);
      }
    }

    // Build UV mapping for the top (closing element)
    var lastIndex = outlineSegmentCount - 1;
    for (var i = 1; i < baseShapeSegmentCount; i++) {
      this.addBaseUV3(i - 1, /* i, lastIndex, outlineSegmentCount, */ baseShapeSegmentCount);
      if (i + 1 == baseShapeSegmentCount) {
        // Close the gap on the shape
        this.addBaseUV3(lastIndex, /* lastIndex, i, outlineSegmentCount, */ baseShapeSegmentCount);
      }
    }

    this.uvsNeedUpdate = true;
  };

  /**
   * Build a triangulated face4 (two face3) for the given matrix index pairs. The method will create
   * two right-turning triangles.
   *
   * <pre>
   *       (a,b)---(c,b)
   *         |    /  |
   *         |   /   |
   *         |  /    |
   *       (a,d)---(c,d)
   * </pre>
   *
   * @param {number} a - The first primary index in the `vertexMatrix` array.
   * @param {number} b - The first seconday index in the `vertexMatrix[a]` array.
   * @param {number} c - The second primary index in the `vertexMatrix` array.
   * @param {number} d - The second seconday index in the `vertexMatrix[c]` array.
   */
  DildoGeometry.prototype.addFace4ByIndices = function (a, b, c, d) {
    this.makeFace4(this.vertexMatrix[a][b], this.vertexMatrix[c][b], this.vertexMatrix[a][d], this.vertexMatrix[c][d]);
  };

  /**
   * Build a triangulated face4 (two face3) for the given vertex indices. The method will create
   * two right-turning triangles.
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
   */
  DildoGeometry.prototype.makeFace4 = function (vertIndexA, vertIndexB, vertIndexC, vertIndexD) {
    this.makeFace3(vertIndexA, vertIndexB, vertIndexC);
    this.makeFace3(vertIndexB, vertIndexD, vertIndexC);
  };

  /**
   * Create a (right-turning) triangle of the three vertices at index A, B and C.
   *
   * @param {number} vertIndexA
   * @param {number} vertIndexB
   * @param {number} vertIndexC
   */
  DildoGeometry.prototype.makeFace3 = function (vertIndexA, vertIndexB, vertIndexC) {
    this.faces.push(new THREE.Face3(vertIndexA, vertIndexB, vertIndexC));
  };

  /**
   * Create texture UV coordinates for the rectangular two  triangles at matrix indices a, b, c and d.
   *
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} outlineSegmentCount - The total number of segments on the outline.
   * @param {number} baseShapeSegmentCount - The total number of segments on the base shape.
   */
  DildoGeometry.prototype.addUV4 = function (a, b, c, d, outlineSegmentCount, baseShapeSegmentCount) {
    this.faceVertexUvs[0].push([
      new THREE.Vector2(a / outlineSegmentCount, b / baseShapeSegmentCount),
      new THREE.Vector2(c / outlineSegmentCount, b / baseShapeSegmentCount),
      new THREE.Vector2(a / outlineSegmentCount, d / baseShapeSegmentCount)
    ]);
    this.faceVertexUvs[0].push([
      new THREE.Vector2(c / outlineSegmentCount, b / baseShapeSegmentCount),
      new THREE.Vector2(c / outlineSegmentCount, d / baseShapeSegmentCount),
      new THREE.Vector2(a / outlineSegmentCount, d / baseShapeSegmentCount)
    ]);
  };

  /**
   * Create texture UV coordinates for the triangle at matrix indices a, b and c.
   *
   * @param {*} a
   * @param {*} b
   * @param {*} center
   * @param {*} outlineSegmentCount
   * @param {*} baseShapeSegmentCount
   */
  DildoGeometry.prototype.addBaseUV3 = function (a, /* b, center, outlineSegmentCount, */ baseShapeSegmentCount) {
    // Create a mirrored texture to avoid hard visual cuts
    var ratioA = 1.0 - Math.abs(0.5 - a / baseShapeSegmentCount) * 2;
    var ratioB = 1.0 - Math.abs(0.5 - (a + 1) / baseShapeSegmentCount) * 2;
    this.faceVertexUvs[0].push([new THREE.Vector2(ratioA, 0), new THREE.Vector2(ratioB, 0), new THREE.Vector2(0.5, 1)]);
  };

  // Expose the constructor to the global context.
  window.DildoGeometry = DildoGeometry;
})();
