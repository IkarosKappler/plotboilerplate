/**
 * Split SVG path data `d` strings.
 *
 * @date 2022-11-22
 *
 * @name splitSVGPathData
 * @static
 * @param {string} data - The data to split.
 * @DEPRECATED Ported to Typescript. See ./src/cjs/utils/parsers/svg/splitSVGPathData.js
 */

(function (_context) {
  function splitSVGPathData(dataString) {
    // Source
    //    https://javascript.plainenglish.io/june-3-parsing-and-validating-svg-paths-with-regex-7bd0e245115
    // const validCommand =
    //   /([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;
    const validCommand =
      /([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2})|(s(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3})|z/gi;

    var dataElements = dataString.match(validCommand);
    // console.log("data array", dataElements);
    // Scale and translate {x,y}

    // Array<Array<string>>
    var result = [];

    var i = 0;

    var i = 0;
    while (i < dataElements.length) {
      var token = dataElements[i];
      // var data = token.split(/[\s,]/);
      console.log("Token", token);
      // var dataRaw = token.match(/-?\d*(\.\d+)?/g);
      // var dataRaw = token.match(/(\D){1}-?\d*(\.\d+)?/g);
      // var dataRaw = token.split(/(?<=\d)(?=\D)|(?<=\D)(?=\d)/);
      var dataRaw = token.match(/-?(?:\d*\.)?\d+|[a-z]/gi);
      console.log("dataRaw", dataRaw);
      if (dataRaw) {
        var dataFiltered = dataRaw.filter(function (n) {
          return n != "";
        });
        console.log("dataFiltered", dataFiltered);
        const cmd = dataFiltered[0];
        result.push(dataFiltered);
      } else {
        // throw Error?
      }
      i++;
    }
    return result;

    // return result;
  } // END splitSVGPathData

  _context.splitSVGPathData = splitSVGPathData;
})(globalThis);
