/**
 * A script to convert any boolean matrix to rounded paths.
 *
 * @author  Ikaros Kappler
 * @date    2025-10-17 (ported to Typescript from a demo-script)
 * @version 1.0.0
 */
import { SVGPathParams, XYCoords } from "../../interfaces";
import { DataGrid2dArrayMatrix } from "../datastructures/DataGrid2dArrayMatrix";
export type PixelCornerPathOptions = {
    origin?: XYCoords;
    squareSize?: number;
    gapSize?: number;
    curveFactor?: number;
};
/**
 * Computes an array of paths from the given boolean matrix.
 *
 * @param {DataGrid2dArrayMatrix<boolean>} matrix
 * @param {PixelCornerPathOptions} options
 * @returns
 */
export declare const pixelCornersToRoundPaths: (matrix: DataGrid2dArrayMatrix<boolean>, options: PixelCornerPathOptions) => Array<SVGPathParams>;
