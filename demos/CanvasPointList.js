/**
 * A class for managing variable point set inside the viewport.
 *
 * @require Vertex
 *
 * @date 2020-01-13
 **/


(function(_context) {

    /**
     * @param {PlotBoilerplate} pb
     **/
    var CanvasPointList = function(pb, vertexAdded ) {
	this.pb = pb;
	this.pointList = [];
	this.verticalFillRatio = 0.66;
	this.horizontalFillRatio = 0.66;

	this.addVertex = function( vert ) {
	    this.pointList.push( vert );
	    this.pb.add( vert );
	    if( typeof vertexAdded == 'function' )
		vertexAdded(vert);
	};
    };


    // +---------------------------------------------------------------------------------
    // | Generates a random int value between 0 and max (both inclusive).
    // +-------------------------------
    var randomInt = function(max) {
	return Math.round( Math.random()*max );
    };
    
    
    /**
     * Create a random vertex inside the canvas viewport.
     **/
    CanvasPointList.prototype.createRandomVertex = function() {
	return new Vertex( Math.random()*this.pb.canvasSize.width*this.horizontalFillRatio - this.pb.canvasSize.width/2*this.horizontalFillRatio,
			   Math.random()*this.pb.canvasSize.height*this.verticalFillRatio - this.pb.canvasSize.height/2*this.verticalFillRatio
			 );
    };

    /**
     * Adds a random point to the point list. Needed for initialization.
     **/
    CanvasPointList.prototype.addRandomPoint = function() {
	this.addVertex( this.createRandomVertex() );
    };

    /*
    CanvasPointList.prototype.addVertex = function( vert ) {
	this.pointList.push( vert );
	this.pb.add( vert );
	if( typeof vertexAdded == 'function' )
	    vertexAdded(vert);
    };*/

    CanvasPointList.prototype.removeRandomPoint = function() {
	if( this.pointList.length > 1 ) {
	    let vert = this.pointList.pop();
	    this.pb.remove( vert );
	}
    };

    CanvasPointList.prototype.clear = function() {
	for( var i in pointList ) 
	    this.pb.remove( this.pointList[i], false );
	this.pointList = [];
    }

    /**
     * Add or remove n random points; depends on the passed number.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     *
     * @param {number} pointCount - The number of desired points.
     * @param {boolean} fullCover - Adds points to the borders.
     */
    CanvasPointList.prototype.updatePointCount = function( pointCount, fullCover ) {
	
	// Generate random points on image border?
	if( fullCover ) {
	    var remainingPoints = pointCount-this.pointList.length;
	    var borderPoints    = Math.sqrt(remainingPoints);
	    var ratio           = this.pb.canvasSize.height/this.pb.canvasSize.width;
	    var hCount          = Math.round( (borderPoints/2)*ratio );
	    var vCount          = (borderPoints/2)-hCount;
	    
	    while( vCount > 0 ) {
		this.addVertex( new Vertex(-this.pb.canvasSize.width/2, randomInt(this.pb.canvasSize.height/2)-this.pb.canvasSize.height/2) );
		this.addVertex( new Vertex(this.pb.canvasSize.width/2, randomInt(this.pb.canvasSize.height/2)-this.pb.canvasSize.height/2) );		    
		vCount--;
	    }
	    
	    while( hCount > 0 ) {
		this.addVertex( new Vertex(randomInt(this.pb.canvasSize.width/2)-this.pb.canvasSize.width/2,0) );
		this.addVertex( new Vertex(randomInt(this.pb.canvasSize.width/2)-this.pb.canvasSize.width/2,this.pb.canvasSize.height/2) );
		hCount--;
	    }

	    // Additionally add 4 points to the corners
	    this.addVertex( new Vertex(0,0) );
	    this.addVertex( new Vertex(this.pb.canvasSize.width/2,0) );
	    this.addVertex( new Vertex(this.pb.canvasSize.width/2,this.pb.canvasSize.height/2) );
	    this.addVertex( new Vertex(0,this.pb.canvasSize.height/2) );	
	}
	
	// Generate random points.
	for( var i = this.pointList.length; i < pointCount; i++ ) {
	    this.addRandomPoint();
	}
	while( this.pointList.length > pointCount ) {
	    console.log('Remove point');
	    this.removeRandomPoint();
	}
    };

    _context.CanvasPointList = CanvasPointList;

})(window || module.export );
