// +---------------------------------------------------------------------------------
// | A weighted numeric collection implementation working with epsilon.
// +-------------------------------
(function(_context) {
    _context.WeightedCollection = (function() {
	var WeightedCollection = function( tolerance ) {
	    this.elements = [];
	    this.maxWeight = 0;
	    this.tolerance = tolerance | Collection.EPS;
	};
	WeightedCollection.EPS = 0.0000000001;
	WeightedCollection.prototype.locate = function( num ) {
	    for( var i in this.elements ) {
		if( Math.abs(this.elements[i].v-num) <= this.tolerance )
		    return i;
	    }
	    return -1;
	};
	WeightedCollection.prototype.add = function( num ) {
	    var index = this.locate(num);
	    if( index == -1 ) {
		this.elements.push( { v : num, w : 1 } );
		this.maxWeight = Math.max(this.maxWeight,1);
	    } else {
		this.elements[index].w++;
		this.maxWeight = Math.max(this.maxWeight,this.elements[index].w);
	    }
	    return true;
	};	
	return WeightedCollection;
    })();
})(window);
