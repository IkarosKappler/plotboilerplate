/**
 * @date 2021-02-18
 */

// Alignment: "vertical" | "horizontal"
var Ruler = function( position, min, max, zero, stepSize, alignment, width ) {

    this.min = min;
    this.max = max;
    this.zero = zero;
    this.width = width;
    this.stepSize = stepSize;
    this.position = position;
    this.alignment = alignment;

    this.draw = function( drawLib, color ) {
	if( this.alignment === "vertical" ) {
	    // Draw a vertical ruler
	    var scaledWidth = this.width / drawLib.scale.x;
	    drawLib.line( { x : position, y : this.min }, { x : position, y : this.max }, color, 1 );
	    for( var y = zero; y <= max; y+=stepSize ) {
		drawLib.line( { x : position-scaledWidth/2, y : y }, { x : position+scaledWidth/2, y : y }, color, 1 );
	    }
	    for( var y = zero-stepSize; y >= min; y-=stepSize ) {
		drawLib.line( { x : position-scaledWidth/2, y : y }, { x : position+scaledWidth/2, y : y }, color, 1 );
	    }
	} else {
	    // Draw a vertical ruler
	    var scaledWidth = this.width / drawLib.scale.y;
	    drawLib.line( { x : this.min, y : this.position }, { x : this.max, y : this.position }, color, 1 );
	    for( var x = zero; x <= this.max; x+=stepSize ) {
		drawLib.line( { x : x, y : position-scaledWidth/2 }, { x : x, y : position+scaledWidth/2 }, color, 1 );
	    }
	    for( var x = zero-stepSize; x >= this.max; x-=stepSize ) {
		drawLib.line( { x : x, y : position-scaledWidth/2 }, { x : x, y : position+scaledWidth/2 }, color, 1 );
	    }
	}
    };    
};
