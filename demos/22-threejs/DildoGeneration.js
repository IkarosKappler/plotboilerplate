/**
 * @author   Ikaros Kappler
 * @date     2020-07-01
 * @modified 2020-09-11 Added proper texture loading.
 * @modified 2021-06-07 Fixing `removeCachedGeometries`. Adding bending of model.
 * @version  1.2.0
 **/

(function () {
  var DildoGeneration = function (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.parent = this.canvas.parentElement;

    // Map<string,texture>
    this.textureStore = new Map();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 500;

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

  DildoGeneration.prototype.resizeCanvas = function () {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = "" + width + "px";
    this.canvas.style.height = "" + height + "px";
    this.canvas.setAttribute("width", "" + width + "px");
    this.canvas.setAttribute("height", height + "px");
    this.renderer.setSize(width, height);
    // What am I doing here?
    this.camera.setViewOffset(width, height, width / 4, height / 20, width, height);
  };

  /**
   * @param {BezierPath} options.outline
   * @param {number}     options.segmentCount
   * @param {number}     options.outlineSegmentCount (>= 2).
   * @param {number}     options.bendAngle The bending angle in degrees (!).
   * @param {boolean}    options.performSlice
   * @param {boolean?}   options.useTextureImage
   * @param {string?}    options.textureImagePath
   * @param {boolean?}   options.wireframe
   **/
  DildoGeneration.prototype.rebuild = function (options) {
    this.removeCachedGeometries();

    var baseRadius = options.outline.getBounds().width;
    var baseShape = mkCircularPolygon(baseRadius, options.shapeSegmentCount);
    var geometry = new DildoGeometry(Object.assign({ baseShape: baseShape }, options));
    var useTextureImage = options.useTextureImage && typeof options.textureImagePath != "undefined";
    var textureImagePath = typeof options.textureImagePath != "undefined" ? options.textureImagePath : null;
    var wireframe = typeof options.wireframe != "undefined" ? options.wireframe : null;
    var material = this._createMaterial(useTextureImage, wireframe, textureImagePath);
    var bufferedGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    bufferedGeometry.computeVertexNormals();
    var latheMesh = new THREE.Mesh(bufferedGeometry, material);
    // var latheMesh = new THREE.Mesh(geometry, material);
    // latheMesh.position.y = -100;
    this.camera.lookAt(new THREE.Vector3(20, 0, 150));
    this.camera.lookAt(latheMesh.position);

    if (options.performSlice) {
      this.__performPlaneSlice(latheMesh, geometry);
      // this.__performCsgSlice(latheMesh, geometry, material);
    } else {
      latheMesh.position.y = -100;
      latheMesh.userData.isExportable = true;
      this._addMesh(latheMesh);

      if (options.showNormals) {
        var vnHelper = new VertexNormalsHelper(latheMesh, options.normalsLength, 0x00ff00, 1);
        this.scene.add(vnHelper);
        this.geometries.push(vnHelper);
      }
    }
  };

  DildoGeneration.prototype.__performPlaneSlice = function (latheMesh, latheUnbufferedGeometry) {
    var leftPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    makeAndAddSlice(this, latheUnbufferedGeometry, leftPlane, -50);

    var rightPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    makeAndAddSlice(this, latheUnbufferedGeometry, rightPlane, 50);

    // Find points on intersection path (this is a single path in this configuration)
    var planeGeom = new THREE.PlaneGeometry(300, 300);
    var planeMesh = new THREE.Mesh(
      planeGeom,
      new THREE.MeshBasicMaterial({
        color: "lightgray",
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      })
    );
    planeMesh.rotation.x = Math.PI / 5;
    this._addMesh(planeMesh);

    makeAndAddPlaneIntersection(this, latheMesh, latheUnbufferedGeometry, planeMesh);
  };

  // NOT CURRENTLY IN USE (too unstable?)
  DildoGeneration.prototype.__performCsgSlice = function (latheMesh, latheUnbufferedGeometry, material) {
    latheMesh.updateMatrix();
    var bbox = new THREE.Box3().setFromObject(latheMesh);
    // console.log(bbox);
    var box_material = new THREE.MeshBasicMaterial({ wireframe: true });
    var cube_geometry = new THREE.CubeGeometry(
      ((bbox.max.x - bbox.min.x) / 2) * 1.2 + 0.01,
      (bbox.max.y - bbox.min.y) * 1.1,
      (bbox.max.z - bbox.min.z) * 1.2
    );
    var cube_mesh = new THREE.Mesh(cube_geometry, box_material);
    cube_mesh.updateMatrix();
    cube_mesh.position.x = latheMesh.position.x + (bbox.max.x - bbox.min.x) / 4;
    cube_mesh.position.y = bbox.min.y + (bbox.max.y - bbox.min.y) / 2 + -30;
    cube_mesh.position.z = bbox.min.z + (bbox.max.z - bbox.min.z) / 2;
    this._addMesh(cube_mesh);
    var cube_bsp = new ThreeBSP(cube_mesh);
    var mesh_bsp = new ThreeBSP(new THREE.Mesh(latheUnbufferedGeometry, material));
    var subtract_bsp = cube_bsp.subtract(mesh_bsp);
    var result = subtract_bsp.toMesh(material);
    this._addMesh(result);
  };

  DildoGeneration.prototype._addMesh = function (mesh) {
    mesh.rotation.x = Math.PI;
    this.scene.add(mesh);
    this.geometries.push(mesh);
  };

  DildoGeneration.prototype._createMaterial = function (useTextureImage, wireframe, textureImagePath) {
    return useTextureImage
      ? new THREE.MeshLambertMaterial({
          color: 0xffffff,
          wireframe: wireframe,
          flatShading: false,
          depthTest: true,
          opacity: 1.0,
          side: THREE.DoubleSide,
          visible: true,
          emissive: 0x0,
          reflectivity: 1.0,
          refractionRatio: 0.89,
          map: this.loadTextureImage(textureImagePath)
        })
      : new THREE.MeshPhongMaterial({
          color: 0x3838ff,
          wireframe: wireframe,
          flatShading: false,
          depthTest: true,
          opacity: 1.0,
          side: THREE.DoubleSide,
          visible: true,
          emissive: 0x0,
          reflectivity: 1.0,
          refractionRatio: 0.89,
          specular: 0x888888,
          map: null
        });
  };

  DildoGeneration.prototype.removeCachedGeometries = function () {
    for (var i = 0; i < this.geometries.length; i++) {
      var old = this.geometries[i];
      // Remove old object.
      //  A better way would be to update the lathe in-place. Possible?
      this.scene.remove(old);
      if (typeof old.dispose == "function") old.dispose();
      if (typeof old.material != "undefined" && typeof old.material.dispose == "function") old.material.dispose();
    }
    this.geometries = [];
  };

  DildoGeneration.prototype.loadTextureImage = function (path) {
    var texture = this.textureStore.get(path);
    if (!texture) {
      var loader = new THREE.TextureLoader();
      var texture = loader.load(path);
      this.textureStore.set(path, texture);
    }
    return texture;
  };

  /**
   * Generate an STL string.
   *
   * @param {function} options.onComplete
   **/
  DildoGeneration.prototype.generateSTL = function (options) {
    var exporter = new THREE.STLExporter();
    // TODO: when splitted there is more than one geometry to export : )
    var stlData = exporter.parse(this.geometries[0]);
    // var stlData = exporter.parse(this.geometries);
    if (typeof options.onComplete === "function") {
      options.onComplete(stlData);
    } else {
      console.warn("STL data was generated but no 'onComplete' callback was defined.");
    }
  };

  /**
   * A helper function to create (discrete) circular shapes.
   *
   * @param {number} radius - The radius of the circle.
   * @param {number} pointCount - The number of vertices to construct the circle with.
   * @returns {Polygon}
   */
  var mkCircularPolygon = function (radius, pointCount) {
    var vertices = [];
    var phi;
    for (var i = 0; i < pointCount; i++) {
      phi = Math.PI * 2 * (i / pointCount);
      vertices.push(new Vertex(Math.cos(phi) * radius, Math.sin(phi) * radius));
    }
    return new Polygon(vertices, false);
  };

  // @param {THREE.PlaneGeometry}
  // var _self = this;
  var makeAndAddSlice = function (thisGenerator, unbufferGeometry, plane, zOffset) {
    // Slice mesh into two
    // See https://github.com/tdhooper/threejs-slice-geometry
    var closeHoles = false;
    var sliceMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
    var slicedGeometry = sliceGeometry(unbufferGeometry, plane, closeHoles);
    var slicedMesh = new THREE.Mesh(slicedGeometry, sliceMaterial);
    slicedMesh.position.y = -100;
    slicedMesh.position.z = zOffset;
    slicedMesh.userData.isExportable = true;
    thisGenerator._addMesh(slicedMesh);
  };

  var makeAndAddPlaneIntersection = function (thisGenerator, mesh, unbufferedGeometry, planeMesh) {
    var planeMeshIntersection = new PlaneMeshIntersection();
    var intersectionPoints = planeMeshIntersection.getIntersectionPoints(mesh, unbufferedGeometry, planeMesh);
    var pointGeometry = new THREE.Geometry();
    pointGeometry.vertices = intersectionPoints;
    var pointsMaterial = new THREE.PointsMaterial({
      size: 1,
      color: 0x00a8ff
    });
    var pointsMesh = new THREE.Points(pointGeometry, pointsMaterial);

    var linesMesh = new THREE.LineSegments(
      pointGeometry,
      new THREE.LineBasicMaterial({
        color: 0xff8800
      })
    );
    linesMesh.position.y = -100;
    linesMesh.position.z = -50;
    pointsMesh.position.y = -100;
    pointsMesh.position.z = -50;
    thisGenerator._addMesh(linesMesh);
    thisGenerator._addMesh(pointsMesh);
  };

  window.DildoGeneration = DildoGeneration;
})();
