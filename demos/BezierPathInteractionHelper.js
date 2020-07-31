/**
 * A helper for adding vertices to and remove vertices from Bézier paths.
 *
 * @require PlotBoilerplate, KeyHandler, MouseHandler, AlloyFinger
 *
 * @author  Ikaros Kappler
 * @date    2020-07-31
 * @version 1.0.0
 **/

(function(_context) {

    var BezierPathInteractionHelper = function( pb, path, moveCallback) {
	this.pb = pb;
	this.path = path;
	this.moveCallback = moveCallback; // function(Vertex,Vertex,number)

	this.currentT = 0.0;
	this.currentA = new Vertex(0,0); // Position on the curve
	this.currentB = new Vertex(0,0); // mouse/touch position
	this.installListeners();
    };

    BezierPathInteractionHelper.prototype.handleDelete = function () {
	var path = this.path;
	console.log('delete');
	var newCurves = [ ];
	// Find first non-selected path point
	var curveIndex = 0;
	while( curveIndex < path.bezierCurves.length && path.bezierCurves[curveIndex].startPoint.attr.isSelected ) {
	    curveIndex++;
	}
	// Only keep those curves that have no selected path point (=delete selected)
	var curStart = path.bezierCurves[curveIndex].startPoint;
	var curStartControl = path.bezierCurves[curveIndex].startControlPoint;
	for( var i = curveIndex; i < path.bezierCurves.length; i++ ) {
	    if( !path.bezierCurves[i].endPoint.attr.isSelected ) {
		newCurves.push( [ curStart.clone(),
				  path.bezierCurves[i].endPoint.clone(),
				  curStartControl.clone(),
				  path.bezierCurves[i].endControlPoint.clone() ] );
		curStart = path.bezierCurves[i].endPoint;
		curStartControl = path.bezierCurves[i].endControlPoint;
	    }
	}
	// Do not remove the whole path
	if( newCurves.length != 0 ) {
	    this.pb.remove( path, false, true ); // Remove with vertices
	    path = BezierPath.fromArray( newCurves );
	    // addPath( path );
	    // TODO: set auto-adjustment to curves
	    BezierPathInteractionHelper.setPathAutoAdjust( path );
	    this.pb.add( path );
	}
    };

    BezierPathInteractionHelper.prototype.handleMoveEvent = function( posX, posY ) {
	var point = this.pb.transformMousePosition( posX, 
						    posY );
	this.currentB.set( point );
	this.updateMinDistance();
	this.moveCallback( this.currentA, this.currentB, this.currentT );
	this.pb.redraw();
    };

    BezierPathInteractionHelper.prototype.installListeners = function() {

	var _self = this;
	var path = _self.path;
	
	new AlloyFinger( this.pb.canvas, {
	    touchMove: function (e) {
		if( pb.getDraggedElementCount() == 0 && e.touches.length > 0 ) {
		    // handleMoveEvent( e.touches[0].clientX, e.touches[0].clientY );
		    /* var point = _self.pb.transformMousePosition( e.touches[0].clientX, // posX, 
		       e.touches[0].clientY ); // posY );
		       _self.currentB.set( point );
		       _self.moveCallback( _self.currentA, _self.currentB, _self.currentT ); */
		    console.log('touchmove');
		    _self.handleMoveEvent( e.touches[0].clientX, e.touches[0].clientY );
		}
	    }
	} );
	new MouseHandler(this.pb.canvas)
	    .up( function(e) {
		if( e.params.wasDragged )
		    return;
		console.log('Clicked', e.params.wasDragged);
		var vertex = _self.pb.getVertexNear( e.params.pos, // pb.transformMousePosition(e.params.pos.x,e.params.pos.y),
						     PlotBoilerplate.DEFAULT_CLICK_TOLERANCE
						   );
		console.log( 'Vertex', vertex );
		if( vertex )
		    return;
		// Check if there is already a path point at the given split position
		var pathPoint = path.getPointAt(_self.currentT);
		var pointNear = _self.pb.getVertexNear( _self.pb.revertMousePosition(pathPoint.x,pathPoint.y), 6.0 );
		console.log( "pathPoint", pathPoint, pointNear );
		if( pointNear ) {
		    for( var i = 0; i < path.bezierCurves.length; i++ ) {
			if( path.bezierCurves[i].startPoint.distance(pointNear) <= 6.0 || path.bezierCurves[i].endPoint.distance(pointNear) <= 6.0 ) {
			    console.log("There is already a path point near this position.");
			    return;
			}
		    }
		}
		console.log('Inserting vertex at', _self.currentT );
		var leftPath = path.getSubPathAt( 0.0, _self.currentT );
		var rightPath = path.getSubPathAt( _self.currentT, 1.0 );
		var newCurves = [];
		for( var i = 0; i < leftPath.bezierCurves.length; i++ ) {
		    newCurves.push( leftPath.bezierCurves[i] );		
		}
		for( var i = 0; i < rightPath.bezierCurves.length; i++ ) {
		    newCurves.push( rightPath.bezierCurves[i] );		
		}
		_self.pb.remove( path, false, true ); // Remove with vertices
		path = BezierPath.fromArray( newCurves );
		// addPath( path );
		// TODO: add auto adjustment (2)
		BezierPathInteractionHelper.setPathAutoAdjust( path );
		_self.path = path;
		_self.pb.add( path );
	    })
	    .move( function(e) {
		// console.log('moved');
		// if( _self.pb.getDraggedElementCount() == 0 )
		_self.handleMoveEvent( e.params.pos.x, e.params.pos.y );
		
	    } );

	new KeyHandler( { trackAll : true } )
	    .down('delete',function() {
		_self.handleDelete();
	    } );

	// Install listeners to BézierPath, too!
	_self._addDefaultPathListeners( path );
    };

    BezierPathInteractionHelper.prototype._addDefaultPathListeners = function( path ) {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    var curve = path.bezierCurves[i];
	    curve.startPoint.listeners.addDragListener( this.updateMinDistance );
	    curve.startControlPoint.listeners.addDragListener( this.updateMinDistance );
	    curve.endControlPoint.listeners.addDragListener( this.updateMinDistance );
	    if( i+1 == path.bezierCurves.length && !path.adjustCircular )
		curve.endPoint.listeners.addDragListener( this.updateMinDistance );
	}
    };

    BezierPathInteractionHelper.prototype._removeDefaultPathListeners = function( path ) {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    var curve = path.bezierCurves[i];
	    curve.startPoint.listeners.removeDragListener( _self.updateMinDistance );
	    curve.startControlPoint.listeners.removeragListener( _self.updateMinDistance );
	    curve.endControlPoint.listeners.removeDragListener( _self.updateMinDistance );
	    if( i+1 == path.bezierCurves.length && !path.adjustCircular )
		curve.endPoint.listeners.removeDragListener( _self.updateMinDistance );
	}
    };

    // +---------------------------------------------------------------------------------
    // | Update the min distance from point `line.b` to the curve. And redraw.
    // +-------------------------------
    BezierPathInteractionHelper.prototype.updateMinDistance = function() {
	var path = this.path;
	this.currentT = path.getClosestT( this.currentB );
	var closestPoint = path.getPointAt( this.currentT );
	/* line.a.x = closestPoint.x;
	   line.a.y = closestPoint.y; */
	this.currentA.set( closestPoint );
	// this.pb.redraw();
	// this.moveCallback( this.currentA, this.currentB, this.currentT );
	// this.pb.redraw();
    };

    // @static
    BezierPathInteractionHelper.setPathAutoAdjust = function( path ) {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    var curve = path.bezierCurves[i];
	    path.adjustPredecessorControlPoint( i,     
						true,  // obtainHandleLength
						false   // updateArcLength  (we will do this after the loop)
					      );
	    if( i > 0 || path.adjustCircular )
		curve.startPoint.attr.bezierAutoAdjust = true;
	}
	path.updateArcLengths();
    };
    
    _context.BezierPathInteractionHelper = BezierPathInteractionHelper;

})(window);

