/**
 * Not working with IEx. Use a 'Proxy' polyfill maybe?
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * @date 2020-12-20
 */

(function(_context) {

    // @param {object} observee
    // @param {Array<string>}
    var LiveStats = function( observee, keysToObserve ) {
	
	var root = document.createElement('div');
	root.style.position = 'absolute';
	root.style.left = 0;
	root.style.top = 0;
	root.style.width = '200px';
	root.style.height = '' + (20*keysToObserve.length) + 'px';
	root.style.background = 'rgba(255,255,255,0.95)';
	document.body.appendChild( root );

	var keyMapping = {};

	for( var i in keysToObserve ) {
	    var key = keysToObserve[i];
	    var id = key + "_" + Math.floor( Math.random() * 65636 );
	    console.log( 'key', key );
	    var node = document.createElement('div');
	    var label = document.createElement('div');
	    var content = document.createElement('div');
	    node.style.display = 'flex';
	    label.style.width = '50%';
	    content.style.width = '50%';
	    label.innerHTML = key;
	    content.innerHTML = observee[key];
	    content.setAttribute('id', id);
	    node.appendChild( label );
	    node.appendChild( content );
	    root.appendChild( node );

	    keyMapping[key] = id;
	}

	var proxyHandler = {
	    // get: function(target, prop, receiver) {
	    //    if( prop === 'message' )
	    //       return "getter overridden";
	    // }, 
	    set: function(obj, prop, value) {
		// console.log( 'set function', obj, prop, value );
		if( prop === 'message' ) {
		    console.log('new value: ' + value);
		    // document.getElementById('output').innerHTML = value;
		}
		var id = keyMapping[prop];
		if( typeof id === "undefined" )
		    return false; // Indicates no change
		document.getElementById(id).innerHTML = value;
		return true; // Indicate success
	    }
	};
	return new Proxy( observee, proxyHandler );

    };

    _context.LiveStats = LiveStats;

})(globalThis || window);
