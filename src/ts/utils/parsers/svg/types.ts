/**
 * Defining some basic SVG command types.
 *
 * As these types do not define all very possible path data strings they should cover the most daily use-cases.
 *
 * For more insight see
 *    https://www.w3.org/TR/SVG/paths.html
 *
 *
 * @author  Ikaros Kappler
 * @date    2022-12-21 (winter solstice night – yes the days & nights are dark and I have nothing else to do)
 * @version 0.0.1-alpha
 */

export type NumericString = `${number}`;
export type BooleanString = "0" | "1" | `${boolean}`;

// Example: 'M', -10, -7.5,
export type SVGPathMoveToCommand = ["M" | "m", NumericString, NumericString];
// Example: 'L', 0, -10,
export type SVGPathLineToCommand = ["L" | "l", NumericString, NumericString, ...Array<NumericString>];
// Example: 'V', -10,
export type SVGPathVerticalLineToCommand = ["V" | "v", NumericString];
// Example: 'H', 10,
export type SVGPathHorizontalLineToCommand = ["H" | "h", NumericString];
// Example: 'Q', 5, 5, 0, 0,
// Example2: 'Q', 5, 5, 0, 0, 'T', -10, 0,
export type SVGPathQuadraticCurveToCommand =
  | ["Q" | "q", NumericString, NumericString, NumericString, NumericString]
  | [
      "Q" | "q",
      NumericString,
      NumericString,
      NumericString,
      NumericString,
      "T" | "t",
      NumericString,
      NumericString,
      ...Array<NumericString>
    ];
// Example: 'C', -5, -15, 10, -15, 5, -10,
export type SVGPathCubicCurveToCommand = [
  "C" | "c",
  NumericString,
  NumericString,
  NumericString,
  NumericString,
  NumericString,
  NumericString,
  ...Array<NumericString>
];
// Example: 'S', 15, 0, 10, 0,
export type SVGPathShorthandCubicCurveToCommand = [
  "S" | "s",
  NumericString,
  NumericString,
  NumericString,
  NumericString,
  ...Array<NumericString>
];
// Example: 'A', 5, 4, 0, 1, 1, -10, -5,
export type SVGPathArcToCommand = [
  "A" | "a",
  NumericString,
  NumericString,
  NumericString,
  BooleanString,
  BooleanString,
  NumericString,
  NumericString,
  ...Array<NumericString>
];
// Example: 'Z'
export type SVGPathCloseCommand = ["Z" | "z"];

// NOTE: this is not a standalone command. It is only valid in combination with the Q|q command!
// Example2: 'T', -10, 0,
export type SVGPathShorthandQuadraticCurveToCommand = ["T" | "t", NumericString, NumericString, ...Array<NumericString>];

export type SVGPathCommand =
  | SVGPathMoveToCommand
  | SVGPathLineToCommand
  | SVGPathVerticalLineToCommand
  | SVGPathHorizontalLineToCommand
  | SVGPathQuadraticCurveToCommand
  | SVGPathCubicCurveToCommand
  | SVGPathShorthandCubicCurveToCommand
  | SVGPathArcToCommand
  | SVGPathCloseCommand;
