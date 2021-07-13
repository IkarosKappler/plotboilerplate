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
    for (var i = 0; i < pathVertIndices.length && i < 32; i++) {
      console.log("i", i, pathVertIndices[i], unbufferedGeometry.vertices[pathVertIndices[i]], pathVertices[i]);
    }
    var n = pathVertIndices.length;
    var _self = this;
    pathVertIndices.forEach(function (vertIndex) {
      _self.unvisitedVertIndices.add(vertIndex);
    });
    var c = 0;
    while (this.numVisitedVertices < n && c++ < 32) {
      // var nextUnvisitedIndex = this.unvisitedVertIndices.entries().next().value;
      // var nextKey = this.unvisitedVertIndices.keys().next().value;
      // var nextUnvisitedIndex = this.unvisitedVertIndices.get(nextKey); // this.unvisitedVertIndices.entries().next().value;
      var nextUnvisitedIndex = this.unvisitedVertIndices.values().next().value;

      console.log("numVisitedVertices", this.numVisitedVertices, "nextUnvisitedIndex", nextUnvisitedIndex);
      // Array<number>
      var path = this.findUnvisitedPaths(unbufferedGeometry, pathVertIndices, nextUnvisitedIndex);
      collectedPaths.push(path);
    }
    return collectedPaths;
  };

  /**
   *
   */
  PathFinder.prototype.findUnvisitedPaths = function (unbufferedGeometry, pathVertIndices, unvisitedIndex) {
    var path = [unvisitedIndex]; // which elements?
    this.numVisitedVertices++;
    this.visitedVertices.add(unvisitedIndex);
    this.unvisitedVertIndices.delete(unvisitedIndex);
    // First: find the the face for this vertex index
    var faceAndVertIndex; // { faceIndex: number, vertIndex: number }
    while ((faceAndVertIndex = this.findAdjacentFace(unbufferedGeometry, pathVertIndices, unvisitedIndex))) {
      var faceIndex = faceAndVertIndex.faceIndex;
      var vertIndex = faceAndVertIndex.vertIndex;
      // Retrieved face/vertex tuple represents the next element on the path
      path.push(vertIndex);
      this.visitedVertices.add(vertIndex);
      this.unvisitedVertIndices.delete(vertIndex);
      this.numVisitedVertices++;
    }
    return path;
  };

  PathFinder.prototype.findAdjacentFace = function (unbufferedGeometry, pathVertIndices, unvisitedIndex) {
    var faceCount = unbufferedGeometry.faces.length;
    for (var f = 0; f < faceCount; f++) {
      // var face = unbufferedGeometry.faces[(startFaceIndex + f) % n];
      // Check if face contains the current un-visited vertex
      if (faceHasVertIndex(unbufferedGeometry, f, unvisitedIndex)) {
        // Face is a canditate to extend the path.
        // Check if there is a second un-visited path vertex
        for (var i = 0; i < pathVertIndices.length; i++) {
          if (this.visitedVertices.has(pathVertIndices[i])) {
            continue;
          }
          if (faceHasVertIndex(unbufferedGeometry, f, pathVertIndices[i])) {
            return { faceIndex: f, vertIndex: pathVertIndices[i] };
          }
        }
      }
    }
    // None found
    return null; // { faceIndex: -1, vertIndex: -1 };
  };

  PathFinder.prototype.findFaceAdjacentVert = function (unbufferedGeometry, faceIndex, vertIndex) {
    var face = unbufferedGeometry.faces[faceIndex];
    console.log("face", face);
    var vert = unbufferedGeometry.vertices[vertIndex];
    var vertA = unbufferedGeometry.vertices[face.a];
    var vertB = unbufferedGeometry.vertices[face.b];
    var vertC = unbufferedGeometry.vertices[face.c];
    return (
      (!this.visitedVertices.has(face.a) && vert.distanceTo(vertA) <= EPS) ||
      (!this.visitedVertices.has(face.b) && vert.distanceTo(vertB) <= EPS) ||
      (!this.visitedVertices.has(face.c) && vert.distanceTo(vertC) <= EPS)
    );
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
        if (curDist < foundDist) {
          // Remember geometry index if closest to path vertex
          if (
            foundIndex === -1 ||
            (foundIndex !== -1 && unbufferedGeometry.vertices[foundIndex].distanceTo(pathVert) > curDist)
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

  _context.PathFinder = PathFinder;
})(globalThis);
