/**
 *
 * @param {*} circles
 * @returns
 */

(function (_context) {
  var CirclesCircumCircle = {};
  _context.CirclesCircumCircle = CirclesCircumCircle;

  var findByAppolonian = function (circles) {
    var iter = allTripleSubsetsIterator(circles);
    var item;
    var minContainingCircle = null;
    while ((item = iter.next()) && item.value) {
      var triplet = item.value;
      console.log(triplet);
      var apollCircle = solveApollonius3(triplet[0], triplet[1], triplet[2], 1, 1, 1);
    }
    return minContainingCircle;
  };

  // +---------------------------------------------------------------------------------
  // | Approximates the minimum enclosing circle by using a specific set of points
  // | from the circles.
  // +-------------------------------
  // Return:
  // {
  //    extendedTrianglesLines: Array<Line>;
  //    basicExtendedLines: Array<Line>;
  //    allExtendedPoints: Arra<Vertex>;
  //    enclosingCircle: Circle;
  // }
  CirclesCircumCircle.approximateMinimumEnclosingCircle = function (circles) {
    // Idea: build circumcircle of _two_ random circles first.

    if (circles.length === 0) {
      return null;
    }
    if (circles.length === 1) {
      return circles[0];
    }

    var extendedTrianglesLines = CirclesCircumCircle.findAllExtendedLinesFromCircles(circles);

    var allExtendedPoints = new UniqueUUIDArray();
    for (var t = 0; t < extendedTrianglesLines.length; t++) {
      var line = extendedTrianglesLines[t];
      allExtendedPoints.addUnique(line.b);
    }

    // Also add basic extended lines
    var basicExtendedLines = CirclesCircumCircle.findBasicExtendedLines(circles);
    for (var i = 0; i < basicExtendedLines.length; i++) {
      allExtendedPoints.addUnique(basicExtendedLines[i].b);
    }

    var enclosingCircle = minimalContainingCircleFromPoints(allExtendedPoints);

    return {
      basicExtendedLines: basicExtendedLines,
      extendedTrianglesLines: extendedTrianglesLines,
      allExtendedPoints: allExtendedPoints,
      enclosingCircle: enclosingCircle
    };
  };

  CirclesCircumCircle.findBasicExtendedLines = function (circles) {
    // First find all triples of circles and their connecting triangles.
    var lines = arrayLoop2(
      circles,
      function (result, circleA, circleB, i, j) {
        var intersectionLine = circleB.lineIntersection(circleA.center, circleB.center);
        var farestPointB = circleA.center.findFarestPoint(intersectionLine.a, intersectionLine.b);
        result.push(new Line(circleA.center, farestPointB));
        return result;
      },
      []
    );
    return lines;
  };

  CirclesCircumCircle.findAllExtendedLinesFromCircles = function (circles) {
    // First find all triples of circles and their connecting triangles.
    var lines = arrayLoop3(
      circles,
      function (result, circleA, circleB, circleC, i, j, k) {
        // Find outermost intersection points:
        // The three circle centers form a triangle. Let's use the different triangle centers for
        // further calculations.
        var triangle = new Triangle(circleA.center, circleB.center, circleC.center);
        var triangleCentroid = triangle.getCentroid();
        var triangleIncenter = triangle.getIncenter();
        // Extend the trinagle on each corner by the respective circle radius.
        // This results in two new extended triangles.
        var extendedCentroidTriangle = extendTriangleFromPoint(circleA, circleB, circleC, triangleCentroid);
        var extendedIncenterTriangle = extendTriangleFromPoint(circleA, circleB, circleC, triangleIncenter);

        // And also make a second iteration with the new extended triangles.
        var extendedCentroidTriangle2 = extendTriangleFromPoint(
          circleA,
          circleB,
          circleC,
          extendedCentroidTriangle.getIncenter()
        );
        var extendedIncenterTriangle2 = extendTriangleFromPoint(
          circleA,
          circleB,
          circleC,
          extendedIncenterTriangle.getIncenter()
        );

        // All the extended triangle points are potential candidates for the outermost
        // encloding circle.
        result.push(
          extendedCentroidTriangle.getEdgeAt(0),
          extendedCentroidTriangle.getEdgeAt(1),
          extendedCentroidTriangle.getEdgeAt(2)
        );
        result.push(
          extendedIncenterTriangle.getEdgeAt(0),
          extendedIncenterTriangle.getEdgeAt(1),
          extendedIncenterTriangle.getEdgeAt(2)
        );
        result.push(
          extendedCentroidTriangle2.getEdgeAt(0),
          extendedCentroidTriangle2.getEdgeAt(1),
          extendedCentroidTriangle2.getEdgeAt(2)
        );
        result.push(
          extendedIncenterTriangle2.getEdgeAt(0),
          extendedIncenterTriangle2.getEdgeAt(1),
          extendedIncenterTriangle2.getEdgeAt(2)
        );

        return result;
      },
      []
    );
    return lines;
  };

  var extendTriangleFromPoint = function (circleA, circleB, circleC, pointToExtendFrom) {
    // Extend the trinagle on each corner by the respective circle radius
    var intersectionLineA = circleA.lineIntersection(pointToExtendFrom, circleA.center);
    var intersectionLineB = circleB.lineIntersection(pointToExtendFrom, circleB.center);
    var intersectionLineC = circleC.lineIntersection(pointToExtendFrom, circleC.center);
    var farestPointA = pointToExtendFrom.findFarestPoint(intersectionLineA.a, intersectionLineA.b);
    var farestPointB = pointToExtendFrom.findFarestPoint(intersectionLineB.a, intersectionLineB.b);
    var farestPointC = pointToExtendFrom.findFarestPoint(intersectionLineC.a, intersectionLineC.b);
    var extendedTriangle = new Triangle(farestPointA, farestPointB, farestPointC);
    return extendedTriangle;
  };

  var arrayLoop2 = function (arr, callback, result) {
    var newResult = result;
    for (var i = 0; i < arr.length; i++) {
      var itemA = arr[i];
      for (var j = 0; j < arr.length; j++) {
        if (i == j) {
          continue;
        }
        var itemB = arr[j];
        newResult = callback(result, itemA, itemB, i, j);
      }
    }
    return newResult;
  };

  var arrayLoop3 = function (arr, callback, result) {
    var newResult = result;
    for (var i = 0; i < arr.length; i++) {
      var itemA = arr[i];
      for (var j = i + 1; j < arr.length; j++) {
        // for (var j = 0; j < arr.length; j++) {
        //   if (j == i) {
        //     continue;
        //   }
        var itemB = arr[j];
        for (var k = 0; k < arr.length; k++) {
          if (k == i || k == j) {
            continue;
          }
          var itemC = arr[k];
          newResult = callback(result, itemA, itemB, itemC, i, j, k);
        }
      }
    }
    return newResult;
  };

  // var getAllSubsets = function (circles) {
  //   // var partitions = [];
  //   // for( var size = 1; size < circles.length; size++ ) {
  //   //     var partition = [];

  //   // }
  //   // return partitions;
  //   return circles.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);
  // };
})(globalThis);

var allTripleSubsetsIterator = function* (circles) {
  var result;
  for (var i = 0; i < circles.length; i++) {
    var itemA = circles[i];
    for (var j = i + 1; j < circles.length; j++) {
      // for (var j = 0; j < arr.length; j++) {
      //   if (j == i) {
      //     continue;
      //   }
      var itemB = circles[j];
      for (var k = 0; k < circles.length; k++) {
        if (k == i || k == j) {
          continue;
        }
        var itemC = circles[k];
        result = [circles[i], circles[j], circles[k]];
        yield result;
      }
    }
  }
};
