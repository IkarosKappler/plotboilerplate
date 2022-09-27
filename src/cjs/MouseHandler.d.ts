/**
 * @author   Ikaros Kappler
 * @date     2018-03-19
 * @modified 2018-04-28 Added the param 'wasDragged'.
 * @modified 2018-08-16 Added the param 'dragAmount'.
 * @modified 2018-08-27 Added the param 'element'.
 * @modified 2018-11-11 Changed the scope from a simple global var to a member of window/_context.
 * @modified 2018-11-19 Renamed the 'mousedown' function to 'down' and the 'mouseup' function to 'up'.
 * @modified 2018-11-28 Added the 'wheel' listener.
 * @modified 2018-12-09 Cleaned up some code.
 * @modified 2019-02-10 Cleaned up some more code.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-04-08 Fixed the click event (internally fired a 'mouseup' event) (1.0.10)
 * @modified 2020-04-08 Added the optional 'name' property. (1.0.11)
 * @modified 2020-04-08 The new version always installs internal listenrs to track drag events even
 *                      if there is no external drag listener installed (1.1.0).
 * @modified 2020-10-04 Added extended JSDoc comments.
 * @modified 2020-11-25 Added the `isTouchEvent` param.
 * @modified 2021-01-10 The mouse handler is now also working with SVGElements.
 * @modified 2022-08-16 Fixed a bug in the mouse button detection.
 * @version  1.2.1
 *
 * @file MouseHandler
 * @public
 **/
export interface XMouseParams {
    button: number;
    element: HTMLElement | SVGElement;
    isTouchEvent: boolean;
    name: string;
    pos: {
        x: number;
        y: number;
    };
    leftButton: boolean;
    middleButton: boolean;
    rightButton: boolean;
    mouseDownPos: {
        x: number;
        y: number;
    };
    draggedFrom: {
        x: number;
        y: number;
    };
    wasDragged: boolean;
    dragAmount: {
        x: number;
        y: number;
    };
}
export declare class XMouseEvent extends MouseEvent {
    params: XMouseParams;
}
export declare class XWheelEvent extends WheelEvent {
    params: XMouseParams;
}
export declare type XMouseCallback = (e: XMouseEvent) => void;
export declare type XWheelCallback = (e: XWheelEvent) => void;
/**
 * @classdesc A simple mouse handler for demos.
 * Use to avoid load massive libraries like jQuery.
 *
 * @requires XYCoords
 */
export declare class MouseHandler {
    private name;
    private element;
    private mouseDownPos;
    private mouseDragPos;
    private mouseButton;
    private listeners;
    private installed;
    private handlers;
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * Usage
     * =====
     * @example
     *   // Javascript
     *   new MouseHandler( document.getElementById('mycanvas') )
     *	    .drag( function(e) {
     *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
     *		if( e.params.leftMouse ) ;
     *		else if( e.params.rightMouse ) ;
     *	    } )
     *	    .move( function(e) {
     *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
     *	    } )
     *          .up( function(e) {
     *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
     *          } )
     *          .down( function(e) {
     *              console.log( 'Mouse down.' );
     *          } )
     *          .click( function(e) {
     *              console.log( 'Click.' );
     *          } )
     *          .wheel( function(e) {
     *              console.log( 'Wheel. delta='+e.deltaY );
     *          } )
     *
     * @example
     *   // Typescript
     *   new MouseHandler( document.getElementById('mycanvas') )
     *	    .drag( (e:XMouseEvent) => {
     *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
     *		if( e.params.leftMouse ) ;
     *		else if( e.params.rightMouse ) ;
     *	    } )
     *	    .move( (e:XMouseEvent) => {
     *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
     *	    } )
     *          .up( (e:XMouseEvent) => {
     *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
     *          } )
     *          .down( (e:XMouseEvent) => {
     *              console.log( 'Mouse down.' );
     *          } )
     *          .click( (e:XMouseEvent) => {
     *              console.log( 'Click.' );
     *          } )
     *          .wheel( (e:XWheelEvent) => {
     *              console.log( 'Wheel. delta='+e.deltaY );
     *          } )
     *
     * @constructor
     * @instance
     * @memberof MouseHandler
     * @param {HTMLElement} element
     **/
    constructor(element: HTMLElement | SVGElement, name?: string);
    /**
     * Get relative position from the given MouseEvent.
     *
     * @name relPos
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {MouseEvent} e - The mouse event to get the relative position for.
     * @return {XYCoords} The relative mouse coordinates.
     */
    private relPos;
    /**
     * Build the extended event params.
     *
     * @name mkParams
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {MouseEvent} event - The mouse event to get the relative position for.
     * @param {string} eventName - The name of the firing event.
     * @return {XMouseEvent}
     */
    private mkParams;
    /**
     * Install a new listener.
     * Please note that this mouse handler can only handle one listener per event type.
     *
     * @name listenFor
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} eventName - The name of the firing event to listen for.
     * @return {void}
     */
    private listenFor;
    /**
     * Un-install a new listener.
     *
     * @name listenFor
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} eventName - The name of the firing event to unlisten for.
     * @return {void}
     */
    private unlistenFor;
    /**
     * Installer function to listen for a specific event: mouse-drag.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name drag
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The drag-callback to listen for.
     * @return {MouseHandler} this
     */
    drag(callback: XMouseCallback): MouseHandler;
    /**
     * Installer function to listen for a specific event: mouse-move.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name move
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The move-callback to listen for.
     * @return {MouseHandler} this
     */
    move(callback: (e: XMouseEvent) => void): MouseHandler;
    /**
     * Installer function to listen for a specific event: mouse-up.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name up
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The up-callback to listen for.
     * @return {MouseHandler} this
     */
    up(callback: (e: XMouseEvent) => void): MouseHandler;
    /**
     * Installer function to listen for a specific event: mouse-down.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name down
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The down-callback to listen for.
     * @return {MouseHandler} this
     */
    down(callback: (e: XMouseEvent) => void): MouseHandler;
    /**
     * Installer function to listen for a specific event: mouse-click.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name click
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The click-callback to listen for.
     * @return {MouseHandler} this
     */
    click(callback: (e: XMouseEvent) => void): MouseHandler;
    /**
     * Installer function to listen for a specific event: mouse-wheel.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name wheel
     * @memberof MouseHandler
     * @instance
     * @param {XWheelCallback} callback - The wheel-callback to listen for.
     * @return {MouseHandler} this
     */
    wheel(callback: (e: XWheelEvent) => void): MouseHandler;
    /**
     * An internal function to throw events.
     *
     * @name throwAlreadyInstalled
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} name - The name of the event.
     * @return {void}
     */
    private throwAlreadyInstalled;
    /**
     * Call this when your work is done.
     *
     * The function will un-install all event listeners.
     *
     * @name destroy
     * @memberof MouseHandler
     * @instance
     * @private
     * @return {void}
     */
    destroy(): void;
}
