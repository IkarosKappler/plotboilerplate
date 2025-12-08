/**
 * A script for calculating and displaying simple Perlin noise.
 *
 * @author   Ikaros Kappler
 * @date     2025-10-29
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
    var bounds = pb.viewport().getScaled(0.5);
    var noise = new PerlinNoise().seed(10);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", false),
      drawFrame: params.getBoolean("drawFrame", false),
      perlinDepth: params.getNumber("perlinDepth", 6),
      yIndex: params.getNumber("yIndex", 0)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var animationFrameNumber = 0;

    // Should be a power of 2
    var data = null;

    var initNoiseData = function () {
      var dataLength = Math.pow(2, config.perlinDepth);
      data = arrayFill(dataLength, 0.0);
      for (var x = 0; x < dataLength; x++) {
        data[x] = noise.perlin2((x / dataLength) * config.perlinDepth, config.yIndex / dataLength);
      }
      // console.log("data", data);
    };

    var postDraw = function (draw, fill) {
      var boundsCenter = bounds.getCenter();
      var maxColHeight = bounds.getHeight() / 2.0;
      // draw.crosshair(boundsCenter, 15, "red", 2);

      if (config.drawFrame) {
        draw.rect(bounds.min, bounds.width, bounds.height, "orange", 1);
      }
      var leftDrawOffset = bounds.min.x; //  + bounds.width / data.length / 2;
      for (var i = 0; i < data.length; i++) {
        var xPct = i / (data.length - 1);
        var value = data[i];

        draw.line(
          { x: leftDrawOffset + xPct * bounds.width, y: boundsCenter.y },
          { x: leftDrawOffset + xPct * bounds.width, y: boundsCenter.y - maxColHeight * value },
          "red",
          2
        );
        if (i - 1 >= 0) {
          var xPctOld = (i - 1) / (data.length - 1);
          var valueOld = data[i - 1];

          draw.line(
            {
              x: leftDrawOffset + xPctOld * bounds.width,
              y: boundsCenter.y - maxColHeight * valueOld
            },
            { x: leftDrawOffset + xPct * bounds.width, y: boundsCenter.y - maxColHeight * value },
            "orange",
            1
          );
        }
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
      gui.add(config, "drawFrame").name("drawFrame").title("Draw the bounding frame?")
        .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "perlinDepth").listen().min(1).max(12).step(1).name("perlinDepth").title("The 2^x data array length.")
      .onChange( function() { initNoiseData(); pb.redraw() });
      // prettier-ignore
      gui.add(config, "yIndex").listen().min(1).max(256).step(1).name("yIndex").title("The perlin noise `y` position.")
      .onChange( function() { initNoiseData(); pb.redraw() });
    }
    pb.config.postDraw = postDraw;

    // +---------------------------------------------------------------------------------
    // | Render next animation step.
    // +-------------------------------
    var isAnimationRunning = false;
    function animateStep(time) {
      // baseRotation += 0.01;
      config.yIndex++;
      animationFrameNumber++;
      initNoiseData();
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

    initNoiseData();
    pb.redraw();
    if (config.animate) {
      toggleAnimation();
    }
  });
})(globalThis);
