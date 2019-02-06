// A helper function for a simple class inheritance.

Object.extendClass = function( superClass, subClass ) {
    // Copy class functions/attributes.
    var propNames = Object.getOwnPropertyNames(superClass.prototype);
    for( var i in propNames ) {
	var e = propNames[i];
	// console.log(e);
	if( superClass.prototype.hasOwnProperty(e) && e !== Object.extendClass )
	    subClass.prototype[e] = superClass.prototype[e]; 
    }
};
