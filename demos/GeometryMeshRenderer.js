/**
 * Moved the mesh renderer methods from demo 33-depth-mesh to this class.
 *
 * @require getContrastColor
 * @date 2025-11-17
 */

(function (_context) {
  var D2R = Math.PI / 180;

  var GeometryMeshRenderer = function (config) {
    this.config = config;
  };

  // +---------------------------------------------------------------------------------
  // | This is the part where the magic happens
  // +-------------------------------
  GeometryMeshRenderer.prototype.drawGeometry = function (draw, fill, geometry, options) {
    // var minMax = getMinMax(geometry.vertices);
    var minMax = geometry.getGeometryBounds();
    minMax.min = this.applyScale(minMax.min);
    minMax.max = this.applyScale(minMax.max);

    var transformMatrix0 = Matrix4x4.makeTransformationMatrix(
      this.config.rotationX * D2R,
      this.config.rotationY * D2R,
      this.config.rotationZ * D2R,
      this.config.scaleX,
      this.config.scaleY,
      this.config.scaleZ,
      this.config.translateX,
      this.config.translateY,
      this.config.translateZ
    );
    var transformMatrix1 = Matrix4x4.makeTransformationMatrix(
      this.config.rotationX * D2R,
      this.config.rotationY * D2R,
      this.config.rotationZ * D2R,
      this.config.scaleX,
      this.config.scaleY,
      this.config.scaleZ,
      this.config.translateX + minMax.width * 0.01,
      this.config.translateY,
      this.config.translateZ + minMax.depth * 0.01
    );
    var transformMatrix2 = Matrix4x4.makeTransformationMatrix(
      this.config.rotationX * D2R,
      this.config.rotationY * D2R,
      this.config.rotationZ * D2R,
      this.config.scaleX,
      this.config.scaleY,
      this.config.scaleZ,
      this.config.translateX - minMax.width * 0.01,
      this.config.translateY,
      this.config.translateZ - minMax.depth * 0.01
    );

    if (this.config.useBlendMode) {
      draw.setConfiguration({ blendMode: this.config.blendMode });
      // Use this on black
      this.drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(128, 255, 0));
      this.drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix1, Color.makeRGB(0, 0, 255));
      this.drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix2, Color.makeRGB(255, 0, 0));
      // Use this on white
      // this.drawGeometry(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(128, 0, 255));
      // this.drawGeometry(draw, fill, geometry, minMax, transformMatrix1, Color.makeRGB(255, 255, 0));
      // this.drawGeometry(draw, fill, geometry, minMax, transformMatrix2, Color.makeRGB(0, 255, 255));
    } else {
      // this.drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(92, 92, 92));
      this.drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(192, 192, 192));
    }

    this.drawGeometryVertices(draw, fill, geometry, transformMatrix0, {
      drawVertNumbers: this.config.drawVertNumbers,
      textColor: options.textColor
    });
  };

  // +---------------------------------------------------------------------------------
  // | Draw the edges of a geometry.
  // +-------------------------------
  GeometryMeshRenderer.prototype.drawGeometryEdges = function (draw, fill, geometry, minMax, transformMatrix, colorObject) {
    for (var e in geometry.edges) {
      var a3 = transformMatrix.apply3(geometry.vertices[geometry.edges[e][0]]);
      var b3 = transformMatrix.apply3(geometry.vertices[geometry.edges[e][1]]);

      var a2 = this.applyProjection(a3);
      var b2 = this.applyProjection(b3);

      var tA = this.getThreshold(a3, minMax.min.z, minMax.max.z);
      var tB = this.getThreshold(b3, minMax.min.z, minMax.max.z);
      var threshold = this.config.useDistanceThreshold ? Math.max(0, Math.min(1, Math.min(tA, tB))) : 1.0;

      colorObject.a = threshold;
      draw.line(a2, b2, colorObject.cssRGBA(), this.config.lineWidth);
    }
  };

  // +---------------------------------------------------------------------------------
  // | Draw the vertices and/or vertex number of a geometry.
  // +-------------------------------
  GeometryMeshRenderer.prototype.drawGeometryVertices = function (draw, fill, geometry, transformMatrix, options) {
    for (var v in geometry.vertices) {
      var projected = this.applyProjection(transformMatrix.apply3(geometry.vertices[v]));
      if (this.config.drawVertices) {
        draw.squareHandle(projected, 2, "grey", 1);
      }
      if (options.drawVertNumbers) {
        fill.text("" + v, projected.x + 3, projected.y + 3, { color: options.textColor });
      }
    }
  };

  // +---------------------------------------------------------------------------------
  // | Determine the threshold in [0,1] of the given point.
  // | 1: at camera plane (no distance)
  // | 0: at max distance (as configured)
  // +-------------------------------
  GeometryMeshRenderer.prototype.getThreshold = function (p, far, close) {
    return (far - p.z) / (far - close);
  };

  // +---------------------------------------------------------------------------------
  // | Projects the given 3d point to the 2d plane (just before being rendered).
  // +-------------------------------
  GeometryMeshRenderer.prototype.applyProjection = function (p) {
    var threshold = this.getThreshold(p, this.config.far, this.config.close);
    threshold = Math.max(0, threshold);
    return { x: p.x * threshold, y: p.y * threshold };
  };

  // +---------------------------------------------------------------------------------
  // | We could also do this via a transformation matrix.
  // +-------------------------------
  GeometryMeshRenderer.prototype.applyScale = function (p) {
    p.x *= this.config.scaleX;
    p.y *= this.config.scaleY;
    p.z *= this.config.scaleZ;
    return p;
  };

  _context.GeometryMeshRenderer = GeometryMeshRenderer;
})(globalThis);
