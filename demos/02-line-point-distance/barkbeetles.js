// Drawing bark beetle tunnels
// @date 2019-12-15

var BarkBeetles = function( pb, line ) {

    /**
     * Draw something that looks like bark beetle tunnels.
     **/
    function drawBarkbeetleTunnels() {

	let _line = null;
	let pdist = 10; 
	let leftElements = {};
	let rightElements = {};
	var t = -10000;
	var minT = 0.0; 
	var maxT = 1.0;
	for( var i in pb.drawables ) { 
	    if( !(pb.drawables[i] instanceof Line ) )
		continue;

	    _line = pb.drawables[i];
	    // Skip the central main line (which is a drawable, too)
	    if( _line === line )
		continue;

	    let roundEnd = _drawRoundEnd( new Vector(_line.b, _line.a), pdist, true );

	    let t = line.getClosestT(_line.a);
	    var tri = new Triangle( roundEnd.perpStart.b, roundEnd.perpStart.clone().inv().b, _line.b );
	    
	    let det = new Triangle(line.a, line.b, _line.a).determinant();
	    pb.fill.polyline( [tri.a, tri.b, tri.c], false, det<0 ? 'rgba(0,255,0,0.35)' : 'rgba(255,0,255,0.35)' );
	    
	    if( det<0 ) leftElements[ t ]  = { t : t, tri : tri };
	    else        rightElements[ t ] = { t : t, tri : tri };

	    minT = Math.min( minT, t );
	    maxT = Math.max( maxT, t );
	}

	var leftEndTs  = _drawConnectingElements( leftElements, true );
	var rightEndTs = _drawConnectingElements( rightElements, false );	
    }


    /**
     * Draws the tunnel lines and a round end.
     **/
    var _drawRoundEnd = function( vec, pdist, drawTunnelLines ) {
	// line.a is the end point, line.b is the intersection point		
	let perpStart = vec.perp().setLength(pdist);
	perpStart.add( vec.clone().setLength(pdist).sub(vec.a).b );
	let perpEnd = perpStart.clone().add( vec.clone().setLength(vec.length()-2*pdist).sub(vec.a).b );

	if( drawTunnelLines ) {
	    pb.draw.line( perpStart.b, perpEnd.b, 'grey', 2 );
	    pb.draw.line( perpStart.clone().inv().b, perpEnd.clone().inv().b, 'grey', 2 );
	}
	
	// Compute the tip of the tunnel
	let tipVec = vec.clone().setLength( vec.length()+1.5*pdist );
	let tipPerp = tipVec.perp().setLength(2*pdist).sub( tipVec.a ).add( tipVec.b );
	let tipHandleA = perpEnd.clone().setLength( 2*pdist );
	
	pb.draw.cubicBezier( perpEnd.b, tipVec.b, tipHandleA.b, tipPerp.b, 'grey' );
	pb.draw.cubicBezier( perpEnd.clone().inv().b, tipVec.b, tipHandleA.clone().inv().b, tipPerp.clone().inv().b, 'grey' );

	return { perpStart : perpStart, perpEnd : perpEnd };
    };


    /**
     * Draw the connecting elements on one side of the tunnel.
     **/
    var _drawConnectingElements = function( elements, l2r ) {
	// This is some dirty code: converting the object keys from strings
	// to numbers knowing that they do represent floats might work but it's not really good style.
	// Better: use a real sorted map here.
	var keys = Object.keys(elements).sort(
	    function(a,b) { 
		// Here I know that the keys represent floats!
		return parseFloat(a)-parseFloat(b);
	    }
	);
	if( !l2r ) keys = keys.reverse();
	
	var firstKey = null;
	var lastKey = null;
	var last = null;
	for( var k = 0; k < keys.length; k++ ) {
	    var next = elements[ keys[k] ];
	    if( last != null ) {
		if( l2r ) pb.draw.line( last.tri.b, next.tri.a, 'grey', 2 );
		else      pb.draw.line( next.tri.a, last.tri.b, 'grey', 2 );
	    } 
	    if( firstKey == null ) { 
		firstKey = keys[k];
	    }
	    last = next;
	    lastKey = keys[k];
	}
	return { first: firstKey?elements[firstKey].t:(l2r?0.0:1.0), last : lastKey?elements[lastKey].t:(l2r?1.0:0.0) }; 
    }


    drawBarkbeetleTunnels();
};