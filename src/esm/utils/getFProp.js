/**
 * Internal helper function used to get 'float' properties from elements.
 * Used to determine border withs and paddings that were defined using CSS.
 */
export const getFProp = (elem, propName) => {
    return parseFloat(globalThis.getComputedStyle(elem, null).getPropertyValue(propName));
};
//# sourceMappingURL=getFProp.js.map