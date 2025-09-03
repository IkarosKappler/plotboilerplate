import { ColorGradient } from "../datastructures/ColorGradient";
/**
 * A wrapper type for the regular expressions used to parsed gradient strings.
 */
export type ColorGradientParserRegExpLib = {
    gradientSearch: RegExp;
    colorStopSearch: RegExp;
};
/**
 * The raw parse result.
 */
export type ColorGradientParseResult = {
    original: string;
    line: string;
    angle: string;
    colorStopList: ColorGradientStopResult[];
    sideCorner: string;
    gradientType?: string;
    parseWarning?: boolean;
};
/**
 * The position string can have two formats: as percent or as pixels.
 * For conversion to LinearColorGradient only relative (percent) is supported.
 */
type PositionString = `${number}px` | `${number}%`;
/**
 * A sub type of the result representing pairs of (color,position) elements.
 */
type ColorGradientStopResult = {
    color: string;
    position: PositionString;
};
/**
 * This must convert positioning strings to ratio numbers (in [0..1]).
 * Must throw error if not parsable.
 */
export type PositionToRatioConverter = (positionString: PositionString) => number;
/**
 * The default implementation of `PositionToRatioConverter`.
 * @param positionString
 * @returns
 */
export declare const DefaultPositionConverter: PositionToRatioConverter;
/**
 * Actually parse the input gradient parameters string into an object for reusability.
 *
 *
 * @note Really this only supports the standard syntax not historical versions, see MDN for details
 *       https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient
 *
 * @param {ColorGradientParserRegExpLib} regExpLib
 * @param {string} input Input string in the form "to right bottom, #FF0 0%, red 20px, rgb(0, 0, 255) 100%"
 * @returns {object|undefined} Object containing break down of input string including array of stop points.
 */
export declare var __parseGradient: (regExpLib: ColorGradientParserRegExpLib, input: string) => ColorGradientParseResult;
/**
 * The actual parser class.
 */
export declare class LinearColorGradientParser {
    private readonly regExpLib;
    constructor(regExpLib?: ColorGradientParserRegExpLib);
    parse(input: string, positionConverter?: PositionToRatioConverter): ColorGradient;
    parseRaw(input: string): ColorGradientParseResult;
    static parseResultToColorGradient(result: ColorGradientParseResult, positionConverter?: PositionToRatioConverter): ColorGradient;
}
export {};
