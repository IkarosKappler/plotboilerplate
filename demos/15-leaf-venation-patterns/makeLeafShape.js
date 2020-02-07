

function makeLeafShape( size ) {

    /*
    // Make a nice Bézier path
    var bcurves = [];
    bcurves.push( [
	new Vertex(0,1).scale(size),
	new Vertex(1,0).scale(size),
	new Vertex(0.75,1.5).scale(size),
	new Vertex(1.25,0.75).scale(size)
    ] );
    bcurves.push( [
	bcurves[0][1].clone(),
	new Vertex(0,-1).scale(size),
	bcurves[0][3].clone().rotate( Math.PI, bcurves[0][1] ).scale( 0.5, bcurves[0][1]),
	new Vertex(0.45,-0.9).scale(size)
    ] );
    var path = BezierPath.fromArray( bcurves );
    */


    
    // Make a nice Bézier path
    var bcurves = [];
    bcurves.push( [
	new Vertex(0,1).scale(size),
	new Vertex(1,0.35).scale(size),
	new Vertex(0.75,1.5).scale(size),
	new Vertex(0.9,0.65).scale(size)
    ] );
    bcurves.push( [
	bcurves[0][1].clone(),
	new Vertex(0.75,-0.25).scale(size),
	bcurves[0][3].clone().rotate( Math.PI, bcurves[0][1] ).scale( 0.5, bcurves[0][1]), // new Vertex(0.75,1.5).scale(size),
	new Vertex(1.0,-0.05).scale(size)
    ] );
    bcurves.push( [
	bcurves[0][1].clone(),
	new Vertex(0,-1).scale(size),
	bcurves[1][3].clone().rotate( Math.PI, bcurves[1][1] ).scale( 0.9, bcurves[1][1]),
	new Vertex(0.45,-0.9).scale(size)
    ] );
    var path = BezierPath.fromArray( bcurves );
    

    
    
    
    return path;
}
