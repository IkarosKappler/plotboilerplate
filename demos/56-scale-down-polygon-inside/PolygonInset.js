/**
 * Calculate the inset of any polygon.
 *
 * Input: A polygon and an offset amount. May be negative.
 * Output: A sequence of vertice-lists, each representin an inset polygon. May be empty.
 *
 * @required sutherlandHodgman
 * @required splitPolygonToNonIntersecting
 *
 * @date 2024-11-04 Ported the script to a class.
 */

(function (_context) {
  // ...
  var PolygonInset = function (polygon) {
    this.polygon = polygon;
    // Array<Lines>
    this.insetLines = [];
    // Array<Line>
    this.originalPolygonLines = [];
    // TODO: clear co-linear polygon edges-
    this.keepInsetPolygonLines = [];
    // Array<Line>
    this.insetPolygonLines = [];
    // Array<Array<Vertex>>
    this.splitPolygons = [];
    // Polygon
    this.insetPolygon = null;
    // Array<Polygon> with 4 vertices each
    this.insetRectanglePolygons = null;
    // Array<Array<Vertex>>
    this.filteredSplitPolygons;
  };

  // TODO: use options object
  PolygonInset.prototype.computeOutputPolygons = function (innerPolygonOffset, maxPolygonSplitDepth, intersectionEpsilon) {
    if (typeof maxPolygonSplitDepth === "undefined") {
      maxPolygonSplitDepth = this.polygon.vertices.length;
    }
    this.originalPolygonLines = this.polygon.getLines();
    this.collectInsetLines(this.originalPolygonLines, innerPolygonOffset);
    this.collectInsetPolygonLines(this.insetLines);
    this.insetPolygon = PolygonInset.convertToBasicInsetPolygon(this.insetPolygonLines);
    this.insetRectanglePolygons = this.collectRectangularPolygonInsets(this.originalPolygonLines, this.insetLines);

    // Array<Array<Vertex>>
    // var maxPolygonSplitDepth = 10;
    this.splitPolygons = splitPolygonToNonIntersecting(this.insetPolygon.vertices, maxPolygonSplitDepth, true); // insideBoundsOnly

    // This method was initially meant to calculate inset-polygons only.
    // But with a simple filter we COULD also create outer offset-polygons.
    // Maybe this is a task for the future
    this.filteredSplitPolygons = PolygonInset._filterInnerSplitPolygonsByCoverage(
      this.splitPolygons,
      this.insetRectanglePolygons,
      intersectionEpsilon
    );
    this.filteredSplitPolygons = PolygonInset._filterInnerSplitPolygonsByOriginalBounds(this.filteredSplitPolygons, this.polygon);
    return this.filteredSplitPolygons;
    // return this.splitPolygons;
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
    this.insetLines = insetLines;
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
    this.insetPolygonLines = insetPolygonLines;
    return insetPolygonLines;
  };

  /**
   * Converts two lists (same length) of original polygon lines and inset lines (interpreted as
   * pairs) to a list of rectangular polyons.
   *
   * @param {Array<Line>} originalPolygonLines
   * @param {Array<Line>} insetLines
   * @returns {Array<Polygon>} A list of rectangular polygons; each returned polyon has exactly four vertices.
   */
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
   * Filter split polygons: only keep those whose vertices are all contained inside the original polygon.
   * Reason: scaling too much will result in excessive translation beyond the opposite bounds of the polygon (like more than 200% of possible insetting).
   *
   * @param {Array<Array<Vertex<>} splitPolygonsVertices
   * @param {Polygon} originalPolygon
   * @return {{Array<Array<Vertex<>}} The filtered polygon list.
   */
  PolygonInset._filterInnerSplitPolygonsByOriginalBounds = function (splitPolygonsVertices, originalPolygon) {
    return splitPolygonsVertices.filter(function (splitPolyVerts, _splitPolyIndex) {
      // console.log("_splitPolyIndex", _splitPolyIndex);
      return splitPolyVerts.every(function (splitPVert) {
        return originalPolygon.containsVert(splitPVert);
      });
    });
  };

  /**
   * Filter split polygons: only keep those that do not (signifiantly) interset with any rectangles.
   *
   * @static
   * @param {Array<Array<Vertex>>} splitPolygonsVertices
   * @param {Array<Polygon>} insetRectanglePolygons
   * @param {number?=1.0} epsilon - (optional, default is 1.0) A epsislon to define a tolerance for checking if two polygons intersect.
   */
  // STATIC
  PolygonInset._filterInnerSplitPolygonsByCoverage = function (splitPolygonsVertices, insetRectanglePolygons, epsilon) {
    if (typeof epsilon === "undefined") {
      epsilon = 1.0;
    }
    // console.log(
    //   "_filterSplitPolygonsByCoverage",
    //   "splitPolygonsVertices.length",
    //   splitPolygonsVertices.length,
    //   "insetRectanglePolygons.length",
    //   insetRectanglePolygons.length,
    //   "epsilon",
    //   epsilon
    // );
    return splitPolygonsVertices.filter(function (splitPolyVerts, _splitPolyIndex) {
      // console.log("_splitPolyIndex", _splitPolyIndex);
      var intersectsWithAnyRect = insetRectanglePolygons.some(function (rectanglePoly, _rectanglePolyIndex) {
        var intersectionVerts = sutherlandHodgman(splitPolyVerts, rectanglePoly.vertices);
        // var interSecionPoly = new Polygon(intersectionVerts, false);
        var intersectionAreaSize = Polygon.utils.area(intersectionVerts); // interSecionPoly.area();
        // console.log(
        //   "_splitPolyIndex",
        //   _splitPolyIndex,
        //   "_rectanglePolyIndex",
        //   _rectanglePolyIndex,
        //   "epsilon",
        //   epsilon,
        //   "intersectionAreaSize",
        //   intersectionAreaSize,
        //   "isSmallerThanEpsilon?",
        //   intersectionAreaSize <= epsilon
        // );
        return intersectionAreaSize >= epsilon;
      });

      // console.log("_splitPolyIndex", _splitPolyIndex, "intersectsWithAnyRect", intersectsWithAnyRect);
      return !intersectsWithAnyRect;
    });
  };

  _context.PolygonInset = PolygonInset;
})(globalThis);
