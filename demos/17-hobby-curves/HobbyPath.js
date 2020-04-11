/**
 * This Hobby curve (path) implementation was deeply inspired by
 * the one by Prof. Dr. Edmund Weitz:
 *  // Copyright (c) 2018-2019, Dr. Edmund Weitz.  All rights reserved.
 *  // The code in this file is written mainly for demonstration purposes
 *  // and to illustrate the videos mentioned on the HTML page.  It would
 *  // be fairly easy to make it shorter and more efficient, but I
 *  // refrained from doing this on purpose.
 * Here's the website:
 *  http://weitz.de/hobby/
 *
 * @date 2020-04-07
 *  Transformed to a class by Ikaros Kappler
 **/


// TODO:
//  * convert the two array pointsX and pointsY into a general vertex array.
//  * Check if the utils functions can take more complex parameter types (like vertices).
//  * refactor all these functions into a nice class wrapper
//  * Write a demo that shows the corresponding Bézier path


(function() {
    
    // "curl"
    var omega = 0;

    var HobbyPath = function(startPoint) {

	this.vertices = []; // pointsX and pointsY
	
	/* function clearPoints (path) {
	    path.insertAt = 0;
	    path.pointsX = [];
	    path.pointsY = [];
	    path.points = [];
	    path.points[0] = [];
	    path.points[1] = [];
	    //path.removeAllCircles(svgs[0]);
	    //path.removeAllCircles(svgs[1]);
	} */
	// clearPoints(this);
	// this.addPoint( startPoint );


	// changes the position of the point indexed by "active"
	/* function newPos (x, y) {
	    if (active < 0)
		return;
	    for (let i = 0; i < 2; i++)
		setAttributes(points[i][active], [
		    ["cx", x],
		    ["cy", y]
		]);
	    pointsX[active] = x;
	    pointsY[active] = y;
	    drawPath();
	}*/ 

	// the main workhorse function which draws the curve(s) based on the
	// existing points - it does this by setting up the "d" attributes of
	// the path elements
	/*function drawPath () {
	    let d = '';
	    let n = pointsX.length;
	    // first the natural spline
	    if (n > 1) {
		// starting point
		d += `M ${pointsX[0]} ${pointsY[0]}`;
		if (n == 2) {
		    // for two points, just draw a straight line
		    d += `L ${pointsX[1]} ${pointsY[1]}`;
		} else {
		    if (!closedLoop) {
			// open curve
			// x1 and y1 contain the coordinates of the first control
			// points, x2 and y2 those of the second
			let [x1, x2] = naturalOpen(pointsX);
			let [y1, y2] = naturalOpen(pointsY);
			for (let i = 1; i < n; i++)
			    // add BĂŠzier segment - two control points and next node
			    d += `C ${x1[i-1]} ${y1[i-1]}, ${x2[i-1]} ${y2[i-1]}, ${pointsX[i]} ${pointsY[i]}`;
		    } else {
			// closed curve, i.e. endpoints are connected
			// see comments for open curve
			let [x1, x2] = naturalClosed(pointsX);
			let [y1, y2] = naturalClosed(pointsY);
			for (let i = 0; i < n; i++) {
			    // if i is n-1, the "next" point is the first one
			    let j = (i+1) % n;
			    d += `C ${x1[i]} ${y1[i]}, ${x2[i]} ${y2[i]}, ${pointsX[j]} ${pointsY[j]}`;
			}
		    }
		}
	    }
	    setAttributes(path0, [["d", d]]);

	    // now the Hobby curve
	    d = '';
	    if (n > 1) {
		// starting point
		d += `M ${pointsX[0]} ${pointsY[0]}`;
		if (n == 2) {
		    // for two points, just draw a straight line
		    d += `L ${pointsX[1]} ${pointsY[1]}`;
		} else {
		    if (!closedLoop) {
			// open curve
			// x1 and y1 contain the coordinates of the first control
			// points, x2 and y2 those of the second
			let [x1, y1, x2, y2] = hobbyOpen(pointsX, pointsY);
			for (let i = 0; i < n - 1; i++)
			    d += `C ${x1[i]} ${y1[i]}, ${x2[i]} ${y2[i]}, ${pointsX[i+1]} ${pointsY[i+1]}`;
		    } else {
			// closed curve
			// see comments above
			let [x1, y1, x2, y2] = hobbyClosed(pointsX, pointsY);
			for (let i = 0; i < n; i++) {
			    // if i is n-1, the "next" point is the first one
			    let j = (i+1) % n;
			    d += `C ${x1[i]} ${y1[i]}, ${x2[i]} ${y2[i]}, ${pointsX[j]} ${pointsY[j]}`;
			}
		    }
		}
	    }
	    setAttributes(path1, [["d", d]]);
	} */
    };

    // the "velocity function" (also called rho in the video); a and b are
    // the angles alpha and beta, the return value is the distance between
    // a control point and its neighboring point; to compute sigma(a,b)
    // we'll simply use rho(b,a)
    /* function rho (a, b) {
	// see video for formula
	let sa = Math.sin(a);
	let sb = Math.sin(b);
	let ca = Math.cos(a);
	let cb = Math.cos(b);
	let s5 = Math.sqrt(5);
	let num = 4 + Math.sqrt(8) * (sa - sb/16) * (sb - sa/16) * (ca - cb);
	let den = 2 + (s5 - 1) * ca + (3 - s5) * cb;
	return num/den;
    } */

    // computes four arrays for the x and y coordinates of the first and
    // second controls points for a Hobby curve through the points given
    // by Px and Py, an "open" curve where the curve doesn't return to the
    // starting point
    HobbyPath.hobbyOpen = function (Px, Py) {
	let n = Px.length - 1;
	// the distances between consecutive points, called "d" in the
	// video; D[i] is the distance between P[i] and P[i+1]
	let D = new Array(n);
	// the coordinate-wise directed distances between consecutive points,
	// i.e. dx[i] and is difference Px[i+1]-Px[i] and dy[i] likewise
	let dx = new Array(n);
	let dy = new Array(n);
	for (let i = 0; i < n; i++) {
	    dx[i] = Px[i+1]-Px[i];
	    dy[i] = Py[i+1]-Py[i];
	    D[i] = Math.sqrt(dx[i]*dx[i]+dy[i]*dy[i]);
	}
	// the turning angles at each point, called "gamma" in the video;
	// gamma[i] is the angle at the point P[i]
	let gamma = new Array(n+1);
	for (let i = 1; i < n; i++) {
	    // compute sine and cosine of direction from P[i-1] to P[i]
	    // (relative to x-axis)
	    let sin = dy[i-1] / D[i-1];
	    let cos = dx[i-1] / D[i-1];
	    // rotate dx[i], dy[i] so that for atan2 the "x-axis" is the
	    // previous direction
	    let [x, y] = HobbyPath.utils.rotate(dx[i], dy[i], -sin, cos);
	    gamma[i] = Math.atan2(y, x);
	}
	// the "last angle" is zero, see for example "Jackowski:
	// Typographers, programmers and mathematicians"
	gamma[n] = 0;
	// a, b, and c are the diagonals of the tridiagonal matrix, d is the
	// right side
	let a = new Array(n+1);
	let b = new Array(n+1);
	let c = new Array(n+1);
	let d = new Array(n+1);
	// like in closed curve below
	for (let i = 1; i < n; i++) {
	    a[i] = 1 / D[i-1];
	    b[i] = (2*D[i-1]+2*D[i])/(D[i-1]*D[i]);
	    c[i] = 1 / D[i];
	    d[i] = -(2*gamma[i]*D[i]+gamma[i+1]*D[i-1])/(D[i-1]*D[i]);
	}
	// see the Jackowski article for the following values; the result
	// will be that the curvature at the first point is identical to the
	// curvature at the second point (and likewise for the last and
	// second-to-last)
	b[0] = 2 + omega;
	c[0] = 2 * omega + 1;
	d[0] = -c[0] * gamma[1];
	a[n] = 2 * omega + 1;
	b[n] = 2 + omega;
	d[n] = 0;
	// solve system for the angles called "alpha" in the video
	let alpha = HobbyPath.utils.thomas(a, b, c, d);
	// compute "beta" angles from "alpha" angles
	let beta = new Array(n);
	for (let i = 0; i < n - 1; i++)
	    beta[i] = -gamma[i+1]-alpha[i+1];
	// again, see Jackowski article
	beta[n-1] = -alpha[n];
	// now compute control point positions from angles and distances
	let x1 = new Array(n);
	let y1 = new Array(n);
	let x2 = new Array(n);
	let y2 = new Array(n);
	for (let i = 0; i < n; i++) {
	    let a = rho(alpha[i], beta[i]) * D[i] / 3;
	    let b = rho(beta[i], alpha[i]) * D[i] / 3;
	    let [x, y] = HobbyPath.utils.normalize.apply(null, HobbyPath.utils.rotateAngle(dx[i], dy[i], alpha[i]));
	    x1[i] = Px[i] + a * x;
	    y1[i] = Py[i] + a * y;
	    [x, y] = HobbyPath.utils.normalize.apply(null, HobbyPath.utils.rotateAngle(dx[i], dy[i], -beta[i]));
	    x2[i] = Px[i+1] - b * x;
	    y2[i] = Py[i+1] - b * y;
	}
	return [x1, y1, x2, y2];
    };

    // computes four arrays for the x and y coordinates of the first and
    // second controls points for a Hobby curve through the points given
    // by Px and Py, a "closed" curve which returns to its starting point
    // HobbyPath.hobbyClosed = function(Px, Py, circular) {
    HobbyPath.hobbyClosed = function(pathVerts, circular) {
	// most of the code here is identical to the open version and thus
	// doesn't have comments

	//let circular = true;
	//let pathVerts = [];
	//for( var i = 0; i < Px.length; i++ )
	//     pathVerts[i] = new Vertex(Px[i], Py[i]);

	// let n = Px.length;
	// let n = Px.length - (circular ? 0 : 1);
	let n = pathVerts.length - (circular ? 0 : 1);
	let D = new Array(n);
	// let dx = new Array(n);
	// let dy = new Array(n);
	
	let ds = new Array(n); // !!!
	var succ = function(i) { return circular ? ((i+1)%n) : (i+1) };
	var pred = function(i) { return circular ? ((i + n - 1) % n) : (i-1) };
				 	
	for (let i = 0; i < n; i++) {
	    // the "next" point in a modular way
	    let j = succ(i); // circular ? ((i + 1) % n) : (i+1);
	    // dx[i] = Px[j]-Px[i];
	    // dy[i] = Py[j]-Py[i];
	    // ds[i] = new Vertex( Px[j]-Px[i], Py[j]-Py[i] ); // !!!
	    ds[i] = pathVerts[j].clone().sub( pathVerts[i] ); //  new Vertex( Px[j]-Px[i], Py[j]-Py[i] );
	    D[i] = Math.sqrt(ds[i].x*ds[i].x+ds[i].y*ds[i].y);
	}
	// let gamma = new Array(n);
	let gamma = new Array(n + (circular?0:1));
	//for (let i = 0; i < n; i++) {
	for (let i = (circular?0:1); i < n; i++) {
	    // the "previous" point in a modular way
	    let k = pred(i); // circular ? ((i + n - 1) % n) : (i-1);
	    let sin = ds[k].y / D[k];
	    let cos = ds[k].x / D[k];
	    let vec = HobbyPath.utils.rotate_V(ds[i], -sin, cos);
	    gamma[i] = Math.atan2(vec.y, vec.x);
	}
	if( !circular )
	    gamma[n] = 0;
	let a = new Array(n + (circular?0:1));
	let b = new Array(n + (circular?0:1));
	let c = new Array(n + (circular?0:1));
	let d = new Array(n + (circular?0:1));
	 //for (let i = 0; i < n; i++) {
	for (let i = (circular?0:1); i < n; i++) {
	    // j is the "next" point, k the "previous" one
	    let j = succ(i); // circular ? ((i + 1) % n) : (i+1);
	    let k = pred(i); //  circular ? ((i + n - 1) % n) : (i-1);
	    // see video for the equations
	    a[i] = 1 / D[k];
	    b[i] = (2*D[k]+2*D[i])/(D[k]*D[i]);
	    c[i] = 1 / D[i];
	    d[i] = -(2*gamma[i]*D[i]+gamma[j]*D[k])/(D[k]*D[i]);
	} 
	// make matrix tridiagonal in preparation for the "sherman" function
	var alpha;
	var beta;
	if( circular ) {
	    let s = a[0];
	    a[0] = 0;
	    let t = c[n-1];
	    c[n-1] = 0;
	    alpha = HobbyPath.utils.sherman(a, b, c, d, s, t);
	    beta = new Array(n);
	    for (let i = 0; i < n - (circular?0:1); i++) {
		// "next" point
		let j = succ(i); //  circular ? ((i + 1) % n) : (i+1);
		beta[i] = -gamma[j]-alpha[j];
	    }
	} else {
	    // see the Jackowski article for the following values; the result
	    // will be that the curvature at the first point is identical to the
	    // curvature at the second point (and likewise for the last and
	    // second-to-last)
	    b[0] = 2 + omega;
	    c[0] = 2 * omega + 1;
	    d[0] = -c[0] * gamma[1];
	    a[n] = 2 * omega + 1;
	    b[n] = 2 + omega;
	    d[n] = 0;
	    // solve system for the angles called "alpha" in the video
	    alpha = HobbyPath.utils.thomas(a, b, c, d);
	    // compute "beta" angles from "alpha" angles
	    beta = new Array(n);
	    for (let i = 0; i < n - 1; i++)
		beta[i] = -gamma[i+1]-alpha[i+1];
	    // again, see Jackowski article
	    beta[n-1] = -alpha[n];
	}
	let x1 = new Array(n);
	let y1 = new Array(n);
	let x2 = new Array(n);
	let y2 = new Array(n);
	let startControlPoints = new Array(n);
	let endControlPoints = new Array(n);
	for (let i = 0; i < n; i++) {
	    let j = succ(i); // circular ? ((i + 1) % n) : (i+1);
	    let a = HobbyPath.utils.rho(alpha[i], beta[i]) * D[i] / 3;
	    let b = HobbyPath.utils.rho(beta[i], alpha[i]) * D[i] / 3;
	    let v = HobbyPath.utils.normalize_V(HobbyPath.utils.rotateAngle_V(ds[i], alpha[i]));
	    startControlPoints[i] = new Vertex( pathVerts[i].x + a * v.x, pathVerts[i].y + a * v.y );
	    v = HobbyPath.utils.normalize_V(HobbyPath.utils.rotateAngle_V(ds[i], -beta[i]));
	    endControlPoints[i] = new Vertex( pathVerts[j].x - b * v.x, pathVerts[j].y - b * v.y );
	}
	return { startControlPoints, startControlPoints, endControlPoints, endControlPoints };
    }

    HobbyPath.prototype.addPoint = function(p) {
	this.vertices.push( p );
	// this.pointsX.push( p.x );
	// this.pointsY.push( p.y );
    };

    HobbyPath.prototype.generateCurve = function( closedLoop ) {

	// let n = this.pointsX.length;
	let n = this.vertices.length;
	let d = '';

	var curves = [];
	
	if (n > 1) {
	    if (n == 2) {
		// for two points, just draw a straight line
		return [ new CubicBezierCurve(
		    this.vertices[0], 
		    this.vertices[1], 
		    this.vertices[0], 
		    this.vertices[1], 
		) ];
	    } else {

		// let controlPoints = HobbyPath.hobbyClosed(this.pointsX, this.pointsY, closedLoop);
		let controlPoints = HobbyPath.hobbyClosed(this.vertices, this.points, closedLoop);
		for (let i = 0; i < n - (closedLoop?0:1); i++) {
		    // if i is n-1, the "next" point is the first one
		    let j = (i+1) % n; // TODO: Use a succ function here
		    curves.push( new CubicBezierCurve(
			this.vertices[i],
			this.vertices[j],
			controlPoints.startControlPoints[i], 
			controlPoints.endControlPoints[i] 
		    ) );
		}
		return curves;
	//	}
	    }
	} else {
	    return [];
	}
	
    };

    HobbyPath.utils = {
	// rotates a vector [x, y] about an angle; the angle is implicitly
	// determined by its sine and cosine
	rotate : function(x, y, sin, cos) {
	    return [x*cos - y*sin, x*sin + y*cos];
	},
	// rotates a vector [x, y] about an angle; the angle is implicitly
	// determined by its sine and cosine
	rotate_V : function(vert, sin, cos) {
	    return new Vertex( vert.x*cos - vert.y*sin, vert.x*sin + vert.y*cos );
	},
	// rotates a vector [x, y] about the angle alpha
	rotateAngle: function(x, y, alpha) {
	    return HobbyPath.utils.rotate(x, y, Math.sin(alpha), Math.cos(alpha));
	},
	// rotates a vector [x, y] about the angle alpha
	rotateAngle_V: function(vert, alpha) {
	    return HobbyPath.utils.rotate_V(vert, Math.sin(alpha), Math.cos(alpha));
	},
	// returns a normalized version of the vector
	normalize : function (x, y) {
	    let n = Math.hypot(x, y);
	    if (n == 0)
		return [0, 0];
	    else
		return [x / n, y / n];
	},
	// returns a normalized version of the vector
	normalize_V : function (vec) {
	    let n = Math.hypot(vec.x, vec.y);
	    if (n == 0)
		return new Vertex(0,0); // [0, 0];
	    else
		return new Vertex( vec.x/n, vec.y/n ); // TODO: do in-place // [x / n, y / n];
	},
	// the "velocity function" (also called rho in the video); a and b are
	// the angles alpha and beta, the return value is the distance between
	// a control point and its neighboring point; to compute sigma(a,b)
	// we'll simply use rho(b,a)
	rho : function(a, b) {
	    // see video for formula
	    let sa = Math.sin(a);
	    let sb = Math.sin(b);
	    let ca = Math.cos(a);
	    let cb = Math.cos(b);
	    let s5 = Math.sqrt(5);
	    let num = 4 + Math.sqrt(8) * (sa - sb/16) * (sb - sa/16) * (ca - cb);
	    let den = 2 + (s5 - 1) * ca + (3 - s5) * cb;
	    return num/den;
	},
	// Implements the Thomas algorithm for a tridiagonal system with i-th
	// row a[i]x[i-1] + b[i]x[i] + c[i]x[i+1] = d[i] starting with row
	// i=0, ending with row i=n-1 and with a[0] = c[n-1] = 0.  Returns the
	// values x[i] as an array.
	thomas : function(a, b, c, d) {
	    let n = a.length;
	    let cc = new Array(n);
	    let dd = new Array(n);
	    // forward sweep
	    cc[0] = c[0] / b[0];
	    dd[0] = d[0] / b[0];
	    for (let i = 1; i < n; i++) {
		let den = b[i] - cc[i-1]*a[i];
		cc[i] = c[i] / den;
		dd[i] = (d[i] - dd[i-1]*a[i]) / den;
	    }
	    let x = new Array(n);
	    // back substitution
	    x[n-1] = dd[n-1];
	    for (let i = n-2; i >= 0; i--)
		x[i] = dd[i] - cc[i]*x[i+1];
	    return x;
	},
	// Solves an "almost" tridiagonal linear system with i-th row
	// a[i]x[i-1] + b[i]x[i] + c[i]x[i+1] = d[i] starting with row i=0,
	// ending with row i=n-1 and with a[0] = c[n-1] = 0.  Returns the
	// values x[i] as an array.  The system is not really tridiagonal
	// because the 0-th row is b[0]x[0] + c[0]x[1] + sx[n-1] = d[0] and
	// row n-1 is tx[0] + a[n-1]x[n-2] + b[n-1]x[n-1] = d[n-1].  The
	// Sherman-Morrison-Woodbury formula is used so that the function
	// "thomas" can be called to solve the system.
	sherman : function(a, b, c, d, s, t) {
	    let n = a.length;
	    let u = new Array(n);
	    u.fill(0, 1, n-1);
	    u[0] = 1;
	    u[n-1] = 1;
	    let v = new Array(n);
	    v.fill(0, 1, n-1);
	    v[0] = t;
	    v[n-1] = s;
	    b[0] -= t;
	    b[n-1] -= s;
	    // this would be more efficient if computed in parallel, but hey...
	    let Td = HobbyPath.utils.thomas(a, b, c, d);
	    let Tu = HobbyPath.utils.thomas(a, b, c, u);
	    let factor = (t*Td[0] + s*Td[n-1]) / (1 + t*Tu[0] + s*Tu[n-1]);
	    let x = new Array(n);
	    for (let i = 0; i < n; i++)
		x[i] = Td[i] - factor * Tu[i];
	    return x;
	}
    };
    
    window.HobbyPath = HobbyPath;

})();
