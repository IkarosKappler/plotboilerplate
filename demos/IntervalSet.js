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

    IntervalSet.prototype._isExtreme = function( value, index ) {
	return this.intervals[index].includes(value);
    };

    IntervalSet.prototype._isMin = function( value, index ) {
	return this.intervals[index][0] == value;
    };

    IntervalSet.prototype._isMax = function( value, index ) {
	return this.intervals[index][1] == value;
    };
	
    IntervalSet.prototype.removeInterval = function( start, end ) {
	if( this.intervals.length == 0 )
	    return;
	// Wrap into bounds if values are beyond limits
	if( end > this.intervals[this.intervals.length-1][1] )
	    end = this.intervals[this.intervals.length-1][1];
	if( start < this.intervals[0][0] ) 
	    start = this.intervals[0][0];
	if( start == end )
	    return;
	var startIndex = this._locateInterval( start );
	var endIndex = this._locateInterval( end );
	
	var startInside = this._isIn(start,startIndex);
	console.log( this.intervals, endIndex );
	var endInside = this._isIn(end,endIndex);
	var startIsMin = this._isMin(start,startIndex);
	var startIsMax = this._isMax(start,startIndex);
	var endIsMin = this._isMin(end,endIndex);
	var endIsMax = this._isMax(end,endIndex);
	var startIsExtreme = this._isExtreme(start,startIndex);
	var endIsExtreme = this._isExtreme(end,endIndex);
	console.log( "startIndex", startIndex, "endIndex", endIndex, "startInside", startInside, "endInside", endInside, startIsExtreme, endIsExtreme );
	
	if( startInside && endInside && !startIsMax && !endIsMin ) {
	    if( startIndex == endIndex && startIsMin && endIsMax ) {
		this.intervals.splice( startIndex,
				       endIndex-startIndex+ ( 1 ) // ,
				       // [this.intervals[startIndex][0], start],
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else if( endIsMax && endIndex+1 == this.intervals.length ) {
		this.intervals.splice( startIndex,
				       endIndex-startIndex+ ( 1 ),
				       [this.intervals[startIndex][0], start] // ,
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else if( startIsMin && startIndex == 0 ) {
		this.intervals.splice( startIndex,
				       endIndex-startIndex+ ( 1 ),
				       // [this.intervals[startIndex][0], start] // ,
				       [end, this.intervals[endIndex][1]]
				     );
	    } else {
		this.intervals.splice( startIndex,
				       endIndex-startIndex+ ( 1 ),
				       [this.intervals[startIndex][0], start],
				       [end, this.intervals[endIndex][1]]
				     );
	    }
	} else if( startInside && (!endInside || endIsMin) ) {
	    this.intervals.splice( startIndex,
				   endIndex-startIndex, // + (endIsExtreme ? 1 : 0),
				   [this.intervals[startIndex][0], start] //,
				   // [end, this.intervals[endIndex][1]]
				 );
	} else if( (!startInside || startIsMax) && endInside ) {
	    this.intervals.splice( startIndex,
				   endIndex-startIndex, // + (startIsExtreme ? 1 : 0),
				   //[this.intervals[startIndex][0], start] //,
				   [end, this.intervals[endIndex][1]]
				 );
	} else if( (!startInside || startIsMax) && (!endInside || endIsMin)  ) {
	    this.intervals.splice( startIndex,
				   endIndex-startIndex // ,
				   // [this.intervals[startIndex][0], start] //,
				   // [end, this.intervals[endIndex][1]]
				 );
	}
    };

    IntervalSet.prototype.toString = function() {
	return JSON.stringify( this.intervals );
    };

    window.IntervalSet = IntervalSet;
})();
