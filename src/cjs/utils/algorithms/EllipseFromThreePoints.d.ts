/**
 * @date 2026-11-25
 */
import { VEllipse } from "../../VEllipse";
import { Vertex } from "../../Vertex";
export declare class EllipseFromThreePoints {
    private inputPointA;
    private inputPointB;
    private inputPointC;
    private pointA;
    private pointB;
    private pointC;
    private circle;
    private circleSector;
    constructor(inputPointA: Vertex, inputPointB: Vertex, inputPointC: Vertex);
    arrangeInputPoints(): void;
    calculateNextStep(focalControlAngleDeg: number): VEllipse;
}
