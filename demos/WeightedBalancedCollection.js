// +---------------------------------------------------------------------------------
// | A weighted & balanced numeric collection implementation working with BBTrees.
// +-------------------------------
(function(_context) {
    var WeightedBalancedCollection = function() {
	this.tree = new BBTree();
	this.maxWeight = 0;
	
	this.add = function( k, data ) {
	    //var v = 1;
	    data.weight = 1;
	    var s = this.tree.size;
	    var node = this.tree.insert(k,data); // v);
	    if( s==this.tree.size ) 
		node.value.weight++;
	    this.maxWeight = Math.max( this.maxWeight, node.value.weight );
	};
    };
    _context.WeightedBalancedCollection = WeightedBalancedCollection;
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
