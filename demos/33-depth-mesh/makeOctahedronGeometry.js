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

var makeOctahedronGeometry = function () {
  // Octahedron
  //   var height = (Math.sqrt(6) / 3) * 2;
  var sqrt8h = Math.sqrt(8) / 2;
  var height = Math.sqrt(4 - sqrt8h * sqrt8h);
  // prettier-ignore
  var vertices = [
      new Vert3(-1, 0, -1), 
      new Vert3(-1, 0,  1),
      new Vert3(1, 0, 1),
      new Vert3(1, 0, -1),
      
      new Vert3(0,height,0),
      new Vert3(0,-height,0)
    ];
  // prettier-ignore
  var edges = [
    [0,5],[5,1],[1,0],
    [5,2],[2,1],
    [0,3],[3,5],
    [3,2],
    [0,4],[4,3],
    [1,4],
    [2,4] 
    ];
  return { vertices: vertices, edges: edges };
};
