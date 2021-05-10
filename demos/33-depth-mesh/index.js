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
        drawVertices: true,
        drawVertNumbers: false,
        useBlendMode: false,
        geometryType: "dodecahedron",
        buckminsterLerpRatio: 1 / 3,
        animateBuckminsterLerp: false,
        importStl: function () {
          document.getElementById("input_file").setAttribute("data-filetype", "stl");
          document.getElementById("input_file").setAttribute("accept", ".stl");
          document.getElementById("input_file").click();
        },
        importObj: function () {
          document.getElementById("input_file").setAttribute("data-filetype", "obj");
          document.getElementById("input_file").setAttribute("accept", ".obj");
          document.getElementById("input_file").click();
        }
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Prepare all basic available geometries.
    // | (Bad style to keep all in memory, I know.)
    // +-------------------------------
    var boxGeometry = makeBoxGeometry();
    var buckminsterGeometry = makeBuckminsterGeometry(config.buckminsterLerpRatio);
    var shpereGeometry = makeSphereGeometry();
    var dodecahedronGeometry = makeDodecahedronGeometry();
    var rhombicDodecahedronGeometry = makeRhombicDodecahedronGeometry();
    var tetrahedronGeometry = makeTetrahedronGeometry();
    var isocahedronGeometry = makeIsocahedronGeometry();
    var octahedronGeometry = makeOctahedronGeometry();
    var importedGeometry = null;

    var rebuildBuckminster = function (lerpRatio) {
      buckminsterGeometry = makeBuckminsterGeometry(lerpRatio);
    };

    // +---------------------------------------------------------------------------------
    // | Get the currently selected geometry.
    // +-------------------------------
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
        case "buckminster":
          return buckminsterGeometry;
        case "file":
          if (importedGeometry) return importedGeometry;
        default:
          return dodecahedronGeometry;
      }
    };

    // +---------------------------------------------------------------------------------
    // | This is the part where the magic happens
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      var textColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      var geometry = getGeometry();

      var minMax = getMinMax(geometry.vertices);
      minMax.min = applyScale(minMax.min);
      minMax.max = applyScale(minMax.max);

      var transformMatrix0 = Matrix4x4.makeTransformationMatrix(
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
      var transformMatrix1 = Matrix4x4.makeTransformationMatrix(
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
      var transformMatrix2 = Matrix4x4.makeTransformationMatrix(
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

      if (config.useBlendMode) {
        if (draw.ctx) {
          draw.ctx.globalCompositeOperation = "difference"; // xor
        }
        // Use this on black
        drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(128, 255, 0));
        drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix1, Color.makeRGB(0, 0, 255));
        drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix2, Color.makeRGB(255, 0, 0));
        // Use this on white
        // drawGeometry(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(128, 0, 255));
        // drawGeometry(draw, fill, geometry, minMax, transformMatrix1, Color.makeRGB(255, 255, 0));
        // drawGeometry(draw, fill, geometry, minMax, transformMatrix2, Color.makeRGB(0, 255, 255));
        if (draw.ctx) {
          draw.ctx.globalCompositeOperation = "source-over";
        }
      } else {
        drawGeometryEdges(draw, fill, geometry, minMax, transformMatrix0, Color.makeRGB(92, 92, 92));
      }

      drawGeometryVertices(draw, fill, geometry, transformMatrix0, {
        drawVertNumbers: config.drawVertNumbers,
        textColor: textColor
      });
    };

    // +---------------------------------------------------------------------------------
    // | Draw the edges of a geometry.
    // +-------------------------------
    var drawGeometryEdges = function (draw, fill, geometry, minMax, transformMatrix, colorObject) {
      for (var e in geometry.edges) {
        var a3 = transformMatrix.apply3(geometry.vertices[geometry.edges[e][0]]);
        var b3 = transformMatrix.apply3(geometry.vertices[geometry.edges[e][1]]);

        var a2 = applyProjection(a3);
        var b2 = applyProjection(b3);

        var tA = getThreshold(a3, minMax.min.z, minMax.max.z);
        var tB = getThreshold(b3, minMax.min.z, minMax.max.z);
        var threshold = config.useDistanceThreshold ? Math.max(0, Math.min(1, Math.min(tA, tB))) : 1.0;

        colorObject.a = threshold;
        draw.line(a2, b2, colorObject.cssRGBA(), 2);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the vertices and/or vertex number of a geometry.
    // +-------------------------------
    var drawGeometryVertices = function (draw, fill, geometry, transformMatrix, options) {
      for (var v in geometry.vertices) {
        var projected = applyProjection(transformMatrix.apply3(geometry.vertices[v]));
        if (config.drawVertices) {
          draw.squareHandle(projected, 2, "grey", 1);
        }
        if (options.drawVertNumbers) {
          fill.text("" + v, projected.x + 3, projected.y + 3, { color: options.textColor });
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Determine the threshold in [0,1] of the given point.
    // | 1: at camera plane (no distance)
    // | 0: at max distance (as configured)
    // +-------------------------------
    var getThreshold = function (p, far, close) {
      return (far - p.z) / (far - close);
    };

    // +---------------------------------------------------------------------------------
    // | Projects the given 3d point to the 2d plane (just before being rendered).
    // +-------------------------------
    var applyProjection = function (p) {
      var threshold = getThreshold(p, config.far, config.close);
      threshold = Math.max(0, threshold);
      return { x: p.x * threshold, y: p.y * threshold };
    };

    // +---------------------------------------------------------------------------------
    // | We could also do this via a transformation matrix.
    // +-------------------------------
    var applyScale = function (p) {
      p.x *= config.scale;
      p.y *= config.scale;
      p.z *= config.scale;
      return p;
    };

    // +---------------------------------------------------------------------------------
    // | Handle a triggered file import (obj and stl supported).
    // +-------------------------------
    var handleImport = function (e) {
      var fileType = document.getElementById("input_file").getAttribute("data-filetype");
      if (fileType === "stl") handleImportStl(e);
      else if (fileType === "obj") handleImportObj(e);
      else console.warn("Unrecognized filetype option", fileType);
    };
    document.getElementById("input_file").addEventListener("change", handleImport);

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    var handleImportStl = function (e) {
      console.log(e);
      if (!e.target.files || e.target.files.length === 0) {
        console.log("No file selected.");
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var data = reader.result;
        var stlGeometry = { vertices: [], edges: [] };
        new STLParser(function (v1, v2, v3, normal) {
          var index1 = stlGeometry.vertices.length;
          stlGeometry.vertices.push(new Vert3(v1.x, v1.y, v1.z));
          var index2 = stlGeometry.vertices.length;
          stlGeometry.vertices.push(new Vert3(v2.x, v2.y, v2.z));
          var index3 = stlGeometry.vertices.length;
          stlGeometry.vertices.push(new Vert3(v3.x, v3.y, v3.z));
          stlGeometry.edges.push([index1, index2], [index2, index3], [index3, index1]);
        }).parse(data);
        normalizeGeometry(stlGeometry.vertices);
        importedGeometry = reduceGeometryDuplicateVertices(stlGeometry);
        config.geometryType = "file";
        pb.redraw();
      };
      reader.readAsBinaryString(e.target.files[0]);
    };

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    var handleImportObj = function (e) {
      console.log(e);
      if (!e.target.files || e.target.files.length === 0) {
        console.log("No file selected.");
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var data = reader.result;
        var objGeometry = { vertices: [], edges: [] };
        new OBJParser(
          function (x, y, z) {
            objGeometry.vertices.push(new Vert3(x, y, z));
          },
          function (a, b, c) {
            // Note that OBJ indices start at 1 (not 0)
            a--;
            b--;
            c--;
            objGeometry.edges.push([a, b]);
            objGeometry.edges.push([b, c]);
            objGeometry.edges.push([c, a]);
          }
        ).parse(data);
        normalizeGeometry(objGeometry.vertices);
        // Usually it is not required to reduce OBJ geometries, as vertices and edges/faces
        // are stored separately. But even smal, optimizations are ok.
        importedGeometry = reduceGeometryDuplicateVertices(objGeometry, 0.0001);
        importedGeometry.edges = reduceGeometryDuplicateEdges(importedGeometry.edges);
        config.geometryType = "file";
        pb.redraw();
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    };

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
        "△20": "isocahedron",
        "⬠⬡": "buckminster"
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
      f0.add(config, "drawVertices").title("Draw vertices?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawVertNumbers").title("Draw vertex numbers?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "useBlendMode").title("Use blend mode?").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "geometryType", GEOMETRY_SHAPES).title("Geometry type").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "buckminsterLerpRatio").min(0.0).max(1.0).step(0.01).listen().title("Buckminster Lerp Ratio (default=0.333)").onChange(function () { rebuildBuckminster(config.buckminsterLerpRatio); pb.redraw(); });
      // prettier-ignore
      f0.add(config, "animateBuckminsterLerp").title("Animate Buckminster Lerp?").onChange(function () { startAnimation(0) });
      // prettier-ignore
      f0.add(config, "importStl").title("Import STL").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "importObj").title("Import OBJ").onChange(function () { pb.redraw(); });

      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    var startAnimation = function (time) {
      if (config.animate) {
        config.rotationX = (time / 50) % 360;
        config.rotationY = (time / 70) % 360;
      }
      if (config.animateBuckminsterLerp) {
        // Swing back and forth between 0.0 and 0.5 :)
        config.buckminsterLerpRatio = (Math.sin((time / 10000) * 2) + 1) * (1 / 4);
        rebuildBuckminster(config.buckminsterLerpRatio);
      }
      pb.redraw();

      if (config.animate || config.animateBuckminsterLerp) window.requestAnimationFrame(startAnimation);
    };

    // Will stop after first draw if config.animate==false
    if (config.animate || config.animateBuckminsterLerp) {
      startAnimation(0);
    } else {
      pb.redraw();
    }
  });
})(window);
