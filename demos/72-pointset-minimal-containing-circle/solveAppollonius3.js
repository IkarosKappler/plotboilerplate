/**
 * Found at
 *     https://stackoverflow.com/questions/79281573/algorithm-for-finding-enclosing-circles-for-3-other-circles
 * 
 * solveApollonius(Coord c1, Coord c2, Coord c3, int s1, int s2, int s3) {
        // https://github.com/DIKU-Steiner/ProGAL/blob/master/src/ProGAL/geom2d/ApolloniusSolver.java

        var x1 = c1.x;
        var y1 = c1.y;
        var r1 = c1.z;
        var x2 = c2.x;
        var y2 = c2.y;
        var r2 = c2.z;
        var x3 = c3.x;
        var y3 = c3.y;
        var r3 = c3.z;

        // Currently optimized for fewest multiplications.
        var v11 = 2 * x2 - 2 * x1;
        var v12 = 2 * y2 - 2 * y1;
        var v13 = x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2 - r1 * r1 + r2 * r2;
        var v14 = 2 * s2 * r2 - 2 * s1 * r1;

        var v21 = 2 * x3 - 2 * x2;
        var v22 = 2 * y3 - 2 * y2;
        var v23 = x2 * x2 - x3 * x3 + y2 * y2 - y3 * y3 - r2 * r2 + r3 * r3;
        var v24 = 2 * s3 * r3 - 2 * s2 * r2;

        var w12 = v12 / v11;
        var w13 = v13 / v11;
        var w14 = v14 / v11;

        var w22 = v22 / v21 - w12;
        var w23 = v23 / v21 - w13;
        var w24 = v24 / v21 - w14;

        var P = -w23 / w22;
        var Q = w24 / w22;
        var M = -w12 * P - w13;
        var N = w14 - w12 * Q;

        var a = N * N + Q * Q - 1;
        var b = 2 * M * N - 2 * N * x1 + 2 * P * Q - 2 * Q * y1 + 2 * s1 * r1;
        var c = x1 * x1 + M * M - 2 * M * x1 + P * P + y1 * y1 - 2 * P * y1 - r1 * r1;

        // Find a root of a quadratic equation. This requires the circle centers not
        // to be e.g. colinear
        var D = b * b - 4 * a * c;
        var rs = (-b - Math.sqrt(D)) / (2 * a);
        var xs = M + N * rs;
        var ys = P + Q * rs;

        return (xs, ys, rs);
    }
 * 
 */

var solveApollonius3 = function (c1, c2, c3, s1, s2, s3) {
  // https://github.com/DIKU-Steiner/ProGAL/blob/master/src/ProGAL/geom2d/ApolloniusSolver.java

  var x1 = c1.center.x;
  var y1 = c1.center.y;
  var r1 = c1.radius;
  var x2 = c2.center.x;
  var y2 = c2.center.y;
  var r2 = c2.radius;
  var x3 = c3.center.x;
  var y3 = c3.center.y;
  var r3 = c3.radius;

  // Currently optimized for fewest multiplications.
  var v11 = 2 * x2 - 2 * x1;
  var v12 = 2 * y2 - 2 * y1;
  var v13 = x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2 - r1 * r1 + r2 * r2;
  var v14 = 2 * s2 * r2 - 2 * s1 * r1;

  var v21 = 2 * x3 - 2 * x2;
  var v22 = 2 * y3 - 2 * y2;
  var v23 = x2 * x2 - x3 * x3 + y2 * y2 - y3 * y3 - r2 * r2 + r3 * r3;
  var v24 = 2 * s3 * r3 - 2 * s2 * r2;

  var w12 = v12 / v11;
  var w13 = v13 / v11;
  var w14 = v14 / v11;

  var w22 = v22 / v21 - w12;
  var w23 = v23 / v21 - w13;
  var w24 = v24 / v21 - w14;

  var P = -w23 / w22;
  var Q = w24 / w22;
  var M = -w12 * P - w13;
  var N = w14 - w12 * Q;

  var a = N * N + Q * Q - 1;
  var b = 2 * M * N - 2 * N * x1 + 2 * P * Q - 2 * Q * y1 + 2 * s1 * r1;
  var c = x1 * x1 + M * M - 2 * M * x1 + P * P + y1 * y1 - 2 * P * y1 - r1 * r1;

  // Find a root of a quadratic equation. This requires the circle centers not
  // to be e.g. colinear
  var D = b * b - 4 * a * c;
  var rs = (-b - Math.sqrt(D)) / (2 * a);
  var xs = M + N * rs;
  var ys = P + Q * rs;

  return new Circle(new Vertex(xs, ys), rs);
};
