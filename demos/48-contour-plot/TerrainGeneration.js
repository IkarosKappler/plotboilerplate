"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function () {
  var TerrainGeneration = function (canvasId, xSegmentCount, ySegmentCount) {
    this.basicSceneSetup = new BasicSceneSetup(canvasId);

    this.xSegmentCount = xSegmentCount || 16;
    this.ySegmentCount = ySegmentCount || 16;

    // // @private
    // this._minHeight = 0;
    // this._maxHeight = 0;
    // this._minX = 0;
    // this._maxX = 0;
    // this._minY = 0;
    // this._maxY = 0;

    // Private
    this._planeGeometry = null;
    // DataGrid2dListAdapter
    this.dataGrid = null;
  };

  // TerrainGeneration.prototype.getIndicesFromBufferIndex = function (bufferIndex) {
  //   return { xIndex: Math.floor(bufferIndex % this.xSegmentCount), yIndex: Math.floor(bufferIndex / this.xSegmentCount) };
  // };

  // TerrainGeneration.prototype.getCoordsFromBufferIndex = function (bufferIndex) {
  //   var index = this.getIndicesFromBufferIndex(bufferIndex);
  //   // Note that the xSegmentCount and ySegmentCount counts plane squares, each consisting of four vertices
  //   index.xRel = index.xIndex / (this.xSegmentCount - 1);
  //   index.yRel = index.yIndex / (this.ySegmentCount - 1);
  //   return index;
  // };

  // TerrainGeneration.prototype.getMinHeight = function () {
  //   return this._minHeight;
  // };

  // TerrainGeneration.prototype.getMaxHeight = function () {
  //   return this._maxHeight;
  // };

  // TerrainGeneration.prototype.coordinateIndicesToBufferIndex = function (xIndex, yIndex) {
  //   return yIndex * this.xSegmentCount + xIndex;
  // };

  // TerrainGeneration.prototype.getHeightValueAt = function (xIndex, yIndex, isDebug) {
  //   // var bufferIndex = yIndex * this.xSegmentCount + xIndex;
  //   var bufferIndex = this.coordinateIndicesToBufferIndex(xIndex, yIndex);
  //   if (isDebug) {
  //     console.log("xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
  //   }
  //   if (bufferIndex > this._planeGeometry.vertices) {
  //     console.error("ERR buffer index is out of bounds! xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
  //   }
  //   if (!this._planeGeometry.vertices[bufferIndex]) {
  //     console.error("ERR buffer element is null! xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
  //   }
  //   return this._planeGeometry ? this._planeGeometry.vertices[bufferIndex].z : NaN;
  // };

  // // buffer: array[2][2]
  // TerrainGeneration.prototype.getHeightFace4At = function (xIndex, yIndex, buffer) {
  //   buffer[0][0] = this.getHeightValueAt(xIndex, yIndex);
  //   buffer[1][0] = this.getHeightValueAt(xIndex + 1, yIndex);
  //   buffer[1][1] = this.getHeightValueAt(xIndex + 1, yIndex + 1);
  //   buffer[0][1] = this.getHeightValueAt(xIndex, yIndex + 1);
  // };

  /**
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        options.useTextureImage
   * @param {string?}         options.textureImagePath
   * @param {boolean?}        options.wireframe
   * @param {boolean?}        options.showNormals
   **/
  // TerrainGeneration.prototype.rebuild = function (options) {
  //   this.basicSceneSetup.removeCachedMeshes();

  //   this._planeGeometry = new THREE.PlaneGeometry(60, 60, this.xSegmentCount - 1, this.ySegmentCount - 1);
  //   this._maxHeight = Number.MIN_VALUE;
  //   this._minHeight = Number.MAX_VALUE;
  //   this._minX = 0.0;
  //   this._maxX = 2 * Math.PI;
  //   this._minY = 0.0;
  //   this._maxY = 2 * Math.PI;
  //   for (var i = 0, l = this._planeGeometry.vertices.length; i < l; i++) {
  //     var relPos = this.getCoordsFromBufferIndex(i);
  //     // console.log("relPos", relPos);
  //     var xAbs = this._minX + (this._maxX - this._minX) * relPos.xRel;
  //     var yAbs = this._minY + (this._maxY - this._minY) * relPos.yRel;
  //     // console.log("xAbs", xAbs, "yAbs", yAbs);
  //     this._planeGeometry.vertices[i].z = (Math.sin(xAbs) + Math.sin(yAbs)) * 10.0;
  //     this._maxHeight = Math.max(this._maxHeight, this._planeGeometry.vertices[i].z);
  //     this._minHeight = Math.min(this._minHeight, this._planeGeometry.vertices[i].z);
  //   }
  //   // geometry.translate(30, 30, 0);
  //   var material = this.basicSceneSetup.createMaterial(options);
  //   this._planeGeometry.computeVertexNormals();
  //   var terrainMesh = new THREE.Mesh(this._planeGeometry, material);

  //   // Assuming you already have your global scene, add the terrain to it
  //   this.basicSceneSetup.addMesh(terrainMesh, options);
  // };

  TerrainGeneration.prototype.rebuild = function (options) {
    this.basicSceneSetup.removeCachedMeshes();

    this._planeGeometry = new THREE.PlaneGeometry(60, 60, this.xSegmentCount - 1, this.ySegmentCount - 1);
    this._maxHeight = Number.MIN_VALUE;
    this._minHeight = Number.MAX_VALUE;
    // TODO: these are just needed for calculatin [0,PI] or so ...
    this._minX = 0.0;
    this._maxX = 2 * Math.PI;
    this._minY = 0.0;
    this._maxY = 2 * Math.PI;
    var minX = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    for (var i = 0, l = this._planeGeometry.vertices.length; i < l; i++) {
      var relPos = dataGrid.getCoordsFromBufferIndex(i);
      // console.log("relPos", relPos);
      var xAbs = this._minX + (this._maxX - this._minX) * relPos.xRel;
      var yAbs = this._minY + (this._maxY - this._minY) * relPos.yRel;
      // console.log("xAbs", xAbs, "yAbs", yAbs);
      this._planeGeometry.vertices[i].z = (Math.sin(xAbs) + Math.sin(yAbs)) * 10.0;
      this._maxHeight = Math.max(this._maxHeight, this._planeGeometry.vertices[i].z);
      this._minHeight = Math.min(this._minHeight, this._planeGeometry.vertices[i].z);

      // Can't we just calculate this?
      minX = Math.min(minX, this._planeGeometry.vertices[i].x);
      maxX = Math.max(maxX, this._planeGeometry.vertices[i].x);
      minY = Math.min(minY, this._planeGeometry.vertices[i].y);
      maxY = Math.max(maxY, this._planeGeometry.vertices[i].y);
    }
    this.dataGrid = new DataGrid2dListAdapter(
      this._planeGeometry.vertices,
      this.xSegmentCount,
      this.ySegmentCount,
      this._minHeight,
      this._maxHeight,
      minX,
      maxX,
      minY,
      maxY
    );
    // geometry.translate(30, 30, 0);
    var material = this.basicSceneSetup.createMaterial(options);
    this._planeGeometry.computeVertexNormals();
    var terrainMesh = new THREE.Mesh(this._planeGeometry, material);

    // Assuming you already have your global scene, add the terrain to it
    this.basicSceneSetup.addMesh(terrainMesh, options);
  };

  window.TerrainGeneration = TerrainGeneration;
})();
