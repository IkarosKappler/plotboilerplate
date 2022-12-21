/**
 * Split SVG path data `d` strings.
 *
 * As this helper function does not detect all possible path data strings it should cover the most daily use-cases.
 *
 * For more insight see
 *    https://www.w3.org/TR/SVG/paths.html
 *
 * @author   Ikaros Kappler
 * @date     2022-11-22
 * @modified 2022-12-21 Ported to Typescript
 * @version  0.0.1-alpha
 */
import { SVGPathCommand } from "./types";
/**
 * @name splitSVGPathData
 * @static
 * @param {string} dataString - The SVG path data to split. This should be some string
 **/
export declare const splitSVGPathData: (dataString: string) => Array<SVGPathCommand> | null;
