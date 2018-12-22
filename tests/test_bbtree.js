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
	};
	
	echo("Creating new tree ...");
	var tree = new BBTree();

	var COUNT = 1000;
	echo("Adding " + COUNT + " elements ...");
	var list = [];
	for( var i = 0; i < COUNT; i++ ) {
	    var rand = Math.random()*9000;
	    var p = new Pair(rand,i);
	    list.push( p );
	    tree.insert( rand, p );
	}

	echo("Retrieving " + COUNT + " elements ...");
	var errors = 0;
	for( var i = 0; i < COUNT; i++ ) {
	    var node = tree.find( list[i].k );
	    if( !node ) {
		echo('Warning! Key ' + list[i].k + ' not found.' );
		errors++;
	    } else if( node.value.k != list[i].k ) {
		echo('Tree returned the wrong element! Expected: ' + list[i].k + '. Found: ' + node.value.k );
		errors++;
	    }
	}
	echo('<font color=green>Done. ' + errors + ' failures.</font>' );

	echo("Inserting duplicate ...");
	tree.insert( -10, new Pair(-10,-10) );
	tree.insert( -10, new Pair(-20,-20) );
	echo("Retrieving duplicate ...");
	var node = tree.find(-10);
	if( node ) {
	    echo("Node found: " + node.value.k ); 
	} else {
	    echo("Node not found!");
	}

	echo('Tree: ' + tree.toString());

	echo("Iterate through all elements ...");
	var iter = tree.iterator();
	var lastElem = null;
	var i = 0;
	function echoNext() {
	    var elem = iter.next();
	    if( !elem )
		return;
	    // echo( elem.key );
	    if( lastElem && lastElem.key > elem.key ) {
		echo("<font color=red>Error: iterator("+i+") > iterator("+(i+1)+"): " + lastElem.key + " >= " + elem.key + "</font>");
		errors++;
		return;
	    }
	    i++;
	    lastElem = elem;
	    if( i < tree.size )
		echoNext(); // window.setTimeout( echoNext, 1 );
	    else
		echo("Iterator delivered "+ i + ' items. tree.size=' + tree.size );
	}
	echoNext();
	
    }
);

