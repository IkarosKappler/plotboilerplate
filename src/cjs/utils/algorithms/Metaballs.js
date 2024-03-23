"use strict";
/**
 * Algorithm:
 *  Input Circles
 *      -> filter out fully contained circles
 *      -> build outer containing circles (given by detect radius)
 *      -> find radical lines
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2024-03-01
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metaballs = void 0;
var Circle_1 = require("../../Circle");
var CircleIntersections_1 = require("./CircleIntersections");
var Metaballs = /** @class */ (function () {
    function Metaballs(inputCircles) {
        this.circleIsFullyContained = []; // Array<boolean>
        this.inputCircles = [];
        this.circlesOfInterest = [];
        this.containingCircles = [];
        // Array< { baseCircleIndexA, baseCircleIndexB,
        //          baseCircleA, baseCircleB,
        //          circleA, circleB,
        //          inverseCircleA, inverseCircleB,
        //          doIntersect, circlePointsA:[], circlePointsB:[] } >
        this.inverseCirclesPairs = [];
        this.inputCircles = inputCircles;
    }
    Metaballs.prototype.rebuild = function (options) {
        this.detectContainmentStatus();
        this.rebuildContainingCircles(options);
        this.inverseCirclesPairs = [];
        var radicalLineMatrix = CircleIntersections_1.CircleIntersections.buildRadicalLineMatrix(this.containingCircles);
        for (var i = 0; i < this.containingCircles.length; i++) {
            var circleA = this.containingCircles[i];
            var centerCircleA = this.circlesOfInterest[i];
            for (var j = i + 1; j < this.containingCircles.length; j++) {
                var radicalLine = radicalLineMatrix[i][j];
                if (radicalLine == null) {
                    // The two circles do not have an intersection.
                    // console.log("Circles", i, j, "do not have any intersections");
                    continue;
                }
                var circleB = this.containingCircles[j];
                var centerCircleB = this.circlesOfInterest[j];
                // But if they have -> compute. outer circle(s).
                // They are symmetrical.
                var inverseCircle1 = new Circle_1.Circle(radicalLine.a, options.metaRadiusAddon);
                var inverseCircle2 = new Circle_1.Circle(radicalLine.b, options.metaRadiusAddon);
                var doIntersect = inverseCircle1.circleIntersection(inverseCircle2) != null;
                // console.log("doIntersect", doIntersect);
                // Now find the intersection points between inner and outer circles.
                // We will need them later.
                var circlePointsA = [
                    centerCircleA.closestPoint(inverseCircle1.center),
                    centerCircleA.closestPoint(inverseCircle2.center)
                ];
                var circlePointsB = [
                    centerCircleB.closestPoint(inverseCircle1.center),
                    centerCircleB.closestPoint(inverseCircle2.center)
                ];
                this.inverseCirclesPairs.push({
                    baseCircleIndexA: i,
                    baseCircleIndexB: j,
                    baseCircleA: this.circlesOfInterest[i],
                    baseCircleB: this.circlesOfInterest[j],
                    circleA: circleA,
                    inverseCircleA: inverseCircle1,
                    circleB: circleB,
                    inverseCircleB: inverseCircle2,
                    doIntersect: doIntersect,
                    circlePointsA: circlePointsA,
                    circlePointsB: circlePointsB
                });
            } // END for j
        } // END for i
        this.detectInverseCircleHoles();
    };
    //   public getInnerPath;
    Metaballs.prototype.checkCircleFullyContained = function (circleIndex) {
        for (var i = 0; i < this.inputCircles.length; i++) {
            if (circleIndex == i) {
                continue;
            }
            if (this.inputCircles[i].containsCircle(this.inputCircles[circleIndex])) {
                return true;
            }
        }
        return false;
    };
    Metaballs.prototype.detectContainmentStatus = function () {
        this.circleIsFullyContained = [];
        this.circlesOfInterest = [];
        for (var i = 0; i < this.inputCircles.length; i++) {
            this.circleIsFullyContained[i] = this.checkCircleFullyContained(i);
            if (!this.circleIsFullyContained[i]) {
                this.circlesOfInterest.push(this.inputCircles[i]);
            }
        }
    };
    Metaballs.prototype.rebuildContainingCircles = function (options) {
        this.containingCircles = [];
        for (var i = 0; i < this.circlesOfInterest.length; i++) {
            var containingCircle = new Circle_1.Circle(this.circlesOfInterest[i].center, this.circlesOfInterest[i].radius + options.metaRadiusAddon);
            this.containingCircles.push(containingCircle);
        }
    };
    Metaballs.prototype.detectInverseCircleHoles = function () {
        var inverseCircles = this.inverseCirclesPairs.reduce(function (accu, pair) {
            accu.push(pair.inverseCircleA, pair.inverseCircleB);
            return accu;
        }, []);
        console.log("inverseCircles", inverseCircles);
        var holeGroupIndices = Metaballs.metaballsUtils.detectHoles(inverseCircles);
        console.log("holeGroupIndices", holeGroupIndices);
    };
    Metaballs.metaballsUtils = {
        // +---------------------------------------------------------------------------------
        // | A hole can be found this way: a group of inverse circles with mutually contained centers.
        // +-------------------------------
        detectHoles: function (circles) {
            var n = circles.length;
            console.log("circles", circles);
            // var isInverseCircleVisited = arrayFill(n, false); // Array<number>
            var visitedCount = 0;
            var nonVisitedSet = new Set();
            var holeGroups = [];
            for (var i = 0; i < n; i++) {
                nonVisitedSet.add(i);
            }
            var iteration = 0; // A safety stop
            while (visitedCount < n && iteration++ < n + 1) {
                var curIndex = Array.from(nonVisitedSet)[Math.floor(Math.random() * nonVisitedSet.size)];
                var holeGroupIndices = Metaballs.metaballsUtils.detectHoleGroup(circles, nonVisitedSet, curIndex);
                visitedCount += holeGroupIndices.length;
                holeGroups.push(holeGroupIndices);
            }
            return holeGroups;
        },
        /**
         * Find a single hole group belonging to the circle at the given index.
         * @param circles
         * @param nonVisitedSet
         * @param index
         * @returns
         */
        detectHoleGroup: function (circles, nonVisitedSet, index) {
            var holeGroupIndices = [index];
            // Mark as visited
            nonVisitedSet.delete(index);
            for (var i = 0; i < circles.length; i++) {
                if (!nonVisitedSet.has(i)) {
                    // Already visited
                    continue;
                }
                // Circles mutually contain their centers?
                var circleA = circles[index];
                var circleB = circles[i];
                if (circleA.containsPoint(circleB.center) && circleB.containsPoint(circleA.center)) {
                    holeGroupIndices.push(i);
                    nonVisitedSet.delete(i);
                }
            }
            return holeGroupIndices;
        },
        anyCircleContainsPoint: function (circles, point, ignoreCircleIndex) {
            for (var i = 0; i < circles.length; i++) {
                if (i != ignoreCircleIndex && circles[i].containsPoint(point)) {
                    return true;
                }
            }
            return false;
        }
        // circleContainsAllPoints: (circle: Circle, points: XYCoords[]): boolean => {
        //   for (var i = 0; i < points.length; i++) {
        //     if (!circle.containsPoint(points[i])) {
        //       return false;
        //     }
        //   }
        //   return true;
        // },
        // anyCircleContainsAllPoints: (circles: Array<Circle>, points: XYCoords[], ignoreCircleIndex: number): boolean => {
        //   for (var i = 0; i < circles.length; i++) {
        //     if (i != ignoreCircleIndex && Metaballs.metaballsUtils.circleContainsAllPoints(circles[i], points)) {
        //       return true;
        //     }
        //   }
        //   return false;
        // }
    };
    return Metaballs;
}());
exports.Metaballs = Metaballs;
//# sourceMappingURL=Metaballs.js.map