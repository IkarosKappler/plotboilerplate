/**
 * Approximate ellipses for three points: two points from the longest edge and a third one on the defining circle.
 *
 * @date    2026-11-25
 * @author  Ikaros Kappler
 * @version 1.0.0
 */
import { Circle } from "../../Circle";
import { CircleSector } from "../../CircleSector";
import { Line } from "../../Line";
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
export declare class EllipseFromThreePointsApproximation {
    inputPointA: Vertex;
    inputPointB: Vertex;
    inputPointC: Vertex;
    /**
     * The following three points form a triangle with the following conditions:
     *  - A->B is the longest edge (hypotenuse).
     *  - A->B->C are arranged clockwise.
     */
    pointA: Vertex;
    pointB: Vertex;
    pointC: Vertex;
    /**
     * A helper line connection A->B.
     */
    lineAB: Line;
    /**
     * A helper circle with the condition:
     *  - The middle point of line A->B is the center of the circle.
     *  - The radius is half the length of A->B (points A and B are located on the circle).
     */
    circle: Circle;
    /**
     * A helper circle sector with the condition:
     *  - The underlying circle is the one defined by A->B.
     *  - The point at `startAngle` is identical with A.
     *  - The point at `endAngle` is identical with B.
     */
    circleSector: CircleSector;
    /**
     * A helper control point that is located somewhere on the circle sector (depending on some input angle).
     */
    focalControlPoint: Vertex;
    /**
     * The constructor. Creates a new ellipse approximation helper from the given threee input point.
     * @param {Vertex} inputPointA - The first random input point.
     * @param {Vertex} inputPointB - The second random input point.
     * @param {Vertex} inputPointC - The thrird random input point.
     */
    constructor(inputPointA: Vertex, inputPointB: Vertex, inputPointC: Vertex);
    /**
     * Whenever any of the input points changes call this method.
     * It will re-arrage `pointA`, `pointB`, and `pointC` to meet the triangle condition.
     */
    arrangeInputPoints(): void;
    /**
     * Update the focal control point on the circle sector to be located at the given input angle.
     * The angle is relative: 0 means, identical point with the sectors start angle.
     *
     * @param {number} focalControlAngleRad - The circle sector angle in radians.
     */
    updateFocalControlPoint(focalControlAngleRad: number): void;
    /**
     * Updates the helper circle depending on points A and B.
     */
    updateHelperCircle(): void;
    /**
     * Approximate the desired elliptic focal angle recursively (inside the given angle range).
     * To get the resulting ellipse use method `calculateEllipseFromFocalAngle`.
     *
     * The `iterCount` param determines the recursion depth:
     *  - a higher value gives more precise results (but bad performance).
     *  - a lower value is quicker but gives bad results.
     *
     * A value between 10 and 20 is usually pretty sufficient for pure visual applications.
     *
     * @param {number} beginAngleRad - The range's begin angle (in radians).
     * @param {number} endAngleRad - The range's end angle (in radians).
     * @param {number} iterCount - The number of iterations.
     * @param {number} cachedEllipses - An optional array to store temporary results in each iteration step.
     * @returns
     */
    findCorrectAngleRecursive(beginAngleRad: number, endAngleRad: number, iterCount: number, cachedEllipses?: Array<{
        ellipse: VEllipse;
        focalAngle: number;
    }>): any;
    /**
     * Get the ellipse from the current point settings of `pointA` and `pointB` and the given focal angle.
     * The angle is relative to the underlying circle sector and should be in [-PI/2, +PI/2].
     *
     * @param {number} focalControlAngleRad - The focal angle in radians.
     * @returns {VEllipse} The ellipse at the given focal angle.
     */
    calculateEllipseFromFocalAngle(focalControlAngleRad: number): VEllipse;
}
