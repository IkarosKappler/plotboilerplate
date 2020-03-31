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
 * @modified 2020-02-29 Added the 'selectable' attribute.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @version  1.1.1
 *
 * @file VertexAttr
 * @public
 **/
export interface IVertexAttr {
    draggable: boolean;
    selectable: boolean;
    isSelected: boolean;
    bezierAutoAdjust?: boolean;
    renderTime?: number;
}
export declare class VertexAttr implements IVertexAttr {
    /**
     * @member {VertexAttr}
     * @memberof VertexAttr
     * @instance
     */
    draggable: boolean;
    /**
     * @member {VertexAttr}
     * @memberof VertexAttr
     * @instance
     */
    selectable: boolean;
    /**
     * @member {VertexAttr}
     * @memberof VertexAttr
     * @instance
     */
    isSelected: boolean;
    /**
     * The constructor.
     *
     * Attributes will be initialized as defined in the model object
     * which serves as a singleton.
     *
     * @constructor
     * @name VertexAttr
     **/
    constructor();
    /**
     * This is the global attribute model. Set these object on the initialization
     * of your app to gain all VertexAttr instances have these attributes.
     *
     * @type {object}
     **/
    static model: IVertexAttr;
}
