/**
 * Parse SVG path data strings and convert to PlotBoilerplate path objects.
 *
 * As this parser function does not detect all possible path data strings it should cover the most daily use-cases.
 *
 * For more insight see
 *    https://www.w3.org/TR/SVG/paths.html
 *
 * @author  Ikaros Kappler
 * @date    2022-11-06
 * @modified 2022-12-21 (winter solstice) Porting this to Typescript.
 * @modified 2023-01-17 Handling multiple parameter sets now.
 * @version 0.0.2-alpha
 **/

import { CubicBezierCurve } from "../../../CubicBezierCurve";
import { XYCoords } from "../../../interfaces/core";
import { Line } from "../../../Line";
import { VEllipseSector } from "../../../VEllipseSector";
import { Vertex } from "../../../Vertex";
import { splitSVGPathData } from "./splitSVGPathData";
import {
  SVGPathArcToCommand,
  SVGPathCloseCommand,
  SVGPathCommand,
  SVGPathCubicCurveToCommand,
  SVGPathHorizontalLineToCommand,
  SVGPathLineToCommand,
  SVGPathMoveToCommand,
  SVGPathQuadraticCurveToCommand,
  SVGPathShorthandCubicCurveToCommand,
  SVGPathShorthandQuadraticCurveToCommand,
  SVGPathVerticalLineToCommand
} from "./types";

const DEG_TO_RAD = Math.PI / 180;

/**
 * Transform the given path data (translate and scale. rotating is not intended here).
 *
 * @date 2022-11-06
 *
 * @name parseSVGPathData
 * @static
 * @param {string} data - The data to parse.
 * @return An array of straight line segments (Line) or curve segments (CubicBezierCurve) representing the path.
 */
export const parseSVGPathData = (dataString: string): Array<Line | CubicBezierCurve> | null => {
  const dataElements: Array<SVGPathCommand> | null = splitSVGPathData(dataString);

  if (!dataElements) {
    return null;
  }

  // Array<PathSegments>
  const result: Array<Line | CubicBezierCurve> = [];

  var i = 0;
  const firstPoint: XYCoords = { x: NaN, y: NaN };
  const lastPoint: XYCoords = { x: NaN, y: NaN };
  const lastControlPoint: XYCoords = { x: NaN, y: NaN };
  const lastQuadraticControlPoint: XYCoords = { x: NaN, y: NaN };

  while (i < dataElements.length) {
    // Could this also be SVGPathShorthandQuadraticCurveToCommand?
    const data: SVGPathCommand = dataElements[i];
    const cmd = data[0];
    // console.log("cmd", cmd, "data", data);
    switch (data[0]) {
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
      case "H":
        // HorizontalLineTo: H|h x
        _handleHorizontalLineTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "h":
        // HorizontalLineTo: H|h x
        _handleHorizontalLineTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "V":
        // VerticalLineTo: V|v y
        _handleVerticalLineTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "v":
        // VerticalLineTo: V|v y
        _handleVerticalLineTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "C":
        // CurveTo: C|c x1 y1 x2 y2 x y
        _handleCubicBezierTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "c":
        // CurveTo: C|c x1 y1 x2 y2 x y
        _handleCubicBezierTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "S":
        _handleShorthandCubicCurveTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "s":
        _handleShorthandCubicCurveTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "Q":
        // QuadraticCurveTo: Q|q x1 y1 x y
        _handleQuadraticCurveTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "q":
        // QuadraticCurveTo: Q|q x1 y1 x y
        _handleQuadraticCurveTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "A":
        // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
        _handleArcTo(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "a":
        // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
        _handleArcTo(data, true, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "z":
        _handleClosePath(data, false, firstPoint, lastPoint, lastControlPoint, result);
        break;
      case "Z":
        // ClosePath: Z|z (no arguments)
        _handleClosePath(data, true, firstPoint, lastPoint, lastControlPoint, result);
        // i++;
        break;
      default:
        if ((cmd as string) === "T") {
          throw "T command only allowed after q command.";
        }
        if ((cmd as string) === "t") {
          throw "t command only allowed after q command.";
        }
        throw "Unknown SVG path command found: " + cmd + ".";
    }
    // Safepoint: continue reading token by token until something is recognized again
    i++;
  } // END while

  return result;
}; // END parseSVGPathData

// Just update the current position
const _handleMove = (
  data: SVGPathMoveToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  _result: Array<Line | CubicBezierCurve>
) => {
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
  // console.log("AFTER MOVE", lastPoint);
  if (isNaN(firstPoint.y)) {
    firstPoint.x = lastPoint.x;
    firstPoint.y = lastPoint.y;
  }
};

// Draw a line segment from the current position
const _handleLineTo = (
  data: SVGPathLineToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  if (data.length < 3) {
    throw "Unsufficient params for LINETO";
  }

  for (var i = 1; i + 1 < data.length; i += 2) {
    const line = new Line(new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      line.b.x += Number(data[i]);
      line.b.y += Number(data[i + 1]);
    } else {
      line.b.x = Number(data[i]);
      line.b.y = Number(data[i + 1]);
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
    console.log("LINETO LINE", i, line.toString());
  }
};

const _handleHorizontalLineTo = (
  data: SVGPathHorizontalLineToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  //   console.log("Handle HORIZONTALLINETO", data);
  if (data.length < 2) {
    throw "Unsufficient params for HORIZONTALLINETO";
  }

  for (var i = 1; i < data.length; i++) {
    const line = new Line(new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      line.b.x += Number(data[i]);
      // line.b.y += Number(data[2]);
    } else {
      line.b.x = Number(data[i]);
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
  }
};

const _handleVerticalLineTo = (
  data: SVGPathVerticalLineToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  if (data.length < 2) {
    throw "Unsufficient params for VERTICALLINETO";
  }

  for (var i = 1; i < data.length; i++) {
    const line = new Line(new Vertex(lastPoint), new Vertex(lastPoint));
    if (isRelative) {
      line.b.y += Number(data[i]);
    } else {
      line.b.y = Number(data[i]);
    }
    result.push(line);
    // lastPoint.x = line.b.x;
    lastPoint.y = line.b.y;
    lastControlPoint.y = line.b.y;
    if (isNaN(firstPoint.y)) {
      firstPoint.x = line.a.x;
      firstPoint.y = line.a.y;
    }
  }
};

// CurveTo: C|c x1 y1 x2 y2 x y
const _handleCubicBezierTo = (
  data: SVGPathCubicCurveToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  //   console.log("Handle CUBICBEZIERTO", data);
  if (data.length < 7) {
    throw "Unsufficient params for CUBICBEZIERTO";
  }

  for (var i = 1; i + 5 < data.length; i += 6) {
    const curve = new CubicBezierCurve(
      new Vertex(lastPoint),
      new Vertex(lastPoint),
      new Vertex(lastPoint),
      new Vertex(lastPoint)
    );
    if (isRelative) {
      curve.startControlPoint.x += Number(data[i]);
      curve.startControlPoint.y += Number(data[i + 1]);
      curve.endControlPoint.x += Number(data[i + 2]);
      curve.endControlPoint.y += Number(data[i + 3]);
      curve.endPoint.x += Number(data[i + 4]);
      curve.endPoint.y += Number(data[i + 5]);
    } else {
      curve.startControlPoint.x = Number(data[i]);
      curve.startControlPoint.y = Number(data[i + 1]);
      curve.endControlPoint.x = Number(data[i + 2]);
      curve.endControlPoint.y = Number(data[i + 3]);
      curve.endPoint.x = Number(data[i + 4]);
      curve.endPoint.y = Number(data[i + 5]);
    }
    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
    lastControlPoint.x = curve.endControlPoint.x;
    lastControlPoint.y = curve.endControlPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }
  }
};

// QuadraticCurveTo: Q|q x1 y1 x y
const _handleQuadraticCurveTo = (
  data: SVGPathQuadraticCurveToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  //   console.log("Handle QUADRATICBEZIERTO", data);
  if (data.length < 5) {
    throw "Unsufficient params for QUADRATICBEZIERTO";
  }

  var i = 1;
  var localLastQuadraticControlPoint = { x: 0, y: 0 };
  // This loops runs at least once
  while (i + 3 < data.length && data[i] !== "t" && data[i] !== "T") {
    const curve = new CubicBezierCurve(
      new Vertex(lastPoint),
      new Vertex(lastPoint),
      new Vertex(lastPoint),
      new Vertex(lastPoint)
    );
    if (isRelative) {
      curve.startControlPoint.x += curve.startPoint.x + (Number(data[i]) - curve.startControlPoint.x); // * 0.666;
      curve.startControlPoint.y += curve.startPoint.y + (Number(data[i + 1]) - curve.startControlPoint.y); // * 0.666;
      curve.endPoint.x += Number(data[i + 2]);
      curve.endPoint.y += Number(data[i + 3]);
      curve.endControlPoint.x = curve.startControlPoint.x;
      curve.endControlPoint.y = curve.startControlPoint.y;
    } else {
      curve.startControlPoint.x = curve.startPoint.x + (Number(data[i]) - curve.startControlPoint.x); // * 0.666;
      curve.startControlPoint.y = curve.startPoint.y + (Number(data[i + 1]) - curve.startControlPoint.y); // * 0.666;
      curve.endPoint.x = Number(data[i + 2]);
      curve.endPoint.y = Number(data[i + 3]);
      curve.endControlPoint.x = curve.startControlPoint.x;
      curve.endControlPoint.y = curve.startControlPoint.y;
    }
    // var lastQuadraticControlPoint = { x: Number(data[1]), y: Number(data[2]) };
    localLastQuadraticControlPoint = { x: curve.endControlPoint.x, y: curve.endControlPoint.y };
    // Convert quadratic curve to cubic curve
    curve.startControlPoint.x = curve.startPoint.x + (curve.startControlPoint.x - curve.startPoint.x) * 0.666;
    curve.startControlPoint.y = curve.startPoint.y + (curve.startControlPoint.y - curve.startPoint.y) * 0.666;
    curve.endControlPoint.x = curve.endPoint.x + (curve.endControlPoint.x - curve.endPoint.x) * 0.666;
    curve.endControlPoint.y = curve.endPoint.y + (curve.endControlPoint.y - curve.endPoint.y) * 0.666;

    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
    lastControlPoint.x = curve.endControlPoint.x;
    lastControlPoint.y = curve.endControlPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }
    i += 4;
  } // END while

  // 'T' or 't' command may follow
  // if (data.length >= 8) {
  if (i < data.length && (data[i] == "t" || data[i] === "T")) {
    // TODO: think about this type cast!
    const subData: SVGPathShorthandQuadraticCurveToCommand = data.slice(5) as SVGPathShorthandQuadraticCurveToCommand;
    // var lastQuadraticControlPoint = { x: Number(data[1]), y: Number(data[2]) };
    if (subData[0] === "T") {
      // _handleShorthandQuadraticCurveTo(subData, false, firstPoint, lastPoint, lastControlPoint, lastQuadraticControlPoint, result);
      _handleShorthandQuadraticCurveTo(
        subData,
        false,
        firstPoint,
        lastPoint,
        lastControlPoint,
        localLastQuadraticControlPoint,
        result
      );
    } else if (subData[0] === "t") {
      // _handleShorthandQuadraticCurveTo(subData, true, firstPoint, lastPoint, lastControlPoint, lastQuadraticControlPoint, result);
      _handleShorthandQuadraticCurveTo(
        subData,
        true,
        firstPoint,
        lastPoint,
        lastControlPoint,
        localLastQuadraticControlPoint,
        result
      );
    }
  }
};

// This is a helper function and works only in combination with Quadratic Bézier Curves
// T|t (x y)+
const _handleShorthandQuadraticCurveTo = (
  data: SVGPathShorthandQuadraticCurveToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  lastQuadraticControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  if (data.length < 3) {
    throw "Unsufficient params for SHORTHANDQUADRATICCURVETO";
  }
  var i = 1;
  while (i + 1 < data.length) {
    // Respect multiple 'T|t' commands here
    if (data[i] === "T" || data[i] === "t") {
      i++;
      continue;
    }
    const curve = new CubicBezierCurve(
      new Vertex(lastPoint),
      new Vertex(lastPoint),
      new Vertex(lastPoint),
      new Vertex(lastPoint)
    );
    if (isRelative) {
      curve.endPoint.x += Number(data[i]);
      curve.endPoint.y += Number(data[i + 1]);
      curve.startControlPoint.x += curve.startPoint.x - (lastQuadraticControlPoint.x - lastPoint.x);
      curve.startControlPoint.y += curve.startPoint.y - (lastQuadraticControlPoint.y - lastPoint.y);
    } else {
      curve.endPoint.x = Number(data[i]);
      curve.endPoint.y = Number(data[i + 1]);
      curve.startControlPoint.x = curve.startPoint.x - (lastQuadraticControlPoint.x - lastPoint.x);
      curve.startControlPoint.y = curve.startPoint.y - (lastQuadraticControlPoint.y - lastPoint.y);
    }
    // First handle as symmetrical cubic curve
    curve.endControlPoint.x = curve.startControlPoint.x;
    curve.endControlPoint.y = curve.startControlPoint.y;
    lastQuadraticControlPoint.y = curve.endControlPoint.y;
    lastQuadraticControlPoint.x = curve.endControlPoint.x;

    // Convert quadratic curve to cubic curve
    var scaleFactor = 0.666; // i === 1 ? 0.666 : 1.0;
    curve.startControlPoint.x = curve.startPoint.x + (curve.startControlPoint.x - curve.startPoint.x) * scaleFactor;
    curve.startControlPoint.y = curve.startPoint.y + (curve.startControlPoint.y - curve.startPoint.y) * scaleFactor;
    curve.endControlPoint.x = curve.endPoint.x + (curve.endControlPoint.x - curve.endPoint.x) * scaleFactor;
    curve.endControlPoint.y = curve.endPoint.y + (curve.endControlPoint.y - curve.endPoint.y) * scaleFactor;

    //   console.log("ADDING T CURVE", curve);
    result.push(curve);
    lastPoint.x = curve.endPoint.x;
    lastPoint.y = curve.endPoint.y;
    lastControlPoint.x = curve.endControlPoint.x;
    lastControlPoint.y = curve.endControlPoint.y;
    if (isNaN(firstPoint.x)) {
      firstPoint.x = curve.startPoint.x;
      firstPoint.y = curve.startPoint.y;
    }

    i += 2;
  }
};

// The S|s x2 y2 x y
const _handleShorthandCubicCurveTo = (
  data: SVGPathShorthandCubicCurveToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  //   console.log("Handle SHORTHANDCUBICBEZIERTO", data);
  if (data.length < 5) {
    throw "Unsufficient params for SHORTHANDCUBICBEZIERTO";
  }
  const curve = new CubicBezierCurve(new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint), new Vertex(lastPoint));

  if (isRelative) {
    curve.startControlPoint.x = lastPoint.x - (lastControlPoint.x - lastPoint.x);
    curve.startControlPoint.y = lastPoint.y - (lastControlPoint.y - lastPoint.y);
    curve.endControlPoint.x += Number(data[1]);
    curve.endControlPoint.y += Number(data[2]);
    curve.endPoint.x += Number(data[3]);
    curve.endPoint.y += Number(data[4]);
  } else {
    curve.startControlPoint.x = lastPoint.x - (lastControlPoint.x - lastPoint.x);
    curve.startControlPoint.y = lastPoint.y - (lastControlPoint.y - lastPoint.y);
    curve.endControlPoint.x = Number(data[1]);
    curve.endControlPoint.y = Number(data[2]);
    curve.endPoint.x = Number(data[3]);
    curve.endPoint.y = Number(data[4]);
  }

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
const _handleArcTo = (
  data: SVGPathArcToCommand,
  isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  if (data.length < 8) {
    throw "Unsufficient params for ARCTO";
  }

  for (var i = 1; i + 6 < data.length; i += 7) {
    const arcEndPoint = { x: Number(data[i + 5]), y: Number(data[i + 6]) };
    if (isRelative) {
      arcEndPoint.x += lastPoint.x;
      arcEndPoint.y += lastPoint.y;
    }
    // console.log(
    //   "ARC",
    //   "data.length",
    //   data.length,
    //   "i",
    //   i,
    //   "lastPoint.x",
    //   lastPoint.x, // x1
    //   "lastPoint.y",
    //   lastPoint.y, // y1
    //   "data[i]",
    //   Number(data[i]), // rx
    //   "data[i+1]",
    //   Number(data[i + 1]), // ry
    //   "data[i+2]",
    //   Number(data[i + 2]), // phi: number,
    //   "data[i+3]",
    //   Boolean(data[i + 3]), // fa: boolean,
    //   "data[i+4]",
    //   Boolean(data[i + 4]), // fs: boolean,
    //   "data[i+5]",
    //   arcEndPoint.x, // Number(data[6]), // x2: number,
    //   "data[i+6]",
    //   arcEndPoint.y // Number(data[7]) // y2: number
    // );
    // A 5 4 0 1 1 -10 -5
    // TODO: respect relative/absolute here
    const ellipseSector = VEllipseSector.ellipseSectorUtils.endpointToCenterParameters(
      lastPoint.x,
      lastPoint.y,
      Number(data[i]),
      Number(data[i + 1]),
      Number(data[i + 2]) * DEG_TO_RAD,
      Boolean(data[i + 3]),
      Boolean(data[i + 4]),
      arcEndPoint.x,
      arcEndPoint.y // Number(data[7]) // y2: number
    );

    //   console.log("ellipseSector", ellipseSector);
    const curves = ellipseSector.toCubicBezier(4); // 4 segments already seems to be a good approximation
    for (var j = 0; j < curves.length; j++) {
      result.push(curves[j]); // Destruct!
    }
    // result.push(ellipseSector.ellipse);
    if (curves.length > 0) {
      // console.log("curves", curves);
      const lastCurve = curves[curves.length - 1];
      // lastPoint.x = lastCurve.endPoint.x;
      // lastPoint.y = lastCurve.endPoint.y;
      lastControlPoint.x = lastCurve.endControlPoint.x;
      lastControlPoint.y = lastCurve.endControlPoint.y;
      if (isNaN(firstPoint.x)) {
        firstPoint.x = curves[0].startPoint.x;
        firstPoint.y = curves[0].startPoint.y;
      }
    }
    lastPoint.x = arcEndPoint.x;
    lastPoint.y = arcEndPoint.y;
  } // END for
  // TODO: track first/last/control point
};

const _handleClosePath = (
  _data: SVGPathCloseCommand,
  _isRelative: boolean,
  firstPoint: XYCoords,
  lastPoint: XYCoords,
  lastControlPoint: XYCoords,
  result: Array<Line | CubicBezierCurve>
) => {
  //   console.log("Handle CLOSEPATH", "lastPoint", lastPoint, "firstPoint", firstPoint);
  const line = new Line(new Vertex(lastPoint), new Vertex(firstPoint));
  result.push(line);

  lastPoint.x = line.b.x;
  lastPoint.y = line.b.y;
  lastControlPoint.x = line.b.x;
  lastControlPoint.y = line.b.y;
};
