/**
 * Split SVG path data `d` strings.
 *
 * @date 2022-11-22
 *
 * @name splitSVGPathData
 * @static
 * @param {string} data - The data to split.
 */

(function (_context) {
  function splitSVGPathData(dataString) {
    // Source
    //    https://javascript.plainenglish.io/june-3-parsing-and-validating-svg-paths-with-regex-7bd0e245115
    const validCommand =
      /([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;
    var dataElements = dataString.match(validCommand);
    console.log("data array", dataElements);
    // Scale and translate {x,y}

    // Array<Array<string>>
    var result = [];

    var i = 0;
    var firstPoint = { x: NaN, y: NaN };
    var lastPoint = { x: NaN, y: NaN };
    var lastControlPoint = { x: NaN, y: NaN };
    // "save last point"
    // var _slp = index => {
    //   lastPoint.x = Number(dataElements[index]);
    //   lastPoint.y = Number(dataElements[index + 1]);
    // };
    while (i < dataElements.length) {
      var token = dataElements[i];
      var data = token.split(/[\s,]/);
      const cmd = data[0];
      result.push(data);
      i++;
    }
    return result;
  } // END splitSVGPathData

  _context.splitSVGPathData = splitSVGPathData;
})(globalThis);
