/**
 * @classdesc A wrapper for image objects.
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version 1.0.2
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/
var PBImage = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    function PBImage(image, upperLeft, lowerRight) {
        /* if( typeof image == 'undefined' )
            throw Error('image must not be null.');
        if( typeof upperLeft == 'undefined' )
            throw Error('upperLeft must not be null.');
        if( typeof lowerRight == 'undefined' )
            throw Error('lowerRight must not be null.'); */
        this.image = image;
        this.upperLeft = upperLeft;
        this.lowerRight = lowerRight;
    }
    ;
    // Implement SVGSerializable
    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Vertex
     **/
    PBImage.prototype.toSVGString = function (options) {
        console.warn("PBImage is not yet SVG serializable. Returning empty SVG string.");
        return "";
    };
    ;
    return PBImage;
}());
//# sourceMappingURL=PBImage.js.map