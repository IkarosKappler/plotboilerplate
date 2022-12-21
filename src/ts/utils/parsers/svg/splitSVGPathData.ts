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

import { SVGPathCommand } from "./types";

/**
 * @name splitSVGPathData
 * @static
 * @param {string} dataString - The SVG path data to split. This should be some string
 **/
export const splitSVGPathData = (dataString: string): Array<SVGPathCommand> | null => {
  // Source
  //    https://javascript.plainenglish.io/june-3-parsing-and-validating-svg-paths-with-regex-7bd0e245115
  const validCommand =
    /([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;

  const dataElements = dataString.match(validCommand);
  // console.log("Splitted: ", dataElements);
  if (!dataElements) {
    return null;
  }

  const result: Array<SVGPathCommand> = [];

  var i = 0;
  while (i < dataElements.length) {
    const token = dataElements[i];
    // var data = token.split(/[\s,]/);
    // console.log("Token", token);
    const dataRaw = token.match(/-?(?:\d*\.)?\d+|[a-z]/gi);
    // console.log("dataRaw", dataRaw);
    if (dataRaw) {
      // var dataFiltered = dataRaw.filter(function (n) {
      //   return n != "";
      // });
      // console.log("dataFiltered", dataRaw);
      // const cmd = dataRaw[0];
      result.push(dataRaw as SVGPathCommand);
    } else {
      // throw Error?
    }
    i++;
  }
  return result;
}; // END splitSVGPathData
