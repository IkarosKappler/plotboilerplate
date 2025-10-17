/**
 * A script to convert any boolean matrix to rounded paths.
 *
 * @author  Ikaros Kappler
 * @date    2025-10-17 (ported to Typescript from a demo-script)
 * @version 1.0.0
 */
import { Bounds } from "../../Bounds";
import { DataGrid2dArrayMatrix } from "../datastructures/DataGrid2dArrayMatrix";
const LEFT_BORDER = 0;
const TOP_BORDER = 1;
const RIGHT_BORDER = 2;
const BOTTOM_BORDER = 3;
/**
 * Computes an array of paths from the given boolean matrix.
 *
 * @param {DataGrid2dArrayMatrix<boolean>} matrix
 * @param {PixelCornerPathOptions} options
 * @returns
 */
export const pixelCornersToRoundPaths = (matrix, options) => {
    const paths = [];
    const visitedLeftBorderMatrix = new DataGrid2dArrayMatrix(matrix.xSegmentCount, matrix.ySegmentCount, false);
    const origin = options && options.origin ? options.origin : { x: 0, y: 0 };
    const squareSize = options && typeof options.squareSize === "number" ? options.squareSize : 10;
    const gapSize = options && typeof options.gapSize === "number" ? options.gapSize : 2;
    const curveFactor = options && typeof options.curveFactor === "number" ? options.curveFactor : 0.666;
    // Find an unvisited pixel with a free left neighbour
    const condition = (value, x, y, _matrix) => {
        return (value === true &&
            visitedLeftBorderMatrix.get(x, y) === false &&
            // is left neighbour free?
            (x - 1 < 0 || _matrix.get(x - 1, y) === false));
    };
    // Just to be sure the while loop terminates after a maximum number of iterations.
    const safetyLimit = matrix.xSegmentCount * matrix.ySegmentCount + 1;
    // The next unvisited pixel position.
    var nonVisitedPosition;
    var i = 0;
    while ((nonVisitedPosition = matrix.find(condition)) && i++ < safetyLimit) {
        // console.log("nonVisitedPosition", nonVisitedPosition);
        // Condition: if a point was found then its left neighbour is empty.
        //            So by this the current pixel's left bound is definitely a path start.
        const squareBox = getSquareBox(origin, squareSize, gapSize, nonVisitedPosition.xIndex, nonVisitedPosition.yIndex);
        const west = squareBox.getWestPoint();
        // A starting point was found: Initialize the next path.
        var pathData = [
            // Start point
            "M",
            west.x,
            west.y
        ];
        // Now from this point starting (left pixel corner) construct the next sequence of path commands.
        __constructPath(pathData, matrix, visitedLeftBorderMatrix, nonVisitedPosition, LEFT_BORDER, origin, squareSize, gapSize, curveFactor);
        paths.push(pathData);
        // console.log("pathData", pathData);
    }
    return paths;
};
/**
 * Construct a bounding box representing the visual square bounds for the given pixel.
 *
 * @param {XYCoords} origin - The origin to build the paths from (upper left corner of the graphics).
 * @param {number} squareSize - The number of pixels to use to represent a pixel square.
 * @param {number} gapSize - The number of pixels to use for gaps between squares.
 * @param {number} x - The x position inside the data grid (matrix offset).
 * @param {number} y - They  position inside the data grid (matrix offset).
 * @returns
 */
const getSquareBox = (origin, squareSize, gapSize, x, y) => {
    return new Bounds({
        x: origin.x + x * (squareSize + gapSize),
        y: origin.y + y * (squareSize + gapSize)
    }, {
        x: origin.x + x * (squareSize + gapSize) + squareSize,
        y: origin.y + y * (squareSize + gapSize) + squareSize
    });
};
/**
 * Lerp between these two numbers using the passed lerp amount (usually a value in 0.0-1.0).
 *
 * @param {number} a
 * @param {number} b
 * @param {number} lerpFactor
 * @returns {number}
 */
const lerp = (a, b, lerpFactor) => {
    return a + (b - a) * lerpFactor;
};
/**
 * Construct a path command for a cubic Bézier curve.
 *
 * @param {SVGPathParams} pathData
 * @param {XYCoords} start
 * @param {XYCoords} controlA
 * @param {XYCoords} controlB
 * @param {XYCoords} end
 * @param {number} curveFactor
 */
const addRoundCorner = (pathData, start, controlA, controlB, end, curveFactor) => {
    pathData.push("C", lerp(start.x, controlA.x, curveFactor), lerp(start.y, controlA.y, curveFactor), lerp(end.x, controlB.x, curveFactor), lerp(end.y, controlB.y, curveFactor), end.x, end.y);
};
/**
 * Construct a new path command for a straight line.
 *
 * @param {SVGPathParams} pathData
 * @param {XYCoords} target
 */
const addStraightLine = (pathData, target) => {
    pathData.push("L", target.x, target.y);
};
/**
 * A helper function for constructing the next path, beginning at the passed matrix position.
 *
 * Note the path will be created at the left border of the given 'pixel', constructe
 * in clockwise order.
 *
 * @param {SVGPathParams} pathData
 * @param {DataGrid2dArrayMatrix<boolean>} matrix - The data matrix to use.
 * @param {DataGrid2dArrayMatrix<boolean>} visitedLeftBordersMatrix - A helper matrix to keep track of visited pixels.
 * @param {RasterPosition} startingPosition
 * @param {number} startingBorderDirection
 * @param {XYCoords} origin
 * @param {number} squareSize
 * @param {number} gapSize
 * @param {number} curveFactor
 */
const __constructPath = (pathData, matrix, visitedLeftBordersMatrix, startingPosition, startingBorderDirection, origin, squareSize, gapSize, curveFactor) => {
    // Pre: position's neighbour pixel at ehe given border direction is unset.
    var isPathComplete = false;
    const maxInterations = matrix.xSegmentCount * matrix.ySegmentCount * 4 + 1;
    var i = 0;
    var position = startingPosition;
    var borderDirection = startingBorderDirection;
    while (!isPathComplete && i++ < maxInterations) {
        var x = position.xIndex;
        var y = position.yIndex;
        // console.log("x", x, "y", y, "borderDirection", borderDirection);
        // Get the pixel's box bounds.
        const squareBox = getSquareBox(origin, squareSize, gapSize, x, y);
        // Find next step when walking 'clockwise'
        if (borderDirection === LEFT_BORDER) {
            // Only track visits on left borders. By this we can detect non-visited holes :)
            visitedLeftBordersMatrix.set(x, y, true);
            // We want to expand the left border
            const west = squareBox.getWestPoint();
            // Pixel in the north?
            if (y - 1 < 0 || matrix.get(x, y - 1) === false) {
                // Northwise pixel is empty
                //  -> construct round corner to right
                addRoundCorner(pathData, west, squareBox.getNorthWestPoint(), squareBox.getNorthWestPoint(), squareBox.getNorthPoint(), curveFactor);
                borderDirection = TOP_BORDER;
                // Keep pixel position unchanged
            }
            else if (x - 1 >= 0 && matrix.get(x - 1, y - 1) === true) {
                // Top neighbour pixel is set AND top-left pixel is set too.
                // -> construct rounded edge to top-left.
                const squareBoxNW = getSquareBox(origin, squareSize, gapSize, x - 1, y - 1);
                addRoundCorner(pathData, west, squareBox.getNorthWestPoint(), squareBoxNW.getSouthEastPoint(), squareBoxNW.getSouthPoint(), curveFactor);
                borderDirection = BOTTOM_BORDER;
                position = { xIndex: x - 1, yIndex: y - 1 };
            }
            else {
                // Straight to top
                const squareBoxN = getSquareBox(origin, squareSize, gapSize, x, y - 1);
                addStraightLine(pathData, squareBoxN.getWestPoint());
                position = { xIndex: x, yIndex: y - 1 };
                // Keep borderDirection: LEFT_BORDER
                // isPathComplete = true; // TODO
            }
        }
        else if (borderDirection === TOP_BORDER) {
            // North pixel is definitely empty.
            const north = squareBox.getNorthPoint();
            if (x + 1 >= matrix.xSegmentCount || matrix.get(x + 1, y) === false) {
                // Top border and right pixel is empty
                //  --> create rounded corner to right south
                addRoundCorner(pathData, north, squareBox.getNorthEastPoint(), squareBox.getNorthEastPoint(), squareBox.getEastPoint(), curveFactor);
                borderDirection = RIGHT_BORDER;
                // Keep pixel position unchanged
            }
            else if (y - 1 < 0 || matrix.get(x + 1, y - 1) === false) {
                // Top border and right pixel is set, and north-east pixel is clear.
                // -> linear path to right
                const squareBoxE = getSquareBox(origin, squareSize, gapSize, x + 1, y);
                addStraightLine(pathData, squareBoxE.getNorthPoint());
                position = { xIndex: x + 1, yIndex: y };
                // Keep borderDirection TOP
            }
            else {
                // Last case: right neighbour is set and north-east pixel is set
                //-> construct a rounded corner to east-north.
                const squareBoxNE = getSquareBox(origin, squareSize, gapSize, x + 1, y - 1);
                addRoundCorner(pathData, north, squareBox.getNorthEastPoint(), squareBoxNE.getSouthWestPoint(), squareBoxNE.getWestPoint(), curveFactor);
                borderDirection = LEFT_BORDER;
                position = { xIndex: x + 1, yIndex: y - 1 };
                // isPathComplete = true; // TODO!!!
            }
        }
        else if (borderDirection === RIGHT_BORDER) {
            // East pixel is definitely empty.
            var east = squareBox.getEastPoint();
            if (y + 1 >= matrix.ySegmentCount || matrix.get(x, y + 1) === false) {
                // South pixel is empty.
                // -> construct rounded corner to south-east
                addRoundCorner(pathData, east, squareBox.getSouthEastPoint(), squareBox.getSouthEastPoint(), squareBox.getSouthPoint(), curveFactor);
                borderDirection = BOTTOM_BORDER;
                // Keep pixel position unchanged
            }
            else if (x + 1 < matrix.xSegmentCount && y + 1 < matrix.ySegmentCount && matrix.get(x + 1, y + 1) === true) {
                // South pixel is set AND right lower pixel is set, too.
                // -> construct round corner to south-east.
                const squareBoxSE = getSquareBox(origin, squareSize, gapSize, x + 1, y + 1);
                addRoundCorner(pathData, east, squareBox.getSouthEastPoint(), squareBoxSE.getNorthWestPoint(), squareBoxSE.getNorthPoint(), curveFactor);
                borderDirection = TOP_BORDER;
                position = { xIndex: x + 1, yIndex: y + 1 };
            }
            else {
                // South pixel is set and south-east pixel is clear.
                // -> construct linear connection to south
                const squareBoxS = getSquareBox(origin, squareSize, gapSize, x, y + 1);
                addStraightLine(pathData, squareBoxS.getEastPoint());
                position = { xIndex: x, yIndex: y + 1 };
                // Keep borderDirection RIGHT
            }
        }
        else if (borderDirection === BOTTOM_BORDER) {
            // Pre: south pixel is definitely empty
            const south = squareBox.getSouthPoint();
            if (x - 1 < 0 || matrix.get(x - 1, y) === false) {
                // Left pixel is empty
                // -> construct round corner to west-north
                addRoundCorner(pathData, south, squareBox.getSouthWestPoint(), squareBox.getSouthWestPoint(), squareBox.getWestPoint(), curveFactor);
                borderDirection = LEFT_BORDER;
            }
            else if (x - 1 >= 0 && y + 1 < matrix.ySegmentCount && matrix.get(x - 1, y + 1) === true) {
                // Left pixel AND left lower pixel are set
                // -> construct rounded edge to south-west
                const squareBoxSW = getSquareBox(origin, squareSize, gapSize, x - 1, y + 1);
                addRoundCorner(pathData, south, squareBox.getSouthWestPoint(), squareBoxSW.getNorthEastPoint(), squareBoxSW.getEastPoint(), curveFactor);
                borderDirection = RIGHT_BORDER;
                position = { xIndex: x - 1, yIndex: y + 1 };
            }
            else {
                // Left pixel is set AND south pixel is empty
                // -> construct linear edge to left neighbour.
                const squareBoxW = getSquareBox(origin, squareSize, gapSize, x - 1, y);
                addStraightLine(pathData, squareBoxW.getSouthPoint());
                position = { xIndex: x - 1, yIndex: y };
                // Keep borderDirection BOTTOM
            }
        }
        else {
            console.warn(`[Error] Cannot construct full rounded path; 'borderDirection' has wrong value (${borderDirection}).`);
            isPathComplete = true;
        }
        // End condition reached?
        if (startingPosition.xIndex === position.xIndex &&
            startingPosition.yIndex === position.yIndex &&
            startingBorderDirection === borderDirection) {
            pathData.push("Z");
            isPathComplete = true;
        }
    }
};
//# sourceMappingURL=pixelCornersToRoundPaths.js.map