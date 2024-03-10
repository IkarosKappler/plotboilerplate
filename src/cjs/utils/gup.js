"use strict";
/**
 * Ported to typescript.
 * @date 2021-05-21
 * @modified 2024-03-10 Fixed some type for Typescript 5 compatibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gup = void 0;
// Get the URI GET params as an assoc.
//
// A nicer version with regex
// Found at
//    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
var gup = function () {
    var vars = {};
    globalThis.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_m, key, value) {
        return (vars[key] = value);
    });
    return vars;
};
exports.gup = gup;
//# sourceMappingURL=gup.js.map