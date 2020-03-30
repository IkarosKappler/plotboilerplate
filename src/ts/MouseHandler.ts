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

interface XMouseParams {
    element : HTMLElement; 
    name : string;
    pos : {x:number,y:number};
    button : number;
    leftButton : boolean;
    middleButton : boolean;
    rightButton : boolean;
    mouseDownPos : {x:number,y:number}; 
    draggedFrom : {x:number,y:number};
    wasDragged : boolean;
    dragAmount : {x:number,y:number};
}
class XMouseEvent extends MouseEvent {
    params: XMouseParams;
}
class XWheelEvent extends WheelEvent {
    params: XMouseParams;
}

class MouseHandler {

    private element        : HTMLElement;
    private mouseDownPos   : { x:number, y:number }|undefined = null;
    private mouseDragPos   : { x:number, y:number }|undefined = null;
    private mousePos       : { x:number, y:number }|undefined = null;
    private mouseButton    : number = -1;
    private listeners : Record<string,(e:XMouseEvent)=>void> = {};
    // private wheelListeners : Record<string,(e:XWheelEvent)=>void> = {};
    private installed      : Record<string,boolean> = {};
    private handlers  : Record<string,(e:XMouseEvent)=>void> = {};
    // private wheelHandlers  : Record<string,(e:XWheelEvent)=>void> = {};
    
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * @param {HTMLElement} element
     **/
    constructor( element:HTMLElement ) {
	// +----------------------------------------------------------------------
	// | Some private vars to store the current mouse/position/button state.
	// +-------------------------------------------------
	this.element      = element;
	this.mouseDownPos = null;
	this.mouseDragPos = null;
	this.mousePos     = null;
	this.mouseButton  = -1;
	this.listeners    = {};
	this.installed    = {};
	this.handlers     = {};

	// +----------------------------------------------------------------------
	// | Define the internal event handlers.
	// |
	// | They will dispatch the modified event (relative mouse position,
	// | drag offset, ...) to the callbacks.
	// +-------------------------------------------------
	const _self : MouseHandler = this;
	this.handlers['mousemove'] = function(e:MouseEvent) {
	    if( _self.listeners.mousemove ) _self.listeners.mousemove( _self.mkParams(e,'mousemove') );
	    if( _self.mouseDragPos && _self.listeners.drag ) _self.listeners.drag( _self.mkParams(e,'drag') );
	    if( _self.mouseDownPos ) _self.mouseDragPos = _self.relPos(e);
	}
	this.handlers['mouseup'] = function(e:MouseEvent) {
	    if( _self.listeners.mouseup ) _self.listeners.mouseup( _self.mkParams(e,'mouseup') );
	    _self.mouseDragPos = null;
	    _self.mouseDownPos = null;
	    _self.mouseButton  = -1;
	}
	this.handlers['mousedown'] = function(e) {
	    _self.mouseDragPos = _self.relPos(e);
	    _self.mouseDownPos = _self.relPos(e);
	    _self.mouseButton = e.button;
	    if( _self.listeners.mousedown ) _self.listeners.mousedown( _self.mkParams(e,'mousedown') );
	}
	this.handlers['click'] = function(e) {
	    if( _self.listeners.click ) _self.listeners.click( _self.mkParams(e,'mousedown') );
	}
	this.handlers['wheel'] = function(e) {
	    if( _self.listeners.wheel ) _self.listeners.wheel( _self.mkParams(e,'wheel') );
	}
    }

    // +----------------------------------------------------------------------
    // | Some private vars to store the current mouse/position/button state.
    // +-------------------------------------------------
    private relPos(e:MouseEvent) : { x:number, y:number } {
	return { x : e.offsetX, // e.pageX - e.target.offsetLeft,
		 y : e.offsetY  // e.pageY - e.target.offsetTop
	       };
    }
    
    private mkParams(e:MouseEvent,eventName:string) : XMouseEvent {
	const rel : {x:number,y:number} = this.relPos(e);
	const xEvent : XMouseEvent = ((e as unknown) as XMouseEvent);
	xEvent.params = {
	    element : this.element,
	    name : eventName,
	    pos : rel,
	    button : this.mouseButton,
	    leftButton : this.mouseButton==0,
	    middleButton : this.mouseButton==1,
	    rightButton : this.mouseButton==2,
	    mouseDownPos : this.mouseDownPos,
	    draggedFrom : this.mouseDragPos,
	    wasDragged : (this.mouseDownPos!=null&&(this.mouseDownPos.x!=rel.x||this.mouseDownPos.y!=rel.y)),
	    dragAmount : (this.mouseDownPos!=null?{x:rel.x-this.mouseDragPos.x,y:rel.y-this.mouseDragPos.y}:{x:0,y:0})
	};
	return xEvent;
    }

    private listenFor( eventName:string ) {
	if( this.installed[eventName] ) return;
	this.element.addEventListener(eventName,this.handlers[eventName]);
	this.installed[eventName] = true;
    }

    private unlistenFor( eventName:string ) {
	if( !this.installed[eventName] ) return;
	this.element.removeEventListener(eventName,this.handlers[eventName]);
	delete this.installed[eventName];
    }


    // +----------------------------------------------------------------------
    // | The installer functions.
    // |
    // | Pass your callbacks here.
    // | Note: they support chaining.
    // +-------------------------------------------------
    drag( callback:(e:XMouseEvent)=>void ) : MouseHandler {
	if( this.listeners.drag ) this.throwAlreadyInstalled('drag');
	this.listeners.drag = callback;
	this.listenFor('mousedown');
	this.listenFor('mousemove');
	this.listenFor('mouseup');
	//listeners.drag = callback;
	return this;
    };
    move( callback:(e:XMouseEvent)=>void ) : MouseHandler {
	if( this.listeners.mousemove ) this.throwAlreadyInstalled('mousemove');
	this.listenFor('mousemove');
	this.listeners.mousemove = callback;
	return this;
    };
    up( callback:(e:XMouseEvent)=>void ) : MouseHandler {
	if( this.listeners.mouseup ) this.throwAlreadyInstalled('mouseup'); 
	this.listenFor('mouseup');
	this.listeners.mouseup = callback;
	return this;
    };
    down( callback:(e:XMouseEvent)=>void ) : MouseHandler {
	if( this.listeners.mousedown ) this.throwAlreadyInstalled('mousedown'); 
	this.listenFor('mousedown');
	this.listeners.mousedown = callback;
	return this;
    };
    click( callback:(e:XMouseEvent)=>void ) : MouseHandler {
	if( this.listeners.click ) this.throwAlreadyInstalled('click'); 
	this.listenFor('click');
	this.listeners.click = callback;
	return this;
    };
    wheel( callback:(e:XWheelEvent)=>void ) : MouseHandler {
	if( this.listeners.wheel ) this.throwAlreadyInstalled('wheel');
	this.listenFor('wheel');
	this.listeners.wheel = callback;
	return this;
    };

    private throwAlreadyInstalled( name:string ) {
	throw `This MouseHandler already has a '${name}' callback. To keep the code simple there is only room for one.`;
    }
    
    // +----------------------------------------------------------------------
    // | Call this when your work is done.
    // |
    // | The function will un-install all event listeners.
    // +-------------------------------------------------
    destroy() {
	this.unlistenFor('mousedown');
	this.unlistenFor('mousemove');
	this.unlistenFor('moseup');
	this.unlistenFor('click');
	this.unlistenFor('wheel');
    }
}
