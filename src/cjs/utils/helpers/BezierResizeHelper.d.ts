/**
 * A helper to resize bezier paths in horizontal and vertical orientation.
 *
 * @requires PlotBoilerplate
 * @requires BezierPath
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2026-04-04 Copied from the ngdg project, made minor type adaptions.
 * @version  1.2.0
 *
 */
import { BezierPath } from "../../BezierPath";
import PlotBoilerplate from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";
import { DrawLib, XYCoords } from "../../interfaces";
export declare class BezierResizeHelper {
    private pb;
    readonly bezierPath: BezierPath;
    readonly topResizeHandle: Vertex;
    readonly leftResizeHandle: Vertex;
    readonly bottomResizeHandle: Vertex;
    readonly rightResizeHandle: Vertex;
    topHandleDragStartPosition: XYCoords;
    leftHandleDragStartPosition: XYCoords;
    bottomHandleDragStartPosition: XYCoords;
    rightHandleDragStartPosition: XYCoords;
    __listeners: Array<() => void>;
    /**
     * The constructor.
     *
     * @param {PlotBoilerplate} pb
     * @param {BezierPath} bezierPath
     * @param {function} updateCallback
     */
    constructor(pb: PlotBoilerplate, bezierPath: BezierPath, updateCallback: () => void);
    draw(draw: DrawLib<any>, fill: DrawLib<any>): void;
    /**
     * Call this method from the outside to see active helper lines for those edges
     * that are currently dragged.
     *
     * @param {DrawLib<any>} draw
     * @param {DrawLib<any>} fill
     * @param {string} lineColor
     */
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>, lineColor: string): void;
    drawTriangles(draw: DrawLib<any>, _fill: DrawLib<any>, color: string): void;
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawTopTriangle(draw: DrawLib<any>, _fill: DrawLib<any>, color: string): void;
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawLeftTriangle(draw: DrawLib<any>, _fill: DrawLib<any>, color: string): void;
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawBottomTriangle(draw: DrawLib<any>, _fill: DrawLib<any>, color: string): void;
    /**
     * Draws an right-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawRightTriangle(draw: DrawLib<any>, _fill: DrawLib<any>, color: string): void;
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    private __drawUpTriangle;
    /**
     * Draws an left-trinangle at the left handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    private __drawLeftTriangle;
    /**
     * Draws a down-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    private __drawDownTriangle;
    /**
     * Draws an left-trinangle at the left handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    private __drawRightTriangle;
    /**
     * Destroys this helper by removing all previously installed vertex listeners.
     */
    destroy(): void;
    /**
     * Install all required drag-start and drag-end listeners.
     */
    private __installListeners;
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} heightAmount - The height difference to apply. Can be positive or negative or zero.
     */
    private __changePathHeightTop;
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} widthAmount - The width difference to apply. Can be positive or negative or zero.
     */
    private __changePathWidthLeft;
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} heightAmount - The height difference to apply. Can be positive or negative or zero.
     */
    private __changePathHeightBottom;
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} widthAmount - The width difference to apply. Can be positive or negative or zero.
     */
    private __changePathWidthRight;
    /**
     * Set the handles to the new position after the path was resized.
     */
    updateResizeHandles(): void;
}
