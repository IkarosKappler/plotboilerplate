"use strict";

/**
 * The Sutherland-Hodgman convex polygon clipping algorithm.
 *
 * Converted to Vertex variant {x:number,y:number} by Ikaros Kappler.
 *
 * @date    2021-01-29
 * @version 1.0.0

// Original version:
// https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
function sutherlandHodgman (subjectPolygon, clipPolygon) {
 
            var cp1, cp2, s, e;
            var inside = function (p) {
                return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
            };
            var intersection = function () {
                var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
                    dp = [ s[0] - e[0], s[1] - e[1] ],
                    n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
                    n2 = s[0] * e[1] - s[1] * e[0], 
                    n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
                return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
            };
            var outputList = subjectPolygon;
            cp1 = clipPolygon[clipPolygon.length-1];
            for (var j in clipPolygon) {
                var cp2 = clipPolygon[j];
                var inputList = outputList;
                outputList = [];
                s = inputList[inputList.length - 1]; //last on the input list
                for (var i in inputList) {
                    var e = inputList[i];
                    if (inside(e)) {
                        if (!inside(s)) {
                            outputList.push(intersection());
                        }
                        outputList.push(e);
                    }
                    else if (inside(s)) {
                        outputList.push(intersection());
                    }
                    s = e;
                }
                cp1 = cp2;
            }
            return outputList
        }
*/


/**
 * @param {Array<Vertex>} subjectPolygon
 * @param {Array<Vertex>} clipPolygon
 */
var sutherlandHodgman = function(subjectPolygon, clipPolygon) {
    
    var cp1, cp2, s, e;
    /**
     * @param {Vertex}
     * @param {Vertex}
     **/
    
    var inside = function (_cp1,_cp2,p) {
        return (_cp2[0]-_cp1[0])*(p[1]-_cp1[1]) > (_cp2[1]-_cp1[1])*(p[0]-_cp1[0]);
    };
    
    var intersection = function (_cp1,_cp2,_s,_e) {
        var dc = [ _cp1[0] - _cp2[0], _cp1[1] - _cp2[1] ],
            dp = [ _s[0] - _e[0], _s[1] - _e[1] ],
            n1 = _cp1[0] * _cp2[1] - _cp1[1] * _cp2[0],
            n2 = _s[0] * _e[1] - _s[1] * _e[0], 
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
    };
    
    var outputList = subjectPolygon;
    cp1 = clipPolygon[clipPolygon.length-1];
    
    for (var j in clipPolygon) {
        var cp2 = clipPolygon[j];
        var inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1]; //last on the input list
        for (var i in inputList) {
            var e = inputList[i];
            if (inside(cp1,cp2,e)) {
                if (!inside(cp1,cp2,s)) {
                    outputList.push(intersection(cp1,cp2,s,e));
                }
                outputList.push(e);
            }
            else if (inside(cp1,cp2,s)) {
                outputList.push(intersection(cp1,cp2,s,e));
            }
            s = e;
        }
        cp1 = cp2;
    }
    return outputList
}
