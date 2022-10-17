"use strict";
/**
 * A function to detect connected paths on the plane given by a random set of segments.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPaths = void 0;
var GenericPath_1 = require("../datastructures/GenericPath");
var arrayFill_1 = require("./arrayFill");
var locateUnvisitedSegment = function (segments, isSegmentVisited) {
    for (var i = 0; i < segments.length; i++) {
        if (!isSegmentVisited[i]) {
            return i;
        }
    }
    return -1;
};
var getAdjacentSegment = function (segments, isSegmentVisited, currentSegment, epsilon) {
    for (var j = 0; j < segments.length; j++) {
        if (isSegmentVisited[j]) {
            continue;
        }
        var nextSegment = segments[j];
        // [start]---[end] [start]---[end]
        if (currentSegment.getEndPoint().distance(nextSegment.getStartPoint()) < epsilon) {
            return nextSegment;
        }
        // [start]---[end] [end]---[start]
        else if (currentSegment.getEndPoint().distance(nextSegment.getEndPoint()) < epsilon) {
            return nextSegment.revert();
        }
    }
    return null;
};
var detectAdjacentPath = function (segments, isSegmentVisited, currentSegmentIndex, epsilon) {
    var currentSegment = segments[currentSegmentIndex];
    isSegmentVisited[currentSegmentIndex] = true;
    var path = new GenericPath_1.GenericPath(currentSegment); // { segments: [currentSegment], reverse };
    var i = 0;
    // Find a good condition for this loop
    while (i < segments.length && currentSegment) {
        currentSegment = getAdjacentSegment(segments, isSegmentVisited, currentSegment, epsilon);
        i++;
    }
    return path;
};
var detectPaths = function (segments) {
    var isSegmentVisited = arrayFill_1.arrayFill(segments.length, false);
    //   const unvisitedSegments = new Set<PathSegment>(segments);
    var resultPaths = [];
    var nextSegmentIndex = -1;
    var i = 0;
    while ((nextSegmentIndex = locateUnvisitedSegment(segments, isSegmentVisited)) !== -1 && i < segments.length) {
        // const nextSegment = segments[nextSegmentIndex];
        isSegmentVisited[nextSegmentIndex] = true;
        // A safety break (to avoid infinited loops during development).
        i++;
        var path = detectAdjacentPath(segments, isSegmentVisited, nextSegmentIndex, 0.1);
        i += path.getSegmentCount() - 1;
    }
    return resultPaths;
};
exports.detectPaths = detectPaths;
//# sourceMappingURL=detectPaths.js.map