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
	this.topIndex = -1;
	this.bottomIndex = -1;
	
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
	var yMin                = -1;
	var yMax                = -1;
	
	for( var s = 0; s < outlineSegmentCount; s++ ) {
	    var t = Math.min(1.0, Math.max(0.0, s/(outlineSegmentCount-1) ) );
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
		if( s == 0 ) {
		    if( i == 0 ) yMin = vert.y;
		    if( i+1 == baseShape.vertices.length ) yMax = vert.y;
		}
	    } // END for
	} // END for

	var topVertex = new THREE.Vector3( 0, yMin, 0 );
	var bottomVertex = new THREE.Vector3( 0, yMax, 0 );

	this.topIndex = this.vertices.length;
	this.vertices.push( topVertex );
	
	this.bottomIndex = this.vertices.length;
	this.vertices.push( bottomVertex );
    };

    DildoGeometry.prototype.buildFaces = function( options ) {
	var baseShape             = options.baseShape;
	var outlineSegmentCount   = options.outlineSegmentCount;
	var baseShapeSegmentCount = baseShape.vertices.length;

	this.faceVertexUvs[0] = [];
	
	for( var s = 0; s < outlineSegmentCount; s++ ) {
	    for( var i = 0; i < baseShapeSegmentCount; i++ ) {
		if( s > 0 ) {
		    if( i > 0 ) {
			this.addFace4ByIndices( s, i-1, s-1, i, outlineSegmentCount, baseShape.vertices.length );
			if( i+1 == baseShape.vertices.length ) {
			    // Close the gap on the shape
			    this.addFace4ByIndices( s, i, s-1, 0, outlineSegmentCount, baseShape.vertices.length );
			}
		    }
		}
	    } // END for
	} // END for

	// Close at top (?) and bottom.
	for( var i = 1; i < baseShapeSegmentCount; i++ ) {
	    this.makeFace3( this.vertexMatrix[0][i-1], // s=0
			    this.vertexMatrix[0][i],
			    this.bottomIndex
			  );
	    if( i+1 == baseShapeSegmentCount ) {
		this.makeFace3( this.vertexMatrix[0][0], // s=0
				this.vertexMatrix[0][i],
				this.bottomIndex
			      );
	    }
	}
    };

    DildoGeometry.prototype.buildUVMapping = function( options ) {

	var baseShape             = options.baseShape;
	var outlineSegmentCount   = options.outlineSegmentCount;
	var baseShapeSegmentCount = baseShape.vertices.length;
	
	// https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
	for( var s = 1; s < outlineSegmentCount; s++ ) {
	    for( var i = 1; i < baseShape.vertices.length; i++ ) {
		this.addUV4( s, i-1, s-1, i, outlineSegmentCount, baseShapeSegmentCount );
		if( i+1 == baseShape.vertices.length ) {
		    // Close the gap on the shape
		    this.addUV4( s, i, s-1, 0, outlineSegmentCount, baseShapeSegmentCount );
		}
	    }
	}

	// Build UV mapping for the base
	for( var i = 1; i < baseShapeSegmentCount; i++ ) {
	    this.addBaseUV3( i-1, i, 0, outlineSegmentCount, baseShapeSegmentCount );
	    if( i+1 == baseShapeSegmentCount ) {
		// Close the gap on the shape
		this.addBaseUV3( 0, 0, i, outlineSegmentCount, baseShapeSegmentCount );
	    }
	}
	
	this.uvsNeedUpdate = true;
    };

    

    DildoGeometry.prototype.addFace4ByIndices = function( a, b, c, d ) {
	this.makeFace4( this.vertexMatrix[a][b],
			this.vertexMatrix[c][b],
			this.vertexMatrix[a][d],
			this.vertexMatrix[c][d]
		      );
    };

    DildoGeometry.prototype.makeFace4 = function( vertIndexA, vertIndexB, vertIndexC, vertIndexD ) {
	this.makeFace3( vertIndexA, vertIndexB, vertIndexC );
	this.makeFace3( vertIndexB, vertIndexD, vertIndexC );
    };

    DildoGeometry.prototype.makeFace3 = function( vertIndexA, vertIndexB, vertIndexC ) {
	this.faces.push( new THREE.Face3( vertIndexA, 
					  vertIndexB, 
					  vertIndexC
					)
		       ); 
    };

    DildoGeometry.prototype.addUV4 = function( a, b, c, d, outlineSegmentCount, baseShapeSegmentCount ) {
	this.faceVertexUvs[0].push( [
	    new THREE.Vector2( a/outlineSegmentCount, b/baseShapeSegmentCount ),
	    new THREE.Vector2( c/outlineSegmentCount, b/baseShapeSegmentCount ),
	    new THREE.Vector2( a/outlineSegmentCount, d/baseShapeSegmentCount )
	] );
	this.faceVertexUvs[0].push( [
	    new THREE.Vector2( c/outlineSegmentCount, b/baseShapeSegmentCount ),
	    new THREE.Vector2( c/outlineSegmentCount, d/baseShapeSegmentCount ),
	    new THREE.Vector2( a/outlineSegmentCount, d/baseShapeSegmentCount )
	] );
    }

    DildoGeometry.prototype.addBaseUV3 = function( a, b, center, outlineSegmentCount, baseShapeSegmentCount ) {
	// Create a mirrored texture to avoid hard visual cuts
	var ratioA = 1.0 - Math.abs(0.5 - (a    /baseShapeSegmentCount) )*2;
	var ratioB = 1.0 - Math.abs(0.5 - ((a+1)/baseShapeSegmentCount) )*2;	
	this.faceVertexUvs[0].push( [
	    new THREE.Vector2( ratioA, 0 ),
	    new THREE.Vector2( ratioB, 0 ),
	    new THREE.Vector2( 0.5, 1 )
	] );
    }

    window.DildoGeometry = DildoGeometry;
    
})();
