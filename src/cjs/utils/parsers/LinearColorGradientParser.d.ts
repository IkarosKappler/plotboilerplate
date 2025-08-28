import { ColorGradient } from "../datastructures/ColorGradient";
export type ColorGradientParserRegExpLib = {
    gradientSearch: RegExp;
    colorStopSearch: RegExp;
};
export type ColorGradientParseResult = {
    original: string;
    line: string;
    angle: string;
    colorStopList: ColorGradientStopResult[];
    sideCorner: string;
    gradientType?: string;
    parseWarning?: boolean;
};
export type ColorGradientStopResult = {
    color: string;
    position: string;
};
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
export declare class LinearColorGradientParser {
    private readonly regExpLib;
    constructor(regExpLib?: ColorGradientParserRegExpLib);
    parse(input: string): ColorGradient;
    parseRaw(input: string): ColorGradientParseResult;
    static parseResultToColorGradient(result: ColorGradientParseResult): ColorGradient;
    private static parsePosition;
}
