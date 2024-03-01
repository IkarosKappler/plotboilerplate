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
    detectContainmentStatus(): void;
    rebuildContainingCircles(options: MetaballsOptions): void;
}
export {};
