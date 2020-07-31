/**
 * A helper for adding vertices to and remove vertices from Bézier paths.
 *
 * @require PlotBoilerplate, KeyHandler, MouseHandler, AlloyFinger
 *
 * TODO: 
 *  * implement removal of whole paths.
 *  * it seems the drag listener removal on vertices does not work properly.
 *  * add options like pathAutoAdjust=true|false.
 *  * does not work with empty path arrays yet (errors).
 *  * add function to add more paths.
 *  * removing vertices on one curve also alters the other?!!
 *
 * @author  Ikaros Kappler
 * @date    2020-07-31
 * @version 1.0.0
 **/

(function(_context) {

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
     * @param {function(Vertex,Vertex,number,number)} moveCallback
     **/
    var BezierPathInteractionHelper = function( pb, paths, moveCallback) {
	this.pb = pb;
	// Array<BezierPath>
	this.paths = paths;
	this.moveCallback = moveCallback; // function(Vertex,Vertex,number,number)

	this.currentPathIndex = -1;
	this.currentT = 0.0;
	this.currentA = new Vertex(0,0); // Position on the curve
	this.currentB = new Vertex(0,0); // mouse/touch position

	for( var i = 0; i < paths.length; i++ ) {
	    BezierPathInteractionHelper.setPathAutoAdjust( paths[i] );
	}
	
	this._installMouseListener();
	this._installTouchListener();
	this._installKeyListener();
    };

    BezierPathInteractionHelper.prototype._handleDelete = function () {

	// Check all path points (on all paths) for deletion.
	// Note: whole paths are not meant to be removed this way.
	for( var p = 0; p < this.paths.length; p++ ) {
	    // console.log('delete',p);
	    var path = this.paths[p];
	    var newCurves = [];
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
		this._removeDefaultPathListeners( path );
		path = BezierPath.fromArray( newCurves );
		BezierPathInteractionHelper.setPathAutoAdjust( path );
		this.paths[ p ] = path;
		this.pb.add( path );
		// Replace path inside the array with the new path
		// this._addDefaultPathListeners( path );
	    }
	}
    };

    BezierPathInteractionHelper.prototype.handleMoveEvent = function( posX, posY ) {
	var point = this.pb.transformMousePosition( posX, 
						    posY );
	this.currentB.set( point );
	this._updateMinDistance();
	this.moveCallback( this.currentA, this.currentB, this.currentT, this.currentPathIndex );
	this.pb.redraw();
    };

    BezierPathInteractionHelper.prototype._installTouchListener = function() {
	var _self = this;	
	new AlloyFinger( this.pb.canvas, {
	    touchMove: function (e) {
		if( pb.getDraggedElementCount() == 0 && e.touches.length > 0 ) {
		    console.log('touchmove');
		    _self.handleMoveEvent( e.touches[0].clientX, e.touches[0].clientY );
		}
	    }
	} );
    };

    BezierPathInteractionHelper.prototype._installMouseListener = function() {
	var _self = this;
	new MouseHandler(this.pb.canvas)
	    .up( function(e) {
		if( e.params.wasDragged )
		    return;
		var path = _self.paths[ _self.currentPathIndex ];
		console.log('Clicked', e.params.wasDragged);
		var vertex = _self.pb.getVertexNear( e.params.pos,
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
		
		//console.log('Inserting vertex at', _self.currentT );
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
		_self._removeDefaultPathListeners( path );
		path = BezierPath.fromArray( newCurves );
		BezierPathInteractionHelper.setPathAutoAdjust( path );
		// _self.path = path;
		_self.paths[ _self.currentPathIndex ] = path;
		_self.pb.add( path );
		// _self._addDefaultPathListeners( path );
	    })
	    .move( function(e) {
		// console.log('moved');
		// if( _self.pb.getDraggedElementCount() == 0 )
		_self.handleMoveEvent( e.params.pos.x, e.params.pos.y );
		
	    } );

    };

    BezierPathInteractionHelper.prototype._installKeyListener = function() {
	var _self = this;
	new KeyHandler( { trackAll : true } )
	    .down('delete',function() {
		_self._handleDelete();
	    } );

	// Install listeners to Bézier paths, too?
	//for( var i = 0; i < _self.paths.length; i++ ) {
	    // _self._addDefaultPathListeners( _self.paths[i] );
	//}
    };

    BezierPathInteractionHelper.prototype._addDefaultPathListeners = function( path ) {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    var curve = path.bezierCurves[i];
	    curve.startPoint.listeners.addDragListener( this._updateMinDistance );
	    curve.startControlPoint.listeners.addDragListener( this._updateMinDistance );
	    curve.endControlPoint.listeners.addDragListener( this._updateMinDistance );
	    if( i+1 == path.bezierCurves.length && !path.adjustCircular )
		curve.endPoint.listeners.addDragListener( this._updateMinDistance );
	}
    };

    BezierPathInteractionHelper.prototype._removeDefaultPathListeners = function( path ) {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    var curve = path.bezierCurves[i];
	    curve.startPoint.listeners.removeDragListener( this._updateMinDistance );
	    curve.startControlPoint.listeners.removeDragListener( this._updateMinDistance );
	    curve.endControlPoint.listeners.removeDragListener( this._updateMinDistance );
	    if( i+1 == path.bezierCurves.length && !path.adjustCircular )
		curve.endPoint.listeners.removeDragListener( this._updateMinDistance );
	}
    };

    // +---------------------------------------------------------------------------------
    // | Update the min distance from point `line.b` to the curve. And redraw.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._updateMinDistance = function() {
	var pathIndex = -1;
	var minDist = Number.MAX_VALUE;
	var closestPoint = null;
	var closestT = 0.0;
	for( var i = 0; i < this.paths.length; i++ ) {
	    var path = this.paths[i];
	    var t = path.getClosestT( this.currentB );
	    var point = path.getPointAt( t );
	    var dist = point.distance( this.currentB );
	    if( dist < minDist ) {
		pathIndex = i;
		minDist = dist;
		closestT = t;
		closestPoint = point;
	    }
	}
	this.currentT = closestT;
	this.currentPathIndex = pathIndex;
	this.currentA.set( closestPoint );
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

