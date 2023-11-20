"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function (_context) {
  var ContourScene = function (canvasId) {
    this.basicSceneSetup = new BasicSceneSetup(canvasId);
  };

  /**
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        options.useTextureImage
   * @param {string?}         options.textureImagePath
   * @param {boolean?}        options.wireframe
   * @param {boolean?}        options.showNormals
   **/
  ContourScene.prototype.rebuild = function (options) {
    this.basicSceneSetup.removeCachedMeshes();

    var testGeometry = new THREE.BoxGeometry(10, 10, 10);
    var material = this.basicSceneSetup.createMaterial({}); // options
    var testMesh = new THREE.Mesh(testGeometry, material);

    // Assuming you already have your global scene, add the terrain to it
    this.basicSceneSetup.addMesh(testMesh, {}); // options);
  };

  /**
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        options.useTextureImage
   * @param {string?}         options.textureImagePath
   * @param {boolean?}        options.wireframe
   * @param {boolean?}        options.showNormals
   **/
  ContourScene.prototype.addContour = function (contourArray, options) {
    this.basicSceneSetup.removeCachedMeshes();

    var shapes = [];
    for (var i = 0; i < contourArray.length; i++) {
      const path = contourArray[i];
      // console.log(
      //   path.segments.map(function (line) {
      //     return "[" + line.a.x + "," + line.a.y + "][" + line.b.x + "," + line.b.y + "]";
      //   })
      // );
      if (path.segments.length <= 1) {
        continue;
      }
      const shape = new THREE.Shape();
      shape.moveTo(path.segments[0].a.x, path.segments[0].a.y);
      shape.lineTo(path.segments[0].b.x, path.segments[0].b.y);
      for (var j = 1; j < path.segments.length; j++) {
        const lineSegment = path.segments[j];
        shape.lineTo(lineSegment.b.x, lineSegment.b.y);
      }
      shape.closePath();
      shapes.push(shape);
    }

    // Generade 3d extrusion or plain 2d shape?
    // // prettier-ignore
    // const extrudeSettings = {
    //     steps: 2,
    //     depth: 1, // 16,
    //     bevelEnabled: false, // true,
    //     // bevelThickness: 1,
    //     // bevelSize: 1,
    //     // bevelOffset: 0,
    //     // bevelSegments: 1
    // };
    // const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = this.basicSceneSetup.createMaterial();
    const geometry = new THREE.ShapeGeometry(shapes);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2.0;

    // Assuming you already have your global scene, add the 2d shape to it
    this.basicSceneSetup.addMesh(mesh, {}); // No options here
  };

  _context.ContourScene = ContourScene;
})(globalThis);
