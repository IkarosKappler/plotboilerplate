/**
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-11-17 Added the 'isSelected' attribute.
 * @modified 2018-11-27 Added the global model for instantiating with custom attributes.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2020-02-29 Added the 'selectable' attribute.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2024-03-10 Fixed some types for Typescript 5 compatibility.
 * @version  1.1.2
 *
 * @file VertexAttr
 * @public
 **/
/**
 * @classdesc The VertexAttr is a helper class to wrap together additional attributes
 * to vertices that do not belong to the 'standard canonical' vertex implementation.<br>
 * <br>
 * This is some sort of 'userData' object, but the constructor uses a global model
 * to obtain a (configurable) default attribute set to all instances.<br>
 */
export class VertexAttr {
    /**
     * The constructor.
     *
     * Attributes will be initialized as defined in the model object
     * which serves as a singleton.
     *
     * @constructor
     * @name VertexAttr
     **/
    constructor() {
        this.draggable = true;
        this.selectable = true;
        this.isSelected = false;
        this.visible = true;
        for (var key in VertexAttr.model)
            this[key] = VertexAttr.model[key];
    }
    ;
}
/**
 * This is the global attribute model. Set these object on the initialization
 * of your app to gain all VertexAttr instances have these attributes.
 *
 * @type {object}
 **/
VertexAttr.model = {
    draggable: true,
    selectable: true,
    isSelected: false,
    visible: true
};
//# sourceMappingURL=VertexAttr.js.map