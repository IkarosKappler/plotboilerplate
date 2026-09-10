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

    var pathData = ["M", 0, 0];

    var curRadius = this.appContext.config.stepInUnits; // Make sure the first arc fits into the first circle/radius
    var lastRadius = this.appContext.config.stepInUnits; // 0.0;
    var curAngle = 0.0, // (Math.PI / 4) * 3, // 0.0,
      lastAngle = 0.0; // (Math.PI / 4) * 2; // 0.0;
    var helperCircle = new Circle(new Vertex(0, 0), curRadius);
    var curPos,
      lastPos = helperCircle.vertAt(curAngle); // new Vertex(0, 0);
    var curTangentVec;
    var curIsPrime = false;
    var lastWasPrime = false;
    var line = new Line(new Vertex(), new Vertex());
    for (var i = 0; i < steps; i++) {
      var naturalNumber = this.appContext.config.startingNumber + i + 1;
      curIsPrime = isPrime(naturalNumber);
      var result = this.makeEquidistSpiralPoint(i + 1, curAngle, curRadius);
      curPos = result[0];
      curAngle = result[1];
      curRadius = result[2];
      var intersection = helperCircle
        .setRadius(lastRadius + (curRadius - lastRadius) / 0.6)
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
          this.shortenLinearConnection(line, lastWasPrime, curIsPrime);
          pathData.push("M", line.a.x, line.a.y);
        } else {
          this.shortenBezierConnection(bezierSector, lastWasPrime, curIsPrime);
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

      if (curIsPrime) {
        this.drawPrimeMarker(draw, fill, curPos, naturalNumber);
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

  _context.ArchimedeanSacksSpiral.prototype.drawPrimeMarker = function (draw, fill, position, primeNumber) {
    // var circleRadius = appContext.config.circleRadius;
    draw.circle(
      position,
      this.appContext.config.circleRadius,
      this.appContext.config.lineColorPrimeMarker,
      this.appContext.config.lineWidthPrimeMarker
    );
    if (this.appContext.config.showPrimeLabel) {
      fill.text("" + primeNumber, position.x, position.y, {
        // options
        color: this.appContext.config.lineColorPrimeMarker,
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

  _context.ArchimedeanSacksSpiral.prototype.shortenLinearConnection = function (line, isTrimStart, isTrimEnd) {
    if (isTrimStart) {
      line.trimStart(
        this.appContext.config.circleRadius + this.appContext.config.lineWidthPrimeMarker / 2 / this.pb.draw.scale.x
      );
    }
    if (isTrimEnd) {
      line.trimEnd(this.appContext.config.circleRadius + this.appContext.config.lineWidthPrimeMarker / 2 / this.pb.draw.scale.x);
    }
  };

  _context.ArchimedeanSacksSpiral.prototype.shortenBezierConnection = function (bezierCurve, isTrimStart, isTrimEnd) {
    var cutOffAmount =
      this.appContext.config.circleRadius + this.appContext.config.lineWidthPrimeMarker / 2 / this.pb.draw.scale.x;
    if (isTrimStart && !isTrimEnd) {
      bezierCurve.trimStart(cutOffAmount);
    } else if (!isTrimStart && isTrimEnd) {
      bezierCurve.trimEnd(bezierCurve.arcLength - cutOffAmount);
    } else if (isTrimStart && isTrimEnd) {
      bezierCurve.trimStartEnd(cutOffAmount, bezierCurve.arcLength - cutOffAmount);
    }
  };
})(globalThis);
