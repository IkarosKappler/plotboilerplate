/**
 * A simple mouse handler for demos.
 * Use to avoid load massive libraries like jQuery.
 *
 * Usage:
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
 *              console.log( 'Mouse up.' );
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
 *
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
 * @version  1.0.9
 **/
export interface XMouseParams {
    element: HTMLElement;
    name: string;
    pos: {
        x: number;
        y: number;
    };
    button: number;
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
export declare class MouseHandler {
    private element;
    private mouseDownPos;
    private mouseDragPos;
    private mousePos;
    private mouseButton;
    private listeners;
    private installed;
    private handlers;
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * @param {HTMLElement} element
     **/
    constructor(element: HTMLElement);
    private relPos;
    private mkParams;
    private listenFor;
    private unlistenFor;
    drag(callback: (e: XMouseEvent) => void): MouseHandler;
    move(callback: (e: XMouseEvent) => void): MouseHandler;
    up(callback: (e: XMouseEvent) => void): MouseHandler;
    down(callback: (e: XMouseEvent) => void): MouseHandler;
    click(callback: (e: XMouseEvent) => void): MouseHandler;
    wheel(callback: (e: XWheelEvent) => void): MouseHandler;
    private throwAlreadyInstalled;
    destroy(): void;
}