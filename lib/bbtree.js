// Original implementation (basically a demo/test class) found at
//    https://github.com/mourner/bbtree
//
// I just added a closure and some utility functions.
// 2018-12-18 Ikaros Kappler

(function(_context) {
    'use strict';

    function Node(key, value, level, left, right) {
	this.key = key;
	this.value = value;

	this.level = level;
	this.left = left;
	this.right = right;
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
		return this;
            }

            var k = 0;

            while (true) {
		var c = compare(key, node.key);
		if (!c) return this;

		path[k] = node;
		k++;

		if (c < 0) {
                    if (node.left === bottom) { node.left = newNode(key, value); break; }
                    node = node.left;

		} else {
                    if (node.right === bottom) { node.right = newNode(key, value); break; }
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
		    if (parent.left === node) parent.left = rotated;
		    else parent.right = rotated;

                } else this.root = rotated;
	    }
	    if (!updated) m++;
	    if (m === 2) break;
        }
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
	}
	return node;
    }

    _context.BBTree = BBTree;

})(typeof module !== 'undefined' ? module : window);
