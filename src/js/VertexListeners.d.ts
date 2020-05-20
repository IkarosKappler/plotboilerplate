/**
 * @classdesc An event listeners wrapper. This is just a set of three listener
 *              queues (drag, dragStart, dragEnd) and their respective firing
 *              functions.
 *
 * @author   Ikaros Kappler
 * @date     2018-08-27
 * @modified 2018-11-28 Added the vertex-param to the constructor and extended the event. Vertex events now have a 'params' attribute object.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2020-02-22 Added 'return this' to the add* functions (for chanining).
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  1.0.4
 *
 * @file VertexListeners
 * @public
 **/
import { Vertex } from "./Vertex";
import { XMouseParams, XMouseEvent } from "./MouseHandler";
export interface VertEventParams extends XMouseParams {
    vertex: Vertex;
}
export interface VertEvent {
    params: VertEventParams;
}
export declare class VertexListeners {
    drag: Array<(e: VertEvent) => void>;
    dragStart: Array<(e: VertEvent) => void>;
    dragEnd: Array<(e: VertEvent) => void>;
    vertex: Vertex;
    /**
     * The constructor.
     *
     * @constructor
     * @name VertexListeners
     * @param {Vertex} vertex - The vertex to use these listeners on (just a backward reference).
     **/
    constructor(vertex: Vertex);
    /**
     * Add a drag listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addDragListener(listener: (e: VertEvent) => void): this;
    /**
     * The drag listener is a function with a single drag event param.
     * @callback VertexListeners~dragListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeDragListener(listener: (e: VertEvent) => void): this;
    /**
     * Add a dragStart listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragStartListener} listener - The drag-start listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addDragStartListener(listener: (e: VertEvent) => void): this;
    /**
     * The drag-start listener is a function with a single drag event param.
     * @callback VertexListeners~dragStartListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a dragStart listener.
     *
     * @method addDragStartListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeDragStartListener(listener: (e: VertEvent) => void): this;
    /**
     * Add a dragEnd listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragEndListener} listener - The drag-end listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    addDragEndListener(listener: (e: VertEvent) => void): this;
    /**
     * The drag-end listener is a function with a single drag event param.
     * @callback VertexListeners~dragEndListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a dragEnd listener.
     *
     * @method addDragEndListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    removeDragEndListener(listener: (e: VertEvent) => void): this;
    /**
     * Fire a drag event with the given event instance to all
     * installed drag listeners.
     *
     * @method fireDragEvent
     * @param {VertEvent|XMouseEvent} e - The drag event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireDragEvent(e: VertEvent | XMouseEvent): void;
    /**
     * Fire a dragStart event with the given event instance to all
     * installed drag-start listeners.
     *
     * @method fireDragStartEvent
     * @param {VertEvent|XMouseEvent} e - The drag-start event itself to be fired to all installed dragStart listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireDragStartEvent(e: VertEvent | XMouseEvent): void;
    /**
     * Fire a dragEnd event with the given event instance to all
     * installed drag-end listeners.
     *
     * @method fireDragEndEvent
     * @param {VertEvent|XMouseEvent} e - The drag-end event itself to be fired to all installed dragEnd listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    fireDragEndEvent(e: VertEvent | XMouseEvent): void;
    /**
     * @private
     **/
    private static _fireEvent;
    /**
     * @private
     */
    private static _addListener;
    /**
     * @private
     */
    private static _removeListener;
}
