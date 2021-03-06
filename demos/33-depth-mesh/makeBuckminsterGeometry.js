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
  var isoLerpRatio = ratio <= 0.5 ? ratio : 0.5;
  var icosidodeLerpRatio = ratio <= 0.5 ? 0.0 : (ratio - 0.5) * 2.0;
  // This function lerps 33% from one point to the other.
  var lerpIco = function (a, b) {
    return new Vert3(a.x + (b.x - a.x) * isoLerpRatio, a.y + (b.y - a.y) * isoLerpRatio, a.z + (b.z - a.z) * isoLerpRatio);
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
  // Define all triangle faces (=all faces in general of the icosahedron)
  var isoFaces = [
    // Triangles at the bottm cap (at 0)
    [0, 2, 8],
    [0, 8, 4],
    [0, 4, 6],
    [0, 6, 10],
    [0, 10, 2],

    // The 'band' around
    [2, 5, 8],
    [8, 5, 9],
    [8, 9, 4],
    [4, 9, 1],
    [4, 1, 6],
    [6, 1, 11],
    [6, 11, 10],
    [10, 11, 7],
    [10, 7, 2],
    [2, 7, 5],

    // Trinagles a the top cap
    [3, 1, 9],
    [3, 9, 5],
    [3, 5, 7],
    [3, 7, 11],
    [3, 11, 1]
  ];
  var isoFaceCenters = isoFaces.map(function (face3) {
    // Find center point
    var a = isoVertices[face3[0]];
    var b = isoVertices[face3[1]];
    var c = isoVertices[face3[2]];
    return new Vert3((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3, (a.z + b.z + c.z) / 3);
  });
  // Second step: 'cut' off each pentagonal pyramid tip for 33%
  //  - what shows up are pentagonal faces
  //  - what remains are hexagonal faces
  var verticesBucky = [];
  verticesBucky.push(lerpIco(isoVertices[0], isoVertices[8]));
  verticesBucky.push(lerpIco(isoVertices[0], isoVertices[2]));
  verticesBucky.push(lerpIco(isoVertices[0], isoVertices[10]));
  verticesBucky.push(lerpIco(isoVertices[0], isoVertices[6]));
  verticesBucky.push(lerpIco(isoVertices[0], isoVertices[4]));

  verticesBucky.push(lerpIco(isoVertices[1], isoVertices[3]));
  verticesBucky.push(lerpIco(isoVertices[1], isoVertices[9]));
  verticesBucky.push(lerpIco(isoVertices[1], isoVertices[4]));
  verticesBucky.push(lerpIco(isoVertices[1], isoVertices[6]));
  verticesBucky.push(lerpIco(isoVertices[1], isoVertices[11]));

  verticesBucky.push(lerpIco(isoVertices[2], isoVertices[0]));
  verticesBucky.push(lerpIco(isoVertices[2], isoVertices[8]));
  verticesBucky.push(lerpIco(isoVertices[2], isoVertices[5]));
  verticesBucky.push(lerpIco(isoVertices[2], isoVertices[7]));
  verticesBucky.push(lerpIco(isoVertices[2], isoVertices[10]));

  verticesBucky.push(lerpIco(isoVertices[3], isoVertices[1]));
  verticesBucky.push(lerpIco(isoVertices[3], isoVertices[11]));
  verticesBucky.push(lerpIco(isoVertices[3], isoVertices[7]));
  verticesBucky.push(lerpIco(isoVertices[3], isoVertices[5]));
  verticesBucky.push(lerpIco(isoVertices[3], isoVertices[9]));

  verticesBucky.push(lerpIco(isoVertices[4], isoVertices[0]));
  verticesBucky.push(lerpIco(isoVertices[4], isoVertices[6]));
  verticesBucky.push(lerpIco(isoVertices[4], isoVertices[1]));
  verticesBucky.push(lerpIco(isoVertices[4], isoVertices[9]));
  verticesBucky.push(lerpIco(isoVertices[4], isoVertices[8]));

  verticesBucky.push(lerpIco(isoVertices[5], isoVertices[2]));
  verticesBucky.push(lerpIco(isoVertices[5], isoVertices[8]));
  verticesBucky.push(lerpIco(isoVertices[5], isoVertices[9]));
  verticesBucky.push(lerpIco(isoVertices[5], isoVertices[3]));
  verticesBucky.push(lerpIco(isoVertices[5], isoVertices[7]));

  verticesBucky.push(lerpIco(isoVertices[6], isoVertices[0]));
  verticesBucky.push(lerpIco(isoVertices[6], isoVertices[4]));
  verticesBucky.push(lerpIco(isoVertices[6], isoVertices[1]));
  verticesBucky.push(lerpIco(isoVertices[6], isoVertices[11]));
  verticesBucky.push(lerpIco(isoVertices[6], isoVertices[10]));

  verticesBucky.push(lerpIco(isoVertices[7], isoVertices[2]));
  verticesBucky.push(lerpIco(isoVertices[7], isoVertices[5]));
  verticesBucky.push(lerpIco(isoVertices[7], isoVertices[3]));
  verticesBucky.push(lerpIco(isoVertices[7], isoVertices[11]));
  verticesBucky.push(lerpIco(isoVertices[7], isoVertices[10]));

  verticesBucky.push(lerpIco(isoVertices[8], isoVertices[0]));
  verticesBucky.push(lerpIco(isoVertices[8], isoVertices[4]));
  verticesBucky.push(lerpIco(isoVertices[8], isoVertices[9]));
  verticesBucky.push(lerpIco(isoVertices[8], isoVertices[5]));
  verticesBucky.push(lerpIco(isoVertices[8], isoVertices[2]));

  verticesBucky.push(lerpIco(isoVertices[9], isoVertices[1]));
  verticesBucky.push(lerpIco(isoVertices[9], isoVertices[3]));
  verticesBucky.push(lerpIco(isoVertices[9], isoVertices[5]));
  verticesBucky.push(lerpIco(isoVertices[9], isoVertices[8]));
  verticesBucky.push(lerpIco(isoVertices[9], isoVertices[4]));

  verticesBucky.push(lerpIco(isoVertices[10], isoVertices[0]));
  verticesBucky.push(lerpIco(isoVertices[10], isoVertices[2]));
  verticesBucky.push(lerpIco(isoVertices[10], isoVertices[7]));
  verticesBucky.push(lerpIco(isoVertices[10], isoVertices[11]));
  verticesBucky.push(lerpIco(isoVertices[10], isoVertices[6]));

  verticesBucky.push(lerpIco(isoVertices[11], isoVertices[1]));
  verticesBucky.push(lerpIco(isoVertices[11], isoVertices[6]));
  verticesBucky.push(lerpIco(isoVertices[11], isoVertices[10]));
  verticesBucky.push(lerpIco(isoVertices[11], isoVertices[7]));
  verticesBucky.push(lerpIco(isoVertices[11], isoVertices[3]));

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

  if (ratio > 0.5) {
    var lerpIcosido = function (indexA, centerIndex) {
      var a = verticesBucky[indexA];
      // var b = verticesBucky[indexB];
      var b = isoFaceCenters[centerIndex];
      a.x += (b.x - a.x) * icosidodeLerpRatio;
      a.y += (b.y - a.y) * icosidodeLerpRatio;
      a.z += (b.z - a.z) * icosidodeLerpRatio;
    };

    lerpIcosido(1, 0);
    lerpIcosido(11, 0);
    lerpIcosido(40, 0);

    lerpIcosido(0, 1);
    lerpIcosido(41, 1);
    lerpIcosido(20, 1);

    lerpIcosido(4, 2);
    lerpIcosido(21, 2);
    lerpIcosido(30, 2);

    lerpIcosido(3, 3);
    lerpIcosido(34, 3);
    lerpIcosido(50, 3);

    lerpIcosido(2, 4);
    lerpIcosido(51, 4);
    lerpIcosido(10, 4);

    lerpIcosido(12, 5);
    lerpIcosido(26, 5);
    lerpIcosido(44, 5);

    lerpIcosido(27, 6);
    lerpIcosido(48, 6);
    lerpIcosido(43, 6);

    lerpIcosido(24, 7);
    lerpIcosido(42, 7);
    lerpIcosido(49, 7);

    lerpIcosido(7, 8);
    lerpIcosido(23, 8);
    lerpIcosido(45, 8);

    lerpIcosido(8, 9);
    lerpIcosido(31, 9);
    lerpIcosido(22, 9);

    lerpIcosido(9, 10);
    lerpIcosido(56, 10);
    lerpIcosido(32, 10);

    lerpIcosido(33, 11);
    lerpIcosido(57, 11);
    lerpIcosido(54, 11);

    lerpIcosido(39, 12);
    lerpIcosido(53, 12);
    lerpIcosido(58, 12);

    lerpIcosido(14, 13);
    lerpIcosido(52, 13);
    lerpIcosido(35, 13);

    lerpIcosido(13, 14);
    lerpIcosido(36, 14);
    lerpIcosido(25, 14);

    lerpIcosido(6, 15);
    lerpIcosido(46, 15);
    lerpIcosido(15, 15);

    lerpIcosido(19, 16);
    lerpIcosido(47, 16);
    lerpIcosido(28, 16);

    lerpIcosido(18, 17);
    lerpIcosido(29, 17);
    lerpIcosido(37, 17);

    lerpIcosido(17, 18);
    lerpIcosido(38, 18);
    lerpIcosido(59, 18);

    lerpIcosido(5, 19);
    lerpIcosido(16, 19);
    lerpIcosido(55, 19);
  }
  return { vertices: verticesBucky, edges: edges };
};
