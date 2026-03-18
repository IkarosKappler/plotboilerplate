/**
 * A script for testing vector fields.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2019-02-03
 * @modified 2026-01-02 Added color gradients.
 * @version  1.1.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var params = new Params(GUP);
  var isDarkmode = detectDarkMode(GUP);
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
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        pointCount: params.getNumber("pointCount", 64),
        drawTraces: params.getBoolean("pointCount", false),
        animate: params.getBoolean("animate", false),
        drawPoints: params.getBoolean("drawPoints", true),
        useColorGradient: params.getBoolean("useColorGradient", true),
        traceWidth: params.getNumber("traceWidth", 1.0),
        skipTraceHead: params.getNumber("skipTraceHead", 1)
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | This draws the traces if enabled.
    // +-------------------------------
    var drawTraces = function () {
      if (!config.drawTraces) {
        return;
      }
      for (var i = 0; i < pointList.pointList.length; i++) {
        let point = pointList.pointList[i];
        var color = config.useColorGradient
          ? colorGradient.getColorAt(i / (pointList.pointList.length - 1)).cssRGB()
          : "rgba(192,192,192,0.8)";
        // console.log("i", i, color);
        pb.draw.polyline(point.attr.trace.slice(config.skipTraceHead), true, color, config.traceWidth);
      }
    };

    var pointList = new CanvasPointList(pb, function (vert) {
      // Add a 'trace' attribute to new vertices.
      vert.attr.trace = [];
    });
    // Fill the full area with points.
    pointList.verticalFillRatio = 1.0;
    pointList.horizontalFillRatio = 1.0;
    var colorGradient = new ColorGradient(ColorGradient.DEFAULT_COLORSET);

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas).move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      var cx = document.getElementById("cx");
      var cy = document.getElementById("cy");
      if (cx) cx.innerHTML = relPos.x.toFixed(2);
      if (cy) cy.innerHTML = relPos.y.toFixed(2);
    });

    var togglePointVisibility = function () {
      for (var i in pointList.pointList) {
        let point = pointList.pointList[i];
        point.attr.visible = config.drawPoints;
      }
    };

    var updatePointList = function () {
      pointList.updatePointCount(config.pointCount, false); // Full cover?
    };

    var updatePursuitPoints = function (threshold) {
      // Each point moves towards its successor
      for (var i = 0; i < pointList.pointList.length; i++) {
        let pursuer = pointList.pointList[i];
        pursuer.attr.trace.push(pursuer.clone());
        let pursuee = pointList.pointList[(i + 1) % pointList.pointList.length];
        let diff = pursuer.difference(pursuee);
        pursuer.addXY(diff.x * threshold, diff.y * threshold);
      }
      pb.redraw();
    };

    function renderAnimation() {
      updatePursuitPoints(0.1);
      if (config.animate) {
        window.requestAnimationFrame(renderAnimation);
      }
      // Animation stopped
      else {
        drawTraces();
      }
    }

    function toggleAnimation() {
      if (config.animate) {
        renderAnimation();
      } else {
        pb.redraw();
      }
    }

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var f0 = gui.addFolder("Points");
      // prettier-ignore
      f0.add(config, "pointCount").onChange(function () { updatePointList(); pb.redraw(); }).min(4).title("Change point count.");
      // prettier-ignore
      f0.add(config, "drawTraces").onChange(function () { pb.redraw(); }).title("Draw traces.");
      // prettier-ignore
      f0.add(config, "animate").onChange(function () { toggleAnimation(); }).title("Animate the point cloud.");
      // prettier-ignore
      f0.add(config, "drawPoints").title("Toggle points on/off").onChange(function () { togglePointVisibility(); pb.redraw(); });
      // prettier-ignore
      f0.add(config, "useColorGradient").title("Use a color gradient?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "traceWidth").min(1.0).max(10.0).title("Thickness of traces").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "skipTraceHead").min(0).step(1).title("How many steps to skip at the beginning of each trace.").onChange(function () { pb.redraw(); });
      f0.open();
    }

    toggleAnimation();
    updatePointList();

    pb.config.preDraw = drawTraces;
  });
})(window);
