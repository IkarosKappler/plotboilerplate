/**
 * @author  Ikaros Kappler
 * @date    2019-02-03
 * @version 1.0.0
 **/
import { Line } from "./Line";
import { Triangle } from "./Triangle";
/**
 * A collection of usefull geometry utilities.
 *
 * @global
 **/
export const geomutils = {
    /**
     * Compute the n-section of the angle – described as a triangle (A,B,C) – in point A.
     *
     * @param {Vertex} pA - The first triangle point.
     * @param {Vertex} pB - The second triangle point.
     * @param {Vertex} pC - The third triangle point.
     * @param {number} n - The number of desired angle sections (example: 2 means the angle will be divided into two sections,
     *                      means an returned array with length 1, the middle line).
     *
     * @return {Line[]} An array of n-1 lines secting the given angle in point A into n equal sized angle sections. The lines' first vertex is A.
     */
    nsectAngle(pA, pB, pC, n) {
        const triangle = new Triangle(pA, pB, pC);
        const lineAB = new Line(pA, pB);
        const lineAC = new Line(pA, pC);
        // Compute the slope (theta) of line AB and line AC
        const thetaAB = lineAB.angle();
        const thetaAC = lineAC.angle();
        // Compute the difference; this is the angle between AB and AC
        var insideAngle = lineAB.angle(lineAC);
        // We want the inner angles of the triangle, not the outer angle;
        //   which one is which depends on the triangle 'direction'
        const clockwise = triangle.determinant() > 0;
        // For convenience convert the angle [-PI,PI] to [0,2*PI]
        if (insideAngle < 0)
            insideAngle = 2 * Math.PI + insideAngle;
        if (!clockwise)
            insideAngle = (2 * Math.PI - insideAngle) * (-1);
        // Scale the rotated lines to the max leg length (looks better)
        const lineLength = Math.max(lineAB.length(), lineAC.length());
        const scaleFactor = lineLength / lineAB.length();
        var result = [];
        for (var i = 1; i < n; i++) {
            // Compute the i-th inner sector line
            result.push(new Line(pA, pB.clone().rotate((-i * (insideAngle / n)), pA)).scale(scaleFactor));
        }
        return result;
    }
};
//# sourceMappingURL=geomutils.js.map