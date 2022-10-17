/**
 * A function to detect connected paths on the plane given by a random set of segments.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */

import { Path, PathSegment, Vertex } from "../..";
import { GenericPath } from "../datastructures/GenericPath";
import { arrayFill } from "./arrayFill";

const locateUnvisitedSegment = (segments: Array<PathSegment>, isSegmentVisited: Array<boolean>): number => {
  for (var i = 0; i < segments.length; i++) {
    if (!isSegmentVisited[i]) {
      return i;
    }
  }
  return -1;
};

const getAdjacentSegment = (
  segments: Array<PathSegment>,
  isSegmentVisited: Array<boolean>,
  currentSegment: PathSegment,
  epsilon: number
): PathSegment | null => {
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

const detectAdjacentPath = (
  segments: Array<PathSegment>,
  isSegmentVisited: Array<boolean>,
  currentSegmentIndex: number,
  epsilon: number
): Path => {
  var currentSegment: PathSegment | null = segments[currentSegmentIndex];
  isSegmentVisited[currentSegmentIndex] = true;
  const path = new GenericPath(currentSegment); // { segments: [currentSegment], reverse };

  var i = 0;
  // Find a good condition for this loop
  while (i < segments.length && currentSegment) {
    currentSegment = getAdjacentSegment(segments, isSegmentVisited, currentSegment, epsilon);

    i++;
  }

  return path;
};

export const detectPaths = (segments: Array<PathSegment>): Array<Path> => {
  const isSegmentVisited = arrayFill(segments.length, false);
  //   const unvisitedSegments = new Set<PathSegment>(segments);
  const resultPaths: Array<Path> = [];
  var nextSegmentIndex: number = -1;
  var i = 0;
  while ((nextSegmentIndex = locateUnvisitedSegment(segments, isSegmentVisited)) !== -1 && i < segments.length) {
    // const nextSegment = segments[nextSegmentIndex];
    isSegmentVisited[nextSegmentIndex] = true;
    // A safety break (to avoid infinited loops during development).
    i++;

    const path = detectAdjacentPath(segments, isSegmentVisited, nextSegmentIndex, 0.1);
    i += path.getSegmentCount() - 1;
  }
  return resultPaths;
};
