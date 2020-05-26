"use strict";
/**
 * @classdesc A bounds class with min and max values.
 *
 * @requires XYCoords, Vertex, IBounds
 *
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @version  1.0.0
 *
 * @file Bopunds
 * @fileoverview A simple bounds class implementing IBounds.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Bounds
     * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
     **/
    function Bounds(min, max) {
        this.min = min;
        this.max = max;
        this.width = max.x - min.x;
        this.height = max.y - min.y;
    }
    ;
    return Bounds;
}()); // END class bounds
exports.Bounds = Bounds;
//# sourceMappingURL=Bounds.js.map