/**
 * This is the Typescript loader.
 *
 * Each script inside the DOM that has 'language=typescript' will be asynchronously loaded
 * and transpiled.
 *
 * It requires typescriptServices.js and tslib.js to be present.
 *
 * If you want to be called back when all Typescripts have been loaded and transpiled
 * add a function: window.onTypescriptsLoaded(boolean).
 *
 * @author  Ikaros Kappler
 * @date    2020-03-18
 * @version 1.0.0
 **/

(function(_context) {
    
    // Expose the runner to the global context
    _context.TSRunner = _context.TSRunner || function( onTypescriptsLoaded, onTypescriptsCompiled, onTypescriptsExecuted, concatCodes ) {

	// Register a pseudo-hidden global callback.
	// The callback will be appended to the end of the transpiled JS code.
	var callbackName = 'tsRunner_'+Math.floor(Math.random()*65535)+'_callback';
	window[callbackName] = onTypescriptsExecuted;
	
	/**
	 * Request to load the given resource (specified by 'path', relative or absolute)
	 * with an asynchronous XHR request.
	 *
	 * @param {string} path - The resoruce's path. Should be a text file.
	 * @param {function(string)} success - A success callback (accepting the file contents as a string).
	 * @param {function(number)} reject - A failure callback (accepting the error code).
	 * @return {void}
	 **/
	var requestResource = function(path,success,reject) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', path);
	    xhr.onload = function() {
		if (xhr.status === 200) 
		    success(xhr.responseText);
		else 
		    reject(xhr.status);
	    };
	    xhr.send();
	};


	/**
	 * Transpile a batch of loaded Typescript codes.
	 *
	 * Each successfully transpiled code (result is a JS code) will be attached to the 
	 * DOM's header as a <script> tag.
	 *
	 * @param {Array<string>} tsCodes - The actual ts codes in an array.
	 * @param {Array<string>} pathNames - The resource names; used for proper error messages.
	 * @return {number} errorCount
	 **/
	var transpileCodes = function( tsCodes, pathNames ) {
	    const head = document.getElementsByTagName('head')[0];
	    const jsCodes = [];
	    var errorCount = 0;
	    for( var i = 0; i < tsCodes.length; i++ ) {
		try {
		    let jsCode = window.ts.transpile(tsCodes[i]);
		    if( !concatCodes ) {
			var scriptNode = document.createElement('script');
			scriptNode.setAttribute('id','ts-transpiled-'+i);
			scriptNode.innerHTML = jsCode;
			head.appendChild(scriptNode);
			console.log( jsCode );
		    }
		    jsCodes[i] = jsCode;
		} catch( e ) {
		    errorCount++;
		    console.warn("Failed to transpile code "+i+" ("+pathNames[i]+")");
		    console.error(e);
		    onTypescriptsCompiled(false);
		}
	    }

	    onTypescriptsCompiled(true);
	    
	    if( concatCodes ) {
		var scriptNode = document.createElement('script');
		scriptNode.setAttribute('id','ts-transpiled-concat');
		var finalCode =
		    jsCodes.join(' ') +
		    "window."+callbackName+"("+(errorCount==0)+")";
		scriptNode.innerHTML = finalCode;
		head.appendChild(scriptNode);
	    }
	    return errorCount;
	};


	/**
	 * This triggers the process.
	 **/
	this.processTypescript = function() {
	    var scriptNodes = document.querySelectorAll('script[language=typescript]');
	    var resourcesLoaded = 0;
	    var tsCodes = new Array(scriptNodes.length);
	    var pathNames = new Array(scriptNodes.length);
	    var checkComplete = function() { 
		// If all n resources have been loaded, transpile them
		// in exact the original order.
		if( resourcesLoaded == scriptNodes.length ) {
		    var errorCount = transpileCodes( tsCodes, pathNames );
		    if( typeof onTypescriptsLoaded === "function" )
			onTypescriptsLoaded(errorCount==0);
		}
	    };
	    // Handle all typescripts 
	    for( var i = 0; i < scriptNodes.length; i++ ) {
		var src = scriptNodes[i].getAttribute('src');
		if( src == null || typeof src === "undefined" ) {
		    // This is an inline-script
		    pathNames[i] = "[inline]";
		    tsCodes[i] = scriptNodes[i].innerHTML;
		    resourcesLoaded++;
		    checkComplete();
		} else {
		    // This is a remote resource
		    pathNames[i] = src;
		    // Call this inside a closure to avoid collisions.
		    (function(path,index) {
			requestResource( path,
					 function(result) {
					     // Resource has been loaded.
					     tsCodes[index] = result;
					     resourcesLoaded++;
					     checkComplete();
					 },
					 function(errorCode) {
					     console.warn("Failed to load source '"+path+"'. Error code "+errorCode+".")
					 }
				       );
		    })(src,i);
		}
	    }
	}

    }; // END constructor

}(window ? window : module.exports));
