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
    var containingCircle = null;

    var updateCircleRadiusB = function () {
      circleB.radius = Math.abs(circleB.center.distance(circleA.center) - circleA.radius);
    };

    var createRadiusPoint = function (circle) {
      return circle.vertAt(Math.PI / 4);
    };

    // +---------------------------------------------------------------------------------
    // | Creates a random circle that fits nicely into the viewport.
    // +-------------------------------
    circleA = randomCircle(appContext.pb.viewport().getScaled(0.666));
    // TODO: use createRadiusPoint here
    var radiusPoint = new Vertex(
      circleA.center.clone().addXY(circleA.radius * Math.sin(Math.PI / 4), circleA.radius * Math.cos(Math.PI / 4))
    );
    new CircleHelper(circleA, radiusPoint, pb);
    // circleB = createRandomCircle(pb.viewport);
    circleB = new Circle(appContext.pb.viewport().getScaled(0.666).randomPoint(), 100.0);
    circleB.center.listeners.addDragListener(function () {
      updateCircleRadiusB();
      updateContainingCircle();
    });
    circleA.center.listeners.addDragListener(function () {
      updateCircleRadiusB();
      updateContainingCircle();
    });
    radiusPoint.listeners.addDragListener(function () {
      updateCircleRadiusB();
      updateContainingCircle();
    });
    updateCircleRadiusB();
    containingCircle = getContainingCircle2(circleA, circleB);
    var containingCircle_radiusPoint = new Vertex(
      containingCircle.center
        .clone()
        .addXY(containingCircle.radius * Math.sin(Math.PI / 4), containingCircle.radius * Math.cos(Math.PI / 4))
    );
    new CircleHelper(containingCircle, containingCircle_radiusPoint, pb);

    pb.add([circleA.center, radiusPoint, circleB.center, containingCircle.center, containingCircle_radiusPoint]);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      // Draw containing circle
      // TODO: not working!

      // containingCircle = getContainingCircle2(circleA, circleB);

      drawAppolonianCircles(
        draw,
        fill,
        circleA,
        circleB,
        containingCircle,
        true, // draw helper elements
        0, // iteration
        appContext.config.circleRadius // desiredRadius
      );
    };

    var drawAppolonianCircles = function (
      draw,
      fill,
      circleA,
      circleB,
      containingCircle,
      drawHelperElements,
      iterationNumber,
      desiredRadius
    ) {
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

      // Move for one pixel
      var circleB_clone = circleB.clone();
      // leftCircleB.center.set(perpVector.vertAt(10 / perpVector.length()));
      // circleB_clone.radius -= 5;
      var containingCircle_clone = containingCircle.clone();
      var perpForContainingCircle = perpVector.clone().moveTo(containingCircle_clone.center);
      // containingCircle_clone.center.x += 5;
      // NOTE: The Apollonian calculation will fail if all three circles are co-linear!
      //       move the containing circle about -5 units (pixels) along the perpendicular.
      containingCircle_clone.center.set(perpForContainingCircle.vertAt(-5 / perpForContainingCircle.length()));
      // containingCircle_clone.radius += 1;

      draw.circle(containingCircle_clone.center, containingCircle_clone.radius, "rgba(128,128,128, 0.55)", 2.0, {
        dashArray: [10, 10]
      });

      // console.log("closestPointOnA", closestPointOnA);
      if (drawHelperElements) {
        draw.diamondHandle(closestPointOnA, 8, "orange");
        draw.diamondHandle(closestPointOnB, 8, "orange");

        draw.line(connectLine.a, connectLine.b, "grey", 1.0);
        draw.arrow(perpVector.a, perpVector.b, "orange", 1.0);

        fill.text("A", circleA.center.x + 5, circleA.center.y, { color: contrastColor });
        fill.text("B", circleB_clone.center.x + 5, circleB_clone.center.y, { color: contrastColor });
        // draw.circle(newCircleB.center, circleB.radius, "grey", 2.0, { dashArray: [5, 10] });
        draw.circle(circleB_clone.center, circleB_clone.radius, "rgb(0,192,192)", 3.0, { dashArray: [10, 5] });
      }

      // Step 2: find attaching third circle.
      // The Apollonian circle solution will not be unque if circles are co-linear!
      var perpVector = connectLine.perp().moveTo(closestPointOnA);

      var apollonianCircle = solveApollonius3(containingCircle_clone, circleA.clone(), circleB_clone, true, false, false);
      console.log("apollonianCircle", apollonianCircle);
      draw.circle(apollonianCircle.center, apollonianCircle.radius, "rgba(255,0,255)", 2.0);
    }; // END postDraw

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

    var updateContainingCircle = function () {
      var tmp_containingCircle = getContainingCircle2(circleA, circleB);
      containingCircle.center.set(tmp_containingCircle.center);
      containingCircle.radius = tmp_containingCircle.radius;
      containingCircle_radiusPoint.set(
        containingCircle.center
          .clone()
          .addXY(containingCircle.radius * Math.sin(Math.PI / 4), containingCircle.radius * Math.cos(Math.PI / 4))
      );
    };
    updateContainingCircle();

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      draw.circle(circleA.center, circleA.radius, "rgba(0,192,192)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "rgba(0,192,192)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "grey", 2.0, { dashArray: [10, 5] });
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
