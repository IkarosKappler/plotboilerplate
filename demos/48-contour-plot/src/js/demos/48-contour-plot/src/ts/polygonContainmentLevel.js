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
var matrixFill_1 = require("../../../../src/ts/utils/algorithms/matrixFill");
var PolygonContainmentLevel = /** @class */ (function () {
    function PolygonContainmentLevel(polygons) {
        var _this = this;
        this.unvisitedSet = new Set();
        this.poylgonStatus = polygons.map(function (poly, index) {
            _this.unvisitedSet.add(index);
            return { polygon: poly, polygonIndex: index, isVisited: false, parentPolygon: null, children: [] };
        });
        this.containmentMatrix = matrixFill_1.matrixFill(polygons.length, polygons.length, false);
        this.visitedCount = 0;
    }
    /**
     * This method expects to be one great parent polyon to be present.
     * If it's not present please create it.
     *
     * @returns
     */
    PolygonContainmentLevel.prototype.findContainmentTree = function () {
        this.buildContainmentMatrix();
        var count = 0; // Just for safety -> terminate after n polygons were visited
        // First: build mapping to remember all visited polygons
        while (this.visitedCount < this.poylgonStatus.length && count < this.poylgonStatus.length) {
            // Pick a polygon that was not visited yet
            var curPolyIndex = this.locateNonVisitedPolygon();
            // console.log("Next unvisited polygon", curPolyIndex);
            if (curPolyIndex == -1) {
                return null; // This should not happen, but better be safe than sorry
            }
            this.processPolygonAt(curPolyIndex);
            count++;
        }
        return this.poylgonStatus;
    };
    PolygonContainmentLevel.prototype.buildContainmentMatrix = function () {
        for (var i = 0; i < this.containmentMatrix.length; i++) {
            var polyStatI = this.poylgonStatus[i];
            // It's a square matrix
            for (var j = 0; j < this.containmentMatrix.length; j++) {
                var polyStatJ = this.poylgonStatus[j];
                if (polyStatI.polygon.containsPolygon(polyStatJ.polygon)) {
                    this.containmentMatrix[i][j] = true;
                }
            }
        }
    };
    PolygonContainmentLevel.prototype.processPolygonAt = function (curPolyIndex) {
        // console.log("processPolygonAt curPolyIndex", curPolyIndex);
        // Check all other polygons if they contain that polygon
        var curPolyStatus = this.poylgonStatus[curPolyIndex];
        // Mark as visited!
        this.markVisited(curPolyIndex); // curPolyStatus.polygonIndex);
        var parentIndex = this.findMinContainigPoly(curPolyStatus.polygonIndex);
        if (parentIndex == -1) {
            // Huh? meaning? No parent found
            // console.log("No parent polygon found.", curPolyIndex);
        }
        else {
            // console.log("Parent polygon for " + curPolyIndex + " found.", parentIndex);
            // We found a parent candidate :)
            var parentPolyStatus = this.poylgonStatus[parentIndex];
            // If the found candidate already has ...
            var i = 0;
            parentPolyStatus.children.push(curPolyStatus);
            curPolyStatus.parentPolygon = parentPolyStatus;
            // Note: this relation might not be final if any polygons between are found
        }
    };
    PolygonContainmentLevel.prototype.findMinContainigPoly = function (polyIndex) {
        var minIndex = this.findAnyContainigPoly(polyIndex);
        for (var i = 0; i < this.poylgonStatus.length; i++) {
            if (i == polyIndex) {
                continue;
            }
            if (this.containsPoly(i, polyIndex) && this.containsPoly(minIndex, i)) {
                minIndex = i;
            }
        }
        return minIndex;
    };
    PolygonContainmentLevel.prototype.findAnyContainigPoly = function (polyIndex) {
        // const curPolyStatus = this.poylgonStatus[polyIndex];
        for (var tempPolyIndex = 0; tempPolyIndex < this.poylgonStatus.length; tempPolyIndex++) {
            if (polyIndex == tempPolyIndex) {
                continue;
            }
            if (this.containmentMatrix[tempPolyIndex][polyIndex]) {
                // console.log("Contains!", tempPolyIndex, "contains", polyIndex);
                return tempPolyIndex;
            }
            else {
                // console.log("Does not contain.", tempPolyIndex, polyIndex);
            }
        }
        return -1;
    };
    PolygonContainmentLevel.prototype.containsPoly = function (indexA, indexB) {
        return this.containmentMatrix[indexA][indexB];
    };
    PolygonContainmentLevel.prototype.markVisited = function (polyIndex) {
        this.unvisitedSet.delete(polyIndex);
        this.poylgonStatus[polyIndex].isVisited = true;
        this.visitedCount++;
    };
    PolygonContainmentLevel.prototype.locateNonVisitedPolygon = function () {
        if (this.unvisitedSet.size == 0) {
            return -1;
        }
        return this.unvisitedSet.entries().next().value[1];
    };
    PolygonContainmentLevel.prototype.toString = function () {
        var buffer = [];
        this.toStringBuffer(buffer);
        return buffer.join("\n");
    };
    PolygonContainmentLevel.prototype.toStringBuffer = function (buffer) {
        for (var curIndex = 0; curIndex < this.poylgonStatus.length; curIndex++) {
            buffer.push(curIndex + " children: " + this.poylgonStatus[curIndex].children
                .map(function (child) {
                return child.polygonIndex;
            })
                .join(", "));
        }
    };
    return PolygonContainmentLevel;
}());
exports.PolygonContainmentLevel = PolygonContainmentLevel;
//# sourceMappingURL=polygonContainmentLevel.js.map