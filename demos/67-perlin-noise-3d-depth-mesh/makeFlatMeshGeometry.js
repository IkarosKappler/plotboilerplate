"use strict";
/**
 * Constructs a octahedron geometry.
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-04-14
 * @version     1.0.0
 **/

var makeFlatMeshGeometry = function (yCount, xCount, xSize, ySize) {
  // 2D square mesh
  xSize = xSize || 1.0;
  ySize = ySize || 1.0;
  var vertices = [];
  var edges = [];
  var stepY = xSize / yCount;
  var stepX = ySize / xCount;
  var indexMatrix = [];
  for (var y = 0; y < yCount; y++) {
    var indexRow = [];
    indexMatrix.push(indexRow);
    for (var x = 0; x < xCount; x++) {
      var index = vertices.length;
      var vert = new Vert3(-xSize / 2.0 + x * stepX, -ySize / 2.0 + y * stepY, 0.0);
      indexRow.push(index);
      vertices.push(vert);
      if (x > 0) {
        edges.push([index - 1, index]);
      }
      if (y > 0) {
        edges.push([index - xCount, index]);
      }
    }
  }
  // console.log("vertices", vertices, "edges", edges);
  // return { vertices: vertices, edges: edges };
  return { geometry: new GeometryMesh(vertices, edges), indexMatrix: indexMatrix };
};
