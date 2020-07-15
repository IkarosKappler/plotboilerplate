/**
 * @require THREE.Geometry
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2020-07-08
 **/

(function() {

    /**
     * @param {Polygon} baseShape
     * @param {BezierPath} outline
     * @param {BezierPath??} extrudePath??
     * @param 
     * @param {number} outlineSegmentCount (>= 2).
     **/
    var DildoGeometry = function( options ) {

	THREE.Geometry.call( this );

	// Array<Array<number>>
	this.vertexMatrix = [];
	
	this.buildVertices( options );
	this.buildFaces( options );
	this.buildUVMapping( options );
    };

    DildoGeometry.prototype.buildVertices = function( options ) {

	var baseShape           = options.baseShape;
	var outline             = options.outline;
	var extrudePath         = options.extrudePath;
	var outlineSegmentCount = options.outlineSegmentCount;
	
	var height              = 200.0;
	var outlineBounds       = outline.getBounds();
	
	for( var s = 0; s < outlineSegmentCount; s++ ) {
	    var t = Math.min(1.0, Math.max(0.0, s/(outlineSegmentCount-1) ) );;
	    this.vertexMatrix[s] = [];
	    for( var i = 0; i < baseShape.vertices.length; i++ ) {
		var shapeVert   = baseShape.vertices[i];
		var outlineVert = outline.getPointAt(t);
		var outlineXPct = (outlineBounds.max.x - outlineVert.x) / outlineBounds.width;
		
		var vert = new THREE.Vector3( (shapeVert.x) * outlineXPct,			      
					      outlineBounds.max.y/2 + outlineVert.y,
					      (shapeVert.y) * outlineXPct
					    );
		this.vertexMatrix[s][i] = this.vertices.length;
		this.vertices.push( vert );
	    } // END for
	} // END for
    };

    DildoGeometry.prototype.buildFaces = function( options ) {
	var baseShape           = options.baseShape;
	var outlineSegmentCount = options.outlineSegmentCount;

	this.faceVertexUvs[0] = [];
	
	for( var s = 0; s < outlineSegmentCount; s++ ) {
	    for( var i = 0; i < baseShape.vertices.length; i++ ) {
		if( s > 0 ) {
		    if( i > 0 ) {
			this.addFace4( s, i-1, s-1, i, outlineSegmentCount, baseShape.vertices.length );
			if( i+1 == baseShape.vertices.length ) {
			    // Close the gap on the shape
			    this.addFace4( s, i, s-1, 0, outlineSegmentCount, baseShape.vertices.length );
			}
		    }
		}
	    } // END for
	} // END for
    };

    DildoGeometry.prototype.buildUVMapping = function( options ) {
	// https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate	
	// this.faceVertexUvs[0] = [];

	/*
	var offset = { x: 0, y : 0 };
	var range  = { x: 1, y : 1 };
	for (var i = 0; i < this.faces.length ; i++) {

	    var v1 = this.vertices[this.faces[i].a], 
		v2 = this.vertices[this.faces[i].b], 
		v3 = this.vertices[this.faces[i].c];
	    // if( i console.log( v1, v2, v3 );

	    this.faceVertexUvs[0].push([
		new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
		new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
		new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
	    ]);
	}
	this.uvsNeedUpdate = true;
	// throw "X";
	*/

	/* for( var x = 1; x < this.vertexMatrix.length; x++ ) {
	    for( var y = 1; y < this.vertexMatrix[x].length; y++ ) {
		this.faceVertexUvs[0].push( [
		    new THREE.Vector2( x/this.vertexMatrix.length, y/this.vertexMatrix[x].length ),
		    new THREE.Vector2( (x+1)/this.vertexMatrix.length, y/this.vertexMatrix[x].length ),
		    new THREE.Vector2( x/this.vertexMatrix.length, (y+1)/this.vertexMatrix[x].length )
		]);
		this.faceVertexUvs[0].push( [
		    new THREE.Vector2( x/this.vertexMatrix.length, (y+1)/this.vertexMatrix[x].length ),
		    new THREE.Vector2( (x+1)/this.vertexMatrix.length, y/this.vertexMatrix[x].length ),
		    new THREE.Vector2( (x+1)/this.vertexMatrix.length, (y)/this.vertexMatrix[x].length )
		]);
	    }
	} */

	var baseShape           = options.baseShape;
	var outlineSegmentCount = options.outlineSegmentCount;
	
	for( var s = 0; s < outlineSegmentCount; s++ ) {
	    for( var i = 0; i < baseShape.vertices.length; i++ ) {
		if( s > 0 ) {
		    if( i > 0 ) {
			// this.addFace4( s, i-1, s-1, i ); 
			if( i+1 == baseShape.vertices.length ) {
			    // Close the gap on the shape
			    // this.addFace4( s, i, s-1, 0 );
			}
		    }
		}
	    } // END for
	} // END for

	this.uvsNeedUpdate = true;

	console.log( 'vertices: ', this.vertices.length, ', faces: ', this.faces.length, ' faceUVs', this.faceVertexUvs[0].length );
    };

    

    DildoGeometry.prototype.addFace4 = function( a, b, c, d, outlineSegmentCount, baseShapeSegmentCount ) {
	this.faces.push( new THREE.Face3( this.vertexMatrix[a][b],
					  this.vertexMatrix[c][b],
					  this.vertexMatrix[a][d] )
		       ); 
	this.faces.push( new THREE.Face3( this.vertexMatrix[c][b],
					  this.vertexMatrix[c][d],
					  this.vertexMatrix[a][d] )
		       );

	this.faceVertexUvs[0].push( [
	    new THREE.Vector2( a/outlineSegmentCount, b/baseShapeSegmentCount ),
	    new THREE.Vector2( c/outlineSegmentCount, b/baseShapeSegmentCount ),
	    new THREE.Vector2( a/outlineSegmentCount, d/baseShapeSegmentCount ),
	] );
	this.faceVertexUvs[0].push( [
	    new THREE.Vector2( c/outlineSegmentCount, b/baseShapeSegmentCount ),
	    new THREE.Vector2( c/outlineSegmentCount, d/baseShapeSegmentCount ),
	    new THREE.Vector2( a/outlineSegmentCount, d/baseShapeSegmentCount ),
	] );
	
    };


    window.DildoGeometry = DildoGeometry;
    
})();
