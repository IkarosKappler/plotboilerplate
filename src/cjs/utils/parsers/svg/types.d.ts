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
export declare type NumericString = `${number}`;
export declare type BooleanString = "0" | "1" | `${boolean}`;
export declare type SVGPathMoveToCommand = ["M" | "m", NumericString, NumericString];
export declare type SVGPathLineToCommand = ["L" | "l", NumericString, NumericString, ...Array<NumericString>];
export declare type SVGPathVerticalLineToCommand = ["V" | "v", NumericString];
export declare type SVGPathHorizontalLineToCommand = ["H" | "h", NumericString];
export declare type SVGPathQuadraticCurveToCommand = ["Q" | "q", NumericString, NumericString, NumericString, NumericString] | ["Q" | "q", NumericString, NumericString, NumericString, NumericString, "T" | "t", NumericString, NumericString];
export declare type SVGPathCubicCurveToCommand = [
    "C" | "c",
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString
];
export declare type SVGPathShorthandCubicCurveToCommand = ["S" | "s", NumericString, NumericString, NumericString, NumericString];
export declare type SVGPathArcToCommand = [
    "A" | "a",
    NumericString,
    NumericString,
    NumericString,
    BooleanString,
    BooleanString,
    NumericString,
    NumericString
];
export declare type SVGPathCloseCommand = ["Z" | "z"];
export declare type SVGPathShorthandQuadraticCurveToCommand = ["T" | "t", NumericString, NumericString];
export declare type SVGPathCommand = SVGPathMoveToCommand | SVGPathLineToCommand | SVGPathVerticalLineToCommand | SVGPathHorizontalLineToCommand | SVGPathQuadraticCurveToCommand | SVGPathCubicCurveToCommand | SVGPathShorthandCubicCurveToCommand | SVGPathArcToCommand | SVGPathCloseCommand;
