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
    // console.log( 'init. canvas: ', document.getElementById('my-canvas') );
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
        lineWidth: 2.0,
        arcRotation: 0.0,
        fitToRange: function () {
          setView(viewRangeX, viewRangeY);
        }
      },
      GUP
    );

    var time = 0;

    var randColor = function (i) {
      return WebColorsContrast[i % WebColorsContrast.length].cssRGB();
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
      var D2R = Math.PI / 180;
      // Print and draw on the canvas.
      // console.log("svgTestData", svgDataAbsolute);
      // drawutilssvg.transformPathData( svgDataAbsolute, pb.draw.offset, pb.draw.scale );
      pb.draw.path(svgDataAbsolute, "rgb(255,0,0)", config.lineWidth, false);

      // Print and draw on the canvas (and move 25 units to see them better)
      // console.log("svgTestDataRelative", svgDataRelative);
      // drawutilssvg.transformPathData( svgDataRelative, pb.draw.offset, pb.draw.scale );
      pb.draw.path(svgDataRelative, "rgb(0,255,0)", config.lineWidth, false);

      var axisRotation = config.arcRotation; // (config.arcRotation / 180) * Math.PI;
      // prettier-ignore
      var arcOnly = ["M", -10, 0, "A", 5, 4, axisRotation, 1, 1, -10, -5];
      drawutilssvg.transformPathData(arcOnly, { x: 25, y: 10 }, { x: 1, y: 1 });
      pb.draw.path(arcOnly, "rgb(0,255,255)", config.lineWidth, false);
      pb.draw.circleHandle({ x: arcOnly[1], y: arcOnly[2] }, 3, "green");
      pb.draw.circleHandle({ x: arcOnly[9], y: arcOnly[10] }, 3, "green");
      // var sector = svgArcToEllipseSector(arcOnly[1], arcOnly[2], 5, 4, axisRouation, true, true, -10, -5);
      var fa = 1;
      var fs = 1;
      var sector = getCenterParameters(
        arcOnly[1], // x1
        arcOnly[2], // y1
        arcOnly[9], // x2
        arcOnly[10], // y2
        fa,
        fs,
        arcOnly[4], // rx
        arcOnly[5], // ry
        arcOnly[6] * D2R // arcOnly[6] // rotation
      );
      // console.log("sector", sector);
      pb.draw.crosshair(sector.ellipse.center, 5, "blue");
      pb.draw.crosshair(sector.ellipse.axis, 5, "blue");
      var bezier = sector.toCubicBezier(16);
      var offs = { x: 0.0, y: 0.0 };
      for (var i = 0; i < bezier.length; i++) {
        pb.draw.cubicBezier(
          bezier[i].startPoint.add(offs),
          bezier[i].endPoint.add(offs),
          bezier[i].startControlPoint.add(offs),
          bezier[i].endControlPoint.add(offs),
          "purple",
          1
        );
      }
    };

    /** phi in radians! */
    function getCenterParameters(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
      // https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
      // https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
      var abs = Math.abs;
      var sin = Math.sin;
      var cos = Math.cos;
      var sqrt = Math.sqrt;
      // const pow = n => Math.pow(n, 2);
      const pow = function (n) {
        return Math.pow(n, 2);
      };

      const sinphi = sin(phi),
        cosphi = cos(phi);

      // Step 1: simplify through translation/rotation
      const x = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2,
        y = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;

      const px = pow(x),
        py = pow(y),
        prx = pow(rx),
        pry = pow(ry);

      // correct of out-of-range radii
      const L = px / prx + py / pry;

      if (L > 1) {
        rx = sqrt(L) * abs(rx);
        ry = sqrt(L) * abs(ry);
      } else {
        rx = abs(rx);
        ry = abs(ry);
      }

      // Step 2 + 3: compute center
      const sign = fa === fs ? -1 : 1;
      const M = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;

      const _cx = (M * (rx * y)) / ry,
        _cy = (M * (-ry * x)) / rx;

      const cx = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2,
        cy = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;

      // Step 4: Compute start and end angle
      var center = new Vertex(cx, cy);
      var axis = center.clone().addXY(rx, ry);
      var ellipse = new VEllipse(center, axis, 0);
      ellipse.rotate(phi);

      var startAngle = new Line(ellipse.center, new Vertex(x1, y1)).angle();
      var endAngle = new Line(ellipse.center, new Vertex(x2, y2)).angle();

      // return ellipse;
      return new VEllipseSector(ellipse, startAngle - phi, endAngle - phi);
    }

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
      var f0 = gui.addFolder("Points");

      // prettier-ignore
      f0.add(config, "lineWidth").min(1).max(20).title("The line with to use.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "arcRotation").min(0).max(360).title("The test rotation to use.").onChange(function () {
          pb.redraw();
        });
      f0.add(config, "fitToRange").title("Reset view to best range fit.");
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
