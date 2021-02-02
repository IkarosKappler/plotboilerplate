"use strict";
/**
 * The Sutherland-Hodgman convex polygon clipping algorithm.
 *
 * Original version:
 *    https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 *
 * @author  Ikaros Kappler (ported to TypeScript with {x,y} vertices).
 * @date    2021-01-29
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sutherlandHodgman = void 0;
/**
 * @param {XYCoords}
 * @param {XYCoords}
 **/
var inside = function (cp1, cp2, p) {
    return (cp2.x - cp1.x) * (p.y - cp1.y) > (cp2.y - cp1.y) * (p.x - cp1.x);
};
/**
 * @param {XYCoords}
 * @param {XYCoords}
 * @param {XYCoords}
 * @param {XYCoords}
 */
var intersection = function (cp1, cp2, s, e) {
    var dc = {
        x: cp1.x - cp2.x,
        y: cp1.y - cp2.y
    };
    var dp = {
        x: s.x - e.x,
        y: s.y - e.y
    };
    var n1 = cp1.x * cp2.y - cp1.y * cp2.x;
    var n2 = s.x * e.y - s.y * e.x;
    var n3 = 1.0 / (dc.x * dp.y - dc.y * dp.x);
    return { x: (n1 * dp.x - n2 * dc.x) * n3,
        y: (n1 * dp.y - n2 * dc.y) * n3
    };
};
/**
 * @param {Array<XYCoords>} subjectPolygon - Can be any polygon.
 * @param {Array<XYCoords>} clipPolygon - Must be convex.
 */
var sutherlandHodgman = function (subjectPolygon, clipPolygon) {
    var cp1 = clipPolygon[clipPolygon.length - 1];
    var cp2;
    var s;
    var e;
    var outputList = subjectPolygon;
    for (var j in clipPolygon) {
        cp2 = clipPolygon[j];
        var inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1]; // last on the input list
        for (var i in inputList) {
            e = inputList[i];
            if (inside(cp1, cp2, e)) {
                if (!inside(cp1, cp2, s)) {
                    outputList.push(intersection(cp1, cp2, s, e));
                }
                outputList.push(e);
            }
            else if (inside(cp1, cp2, s)) {
                outputList.push(intersection(cp1, cp2, s, e));
            }
            s = e;
        }
        cp1 = cp2;
    }
    return outputList;
};
exports.sutherlandHodgman = sutherlandHodgman;
//# sourceMappingURL=sutherlandHodgman.js.map