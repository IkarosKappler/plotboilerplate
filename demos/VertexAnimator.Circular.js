/**
 * Animate a set of vertices: let them move in a cicular manner. Multiple revolitions possible.
 *
 * Note that this class not not very robust towards to vertex array modifications. Please
 * create a new animator once your vertex list changed.
 *
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2019-10-30 (Cloned from LinearVertexAnimator).
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
	
	// Use a bunch of constants and basic math
	var s = Math.sin, c = Math.cos, PI = Math.PI, TWOPI = Math.PI*2;
	let angle = 0, radius = 0;
	var maxRadius = Math.min( viewport.max.x-viewport.min.x, viewport.max.y-viewport.min.y ) * 0.45;
	var minRadius = maxRadius*0.77;
	var startTime = 0;
	var revolutions = 3;
	
	function animateVert( vert, index, count, time, viewport ) {
	    if( !startTime ) startTime = time;
	    time -= startTime;
	    
	    angle = TWOPI*(index/count) + time/20000;
	    radius = -1.0-s(angle+time/1000); // +c(angle+time/100000);
	    radius = minRadius + (maxRadius-minRadius)*radius;
	    // Add some noise
	    radius += s((angle*20))*11;
	    // Apply angle and radius and noise
	    vert.x = c(angle*revolutions)*radius;
	    vert.y = s(angle*revolutions)*radius;
	};

	function animateAll( time ) {
	    for( var i in vertices ) {
		animateVert( vertices[i], i, vertices.length, time, _self.viewport );
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

    _context.CircularVertexAnimator = VertexAnimator;

})(window ? window : module.export);
