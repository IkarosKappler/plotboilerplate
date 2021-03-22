"use strict";
/**
 * Draws elements into an SVG node.
 *
 * @author   Ikaros Kappler
 * @date     2021-01-03
 * @modified 2021-01-24 Fixed the `fillShapes` attribute in the copyInstance function.
 * @modified 2021-01-26 Changed the `isPrimary` (default true) attribute to `isSecondary` (default false).
 * @modified 2021-02-03 Added the static `createSvg` function.
 * @modified 2021-02-03 Fixed the currentId='background' bug on the clear() function.
 * @modified 2021-02-03 Fixed CSSProperty `stroke-width` (was line-width before, which is wrong).
 * @modified 2021-02-03 Added the static `HEAD_XML` attribute.
 * @modified 2021-02-19 Added the static helper function `transformPathData(...)` for svg path transformations (scale and translate).
 * @modified 2021-02-22 Added the static helper function `copyPathData(...)`.
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Fixed a bug in the `clear` function (curClassName was not cleared).
 * @version  1.0.2
 **/
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawutilssvg = void 0;
var CircleSector_1 = require("../../CircleSector");
var CubicBezierCurve_1 = require("../../CubicBezierCurve");
var Vertex_1 = require("../../Vertex");
var VEllipseSector_1 = require("../../VEllipseSector");
/**
 * @classdesc A helper class for basic SVG drawing operations. This class should
 * be compatible to the default 'draw' class.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
var drawutilssvg = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutilssvg
     * @param {SVGElement} svgNode - The SVG node to use.
     * @param {XYCoords} offset - The draw offset to use.
     * @param {XYCoords} scale - The scale factors to use.
     * @param {XYDimension} canvasSize - The initial canvas size (use setSize to change).
     * @param {boolean} fillShapes - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     * @param {DrawConfig} drawConfig - The default draw config to use for CSS fallback styles.
     * @param {boolean=} isSecondary - (optional) Indicates if this is the primary or secondary instance. Only primary instances manage child nodes.
     * @param {SVGElement=} gNode - (optional) Primary and seconday instances share the same &lt;g> node.
     **/
    function drawutilssvg(svgNode, offset, scale, canvasSize, fillShapes, drawConfig, isSecondary, gNode) {
        this.svgNode = svgNode;
        this.offset = new Vertex_1.Vertex(0, 0).set(offset);
        this.scale = new Vertex_1.Vertex(1, 1).set(scale);
        this.fillShapes = fillShapes;
        this.isSecondary = isSecondary;
        this.cache = new Map();
        this.setSize(canvasSize);
        if (isSecondary) {
            this.gNode = gNode;
        }
        else {
            this.addStyleDefs(drawConfig);
            this.gNode = this.createSVGNode("g");
            this.svgNode.appendChild(this.gNode);
        }
    }
    drawutilssvg.prototype.addStyleDefs = function (drawConfig) {
        var nodeStyle = this.createSVGNode("style");
        this.svgNode.appendChild(nodeStyle); // nodeDef);
        // Which default styles to add? -> All from the DrawConfig.
        // Compare with DrawConfig interface
        var keys = {
            "polygon": "Polygon",
            "triangle": "Triangle",
            "ellipse": "Ellipse",
            "circle": "Circle",
            "circleSector": "CircleSector",
            "vertex": "Vertex",
            "line": "Line",
            "vector": "Vector",
            "image": "Image"
        };
        // Question: why isn't this working if the svgNode is created dynamically? (nodeStyle.sheet is null)
        var rules = [];
        for (var k in keys) {
            var className = keys[k];
            var drawSettings = drawConfig[k];
            rules.push("." + className + " { fill : none; stroke: " + drawSettings.color + "; stroke-width: " + drawSettings.lineWidth + "px }");
        }
        nodeStyle.innerHTML = rules.join("\n");
    };
    /**
     * Retieve an old (cached) element.
     * Only if both – key and nodeName – match, the element will be returned (null otherwise).
     *
     * @method findElement
     * @private
     * @memberof drawutilssvg
     * @instance
     * @param {UID} key - The key of the desired element (used when re-drawing).
     * @param {string} nodeName - The expected node name.
     */
    drawutilssvg.prototype.findElement = function (key, nodeName) {
        var node = this.cache.get(key);
        if (node && node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
            this.cache.delete(key);
            return node;
        }
        return null;
    };
    /**
     * Create a new DOM node &lt;svg&gt; in the SVG namespace.
     *
     * @method createSVGNode
     * @private
     * @memberof drawutilssvg
     * @instance
     * @param {string} nodeName - The node name (tag-name).
     * @return {SVGElement} A new element in the SVG namespace with the given node name.
     */
    drawutilssvg.prototype.createSVGNode = function (nodeName) {
        return document.createElementNS("http://www.w3.org/2000/svg", nodeName);
    };
    /**
     * Make a new SVG node (or recycle an old one) with the given node name (circle, path, line, rect, ...).
     *
     * This function is used in draw cycles to re-use old DOM nodes (in hope to boost performance).
     *
     * @method makeNode
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {string} nodeName - The node name.
     * @return {SVGElement} The new node, which is not yet added to any document.
     */
    drawutilssvg.prototype.makeNode = function (nodeName) {
        // Try to find node in current DOM cache.
        // Unique node keys are strictly necessary.
        // Try to recycle an old element from cache.
        var node = this.findElement(this.curId, nodeName);
        if (!node) {
            // If no such old elements exists (key not found, tag name not matching),
            // then create a new one.
            node = this.createSVGNode(nodeName);
        }
        return node;
    };
    /**
     * This is the final helper function for drawing and filling stuff and binding new
     * nodes to the SVG document.
     * It is not intended to be used from the outside.
     *
     * When in draw mode it draws the current shape.
     * When in fill mode it fills the current shape.
     *
     * This function is usually only called internally.
     *
     * @method _bindFillDraw
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {SVGElement} node - The node to draw/fill and bind.
     * @param {string} className - The class name(s) to use.
     * @param {string} color - A stroke/fill color to use.
     * @param {number=1} lineWidth - (optional) A line width to use for drawing (default is 1).
     * @return {SVGElement} The node itself (for chaining).
     */
    drawutilssvg.prototype._bindFillDraw = function (node, className, color, lineWidth) {
        if (this.curClassName) {
            node.setAttribute("class", this.curClassName + " " + className);
        }
        else {
            node.setAttribute("class", className);
        }
        node.setAttribute("fill", this.fillShapes ? color : "none");
        node.setAttribute("stroke", this.fillShapes ? "none" : color);
        node.setAttribute("stroke-width", "" + (lineWidth || 1));
        if (this.curId) {
            node.setAttribute("id", "" + this.curId); // Maybe React-style 'key' would be better?
        }
        if (!node.parentNode) {
            // Attach to DOM only if not already attached
            this.gNode.appendChild(node);
        }
        return node;
    };
    /**
     * Sets the size and view box of the document. Call this if canvas size changes.
     *
     * @method setSize
     * @instance
     * @memberof drawutilssvg
     * @param {XYDimension} canvasSize - The new canvas size.
     */
    drawutilssvg.prototype.setSize = function (canvasSize) {
        this.canvasSize = canvasSize;
        this.svgNode.setAttribute("viewBox", "0 0 " + this.canvasSize.width + " " + this.canvasSize.height);
        this.svgNode.setAttribute("width", "" + this.canvasSize.width);
        this.svgNode.setAttribute("height", "" + this.canvasSize.height);
    };
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    drawutilssvg.prototype.copyInstance = function (fillShapes) {
        var copy = new drawutilssvg(this.svgNode, this.offset, this.scale, this.canvasSize, fillShapes, null, // no DrawConfig
        true, // isSecondary
        this.gNode);
        return copy;
    };
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID} uid - A UID identifying the currently drawn element(s).
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.setCurrentId = function (uid) {
        this.curId = uid;
    };
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string} className - A class name for further custom use cases.
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.setCurrentClassName = function (className) {
        this.curClassName = className;
    };
    /**
     * Called before each draw cycle.
     * This is required for compatibility with other draw classes in the library.
     *
     * @name beginDrawCycle
     * @method
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.beginDrawCycle = function (renderTime) {
        // Clear non-recycable elements from last draw cycle.
        this.cache.clear();
    };
    drawutilssvg.prototype._x = function (x) {
        return this.offset.x + this.scale.x * x;
    };
    drawutilssvg.prototype._y = function (y) {
        return this.offset.y + this.scale.y * y;
    };
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=1} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.line = function (zA, zB, color, lineWidth) {
        var line = this.makeNode("line");
        line.setAttribute("x1", "" + this._x(zA.x));
        line.setAttribute("y1", "" + this._y(zA.y));
        line.setAttribute("x2", "" + this._x(zB.x));
        line.setAttribute("y2", "" + this._y(zB.y));
        return this._bindFillDraw(line, "line", color, lineWidth || 1);
    };
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.arrow = function (zA, zB, color, lineWidth) {
        var node = this.makeNode("path");
        var headlen = 8; // length of head in pixels
        var vertices = Vertex_1.Vertex.utils.buildArrowHead(zA, zB, headlen, this.scale.x, this.scale.y);
        var d = ["M", this._x(zA.x), this._y(zA.y)];
        for (var i = 0; i <= vertices.length; i++) {
            d.push("L");
            // Note: only use offset here (the vertices are already scaled)
            d.push(this.offset.x + vertices[i % vertices.length].x);
            d.push(this.offset.y + vertices[i % vertices.length].y);
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "arrow", color, lineWidth || 1);
    };
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {Vertex} position - The position to draw the the upper left corner at.
     * @param {Vertex} size - The x/y-size to draw the image with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.image = function (image, position, size) {
        var _this = this;
        var node = this.makeNode("image");
        // We need to re-adjust the image if it was not yet fully loaded before.
        var setImageSize = function (image) {
            if (image.naturalWidth) {
                var ratioX = size.x / image.naturalWidth;
                var ratioY = size.y / image.naturalHeight;
                node.setAttribute("width", "" + image.naturalWidth * _this.scale.x);
                node.setAttribute("height", "" + image.naturalHeight * _this.scale.y);
                node.setAttribute("display", null); // Dislay when loaded
                node.setAttribute("transform", "translate(" + _this._x(position.x) + " " + _this._y(position.y) + ") scale(" + ratioX + " " + ratioY + ")");
            }
        };
        image.addEventListener("load", function (event) {
            setImageSize(image);
        });
        // Safari has a transform-origin bug.
        // Use x=0, y=0 and translate/scale instead (see above)
        node.setAttribute("x", "" + 0);
        node.setAttribute("y", "" + 0);
        node.setAttribute("display", "none"); // Hide before loaded
        setImageSize(image);
        node.setAttribute("href", image.src);
        return this._bindFillDraw(node, "image", null, null);
    };
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.cubicBezier = function (startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
        if (startPoint instanceof CubicBezierCurve_1.CubicBezierCurve) {
            return this.cubicBezier(startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, color, lineWidth);
        }
        var node = this.makeNode("path");
        // Draw curve
        var d = [
            "M",
            this._x(startPoint.x),
            this._y(startPoint.y),
            "C",
            this._x(startControlPoint.x),
            this._y(startControlPoint.y),
            this._x(endControlPoint.x),
            this._y(endControlPoint.y),
            this._x(endPoint.x),
            this._y(endPoint.y)
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "cubierBezier", color, lineWidth);
    };
    /**
     * Draw the given (cubic) Bézier path.
     *
     * The given path must be an array with n*3+1 vertices, where n is the number of
     * curves in the path:
     * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre>
     *
     * @method cubicBezierPath
     * @param {Vertex[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.cubicBezierPath = function (path, color, lineWidth) {
        var node = this.makeNode("path");
        if (!path || path.length == 0)
            return node;
        // Draw curve
        var d = ["M", this._x(path[0].x), this._y(path[0].y)];
        // Draw curve path
        var endPoint;
        var startControlPoint;
        var endControlPoint;
        for (var i = 1; i < path.length; i += 3) {
            startControlPoint = path[i];
            endControlPoint = path[i + 1];
            endPoint = path[i + 2];
            d.push("C", this._x(startControlPoint.x), this._y(startControlPoint.y), this._x(endControlPoint.x), this._y(endControlPoint.y), this._x(endPoint.x), this._y(endPoint.y));
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "cubicBezierPath", color, lineWidth || 1);
    };
    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {Vertex} startPoint - The start of the handle.
     * @param {Vertex} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.handle = function (startPoint, endPoint) {
        // TODO: redefine methods like these into an abstract class?
        this.point(startPoint, "rgb(0,32,192)");
        this.square(endPoint, 5, "rgba(0,128,192,0.5)");
    };
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {Vertex} startPoint - The start point to draw the handle at.
     * @param {Vertex} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.handleLine = function (startPoint, endPoint) {
        this.line(startPoint, endPoint, "rgb(192,192,192)");
    };
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {Vertex} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.dot = function (p, color) {
        var node = this.makeNode("line");
        return this._bindFillDraw(node, "dot", color, 1);
    };
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.point = function (p, color) {
        var radius = 3;
        var node = this.makeNode("circle");
        node.setAttribute("cx", "" + this._x(p.x));
        node.setAttribute("cy", "" + this._y(p.y));
        node.setAttribute("r", "" + radius);
        return this._bindFillDraw(node, "point", color, 1);
    };
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.circle = function (center, radius, color, lineWidth) {
        // Todo: draw ellipse when scalex!=scaley
        var node = this.makeNode("circle");
        node.setAttribute("cx", "" + this._x(center.x));
        node.setAttribute("cy", "" + this._y(center.y));
        node.setAttribute("r", "" + radius * this.scale.x); // y?
        return this._bindFillDraw(node, "circle", color, lineWidth || 1);
    };
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.circleArc = function (center, radius, startAngle, endAngle, color, lineWidth) {
        var node = this.makeNode("path");
        var arcData = CircleSector_1.CircleSector.circleSectorUtils.describeSVGArc(this._x(center.x), this._y(center.y), radius * this.scale.x, // y?
        startAngle, endAngle);
        node.setAttribute("d", arcData.join(" "));
        return this._bindFillDraw(node, "circleArc", color, lineWidth || 1);
    };
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.ellipse = function (center, radiusX, radiusY, color, lineWidth, rotation) {
        if (typeof rotation === "undefined") {
            rotation = 0.0;
        }
        var node = this.makeNode("ellipse");
        node.setAttribute("cx", "" + this._x(center.x));
        node.setAttribute("cy", "" + this._y(center.y));
        node.setAttribute("rx", "" + radiusX * this.scale.x);
        node.setAttribute("ry", "" + radiusY * this.scale.y);
        // node.setAttribute( 'style', `transform: rotate(${rotation} ${center.x} ${center.y})` );
        node.setAttribute("transform", "rotate(" + (rotation * 180) / Math.PI + " " + this._x(center.x) + " " + this._y(center.y) + ")");
        return this._bindFillDraw(node, "ellipse", color, lineWidth || 1);
    };
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.square = function (center, size, color, lineWidth) {
        var node = this.makeNode("rectangle");
        node.setAttribute("x", "" + this._x(center.x - size / 2.0));
        node.setAttribute("y", "" + this._y(center.y - size / 2.0));
        node.setAttribute("width", "" + size * this.scale.x);
        node.setAttribute("height", "" + size * this.scale.y);
        return this._bindFillDraw(node, "square", color, lineWidth || 1);
    };
    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {Vertex} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.grid = function (center, width, height, sizeX, sizeY, color) {
        var node = this.makeNode("path");
        var d = [];
        var yMin = -Math.ceil((height * 0.5) / sizeY) * sizeY;
        var yMax = height / 2;
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            d.push("M", this._x(center.x + x), this._y(center.y + yMin));
            d.push("L", this._x(center.x + x), this._y(center.y + yMax));
        }
        var xMin = -Math.ceil((width * 0.5) / sizeX) * sizeX;
        var xMax = width / 2;
        for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
            d.push("M", this._x(center.x + xMin), this._y(center.y + y));
            d.push("L", this._x(center.x + xMax), this._y(center.y + y));
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "grid", color, 1);
    };
    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {Vertex} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.raster = function (center, width, height, sizeX, sizeY, color) {
        var node = this.makeNode("path");
        var d = [];
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
                // Draw a crosshair
                d.push("M", this._x(center.x + x) - 4, this._y(center.y + y));
                d.push("L", this._x(center.x + x) + 4, this._y(center.y + y));
                d.push("M", this._x(center.x + x), this._y(center.y + y) - 4);
                d.push("L", this._x(center.x + x), this._y(center.y + y) + 4);
            }
        }
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "raster", color, 1);
    };
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.diamondHandle = function (center, size, color) {
        var node = this.makeNode("path");
        var d = [
            "M",
            this._x(center.x) - size / 2.0,
            this._y(center.y),
            "L",
            this._x(center.x),
            this._y(center.y) - size / 2.0,
            "L",
            this._x(center.x) + size / 2.0,
            this._y(center.y),
            "L",
            this._x(center.x),
            this._y(center.y) + size / 2.0,
            "Z"
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "diamondHandle", color, 1);
    };
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.squareHandle = function (center, size, color) {
        var node = this.makeNode("rect");
        node.setAttribute("x", "" + (this._x(center.x) - size / 2.0));
        node.setAttribute("y", "" + (this._y(center.y) - size / 2.0));
        node.setAttribute("width", "" + size);
        node.setAttribute("height", "" + size);
        return this._bindFillDraw(node, "squareHandle", color, 1);
    };
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.circleHandle = function (center, radius, color) {
        radius = radius || 3;
        var node = this.makeNode("circle");
        node.setAttribute("cx", "" + this._x(center.x));
        node.setAttribute("cy", "" + this._y(center.y));
        node.setAttribute("r", "" + radius);
        return this._bindFillDraw(node, "circleHandle", color, 1);
    };
    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.crosshair = function (center, radius, color) {
        var node = this.makeNode("path");
        var d = [
            "M",
            this._x(center.x) - radius,
            this._y(center.y),
            "L",
            this._x(center.x) + radius,
            this._y(center.y),
            "M",
            this._x(center.x),
            this._y(center.y) - radius,
            "L",
            this._x(center.x),
            this._y(center.y) + radius
        ];
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "crosshair", color, 0.5);
    };
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.polygon = function (polygon, color, lineWidth) {
        return this.polyline(polygon.vertices, polygon.isOpen, color, lineWidth);
    };
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.polyline = function (vertices, isOpen, color, lineWidth) {
        var node = this.makeNode("path");
        if (vertices.length == 0)
            return node;
        // Draw curve
        var d = ["M", this._x(vertices[0].x), this._y(vertices[0].y)];
        var n = vertices.length;
        for (var i = 1; i < n; i++) {
            d.push("L", this._x(vertices[i].x), this._y(vertices[i].y));
        }
        if (!isOpen)
            d.push("Z");
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "polyline", color, lineWidth || 1);
    };
    /**
     * Draw a text label at the given relative position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.text = function (text, x, y, options) {
        options = options || {};
        var color = options.color || "black";
        var node = this.makeNode("text");
        node.setAttribute("x", "" + this._x(x));
        node.setAttribute("y", "" + this._x(y));
        node.innerHTML = text;
        return this._bindFillDraw(node, "text", color, 1);
    };
    /**
     * Draw a non-scaling text label at the given position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    drawutilssvg.prototype.label = function (text, x, y, rotation) {
        var node = this.makeNode("text");
        // For some strange reason SVG rotation transforms use degrees instead of radians
        node.setAttribute("transform", "translate(" + this.offset.x + "," + this.offset.y + "), rotate(" + (rotation / Math.PI) * 180 + ")");
        node.innerHTML = text;
        return this._bindFillDraw(node, "label", "black", null);
    };
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    drawutilssvg.prototype.path = function (pathData, color, lineWidth, options) {
        var node = this.makeNode("path");
        // Transform the path: in-place (fast) or copy (slower)
        var d = options && options.inplace ? pathData : drawutilssvg.copyPathData(pathData);
        drawutilssvg.transformPathData(d, this.offset, this.scale);
        node.setAttribute("d", d.join(" "));
        return this._bindFillDraw(node, "path", color, lineWidth);
    };
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    drawutilssvg.prototype.clear = function (color) {
        // If this isn't the primary handler then do not remove anything here.
        // The primary handler will do that (no double work).
        if (this.isSecondary) {
            return;
        }
        // Clearing an SVG is equivalent to removing all its child elements.
        for (var i = 0; i < this.gNode.childNodes.length; i++) {
            // Hide all nodes here. Don't throw them away.
            // We can probably re-use them in the next draw cycle.
            var child = this.gNode.childNodes[i];
            this.cache.set(child.getAttribute("id"), child);
        }
        this.removeAllChildNodes();
        // Add a covering rect with the given background color
        this.curId = "background";
        this.curClassName = undefined;
        var node = this.makeNode("rect");
        // For some strange reason SVG rotation transforms use degrees instead of radians
        // Note that the background does not scale with the zoom level (always covers full element)
        node.setAttribute("x", "0");
        node.setAttribute("y", "0");
        node.setAttribute("width", "" + this.canvasSize.width);
        node.setAttribute("height", "" + this.canvasSize.height);
        // Bind this special element into the document
        this._bindFillDraw(node, this.curId, null, null);
        node.setAttribute("fill", typeof color === "undefined" ? "none" : color);
        // Clear the current ID again
        this.curId = undefined;
    };
    /**
     * A private helper function to clear all SVG nodes from the &gt;g> node.
     *
     * @private
     */
    drawutilssvg.prototype.removeAllChildNodes = function () {
        while (this.gNode.lastChild) {
            this.gNode.removeChild(this.gNode.lastChild);
        }
    };
    /**
     * Create a new and empty `SVGElement` &lt;svg&gt; in the svg-namespace.
     *
     * @name createSvg
     * @static
     * @memberof drawutilssvg
     * @return SVGElement
     */
    drawutilssvg.createSvg = function () {
        return document.createElementNS("http://www.w3.org/2000/svg", "svg");
    };
    /**
     * Create a copy of the given path data. As path data only consists of strings and numbers,
     * the copy will be shallow by definition.
     *
     * @name copyPathData
     * @static
     * @memberof drawutilssvg
     */
    drawutilssvg.copyPathData = function (data) {
        var copy = new Array(data.length);
        for (var i = 0, n = data.length; i < n; i++) {
            copy[i] = data[i];
        }
        return copy;
    };
    /**
     * Transform the given path data (translate and scale. rotating is not intended here).
     *
     * @name transformPathData
     * @static
     * @memberof drawutilssvg
     * @param {SVGPathParams} data - The data to transform.
     * @param {XYCoords} offset - The translation offset (neutral is x=0, y=0).
     * @param {XYCoords} scale - The scale factors (neutral is x=1, y=1).
     */
    drawutilssvg.transformPathData = function (data, offset, scale) {
        // Scale and translate {x,y}
        var _stx = function (index) {
            data[index] = offset.x + scale.x * Number(data[index]);
        };
        var _sty = function (index) {
            data[index] = offset.y + scale.y * Number(data[index]);
        };
        // scale only {x,y}
        var _sx = function (index) {
            data[index] = scale.x * Number(data[index]);
        };
        var _sy = function (index) {
            data[index] = scale.y * Number(data[index]);
        };
        var i = 0;
        // var firstPoint: XYCoords = { x: NaN, y: NaN };
        var lastPoint = { x: NaN, y: NaN };
        // "save last point"
        var _slp = function (index) {
            lastPoint.x = Number(data[i]);
            lastPoint.y = Number(data[i + 1]);
        };
        while (i < data.length) {
            var cmd = data[i];
            switch (cmd) {
                case "M":
                // MoveTo: M|m x y
                // if (firstPoint.x === NaN) {
                //   firstPoint.x = Number(data[i + 1]);
                //   firstPoint.y = Number(data[i + 2]);
                // }
                case "L":
                // LineTo L|l x y
                case "T":
                    // Shorthand/smooth quadratic Bézier curveto: T|t x y
                    _stx(i + 1);
                    _sty(i + 2);
                    _slp(i + 1);
                    i += 3;
                    break;
                case "m":
                // MoveTo: M|m x y
                // if (firstPoint.x === NaN) {
                //   firstPoint.x = Number(data[i + 1]);
                //   firstPoint.y = Number(data[i + 2]);
                // }
                case "l":
                // LineTo L|l x y
                case "t":
                    // Shorthand/smooth quadratic Bézier curveto: T|t x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _slp(i + 1);
                    i += 3;
                    break;
                case "H":
                    // HorizontalLineTo: H|h x
                    _stx(i + 1);
                    lastPoint.x = Number(data[i + 1]);
                    i += 2;
                    break;
                case "h":
                    // HorizontalLineTo: H|h x
                    _sx(i + 1);
                    lastPoint.x = Number(data[i + 1]);
                    i += 2;
                    break;
                case "V":
                    // VerticalLineTo: V|v y
                    _sty(i + 1);
                    lastPoint.y = Number(data[i + 1]);
                    i += 2;
                    break;
                case "v":
                    // VerticalLineTo: V|v y
                    _sy(i + 1);
                    lastPoint.y = Number(data[i + 1]);
                    i += 2;
                    break;
                case "C":
                    // CurveTo: C|c x1 y1 x2 y2 x y
                    _stx(i + 1);
                    _sty(i + 2);
                    _stx(i + 3);
                    _sty(i + 4);
                    _stx(i + 5);
                    _sty(i + 6);
                    _slp(i + 5);
                    i += 7;
                    break;
                case "c":
                    // CurveTo: C|c x1 y1 x2 y2 x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _sx(i + 3);
                    _sy(i + 4);
                    _sx(i + 5);
                    _sy(i + 6);
                    _slp(i + 5);
                    i += 7;
                    break;
                case "S":
                case "Q":
                    // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
                    // QuadraticCurveTo: Q|q x1 y1 x y
                    _stx(i + 1);
                    _sty(i + 2);
                    _stx(i + 3);
                    _sty(i + 4);
                    _slp(i + 3);
                    i += 5;
                    break;
                case "s":
                case "q":
                    // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
                    // QuadraticCurveTo: Q|q x1 y1 x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _sx(i + 3);
                    _sy(i + 4);
                    _slp(i + 3);
                    i += 5;
                    break;
                case "A":
                    // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    if (scale.x === scale.y) {
                        // Uniform scale: just scale
                        _sx(i + 1);
                        _sy(i + 2);
                        _stx(i + 6);
                        _sty(i + 7);
                        _slp(i + 6);
                        // Update the arc flag when x _or_ y scale is negative
                        if ((scale.x < 0 && scale.y >= 0) || (scale.x >= 0 && scale.y < 0)) {
                            data[i + 5] = data[i + 5] ? 0 : 1;
                        }
                        i += 8;
                    }
                    else {
                        // Non-uniform scale: convert to Bézier approximation
                        var sector = VEllipseSector_1.VEllipseSector.ellipseSectorUtils.endpointToCenterParameters(lastPoint.x, // x1
                        lastPoint.y, // y1
                        (Number(data[i + 3]) * Math.PI) / 180, // rotation (phi, in radians)
                        Number(data[i + 1]), // rx
                        Number(data[i + 2]), // ry
                        data[i + 4] != 0, // fa
                        data[i + 5] != 0, // fs
                        Number(data[i + 6]), // x2
                        Number(data[i + 7]) // y2
                        );
                        console.log("sector", sector);
                        var curves = sector.toCubicBezier(4);
                        var curveData = curves.reduce(function (accu, curve) {
                            return accu.concat([
                                "C",
                                _stx(curve.startControlPoint.x),
                                _sty(curve.startControlPoint.y),
                                _stx(curve.endControlPoint.x),
                                _sty(curve.endControlPoint.y),
                                _stx(curve.endPoint.x),
                                _sty(curve.endPoint.y)
                            ]);
                        }, []);
                        console.log("CURVE DATA", curveData);
                        // Replace the 'A' command with a sequence of 'C' commands
                        data.splice.apply(data, __spreadArrays([i, 8], curveData));
                        i += data.length;
                    }
                    break;
                case "a":
                    // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    _sx(i + 1);
                    _sy(i + 2);
                    _sx(i + 6);
                    _sy(i + 7);
                    _slp(i + 6);
                    i += 8;
                    break;
                case "z":
                case "Z":
                    // ClosePath: Z|z (no arguments)
                    // lastPoint.x = firstPoint.x;
                    // lastPoint.y = firstPoint.y;
                    i++;
                    break;
                // Safepoint: continue reading token by token until something is recognized again
                default:
                    i++;
            }
        } // END while
    }; // END transformPathData
    drawutilssvg.HEAD_XML = [
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" ',
        '         "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">',
        ""
    ].join("\n");
    return drawutilssvg;
}());
exports.drawutilssvg = drawutilssvg;
//# sourceMappingURL=drawutilssvg.js.map