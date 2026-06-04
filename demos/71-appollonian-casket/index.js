/**
 * A script for generating Chladni like sand patterns.
 *
 * @author   Ikaros Kappler
 * @date     2026-04-15
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  _context.addEventListener("load", function () {
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var isMobile = isMobileDevice();

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

    var POINT_SET_TYPES = ["Rectangular", "Random"];

    // Create a config: we want to have control about the arrow head size in this demo
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, {
      horizontalOffset: params.getNumber("horizontalOffset", 0.0),
      horizontalScale: params.getNumber("horizontalScale", 0.75),
      verticalOffset: params.getNumber("verticalOffset", 0.0),
      verticalScale: params.getNumber("verticalScale", 0.5),
      numPoints: params.getNumber("numPoints", 10000),
      distanceWeight: params.getNumber("distanceWeight", 10.0),
      sampleScale: params.getNumber("sampleScale", 3.0),
      pointSetType: params.getString("pointSetType", "Rectangular", function (v) {
        return POINT_SET_TYPES.indexOf(v) != -1;
      }), // Rectangular or Random

      // horizontalFnTerm:
      //   "sin( sqrt( (x0-x)*(x0-x) + (y0-y)*(y0-y) ) * sqrt( (x1-x)*(x1-x) + (y1-y)*(y1-y) ) * sqrt( (x2-x)*(x2-x) + (y2-y)*(y2-y) ) )",
      horizontalFnTerm: "sin( distance(p0,p) * distance(p1,p) * distance(p2,p))",
      verticalFnTerm: "sin(x + x0) * sin(y + y1) * sin(y + y2) * cos(y * 0.5)",

      randomizeInputPoints: function () {
        randomizeInputPoints();
      },
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // Array<Circle>
    var circles = [];

    var handleCircleCenterMove = function () {
      // pb.redraw();
    };

    var addRandomCircle = function () {
      var viewport = appContext.pb.viewport();
      var center = viewport.randomPoint(0.2, 0.2);
      var radius = Math.random() * viewport.getMinDimension() * 0.5;
      var circle = new Circle(center, radius);
      circles.push(circle);

      // circle.center.listeners.addDragListener(function () {
      //   handleCircleCenterMove();
      // });

      var radiusPoint = new Vertex(
        center.clone().addXY(circle.radius * Math.sin(Math.PI / 4), circle.radius * Math.cos(Math.PI / 4))
      );
      new CircleHelper(circle, radiusPoint, pb);

      pb.add([circle, center, radiusPoint]);
    };
    addRandomCircle();
    addRandomCircle();

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();
      // circles.forEach(function (circle) {
      //   draw.circle(circle.center, circle.radius, "orange", 1.0);
      // });

      // Find tangent line
      var circleA = circles[0];
      var circleB = circles[1];
      var connectLine = new Vector(circleA.center, circleB.center);

      var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
      var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
      var closestPointOnA = findClosestPoint(circleB.center, intersectionLineA.a, intersectionLineA.b);
      var closestPointOnB = findClosestPoint(circleA.center, intersectionLineB.a, intersectionLineB.b);

      var connectionLineBetween = new Line(closestPointOnA, closestPointOnB);

      var circleDifference = closestPointOnA.difference(closestPointOnB);
      var newCenterB = circleB.center.clone().sub(circleDifference);
      var perpVector = connectLine.perp().moveTo(closestPointOnA);

      console.log("closestPointOnA", closestPointOnA);
      draw.diamondHandle(closestPointOnA, 8, "orange");
      draw.diamondHandle(closestPointOnB, 8, "orange");

      draw.line(connectLine.a, connectLine.b, "grey", 1.0);
      draw.arrow(perpVector.a, perpVector.b, "orange", 1.0);

      fill.text("A", circleA.center.x + 5, circleA.center.y, { color: contrastColor });
      fill.text("B", circleB.center.x + 5, circleB.center.y, { color: contrastColor });

      draw.circle(newCenterB, circleB.radius, "grey", 2.0, { dashArray: [5, 10] });
    }; // END postDraw

    var findClosestPoint = function (referencePoint, pointA, pointB) {
      var distA = referencePoint.distance(pointA);
      var distB = referencePoint.distance(pointB);
      if (distA < distB) {
        return pointA;
      } else {
        return pointB;
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      // NOOP
    }; // END preDraw

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // | And to rotate the object.
    // +-------------------------------
    var stats = {
      mouseX: 0,
      mouseY: 0
    };
    // Add stats
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseX");
    uiStats.add("mouseY");
    new MouseHandler(pb.eventCatcher, "draw-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
    });

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext, POINT_SET_TYPES);

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
    pb.redraw();

    window.addEventListener("resize", function () {
      // updateCurrentBounds();
    });

    humane.log("Move the circles around.");
  });
})(globalThis);
