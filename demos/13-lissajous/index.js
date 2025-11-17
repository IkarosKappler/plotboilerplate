/**
 * A demo to show BÃ©zier perpendiculars.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2018-11-22
 * @modified    2025-10-29 Ported the Lissajous structures to a Typescript class.
 * @version     1.1.0
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
        freqA: params.getNumber("freqA", 2),
        freqB: params.getNumber("freqB", 3),
        stepSize: params.getNumber("stepSize", 0.05),
        drawPhaseAnimation: params.getBoolean("drawPhaseAnimation", true),
        drawCircles: params.getBoolean("drawCircles", false),
        alternating: params.getBoolean("alternating", false),
        closeGap: params.getBoolean("closeGap", true),
        animate: params.getBoolean("animate", true),
        drawMarkers: params.getBoolean("drawMarkers", true),
        timeDilation: params.getNumber("timeDilation", 1.0)
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
      if (config.drawPhaseAnimation) {
        var dynamicFigure = new LissajousFigure(freqA, freqB, phaseA, phaseB);
        // Convert the dynamic figure to a sequence of path segments:
        //   - quadratic Bézier segments (3 vertices)
        //   - lines path segments (2 vertices)
        // Array< [Vertex, Vertex, Vertex] | [Vertex, Vertex] >
        var pathSegments = dynamicFigure.toQuadraticBezierApproximation(stepSize);
        pathSegments.forEach(function (segment) {
          // Scale figure to be larger than in [-1 .. 1]
          segment.forEach(function (vert) {
            vert.scaleXY({ x: scale, y: scale });
          });
          // Alternate values?
          if (config.alternating && segment.length >= 3) {
            segment[1].scaleXY({ x: 1, y: -1 });
          }
        });
        // Draw the segments.
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
    // | The animation loop function.
    // +-------------------------------
    var renderLoop = function (_time) {
      if (!config.animate) {
        time = 0;
        pb.redraw();
        return;
      }
      time = _time;
      // Animate from -PI to +PI
      config.phaseA = -Math.PI + ((((time * config.timeDilation) / 5000) * Math.PI) % (2 * Math.PI));
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
      // prettier-ignore
      f0.add(config, "phaseA").min(-Math.PI).max(Math.PI).step(0.01).listen().title("Phase A.")
        .onChange(function () {
          console.log("x");
          pb.redraw();
        });
      //f0.add(config, 'phaseB').min(-Math.PI).max(Math.PI).step(0.1).listen().title("Phase B.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      f0.add(config, "freqA").min(1).max(10).step(1).listen().onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "freqB").min(1).max(10).step(1).listen().title("The second frequency.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "stepSize").min(0.05).max(1.0).step(0.05).listen().title("The second phase.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "drawPhaseAnimation").listen().title("Draw the figure animated with phaseA.")
        .onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "drawCircles").listen().title("Draw the corresponsding circles.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "closeGap").listen().title("Close the draw gap between begin and and of curve.")
        .onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "drawMarkers").listen()
        .title("Draw a marker for the current begin/end position.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "alternating").listen().title("Draw alternating curve segments.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "timeDilation").min(0.1).max(2.0).step(0.1).listen().onChange(function () {
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
