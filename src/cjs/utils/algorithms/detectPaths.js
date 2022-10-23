"use strict";
/**
 * A function to detect connected paths on the plane given by a random set of segments.
 *
 * Note that is algorithm operates IN PLACE and will ALTER your INPUT array.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPaths = void 0;
var GenericPath_1 = require("../datastructures/GenericPath");
var initVisitationArray = function (segments, epsilon) {
    var result = []; // { visited: false, hasPredecessor: false }
    for (var i = 0; i < segments.length; i++) {
        result.push({ visited: false, hasPredecessor: false, hasSuccessor: false });
        for (var j = 0; j < segments.length; j++) {
            if (i === j) {
                continue;
            }
            if (segments[i].getStartPoint().distance(segments[j].getEndPoint()) < epsilon ||
                segments[i].getStartPoint().distance(segments[j].getStartPoint()) < epsilon) {
                result[i].hasPredecessor = true;
            }
            if (segments[i].getEndPoint().distance(segments[j].getEndPoint()) < epsilon ||
                segments[i].getEndPoint().distance(segments[j].getStartPoint()) < epsilon) {
                result[i].hasSuccessor = true;
            }
        }
    }
    for (var i = 0; i < segments.length; i++) {
        if (!result[i].hasSuccessor && result[i].hasPredecessor) {
            segments[i] = segments[i].reverse();
            result[i].hasPredecessor = false;
            result[i].hasSuccessor = true;
        }
    }
    return result;
};
var locateUnvisitedSegment = function (segments, isSegmentVisited) {
    // First run: detect beginnings
    for (var i = 0; i < segments.length; i++) {
        // if ((!isSegmentVisited[i].hasPredecessor || !isSegmentVisited[i].hasSuccessor) && !isSegmentVisited[i].visited) {
        if (!isSegmentVisited[i].hasPredecessor && !isSegmentVisited[i].visited) {
            return i;
        }
    }
    // Second run: if no beginnings exist -> use inner path segment
    for (var i = 0; i < segments.length; i++) {
        if (!isSegmentVisited[i].visited) {
            return i;
        }
    }
    return -1;
};
var getAdjacentSegment = function (segments, isSegmentVisited, currentSegment, epsilon) {
    for (var j = 0; j < segments.length; j++) {
        if (isSegmentVisited[j].visited) {
            continue;
        }
        var nextSegment = segments[j];
        // [start]---[end] [start]---[end]
        if (currentSegment.getEndPoint().distance(nextSegment.getStartPoint()) < epsilon) {
            // resultPath. .segments.push(nextSegment);
            isSegmentVisited[j].visited = true;
            return nextSegment;
        }
        // [start]---[end] [end]---[start]
        else if (currentSegment.getEndPoint().distance(nextSegment.getEndPoint()) < epsilon) {
            isSegmentVisited[j].visited = true;
            return nextSegment.reverse();
        }
    }
    return null;
};
var detectAdjacentPath = function (segments, isSegmentVisited, currentSegmentIndex, epsilon) {
    var currentSegment = segments[currentSegmentIndex];
    isSegmentVisited[currentSegmentIndex].visited = true;
    var path = new GenericPath_1.GenericPath(currentSegment); // { segments: [currentSegment], reverse };
    var i = 0;
    // Find a good condition for this loop
    while (i < segments.length && currentSegment) {
        currentSegment = getAdjacentSegment(segments, isSegmentVisited, currentSegment, epsilon);
        if (currentSegment) {
            path.segments.push(currentSegment);
        }
        i++;
    }
    return path;
};
var detectPaths = function (segments, epsilon) {
    var eps = typeof epsilon === "undefined" || epsilon < 0 ? 1.0 : epsilon;
    // const isSegmentVisited : Array<Visitation> = arrayFill(segments.length, { visited: false, hasPredecessor: false });
    var isSegmentVisited = initVisitationArray(segments, eps);
    //   const unvisitedSegments = new Set<PathSegment>(segments);
    var resultPaths = [];
    var nextSegmentIndex = -1;
    var i = 0;
    while ((nextSegmentIndex = locateUnvisitedSegment(segments, isSegmentVisited)) !== -1 && i < segments.length) {
        // const nextSegment = segments[nextSegmentIndex];
        isSegmentVisited[nextSegmentIndex].visited = true;
        // A safety break (to avoid infinited loops during development).
        i++;
        var path = detectAdjacentPath(segments, isSegmentVisited, nextSegmentIndex, eps);
        i += path.getSegmentCount() - 1;
        resultPaths.push(path);
    }
    // unifyPaths(resultPaths);
    return resultPaths;
};
exports.detectPaths = detectPaths;
//# sourceMappingURL=detectPaths.js.map