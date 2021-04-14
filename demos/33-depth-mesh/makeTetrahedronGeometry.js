/**
 * Constructs a tetrahedron geometry.
 *
 * @requires Vert3
 * @requires rotatePoint
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-04-13
 * @version     1.0.0
 **/

var makeTetrahedronGeometry = function () {
  // Tetrahedron
  // prettier-ignore
  var sqrt3 = Math.sqrt(3);
  var sqrt6 = Math.sqrt(6);
  var vertices = [
    new Vert3(1, -1 / sqrt3, -1 / sqrt6),
    new Vert3(-1, -1 / sqrt3, -1 / sqrt6),
    new Vert3(0, 2 / sqrt3, -1 / sqrt6),
    new Vert3(0, 0, 3 / sqrt6)
  ];

  // prettier-ignore
  var edges = [
      // front
      [0,1], [1,2], [2,3], [3,0],
      [1,3], 
      [0,2]
    ];
  return { vertices: vertices, edges: edges };
};
