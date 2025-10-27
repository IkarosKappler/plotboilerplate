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
        curBounds.max.x = Math.max(curBounds.min.x, ring.center.x + ring.outerRadius);
        curBounds.min.y = Math.min(curBounds.min.y, ring.center.y - ring.outerRadius);
        curBounds.max.y = Math.max(curBounds.min.y, ring.center.y + ring.outerRadius);
        return curBounds;
      }, new Bounds(
        new Vertex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vertex(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
      ));
    };

    var postDraw = function (draw, fill) {
      var milliseconds = Date.now();
      var ringSquareDuration = 500; // One change per second

      rings.forEach(function (ring, ringIndex) {
        // console.log("Render Ring", ringIndex);
        renderRing(draw, fill, ring);
        if (milliseconds % ringSquareDuration < ringSquareDuration / 2.0) {
          pb.draw.square(
            { x: ring.center.x + ring.outerRadius, y: ring.center.y + ring.outerRadius },
            ring.outerRadius / 4.0,
            "orange",
            1.0
          );
        }
      });

      timingIntervals.forEach(function (timingInterval, timingSquareIndex) {
        if (timingInterval.isTimestampVisible(milliseconds)) {
          fill.square(
            { x: timingSquareIndex * (timingSquareSize + timingSquareSize / 4), y: maxRingBounds.min.y - timingSquareSize },
            timingSquareSize,
            "red"
          );
        }
      });
    }; // END postDraw

    var drawTimingSquares = function (draw, fill, milliseconds, timingInterval, timingSquareIndex) {
      var totalDurationMs = timingInterval.reduce(function (accu, curValue) {
        accu += curValue[0] + curValue[1];
        return accu;
      }, 0);
      var currentTimeSection = milliseconds % totalDurationMs;
      var isRenderTimerItem = timingInterval.reduce(
        function (accu, curValue, _index) {
          /**
           * {boolean} accu
           * {[number,number]} curvalue
           */
          if (
            accu.leadingMs + curValue[0] <= currentTimeSection &&
            currentTimeSection < accu.leadingMs + curValue[0] + curValue[1]
          ) {
            accu.isVisible = true;
          }
          // if (timingSquareIndex == 0 && animationFrameNumber % 25 === 0 && _index + 1 >= timingInterval.length) {
          //   console.log(
          //     "totalDurationMs",
          //     totalDurationMs,
          //     "currentTimeSection",
          //     currentTimeSection,
          //     "accu",
          //     accu,
          //     "timingInterval",
          //     JSON.stringify(timingInterval)
          //   );
          // }
          accu.leadingMs += curValue[0] + curValue[1];
          return accu;
        },
        { leadingMs: 0, isVisible: false }
      );
      if (isRenderTimerItem.isVisible) {
        fill.square({ x: timingSquareIndex * (16 + 4), y: 0 }, 16, "red");
      }
    }; // END postDraw

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
      fill.text(`<[s ${ring.startAngleDeg * DEG_TO_RAD}`, startPosition.x, startPosition.y, textOptions);

      var endPosition = Circle.circleUtils.vertAt(ring.endAngleDeg * DEG_TO_RAD, ring.outerRadius + 10.0).add(ring.center);
      draw.crosshair(endPosition, 5, "rgb(0,192,192)", 1.0);
      fill.text(`<[e ${ring.endAngleDeg * DEG_TO_RAD}`, endPosition.x, endPosition.y, textOptions);

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
