// +---------------------------------------------------------------------------------
// | A simple numeric collection implementation working with epsilon.
// +-------------------------------
(function(_context) {
    _context.Collection = (function() {
	var Collection = function( tolerance ) {
	    this.elements = [];
	    this.tolerance = tolerance | Collection.EPS;
	};
	Collection.EPS = 0.0000000001;
	Collection.prototype.contains = function( num ) {
	    for( var i in this.elements ) {
		if( Math.abs(this.elements[i]-num) <= this.tolerance )
		    return true;
	    }
	    return false;
	};
	Collection.prototype.add = function( num ) {
	    if( this.contains(num) )
		return false;
	    this.elements.push(num);
	    return true;
	};	
	return Collection;
    })();
})(window);


/*
// Plot it like this
function plotCollection( x, lambda, data ) {
    // Collection or WeightedCollection
    var value;
    for( var i in data.elements ) {
	value = data.elements[i].v;
	var alpha = config.alphaThreshold + (data.elements[i].w/data.elements.length)*(1-config.alphaThreshold);
	alpha = Math.max(0.0, Math.min(1.0, alpha));
	if( config.normalizePlot )
	    value = normalizeYValue(vvalue);
	bp.draw.dot( { x : x, y : value }, 'rgba(0,127,255,'+alpha+')' );
    }
}
*/
