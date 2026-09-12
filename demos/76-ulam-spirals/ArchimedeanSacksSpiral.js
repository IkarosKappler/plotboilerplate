"use strict";

/**
 * Construct Archemedean-Sacks spirals.
 *
 * @author  Ikaros Kappler
 * @date    2026-09-10
 * @version 1.0.0
 */

(function (_context) {
  var DEG_TO_RAD = Math.PI / 180.0;

  _context.ArchimedeanSacksSpiral = function (appContext, pb) {
    this.appContext = appContext;
    this.pb = pb;
    this.center = new Vertex(0, 0);
  };

  // +---------------------------------------------------------------------------------
  // | Draw an equidistant spiral.
  // +-------------------------------
  _context.ArchimedeanSacksSpiral.prototype.draw = function (draw, fill) {
    // var circleRadius = appContext.config.circleRadius;
    var angle = 0.0;
    var steps = this.appContext.config.iterations;
    var angleStep = this.appContext.config.angleStepDeg * DEG_TO_RAD;
    // var radiusStep = appContext.config.radiusStep;

    var curRadius = this.appContext.config.stepInUnits; // Make sure the first arc fits into the first circle/radius
    var lastRadius = this.appContext.config.stepInUnits; // 0.0;
    var curAngle = 0.0, // (Math.PI / 4) * 3, // 0.0,
      lastAngle = 0.0; // (Math.PI / 4) * 2; // 0.0;
    var helperCircle = new Circle(new Vertex(0, 0), curRadius);
    var curPos,
      lastPos = helperCircle.vertAt(curAngle); // new Vertex(0, 0);
    var pathData = ["M", lastPos.x, lastPos.y];
    var curTangentVec;
    var curIsPrime = false;
    var lastWasPrime = false;
    var line = new Line(new Vertex(), new Vertex());
    var selectedSpurFn = this.appContext.config.selectedSpur ? math.parse(this.appContext.config.selectedSpur) : null;
    // console.log(this.appContext.config.selectedSpur, "selectedSpurFn", selectedSpurFn);
    var spurIndex = 0;
    var fnArgs = { n: 0 };
    var currentSpurValue = 0;
    for (var i = 0; i < steps; i++) {
      var naturalNumber = this.appContext.config.startingNumber + i + 1;
      if (selectedSpurFn && currentSpurValue < naturalNumber) {
        currentSpurValue = selectedSpurFn.evaluate(fnArgs);
        // console.log("naturalNumber", naturalNumber, "currentSpurValue", currentSpurValue);
        fnArgs.n = spurIndex++;
      }
      curIsPrime = isPrime(naturalNumber);
      var result = this.makeEquidistSpiralPoint(i + 1, curAngle, curRadius);
      curPos = result[0];
      curAngle = result[1];
      curRadius = result[2];
      var intersection = helperCircle
        .setRadius(lastRadius + (curRadius - lastRadius) / this.appContext.config.spiralBezierControlThreshold) // 0.6
        .vertAt(lastAngle + (curAngle - lastAngle) / 2.0);
      helperCircle.radius = curRadius;
      curTangentVec = helperCircle.tangentAt(curAngle);

      if (this.appContext.config.showSpiralBezierControlsPoints) {
        draw.diamondHandle(intersection, 1.0, "cyan");
      }
      var controlLineA = new Line(lastPos, intersection).trimEndAt(this.appContext.config.arcThreshold); // 0.166);
      var controlLineB = new Line(curPos, intersection).trimEndAt(this.appContext.config.arcThreshold);

      line.a = lastPos.clone();
      line.b = curPos.clone();

      var bezierSector = new CubicBezierCurve(line.a.clone(), line.b.clone(), controlLineA.b.clone(), controlLineB.b.clone());

      if (this.appContext.config.trimSpiralSegments && (lastWasPrime || curIsPrime)) {
        if (this.appContext.config.spiralLinearSegments) {
          shortenLinearConnection(line, lastWasPrime, curIsPrime, this.appContext, this.pb);
          pathData.push("M", line.a.x, line.a.y);
        } else {
          shortenBezierConnection(bezierSector, lastWasPrime, curIsPrime, this.appContext, this.pb);
          if (lastWasPrime) {
            pathData.push("M", bezierSector.startPoint.x, bezierSector.startPoint.y);
          }
        }
      }

      if (this.appContext.config.showSpiralBezierHandles) {
        draw.handleLine(line.a, controlLineA.b);
        draw.handleLine(line.b, controlLineB.b);
      }

      if (this.appContext.config.spiralLinearSegments) {
        pathData.push("L", line.b.x, line.b.y);
      } else {
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

      // Draw spur?
      if (currentSpurValue === naturalNumber) {
        // fill.diamondHandle(curPos, 15, "green");
        fill.circle(
          curPos,
          this.appContext.config.circleRadius * 1.5,
          "green", // this.appContext.config.lineColorPrimeMarker,
          this.appContext.config.lineWidthPrimeMarker
        );
      }

      if (curIsPrime && this.appContext.config.showPrimeCircle) {
        drawPrimeMarker(draw, fill, curPos, naturalNumber, this.appContext);
      } else if (this.appContext.config.showAllNumbers) {
        draw.circle(curPos, 3, "red", 1);
      }

      // Move to next position
      lastPos = curPos;
      lastWasPrime = curIsPrime;
      lastAngle = curAngle;
      lastRadius = curRadius;
    }

    // inplace=true, because we can drop the path data afterwards
    if (this.appContext.config.showSpiralPath) {
      draw.path(pathData, this.appContext.config.lineColorSpiral, this.appContext.config.lineWidthSpiral, { inplace: true });
    }
  };

  _context.ArchimedeanSacksSpiral.prototype.makeEquidistSpiralPoint = function (iterationNumber, curAngle, curRadius) {
    const stepInUnits = this.appContext.config.stepInUnits;
    const angleStepRad = this.appContext.config.angleStepDeg * DEG_TO_RAD;
    var angle = Circle.circleUtils.sectorAngleByArcLength(stepInUnits, curRadius);
    var nextRadius = curRadius + stepInUnits * (angle / angleStepRad / (Math.PI * 2));
    var spiralPoint = this.center.clone();
    spiralPoint.x = nextRadius;
    spiralPoint.rotate(curAngle - angle);
    return [spiralPoint, curAngle - angle, nextRadius];
  };
})(globalThis);
