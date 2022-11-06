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
/**
 * A private helper function that initializes the visitation tracking and reverses
 * dangling path ends to connect them with preceding paths.
 *
 * Note that this function alters those dangling path segments IN PLACE!
 *
 * @param segments
 * @param epsilon
 * @returns
 */
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
    // After first initialization make sure that no loose path ends are dangling around
    // if the affected path segment has a predecessor (but nu successor).
    //
    // Revert those segments. This makes the actual detection algorithm much easier.
    for (var i = 0; i < segments.length; i++) {
        if (!result[i].hasSuccessor && result[i].hasPredecessor) {
            segments[i] = segments[i].reverse();
            result[i].hasPredecessor = false;
            result[i].hasSuccessor = true;
        }
    }
    return result;
};
/**
 * Find the next unvisited path segment (private helper function).
 *
 * There is a special order: starting path segments (those without any predecessor)
 * will be preferred. If no more open paths are available (no starting path segments),
 * then no more unvisited paths are available or all remaining paths are loops (without
 * determined start/end).
 *
 * Doing this keeps us from the need to run a final loop to connect detected sub paths.
 *
 * @param {Array<PathSegment>} segments - The path segments to search in.
 * @param { Array<Visitation>} isSegmentVisited
 * @returns {number} The index of the next unvisited path segment or -1 if no more are available.
 */
var locateUnvisitedSegment = function (segments, isSegmentVisited) {
    // First run: detect beginnings
    for (var i = 0; i < segments.length; i++) {
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
/**
 * Get the next adjacent path segment to the given (current) segment. This is a private
 * helper function.
 *
 * Note that the function will revert the adjacent path segment if required, so the next
 * starting point 'equals' the current ending point.
 *
 * The visitation tracker will be updated if the adjacent segment was found.
 *
 * @param {Array<PathSegment>} segments - The total set of available path segments (visited and invisited).
 * @param {Array<Visitation>} isSegmentVisited - A tracker of visited path segments so far.
 * @param {PathSegment} currentSegment - The current path segment to find the adjacent segment for.
 * @param {number} epsilon - The epsilon to use to detect 'equal' start/end points. Must be >= 0.
 * @returns {PathSegment | null} The next adjacent path segment of null if no such exists.
 */
var getAdjacentSegment = function (segments, isSegmentVisited, currentSegment, epsilon) {
    for (var j = 0; j < segments.length; j++) {
        if (isSegmentVisited[j].visited) {
            continue;
        }
        var nextSegment = segments[j];
        // [start]---[end] [start]---[end]
        if (currentSegment.getEndPoint().distance(nextSegment.getStartPoint()) < epsilon) {
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
/**
 * A private helper function to find the adjacent full path for the given path segment,
 * considering the current path segment is a starting segment (or one inside a loop).
 *
 * @param {Array<PathSegment>} segments - The total set of available path segments.
 * @param { Array<Visitation>} isSegmentVisited - A tracker to determine which segments have already been visited.
 * @param {number} currentSegmentIndex - The index of the current segments to find the containing path for.
 * @param {number} epsilon - The epsilon to use to determine 'equal' path points. Must be >= 0.
 * @returns {GenericPath} The dected path which consists at least of the current path segment.
 */
var detectAdjacentPath = function (segments, isSegmentVisited, currentSegmentIndex, epsilon) {
    var currentSegment = segments[currentSegmentIndex];
    isSegmentVisited[currentSegmentIndex].visited = true;
    var path = new GenericPath_1.GenericPath(currentSegment); // { segments: [currentSegment], reverse };
    var i = 0;
    // A safety break if something goes wrong
    while (i < segments.length && currentSegment) {
        currentSegment = getAdjacentSegment(segments, isSegmentVisited, currentSegment, epsilon);
        if (currentSegment) {
            path.segments.push(currentSegment);
        }
        i++;
    }
    return path;
};
/**
 * Run a path detection on the given set of path segments.
 *
 * Note that the array and some path segments may be altered (like reversal) IN PLACE.
 *
 * @param {Array<PathSegment>} segments - The total set (array) of available path segments.
 * @param {number=1.0} epsilon - (optional) An epsilon to use to tell if two plane points should be considered 'equal'.
 * @returns {Array<GenericPath>} An array containing all detected path (consisting of adjacent path segments of the original set).
 */
var detectPaths = function (segments, epsilon) {
    var eps = typeof epsilon === "undefined" || epsilon < 0 ? 1.0 : epsilon;
    var isSegmentVisited = initVisitationArray(segments, eps);
    var resultPaths = [];
    var nextSegmentIndex = -1;
    var i = 0;
    while ((nextSegmentIndex = locateUnvisitedSegment(segments, isSegmentVisited)) !== -1 && i < segments.length) {
        isSegmentVisited[nextSegmentIndex].visited = true;
        // A safety break (to avoid infinited loops during development).
        i++;
        var path = detectAdjacentPath(segments, isSegmentVisited, nextSegmentIndex, eps);
        i += path.getSegmentCount() - 1;
        resultPaths.push(path);
    }
    return resultPaths;
};
exports.detectPaths = detectPaths;
//# sourceMappingURL=detectPaths.js.map