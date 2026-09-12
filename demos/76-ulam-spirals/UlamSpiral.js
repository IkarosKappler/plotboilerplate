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

    var selectedSpurFn = this.appContext.config.selectedSpur ? math.parse(this.appContext.config.selectedSpur) : null;
    // console.log(this.appContext.config.selectedSpur, "selectedSpurFn", selectedSpurFn);
    var spurIndex = 0;
    var fnArgs = { n: 0 };
    var currentSpurValue = 0;

    for (var i = 0; i <= this.appContext.config.iterations; i++) {
      var naturalNumber = this.appContext.config.startingNumber + i + 1;
      if (selectedSpurFn && currentSpurValue < naturalNumber) {
        currentSpurValue = selectedSpurFn.evaluate(fnArgs);
        // console.log("naturalNumber", naturalNumber, "currentSpurValue", currentSpurValue);
        fnArgs.n = spurIndex++;
      }
      var curIsPrime = isPrime(naturalNumber);
      var nextDiscretePos = getNextUlamPosition(discretePosition, discreteDirection, discreteMin, discreteMax);
      // Convert discrete position to pixels.
      var curPos = discretePosition.clone().scale(stepSize);
      var nextPos = nextDiscretePos.clone().scale(stepSize);
      line.a = curPos;
      line.b = nextPos;

      // var line = new Line(pos, nextPos);
      if (this.appContext.config.trimSpiralSegments && (lastWasPrime || curIsPrime)) {
        shortenLinearConnection(line, lastWasPrime, curIsPrime, this.appContext, this.pb);
        pathData.push("M", line.a.x, line.a.y);
      }

      pathData.push("L", line.b.x, line.b.y);
      // draw.line(pos, nextPos, "grey", 3.0);

      // Draw spur?
      if (currentSpurValue === naturalNumber) {
        // fill.diamondHandle(curPos, 15, "green");
        fill.circle(
          nextPos,
          this.appContext.config.circleRadius * 1.5,
          "green", // this.appContext.config.lineColorPrimeMarker,
          this.appContext.config.lineWidthPrimeMarker
        );
      }

      if (curIsPrime && this.appContext.config.showPrimeCircle) {
        drawPrimeMarker(draw, fill, nextPos, naturalNumber, this.appContext, this.pb);
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
