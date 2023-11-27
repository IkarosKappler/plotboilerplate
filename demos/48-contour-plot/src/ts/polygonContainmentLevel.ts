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

  constructor(polygons: Polygon[]) {
    this.unvisitedSet = new Set<number>();
    this.poylgonStatus = polygons.map((poly: Polygon, index: number) => {
      this.unvisitedSet.add(index);
      return { polygon: poly, polygonIndex: index, isVisited: false, parentPolygon: null, childPolygons: [] };
    });
    this.visitedCount = 0;
  }

  // static?
  public findContainmentTree(): PolygonContainmentTree[] | null {
    var count = 0; // Just for safety -> terminate after n polygons were visited
    // First: build mapping to remember all visited polygons
    while (this.visitedCount < this.poylgonStatus.length && count < this.poylgonStatus.length) {
      // Pick a polygon that was not visited yet
      const curPolyIndex = this.locateNonVisitedPolygon();
      if (curPolyIndex == -1) {
        return null; // This should not happen, but better be safe than sorry
      }

      this.processPolygonAt(curPolyIndex);
      count++;
    }
    return this.poylgonStatus;
  }

  private processPolygonAt(curPolyIndex: number) {
    // Check all other polygons if they contain that polygon
    const curPolyStatus: PolygonContainmentTree = this.poylgonStatus[curPolyIndex];
    // Mark as visited!
    this.markVisited(curPolyStatus.polygonIndex);

    const parentIndex = this.findAnyContainigPoly(curPolyStatus.polygonIndex);
    if (parentIndex == -1) {
      // Huh? meaning? No parent found
    } else {
      // We found a parent candidate :)
      const parentPolyStatus = this.poylgonStatus[parentIndex];
      curPolyStatus.parentPolygon = parentPolyStatus;
      // If the found candidate already has ...
      var i: number = 0;
      // for( var i = 0; i < parentPolyStatus.childPolygons.length; i++ ) {
      while (i < parentPolyStatus.childPolygons.length) {
        if (curPolyStatus.polygon.containsPolygon(parentPolyStatus.childPolygons[i].polygon)) {
          const tmpChild = parentPolyStatus.childPolygons[i];
          // Remove child.
          parentPolyStatus.childPolygons.splice(i, 1);
          // And add it to ourselves :)
          curPolyStatus.childPolygons.push(tmpChild);
          tmpChild.parentPolygon = curPolyStatus;
        } else {
          // Local relation looks good. Just skip this child.
          i++;
        }
      }

      parentPolyStatus.childPolygons.push(curPolyStatus);
      curPolyStatus.parentPolygon = parentPolyStatus;
      // Note: this relation might not be final if any polygons between are found
    }
  }

  private findAnyContainigPoly(polyIndex: number): number {
    const curPolyStatus = this.poylgonStatus[polyIndex];
    const unvisitedIter: Iterator<[number, number]> = this.unvisitedSet.entries();
    var nextEntry: IteratorResult<[number, number], any>;
    while ((nextEntry = unvisitedIter.next())) {
      var tempPolyIndex = nextEntry.value;
      var tempPolyStatus = this.poylgonStatus[tempPolyIndex];
      if (tempPolyStatus.polygon.containsPolygon(curPolyStatus.polygon)) {
        return tempPolyIndex;
      }
    }
    return -1;
  }

  private markVisited(polyIndex: number): void {
    this.unvisitedSet.delete(polyIndex);
    this.visitedCount++;
  }

  private locateNonVisitedPolygon(): number {
    if (this.unvisitedSet.size == 0) {
      return -1;
    }
    return this.unvisitedSet.entries().next().value;
  }
}
