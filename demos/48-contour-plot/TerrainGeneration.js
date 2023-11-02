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

    // Map<string,texture>
    this.textureStore = new Map();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));

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
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    // What am I doing here?
    this.camera.setViewOffset(width, height, width / 4, height / 20, width, height);
  };

  TerrainGeneration.prototype.getIndexFromBuffer = function (bufferIndex) {
    return { xIndex: Math.floor(bufferIndex % this.xSegmentCount), yIndex: Math.floor(bufferIndex / this.xSegmentCount) };
  };

  TerrainGeneration.prototype.getPositionFromBuffer = function (bufferIndex) {
    var index = this.getIndexFromBuffer(bufferIndex);
    // Note that the xSegmentCount and ySegmentCount counts plane squares, each consisting of four vertices
    index.xRel = index.xIndex / (this.xSegmentCount - 1);
    index.yRel = index.yIndex / (this.ySegmentCount - 1);
    return index;
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

    var geometry = new THREE.PlaneGeometry(60, 60, this.xSegmentCount - 1, this.ySegmentCount - 1);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      var relPos = this.getPositionFromBuffer(i);
      console.log("relPos", relPos);
      geometry.vertices[i].z = (Math.cos(relPos.xRel * 2 * Math.PI) + Math.cos(relPos.yRel * 2 * Math.PI)) * 10.0;
    }
    // geometry.translate(30, 30, 0);
    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      wireframe: true
    });
    var terrain = new THREE.Mesh(geometry, material);

    // Assuming you already have your global scene, add the terrain to it
    this.scene.add(terrain);
    this.geometries.push(terrain);

    this.camera.lookAt(terrain.position);

    var useTextureImage = options.useTextureImage && typeof options.textureImagePath != "undefined";
    var textureImagePath = typeof options.textureImagePath != "undefined" ? options.textureImagePath : null;
    var wireframe = typeof options.wireframe != "undefined" ? options.wireframe : null;

    // var material = useTextureImage
    //   ? new THREE.MeshLambertMaterial({
    //       color: 0xffffff,
    //       wireframe: wireframe,
    //       flatShading: false,
    //       depthTest: true,
    //       opacity: 1.0,
    //       side: THREE.DoubleSide,
    //       visible: true,
    //       emissive: 0x0,
    //       reflectivity: 1.0,
    //       refractionRatio: 0.89,
    //       // shading : THREE.LambertShading,
    //       map: this.loadTextureImage(options.textureImagePath)
    //     })
    //   : new THREE.MeshPhongMaterial({
    //       color: 0x3838ff,
    //       wireframe: wireframe,
    //       flatShading: false,
    //       depthTest: true,
    //       opacity: 1.0,
    //       side: THREE.DoubleSide,
    //       visible: true,
    //       emissive: 0x0,
    //       reflectivity: 1.0,
    //       refractionRatio: 0.89,
    //       specular: 0x888888,
    //       // shading : THREE.LambertShading,
    //       map: null
    //     });
    // var bufferedGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    // bufferedGeometry.computeVertexNormals();
    // var latheMesh = new THREE.Mesh(bufferedGeometry, material);
    // latheMesh.position.y = -100;
    // latheMesh.rotation.x = Math.PI;
    // this.camera.lookAt(new THREE.Vector3(20, 0, 150));
    // this.scene.add(latheMesh);
    // this.geometries.push(latheMesh);

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

  //   VoronoiGeneration.prototype.loadTextureImage = function (path) {
  //     var texture = this.textureStore.get(path);
  //     if (!texture) {
  //       var loader = new THREE.TextureLoader();
  //       var texture = loader.load(path);
  //       this.textureStore.set(path, texture);
  //     }
  //     return texture;
  //   };

  /**
   * Generate an STL string.
   *
   * @param {function} options.onComplete
   **/
  //   TerrainGeneration.prototype.generateSTL = function (options) {
  //     var exporter = new THREE.STLExporter();
  //     var stlData = exporter.parse(this.geometries[0]);
  //     if (typeof options.onComplete === "function") {
  //       options.onComplete(stlData);
  //     } else {
  //       console.warn("STL data was generated but no 'onComplete' callback was defined.");
  //     }
  //   };

  window.TerrainGeneration = TerrainGeneration;
})();
