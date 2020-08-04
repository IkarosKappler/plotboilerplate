/**
 * @classdesc A helper for adding vertices to and remove vertices from Bézier paths.
 * By default the 'delete' key is used to remove vertices or paths.
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
 * @version  1.0.0
 *
 * @file BezierPathInteractionHelper
 * @public
 **/

import { AlloyFinger } from "alloyfinger";
import { BezierPath } from "../../BezierPath";
import { CubicBezierCurve } from "../../CubicBezierCurve";
import { KeyHandler } from "../../KeyHandler";
import { MouseHandler } from "../../MouseHandler";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { VertEvent } from "../../VertexListeners";
import { Vertex } from "../../Vertex";
import { XMouseEvent } from "../../MouseHandler";
import { XYCoords } from "../../interfaces";

type OnPointerMoved = ( pathIndex:number,
			pathPoint:Vertex,
			pointerPos:Vertex,
			t:number ) => void;
type OnVertexInserted = ( pathIndex:number,
			  insertIndex:number,
			  newPath:BezierPath,
			  oldPath:BezierPath ) => void;
type OnVerticesDeleted = ( pathIndex:number,
			   removedVertexIndices:Array<number>,
			   newPath:BezierPath,
			   oldPath:BezierPath ) => void;
type OnPathRemoved = ( pathIndex:number,
		       oldPath:BezierPath ) => void;

interface HelperOptions {
    autoAdjustPath?: boolean;    // default true
    allowPathRemoval?: boolean;  // default true
    maxDetectDistance?: number;  // default Number.MAX_VALUE
    onPointerMoved?: OnPointerMoved;
    onVertexInserted?: OnVertexInserted;
    onVerticesDeleted?: OnVerticesDeleted;
    onPathRemoved?: OnPathRemoved;
};


export class BezierPathInteractionHelper {

    /**
     * @member {PlotBoilerplate}
     * @memberof BezierPathInteractionHelper
     * @type {PlotBoilerplate}
     * @instance
     */
    private pb: PlotBoilerplate;

    private paths: Array<BezierPath>;

    private onPointerMoved: OnPointerMoved;

    private onVertexInserted: OnVertexInserted;

    private onVerticesDeleted: OnVerticesDeleted;

    private onPathRemoved: OnPathRemoved;

    private autoAdjustPaths: boolean;

    private allowPathRemoval: boolean;

    private maxDetectDistance: number;


    private mouseIsOver: boolean;
    private currentPathIndex: number;
    private currentDistance: number;
    private currentT: number;
    private currentA: Vertex; // Position on the curve
    private currentB: Vertex; // mouse/touch position

    private _keyHandler: KeyHandler;

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
    constructor( pb:PlotBoilerplate, paths:Array<BezierPath>, options:any ) {
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
    addPath( path:BezierPath ) : boolean {
	const pathIndex:number = this._locatePath( path );
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
    removePath( path:BezierPath ) : boolean {
	const pathIndex:number = this._locatePath( path );
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
    removePathAt( pathIndex:number ) : void {
	const path:BezierPath = this.paths[ pathIndex ];
	this.paths = this.paths.filter( (value:BezierPath,index:number) => (index!=pathIndex) );
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
    update() : void {
	// Just re-run the calculation with the recent mouse/touch position
	this._handleMoveEvent( this.currentB.x, this.currentB.y );
    };


    // +---------------------------------------------------------------------------------
    // | A helper function to locate a given path instance inside the array.
    // |
    // | @return The index of the path or -1 if not found.
    // +-------------------------------
    private _locatePath( path:BezierPath  ) : number {
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
    private _handleDelete() : void {
	const pathDeleteIndices:Array<number> = this._handleSingleVertexDelete();
	// Remove enqueued paths
	if( this.allowPathRemoval ) {
	    // Remove paths starting with the last (!) index.
	    for( var i = pathDeleteIndices.length-1; i >= 0; i-- ) {
		this.removePathAt( pathDeleteIndices[i] );
	    }
	}
	this.pb.redraw();
    };

    
    // +---------------------------------------------------------------------------------
    // | This function removes all selected vertices on the paths without deleting
    // | full paths (at least two path vertices remaining).
    // |
    // | Returned (sorted) array contains indices of those paths that should
    // | be deleted completely.
    // +-------------------------------
    private _handleSingleVertexDelete() : Array<number> {
	// Check all path points (on all paths) for deletion.
	// Note: whole paths are not meant to be removed this way.
	//       Keep track of their indices (ascending order) for later removal.
	const pathDeleteIndices:Array<number> = [];
	for( var p = 0; p < this.paths.length; p++ ) {
	    const allVerticesSelected:boolean = this._handleDeleteOnPath( p );
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
    private _handleDeleteOnPath( pathIndex:number ) : boolean {
	const path:BezierPath = this.paths[pathIndex];
	const newCurves:Array<Array<Vertex>> = [];
	const deletedVertIndices:Array<number> = [];
	// Find first non-selected path point
	let curveIndex:number = 0;
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
	let curStart:Vertex = path.bezierCurves[curveIndex].startPoint;
	let curStartControl:Vertex = path.bezierCurves[curveIndex].startControlPoint;
	for( var i = curveIndex; i < path.bezierCurves.length; i++ ) {
	    if( !path.bezierCurves[i].endPoint.attr.isSelected ) {
		newCurves.push( [ curStart.clone(),
				  path.bezierCurves[i].endPoint.clone(),
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
	    const newPath:BezierPath = BezierPath.fromArray( newCurves );
	    const oldPath:BezierPath = this.paths[pathIndex];
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
    private _replacePathAt( pathIndex:number, newPath:BezierPath ) : void {
	const oldPath:BezierPath = this.paths[ pathIndex ];
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
    private _handleMoveEvent( posX:number, posY:number ) : void {
	const point:XYCoords = this.pb.transformMousePosition( posX, posY );
	this.currentB.set( point );
	this._updateMinDistance();
	// Always fire even if nothing visually changed?
	// console.log( this.currentDistance, this.maxDetectDistance, this.mouseIsOver );
	if( (this.currentDistance <= this.maxDetectDistance && this.mouseIsOver)
	    && this.pb.getDraggedElementCount() == 0 ) {
	    this.onPointerMoved( this.currentPathIndex, this.currentA, this.currentB, this.currentT );
	} else {
	    this.onPointerMoved( -1, null, null, 0.0 );
	}
	// Always redraw even when moving outside the detection distance?
	this.pb.redraw();
    }; 


    // +---------------------------------------------------------------------------------
    // | This is called when the mouse pointer leaves the canvas or
    // | when the touch progress ends.
    // +-------------------------------
    private _clearMoveEvent() : void {
	this.onPointerMoved( -1, null, null, 0.0 );
	this.pb.redraw();
    }; 


    // +---------------------------------------------------------------------------------
    // | Called once upon initialization.
    // +-------------------------------
    private _installTouchListener() : void {
	var _self:BezierPathInteractionHelper = this;	
	new AlloyFinger( this.pb.canvas, {
	    // Todo: which event types does AlloyFinger use?
	    touchStart : function(e:TouchEvent) {
		_self.mouseIsOver = true;
	    },
	    touchMove: function (e:TouchEvent) {
		if( _self.pb.getDraggedElementCount() == 0 && e.touches.length > 0 ) {
		    // console.log('touchmove');
		    _self._handleMoveEvent( e.touches[0].clientX, e.touches[0].clientY );
		}
	    },
	    touchEnd : function(e:TouchEvent) {
		_self.mouseIsOver = false;
		_self._clearMoveEvent();
	    }
	} );
    }; 


    // +---------------------------------------------------------------------------------
    // | Called once upon initialization.
    // +-------------------------------
    private _installMouseListener() : void {
	var _self:BezierPathInteractionHelper = this;
	new MouseHandler(this.pb.canvas)
	    .up( function(e:XMouseEvent) {
		if( e.params.wasDragged )
		    return;
		if( _self._keyHandler.isDown('shift') )
		    return;
		const path:BezierPath = _self.paths[ _self.currentPathIndex ];
		const vertex:Vertex = _self.pb.getVertexNear( e.params.pos,
							      PlotBoilerplate.DEFAULT_CLICK_TOLERANCE
							    );
		if( vertex )
		    return;
		// Check if there is already a path point at the given split position
		const pathPoint:Vertex = path.getPointAt(_self.currentT);
		const pointNear:Vertex = _self.pb.getVertexNear( _self.pb.revertMousePosition(pathPoint.x,pathPoint.y), 6.0 );
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
		const leftPath:BezierPath = path.getSubPathAt( 0.0, _self.currentT );
		const rightPath:BezierPath = path.getSubPathAt( _self.currentT, 1.0 );
		const newCurves:Array<CubicBezierCurve> = [];
		for( var i = 0; i < leftPath.bezierCurves.length; i++ ) {
		    newCurves.push( leftPath.bezierCurves[i] );		
		}
		for( var i = 0; i < rightPath.bezierCurves.length; i++ ) {
		    newCurves.push( rightPath.bezierCurves[i] );		
		}
		const newPath:BezierPath = BezierPath.fromArray( newCurves );
		const oldPath:BezierPath = _self.paths[ _self.currentPathIndex ];
		_self._replacePathAt( _self.currentPathIndex, newPath );
		_self.onVertexInserted( _self.currentPathIndex, leftPath.bezierCurves.length, newPath, oldPath ); 
	    })
	    .move( function(e:XMouseEvent) {
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
    private _installKeyListener() : KeyHandler {
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
    private _addDefaultPathListeners( path:BezierPath ) : void {
	BezierPathInteractionHelper.addPathVertexDragListeners( path, this._updateMinDistance );
    }; 

    // +---------------------------------------------------------------------------------
    // | Removes vertex listeners from all path points.
    // |
    // | @param {BezierPath} path - The path to remove vertex listeners from.
    // +-------------------------------
    private _removeDefaultPathListeners( path:BezierPath ) : void {
	BezierPathInteractionHelper.removePathVertexDragListeners( path, this._updateMinDistance );
    };

    // +---------------------------------------------------------------------------------
    // | Update the min distance from point `line.b` to the curve. And redraw.
    // +-------------------------------
    private _updateMinDistance () : void {
	if( this.paths.length == 0 )
	    return;
	let pathIndex:number = -1;
	let minDist:number = Number.MAX_VALUE;
	let closestPoint:Vertex|null = null;
	let closestT:number = 0.0;
	for( var i = 0; i < this.paths.length; i++ ) {
	    let path:BezierPath = this.paths[i];
	    let t:number = path.getClosestT( this.currentB );
	    let point:Vertex = path.getPointAt( t );
	    let dist:number = point.distance( this.currentB );
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
    static setPathAutoAdjust( path:BezierPath ) : void {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    const curve:CubicBezierCurve = path.bezierCurves[i];
	    path.adjustPredecessorControlPoint( i,     
						true,  // obtainHandleLength
						false   // updateArcLength  (we will do this after the loop)
					      );
	    if( i > 0 || path.adjustCircular )
		curve.startPoint.attr.bezierAutoAdjust = true;
	}
	path.updateArcLengths();
    };


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
    static addPathVertexDragListeners( path:BezierPath, vertexDragListener:(e:VertEvent)=>void ) : void {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    const curve:CubicBezierCurve = path.bezierCurves[i];
	    curve.startPoint.listeners.addDragListener( vertexDragListener );
	    curve.startControlPoint.listeners.addDragListener( vertexDragListener );
	    curve.endControlPoint.listeners.addDragListener( vertexDragListener ); 
	    if( i+1 == path.bezierCurves.length && !path.adjustCircular )
		curve.endPoint.listeners.addDragListener( vertexDragListener ); 
	}
    };


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
    static removePathVertexDragListeners( path:BezierPath, vertexDragListener:(e:VertEvent)=>void ) : void {
	for( var i = 0; i < path.bezierCurves.length; i++ ) {
	    const curve:CubicBezierCurve = path.bezierCurves[i];
	    curve.startPoint.listeners.removeDragListener( vertexDragListener );
	    curve.startControlPoint.listeners.removeDragListener( vertexDragListener );
	    curve.endControlPoint.listeners.removeDragListener( vertexDragListener ); 
	    if( i+1 == path.bezierCurves.length && !path.adjustCircular )
		curve.endPoint.listeners.removeDragListener( vertexDragListener ); 
	}
    };

};
