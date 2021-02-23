/**
 * This is a sandbox script helping to execute mixed Javascript and Typescript
 * content during the development process.
 *
 * Due to performance reasons it is not a good idea to use this in production.
 *
 * Consider compiling your typescript files to JS instead.
 *
 * @date    2020-02-20
 * @author  Ikaros Kappler
 * @version 1.0.0
 **/


// Prevent plotboilerplate from auto-loading.
globalThis.pbPreventAutoLoad = true;

// This simulates the 'export' and 'require' directives.
// There is no other way than to define these global!
var exports = globalThis.exports = globalThis;
var require = globalThis.require = function(...args) { console.log(args); return globalThis; };

(function() {

    // Start the process when the document is fully loaded.
    globalThis.addEventListener('load', function() {
	var tsRunner = new TSRunner(
	    function(status) {
		console.log(status ? '===> Typescript successfully loaded.' : '===> Error loading typescript.' );
	    },
	    function(status) {
		console.log(status ? '===> Typescript successfully compiled.' : '===> Error compiling typescript.' );
	    },
	    function(status) {
		console.log(status ? '===> Typescript successfully executed.' : '===> Error executing typescript.' );
		loadJSFiles();
		globalThis.initializePB();
	    },
	    true  // concat codes to one single 'file'
	);
	tsRunner.processTypescript();
    } );


    /**
     * This script loads all required javascripts after the typescripts have been 
     * compiled and executed.
     */
    var loadJSFiles = function() {
	var jsSources = [
	    // Place your JS file paths to load here
	    // Example:
	    // "src/js/draw.js"
	];
	var head = document.getElementsByTagName('head')[0];
	var scriptsLoaded = 0;
	for( var i in jsSources ) {
            var scriptNode = document.createElement('script');
            scriptNode.setAttribute('id','js-postloaded-'+i);
	    scriptNode.setAttribute('type','text/javascript');
	    scriptNode.setAttribute('async',false);
	    scriptNode.setAttribute('defer',false);
	    scriptNode.addEventListener('load', function() {
		scriptsLoaded++;
		if( scriptsLoaded == jsSources.length )
		    globalThis.initializePB();
            });
            scriptNode.setAttribute('src',jsSources[i]);
            head.appendChild(scriptNode);      
	}
	
    };

})();
