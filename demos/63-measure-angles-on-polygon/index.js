/**
 * A script for calculating polygon angles and line intersection angles.
 *
 * @author   Ikaros Kappler
 * @date     2025-05-20
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
    // Let's set up some colors.
    pb.drawConfig.polygon.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.polygon.lineWidth = 2;
    pb.drawConfig.vector.color = "rgba(0,192,255,0.5)";
    pb.drawConfig.vector.lineWidth = 4;

    var polygon = null;
    var mainRay = new Vector(new Vertex(), new Vertex(250, 250).rotate(Math.random() * Math.PI));

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // ...
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // NONE

    var preDraw = function (_draw, _fill) {
      if (!polygon || !mainRay) {
        return;
      }
      if (polygon.containsVert(mainRay.a)) {
        pb.drawConfig.vector.color = "rgba(255,192,255,0.5)";
      } else {
        pb.drawConfig.vector.color = "rgba(0,192,255,0.5)";
      }
    };

    var postDraw = function (draw, fill) {
      if (!polygon) {
        return;
      }
      for (var i = 0; i < polygon.vertices.length; i++) {
        var polyEdge = polygon.getEdgeAt(i);
        // var nextPolyEdge = polygon.getEdgeAt(i + 1);
        // var vertex = polygon.getVertexAt(i + 1);

        drawEdgeAngle(draw, fill, polygon, i);

        // Calculate angle at polygon vertex
        drawAngleInCorner(draw, fill, polygon, i);

        if (mainRay) {
          var intersections = polyEdge.lineIntersections(mainRay, true);
          if (intersections.length === 0) {
            continue;
          }
          drawIntersectionAngles(draw, fill, intersections[0]);
        }
      } // END for

      // Maybe the content list has someting nice to draw.
      contentList.drawHighlighted(draw, fill);
    }; // END postDraw

    // +---------------------------------------------------------------------------------
    // | Draw the inner polygon angle at the given corner angle.
    // +-------------------------------
    var drawAngleInCorner = function (draw, fill, polygon, index) {
      var polyEdge = polygon.getEdgeAt(index);
      var nextPolyEdge = polygon.getEdgeAt(index + 1);
      var vertex = polygon.getVertexAt(index + 1);
      // Calculate angle at polygon vertex
      var angleInCorner = polygon.getInnerAngleAt(index + 1);
      fill.text("[" + index + "] " + (geomutils.mapAngleTo2PI(angleInCorner) * RAD_TO_DEG).toFixed(2) + "°", vertex.x, vertex.y, {
        color: "orange",
        fontFamily: "Monospace",
        fontSize: 12
      });

      // Draw arc
      draw.circleArc(
        vertex,
        16, // radius
        nextPolyEdge.angle(), // startAngle
        polyEdge.reverse().angle(), // startAngle
        "red", // color
        1.0 // lineWidth
      );
    };

    var drawEdgeAngle = function (draw, fill, polygon, index) {
      var polyEdge = polygon.getEdgeAt(index);
      var centerPoint = polyEdge.vertAt(0.5);
      var angleOfEdge = polyEdge.angle();
      fill.text(
        "[" + index + "] " + (geomutils.mapAngleTo2PI(angleOfEdge) * RAD_TO_DEG).toFixed(2) + "°",
        centerPoint.x,
        centerPoint.y,
        {
          color: "rgba(0,128,192,0.75)",
          fontFamily: "Monospace",
          fontSize: 12
        }
      );
    };

    // +---------------------------------------------------------------------------------
    // | Draw angles between main ray and polygon edge.
    // +-------------------------------
    var drawIntersectionAngles = function (draw, fill, intersection) {
      draw.circleHandle(intersection, 4, "red", 2);

      for (var j = 0; j < polygon.vertices.length; j++) {
        var polyEdge2 = polygon.getEdgeAt(j);
        if (!polyEdge2.hasPoint(intersection, true)) {
          continue;
        }
        var vectorAngleA = polyEdge2.angle(mainRay);
        fill.text(
          "[" + j + "] " + (geomutils.mapAngleTo2PI(vectorAngleA) * RAD_TO_DEG).toFixed(2) + "°",
          intersection.x,
          intersection.y,
          {
            color: "orange",
            fontFamily: "Monospace",
            fontSize: 12
          }
        );
        // Draw arc
        draw.circleArc(
          intersection,
          16, // radius
          mainRay.angle(), // startAngle
          polyEdge2.angle(), // startAngle
          "orange", // color
          1.0 // lineWidth
        );
      }
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShapes = function () {
      var viewport = pb.viewport();
      pb.removeAll(false, false); // Don't trigger redraw
      polygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
      polygon.scale(0.9, polygon.getCentroid());
      pb.add([polygon, mainRay], true); // trigger redraw
    };

    // +---------------------------------------------------------------------------------
    // | Render next animation step.
    // +-------------------------------
    function animateStep(time) {
      var animationCircle = new Circle(new Vertex(), viewport.getMinDimension() * 0.5);
      mainRay.b.set(animationCircle.vertAt(time / 5000));
      pb.redraw();
      if (isAnimationRunning) {
        globalThis.requestAnimationFrame(animateStep);
      }
    }

    // +---------------------------------------------------------------------------------
    // | Toggle animation of main ray.
    // +-------------------------------
    var isAnimationRunning = false;
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
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // // prettier-ignore
      // gui.add(config, "animate").name("animate").title("Animate the ray?")
      //   .onChange( function() { toggleAnimation(); });
      // // prettier-ignore
      // gui.add(config, "numRays").min(1).max(64).step(1).name("numRays").title("Number of rays to use.")
      //  .onChange( function() { pb.redraw() });
    }
    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;

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

      mainRay = pb.drawables.find(function (drwbl) {
        return drwbl instanceof Vector;
      });
    });

    rebuildShapes();
    toggleAnimation();
  });
})(globalThis);
