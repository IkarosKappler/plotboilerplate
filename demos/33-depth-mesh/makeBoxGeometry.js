/**
 * Constructs a box geometry with latitues and longitudes.
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

var makeBoxGeometry = function () {
  // Box
  // prettier-ignore
  var vertices = [
    new Vert3(-1, -1, -1), 
    new Vert3(-1, -1,  1),
    new Vert3(1, -1, 1),
    new Vert3(1, -1, -1),
    
    new Vert3(-1, 1, -1), 
    new Vert3(-1, 1,  1),
    new Vert3(1, 1, 1),
    new Vert3(1, 1, -1)
  ];
  // prettier-ignore
  var edges = [
    // front
    [0,1], [1,2], [2,3], [3,0],
    // back
    [4,5], [5,6], [6,7], [7,4],
    // sides
    [0,4], [1,5], [2,6], [3,7]
  ];
  return { vertices: vertices, edges: edges };
};
