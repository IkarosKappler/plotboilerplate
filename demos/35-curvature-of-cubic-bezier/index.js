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
 * @date        2021-05-26
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

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
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    var path = null;
    // +---------------------------------------------------------------------------------
    // | Initialize the path with some curves (in the example: only one)
    // +-------------------------------
    var init = function () {
      var curves = [];
      curves.push(new CubicBezierCurve(randomVertex(), randomVertex(), randomVertex(), randomVertex()));
      path = BezierPath.fromArray(curves);
      pb.add(path);
    };

    // +---------------------------------------------------------------------------------
    // | This is called after each draw cycle.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var p = path.getPointAt(config.t);
      draw.point(p, "rgba(0,0,0,1)");
      var circle = getCircleAtBezierPath(path, config.t);
      // Catch unsafe circles with too large radii (towards infinity)
      pb.draw.circle(circle.center, circle.radius, "blue", 1);
      if (config.drawCircleCenter) {
        pb.draw.line(p, circle.center, "rgba(192,192,192,0.5)", 2);
        pb.draw.diamondHandle(circle.center, 7, "rgb(255, 128, 0, 1.0)");
      }

      if (config.drawCurvatureOutline) {
        for (var j = 1; j <= 100; j++) {
          var t = j / 100;
          var p = path.getPointAt(t);
          var circle = getCircleAtBezierPath(path, t);
          draw.line(p, circle.center, "rgba(0,164,64,0.5)", 1);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        t: 0.5,
        drawCurvatureOutline: true,
        drawCircleCenter: true
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

      // prettier-ignore
      f0.add(config, "t").min(0.0).max(1.0).title("The offset t.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawCurvatureOutline").title("Draw curvature outline?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawCircleCenter").title("Draw ccircle center?").onChange(function () { pb.redraw(); });
      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    init();
    pb.config.postDraw = postDraw;
    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation();
    } else {
      // setView(viewRangeX, viewRangeY);
      pb.redraw();
    }
  });
})(window);
