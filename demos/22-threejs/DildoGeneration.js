/**
 * A class to manage 3d scenes and the generation of dildo models.
 *
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

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.z = 500;

    var lightDistanceFactor = 10.0;

    // this.ambientLightA = new THREE.AmbientLight(0xffffff);
    this.ambientLightA = new THREE.PointLight(0xffffff, 5.0, 350.0 * lightDistanceFactor, 0.5); // color, intensity, distance, decay);
    this.ambientLightA.position.set(350, 0, -350).multiplyScalar(lightDistanceFactor);
    this.scene.add(this.ambientLightA);

    this.ambientLightB = new THREE.PointLight(0xffffff, 5.0, 350.0 * lightDistanceFactor, 0.5); // color, intensity, distance, decay);
    this.ambientLightB.position.set(-350, 0, 350).multiplyScalar(lightDistanceFactor);
    this.scene.add(this.ambientLightB);

    this.directionalLightA = new THREE.DirectionalLight(0xffffff, 2.0);
    // this.directionalLightA = new THREE.PointLight(0xffffff, 1.0, 350.0 * lightDistanceFactor, 0.5); // color, intensity, distance, decay);
    this.directionalLightA.position.set(350, 350, 350).multiplyScalar(lightDistanceFactor);
    this.scene.add(this.directionalLightA);
    this.scene.add(this.directionalLightA.target);

    this.directionalLightB = new THREE.DirectionalLight(0xffffff, 2.0);
    this.directionalLightB.position.set(-350, -350, -50).multiplyScalar(lightDistanceFactor);
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

  /**
   * Resize the 3d canvas to fit its container.
   */
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
   * Clears the current scene and rebuilds everything from scratch according to the
   * mesh options being passed.
   *
   * @param {BezierPath} options.outline
   * @param {number}     options.segmentCount
   * @param {number}     options.outlineSegmentCount (>= 2).
   * @param {number}     options.bendAngle The bending angle in degrees (!).
   * @param {boolean}    options.performSlice
   * @param {boolean?}   options.useTextureImage
   * @param {string?}    options.textureImagePath
   * @param {boolean?}   options.wireframe
   * @param {string}     options.renderFaces - "double" or "single" (default)
   **/
  DildoGeneration.prototype.rebuild = function (options) {
    this.removeCachedGeometries();

    var baseRadius = options.outline.getBounds().width;
    var baseShape = GeometryGenerationHelpers.mkCircularPolygon(
      baseRadius,
      options.shapeSegmentCount,
      options.baseShapeExcentricity
    );
    var dildoGeometry = new DildoGeometry(Object.assign({ baseShape: baseShape }, options));
    var useTextureImage = options.useTextureImage && typeof options.textureImagePath !== "undefined";
    var textureImagePath = typeof options.textureImagePath !== "undefined" ? options.textureImagePath : null;
    var doubleSingleSide = options.renderFaces == "double" ? THREE.DoubleSide : THREE.SingleSide;
    var wireframe = typeof options.wireframe !== "undefined" ? options.wireframe : null;

    var material = DildoMaterials.createMainMaterial(useTextureImage, wireframe, textureImagePath, doubleSingleSide);
    var bufferedGeometry = new THREE.BufferGeometry().fromGeometry(dildoGeometry);
    bufferedGeometry.computeVertexNormals();
    var latheMesh = new THREE.Mesh(bufferedGeometry, material);
    this.camera.lookAt(new THREE.Vector3(20, 0, 150));
    this.camera.lookAt(latheMesh.position);

    var spineGeometry = new THREE.Geometry();
    dildoGeometry.spineVertices.forEach(function (spineVert) {
      spineGeometry.vertices.push(spineVert.clone());
    });

    if (options.addSpine) {
      GeometryGenerationHelpers.addSpine(this, spineGeometry);
    }

    if (options.performSlice) {
      this.__performPlaneSlice(latheMesh, dildoGeometry, wireframe);
      // this.__performCsgSlice(latheMesh, geometry, material);
    } else {
      latheMesh.position.y = -100;
      latheMesh.userData["isExportable"] = true;
      this.addMesh(latheMesh);

      if (options.showNormals) {
        var vnHelper = new VertexNormalsHelper(latheMesh, options.normalsLength, 0x00ff00, 1);
        this.scene.add(vnHelper);
        this.geometries.push(vnHelper);
      }
    }

    // Add perpendicular path?
    if (options.showPerpendiculars) {
      GeometryGenerationHelpers.addPerpendicularPaths(this, dildoGeometry);
    }
  };

  /**
   * Perform the actual slice operation.
   *
   * This will create several new meshes:
   *  * a left geometry slice (along the z- axis).
   *  * a right geometry slice (along the z+ axis).
   *  * an inner slice cut geometry (inside the dildo model, cutting it into two halves).
   *  * an outer slice cut geometry (inside the mould model, cutting that one into two halves).
   *
   * These will always be generated, even if the options tell different; if so then they are set
   * to be invisible.
   *
   * @param {THREE.Geometry} latheMesh - The buffered dildo geometry (required to perform the slice operation).
   * @param {DildoGeometry} latheUnbufferedGeometry - The unbuffered dildo geometry (required to obtain the perpendicular path lines).
   * @param {boolean} wireframe
   */
  DildoGeneration.prototype.__performPlaneSlice = function (latheMesh, latheUnbufferedGeometry, wireframe) {
    var leftPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    GeometryGenerationHelpers.makeAndAddSlice(this, latheUnbufferedGeometry, leftPlane, -50, wireframe);

    var rightPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    GeometryGenerationHelpers.makeAndAddSlice(this, latheUnbufferedGeometry, rightPlane, 50, wireframe);

    // Find points on intersection path (this is a single path in this configuration)
    var planeGeom = new THREE.PlaneGeometry(300, 300);
    var planeMesh = new THREE.Mesh(
      planeGeom,
      new THREE.MeshBasicMaterial({
        color: "lightgray",
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide
      })
    );
    planeMesh.rotation.x = Math.PI / 5;
    this.addMesh(planeMesh);
    GeometryGenerationHelpers.makeAndAddPlaneIntersection(this, latheMesh, latheUnbufferedGeometry, planeMesh);
  };

  /**
   * NOT CURRENTLY IN USE (too unstable?)
   *
   * @param {*} latheMesh
   * @param {*} latheUnbufferedGeometry
   * @param {*} material
   */
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
    this.addMesh(cube_mesh);
    var cube_bsp = new ThreeBSP(cube_mesh);
    var mesh_bsp = new ThreeBSP(new THREE.Mesh(latheUnbufferedGeometry, material));
    var subtract_bsp = cube_bsp.subtract(mesh_bsp);
    var result = subtract_bsp.toMesh(material);
    this.addMesh(result);
  };

  /**
   * Add a mesh to the underlying scene.
   *
   * The function will make some modifications to the rotation of the meshes.
   * @param {THREE.Mesh} mesh
   */
  DildoGeneration.prototype.addMesh = function (mesh) {
    mesh.rotation.x = Math.PI;
    this.scene.add(mesh);
    this.geometries.push(mesh);
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

  /**
   * Generate an STL string from the (exportable) meshes that are currently stored inside this generator.
   *
   * @param {function(string)} options.onComplete
   **/
  DildoGeneration.prototype.generateSTL = function (options) {
    var exporter = new THREE.STLExporter();
    var stlBuffer = []; // Array<string>
    for (var i in this.geometries) {
      if (this.geometries[i].userData["isExportable"] === true) {
        var stlData = exporter.parse(this.geometries[i]);
        stlBuffer.push(stlData);
      }
    }
    if (typeof options.onComplete === "function") {
      options.onComplete(stlBuffer.join("\n\n"));
    } else {
      console.warn("STL data was generated but no 'onComplete' callback was defined.");
    }
  };

  window.DildoGeneration = DildoGeneration;
})();
