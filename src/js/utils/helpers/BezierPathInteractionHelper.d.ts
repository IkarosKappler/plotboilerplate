/**
 * A helper for adding vertices to and remove vertices from Bézier paths.
 *
 * By default the 'delete' key is used to remove vertices or paths.
 *
 *
 * @require PlotBoilerplate, KeyHandler, MouseHandler, AlloyFinger
 *
 *
 * @author   Ikaros Kappler
 * @date     2020-07-31
 * @modified 2020-08-03 Ported this class from vanilla JS to Typescript.
 * @version  1.0.0
 **/
import { BezierPath } from "../../BezierPath";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { VertEvent } from "../../VertexListeners";
export declare class BezierPathInteractionHelper {
    /**
     * @member {PlotBoilerplate}
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
    private _keyHandler;
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
    constructor(pb: PlotBoilerplate, paths: Array<BezierPath>, options: any);
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
    private _addDefaultPathListeners;
    private _removeDefaultPathListeners;
    private _updateMinDistance;
    static setPathAutoAdjust(path: BezierPath): void;
    static addPathVertexDragListeners(path: BezierPath, vertexDragListener: (e: VertEvent) => void): void;
    static removePathVertexDragListeners(path: BezierPath, vertexDragListener: (e: VertEvent) => void): void;
}
