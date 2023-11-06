"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function () {
  var TerrainGeneration = function (canvasId) {
    this.basicSceneSetup = new BasicSceneSetup(canvasId);

    // Private
    this._planeGeometry = null;
    // DataGrid2dListAdapter
    this.dataGrid = null;
  };

  // options.pattern = "sine" | "cos"
  TerrainGeneration.prototype.rebuild = function (options) {
    if (!options || !options.xSegmentCount || !options.ySegmentCount) {
      throw "Cannot rebuild the terrain. Options `xSegmentCount` and `ySegmentCount` are mandatory.";
    }
    this.basicSceneSetup.removeCachedMeshes();

    this._planeGeometry = new THREE.PlaneGeometry(60, 60, options.xSegmentCount - 1, options.ySegmentCount - 1);
    this._maxHeight = Number.MIN_VALUE;
    this._minHeight = Number.MAX_VALUE;
    // TODO: these are just needed for calculatin [0,PI] or so ...
    var inputMinX = 0.0;
    var inputMaxX = 2 * Math.PI;
    var inputMinY = 0.0;
    var inputMaxY = 2 * Math.PI;
    var minX = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    this.dataGrid = new DataGrid2dListAdapter(this._planeGeometry.vertices, options.xSegmentCount, options.ySegmentCount);
    for (var i = 0, l = this._planeGeometry.vertices.length; i < l; i++) {
      var relPos = this.dataGrid.getCoordsFromBufferIndex(i);
      // console.log("relPos", relPos);
      var xAbs = inputMinX + (inputMaxX - inputMinX) * relPos.xRel;
      var yAbs = inputMinY + (inputMaxY - inputMinY) * relPos.yRel;
      // console.log("xAbs", xAbs, "yAbs", yAbs);
      if (options.pattern === "sine") {
        this._planeGeometry.vertices[i].z = (Math.sin(xAbs) + Math.sin(yAbs)) * 10.0;
      } else {
        this._planeGeometry.vertices[i].z = (Math.cos(xAbs) + Math.cos(yAbs)) * 10.0;
      }
      this._maxHeight = Math.max(this._maxHeight, this._planeGeometry.vertices[i].z);
      this._minHeight = Math.min(this._minHeight, this._planeGeometry.vertices[i].z);

      // Can't we just calculate this?
      minX = Math.min(minX, this._planeGeometry.vertices[i].x);
      maxX = Math.max(maxX, this._planeGeometry.vertices[i].x);
      minY = Math.min(minY, this._planeGeometry.vertices[i].y);
      maxY = Math.max(maxY, this._planeGeometry.vertices[i].y);
    }
    this.dataGrid.minDataValue = this._minHeight;
    this.dataGrid.maxDataValue = this._maxHeight;
    this.dataGrid.minX = minX;
    this.dataGrid.maxX = maxX;
    this.dataGrid.minY = minY;
    this.dataGrid.minY = minY;

    // geometry.translate(30, 30, 0);
    var material = this.basicSceneSetup.createMaterial(options);
    this._planeGeometry.computeVertexNormals();
    var terrainMesh = new THREE.Mesh(this._planeGeometry, material);

    // Assuming you already have your global scene, add the terrain to it
    this.basicSceneSetup.addMesh(terrainMesh, options);
  };

  window.TerrainGeneration = TerrainGeneration;
})();
