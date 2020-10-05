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
	
	echo( "Remove 20,30 ..." );
	set.removeInterval( 20, 30 );
	echo( set.toString() );

	echo( "Remove 20,30 again ..." );
	set.removeInterval( 20, 30 );
	echo( set.toString() );

	echo( "Remove 40,50 ..." );
	set.removeInterval( 40, 50 );
	echo( set.toString() );

	echo( "Remove 19,31 ..." );
	set.removeInterval( 19, 31 );
	echo( set.toString() );

	echo( "Remove 99,100 (the end) ..." );
	set.removeInterval( 99, 100 );
	echo( set.toString() );

	echo( "Remove 0,1 (the start) ..." );
	set.removeInterval( 0, 1 );
	echo( set.toString() );

	echo( "Remove 31,40 (full sub interval) ..." );
	set.removeInterval( 31,40 );
	echo( set.toString() );

	echo( "Remove 1,19 (left sub interval) ..." );
	set.removeInterval( 1,19 );
	echo( set.toString() );

	echo( "Remove 50,99 (right sub interval) ..." );
	set.removeInterval( 50,99 );
	echo( set.toString() );
    }
);

