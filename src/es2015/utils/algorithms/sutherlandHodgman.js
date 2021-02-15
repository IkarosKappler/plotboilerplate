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
const inside = (cp1, cp2, p) => {
    return (cp2.x - cp1.x) * (p.y - cp1.y) > (cp2.y - cp1.y) * (p.x - cp1.x);
};
/**
 * @param {XYCoords}
 * @param {XYCoords}
 * @param {XYCoords}
 * @param {XYCoords}
 */
const intersection = (cp1, cp2, s, e) => {
    const dc = {
        x: cp1.x - cp2.x,
        y: cp1.y - cp2.y
    };
    const dp = {
        x: s.x - e.x,
        y: s.y - e.y
    };
    const n1 = cp1.x * cp2.y - cp1.y * cp2.x;
    const n2 = s.x * e.y - s.y * e.x;
    const n3 = 1.0 / (dc.x * dp.y - dc.y * dp.x);
    return { x: (n1 * dp.x - n2 * dc.x) * n3,
        y: (n1 * dp.y - n2 * dc.y) * n3
    };
};
/**
 * @param {Array<XYCoords>} subjectPolygon - Can be any polygon.
 * @param {Array<XYCoords>} clipPolygon - Must be convex.
 */
const sutherlandHodgman = (subjectPolygon, clipPolygon) => {
    let cp1 = clipPolygon[clipPolygon.length - 1];
    let cp2;
    let s;
    let e;
    let outputList = subjectPolygon;
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