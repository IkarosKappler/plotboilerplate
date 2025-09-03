import { Color } from "../datastructures/Color";
import { ColorGradient, ColorGradientItem, ColorGradientRotation } from "../datastructures/ColorGradient";

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
  position: PositionString; // '56.5%' or '20px'
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
export const DefaultPositionConverter: PositionToRatioConverter = (positionString: PositionString): number => {
  if (typeof positionString === "undefined") {
    throw new Error("Cannot parse positioning string `null`.");
  }
  const tmp: string = positionString.trim();
  if (tmp.length === 0) {
    throw new Error('Cannot parse empty positioning string "".');
  }
  if (!tmp.endsWith("%")) {
    throw new Error(`Cannot parse positioning string, must end with '%': '${tmp}'`);
  }
  return Number.parseFloat(tmp) / 100.0;
};

/**
 * Utility combine multiple regular expressions.
 *
 * Source:
 *  https://stackoverflow.com/questions/20215440/parse-css-gradient-rule-with-javascript-regex
 * Thanks to Dean Taylor
 *
 * @param {Array<RegExp | string>} regexpList List of regular expressions or strings.
 * @param {string} flags Normal RegExp flags.
 */
const __combineRegExp = (regexpList: Array<RegExp | string>, flags: string): RegExp => {
  var source: string = "";
  for (var i = 0; i < regexpList.length; i++) {
    const regex = regexpList[i];
    if (typeof regex === "string") {
      source += regex;
    } else {
      source += regex.source;
    }
  }
  return new RegExp(source, flags);
};

/**
 * Generate the required regular expressions once.
 *
 * Regular Expressions are easier to manage this way and can be well described.
 *
 * @result {object} Object containing regular expressions.
 */
const __generateDefaultRegExpLib = (): ColorGradientParserRegExpLib => {
  // Note any variables with "Capture" in name include capturing bracket set(s).
  const searchFlags = "gi", // ignore case for angles, "rgb" etc
    rAngle = /(?:[+-]?\d*\.?\d+)(?:deg|grad|rad|turn)/, // Angle +ive, -ive and angle types
    rSideCornerCapture = /to\s+((?:(?:left|right)(?:\s+(?:top|bottom))?))/, // optional 2nd part
    rComma = /\s*,\s*/, // Allow space around comma.
    rColorHex = /\#(?:[a-f0-9]{6}|[a-f0-9]{3})/, // 3 or 6 character form
    rDigits3 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*\)/, // "(1, 2, 3)"
    rDigits4 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*\d*\.?\d+\)/, // "(1, 2, 3, 4)"
    rValue = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/, // ".9", "-5px", "100%".
    rKeyword = /[_a-z-][_a-z0-9-]*/, // "red", "transparent", "border-collapse".
    rColor = __combineRegExp(
      ["(?:", rColorHex, "|", "(?:rgb|hsl)", rDigits3, "|", "(?:rgba|hsla)", rDigits4, "|", rKeyword, ")"],
      ""
    ),
    rColorStop = __combineRegExp([rColor, "(?:\\s+", rValue, "(?:\\s+", rValue, ")?)?"], ""), // Single Color Stop, optional %, optional length.
    rColorStopList = __combineRegExp(["(?:", rColorStop, rComma, ")*", rColorStop], ""), // List of color stops min 1.
    rLineCapture = __combineRegExp(["(?:(", rAngle, ")|", rSideCornerCapture, ")"], ""), // Angle or SideCorner
    rGradientSearch = __combineRegExp(["(?:(", rLineCapture, ")", rComma, ")?(", rColorStopList, ")"], searchFlags), // Capture 1:"line", 2:"angle" (optional), 3:"side corner" (optional) and 4:"stop list".
    rColorStopSearch = __combineRegExp(
      ["\\s*(", rColor, ")", "(?:\\s+", "(", rValue, "))?", "(?:", rComma, "\\s*)?"],
      searchFlags
    ); // Capture 1:"color" and 2:"position" (optional).

  return {
    gradientSearch: rGradientSearch,
    colorStopSearch: rColorStopSearch
  };
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
export var __parseGradient = (regExpLib: ColorGradientParserRegExpLib, input: string): ColorGradientParseResult => {
  var result: ColorGradientParseResult;
  var matchGradient: RegExpExecArray, matchColorStop: string[], stopResult: ColorGradientStopResult;

  // reset search position, because we reuse regex.
  regExpLib.gradientSearch.lastIndex = 0;

  matchGradient = regExpLib.gradientSearch.exec(input);
  if (matchGradient !== null) {
    result = {
      original: matchGradient[0],
      colorStopList: [],
      line: null,
      angle: null,
      sideCorner: null
    };

    // Line (Angle or Side-Corner).
    if (!!matchGradient[1]) {
      result.line = matchGradient[1];
    }
    // Angle or undefined if side-corner.
    if (!!matchGradient[2]) {
      result.angle = matchGradient[2];
    }
    // Side-corner or undefined if angle.
    if (!!matchGradient[3]) {
      result.sideCorner = matchGradient[3];
    }

    // reset search position, because we reuse regex.
    regExpLib.colorStopSearch.lastIndex = 0;

    // Loop though all the color-stops.
    matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4]);
    while (matchColorStop !== null) {
      stopResult = {
        color: matchColorStop[1],
        position: null
      };

      // Position (optional).
      if (!!matchColorStop[2]) {
        stopResult.position = matchColorStop[2] as PositionString;
      }
      result.colorStopList.push(stopResult);

      // Continue searching from previous position.
      matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4]);
    }
  }

  // Can be undefined if match not found.
  return result;
};

/**
 * The actual parser class.
 */
export class LinearColorGradientParser {
  private readonly regExpLib: ColorGradientParserRegExpLib;

  constructor(regExpLib?: ColorGradientParserRegExpLib) {
    this.regExpLib = regExpLib || __generateDefaultRegExpLib();
  }

  public parse(input: string, positionConverter?: PositionToRatioConverter): ColorGradient {
    const result: ColorGradientParseResult = this.parseRaw(input);

    return LinearColorGradientParser.parseResultToColorGradient(result, positionConverter);
  }

  public parseRaw(input: string): ColorGradientParseResult {
    var result: ColorGradientParseResult;
    const rGradientEnclosedInBrackets: RegExp = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/; // Captures inside brackets - max one additional inner set.
    const match: RegExpExecArray = rGradientEnclosedInBrackets.exec(input);

    const bracketPos = input.indexOf("(");
    const gradientType = bracketPos === -1 ? null : input.substring(0, bracketPos).toLowerCase();

    if (match !== null) {
      // Get the parameters for the gradient
      result = __parseGradient(this.regExpLib, match[1]);
      result.gradientType = gradientType;
      if (result.original.trim() !== match[1].trim()) {
        // Did not match the input exactly - possible parsing error.
        result.parseWarning = true;
      }
    } else {
      //   result = new Error("Failed to find gradient");
      throw new Error("Failed to find gradient");
    }

    return result;
  }

  public static parseResultToColorGradient(
    result: ColorGradientParseResult,
    positionConverter?: PositionToRatioConverter
  ): ColorGradient {
    if (!result.gradientType || result.gradientType.toLowerCase() != "linear-gradient") {
      throw new Error(`Cannot create linear gradient from type '${result.gradientType}'.`);
    }

    if (!result.colorStopList || result.colorStopList.length <= 1) {
      throw new Error(
        `Cannot create linear gradient from color stop list of length '${result.colorStopList.length}'. Too few elements.`
      );
    }

    const colorStops: Array<ColorGradientItem> = [];
    const converter: PositionToRatioConverter = positionConverter ?? DefaultPositionConverter;
    for (var i = 0; i < result.colorStopList.length; i++) {
      const stopListItem: ColorGradientStopResult = result.colorStopList[i];
      console.log(stopListItem);
      const color = Color.parse(stopListItem.color);

      // var position: number = LinearColorGradientParser.parsePosition(stopListItem.position);
      var ratio: number;
      if (typeof stopListItem.position === "undefined") {
        // Try to auto-fill undefined positions by their index in the list.
        ratio = i / (result.colorStopList.length - 1);
      } else {
        ratio = positionConverter(stopListItem.position);
      }
      colorStops.push({ color: color, ratio: ratio });
    }

    return new ColorGradient(colorStops, result.line as ColorGradientRotation);
  }
} // END class

// var test_this_one = function (regExpLib, input) {
//   var result,
//     rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/, // Captures inside brackets - max one additional inner set.
//     match = rGradientEnclosedInBrackets.exec(input);

//   if (match !== null) {
//     // Get the parameters for the gradient
//     result = parseGradient(regExpLib, match[1]);
//     if (result.original.trim() !== match[1].trim()) {
//       // Did not match the input exactly - possible parsing error.
//       result.parseWarning = true;
//     }
//   } else {
//     result = "Failed to find gradient";
//   }

//   return result;
// };
