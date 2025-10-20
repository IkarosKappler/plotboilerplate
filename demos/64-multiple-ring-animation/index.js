/**
 * A script for calculating polygon angles and line intersection angles.
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

    // Array< { center: new Vertex(0,0),
    // innerRadius: 45.0,
    // outerRadius: 100.0,
    // startAngleDeg: 0.0,
    // endAngleDeg: Math.PI * 1.5 * RAD_TO_DEG,
    // animators: [] } >
    const rings = [];

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", true),
      // Make sure start is sirculary smaller than end?
      wrapStartEnd: params.getBoolean("wrapStartEnd", true),
      numRings: params.getNumber("numRings", 5)
    };

    var init = function () {
      rings.push({
        center: new Vertex(0, 0),
        innerRadius: 45.0,
        outerRadius: 100.0,
        startAngleDeg: 0.0,
        endAngleDeg: Math.PI * 1.5 * RAD_TO_DEG,
        animators: []
      });
      // rings[0].animators.push(new AttrAnimator(rings[0], "innerRadius", 45.0, 120.0, 1.0));
      rings[0].animators.push(new AttrAnimator(rings[0], "startAngleDeg", Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1.0));
      // rings.push({
      //   innerRadius: 80.0,
      //   outerRadius: 150.0,
      //   startAngleDeg: 0.0,
      //   endAngleDeg: Math.PI * 1.5 * RAD_TO_DEG,
      //   animators: []
      // });
      // rings[1].animators.push(new AttrAnimator(rings[1], "innerRadius", 80.0, 200.0, 1.0));
      // rings[1].animators.push(new AttrAnimator(rings[1], "startAngleDeg", Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1.0));
    };

    var AttrAnimator = function (obj, attrName, min, max, stepValue) {
      this.obj = obj;
      this.attrName = attrName;
      this.min = min;
      this.max = max;
      this.stepValue = stepValue;
    };
    AttrAnimator.prototype.next = function () {
      this.obj[this.attrName] += this.stepValue;
      if (this.obj[this.attrName] < this.min || this.obj[this.attrName] > this.max) {
        this.stepValue = -this.stepValue;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var baseRotation = Math.PI / 5.0;
    var animationFrameNumber = 0;

    var postDraw = function (draw, fill) {
      var milliseconds = Date.now();
      var quareDuration = 1000; // One change per second

      // ...
      var center = new Vertex({ x: 0, y: 0 });
      // draw.circle(center, 100, "red", 1);

      rings.forEach(function (ring, ringIndex) {
        // console.log("Render Ring", ringIndex);
        renderRing(draw, fill, ring);
        if (milliseconds % quareDuration < quareDuration / 2.0) {
          pb.draw.square({ x: ring.center.x, y: ring.center.y }, ring.outerRadius / 2.0, "orange", 1.0);
        }
      });
    }; // END postDraw

    var renderRing = function (draw, fill, ring) {
      // var center = new Vertex(0, 0);
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
      draw.path(pathData, "rgba(255,255,0,1.0)", 6);
      fill.path(pathData, "rgba(255,255,0,0.5)");

      if (animationFrameNumber % 100 === 0) {
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

    function animateAllRings() {
      rings.forEach(function (ring) {
        // ring.animateFn(ring);
        ring.animators.forEach(function (animator) {
          animator.next();
        });
      });
    }

    // +---------------------------------------------------------------------------------
    // | Render next animation step.
    // +-------------------------------
    var isAnimationRunning = false;
    function animateStep(time) {
      // baseRotation += 0.01;
      animateAllRings();
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
