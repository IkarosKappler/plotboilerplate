"use strict";
/**
 * @classdesc A HobbyCurve/HobbyPath calculation class: compute a set of optimal
 *            cubic Bézier curves from a sequence of vertices.
 *
 * This Hobby curve (path) implementation was strongly inspired by
 * the one by Prof. Dr. Edmund Weitz:
 *  // Copyright (c) 2018-2019, Dr. Edmund Weitz.  All rights reserved.
 *  // The code in this file is written mainly for demonstration purposes
 *  // and to illustrate the videos mentioned on the HTML page.  It would
 *  // be fairly easy to make it shorter and more efficient, but I
 *  // refrained from doing this on purpose.
 * Here's the website:
 *  http://weitz.de/hobby/
 *
 * @date     2020-04-07
 * @author   Transformed to a JS-class by Ikaros Kappler
 * @modified 2020-08-19 Ported from vanilla JS to TypeScript.
 * @version 1.0.1
 *
 * @file HobbyPath
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.HobbyPath = void 0;
var CubicBezierCurve_1 = require("../../CubicBezierCurve");
var Vertex_1 = require("../../Vertex");
;
var HobbyPath = /** @class */ (function () {
    /**
     * @constructor
     * @name HobbyPath
     * @param {Array<Vertex>=} vertices? - An optional array of vertices to initialize the path with.
     **/
    function HobbyPath(vertices) {
        this.vertices = vertices ? vertices : [];
    }
    ;
    /**
     * Add a new point to the end of the vertex sequence.
     *
     * @name addPoint
     * @memberof HobbyPath
     * @instance
     * @param {Vertex} p - The vertex (point) to add.
     **/
    HobbyPath.prototype.addPoint = function (p) {
        this.vertices.push(p);
    };
    ;
    /**
     * Generate a sequence of cubic Bézier curves from the point set.
     *
     * @name generateCurve
     * @memberof HobbyPath
     * @instance
     * @param {boolean=} circular - Specify if the path should be closed.
     * @param {number=0} omega - (default=0) An optional tension parameter.
     * @return Array<CubicBezierCurve>
     **/
    HobbyPath.prototype.generateCurve = function (circular, omega) {
        var n = this.vertices.length;
        if (n > 1) {
            if (n == 2) {
                // for two points, just draw a straight line
                return [new CubicBezierCurve_1.CubicBezierCurve(this.vertices[0], this.vertices[1], this.vertices[0], this.vertices[1])];
            }
            else {
                var curves = [];
                var controlPoints = this.hobbyControls(circular, omega);
                for (var i = 0; i < n - (circular ? 0 : 1); i++) {
                    // if i is n-1, the "next" point is the first one
                    var j = (i + 1) % n; // Use a succ function here?
                    curves.push(new CubicBezierCurve_1.CubicBezierCurve(this.vertices[i], this.vertices[j], controlPoints.startControlPoints[i], controlPoints.endControlPoints[i]));
                }
                return curves;
            }
        }
        else {
            return [];
        }
    };
    ;
    /**
     * Computes the control point coordinates for a Hobby curve through
     * the points given.
     *
     * @name hobbyControls
     * @memberof HobbyPath
     * @instance
     * @param {boolean}  circular - If true, then the path will be closed.
     * @param {number=0} omega    - The 'curl' or the path.
     * @return {IControlPoints} An object with two members: startControlPoints and endControlPoints (Array<Vertex>).
     **/
    HobbyPath.prototype.hobbyControls = function (circular, omega) {
        // This is a version that works for both, closed and non-closed paths.
        if (typeof omega === 'undefined')
            omega = 0;
        var n = this.vertices.length - (circular ? 0 : 1);
        var D = new Array(n);
        var ds = new Array(n);
        var succ = function (i) { return circular ? ((i + 1) % n) : (i + 1); };
        var pred = function (i) { return circular ? ((i + n - 1) % n) : (i - 1); };
        for (var i = 0; i < n; i++) {
            // the "next" point in a modular way
            var j = succ(i);
            ds[i] = this.vertices[i].difference(this.vertices[j]);
            D[i] = Math.sqrt(ds[i].x * ds[i].x + ds[i].y * ds[i].y);
        }
        var gamma = new Array(n + (circular ? 0 : 1));
        for (var i = (circular ? 0 : 1); i < n; i++) {
            // the "previous" point in a modular way
            var k = pred(i);
            var sin = ds[k].y / D[k];
            var cos = ds[k].x / D[k];
            var vec = HobbyPath.utils.rotate(ds[i], -sin, cos);
            gamma[i] = Math.atan2(vec.y, vec.x);
        }
        if (!circular)
            gamma[n] = 0;
        var a = new Array(n + (circular ? 0 : 1));
        var b = new Array(n + (circular ? 0 : 1));
        var c = new Array(n + (circular ? 0 : 1));
        var d = new Array(n + (circular ? 0 : 1));
        for (var i = (circular ? 0 : 1); i < n; i++) {
            // j is the "next" point, k the "previous" one
            var j = succ(i);
            var k = pred(i);
            // see video for the equations
            a[i] = 1 / D[k];
            b[i] = (2 * D[k] + 2 * D[i]) / (D[k] * D[i]);
            c[i] = 1 / D[i];
            d[i] = -(2 * gamma[i] * D[i] + gamma[j] * D[k]) / (D[k] * D[i]);
        }
        // make matrix tridiagonal in preparation for the "sherman" function
        var alpha;
        var beta;
        if (circular) {
            var s = a[0] * omega; // Use omega here?
            a[0] = 0;
            var t = c[n - 1] * omega; // Use omega here?
            c[n - 1] = 0;
            alpha = HobbyPath.utils.sherman(a, b, c, d, s, t);
            beta = new Array(n);
            for (var i = 0; i < n - (circular ? 0 : 1); i++) {
                // "next" point
                var j = succ(i);
                beta[i] = -gamma[j] - alpha[j];
            }
        }
        else {
            // see the Jackowski article for the following values; the result
            // will be that the curvature at the first point is identical to the
            // curvature at the second point (and likewise for the last and
            // second-to-last)
            b[0] = 2 + omega;
            c[0] = 2 * omega + 1;
            d[0] = -c[0] * gamma[1];
            a[n] = 2 * omega + 1;
            b[n] = 2 + omega;
            d[n] = 0;
            // solve system for the angles called "alpha" in the video
            alpha = HobbyPath.utils.thomas(a, b, c, d);
            // compute "beta" angles from "alpha" angles
            beta = new Array(n);
            for (var i = 0; i < n - 1; i++)
                beta[i] = -gamma[i + 1] - alpha[i + 1];
            // again, see Jackowski article
            beta[n - 1] = -alpha[n];
        }
        var startControlPoints = new Array(n);
        var endControlPoints = new Array(n);
        for (var i = 0; i < n; i++) {
            var j = succ(i);
            var a_1 = HobbyPath.utils.rho(alpha[i], beta[i]) * D[i] / 3;
            var b_1 = HobbyPath.utils.rho(beta[i], alpha[i]) * D[i] / 3;
            var v = HobbyPath.utils.normalize(HobbyPath.utils.rotateAngle(ds[i], alpha[i]));
            startControlPoints[i] = new Vertex_1.Vertex(this.vertices[i].x + a_1 * v.x, this.vertices[i].y + a_1 * v.y);
            v = HobbyPath.utils.normalize(HobbyPath.utils.rotateAngle(ds[i], -beta[i]));
            endControlPoints[i] = new Vertex_1.Vertex(this.vertices[j].x - b_1 * v.x, this.vertices[j].y - b_1 * v.y);
        }
        return { startControlPoints: startControlPoints,
            endControlPoints: endControlPoints
        };
    };
    HobbyPath.utils = {
        // rotates a vector [x, y] about an angle; the angle is implicitly
        // determined by its sine and cosine
        rotate: function (vert, sin, cos) {
            return new Vertex_1.Vertex(vert.x * cos - vert.y * sin, vert.x * sin + vert.y * cos);
        },
        // rotates a vector [x, y] about the angle alpha
        rotateAngle: function (vert, alpha) {
            return HobbyPath.utils.rotate(vert, Math.sin(alpha), Math.cos(alpha));
        },
        // returns a normalized version of the vector
        normalize: function (vec) {
            var n = Math.hypot(vec.x, vec.y);
            if (n == 0)
                return new Vertex_1.Vertex(0, 0);
            else
                return new Vertex_1.Vertex(vec.x / n, vec.y / n); // TODO: do in-place
        },
        // the "velocity function" (also called rho in the video); a and b are
        // the angles alpha and beta, the return value is the distance between
        // a control point and its neighboring point; to compute sigma(a,b)
        // we'll simply use rho(b,a)
        rho: function (a, b) {
            // see video for formula
            var sa = Math.sin(a);
            var sb = Math.sin(b);
            var ca = Math.cos(a);
            var cb = Math.cos(b);
            var s5 = Math.sqrt(5);
            var num = 4 + Math.sqrt(8) * (sa - sb / 16) * (sb - sa / 16) * (ca - cb);
            var den = 2 + (s5 - 1) * ca + (3 - s5) * cb;
            return num / den;
        },
        // Implements the Thomas algorithm for a tridiagonal system with i-th
        // row a[i]x[i-1] + b[i]x[i] + c[i]x[i+1] = d[i] starting with row
        // i=0, ending with row i=n-1 and with a[0] = c[n-1] = 0.  Returns the
        // values x[i] as an array.
        thomas: function (a, b, c, d) {
            var n = a.length;
            var cc = new Array(n);
            var dd = new Array(n);
            // forward sweep
            cc[0] = c[0] / b[0];
            dd[0] = d[0] / b[0];
            for (var i = 1; i < n; i++) {
                var den = b[i] - cc[i - 1] * a[i];
                cc[i] = c[i] / den;
                dd[i] = (d[i] - dd[i - 1] * a[i]) / den;
            }
            var x = new Array(n);
            // back substitution
            x[n - 1] = dd[n - 1];
            for (var i = n - 2; i >= 0; i--)
                x[i] = dd[i] - cc[i] * x[i + 1];
            return x;
        },
        // Solves an "almost" tridiagonal linear system with i-th row
        // a[i]x[i-1] + b[i]x[i] + c[i]x[i+1] = d[i] starting with row i=0,
        // ending with row i=n-1 and with a[0] = c[n-1] = 0.  Returns the
        // values x[i] as an array.  The system is not really tridiagonal
        // because the 0-th row is b[0]x[0] + c[0]x[1] + sx[n-1] = d[0] and
        // row n-1 is tx[0] + a[n-1]x[n-2] + b[n-1]x[n-1] = d[n-1].  The
        // Sherman-Morrison-Woodbury formula is used so that the function
        // "thomas" can be called to solve the system.
        sherman: function (a, b, c, d, s, t) {
            var n = a.length;
            var u = new Array(n);
            u.fill(0, 1, n - 1);
            u[0] = 1;
            u[n - 1] = 1;
            var v = new Array(n);
            v.fill(0, 1, n - 1);
            v[0] = t;
            v[n - 1] = s;
            b[0] -= t;
            b[n - 1] -= s;
            // this would be more efficient if computed in parallel, but hey...
            var Td = HobbyPath.utils.thomas(a, b, c, d);
            var Tu = HobbyPath.utils.thomas(a, b, c, u);
            var factor = (t * Td[0] + s * Td[n - 1]) / (1 + t * Tu[0] + s * Tu[n - 1]);
            var x = new Array(n);
            for (var i = 0; i < n; i++)
                x[i] = Td[i] - factor * Tu[i];
            return x;
        }
    };
    return HobbyPath;
}());
exports.HobbyPath = HobbyPath;
; // END class
//# sourceMappingURL=HobbyPath.js.map