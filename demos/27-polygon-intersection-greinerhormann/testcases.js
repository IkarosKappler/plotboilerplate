/**
 * @author Ikaros Kappler
 * @date   2020-12-11
 */

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

    setVertices( vertsA, vertsB );
}
