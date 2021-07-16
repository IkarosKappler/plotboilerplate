/**
 * Find the connected path on a mesh surface.
 *
 * @date 2021-07-06
 */

(function (_context) {
  var EPS = 0.000001;

  var PathFinder = function () {
    // this.visitedVertices = new Map(); // <number,number>
    this.visitedVertices = new Set();
    this.unvisitedVertIndices = new Set(); // <number>
    this.numVisitedVertices = 0;
  };

  /**
   * The pathVertices array should not contain duplicates.
   *
   * @param {THREE.Geometry} unbufferedGeometry - The geometry itself containing the path vertices.
   * @param {THREE.Vector3[]} pathVertices - The unsorted vertices (must form a connected path on the geometry).
   */
  PathFinder.prototype.findAllPathsOnMesh = function (unbufferedGeometry, pathVertices) {
    console.log("pathVertices", pathVertices);
    var collectedPaths = []; // Array<number[]>
    this.visitedVertices.clear();
    this.unvisitedVertIndices.clear();
    // Map path vertices to vertices in the geometry.
    //
    // Please note that the index array might be shorter than the vertex array itself, if some vertices could
    // not be located in the geometry.
    //
    var pathVertIndices = mapVerticesToGeometryIndices(unbufferedGeometry, pathVertices);
    // for (var i = 0; i < pathVertIndices.length && i < 32; i++) {
    //   console.log("i", i, pathVertIndices[i], unbufferedGeometry.vertices[pathVertIndices[i]], pathVertices[i]);
    // }
    var n = pathVertIndices.length;
    var _self = this;
    pathVertIndices.forEach(function (vertIndex) {
      _self.unvisitedVertIndices.add(vertIndex);
    });
    // var c = 4096;
    while (this.numVisitedVertices < n /*&& c-- >= 0*/) {
      var nextUnvisitedIndex = this.unvisitedVertIndices.values().next().value;

      console.log("numVisitedVertices", this.numVisitedVertices, "nextUnvisitedIndex", nextUnvisitedIndex);
      // Array<number>
      var path = this.findUnvisitedPaths(unbufferedGeometry, pathVertIndices, nextUnvisitedIndex);
      collectedPaths.push(path);
    }

    // Try to find adjacent paths to connect them.
    // this.visitedVertices.clear();
    return this.combineAdjacentPaths(collectedPaths, unbufferedGeometry, pathVertices);
    // return collectedPaths;
  };

  /**
   *
   */
  PathFinder.prototype.findUnvisitedPaths = function (unbufferedGeometry, pathVertIndices, unvisitedIndex) {
    var path = [unvisitedIndex]; // which elements?
    this.visitedVertices.add(unvisitedIndex);
    this.unvisitedVertIndices.delete(unvisitedIndex);
    this.numVisitedVertices++;
    // First: find the the face for this vertex index
    var faceAndVertIndex; // { faceIndex: number, vertIndex: number }
    // var count = 2048;
    while (/*count-- >= 0 &&*/ (faceAndVertIndex = this.findAdjacentFace(unbufferedGeometry, pathVertIndices, unvisitedIndex))) {
      var faceIndex = faceAndVertIndex.faceIndex;
      var vertIndex = faceAndVertIndex.vertIndex;
      // Retrieved face/vertex tuple represents the next element on the path
      path.push(vertIndex);
      this.visitedVertices.add(vertIndex);
      this.unvisitedVertIndices.delete(vertIndex);
      this.numVisitedVertices++;
      // console.log("old unvisited vert index", unvisitedIndex, "new vert index", vertIndex);
      unvisitedIndex = vertIndex;
    }
    return path;
  };

  PathFinder.prototype.findAdjacentFace = function (unbufferedGeometry, pathVertIndices, unvisitedIndex) {
    var faceCount = unbufferedGeometry.faces.length;
    // console.log("xxxx #pathVertIndices", pathVertIndices.length, "faceCount", faceCount);
    for (var f = 0; f < faceCount; f++) {
      // var face = unbufferedGeometry.faces[(startFaceIndex + f) % n];
      // Check if face contains the current un-visited vertex
      // TODO: this is never true. WHY?
      if (faceHasVertIndex(unbufferedGeometry, f, unvisitedIndex)) {
        // Face is a canditate to extend the path.
        // Check if there is a second un-visited path vertex
        for (var i = 0; i < pathVertIndices.length; i++) {
          // if (i == 0) {
          //   // console.log("######### inner for", i);
          // }
          var pathVertIndex = pathVertIndices[i];
          if (pathVertIndex === unvisitedIndex) {
            continue;
          }
          if (this.isVisited(pathVertIndex)) {
            continue;
          }
          if (!this.isVisited(pathVertIndex) && faceHasVertIndex(unbufferedGeometry, f, pathVertIndex)) {
            return { faceIndex: f, vertIndex: pathVertIndex };
          }
          if (faceHasVertIndex(unbufferedGeometry, f, pathVertIndex)) {
            // console.log("FOUND");
            return { faceIndex: f, vertIndex: pathVertIndex };
          }
          // console.log("[1] No face found", "unvisitedIndex", unvisitedIndex);
        }
      }
      //console.log("[0] No face found", "unvisitedIndex", unvisitedIndex);
    }
    // None found
    return null; // { faceIndex: -1, vertIndex: -1 };
  };

  PathFinder.prototype.isVisited = function (vertIndex) {
    return this.visitedVertices.has(vertIndex);
  };

  var faceHasVertIndex = function (unbufferedGeometry, f, unvisitedIndex) {
    var face = unbufferedGeometry.faces[f];
    return face.a === unvisitedIndex || face.b === unvisitedIndex || face.c === unvisitedIndex;
  };

  /**
   * Get an array of vertex indices inside the geometry that represent the given path vertices,
   *
   * If no equivalent geometry vertex can be found (for a path vertex) then the path vertex
   * will be skipped.
   * So the returned array might be shorter than the path – and thus, have gaps.
   *
   * @param {THREE.Geometry} unbufferedGeometry
   * @param {Array<THREE.Vector3>} pathVertices
   * @returns
   */
  var mapVerticesToGeometryIndices = function (unbufferedGeometry, pathVertices) {
    var pathVertIndices = []; // number[]
    for (var i = 0; i < pathVertices.length; i++) {
      var pathVert = pathVertices[i];
      var foundIndex = -1;
      var foundDist = EPS;
      for (var j = 0; j < unbufferedGeometry.vertices.length; j++) {
        var curDist = unbufferedGeometry.vertices[j].distanceTo(pathVert);
        if (curDist <= foundDist) {
          // Remember geometry index if closest to path vertex
          if (
            foundIndex === -1 ||
            // By convention use smalled vertex index if multiple found
            (foundIndex !== -1 && unbufferedGeometry.vertices[foundIndex].distanceTo(pathVert) >= curDist && foundIndex > j)
          ) {
            foundIndex = j;
            foundDist = curDist;
          }
        }
      }
      if (foundIndex === -1) {
        console.warn(
          "PathFinder.mapVerticesToGeometryIndices could not find a matching geometry vertex for path point " +
            i +
            ". The final result might be locally broken."
        );
      } else {
        // Note: it may be possible that NO MATCHING GEOMETRY VERT was found (foundIndex = -1).
        pathVertIndices.push(foundIndex);
      }
    } // END for i
    console.log("pathVertIndices", pathVertIndices);
    return pathVertIndices;
  };

  /**
   * Find adjacent paths and connect them.
   *
   * @param {Array<number[]>} collectedPaths
   * @param {THREE.Geometry} unbufferedGeometry
   * @param {THREE.Vector3[]} pathVertices
   */
  PathFinder.prototype.combineAdjacentPaths = function (collectedPaths, unbufferedGeometry, pathVertices) {
    console.log("collectedPaths.length", collectedPaths.length, collectedPaths);
    var resultPaths = [];
    var unvisitedPathIndexSet = new Set(
      collectedPaths.map(function (_path, index) {
        return index;
      })
    );
    console.log("unvisitedPathIndexSet.size", unvisitedPathIndexSet.size, unvisitedPathIndexSet);
    var count = 32;
    while (count-- > 0 && unvisitedPathIndexSet.size > 0) {
      var currentPathIndex = unvisitedPathIndexSet.values().next().value;
      unvisitedPathIndexSet.delete(currentPathIndex);
      var currentPath = collectedPaths[currentPathIndex];
      var nextPath = null;
      var c = 32;
      // while (
      //   c-- > 0 &&
      //   (nextPath = findAdjacentPath(collectedPaths, currentPathIndex, unvisitedPathIndexSet, unbufferedGeometry, pathVertices))
      // ) {
      //   currentPath = currentPath.concat(nextPath);
      // }
      do {
        nextPath = findAdjacentPath(
          collectedPaths,
          currentPath[currentPath.length - 1],
          unvisitedPathIndexSet,
          unbufferedGeometry
        );
        if (!nextPath && currentPath.length > 1) {
          // If path's end point has no connection try reversed path
          currentPath = currentPath.reverse();
          nextPath = findAdjacentPath(
            collectedPaths,
            currentPath[currentPath.length - 1],
            unvisitedPathIndexSet,
            unbufferedGeometry
          );
        }

        if (nextPath) {
          currentPath = currentPath.concat(nextPath);
        }
      } while (c-- > 0 && nextPath);

      // All adjacent paths found and connected.
      resultPaths.push(currentPath);
    }

    // TEST

    return resultPaths;
  };

  var findAdjacentPath = function (collectedPaths, currentVertIndex, unvisitedPathIndexSet, unbufferedGeometry) {
    // var currentPath = collectedPaths[currentPathIndex];
    // var pathVertIndex = currentPath[currentPath.length - 1]; // currentPath[useReversedPath ? currentPath[currentPath.length - 1] : 0];
    for (var f = 0; f < unbufferedGeometry.faces.length; f++) {
      if (faceHasVertIndex(unbufferedGeometry, f, currentVertIndex)) {
        // Now find any unvisited path (first or last point) that connects here.
        for (var p = 0; p < collectedPaths.length; p++) {
          if (!unvisitedPathIndexSet.has(p)) {
            // Path already visited
            continue;
          }
          var nextPath = collectedPaths[p];
          if (faceHasVertIndex(unbufferedGeometry, f, nextPath[0])) {
            // Concat forwards
            unvisitedPathIndexSet.delete(p);
            return nextPath;
          } else if (faceHasVertIndex(unbufferedGeometry, f, nextPath[nextPath.length - 1])) {
            // Concat backwards
            unvisitedPathIndexSet.delete(p);
            return nextPath.reverse();
          }
        }
      }
    }
  };

  _context.PathFinder = PathFinder;
})(globalThis);
