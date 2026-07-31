/**
 * A script for generating power center and power circle of three given circles.
 *
 * @author   Ikaros Kappler
 * @date     2026-07-31
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
    var circleC = null;
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

    circleC = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPointC = createRadiusPoint(circleC);
    new CircleHelper(circleC, radiusPointC, pb);

    pb.add([circleA.center, radiusPointA, circleB.center, radiusPointB, circleC.center, radiusPointC]);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var calculatedRadicalAxis = circleA.radicalAxis(circleB);
      // draw.line(calculatedRadicalAxis.a, calculatedRadicalAxis.b, rgba(128, 128, 128, 0.5), 7);
      makePowerCircle(draw, fill);
    };

    // +---------------------------------------------------------------------------------
    // | Calculate the Power Center and Power Circle.
    // +-------------------------------
    var makePowerCircle = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      var radicalAxisAB = circleA.radicalAxis(circleB);
      var radicalAxisBC = circleB.radicalAxis(circleC);
      var radicalAxisCA = circleC.radicalAxis(circleA);

      draw.line(radicalAxisAB.a, radicalAxisAB.b, rgba(128, 128, 128, 0.5), 7);
      draw.line(radicalAxisBC.a, radicalAxisBC.b, rgba(128, 128, 128, 0.5), 7);
      draw.line(radicalAxisCA.a, radicalAxisCA.b, rgba(128, 128, 128, 0.5), 7);

      var powerCenter = radicalAxisAB.intersection(radicalAxisBC);
      draw.diamondHandle(powerCenter, 13, "magenta");

      var powerCircle = new Circle(powerCenter, powerCenter.distance(circleA.center));
      draw.circle(powerCircle.center, powerCircle.radius, "rgba(192,192,192,0.5)", 3.0);
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      draw.circle(circleA.center, circleA.radius, "rgba(0,192,192,1.0)", 3.0);
      draw.circle(circleB.center, circleB.radius, "rgba(0,192,192,1.0)", 3.0);
      draw.circle(circleC.center, circleC.radius, "rgba(0,192,192,1.0)", 3.0);
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
    // updateHelperCircle();
    pb.redraw();
    humane.log("Move the circles around.");
  });
})(globalThis);
