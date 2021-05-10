/**
 * Constructs a discrete augemted tri diminished icosahedron geometry.
 *
 * See https://en.wikipedia.org/wiki/Augmented_tridiminished_icosahedron
 * See http://eusebeia.dyndns.org/4d/J63
 * See https://polyhedra.tessera.li/augmented-tridiminished-icosahedron/operations
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-05-10
 * @version     1.0.0
 **/

var makeAugmentedTriDiminishedIcosahedronGeometry = function () {
  var phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  //   (0, 1, ϕ)
  //   (0, ±1, −ϕ)
  //   ( 1, ϕ, 0)
  //   (±1, −ϕ, 0)
  //   ( ϕ, 0, 1)
  //   (−ϕ, 0, ±1)

  // Tetrahedron height: sqrt(6)/3 * a.
  // Edge length is 2.
  var tHeight = (Math.sqrt(6) / 3) * 2;

  // prettier-ignore
  var vertices = [
        new Vert3(0, 1, phi),

        new Vert3(0, 1, -phi),
        new Vert3(0, -1, -phi),

        new Vert3(1, phi, 0),
  
        new Vert3(1, -phi, 0),
        new Vert3(-1, -phi, 0),

        new Vert3(phi, 0, 1),

        new Vert3(-phi, 0, 1),
        new Vert3(-phi, 0, -1),

        new Vert3(tHeight,tHeight,tHeight)
    ];
  // prettier-ignore
  var edges = [
    [1,3],[3,6],[6,4],[4,2], [2,1],
    [3,0],[0,6],[6,3],
    [0,7],[7,5],[5,4],
    [2,8],[8,7],
    [2,5],[5,8],
    [1,8],
    [0,9],
    [3,9],
    [6,9]
  ];
  return { vertices: vertices, edges: edges };
};
