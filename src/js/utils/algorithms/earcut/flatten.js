"use strict";
// Original algorithms by https://github.com/mapbox/earcut
//  
// @date 2020-12-08
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = void 0;
;
// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
var flatten = function (data) {
    var dim = data[0][0].length;
    var result = { vertices: [], holes: [], dimensions: dim };
    var holeIndex = 0;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) {
                result.vertices.push(data[i][j][d]);
            }
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};
exports.flatten = flatten;
//# sourceMappingURL=flatten.js.map