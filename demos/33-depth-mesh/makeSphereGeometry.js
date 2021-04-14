/**
 * Constructs a discrete sphere geometry with latitues and longitudes.
 *
 * @requires Vert3
 * @requires rotatePoint
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

var makeSphereGeometry = function () {
  var longs = 7;
  var lats = 12;
  var radius = 1;
  var vertices = [];
  var edges = [];
  for (var long = 0; long < longs; long++) {
    var theta = Math.PI / 2 + (long / (longs - 1)) * Math.PI;
    for (var lat = 0; lat < lats; lat++) {
      var alpha = (lat / lats) * Math.PI * 2;
      var vert = new Vert3(radius, 0, 0);
      vert = rotatePoint(vert, theta, 0, alpha, 0);
      vertices.push(vert);
      if (lat > 0) {
        // Make longitudes
        edges.push([long * lats + lat - 1, long * lats + lat]);
        if (lat + 1 === lats) {
          edges.push([long * lats, long * lats + lat]);
        }
        // Make latitudes
        if (long > 0) {
          edges.push([long * lats + lat - 1, (long - 1) * lats + lat - 1]);
          if (long + 1 === longs) {
            //edges.push([long * lats, (long - 1) * lats + lat - 1]);
          }
        }
      } else if (long > 0) {
        edges.push([long * lats + lats - 1, (long - 1) * lats + lats - 1]);
      }
    }
  }
  console.log(vertices);
  return { vertices: vertices, edges: edges };
};
