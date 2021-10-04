"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFProp = void 0;
/**
 * Internal helper function used to get 'float' properties from elements.
 * Used to determine border withs and paddings that were defined using CSS.
 */
var getFProp = function (elem, propName) {
    return parseFloat(globalThis.getComputedStyle(elem, null).getPropertyValue(propName));
};
exports.getFProp = getFProp;
//# sourceMappingURL=getFProp.js.map