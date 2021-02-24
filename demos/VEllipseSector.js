/**
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
			       options // ?:{moveToStart:boolean}
			     ) { // : SVGPathParams => {
	
	if( typeof options === 'undefined' )
	    options = { moveToStart : true };

	// XYCoords
	// var end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
	// var start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
	var end = VEllipse.utils.polarToCartesian( x, y, radiusV, radiusH, endAngle );
	var start = VEllipse.utils.polarToCartesian( x, y, radiusV, radiusH, startAngle );

	// Split full circles into two halves.
	// Some browsers have problems to render full circles (described by start==end).
	/* if( Math.PI*2-Math.abs(startAngle-endAngle) < 0.001 ) {
	    // SVGParams
	    var firstHalf = VEllipseSector.ellipseSectorUtils.describeSVGArc( x, y, radiusH, radiusV, startAngle, startAngle+(endAngle-startAngle)/2, options );
	    var secondHalf = VEllipseSector.ellipseSectorUtils.describeSVGArc( x, y, radiusH, radiusV, startAngle+(endAngle-startAngle)/2, endAngle, options );
	    return firstHalf.concat( secondHalf );
	} */

	// Boolean stored as integers (0|1).
	var largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1; // number
	var sweepFlag = 1; // number
	var pathData = [];
	if( options.moveToStart ) {
	    pathData.push('M', start.x, start.y );
	}
	pathData.push("A", radiusH, radiusV, 0, largeArcFlag, sweepFlag, end.x, end.y );
	return pathData;
    } 
};
