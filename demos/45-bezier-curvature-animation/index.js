/**
 * A script to demonstrate how to animate beziers and curvature.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2023-01-22
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var mousePosition = { x: NaN, y: NaN };

    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("canvas"),
          fullSize: true,
          fitToParent: true,
          scaleX: 1.0,
          scaleY: 1.0,
          rasterGrid: true,
          drawGrid: true,
          drawRaster: false,
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

          enableSVGExport: true
        },
        GUP
      )
    );

    var randColor = function (i, alpha) {
      var color = WebColorsContrast[i % WebColorsContrast.length].clone();
      if (typeof alpha !== undefined) color.a = alpha;
      return color;
    };

    // {Bounds}
    var viewport = pb.viewport();

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        animate: true,
        showPath: false
      },
      GUP
    );

    var size = viewport.getMinDimension();
    var pathPoints = [];
    for (var i = 0; i < 8; i++) {
      var startControlPoint = new Vertex(Math.random() * size - size / 2, Math.random() * size - size / 2);
      startControlPoint.attr.initialPosition = startControlPoint.clone();
      startControlPoint.attr.rotationStep = 1 - Math.random() * 2;
      var endControlPoint = new Vertex(Math.random() * size - size / 2, Math.random() * size - size / 2);
      endControlPoint.attr.initialPosition = endControlPoint.clone();
      endControlPoint.attr.rotationStep = 1 - Math.random() * 2;
      pathPoints.push([new Vertex(0, 0), new Vertex(0, 0), startControlPoint, endControlPoint]);
    }
    var bpath = BezierPath.fromArray(pathPoints);
    // Draw original path?
    if (config.showPath) {
      pb.add(bpath);
    }

    // Pick some nice colors for the path
    var pathColors = pathPoints.map(function (curvePoints, index) {
      return {
        startColor: randColor(index, 1.0),
        endColor: randColor(index + Math.floor(Math.random() * pathPoints.length), 1.0)
      };
    });

    // +---------------------------------------------------------------------------------
    // | Draw our custom stuff after everything else in the scene was drawn.
    // +-------------------------------
    var redraw = function (draw, fill) {
      var tmpLine = new Line(new Vertex(), new Vertex());
      var maxLength = size / 4.0;
      var tSize = 0.05;
      var curColor = Color.makeRGB(0, 0, 0);
      for (var i = 0; i < bpath.bezierCurves.length; i++) {
        var startColor = pathColors[i].startColor;
        var endColor = pathColors[i].endColor;
        for (var t = 0.05; t + 0.05 <= 1.0; t += tSize) {
          var curvature = getCircleAt(bpath.bezierCurves[i], t, tSize);
          tmpLine.a.set(curvature.triangle.b);
          tmpLine.b.set(curvature.circle.center);
          // Reduce length?
          // tmpLine.b.lerp(tmpLine.a, 0.25);
          var triangleHeight = tmpLine.length();
          var alpha = (maxLength - triangleHeight) / (maxLength * 2);
          curColor.set(startColor).interpolate(endColor, t).a = alpha;
          fill.polyline([curvature.triangle.b, tmpLine.b, curvature.triangle.c], false, curColor.cssRGBA(), 1.0);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Calculate (very simple approximation) the tangent circle at the given curve (NOT path)
    // | and position.
    // +-------------------------------
    var getCircleAt = function (curve, t, tSize) {
      var p = curve.getPointAt(t);
      // var p0 = curve.getPointAt(Math.max(0, t - t * 0.1));
      // var p1 = curve.getPointAt(Math.min(t + (1 - t) * 0.1, curve.arcLength));
      var p0 = curve.getPointAt(Math.max(0, t - tSize));
      var p1 = curve.getPointAt(Math.min(t + tSize, curve.arcLength));
      var triangle = new Triangle(p0, p, p1);
      var circle = triangle.getCircumcircle();
      return { circle: circle, triangle: triangle };
    };

    var animationStep = 0;
    var startAnimation = function () {
      if (!config.animate) {
        return;
      }
      for (var i = 0; i < pathPoints.length; i++) {
        for (var j = 2; j < pathPoints[i].length; j++) {
          var point = pathPoints[i][j];
          point.set(point.attr.initialPosition);
          point.rotate((animationStep * point.attr.rotationStep + i + j) * 0.05);
        }
      }
      animationStep++;
      pb.redraw();
      window.requestAnimationFrame(startAnimation);
    };

    var togglePath = function () {
      if (config.showPath) {
        pb.add(bpath);
      } else {
        pb.remove(bpath, false, true); // redraw=false, removeWithVertices=true
      }
    };

    // Add a mouse listener to track the mouse position.
    new MouseHandler(pb.eventCatcher).move(function (event) {
      var relPos = pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
      stats.mouseXTop = relPos.x;
      stats.mouseYTop = relPos.y;
      if (config.highlightOnMouseHover) {
        // handleMousePositionChange();
        mousePosition.x = relPos.x;
        mousePosition.y = relPos.y;
        pb.redraw();
      }
    });

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseXTop: 0,
      mouseYTop: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseXTop").precision(1);
    uiStats.add("mouseYTop").precision(1);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'animate').listen().onChange(function(prm) { if(prm) { startAnimation(); } }).name("animate").title("animate");
      // prettier-ignore
      gui.add(config, 'showPath').listen().onChange(function() { togglePath() }).name("showPath").title("showPath");
    }

    pb.config.postDraw = redraw;
    pb.redraw();
    pb.canvas.focus();
    startAnimation();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
