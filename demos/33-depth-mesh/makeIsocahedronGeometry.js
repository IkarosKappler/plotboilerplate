/**
 * Constructs a discrete rhombic dodecahedron geometry.
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-04-14
 * @version     1.0.0
 **/

var makeIsocahedronGeometry = function () {
  // Dodecahedron
  var phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  //   (0, ±1, ±ϕ)
  //   (±1, ±ϕ, 0)
  //   (±ϕ, 0, ±1)
  // prettier-ignore
  var vertices = [
      new Vert3(0, 1, phi),
      new Vert3(0, 1, -phi),
      new Vert3(0, -1, phi),
      new Vert3(0, -1, -phi),

      new Vert3(1, phi, 0),
      new Vert3(1, -phi, 0),
      new Vert3(-1, phi, 0),
      new Vert3(-1, -phi, 0),

      new Vert3(phi, 0, 1),
      new Vert3(phi, 0, -1),
      new Vert3(-phi, 0, 1),
      new Vert3(-phi, 0, -1)

  ];
  // prettier-ignore
  var edges = [
    [0,4], [4,6], [6,0],
    [0,8], [8,4],
    [6,10], [10,0],
    [4,1], [1,6],
    [6,11], [11,10],
    [4,9], [9,1],
    [1,3], [3,11],
    [11,7], [7,10],
    [10,2], [2,0],
    [8,5], [5,9],
    [5,7],
    [7,2],
    [2,5],
    [2,8],
    [3,7],
    [5,3],
    [9,3],
    [8,9],
    [1,11]
    ];
  return { vertices: vertices, edges: edges };
};
