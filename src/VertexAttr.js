/**
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-11-17 Added the 'isSelected' attribute.
 * @version  1.0.1
 **/

(function(_context) {
    "use strict";

    var VertexAttr = function() {
	this.draggable = true;
	this.isSelected = false;
    };

    // Export constructor to context.
    _context.VertexAttr = VertexAttr;
    
})(window);
