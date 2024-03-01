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

import { Circle } from "../../Circle";
import { Vertex } from "../../Vertex";
import { CircleIntersections } from "./CircleIntersections";

type Pair<T> = [T, T];

interface InverseCirclePair {
  baseCircleIndexA: number;
  baseCircleIndexB: number;
  baseCircleA: Circle;
  baseCircleB: Circle;
  circleA: Circle;
  circleB: Circle;
  inverseCircleA: Circle;
  inverseCircleB: Circle;
  doIntersect: boolean;
  circlePointsA: Pair<Vertex>;
  circlePointsB: Pair<Vertex>;
}

interface MetaballsOptions {
  metaRadiusAddon: number;
}

export class Metaballs {
  private circleIsFullyContained: Array<boolean> = []; // Array<boolean>
  private inputCircles: Array<Circle> = [];
  private circlesOfInterest: Array<Circle> = [];
  private containingCircles: Array<Circle> = [];

  // Array< { baseCircleIndexA, baseCircleIndexB,
  //          baseCircleA, baseCircleB,
  //          circleA, circleB,
  //          inverseCircleA, inverseCircleB,
  //          doIntersect, circlePointsA:[], circlePointsB:[] } >
  private inverseCirclesPairs: Array<InverseCirclePair> = [];

  constructor(inputCircles: Array<Circle>) {
    this.inputCircles = inputCircles;
  }

  public rebuild(options: MetaballsOptions) {
    this.detectContainmentStatus();
    this.rebuildContainingCircles(options);

    this.inverseCirclesPairs = [];

    const radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(this.containingCircles);
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
        var inverseCircle1 = new Circle(radicalLine.a, options.metaRadiusAddon);
        var inverseCircle2 = new Circle(radicalLine.b, options.metaRadiusAddon);
        var doIntersect = inverseCircle1.circleIntersection(inverseCircle2) != null;
        // console.log("doIntersect", doIntersect);
        // Now find the intersection points between inner and outer circles.
        // We will need them later.
        var circlePointsA: Pair<Vertex> = [
          centerCircleA.closestPoint(inverseCircle1.center),
          centerCircleA.closestPoint(inverseCircle2.center)
        ];
        var circlePointsB: Pair<Vertex> = [
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
      }
    }
  }

  private checkCircleFullyContained(circleIndex: number): boolean {
    for (var i = 0; i < this.inputCircles.length; i++) {
      if (circleIndex == i) {
        continue;
      }
      if (this.inputCircles[i].containsCircle(this.inputCircles[circleIndex])) {
        return true;
      }
    }
    return false;
  }

  detectContainmentStatus() {
    this.circleIsFullyContained = [];
    this.circlesOfInterest = [];
    for (var i = 0; i < this.inputCircles.length; i++) {
      this.circleIsFullyContained[i] = this.checkCircleFullyContained(i);
      if (!this.circleIsFullyContained[i]) {
        this.circlesOfInterest.push(this.inputCircles[i]);
      }
    }
  }

  rebuildContainingCircles(options: MetaballsOptions) {
    this.containingCircles = [];
    for (var i = 0; i < this.circlesOfInterest.length; i++) {
      var containingCircle = new Circle(
        this.circlesOfInterest[i].center,
        this.circlesOfInterest[i].radius + options.metaRadiusAddon
      );
      this.containingCircles.push(containingCircle);
    }
  }
}
