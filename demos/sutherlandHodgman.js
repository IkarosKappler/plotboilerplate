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
 * @param {Array<Vertex>} clipPolygon - Must be convex.
 */
var sutherlandHodgman = function(subjectPolygon, clipPolygon) {
    
    var cp1, cp2, s, e;
    /**
     * @param {Vertex}
     * @param {Vertex}
     **/

    /* var inside = function (p) {
                return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
            }; */
    var inside = function (_cp1,_cp2,p) {
	// console.log('x', _cp1);
        return (_cp2.x-_cp1.x)*(p.y-_cp1.y) > (_cp2.y-_cp1.y)*(p.x-_cp1.x);
    };

    /* var intersection = function () {
                var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
                    dp = [ s[0] - e[0], s[1] - e[1] ],
                    n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
                    n2 = s[0] * e[1] - s[1] * e[0], 
                    n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
                return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
            }; */
    var intersection = function (_cp1,_cp2,_s,_e) {
        var
	// dc = [ _cp1.x - _cp2.x, _cp1[1] - _cp2[1] ],
	dc = { x:  _cp1.x - _cp2.x, y : _cp1.y - _cp2.y },
        // dp = [ _s.x - _e.x, _s[1] - _e[1] ],
	dp = { x: _s.x - _e.x, y : _s.y - _e.y },
            n1 = _cp1.x * _cp2.y - _cp1.y * _cp2.x,
            n2 = _s.x * _e.y - _s.y * _e.x, 
            n3 = 1.0 / (dc.x * dp.y - dc.y * dp.x);
        return { x : (n1*dp.x - n2*dc.x) * n3, y : (n1*dp.y - n2*dc.y) * n3 };
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
