
(function() {

    var CubicSplinePath = function() {
	this.vertices = [];
    };

    CubicSplinePath.prototype.addPoint = function( p ) {
	this.vertices.push( p );
    };

    
    CubicSplinePath.prototype.generateCurve = function( circular ) {

	// cirular = true;

	var xs = [];
	var ys = [];
	for( var i = 0; i < this.vertices.length; i++ ) {
	    xs.push( this.vertices[i].x );
	    ys.push( this.vertices[i].y );
	}

	var curves = [];
	
	let d = '';
	let n = this.vertices.length; // pointsX.length;
	// first the natural spline
	if (n > 1) {
	    // starting point
	    // d += `M ${pointsX[0]} ${pointsY[0]}`;
	    if (n == 2) {
		// for two points, just draw a straight line
		// d += `L ${pointsX[1]} ${pointsY[1]}`;
	    } else {
		if (!circular ) { // closedLoop) {
		    // open curve
		    // x1 and y1 contain the coordinates of the first control
		    // points, x2 and y2 those of the second
		    //let [x1, x2] = naturalOpen(pointsX);
		    //let [y1, y2] = naturalOpen(pointsY);
		    let [x1, x2] = naturalControls(xs,circular);
		    let [y1, y2] = naturalControls(ys,circular);
		    for (let i = 1; i < n; i++) {
			// add BĂŠzier segment - two control points and next node
			// d += `C ${x1[i-1]} ${y1[i-1]}, ${x2[i-1]} ${y2[i-1]}, ${pointsX[i]} ${pointsY[i]}`;
			curves.push( new CubicBezierCurve( this.vertices[i-1],
							   this.vertices[i],
							   new Vertex(x1[i-1], y1[i-1]),
							   new Vertex(x2[i-1], y2[i-1])
							 ) )
		    }
		} else {
		    // closed curve, i.e. endpoints are connected
		    // see comments for open curve
		    //let [x1, x2] = naturalClosed(pointsX);
		    //let [y1, y2] = naturalClosed(pointsY);
		    let [x1, x2] = naturalControls(xs,circular);
		    let [y1, y2] = naturalControls(ys,circular);
		    for (let i = 0; i < n; i++) {
			// if i is n-1, the "next" point is the first one
			let j = (i+1) % n;
			// d += `C ${x1[i]} ${y1[i]}, ${x2[i]} ${y2[i]}, ${pointsX[j]} ${pointsY[j]}`;
			curves.push( new CubicBezierCurve( this.vertices[i],
							   this.vertices[j],
							   new Vertex(x1[i], y1[i]),
							   new Vertex(x2[i], y2[i])
							 ) )
		    }
		}
	    }
	}
	// setAttributes(path0, [["d", d]]);

	return curves;
    };


    function naturalControls (K) {
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
	return [x1, x2];
    }


    // computes two arrays for the first and second controls points for a
    // natural cubic spline through the points in K, an "open" curve where
    // the curve doesn't return to the starting point; the function works
    // with one coordinate at a time, i.e. it has to be called twice
    function naturalOpen (K) {
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
	let x1 = thomas(a, b, c, d);
	// compute second controls points from first
	let x2 = new Array(n);
	for (let i = 0; i < n-1; i++)
	    x2[i] = 2*K[i+1] - x1[i+1];
	x2[n-1] = (K[n] + x1[n-1]) / 2;
	return [x1, x2];
    }

    // computes two arrays for the first and second controls points for a
    // natural cubic spline through the points in K, a "closed" curve
    // which returns to its starting point; the function works with one
    // coordinate at a time, i.e. it has to be called twice
    function naturalClosed (K) {
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
    }

    window.CubicSplinePath = CubicSplinePath;

})();
