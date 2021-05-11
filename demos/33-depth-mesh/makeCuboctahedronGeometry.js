/**
 * Constructs a cub-octahedron geometry (or a Coriolis station geometry).
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-05-11
 * @version     1.0.0
 **/

var makeCuboctahedronGeometry = function (makeCoriolisStation) {
  // Use box vertices
  // prettier-ignore
  var boxVertices = [
    new Vert3(-1, -1, -1), 
    new Vert3(-1, -1,  1),
    new Vert3(1, -1, 1),
    new Vert3(1, -1, -1),
    
    new Vert3(-1, 1, -1), 
    new Vert3(-1, 1,  1),
    new Vert3(1, 1, 1),
    new Vert3(1, 1, -1)
  ];
  var lerpRatio = 0.5;
  var lerp = function (indexA, indexB) {
    var a = boxVertices[indexA];
    var b = boxVertices[indexB];
    return new Vert3(a.x + (b.x - a.x) * lerpRatio, a.y + (b.y - a.y) * lerpRatio, a.z + (b.z - a.z) * lerpRatio);
  };
  // prettier-ignore
  var boxEdges = [
      // front
      [0,1], [1,2], [2,3], [3,0],
      // back
      [4,5], [5,6], [6,7], [7,4],
      // sides
      [0,4], [1,5], [2,6], [3,7]
    ];
  var vertices = boxEdges.map(function (edge) {
    return lerp(edge[0], edge[1]);
  });
  // prettier-ignore
  var edges = [
    [4,5],[5,6],[6,7],[7,4],
    [0,3],[3,2],[2,1],[1,0],
    [0,9],[9,4],[4,8],[8,0],
    [3,8],[8,7],[7,11],[11,3],
    [2,11],[11,6],[6,10],[10,2],
    [1,10],[10,5],[5,9],[9,1] 
  ];
  if (makeCoriolisStation) {
    var lerpPoints = function (a, b, ratio) {
      return new Vert3(a.x + (b.x - a.x) * ratio, a.y + (b.y - a.y) * ratio, a.z + (b.z - a.z) * ratio);
    };
    var invTri = function (indexA, indexB, indexC) {
      var a = vertices[indexA];
      var b = vertices[indexB];
      var c = vertices[indexC];
      var invA = lerpPoints(b, c, 0.5);
      var invB = lerpPoints(a, c, 0.5);
      var invC = lerpPoints(a, b, 0.5);
      return [lerpPoints(a, invA, 0.8), lerpPoints(c, invC, 0.65), lerpPoints(b, invB, 0.8), lerpPoints(c, invC, 0.8)];
    };
    vertices.push(new Vert3(0.35, 0.05, 1));
    vertices.push(new Vert3(-0.35, 0.05, 1));
    vertices.push(new Vert3(-0.35, -0.05, 1));
    vertices.push(new Vert3(0.35, -0.05, 1));
    edges.push([12, 13], [13, 14], [14, 15], [15, 12]);

    var addArrow = function (indexA, indexB, indexC) {
      vertices = vertices.concat(invTri(indexA, indexB, indexC));
      edges.push(
        [vertices.length - 1, vertices.length - 2],
        [vertices.length - 2, vertices.length - 3],
        [vertices.length - 3, vertices.length - 4],
        [vertices.length - 4, vertices.length - 1]
      );
    };

    addArrow(10, 1, 2);
    addArrow(5, 10, 6);
    addArrow(9, 5, 4);
    addArrow(1, 9, 0);
  }
  return { vertices: vertices, edges: edges };
};
