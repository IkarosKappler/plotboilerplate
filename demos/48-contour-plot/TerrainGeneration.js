"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function () {
  var TerrainGeneration = function (canvasId, xSegmentCount, ySegmentCount) {
    this.canvas = document.getElementById(canvasId);
    this.parent = this.canvas.parentElement;
    this.xSegmentCount = xSegmentCount || 16;
    this.ySegmentCount = ySegmentCount || 16;

    // @private
    this._minHeight = 0;
    this._maxHeight = 0;
    this._minX = 0;
    this._maxX = 0;
    this._minY = 0;
    this._maxY = 0;

    // Private
    this._planeGeometry = null;

    // Map<string,texture>
    this.textureStore = new Map();

    this.scene = new THREE.Scene();
    var canvasBounds = this.canvas.parentElement.getBoundingClientRect();
    let width = canvasBounds.width;
    let height = canvasBounds.height;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 100;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.ambientLightA = new THREE.AmbientLight(0xffffff);
    this.ambientLightA.position.set(350, 350, 50);
    this.scene.add(this.ambientLightA);

    this.directionalLightA = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLightA.position.set(350, 350, 50);
    this.scene.add(this.directionalLightA);

    this.directionalLightB = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLightB.position.set(-350, -350, -50);
    this.scene.add(this.directionalLightB);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      preserveDrawingBuffer: true, // This is required to take screen shots
      antialias: true // false
    });
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // Cache all geometries for later removal
    this.geometries = [];

    // Will never be removed
    const axesHelper = new THREE.AxesHelper(15);
    this.scene.add(axesHelper);

    var _self = this;
    window.addEventListener("resize", function () {
      _self.resizeCanvas();
    });
    this.resizeCanvas();

    var i = 0;
    function animate() {
      requestAnimationFrame(animate);
      _self.controls.update();
      _self.renderer.render(_self.scene, _self.camera);
      i++;
    }
    animate();
  };

  TerrainGeneration.prototype.resizeCanvas = function () {
    // let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    // let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var bounds = this.canvas.parentElement.getBoundingClientRect();
    let width = bounds.width;
    let height = bounds.height;
    // console.log("width", width, "height", height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = "" + width + "px";
    this.canvas.style.height = "" + height + "px";
    this.canvas.setAttribute("width", "" + width + "px");
    this.canvas.setAttribute("height", height + "px");
    this.camera.aspect = width / height;
    // this.camera.lookAt(new THREE.Vector3(0, 0, 120));
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    // What am I doing here?
    this.camera.setViewOffset(width, height, width / 4, height / 20, width, height);
  };

  TerrainGeneration.prototype.getIndicesFromBufferIndex = function (bufferIndex) {
    return { xIndex: Math.floor(bufferIndex % this.xSegmentCount), yIndex: Math.floor(bufferIndex / this.xSegmentCount) };
  };

  TerrainGeneration.prototype.getCoordsFromBufferIndex = function (bufferIndex) {
    var index = this.getIndicesFromBufferIndex(bufferIndex);
    // Note that the xSegmentCount and ySegmentCount counts plane squares, each consisting of four vertices
    index.xRel = index.xIndex / (this.xSegmentCount - 1);
    index.yRel = index.yIndex / (this.ySegmentCount - 1);
    return index;
  };

  TerrainGeneration.prototype.getMinHeight = function () {
    return this._minHeight;
  };

  TerrainGeneration.prototype.getMaxHeight = function () {
    return this._maxHeight;
  };

  TerrainGeneration.prototype.coordinateIndicesToBufferIndex = function (xIndex, yIndex) {
    return yIndex * this.xSegmentCount + xIndex;
  };

  TerrainGeneration.prototype.getHeightValueAt = function (xIndex, yIndex, isDebug) {
    // var bufferIndex = yIndex * this.xSegmentCount + xIndex;
    var bufferIndex = this.coordinateIndicesToBufferIndex(xIndex, yIndex);
    if (isDebug) {
      console.log("xIndex", xIndex, "yIndex", yIndex, "bufferIndex", bufferIndex);
    }
    return this._planeGeometry ? this._planeGeometry.vertices[bufferIndex].z : NaN;
  };

  // buffer: array[2][2]
  TerrainGeneration.prototype.getHeightFace4At = function (xIndex, yIndex, buffer) {
    buffer[0][0] = this.getHeightValueAt(xIndex, yIndex);
    buffer[1][0] = this.getHeightValueAt(xIndex + 1, yIndex);
    buffer[1][1] = this.getHeightValueAt(xIndex + 1, yIndex + 1);
    buffer[0][1] = this.getHeightValueAt(xIndex, yIndex + 1);
  };

  /**
   * @param {VoronoiCell[]}   options.voronoiDiagram
   * @param {Polygon}         options.clipPolygon
   * @param {boolean}         options.useTextureImage
   * @param {boolean?}        useTextureImage
   * @param {string?}         textureImagePath
   * @param {boolean?}        wireframe
   * @param {boolean?}        showNormals
   **/
  TerrainGeneration.prototype.rebuild = function (options) {
    this.removeCachedGeometries();

    this._planeGeometry = new THREE.PlaneGeometry(60, 60, this.xSegmentCount - 1, this.ySegmentCount - 1);
    this._maxHeight = Number.MIN_VALUE;
    this._minHeight = Number.MAX_VALUE;
    this._minX = 0.0;
    this._maxX = 2 * Math.PI;
    this._minY = 0.0;
    this._maxY = 2 * Math.PI;
    for (var i = 0, l = this._planeGeometry.vertices.length; i < l; i++) {
      var relPos = this.getCoordsFromBufferIndex(i);
      // console.log("relPos", relPos);
      var xAbs = this._minX + (this._maxX - this._minX) * relPos.xRel;
      var yAbs = this._minY + (this._maxY - this._minY) * relPos.yRel;
      // console.log("xAbs", xAbs, "yAbs", yAbs);
      this._planeGeometry.vertices[i].z = (Math.sin(xAbs) + Math.sin(yAbs)) * 10.0;
      this._maxHeight = Math.max(this._maxHeight, this._planeGeometry.vertices[i].z);
      this._minHeight = Math.min(this._minHeight, this._planeGeometry.vertices[i].z);
    }
    // geometry.translate(30, 30, 0);
    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      wireframe: true
    });
    var terrain = new THREE.Mesh(this._planeGeometry, material);

    // Assuming you already have your global scene, add the terrain to it
    this.scene.add(terrain);
    this.geometries.push(terrain);

    var useTextureImage = options.useTextureImage && typeof options.textureImagePath != "undefined";
    var textureImagePath = typeof options.textureImagePath != "undefined" ? options.textureImagePath : null;
    var wireframe = typeof options.wireframe != "undefined" ? options.wireframe : null;

    // if (options.showNormals) {
    //   var vnHelper = new VertexNormalsHelper(latheMesh, options.normalsLength, 0x00ff00, 1);
    //   this.scene.add(vnHelper);
    //   this.geometries.push(vnHelper);
    // }
  };

  TerrainGeneration.prototype.removeCachedGeometries = function () {
    for (var i = 0; i < this.geometries.length; i++) {
      var old = this.geometries[i];
      // Remove old object.
      //  A better way would be to update the lathe in-place. Possible?
      this.scene.remove(old);
      if (typeof old.dispose == "function") old.dispose();
      if (typeof old.material != "undefined" && typeof old.material.dispose == "function") old.material.dispose();
    }
    this.cachedGeometries = [];
  };

  window.TerrainGeneration = TerrainGeneration;
})();
