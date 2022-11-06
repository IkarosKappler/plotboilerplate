/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
import { Path, PathSegment } from "../../interfaces/additionals";
import { Vertex } from "../../Vertex";
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
     * @method reverse
     * @memberof Path
     * @return {PathSegment} This path instance.
     */
    reverse(): this;
    /**
     * Get the start point of this path segment.
     *
     * @method getStartPoint
     * @memberof PathSegment
     * @return {Vertex} The start point of this path segment.
     */
    getStartPoint(): Vertex;
    /**
     * Get the end point of this path segment.
     *
     * @method getEndPoint
     * @memberof PathSegment
     * @return {Vertex} The end point of this path segment.
     */
    getEndPoint(): Vertex;
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    getStartTangent(): Vertex;
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    getEndTangent(): Vertex;
}
