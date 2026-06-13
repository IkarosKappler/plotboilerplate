/**
 *
 * @param {*} circles
 * @returns
 */

var calculateCirclesCircumCircle = function (circles) {
  // Idea: build circumcircle of _two_ random circles first.

  if (circles.length === 0) {
    return null;
  }
  if (circles.length === 1) {
    return circles[0];
  }

  console.log("circles", circles);

  // First find all pairs of circles and their connecting center lines
  // var farestPoints = findFarestPointsFromCircles(circles);
  // return minimalContainingCircleFromPoints(farestPoints);

  var extendedTriangles = findAllExtendedTrianglesFromCircles(circles);
  // var allTrianglePoints = extendedTriangles.reduce(function (accu, triangle) {
  //   accu.push(triangle.c, triangle.b, triangle.c);
  //   return accu;
  // }, []);
  var allTrianglePoints = [];
  for (var t = 0; t < extendedTriangles.length; t++) {
    var triangle = extendedTriangles[t];
    allTrianglePoints.push(triangle.c, triangle.b, triangle.c);
  }
  return minimalContainingCircleFromPoints(allTrianglePoints);
};

var findAllTrianglesFromCircles = function (circles) {
  // First find all triples of circles and their connecting triangles.
  var triangles = arrayLoop3(
    circles,
    function (result, circleA, circleB, circleC, i, j, k) {
      // Find both outermost intersection points
      // console.log("circleA", circleA, "circleB", circleB, "i", i, "j", j);
      var triangle = new Triangle(circleA.center, circleB.center, circleC.center);
      result.push(triangle);
      return result;
    },
    []
  );
  return triangles;
};

var findAllExtendedTrianglesFromCircles = function (circles) {
  // First find all triples of circles and their connecting triangles.
  var triangles = arrayLoop3(
    circles,
    function (result, circleA, circleB, circleC, i, j, k) {
      // Find both outermost intersection points
      // console.log("circleA", circleA, "circleB", circleB, "i", i, "j", j);
      var triangle = new Triangle(circleA.center, circleB.center, circleC.center);
      // var minEnclosingCircle = triangle.getMinimumEnclosingCircle();
      var triangleCentroid = triangle.getCentroid();
      var triangleIncenter = triangle.getIncenter();
      // Extend the trinagle on each corner by the respective circle radius
      // var intersectionLineA = circleA.lineIntersection(triangleCentroid, circleA.center);
      // var intersectionLineB = circleB.lineIntersection(triangleCentroid, circleB.center);
      // var intersectionLineC = circleC.lineIntersection(triangleCentroid, circleC.center);
      // var farestPointA = triangleCentroid.findFarestPoint(intersectionLineA.a, intersectionLineA.b);
      // var farestPointB = triangleCentroid.findFarestPoint(intersectionLineB.a, intersectionLineB.b);
      // var farestPointC = triangleCentroid.findFarestPoint(intersectionLineC.a, intersectionLineC.b);
      // var extendedTriangle = new Triangle(farestPointA, farestPointB, farestPointC);
      // result.push(extendedTriangle);
      var extendedCentroidTriangle = extendTriangleFromPoint(circleA, circleB, circleC, triangleCentroid);
      var extendedIncenterTriangle = extendTriangleFromPoint(circleA, circleB, circleC, triangleIncenter);

      // And also make a second iteration.
      var extendedCentroidTriangle2 = extendTriangleFromPoint(circleA, circleB, circleC, extendedCentroidTriangle.getIncenter());
      var extendedIncenterTriangle2 = extendTriangleFromPoint(circleA, circleB, circleC, extendedIncenterTriangle.getIncenter());

      result.push(extendedCentroidTriangle, extendedIncenterTriangle);
      result.push(extendedCentroidTriangle2, extendedIncenterTriangle2);

      return result;
    },
    []
  );
  return triangles;
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
  // result.push(extendedTriangle);
  return extendedTriangle;
};

var findFarestPointsFromCircles = function (circles) {
  // First find all triples of circles and their connecting triangles.
  var farestPoints = arrayLoop2(
    circles,
    function (result, circleA, circleB, i, j) {
      // Find both outermost intersection points
      // console.log("circleA", circleA, "circleB", circleB, "i", i, "j", j);
      var connectLine = new Line(circleA.center, circleB.center);
      var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
      var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
      var farestPointOnA = circleB.center.findFarestPoint(intersectionLineA.a, intersectionLineA.b);
      var farestPointOnB = circleA.center.findFarestPoint(intersectionLineB.a, intersectionLineB.b);
      result.push(farestPointOnA, farestPointOnB);
      return result;
    },
    []
  );
  return farestPoints;
};

var arrayLoop2 = function (arr, callback, result) {
  var newResult = result;
  for (var i = 0; i < arr.length; i++) {
    var itemA = arr[i];
    for (var j = i + 1; j < arr.length; j++) {
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

var __calculateCirclesCircumCircle = function (circles) {
  // Idea: build circumcircle of _two_ random circles first.

  if (circles.length === 0) {
    return null;
  }
  if (circles.length === 1) {
    return circles[0];
  }

  //   var startCircle = getContainingCircle2(circles[0], circles[1]);
  return calculateCirclesCircumCircle_iter(circles, circles[0].clone(), 1);
};

var calculateCirclesCircumCircle_iter = function (circles, tmpResult, n) {
  // Idea: build circumcircle of _two_ random circles first.
  if (n >= circles.length) {
    return tmpResult;
  }
  var localCircle = getContainingCircle2(tmpResult, circles[n]);

  return calculateCirclesCircumCircle_iter(circles, localCircle, n + 1);
};

// TODO: put this to Circle class?
var getContainingCircle2 = function (circleA, circleB) {
  if (circleA.containsCircle(circleB)) {
    return circleA;
  }
  if (circleB.containsCircle(circleA)) {
    return circleB;
  }
  var connectLine = new Vector(circleA.center, circleB.center);
  var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
  var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
  var farestPointOnA = circleB.center.findFarestPoint(intersectionLineA.a, intersectionLineA.b);
  var farestPointOnB = circleA.center.findFarestPoint(intersectionLineB.a, intersectionLineB.b);
  var totalDiagonalLine = new Line(farestPointOnA, farestPointOnB);
  var center = totalDiagonalLine.vertAt(0.5);
  return new Circle(center, center.distance(totalDiagonalLine.a));
};

var getAllSubsets = function (circles) {
  // var partitions = [];
  // for( var size = 1; size < circles.length; size++ ) {
  //     var partition = [];

  // }
  // return partitions;
  return circles.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);
};
