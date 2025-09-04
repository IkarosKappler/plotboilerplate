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
    var mainRay = new Ray(
      new Vector(new Vertex(), new Vertex(250, 250).rotate(Math.random() * Math.PI)),
      null, // sourceLens,
      null, // sourceShape,
      {} // properties
    );

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
      if (polygon.containsVert(mainRay.vector.a)) {
        mainRay.sourceLens = polygon;
        pb.drawConfig.vector.color = "rgba(255,192,255,0.5)";
      } else {
        mainRay.sourceLens = null;
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

        // if (mainRay) {
        //   var intersections = polyEdge.lineIntersections(mainRay.vector, true);
        //   if (intersections.length === 0) {
        //     continue;
        //   }
        //   drawIntersectionAngles(draw, fill, intersections[0]);
        // }
      } // END for

      if (mainRay) {
        drawIntersectionAngles(draw, fill);
      }

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
    // var drawIntersectionAngles = function (draw, fill, intersection) {
    //   draw.circleHandle(intersection, 4, "red", 2);

    //   for (var j = 0; j < polygon.vertices.length; j++) {
    //     var polyEdge2 = polygon.getEdgeAt(j);
    //     if (!polyEdge2.hasPoint(intersection, true)) {
    //       continue;
    //     }
    //     var vectorAngleA = polyEdge2.angle(mainRay.vector);
    //     fill.text(
    //       "[" + j + "] " + (geomutils.mapAngleTo2PI(vectorAngleA) * RAD_TO_DEG).toFixed(2) + "°",
    //       intersection.x,
    //       intersection.y,
    //       {
    //         color: "orange",
    //         fontFamily: "Monospace",
    //         fontSize: 12
    //       }
    //     );
    //     // Draw arc
    //     draw.circleArc(
    //       intersection,
    //       16, // radius
    //       mainRay.vector.angle(), // startAngle
    //       polyEdge2.angle(), // startAngle
    //       "orange", // color
    //       1.0 // lineWidth
    //     );
    //   }
    // };

    // +---------------------------------------------------------------------------------
    // | Draw angles between main ray and polygon edge.
    // +-------------------------------
    var drawIntersectionAngles = function (draw, fill) {
      // Get all intersections and sort them by distance on main ray
      var intersectionTuples = polygon.lineIntersectionTangentsIndices(mainRay.vector, true).sort(function (tupleA, tupleB) {
        return mainRay.vector.a.distance(tupleA.intersection.a) - mainRay.vector.a.distance(tupleB.intersection.a);
      });

      var rayIsInsidePolygon = polygon.containsVert(mainRay.vector.a);

      for (var i = 0; i < intersectionTuples.length; i++) {
        var polyEdge2 = polygon.getEdgeAt(intersectionTuples[i].edgeIndex);
        var intersectionVector = intersectionTuples[i].intersection;
        var intersection = intersectionVector.a;

        if (rayIsInsidePolygon) {
          intersectionVector.inv();
        }

        draw.circleHandle(intersection, 4, "red", 2);
        draw.arrow(intersectionVector.a, intersectionVector.b, "rgba(255,64,0,0.5)", 3);

        // var vectorAngleA = intersectionVector.angle(mainRay.vector);
        var vectorAngleA = mainRay.vector.angle(intersectionVector);

        fill.text(
          "[" + i + "] " + (geomutils.mapAngleTo2PI(vectorAngleA) * RAD_TO_DEG).toFixed(2) + "°",
          intersection.x,
          intersection.y,
          {
            color: "orange",
            fontFamily: "Monospace",
            fontSize: 12
          }
        );
        // Draw arc
        var arcStartAngle = rayIsInsidePolygon ? Math.PI + intersectionVector.angle() : intersectionVector.angle();
        var arcEndAngle = rayIsInsidePolygon ? Math.PI + mainRay.vector.angle() : mainRay.vector.angle();

        draw.circleArc(
          intersection,
          16, // radius
          arcStartAngle, // startAngle
          arcEndAngle, // endAngle
          "orange", // color
          1.0 // lineWidth
        );

        rayIsInsidePolygon = !rayIsInsidePolygon;
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
      pb.add([polygon, mainRay.vector], true); // trigger redraw
    };

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

      mainRay.vector = pb.drawables.find(function (drwbl) {
        return drwbl instanceof Vector;
      });
    });

    rebuildShapes();
  });
})(globalThis);
