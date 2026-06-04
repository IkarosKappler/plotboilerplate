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
      circleRadius: params.getNumber("circleRadius", 100),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // Array<Circle>
    // var circles = [];
    var circleA = null;
    var circleB = null;

    var handleCircleCenterMove = function () {
      // pb.redraw();
    };

    var createRandomCircle = function () {
      // var viewport = appContext.pb.viewport();
      // var center = viewport.randomPoint(0.333, 0.333);
      // var radius = Math.random() * viewport.getMinDimension() * 0.252525;
      // var circle = new Circle(center, radius);
      // circles.push(circle);
      // var radiusPoint = new Vertex(
      //   center.clone().addXY(circle.radius * Math.sin(Math.PI / 4), circle.radius * Math.cos(Math.PI / 4))
      // );
      // new CircleHelper(circle, radiusPoint, pb);

      // pb.add([circle, center, radiusPoint]);
      var circle = randomCircle(appContext.pb.viewport().getScaled(0.666));
      // circles.push(circle);
      var radiusPoint = new Vertex(
        circle.center.clone().addXY(circle.radius * Math.sin(Math.PI / 4), circle.radius * Math.cos(Math.PI / 4))
      );
      new CircleHelper(circle, radiusPoint, pb);

      // pb.add([circle, circle.center, radiusPoint]);
      pb.add([circle.center, radiusPoint]);

      return circle;
    };
    // addRandomCircle();
    // addRandomCircle();
    circleA = createRandomCircle(pb.viewport);
    circleB = createRandomCircle(pb.viewport);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      // Find tangent line
      // var circleA = circles[0];
      // var circleB = circles[1];
      var connectLine = new Vector(circleA.center, circleB.center);

      var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
      var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
      var closestPointOnA = findClosestPoint(circleB.center, intersectionLineA.a, intersectionLineA.b);
      var closestPointOnB = findClosestPoint(circleA.center, intersectionLineB.a, intersectionLineB.b);

      var connectionLineBetween = new Line(closestPointOnA, closestPointOnB);

      var circleDifference = closestPointOnA.difference(closestPointOnB);
      var newCenterB = circleB.center.clone().sub(circleDifference);
      var newCircleB = new Circle(newCenterB, circleB.radius);
      var perpVector = connectLine.perp().moveTo(closestPointOnA);

      // console.log("closestPointOnA", closestPointOnA);
      draw.diamondHandle(closestPointOnA, 8, "orange");
      draw.diamondHandle(closestPointOnB, 8, "orange");

      draw.line(connectLine.a, connectLine.b, "grey", 1.0);
      draw.arrow(perpVector.a, perpVector.b, "orange", 1.0);

      fill.text("A", circleA.center.x + 5, circleA.center.y, { color: contrastColor });
      fill.text("B", circleB.center.x + 5, circleB.center.y, { color: contrastColor });

      // draw.circle(newCircleB.center, circleB.radius, "grey", 2.0, { dashArray: [5, 10] });
      draw.circle(newCircleB.center, newCircleB.radius, "rgba(0,192,192)", 3.0, { dashArray: [5, 10] });

      // Step 2: find attaching third circle.

      // [Circle,Circle] or null
      // var apollCircles = getApollonianCircles(circleA, circleB, appContext.config.circleRadius);
      var apollCircles = getApollonianCircles(circleA, newCircleB, appContext.config.circleRadius);
      if (apollCircles) {
        var hullRadiusA = circleA.radius + appContext.config.circleRadius;
        var hullRadiusB = circleB.radius + appContext.config.circleRadius;
        draw.circle(circleA.center, hullRadiusA, "rgba(128,128,128, 0.25)", 2.0);
        draw.circle(circleB.center, hullRadiusB, "rgba(128,128,128, 0.25)", 2.0);

        draw.circle(apollCircles[0].center, apollCircles[0].radius, "rgba(255,0,255)", 2.0);
        draw.circle(apollCircles[1].center, apollCircles[1].radius, "rgba(255,0,255)", 2.0);
      }
    }; // END postDraw

    var getApollonianCircles = function (circleA, circleB, desiredRadius) {
      if (circleA) var hullA = new Circle(circleA.center, circleA.radius + desiredRadius);
      var hullB = new Circle(circleB.center, circleB.radius + desiredRadius);

      // draw.circle(hullA.center, hullA.radius, "rgba(128,128,128, 0.5)", 2.0);
      // draw.circle(hullB.center, hullB.radius, "rgba(128,128,128, 0.5)", 2.0);

      var radicalLine = hullA.circleIntersection(hullB);
      if (!radicalLine) {
        // Not possible, radius too small or one circle too small inside the other.
        return null;
      }

      var radicalClosestA = circleA.closestPoint(radicalLine.a);
      // var radicalClosestB = circleB.closestPoint(radicalLine.a);

      // This distance is the same as to radicalClosestB by construction :)
      var apollRadius = radicalLine.a.distance(radicalClosestA);
      var apollonianCircleA = new Circle(radicalLine.a, apollRadius);
      var apollonianCircleB = new Circle(radicalLine.b, apollRadius);

      // draw.circle(apollonianCircle.center, apollonianCircle.radius, "rgba(255,0,255)", 2.0);

      return [apollonianCircleA, apollonianCircleB];
    };

    var getContainingCircle = function (circleA, circleB) {};

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
      draw.circle(circleA.center, circleA.radius, "rgba(0,192,192)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "rgba(0,192,192)", 3.0);
      draw.circle(circleB.center, circleB.radius, "grey", 2.0, { dashArray: [10, 5] });
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
