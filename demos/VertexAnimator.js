/**
 * Animate a set of vertices: make them bounce around by random normalized
 * velocities and let them reflect at the viewport bounds.
 *
 * Note that this class not not very robust towards to vertex array modifications. Please
 * create a new animator once your vertex list changed.
 *
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2019-04-24
 * @version 1.0.0
 **/


(function(_context) {

    /**
     * @constructor
     * @name VertexAnimator
     * @param {Vertex[]} vertices - A set of vertices in an array.
     * @param {ViewPort} viewport - A viewport: { min:Vertex, max:Vertex }.
     **/
    var VertexAnimator = function( vertices, viewport, renderCallback ) {

	this.running = false;
	this.viewport = viewport;
	var _self = this;
	
	// For each vertex create a random velocity
	var velocities = [];
	for( var i in vertices ) {
	    // Add a normalized vector (here as a line)
	    velocities.push( new Line(new Vertex(), Vertex.randomVertex(viewport)).normalize().b );
	};
	
	function animateVert( v, dir, viewport ) {
	    v.x += dir.x;
	    v.y += dir.y;
	    if( v.x <= viewport.min.x ) {
		v.x = viewport.min.x;
		dir.x *= -1;
	    }
	    if( v.y <= viewport.min.y ) {
		v.y = viewport.min.y;
		dir.y *= -1;
	    }
	    if( v.x >= viewport.max.x ) {
		v.x = viewport.max.x;
		dir.x *= -1;
	    }
	    if( v.y >= viewport.max.y ) {
		v.y = viewport.max.y;
		dir.y *= -1;
	    }
	};

	function animateAll() {
	    for( var i in vertices ) {
		animateVert( vertices[i], velocities[i], _self.viewport );
	    }
	    renderCallback( _self );
	    if( _self.running )
		window.requestAnimationFrame( animateAll );
	}

	/**
	 * Update the viewport for reflecting.
	 */
	VertexAnimator.updateViewport = function( newViewport ) {
	    this.viewport = viewport;
	};

	/**
	 * Start the animation.
	 */
	VertexAnimator.prototype.start = function() {
	    if( this.running )
		return;
	    this.running = true;
	    animateAll();
	};

	/**
	 * Stop the animation.
	 */
	VertexAnimator.prototype.stop = function() {
	    this.running = false;
	};
    };

    _context.VertexAnimator = VertexAnimator;

})(window ? window : module.export);
