"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2021-11-16
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2023-09-25 Fixed a type error in the constructor. Nothing vital.
 * @version  1.1.1
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
        this.color = options === null || options === void 0 ? void 0 : options.color;
        this.fontFamily = options === null || options === void 0 ? void 0 : options.fontFamily;
        this.fontSize = options === null || options === void 0 ? void 0 : options.fontSize;
        this.fontStyle = options === null || options === void 0 ? void 0 : options.fontStyle;
        this.fontWeight = options === null || options === void 0 ? void 0 : options.fontWeight;
        this.lineHeight = options === null || options === void 0 ? void 0 : options.lineHeight;
        this.textAlign = options === null || options === void 0 ? void 0 : options.textAlign;
        this.rotation = options === null || options === void 0 ? void 0 : options.rotation;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    PBText.prototype.destroy = function () {
        this.anchor.destroy();
        this.isDestroyed = true;
    };
    return PBText;
}()); // END class
exports.PBText = PBText;
//# sourceMappingURL=PBText.js.map