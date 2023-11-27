"use strict";
/**
 * Idea:
 * 1) Find all polygons on the 'lowest' level, that do not contain any others.
 * 2) Cross them out.
 *    They are on level 0.
 * 3) Then find those which contain these and only these.
 * 4) Cross those out, too.
 * 5) They are one level above.
 * 6) Continue recursively with step 3 until none are left. This is the upper level.
 *
 *
 * @author  Ikaros Kappler
 * @date    2023-11-24
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonContainmentLevel = void 0;
// (function (_context) {
//     var polygonContainmentLevel = function (polygons) {
//       // ...
//     };
//     var findContainmentTree = function(polygons) {
//       // First: create
//     };
//     _context.polygonContainmentLevel = polygonContainmentLevel;
//   })(globalThis);
var PolygonContainmentLevel = /** @class */ (function () {
    function PolygonContainmentLevel() {
    }
    return PolygonContainmentLevel;
}());
exports.PolygonContainmentLevel = PolygonContainmentLevel;
//# sourceMappingURL=polygonContainmentLevel.js.map