/**
 * @author   Ikaros Kappler
 * @date     2020-07-01
 * @modified 2020-09-11 Added proper texture loading.
 * @version  1.0.1
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
   * @param {number}     outlineSegmentCount (>= 2).
   * @param {number}     bendAngle The bending angle in degrees (!).
   * @param {boolean?}   useTextureImage
   * @param {string?}    textureImagePath
   * @param {boolean?}   wireframe
   **/
  DildoGeneration.prototype.rebuild = function (options) {
    this.removeCachedGeometries();

    var bendAngleRad = (options.bendAngle / 180) * Math.PI;
    var baseRadius = options.outline.getBounds().width;
    var baseShape = mkCircularPolygon(baseRadius, options.shapeSegmentCount);
    var geometry = new DildoGeometry(Object.assign({ baseShape: baseShape }, options));
    var useTextureImage = options.useTextureImage && typeof options.textureImagePath != "undefined";
    var textureImagePath = typeof options.textureImagePath != "undefined" ? options.textureImagePath : null;
    var wireframe = typeof options.wireframe != "undefined" ? options.wireframe : null;

    var material = useTextureImage
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
          // shading : THREE.LambertShading,
          map: this.loadTextureImage(options.textureImagePath)
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
          // shading : THREE.LambertShading,
          map: null
        });
    var bufferedGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    bufferedGeometry.computeVertexNormals();
    var latheMesh = new THREE.Mesh(bufferedGeometry, material);
    // Try bend
    latheMesh = this.bendMesh(latheMesh, bendAngleRad, options.outline.getBounds().width, options.outline.getBounds().height);
    // END try bend
    latheMesh.position.y = -100;
    latheMesh.rotation.x = Math.PI;
    this.camera.lookAt(new THREE.Vector3(20, 0, 150));
    this.camera.lookAt(latheMesh.position);
    this.scene.add(latheMesh);
    this.geometries.push(latheMesh);

    if (options.showNormals) {
      var vnHelper = new VertexNormalsHelper(latheMesh, options.normalsLength, 0x00ff00, 1);
      this.scene.add(vnHelper);
      this.geometries.push(vnHelper);
    }
  };

  DildoGeneration.prototype.bendMesh = function (mesh, bendAngle, shapeRadius, shapeHeight) {
    // const points = [new Vector3(1, 0, -1), new Vector3(1, 0, 1), new Vector3(-1, 0, 1), new Vector3(-1, 0, -1)];
    const pointCount = 20;
    const points = [];
    //   new THREE.Vector3(0, 0, -100),
    //   new THREE.Vector3(10, 0, 0),
    //   new THREE.Vector3(40, 0, 100),
    //   new THREE.Vector3(0, 0, 150)
    // ];
    // var bendAngle = Math.PI / 4.0;
    var arcLength = shapeHeight * 1.5; // The path must not be shorter than the mesh height!
    var radius = arcLength / bendAngle;
    mesh.geometry.rotateZ(Math.PI / 2);
    for (var i = 0; i < pointCount; i++) {
      var point = new THREE.Vector3(
        0,
        -Math.sin((bendAngle / pointCount) * i) * radius, //  + shapeRadius + radius,
        -Math.cos((bendAngle / pointCount) * i) * radius //  + shapeRadius + radius
      );
      points.push(point);
    }
    const curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = "centripetal";
    curve.closed = true;
    // const mesh = // some mesh I made earlier;// You may need to tweak the geometry beforehand to get it to
    // Display with the orientation you expect.
    //  mesh.geometry.rotateX(Math.PI);
    const flow = new THREE.Flow(mesh); // objectToCurve);
    flow.updateCurve(0, curve);
    // scene.add(flow.object3D);
    // flow.object3D.geometry.center();
    console.log(flow.object3D);
    // return flow.object3D;
    // new THREE.BufferGeometry().fromGeometry(
    var resultMesh = flow.object3D.clone();
    // resultMesh.geometry.center();

    var center = new THREE.Vector3();
    resultMesh.geometry.computeBoundingBox();
    resultMesh.geometry.boundingBox.getCenter(center);
    // resultMesh.geometry = new THREE.BufferGeometry().fromGeometry(resultMesh.geometry);
    // resultMesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, radius));
    // resultMesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));
    // resultMesh.geometry.center();
    resultMesh.position.copy(center);

    // resultMesh.geometry.rotateZ(Math.PI);

    console.log(resultMesh);

    return resultMesh;
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
    this.cachedGeometries = [];
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
    var stlData = exporter.parse(this.geometries[0]);
    if (typeof options.onComplete === "function") {
      options.onComplete(stlData);
    } else {
      console.warn("STL data was generated but no 'onComplete' callback was defined.");
    }
  };

  var mkCircularPolygon = function (radius, pointCount) {
    var vertices = [];
    var phi;
    for (var i = 0; i < pointCount; i++) {
      phi = Math.PI * 2 * (i / pointCount);
      vertices.push(new Vertex(Math.cos(phi) * radius, Math.sin(phi) * radius));
    }
    return new Polygon(vertices, false);
  };

  window.DildoGeneration = DildoGeneration;
})();
