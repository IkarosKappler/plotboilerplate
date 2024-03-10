"use strict";
/**
 * @classdesc A static UIDGenerator.
 *
 * @author  Ikaros Kappler
 * @date    2021-01-20
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIDGenerator = void 0;
var UIDGenerator = /** @class */ (function () {
    function UIDGenerator() {
    }
    UIDGenerator.next = function () {
        return "".concat(UIDGenerator.current++);
    };
    UIDGenerator.current = 0;
    return UIDGenerator;
}());
exports.UIDGenerator = UIDGenerator;
//# sourceMappingURL=UIDGenerator.js.map