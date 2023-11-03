"use strict";
/**
 * Some basix THREEJS scene setup for reuse.
 *
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function (_context) {
  var BasicSceneSetup = function (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.parent = this.canvas.parentElement;

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

  BasicSceneSetup.prototype.resizeCanvas = function () {
    var bounds = this.canvas.parentElement.getBoundingClientRect();
    let width = bounds.width;
    let height = bounds.height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = "" + width + "px";
    this.canvas.style.height = "" + height + "px";
    this.canvas.setAttribute("width", "" + width + "px");
    this.canvas.setAttribute("height", height + "px");
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    // What am I doing here?
    // this.camera.setViewOffset(width, height, width / 4, height / 20, width, height);
  };

  BasicSceneSetup.prototype.createMaterial = function (options) {
    var useTextureImage = options && options.useTextureImage && typeof options.textureImagePath != "undefined";
    var textureImagePath = useTextureImage ? options.textureImagePath : null;
    var wireframe = options && typeof options.wireframe != "undefined" ? options.wireframe : null;

    if (wireframe) {
      return new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        wireframe: true
      });
    }

    if (useTextureImage) {
      //   var loader = new THREE.TextureLoader();
      var texture = this.loadTextureImage(textureImagePath); //  loader.load(textureImagePath);

      return new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: false,
        flatShading: false,
        depthTest: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        visible: true,
        emissive: 0x0,
        reflectivity: 1.0,
        refractionRatio: 0.89,
        // shading : THREE.LambertShading,
        map: texture
      });
    }

    return new THREE.MeshPhongMaterial({
      color: 0x3838ff,
      wireframe: false,
      flatShading: false,
      depthTest: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      visible: true,
      emissive: 0x0,
      reflectivity: 1.0,
      refractionRatio: 0.89,
      specular: 0x888888,
      // shading : THREE.LambertShading,
      map: null
    });
  };

  BasicSceneSetup.prototype.addMesh = function (mesh, options) {
    this.geometries.push(mesh);
    this.scene.add(mesh);

    if (options.showNormals) {
      var vnHelper = new VertexNormalsHelper(terrainMesh, options.normalsLength, 0x00ff00, 1);
      this.scene.add(vnHelper);
      this.geometries.push(vnHelper);
    }
  };

  BasicSceneSetup.prototype.removeCachedMeshes = function () {
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

  BasicSceneSetup.prototype.loadTextureImage = function (path) {
    var texture = this.textureStore.get(path);
    if (!texture) {
      var loader = new THREE.TextureLoader();
      var texture = loader.load(path);
      this.textureStore.set(path, texture);
    }
    return texture;
  };

  _context.BasicSceneSetup = BasicSceneSetup;
})(globalThis);
