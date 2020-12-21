/**
 * Not working with IEx. Use a 'Proxy' polyfill maybe?
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * @date 2020-12-20
 */

(function(_context) {

    // @param {object} observee
    // @param {Object} keyToObserve (string->Object with props)
    var LiveStats = function( observee, keysToObserve ) {

	// @member {Object}
	this.keyProps = {};

	this.keyCount = 0;
	
	this.observee = observee;

	this.root = document.createElement('div');
	// this.root.style.position = 'absolute';
	// this.root.style.left = 0;
	// this.root.style.top = 0;
	// this.root.style.width = '200px';
	// this.root.style.height = '' + (20*keysToObserve.length) + 'px';
	// this.root.style.background = 'rgba(255,255,255,0.95)';
	
	document.body.appendChild( this.root );

	// var keyMapping = {};

	var keySet = Object.keys( keysToObserve );
	console.log( 'keySet', keySet );
	// for( var i in keysToObserve ) {
	for( var i in keySet ) { // keysToObserve ) {
	    var keyName = keySet[i]; // keysToObserve[i];
	    var keyProps = keysToObserve[ keyName ];
	    /* var id = keyName + "_" + Math.floor( Math.random() * 65636 );
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

	    keyMapping[keyName] = id; */

	    this.add( keyName, keyProps );
	};
	this.applyLayout();

	var _self = this;
	var proxyHandler = {
	    // get: function(target, prop, receiver) {
	    //    if( prop === 'message' )
	    //       return "...";
	    // }, 
	    set: function(obj, propName, value) {
		// console.log( 'set function', obj, prop, value );
		if( propName  === 'message' ) {
		    console.log('new value: ' + value);
		    // document.getElementById('output').innerHTML = value;
		}
		var kProps = _self.keyProps[propName];
		if( typeof kProps === "undefined" )
		    return false; // Indicates no change
		// document.getElementById(kProps.id).innerHTML = value;
		_self._applyKeyValue( propName, kProps, value );
		return true; // Indicates success
	    }
	};
	return new Proxy( observee, proxyHandler );

    };

    // @private
    LiveStats.prototype._applyKeyValue = function( keyName, kProps, value ) {
	if( kProps.hasOwnProperty('precision') ) {
	    // console.log( 'prcision', kProps.precision );
	    value = Number(value).toFixed( kProps.precision );
	}
	document.getElementById(kProps.id).innerHTML = value;
    };

    LiveStats.prototype.add = function( keyName, keyProps ) {
	console.log('keyName', keyName, keyProps );
	var id = keyName + "_" + Math.floor( Math.random() * 65636 );
	var node = document.createElement('div');
	var label = document.createElement('div');
	var content = document.createElement('div');
	node.style.display = 'flex';
	label.style.width = '50%';
	content.style.width = '50%';
	label.innerHTML = keyName;
	// content.innerHTML = this.observee[keyName];
	content.setAttribute('id', id);
	node.appendChild( label );
	node.appendChild( content );
	this.root.appendChild( node );

	this.keyProps[keyName] = Object.assign( { id : id }, keyProps );
	this.keyCount++;

	this._applyKeyValue( keyName, this.keyProps[keyName], this.observee[keyName] );
    };

    LiveStats.prototype.applyLayout = function() {
	this.root.style.position = 'absolute';
	this.root.style.left = 0;
	this.root.style.top = 0;
	this.root.style.width = '200px';
	this.root.style.height = '' + (20*this.keyCount) + 'px';
	this.root.style.background = 'rgba(255,255,255,0.95)';
    };

    _context.LiveStats = LiveStats;

})(globalThis || window);
