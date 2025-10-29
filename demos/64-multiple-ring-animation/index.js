/**
 * A script for calculating polygon angles and line intersection angles.
 *
 * @require AttrAnimator
 * @require CircularAttrAnimator
 *
 * @author   Ikaros Kappler
 * @date     2025-09-12
 * @version  1.0.0
 **/

// TODO: add miter options to draw/stroke-options

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  const RAD_TO_DEG = 180.0 / Math.PI;
  const DEG_TO_RAD = Math.PI / 180.0;
  _context.addEventListener("load", function () {
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var timingIntervals = [];
    timingIntervals.push(new TimeSegmentation().add([500, 500])); // Wait 500ms, then show 500ms, repeat...
    timingIntervals.push(new TimeSegmentation().add([1000, 1000]));
    timingIntervals.push(new TimeSegmentation().add([2000, 2000]));
    timingIntervals.push(new TimeSegmentation().add([4000, 4000]));
    timingIntervals.push(new TimeSegmentation().add([8000, 8000]));
    timingIntervals.push(new TimeSegmentation().add([16000, 16000]));
    timingIntervals.push(new TimeSegmentation().add([32000, 32000]));
    timingIntervals.push(new TimeSegmentation().add([64000, 64000]));
    var timingSquareSize = 16;
    var timingSquareGapSize = 8;

    var randomBoolean = function () {
      return Math.random() < 0.5;
    };

    var sourceMatrix = new DataGrid2dArrayMatrix(3, 9).setAll(randomBoolean);
    var targetMatrix = new DataGrid2dArrayMatrix(3, 9).setAll(randomBoolean);
    var matrixAnimStep = 0;
    var maxMatrixAnimSteps = 1500;
    var lissajousFigure = new LissajousFigure(
      2.0, // freqA,
      3.0, // freqB,
      0, // phaseA,
      0 // phaseB
    );

    // Array< { center: new Vertex(0,0),
    //          innerRadius: 45.0,
    //          outerRadius: 100.0,
    //          startAngleDeg: 0.0,
    //          endAngleDeg: Math.PI * 1.5 * RAD_TO_DEG,
    //          animators: [] } >
    const rings = [];
    var maxRingBounds = null;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", true),
      // Make sure start is sirculary smaller than end?
      wrapStartEnd: params.getBoolean("wrapStartEnd", true),
      numRings: params.getNumber("numRings", 5),
      matrixSquareSize: params.getNumber("matrixSquareSize", 16),
      matrixGapSize: params.getNumber("matrixGapSize", 8),
      debug: params.getBoolean("debug", false)
    };

    var init = function () {
      rings.push({
        center: new Vertex(0, 0),
        baseRotation: 0.0,
        innerRadius: 45.0,
        outerRadius: 100.0,
        startAngleDeg: 0.0,
        endAngleDeg: Math.PI * 1.5 * RAD_TO_DEG,
        lineColor: "rgba(255,192,0,1.0)",
        fillColor: "rgba(255,192,0,0.5)",
        animators: []
      });
      rings[0].animators.push(new AttrAnimator(rings[0], "startAngleDeg", Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1.0));
      rings[0].animators.push(new AttrAnimator(rings[0], "baseRotation", Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1.0));

      // rings[0].animators.push(new AttrAnimator(rings[0], "innerRadius", 45.0, 120.0, 1.0));
      rings.push({
        center: new Vertex(0, 0),
        baseRotation: 0.0,
        innerRadius: 120.0,
        outerRadius: 140.0,
        startAngleDeg: 0.0,
        endAngleDeg: Math.PI * 1.5 * RAD_TO_DEG,
        lineColor: "rgba(0,255,255,1.0)",
        fillColor: "rgba(0,255,255,0.5)",
        animators: []
      });
      rings[1].animators.push(new CircularAttrAnimator(rings[1], "endAngleDeg", "startAngleDeg", 1.0));

      maxRingBounds = rings.reduce(function (curBounds, ring) {
        curBounds.min.x = Math.min(curBounds.min.x, ring.center.x - ring.outerRadius);
        curBounds.max.x = Math.max(curBounds.max.x, ring.center.x + ring.outerRadius);
        curBounds.min.y = Math.min(curBounds.min.y, ring.center.y - ring.outerRadius);
        curBounds.max.y = Math.max(curBounds.max.y, ring.center.y + ring.outerRadius);
        return curBounds;
      }, new Bounds(
        new Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
      ));
    };

    var getMatrixSquareBox = function (x, y) {
      return new Bounds(
        {
          x: maxRingBounds.min.x - (x + 2) * (config.matrixSquareSize + config.matrixGapSize),
          y: maxRingBounds.max.y - y * (config.matrixSquareSize + config.matrixGapSize)
        },
        {
          x: maxRingBounds.min.x - (x + 2) * (config.matrixSquareSize + config.matrixGapSize) + config.matrixSquareSize,
          y: maxRingBounds.max.y - y * (config.matrixSquareSize + config.matrixGapSize) + config.matrixSquareSize
        }
      );
    };

    var postDraw = function (draw, fill) {
      var milliseconds = Date.now();
      var ringSquareDuration = 500; // One change per second

      // Draw outer ring bounds.
      // draw.rect(maxRingBounds.min, maxRingBounds.getWidth(), maxRingBounds.getHeight(), "rgba(192,192,192,0.15)", 1);

      rings.forEach(function (ring, ringIndex) {
        // console.log("Render Ring", ringIndex);
        renderRing(draw, fill, ring);
        if (milliseconds % ringSquareDuration < ringSquareDuration / 2.0) {
          pb.draw.square(
            { x: ring.center.x + ring.outerRadius, y: ring.center.y + ring.outerRadius },
            ring.outerRadius / 4.0,
            "orange",
            5.0
          );
        }
      });

      drawBinaryClock(draw, fill, milliseconds);

      drawMatrix(draw, fill, milliseconds);

      drawLissajous(draw, fill, milliseconds);
    }; // END postDraw

    // +---------------------------------------------------------------------------------
    // | Draw the binary clock.
    // +-------------------------------
    var drawBinaryClock = function (draw, fill, milliseconds) {
      timingIntervals.forEach(function (timingInterval, timingSquareIndex) {
        if (timingInterval.isTimestampVisible(milliseconds)) {
          fill.square(
            {
              x: timingSquareIndex * (timingSquareSize + timingSquareGapSize),
              y: maxRingBounds.min.y - timingSquareSize - timingSquareGapSize
            },
            timingSquareSize,
            "rgba(192,0,255,0.5)"
          );
          draw.square(
            {
              x: timingSquareIndex * (timingSquareSize + timingSquareGapSize),
              y: maxRingBounds.min.y - timingSquareSize - timingSquareGapSize
            },
            timingSquareSize,
            "rgba(192,0,255,0.75)",
            5.0
          );
        }
      });
    }; // END drawBinaryClock

    var activeMatrixColor = Color.makeRGB(0, 192, 192, 1.0);
    var inactiveMatrixColor = Color.parse(pb.config.backgroundColor); // Color.makeRGB(0, 0, 0, 1.0);
    // +---------------------------------------------------------------------------------
    // | Draw the matrix animation.
    // +-------------------------------
    var drawMatrix = function (draw, fill, milliseconds) {
      var sourceColor = new Color();
      var targetColor = new Color();
      // var finalSquareColor = new Color();
      for (var x = 0; x < sourceMatrix.xSegmentCount; x++) {
        for (var y = 0; y < sourceMatrix.ySegmentCount; y++) {
          // console.log("x");
          var box = getMatrixSquareBox(x, y);
          // draw.square(box.getCenter(), box.getWidth(), "green", 5);
          // var isSet = sourceMatrix.get(x, y);
          if (matrixAnimStep >= maxMatrixAnimSteps) {
            matrixAnimStep = 0;
            sourceMatrix = targetMatrix;
            targetMatrix = new DataGrid2dArrayMatrix(3, 9).setAll(randomBoolean);
            // console.log("New Matrix sourceMatrix", sourceMatrix.xSegmentCount, sourceMatrix.ySegmentCount);
            // console.log("New Matrix targetMatrix", targetMatrix.xSegmentCount, targetMatrix.ySegmentCount);
          } else {
            matrixAnimStep++;
          }
          var matrixAnimAmount = matrixAnimStep / maxMatrixAnimSteps;
          sourceColor.set(sourceMatrix.get(x, y) ? activeMatrixColor : inactiveMatrixColor);
          targetColor.set(targetMatrix.get(x, y) ? activeMatrixColor : inactiveMatrixColor);
          sourceColor.interpolate(targetColor, matrixAnimAmount);
          // if (animationFrameNumber % 100 === 0) {
          //   console.log("sourceColor", sourceColor.cssRGB(), "targetColor", targetColor.cssRGB());
          //   console.log("sourceMatrix", DataGrid2dArrayMatrix.toString(sourceMatrix));
          //   console.log("targetMatrix", DataGrid2dArrayMatrix.toString(targetMatrix));
          // }
          fill.square(
            box.getCenter(),
            box.getWidth(),
            sourceColor.cssRGB(), // isSet ? `rgba(0,192,192,${0.333 * matrixAnimAmount})` : "rgba(0,192,192,0.0)",
            5
          );
        }
      }
    }; // END drawMatrix

    var textOptions = {
      color: "rgba(255,0,255,0.5)",
      fontFamily: "Monospace",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: 300,
      lineHeight: 12,
      textAlign: "left",
      rotation: 0.0
    };
    // +---------------------------------------------------------------------------------
    // | Render the given ring.
    // +-------------------------------
    var renderRing = function (draw, fill, ring) {
      // var center = new Vertex(0, 0);
      var baseRotation = ring.baseRotation * DEG_TO_RAD;
      var safeStartAngle = geomutils.mapAngleTo2PI(baseRotation + DEG_TO_RAD * ring.startAngleDeg);
      var safeEndAngle = geomutils.mapAngleTo2PI(baseRotation + DEG_TO_RAD * ring.endAngleDeg);

      if (config.wrapStartEnd && ring.startAngleDeg > ring.endAngleDeg) {
        // Switch if start is after end
        safeEndAngle = geomutils.mapAngleTo2PI(baseRotation + DEG_TO_RAD * ring.startAngleDeg);
        safeStartAngle = geomutils.mapAngleTo2PI(baseRotation + DEG_TO_RAD * ring.endAngleDeg) - Math.PI * 2;
      }

      var pathData = SVGPathUtils.mkCircularRingSector(
        ring.center,
        ring.innerRadius,
        ring.outerRadius,
        safeStartAngle,
        safeEndAngle
      );
      draw.path(pathData, ring.lineColor, 6);
      fill.path(pathData, ring.fillColor);

      var startPosition = Circle.circleUtils.vertAt(ring.startAngleDeg * DEG_TO_RAD, ring.outerRadius + 10.0).add(ring.center);
      draw.crosshair(startPosition, 5, "rgb(0,192,192)", 1.0);
      fill.text(`<[s ${(ring.baseRotation + ring.startAngleDeg) * DEG_TO_RAD}`, startPosition.x, startPosition.y, textOptions);

      var endPosition = Circle.circleUtils.vertAt(ring.endAngleDeg * DEG_TO_RAD, ring.outerRadius + 10.0).add(ring.center);
      draw.crosshair(endPosition, 5, "rgb(0,192,192)", 1.0);
      fill.text(`<[e ${(ring.baseRotation + ring.endAngleDeg) * DEG_TO_RAD}`, endPosition.x, endPosition.y, textOptions);

      // draw.circleArc(ring.center, ring.innerRadius / 2.0, safeStartAngle, safeEndAngle, "red", 2);
      draw.circleArc(
        ring.center,
        ring.innerRadius / 2.0,
        baseRotation + DEG_TO_RAD * ring.startAngleDeg,
        baseRotation + DEG_TO_RAD * ring.endAngleDeg,
        "rgba(0,128,128,0.75)",
        2,
        {
          dashOffset: 0.0,
          dashArray: [5.0, 2.0]
        }
      );

      if (config.debug && animationFrameNumber % 100 === 0) {
        // console.log("pathData", pathData);
        console.log("tmp2", pathData, "ring.startAngleDeg", ring.startAngleDeg, "ring.endAngleDeg", ring.endAngleDeg);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw a tiny lissajous animation.
    // +-------------------------------
    var drawLissajous = function (draw, fill, milliseconds) {
      var stepSize = 0.05;
      var scale = 30.0;
      var offset = maxRingBounds.min;
      lissajousFigure.phaseA = -Math.PI + (((milliseconds / 2000) * Math.PI) % (2 * Math.PI));
      lissajousFigure.freqA = Math.floor((milliseconds / 3000) % 10); // 1 ... 10
      // console.log("lissajousFigure.freqA", lissajousFigure.freqA);
      var polyLine = lissajousFigure.toPolyLine(stepSize);
      polyLine.forEach(function (vert) {
        vert.scale(scale);
        vert.move(offset);
        vert.move({
          x: -(config.matrixSquareSize + config.matrixGapSize) * sourceMatrix.xSegmentCount + config.matrixGapSize / 2,
          y: 0
        });
      });

      // The miters look strange on the
      for (var i = 0; i < polyLine.length; i++) {
        draw.line(polyLine[i], polyLine[(i + 1) % polyLine.length], "rgba(192,0,192,0.233)", 5);
      }
      // draw.polyline(polyLine, false, "rgba(192,0,192,0.233)", 5);
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "animate").name("animate").title("Animate the ray?")
        .onChange( function() { toggleAnimation(); });
      // prettier-ignore
      gui.add(config, "wrapStartEnd").name("wrapStartEnd").title("Wrap around (swap) if start angle is larger than end angle.")
        .onChange( function() { pb.redraw() });
    }
    pb.config.postDraw = postDraw;

    function animateAllRings(time) {
      rings.forEach(function (ring) {
        // ring.animateFn(ring);
        ring.animators.forEach(function (animator) {
          animator.next(time);
        });
      });
    }

    // +---------------------------------------------------------------------------------
    // | Render next animation step.
    // +-------------------------------
    var isAnimationRunning = false;
    var animationFrameNumber = 0;
    function animateStep(time) {
      animateAllRings(time);
      animationFrameNumber++;
      pb.redraw();
      if (isAnimationRunning) {
        globalThis.requestAnimationFrame(animateStep);
      }
    }

    // +---------------------------------------------------------------------------------
    // | Toggle animation of main ray.
    // +-------------------------------
    function toggleAnimation() {
      if (config.animate) {
        if (!isAnimationRunning) {
          isAnimationRunning = true;
          animateStep(0);
        }
      } else {
        if (isAnimationRunning) {
          isAnimationRunning = false;
        }
      }
    }

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    // Filter shapes; keep only those of interest here
    pb.addContentChangeListener(function (_shapesAdded, _shapesRemoved) {
      // Drop everything we cannot handle with reflections
      polygon = pb.drawables.find(function (drwbl) {
        return drwbl instanceof Polygon;
      });

      mainRay.vector = pb.drawables.find(function (drwbl) {
        return drwbl instanceof Vector;
      });
    });

    init();
    pb.redraw();
    if (config.animate) {
      toggleAnimation();
    }
  });
})(globalThis);
