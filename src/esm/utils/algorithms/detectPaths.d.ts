/**
 * A function to detect connected paths on the plane given by a random set of segments.
 *
 * Note that is algorithm operates IN PLACE and will ALTER your INPUT array.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
import { Path, PathSegment } from "../../interfaces";
/**
 * Run a path detection on the given set of path segments.
 *
 * Note that the array and some path segments may be altered (like reversal) IN PLACE.
 *
 * @param {Array<PathSegment>} segments - The total set (array) of available path segments.
 * @param {number=1.0} epsilon - (optional) An epsilon to use to tell if two plane points should be considered 'equal'.
 * @returns {Array<GenericPath>} An array containing all detected path (consisting of adjacent path segments of the original set).
 */
export declare const detectPaths: (segments: Array<PathSegment>, epsilon?: number) => Array<Path>;
