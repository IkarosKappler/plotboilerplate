"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2021-11-16
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PBText = void 0;
var UIDGenerator_1 = require("./UIDGenerator");
var Vertex_1 = require("./Vertex");
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
var PBText = /** @class */ (function () {
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    function PBText(text, anchor, options) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "PBText";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.text = text;
        this.anchor = anchor !== null && anchor !== void 0 ? anchor : new Vertex_1.Vertex();
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
    PBText.prototype.toSVGString = function (options) {
        console.warn("[PBText.toSVGString()] This function is not implemented as it defines a deprecated method. Use the 'drawutilssvg.text()' method instead.");
        return "";
    };
    return PBText;
}()); // END class
exports.PBText = PBText;
//# sourceMappingURL=PBText.js.map