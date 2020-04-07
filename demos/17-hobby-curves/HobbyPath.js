// Copyright (c) 2018-2019, Dr. Edmund Weitz.  All rights reserved.

// The code in this file is written mainly for demonstration purposes
// and to illustrate the videos mentioned on the HTML page.  It would
// be fairly easy to make it shorter and more efficient, but I
// refrained from doing this on purpose.

(function() {

    
    // SVG elements
    var svgs = [];
    // SVG namespace
    var svgNS;
    // helper SVG point used in mouse event handler
    var pt;
    // point radius
    var R = 5;
    // distance up to which existing points and mouse clicks are
    // identified - see `nearPoint`
    var dist = (R + 3) * (R + 3);
    // coordinates of current points
    var pointsX, pointsY;
    // two lists - points[0] and points[1] - of SVG elements correspoding
    // to pointsX/pointsY
    var points;
    // the two SVG path elements, left (natural) and right (Hobby)
    var path0, path1;
    // whether the loop is interpreted as closed (i.e. last point is
    // connected to first one)
    var closedLoop = false;
    // if not negative, this is the "active" point currently moved by the
    // mouse; counting starts at 0
    var active = -1;
    // if positive, this is the point after which the next one will be
    // inserted; set by pressing a number key; counting starts at 1
    var insertAt = 0;
    // if true, the (gray) right side won't be shown
    var noHobby = false;
    // if true, the left side won't be shown
    var noNatural = false;
    // "curl"
    var omega = 0;

    var HobbyPath = function(startPoint) {

	this.vertices = []; // pointsX and pointsY
	
	function clearPoints (path) {
	    path.insertAt = 0;
	    path.pointsX = [];
	    path.pointsY = [];
	    path.points = [];
	    path.points[0] = [];
	    path.points[1] = [];
	    //path.removeAllCircles(svgs[0]);
	    //path.removeAllCircles(svgs[1]);
	}
	clearPoints(this);

	// utility function to set several attributes of an element at once
	function setAttributes (el, attrs) {
	    for (let [name, val] of attrs) {
		el.setAttribute(name, val);
	    }
	}

	// adjust size of SVG area to size of window
	/* function setSize () {
	   if (noHobby) {
	   svgs[1].setAttribute("width", 0);
	   svgs[1].setAttribute("height", window.innerHeight);
	   svgs[0].setAttribute("width", window.innerWidth);
	   svgs[0].setAttribute("height", window.innerHeight);
	   svgs[0].setAttribute("viewBox", "0 0 1600 900");
	   } else if (noNatural) {
	   svgs[0].setAttribute("width", 0);
	   svgs[0].setAttribute("height", window.innerHeight);
	   svgs[1].setAttribute("width", window.innerWidth);
	   svgs[1].setAttribute("height", window.innerHeight);
	   svgs[1].setAttribute("viewBox", "0 0 1600 900");
	   } else {
	   svgs[0].setAttribute("width", window.innerWidth / 2);
	   svgs[0].setAttribute("height", window.innerHeight);
	   svgs[1].setAttribute("width", window.innerWidth / 2);
	   svgs[1].setAttribute("height", window.innerHeight);
	   svgs[0].setAttribute("viewBox", "0 0 800 900");
	   svgs[1].setAttribute("viewBox", "0 0 800 900");
	   }
	   } */

	// remove all circles (i.e. points) from SVG area
	function removeAllCircles (svg) {
	    let els = svg.getElementsByTagName("circle");
	    for (let i = els.length-1; i >= 0; i--)
		svg.removeChild(els[i]);
	}

	// completely remove all points created so far from all data
	// structures
	/* function clearPoints () {
	   insertAt = 0;
	   pointsX = [];
	   pointsY = [];
	   points = [];
	   points[0] = [];
	   points[1] = [];
	   removeAllCircles(svgs[0]);
	   removeAllCircles(svgs[1]);
	   } */

	// "dummy" event handler to disable default event handling
	/*function prevent (event) {
	  event.preventDefault();
	  }*/

	// called when page has finished loading
	/* function init () {
	// initialize global variables
	svgs[0] = document.getElementById("svg0");
	svgs[1] = document.getElementById("svg1");
	svgNS = svgs[0].namespaceURI;
	pt = svgs[0].createSVGPoint();
	setSize();
	window.onresize = setSize;
	for (let i = 0; i < 2; i++) {
	svgs[i].addEventListener("mousedown", (event) => {downMouse(event, i);});
	svgs[i].addEventListener("mouseup", upMouse);
	svgs[i].addEventListener("mouseleave", upMouse);
	svgs[i].addEventListener("mousemove", (event) => {moveMouse(event, i);});
	["contextmenu", "drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(function (event) {
	svgs[i].addEventListener(event, prevent);
	});
	}
	clearPoints();
	// the curves are there all the time, but at the start they don't
	// have a "d" element
	path0 = svgs[0].appendChild(document.createElementNS(svgNS, "path"));
	path1 = svgs[1].appendChild(document.createElementNS(svgNS, "path"));
	setAttributes(path0, [
	["stroke", "black"],
	["fill", "none"]
	]);
	setAttributes(path1, [
	["stroke", "black"],
	["fill", "none"]
	]);
	document.onkeydown = keyHandler;
	}
	*/

	// adds one point (as a filled SVG circle) to the SVG area and returns it
	function addPoint (svg, x, y) {
	    /* let point = svg.appendChild(document.createElementNS(svgNS, "circle"));
	       setAttributes(point, [
	       ["cx", x],
	       ["cy", y],
	       ["r", R],
	       ["stroke", "none"],
	       ["fill", "black"]
	       ]);
	       return point;
	    */
	    return { x : x, y : y };
	}

	// checks whether the coordinates specify a location which is "near"
	// one of the existing points; returns the index of this point or -1
	/* function nearPoint (x, y) {
	   for (let i = 0; i < pointsX.length; i++) {
	   let dx = pointsX[i] - x;
	   let dy = pointsY[i] - y;
	   if (dx*dx + dy*dy <= dist)
	   return i;
	   }
	   return -1;
	   } */

	// returns the translated coordinates of a mouth click on SVG area
	// number i
	/* function getPoint (event, i) {
	   pt.x = event.clientX;
	   pt.y = event.clientY;
	   return pt.matrixTransform(svgs[i].getScreenCTM().inverse());
	   } */

	// handler for "mousedown" events
	function downMouse (event, i) {
	    event.preventDefault();
	    event.stopPropagation();
	    hideInfo();
	    let pt = getPoint(event, i);
	    let j = nearPoint(pt.x, pt.y);
	    if (j != -1) {
		// start movement of existing point
		active = j;
		newPos(pt.x, pt.y);
	    } else {
		// new point
		if (insertAt != 0 && insertAt < pointsX.length) {
		    points[i].splice(insertAt, 0, addPoint(svgs[i], pt.x, pt.y));
		    points[1-i].splice(insertAt, 0, addPoint(svgs[1-i], pt.x, pt.y));
		    pointsX.splice(insertAt, 0, pt.x);
		    pointsY.splice(insertAt, 0, pt.y);
		    this.vertices.splice(insertAt, 0, pt );
		    insertAt = 0;
		} else {
		    points[i].push(addPoint(svgs[i], pt.x, pt.y));
		    points[1-i].push(addPoint(svgs[1-i], pt.x, pt.y));
		    pointsX.push(pt.x);
		    pointsY.push(pt.y);
		    this.vertices.push( pt );
		}
		// update curve
		// drawPath();
	    }
	}

	// handler for "mousemove" events
	/* function moveMouse (event, i) {
	   event.preventDefault();
	   event.stopPropagation();
	   if (active < 0)
	   return;
	   let pt = getPoint(event, i);
	   newPos(pt.x, pt.y);
	   }*/ 

	// handler for "mouseup" events which is also called if the mouse
	// leaves the area
	/* function upMouse (event) {
	   event.preventDefault();
	   event.stopPropagation();
	   active = -1;
	   } */

	// changes the position of the point indexed by "active"
	function newPos (x, y) {
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
	}

	// the main workhorse function which draws the curve(s) based on the
	// existing points - it does this by setting up the "d" attributes of
	// the path elements
	function drawPath () {
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
	}	
    };

    // the "velocity function" (also called rho in the video); a and b are
    // the angles alpha and beta, the return value is the distance between
    // a control point and its neighboring point; to compute sigma(a,b)
    // we'll simply use rho(b,a)
    function rho (a, b) {
	// see video for formula
	let sa = Math.sin(a);
	let sb = Math.sin(b);
	let ca = Math.cos(a);
	let cb = Math.cos(b);
	let s5 = Math.sqrt(5);
	let num = 4 + Math.sqrt(8) * (sa - sb/16) * (sb - sa/16) * (ca - cb);
	let den = 2 + (s5 - 1) * ca + (3 - s5) * cb;
	return num/den;
    }

    // rotates a vector [x, y] about an angle; the angle is implicitly
    // determined by its sine and cosine
    function rotate (x, y, sin, cos) {
	return [x*cos - y*sin, x*sin + y*cos];
    }

    // rotates a vector [x, y] about the angle alpha
    function rotateAngle (x, y, alpha) {
	return rotate(x, y, Math.sin(alpha), Math.cos(alpha));
    }

    // returns a normalized version of the vector
    function normalize (x, y) {
	let n = Math.hypot(x, y);
	if (n == 0)
	    return [0, 0];
	else
	    return [x / n, y / n];
    }

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
	    let [x, y] = rotate(dx[i], dy[i], -sin, cos);
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
	let alpha = thomas(a, b, c, d);
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
	    let [x, y] = normalize.apply(null, rotateAngle(dx[i], dy[i], alpha[i]));
	    x1[i] = Px[i] + a * x;
	    y1[i] = Py[i] + a * y;
	    [x, y] = normalize.apply(null, rotateAngle(dx[i], dy[i], -beta[i]));
	    x2[i] = Px[i+1] - b * x;
	    y2[i] = Py[i+1] - b * y;
	}
	return [x1, y1, x2, y2];
    };

    // computes four arrays for the x and y coordinates of the first and
    // second controls points for a Hobby curve through the points given
    // by Px and Py, a "closed" curve which returns to its starting point
    HobbyPath.hobbyClosed = function(Px, Py) {
	// most of the code here is identical to the open version and thus
	// doesn't have comments
	let n = Px.length;
	let D = new Array(n);
	let dx = new Array(n);
	let dy = new Array(n);
	for (let i = 0; i < n; i++) {
	    // the "next" point in a modular way
	    let j = (i + 1) % n;
	    dx[i] = Px[j]-Px[i];
	    dy[i] = Py[j]-Py[i];
	    D[i] = Math.sqrt(dx[i]*dx[i]+dy[i]*dy[i]);
	}
	let gamma = new Array(n);
	for (let i = 0; i < n; i++) {
	    // the "previous" point in a modular way
	    let k = (i + n - 1) % n;
	    let sin = dy[k] / D[k];
	    let cos = dx[k] / D[k];
	    let [x, y] = rotate(dx[i], dy[i], -sin, cos);
	    gamma[i] = Math.atan2(y, x);
	}
	let a = new Array(n);
	let b = new Array(n);
	let c = new Array(n);
	let d = new Array(n);
	for (let i = 0; i < n; i++) {
	    // j is the "next" point, k the "previous" one
	    let j = (i + 1) % n;
	    let k = (i + n - 1) % n;
	    // see video for the equations
	    a[i] = 1 / D[k];
	    b[i] = (2*D[k]+2*D[i])/(D[k]*D[i]);
	    c[i] = 1 / D[i];
	    d[i] = -(2*gamma[i]*D[i]+gamma[j]*D[k])/(D[k]*D[i]);
	}
	// make matrix tridiagonal in preparation for the "sherman" function
	let s = a[0];
	a[0] = 0;
	let t = c[n-1];
	c[n-1] = 0;
	let alpha = sherman(a, b, c, d, s, t);
	let beta = new Array(n);
	for (let i = 0; i < n; i++) {
	    // "next" point
	    let j = (i + 1) % n;
	    beta[i] = -gamma[j]-alpha[j];
	}
	let x1 = new Array(n);
	let y1 = new Array(n);
	let x2 = new Array(n);
	let y2 = new Array(n);
	for (let i = 0; i < n; i++) {
	    let j = (i + 1) % n;
	    let a = rho(alpha[i], beta[i]) * D[i] / 3;
	    let b = rho(beta[i], alpha[i]) * D[i] / 3;
	    let [x, y] = normalize.apply(null, rotateAngle(dx[i], dy[i], alpha[i]));
	    x1[i] = Px[i] + a * x;
	    y1[i] = Py[i] + a * y;
	    [x, y] = normalize.apply(null, rotateAngle(dx[i], dy[i], -beta[i]));
	    x2[i] = Px[j] - b * x;
	    y2[i] = Py[j] - b * y;
	}
	return [x1, y1, x2, y2];
    }

    // Implements the Thomas algorithm for a tridiagonal system with i-th
    // row a[i]x[i-1] + b[i]x[i] + c[i]x[i+1] = d[i] starting with row
    // i=0, ending with row i=n-1 and with a[0] = c[n-1] = 0.  Returns the
    // values x[i] as an array.
    function thomas (a, b, c, d) {
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
    }

    // Solves an "almost" tridiagonal linear system with i-th row
    // a[i]x[i-1] + b[i]x[i] + c[i]x[i+1] = d[i] starting with row i=0,
    // ending with row i=n-1 and with a[0] = c[n-1] = 0.  Returns the
    // values x[i] as an array.  The system is not really tridiagonal
    // because the 0-th row is b[0]x[0] + c[0]x[1] + sx[n-1] = d[0] and
    // row n-1 is tx[0] + a[n-1]x[n-2] + b[n-1]x[n-1] = d[n-1].  The
    // Sherman-Morrison-Woodbury formula is used so that the function
    // "thomas" can be called to solve the system.
    function sherman (a, b, c, d, s, t) {
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
	let Td = thomas(a, b, c, d);
	let Tu = thomas(a, b, c, u);
	let factor = (t*Td[0] + s*Td[n-1]) / (1 + t*Tu[0] + s*Tu[n-1]);
	let x = new Array(n);
	for (let i = 0; i < n; i++)
	    x[i] = Td[i] - factor * Tu[i];
	return x;
    }

    HobbyPath.prototype.addPoint = function(p) {
	console.log('addPoint',p);
	this.vertices.push( p );
	this.pointsX.push( p.x );
	this.pointsY.push( p.y );
    };

    HobbyPath.prototype.generateCurve = function() {

	let n = this.pointsX.length;
	let d = '';

	var curves = [];
	
	if (n > 1) {
	    // starting point
	    d += `M ${this.pointsX[0]} ${this.pointsY[0]}`;
	    if (n == 2) {
		// for two points, just draw a straight line
		d += `L ${this.pointsX[1]} ${this.pointsY[1]}`;
		return [ new CubicBezierCurve(
		    new Vertex(this.pointsX[0],this.pointsY[0]),
		    new Vertex(this.pointsX[1],this.pointsY[1]),
		    new Vertex(this.pointsX[0],this.pointsY[0]),
		    new Vertex(this.pointsX[1],this.pointsY[1])
		) ];
	    } else {
		if (!closedLoop) {
		    // open curve
		    // x1 and y1 contain the coordinates of the first control
		    // points, x2 and y2 those of the second
		    let [x1, y1, x2, y2] = HobbyPath.hobbyOpen(this.pointsX, this.pointsY);
		    for (let i = 0; i < n - 1; i++) {
			d += `C ${x1[i]} ${y1[i]}, ${x2[i]} ${y2[i]}, ${this.pointsX[i+1]} ${this.pointsY[i+1]}`;
			curves.push( new CubicBezierCurve(
			    new Vertex(this.pointsX[i],this.pointsY[i]),
			    new Vertex(this.pointsX[i+1],this.pointsY[i+1]),
			    new Vertex(x1[i],y1[i]),
			    new Vertex(x2[i],y2[i])
			) );
		    }
		    return curves;
		} else {
		    // closed curve
		    // see comments above
		    let [x1, y1, x2, y2] = HobbyPath.hobbyClosed(this.pointsX, this.pointsY);
		    for (let i = 0; i < n; i++) {
			// if i is n-1, the "next" point is the first one
			let j = (i+1) % n;
			d += `C ${x1[i]} ${y1[i]}, ${x2[i]} ${y2[i]}, ${this.pointsX[j]} ${this.pointsY[j]}`;
		    }
		}
	    }
	} else {
	    return [];
	}
	
    };
    
    window.HobbyPath = HobbyPath;

})();
