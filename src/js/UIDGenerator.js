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
class UIDGenerator {
    static next() { return `${UIDGenerator.current++}`; }
    ;
}
exports.UIDGenerator = UIDGenerator;
UIDGenerator.current = 0;
;
//# sourceMappingURL=UIDGenerator.js.map