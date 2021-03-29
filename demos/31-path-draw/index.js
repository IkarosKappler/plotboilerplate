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
          autoAdjustOffset: false, // true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: false
        },
        GUP
      )
    );

    pb.config.postDraw = function () {
      redraw();
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        customScaleX: 1.0,
        customScaleY: 1.0,
        customRotation: 0.0,

        drawArc: false,
        lineWidth: 2.0,
        arcRotation: 0.0,
        fitToRange: function () {
          setView(viewRangeX, viewRangeY);
        }
      },
      GUP
    );

    var arrayCopy = function (arr) {
      const result = [];
      for (var i = 0; i < arr.length; i++) result.push(arr[i]);
      return result;
    };

    // Define a shape with SVG path data attributes only with _absolute_
    // path commands.
    // prettier-ignore
    var svgDataAbsolute = [
		    'M', -10, -7.5,
		    'V', -10, 
		    'L', 0, -10,
		    'C', -5, -15, 10, -15, 5, -10,
		    'H', 10,
		    'C', 5, -7.5, 5, -7.5, 10, -5,
		    'S', 15, 0, 10, 0,
		    'Q', 5, 5, 0, 0,
		    'T', -10, 0,
		    'A', 5, 4, 0, 1, 1, -10, -5,    
		    'Z'
	    ];

    // Now define the same shape. But only y with _relative_
    // path commands.
    // prettier-ignore
    var svgDataRelative = [
        'M', -10, -7.5,
        'v', -2.5, 
        'l', 10, 0,
        'c', -5, -5, 10, -5, 5, 0,
        'h', 5,
        'c', -5, 2.5, -5, 2.5, 0, 5,
        's', 5, 5, 0, 5,
        'q', -5, 5, -10, 0,
        't', -10, 0,
        'a', 5, 4, 0, 1, 1, 0, -5,    
        'z'
	    ];
    // Move relative path 25 units to the right
    drawutilssvg.transformPathData(svgDataRelative, { x: 25, y: 0 }, { x: 1, y: 1 });

    var viewRangeX = new Interval(-11, 52);
    var viewRangeY = new Interval(-11, 22);

    var setView = function (rangeX, rangeY) {
      pb.config.scaleX = pb.draw.scale.x = pb.fill.scale.x = pb.canvasSize.width / rangeX.length();
      pb.config.scaleY = pb.draw.scale.y = pb.fill.scale.y = pb.config.scaleX; // pb.canvasSize.height / rangeY.length();
      pb.config.offsetX = pb.draw.offset.x = pb.fill.offset.x = pb.canvasSize.width / 3;
      pb.config.offsetY = pb.draw.offset.y = pb.fill.offset.y = pb.canvasSize.height / 1.5;
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | This is the part where the magic happens
    // +-------------------------------

    var redraw = function () {
      // Print and draw on the canvas.
      // drawutilssvg.transformPathData( svgDataAbsolute, pb.draw.offset, pb.draw.scale );
      var pathA = arrayCopy(svgDataAbsolute);
      drawutilssvg.transformPathData(pathA, { x: 0, y: 0 }, { x: config.customScaleX, y: config.customScaleY });
      pb.draw.path(pathA, "rgb(255,0,0)", config.lineWidth, false);

      // Print and draw on the canvas (and move 25 units to see them better)
      // drawutilssvg.transformPathData( svgDataRelative, pb.draw.offset, pb.draw.scale );
      var pathR = arrayCopy(svgDataRelative);
      pb.draw.path(pathR, "rgb(0,255,0)", config.lineWidth, false);

      if (config.drawArc) {
        drawArc();
      }
    };

    var drawArc = function () {
      var D2R = Math.PI / 180;
      var axisRotation = config.arcRotation; // (config.arcRotation / 180) * Math.PI;
      var fa = 1;
      var fs = 1;
      // prettier-ignore
      var arcOnly = ["M", -10, 0, "A", 5, 4, axisRotation, fa, fs, -10, -5];
      drawutilssvg.transformPathData(arcOnly, { x: 25, y: 10 }, { x: 1, y: 1 });
      pb.draw.path(arcOnly, "rgb(0,255,255)", config.lineWidth, false);
      pb.draw.circleHandle({ x: arcOnly[1], y: arcOnly[2] }, 3, "green");
      pb.draw.circleHandle({ x: arcOnly[9], y: arcOnly[10] }, 3, "green");
      var svgBezier = trasformSVGArcToBezier(new Vertex(arcOnly[1], arcOnly[2]), arcOnly, 3);
      console.log("svgBezier", svgBezier);
      pb.draw.path(svgBezier, "rgba(255,255,0,0.666)", config.lineWidth * 2, false);
    };

    var trasformSVGArcToBezier = function (lastPoint, data, startIndex) {
      var D2R = Math.PI / 180;
      // pb.draw.path(arcOnly, "rgb(0,255,255)", config.lineWidth, false);
      // pb.draw.circleHandle({ x: arcOnly[1], y: arcOnly[2] }, 3, "green");
      // pb.draw.circleHandle({ x: arcOnly[9], y: arcOnly[10] }, 3, "green");
      // var sector = svgArcToEllipseSector(arcOnly[1], arcOnly[2], 5, 4, axisRouation, true, true, -10, -5);
      // var data = ["A", rx, ry, axisRotation, fa, fs, endx, endy];
      var sector = VEllipseSector.ellipseSectorUtils.endpointToCenterParameters(
        lastPoint.x, // x1
        lastPoint.y, // y1
        data[startIndex + 1], // rx
        data[startIndex + 2], // ry
        data[startIndex + 3] * D2R, // rotation (phi)
        data[startIndex + 4] != 0, // fa
        data[startIndex + 5] != 0, // fs
        data[startIndex + 6], // x2
        data[startIndex + 7] // y2
      );
      // console.log("sector", sector);
      pb.draw.crosshair(sector.ellipse.center, 5, "blue");
      pb.draw.crosshair(sector.ellipse.axis, 5, "blue");
      var bezier = sector.toCubicBezier(16);
      var svgBezier = ["M", lastPoint.x, lastPoint.y];
      // var offs = { x: 0.0, y: 0.0 };
      for (var i = 0; i < bezier.length; i++) {
        // console.log(i);
        // bezier[i].startPoint.add(offs);
        // bezier[i].endPoint.add(offs);
        // bezier[i].startControlPoint.add(offs);
        // bezier[i].endControlPoint.add(offs);
        pb.draw.cubicBezier(
          bezier[i].startPoint,
          bezier[i].endPoint,
          bezier[i].startControlPoint,
          bezier[i].endControlPoint,
          "purple",
          1
        );
        svgBezier.push(
          "C",
          bezier[i].endPoint.x,
          bezier[i].endPoint.y,
          bezier[i].startControlPoint.x,
          bezier[i].startControlPoint.y,
          bezier[i].endControlPoint.x,
          bezier[i].endControlPoint.y
        );
      }
      return svgBezier;
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

      // prettier-ignore
      f0.add(config, "customScaleX").min(-4).max(4).title("A custom horizontal scale.").onChange(function () {
        pb.redraw();
      });
      // prettier-ignore
      f0.add(config, "customScaleY").min(-4).max(4).title("A custom vertical scale.").onChange(function () {
        pb.redraw();
      });
      // prettier-ignore
      f0.add(config, "customRotation").min(0).max(360).title("A custom rotation.").onChange(function () {
        pb.redraw();
      });
      // prettier-ignore
      f0.add(config, "lineWidth").min(1).max(20).title("The line with to use.").onChange(function () {
          pb.redraw();
        });
      var f1 = gui.addFolder("Arc draw settings");
      // prettier-ignore
      f1.add(config, "drawArc").title("Draw the single arc segment?").onChange(function () {
        pb.redraw();
      });
      f1.add(config, "arcRotation")
        .min(0)
        .max(360)
        .title("The test rotation to use.")
        .onChange(function () {
          pb.redraw();
        });
      gui.add(config, "fitToRange").title("Reset view to best range fit.");
      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation();
    } else {
      setView(viewRangeX, viewRangeY);
      pb.redraw();
    }
  });
})(window);
