/**
 * A demo about rendering polynomials with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 * @requires draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-04-25
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
          drawOrigin: true,
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

    /**
     *
     * @param {*} i
     * @returns
     */
    var randColor = function (i, alpha) {
      var color = WebColorsContrast[i % WebColorsContrast.length].clone();
      if (typeof alpha !== undefined) color.a = alpha;
      return color.cssRGBA();
    };

    /**
     * Use the current interpolation to change the sample count.
     *
     */
    var updateSampleCount = function () {
      var viewport = pb.viewport(); // Bounds
      var newVertices = [];
      for (var i = 0; i < config.sampleCount; i++) {
        var x = viewport.min.x + (i * (viewport.max.x - viewport.min.x)) / config.sampleCount;
        var vert = new Vertex(x, currentPolynom.evaluate(x)).scale(0.8);
        newVertices.push(vert);
      }
      pb.remove(vertices, false);
      vertices = newVertices;
      pb.add(newVertices, true);
    };

    var vertices = [];
    var currentPolynom = null;
    var init = function () {
      var viewport = pb.viewport(); // Bounds
      var steps = config.sampleCount; //  5;
      console.log(steps);
      for (var i = 0; i < steps; i++) {
        var vert = new Vertex(
          viewport.min.x + (i * (viewport.max.x - viewport.min.x)) / steps,
          viewport.min.y + (viewport.max.x - viewport.min.x) * Math.random()
        ).scale(0.8);
        vertices.push(vert);
        pb.add(vert);
      }
    };

    var postDraw = function (draw, fill) {
      var viewport = pb.viewport();
      // Sort verts
      var verts = vertices.sort(function (a, b) {
        return a.x - b.x;
      });
      var xValues = verts.map(function (vert) {
        return vert.x;
      });
      var lagrangeBasis = [];
      // Draw verts
      for (var j = 0; j < verts.length; j++) {
        if (config.drawSampleLines) {
          draw.line({ x: verts[j].x, y: viewport.min.y }, { x: verts[j].x, y: viewport.max.y }, "rgba(192,192,192,0.5)", 1.0);
        }
        if (j > 0 && config.drawLinear) {
          draw.line(verts[j - 1], verts[j], "rgba(0,192,192,1.0)", 1.0);
        }
        lagrangeBasis.push(new MultiplyScalarFunction(new LagrangePolynomial(xValues, j), verts[j].y));
        if (config.drawLagrangeBasis) {
          drawPolynomial(draw, fill, lagrangeBasis[j], xValues, randColor(j, 0.5), 2.0);
        }
      }
      var sum = new SumFunction(lagrangeBasis);
      // Draw sum of polynomials?
      if (config.drawLagrangeSum) {
        drawPolynomial(draw, fill, sum, xValues, "red", 2.0);
      }
      currentPolynom = sum;

      if (config.drawNewton) {
        drawNewton(draw, fill, verts);
      }
      if (config.drawFourierTransform) {
        drawFourierTransform(draw, fill, verts);
      }
    };

    var drawNewton = function (draw, fill, verts) {
      // number of inputs given
      // int n = 4;
      var n = verts.length;
      // float value, sum;
      var value, sum;
      // float y[][]=new float[10][10];
      var y = [];
      // float x[] = { 5, 6, 9, 11 };
      var x = verts.map(function (vert) {
        return vert.x;
      });

      // y[][] is used for divided difference
      // table where y[][0] is used for input
      // y[0][0] = 12;
      // y[1][0] = 13;
      // y[2][0] = 14;
      // y[3][0] = 16;
      for (var i = 0; i < n; i++) {
        y[i] = [verts[i].y, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }

      // calculating divided difference table
      dividedDiffTable(x, y, n);

      // displaying divided difference table
      // printDiffTable(y, n);

      var NewtonPolynomial = function () {
        this.evaluate = function (value) {
          return applyFormula(value, x, y, n);
        };
      };
      var polynomial = new NewtonPolynomial();
      drawPolynomial(draw, fill, polynomial, x, "green", 2);

      // value to be interpolated
      // value = 7;

      // // printing the value
      // DecimalFormat df = new DecimalFormat("#.##");
      // df.setRoundingMode(RoundingMode.HALF_UP);

      // System.out.println("\nValue at "+df.format(value)+" is "
      //         +df.format(applyFormula(value, x, y, n)));
    };

    var drawFourierTransform = function (draw, fill, verts) {
      var xValues = verts.map(function (vert) {
        return vert.x;
      });
      var yValues = verts.map(function (vert) {
        return vert.y;
      });
      // console.log("yValues", yValues);
      try {
        var a = cfft(yValues); // [1, 1, 1, 1, 0, 0, 0, 0]);
        var b = icfft(cfft(yValues)); // [1, 1, 1, 1, 0, 0, 0, 0]));
        console.log(a, b);
        var FourierPolynomial = function () {
          this.evaluate = function (value) {
            return 0.5; // ???
          };
        };
        var polynomial = new FourierPolynomial();
        drawPolynomial(draw, fill, polynomial, xValues, "green", 2);
      } catch (exc) {
        console.warn("Failed to generate Fourier transform.", exc);
      }
    };

    var drawPolynomial = function (draw, fill, polynomial, xValues, color, lineWidth) {
      var n = xValues.length;
      var lastX, lastY;
      var i = 0;
      var step = 5.0;
      for (var x = xValues[0]; x <= xValues[n - 1]; x += step) {
        var y = polynomial.evaluate(x);
        if (lastX) {
          draw.line({ x: lastX, y: lastY }, { x: x, y: y }, color, lineWidth);
        }
        lastX = x;
        lastY = y;
        i++;
      }
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        sampleCount: 8,
        drawLinear: true,
        lineWidth: 2.0,
        drawLagrangeBasis: true,
        drawLagrangeSum: true,
        drawSampleLines: true,
        drawNewton: false,
        drawFourierTransform: true
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
      f0.add(config, "sampleCount").min(3).max(16).step(1).title("The number of samples to use.").onChange(function () { updateSampleCount(); });
      // prettier-ignore
      f0.add(config, "lineWidth").min(1).max(20).title("The line with to use.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawLinear").title("Draw linear interpolation?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawLagrangeBasis").title("Draw Lagrange basis?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawLagrangeSum").title("Draw Lagrange sum?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawSampleLines").title("Draw sample lines?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawNewton").title("Draw Newton polynom?").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "drawFourierTransform").title("Draw Fourier transform?").onChange(function () { pb.redraw(); });
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
