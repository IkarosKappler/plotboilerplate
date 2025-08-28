import { Color } from "../datastructures/Color";
import { ColorGradient } from "../datastructures/ColorGradient";
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
const __combineRegExp = (regexpList, flags) => {
    var source = "";
    for (var i = 0; i < regexpList.length; i++) {
        const regex = regexpList[i];
        if (typeof regex === "string") {
            source += regex;
        }
        else {
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
const __generateDefaultRegExpLib = () => {
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
    rColor = __combineRegExp(["(?:", rColorHex, "|", "(?:rgb|hsl)", rDigits3, "|", "(?:rgba|hsla)", rDigits4, "|", rKeyword, ")"], ""), rColorStop = __combineRegExp([rColor, "(?:\\s+", rValue, "(?:\\s+", rValue, ")?)?"], ""), // Single Color Stop, optional %, optional length.
    rColorStopList = __combineRegExp(["(?:", rColorStop, rComma, ")*", rColorStop], ""), // List of color stops min 1.
    rLineCapture = __combineRegExp(["(?:(", rAngle, ")|", rSideCornerCapture, ")"], ""), // Angle or SideCorner
    rGradientSearch = __combineRegExp(["(?:(", rLineCapture, ")", rComma, ")?(", rColorStopList, ")"], searchFlags), // Capture 1:"line", 2:"angle" (optional), 3:"side corner" (optional) and 4:"stop list".
    rColorStopSearch = __combineRegExp(["\\s*(", rColor, ")", "(?:\\s+", "(", rValue, "))?", "(?:", rComma, "\\s*)?"], searchFlags); // Capture 1:"color" and 2:"position" (optional).
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
export var __parseGradient = (regExpLib, input) => {
    var result;
    var matchGradient, matchColorStop, stopResult;
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
        // console.log("matchGradient[0]", matchGradient);
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
                stopResult.position = matchColorStop[2];
            }
            result.colorStopList.push(stopResult);
            // Continue searching from previous position.
            matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[4]);
        }
    }
    // Can be undefined if match not found.
    return result;
};
export class LinearColorGradientParser {
    constructor(regExpLib) {
        this.regExpLib = regExpLib || __generateDefaultRegExpLib();
    }
    parse(input) {
        const result = this.parseRaw(input);
        return LinearColorGradientParser.parseResultToColorGradient(result);
    }
    parseRaw(input) {
        var result;
        const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/; // Captures inside brackets - max one additional inner set.
        const match = rGradientEnclosedInBrackets.exec(input);
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
        }
        else {
            //   result = new Error("Failed to find gradient");
            throw new Error("Failed to find gradient");
        }
        return result;
    }
    static parseResultToColorGradient(result) {
        if (!result.gradientType || result.gradientType.toLowerCase() != "linear-gradient") {
            throw new Error(`Cannot create linear gradient from type '${result.gradientType}'.`);
        }
        if (!result.colorStopList || result.colorStopList.length <= 1) {
            throw new Error(`Cannot create linear gradient from color stop list of length '${result.colorStopList.length}'. Too few elements.`);
        }
        const colorStops = [];
        for (var i = 0; i < result.colorStopList.length; i++) {
            const stopListItem = result.colorStopList[i];
            console.log(stopListItem);
            const color = Color.parse(stopListItem.color);
            var position = LinearColorGradientParser.parsePosition(stopListItem.position);
            if (typeof position === "undefined") {
                position = i / (result.colorStopList.length - 1);
            }
            colorStops.push({ color: color, ratio: position });
        }
        return new ColorGradient(colorStops);
    }
    static parsePosition(positionString) {
        if (!positionString || (positionString = positionString.trim()).length === 0) {
            return null;
        }
        // Example: "56.5%"
        if (!positionString.endsWith("%")) {
            return Number.parseFloat(positionString);
        }
        return Number.parseFloat(positionString) / 100.0;
    }
}
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
// var test_this_thing = function () {
//   var result = [],
//     regExpLib = generateDefaultRegExpLib(),
//     testSubjects = [
//       // Original question sample
//       "background-image:linear-gradient(to right bottom, #FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%);",
//       // Sample to test RGBA values (1)
//       "background-image:linear-gradient(to right bottom, rgba(255, 0, 0, .1) 0%, rgba(0, 255, 0, 0.9) 20px);",
//       // Sample to test optional gradient line
//       "background-image:linear-gradient(#FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%);",
//       // Angle, named colors
//       "background: linear-gradient(45deg, red, blue);",
//       // Gradient that starts at 60% of the gradient line
//       "background: linear-gradient(135deg, orange, orange 60%, cyan);",
//       // Gradient with multi-position color stops
//       "background: linear-gradient(to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%);"
//     ];
//   for (var i = 0; i < testSubjects.length; i++) {
//     result.push(test_this_one(regExpLib, testSubjects[i]));
//   }
//   console.log(result);
// };
// test_this_thing();
//# sourceMappingURL=LinearColorGradientParser.js.map