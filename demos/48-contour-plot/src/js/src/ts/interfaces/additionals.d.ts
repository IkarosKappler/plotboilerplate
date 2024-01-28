/**
 * @date 2022-10-17
 */
import { Vertex } from "../Vertex";
/**
 * A common interface for different kinds of path segments.
 */
export interface PathSegment {
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
    /**
     * Create a deep clone of this path segment.
     *
     * @method clone
     * @memberof PathSegment
     * @return {PathSegment} A deep clone/copy of this path segment.
     */
    clone: () => PathSegment;
    /**
     * Revserse this path segment (in-place) and return this same instance (useful for chaining).
     * The new path segment has start and end point swapped.
     *
     * @method reverse
     * @memberof PathSegment
     * @return {PathSegment} This path segment instance (for chaining).
     */
    reverse: () => PathSegment;
}
/**
 * A common interface for general path representations.
 */
export interface Path extends PathSegment {
    /**
     * Get the number of segments in this path.
     *
     * @method getSegmentCount
     * @memberof Path
     * @return {number} The number (integer) of path segments.
     */
    getSegmentCount: () => number;
    /**
     * Get the path segment at the given index.
     *
     * @method getSegmentAt
     * @memberof Path
     * @return {PathSegment} The paths segment at the given index.
     */
    getSegmentAt: (index: number) => PathSegment;
    /**
     * Create a deep clone of this path.
     *
     * @method clone
     * @memberof Path
     * @return {Path} A deep clone/copy of this path.
     */
    clone: () => Path;
    /**
     * Reverse this path (swap start and end and thus – the direction) in-place.
     *
     * @method revert
     * @memberof Path
     * @return {PathSegment} This path instance.
     */
    reverse: () => Path;
}
