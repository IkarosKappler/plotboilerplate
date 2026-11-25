/**
 * @date 2026-11-25
 */
import { Line } from "../../Line";
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
export declare class EllipseFromThreePointsApproximation {
    private inputPointA;
    private inputPointB;
    private inputPointC;
    private pointA;
    private pointB;
    private pointC;
    lineAB: Line;
    private circle;
    private circleSector;
    focalControlPoint: Vertex;
    constructor(inputPointA: Vertex, inputPointB: Vertex, inputPointC: Vertex);
    arrangeInputPoints(): void;
    updateFocalControlPoint(focalControlAngleRad: number): void;
    updateHelperCircle(): void;
    findCorrectAngleRecursive(beginAngleRad: number, endAngleRad: number, iterCount: number, cachedEllipses?: Array<{
        ellipse: VEllipse;
        focalAngle: number;
    }>): any;
    calculateNextStep(focalControlAngleRad: number): VEllipse;
}
