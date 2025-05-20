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
    // pb.drawConfig.ellipse.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.ellipse.lineWidth = 2;
    // pb.drawConfig.circle.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.circle.lineWidth = 2;
    // pb.drawConfig.ellipseSector.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.ellipseSector.lineWidth = 2;
    // pb.drawConfig.circleSector.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.circleSector.lineWidth = 2;
    // pb.drawConfig.bezier.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.bezier.lineWidth = 2;
    // pb.drawConfig.line.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.line.lineWidth = 2;
    // pb.drawConfig.triangle.color = "rgba(128,128,128,0.5)";
    // pb.drawConfig.triangle.lineWidth = 2;
    pb.drawConfig.vector.color = "rgba(0,192,255,0.5)";
    pb.drawConfig.vector.lineWidth = 4;
    // pb.drawConfig.drawHandleLines = false;

    // Array<Polygon | Circle | VEllipse | Line | CircleSector | VEllipseSector | BezierPath | Triangle>
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

    var postDraw = function (draw, fill) {
      for (var i = 0; i < polygon.vertices.length; i++) {
        var polyEdge = polygon.getEdgeAt(i);
        var nextPolyEdge = polygon.getEdgeAt(i + 1);
        var vertex = polygon.getVertexAt(i + 1);

        // Calculate angle at polygon vertex
        var angleInCorner = polygon.getInnerAngleAt(i + 1);
        fill.text("[" + i + "] " + (geomutils.mapAngleTo2PI(angleInCorner) * RAD_TO_DEG).toFixed(2) + "°", vertex.x, vertex.y, {
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

        var intersections = polyEdge.lineIntersections(mainRay, true);
        if (intersections.length === 0) {
          continue;
        }
        draw.circleHandle(intersections[0], 4, "red", 2);

        // Get Angle
      }
    }; // END postDraw

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShapes = function () {
      var viewport = pb.viewport();
      pb.removeAll(false, false); // Don't trigger redraw
      polygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
      polygon.scale(0.3, polygon.getCentroid());
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
    pb.config.postDraw = postDraw;

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    rebuildShapes();
    toggleAnimation();
  });
})(globalThis);
