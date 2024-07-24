/**
 * A demo to trace Bézier sub curves (and their tangents).
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2019-11-22
 * @modified    2020-05-06 Replace the direct subcurve calculation by the new CubicBezierPath.getSubCurveAt(number,number) function call.
 * @version     1.0.1
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  window.addEventListener("load", function () {
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
          drawBezierHandleLines: true, // false,
          drawBezierHandlePoints: true, // false,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableGL: false // experimental
        },
        GUP
      )
    );

    pb.drawConfig.bezier.handleLine.color = "rgba(180,180,180,0.25)";

    if (typeof humane != "undefined") humane.log("Click, hold and drag your mouse or click 'animate' in the controls.");

    pb.config.postDraw = function () {
      // In this demo the PlotBoilerplate only draws the vertices.
      // Everything else is drawn by this script, with the help of some PB functions.
      path.updateArcLengths();
      // Adjust all bezier control points to keep the path smooth
      for (var i in path.bezierCurves) {
        path.adjustPredecessorControlPoint(i, false, true);
      }
      redraw();
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        animate: false
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | This is the part where the Bézier magic happens
    // +-------------------------------
    var step = 0.003;
    var t = 0.0;
    var redraw = function () {
      // Each redraw loop determines the current start vector and the current
      // end vector on the curve. (get a subcurve for that)

      var subCurve = path.bezierCurves[0].getSubCurveAt(0, t);
      pb.draw.cubicBezier(
        subCurve.startPoint,
        subCurve.endPoint,
        subCurve.startControlPoint,
        subCurve.endControlPoint,
        "#8800ff",
        2
      );
      pb.draw.line(subCurve.startPoint, subCurve.startControlPoint, "#a8a800", 1);
      pb.draw.line(subCurve.endPoint, subCurve.endControlPoint, "#a8a800", 1);
      // And draw the current position on the curve as a grey point.
      pb.fill.circle(subCurve.endPoint, 3, "rgba(255,255,255,0.5)");

      t += step;
      if (t >= 1.0) t = 0.0; // Reset t after each rendering loop
    };

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    // +---------------------------------------------------------------------------------
    // | Add some elements to draw (demo).
    // +-------------------------------
    var diameter = Math.min(pb.canvasSize.width, pb.canvasSize.height) / 2.5;
    var radius = diameter * 0.5;
    var hypo = Math.sqrt(radius * radius * 2);

    // +---------------------------------------------------------------------------------
    // | Add a circular connected bezier path.
    // +-------------------------------
    var numCurves = 1;
    var bpath = [];
    var animatableVertices = [];
    for (var i = 0; i < numCurves; i++) {
      bpath[i] = [randomVertex(), randomVertex(), randomVertex(), randomVertex()];
      animatableVertices.push(bpath[i][0]); // start point
      animatableVertices.push(bpath[i][1]); // end point
      animatableVertices.push(bpath[i][2]); // start control point
      // Do not add the end control point here if there are more than one curve. It will
      // be animated corresponding to the succeeding path curve (to keep the path smooth).
      if (numCurves == 1) animatableVertices.push(bpath[i][3]); // end control point
    }

    var path = BezierPath.fromArray(bpath);
    pb.add(path);

    // Animate the vertices: make them bounce around and reflect on the walls.
    var animator = null;
    var toggleAnimation = function () {
      if (config.animate) {
        if (animator) animator.stop();
        if (config.animationType == "radial")
          animator = new CircularVertexAnimator(animatableVertices, pb.viewport(), function () {
            pb.redraw();
          });
        // 'linear'
        else
          animator = new LinearVertexAnimator(animatableVertices, pb.viewport(), function () {
            pb.redraw();
          });
        animator.start();
      } else {
        animator.stop();
        animator = null;
      }
    };

    /**
     * Unfortunately the animator is not smart, so we have to create a new
     * one (and stop the old one) each time the vertex count changes.
     **/
    var updateAnimator = function () {
      if (!animator) return;
      animator.stop();
      animator = null;
      toggleAnimation();
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var f0 = gui.addFolder("Points");
      f0.add(config, "animate").onChange(toggleAnimation).title("Toggle point animation on/off.");
      f0.open();

      if (config.animate) toggleAnimation();
    }
  });
})(window);
