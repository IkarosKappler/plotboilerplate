/**
 * @date 2020-10-02
 **/

(function() {

    var CircularIntervalSet = function( start, end ) {
	this.start = start;
	this.end = end;

	this.intervals = [ [start, end] ];
    };

    /* IntervalSet.prototype._locateInterval = function( value ) {
	for( var i = 0; i < this.intervals.length; i++ ) {
	    if( this._isIn(value,i) ||
		// (i+1 < this.intervals.length && this.intervals[i+1][0] > value )
		this.intervals[i][0] > value
	      )
		return i;
	}
	return -1;
    }; */

    CircularIntervalSet.prototype.clear = function() {
	this.intervals = [];
    };

    /* IntervalSet.prototype._isIn = function( value, index ) {
	//console.log( index );
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
    }; */

    CircularIntervalSet.prototype.intersect = function( start, end ) {
	/* if( start < this.start ) {
	    // console.log( 'start < this.start' );
	    this.intersect( this.end-(this.start-start), this.end );
	    this.intersect( this.start, end );
	} else if( end > this.end ) {
	    // console.log( 'end > this.end' );
	    this.intersect( this.start, this.start+(end-this.end) );
	    this.intersect( start, this.end );
	    } else { // if( start <= end ) { */
	for( var i = 0; i < this.intervals.length; ) {
	    if( start <= end ) {
		//console.log('start <= end', start, end);
		if( (this.intervals[i][0] >= end || this.intervals[i][1] <= start) ) {
		    // Current interval is fully outside range.
		    // REMOVE
		    this.intervals.splice( i, 1 );
		    // } else if( start > end && (this.intervals[i][0] >= end && this.intervals[i][1] <= start) ) {
		    // Current interval is fully outside range.
		    // REMOVE
		    // this.intervals.splice( i, 1 );
		} else if( this.intervals[i][0] >= start && this.intervals[i][1] <= end ) {
		    // Current interval is fully inside.
		    // KEEP
		    i++;
		} else if( this.intervals[i][0] <= start && this.intervals[i][1] >= end ) {
		    // Desired range lies inside current interval.
		    // CUT OFF LEFT AND RIGHT.
		    this.intervals.splice( i, 1, [start,end] );
		    i++;
		} else if( this.intervals[i][0] <= start && this.intervals[i][1] < end ) {
		    // Right end is inside range.
		    // CUT OFF LEFT.
		    this.intervals[i][0] = start;
		    i++;
		} else if( this.intervals[i][0] > start && this.intervals[i][1] >= end ) {
		    // LEFT end is inside range.
		    // CUT OFF RIGHT.
		    this.intervals[i][1] = end;
		    i++;
		} else {
		    // ELSE???
		    console.log( "ELSE???" );
		    i++;
		}
	    } else {
		// console.log('start > end', start, end);
		// start > end
		if( this.intervals[i][0] >= end && this.intervals[i][1] <= start ) {
		    // Current interval is fully outside range.
		    // REMOVE
		    this.intervals.splice( i, 1 );
		} else if( this.intervals[i][0] >= start ) {
		    // Full inside (right range).
		    // Keep.
		    i++;
		} else if( this.intervals[i][1] <= end ) {
		    // Full inside (left range).
		    // Keep.
		    i++;
		} else if( this.intervals[i][0] >= end && this.intervals[i][1] > start ) {
		    // Right part inside.
		    // Cut off left part.
		    this.intervals.splice( i, 1, [start,this.intervals[i][1]] );
		    i++;
		} else if( this.intervals[i][0] <= end && this.intervals[i][1] < start ) {
		    // Left part inside.
		    // Cut off right part.
		    this.intervals.splice( i, 1, [this.intervals[i][0],end] );
		    i++;
		} else if( this.intervals[i][0] <= end && this.intervals[i][1] >= start ) {
		    // Start and end inside, inner part is not.
		    // Cut into two.
		    this.intervals.splice( i, 1, [this.intervals[i][0],end], [start,this.intervals[i][1]] );
		    i+=2;
		}
	    } 
	}
	/*} /* else {
	    // this.intersect( end, start );
	    // this.intersect( end, this.end );
	    // this.intersect( this.start, start );
	    this.intersect( start, this.end );
	    this.intersect( this.start, end );
	}  */
    };

    /*
    IntervalSet.prototype._removeInterval = function( start, end ) {
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
	if( startIndex == -1 || endIndex == -1 ) {
	    console.log( "ERR? start", start, "end", end, "startIndex", startIndex, "endIndex", endIndex ); // , "startInside", startInside, "endInside", endInside, "startIsMin", startIsMin, "startIsMax", startIsMax, "endIsMin", endIsMin, "endIsMax", endIsMax ); //, "startIsExtreme", startIsExtreme, "endIsExtreme", endIsExtreme );
	    return
	}
	
	var startInside = this._isIn(start,startIndex);
	// console.log( this.intervals, endIndex );
	var endInside = this._isIn(end,endIndex);
	var startIsMin = this._isMin(start,startIndex);
	var startIsMax = this._isMax(start,startIndex);
	var endIsMin = this._isMin(end,endIndex);
	var endIsMax = this._isMax(end,endIndex);
	// var startIsExtreme = this._isExtreme(start,startIndex);
	// var endIsExtreme = this._isExtreme(end,endIndex);
	// console.log( "start", start, "end", end, "startIndex", startIndex, "endIndex", endIndex, "startInside", startInside, "endInside", endInside, "startIsMin", startIsMin, "startIsMax", startIsMax, "endIsMin", endIsMin, "endIsMax", endIsMax ); //, "startIsExtreme", startIsExtreme, "endIsExtreme", endIsExtreme );

	if( startInside && endInside && !startIsMax && !endIsMin ) {
	    if( startIndex == endIndex && startIsMin && endIsMax ) {
		this.intervals.splice( startIndex,
				       endIndex-startIndex+1 // ,
				       // [this.intervals[startIndex][0], start],
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else if( endIsMax && endIndex+1 == this.intervals.length ) {
		if( startIsMin ) {
		    this.intervals.splice( startIndex,
					   endIndex-startIndex+1 //,
					   // [this.intervals[startIndex][0], start] // ,
					   // [end, this.intervals[endIndex][1]]
					 );
		} else {
		    this.intervals.splice( startIndex,
					   endIndex-startIndex+1,
					   [this.intervals[startIndex][0], start] // ,
					   // [end, this.intervals[endIndex][1]]
					 );
		}
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
	    if( startIndex == endIndex ) {
		this.intervals.splice( startIndex,
				       1 // endIndex-startIndex, // + (endIsExtreme ? 1 : 0),
				       // [this.intervals[startIndex][0], start] //,
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else if( startIsMin ) {
		this.intervals.splice( startIndex,
				       endIndex-startIndex // + (endIsExtreme ? 1 : 0),
				       // [this.intervals[startIndex][0], start] //,
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else { console.log('X', startIndex, endIndex-startIndex); 
		this.intervals.splice( startIndex,
				       endIndex-startIndex, //, // + (endIsExtreme ? 1 : 0),
				       [this.intervals[startIndex][0], start] //,
				       // [end, this.intervals[endIndex][1]]
				     );
	    }
	} else if( (!startInside || startIsMax) && endInside ) {
	    if( startIndex == endIndex ) {
		this.intervals.splice( startIndex,
				       1 // endIndex-startIndex //, // + (startIsExtreme ? 1 : 0),
				       // [this.intervals[startIndex][0], start] //,
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else if( endIsMax ) {
		this.intervals.splice( startIndex,
				       endIndex-startIndex // + (endIsExtreme ? 1 : 0),
				       // [this.intervals[startIndex][0], start] //,
				       // [end, this.intervals[endIndex][1]]
				     );
	    } else {
		this.intervals.splice( startIndex,
				       endIndex-startIndex, // + (startIsExtreme ? 1 : 0),
				       //[this.intervals[startIndex][0], start] //,
				       [end, this.intervals[endIndex][1]]
				     );
	    }
	} else if( (!startInside || startIsMax) && (!endInside || endIsMin)  ) {
	    this.intervals.splice( startIndex,
				   endIndex-startIndex // ,
				   // [this.intervals[startIndex][0], start] //,
				   // [end, this.intervals[endIndex][1]]
				 );
	}
    }; */

    CircularIntervalSet.prototype.toString = function() {
	return JSON.stringify( this.intervals );
    };

    window.CircularIntervalSet = CircularIntervalSet;
    // window.CircularInterval = CircularInterval;
})();
