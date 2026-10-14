/**
 * A script for showing the centroid of any polygon.
 *
 * @author   Ikaros Kappler
 * @date     2026-10-11
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";
  var DEG_TO_RAD = Math.PI / 180;

  // Fetch the GET params
  _context.addEventListener("load", function () {
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas"),
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          fullSize: true
        },
        GUP
      )
    );

    // Create a config: we want to have control about the arrow head size in this demo
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, {
      focalControlAngle: params.getNumber("focalControlAngle", 45.0), // In Degrees!
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobileDevice();
    appContext.updateFocalControlPoint = function () {
      focalControlPoint.set(
        circle.vertAt(circleSector.startAngle + Math.PI / 2.0 - appContext.config.focalControlAngle * DEG_TO_RAD)
      );
      pb.redraw();
    };
    appContext.updateHelperCircle = function () {
      circle.center.set(lineAB.vertAt(0.5));
      circle.radius = lineAB.length() / 2.0;
      // cirleSector = new CircleSector(circle, lineAB.angle(), lineAB.angle() + Math.PI);
      circleSector.startAngle = lineAB.angle();
      circleSector.endAngle = lineAB.angle() + Math.PI;
    };
    appContext.updatePoints = function () {
      var lengthAB = inputPointA.distance(inputPointB);
      var lengthBC = inputPointB.distance(inputPointC);
      var lengthCA = inputPointC.distance(inputPointA);
      if (lengthAB >= lengthBC && lengthAB >= lengthCA) {
        pointA.set(inputPointA);
        pointB.set(inputPointB);
        pointC.set(inputPointC);
      } else if (lengthBC >= lengthCA && lengthBC >= lengthAB) {
        pointA.set(inputPointB);
        pointB.set(inputPointC);
        pointC.set(inputPointA);
      } else {
        // CA is the longest edge
        pointA.set(inputPointC);
        pointB.set(inputPointA);
        pointC.set(inputPointB);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var inputPointA = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointB = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointC = pb.viewport().randomPoint(0.333, 0.333);
    var focalControlPoint = new Vertex(0.0);
    focalControlPoint.attr.draggable = false;
    var circle = new Circle(new Vertex(0.0), 100.0);
    var circleSector = new CircleSector(circle, -Math.PI / 2.0, Math.PI / 2.0);
    pb.add([inputPointA, inputPointB, inputPointC, focalControlPoint]);

    // For the algorithm we need the line A-B to be the longest one from the triangle.
    var pointA = inputPointA.clone();
    var pointB = inputPointB.clone();
    var pointC = inputPointC.clone();
    var lineAB = new Line(pointA, pointB);

    // +---------------------------------------------------------------------------------
    // | Install listeners
    // +-------------------------------
    inputPointA.listeners.addDragListener(function () {
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
    });
    inputPointB.listeners.addDragListener(function () {
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
    });
    inputPointC.listeners.addDragListener(function () {
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
    });

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      draw.line(pointA, pointB, "orange", 2.0);
      var bisector = lineAB.perpBisector();
      draw.line(bisector.a, bisector.b, "orange", 1.0);

      var viewport = pb.viewport();
      var extendedLine = viewport.expandLine(bisector);
      // console.log("extendedLine", extendedLine);
      draw.line(extendedLine.a, extendedLine.b, "grey", 1.0);

      testDrawExpandedIntersection(draw, fill);

      draw.circleArc(circle.center, circle.radius, circleSector.startAngle, circleSector.endAngle, "orange", 1.0);

      draw.line(pointA, focalControlPoint, "rgba(0,192,192,0.5)", 2.0);
      draw.line(pointB, focalControlPoint, "rgba(0,192,192,0.5)", 2.0);

      // Create ellipse
      var axis1 = new Line(pointA, focalControlPoint);
      var axis2 = new Line(pointB, focalControlPoint);
      // var axisControlPoint = new Vertex(focalControlPoint.x - pointA.x, focalControlPoint.y - pointA.y);
      var axisControlPoint = focalControlPoint.clone().scale(-1.0, circle.center);

      var ellipse = new VEllipse(focalControlPoint, axisControlPoint, axis1.angle());
      draw.ellipse(
        ellipse.center,
        ellipse.radiusH(), // radiusX: number,
        ellipse.radiusV(), // radiusY: number,
        "yellow",
        1.0,
        ellipse.rotation,
        { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
      );
    };

    var testDrawExpandedIntersection = function (draw, fill) {
      var bisector = new Line(inputPointA, inputPointB).perpBisector();
      var viewport = pb.viewport();
      var north = viewport.getNorthBound();
      var east = viewport.getEastBound();
      var west = viewport.getWestBound();
      var south = viewport.getSouthBound();
      draw.line(north.a, north.b, "rgba(0,255,0,0.5)", 5);
      draw.line(east.a, east.b, "rgba(0,255,0,0.5)", 5);
      draw.line(west.a, west.b, "rgba(0,255,0,0.5)", 5);
      draw.line(south.a, south.b, "rgba(0,255,0,0.5)", 5);
      var intersections = [
        north.intersection(bisector, true),
        east.intersection(bisector, true),
        south.intersection(bisector, true),
        west.intersection(bisector, true)
      ];

      if (intersections[0]) {
        draw.crosshair(intersections[0], 6, "red");
      }
      if (intersections[1]) {
        draw.crosshair(intersections[1], 6, "red");
      }
      if (intersections[2]) {
        draw.crosshair(intersections[2], 6, "red");
      }
      if (intersections[3]) {
        draw.crosshair(intersections[3], 6, "red");
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      // ...
    }; // END preDraw

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext);

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    // var contentList = new PBContentList(pb);

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;

    appContext.updatePoints();
    appContext.updateHelperCircle();
    appContext.updateFocalControlPoint();
    // pb.redraw();
    humane.log("Move the three vertices around.");
  });
})(globalThis);
