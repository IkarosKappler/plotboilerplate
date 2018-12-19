// Original implementation (basically a demo/test class) found at
//    https://github.com/mourner/bbtree
//
// I just added a closure and a utility function to iterate over the set.
// Added a parent attribute to the Node class.
// 2018-12-18 Ikaros Kappler

(function(_context) {
    'use strict';

    function Node(key, value, level, left, right) {
	this.key = key;
	this.value = value;

	this.level = level;
	this.left = left;
	this.right = right;

	this.parent = null;
    }

    Node.prototype.leftest = function() {
	var node = this;
	while( node.left && node.left != bottom )
	    node = node.left;
	return node;
    };

    Node.prototype.toString = function() {
	var str = '';
	if( this.left != bottom )
	    str += '['+this.left.toString() + '],';
	str += this.key;
	if( this.right != bottom )
	    str += ',['+this.right.toString()+']';

	if( this.left != bottom && this.left.parent != this )
	    throw "LEFT ERROR";
	if( this.right != bottom && this.right.parent != this )
	    throw "RIGHT ERROR";
	
	return str;
    };

    /*
    Node.prototype.toPrefixString = function( indent ) {
	indent = indent || '';
	var str = indent;
	str += this.key+'<br>';
	if( this.left != bottom )
	    str += indent+' '+this.left.toPrefixString(indent+'  ') + '<br>';
	if( this.right != bottom )
	    str += indent+' '+this.right.toPrefixString(indent+'  ')+'<br>';

	if( this.left != bottom && this.left.parent != this )
	    throw "LEFT ERROR";
	if( this.right != bottom && this.right.parent != this )
	    throw "RIGHT ERROR";
	
	return str;
    };
    */

    function Iterator(compareFn,leftest) {
	this.current = leftest.leftest();
	this.last = null;
	this.lastMax = null;
	
	this.next = function() {
	    if( !this.current || this.current == bottom )
		return null;
	    var node = this.current;

	    if( !this.last ) {
		console.log('[iter] last=null (init)');
		this.current = this.current.parent;
	    } else {
		var c = compareFn(this.last.key,this.current.key);
		console.log('compare(last=',this.last.key,this.current.key,')=',c,'right=',this.current.right.key);
		if( c <= 0 && this.current.right != bottom ) {
		    console.log('[iter] last<=current and right exists');
		    this.current = this.current.right.leftest();
		    if( c == 0 )
			node = this.current;
		} else if( compareFn(this.last.key,this.current.key) >= 0 ) {
		    while( compareFn(this.last.key,this.current.key) >= 0 && this.current.parent ) {
			console.log('[iter] last>current ... going up. parent='+this.current.parent.key );
			this.current = this.current.parent;
			console.log('compare(',this.last.key,this.current.key,')=',compareFn(this.last.key,this.current.key));
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

    function newNode(key, value) {
	return new Node(key, value, 1, bottom, bottom);
    }

    function BBTree(compareFn) {
	this._compare = compareFn || defaultCompare;
	this._path = [];
	this.root = null;
	this.size = 0;
    }

    BBTree.prototype.find = function (key) {
	    // EDIT Ika, 2018-12-10
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
		this.root = newNode(key, value);
		this.size++;
		return this;
            }

            var k = 0;
            while (true) {
		var c = compare(key, node.key);
		if( !c ) return this; // No duplicates allowed
		path[k] = node;
		k++;
		if (c < 0) {
                    if (node.left === bottom) {
			node.left = newNode(key, value);
			node.left.parent = node;
			this.size++;
			break;
		    }
                    node = node.left;
		} else {
                    if (node.right === bottom) {
			node.right = newNode(key, value);
			node.right.parent = node;
			this.size++;
			break;
		    }
                    node = node.right;
		}
            }
            this._rebalance(path, k);
            return this;
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
			parent.left.parent = parent; // !!! new
		    } else {
			parent.right = rotated;	
			parent.right.parent = parent; // !!! new
		    }
		    // node.parent = path[i-1]; // !!! new
		    // node.left.left.parent = node.left; // !!! new
		    // node.left.right.parent = node.left; // !!! new
		    node.left.parent = node; // !!! new
		    node.right.parent = node; // !!! new
		    // node.right.left.parent = node.right; // !!! new
		    // node.right.right.parent = node.right; // !!! new
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

    /*BBTree.prototype.toPrefixString = function() {
	return (this.root ? this.root.toPrefixString('') : '');
    };*/

    function defaultCompare(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
    }

    function skew(node) {
	if (node.left.level === node.level) {
            var temp = node;
	    //node.parent = node.left; // !!! new
            node = node.left;
            temp.left = node.right;
            node.right = temp;
	    node.right.parent = node; // !!! new
	    temp.left.parent = temp; // !! new
	    
	}
	return node;
    }

    function split(node) {
	if (node.right.right.level === node.level) {
            var temp = node;
	    //node.parent = node.right; // !!! new
            node = node.right;
            temp.right = node.left;
            node.left = temp;
            node.level++;
	    temp.right.parent = temp; // !!! new
	    node.left.parent = node; // !! new
	}
	return node;
    }

    _context.BBTree = BBTree;

})(typeof module !== 'undefined' ? module : window);
