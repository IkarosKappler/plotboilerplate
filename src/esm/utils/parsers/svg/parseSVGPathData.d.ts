/**
 * Parse SVG path data strings and convert to PlotBoilerplate path objects.
 *
 * As this parser function does not detect all possible path data strings it should cover the most daily use-cases.
 *
 * For more insight see
 *    https://www.w3.org/TR/SVG/paths.html
 *
 * @author  Ikaros Kappler
 * @date    2022-11-06
 * @modified 2022-12-21 (winter solstice) Porting this to Typescript.
 * @modified 2023-01-17 Handling multiple parameter sets now.
 * @version 0.0.2-alpha
 **/
import { CubicBezierCurve } from "../../../CubicBezierCurve";
import { Line } from "../../../Line";
/**
 * Transform the given path data (translate and scale. rotating is not intended here).
 *
 * @date 2022-11-06
 *
 * @name parseSVGPathData
 * @static
 * @param {string} data - The data to parse.
 * @return An array of straight line segments (Line) or curve segments (CubicBezierCurve) representing the path.
 */
export declare const parseSVGPathData: (dataString: string) => Array<Line | CubicBezierCurve> | null;
