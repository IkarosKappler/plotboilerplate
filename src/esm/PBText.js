/**
 * @author   Ikaros Kappler
 * @date     2021-11-16
 * @modified 2022-02-02 Added the `destroy` method.
 * @version  1.1.0
 **/
import { UIDGenerator } from "./UIDGenerator";
import { Vertex } from "./Vertex";
/**
 * @classdesc A simple text element: position, fontSize, fontFamily, color, textAlign, lineHeight and rotation.
 *
 * @requires FontOptions
 * @requires FontSize
 * @requires FontStyle
 * @requires FontWeight
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export class PBText {
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(text, anchor, options) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "PBText";
        this.uid = UIDGenerator.next();
        this.text = text;
        this.anchor = anchor !== null && anchor !== void 0 ? anchor : new Vertex();
        this.color = options.color;
        this.fontFamily = options.fontFamily;
        this.fontSize = options.fontSize;
        this.fontStyle = options.fontStyle;
        this.fontWeight = options.fontWeight;
        this.lineHeight = options.lineHeight;
        this.textAlign = options.textAlign;
        this.rotation = options.rotation;
    }
    /**
     * Create an SVG representation of this circle.
     *
     * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Circle
     */
    toSVGString(options) {
        console.warn("[PBText.toSVGString()] This function is not implemented as it defines a deprecated method. Use the 'drawutilssvg.text()' method instead.");
        return "";
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.anchor.destroy();
        this.isDestroyed = true;
    }
} // END class
//# sourceMappingURL=PBText.js.map