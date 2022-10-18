/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
import { Path, PathSegment } from "../../interfaces/additionals";
export declare class GenericPath implements Path {
    segments: Array<PathSegment>;
    constructor(startSegment: PathSegment);
    /**
     * Get the number of segments in this path.
     *
     * @method getSegmentCount
     * @memberof Path
     * @return {number} The number (integer) of path segments.
     */
    getSegmentCount(): number;
    /**
     * Get the path segment at the given index.
     *
     * @method getSegmentAt
     * @memberof Path
     * @return {PathSegment} The paths segment at the given index.
     */
    getSegmentAt(index: number): PathSegment;
    /**
     * Create a deep clone of this path.
     *
     * @method clone
     * @memberof Path
     * @return {Path} A deep clone/copy of this path.
     */
    clone(): GenericPath;
    /**
     * Reverse this path (swap start and end and thus – the direction) in-place.
     *
     * @method revert
     * @memberof Path
     * @return {PathSegment} This path instance.
     */
    revert(): this;
    /**
     * Get the start point of this path segment.
     *
     * @method getStartPoint
     * @memberof PathSegment
     * @return {Vertex} The start point of this path segment.
     */
    getStartPoint(): import("../..").Vertex;
    /**
     * Get the end point of this path segment.
     *
     * @method getEndPoint
     * @memberof PathSegment
     * @return {Vertex} The end point of this path segment.
     */
    getEndPoint(): import("../..").Vertex;
}
