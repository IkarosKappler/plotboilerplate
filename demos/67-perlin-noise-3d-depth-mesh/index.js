/**
 * A demo about rendering SVG path data with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 * @requires draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2025-11-11
 * @modified    2025-11-19 Adding alloy-finger to fetch touch events.
 * @modified    2025-12-01 Adding color gradients.
 * @version     1.1.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var params = new Params(GUP);
  var isDarkmode = detectDarkMode(GUP);
  console.log("isDarkmode", isDarkmode);

  window.addEventListener("load", function () {
    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas"),
          fullSize: true,
          fitToParent: true,
          scaleX: 1.0,
          scaleY: 1.0,
          rasterGrid: true,
          drawOrigin: false,
          rasterAdjustFactor: 2.0,
          redrawOnResize: true,
          defaultCanvasWidth: 1024,
          defaultCanvasHeight: 768,
          canvasWidthFactor: 1.0,
          canvasHeightFactor: 1.0,
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          drawBezierHandleLines: true,
          drawBezierHandlePoints: true,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    // prettier-ignore
    var blendModes = [
      'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity' 
    ];

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        far: -1000,
        close: 0,
        scaleX: params.getNumber("scaleX", 100),
        scaleY: params.getNumber("scaleY", 100),
        scaleZ: params.getNumber("scaleZ", 100),
        uniformScale: params.getBoolean("uniformScale", true),
        rotationX: params.getNumber("rotationX", 0),
        rotationY: params.getNumber("rotationY", 0),
        rotationZ: params.getNumber("rotationZ", 0),
        translateX: params.getNumber("rotationZ", 0),
        translateY: params.getNumber("rotationZ", 0),
        translateZ: params.getNumber("rotationZ", 0),
        lineWidth: params.getNumber("lineWidth", 2.0),
        useDistanceThreshold: params.getBoolean("useDistanceThreshold", false),
        drawVertices: params.getBoolean("drawVertices", true),
        drawVertNumbers: params.getBoolean("drawVertNumbers", false),
        useBlendMode: params.getBoolean("useBlendMode", false),
        blendMode: params.getString("blendMode", "difference"),
        useColorGradient: params.getBoolean("useColorGradient", false),
        perlinGridWidth: params.getNumber("perlinGridWidth", 24),
        perlinGridHeight: params.getNumber("perlinGridHeight", 24),
        perlinSeed: params.getNumber("perlinSeed", 10),
        perlinXOffset: params.getNumber("perlinXOffset", 0.0),
        perlinYOffset: params.getNumber("perlinYOffset", 0.0),
        perlinZOffset: params.getNumber("perlinZOffset", 0.0),
        perlinValueScale: params.getNumber("perlinValueScale", 1.0),
        animate: params.getBoolean("animate", false),
        animateRotation: params.getBoolean("animateRotation", false),
        animatePerlinXOffset: params.getBoolean("animatePerlinXOffset", true),
        animatePerlinYOffset: params.getBoolean("animatePerlinYOffset", false),
        animatePerlinZOffset: params.getBoolean("animatePerlinZOffset", false)
      },
      GUP
    );

    var geometryMeshRenderer = new GeometryMeshRenderer(config);
    var colorSpace2d = new ColorSpace2d(new Bounds3(new Vert3(), new Vert3()));

    // +---------------------------------------------------------------------------------
    // | Prepare all basic available geometries.
    // | (Bad style to keep all in memory, I know.)
    // +-------------------------------

    // Just some amount/speed to 'move' through the Perlin terrain.
    var perlinFactor = 4;
    var matrixHeight = config.perlinGridHeight;
    var matrixWidth = config.perlinGridWidth;
    // { geometry, indexMatrix }
    var flatMeshGeometryPair = null; // makeFlatMeshGeometry(matrixHeight, matrixWidth, 2.0, 2.0);
    var noise = new PerlinNoise().seed(config.perlinSeed);
    var data = new DataGrid2dArrayMatrix(matrixHeight, matrixWidth, 0.0);

    var initNoiseData = function () {
      matrixHeight = config.perlinGridHeight;
      matrixWidth = config.perlinGridWidth;
      flatMeshGeometryPair = makeFlatMeshGeometry(matrixHeight, matrixWidth, 2.0, 2.0);
      noise = new PerlinNoise().seed(config.perlinSeed);
      data = new DataGrid2dArrayMatrix(matrixHeight, matrixWidth, 0.0);

      noise = new PerlinNoise().seed(config.perlinSeed);
      var minZ = Number.MAX_VALUE;
      var maxZ = Number.MIN_VALUE;
      for (var y = 0; y < matrixHeight; y++) {
        var yIndex = y / matrixHeight;
        for (var x = 0; x < matrixWidth; x++) {
          var xIndex = x / matrixWidth;
          var perlinValue = noise.perlin3(
            config.perlinXOffset + xIndex * perlinFactor,
            config.perlinYOffset + yIndex * perlinFactor,
            config.perlinZOffset * perlinFactor
          );
          data.set(y, x, perlinValue);
          // Apply to mesh
          var vertIndex = flatMeshGeometryPair.indexMatrix[y][x];
          flatMeshGeometryPair.geometry.vertices[vertIndex].z = perlinValue * config.perlinValueScale;
          minZ = Math.min(minZ, flatMeshGeometryPair.geometry.vertices[vertIndex].z);
          maxZ = Math.max(maxZ, flatMeshGeometryPair.geometry.vertices[vertIndex].z);
        }
      }
      colorSpace2d.bounds = flatMeshGeometryPair.geometry.getGeometryBounds();
      // console.log("Rebuilt: max", maxZ, "min", minZ, "colorSpace2d.bounds", colorSpace2d.bounds);
    }; // END function initNoiseData
    initNoiseData();

    // +---------------------------------------------------------------------------------
    // | This is the part where the magic happens
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      var textColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      geometryMeshRenderer.drawGeometry(draw, fill, flatMeshGeometryPair.geometry, {
        textColor: textColor,
        colorSpace: config.useColorGradient ? colorSpace2d : null
      });
    };

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // | And to rotate the object.
    // +-------------------------------
    new MouseHandler(pb.eventCatcher, "drawsvg-demo")
      .drag(function (e) {
        // console.log(e.params);
        config.rotationX = geomutils.wrapMinMax(config.rotationX + e.params.dragAmount.y, 0.0, 360.0);
        config.rotationZ = geomutils.wrapMinMax(config.rotationZ - e.params.dragAmount.x, 0.0, 360.0);
        pb.redraw();
      })
      .move(function (e) {
        // Display the mouse position
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        stats.mouseX = relPos.x;
        stats.mouseY = relPos.y;
      });

    // +---------------------------------------------------------------------------------
    // | Install a touch handler to rotate on mobile device.
    // +-------------------------------
    createAlloyFinger(pb.eventCatcher, {
      touchMove: function (event) {
        // console.log("event", event);
        if (event.touches.length === 0) {
          return;
        }
        // var relPos = pb.transformMousePosition(event.touches[0].clientX, event.touches[0].clientY);
        config.rotationX = geomutils.wrapMinMax(config.rotationX + event.deltaY, 0.0, 360.0);
        config.rotationZ = geomutils.wrapMinMax(config.rotationZ - event.deltaX, 0.0, 360.0);
        pb.redraw();
      }
    });

    var stats = {
      mouseX: 0,
      mouseY: 0
    };
    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var f0 = gui.addFolder("Camera");
      var f1 = gui.addFolder("Geometry");
      var f2 = gui.addFolder("Path draw settings");
      var f3 = gui.addFolder("Animation");

      // prettier-ignore
      f0.add(config, "far").min(-2000).max(1000).title("The 'far' field.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "close").min(-1000).max(1000).title("The 'close' field.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "scaleX").min(0).max(500).title("The mesh scale X.").listen().onChange(function () { if( config.uniformScale ) { config.scaleY = config.scaleZ = config.scaleX; } pb.redraw(); });
      // prettier-ignore
      f1.add(config, "scaleY").min(0).max(500).title("The mesh scale Y.").listen().onChange(function () { if( config.uniformScale ) { config.scaleX = config.scaleZ = config.scaleY; } pb.redraw(); });
      // prettier-ignore
      f1.add(config, "scaleZ").min(0).max(500).title("The mesh scale Z.").listen().onChange(function () { if( config.uniformScale ) { config.scaleX = config.scaleY = config.scaleZ; } pb.redraw(); });
      // prettier-ignore
      f1.add(config, "uniformScale").title("Uniform scale?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "rotationX").min(0).max(360).title("The mesh rotationX.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "rotationY").min(0).max(360).title("The mesh rotationY.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "rotationZ").min(0).max(360).title("The mesh rotationz.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "translateX").min(-1.0).max(1.0).title("The mesh translation X.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "translateY").min(-1.0).max(1.0).title("The mesh translation Y.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "translateZ").min(-1.0).max(1.0).title("The mesh translation Z.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinGridWidth").min(2).max(32).step(1).title("Perlin matrix width.").onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinGridHeight").min(2).max(32).step(1).title("Perlin matrix height.").onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinSeed").min(0.0).max(100.0).title("Perlin noise seed.").onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinXOffset").min(-1.0).max(1.0).listen().title("Perlin noise x offset.").onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinYOffset").min(-1.0).max(1.0).listen().title("Perlin noise y offset.").onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinZOffset").min(-1.0).max(1.0).listen().title("Perlin noise z offset.").onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f1.add(config, "perlinValueScale").min(-1.0).max(1.0).title("Perlin value scale.").listen().onChange(function () { initNoiseData(); pb.redraw(); });
      // prettier-ignore
      f2.add(config, "lineWidth").min(1).max(10).title("Line width").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f2.add(config, "useDistanceThreshold").title("Use distance threshold?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f2.add(config, "useColorGradient").title("Use a color gradient?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f2.add(config, "drawVertices").title("Draw vertices?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f2.add(config, "drawVertNumbers").title("Draw vertex numbers?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f2.add(config, "useBlendMode").title("Use blend mode?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f2.add(config, "blendMode", blendModes).title("Which blend mode?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f3.add(config, "animate").title("Animate?").onChange(function () { startAnimation(0) });
      // prettier-ignore
      f3.add(config, "animateRotation").title("Animate the rotation params?").onChange(function () { /* NOOP */ });
      // prettier-ignore
      f3.add(config, "animatePerlinXOffset").title("Animate the perlin x offset?").onChange(function () { /* NOOP */ });
      // prettier-ignore
      f3.add(config, "animatePerlinYOffset").title("Animate the perlin y offset?").onChange(function () { /* NOOP */ });
      // prettier-ignore
      f3.add(config, "animatePerlinZOffset").title("Animate the perlin z offset?").onChange(function () { /* NOOP */ });

      f1.open();
      f2.open();
      if (params.getBoolean("closegui", false)) {
        gui.close();
      }

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    var startAnimation = function (time) {
      if (config.animate) {
        if (config.animatePerlinXOffset) {
          config.perlinXOffset += 0.01;
        }
        if (config.animatePerlinYOffset) {
          config.perlinYOffset += 0.01;
        }
        if (config.animatePerlinZOffset) {
          config.perlinZOffset += 0.01;
        }
        if (config.animateRotation) {
          // config.rotationX = (time / 80) % 360; // 50
          //config.rotationY = (time / 60) % 360; // 70
          config.rotationZ = (time / 30) % 360;
        }

        // Rebild noise?
        if (config.animatePerlinXOffset || config.animatePerlinYOffset || config.animatePerlinZOffset) {
          initNoiseData();
        }
      }
      pb.redraw();

      if (config.animate) {
        window.requestAnimationFrame(startAnimation);
      }
    };

    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation(0);
    } else {
      pb.redraw();
    }
  });
})(window);
