"use strict";
/**
 * Wraps a Record<string,string> and adds type conversion methods (developed this in
 * some other project) and added this here (2023-10-28).
 *
 * @author   Ikars Kappler
 * @version  1.0.0
 * @date     2023-03-13
 * @modified 2024-08-26 Added the `hasParam` method.
 * @modified 2026-05-22 Added the `isValueAllowed` function param to the getter methods.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = void 0;
var Params = /** @class */ (function () {
    function Params(baseParams) {
        this.baseParams = baseParams;
    }
    Params.prototype.hasParam = function (name) {
        return this.baseParams.hasOwnProperty(name);
    };
    Params.prototype.getString = function (name, fallback, isValueAllowed) {
        var value = this.baseParams[name];
        if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
            return fallback;
        }
        if (isValueAllowed && !isValueAllowed(value)) {
            return fallback;
        }
        return value;
    };
    Params.prototype.getNumber = function (name, fallback, isValueAllowed) {
        var value = this.baseParams[name];
        if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
            return fallback;
        }
        var numericValue = Number(value);
        if (isValueAllowed && !isValueAllowed(numericValue)) {
            return fallback;
        }
        return numericValue;
    };
    Params.prototype.getBoolean = function (name, fallback) {
        var value = this.baseParams[name];
        if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
            return fallback;
        }
        value = value.toLocaleLowerCase();
        if (value === "1" || value === "on" || value === "yes" || value === "y" || value === "hi" || value == "high") {
            return true;
        }
        else if (value === "0" || value === "off" || value === "no" || value === "n" || value === "lo" || value == "low") {
            return false;
        }
        else {
            return Boolean(value);
        }
    };
    return Params;
}());
exports.Params = Params;
//# sourceMappingURL=Params.js.map