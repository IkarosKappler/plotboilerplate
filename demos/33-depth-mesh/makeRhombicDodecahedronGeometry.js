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

var makeRhombicDodecahedronGeometry = function () {
  // Dodecahedron
  var phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  // The underlying cube's vertices are at (±1, ±1, ±1).
  // So the RD's vertices are on the pyramidal tip points.
  // prettier-ignore
  var vertices = [
      // First level of cube
    new Vert3(-1, -1, -1), 
    new Vert3(-1, -1,  1),
    new Vert3(1, -1, 1),
    new Vert3(1, -1, -1),
    
    // Second level of cube
    new Vert3(-1, 1, -1), 
    new Vert3(-1, 1,  1),
    new Vert3(1, 1, 1),
    new Vert3(1, 1, -1),

    // and 6 pyramis tips (each one above one cube face)
    new Vert3(0,0,2),
    new Vert3(0,0,-2),
    new Vert3(0,2,0),
    new Vert3(0,-2,0),
    new Vert3(2,0,0),
    new Vert3(-2,0,0)
      ];
  // prettier-ignore
  var edges = [
    [0,9], [9,3], [3,11], [11,0],
    [11,1], [1,13], [13,0],
    [11,2], [2,8], [8,1],
    [3,12], [12,2],
    [8,5], [5,13],
    [13,4], [4,9],
    [9,7], [7,12],
    [12,6], [6,8],
    [4,10], [10,7],
    [10,6],
    [6,10], [10,5],
    [10,7],
    [7,10], [10,6]
      ];
  return { vertices: vertices, edges: edges };
};
