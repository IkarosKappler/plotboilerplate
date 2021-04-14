/**
 * Constructs a discrete dodecahedron geometry.
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-04-13
 * @version     1.0.0
 **/

var makeDodecahedronGeometry = function () {
  // Dodecahedron
  var phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  // prettier-ignore
  var vertices = [
    // (±1, ±1, ±1)
    new Vert3(1,1,1),
    new Vert3(1,1,-1),
    new Vert3(1,-1,1),
    new Vert3(1,-1,-1),
    new Vert3(-1,1,1),
    new Vert3(-1,1,-1),
    new Vert3(-1,-1,1),
    new Vert3(-1,-1,-1),
    // (0, ±ϕ, ±1/ϕ)
    new Vert3(0,phi,1/phi),
    new Vert3(0,phi,-1/phi),
    new Vert3(0,-phi,1/phi),
    new Vert3(0,-phi,-1/phi),
    // (±1/ϕ, 0, ±ϕ)
    new Vert3(1/phi, 0, phi),
    new Vert3(1/phi, 0, -phi),
    new Vert3(-1/phi, 0, phi),
    new Vert3(-1/phi, 0, -phi),
    // (±ϕ, ±1/ϕ, 0)
    new Vert3(phi, 1/phi, 0),
    new Vert3(phi, -1/phi, 0),
    new Vert3(-phi, 1/phi, 0),
    new Vert3(-phi, -1/phi, 0)
    ];
  // prettier-ignore
  var edges = [
    // front
    [0,16], [16,1], [1,9], [9,8], [8,0],
    [8,4], [4,14], [14,12], [12,0],
    [12,2], [2,17], [17,16],
    [17,3], [3,13], [13,1],
    [13,15],[15,5],[5,9],
    [2,10],[10,11],[11,3],
    [14,6],[6,10],
    [11,7],[7,15],
    [6,19],[19,7],
    [4,18],[18,5],
    [18,19]
    ];
  return { vertices: vertices, edges: edges };
};
