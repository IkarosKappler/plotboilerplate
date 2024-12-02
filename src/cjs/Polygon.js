"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2018-04-14
 * @modified 2018-11-17 Added the containsVert function.
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-10-25 Added the scale function.
 * @modified 2019-11-06 JSDoc update.
 * @modified 2019-11-07 Added toCubicBezierPath(number) function.
 * @modified 2019-11-22 Added the rotate(number,Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-10-30 Added the `addVertex` function.
 * @modified 2020-10-31 Added the `getVertexAt` function.
 * @modified 2020-11-06 Added the `move` function.
 * @modified 2020-11-10 Added the `getBounds` function.
 * @modified 2020-11-11 Generalized `move(Vertex)` to `move(XYCoords)`.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-01-29 Added the `signedArea` function (was global function in the demos before).
 * @modified 2021-01-29 Added the `isClockwise` function.
 * @modified 2021-01-29 Added the `area` function.
 * @modified 2021-01-29 Changed the param type for `containsVert` from Vertex to XYCoords.
 * @modified 2021-12-14 Added the `perimeter()` function.
 * @modified 2021-12-16 Added the `getEvenDistributionPolygon()` function.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Polygon.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-03-08 Added the `Polygon.clone()` function.
 * @modified 2023-09-25 Added the `Polygon.getInterpolationPolygon(number)` function.
 * @modified 2023-09-25 Added the `Polygon.lineIntersections(Line,boolean)` function.
 * @modified 2023-09-29 Added the `Polygon.closestLineIntersection(Line,boolean)` function.
 * @modified 2023-11-24 Added the `Polygon.containsPolygon(Polygon)' function.
 * @modified 2024-10-12 Added the `getLineAt` method.
 * @modified 2024-10-30 Added the `getLines` method.
 * @modified 2024-12-02 Added the `elimitateColinearEdges` method.
 * @version 1.13.0
 *
 * @file Polygon
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
var BezierPath_1 = require("./BezierPath");
var Bounds_1 = require("./Bounds");
var Line_1 = require("./Line");
var Triangle_1 = require("./Triangle");
var UIDGenerator_1 = require("./UIDGenerator");
var Vertex_1 = require("./Vertex");
var geomutils_1 = require("./geomutils");
/**
 * @classdesc A polygon class. Any polygon consists of an array of vertices; polygons can be open or closed.
 *
 * @requires BezierPath
 * @requires Bounds
 * @requires SVGSerializabe
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 * @requires XYCoords
 */
var Polygon = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Polygon
     * @param {Vertex[]} vertices - An array of 2d vertices that shape the polygon.
     * @param {boolean} isOpen - Indicates if the polygon should be rendered as an open or closed shape.
     **/
    function Polygon(vertices, isOpen) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Polygon";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        if (typeof vertices == "undefined") {
            vertices = [];
        }
        this.vertices = vertices;
        this.isOpen = isOpen || false;
    }
    /**
     * Add a vertex to the end of the `vertices` array.
     *
     * @method addVertex
     * @param {Vertex} vert - The vertex to add.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.addVertex = function (vert) {
        this.vertices.push(vert);
    };
    /**
     * Add a vertex at a particular position of the `vertices` array.
     *
     * @method addVertexAt
     * @param {Vertex} vert - The vertex to add.
     * @param {number} index - The position to add the vertex at. Will be handled modulo.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.addVertexAt = function (vert, index) {
        // var moduloIndex = index % (this.vertices.length + 1);
        this.vertices.splice(index, 0, vert);
    };
    /**
     * Get a new instance of the line at the given start index. The returned line will consist
     * of the vertex at `vertIndex` and `vertIndex+1` (will be handled modulo).
     *
     * @method getEdgeAt
     * @param {number} vertIndex - The vertex index of the line to start.
     * @instance
     * @memberof Polygon
     * @return {Line}
     **/
    Polygon.prototype.getEdgeAt = function (vertIndex) {
        return new Line_1.Line(this.getVertexAt(vertIndex), this.getVertexAt(vertIndex + 1));
    };
    /**
     * Converts this polygon into a sequence of lines. Please note that each time
     * this method is called new lines are created. The underlying line vertices are no clones
     * (instances).
     *
     * @method getEdges
     * @instance
     * @memberof Polygon
     * @return {Array<Line>}
     */
    Polygon.prototype.getEdges = function () {
        var lines = [];
        for (var i = 0; i + 1 < this.vertices.length; i++) {
            // var line = this.getLineAt(i).clone();
            lines.push(this.getEdgeAt(i));
        }
        if (!this.isOpen && this.vertices.length > 0) {
            lines.push(this.getEdgeAt(this.vertices.length - 1));
        }
        return lines;
    };
    /**
     * Checks if the angle at the given polygon vertex (index) is acute. Please not that this is
     * only working for clockwise polygons. If this polygon is not clockwise please use the
     * `isClockwise` method and reverse polygon vertices if needed.
     *
     * @method isAngleAcute
     * @instance
     * @memberof Polygon
     * @param {number} vertIndex - The index of the polygon vertex to check.
     * @returns {boolean} `true` is angle is acute, `false` is obtuse.
     */
    Polygon.prototype.getInnerAngleAt = function (vertIndex) {
        var p2 = this.vertices[vertIndex];
        var p1 = this.vertices[(vertIndex + this.vertices.length - 1) % this.vertices.length].clone();
        var p3 = this.vertices[(vertIndex + 1) % this.vertices.length].clone();
        // See
        //    https://math.stackexchange.com/questions/149959/how-to-find-the-interior-angle-of-an-irregular-pentagon-or-polygon
        // π−arccos((P2−P1)⋅(P3−P2)|P2−P1||P3−P2|)
        // Check if triangle is acute (will be used later)
        // Acute angles and obtuse angles need to be handled differently.
        var isAcute = this.isAngleAcute(vertIndex);
        // Differences
        var zero = new Vertex_1.Vertex(0, 0);
        var p2mp1 = new Vertex_1.Vertex(p2.x - p1.x, p2.y - p1.y);
        var p3mp2 = new Vertex_1.Vertex(p3.x - p2.x, p3.y - p2.y);
        var p2mp1_len = zero.distance(p2mp1);
        var p3mp2_len = zero.distance(p3mp2);
        // Dot products
        var dotProduct = geomutils_1.geomutils.dotProduct(p2mp1, p3mp2);
        var lengthProduct = p2mp1_len * p3mp2_len;
        if (isAcute) {
            return Math.PI - Math.acos(dotProduct / lengthProduct);
        }
        else {
            return Math.PI + Math.acos(dotProduct / lengthProduct);
        }
    };
    /**
     * Checks if the angle at the given polygon vertex (index) is acute.
     *
     * @method isAngleAcute
     * @instance
     * @memberof Polygon
     * @param {number} vertIndex - The index of the polygon vertex to check.
     * @returns {boolean} `true` is angle is acute, `false` is obtuse.
     */
    Polygon.prototype.isAngleAcute = function (vertIndex) {
        var A = this.vertices[(vertIndex + this.vertices.length - 1) % this.vertices.length].clone();
        var B = this.vertices[vertIndex];
        var C = this.vertices[(vertIndex + 1) % this.vertices.length].clone();
        // Find local winding number for triangle A B C
        var windingNumber = Triangle_1.Triangle.utils.determinant(A, B, C);
        // console.log("vertIndex", vertIndex, "windingNumber", windingNumber);
        return windingNumber < 0;
    };
    /**
     * Get the polygon vertex at the given position (index).
     *
     * The index may exceed the total vertex count, and will be wrapped around then (modulo).
     *
     * For k >= 0:
     *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
     *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
     *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
     *
     * @method getVertexAt
     * @param {number} index - The index of the desired vertex.
     * @instance
     * @memberof Polygon
     * @return {Vertex} At the given index.
     **/
    Polygon.prototype.getVertexAt = function (index) {
        if (index < 0) {
            return this.vertices[this.vertices.length - (Math.abs(index) % this.vertices.length)];
        }
        else {
            return this.vertices[index % this.vertices.length];
        }
    };
    /**
     * Move the polygon's vertices by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this for chaining
     **/
    Polygon.prototype.move = function (amount) {
        for (var i in this.vertices) {
            this.vertices[i].add(amount);
        }
        return this;
    };
    /**
     * Check if the given vertex is inside this polygon.<br>
     * <br>
     * Ray-casting algorithm found at<br>
     *    https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
     *
     * @method containsVert
     * @param {XYCoords} vert - The vertex to check. The new x-component.
     * @return {boolean} True if the passed vertex is inside this polygon. The polygon is considered closed.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.containsVert = function (vert) {
        // ray-casting algorithm based on
        //    http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var inside = false;
        for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            var xi = this.vertices[i].x, yi = this.vertices[i].y;
            var xj = this.vertices[j].x, yj = this.vertices[j].y;
            var intersect = yi > vert.y != yj > vert.y && vert.x < ((xj - xi) * (vert.y - yi)) / (yj - yi) + xi;
            if (intersect)
                inside = !inside;
        }
        return inside;
    };
    /**
     * Check if the passed polygon is completly contained inside this polygon.
     *
     * This means:
     *  - all polygon's vertices must be inside this polygon.
     *  - the polygon has no edge intersections with this polygon.
     *
     * @param {Polygon} polygon - The polygon to check if contained.
     * @return {boolean}
     */
    Polygon.prototype.containsPolygon = function (polygon) {
        for (var i = 0; i < polygon.vertices.length; i++) {
            if (!this.containsVert(polygon.vertices[i])) {
                return false;
            }
        }
        // All vertices are inside; check for intersections
        var lineSegment = new Line_1.Line(new Vertex_1.Vertex(), new Vertex_1.Vertex());
        for (var i = 0; i < polygon.vertices.length; i++) {
            lineSegment.a.set(polygon.vertices[i]);
            lineSegment.b.set(polygon.vertices[(i + 1) % polygon.vertices.length]);
            if (this.lineIntersections(lineSegment, true).length > 0) {
                // Current segment has intersection(s) with this polygon.
                return false;
            }
        }
        return true;
    };
    /**
     * Calculate the area of the given polygon (unsigned).
     *
     * Note that this does not work for self-intersecting polygons.
     *
     * @method area
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    Polygon.prototype.area = function () {
        return Polygon.utils.area(this.vertices);
    };
    /**
     * Calulate the signed polyon area by interpreting the polygon as a matrix
     * and calculating its determinant.
     *
     * @method signedArea
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    Polygon.prototype.signedArea = function () {
        return Polygon.utils.signedArea(this.vertices);
    };
    /**
     * Get the winding order of this polgon: clockwise or counterclockwise.
     *
     * @method isClockwise
     * @instance
     * @memberof Polygon
     * @return {boolean}
     */
    Polygon.prototype.isClockwise = function () {
        return Polygon.utils.signedArea(this.vertices) < 0;
    };
    /**
     * Get the perimeter of this polygon.
     * The perimeter is the absolute length of the outline.
     *
     * If this polygon is open then the last segment (connecting the first and the
     * last vertex) will be skipped.
     *
     * @method perimeter
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    Polygon.prototype.perimeter = function () {
        var length = 0;
        for (var i = 1; i < this.vertices.length; i++) {
            length += this.vertices[i - 1].distance(this.vertices[i]);
        }
        if (!this.isOpen && this.vertices.length > 1) {
            length += this.vertices[0].distance(this.vertices[this.vertices.length - 1]);
        }
        return length;
    };
    /**
     * Scale the polygon relative to the given center.
     *
     * @method scale
     * @param {number} factor - The scale factor.
     * @param {Vertex} center - The center of scaling.
     * @return {Polygon} this, for chaining.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.scale = function (factor, center) {
        for (var i in this.vertices) {
            if (typeof this.vertices[i].scale == "function")
                this.vertices[i].scale(factor, center);
            else
                console.log("There seems to be a null vertex!", this.vertices[i]);
        }
        return this;
    };
    /**
     * Rotate the polygon around the given center.
     *
     * @method rotate
     * @param {number} angle  - The rotation angle.
     * @param {Vertex} center - The center of rotation.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this, for chaining.
     **/
    Polygon.prototype.rotate = function (angle, center) {
        for (var i in this.vertices) {
            this.vertices[i].rotate(angle, center);
        }
        return this;
    };
    /**
     * Get the mean `center` of this polygon by calculating the mean value of all vertices.
     *
     * Mean: (v[0] + v[1] + ... v[n-1]) / n
     *
     * @method getMeanCenter
     * @instance
     * @memberof Polygon
     * @return {Vertex|null} `null` is no vertices are available.
     */
    Polygon.prototype.getMeanCenter = function () {
        if (this.vertices.length === 0) {
            return null;
        }
        var center = this.vertices[0].clone();
        for (var i = 1; i < this.vertices.length; i++) {
            center.add(this.vertices[i]);
        }
        center.x /= this.vertices.length;
        center.y /= this.vertices.length;
        return center;
    };
    /**
     * Get all line intersections with this polygon.
     *
     * See demo `47-closest-vector-projection-on-polygon` for how it works.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections within the polygon bounds.
     */
    Polygon.prototype.lineIntersections = function (line, inVectorBoundsOnly) {
        if (inVectorBoundsOnly === void 0) { inVectorBoundsOnly = false; }
        // Find the intersections of all lines inside the edge bounds
        var intersectionPoints = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var polyLine = new Line_1.Line(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]);
            var intersection = polyLine.intersection(line);
            // true => only inside bounds
            // ignore last edge if open
            if ((!this.isOpen || i + 1 !== this.vertices.length) &&
                intersection !== null &&
                polyLine.hasPoint(intersection, true) &&
                (!inVectorBoundsOnly || line.hasPoint(intersection, inVectorBoundsOnly))) {
                intersectionPoints.push(intersection);
            }
        }
        return intersectionPoints;
    };
    /**
     * Get the closest line-polygon-intersection point (closest the line point A).
     *
     * See demo `47-closest-vector-projection-on-polygon` for how it works.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are considered (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections within the polygon bounds.
     */
    Polygon.prototype.closestLineIntersection = function (line, inVectorBoundsOnly) {
        if (inVectorBoundsOnly === void 0) { inVectorBoundsOnly = false; }
        var allIntersections = this.lineIntersections(line, inVectorBoundsOnly);
        if (allIntersections.length <= 0) {
            // Empty polygon -> no intersections
            return null;
        }
        // Find the closest intersection
        var closestIntersection = new Vertex_1.Vertex(Number.MAX_VALUE, Number.MAX_VALUE);
        var curDist = Number.MAX_VALUE;
        for (var i in allIntersections) {
            var curVert = allIntersections[i];
            var dist = curVert.distance(line.a);
            if (dist < curDist) {
                // && line.hasPoint(curVert)) {
                curDist = dist;
                closestIntersection = curVert;
            }
        }
        return closestIntersection;
    };
    /**
     * Construct a new polygon from this polygon with more vertices on each edge. The
     * interpolation count determines the number of additional vertices on each edge.
     * An interpolation count of `0` will return a polygon that equals the source
     * polygon.
     *
     * @param {number} interpolationCount
     * @returns {Polygon} A polygon with `interpolationCount` more vertices (as as factor).
     */
    Polygon.prototype.getInterpolationPolygon = function (interpolationCount) {
        var verts = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var curVert = this.vertices[i];
            var nextVert = this.vertices[(i + 1) % this.vertices.length];
            verts.push(curVert.clone());
            // Add interpolation points
            if (!this.isOpen || i + 1 !== this.vertices.length) {
                var lerpAmount = 1.0 / (interpolationCount + 1);
                for (var j = 1; j <= interpolationCount; j++) {
                    verts.push(curVert.clone().lerp(nextVert, lerpAmount * j));
                }
            }
        }
        return new Polygon(verts, this.isOpen);
    };
    /**
     * Convert this polygon into a new polygon with n evenly distributed vertices.
     *
     * @param {number} pointCount - Must not be negative.
     */
    Polygon.prototype.getEvenDistributionPolygon = function (pointCount) {
        if (pointCount <= 0) {
            throw new Error("pointCount must be larger than zero; is " + pointCount + ".");
        }
        var result = new Polygon([], this.isOpen);
        if (this.vertices.length === 0) {
            return result;
        }
        // Fetch and add the start point from the source polygon
        var polygonPoint = new Vertex_1.Vertex(this.vertices[0]);
        result.vertices.push(polygonPoint);
        if (this.vertices.length === 1) {
            return result;
        }
        var perimeter = this.perimeter();
        var stepSize = perimeter / pointCount;
        var n = this.vertices.length;
        var polygonIndex = 1;
        var nextPolygonPoint = new Vertex_1.Vertex(this.vertices[1]);
        var segmentLength = polygonPoint.distance(nextPolygonPoint);
        var loopMax = this.isOpen ? n : n + 1;
        var curSegmentU = stepSize;
        var i = 1;
        while (i < pointCount && polygonIndex < loopMax) {
            // Check if next eq point is inside this segment
            if (curSegmentU < segmentLength) {
                var newPoint = polygonPoint.clone().lerpAbs(nextPolygonPoint, curSegmentU);
                result.vertices.push(newPoint);
                curSegmentU += stepSize;
                i++;
            }
            else {
                polygonIndex++;
                polygonPoint = nextPolygonPoint;
                nextPolygonPoint = new Vertex_1.Vertex(this.vertices[polygonIndex % n]);
                curSegmentU = curSegmentU - segmentLength;
                segmentLength = polygonPoint.distance(nextPolygonPoint);
            }
        }
        return result;
    };
    /**
     * Get the bounding box (bounds) of this polygon.
     *
     * @method getBounds
     * @instance
     * @memberof Polygon
     * @return {Bounds} The rectangular bounds of this polygon.
     **/
    Polygon.prototype.getBounds = function () {
        return Bounds_1.Bounds.computeFromVertices(this.vertices);
    };
    /**
     * Create a deep copy of this polygon.
     *
     * @method clone
     * @instance
     * @memberof Polygon
     * @return {Polygon} The cloned polygon.
     */
    Polygon.prototype.clone = function () {
        return new Polygon(this.vertices.map(function (vert) { return vert.clone(); }), this.isOpen);
    };
    /**
     * Create a new polygon without colinear adjacent edges. This method does not midify the current polygon
     * but creates a new one.
     *
     * Please note that this method does NOT create deep clones of the vertices. Use Polygon.clone() if you need to.
     *
     * Please also note that the `tolerance` may become really large here, as the denominator of two closely
     * parallel lines is usually pretty large. See the demo `57-eliminate-colinear-polygon-edges` to get
     * an impression of how denominators work.
     *
     * @method elimitateColinearEdges
     * @instance
     * @memberof Polygon
     * @param {number?} tolerance - (default is 1.0) The epsilon to detect co-linear edges.
     * @return {Polygon} A new polygon without co-linear adjacent edges – respective the given epsilon.
     */
    Polygon.prototype.elimitateColinearEdges = function (tolerance) {
        var eps = typeof tolerance === "undefined" ? 1.0 : tolerance;
        var verts = this.vertices.slice(); // Creates a shallow copy
        var i = 0;
        var lineA = new Line_1.Line(new Vertex_1.Vertex(), new Vertex_1.Vertex());
        var lineB = new Line_1.Line(new Vertex_1.Vertex(), new Vertex_1.Vertex());
        while (i + 1 < verts.length && verts.length > 2) {
            var vertA = verts[i];
            var vertB = verts[(i + 1) % verts.length];
            lineA.a = vertA;
            lineA.b = vertB;
            lineB.a = vertB;
            var areColinear = false;
            var j = i + 2;
            do {
                var vertC = verts[j % verts.length];
                lineB.b = vertC;
                areColinear = lineA.colinear(lineB, eps);
                // console.log("are colinear?", i, i + 1, j, areColinear);
                if (areColinear) {
                    j++;
                }
            } while (areColinear);
            // Now j points to the first vertex that's NOT colinear to the current lineA
            // -> delete all vertices in between
            if (j - i > 2) {
                // Means: there have been 'colinear vertices' in between
                // console.log("Splice", "i", i, "j", j, i + 1, j - i - 1);
                verts.splice(i + 1, j - i - 2);
            }
            i++;
        }
        return new Polygon(verts, this.isOpen);
    };
    /**
     * Convert this polygon to a sequence of quadratic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are pairs of control-point-and-end-point:
     * <pre>startPoint, controlPoint0, pathPoint1, controlPoint1, pathPoint2, controlPoint2, ..., endPoint</pre>
     *
     * @method toQuadraticBezierData
     * @return {Vertex[]}  An array of 2d vertices that shape the quadratic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toQuadraticBezierData = function () {
        if (this.vertices.length < 3)
            return [];
        var qbezier = [];
        var cc0 = this.vertices[0];
        var cc1 = this.vertices[1];
        var edgeCenter = new Vertex_1.Vertex(cc0.x + (cc1.x - cc0.x) / 2, cc0.y + (cc1.y - cc0.y) / 2);
        qbezier.push(edgeCenter);
        var limit = this.isOpen ? this.vertices.length : this.vertices.length + 1;
        for (var t = 1; t < limit; t++) {
            cc0 = this.vertices[t % this.vertices.length];
            cc1 = this.vertices[(t + 1) % this.vertices.length];
            var edgeCenter = new Vertex_1.Vertex(cc0.x + (cc1.x - cc0.x) / 2, cc0.y + (cc1.y - cc0.y) / 2);
            qbezier.push(cc0);
            qbezier.push(edgeCenter);
            cc0 = cc1;
        }
        return qbezier;
    };
    /**
     * Convert this polygon to a quadratic bezier curve, represented as an SVG data string.
     *
     * @method toQuadraticBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toQuadraticBezierSVGString = function () {
        var qdata = this.toQuadraticBezierData();
        if (qdata.length == 0)
            return "";
        var buffer = ["M " + qdata[0].x + " " + qdata[0].y];
        for (var i = 1; i < qdata.length; i += 2) {
            buffer.push("Q " + qdata[i].x + " " + qdata[i].y + ", " + qdata[i + 1].x + " " + qdata[i + 1].y);
        }
        return buffer.join(" ");
    };
    /**
     * Convert this polygon to a sequence of cubic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are triplets of (first-control-point, secnond-control-point, end-point):<br>
     * <pre>startPoint, controlPoint0_0, controlPoint1_1, pathPoint1, controlPoint1_0, controlPoint1_1, ..., endPoint</pre>
     *
     * @method toCubicBezierData
     * @param {number=} threshold - An optional threshold (default=1.0) how strong the curve segments
     *                              should over-/under-drive. Should be between 0.0 and 1.0 for best
     *                              results but other values are allowed.
     * @return {Vertex[]}  An array of 2d vertices that shape the cubic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toCubicBezierData = function (threshold) {
        if (typeof threshold == "undefined")
            threshold = 1.0;
        if (this.vertices.length < 3)
            return [];
        var cbezier = [];
        var a = this.vertices[0];
        var b = this.vertices[1];
        var edgeCenter = new Vertex_1.Vertex(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2);
        cbezier.push(edgeCenter);
        var limit = this.isOpen ? this.vertices.length - 1 : this.vertices.length;
        for (var t = 0; t < limit; t++) {
            var a = this.vertices[t % this.vertices.length];
            var b = this.vertices[(t + 1) % this.vertices.length];
            var c = this.vertices[(t + 2) % this.vertices.length];
            var aCenter = new Vertex_1.Vertex(a.x + (b.x - a.x) / 2, a.y + (b.y - a.y) / 2);
            var bCenter = new Vertex_1.Vertex(b.x + (c.x - b.x) / 2, b.y + (c.y - b.y) / 2);
            var a2 = new Vertex_1.Vertex(aCenter.x + (b.x - aCenter.x) * threshold, aCenter.y + (b.y - aCenter.y) * threshold);
            var b0 = new Vertex_1.Vertex(bCenter.x + (b.x - bCenter.x) * threshold, bCenter.y + (b.y - bCenter.y) * threshold);
            cbezier.push(a2);
            cbezier.push(b0);
            cbezier.push(bCenter);
        }
        return cbezier;
    };
    /**
     * Convert this polygon to a cubic bezier curve, represented as an SVG data string.
     *
     * @method toCubicBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toCubicBezierSVGString = function (threshold) {
        var qdata = this.toCubicBezierData(threshold);
        if (qdata.length == 0) {
            return "";
        }
        var buffer = ["M " + qdata[0].x + " " + qdata[0].y];
        for (var i = 1; i < qdata.length; i += 3) {
            buffer.push("C " +
                qdata[i].x +
                " " +
                qdata[i].y +
                ", " +
                qdata[i + 1].x +
                " " +
                qdata[i + 1].y +
                ", " +
                qdata[i + 2].x +
                " " +
                qdata[i + 2].y);
        }
        return buffer.join(" ");
    };
    /**
     * Convert this polygon to a cubic bezier path instance.
     *
     * @method toCubicBezierPath
     * @param {number} threshold - The threshold, usually from 0.0 to 1.0.
     * @return {BezierPath}      - A bezier path instance.
     * @instance
     * @memberof Polygon
     **/
    Polygon.prototype.toCubicBezierPath = function (threshold) {
        var qdata = this.toCubicBezierData(threshold);
        // Conver the linear path vertices to a two-dimensional path array
        var pathdata = [];
        for (var i = 0; i + 3 < qdata.length; i += 3) {
            pathdata.push([qdata[i], qdata[i + 3], qdata[i + 1], qdata[i + 2]]);
        }
        return BezierPath_1.BezierPath.fromArray(pathdata);
    };
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    Polygon.prototype.destroy = function () {
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].destroy();
        }
        this.isDestroyed = true;
    };
    Polygon.utils = {
        /**
         * Calculate the area of the given polygon (unsigned).
         *
         * Note that this does not work for self-intersecting polygons.
         *
         * @name area
         * @return {number}
         */
        area: function (vertices) {
            // Found at:
            //    https://stackoverflow.com/questions/16285134/calculating-polygon-area
            var total = 0.0;
            for (var i = 0, l = vertices.length; i < l; i++) {
                var addX = vertices[i].x;
                var addY = vertices[(i + 1) % l].y;
                var subX = vertices[(i + 1) % l].x;
                var subY = vertices[i].y;
                total += addX * addY * 0.5;
                total -= subX * subY * 0.5;
            }
            return Math.abs(total);
        },
        /**
         * Calulate the signed polyon area by interpreting the polygon as a matrix
         * and calculating its determinant.
         *
         * @name signedArea
         * @return {number}
         */
        signedArea: function (vertices) {
            var sum = 0;
            var n = vertices.length;
            for (var i = 0; i < n; i++) {
                var j = (i + 1) % n;
                sum += (vertices[j].x - vertices[i].x) * (vertices[i].y + vertices[j].y);
            }
            return sum;
        }
    };
    return Polygon;
}());
exports.Polygon = Polygon;
//# sourceMappingURL=Polygon.js.map