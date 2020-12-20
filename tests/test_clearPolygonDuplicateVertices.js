
(function() {

    function echo( msg ) {
	console.log( msg );
	document.getElementById('output').innerHTML += msg+'<br>';
    }

    window.addEventListener('load', function() {
	echo('init');

	var vertsA = [ new Vertex(0,0),
		       new Vertex(10,10),
		       new Vertex(10,10),
		       new Vertex(20,20),
		       new Vertex(30,30),
		       new Vertex(10,10),
		       new Vertex(0,0)
		     ];
	console.log( 'inputA', vertsA );
	var resultA = clearPolygonDuplicateVertices( vertsA );
	console.log( 'resultA', resultA );


	var vertsB = [ new Vertex(0,0),
		       new Vertex(10,10),
		       new Vertex(10,10),
		       new Vertex(20,20),
		       new Vertex(30,30),
		       new Vertex(10,10),
		       new Vertex(100,100)
		     ];
	console.log( 'inputB', vertsB );
	var resultB = clearPolygonDuplicateVertices( vertsB );
	console.log( 'resultB', resultB );

    } );

})();
