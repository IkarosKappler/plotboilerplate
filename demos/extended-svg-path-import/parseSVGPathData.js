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
    var firstPoint = { x: NaN, y: NaN };
    var lastPoint = { x: NaN, y: NaN };
    var lastControlPoint = { x: NaN, y: NaN };
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
          _handleMove(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "m":
          // MoveTo: M|m x y
          _handleMove(data, true, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "L":
          // LineTo L|l x y
          _handleLineTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "l":
          // LineTo L|l x y
          _handleLineTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "T":
          // Shorthand/smooth quadratic Bézier curveto: T|t x y
          // _stx(i + 1);
          // _sty(i + 2);
          // _slp(i + 1);
          // i += 3;
          _handleShorthandQuadraticCurveTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "t":
          // Shorthand/smooth quadratic Bézier curveto: T|t x y
          // _sx(i + 1);
          // _sy(i + 2);
          // _slp(i + 1);
          // i += 3;
          _handleShorthandQuadraticCurveTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "H":
          // HorizontalLineTo: H|h x
          // _stx(i + 1);
          // lastPoint.x = Number(data[i + 1]);
          // i += 2;
          _handleHorizontalLineTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "h":
          // HorizontalLineTo: H|h x
          // _sx(i + 1);
          // lastPoint.x = Number(data[i + 1]);
          // i += 2;
          _handleHorizontalLineTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "V":
          // VerticalLineTo: V|v y
          // _sty(i + 1);
          // lastPoint.y = Number(data[i + 1]);
          // i += 2;
          _handleVerticalLineTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "v":
          // VerticalLineTo: V|v y
          // _sy(i + 1);
          // lastPoint.y = Number(data[i + 1]);
          // i += 2;
          _handleVerticalLineTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
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
          _handleCubicBezierTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
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
          _handleCubicBezierTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "S":
          _handleShorthandCubicCurveTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "s":
          _handleShorthandCubicCurveTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
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
          _handleQuadraticCurveTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
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
          _handleQuadraticCurveTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
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
          _handleArcTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "a":
          // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
          // _sx(i + 1);
          // _sy(i + 2);
          // _sx(i + 6);
          // _sy(i + 7);
          // _slp(i + 6);
          // i += 8;
          _handleArcTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "z":
          _handleClosePath(data, false, firstPoint, lastPoint, lastControlPoint, result);
          break;
        case "Z":
          // ClosePath: Z|z (no arguments)
          // lastPoint.x = firstPoint.x;
          // lastPoint.y = firstPoint.y;
          _handleClosePath(data, true, firstPoint, lastPoint, lastControlPoint, result);
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
  var _handleMove = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, _result) {
    if (data.length < 3) {
      throw "Unsufficient params for MOVE";
    }
    // result.push( new)
    if (isRelative && !isNaN(lastPoint.x) && !isNaN(lastPoint.y)) {
      lastPoint.x += Number(data[1]);
      lastPoint.y += Number(data[2]);
      lastControlPoint.x = lastPoint.x;
      lastControlPoint.y = lastPoint.y;
    } else {
      lastPoint.x = Number(data[1]);
      lastPoint.y = Number(data[2]);
      lastControlPoint.x = lastPoint.x;
      lastControlPoint.y = lastPoint.y;
    }
    console.log("AFTER MOVE", lastPoint);
    if (isNaN(firstPoint.y)) {
      firstPoint.x = lastPoint.x;
      firstPoint.y = lastPoint.y;
    }
  };

  // Draw a line segment from the current position
  var _handleLineTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
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
    lastControlPoint.x = line.b.x;
    lastControlPoint.y = line.b.y;
    if (isNaN(firstPoint.y)) {
      firstPoint.x = line.a.x;
      firstPoint.y = line.a.y;
    }
  };

  var _handleHorizontalLineTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
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
    lastControlPoint.x = line.b.x;
    if (isNaN(firstPoint.y)) {
      firstPoint.x = line.a.x;
      firstPoint.y = line.a.y;
    }
  };

  var _handleVerticalLineTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
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
    lastControlPoint.y = line.b.y;
    if (isNaN(firstPoint.y)) {
      firstPoint.x = line.a.x;
      firstPoint.y = line.a.y;
    }
  };

  // CurveTo: C|c x1 y1 x2 y2 x y
  var _handleCubicBezierTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
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
    lastControlPoint.x = curve.endPoint.x;
    lastControlPoint.y = curve.endPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }
  };

  // QuadraticCurveTo: Q|q x1 y1 x y
  var _handleQuadraticCurveTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
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
    lastControlPoint.x = curve.endPoint.x;
    lastControlPoint.y = curve.endPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }
  };

  var _handleShorthandCubicCurveTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
    console.log("Handle SHORTHANDBEZIERTO", data);
    if (data.length < 5) {
      throw "Unsufficient params for SHORTHANDBEZIERTO";
    }
    var curve = new CubicBezierCurve(new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      curve.endControlPoint.x += Number(data[1]);
      curve.endControlPoint.y += Number(data[2]);
      curve.endPoint.x += Number(data[3]);
      curve.endPoint.y += Number(data[4]);
    } else {
      curve.endControlPoint.x = Number(data[1]);
      curve.endControlPoint.y = Number(data[2]);
      curve.endPoint.x = Number(data[3]);
      curve.endPoint.y = Number(data[4]);
    }
    // Mirror the first control point
    var line = new Line(curve.startPoint, curve.endPoint);
    var mirrorVector = new Vector(line.vertAt(0.5), line.b).getOrthogonal();
    var closestT = mirrorVector.getClosestT(curve.endControlPoint);
    var pointOnMirror = mirrorVector.vertAt(closestT);
    curve.startControlPoint.x = pointOnMirror.x - (curve.endControlPoint.x - pointOnMirror.x);
    curve.startControlPoint.y = pointOnMirror.y - (curve.endControlPoint.y - pointOnMirror.y);

    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
    lastControlPoint.x = curve.endControlPoint.x;
    lastControlPoint.y = curve.endControlPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }
  };

  var _handleShorthandQuadraticCurveTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
    console.log("Handle SHORTHANDQUADRATICCURVETO", data);
    if (data.length < 3) {
      throw "Unsufficient params for SHORTHANDQUADRATICCURVETO";
    }
    var curve = new CubicBezierCurve(new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      // curve.endControlPoint.x += Number(data[1]);
      // curve.endControlPoint.y += Number(data[2]);
      curve.endPoint.x += Number(data[1]);
      curve.endPoint.y += Number(data[2]);
      curve.startControlPoint.x += curve.startPoint.x + (lastControlPoint.x - lastPoint.x);
      curve.startControlPoint.y += curve.startPoint.y + (lastControlPoint.y - lastPoint.y);
    } else {
      // curve.endControlPoint.x = Number(data[1]);
      // curve.endControlPoint.y = Number(data[2]);
      curve.endPoint.x = Number(data[1]);
      curve.endPoint.y = Number(data[2]);
      curve.startControlPoint.x = curve.startPoint.x + (lastControlPoint.x - lastPoint.x);
      curve.startControlPoint.y = curve.startPoint.y + (lastControlPoint.y - lastPoint.y);
    }
    // Handle as quadratic curve
    curve.endControlPoint.x = curve.startControlPoint.x;
    curve.endControlPoint.y = curve.startControlPoint.y;

    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
    lastControlPoint.x = curve.endControlPoint.x;
    lastControlPoint.y = curve.endControlPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }
  };

  // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
  var _handleArcTo = function (data, isRelative, firstPoint, lastPoint, lastControlPoint, result) {
    console.log("Handle ARCTO", data);
    if (data.length < 8) {
      throw "Unsufficient params for ARCTO";
    }
    // center: Vertex, axis: Vertex, rotation?: number
    var center = new Vertex(Number(data[1]), Number(data[2]));
    var rotation = Number(data[3]);
    var axis = new Vertex(Number(data[6], Number(data[7])));

    // var ellipse = new VEllipse(center, axis, rotation);
    // result.push()

    // console.log(
    //   lastPoint.x, // x1
    //   lastPoint.y, // y1
    //   Number(data[1]), // rx
    //   Number(data[2]), // ry
    //   Number(data[3]), // phi: number,
    //   Boolean(data[4]), // fa: boolean,
    //   Boolean(data[5]), // fs: boolean,
    //   Number(data[6]), // x2: number,
    //   Number(data[7]) // y2: number
    // );
    // TODO: respect relative/absolute here
    var ellipseSector = VEllipseSector.ellipseSectorUtils.endpointToCenterParameters(
      lastPoint.x, // x1
      lastPoint.y, // y1
      Number(data[1]), // rx
      Number(data[2]), // ry
      Number(data[3]), // phi: number,
      Boolean(data[4]), // fa: boolean,
      Boolean(data[5]), // fs: boolean,
      Number(data[6]), // x2: number,
      Number(data[7]) // y2: number
    );

    console.log("ellipseSector", ellipseSector);
    var curves = ellipseSector.toCubicBezier(4); // 4 segments already seems to be a good approximation
    for (var i = 0; i < curves.length; i++) {
      result.push(curves[i]); // Destruct!
    }

    if (curves.length > 0) {
      console.log("curves", curves);
      var lastCurve = curves[curves.length - 1];
      lastPoint.x = lastCurve.endPoint.x;
      lastPoint.y = lastCurve.endPoint.y;
      lastControlPoint.x = lastCurve.endControlPoint.x;
      lastControlPoint.y = lastCurve.endControlPoint.y;
      if (isNaN(firstPoint.x)) {
        firstPoint.x = curves[0].startPoint.x;
        firstPoint.y = curves[0].startPoint.y;
      }
    }

    // TODO: track first/last/control point
  };

  var _handleClosePath = function (_data, _isRelative, firstPoint, lastPoint, lastControlPoint, result) {
    console.log("Handle CLOSEPATH", "lastPoint", lastPoint, "firstPoint", firstPoint);
    var line = new Line(new Vertex(lastPoint), new Vertex(firstPoint));
    result.push(line);

    lastPoint.x = line.b.x;
    lastPoint.y = line.b.y;
    lastControlPoint.x = line.b.x;
    lastControlPoint.y = line.b.y;
  };
})(globalThis);