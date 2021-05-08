/**
 * Constructs a discrete rhombic dodecahedron geometry.
 *
 * @requires Vert3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-05-05
 * @version     1.0.0
 **/

/**
 *
 * @param {number=0.333333} lerpRatio - [optional] The lerp transformation ratio to use (default is 0.333... which is a standard fullerene)
 * @returns
 */
var makeBuckminsterGeometry = function (lerpRatio) {
  // You can construct a buckminster fullerene from an isocahedron geometry.
  //   See https://www2.fkf.mpg.de/andersen/fullerene/intro.html
  var phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  var ratio = typeof lerpRatio === "undefined" ? 1 / 3 : lerpRatio;
  // This function lerps 33% from one point to the other.
  var lerp = function (a, b) {
    return new Vert3(a.x + (b.x - a.x) * ratio, a.y + (b.y - a.y) * ratio, a.z + (b.z - a.z) * ratio);
  };

  // First step: construct isocahedron vertices (compare to makeIsocahedronGeometry function)
  //   (0, ±1, ±ϕ)
  //   (±1, ±ϕ, 0)
  //   (±ϕ, 0, ±1)
  // prettier-ignore
  var isoVertices = [
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
  // Second step: 'cut' off each pentagonal pyramid tip for 33%
  //  - what shows up are pentagonal faces
  //  - what remains are hexagonal faces
  var vertices = [];
  vertices.push(lerp(isoVertices[0], isoVertices[8]));
  vertices.push(lerp(isoVertices[0], isoVertices[2]));
  vertices.push(lerp(isoVertices[0], isoVertices[10]));
  vertices.push(lerp(isoVertices[0], isoVertices[6]));
  vertices.push(lerp(isoVertices[0], isoVertices[4]));

  vertices.push(lerp(isoVertices[1], isoVertices[3]));
  vertices.push(lerp(isoVertices[1], isoVertices[9]));
  vertices.push(lerp(isoVertices[1], isoVertices[4]));
  vertices.push(lerp(isoVertices[1], isoVertices[6]));
  vertices.push(lerp(isoVertices[1], isoVertices[11]));

  vertices.push(lerp(isoVertices[2], isoVertices[0]));
  vertices.push(lerp(isoVertices[2], isoVertices[8]));
  vertices.push(lerp(isoVertices[2], isoVertices[5]));
  vertices.push(lerp(isoVertices[2], isoVertices[7]));
  vertices.push(lerp(isoVertices[2], isoVertices[10]));

  vertices.push(lerp(isoVertices[3], isoVertices[1]));
  vertices.push(lerp(isoVertices[3], isoVertices[11]));
  vertices.push(lerp(isoVertices[3], isoVertices[7]));
  vertices.push(lerp(isoVertices[3], isoVertices[5]));
  vertices.push(lerp(isoVertices[3], isoVertices[9]));

  vertices.push(lerp(isoVertices[4], isoVertices[0]));
  vertices.push(lerp(isoVertices[4], isoVertices[6]));
  vertices.push(lerp(isoVertices[4], isoVertices[1]));
  vertices.push(lerp(isoVertices[4], isoVertices[9]));
  vertices.push(lerp(isoVertices[4], isoVertices[8]));

  vertices.push(lerp(isoVertices[5], isoVertices[2]));
  vertices.push(lerp(isoVertices[5], isoVertices[8]));
  vertices.push(lerp(isoVertices[5], isoVertices[9]));
  vertices.push(lerp(isoVertices[5], isoVertices[3]));
  vertices.push(lerp(isoVertices[5], isoVertices[7]));

  vertices.push(lerp(isoVertices[6], isoVertices[0]));
  vertices.push(lerp(isoVertices[6], isoVertices[4]));
  vertices.push(lerp(isoVertices[6], isoVertices[1]));
  vertices.push(lerp(isoVertices[6], isoVertices[11]));
  vertices.push(lerp(isoVertices[6], isoVertices[10]));

  vertices.push(lerp(isoVertices[7], isoVertices[2]));
  vertices.push(lerp(isoVertices[7], isoVertices[5]));
  vertices.push(lerp(isoVertices[7], isoVertices[3]));
  vertices.push(lerp(isoVertices[7], isoVertices[11]));
  vertices.push(lerp(isoVertices[7], isoVertices[10]));

  vertices.push(lerp(isoVertices[8], isoVertices[0]));
  vertices.push(lerp(isoVertices[8], isoVertices[4]));
  vertices.push(lerp(isoVertices[8], isoVertices[9]));
  vertices.push(lerp(isoVertices[8], isoVertices[5]));
  vertices.push(lerp(isoVertices[8], isoVertices[2]));

  vertices.push(lerp(isoVertices[9], isoVertices[1]));
  vertices.push(lerp(isoVertices[9], isoVertices[3]));
  vertices.push(lerp(isoVertices[9], isoVertices[5]));
  vertices.push(lerp(isoVertices[9], isoVertices[8]));
  vertices.push(lerp(isoVertices[9], isoVertices[4]));

  vertices.push(lerp(isoVertices[10], isoVertices[0]));
  vertices.push(lerp(isoVertices[10], isoVertices[2]));
  vertices.push(lerp(isoVertices[10], isoVertices[7]));
  vertices.push(lerp(isoVertices[10], isoVertices[11]));
  vertices.push(lerp(isoVertices[10], isoVertices[6]));

  vertices.push(lerp(isoVertices[11], isoVertices[1]));
  vertices.push(lerp(isoVertices[11], isoVertices[6]));
  vertices.push(lerp(isoVertices[11], isoVertices[10]));
  vertices.push(lerp(isoVertices[11], isoVertices[7]));
  vertices.push(lerp(isoVertices[11], isoVertices[3]));

  // prettier-ignore
  var edges = [
    [0,4], [4,3], [3,2], [2,1], [1,0],
    [1,10],[10,11],[11,44],[44,40],[40,0],
    [44,43],[43,42],[42,41],[41,40],
    [2,50],[50,51],[51,14],[14,10],
    [11,12],[12,25],[25,26],[26,43],
    [14,13],[13,12],
    [26,27],[27,47],[47,48],[48,42],
    [47,46],[46,45],[45,49],[49,48],
    [46,19],[19,15],[15,5],[5,6],[6,45],
    [15,16],[16,59],[59,55],[55,9],[9,5],
    [59,58],[58,57],[57,56],[56,55],
    [58,38],[38,39],[39,52],[52,53],[53,57],
    [52,51],
    [50,54],[54,53],
    [54,34],[34,33],[33,56],
    [6,7],[7,22],[22,23],[23,49],
    [9,8],[8,7],
    [33,32],[32,8],
    [3,30],[30,34],
    [30,31],[31,32],
    [27,28],[28,18],[18,19],
    [18,17],[17,16],
    [17,37],[37,38],
    [39,35],[35,13],
    [25,29],[29,28],
    [37,36],[36,35],
    [29,36],
    [4,20],[20,21],[21,31],
    [41,24],[24,20],
    [23,24],
    [22,21]
  ];
  return { vertices: vertices, edges: edges };
};
