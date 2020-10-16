'use  strict';

function echo( msg ) {
    console.log( msg );
    document.getElementById('output').innerHTML += msg+'<br>';
}

window.addEventListener(
    'load',
    function() {

	echo("Creating new cirular interval ...");
	var intv = new CircularInterval( 0, 100, 0, 100 );
	echo( intv.toString() );

	echo("Intrerscting with [0,20] ...");
	intv.intersect( 0, 20 );
	echo( intv.toString() );
	
	/*
	echo("Creating new interval set ...");
	var set = new IntervalSet( 0, 100 );
	echo( set.toString() );
	
	echo( "Remove 20,30 ..." );
	set.removeInterval( 20, 30 );
	echo( set.toString() );

	echo( "Remove 20,30 again ..." );
	set.removeInterval( 20, 30 );
	echo( set.toString() );

	echo( "Remove 40,50 ..." );
	set.removeInterval( 40, 50 );
	echo( set.toString() );

	echo( "Remove 60,70 ..." );
	set.removeInterval( 60, 70 );
	echo( set.toString() );

	echo( "Remove 80,90 ..." );
	set.removeInterval( 80, 90 );
	echo( set.toString() );

	echo( "Remove 19,31 ..." );
	set.removeInterval( 19, 31 );
	echo( set.toString() );

	echo( "Remove 99,100 (the end) ..." );
	set.removeInterval( 99, 100 );
	echo( set.toString() );

	echo( "Remove 98,101 (beyond the end) ..." );
	set.removeInterval( 98, 101 );
	echo( set.toString() );

	echo( "Remove -1,0 (before the start) ..." );
	set.removeInterval( -1,1 );
	echo( set.toString() );

	echo( "Remove -1,1 (the start) ..." );
	set.removeInterval( 0, 1 );
	echo( set.toString() );

	echo( "Remove 31,40 (full sub interval) ..." );
	set.removeInterval( 31,40 );
	echo( set.toString() );

	echo( "Remove 0,20 (around left sub interval) ..." );
	set.removeInterval( 0,20 );
	echo( set.toString() );

	echo( "Remove 70,99 (right two sub intervals) ..." );
	set.removeInterval( 70,99 );
	echo( set.toString() );

	echo( "Remove 51,59 (interval fully inside sub interval) ..." );
	set.removeInterval( 51,59 );
	echo( set.toString() );

	echo( "Remove 49,60 (multipe sub intervals) ..." );
	set.removeInterval( 49,60 );
	echo( set.toString() );

	*/
    }
);

