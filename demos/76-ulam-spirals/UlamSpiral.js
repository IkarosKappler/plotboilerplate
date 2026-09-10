"use strict";

/**
 * Construct Ulam spirals.
 *
 * @author  Ikaros Kappler
 * @date    2026-09-1ß
 * @version 1.0.0
 */

(function (_context) {
  _context.UlamSpiral = function (appContext, pb) {
    this.appContext = appContext;
    this.pb = pb;
  };

  _context.UlamSpiral.prototype.draw = function (draw, fill) {
    var discretePosition = new Vertex(0, 0);
    var discreteDirection = new Vertex(1, 0);
    var discreteMin = new Vertex(0, 0);
    var discreteMax = new Vertex(0, 0);
    var lastWasPrime = false;

    var pathData = ["M", 0, 0];
    var stepSize = this.appContext.config.ulamRadiusStep;

    var line = new Line(new Vertex(), new Vertex());

    for (var i = 0; i <= this.appContext.config.iterations; i++) {
      var naturalNumber = this.appContext.config.startingNumber + i + 1;
      var curIsPrime = isPrime(naturalNumber);
      var nextDiscretePos = getNextUlamPosition(discretePosition, discreteDirection, discreteMin, discreteMax);
      // Convert discrete position to pixels.
      var curPos = discretePosition.clone().scale(stepSize);
      var nextPos = nextDiscretePos.clone().scale(stepSize);
      line.a = curPos;
      line.b = nextPos;

      // var line = new Line(pos, nextPos);
      if (this.appContext.config.trimSpiralSegments && (lastWasPrime || curIsPrime)) {
        this.shortenLinearConnection(line, lastWasPrime, curIsPrime);
        pathData.push("M", line.a.x, line.a.y);
      }

      pathData.push("L", line.b.x, line.b.y);
      // draw.line(pos, nextPos, "grey", 3.0);

      if (curIsPrime) {
        this.drawPrimeMarker(draw, fill, nextPos, naturalNumber);
      } else if (this.appContext.config.showAllNumbers) {
        draw.circle(nextPos, 3, "red", 1);
      }

      discretePosition = nextDiscretePos;
      lastWasPrime = curIsPrime;
    }

    if (this.appContext.config.showSpiralPath) {
      draw.path(pathData, this.appContext.config.lineColorSpiral, this.appContext.config.lineWidthSpiral, { inplace: true });
    }
  };

  _context.UlamSpiral.prototype.shortenLinearConnection = function (line, isTrimStart, isTrimEnd) {
    if (isTrimStart) {
      line.trimStart(
        this.appContext.config.circleRadius + this.appContext.config.lineWidthPrimeMarker / 2 / this.pb.draw.scale.x
      );
    }
    if (isTrimEnd) {
      line.trimEnd(this.appContext.config.circleRadius + this.appContext.config.lineWidthPrimeMarker / 2 / this.pb.draw.scale.x);
    }
  };

  _context.UlamSpiral.prototype.drawPrimeMarker = function (draw, fill, position, primeNumber) {
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
})(globalThis);
