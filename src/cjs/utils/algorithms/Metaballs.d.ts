/**
 * Algorithm:
 *  Input Circles
 *      -> filter out fully contained circles
 *      -> build outer containing circles (given by detect radius)
 *      -> find radical lines
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2024-03-01
 */
import { Circle } from "../../Circle";
import { XYCoords } from "../../interfaces";
interface MetaballsOptions {
    metaRadiusAddon: number;
}
export declare class Metaballs {
    private circleIsFullyContained;
    private inputCircles;
    private circlesOfInterest;
    private containingCircles;
    private inverseCirclesPairs;
    constructor(inputCircles: Array<Circle>);
    rebuild(options: MetaballsOptions): void;
    private checkCircleFullyContained;
    private detectContainmentStatus;
    private rebuildContainingCircles;
    private detectInverseCircleHoles;
    static metaballsUtils: {
        detectHoles: (circles: Array<Circle>) => Array<number[]>;
        /**
         * Find a single hole group belonging to the circle at the given index.
         * @param circles
         * @param nonVisitedSet
         * @param index
         * @returns
         */
        detectHoleGroup: (circles: Array<Circle>, nonVisitedSet: Set<number>, index: number) => Array<number>;
        anyCircleContainsPoint: (circles: Array<Circle>, point: XYCoords, ignoreCircleIndex: number) => boolean;
    };
}
export {};
