"use strict";
/* Imports for webpack */

globalThis.UIDGenerator = require("./UIDGenerator.js").geomutils;
globalThis.VertexAttr = require("./VertexAttr.js").VertexAttr;
globalThis.VertexListeners = require("./VertexListeners.js").VertexListeners;
globalThis.Vertex = require("./Vertex.js").Vertex;

globalThis.Bounds = require("./Bounds.js").Bounds;
globalThis.Grid = require("./Grid.js").Grid;
globalThis.Line = require("./Line.js").Line;
globalThis.Vector = require("./Vector.js").Vector;
globalThis.CubicBezierCurve = require("./CubicBezierCurve.js").CubicBezierCurve;
globalThis.BezierPath = require("./BezierPath.js").BezierPath;
globalThis.Polygon = require("./Polygon.js").Polygon;
globalThis.Triangle = require("./Triangle.js").Triangle;
globalThis.VEllipse = require("./VEllipse.js").VEllipse;
globalThis.VEllipseSector = require("./VEllipseSector.js").VEllipseSector;
globalThis.Circle = require("./Circle.js").Circle;
globalThis.CircleSector = require("./CircleSector.js").CircleSector;
globalThis.PBImage = require("./PBImage.js").PBImage;
globalThis.PBText = require("./PBText.js").PBText;
globalThis.MouseHandler = require("./MouseHandler.js").MouseHandler;
globalThis.KeyHandler = require("./KeyHandler.js").KeyHandler;
globalThis.drawutils = require("./draw.js").drawutils;
// globalThis.drawutilsgl = require("./drawgl.js").drawutilsgl;
globalThis.drawutilssvg = require("./drawutilssvg.js").drawutilssvg;
globalThis.geomutils = require("./geomutils.js").geomutils;
globalThis.PlotBoilerplate = require("./PlotBoilerplate.js").PlotBoilerplate;
