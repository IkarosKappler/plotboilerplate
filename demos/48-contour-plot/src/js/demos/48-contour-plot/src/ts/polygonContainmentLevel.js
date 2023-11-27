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
var PolygonContainmentLevel = /** @class */ (function () {
    function PolygonContainmentLevel(polygons) {
        var _this = this;
        this.unvisitedSet = new Set();
        this.poylgonStatus = polygons.map(function (poly, index) {
            _this.unvisitedSet.add(index);
            return { polygon: poly, polygonIndex: index, isVisited: false, parentPolygon: null, childPolygons: [] };
        });
        this.visitedCount = 0;
    }
    // static?
    PolygonContainmentLevel.prototype.findContainmentTree = function () {
        var count = 0; // Just for safety -> terminate after n polygons were visited
        // First: build mapping to remember all visited polygons
        while (this.visitedCount < this.poylgonStatus.length && count < this.poylgonStatus.length) {
            // Pick a polygon that was not visited yet
            var curPolyIndex = this.locateNonVisitedPolygon();
            if (curPolyIndex == -1) {
                return null; // This should not happen, but better be safe than sorry
            }
            this.processPolygonAt(curPolyIndex);
            count++;
        }
        return this.poylgonStatus;
    };
    PolygonContainmentLevel.prototype.processPolygonAt = function (curPolyIndex) {
        // Check all other polygons if they contain that polygon
        var curPolyStatus = this.poylgonStatus[curPolyIndex];
        // Mark as visited!
        this.markVisited(curPolyStatus.polygonIndex);
        var parentIndex = this.findAnyContainigPoly(curPolyStatus.polygonIndex);
        if (parentIndex == -1) {
            // Huh? meaning? No parent found
        }
        else {
            // We found a parent candidate :)
            var parentPolyStatus = this.poylgonStatus[parentIndex];
            curPolyStatus.parentPolygon = parentPolyStatus;
            // If the found candidate already has ...
            var i = 0;
            // for( var i = 0; i < parentPolyStatus.childPolygons.length; i++ ) {
            while (i < parentPolyStatus.childPolygons.length) {
                if (curPolyStatus.polygon.containsPolygon(parentPolyStatus.childPolygons[i].polygon)) {
                    var tmpChild = parentPolyStatus.childPolygons[i];
                    // Remove child.
                    parentPolyStatus.childPolygons.splice(i, 1);
                    // And add it to ourselves :)
                    curPolyStatus.childPolygons.push(tmpChild);
                    tmpChild.parentPolygon = curPolyStatus;
                }
                else {
                    // Local relation looks good. Just skip this child.
                    i++;
                }
            }
            parentPolyStatus.childPolygons.push(curPolyStatus);
            curPolyStatus.parentPolygon = parentPolyStatus;
            // Note: this relation might not be final if any polygons between are found
        }
    };
    PolygonContainmentLevel.prototype.findAnyContainigPoly = function (polyIndex) {
        var curPolyStatus = this.poylgonStatus[polyIndex];
        var unvisitedIter = this.unvisitedSet.entries();
        var nextEntry;
        while ((nextEntry = unvisitedIter.next())) {
            var tempPolyIndex = nextEntry.value;
            var tempPolyStatus = this.poylgonStatus[tempPolyIndex];
            if (tempPolyStatus.polygon.containsPolygon(curPolyStatus.polygon)) {
                return tempPolyIndex;
            }
        }
        return -1;
    };
    PolygonContainmentLevel.prototype.markVisited = function (polyIndex) {
        this.unvisitedSet.delete(polyIndex);
        this.visitedCount++;
    };
    PolygonContainmentLevel.prototype.locateNonVisitedPolygon = function () {
        if (this.unvisitedSet.size == 0) {
            return -1;
        }
        return this.unvisitedSet.entries().next().value;
    };
    return PolygonContainmentLevel;
}());
exports.PolygonContainmentLevel = PolygonContainmentLevel;
//# sourceMappingURL=polygonContainmentLevel.js.map