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
      angleStepDeg: params.getNumber("angleStepDeg", 12.0),
      stepInRadians: params.getNumber("stepInRadians", 60.0),
      radiusStep: params.getNumber("radiusStep", 5.0),
      circleRadius: params.getNumber("circleRadius", 8.0),
      iterations: params.getNumber("iterations", 100),
      arcThreshold: params.getNumber("arcThreshold", 0.666),
      showSpiralTangents: params.getBoolean("showSpiralTangents", false),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var center = new Vertex(0, 0);
    var pathData = [];

    var createCircleArc = function (draw, fill, startPoint, midPoint, endPoint, lastIsPrime, curIsPrime, buffer) {
      var controlValue = appContext.config.arcThreshold; // 0.333;
      // var midPoint = startPoint.clone().rotate(angleStep / 2.0);
      var lineA = new Line(startPoint, midPoint);
      var lineB = new Line(midPoint, endPoint);
      var conrolPointA = lineA.vertAt(controlValue);
      var conrolPointB = lineB.vertAt(1.0 - controlValue);
      // if (appContext.config.showSpiralTangents) {
      //   draw.line(startPoint, conrolPointA, "grey", 2.0);
      //   draw.line(endPoint, conrolPointB, "grey", 2.0);
      // }
      var cubicBCurve = new CubicBezierCurve(startPoint, endPoint, conrolPointA, conrolPointB);
      if (lastIsPrime) {
        console.log("Trim start");
        cubicBCurve = cubicBCurve.trimStart(appContext.config.circleRadius);
      }
      if (curIsPrime) {
        console.log("Trim end");
        cubicBCurve = cubicBCurve.trimEnd(appContext.config.circleRadius);
      }
      if (appContext.config.showSpiralTangents) {
        draw.line(cubicBCurve.startPoint, cubicBCurve.startControlPoint, "grey", 2.0);
        draw.line(cubicBCurve.endPoint, cubicBCurve.endControlPoint, "grey", 2.0);
      }
      // buffer.push("C", conrolPointA.x, conrolPointA.y, conrolPointB.x, conrolPointB.y, endPoint.x, endPoint.y);
      if (lastIsPrime) {
        buffer.push("M", cubicBCurve.startPoint.x, cubicBCurve.startPoint.y);
      }
      buffer.push(
        "C",
        cubicBCurve.startControlPoint.x,
        cubicBCurve.startControlPoint.y,
        cubicBCurve.endControlPoint.x,
        cubicBCurve.endControlPoint.y,
        cubicBCurve.endPoint.x,
        cubicBCurve.endPoint.y
      );
      // if (lastIsPrime) {
      //   buffer.push("M", cubicBCurve.startPoint.x, cubicBCurve.startPoint.x);
      // }
      return cubicBCurve;
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

      var circleRadius = appContext.config.circleRadius;
      var angle = 0.0;
      var steps = appContext.config.iterations;
      var angleStep = appContext.config.angleStepDeg * DEG_TO_RAD;

      pathData = ["M", 0, 0];

      var pos, lastPos;
      var midPoint = null;
      var curIsPrime = false;
      var lastIsPrime = false;
      var curAngle = 0.0;
      for (var i = 1; i <= steps; i++) {
        curIsPrime = isPrime(i);
        // midPoint = center.clone();
        // midPoint.x = (angle + angleStep / 2.0) * 1.005 * appContext.config.radiusStep;
        // midPoint.rotate(angle + angleStep / 2.0);
        // angle += angleStep;
        // pos = makeSpiralPoint(angle);
        var result = makeEquidistSpiralPoint(i, curAngle);
        pos = result[0];
        curAngle = result[1];

        pathData.push("L", pos.x, pos.y);

        if (curIsPrime) {
          draw.circle(pos, circleRadius, "orange", 1.0);
        }

        // Move to next position
        lastPos = pos;
        lastIsPrime = curIsPrime;
      }

      // inplace=true, because we can drop the path data afterwards
      draw.path(pathData, "orange", 1.0, { inplace: true });
    };

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var _postDraw = function (draw, fill) {
      // draw.line(calculatedRadicalAxis.a, calculatedRadicalAxis.b, rgba(128, 128, 128, 0.5), 7);
      // makePowerCircle(draw, fill);

      var circleRadius = appContext.config.circleRadius;
      var angle = 0.0;
      var steps = appContext.config.iterations;
      var angleStep = appContext.config.angleStepDeg * DEG_TO_RAD;

      pathData = ["M", 0, 0];

      // var pos = new Vertex(0, 0);
      var pos = center.clone();
      pos.x = angleStep * appContext.config.radiusStep;
      pos.rotate(angle);
      var lastPos = center.clone();
      // var nextPos = center.clone();
      // nextPos.x = angleStep * 2 * appContext.config.radiusStep;
      // nextPos.rotate(angle);
      var midPoint = null;
      var curIsPrime = false;
      var lastIsPrime = false;
      for (var i = 0; i < steps; i++) {
        curIsPrime = isPrime(i);
        midPoint = center.clone();
        midPoint.x = (angle + angleStep / 2.0) * 1.005 * appContext.config.radiusStep;
        midPoint.rotate(angle + angleStep / 2.0);
        angle += angleStep;
        pos = makeSpiralPoint(angle);

        // pathData.push("L", pos.x, pos.y);
        var segmentbCurve = createCircleArc(draw, fill, lastPos, midPoint, pos, lastIsPrime, curIsPrime, pathData);

        // if (curIsPrime) {
        //   // Add a circle to the path
        //   // prettier-ignore
        //   pathData.push(  "M",
        //     pos.x, // cx
        //     pos.y, // cy
        //     "m", circleRadius, 0,
        //     "a", circleRadius,circleRadius, 0, 1, 0, -(circleRadius * 2), 0,
        //     "a", circleRadius,circleRadius, 0, 1, 0,  (circleRadius * 2), 0
        //     );
        //   // pathData.push("M", pos.x, pos.y);
        //   pathData.push("M", segmentbCurve.endPoint.x, segmentbCurve.endPoint.y);
        // }

        if (curIsPrime) {
          console.log("curIsPrime, draw circl", i);
          // Add a circle to the path
          // prettier-ignore
          draw.circle( pos, circleRadius, 'orange', 1.0);
          // pathData.push("M", segmentbCurve.endPoint.x, segmentbCurve.endPoint.y);
        }
        // if (lastIsPrime) {
        //   pathData.push("M", segmentbCurve.endPoint.x, segmentbCurve.endPoint.y);
        // }

        // Move to next position
        lastPos = pos;
        lastIsPrime = curIsPrime;
      }

      // inplace=true, because we can drop the path data afterwards
      draw.path(pathData, "orange", 1.0, { inplace: true });
    };

    var makeSpiralPoint = function (angle) {
      var spiralPoint = center.clone();
      spiralPoint.x = angle * appContext.config.radiusStep;
      spiralPoint.rotate(angle);
      return spiralPoint;
    };

    var makeEquidistSpiralPoint = function (iterationNumber, curAngle) {
      // var angleStepDeg = appContext.config.angleStepDeg;
      // const stepInRadians = 60.0; // px
      const stepInRadians = appContext.config.stepInRadians;
      var curRadius = iterationNumber * appContext.config.radiusStep;
      var angle = stepInRadians / curRadius;
      var spiralPoint = center.clone();
      spiralPoint.x = curRadius;
      spiralPoint.rotate(curAngle + angle);
      console.log(
        "stepInRadians",
        stepInRadians,
        "appContext.config.radiusStep",
        appContext.config.radiusStep,
        "curRadius",
        curRadius,
        "curAngle",
        curAngle,
        "angle",
        angle,
        "spiralPoint",
        spiralPoint
      );
      return [spiralPoint, curAngle + angle];
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
    humane.log("Chose from different sytles of Ulam spirals.");
  });
})(globalThis);
