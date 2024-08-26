/**
 * A script for testing Hobby curves.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2019-04-07
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);
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
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,

          enableSVGExport: false
        },
        GUP
      )
    );

    var drawAll = function () {
      if (config.drawHobbyPath) drawHobby();
      if (config.drawCubicPath) drawCubicSpline();
      if (config.drawCatmullRomPath) drawCatmullRomSpline();
    };

    var drawHandleLine = function (start, end, color) {
      pb.draw.line(start, end, color, 3);
      var perpA = new Vector(end, start).perp().setLength(12);
      var perpB = perpA.clone().inv();
      pb.draw.line(perpA.b, perpB.b, color, 1);
    };

    // +---------------------------------------------------------------------------------
    // | Compute and draw the Hobby curve.
    // +-------------------------------
    var drawHobby = function () {
      var hobbyPath = new HobbyPath(pointList.pointList);
      // pb.draw.circleHandle( pb.vertices[0], 10, 'rgba(192,192,192,1.0)' );
      if (config.drawLinearPath) pb.draw.polyline(pb.vertices, !config.circular, "rgba(192,192,192,0.5)", 1);

      var curves = hobbyPath.generateCurve(config.circular, config.hobbyOmega);
      for (var i = 0; i < curves.length; i++) {
        pb.draw.cubicBezier(
          curves[i].startPoint,
          curves[i].endPoint,
          curves[i].startControlPoint,
          curves[i].endControlPoint,
          "rgba(255,128,0,0.95)",
          5
        );
        if (config.drawTangents) {
          drawHandleLine(curves[i].startPoint, curves[i].startControlPoint, "rgba(0,192,64,0.55)");
          drawHandleLine(curves[i].endPoint, curves[i].endControlPoint, "rgba(0,192,64,0.55)");
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Compute and draw the Hobby curve.
    // +-------------------------------
    var drawCubicSpline = function () {
      var cubicSplinePath = new CubicSplinePath(pointList.pointList);
      var curves = cubicSplinePath.generateCurve(config.circular);
      for (var i = 0; i < curves.length; i++) {
        pb.draw.cubicBezier(
          curves[i].startPoint,
          curves[i].endPoint,
          curves[i].startControlPoint,
          curves[i].endControlPoint,
          "rgba(128,255,0,0.65)",
          2
        );
        if (config.drawTangents) {
          drawHandleLine(curves[i].startPoint, curves[i].startControlPoint, "rgba(0,192,64,0.55)");
          drawHandleLine(curves[i].endPoint, curves[i].endControlPoint, "rgba(0,192,64,0.55)");
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Compute and draw the Hobby curve.
    // +-------------------------------
    var drawCatmullRomSpline = function () {
      var catmullRomPath = new CatmullRomPath(pointList.pointList);
      var tension = 1.0;
      var curves = catmullRomPath.generateCurve(config.circular, config.catmullTension);
      for (var i = 0; i < curves.length; i++) {
        pb.draw.cubicBezier(
          curves[i].startPoint,
          curves[i].endPoint,
          curves[i].startControlPoint,
          curves[i].endControlPoint,
          "rgba(128,0,255,0.65)",
          2
        );
        if (config.drawTangents) {
          drawHandleLine(curves[i].startPoint, curves[i].startControlPoint, "rgba(0,192,64,0.55)");
          drawHandleLine(curves[i].endPoint, curves[i].endControlPoint, "rgba(0,192,64,0.55)");
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Let a poinst list manager do the randomization of the three points.
    // +-------------------------------
    var pointList = new CanvasPointList(pb);
    // Keep a safe border to the left/right and top/bottom (0.1 each)
    pointList.verticalFillRatio = 0.8;
    pointList.horizontalFillRatio = 0.8;

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "hobby-demo")
      .move(function (e) {
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        var cx = document.getElementById("cx");
        var cy = document.getElementById("cy");
        if (cx) cx.innerHTML = relPos.x.toFixed(2);
        if (cy) cy.innerHTML = relPos.y.toFixed(2);
      })
      .up(function (e) {
        if (e.params.wasDragged) return;
        var vert = new Vertex(pb.transformMousePosition(e.params.pos.x, e.params.pos.y));
        addVertex(vert);
      });

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        circular: false,
        pointCount: 4,
        drawHobbyPath: true,
        hobbyOmega: 0,
        drawCubicPath: false,
        drawCatmullRomPath: false,
        catmullTension: 1.0,
        drawLinearPath: false,
        drawTangents: true,
        animate: false,
        drawVertices: true
      },
      GUP
    );

    var updatePointList = function () {
      pointList.updatePointCount(config.pointCount, false); // No full cover
      animator = new SinoidVertexAnimator(pointList.pointList, pb.viewport(), function () {
        pb.redraw();
      });
    };

    var animator = null;
    function renderAnimation() {
      if (config.animate)
        window.requestAnimationFrame(renderAnimation); // Animation stopped
      else;
    }

    function toggleAnimation() {
      if (config.animate) {
        if (animator) animator.start();
        renderAnimation();
      } else {
        if (animator) animator.stop();
        pb.redraw();
      }
    }

    var addVertex = function (vert) {
      vert.attr.visible = config.drawVertices;
      pointList.addVertex(vert);
      config.pointCount++;
      if (animator) animator.stop();
      animator = new SinoidVertexAnimator(pointList.pointList, pb.viewport(), function () {
        pb.redraw();
      });
      toggleAnimation();
      pb.redraw();
    };

    var updateDrawVertices = function () {
      for (var i in pb.vertices) {
        pb.vertices[i].attr.visible = config.drawVertices;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();

      var f1 = gui.addFolder("Path");
      f1.add(config, "circular")
        .onChange(function () {
          pb.redraw();
        })
        .name("Circular")
        .title("Close the loop.");
      f1.add(config, "drawHobbyPath")
        .onChange(function () {
          pb.redraw();
        })
        .name("Hobby")
        .title("Draw Hobby Path.");
      f1.add(config, "hobbyOmega")
        .min(0)
        .max(2.0)
        .step(0.01)
        .onChange(function () {
          pb.redraw();
        })
        .name("Omega (Hobby)")
        .title("The 'curviness'.");
      f1.add(config, "drawCubicPath")
        .onChange(function () {
          pb.redraw();
        })
        .name("Cubic")
        .title("Draw plain cubic Path.");
      f1.add(config, "drawCatmullRomPath")
        .onChange(function () {
          pb.redraw();
        })
        .name("Catmull-Rom")
        .title("Draw Catmull-Rom Path.");
      f1.add(config, "catmullTension")
        .min(0)
        .max(5.0)
        .step(0.01)
        .onChange(function () {
          pb.redraw();
        })
        .name("Tension (Catmull-Rom)")
        .title("The 'curviness'.");
      f1.add(config, "drawLinearPath")
        .onChange(function () {
          pb.redraw();
        })
        .name("Draw linear path")
        .title("Toggle drawaing of the linear path.");
      f1.add(config, "drawTangents")
        .onChange(function () {
          pb.redraw();
        })
        .name("Draw Tangents")
        .title("Toggle drawaing of the tangents.");
      f1.add(config, "animate")
        .onChange(function () {
          toggleAnimation();
        })
        .name("Animate points")
        .title("Animate points.");
      // f1.add(config, 'animateCirular').onChange( function() { toggleAnimation(); } ).name('Cirular animation').title('Animate points in a circular manner.');
      f1.add(config, "drawVertices")
        .onChange(function () {
          updateDrawVertices();
          pb.redraw();
        })
        .name("drawVertices")
        .title("Toggle visibility of points on/off.");
      f1.open();
    }

    updatePointList();
    updateDrawVertices();
    toggleAnimation();

    pb.config.preDraw = drawAll;
    pb.redraw();
  };

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
