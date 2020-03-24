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

(function() {

    // Start the process when the document is fully loaded.
    window.addEventListener('load', function() {
	var tsRunner = new TSRunner( function(status) {
	    console.log(status ? '===> Typescript successfully loaded.' : '===> Error loading typescript.' );
            loadJSFiles();
	} );
	tsRunner.processTypescript();
    } );


    /**
     * This script loads all required javascripts after the typescripts have been 
     * compiled and executed.
     */
    var loadJSFiles = function() {
	var jsSources = [
	    "src/extend.js",
	    "src/SVGBuilder.js",
	    // "src/VertexAttr.js",      // already ported to TS 2020-03-23
	    // "src/VertexListeners.js", // already ported to TS 2020-03-23
	    // "src/Vertex.js",          // already ported to TS 2020-03-20
	    "src/Grid.js",
	    // "src/Line.js",            // already ported to TS 2020-03-20
	    "src/Vector.js",
	    "src/CubicBezierCurve.js",
	    "src/BezierPath.js",
	    "src/Polygon.js",
	    "src/Triangle.js",
	    "src/VEllipse.js",
	    "src/PBImage.js",
	    
	    "src/MouseHandler.js",
	    "src/KeyHandler.js",
	    "src/draw.js",
	    
	    "src/PlotBoilerplate.js",
	    // "demos/gup.js"
	    // "src/index.js"
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
