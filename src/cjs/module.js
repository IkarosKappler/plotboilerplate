"use strict";
// ? https://www.pluralsight.com/guides/react-typescript-module-create
// ? https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawutilssvg = exports.VertTuple = exports.VertexListeners = exports.VertexAttr = exports.Vertex = exports.VEllipse = exports.Vector = exports.UIDGenerator = exports.Triangle = exports.SVGBuilder = exports.Polygon = exports.PlotBoilerplate = exports.PBImage = exports.MouseHandler = exports.Line = exports.KeyHandler = exports.Grid = exports.geomutils = exports.drawutilsgl = exports.drawutils = exports.CubicBezierCurve = exports.CircleSector = exports.Circle = exports.Bounds = exports.BezierPath = void 0;
var BezierPath_1 = require("./BezierPath");
Object.defineProperty(exports, "BezierPath", { enumerable: true, get: function () { return BezierPath_1.BezierPath; } });
var Bounds_1 = require("./Bounds");
Object.defineProperty(exports, "Bounds", { enumerable: true, get: function () { return Bounds_1.Bounds; } });
var Circle_1 = require("./Circle");
Object.defineProperty(exports, "Circle", { enumerable: true, get: function () { return Circle_1.Circle; } });
var CircleSector_1 = require("./CircleSector");
Object.defineProperty(exports, "CircleSector", { enumerable: true, get: function () { return CircleSector_1.CircleSector; } });
var CubicBezierCurve_1 = require("./CubicBezierCurve");
Object.defineProperty(exports, "CubicBezierCurve", { enumerable: true, get: function () { return CubicBezierCurve_1.CubicBezierCurve; } });
var draw_1 = require("./draw");
Object.defineProperty(exports, "drawutils", { enumerable: true, get: function () { return draw_1.drawutils; } });
var drawgl_1 = require("./drawgl");
Object.defineProperty(exports, "drawutilsgl", { enumerable: true, get: function () { return drawgl_1.drawutilsgl; } });
var geomutils_1 = require("./geomutils");
Object.defineProperty(exports, "geomutils", { enumerable: true, get: function () { return geomutils_1.geomutils; } });
var Grid_1 = require("./Grid");
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return Grid_1.Grid; } });
// import * as interf from "./interfaces";
var KeyHandler_1 = require("./KeyHandler");
Object.defineProperty(exports, "KeyHandler", { enumerable: true, get: function () { return KeyHandler_1.KeyHandler; } });
var Line_1 = require("./Line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return Line_1.Line; } });
var MouseHandler_1 = require("./MouseHandler");
Object.defineProperty(exports, "MouseHandler", { enumerable: true, get: function () { return MouseHandler_1.MouseHandler; } });
var PBImage_1 = require("./PBImage");
Object.defineProperty(exports, "PBImage", { enumerable: true, get: function () { return PBImage_1.PBImage; } });
var PlotBoilerplate_1 = require("./PlotBoilerplate");
Object.defineProperty(exports, "PlotBoilerplate", { enumerable: true, get: function () { return PlotBoilerplate_1.PlotBoilerplate; } });
var Polygon_1 = require("./Polygon");
Object.defineProperty(exports, "Polygon", { enumerable: true, get: function () { return Polygon_1.Polygon; } });
var SVGBuilder_1 = require("./SVGBuilder");
Object.defineProperty(exports, "SVGBuilder", { enumerable: true, get: function () { return SVGBuilder_1.SVGBuilder; } });
var Triangle_1 = require("./Triangle");
Object.defineProperty(exports, "Triangle", { enumerable: true, get: function () { return Triangle_1.Triangle; } });
var UIDGenerator_1 = require("./UIDGenerator");
Object.defineProperty(exports, "UIDGenerator", { enumerable: true, get: function () { return UIDGenerator_1.UIDGenerator; } });
var Vector_1 = require("./Vector");
Object.defineProperty(exports, "Vector", { enumerable: true, get: function () { return Vector_1.Vector; } });
var VEllipse_1 = require("./VEllipse");
Object.defineProperty(exports, "VEllipse", { enumerable: true, get: function () { return VEllipse_1.VEllipse; } });
var Vertex_1 = require("./Vertex");
Object.defineProperty(exports, "Vertex", { enumerable: true, get: function () { return Vertex_1.Vertex; } });
var VertexAttr_1 = require("./VertexAttr");
Object.defineProperty(exports, "VertexAttr", { enumerable: true, get: function () { return VertexAttr_1.VertexAttr; } });
var VertexListeners_1 = require("./VertexListeners");
Object.defineProperty(exports, "VertexListeners", { enumerable: true, get: function () { return VertexListeners_1.VertexListeners; } });
var VertTuple_1 = require("./VertTuple");
Object.defineProperty(exports, "VertTuple", { enumerable: true, get: function () { return VertTuple_1.VertTuple; } });
var drawutilssvg_1 = require("./utils/helpers/drawutilssvg");
Object.defineProperty(exports, "drawutilssvg", { enumerable: true, get: function () { return drawutilssvg_1.drawutilssvg; } });
exports.default = PlotBoilerplate_1.PlotBoilerplate;
// const parsePath = require('./parse-path');
// const path2dPolyfill = require('./path2d-polyfill');
// if (typeof window !== 'undefined') {
//  path2dPolyfill(window);
//}
// module.exports = {
//  path2dPolyfill,
//  parsePath,
//};
/*
const BezierPath = require( "./BezierPath" );
const Bounds = require( "./Bounds" );
const Circle = require( "./Circle" );
const CircleSector = require( "./CircleSector" );
const CubicBezierCurve = require( "./CubicBezierCurve" );
const drawutils = require( "./draw" );
const drawutilsgl = require( "./drawgl" );
const geomutils = require( "./geomutils" );
const Grid = require( "./Grid" );
// import * as interf from "./interfaces";
const KeyHandler = require( "./KeyHandler" );
const Line = require( "./Line" );
const MouseHandler = require( "./MouseHandler" );
const PBImage = require( "./PBImage" );
const PlotBoilerplate = require( "./PlotBoilerplate" );
const Polygon  = require( "./Polygon" );
const SVGBuilder = require( "./SVGBuilder" );
const Triangle = require( "./Triangle" );
const UIDGenerator = require( "./UIDGenerator" );
const Vector  = require( "./Vector" );
const VEllipse = require( "./VEllipse" );
const Vertex = require( "./Vertex" );
const VertexAttr = require( "./VertexAttr" );
const VertexListeners = require( "./VertexListeners" );
const VertTuple = require( "./VertTuple" );
const drawutilssvg = require( "./utils/helpers/drawutilssvg" );

module.exports = {
    BezierPath,
    Bounds,
    Circle,
    CircleSector,
    CubicBezierCurve,
    drawutils,
    drawutilsgl,
    geomutils,
    Grid,
    // ...interf,
    KeyHandler,
    Line,
    MouseHandler,
    PBImage,
    PlotBoilerplate,
    Polygon,
    SVGBuilder,
    Triangle,
    UIDGenerator,
    Vector,
    VEllipse,
    Vertex,
    VertexAttr,
    VertexListeners,
    VertTuple,
    drawutilssvg
};
*/
//# sourceMappingURL=module.js.map