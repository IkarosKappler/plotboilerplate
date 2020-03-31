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
window.pbPreventAutoLoad = true;

// This simulates the 'export' and 'require' directives.
// There is no other way than to define these global!
var exports = window.exports = window;
var require = window.require = function(...args) { console.log(args); return window; };

(function() {

    // Start the process when the document is fully loaded.
    window.addEventListener('load', function() {
	var tsRunner = new TSRunner(
	    function(status) {
		console.log(status ? '===> Typescript successfully loaded.' : '===> Error loading typescript.' );
		loadJSFiles();
		window.initializePB();
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
	    /*
	    "src/js/extend.js",
	    "src/js/SVGBuilder.js",
	    // "src/js/VertexAttr.js",      // already ported to TS 2020-03-23
	    // "src/js/VertexListeners.js", // already ported to TS 2020-03-23
	    // "src/js/Vertex.js",          // already ported to TS 2020-03-20
	    "src/js/Grid.js",
	    // "src/Line.js",            // already ported to TS 2020-03-20
	    "src/js/Vector.js",
	    "src/js/CubicBezierCurve.js",
	    "src/js/BezierPath.js",
	    "src/js/Polygon.js",
	    "src/js/Triangle.js",
	    "src/js/VEllipse.js",
	    "src/js/PBImage.js",
	    
	    "src/js/MouseHandler.js",
	    "src/js/KeyHandler.js",
	    "src/js/draw.js",
	    
	    "src/js/PlotBoilerplate.js",
	    // "demos/gup.js"
	    // "src/index.js"
	    */
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
		// console.log('script loaded');
		scriptsLoaded++;
		if( scriptsLoaded == jsSources.length )
		    window.initializePB();
            });
            scriptNode.setAttribute('src',jsSources[i]);
            head.appendChild(scriptNode);      
	}
	
    };

})();
