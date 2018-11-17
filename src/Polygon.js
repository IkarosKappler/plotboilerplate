/**
 * A polygon class.
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-04-14
 * @modified 2018-11-17 Added the containsVert function.
 * @version  1.0.1
 **/

(function(_context) {
    // +---------------------------------------------------------------------------------
    // | The constructor.
    // |
    // | @param vertices Array:Vertex An array of 2d vertices that shape the polygon
    // +-------------------------------
    _context.Polygon = function( vertices, isOpen ) {
	if( typeof vertices == 'undefined' )
	    vertices = [];
	this.vertices = vertices;
	this.isOpen = isOpen;
    };

    // +---------------------------------------------------------------------------------
    // | Check if the given vertex is inside this polygon.
    // |
    // | @param v:Vertex The vertex to check.
    // +-------------------------------
    _context.Polygon.containsVert = function( vert ) {
	// Original ray-casting algorithm found here
	//    https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
	// function checkcheck (x, y, cornersX, cornersY) {
	//    
	//    var i, j=cornersX.length-1 ;
	//    var  oddNodes=false;
	//    
	//    var polyX = cornersX;
	//    var polyY = cornersY;
	//    
	//    for (i=0; i<cornersX.length; i++) {
	//       if ((polyY[i]< y && polyY[j]>=y ||  polyY[j]< y && polyY[i]>=y) &&  (polyX[i]<=x || polyX[j]<=x)) {
	//          oddNodes^=(polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x); 
	//       }
	//    
	//       j=i; 
	//    }
	//    
	//    return oddNodes;
	// }


	var i, j = this.vertices.length-1; //cornersX.length-1 ;
	var oddNodes = false;

	//var polyX = cornersX;
	//var polyY = cornersY;

	var pX, pY;
	//for (i=0; i<cornersX.length; i++) {
	for( var i = 0; i < this.vertices.length; i++ ) {
	    pX = this.vertices[i].x;
	    pY = this.vertices[i].y;
	    if ((pY< y && pY>=y ||  pY< y && pY>=y) &&  (pX<=x || pX<=x)) {
		oddNodes^=(pX+(y-pY)/(pY-pY)*(pX-pX)<x); 
	    }

	    j=i; 
	}

	return oddNodes;
    };


    // +---------------------------------------------------------------------------------
    // | Convert this polygon to a sequence of quadratic Bézier curves.
    // |
    // | The first vertex in the returned array is the start point.
    // | The following sequence are pairs of control-point-and-end-point:
    // | startPoint, controlPoint0, pathPoint1, controlPoint1, pathPoint2, controlPoint2, ..., endPoint  
    // |
    // | @return Array[Vertex] An array of 2d vertices that shape the quadratic Bézier curve.
    // +-------------------------------
    _context.Polygon.prototype.toQuadraticBezierData = function() {
	if( this.vertices.length < 3 )
	    return [];
	var qbezier = [];
	var cc0 = this.vertices[0]; 
	var cc1 = this.vertices[1]; 
	var edgeCenter = new Vertex( cc0.x + (cc1.x-cc0.x)/2,
				     cc0.y + (cc1.y-cc0.y)/2 );
	qbezier.push( edgeCenter );
	var limit = this.isOpen ? this.vertices.length : this.vertices.length+1;
	for( var t = 1; t < limit; t++ ) {  
	    cc0 = this.vertices[ t%this.vertices.length ];
	    cc1 = this.vertices[ (t+1)%this.vertices.length ];
	    var edgeCenter = new Vertex( cc0.x + (cc1.x-cc0.x)/2,
					 cc0.y + (cc1.y-cc0.y)/2 );
	    qbezier.push( cc0 );
	    qbezier.push( edgeCenter );
	    cc0 = cc1;
	}
	return qbezier;
    };

    // +---------------------------------------------------------------------------------
    // | Convert this polygon to a quadratic bezier curve, represented as an SVG data string
    // |
    // | @return svgData:string
    // +-------------------------------
    _context.Polygon.prototype.toQuadraticBezierSVGString = function() {
	var qdata = this.toQuadraticBezierData();
	if( qdata.length == 0 )
	    return "";
	var buffer = [ 'M ' + qdata[0].x+' '+qdata[0].y ];
	for( var i = 1; i < qdata.length; i+=2 ) {
	    buffer.push( 'Q ' + qdata[i].x+' '+qdata[i].y + ', ' + qdata[i+1].x+' '+qdata[i+1].y );
	}
	return buffer.join(' ');
    };

    // +---------------------------------------------------------------------------------
    // | Convert this polygon to a sequence of cubic Bézier curves.
    // |
    // | The first vertex in the returned array is the start point.
    // | The following sequence are triplets of (first-control-point, secnond-control-point, end-point):
    // | startPoint, controlPoint0_0, controlPoint1_1, pathPoint1, controlPoint1_0, controlPoint1_1, ..., endPoint  
    // |
    // | @param treshold:float (default is 1.0) A threshold that defines the pointyness of the curve, must be between 0.0 and 1.0.
    // |
    // | @return Array[Vertex] An array of 2d vertices that shape the cubic Bézier curve.
    // +-------------------------------
    _context.Polygon.prototype.toCubicBezierData = function( threshold ) {

	if( typeof threshold == 'undefined' )
	    threshold = 1.0;
	
	if( this.vertices.length < 3 )
	    return [];
	var cbezier = [];
	var a = this.vertices[0]; 
	var b = this.vertices[1]; 
	var edgeCenter = new Vertex( a.x + (b.x-a.x)/2,   a.y + (b.y-a.y)/2 );
	cbezier.push( edgeCenter );
	
	var limit = this.isOpen ? this.vertices.length-1 : this.vertices.length;
	for( var t = 0; t < limit; t++ ) {
	    var a = this.vertices[ t%this.vertices.length ];
	    var b = this.vertices[ (t+1)%this.vertices.length ];
	    var c = this.vertices[ (t+2)%this.vertices.length ];

	    var aCenter = new Vertex( a.x + (b.x-a.x)/2,   a.y + (b.y-a.y)/2 );
	    var bCenter = new Vertex( b.x + (c.x-b.x)/2,   b.y + (c.y-b.y)/2 );
	    
	    var a2 = new Vertex( aCenter.x + (b.x-aCenter.x)*threshold, aCenter.y + (b.y-aCenter.y)*threshold );
	    var b0 = new Vertex( bCenter.x + (b.x-bCenter.x)*threshold, bCenter.y + (b.y-bCenter.y)*threshold );

	    cbezier.push( a2 );
	    cbezier.push( b0 );
	    cbezier.push( bCenter );
	    
	}
	return cbezier;
	
    };

    // +---------------------------------------------------------------------------------
    // | Convert this polygon to a cubic bezier curve, represented as an SVG data string
    // |
    // | @return svgData:string
    // +-------------------------------
    _context.Polygon.prototype.toCubicBezierSVGString = function( threshold ) {
	var qdata = this.toCubicBezierData( threshold );
	if( qdata.length == 0 )
	    return "";
	var buffer = [ 'M ' + qdata[0].x+' '+qdata[0].y ];
	for( var i = 1; i < qdata.length; i+=3 ) {
	    buffer.push( 'C ' + qdata[i].x+' '+qdata[i].y + ', ' + qdata[i+1].x+' '+qdata[i+1].y + ', ' + qdata[i+2].x + ' ' + qdata[i+2].y );
	}
	return buffer.join(' ');
    };
    
})(window ? window : module.export );
