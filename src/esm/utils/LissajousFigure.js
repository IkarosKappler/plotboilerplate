/**
 * A wrapper for Lissajous figure params.
 *
 * @author   Ikaros Kappler
 * @date     2018-11-22
 * @modified 2025-10-29 Ported to typescript from demo 13-lissajous.
 * @version  1.0.0
 */
import { Vertex } from "../Vertex";
export class LissajousFigure {
    /**
     * Create a new figure with the given settings.
     * @param {number} freqA - The 'horizontal' frequency.
     * @param {number} freqB - The 'vertical' frequency.
     * @param {number} phaseA - The 'horizonal' phase shift.
     * @param {number} phaseB - The 'vertical' phase shift.
     */
    constructor(freqA, freqB, phaseA, phaseB) {
        this.freqA = freqA;
        this.freqB = freqB;
        this.phaseA = phaseA;
        this.phaseB = phaseB;
    }
    /**
     * Get the point at the given abstract time.
     *
     * The result is periodic in 0..TWO_PI.
     *
     * @param {number} t - The timing value (for example milliseconds).
     * @returns {Vertex} The x-y-position on the Lissajous figure at the given time.
     */
    getPointAt(t) {
        return new Vertex(Math.sin(this.phaseA + this.freqA * t), Math.sin(this.phaseB + this.freqB * t));
    }
    toPolyLine(stepSize) {
        const polyLine = [];
        let pA = new Vertex(0, 0);
        stepSize = Math.abs(stepSize);
        for (var t = 0; t <= 2 * Math.PI; t += stepSize) {
            pA = this.getPointAt(t);
            polyLine.push(pA.clone());
        }
        return polyLine;
    }
    toQuadraticBezierApproximation(stepSize
    // scale: number
    // alternating: boolean
    ) {
        const result = [];
        let pA = new Vertex(0, 0);
        let pB = new Vertex(0, 0);
        stepSize = Math.abs(stepSize);
        let p1 = new Vertex(0, 0);
        let dx1 = this.freqA;
        let dy1 = this.freqB;
        pA = this.getPointAt(stepSize);
        let x2, y2, dx2, dy2, det, x3, y3;
        var i = 0;
        for (var t = stepSize; t <= 2 * Math.PI + 2 * stepSize; t += stepSize) {
            x2 = Math.sin(this.phaseA + this.freqA * t);
            y2 = Math.sin(this.phaseB + this.freqB * t);
            dx2 = this.freqA * Math.cos(this.phaseA + this.freqA * t);
            dy2 = this.freqB * Math.cos(this.phaseB + this.freqB * t);
            det = dx1 * dy2 - dy1 * dx2;
            if (Math.abs(det) > 0.1) {
                x3 = ((x2 * dy2 - y2 * dx2) * dx1 - (p1.x * dy1 - p1.y * dx1) * dx2) / det;
                y3 = ((x2 * dy2 - y2 * dx2) * dy1 - (p1.x * dy1 - p1.y * dx1) * dy2) / det;
                // pB.set(scale * x2, scale * y2 * (alternating ? -1 : 1));
                // pB.set(scale * x2, scale * y2);
                pB.set(x2, y2);
                // pB.set(x2, y2);
                if (i > 0) {
                    //   pb.draw.quadraticBezier(pA, new Vertex(scale * x3, scale * y3), pB, "rgba(0,108,255,1.0)", 2);
                    //   result.push([pA.clone(), new Vertex(scale * x3, scale * y3), pB.clone()]);
                    result.push([pA.clone(), new Vertex(x3, y3), pB.clone()]);
                }
            }
            else {
                // pB.set(scale * x2, scale * y2);
                pB.set(x2, y2);
                if (i > 0) {
                    //   pb.draw.line(pA, pB, "rgba(0,192,192,0.8)", 2);
                    result.push([pA.clone(), pB.clone()]);
                }
            }
            p1.set(x2, y2);
            dx1 = dx2;
            dy1 = dy2;
            pA.set(pB);
            i++;
        } // END for
        return result;
    }
}
//# sourceMappingURL=LissajousFigure.js.map