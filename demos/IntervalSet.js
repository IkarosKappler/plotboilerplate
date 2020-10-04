/**
 * @date 2020-10-02
 **/

(function() {

    var IntervalSet = function( start, end, isCircular ) {
	this.start = start;
	this.end = end;
	this.isCircular = isCircular;

	this.intervals = [ [start, end] ];
    };

    IntervalSet.prototype._locateInterval = function( value ) {
	for( var i = 0; i < this.intervals.length; i++ ) {
	    if( this._isIn(value,i) ||
		// (i+1 < this.intervals.length && this.intervals[i+1][0] > value )
		this.intervals[i][0] > value
	      )
		return i;
	}
	return -1;
    };

    IntervalSet.prototype._isIn = function( value, index ) {
	return this.intervals[index][0] <= value && this.intervals[index][1] >= value;	
    };
	
    IntervalSet.prototype.removeInterval = function( start, end ) {
	var startIndex = this._locateInterval( start );
	var endIndex = this._locateInterval( end );

	if( this._isIn(start,startIndex) && this._isIn(end,endIndex) ) {
	    this.intervals.splice( startIndex,
				   endIndex-startIndex+1,
				   [this.intervals[startIndex][0], start],
				   [end, this.intervals[endIndex][1]]
				 );
	} else {

	}
    };

    IntervalSet.prototype.toString = function() {
	return JSON.stringify( this.intervals );
    };

    window.IntervalSet = IntervalSet;
})();
