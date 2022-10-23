/**
 * A function to detect connected paths on the plane given by a random set of segments.
 *
 * Note that is algorithm operates IN PLACE and will ALTER your INPUT array.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
import { Path, PathSegment } from "../..";
export declare const detectPaths: (segments: Array<PathSegment>, epsilon?: number) => Array<Path>;
