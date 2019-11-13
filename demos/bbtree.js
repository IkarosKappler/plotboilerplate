/**
 * A simple balanced binary search-tree class I adapted from an implementation
 * by https://github.com/mourner.
 *
 *
 * Original implementation (basically a demo/test class) found at
 *    https://github.com/mourner/bbtree
 *
 *
 * I just added a closure and a utility function to iterate over the set.
 * Added a parent attribute to the Node class for the iterator to traverse
 * up and down inside the tree.
 *
 *
 * @date 2018-12-18 
 *   edited by Ikaros Kappler
 **/

(function(_context) {
    'use strict';

    function Node(key, value, level, left, right) {
	this.key = key;
	this.value = value;
	this.level = level || 1;
	this.left = left || bottom;
	this.right = right || bottom;
	this.parent = null;
    }

    Node.prototype.isLeaf = function() { 
	return this.left.isNull() && this.right.isNull();
    };

    Node.prototype.isNull = function() {
	return this==bottom;
    };
    
    Node.prototype.leftest = function() {
	var node = this;
	while( node.left && node.left != bottom )
	    node = node.left;
	return node;
    };

    Node.prototype.toString = function() {
	var str = '';
	if( this.left != bottom )
	    str += this.left.toString()+',';
	str += this.key;
	if( this.right != bottom )
	    str += ','+this.right.toString();	
	return str;
    };

    function Iterator(compareFn,leftest) {
	this.current = leftest.leftest();
	this.last = null;

	// Based on the current value and the last visited value
	// the direction for further traversion is clear.
	this.next = function() {
	    if( !this.current || this.current == bottom )
		return null;
	    var node = this.current;

	    if( !this.last ) {
		this.current = this.current.parent;
	    } else {
		var c = compareFn(this.last.key,this.current.key);
		if( c <= 0 && this.current.right != bottom ) {
		    this.current = this.current.right.leftest();
		    if( c == 0 )
			node = this.current;
		} else if( c >= 0 ) {
		    while( (c = compareFn(this.last.key,this.current.key)) >= 0 && this.current.parent ) {
			this.current = this.current.parent;
		    }
		    node = this.current;
		} else {
		    this.current = this.current.parent;
		}
	    }
	    this.last = node;
	    return node;
	};
    }

    // Define a sentinel for leaf nodes.
    var bottom = new Node(null, null, 0);
    bottom.left = bottom;
    bottom.right = bottom;


    // +---------------------------------------------------------------------------------
    // | The constructor.
    // |
    // | @param compareFn:function(a,b) (optional) A comparator function that defines the key order.
    // +-------------------------------
    function BBTree(compareFn) {
	this._compare = compareFn || defaultCompare;
	this._path = [];
	this.root = null;
	this.size = 0;
    }

    BBTree.prototype.find = function (key) {
	// The old implementation failed at this point when
	// searching on empty trees.
	if( !this.root ) 
	    return null;
        var node = this.root,
	    compare = this._compare;
	
        while (node !== bottom) {
	    var c = compare(key, node.key);
	    if (c === 0) return node;
	    node = c < 0 ? node.left : node.right;
        }
        return null;
    };

    BBTree.prototype.insert = function (key, value) {

        var compare = this._compare,
	    node = this.root,
	    path = this._path;

        if (!node) {
	    this.root = new Node(key, value);
	    this.size++;
	    return this.root;
        }

        var k = 0;
        while (true) {
	    var c = compare(key, node.key);
	    if( !c ) return node; // No duplicates allowed
	    path[k] = node;
	    k++;
	    if (c < 0) {
                if (node.left === bottom) {
		    node.left = new Node(key, value);
		    node.left.parent = node;
		    this.size++;
		    break;
		}
                node = node.left;
	    } else {
                if (node.right === bottom) {
		    node.right = new Node(key, value);
		    node.right.parent = node;
		    this.size++;
		    break;
		}
                node = node.right;
	    }
        }
        this._rebalance(path, k);
        return node;
    };

    BBTree.prototype._rebalance = function (path, k) {

        var rotated, node, parent, updated, m = 0;

        for (var i = k - 1; i >= 0; i--) {
	    rotated = node = path[i];

	    if (node.level === node.left.level && node.level === node.right.level) {
                updated = true;
                node.level++;

	    } else {
                rotated = skew(node);
                rotated = split(rotated);
	    }

	    if (rotated !== node) {
                updated = true;
                if (i) {
		    parent = path[i - 1];
		    if (parent.left === node) {
			parent.left = rotated;
			parent.left.parent = parent;
		    } else {
			parent.right = rotated;	
			parent.right.parent = parent;
		    }
		    node.left.parent = node;
		    node.right.parent = node;
                } else {
		    this.root = rotated;
		    this.root.parent = null;
		    this.root.left.parent = this.root;
		    this.root.right.parent = this.root;
		}
	    }
	    if (!updated) m++;
	    if (m === 2) break;
        }
    };

    BBTree.prototype.iterator = function() {
	return new Iterator(this._compare, this.root ? this.root.leftest() : null );
    };

    BBTree.prototype.toString = function() {
	return '[' + (this.root ? this.root.toString() : '') + ']';
    };

    function defaultCompare(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
    }

    function skew(node) {
	if (node.left.level === node.level) {
            var temp = node;
            node = node.left;
            temp.left = node.right;
            node.right = temp;
	    node.right.parent = node;
	    temp.left.parent = temp;
	    
	}
	return node;
    }

    function split(node) {
	if (node.right.right.level === node.level) {
            var temp = node;
            node = node.right;
            temp.right = node.left;
            node.left = temp;
            node.level++;
	    temp.right.parent = temp;
	    node.left.parent = node;
	}
	return node;
    }
    
    _context.BBTree = BBTree;

})(typeof module !== 'undefined' ? module.exports : window);


