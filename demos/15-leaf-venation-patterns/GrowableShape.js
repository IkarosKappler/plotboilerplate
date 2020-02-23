/**
 * A wrapper for the leaf shape.
 *
 * @requires makeLeafShape
 * 
 * @author  Ikaros Kappler
 * @date    2020-02-22
 * @version 1.0.0
 */

(function(_context) {
    "use strict";

    /**
     * The constructor.
     **/
    var GrowableShape = function( size, onChange, onChangeStart, onChangeEnd ) {

	// Get the sub path
	var _self = this;
	this.path = makeLeafShape( size,
				   onChange,
				   function() {
				       if( typeof onChangeStart == 'function' ) onChangeStart();
				   }, 
				   function() {
				       _self.updateBoundingPolygon();
				       if( typeof onChangeEnd == 'function' ) onChangeEnd();
				   } // onChangeEnd
				 );
	this.petiole = null;
	this.boundingPolygon = null;
	this._init();
    };

    GrowableShape.prototype._init = function() {
	this.petiole = this.path.getPointAt(0);
	this.updateBoundingPolygon();
    };

    /**
     * 
     **/
    GrowableShape.prototype.updateBoundingPolygon = function() {
	console.log('rebuild bounding polygon' );

	//console.log('path',this.path, this);

	/*
	// Each 10 pixels of arc length
	var length = this.path.getLength();
	var steps = Math.round( length*0.05 );
	var verts = [], t;
	for( var i = 0; i <= steps; i++ ) {
	    t = i/steps;
	    verts.push( this.path.getPointAt( Math.max(0,Math.min(t,1) ) ) );
	}
	this.boundingPolygon = new Polygon( verts, false );
	*/
	this.boundingPolygon = pbutils.BezierPath.toPolygon( this.path, 0.05 );
    };

    /*
    GrowableShape.prototype.clone = function(onChange, onChangeStart, onChangeEnd) {
	var shape = new GrowableShape( this.size, onChange, onChangeStart, onChangeEnd );
	shape.path = this.path;
	shape._init();
	return shape;
    };*/
    
    
    GrowableShape.prototype.containsVert = function( vert ) {
	return this.boundingPolygon.containsVert( vert );
    };

    GrowableShape.prototype.getBounds = function() {
	var min = new Vertex( Number.MAX_VALUE, Number.MAX_VALUE );
	var max = new Vertex( Number.MIN_VALUE, Number.MIN_VALUE );
	for( var i in this.boundingPolygon.vertices ) {
	    min.x = Math.min( this.boundingPolygon.vertices[i].x, min.x );
	    min.y = Math.min( this.boundingPolygon.vertices[i].y, min.y );
	    max.x = Math.max( this.boundingPolygon.vertices[i].x, max.x );
	    max.y = Math.max( this.boundingPolygon.vertices[i].y, max.y );
	}
	// return { min : min, max : max, width : function() { return this.max.x-this.min.x; }, height : function() { return this.max.y-this.min.y; } };
	return new BoundingBox( min, max );
    };
    

    _context.GrowableShape = GrowableShape;
    
})(window ? window : module.export);
