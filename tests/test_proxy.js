// @date 2020-11-30
// @author Ikaros Kappler
//
// Not working with IEx. Use a 'Proxy' polyfill maybe?
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

(function(_context) {

    _context.addEventListener('load', function() {
	var myObj = { message : 'no message' };

	var proxyHandler = {
	    // get: function(target, prop, receiver) {
	    //    if( prop === 'message' )
	    //       return "getter overridden";
	    // }, 
	    set: function(obj, prop, value) {
		console.log( obj, prop, value );
		if( prop === 'message' ) {
		    console.log('new value: ' + value);
		    document.getElementById('output').innerHTML = value;
		}
		return true; // Indicate success
	    }
	};
	myObj = new Proxy( myObj, proxyHandler );

	document.getElementById('buttonA').addEventListener( 'click', function() {
	    console.log('buttonA clicked');
	    myObj["message"] = "Hello";
	} );
	document.getElementById('buttonB').addEventListener( 'click', function() {
	    console.log('buttonB clicked');
	    myObj.message = "World";
	} );
    } );

})(globalThis || window);
