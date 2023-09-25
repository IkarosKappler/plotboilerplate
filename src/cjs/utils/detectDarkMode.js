"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2021-11-07
 * @modified 2023-09-25 Ported to Typescript and added system darkmode detection.
 * @version 1.1.0
 *
 * @param {Record<string,string>} GUP
 * @returns {boolean}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDarkMode = void 0;
var PlotBoilerplate_1 = require("../PlotBoilerplate");
var detectDarkMode = function (GUP) {
    // Respect overrides
    if (typeof GUP !== "undefined" && GUP.hasOwnProperty("darkmode") && GUP["darkmode"]) {
        var overrideValue = PlotBoilerplate_1.default.utils.fetch.bool(GUP, "darkmode", null);
        if (overrideValue !== null) {
            return overrideValue;
        }
    }
    if (globalThis.matchMedia && globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
        // dark mode by system
        return true;
    }
    // else: dark mode by daytime
    var hours = new Date().getHours();
    var isDayTime = hours > 6 && hours < 18;
    return !isDayTime;
};
exports.detectDarkMode = detectDarkMode;
//# sourceMappingURL=detectDarkMode.js.map