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
     * @param {BezierPath} extrudePath
     * @param {number} segmentCount (>= 2).
     **/
    var DildoGeometry = function( options ) {

	THREE.Geometry.call( this );

	var baseShape           = options.baseShape;
	var outline             = options.outline;
	var extrudePath         = options.extrudePath;
	var outlineSegmentCount = options.outlineSegmentCount;
	
	var height              = 200.0;
	var outlineBounds       = outline.getBounds();

	// Array<Array<number>>
	this.vertexMatrix = [];

	var vertexMatrix = [];
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

		if( s > 0 ) {
		    if( i > 0 ) {
			this.addFace4( s, i-1, s-1, i );
			if( i+1 == baseShape.vertices.length ) {
			    // Close the gap on the shape
			    this.addFace4( s, i, s-1, 0 );
			}
		    }
		}
	    } // END for
	} // END for
    };

    DildoGeometry.prototype.addFace4 = function( a, b, c, d ) {
	this.faces.push( new THREE.Face3( this.vertexMatrix[a][b],
					  this.vertexMatrix[c][b],
					  this.vertexMatrix[a][d] )
		       ); 
	this.faces.push( new THREE.Face3( this.vertexMatrix[c][b],
					  this.vertexMatrix[c][d],
					  this.vertexMatrix[a][d] )
					  ); 
	
    };


    window.DildoGeometry = DildoGeometry;
    
})();
