/**
 * A script for generating radical axis of two given circles.
 *
 * @author   Ikaros Kappler
 * @date     2026-07-28
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

    // Create a config: we want to have control about the arrow head size in this demo
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, {
      // colorCenterConnectLine: params.getString("colorCenterConnectLine", "#0048e0"),
      // colorRadiusConnectLine: params.getString("colorRadiusConnectLine", "#00e048"),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var circleA = null;
    var circleB = null;
    var helperCircle = null;

    var createRadiusPoint = function (circle) {
      return circle.vertAt(Math.PI / 4);
    };

    // +---------------------------------------------------------------------------------
    // | Creates a random circle that fits nicely into the viewport.
    // +-------------------------------
    circleA = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPointA = createRadiusPoint(circleA);
    new CircleHelper(circleA, radiusPointA, pb);

    circleB = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPointB = createRadiusPoint(circleB);
    new CircleHelper(circleB, radiusPointB, pb);

    helperCircle = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var helperCircleRadiusPoint = createRadiusPoint(helperCircle);
    new CircleHelper(helperCircle, helperCircleRadiusPoint, pb);

    pb.add([circleA.center, radiusPointA, circleB.center, radiusPointB, helperCircle.center, helperCircleRadiusPoint]);

    var updateHelperCircle = function () {
      var tmpHelperCircle = Circle.circleUtils.createRadicalAxisHelperCircle(circleA, circleB);
      helperCircle.center.set(tmpHelperCircle.center);
      helperCircle.radius = tmpHelperCircle.radius;

      helperCircleRadiusPoint.set(createRadiusPoint(helperCircle));
    };

    // +---------------------------------------------------------------------------------
    // |Install circle listeners.
    // +-------------------------------
    circleA.center.listeners.addDragListener(function () {
      updateHelperCircle();
    });
    radiusPointA.listeners.addDragListener(function () {
      updateHelperCircle();
    });
    circleB.center.listeners.addDragListener(function () {
      updateHelperCircle();
    });
    radiusPointB.listeners.addDragListener(function () {
      updateHelperCircle();
    });

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var calculatedRadicalAxis = circleA.radicalAxis(circleB);
      draw.line(calculatedRadicalAxis.a, calculatedRadicalAxis.b, rgba(128, 128, 128, 0.5), 7);
      makeRadicalLine(draw, fill);
    };

    // +---------------------------------------------------------------------------------
    // | Note: the algorithm in this method is implemented in the `Circle.radicalAxis` method.
    // |
    // | Calculating the radical line:
    // |  * the helper circle is positioned in a way that it always intersects both
    // |    circles in two points.
    // |  * Each pair onf intersection points defines line with length > 1.
    // |  * By construction these lines intersect (are not parallel).
    // |  * The intersection point of both lines is located ON the radical axis.
    // |  * By this we can construct the Radical Axis as a perpendicular from the
    // |    connecting center line.
    // |  * To find a _beautiful_ Racical Axis we use the radical line from the circle
    // |    intersection if it is longer.
    // +-------------------------------
    var makeRadicalLine = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      var intersectionLineA = circleA.circleIntersection(helperCircle);
      var intersectionLineB = circleB.circleIntersection(helperCircle);

      if (intersectionLineA) {
        draw.diamondHandle(intersectionLineA.a, 13, "magenta");
        draw.diamondHandle(intersectionLineA.b, 13, "magenta");
      }

      if (intersectionLineB) {
        draw.diamondHandle(intersectionLineB.a, 13, "magenta");
        draw.diamondHandle(intersectionLineB.b, 13, "magenta");
      }

      if (intersectionLineA && intersectionLineB) {
        var lineA = new Line(intersectionLineA.a, intersectionLineA.b);
        var lineB = new Line(intersectionLineB.a, intersectionLineB.b);
        draw.line(lineA.a, lineA.b, rgba(192, 0, 192, 1.0), 1);
        draw.line(lineB.a, lineB.b, rgba(192, 0, 192, 1.0), 1);

        var firstRadicalAxisPoint = lineA.intersection(lineB);
        draw.diamondHandle(firstRadicalAxisPoint, 13, "orange");

        var centerConnectLine = new Line(circleA.center, circleB.center);
        draw.line(centerConnectLine.a, centerConnectLine.b, rgba(192, 0, 192, 1.0), 1, { dashArray: [10, 15] });

        var secondRadicalAxisPoint = centerConnectLine.getClosestPoint(firstRadicalAxisPoint);
        draw.diamondHandle(firstRadicalAxisPoint, 13, "orange");

        // draw.line(firstRadicalAxisPoint, secondRadicalAxisPoint, rgba(255, 0, 255, 1.0), 1, { dashArray: [10, 15] });
        // Create a mirrored version of the second radical axis point so both are located
        // symmetrical from the circle connect point.
        // (currently the second point is located ON the connect line)
        var secondRadicalAxisPoint_mirrored = secondRadicalAxisPoint.clone().scale(2.0, firstRadicalAxisPoint);
        draw.diamondHandle(secondRadicalAxisPoint_mirrored, 13, "orange");

        var radicalAxis = new Line(firstRadicalAxisPoint, secondRadicalAxisPoint_mirrored);
        var intersection = circleA.circleIntersection(circleB);
        if (intersection) {
          // console.log(intersection.length(), radicalAxis.length());
          draw.diamondHandle(intersection.a, 13, "cyan");
          draw.diamondHandle(intersection.b, 13, "cyan");
        }
        var result = intersection && intersection.length() > radicalAxis.length() ? intersection : radicalAxis;

        draw.line(result.a, result.b, rgba(255, 0, 255, 1.0), 2, { dashArray: [10, 10] });
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      draw.circle(circleA.center, circleA.radius, "rgba(0,192,192,1.0)", 3.0);
      draw.circle(circleB.center, circleB.radius, "rgba(0,192,192,1.0)", 3.0);
      // draw.circle(circleC.center, circleC.radius, "rgba(0,192,192,1.0)", 3.0);
      draw.circle(helperCircle.center, helperCircle.radius, "rgba(192,192,192,0.5)", 3.0);
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
    updateHelperCircle();
    pb.redraw();
    // appContext.onTwoCircleSettingChanged(); // This will trigger a redraw
    humane.log("Move the circles around.");
  });
})(globalThis);
