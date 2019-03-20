/**
 * @classdesc The VertexAttr is a helper class to wrap together additional attributes
 * to vertices that do not belong to the 'standard canonical' vertex implementation.<br>
 * <br>
 * This is some sort of 'userData' object, but the constructor uses a global model
 * to obtain a (configurable) default attribute set to all instances.<br>
 *
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-11-17 Added the 'isSelected' attribute.
 * @modified 2018-11-27 Added the global model for instantiating with custom attributes.
 * @modified 2019-03-20 Added JSDoc tags.
 * @version  1.0.3
 *
 * @file VertexAttr
 * @public
 **/

(function(_context) {
    "use strict";

    
    /**
     * The constructor.
     *
     * Attributes will be initialized as defined in the model object 
     * which serves as a singleton.
     *
     * @constructor
     * @name VertexAttr
     **/
    var VertexAttr = function() {
	this.draggable = true;
	this.isSelected = false;

	for( var key in VertexAttr.model ) 
	    this[key] = VertexAttr.model[key];
    };


    /**
     * This is the global attribute model. Set these object on the initialization
     * of your app to gain all VertexAttr instances have these attributes.
     *
     * @type {object}
     **/
    VertexAttr.model = {
	draggable : true,
	isSelected : false
    };

    // Export constructor to context.
    _context.VertexAttr = VertexAttr;
    
})(window);
