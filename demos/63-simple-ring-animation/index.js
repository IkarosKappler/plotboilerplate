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

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", true),
      innerRadius: params.getNumber("innerRadius", 90.0),
      outerRadius: params.getNumber("outerRadius", 150.0),
      startAngleDeg: params.getNumber("startAngleDeg", 0.0), // 0.0,
      endAngleDeg: params.getNumber("endAngleDeg", Math.PI * 1.5 * RAD_TO_DEG),
      // Make sure start is sirculary smaller than end?
      wrapStartEnd: params.getBoolean("wrapStartEnd", true)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var baseRotation = Math.PI / 5.0;
    var animationFrameNumber = 0;

    var postDraw = function (draw, fill) {
      var center = new Vertex({ x: 0, y: 0 });
      // draw.circle(center, 100, "red", 1);

      var safeStartAngle = baseRotation + DEG_TO_RAD * config.startAngleDeg;
      var safeEndAngle = baseRotation + DEG_TO_RAD * config.endAngleDeg;

      if (config.wrapStartEnd && config.startAngleDeg > config.endAngleDeg) {
        // Switch if start is after end
        safeEndAngle = baseRotation + DEG_TO_RAD * config.startAngleDeg;
        safeStartAngle = baseRotation + DEG_TO_RAD * config.endAngleDeg;
      }

      var pathData = SVGPathUtils.mkCircularRingSector(
        center,
        config.innerRadius,
        config.outerRadius,
        safeStartAngle, // baseRotation + DEG_TO_RAD * config.startAngleDeg,
        safeEndAngle // baseRotation + DEG_TO_RAD * config.endAngleDeg
      );
      draw.path(pathData, "rgba(255,255,0,1.0)", 6);
      fill.path(pathData, "rgba(255,255,0,0.5)");

      if (animationFrameNumber % 100 === 0) {
        console.log("pathData", pathData);
      }
    }; // END postDraw

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "animate").name("animate").title("Animate the ray?")
        .onChange( function() { toggleAnimation(); });
      // prettier-ignore
      gui.add(config, "innerRadius").min(1).max(200).step(1).name("innerRadius").title("The inner circle radius")
       .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "outerRadius").min(1).max(200).step(1).name("outerRadius").title("The outer circle radius")
       .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "startAngleDeg").min(0.0).max(360).step(1).name("startAngleDeg").title("The start angle of the section.")
       .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "endAngleDeg").min(0.0).max(360).step(1).name("endAngleDeg").title("The end angle of the section.")
       .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "wrapStartEnd").name("wrapStartEnd").title("Wrap around (swap) if start angle is larger than end angle.")
        .onChange( function() { pb.redraw() });
    }
    pb.config.postDraw = postDraw;

    // +---------------------------------------------------------------------------------
    // | Render next animation step.
    // +-------------------------------
    var isAnimationRunning = false;
    function animateStep(time) {
      baseRotation += 0.01;
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

    pb.redraw();
    if (config.animate) {
      toggleAnimation();
    }
  });
})(globalThis);
