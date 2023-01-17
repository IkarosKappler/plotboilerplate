/**
 * Split SVG path data `d` strings.
 *
 * As this helper function does not detect all possible path data strings it should cover the most daily use-cases.
 *
 * For more insight see
 *    https://www.w3.org/TR/SVG/paths.html
 *
 * @author   Ikaros Kappler
 * @date     2022-11-22
 * @modified 2022-12-21 Ported to Typescript
 * @version  0.0.1-alpha
 */
/**
 * @name splitSVGPathData
 * @static
 * @param {string} dataString - The SVG path data to split. This should be some string
 **/
export const splitSVGPathData = (dataString) => {
    // I used a modified version of this Josh Frank's SVG path data RexEx.
    // Source
    //    https://javascript.plainenglish.io/june-3-parsing-and-validating-svg-paths-with-regex-7bd0e245115
    // const validCommand =
    // /([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;
    //
    // My Version allows multiple param sets, too, like 'm|M (x y)+' or 'q|Q (x1 y1 x y)+'. Look at the plus.
    const validCommand = /([ml]((\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))+)|([hv]((\s?-?((\d+(\.\d+)?)|(\.\d+))))+)|(c((\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})+)|(q((\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})+(\s?(t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)+)|(a((\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})+)|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;
    const dataElements = dataString.match(validCommand);
    if (!dataElements) {
        return null;
    }
    const result = [];
    var i = 0;
    while (i < dataElements.length) {
        const token = dataElements[i];
        // Ctwheels comment was really useful here
        //    https://stackoverflow.com/questions/47801455/what-is-the-regex-that-properly-splits-svg-d-attributes-into-tokens
        const dataRaw = token.match(/-?(?:\d*\.)?\d+|[a-z]/gi);
        if (dataRaw) {
            result.push(dataRaw);
        }
        else {
            // throw Error?
        }
        i++;
    }
    return result;
}; // END splitSVGPathData
//# sourceMappingURL=splitSVGPathData.js.map