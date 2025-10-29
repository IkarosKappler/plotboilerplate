/**
 * A wrapper for Lissajous figure params.
 *
 * @author   Ikaros Kappler
 * @date     2018-11-22
 * @modified 2025-10-29 Ported to typescript from demo 13-lissajous.
 * @version  1.0.0
 */
import { Vertex } from "../Vertex";
export declare class LissajousFigure {
    freqA: number;
    freqB: number;
    phaseA: number;
    phaseB: number;
    /**
     * Create a new figure with the given settings.
     * @param {number} freqA - The 'horizontal' frequency.
     * @param {number} freqB - The 'vertical' frequency.
     * @param {number} phaseA - The 'horizonal' phase shift.
     * @param {number} phaseB - The 'vertical' phase shift.
     */
    constructor(freqA: number, freqB: number, phaseA: number, phaseB: number);
    /**
     * Get the point at the given abstract time.
     *
     * The result is periodic in 0..TWO_PI.
     *
     * @param {number} t - The timing value (for example milliseconds).
     * @returns {Vertex} The x-y-position on the Lissajous figure at the given time.
     */
    getPointAt(t: number): Vertex;
    toPolyLine(stepSize: number): Array<Vertex>;
    toCubicBezierApproximation(stepSize: number, scale: number, alternating: boolean): Array<[Vertex, Vertex, Vertex] | [Vertex, Vertex]>;
}
