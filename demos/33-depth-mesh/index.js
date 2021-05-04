/**
 * A demo about rendering SVG path data with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  let D2R = Math.PI / 180;

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
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    var boxGeometry = makeBoxGeometry();
    var shpereGeometry = makeSphereGeometry();
    var dodecahedronGeometry = makeDodecahedronGeometry();
    var rhombicDodecahedronGeometry = makeRhombicDodecahedronGeometry();
    var tetrahedronGeometry = makeTetrahedronGeometry();
    var isocahedronGeometry = makeIsocahedronGeometry();
    var octahedronGeometry = makeOctahedronGeometry();

    var getGeometry = function () {
      switch (config.geometryType) {
        case "box":
          return boxGeometry;
        case "sphere":
          return shpereGeometry;
        case "rhombicdodecahedron":
          return rhombicDodecahedronGeometry;
        case "tetrahedron":
          return tetrahedronGeometry;
        case "isocahedron":
          return isocahedronGeometry;
        case "octahedron":
          return octahedronGeometry;
        default:
          return dodecahedronGeometry;
      }
    };

    // +---------------------------------------------------------------------------------
    // | This is the part where the magic happens
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      var geometry = getGeometry();

      var minMax = getMinMax(geometry.vertices);

      var transformMatrix0 = makeTransformToMatrix(
        config.rotationX * D2R,
        config.rotationY * D2R,
        config.rotationZ * D2R,
        config.scale,
        config.scale,
        config.scale,
        config.translateX,
        config.translateY,
        config.translateZ
      );
      var transformMatrix1 = makeTransformToMatrix(
        config.rotationX * D2R,
        config.rotationY * D2R,
        config.rotationZ * D2R,
        config.scale,
        config.scale,
        config.scale,
        config.translateX,
        config.translateY,
        config.translateZ + 0.1
      );
      var transformMatrix2 = makeTransformToMatrix(
        config.rotationX * D2R,
        config.rotationY * D2R,
        config.rotationZ * D2R,
        config.scale,
        config.scale,
        config.scale,
        config.translateX,
        config.translateY,
        config.translateZ - 0.1
      );

      // drawGeometry(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(92, 92, 92));

      if (draw.ctx) {
        draw.ctx.globalCompositeOperation = "difference"; // xor
      }
      // drawGeometry(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(128, 255, 0));
      // drawGeometry(draw, fill, geometry, minMax, transformMatrix1, Color.makeRGB(0, 0, 255));
      // drawGeometry(draw, fill, geometry, minMax, transformMatrix2, Color.makeRGB(255, 0, 0));
      drawGeometry(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(128, 0, 255));
      drawGeometry(draw, fill, geometry, minMax, transformMatrix1, Color.makeRGB(255, 255, 0));
      drawGeometry(draw, fill, geometry, minMax, transformMatrix2, Color.makeRGB(0, 255, 255));
      if (draw.ctx) {
        draw.ctx.globalCompositeOperation = "source-over";
      }
    };

    var drawGeometry = function (draw, fill, geometry, minMax, transformMatrix, colorObject) {
      minMax.min = applyScale(minMax.min);
      minMax.max = applyScale(minMax.max);
      for (var e in geometry.edges) {
        var a3 = transformMatrix.apply3(geometry.vertices[geometry.edges[e][0]]);
        var b3 = transformMatrix.apply3(geometry.vertices[geometry.edges[e][1]]);

        var a2 = applyProjection(a3);
        var b2 = applyProjection(b3);

        var tA = getThreshold(a3, minMax.min.z, minMax.max.z);
        var tB = getThreshold(b3, minMax.min.z, minMax.max.z);
        var threshold = config.useDistanceThreshold ? Math.max(0, Math.min(1, Math.min(tA, tB))) : 1.0;

        // draw.line(a2, b2, "rgba(92,92,92," + threshold + ")", 2);
        colorObject.a = threshold;
        draw.line(a2, b2, colorObject.cssRGBA(), 2);
      }
      for (var v in geometry.vertices) {
        var projected = applyProjection(transformMatrix.apply3(geometry.vertices[v]));
        draw.squareHandle(projected, 2, "grey", 1);
        if (config.drawVertNumbers) {
          fill.text("" + v, projected.x + 3, projected.y + 3, "black");
        }
      }
    };

    var makeTransformToMatrix = function (rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ) {
      var matrixRx = new Matrix4x4().set_rotation({ x: 1, y: 0, z: 0 }, rotateX);
      var matrixRy = new Matrix4x4().set_rotation({ x: 0, y: 1, z: 0 }, rotateY);
      var matrixRz = new Matrix4x4().set_rotation({ x: 0, y: 0, z: 1 }, rotateZ);
      var matrixS = new Matrix4x4().set_scaling(scaleX, scaleY, scaleZ);
      var matrixT0 = new Matrix4x4().set_translation(translateX, translateY, translateZ);

      var transformMatrix = new Matrix4x4()
        .multiply(matrixRx)
        .multiply(matrixRy)
        .multiply(matrixRz)
        .multiply(matrixS)
        .multiply(matrixT0);

      return transformMatrix;
    };

    var getMinMax = function (vertices) {
      var min = new Vert3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
      var max = new Vert3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
      for (var v in vertices) {
        var vert = vertices[v];
        min.x = Math.min(min.x, vert.x);
        min.y = Math.min(min.y, vert.y);
        min.z = Math.min(min.z, vert.z);
        max.x = Math.max(max.x, vert.x);
        max.y = Math.max(max.y, vert.y);
        max.z = Math.max(max.z, vert.z);
      }
      return { min: min, max: max };
    };

    var getThreshold = function (p, far, close) {
      return (far - p.z) / (far - close);
    };

    var applyProjection = function (p) {
      // Project
      var threshold = getThreshold(p, config.far, config.close);
      threshold = Math.max(0, threshold);
      return { x: p.x * threshold, y: p.y * threshold };
    };

    var applyScale = function (p) {
      p.x *= config.scale;
      p.y *= config.scale;
      p.z *= config.scale;
      return p;
    };

    // function applyRotation(point) {
    //   return rotatePoint(
    //     point,
    //     (config.rotationX * Math.PI) / 180,
    //     (config.rotationY * Math.PI) / 180,
    //     (config.rotationZ * Math.PI) / 180
    //   );
    // }

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        far: -1000,
        close: 0,
        scale: 100,
        rotationX: 0.0,
        rotationY: 0.0,
        rotationZ: 0.0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        animate: false,
        useDistanceThreshold: false,
        drawVertNumbers: false,
        geometryType: "dodecahedron"
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "drawsvg-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
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
      var f0 = gui.addFolder("Path draw settings");

      var GEOMETRY_SHAPES = {
        "◯": "sphere",
        "□": "box",
        "⬠": "dodecahedron",
        "◊": "rhombicdodecahedron",
        "△4": "tetrahedron",
        "△8": "octahedron",
        "△20": "isocahedron"
      };

      // prettier-ignore
      f0.add(config, "far").min(-2000).max(1000).title("The 'far' field.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "close").min(-1000).max(1000).title("The 'close' field.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "scale").min(0).max(500).title("The mesh scale.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "rotationX").min(0).max(360).title("The mesh rotationX.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "rotationY").min(0).max(360).title("The mesh rotationY.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "rotationZ").min(0).max(360).title("The mesh rotationz.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "translateX").min(-1.0).max(1.0).title("The mesh translation X.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "translateY").min(-1.0).max(1.0).title("The mesh translation Y.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "translateZ").min(-1.0).max(1.0).title("The mesh translation Z.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "animate").title("Animate?").onChange(function () { startAnimation(0) });
      // prettier-ignore
      f0.add(config, "useDistanceThreshold").title("Use distance threshold?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawVertNumbers").title("Draw vertex numbers?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "geometryType", GEOMETRY_SHAPES).title("Geometry type").onChange(function () { pb.redraw(); });

      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    var startAnimation = function (time) {
      // console.log(time);
      config.rotationX = (time / 50) % 360;
      config.rotationY = (time / 70) % 360;
      // if (config.rotationX > 360) config.rotationX = 0;
      // console.log(config.rotationX);
      pb.redraw();

      if (config.animate) window.requestAnimationFrame(startAnimation);
    };

    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation(0);
    } else {
      pb.redraw();
    }
  });
})(window);
