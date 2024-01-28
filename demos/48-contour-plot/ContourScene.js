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
   * @param {PolygonContainmentTree[]} containmentTrees
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        options.useTextureImage
   * @param {string?}         options.textureImagePath
   * @param {boolean?}        options.wireframe
   * @param {boolean?}        options.showNormals
   **/
  ContourScene.prototype.addAllPolygonContainmentTrees = function (containmentTrees, options) {
    this.basicSceneSetup.removeCachedMeshes();

    for (var i = 0; i < containmentTrees.length; i++) {
      // if( containmentTrees)
      // Only process root elements (those without a parent)
      if (!containmentTrees[i].parentPolygon) {
        this.addPolygonContainmentTree(containmentTrees[i]);
      }
    }
  };

  /**
   * @param {PolygonContainmentTree} containmentTree
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        options.useTextureImage
   * @param {string?}         options.textureImagePath
   * @param {boolean?}        options.wireframe
   * @param {boolean?}        options.showNormals
   **/
  ContourScene.prototype.addPolygonContainmentTree = function (containmentTree, options) {
    const shape = ContourScene.convert.polygonToShape(containmentTree.polygon);

    for (var i = 0; i < containmentTree.children.length; i++) {
      const hole = ContourScene.convert.polygonToShape(containmentTree.children[i].polygon);
      shape.holes.push(hole);
    }

    const material = this.basicSceneSetup.createMaterial();
    const geometry = new THREE.ShapeGeometry([shape]);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2.0;

    // Assuming you already have your global scene, add the 2d shape to it
    this.basicSceneSetup.addMesh(mesh, {}); // No options here

    // Recursive call: try to find polygons on the second next level
    for (var i = 0; i < containmentTree.children.length; i++) {
      for (var j = 0; j < containmentTree.children[i].children.length; j++) {
        this.addPolygonContainmentTree(containmentTree.children[i].children[j]);
      }
    }
  };

  /**
   * @param {Array<GenericPath>} contourScene
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        options.useTextureImage
   * @param {string?}         options.textureImagePath
   * @param {boolean?}        options.wireframe
   * @param {boolean?}        options.showNormals
   **/
  // ContourScene.prototype._addContour = function (contourArray, options) {
  //   // this.basicSceneSetup.removeCachedMeshes();

  //   var shapes = [];
  //   for (var i = 0; i < contourArray.length; i++) {
  //     const path = contourArray[i];
  //     if (path.segments.length <= 1) {
  //       continue;
  //     }
  //     const shape = new THREE.Shape();
  //     shape.moveTo(path.segments[0].a.x, path.segments[0].a.y);
  //     shape.lineTo(path.segments[0].b.x, path.segments[0].b.y);
  //     for (var j = 1; j < path.segments.length; j++) {
  //       const lineSegment = path.segments[j];
  //       shape.lineTo(lineSegment.b.x, lineSegment.b.y);
  //     }
  //     shape.closePath();
  //     shapes.push(shape);
  //   }

  //   // Generade 3d extrusion or plain 2d shape?
  //   // // prettier-ignore
  //   // const extrudeSettings = {
  //   //     steps: 2,
  //   //     depth: 1, // 16,
  //   //     bevelEnabled: false, // true,
  //   //     // bevelThickness: 1,
  //   //     // bevelSize: 1,
  //   //     // bevelOffset: 0,
  //   //     // bevelSegments: 1
  //   // };
  //   // const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  //   const material = this.basicSceneSetup.createMaterial();
  //   const geometry = new THREE.ShapeGeometry(shapes);
  //   const mesh = new THREE.Mesh(geometry, material);
  //   mesh.rotation.x = Math.PI / 2.0;

  //   // Assuming you already have your global scene, add the 2d shape to it
  //   this.basicSceneSetup.addMesh(mesh, {}); // No options here
  // };

  ContourScene.convert = {
    polygonToShape: function (polygon) {
      const shape = new THREE.Shape();

      if (polygon.vertices.length <= 2) {
        return;
      }

      const polyVerts = polygon.vertices;
      shape.moveTo(polyVerts[0].x, polyVerts[0].y);
      // shape.lineTo(polyVerts[1].x, polyVerts[1].y);
      for (var j = 1; j < polyVerts.length; j++) {
        shape.lineTo(polyVerts[j].x, polyVerts[j].y);
      }
      shape.closePath();
      return shape;
    }
  };

  _context.ContourScene = ContourScene;
})(globalThis);
