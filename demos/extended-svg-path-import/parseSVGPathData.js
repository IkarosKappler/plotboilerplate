/**
 * Transform the given path data (translate and scale. rotating is not intended here).
 *
 * @name transformPathData
 * @static
 * @memberof drawutilssvg
 * @param {SVGPathParams} data - The data to transform.
 * @param {XYCoords} offset - The translation offset (neutral is x=0, y=0).
 * @param {XYCoords} scale - The scale factors (neutral is x=1, y=1).
 */
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
  var _slp = index => {
    lastPoint.x = Number(dataElements[index]);
    lastPoint.y = Number(dataElements[index + 1]);
  };
  while (i < dataElements.length) {
    var data = dataElements[i].match("[^\\s]+");
    const cmd = data[0];
    console.log("cmd", cmd);
    switch (cmd) {
      case "M":
      // MoveTo: M|m x y
      case "L":
      // LineTo L|l x y
      case "T":
        // Shorthand/smooth quadratic Bézier curveto: T|t x y
        // _stx(i + 1);
        // _sty(i + 2);
        _slp(i + 1);
        i += 3;
        break;
      case "m":
      // MoveTo: M|m x y
      case "l":
      // LineTo L|l x y
      case "t":
        // Shorthand/smooth quadratic Bézier curveto: T|t x y
        // _sx(i + 1);
        // _sy(i + 2);
        _slp(i + 1);
        i += 3;
        break;

      case "H":
        // HorizontalLineTo: H|h x
        // _stx(i + 1);
        lastPoint.x = Number(data[i + 1]);
        i += 2;
        break;
      case "h":
        // HorizontalLineTo: H|h x
        // _sx(i + 1);
        lastPoint.x = Number(data[i + 1]);
        i += 2;
        break;
      case "V":
        // VerticalLineTo: V|v y
        // _sty(i + 1);
        lastPoint.y = Number(data[i + 1]);
        i += 2;
        break;
      case "v":
        // VerticalLineTo: V|v y
        // _sy(i + 1);
        lastPoint.y = Number(data[i + 1]);
        i += 2;
        break;
      case "C":
        // CurveTo: C|c x1 y1 x2 y2 x y
        // _stx(i + 1);
        // _sty(i + 2);
        // _stx(i + 3);
        // _sty(i + 4);
        // _stx(i + 5);
        // _sty(i + 6);
        _slp(i + 5);
        i += 7;
        break;
      case "c":
        // CurveTo: C|c x1 y1 x2 y2 x y
        // _sx(i + 1);
        // _sy(i + 2);
        // _sx(i + 3);
        // _sy(i + 4);
        // _sx(i + 5);
        // _sy(i + 6);
        _slp(i + 5);
        i += 7;
        break;
      case "S":
      case "Q":
        // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
        // QuadraticCurveTo: Q|q x1 y1 x y
        // _stx(i + 1);
        // _sty(i + 2);
        // _stx(i + 3);
        // _sty(i + 4);
        _slp(i + 3);
        i += 5;
        break;
      case "s":
      case "q":
        // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
        // QuadraticCurveTo: Q|q x1 y1 x y
        // _sx(i + 1);
        // _sy(i + 2);
        // _sx(i + 3);
        // _sy(i + 4);
        _slp(i + 3);
        i += 5;
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
        _slp(i + 6);
        // Update the arc flag when x _or_ y scale is negative
        if ((scale.x < 0 && scale.y >= 0) || (scale.x >= 0 && scale.y < 0)) {
          data[i + 5] = data[i + 5] ? 0 : 1;
        }
        i += 8;
        break;
      case "a":
        // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
        // _sx(i + 1);
        // _sy(i + 2);
        // _sx(i + 6);
        // _sy(i + 7);
        _slp(i + 6);
        i += 8;
        break;
      case "z":
      case "Z":
        // ClosePath: Z|z (no arguments)
        // lastPoint.x = firstPoint.x;
        // lastPoint.y = firstPoint.y;
        i++;
        break;
      // Safepoint: continue reading token by token until something is recognized again
      default:
        i++;
    }
  } // END while

  return result;
} // END parseSVGPathData
