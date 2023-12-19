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

import { Polygon } from "../../../../src/ts/Polygon";
import { matrixFill } from "../../../../src/ts/utils/algorithms/matrixFill";

interface PolygonContainmentTree {
  parentPolygon: PolygonContainmentTree | null;
  polygon: Polygon;
  polygonIndex: number;
  isVisited: boolean;
  childPolygons: Array<PolygonContainmentTree>;
}

export class PolygonContainmentLevel {
  //   private polygons: Array<Polygon>;
  private poylgonStatus: Array<PolygonContainmentTree>;
  private unvisitedSet: Set<number>;
  private visitedCount: number;
  private containmentMatrix: boolean[][];

  constructor(polygons: Polygon[]) {
    this.unvisitedSet = new Set<number>();
    this.poylgonStatus = polygons.map((poly: Polygon, index: number) => {
      this.unvisitedSet.add(index);
      return { polygon: poly, polygonIndex: index, isVisited: false, parentPolygon: null, childPolygons: [] };
    });
    this.containmentMatrix = matrixFill(polygons.length, polygons.length, false);
    this.visitedCount = 0;
  }

  /**
   * This method expects to be one great parent polyon to be present.
   * If it's not present please create it.
   *
   * @returns
   */
  public findContainmentTree(): PolygonContainmentTree[] | null {
    this.buildContainmentMatrix();

    var count = 0; // Just for safety -> terminate after n polygons were visited
    // First: build mapping to remember all visited polygons
    while (this.visitedCount < this.poylgonStatus.length && count < this.poylgonStatus.length) {
      // Pick a polygon that was not visited yet
      const curPolyIndex = this.locateNonVisitedPolygon();
      console.log("Next unvisited polygon", curPolyIndex);
      if (curPolyIndex == -1) {
        return null; // This should not happen, but better be safe than sorry
      }

      this.processPolygonAt(curPolyIndex);
      count++;
    }
    return this.poylgonStatus;
  }

  private buildContainmentMatrix() {
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
  }

  private processPolygonAt(curPolyIndex: number) {
    console.log("processPolygonAt curPolyIndex", curPolyIndex);
    // Check all other polygons if they contain that polygon
    const curPolyStatus: PolygonContainmentTree = this.poylgonStatus[curPolyIndex];
    // Mark as visited!
    this.markVisited(curPolyIndex); // curPolyStatus.polygonIndex);

    const parentIndex = this.findMinContainigPoly(curPolyStatus.polygonIndex);
    if (parentIndex == -1) {
      // Huh? meaning? No parent found
      console.log("No parent polygon found.", curPolyIndex);
    } else {
      console.log("Parent polygon for " + curPolyIndex + " found.", parentIndex);
      // We found a parent candidate :)
      const parentPolyStatus = this.poylgonStatus[parentIndex];
      // If the found candidate already has ...
      var i: number = 0;
      // while (i < parentPolyStatus.childPolygons.length) {
      //   if (curPolyIndex == parentPolyStatus.childPolygons[i].polygonIndex) {
      //     continue;
      //   }
      //   // if (parentPolyStatus.childPolygons[i].polygon.containsPolygon(curPolyStatus.polygon)) {
      //   if (this.containsPoly(i, curPolyIndex)) {
      //     const tmpChild = parentPolyStatus.childPolygons[i];
      //     // Remove child.
      //     parentPolyStatus.childPolygons.splice(i, 1);
      //     // And add it to ourselves :)
      //     curPolyStatus.childPolygons.push(tmpChild);
      //     tmpChild.parentPolygon = curPolyStatus;
      //   } else {
      //     // Local relation looks good. Just skip this child.
      //     i++;
      //   }
      // }

      parentPolyStatus.childPolygons.push(curPolyStatus);
      curPolyStatus.parentPolygon = parentPolyStatus;
      // Note: this relation might not be final if any polygons between are found
    }
  }

  private findMinContainigPoly(polyIndex: number): number {
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
  }

  private findAnyContainigPoly(polyIndex: number): number {
    // const curPolyStatus = this.poylgonStatus[polyIndex];
    for (var tempPolyIndex = 0; tempPolyIndex < this.poylgonStatus.length; tempPolyIndex++) {
      if (polyIndex == tempPolyIndex) {
        continue;
      }
      if (this.containmentMatrix[tempPolyIndex][polyIndex]) {
        console.log("Contains!", tempPolyIndex, "contains", polyIndex);
        return tempPolyIndex;
      } else {
        console.log("Does not contain.", tempPolyIndex, polyIndex);
      }
    }
    return -1;
  }

  private containsPoly(indexA: number, indexB: number) {
    return this.containmentMatrix[indexA][indexB];
  }

  private markVisited(polyIndex: number): void {
    this.unvisitedSet.delete(polyIndex);
    this.poylgonStatus[polyIndex].isVisited = true;
    this.visitedCount++;
  }

  private locateNonVisitedPolygon(): number {
    if (this.unvisitedSet.size == 0) {
      return -1;
    }
    return this.unvisitedSet.entries().next().value[1];
  }

  public toString(): string {
    const buffer: string[] = [];
    this.toStringBuffer(buffer);
    return buffer.join("\n");
  }

  public toStringBuffer(buffer: string[]): void {
    for (var curIndex = 0; curIndex < this.poylgonStatus.length; curIndex++) {
      buffer.push(
        `${curIndex} children: ${this.poylgonStatus[curIndex].childPolygons
          .map((child: PolygonContainmentTree) => {
            return child.polygonIndex;
          })
          .join(", ")}`
      );
    }
  }
}
