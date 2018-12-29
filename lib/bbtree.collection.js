/**
 * A simple collection example using the BBTree implementation.
 *
 * @date   2018-12-28
 * @author Ikaros Kappler
 **/

(function(_context) {
    'use strict';

    // +---------------------------------------------------------------------------------
    // | This is a wrapper for the BBTree that adapts the find- and insert-functions
    // | to the usual types.
    // |
    // | Note that the BBTree itself returns tree nodes, not the actually inserted values.
    // +-------------------------------
    var BBTreeCollection = function() {
	var tree = new BBTree();
	var BBTCIterator = function( nodeIterator ) {
	    this.next = function() {
		var nextNode = nodeIterator.next();
		return nextNode ? { key : nextNode.key, value : nextNode.value } : null;
	    };
	};
	this.add = function( k, v ) {
	    var s = tree.size;
	    tree.insert(k,v);
	    return (s!=tree.size);
	};
	this.set = function( k, v ) {
	    var s = tree.size;
	    var node = tree.insert(k,v);
	    if( s==tree.size ) 
		node.value = v;
	};
	this.get = function( k ) {
	    var node = tree.find(k);
	    return node ? node.value : null;
	};
	this.iterator = function() {
	    return new BBTCIterator( tree.iterator() );
	};
	this.size = function() {
	    return tree.size;
	};
	this.toString = function() {
	    return tree.toString();
	};
    };

    _context.BBTreeCollection = BBTreeCollection;

})(typeof module !== 'undefined' ? module.exports : window);

