/**
 * Interfaces and class for automatically handling Bézier curves.
 *
 * @requires AlloyFinger
 * @requires BezierPath
 * @requires CubicBezierPath
 * @requires KeyHandler
 * @requires MouseHandler
 * @requires PlotBoilerplate
 * @requires VertEvent
 * @requires Vertex
 * @requires XMouseEvent
 * @requires XYCoords
 *
 *
 * @author   Ikaros Kappler
 * @date     2020-07-31
 * @modified 2020-08-03 Ported this class from vanilla JS to Typescript.
 * @modified 2020-08-12 Added a distance check before handling the click/tap event.
 * @modified 2021-01-03 Changed property to `autoAdjustPaths` in the HandlerOptions interface (typo).
 * @modified 2021-01-03 Added following new functions: `addPathVertexDragStartListeners`, `removePathVertexDragStartListeners`, `addPathVertexDragEndListeners` and `removePathVertexDragEndListeners`.
 * @modified 2021-03-31 Fixed the issue with the new AlloyFinger (Typescript).
 * @modified 2022-02-03 Changing the element to catch events (eventCatcher instead of canvas).
 * @modified 2024-03-10 Fixing some types for Typescript 5 compatibility.
 * @modified 2025-04-14 Added the `BezierPathInteractionHelper.drawHandleLines` method.
 * @modified 2025-04-14 Fixing correct event types for touch events in `BezierPathInteractionHelper`.
 * @modified 2025-04-14 BezierPathInteractionHelper: Changed default value of `HelperOptions.autoAdjustPaths` from `true` to `false`.
 * @version  1.2.0
 *
 * @file BezierPathInteractionHelper
 * @public
 **/
import { BezierPath } from "../../BezierPath";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { VertListener } from "../../VertexListeners";
import { Vertex } from "../../Vertex";
/**
 * Handler type for mouse-pointer-moved listeners.
 */
type OnPointerMoved = (pathIndex: number, pathPoint: Vertex | null, pointerPos: Vertex | null, t: number) => void;
/**
 * Handler type for vertex-inserted listeners.
 */
type OnVertexInserted = (pathIndex: number, insertIndex: number, newPath: BezierPath, oldPath: BezierPath) => void;
/**
 * Handler type for vertex-removed listeners.
 */
type OnVerticesDeleted = (pathIndex: number, removedVertexIndices: Array<number>, newPath: BezierPath, oldPath: BezierPath) => void;
/**
 * Handler type for path-removed listeners.
 */
type OnPathRemoved = (pathIndex: number, oldPath: BezierPath) => void;
/**
 * Options passed to the constructor.
 */
interface HelperOptions {
    autoAdjustPaths?: boolean;
    allowPathRemoval?: boolean;
    maxDetectDistance?: number;
    onPointerMoved?: OnPointerMoved;
    onVertexInserted?: OnVertexInserted;
    onVerticesDeleted?: OnVerticesDeleted;
    onPathRemoved?: OnPathRemoved;
}
/**
 * @classdesc A helper for adding vertices to and remove vertices from Bézier paths.
 * By default the 'delete' key is used to remove vertices or paths.
 *
 * For convenience this helper is capable of handling multiple paths which are kept
 * in an array.
 *
 * [Demo](https://www.plotboilerplate.io/repo/demos/23-bezier-point-distance/ "Demo")
 *
 * @public
 **/
export declare class BezierPathInteractionHelper {
    /**
     * @member {PlotBoilerplate} pb
     * @memberof BezierPathInteractionHelper
     * @type {PlotBoilerplate}
     * @instance
     */
    private pb;
    private paths;
    private onPointerMoved;
    private onVertexInserted;
    private onVerticesDeleted;
    private onPathRemoved;
    private autoAdjustPaths;
    private allowPathRemoval;
    private maxDetectDistance;
    private mouseIsOver;
    private currentPathIndex;
    private currentDistance;
    private currentT;
    private currentA;
    private currentB;
    private _mouseHandler;
    private _touchHandler;
    private _keyHandler;
    private _mouseEnterListener;
    private _mouseLeaveListener;
    /**
     * Pre: all paths must have been added to the PlotBoilerplate's drawable buffer (use the add(Drawable) function).
     *
     * The move callback accepts four params:
     *   * The point on the closest curve (Vertex)
     *   * The mouse or touch position (Vertex)
     *   * The curve position (float t)
     *   * The curve index on the array (integer)
     *
     *
     * @constructor
     * @name BezierPathInteractionHelper
     * @param {PlotBoilerplate} pb
     * @param {Array<BezierPath>} paths
     * @param {boolean} options.autoAdjustPaths - If true then inner path points will be auto-adjusted to keep the curve smooth.
     * @param {boolean} options.allowPathRemoval - If true then full paths can be removed (by removing selected vertices).
     * @param {number} maxDetectDistance - The max detection distance. No events will be fired if the mouse/touch pointer is outside this range (default is Number.MAX_VALUE).
     * @param {function(number,Vertex,Vertex,number)} options.onPointerMoved (pathIndex,pathPoint,pointer,t)
     * @param {function(number,number,BezierPath,BezierPath)} options.onVertexInserted (pathIndex,insertIndex,newPath,oldPath)
     * @param {function(number,number[],BezierPath,BezierPath)} options.onVerticesDeleted (pathIndex,removedVertexIndices,newPath,oldPath)
     * @param {function(number,BezierPath)} options.onPathRemoved (pathIndex,oldPath)
     **/
    constructor(pb: PlotBoilerplate, paths: Array<BezierPath>, options: HelperOptions);
    /**
     * Manually add a path to this helper.
     * Note that if `autoAdjustPaths==true` then listeners will be installed to the path's vertices to
     * keep the path smooth at all times.
     *
     * @method addPath
     * @instance
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The path to add.
     * @return {boolean} Duplicate path instances cannot be added; function will return false if path already exists.
     **/
    addPath(path: BezierPath): boolean;
    /**
     * Manually remove a path from this helper.
     * Note that this method ignores the `allowPathRemoval` option.
     *
     * @method removePath
     * @instance
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The path to remove.
     * @return {boolean} Returns false if the path could not be found.
     **/
    removePath(path: BezierPath): boolean;
    /**
     * Remove the path at the given index.
     *
     * @method removePathAt
     * @instance
     * @memberof BezierPathInteractionHelper
     * @param {number} pathIndex - The index of the path (must be inside bounds, see `this.paths` array).
     * @return {void}
     **/
    removePathAt(pathIndex: number): void;
    /**
     * Update the inner status by running the distance calculation again with the current settings.
     *
     * Call this if any of the properties changed (like maxDetecDistance).
     *
     * @method update
     * @instance
     * @memberof BezierPathInteractionHelper
     * @return {void}
     **/
    update(): void;
    /**
     * Draw grey handle lines.
     *
     */
    drawHandleLines(): void;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used any more.
     *
     * @method destroy
     * @instance
     * @memberof BezierPathInteractionHelper
     * @return {void}
     **/
    destroy(): void;
    private _locatePath;
    private _handleDelete;
    private _handleSingleVertexDelete;
    private _handleDeleteOnPath;
    private _replacePathAt;
    private _handleMoveEvent;
    private _clearMoveEvent;
    private _installTouchListener;
    private _installMouseListener;
    private _installKeyListener;
    private _removeDefaultPathListeners;
    private _updateMinDistance;
    static setPathAutoAdjust(path: BezierPath): void;
    /**
     * A helper function to add drag-start listeners to all vertices of the given path.
     *
     * @static
     * @method addPathVertexDragStartListeners
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The Bézier path to add vertex listeners to.
     * @param {function} vertexDragStartListener - The drag listeners to add to each path vertex.
     * @return void
     **/
    static addPathVertexDragStartListeners(path: BezierPath, vertexDragStartListener: VertListener): void;
    /**
     * A helper function to remove drag-start listeners to all vertices of the given path.
     *
     * @static
     * @method removePathVertexDragStartListeners
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The Bézier path to remove vertex listeners from.
     * @param {function} vertexDragListener - The drag listeners to remove from each path vertex.
     * @return void
     **/
    static removePathVertexDragStartListeners(path: BezierPath, vertexDragStartListener: VertListener): void;
    /**
     * A helper function to add drag listeners to all vertices of the given path.
     *
     * @static
     * @method addPathVertexDragListeners
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The Bézier path to add vertex listeners to.
     * @param {function} vertexDragListener - The drag listeners to add to each path vertex.
     * @return void
     **/
    static addPathVertexDragListeners(path: BezierPath, vertexDragListener: VertListener): void;
    /**
     * A helper function to remove drag listeners to all vertices of the given path.
     *
     * @static
     * @method removePathVertexDragListeners
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The Bézier path to remove vertex listeners from.
     * @param {function} vertexDragListener - The drag listeners to remove from each path vertex.
     * @return void
     **/
    static removePathVertexDragListeners(path: BezierPath, vertexDragListener: VertListener): void;
    /**
     * A helper function to add drag-end listeners to all vertices of the given path.
     *
     * @static
     * @method addPathVertexDragEndListeners
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The Bézier path to add vertex listeners to.
     * @param {function} vertexDragEndListener - The drag listeners to add to each path vertex.
     * @return void
     **/
    static addPathVertexDragEndListeners(path: BezierPath, vertexDragEndListener: VertListener): void;
    /**
     * A helper function to remove drag-end listeners to all vertices of the given path.
     *
     * @static
     * @method removePathVertexDragEndListeners
     * @memberof BezierPathInteractionHelper
     * @param {BezierPath} path - The Bézier path to remove vertex listeners from.
     * @param {function} vertexDragListener - The drag listeners to remove from each path vertex.
     * @return void
     **/
    static removePathVertexDragEndListeners(path: BezierPath, vertexDragEndListener: VertListener): void;
}
export {};
