/**
 * Convert the given circle arc path (must be connected to look good) to
 * SVG path data.
 *
 * @author  Ikaros Kappler
 * @version 1.0.1
 * @date    2020-12-01
 *
 * @param {CircleSector[]} path
 * @param {XYCoords} offs - The draw offset to use.
 * @param {XYCoords} scale - The zoom to use.
 */
var pathToSVGData = function( path, offs, scale ) {
    // Build the SVG path data 
    // https://www.w3.org/TR/SVG/paths.html
    
    var svgData = [];
    var lastArc = null;
    
    for( var i = 0; i < path.length; i++ ) {
	var sector = path[i];

	if( i == 0 ) {
	    // At the beginning add the inital position?
	    // var startPoint = circle.vertAt( interval[0] );
	    var startPoint = sector.circle.vertAt( sector.startAngle );
	    svgData.push( "M",
			  offs.x + scale.x * startPoint.x,
			  offs.y + scale.y * startPoint.y );
	}
	lastArc = CircleSector.circleSectorUtils.describeSVGArc(
	    offs.x + sector.circle.center.x * scale.x,
	    offs.y + sector.circle.center.y * scale.y,
	    sector.circle.radius * (scale.x), // scal.y??
	    sector.startAngle,
	    sector.endAngle,
	    { moveToStart : false }
	);
	svgData = svgData.concat( lastArc );
    }
    // Close the path
    svgData.push( "Z" );

    return svgData;
};
