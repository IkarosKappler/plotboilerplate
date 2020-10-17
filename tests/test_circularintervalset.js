'use  strict';

function echo( msg ) {
    console.log( msg );
    document.getElementById('output').innerHTML += msg+'<br>';
}

window.addEventListener(
    'load',
    function() {

	echo("Creating new circular interval set ...");
	var set = new CircularIntervalSet( 0, 100 );
	echo( set.toString() );

	echo("Intrerscting with [60,50] ...");
	set.intersect( 60, 50 );
	echo( set.toString() );
	
	echo("Intrerscting with [0,20] ...");
	set.intersect( 0, 20 );
	echo( set.toString() );
	
    }
);

