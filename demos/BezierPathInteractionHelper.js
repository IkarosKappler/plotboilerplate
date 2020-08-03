/**
 * A helper for adding vertices to and remove vertices from Bézier paths.
 *
 * By default the 'delete' key is used to remove vertices or paths.
 *
 *
 * @require PlotBoilerplate, KeyHandler, MouseHandler, AlloyFinger
 *
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
     * @param {boolean} options.autoAdjustPaths - If true then inner path points will be auto-adjusted to keep the curve smooth.
     * @param {boolean} options.allowPathRemoval - If true then full paths can be removed (by removing selected vertices).
     * @param {number} maxDetectDistance - The max detection distance. No events will be fired if the mouse/touch pointer is outside this range (default is Number.MAX_VALUE).
     * @param {function(number,Vertex,Vertex,number)} options.onPointerMoved (pathIndex,pathPoint,pointer,t)
     * @param {function(number,number,BezierPath,BezierPath)} options.onVertexInserted (pathIndex,insertIndex,newPath,oldPath)
     * @param {function(number,number[],BezierPath,BezierPath)} options.onVerticesDeleted (pathIndex,removedVertexIndices,newPath,oldPath)
     * @param {function(number,BezierPath)} options.onPathRemoved (pathIndex,oldPath)
     **/
    var BezierPathInteractionHelper = function( pb, paths, options ) {
	options = options || {};
	this.pb = pb;
	// Array<BezierPath>
	this.paths = [];
	// function(Vertex,Vertex,number,number
	this.onPointerMoved = options.onPointerMoved || function(i,a,b,t) { };
	this.onVertexInserted = options.onVertexInserted || function(i,j,n,o) { };
	this.onVerticesDeleted = options.onVerticesDeleted || function(i,r,n,o) { },
	this.onPathRemoved = options.onPathRemoved || function(i,o) { };
	this.autoAdjustPaths = typeof options.autoAdjustPaths == 'boolean' ? options.autoAdjustPaths : true;
	this.allowPathRemoval = typeof options.allowPathRemoval == 'boolean' ? options.allowPathRemoval : true;
	this.maxDetectDistance = typeof options.maxDetectDistance == 'number' ? options.maxDetectDistance : Number.MAX_VALUE;

	this.mouseIsOver = false;
	this.currentPathIndex = -1;
	this.currentDistance = Number.MAX_VALUE;
	this.currentT = 0.0;
	this.currentA = new Vertex(0,0); // Position on the curve
	this.currentB = new Vertex(0,0); // mouse/touch position

	// Rebuild the array to avoid outside manipulations.
	for( var i = 0; i < paths.length; i++ ) {
	    this.addPath( paths[i] );
	}

	this._installMouseListener();
	this._installTouchListener();
	this._keyHandler = this._installKeyListener();

	// Paths might have changed
	if( this.autoAdjustPaths )
	    pb.redraw();
    };

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
    BezierPathInteractionHelper.prototype.addPath = function( path ) {
	var pathIndex = this._locatePath( path );
	if( pathIndex != -1 )
	    return false;
	this.paths.push( path );
	if( this.autoAdjustPaths )
	    BezierPathInteractionHelper.setPathAutoAdjust( path );
	return true;
    };


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
    BezierPathInteractionHelper.prototype.removePath = function( path ) {
	var pathIndex = this._locatePath( path );
	if( pathIndex == -1 )
	    return false;
	this.removePathAt( pathIndex );
	return true;
    };


    /**
     * Remove the path at the given index.
     *
     * @method removePathAt
     * @instance
     * @memberof BezierPathInteractionHelper
     * @param {number} pathIndex - The index of the path (must be inside bounds, see `this.paths` array).
     * @return {void}
     **/
    BezierPathInteractionHelper.prototype.removePathAt = function( pathIndex ) {
	var path = this.paths[ pathIndex ];
	this.paths = this.paths.filter( function(value,index) { return index!=pathIndex; } );
	this._removeDefaultPathListeners( path );
	this.pb.remove( path, false, true ); // Remove with vertices
	this.onPathRemoved(pathIndex,path);
    };


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
    BezierPathInteractionHelper.prototype.update = function() {
	// Just re-run the calculation with the recent mouse/touch position
	this._handleMoveEvent( this.currentB.x, this.currentB.y );
    };


    // +---------------------------------------------------------------------------------
    // | A helper function to locate a given path instance inside the array.
    // |
    // | @return The index of the path or -1 if not found.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._locatePath = function( path ) {
	for( var i = 0; i < this.paths.length; i++ ) {
	    if( this.paths[i] == path )
		return i;
	}
	return -1;
    };


    // +---------------------------------------------------------------------------------
    // | Handle deletion of any selecte vertex and/or paths.
    // | Note that this function will trigger a `redraw`.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._handleDelete = function () {
	var pathDeleteIndices = this._handleSingleVertexDelete();
	// Remove enqueued paths
	if( this.allowPathRemoval ) {
	    // Remove paths starting with the last (!) index.
	    for( var i = pathDeleteIndices.length-1; i >= 0; i-- ) {
		this.removePathAt( pathDeleteIndices[i] );
	    }
	}
	this.pb.redraw();
    }

    
    // +---------------------------------------------------------------------------------
    // | This function removes all selected vertices on the paths without deleting
    // | full paths (at least two path vertices remaining).
    // |
    // | Returned (sorted) array contains indices of those paths that should
    // | be deleted completely.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._handleSingleVertexDelete = function () {

	// Check all path points (on all paths) for deletion.
	// Note: whole paths are not meant to be removed this way.
	//       Keep track of their indices (ascending order) for later removal.
	var pathDeleteIndices = []; // Array<number>
	for( var p = 0; p < this.paths.length; p++ ) {
	    var allVerticesSelected = this._handleDeleteOnPath( p );
	    if( allVerticesSelected )
		pathDeleteIndices.push( p );
	}

	return pathDeleteIndices;
    };

    // +---------------------------------------------------------------------------------
    // | This function removes all selected vertices on the given path (index)
    // | without deleting the full path (at least two path vertices remaining).
    // |
    // | Returns true if path should be fully removed, false otherwise.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._handleDeleteOnPath = function( pathIndex ) {
	var path = this.paths[pathIndex];
	var newCurves = [];
	var deletedVertIndices = [];
	// Find first non-selected path point
	var curveIndex = 0;
	while( curveIndex < path.bezierCurves.length && path.bezierCurves[curveIndex].startPoint.attr.isSelected ) {
	    deletedVertIndices.push( curveIndex ),
	    curveIndex++;
	}

	// All points selected? Enqueue for deletion.
	if( curveIndex == path.bezierCurves.length ) {
	    // Indicate: path removal required.
	    return true;
	}
	
	// Only keep those curves that have no selected path point (=delete selected)
	var curStart = path.bezierCurves[curveIndex].startPoint;
	var curStartControl = path.bezierCurves[curveIndex].startControlPoint;
	for( var i = curveIndex; i < path.bezierCurves.length; i++ ) {
	    if( !path.bezierCurves[i].endPoint.attr.isSelected ) {
		newCurves.push( [ curStart.clone(),
				  path.bezierCurves[i].endPoint.clone(),
				  
				  //path.bezierCurves[i].endControlPoint.clone(),
				  curStartControl.clone(),
				  path.bezierCurves[i].endControlPoint.clone()
				] );
		if( i+1 < path.bezierCurves.length ) {
		    curStart = path.bezierCurves[i].endPoint;
		    curStartControl = path.bezierCurves[i+1].startControlPoint;
		}
	    } else {
		deletedVertIndices.push( i );
	    }
	}
	// Do not remove the whole path.
	// Do not replace the path if no vertices were deleted.
	if( newCurves.length != 0 && newCurves.length != path.bezierCurves.length ) {
	    var newPath = BezierPath.fromArray( newCurves );
	    var oldPath = this.paths[pathIndex];
	    this._replacePathAt( pathIndex, newPath );
	    this.onVerticesDeleted( pathIndex, deletedVertIndices, newPath, oldPath );

	    // Indicate: no path removal required
	    return false;
	} else {
	    // Indicate full path removal if no curve would be left.
	    return newCurves.length == 0;
	}
    };

    
    // +---------------------------------------------------------------------------------
    // | This function replaces a path at the given index with a new one (after change
    // | of vertex count).
    // +-------------------------------
    BezierPathInteractionHelper.prototype._replacePathAt = function( pathIndex, newPath ) {
	var oldPath = this.paths[ pathIndex ];
	this.pb.remove( oldPath, false, true ); // Remove with vertices
	this._removeDefaultPathListeners( oldPath );	
	BezierPathInteractionHelper.setPathAutoAdjust( newPath );
	this.paths[ pathIndex ] = newPath;
	this.pb.add( newPath );
	// Replace path inside the array with the new path
	// this._addDefaultPathListeners( newPath );
    };


    // +---------------------------------------------------------------------------------
    // | Touch and mouse events should call this fuction when the pointer was moved.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._handleMoveEvent = function( posX, posY ) {
	var point = this.pb.transformMousePosition( posX, posY );
	this.currentB.set( point );
	this._updateMinDistance();
	// Always fire even if nothing visually changed?
	// console.log( this.currentDistance, this.maxDetectDistance, this.mouseIsOver );
	if( this.currentDistance <= this.maxDetectDistance && this.mouseIsOver ) {
	    this.onPointerMoved( this.currentPathIndex, this.currentA, this.currentB, this.currentT );
	} else {
	    this.onPointerMoved( -1, null, null, 0.0 );
	}
	// Always redraw even when moving outside the detection distance?
	this.pb.redraw();
    };


    // +---------------------------------------------------------------------------------
    // | ...
    // +-------------------------------
    BezierPathInteractionHelper.prototype._clearMoveEvent = function() {
	this.onPointerMoved( -1, null, null, 0.0 );
	this.pb.redraw();
    };


    // +---------------------------------------------------------------------------------
    // | Called once upon initialization.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._installTouchListener = function() {
	var _self = this;	
	new AlloyFinger( this.pb.canvas, {
	    touchStart : function(e) {
		_self.mouseIsOver = true;
	    },
	    touchMove: function (e) {
		if( _self.pb.getDraggedElementCount() == 0 && e.touches.length > 0 ) {
		    // console.log('touchmove');
		    _self._handleMoveEvent( e.touches[0].clientX, e.touches[0].clientY );
		}
	    },
	    touchEnd : function(e) {
		_self.mouseIsOver = false;
		_self._clearMoveEvent();
	    }
	} );
    };


    // +---------------------------------------------------------------------------------
    // | Called once upon initialization.
    // +-------------------------------
    BezierPathInteractionHelper.prototype._installMouseListener = function() {
	var _self = this;
	new MouseHandler(this.pb.canvas)
	    .up( function(e) {
		if( e.params.wasDragged )
		    return;
		if( _self._keyHandler.isDown('shift') )
		    return;
		var path = _self.paths[ _self.currentPathIndex ];
		// console.log('Clicked', e.params.wasDragged);
		var vertex = _self.pb.getVertexNear( e.params.pos,
						     PlotBoilerplate.DEFAULT_CLICK_TOLERANCE
						   );
		// console.log( 'Vertex', vertex );
		if( vertex )
		    return;
		// Check if there is already a path point at the given split position
		var pathPoint = path.getPointAt(_self.currentT);
		var pointNear = _self.pb.getVertexNear( _self.pb.revertMousePosition(pathPoint.x,pathPoint.y), 6.0 );
		// console.log( "pathPoint", pathPoint, pointNear );
		if( pointNear ) {
		    for( var i = 0; i < path.bezierCurves.length; i++ ) {
			if( path.bezierCurves[i].startPoint.distance(pointNear) <= 6.0 || path.bezierCurves[i].endPoint.distance(pointNear) <= 6.0 ) {
			    // console.log("There is already a path point near this position.");
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
		var newPath = BezierPath.fromArray( newCurves );
		var oldPath = _self.paths[ _self.currentPathIndex ];
		_self._replacePathAt( _self.currentPathIndex, newPath );
		_self.onVertexInserted( _self.currentPathIndex, leftPath.bezierCurves.length, newPath, oldPath ); 
	    })
	    .move( function(e) {
		// console.log('moved');
		// if( _self.pb.getDraggedElementCount() == 0 )
		_self.mouseIsOver = true;
		_self._handleMoveEvent( e.params.pos.x, e.params.pos.y );
		
	    } );

	_self.pb.canvas.addEventListener('mouseenter', function() {
	    _self.mouseIsOver = true;
	} );
	_self.pb.canvas.addEventListener('mouseleave', function() {
	    _self.mouseIsOver = false;
	    _self._clearMoveEvent();
	} );
    };


    // +---------------------------------------------------------------------------------
    // | Called once upon initialization.
    // |
    // | @return {KeyHandler}
    // +-------------------------------
    BezierPathInteractionHelper.prototype._installKeyListener = function() {
	var _self = this;
	return new KeyHandler( { trackAll : true } )
	    .down('delete',function() {
		_self._handleDelete();
	    } );
    };


    // +---------------------------------------------------------------------------------
    // | Adds vertex listeners to all path points.
    // |
    // | @param {BezierPath} path - The path to add vertex listeners to.
    // +-------------------------------
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

    // +---------------------------------------------------------------------------------
    // | Removes vertex listeners from all path points.
    // |
    // | @param {BezierPath} path - The path to remove vertex listeners from.
    // +-------------------------------
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
	if( this.paths.length == 0 )
	    return;
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
	this.currentDistance = minDist;
	this.currentA.set( closestPoint );
    };


    // +---------------------------------------------------------------------------------
    // | Sets all vertices on the given path to `bezierAutoAdjust=true`.
    // |
    // | @static 
    // +-------------------------------
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

