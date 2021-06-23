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
   * @param {boolean} options.makeHollow - Make a hollow mold.
   **/
  var DildoGeometry = function (options) {
    THREE.Geometry.call(this);

    this.vertexMatrix = []; // Array<Array<number>>
    this.topIndex = -1;
    this.bottomIndex = -1;
    this.spineVertices = []; // Array<THREE.Vector>
    this.outerPerps = []; // Array<Three.Line3>
    this.innerPerps = []; // Array<Three.Line3>
    this.leftFlatIndices = []; // Array<number>
    this.rightFlatIndices = []; // Array<number>

    this._buildVertices(options);
    this._buildFaces(options);
    this._buildUVMapping(options);

    // Fill up missing UVs to avoid warning
    while (this.faceVertexUvs[0].length < this.faces.length) {
      this.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0.5, 1)]);
    }
  };

  /**
   * Build up the vertices in this geometry.
   *
   * @param {} options
   */
  DildoGeometry.prototype._buildVertices = function (options) {
    var baseShape = options.baseShape;
    var outline = options.outline;
    var outlineSegmentCount = options.outlineSegmentCount;
    var makeHollow = options.makeHollow;
    var bendAngleRad = (options.bendAngle / 180) * Math.PI;
    var hollowStrength = 15.0;

    var normalizePerpendiculars = Boolean(options.normalizePerpendiculars);
    var normalsLength = typeof options.normalsLength !== "undefined" ? options.normalsLength : 10.0;

    var outlineBounds = outline.getBounds();
    var shapeHeight = outlineBounds.height;
    var shapeBounds = baseShape.getBounds();
    var shapeCenter = shapeBounds.getCenter();
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
      var perpendicularVert = outline.getPerpendicularAt(t);
      var heightT = (outlineBounds.max.y - outlineVert.y) / shapeHeight;
      this.__buildSlice(baseShape, outlineBounds, outlineVert, s, heightT, isBending, bendAngleRad, arcRadius);
      this.__buildSpine(shapeCenter, outlineBounds, outlineVert, heightT, isBending, bendAngleRad, arcRadius);
      this.__buildPerps(
        baseShape,
        outlineBounds,
        outlineVert,
        perpendicularVert,
        heightT,
        isBending,
        bendAngleRad,
        arcRadius,
        normalizePerpendiculars,
        normalsLength
      );
    } // END for

    var topVertex = this._getTopVertex(outlineBounds, isBending, bendAngleRad, arcRadius);
    var bottomVertex = this._getBottomVertex(outlineBounds);

    this.topIndex = this.vertices.length;
    this.vertices.push(topVertex);

    this.bottomIndex = this.vertices.length;
    this.vertices.push(bottomVertex);

    if (makeHollow) {
      // Construct the left and the right flat bounds (used to make a casting mould)
      this.__makeFlatSides(shapeBounds.width / 2.0 + hollowStrength);
      this.__makeHollow();
    }
  };

  /**
   *
   * @param {Polygon} baseShape
   * @param {Vertex} shapeCenter
   * @param {Bounds} outlineBounds
   * @param {THREE.Vertex3} outlineVert
   * @param {number} sliceIndex
   * @param {number} heightT A value between 0.0 and 1.0 (inclusive) to indicate the height position.
   * @param {boolean} isBending
   * @param {number=} bendAngle Must not be null, NaN or infinity if `isBending==true`
   * @param {number=} arcRadius
   * @param {boolean=} normalizePerpendiculars
   * @param {number=} normalsLength
   * @return { yMin: number, yMax : number }
   */
  DildoGeometry.prototype.__buildSlice = function (
    baseShape,
    outlineBounds,
    outlineVert,
    sliceIndex,
    heightT,
    isBending,
    bendAngle,
    arcRadius
  ) {
    var outlineXPct = (outlineBounds.max.x - outlineVert.x) / outlineBounds.width;
    for (var i = 0; i < baseShape.vertices.length; i++) {
      var shapeVert = baseShape.vertices[i];
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

  /**
   *
   * @param {Polygon} baseShape
   * @param {Vertex} shapeCenter
   * @param {Bounds} outlineBounds
   * @param {THREE.Vertex3} outlineVert
   * @param {number} sliceIndex
   * @param {number} heightT A value between 0.0 and 1.0 (inclusive) to indicate the height position.
   * @param {boolean} isBending
   * @param {number=} bendAngle Must not be null, NaN or infinity if `isBending==true`
   * @param {number=} arcRadius
   * @param {boolean=} normalizePerpendiculars
   * @param {number=} normalsLength
   * @return { yMin: number, yMax : number }
   */
  DildoGeometry.prototype.__buildSpine = function (
    shapeCenter,
    outlineBounds,
    outlineVert,
    heightT,
    isBending,
    bendAngle,
    arcRadius
  ) {
    var outlineXPct = (outlineBounds.max.x - outlineVert.x) / outlineBounds.width;

    // Find shape's center point to construct a spine
    var spineVert = shapeCenter.clone();
    if (isBending) {
      var vert = new THREE.Vector3(spineVert.x * outlineXPct, 0, spineVert.y * outlineXPct);
      this._bendVertex(vert, bendAngle, arcRadius, heightT);
      vert.y += outlineBounds.max.y;
    } else {
      var vert = new THREE.Vector3(spineVert.x * outlineXPct, outlineVert.y, spineVert.y * outlineXPct);
    }
    this.spineVertices.push(vert);
  };

  /**
   *
   * @param {Polygon} baseShape
   * @param {Vertex} shapeCenter
   * @param {Bounds} outlineBounds
   * @param {THREE.Vertex3} outlineVert
   * @param {number} sliceIndex
   * @param {number} heightT A value between 0.0 and 1.0 (inclusive) to indicate the height position.
   * @param {boolean} isBending
   * @param {number=} bendAngle Must not be null, NaN or infinity if `isBending==true`
   * @param {number=} arcRadius
   * @param {boolean=} normalizePerpendiculars
   * @param {number=} normalsLength
   * @return { yMin: number, yMax : number }
   */
  DildoGeometry.prototype.__buildPerps = function (
    baseShape,
    outlineBounds,
    outlineVert,
    perpendicularVert,
    heightT,
    isBending,
    bendAngle,
    arcRadius,
    normalizePerpendiculars,
    normalsLength
  ) {
    var outlineXPct = (outlineBounds.max.x - outlineVert.x) / outlineBounds.width;
    var halfIndices = [0, Math.floor(baseShape.vertices.length / 2)];
    for (var j = 0; j < halfIndices.length; j++) {
      var i = halfIndices[j];
      var shapeVert = baseShape.vertices[i];
      if (isBending) {
        var vert = new THREE.Vector3(shapeVert.x * outlineXPct, 0, shapeVert.y * outlineXPct);
        this._bendVertex(vert, bendAngle, arcRadius, heightT);
        vert.y += outlineBounds.max.y;
      } else {
        var vert = new THREE.Vector3(shapeVert.x * outlineXPct, outlineVert.y, shapeVert.y * outlineXPct);
      }

      var perpDifference = new THREE.Vector3(outlineVert.x - perpendicularVert.x, outlineVert.y - perpendicularVert.y, 0);

      if (i == 0) var endVert = new THREE.Vector3(vert.x - perpendicularVert.x, vert.y + perpendicularVert.y, 0);
      else var endVert = new THREE.Vector3(vert.x + perpendicularVert.x, vert.y + perpendicularVert.y, 0);
      rotateVert(endVert, bendAngle * heightT, vert.x, vert.y);
      var outerPerpVert = vert.clone();
      outerPerpVert.x += perpDifference.x;
      outerPerpVert.y += perpDifference.y;
      outerPerpVert.z += perpDifference.z;
      if (normalizePerpendiculars) {
        normalizeVectorXY(vert, endVert, normalsLength);
      }
      if (i == 0) {
        this.outerPerps.push(new THREE.Line3(vert, endVert));
      } else {
        this.innerPerps.push(new THREE.Line3(vert, endVert));
      }
    } // END for
  };

  /**
   * Pre: perpLines are already built.
   *
   * Note: the last indices in the array will show to the point equivalent to the bottom point.
   *
   * @param {*} options
   */
  DildoGeometry.prototype.__makeFlatSides = function (shapeRadius) {
    // We are using the earcut algorithm here
    //  + create an outline of the perpendicular end points
    //  + shift the outline to the left bound of the mesh
    //  + run earcut
    //  + add all triangle faces
    //  + create a copy of the vertices and the triangulation the the right side

    // Step 1: serialize the 2d vertex data along the perpendicular path
    var polygonData = [];
    for (var i = 0; i < this.innerPerps.length; i++) {
      polygonData.push(this.innerPerps[i].end.x);
      polygonData.push(this.innerPerps[i].end.y);
    }
    for (var i = this.outerPerps.length - 1; i >= 0; i--) {
      polygonData.push(this.outerPerps[i].end.x);
      polygonData.push(this.outerPerps[i].end.y);
    }
    // Also add base point at last index
    polygonData.push(this.vertices[this.bottomIndex].x);
    polygonData.push(this.vertices[this.bottomIndex].y);

    // Step 2: Add the 3d vertices to this geometry
    var _self = this;
    for (var i = 0; i < polygonData.length; i += 2) {
      this.leftFlatIndices.push(_self.vertices.length);
      _self.vertices.push(new THREE.Vector3(polygonData[i], polygonData[i + 1], shapeRadius));
    }
    for (var i = 0; i < polygonData.length; i += 2) {
      this.rightFlatIndices.push(_self.vertices.length);
      _self.vertices.push(new THREE.Vector3(polygonData[i], polygonData[i + 1], -shapeRadius));
    }

    // Step 3: run Earcut
    var triangleIndices = earcut(polygonData);

    // Step 4: process the earcut result;
    //         add the retrieved triangles as geometry faces.
    for (var i = 0; i + 2 < triangleIndices.length; i += 3) {
      var a = triangleIndices[i];
      var b = triangleIndices[i + 1];
      var c = triangleIndices[i + 2];
      this.makeFace3(this.leftFlatIndices[a], this.leftFlatIndices[b], this.leftFlatIndices[c]);
      this.makeFace3(this.rightFlatIndices[a], this.rightFlatIndices[c], this.rightFlatIndices[b]);
    }
  };

  /**
   * Pre: flatSides are made
   *
   * @param {*} options
   */
  DildoGeometry.prototype.__makeHollow = function () {
    // Connect left and right side (important: ignore bottom vertex at last index)
    for (var i = 1; i + 1 < this.leftFlatIndices.length; i++) {
      this.makeFace4(
        this.leftFlatIndices[i],
        this.leftFlatIndices[i - 1],
        this.rightFlatIndices[i],
        this.rightFlatIndices[i - 1]
      );
    }
  };

  /**
   * Construct the top vertex that's used to closed the cylinder geometry at the top.
   *
   * @param {plotboilerplate.Bounds} outlineBounds
   * @param {boolean} isBending
   * @param {number|NaN|undefined} bendAngle
   * @param {number|undefined} arcRadius
   * @returns THREE.Vector
   */
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

  /**
   * Construct the bottom vertex that's used to closed the cylinder geometry at the bottom.
   *
   * @param {plotboilerplate.Bounds} outlineBounds
   * @param {boolean} isBending
   * @returns THREE.Vector
   */
  DildoGeometry.prototype._getBottomVertex = function (outlineBounds) {
    var bottomPoint = new THREE.Vector3(0, outlineBounds.max.y, 0);
    // if (isBending) {
    // No need to bend the bottom point (no effect)
    // this._bendVertex(bottomPoint, bendAngle, arcRadius, 0.0);
    // }
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

  var rotateVert = function (vert, angle, xCenter, yCenter) {
    var axis = new THREE.Vector3(0, 0, 1);
    vert.x -= xCenter;
    vert.y -= yCenter;
    vert.applyAxisAngle(axis, angle);
    vert.x += xCenter;
    vert.y += yCenter;
    return vert;
  };

  var normalizeVectorXY = function (base, extend, normalLength) {
    var diff = { x: extend.x - base.x, y: extend.y - base.y }; // XYCoords
    var length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    var ratio = normalLength / length;
    extend.x = base.x + diff.x * ratio;
    extend.y = base.y + diff.y * ratio;
  };

  /**
   * Build up the faces for this geometry.
   * @param {*} options
   */
  DildoGeometry.prototype._buildFaces = function (options) {
    var baseShape = options.baseShape;
    var outlineSegmentCount = options.outlineSegmentCount;
    var closeTop = Boolean(options.closeTop);
    var closeBottom = Boolean(options.closeBottom);

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

    closeBottom && this._buildEndFaces(this.bottomIndex, 0, baseShapeSegmentCount);
    closeTop && this._buildEndFaces(this.topIndex, this.vertexMatrix.length - 1, baseShapeSegmentCount);
  };

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
      this.makeFace3(this.vertexMatrix[shapeIndex][i - 1], endVertexIndex, this.vertexMatrix[shapeIndex][i]);
      if (i + 1 == baseShapeSegmentCount) {
        this.makeFace3(this.vertexMatrix[shapeIndex][i], endVertexIndex, this.vertexMatrix[shapeIndex][0]);
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
  DildoGeometry.prototype._buildUVMapping = function (options) {
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
      this.addBaseUV3(i - 1, baseShapeSegmentCount);
      if (i + 1 == baseShapeSegmentCount) {
        // Close the gap on the shape
        this.addBaseUV3(0, baseShapeSegmentCount);
      }
    }

    // Build UV mapping for the top (closing element)
    var lastIndex = outlineSegmentCount - 1;
    for (var i = 1; i < baseShapeSegmentCount; i++) {
      this.addBaseUV3(i - 1, baseShapeSegmentCount);
      if (i + 1 == baseShapeSegmentCount) {
        // Close the gap on the shape
        this.addBaseUV3(lastIndex, baseShapeSegmentCount);
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
  DildoGeometry.prototype.addBaseUV3 = function (a, baseShapeSegmentCount) {
    // Create a mirrored texture to avoid hard visual cuts
    var ratioA = 1.0 - Math.abs(0.5 - a / baseShapeSegmentCount) * 2;
    var ratioB = 1.0 - Math.abs(0.5 - (a + 1) / baseShapeSegmentCount) * 2;
    // this.faceVertexUvs[0].push([new THREE.Vector2(ratioA, 0), new THREE.Vector2(ratioB, 0), new THREE.Vector2(0.5, 1)]);
    this.faceVertexUvs[0].push([new THREE.Vector2(ratioA, 0), new THREE.Vector2(0.5, 1), new THREE.Vector2(ratioB, 0)]);
  };

  // Expose the constructor to the global context.
  window.DildoGeometry = DildoGeometry;
})();
