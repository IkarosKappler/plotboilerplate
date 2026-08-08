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
    var DEG_TO_RAD = Math.PI / 180.0;
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
      angleStepDeg: params.getNumber("angleStepDeg", 8.0),
      radiusStep: params.getNumber("radiusStep", 5.0),
      iterations: params.getNumber("iterations", 100),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var pathData = [];

    var createCircleErc = function (start, end, radius) {
      var controlA = start.clone();
      var controlB = end.clone();
    };

    // +---------------------------------------------------------------------------------
    // | Creates a random circle that fits nicely into the viewport.
    // +-------------------------------
    // ...

    // pb.add([circleA.center, radiusPointA, circleB.center, radiusPointB, circleC.center, radiusPointC]);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      // draw.line(calculatedRadicalAxis.a, calculatedRadicalAxis.b, rgba(128, 128, 128, 0.5), 7);
      // makePowerCircle(draw, fill);

      var center = new Vertex(0, 0);
      var radius = 0.0;
      var angle = 0.0;
      var pos = new Vertex(0, 0);
      var steps = appContext.config.iterations;

      pathData = ["M", 0, 0];

      for (var i = 0; i < steps; i++) {
        var pos = center.clone();
        angle += appContext.config.angleStepDeg * DEG_TO_RAD;
        pos.x = angle * appContext.config.radiusStep;
        pos.rotate(angle);

        pathData.push("L", pos.x, pos.y);

        if (isPrime(i)) {
          draw.circle(pos, 5.0, "orange", 2);
        }
      }

      // inplace=true, because we can drop the path data afterwards
      draw.path(pathData, "orange", 1.0, { inplace: true });
    };

    function isPrime(num) {
      if (num <= 1) return false; // Not prime
      if (num === 2) return true; // 2 is prime
      if (num % 2 === 0) return false; // Even numbers > 2 are not prime

      for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    }

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      // draw.circle(circleA.center, circleA.radius, "rgba(0,192,192,1.0)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "rgba(0,192,192,1.0)", 3.0);
      // draw.circle(circleC.center, circleC.radius, "rgba(0,192,192,1.0)", 3.0);
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
