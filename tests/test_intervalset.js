'use  strict';

function echo( msg ) {
    console.log( msg );
    document.getElementById('output').innerHTML += msg+'<br>';
}

window.addEventListener(
    'load',
    function() {

	echo("Creating new interval set ...");
	var set = new IntervalSet( 0, 100 );
	set.removeInterval( 20, 30 );
	
	echo( set.toString() );
	
    }
);

