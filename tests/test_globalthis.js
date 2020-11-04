'use  strict';

function echo( msg ) {
    console.log( msg );
    document.getElementById('output').innerHTML += msg+'<br>';
}

window.addEventListener(
    'load',
    function() {
	
	function checkMember( name, type ) {
	    if( globalThis[name] || globalThis.hasOwnProperty(name) ) {
		var tmpType = typeof globalThis[name];
		if( tmpType === type )
		    echo("<span class=\"success\">globalThis["+name+"] is of type '" + type + "'</span>" );
		else
		    echo("<span class=\"error\">globalThis["+name+"] is NOT of type '" + type + "' ('" + tmpType + "')</span>" );
	    } else {
		echo("<span class=\"error\">globalThis["+name+"] does not exists!</span>");
	    }
	};
	
	echo("typeof globalThis: " + (typeof globalThis) );

	checkMember( "getComputedStyle", "function" );
	checkMember( "addEventListener", "function" );
	// globalThis.addEventListener('keydown', function(e) { console.log('keydown'); } );
	checkMember( "devicePixelRatio", "number" );
	checkMember( "innerWidth", "number" );
	checkMember( "innerHeight", "number" );
    }
);

