'use  strict';

function echo( msg ) {
    console.log( msg );
    document.getElementById('output').innerHTML += msg+'<br>';
}

window.addEventListener(
    'load',
    function() {

	var Pair = function(k,v) {
	    this.k = k;
	    this.v = v;
	    this.toString=function() { return '('+this.k+','+this.v+')'; }
	};
	
	echo("Creating new tree collection ...");
	var coll = new BBTreeCollection();
	// Print the empty collection

	var COUNT = 1000;
	echo("Adding " + COUNT + " elements ...");
	var list = [];
	for( var i = 0; i < COUNT; i++ ) {
	    var rand = Math.random()*9000;
	    var p = new Pair(rand,i);
	    list.push( p );
	    coll.add( rand, p );
	}

	echo("Retrieving " + COUNT + " elements ...");
	var errors = 0;
	for( var i = 0; i < COUNT; i++ ) {
	    var value = coll.get( list[i].k );
	    if( !value ) {
		echo('Warning! Key ' + list[i].k + ' not found.' );
		errors++;
	    } 
	}
	echo('<font color=green>Done. ' + errors + ' failures.</font>' );

	echo("Inserting duplicate ...");
	coll.add( -10, new Pair(-10,-10) );
	coll.add( -10, new Pair(-20,-20) );
	echo("Overwriting record ...");
	coll.set( -10, new Pair(-20,-20) );
	echo("Retrieving duplicate ...");
	var value = coll.get(-10);
	if( value ) {
	    echo("Element found: " + value ); 
	} else {
	    echo("Element not found!");
	}

	echo('Coll: ' + coll.toString());

	echo("Iterate through all elements ...");
	var iter = coll.iterator();
	var lastElem = null;
	var i = 0;
	function echoNext() {
	    var elem = iter.next();
	    if( !elem )
		return;
	    // echo( elem.key );
	    if( lastElem && lastElem.key >= elem.key ) {
		echo("<font color=red>Error: iterator("+i+") >= iterator("+(i+1)+"): " + lastElem.key + " >= " + elem.key + "</font>");
		errors++;
		return;
	    }
	    i++;
	    lastElem = elem;
	    if( i < coll.size() )
		echoNext(); // window.setTimeout( echoNext, 1 );
	    else
		echo("Iterator delivered "+ i + ' items. tree.size=' + coll.size() );
	}
	echoNext();
	
    }
);

