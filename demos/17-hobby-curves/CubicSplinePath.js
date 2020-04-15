
(function() {

    var CubicSplinePath = function() {
	this.vertices = [];
    };

    CubicSplinePath.prototype.addPoint = function( p ) {
	this.vertices.push( p );
    };


    /**
     * @param {boolean} circular
     **/
    CubicSplinePath.prototype.generateCurve = function( circular ) {
	var xs = [];
	var ys = [];
	for( var i = 0; i < this.vertices.length; i++ ) {
	    xs.push( this.vertices[i].x );
	    ys.push( this.vertices[i].y );
	}
	var curves = [];
	
	let d = '';
	let n = this.vertices.length; 
	if (n > 1) {
	    if (n == 2) {
		// for two points, just draw a straight line
		curves.push( new CubicBezierCurve( this.vertices[0], this.vertices[1], this.vertices[0], this.vertices[1] ) );
	    } else {
		if (!circular ) {
		    // open curve
		    // x1 and y1 contain the coordinates of the first control
		    // points, x2 and y2 those of the second
		    //let [x1, x2] = naturalControlsOpen(xs);
		    //let [y1, y2] = naturalControlsOpen(ys);
		    let controlsX = naturalControlsOpen(xs);
		    let controlsY = naturalControlsOpen(ys);
		    for (let i = 1; i < n; i++) {
			// add Bézier segment - two control points and next node
			curves.push( new CubicBezierCurve( this.vertices[i-1],
							   this.vertices[i],
							   new Vertex(controlsX.start[i-1], controlsY.start[i-1]), // x1[i-1], y1[i-1]), // new Vertex(x1[i-1], y1[i-1]),
							   new Vertex(controlsX.end[i-1], controlsY.end[i-1])  // new Vertex(x2[i-1], y2[i-1])
							 ) )
		    }
		} else {
		    // closed curve, i.e. endpoints are connected
		    // see comments for open curve
		    //let [x1, x2] = naturalControlsClosed(xs);
		    //let [y1, y2] = naturalControlsClosed(ys);
		    let controlsX = naturalControlsClosed(xs);
		    let controlsY = naturalControlsClosed(ys);
		    for (let i = 0; i < n; i++) {
			// if i is n-1, the "next" point is the first one
			let j = (i+1) % n;
			curves.push( new CubicBezierCurve( this.vertices[i],
							   this.vertices[j],
							   new Vertex(controlsX.start[i], controlsY.start[i]), // new Vertex(x1[i], y1[i]),
							   new Vertex(controlsX.end[i], controlsY.end[i])  // new Vertex(x2[i], y2[i])
							 ) )
		    }
		}
	    }
	}

	return curves;
    };


    function naturalControlsClosed(K) {
	let n = K.length;
	// a, b, and c are the diagonals of the tridiagonal matrix, d is the
	// right side
	let a = new Array(n);
	let b = new Array(n);
	let c = new Array(n);
	let d = new Array(n);
	// the video explains why the matrix is filled this way
	b[0] = 4;
	c[0] = 1;
	d[0] = 4*K[0] + 2*K[1];
	a[n-1] = 1;
	b[n-1] = 4;
	d[n-1] = 4*K[n-1] + 2*K[0];
	for (let i = 1; i < n-1; i++) {
	    a[i] = 1;
	    b[i] = 4;
	    c[i] = 1;
	    d[i] = 4*K[i] + 2*K[i+1];
	}
	// add a one to the two empty corners and solve the system for the
	// first control points
	let x1 = HobbyPath.utils.sherman(a, b, c, d, 1, 1);
	// compute second controls points from first
	let x2 = new Array(n);
	for (let i = 0; i < n-1; i++)
	    x2[i] = 2*K[i+1] - x1[i+1];
	x2[n-1] = 2*K[0] - x1[0];
	return { start : x1, end : x2 }; // [x1, x2];
    }


    // computes two arrays for the first and second controls points for a
    // natural cubic spline through the points in K, an "open" curve where
    // the curve doesn't return to the starting point; the function works
    // with one coordinate at a time, i.e. it has to be called twice
    function naturalControlsOpen(K) {
	let n = K.length - 1;
	// a, b, and c are the diagonals of the tridiagonal matrix, d is the
	// right side
	let a = new Array(n);
	let b = new Array(n);
	let c = new Array(n);
	let d = new Array(n);
	// the video explains why the matrix is filled this way
	b[0] = 2;
	c[0] = 1;
	d[0] = K[0] + 2*K[1];
	a[n-1] = 2;
	b[n-1] = 7;
	d[n-1] = 8*K[n-1] + K[n];
	for (let i = 1; i < n-1; i++) {
	    a[i] = 1;
	    b[i] = 4;
	    c[i] = 1;
	    d[i] = 4*K[i] + 2*K[i+1];
	}
	// solve the system to get the first control points
	let x1 = HobbyPath.utils.thomas(a, b, c, d);
	// compute second controls points from first
	let x2 = new Array(n);
	for (let i = 0; i < n-1; i++) {
	    x2[i] = 2*K[i+1] - x1[i+1];
	}
	x2[n-1] = (K[n] + x1[n-1]) / 2;
	return { start : x1, end : x2 }; // [x1, x2];
    }

    // computes two arrays for the first and second controls points for a
    // natural cubic spline through the points in K, a "closed" curve
    // which returns to its starting point; the function works with one
    // coordinate at a time, i.e. it has to be called twice
    /* function naturalClosed (K) {
	let n = K.length;
	// a, b, and c are the diagonals of the tridiagonal matrix, d is the
	// right side
	let a = new Array(n);
	let b = new Array(n);
	let c = new Array(n);
	let d = new Array(n);
	// the video explains why the matrix is filled this way
	b[0] = 4;
	c[0] = 1;
	d[0] = 4*K[0] + 2*K[1];
	a[n-1] = 1;
	b[n-1] = 4;
	d[n-1] = 4*K[n-1] + 2*K[0];
	for (let i = 1; i < n-1; i++) {
	    a[i] = 1;
	    b[i] = 4;
	    c[i] = 1;
	    d[i] = 4*K[i] + 2*K[i+1];
	}
	// add a one to the two empty corners and solve the system for the
	// first control points
	let x1 = sherman(a, b, c, d, 1, 1);
	// compute second controls points from first
	let x2 = new Array(n);
	for (let i = 0; i < n-1; i++)
	    x2[i] = 2*K[i+1] - x1[i+1];
	x2[n-1] = 2*K[0] - x1[0];
	return [x1, x2];
    } */

    window.CubicSplinePath = CubicSplinePath;

})();
