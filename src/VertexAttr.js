/**
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-11-17 Added the 'isSelected' attribute.
 * @modified 2018-11-27 Added the global model for instantiating with custom attributes.
 * @version  1.0.2
 **/

(function(_context) {
    "use strict";

    
    // +---------------------------------------------------------------------------------
    // | The constructor.
    // |
    // | Attributes will be initialized as defined in the model object.
    // +----------------------------
    var VertexAttr = function() {
	this.draggable = true;
	this.isSelected = false;

	for( var key in VertexAttr.model ) 
	    this[key] = VertexAttr.model[key];
    };

    // +---------------------------------------------------------------------------------
    // | This is the global attribute model. Set these object on the initialization
    // | of your app to gain all VertexAttr instances have these attributes.
    // |
    // | @type object
    // +----------------------------
    VertexAttr.model = {
	draggable : true,
	isSelected : false,
    };

    // Export constructor to context.
    _context.VertexAttr = VertexAttr;
    
})(window);
