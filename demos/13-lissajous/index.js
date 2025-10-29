/**
 * A demo to show BÃ©zier perpendiculars.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2018-11-22
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  var params = new Params(GUP);
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
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: false
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        phaseA: 0.0,
        phaseB: 0.0,
        freqA: 2,
        freqB: 3,
        stepSize: 0.05,
        drawPhaseAnimation: params.getBoolean("drawPhaseAnimation", true),
        drawCircles: params.getBoolean("drawCircles", false),
        alternating: true,
        closeGap: true,
        animate: true,
        drawMarkers: true
      },
      GUP
    );

    var time = 0;

    // +---------------------------------------------------------------------------------
    // | This is the part where the Bézier magic happens
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var scale = Math.min(pb.canvasSize.width, pb.canvasSize.height) * (config.drawCircles ? 0.25 : 0.35);
      var staticFigure = new LissajousFigure(config.freqA, config.freqB, 0, 0, config.stepSize);
      var figure = new LissajousFigure(config.freqA, config.freqB, config.phaseA, config.phaseB, config.stepSize);
      if (config.drawCircles) {
        drawCircles(draw, staticFigure, config.freqA, config.freqB, scale);
      }
      drawLissajous(staticFigure, figure, config.freqA, config.freqB, config.phaseA, config.phaseB, config.stepSize, scale);
    };

    // +---------------------------------------------------------------------------------
    // | Draw helping circles.
    // +-------------------------------
    function drawCircles(draw, staticFigure, freqA, freqB, scale) {
      var hScale = scale;
      var vScale = scale * 0.15;
      var shift = -scale * 1.5;
      var t = time / 1500;

      let hPos = new Vertex(Math.sin(freqA * t), Math.cos(freqA * t));
      hPos.x *= hScale;
      hPos.y *= vScale;
      hPos.y += shift;
      draw.line(hPos, staticFigure.getPointAt(t).scale(scale), "#888888");
      draw.ellipse(new Vertex(0, shift), hScale, vScale, "green", 1);
      draw.diamondHandle(hPos, 5, getContrastColor(Color.parse(pb.config.backgroundColor))); // '#000000' );

      let vPos = new Vertex(Math.cos(freqB * t), Math.sin(freqB * t));
      vPos.x *= vScale;
      vPos.y *= hScale;
      vPos.x += shift;
      draw.line(vPos, staticFigure.getPointAt(t).scale(scale), "#888888");
      draw.ellipse(new Vertex(shift, 0), vScale, hScale, "green", 1);
      draw.diamondHandle(vPos, 5, "#000000");
    }

    // +---------------------------------------------------------------------------------
    // | Draw the Lissajous figure.
    // +-------------------------------
    function drawLissajous(staticFigure, figure, freqA, freqB, phaseA, phaseB, stepSize, scale) {
      // Convert the Lissajous figure to an discrete poly line; and scale it if required.
      var polyLine = staticFigure.toPolyLine(stepSize).map(function (vert) {
        return vert.scale(scale);
      });

      pb.draw.polyline(polyLine, config.drawGap, "rgba(192,0,192,0.233)", 3);

      let pA = new Vertex(0, 0);
      let pB = new Vertex(0, 0);
      // if (config.drawPhaseAnimation) {
      //   let p1 = new Vertex(0, 0);
      //   let dx1 = freqA;
      //   let dy1 = freqB;
      //   pA = figure.getPointAt(stepSize);
      //   let x2, y2, dx2, dy2, det, x3, y3;
      //   var i = 0;
      //   for (var t = stepSize; t <= 2 * Math.PI + 2 * stepSize; t += stepSize) {
      //     x2 = Math.sin(phaseA + freqA * t);
      //     y2 = Math.sin(phaseB + freqB * t);
      //     dx2 = freqA * Math.cos(phaseA + freqA * t);
      //     dy2 = freqB * Math.cos(phaseB + freqB * t);
      //     det = dx1 * dy2 - dy1 * dx2;
      //     if (Math.abs(det) > 0.1) {
      //       x3 = ((x2 * dy2 - y2 * dx2) * dx1 - (p1.x * dy1 - p1.y * dx1) * dx2) / det;
      //       y3 = ((x2 * dy2 - y2 * dx2) * dy1 - (p1.x * dy1 - p1.y * dx1) * dy2) / det;
      //       pB.set(scale * x2, scale * y2 * (config.alternating ? -1 : 1));
      //       if (i > 0) {
      //         pb.draw.quadraticBezier(pA, new Vertex(scale * x3, scale * y3), pB, "rgba(0,108,255,1.0)", 2);
      //       }
      //     } else {
      //       pB.set(scale * x2, scale * y2);
      //       if (i > 0) pb.draw.line(pA, pB, "rgba(0,192,192,0.8)", 2);
      //     }
      //     p1.set(x2, y2);
      //     dx1 = dx2;
      //     dy1 = dy2;
      //     pA.set(pB);
      //     i++;
      //   } // END for
      // } // END if (drawPhaseAnimation)
      if (config.drawPhaseAnimation) {
        var dynamicFigure = new LissajousFigure(freqA, freqB, phaseA, phaseB);
        var pathSegments = dynamicFigure.toCubicBezierApproximation(stepSize, scale); // , config.alternating);
        console.log("pathSegments", pathSegments);
        // pathSegments.forEach(function (segment) {
        //   segment.forEach(function (vert) {
        //     vert.scaleXY(scale, scale);
        //     // if (config.alternating) {
        //     //   vert.scaleXY(1, -1);
        //     // }
        //   });
        // });
        for (var i = 0; i < pathSegments.length; i++) {
          var segment = pathSegments[i];
          if (segment.length === 3) {
            pb.draw.quadraticBezier(segment[0], segment[1], segment[2], "rgba(0,108,255,1.0)", 2);
          } else if (segment.length === 2) {
            pb.draw.line(segment[0], segment[1], "rgba(0,192,192,0.8)", 2);
          } else {
            console.log("No linear nor cubic Bézier fragment.");
          }
        }
      }

      if (config.drawMarkers) {
        if (config.drawPhaseAnimation) {
          pA = figure.getPointAt(time / 1500);
          pA.scale(scale);
          pb.draw.circle(pA, 3, "orange");
        }
        pB = staticFigure.getPointAt(time / 1500);
        pB.scale(scale);
        pb.draw.circle(pB, 3, "rgba(128,128,128,0.33)");
      }
    } // END function

    // +---------------------------------------------------------------------------------
    // | Add some elements to draw (demo).
    // +-------------------------------
    //var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/2.5;
    //var radius   = diameter*0.5;
    //var hypo     = Math.sqrt( radius*radius*2 );

    var renderLoop = function (_time) {
      if (!config.animate) {
        time = 0;
        pb.redraw();
        return;
      }
      time = _time;
      // Animate from -PI to +PI
      config.phaseA = -Math.PI + (((time / 5000) * Math.PI) % (2 * Math.PI));
      pb.redraw();
      window.requestAnimationFrame(renderLoop);
    };

    var startAnimation = function () {
      window.requestAnimationFrame(renderLoop);
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var f0 = gui.addFolder("Points");
      f0.add(config, "phaseA")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.01)
        .listen()
        .title("Phase A.")
        .onChange(function () {
          console.log("x");
          pb.redraw();
        });
      //f0.add(config, 'phaseB').min(-Math.PI).max(Math.PI).step(0.1).listen().title("Phase B.").onChange( function() { pb.redraw(); } );
      f0.add(config, "freqA")
        .min(1)
        .max(10)
        .step(1)
        .listen()
        .title("The first frequency.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "freqB")
        .min(1)
        .max(10)
        .step(1)
        .listen()
        .title("The second frequency.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "stepSize")
        .min(0.05)
        .max(1.0)
        .step(0.05)
        .listen()
        .title("The second phase.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "drawPhaseAnimation")
        .listen()
        .title("Draw the figure animated with phaseA.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "drawCircles")
        .listen()
        .title("Draw the corresponsding circles.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "closeGap")
        .listen()
        .title("Close the draw gap between begin and and of curve.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "drawMarkers")
        .listen()
        .title("Draw a marker for the current begin/end position.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "alternating")
        .listen()
        .title("Draw alternating curve segments.")
        .onChange(function () {
          pb.redraw();
        });
      f0.add(config, "animate").title("Toggle phase animation on/off.").onChange(startAnimation);
      f0.open();

      pb.config.postDraw = postDraw;
      // Will stop after first draw if config.animate==false
      startAnimation();
    }
  });
})(window);
