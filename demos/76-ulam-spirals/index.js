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
    var SPIRAL_TYPES = ["Ulam", "Archimedean-Sack"];
    var appContext = new AppContext(pb, {
      startingNumber: params.getNumber("startingNumber", 1),
      angleStepDeg: params.getNumber("angleStepDeg", 90.0),
      stepInUnits: params.getNumber("stepInUnits", 60.0),
      ulamRadiusStep: params.getNumber("ulamRadiusStep", 18.0),
      circleRadius: params.getNumber("circleRadius", 6.0),
      iterations: params.getNumber("iterations", 100),
      arcThreshold: params.getNumber("arcThreshold", 0.312), // 0.41), // 0.157),
      showSpiralTangents: params.getBoolean("showSpiralTangents", false),
      trimSpiralSegments: params.getBoolean("trimSpiralSegments", true),
      spiralType: params.getString("spiralType", SPIRAL_TYPES[1]),
      lineColorSpiral: params.getString("lineColorSpiral", "#3584e4"),
      lineWidthSpiral: params.getNumber("lineWidthPiral", 1.0),
      spiralLinearSegments: params.getBoolean("spiralLinearSegments", false),
      lineColorPrimeMarker: params.getString("lineColorPrimeMarker", "#ff8800"),
      lineWidthPrimeMarker: params.getNumber("lineWidthPrimeMarker", 1.0),

      showSpiralPath: params.getBoolean("showSpiralPath", true),
      showAllNumbers: params.getBoolean("showAllNumbers", false),
      showSpiralBezierHandles: params.getBoolean("showSpiralBezierHandles", false),
      showSpiralBezierControlsPoints: params.getBoolean("showSpiralBezierControlsPoints", false),
      showPrimeLabel: params.getBoolean("showPrimeLabel", true),
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
      if (appContext.config.spiralType == "Ulam") {
        // TODO
        drawUlamSpiral(draw, fill);
      } else if (appContext.config.spiralType == "Archimedean-Sack") {
        drawRoundEquidistantSpiral(draw, fill);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the Ulam spiral.
    // +-------------------------------
    var drawUlamSpiral = function (draw, fill) {
      var discretePosition = new Vertex(0, 0);
      var discreteDirection = new Vertex(1, 0);
      var discreteMin = new Vertex(0, 0);
      var discreteMax = new Vertex(0, 0);
      var lastWasPrime = false;

      var pathData = ["M", 0, 0];
      var stepSize = appContext.config.ulamRadiusStep;

      var line = new Line(new Vertex(), new Vertex());

      for (var i = 0; i <= appContext.config.iterations; i++) {
        var naturalNumber = appContext.config.startingNumber + i + 1;
        var curIsPrime = isPrime(naturalNumber);
        var nextDiscretePos = getNextUlamPosition(discretePosition, discreteDirection, discreteMin, discreteMax);
        // Convert discrete position to pixels.
        var curPos = discretePosition.clone().scale(stepSize);
        var nextPos = nextDiscretePos.clone().scale(stepSize);
        line.a = curPos;
        line.b = nextPos;

        // var line = new Line(pos, nextPos);
        if (appContext.config.trimSpiralSegments && (lastWasPrime || curIsPrime)) {
          shortenLinearConnection(line, lastWasPrime, curIsPrime);
          pathData.push("M", line.a.x, line.a.y);
        }

        pathData.push("L", line.b.x, line.b.y);
        // draw.line(pos, nextPos, "grey", 3.0);

        if (curIsPrime) {
          drawPrimeMarker(draw, fill, nextPos, naturalNumber);
        } else if (appContext.config.showAllNumbers) {
          draw.circle(nextPos, 3, "red", 1);
        }

        discretePosition = nextDiscretePos;
        lastWasPrime = curIsPrime;
      }

      if (appContext.config.showSpiralPath) {
        draw.path(pathData, appContext.config.lineColorSpiral, appContext.config.lineWidthSpiral, { inplace: true });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw an equidistant spiral.
    // +-------------------------------
    var drawRoundEquidistantSpiral = function (draw, fill) {
      // var circleRadius = appContext.config.circleRadius;
      var angle = 0.0;
      var steps = appContext.config.iterations;
      var angleStep = appContext.config.angleStepDeg * DEG_TO_RAD;
      // var radiusStep = appContext.config.radiusStep;

      pathData = ["M", 0, 0];

      var curRadius = appContext.config.stepInUnits; // Make sure the first arc fits into the first circle/radius
      var lastRadius = appContext.config.stepInUnits; // 0.0;
      var curAngle = 0.0, // (Math.PI / 4) * 3, // 0.0,
        lastAngle = 0.0; // (Math.PI / 4) * 2; // 0.0;
      var helperCircle = new Circle(new Vertex(0, 0), curRadius);
      var curPos,
        lastPos = helperCircle.vertAt(curAngle); // new Vertex(0, 0);
      var curTangentVec,
        lastTangentVec = helperCircle.tangentAt(curAngle);
      var midPoint = null;
      var curIsPrime = false;
      var lastWasPrime = false;
      var line = new Line(new Vertex(), new Vertex());
      for (var i = 0; i < steps; i++) {
        var naturalNumber = appContext.config.startingNumber + i + 1;
        curIsPrime = isPrime(naturalNumber);
        var result = makeEquidistSpiralPoint(i + 1, curAngle, curRadius);
        curPos = result[0];
        curAngle = result[1];
        curRadius = result[2];
        var intersection = helperCircle
          .setRadius(lastRadius + (curRadius - lastRadius) / 0.6)
          .vertAt(lastAngle + (curAngle - lastAngle) / 2.0);
        helperCircle.radius = curRadius;
        curTangentVec = helperCircle.tangentAt(curAngle);

        if (appContext.config.showSpiralBezierControlsPoints) {
          draw.diamondHandle(intersection, 1.0, "cyan");
        }
        var controlLineA = new Line(lastPos, intersection).trimEndAt(appContext.config.arcThreshold); // 0.166);
        var controlLineB = new Line(curPos, intersection).trimEndAt(appContext.config.arcThreshold);

        line.a = lastPos.clone();
        line.b = curPos.clone();

        // draw.handleLine(controlLineA.a, controlLineA.b);
        // draw.handleLine(controlLineB.a, controlLineB.b);

        var bezierSector = new CubicBezierCurve(line.a.clone(), line.b.clone(), controlLineA.b.clone(), controlLineB.b.clone());

        // var line = new Line(pos, nextPos);
        if (appContext.config.trimSpiralSegments && (lastWasPrime || curIsPrime)) {
          if (appContext.config.spiralLinearSegments) {
            shortenLinearConnection(line, lastWasPrime, curIsPrime);
            pathData.push("M", line.a.x, line.a.y);
          } else {
            shortenBezierConnection(bezierSector, lastWasPrime, curIsPrime);
            if (lastWasPrime) {
              pathData.push("M", bezierSector.startPoint.x, bezierSector.startPoint.y);
            }
          }
        }

        // draw.handleLine(bezierSector.startPoint, bezierSector.startControlPoint);
        // draw.handleLine(bezierSector.endPoint, bezierSector.endControlPoint);
        if (appContext.config.showSpiralBezierHandles) {
          draw.handleLine(line.a, controlLineA.b);
          draw.handleLine(line.b, controlLineB.b);
        }

        if (appContext.config.spiralLinearSegments) {
          pathData.push("L", line.b.x, line.b.y);
        } else {
          // pathData.push("C", intersection.x, intersection.y, intersection.x, intersection.y, line.b.x, line.b.y);
          // pathData.push("C", controlLineA.b.x, controlLineA.b.y, controlLineB.b.x, controlLineB.b.y, line.b.x, line.b.y);
          pathData.push(
            "C",
            bezierSector.startControlPoint.x,
            bezierSector.startControlPoint.y,
            bezierSector.endControlPoint.x,
            bezierSector.endControlPoint.y,
            bezierSector.endPoint.x,
            bezierSector.endPoint.y
          );
        }

        // pathData.push("L", curPos.x, curPos.y);

        if (curIsPrime) {
          // draw.circle(pos, circleRadius, "orange", 1.0);
          drawPrimeMarker(draw, fill, curPos, naturalNumber);
        } else if (appContext.config.showAllNumbers) {
          draw.circle(curPos, 3, "red", 1);
        }

        // Move to next position
        lastPos = curPos;
        lastWasPrime = curIsPrime;
        lastTangentVec = curTangentVec;
        lastAngle = curAngle;
        lastRadius = curRadius;
      }

      // inplace=true, because we can drop the path data afterwards
      if (appContext.config.showSpiralPath) {
        draw.path(pathData, appContext.config.lineColorSpiral, appContext.config.lineWidthSpiral, { inplace: true });
      }
    };

    var drawPrimeMarker = function (draw, fill, position, primeNumber) {
      // var circleRadius = appContext.config.circleRadius;
      draw.circle(
        position,
        appContext.config.circleRadius,
        appContext.config.lineColorPrimeMarker,
        appContext.config.lineWidthPrimeMarker
      );
      if (appContext.config.showPrimeLabel) {
        fill.text("" + primeNumber, position.x, position.y, {
          // options
          color: appContext.config.lineColorPrimeMarker,
          // fontFamily?: string;
          fontSize: 7, // number;
          // fontStyle?: FontStyle;
          // fontWeight?: FontWeight;
          lineHeight: 4, // number;
          textAlign: "center" // CanvasRenderingContext2D["textAlign"];
          // rotation?: number;
        });
      }
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
      pos.x = angleStep * appContext.config.ulamRadiusStep;
      pos.rotate(angle);
      var lastPos = center.clone();
      // var nextPos = center.clone();
      // nextPos.x = angleStep * 2 * appContext.config.ulamRadiusStep;
      // nextPos.rotate(angle);
      var midPoint = null;
      var curIsPrime = false;
      var lastIsPrime = false;
      for (var i = 0; i < steps; i++) {
        curIsPrime = isPrime(i);
        midPoint = center.clone();
        midPoint.x = (angle + angleStep / 2.0) * 1.005 * appContext.config.ulamRadiusStep;
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
          console.log("curIsPrime, draw circle", i);
          // Add a circle to the path
          // prettier-ignore
          draw.circle( pos, circleRadius, 'orange', 1.0);
          // pathData.push("M", segmentbCurve.endPoint.x, segmentbCurve.endPoint.y);
        } else if (appContext.config.showAllNumbers) {
          draw.circle(pos, 3, "red", 1);
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

    var getNextUlamPosition = function (position, curDirection, minDiscrete, maxDiscrete) {
      var newPosition = position.clone().add(curDirection);
      if (newPosition.x > maxDiscrete.x) {
        // Right bound reached -> continue top
        curDirection.x = 0;
        curDirection.y = -1;
        maxDiscrete.x = newPosition.x;
      } else if (newPosition.y < minDiscrete.y) {
        // Upper bound reached -> continue left
        curDirection.x = -1;
        curDirection.y = 0;
        minDiscrete.y = newPosition.y;
      } else if (newPosition.x < minDiscrete.x) {
        // Left bound reached -> continue down
        curDirection.x = 0;
        curDirection.y = 1;
        minDiscrete.x = newPosition.x;
      } else if (newPosition.y > maxDiscrete.y) {
        // Lower bound reached -> continue right
        curDirection.x = 1;
        curDirection.y = 0;
        maxDiscrete.y = newPosition.y;
      }
      return newPosition;
    };

    var shortenLinearConnection = function (line, isTrimStart, isTrimEnd) {
      if (isTrimStart) {
        line.trimStart(appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x);
      }
      if (isTrimEnd) {
        line.trimEnd(appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x);
      }
    };

    var shortenBezierConnection = function (bezierCurve, isTrimStart, isTrimEnd) {
      // if (isTrimStart) {
      //   bezierCurve.trimStart(appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x);
      // }
      // if (isTrimEnd) {
      //   bezierCurve.trimEnd(appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x);
      // }
      var cutOffAmount = appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x;
      if (isTrimStart && !isTrimEnd) {
        bezierCurve.trimStart(cutOffAmount);
      } else if (!isTrimStart && isTrimEnd) {
        bezierCurve.trimEnd(bezierCurve.arcLength - cutOffAmount);
      } else if (isTrimStart && isTrimEnd) {
        bezierCurve.trimStartEnd(cutOffAmount, bezierCurve.arcLength - cutOffAmount);
      }
    };

    var makeSpiralPoint = function (angle) {
      var spiralPoint = center.clone();
      spiralPoint.x = angle * appContext.config.ulamRadiusStep;
      spiralPoint.rotate(angle);
      return spiralPoint;
    };

    var makeEquidistSpiralPoint = function (iterationNumber, curAngle, curRadius) {
      // var angleStepDeg = appContext.config.angleStepDeg;
      // const stepInRadians = 60.0; // px
      const stepInUnits = appContext.config.stepInUnits;
      // const radiusStep = appContext.config.ulamRadiusStep;
      const angleStepRad = appContext.config.angleStepDeg * DEG_TO_RAD;
      // var curRadius = iterationNumber * appContext.config.ulamRadiusStep;
      var angle = Circle.circleUtils.sectorAngleByArcLength(stepInUnits, curRadius);
      // var nextRadius = curRadius + stepInUnits * (angle / (Math.PI * 2));
      // var nextRadius = curRadius + stepInUnits * (((angle / appContext.config.angleStepDeg) * DEG_TO_RAD) / (Math.PI * 2));
      // var nextRadius = curRadius + angleStepRad * (angle / (Math.PI * 2));
      // var nextRadius = curRadius + stepInUnits * (angle / angleStepRad / (Math.PI * 2));
      var nextRadius = curRadius + stepInUnits * (angle / angleStepRad / (Math.PI * 2));

      // var curRadius = Math.log(1 + 2 * iterationNumber) * appContext.config.ulamRadiusStep;
      // var angle = stepInUnits / curRadius;
      var spiralPoint = center.clone();
      spiralPoint.x = nextRadius;
      spiralPoint.rotate(curAngle - angle);
      // if (iterationNumber < 10) {
      //   console.log(
      //     "iterationNumber",
      //     iterationNumber,
      //     "Math.log(iterationNumber)",
      //     Math.log(iterationNumber),
      //     "stepInUnits",
      //     stepInUnits,
      //     "appContext.config.ulamRadiusStep",
      //     appContext.config.ulamRadiusStep,
      //     "curRadius",
      //     nextRadius,
      //     "curAngle",
      //     curAngle,
      //     "angle",
      //     angle,
      //     "spiralPoint",
      //     spiralPoint
      //   );
      // }
      return [spiralPoint, curAngle - angle, nextRadius];
    };

    // function isPrime(num) {
    //   if (num <= 1) return false; // Not prime
    //   if (num === 2) return true; // 2 is prime
    //   if (num % 2 === 0) return false; // Even numbers > 2 are not prime

    //   for (let i = 3; i <= Math.sqrt(num); i += 2) {
    //     if (num % i === 0) {
    //       return false;
    //     }
    //   }
    //   return true;
    // }

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
    initDemoUI(appContext, SPIRAL_TYPES);

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
