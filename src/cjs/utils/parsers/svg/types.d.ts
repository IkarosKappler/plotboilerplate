/**
 * Defining some basic SVG command types.
 *
 * As these types do not define all very possible path data strings they should cover the most daily use-cases.
 *
 * For more insight see
 *    https://www.w3.org/TR/SVG/paths.html
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-12-21 (winter solstice night – yes the days & nights are dark and I have nothing else to do)
 * @modified 2023-01-17 Added multiple parameter sets.
 * @version  0.0.2-alpha
 */
export type NumericString = `${number}`;
export type BooleanString = "0" | "1" | `${boolean}`;
export type SVGPathMoveToCommand = ["M" | "m", NumericString, NumericString];
export type SVGPathLineToCommand = ["L" | "l", NumericString, NumericString, ...Array<NumericString>];
export type SVGPathVerticalLineToCommand = ["V" | "v", NumericString];
export type SVGPathHorizontalLineToCommand = ["H" | "h", NumericString];
export type SVGPathQuadraticCurveToCommand = ["Q" | "q", NumericString, NumericString, NumericString, NumericString] | [
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
export type SVGPathShorthandCubicCurveToCommand = [
    "S" | "s",
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    ...Array<NumericString>
];
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
export type SVGPathCloseCommand = ["Z" | "z"];
export type SVGPathShorthandQuadraticCurveToCommand = ["T" | "t", NumericString, NumericString, ...Array<NumericString>];
export type SVGPathCommand = SVGPathMoveToCommand | SVGPathLineToCommand | SVGPathVerticalLineToCommand | SVGPathHorizontalLineToCommand | SVGPathQuadraticCurveToCommand | SVGPathCubicCurveToCommand | SVGPathShorthandCubicCurveToCommand | SVGPathArcToCommand | SVGPathCloseCommand;
