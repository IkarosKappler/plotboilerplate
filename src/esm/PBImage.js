/**
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `PBImage.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @version 1.2.0
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/
import { UIDGenerator } from "./UIDGenerator";
/**
 * @classdesc A wrapper for image objects. Has an upper left and a lower right corner point.
 *
 * @requires Vertex
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 */
export class PBImage {
    /**
     * The constructor.
     *
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    constructor(image, upperLeft, lowerRight) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "PBImage";
        this.uid = UIDGenerator.next();
        this.image = image;
        this.upperLeft = upperLeft;
        this.lowerRight = lowerRight;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.upperLeft.destroy();
        this.lowerRight.destroy();
        this.isDestroyed = true;
    }
}
//# sourceMappingURL=PBImage.js.map