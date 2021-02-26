/**
 * Just for testing: please use the TS implementation.
 *
 * @date 2021-02-24
 */

window.VEllipseSector = function( ellipse, startAngle, endAngle ) {

    this.ellipse = ellipse;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    

};

VEllipseSector.ellipseSectorUtils = {
	/**
	 * Helper function to convert polar circle coordinates to cartesian coordinates.
	 *
	 * TODO: generalize for ellipses (two radii).
	 *
	 * @param {number} angle - The angle in radians.
	*/
	/* polarToCartesian : ( centerX:number, centerY:number, radius:number, angle:number ) : XYCoords => {
	    return {
		x: centerX + (radius * Math.cos(angle)),
		y: centerY + (radius * Math.sin(angle))
	    };
	}, */

	/**
	 * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
	 * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	 *
	 * TODO: generalize for ellipses (two radii).
	 *
	 * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
	 * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
	 */
    describeSVGArc : function( x, y,
			       radiusH,
			       radiusV,
			       startAngle,
			       endAngle,
			       options // ?:{moveToStart:boolean }
			     ) { // : SVGPathParams => {
	
	if( typeof options === 'undefined' )
	    options = { moveToStart : true };

	/*
	if( startAngle > endAngle ) {
	    return VEllipseSector.ellipseSectorUtils.__describeSVGArc(
		x, y, radiusH, radiusV, startAngle, endAngle, { moveToStart: options.moveToStart, reverseSweep : false }
	    );
	} else {
	    return VEllipseSector.ellipseSectorUtils.__describeSVGArc(
		x, y, radiusH, radiusV, endAngle, startAngle, { moveToStart: options.moveToStart, reverseSweep : true }
	    );
	}
	*/
	
	var r2d = 180/Math.PI;
	
	// XYCoords
	var end = VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, endAngle );
	var start = VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, startAngle );
	var diff = endAngle-startAngle;

	// Boolean stored as integers (0|1).
	console.log( "startAngle", (r2d*startAngle).toFixed(4),
		     "endAngle", (r2d*endAngle).toFixed(4),
		     "diff=" + (r2d*diff).toFixed(4) );
	/*
	var largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1; // number
	
	//var sweepFlag = 1;
	// var sweepFlag = (endAngle-startAngle) < -Math.PI ? (startAngle >= endAngle ? 1 : 0) : (startAngle < endAngle ? 1 : 0);
	var sweepFlag = (endAngle-startAngle) < -Math.PI ? (startAngle >= endAngle ? 1 : 0) : (startAngle < endAngle ? 1 : 0);
	*/
	var largeArcFlag, sweepFlag;
	if( diff < 0 ) {
	    largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
	    sweepFlag = 1;
	} else { 
	    largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
	    sweepFlag = 1;
	}
	
	var sweepFlag = 1;
	var pathData = [];
	if( options.moveToStart ) {
	    pathData.push('M', start.x, start.y );
	}
	pathData.push("A", radiusH, radiusV, 0, largeArcFlag, sweepFlag, end.x, end.y );
	return pathData;
	
    },

    
    __describeSVGArc : function( x, y,
			       radiusH,
			       radiusV,
			       startAngle,
			       endAngle,
			       options // ?:{moveToStart:boolean, reverseSweep:boolean}
			     ) { // : SVGPathParams => {
	
	if( typeof options === 'undefined' )
	    options = { moveToStart : true, reverseSweep : false };

	var r2d = 180/Math.PI;
	
	// XYCoords
	var end = VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, endAngle );
	var start = VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, startAngle );

	// Boolean stored as integers (0|1).
	console.log( "startAngle", (r2d*startAngle).toFixed(4),
		     "endAngle", (r2d*endAngle).toFixed(4),
		     "diff=" + (r2d*(endAngle - startAngle)).toFixed(4) );
	var largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1; // number
	
	//var sweepFlag = 1;
	//var sweepFlag = 0;
	// var sweepFlag = (endAngle-startAngle) < -Math.PI ? (startAngle >= endAngle ? 1 : 0) : (startAngle < endAngle ? 1 : 0);
	var sweepFlag =
	    (end-startAngle < 0 )
	    ? 1
	    : ((endAngle-startAngle) < -Math.PI
	       ? (startAngle >= endAngle ? 1 : 0)
	       : (startAngle < endAngle ? 1 : 0));
	if( options.reverseSweep ) {
	    sweepFlag = sweepFlag == 0 ? 1 : 0;
	    largeArcFlag = largeArcFlag == 0 ? 1 : 0;
	}
	var pathData = [];
	if( options.moveToStart ) {
	    pathData.push('M', start.x, start.y );
	}
	pathData.push("A", radiusH, radiusV, 0, largeArcFlag, sweepFlag, end.x, end.y );
	return pathData;
    }

    /*
    _describeSVGArc : function( x, y,
			       radiusH,
			       radiusV,
			       startAngle,
			       endAngle,
			       options // ?:{moveToStart:boolean}
			     ) { // : SVGPathParams => {
	
	if( typeof options === 'undefined' )
	    options = { moveToStart : true };

	if( end

	// XYCoords
	// var end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
	// var start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
	var end = VEllipse.utils.polarToCartesian( x, y, radiusV, radiusH, endAngle );
	var start = VEllipse.utils.polarToCartesian( x, y, radiusV, radiusH, startAngle );

	// Split full circles into two halves.
	// Some browsers have problems to render full circles (described by start==end).

	// Boolean stored as integers (0|1).
	console.log( endAngle, startAngle, "diff=" + (endAngle - startAngle) );
	// var largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1; // number
	
	var largeArcFlag =
	    (endAngle - startAngle) >= 0
	    || (endAngle - startAngle) <= -Math.PI
	    // || (endAngle - startAngle) >= Math.PI
	    ? 0 : 1; // number
	var sweepFlag =
	    (endAngle - startAngle) > Math.PI
	    || (startAngle < 1.5*Math.PI && startAngle > 0.5*Math.PI)
	    ? 0 : 1; // 1 number
	var pathData = [];
	if( options.moveToStart ) {
	    pathData.push('M', start.x, start.y );
	}
	pathData.push("A", radiusH, radiusV, 0, largeArcFlag, sweepFlag, end.x, end.y );
	return pathData;
    } 
    */
};
