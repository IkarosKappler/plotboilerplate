/**
 * Transform the given path data (translate and scale. rotating is not intended here).
 *
 * @name parseSVGPathData
 * @static
 * @memberof drawutilssvg
 * @param {SVGPathParams} data - The data to transform.
 */

(function (_context) {
  function parseSVGPathData(dataString) {
    // Source
    //    https://javascript.plainenglish.io/june-3-parsing-and-validating-svg-paths-with-regex-7bd0e245115
    const validCommand =
      /([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;
    var dataElements = dataString.match(validCommand);
    console.log("data array", dataElements);
    // Scale and translate {x,y}

    // Array<PathSegments>
    var result = [];

    var i = 0;
    var lastPoint = { x: NaN, y: NaN };
    // "save last point"
    // var _slp = index => {
    //   lastPoint.x = Number(dataElements[index]);
    //   lastPoint.y = Number(dataElements[index + 1]);
    // };
    while (i < dataElements.length) {
      var token = dataElements[i];
      var data = token.split(/[\s,]/);
      const cmd = data[0];
      console.log("token", token, "cmd", cmd, "data", data);
      switch (cmd) {
        case "M":
          // MoveTo: M|m x y
          _handleMove(data, false, lastPoint, result);
          break;
        case "m":
          // MoveTo: M|m x y
          _handleMove(data, true, lastPoint, result);
          break;
        case "L":
          // LineTo L|l x y
          _handleLineTo(data, false, lastPoint, result);
          break;
        case "l":
          // LineTo L|l x y
          _handleLineTo(data, true, lastPoint, result);
          break;
        case "T":
          // Shorthand/smooth quadratic Bézier curveto: T|t x y
          // _stx(i + 1);
          // _sty(i + 2);
          // _slp(i + 1);
          // i += 3;
          break;
        case "t":
          // Shorthand/smooth quadratic Bézier curveto: T|t x y
          // _sx(i + 1);
          // _sy(i + 2);
          // _slp(i + 1);
          // i += 3;
          break;

        case "H":
          // HorizontalLineTo: H|h x
          // _stx(i + 1);
          // lastPoint.x = Number(data[i + 1]);
          // i += 2;
          _handleHorizontalLineTo(data, false, lastPoint, result);
          break;
        case "h":
          // HorizontalLineTo: H|h x
          // _sx(i + 1);
          // lastPoint.x = Number(data[i + 1]);
          // i += 2;
          _handleHorizontalLineTo(data, true, lastPoint, result);
          break;
        case "V":
          // VerticalLineTo: V|v y
          // _sty(i + 1);
          // lastPoint.y = Number(data[i + 1]);
          // i += 2;
          _handleVerticalLineTo(data, false, lastPoint, result);
          break;
        case "v":
          // VerticalLineTo: V|v y
          // _sy(i + 1);
          // lastPoint.y = Number(data[i + 1]);
          // i += 2;
          _handleVerticalLineTo(data, true, lastPoint, result);
          break;
        case "C":
          // CurveTo: C|c x1 y1 x2 y2 x y
          // _stx(i + 1);
          // _sty(i + 2);
          // _stx(i + 3);
          // _sty(i + 4);
          // _stx(i + 5);
          // _sty(i + 6);
          // _slp(i + 5);
          // i += 7;
          _handleCubicBezierTo(data, false, lastPoint, result);
          break;
        case "c":
          // CurveTo: C|c x1 y1 x2 y2 x y
          // _sx(i + 1);
          // _sy(i + 2);
          // _sx(i + 3);
          // _sy(i + 4);
          // _sx(i + 5);
          // _sy(i + 6);
          // _slp(i + 5);
          // i += 7;
          _handleCubicBezierTo(data, true, lastPoint, result);
          break;
        case "S":
          break;
        case "Q":
          // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
          // QuadraticCurveTo: Q|q x1 y1 x y
          // _stx(i + 1);
          // _sty(i + 2);
          // _stx(i + 3);
          // _sty(i + 4);
          // _slp(i + 3);
          // i += 5;
          _handleQuadraticCurveTo(data, false, lastPoint, result);
          break;
        case "s":
          break;
        case "q":
          // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
          // QuadraticCurveTo: Q|q x1 y1 x y
          // _sx(i + 1);
          // _sy(i + 2);
          // _sx(i + 3);
          // _sy(i + 4);
          // _slp(i + 3);
          // i += 5;
          _handleQuadraticCurveTo(data, true, lastPoint, result);
          break;
        case "A":
          // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
          // Uniform scale: just scale
          // NOTE: here is something TODO
          //  * if scalex!=scaleY this won't work
          //  * Arcs have to be converted to Bézier curves here in that case
          // _sx(i + 1);
          // _sy(i + 2);
          // _stx(i + 6);
          // _sty(i + 7);
          // _slp(i + 6);
          // Update the arc flag when x _or_ y scale is negative
          // if ((scale.x < 0 && scale.y >= 0) || (scale.x >= 0 && scale.y < 0)) {
          //   data[i + 5] = data[i + 5] ? 0 : 1;
          // }
          // i += 8;
          break;
        case "a":
          // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
          // _sx(i + 1);
          // _sy(i + 2);
          // _sx(i + 6);
          // _sy(i + 7);
          // _slp(i + 6);
          // i += 8;
          break;
        case "z":
        case "Z":
          // ClosePath: Z|z (no arguments)
          // lastPoint.x = firstPoint.x;
          // lastPoint.y = firstPoint.y;
          // i++;
          break;
        // Safepoint: continue reading token by token until something is recognized again
        default:
        // i++;
      }
      i++;
    } // END while

    return result;
  } // END parseSVGPathData

  _context.parseSVGPathData = parseSVGPathData;

  // Just update the current position
  var _handleMove = function (data, isRelative, lastPoint, _result) {
    if (data.length < 3) {
      throw "Unsufficient params for MOVE";
    }
    // result.push( new)
    if (isRelative && lastPoint.x !== NaN && lastPoint.y !== NaN) {
      lastPoint.x += Number(data[1]);
      lastPoint.y += Number(data[2]);
    } else {
      lastPoint.x = Number(data[1]);
      lastPoint.y = Number(data[2]);
    }
    console.log("AFTER MOVE", lastPoint);
  };

  // Draw a line segment from the current position
  var _handleLineTo = function (data, isRelative, lastPoint, result) {
    console.log("Handle LINETO", data);
    if (data.length < 3) {
      throw "Unsufficient params for LINETO";
    }
    console.log("Y: ", Number(data[2]), "lastPoint", lastPoint);
    // result.push( new)
    var line = new Line(new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      line.b.x += Number(data[1]);
      line.b.y += Number(data[2]);
    } else {
      line.b.x = Number(data[1]);
      line.b.y = Number(data[2]);
    }
    result.push(line);
    lastPoint.x = line.b.x;
    lastPoint.y = line.b.y;
  };

  var _handleHorizontalLineTo = function (data, isRelative, lastPoint, result) {
    console.log("Handle HORIZONTALLINETO", data);
    if (data.length < 2) {
      throw "Unsufficient params for HORIZONTALLINETO";
    }
    // console.log("Y: ", Number(data[2]), "lastPoint", lastPoint);
    // result.push( new)
    var line = new Line(new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      line.b.x += Number(data[1]);
      // line.b.y += Number(data[2]);
    } else {
      line.b.x = Number(data[1]);
      // line.b.y = Number(data[2]);
    }
    result.push(line);
    lastPoint.x = line.b.x;
    // lastPoint.y = line.b.y;
  };

  var _handleVerticalLineTo = function (data, isRelative, lastPoint, result) {
    console.log("Handle VERTICALLINETO", data);
    if (data.length < 2) {
      throw "Unsufficient params for VERTICALLINETO";
    }
    // console.log("Y: ", Number(data[2]), "lastPoint", lastPoint);
    // result.push( new)
    var line = new Line(new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      // line.b.x += Number(data[1]);
      line.b.y += Number(data[1]);
    } else {
      // line.b.x = Number(data[1]);
      line.b.y = Number(data[1]);
    }
    result.push(line);
    // lastPoint.x = line.b.x;
    lastPoint.y = line.b.y;
  };

  // CurveTo: C|c x1 y1 x2 y2 x y
  var _handleCubicBezierTo = function (data, isRelative, lastPoint, result) {
    console.log("Handle CUBICBEZIERTO", data);
    if (data.length < 7) {
      throw "Unsufficient params for CUBICBEZIERTO";
    }
    // console.log("Y: ", Number(data[2]), "lastPoint", lastPoint);
    // result.push( new)
    var curve = new CubicBezierCurve(new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      curve.startControlPoint.x += Number(data[1]);
      curve.startControlPoint.y += Number(data[2]);
      curve.endControlPoint.x += Number(data[3]);
      curve.endControlPoint.y += Number(data[4]);
      curve.endPoint.x += Number(data[5]);
      curve.endPoint.y += Number(data[6]);
    } else {
      curve.startControlPoint.x = Number(data[1]);
      curve.startControlPoint.y = Number(data[2]);
      curve.endControlPoint.x = Number(data[3]);
      curve.endControlPoint.y = Number(data[4]);
      curve.endPoint.x = Number(data[5]);
      curve.endPoint.y = Number(data[6]);
    }
    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
  };

  // QuadraticCurveTo: Q|q x1 y1 x y
  var _handleQuadraticCurveTo = function (data, isRelative, lastPoint, result) {
    console.log("Handle CUBICBEZIERTO", data);
    if (data.length < 5) {
      throw "Unsufficient params for CUBICBEZIERTO";
    }
    // console.log("Y: ", Number(data[2]), "lastPoint", lastPoint);
    // result.push( new)
    var curve = new CubicBezierCurve(new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      curve.startControlPoint.x += Number(data[1]);
      curve.startControlPoint.y += Number(data[2]);
      curve.endControlPoint.x += Number(data[1]);
      curve.endControlPoint.y += Number(data[2]);
      curve.endPoint.x += Number(data[3]);
      curve.endPoint.y += Number(data[4]);
    } else {
      curve.startControlPoint.x = Number(data[1]);
      curve.startControlPoint.y = Number(data[2]);
      curve.endControlPoint.x = Number(data[1]);
      curve.endControlPoint.y = Number(data[2]);
      curve.endPoint.x = Number(data[3]);
      curve.endPoint.y = Number(data[4]);
    }
    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
  };
})(globalThis);
