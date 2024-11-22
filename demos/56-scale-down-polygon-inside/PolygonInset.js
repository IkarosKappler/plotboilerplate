/**
 *
 * @date 2024-11-04 Ported the script to a class.
 */

(function (_context) {
  // ...
  var PolygonInset = function (polygon) {
    this.polygon = polygon;
    // TODO: clear co-linear polygon edges-
    this.keepInsetPolygonLines = [];
  };

  // Question: what happens if line is completely out of bounds?
  PolygonInset.prototype.expandLineToRectBounds = function (line, boundsRectPolygon) {
    var boundsIntersections = boundsRectPolygon.lineIntersections(line, false);
    if (boundsIntersections.length != 2) {
      // This should not be te case by construction
      console.log(
        "If this happens then the given line is completely outside of the rectangular bounds. No intersections can be calculated. Check your code."
      );
      return null;
    }
    return new Line(boundsIntersections[0], boundsIntersections[1]);
  };

  /**
   * This method transforms each polygon line into a new line
   * by moving it to the inside direction of the polygon (by the given `insetAmount`).
   *
   * @param {Array<Line>} polygonLines
   * @param {number} insetAmount
   * @return {Array<Line>} The transformed lines. The result array has the same length and order as the input array.
   */
  PolygonInset.prototype.collectInsetLines = function (polygonLines, insetAmount) {
    var insetLines = []; // Array<Line>
    for (var i = 0; i < polygonLines.length; i++) {
      var line = polygonLines[i];
      var perp = new Vector(line.a, line.b).perp();
      var t = insetAmount / perp.length();
      var offsetOnPerp = perp.vertAt(t);
      var diff = line.a.difference(offsetOnPerp);
      // Polygon is is clockwise order.
      // Move line inside polygon
      var movedLine = line.clone();
      movedLine.a.add(diff);
      movedLine.b.add(diff);
      insetLines.push(movedLine);
    }
    return insetLines;
  };

  /**
   * For a sequence of inset polygon lines get the inset polygon by detecting
   * useful intersections (by cropping or extending them).
   *
   * The returned lines resemble a new polygon.
   *
   * Please note that the returned polygon can be self-intersecting!
   *
   * @param {Array<Line>} insetLines
   * @returns {Array<Line>} The cropped or exented inset polygon lines.
   */
  PolygonInset.prototype.collectInsetPolygonLines = function (insetLines) {
    if (insetLines.length <= 1) {
      return [];
    }
    var insetPolygonLines = []; // Array<Line>
    // Collect first intersection at beginning :)
    var lastInsetLine = insetLines[insetLines.length - 1];
    var firstInsetLine = insetLines[0];
    var lastIntersectionPoint = lastInsetLine.intersection(firstInsetLine); // Must not be null
    for (var i = 0; i < insetLines.length; i++) {
      var insetLine = insetLines[i];
      // // Get whole line inside poly bounds.
      // var lineInsidePolyBounds = expandLineToRectBounds(insetLine, boundsAsRectPoly);
      // draw.line(lineInsidePolyBounds.a, lineInsidePolyBounds.b, "rgba(0,255,0,0.2)", 1.0);

      var nextInsetLine = insetLines[(i + 1) % insetLines.length];
      // Find desired intersection
      var intersection = insetLine.intersection(nextInsetLine);
      if (intersection == null) {
        console.warn("[collectInsetPolygon] WARN intersection line must not be null", i, nextInsetLine);
      }
      // By construction they MUST have any non-null intersection!
      if (lastIntersectionPoint != null) {
        var resultLine = new Line(lastIntersectionPoint, intersection);
        insetPolygonLines.push(resultLine);
      }
      lastIntersectionPoint = intersection;
    }
    return insetPolygonLines;
  };

  PolygonInset.prototype.collectRectangularPolygonInsets = function (originalPolygonLines, insetLines) {
    // Convert to rectangle polygon
    var insetRectanglePolygons = originalPolygonLines.map(function (polygonLine, index) {
      var rectPolygon = new Polygon([], false);
      // Add in original order
      rectPolygon.vertices.push(polygonLine.a.clone());
      rectPolygon.vertices.push(polygonLine.b.clone());
      // Add in reverse order
      var insetLine = insetLines[index];
      rectPolygon.vertices.push(insetLine.b.clone());
      rectPolygon.vertices.push(insetLine.a.clone());
      return rectPolygon;
    });
    return insetRectanglePolygons;
  };

  // STATIC
  PolygonInset.convertToBasicInsetPolygon = function (insetPolygonLines) {
    var insetPolygon = new Polygon([], false);
    insetPolygonLines.forEach(function (insetLine) {
      insetPolygon.vertices.push(insetLine.a);
    });
    return insetPolygon;
  };

  /**
   *
   * @param {*} insetPolygonLines
   * @param {*} insetLines
   * @param {*} insetRectanglePolygons
   * @param {*} originalPolygon
   * @param {*} keepInsetPolygonLines
   * @returns void
   */
  PolygonInset.prototype.filterLines = function (
    insetPolygonLines,
    insetLines,
    insetRectanglePolygons,
    originalPolygon,
    keepInsetPolygonLines
  ) {
    return insetPolygonLines.filter(function (insetPLine, pLineIndex) {
      // Does the center of the line lay inside an inset rectangle?
      var centerPoint = insetPLine.vertAt(0.5);
      var isInAnyRectangle = insetRectanglePolygons.some(function (rect, rectIndex) {
        return pLineIndex != rectIndex && rect.containsVert(centerPoint);
      });
      var isInsideSourcePolygon = true; //  originalPolygon.containsVert(centerPoint);
      // return !isInAnyRectangle && isInsideSourcePolygon;
      // return true; // true -> Keep
      keepInsetPolygonLines[pLineIndex] = !isInAnyRectangle && isInsideSourcePolygon;
    });
  };

  /**
   *
   * @param {*} insetPolygonLines
   * @param {*} insetLines
   * @param {*} insetRectanglePolygons
   * @param {*} originalPolygon
   * @param {*} keepInsetPolygonLines
   * @returns
   */
  PolygonInset.prototype.clearPolygonByFilteredLines = function (
    insetPolygonLines,
    insetLines,
    insetRectanglePolygons,
    originalPolygon,
    keepInsetPolygonLines
  ) {
    // Clone array
    var resultLines = insetPolygonLines.map(function (line) {
      return new Line(line.a.clone(), line.b.clone());
    });
    var index = 0;
    // for (var i = 0; i < keepInsetPolygonLines.length; i++) {
    var i = 0;
    while (i < resultLines.length && resultLines.length > 2) {
      var keepLine = keepInsetPolygonLines[index++];
      if (keepLine) {
        i++;
        continue;
      }
      console.log("Remove", i);
      // Remove line and crop neighbours
      var leftIndex = (i + resultLines.length - 1) % resultLines.length;
      var rightIndex = (i + 1) % resultLines.length;
      console.log("leftIndex", leftIndex, "rightIndex", rightIndex);
      var leftLine = resultLines[leftIndex];
      var rightLine = resultLines[rightIndex];
      var intersection = leftLine.intersection(rightLine);
      if (intersection == null) {
        console.warn("[clearPolygonByFilteredLines] WARN intersection line must not be null", i, leftLine, rightLine);
      }
      leftLine.b = intersection;
      rightLine.a = intersection.clone();
      resultLines.splice(i, 1);
      // i++;
    }
    return resultLines;
  };

  _context.PolygonInset = PolygonInset;
})(globalThis);
