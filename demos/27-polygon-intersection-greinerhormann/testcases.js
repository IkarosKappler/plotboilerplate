/**
 * @requires Vertex
 * @requires GirihDecagon
 * @requires GirihPentagon
 *
 * @author   Ikaros Kappler
 * @date     2020-12-11
 * @modified 2020-12-20
 */

// @param {PlotBoilerplate} pb
// @param {function(Vertex[],Vertex[])=>void}
function loadRandomTestCase(pb, setVertices) {

    console.log('Loading random test case ...');

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function() {
	return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
			   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
			 );
    };

    pb.removeAll();

    var vertsA = [];
    var vertsB = [];
    for( var i = 0; i < 7; i++ ) {
	var vertA = randomVertex();
	var vertB = randomVertex();
	vertsA.push( vertA );
	vertsB.push( vertB );
    }
    setVertices( vertsA, vertsB );
}


// @param {PlotBoilerplate} pb
// @param {function(Vertex[],Vertex[])=>void}
function loadSquareTestCase(pb, setVertices) {

    console.log('Loading square test case ...');

    pb.removeAll();

    var vertsA = [];
    var vertsB = [];

    var size = Math.min( pb.canvasSize.width, pb.canvasSize.height ) * 0.666;
    var sizeA = size * 0.333;
    var sizeB = size * 0.4848;

    vertsA.push( new Vertex(-sizeA,-sizeA) );
    vertsA.push( new Vertex( sizeA,-sizeA) );
    vertsA.push( new Vertex( sizeA, sizeA) );
    vertsA.push( new Vertex(-sizeA, sizeA) );

    vertsB.push( new Vertex(-sizeB,0) );
    vertsB.push( new Vertex(0,-sizeB) );
    vertsB.push( new Vertex(sizeB,0) );
    vertsB.push( new Vertex(0,sizeB) );

    // Print area to compare with polygon-area algorithm
    // console.log( '[loadSquareTestCase] square edge length A', 2*sizeA, 'area', Math.pow(2*sizeA,2) );
    // console.log( '[loadSquareTestCase] square edge length B', 2*sizeB, 'area', Math.pow(2*sizeB,2) );
    setVertices( vertsA, vertsB );
}

// @param {PlotBoilerplate} pb
// @param {function(Vertex[],Vertex[])=>void}
function loadGirihTestCase(pb, setVertices) {

    console.log('Loading girih test case ...');

    pb.removeAll();

    var tileA = new GirihDecagon( new Vertex(0,0) );
    var tileB = new GirihPentagon( new Vertex(0,0) );

    // Move A[9] to B[4] so the points are congruent
    var diff = tileA.vertices[5].difference( tileB.vertices[1] );
    tileA.move( diff );
    
    setVertices( tileA.vertices, tileB.vertices ); 
}
