/**
 * A simple touch event handle for demos. 
 * Use to avoid loading massive libraries like jQuery.
 *
 * Usage: 
 *   new TouchHandler( document.getElementById('mycanvas') )
 *	    .touchstart( function(e) {
 *		console.log( 'Touch start: ' + JSON.stringify(e) );
 *	    } )
 *
 *
 * @author   Ikaros Kappler
 * @date     2019-02-10
 * @version  1.0.0
 **/

(function(_context) {

    // +----------------------------------------------------------------------
    // | The constructor.
    // |
    // | Pass the DOM element you want to receive mouse events from.
    // +-------------------------------------------------
    function __constructor( element ) {

	// +----------------------------------------------------------------------
	// | Some private vars to store the current mouse/position/button state.
	// +-------------------------------------------------
	var touchStartPositions = {};
	var touchMovePositions = {};
	var listeners    = {};
	var installed    = {};
	var handlers     = {};
	// var recentEvent  = null;


	// +----------------------------------------------------------------------
	// | Some private vars to store the current mouse/position/button state.
	// +-------------------------------------------------
	function relPos( e ) {
	    // console.log( e );
	    var positions = [];
	    for( var i = 0; i < e.touches.length; i++ ) {
		// console.log( 'touch['+i+']' );
		positions.push( { x : e.touches[i].clientX - e.target.offsetLeft,
				  y : e.touches[i].clientY - e.target.offsetTop
				} );
	    };
	    return positions;
	}
	function mkParams( e, eventName ) {
	    var relPositions = relPos(e);
	    // e.params = { element : element, name : eventName, pos : rel };
	    e.params = { element : element, name : eventName, pos : relPositions[0], positions : relPositions, button : -1, leftButton : false, middleButton : false, rightButton : false, mouseDownPos : null, draggedFrom : null, wasDragged : false, dragAmount : {x:0,y:0}, dragAmounts : [] };
	    return e;
	}

	function listenFor( eventName ) {
	    if( installed[eventName] ) return;
	    element.addEventListener(eventName,handlers[eventName]);
	    installed[eventName] = true;
	}

	function unlistenFor( eventName ) {
	    if( !installed[eventName] ) return;
	    element.removeEventListener(eventName,handlers[eventName]);
	    delete installed[eventName];
	}


	// +----------------------------------------------------------------------
	// | Define the internal event handlers.
	// |
	// | They will dispatch the modified event (relative mouse position,
	// | drag offset, ...) to the callbacks.
	// +-------------------------------------------------
	handlers['touchstart'] = function(e) {
	    if( listeners.touchstart ) listeners.touchstart( mkParams(e,'touchstart') );
	    touchStartPositions = e.params.positions;
	    touchMovePositions = e.params.positions;
	}
	handlers['touchmove'] = function(e) {
	    if( listeners.touchmove ) {
		e.preventDefault();
		mkParams(e,'touchmove')
		e.params.dragAmounts = [];
		// console.log('zzz',touchMovePositions);
		if( touchMovePositions && touchMovePositions.length > 0 ) {
		    //console.log('touch move events');
		    for( var i in touchMovePositions ) {
			e.params.dragAmounts[i] = { x: e.params.positions[i].x-touchMovePositions[i].x,
						    y: e.params.positions[i].y-touchMovePositions[i].y
						  };
		    }
		    e.params.dragAmount = e.params.dragAmounts[0];
		    e.params.wasDragged = true;
		    console.log( e.params.dragAmounts );
		}
		listeners.touchmove( e );
	    }
	   
	    //touchMovePositions = [];
	    //for( var i in e.params.positions )
	    //	touchMovePositions[i] = e.params.positions[i];
	    touchMovePositions = e.params.positions;
	}
	handlers['touchcancel'] = function(e) {
	    if( listeners.touchcancel ) listeners.touchcancel( mkParams(e,'touchcancel') );
	    touchStartPositions = null;
	}
	handlers['touchend'] = function(e) {
	    if( listeners.touchend ) listeners.click( mkParams(e,'touchend') );
	    touchStartPositions = null;
	}


	// +----------------------------------------------------------------------
	// | The installer functions.
	// |
	// | Pass your callbacks here.
	// | Note: they support chaining.
	// +-------------------------------------------------
	this.touchstart = function( callback ) {
	    if( listeners.touchstart ) throwAlreadyInstalled('touchstart');
	    listenFor('touchstart');
	    listeners.touchstart = callback;
	    return this;
	};
	this.touchmove = function( callback ) {
	    console.log('touchmove')
	    if( listeners.touchmove ) throwAlreadyInstalled('touchmove');
	    listenFor('touchmove');
	    listeners.touchmove = callback;
	    return this;
	};
	this.touchcancel = function( callback ) {
	    if( listeners.touchcancel ) throwAlreadyInstalled('mouseup'); 
	    listenFor('mouseup');
	    listeners.mouseup = callback;
	    return this;
	};
	this.touchend = function( callback ) {
	    if( listeners.mousedown )  throwAlreadyInstalled('mousedown'); 
	    listenFor('mousedown');
	    listeners.mousedown = callback;
	    return this;
	};
	this.touchcancel = function( callback ) {
	    if( listeners.click )  throwAlreadyInstalled('click'); 
	    listenFor('click');
	    listeners.click = callback;
	    return this;
	};

	function throwAlreadyInstalled( name ) {
	    throw "This TouchHandler already has a '"+name+"' callback. To keep the code simple there is only room for one.";
	}
	
	// +----------------------------------------------------------------------
	// | Call this when your work is done.
	// |
	// | The function will un-install all event listeners.
	// +-------------------------------------------------
	this.destroy = function() {
	    unlistenFor('touchstart');
	    unlistenFor('touchmove');
	    unlistenFor('touchend');
	    unlistenFor('touchcancel');
	}
    }

    _context.TouchHandler = __constructor;
})(typeof window != 'undefined' ? window : module.export);
