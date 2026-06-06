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
      iterations: params.getNumber("iterations", 5),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // Circle
    var circleA = null;
    var circleB = null;

    var updateCircleRadiusB = function () {
      circleB.radius = Math.abs(circleB.center.distance(circleA.center) - circleA.radius);
    };

    // +---------------------------------------------------------------------------------
    // | Creates a random circle that fits nicely into the viewport.
    // +-------------------------------
    circleA = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPoint = new Vertex(
      circleA.center.clone().addXY(circleA.radius * Math.sin(Math.PI / 4), circleA.radius * Math.cos(Math.PI / 4))
    );
    new CircleHelper(circleA, radiusPoint, pb);
    // circleB = createRandomCircle(pb.viewport);
    circleB = new Circle(appContext.pb.viewport().getScaled(0.666).randomPoint(), 100.0);
    circleB.center.listeners.addDragListener(function () {
      updateCircleRadiusB();
    });
    circleA.center.listeners.addDragListener(function () {
      updateCircleRadiusB();
    });
    radiusPoint.listeners.addDragListener(function () {
      updateCircleRadiusB();
    });
    updateCircleRadiusB();
    pb.add([circleA.center, radiusPoint, circleB.center]);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      drawAppolonianCircles(
        draw,
        fill,
        circleA,
        circleB,
        true, // draw helper elements
        0, // iteration
        appContext.config.circleRadius // desiredRadius
      );
    };

    var drawAppolonianCircles = function (draw, fill, circleA, circleB, drawHelperElements, iterationNumber, desiredRadius) {
      if (iterationNumber >= appContext.config.iterations) {
        return;
      }
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      // Find tangent line
      var connectLine = new Vector(circleA.center, circleB.center);

      var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
      var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
      var closestPointOnA = findClosestPoint(circleB.center, intersectionLineA.a, intersectionLineA.b);
      var closestPointOnB = findClosestPoint(circleA.center, intersectionLineB.a, intersectionLineB.b);

      // var circleDifference = closestPointOnA.difference(closestPointOnB);
      // var newCenterB = circleB.center.clone().sub(circleDifference);
      // var newCircleB = new Circle(newCenterB, circleB.radius);
      var perpVector = connectLine.perp().moveTo(closestPointOnA);

      // console.log("closestPointOnA", closestPointOnA);
      if (drawHelperElements) {
        draw.diamondHandle(closestPointOnA, 8, "orange");
        draw.diamondHandle(closestPointOnB, 8, "orange");

        draw.line(connectLine.a, connectLine.b, "grey", 1.0);
        draw.arrow(perpVector.a, perpVector.b, "orange", 1.0);

        fill.text("A", circleA.center.x + 5, circleA.center.y, { color: contrastColor });
        fill.text("B", circleB.center.x + 5, circleB.center.y, { color: contrastColor });
        // draw.circle(newCircleB.center, circleB.radius, "grey", 2.0, { dashArray: [5, 10] });
        draw.circle(circleB.center, circleB.radius, "rgba(0,192,192)", 3.0, { dashArray: [5, 10] });
      }

      // Draw containing circle
      var containingCircle = getContainingCircle(circleA, circleB);
      draw.circle(containingCircle.center, containingCircle.radius, "rgba(128,128,128, 0.25)", 1.0, { dashArray: [10, 10] });

      // Step 2: find attaching third circle.

      // [Circle,Circle] or null
      // var apollCircles = getApollonianCircles(circleA, circleB, appContext.config.circleRadius);
      var apollCircles = getApollonianCircles(circleA, circleB, desiredRadius);
      if (apollCircles) {
        // Left and right solutions?
        var hullRadiusA = circleA.radius + appContext.config.circleRadius;
        var hullRadiusB = circleB.radius + appContext.config.circleRadius;
        draw.circle(circleA.center, hullRadiusA, "rgba(128,128,128, 0.25)", 2.0);
        draw.circle(circleB.center, hullRadiusB, "rgba(128,128,128, 0.25)", 2.0);

        draw.circle(apollCircles[0].center, apollCircles[0].radius, "rgba(255,0,255)", 2.0);
        draw.circle(apollCircles[1].center, apollCircles[1].radius, "rgba(255,0,255)", 2.0);

        // Avoid endless recursion
        drawAppolonianCircles(draw, fill, circleB, apollCircles[0], drawHelperElements, iterationNumber + 1, desiredRadius - 10);
      }
    }; // END postDraw

    var getApollonianCircles = function (circleA, circleB, desiredRadius) {
      if (circleA) var hullA = new Circle(circleA.center, circleA.radius + desiredRadius);
      var hullB = new Circle(circleB.center, circleB.radius + desiredRadius);

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

    // TODO: put this to Circle class?
    var getContainingCircle = function (circleA, circleB) {
      var connectLine = new Vector(circleA.center, circleB.center);
      var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
      var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
      var farestPointOnA = findFarestPoint(circleB.center, intersectionLineA.a, intersectionLineA.b);
      var farestPointOnB = findFarestPoint(circleA.center, intersectionLineB.a, intersectionLineB.b);
      var totalDiagonalLine = new Line(farestPointOnA, farestPointOnB);
      var center = totalDiagonalLine.vertAt(0.5);
      return new Circle(center, center.distance(totalDiagonalLine.a));
    };

    // TODO: put this to geomutils?
    var findClosestPoint = function (referencePoint, pointA, pointB) {
      var distA = referencePoint.distance(pointA);
      var distB = referencePoint.distance(pointB);
      if (distA < distB) {
        return pointA;
      } else {
        return pointB;
      }
    };
    // var findClosestPoint = function (referencePoint, pointList) {
    //   // var distA = referencePoint.distance(pointA);
    //   // var distB = referencePoint.distance(pointB);
    //   // if (distA < distB) {
    //   //   return pointA;
    //   // } else {
    //   //   return pointB;
    //   // }
    //   // if( !pointList || pointList.length == 0 ) {
    //   //   return null;
    //   // }
    //   // return pointList.reduce( function(accu,item) {

    //   // },null);
    // };

    var findFarestPoint = function (referencePoint, pointA, pointB) {
      var distA = referencePoint.distance(pointA);
      var distB = referencePoint.distance(pointB);
      if (distA > distB) {
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
