"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2018-04-22
 * @modified 2018-08-16 Added the curve() function to draw cubic bézier curves.
 * @modified 2018-10-23 Recognizing the offset param in the circle() function.
 * @modified 2018-11-27 Added the diamondHandle() function.
 * @modified 2018-11-28 Added the grid() function and the ellipse() function.
 * @modified 2018-11-30 Renamed the text() function to label() as it is not scaling.
 * @modified 2018-12-06 Added a test function for drawing arc in SVG style.
 * @modified 2018-12-09 Added the dot(Vertex,color) function (copied from Feigenbaum-plot-script).
 * @modified 2019-01-30 Added the arrow(Vertex,Vertex,color) function for drawing arrow heads.
 * @modified 2019-01-30 Added the image(Image,Vertex,Vertex) function for drawing images.
 * @modified 2019-04-27 Fixed a severe drawing bug in the arrow(...) function. Scaling arrows did not work properly.
 * @modified 2019-04-28 Added Math.round to the dot() drawing parameters to really draw a singlt dot.
 * @modified 2019-06-07 Fixed an issue in the cubicBezier() function. Paths were always closed.
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2019-10-25 Polygons are no longer drawn with dashed lines (solid lines instead).
 * @modified 2019-11-18 Added the polyline function.
 * @modified 2019-11-22 Added a second workaround for th drawImage bug in Safari.
 * @modified 2019-12-07 Added the 'lineWidth' param to the line(...) function.
 * @modified 2019-12-07 Added the 'lineWidth' param to the cubicBezier(...) function.
 * @modified 2019-12-11 Added the 'color' param to the label(...) function.
 * @modified 2019-12-18 Added the quadraticBezier(...) function (for the sake of approximating Lissajous curves).
 * @modified 2019-12-20 Added the 'lineWidth' param to the polyline(...) function.
 * @modified 2020-01-09 Added the 'lineWidth' param to the ellipse(...) function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-05-05 Added the 'lineWidth' param to the circle(...) function.
 * @modified 2020-05-12 Drawing any handles (square, circle, diamond) with lineWidth 1 now; this was not reset before.
 * @modified 2020-06-22 Added a context.clearRect() call to the clear() function; clearing with alpha channel did not work as expected.
 * @modified 2020-09-07 Added the circleArc(...) function to draw sections of circles.
 * @modified 2020-10-06 Removed the .closePath() instruction from the circleArc function.
 * @modified 2020-10-15 Re-added the text() function.
 * @modified 2020-10-28 Added the path(Path2D) function.
 * @modified 2020-12-28 Added the `singleSegment` mode (test).
 * @modified 2021-01-05 Added the image-loaded/broken check.
 * @modified 2021-01-24 Added the `setCurrentId` function from the `DrawLib` interface.
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-31 Added the `endDrawCycle` function from `DrawLib`.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2021-11-12 Adding more parameters tot the `text()` function: fontSize, textAlign, fontFamily, lineHeight.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-27 Added the `texturedPoly` function.
 * @modified 2022-06-01 Tweaked the `polyline` function; lineWidth now scales with scale.x.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2022-08-23 Fixed a type issue in the `polyline` function.
 * @modified 2022-08-23 Fixed a type issue in the `setConfiguration` function.
 * @modified 2022-08-23 Fixed a type issue in the `path` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @version  1.12.4
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawutils = void 0;
var CubicBezierCurve_1 = require("./CubicBezierCurve");
var Vertex_1 = require("./Vertex");
var drawutilssvg_1 = require("./drawutilssvg");
// Todo: rename this class to Drawutils?
/**
 * @classdesc A wrapper class for basic drawing operations.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
var drawutils = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {anvasRenderingContext2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    function drawutils(context, fillShapes) {
        this.ctx = context;
        this.offset = new Vertex_1.Vertex(0, 0);
        this.scale = new Vertex_1.Vertex(1, 1);
        this.fillShapes = fillShapes;
    }
    /**
     * Called before each draw cycle.
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     **/
    drawutils.prototype.beginDrawCycle = function (renderTime) {
        // NOOP
    };
    /**
     * Called after each draw cycle.
     *
     * This is required for compatibility with other draw classes in the library (like drawgl).
     *
     * @name endDrawCycle
     * @method
     * @param {number} renderTime
     * @instance
     **/
    drawutils.prototype.endDrawCycle = function (renderTime) {
        // NOOP
    };
    /**
     * Set the current drawlib configuration.
     *
     * @name setConfiguration
     * @method
     * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
     */
    drawutils.prototype.setConfiguration = function (configuration) {
        this.ctx.globalCompositeOperation = configuration.blendMode || "source-over";
    };
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).
     **/
    drawutils.prototype.setCurrentId = function (uid) {
        // NOOP
    };
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     **/
    drawutils.prototype.setCurrentClassName = function (className) {
        // NOOP
    };
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutils.prototype.line = function (zA, zB, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + zA.x * this.scale.x, this.offset.y + zA.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + zB.x * this.scale.x, this.offset.y + zB.y * this.scale.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 1;
        this.ctx.stroke();
        this.ctx.restore();
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
     * @memberof drawutils
     **/
    drawutils.prototype.arrow = function (zA, zB, color, lineWidth) {
        var headlen = 8; // length of head in pixels
        // var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
        // var vertices : Array<Vertex> = Vertex.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
        this.ctx.save();
        this.ctx.beginPath();
        var vertices = Vertex_1.Vertex.utils.buildArrowHead(zA, zB, headlen, this.scale.x, this.scale.y);
        this.ctx.moveTo(this.offset.x + zA.x * this.scale.x, this.offset.y + zA.y * this.scale.y);
        for (var i = 0; i < vertices.length; i++) {
            this.ctx.lineTo(this.offset.x + vertices[i].x, this.offset.y + vertices[i].y);
        }
        this.ctx.lineTo(this.offset.x + vertices[0].x, this.offset.y + vertices[0].y);
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
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
     * @param {number=0.0} alpha - (optional, default=0.0) The transparency (1.0=opaque, 0.0=transparent).
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutils.prototype.image = function (image, position, size, alpha) {
        if (alpha === void 0) { alpha = 1.0; }
        if (!image.complete || !image.naturalWidth) {
            // Avoid drawing un-unloaded or broken images
            return;
        }
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        // Note that there is a Safari bug with the 3 or 5 params variant.
        // Only the 9-param varaint works.
        this.ctx.drawImage(image, 0, 0, image.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        image.naturalHeight - 1, // To avoid errors substract 1 here.
        this.offset.x + position.x * this.scale.x, this.offset.y + position.y * this.scale.y, size.x * this.scale.x, size.y * this.scale.y);
        this.ctx.restore();
    };
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method texturedPoly
     * @param {Image} textureImage - The image object to draw.
     * @param {Bounds} textureSize - The texture size to use; these are the original bounds to map the polygon vertices to.
     * @param {Polygon} polygon - The polygon to use as clip path.
     * @param {Vertex} polygonPosition - The polygon's position (relative), measured at the bounding box's center.
     * @param {number} rotation - The rotation to use for the polygon (and for the texture).
     * @param {XYCoords={x:0,y:0}} rotationCenter - (optional) The rotational center; default is center of bounding box.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutils.prototype.texturedPoly = function (textureImage, textureSize, polygon, polygonPosition, rotation) {
        var basePolygonBounds = polygon.getBounds();
        var targetCenterDifference = polygonPosition.clone().difference(basePolygonBounds.getCenter());
        // var rotationalOffset = rotationCenter ? polygonPosition.difference(rotationCenter) : { x: 0, y: 0 };
        // var rotationalOffset = { x: 0, y: 0 };
        var tileCenter = basePolygonBounds.getCenter().sub(targetCenterDifference);
        // Get the position offset of the polygon
        var targetTextureSize = new Vertex_1.Vertex(textureSize.width, textureSize.height);
        // var targetTextureOffset = new Vertex(-textureSize.width / 2, -textureSize.height / 2).sub(targetCenterDifference);
        var targetTextureOffset = new Vertex_1.Vertex(textureSize.min.x, textureSize.min.y).sub(polygonPosition);
        this.ctx.save();
        // this.ctx.translate(this.offset.x + rotationCenter.x * this.scale.x, this.offset.y + rotationCenter.y * this.scale.y);
        this.ctx.translate(this.offset.x + polygonPosition.x * this.scale.x, this.offset.y + polygonPosition.y * this.scale.y);
        drawutils.helpers.clipPoly(this.ctx, {
            x: -polygonPosition.x * this.scale.x,
            y: -polygonPosition.y * this.scale.y
        }, this.scale, polygon.vertices);
        this.ctx.scale(this.scale.x, this.scale.y);
        this.ctx.rotate(rotation);
        this.ctx.drawImage(textureImage, 0, 0, textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
        targetTextureOffset.x, // * this.scale.x,
        targetTextureOffset.y, // * this.scale.y,
        targetTextureSize.x, //  * this.scale.x,
        targetTextureSize.y // * this.scale.y
        );
        this.ctx.restore();
    };
    drawutils.prototype._texturedPoly = function (textureImage, textureSize, polygon, polygonPosition, rotation, rotationCenter) {
        if (rotationCenter === void 0) { rotationCenter = { x: 0, y: 0 }; }
        var basePolygonBounds = polygon.getBounds();
        var targetCenterDifference = polygonPosition.clone().difference(basePolygonBounds.getCenter());
        var rotationalOffset = rotationCenter ? polygonPosition.difference(rotationCenter) : { x: 0, y: 0 };
        // var rotationalOffset = { x: 0, y: 0 };
        var tileCenter = basePolygonBounds.getCenter().sub(targetCenterDifference);
        // Get the position offset of the polygon
        var targetTextureSize = new Vertex_1.Vertex(textureSize.width, textureSize.height);
        var targetTextureOffset = new Vertex_1.Vertex(-textureSize.width / 2, -textureSize.height / 2).sub(targetCenterDifference);
        this.ctx.save();
        // this.ctx.translate(
        //   this.offset.x + (tileCenter.x - rotationalOffset.x * 0 + targetTextureOffset.x * 0.0) * this.scale.x,
        //   this.offset.y + (tileCenter.y - rotationalOffset.y * 0 + targetTextureOffset.y * 0.0) * this.scale.y
        // );
        this.ctx.translate(this.offset.x + (tileCenter.x - rotationalOffset.x * 0 + targetTextureOffset.x * 0.0) * this.scale.x, this.offset.y + (tileCenter.y - rotationalOffset.y * 0 + targetTextureOffset.y * 0.0) * this.scale.y);
        this.ctx.rotate(rotation);
        drawutils.helpers.clipPoly(this.ctx, {
            x: (-targetCenterDifference.x * 1 - tileCenter.x - rotationalOffset.x) * this.scale.x,
            y: (-targetCenterDifference.y * 1 - tileCenter.y - rotationalOffset.y) * this.scale.y
        }, this.scale, polygon.vertices);
        this.ctx.drawImage(textureImage, 0, 0, textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
        (-polygonPosition.x + targetTextureOffset.x * 1 - rotationalOffset.x * 1) * this.scale.x, (-polygonPosition.y + targetTextureOffset.y * 1 - rotationalOffset.y * 1) * this.scale.y, targetTextureSize.x * this.scale.x, targetTextureSize.y * this.scale.y);
        // const scaledTextureSize = new Bounds(
        //   new Vertex(
        //     -polygonPosition.x + targetTextureOffset.x - rotationalOffset.x,
        //     -polygonPosition.y + targetTextureOffset.y - rotationalOffset.y
        //   ).scaleXY(this.scale, rotationCenter),
        //   new Vertex(
        //     -polygonPosition.x + targetTextureOffset.x - rotationalOffset.x + targetTextureSize.x,
        //     -polygonPosition.y + targetTextureOffset.y - rotationalOffset.y + targetTextureSize.y
        //   ).scaleXY(this.scale, rotationCenter)
        // );
        // this.ctx.drawImage(
        //   textureImage,
        //   0,
        //   0,
        //   textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
        //   textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
        //   scaledTextureSize.min.x,
        //   scaledTextureSize.min.y,
        //   scaledTextureSize.width,
        //   scaledTextureSize.height
        // );
        this.ctx.restore();
    };
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    drawutils.prototype.rect = function (position, width, height, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + position.x * this.scale.x, this.offset.y + position.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + (position.x + width) * this.scale.x, this.offset.y + position.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + (position.x + width) * this.scale.x, this.offset.y + (position.y + height) * this.scale.y);
        this.ctx.lineTo(this.offset.x + position.x * this.scale.x, this.offset.y + (position.y + height) * this.scale.y);
        // this.ctx.lineTo( this.offset.x+position.x*this.scale.x, this.offset.y+position.y*this.scale.y );
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    // +---------------------------------------------------------------------------------
    // | This is the final helper function for drawing and filling stuff. It is not
    // | intended to be used from the outside.
    // |
    // | When in draw mode it draws the current shape.
    // | When in fill mode it fills the current shape.
    // |
    // | This function is usually only called internally.
    // |
    // | @param color A stroke/fill color to use.
    // +-------------------------------
    // TODO: convert this to a STATIC function.
    drawutils.prototype._fillOrDraw = function (color) {
        if (this.fillShapes) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
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
     * @memberof drawutils
     */
    drawutils.prototype.cubicBezier = function (startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
        if (startPoint instanceof CubicBezierCurve_1.CubicBezierCurve) {
            this.cubicBezier(startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, color, lineWidth);
            return;
        }
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + startPoint.x * this.scale.x, this.offset.y + startPoint.y * this.scale.y);
        this.ctx.bezierCurveTo(this.offset.x + startControlPoint.x * this.scale.x, this.offset.y + startControlPoint.y * this.scale.y, this.offset.x + endControlPoint.x * this.scale.x, this.offset.y + endControlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        //this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 2;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    /**
     * Draw the given (quadratic) bézier curve.
     *
     * @method quadraticBezier
     * @param {Vertex} startPoint   - The start point of the cubic Bézier curve
     * @param {Vertex} controlPoint - The control point the cubic Bézier curve.
     * @param {Vertex} endPoint     - The end control point the cubic Bézier curve.
     * @param {string} color        - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.quadraticBezier = function (startPoint, controlPoint, endPoint, color, lineWidth) {
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + startPoint.x * this.scale.x, this.offset.y + startPoint.y * this.scale.y);
        this.ctx.quadraticCurveTo(this.offset.x + controlPoint.x * this.scale.x, this.offset.y + controlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        this.ctx.lineWidth = lineWidth || 2;
        this._fillOrDraw(color);
        this.ctx.restore();
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
     * @memberof drawutils
     */
    drawutils.prototype.cubicBezierPath = function (path, color, lineWidth) {
        if (!path || path.length == 0)
            return;
        // Draw curve
        this.ctx.save();
        this.ctx.beginPath();
        var endPoint;
        var startControlPoint;
        var endControlPoint;
        this.ctx.moveTo(this.offset.x + path[0].x * this.scale.x, this.offset.y + path[0].y * this.scale.y);
        for (var i = 1; i < path.length; i += 3) {
            startControlPoint = path[i];
            endControlPoint = path[i + 1];
            endPoint = path[i + 2];
            this.ctx.bezierCurveTo(this.offset.x + startControlPoint.x * this.scale.x, this.offset.y + startControlPoint.y * this.scale.y, this.offset.x + endControlPoint.x * this.scale.x, this.offset.y + endControlPoint.y * this.scale.y, this.offset.x + endPoint.x * this.scale.x, this.offset.y + endPoint.y * this.scale.y);
        }
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
        this.ctx.restore();
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
     * @memberof drawutils
     */
    drawutils.prototype.handle = function (startPoint, endPoint) {
        // Draw handles
        // (No need to save and restore here)
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
     * @memberof drawutils
     */
    drawutils.prototype.handleLine = function (startPoint, endPoint) {
        // Draw handle lines
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
     * @memberof drawutils
     */
    drawutils.prototype.dot = function (p, color) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(Math.round(this.offset.x + this.scale.x * p.x), Math.round(this.offset.y + this.scale.y * p.y));
        this.ctx.lineTo(Math.round(this.offset.x + this.scale.x * p.x + 1), Math.round(this.offset.y + this.scale.y * p.y + 1));
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
        this.ctx.restore();
    };
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.point = function (p, color) {
        var radius = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x + p.x * this.scale.x, this.offset.y + p.y * this.scale.y, radius, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
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
     * @param {number} lineWidth - The line width (optional, default=1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.circle = function (center, radius, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius * this.scale.x, radius * this.scale.y, 0.0, 0.0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    };
    /**
       * Draw a circular arc (section of a circle) with the given CSS color.
       *
       * @method circleArc
       * @param {Vertex} center - The center of the circle.
       * @param {number} radius - The radius of the circle.
       * @param {number} startAngle - The angle to start at.
       * @param {number} endAngle - The angle to end at.
       * @param {string=#000000} color - The CSS color to draw the circle with.
       * @param {number=1} lineWidth - The line width to use
       // * @param {boolean=false} options.asSegment - If `true` then no beginPath and no draw will be applied (as part of larger path).
       * @return {void}
       * @instance
       * @memberof drawutils
       */
    drawutils.prototype.circleArc = function (center, radius, startAngle, endAngle, color, lineWidth, options) {
        if (!options || !options.asSegment) {
            this.ctx.beginPath();
        }
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius * this.scale.x, radius * this.scale.y, 0.0, startAngle, endAngle, false);
        if (!options || !options.asSegment) {
            // this.ctx.closePath();
            this.ctx.lineWidth = lineWidth || 1;
            this._fillOrDraw(color || "#000000");
        }
    };
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number} lineWidth=1 - An optional line width param (default is 1).
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.ellipse = function (center, radiusX, radiusY, color, lineWidth, rotation) {
        if (typeof rotation === "undefined") {
            rotation = 0.0;
        }
        this.ctx.beginPath();
        this.ctx.ellipse(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radiusX * this.scale.x, radiusY * this.scale.y, rotation, 0.0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
    };
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCoords} center - The center of the square.
     * @param {number} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number} lineWidth - The line with to use (optional, default is 1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.square = function (center, size, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.rect(this.offset.x + (center.x - size / 2.0) * this.scale.x, this.offset.y + (center.y - size / 2.0) * this.scale.y, size * this.scale.x, size * this.scale.y);
        this.ctx.closePath();
        this.ctx.lineWidth = lineWidth || 1;
        this._fillOrDraw(color);
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
     * @memberof drawutils
     */
    drawutils.prototype.grid = function (center, width, height, sizeX, sizeY, color) {
        this.ctx.beginPath();
        var yMin = -Math.ceil((height * 0.5) / sizeY) * sizeY;
        var yMax = height / 2;
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + yMin) * this.scale.y);
            this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + yMax) * this.scale.y);
        }
        var xMin = -Math.ceil((width * 0.5) / sizeX) * sizeX; // -Math.ceil((height*0.5)/sizeY)*sizeY;
        var xMax = width / 2; // height/2;
        for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
            this.ctx.moveTo(this.offset.x + (center.x + xMin) * this.scale.x - 4, this.offset.y + (center.y + y) * this.scale.y);
            this.ctx.lineTo(this.offset.x + (center.x + xMax) * this.scale.x + 4, this.offset.y + (center.y + y) * this.scale.y);
        }
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
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
     * @memberof drawutils
     */
    drawutils.prototype.raster = function (center, width, height, sizeX, sizeY, color) {
        this.ctx.save();
        this.ctx.beginPath();
        for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
            for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
                // Draw a crosshair
                this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x - 4, this.offset.y + (center.y + y) * this.scale.y);
                this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x + 4, this.offset.y + (center.y + y) * this.scale.y);
                this.ctx.moveTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + y) * this.scale.y - 4);
                this.ctx.lineTo(this.offset.x + (center.x + x) * this.scale.x, this.offset.y + (center.y + y) * this.scale.y + 4);
            }
        }
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.diamondHandle = function (center, size, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - size / 2.0, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y - size / 2.0);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + size / 2.0, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y + size / 2.0);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    };
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.squareHandle = function (center, size, color) {
        this.ctx.beginPath();
        this.ctx.rect(this.offset.x + center.x * this.scale.x - size / 2.0, this.offset.y + center.y * this.scale.y - size / 2.0, size, size);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
    };
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.circleHandle = function (center, radius, color) {
        radius = radius || 3;
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y, radius, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.lineWidth = 1;
        this._fillOrDraw(color);
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
     * @param {number=0.5} lineWidth - (optional, default=0.5) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.crosshair = function (center, radius, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y);
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 0.5;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    /**
     * Draw a cross with diagonal axes with given radius, color and lineWidth at the given position.<br>
     * <br>
     * Note that the x's radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=1} lineWidth - (optional, default=1.0) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.cross = function (center, radius, color, lineWidth) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.moveTo(this.offset.x + center.x * this.scale.x - radius, this.offset.y + center.y * this.scale.y + radius);
        this.ctx.lineTo(this.offset.x + center.x * this.scale.x + radius, this.offset.y + center.y * this.scale.y - radius);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth || 1.0;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon}  polygon - The polygon to draw.
     * @param {string}   color - The CSS color to draw the polygon with.
     * @param {string}   lineWidth - The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.polygon = function (polygon, color, lineWidth) {
        this.polyline(polygon.vertices, polygon.isOpen, color, lineWidth);
    };
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices   - The polygon vertices to draw.
     * @param {boolan}   isOpen     - If true the polyline will not be closed at its end.
     * @param {string}   color      - The CSS color to draw the polygon with.
     * @param {number}   lineWidth  - The line width (default is 1.0);
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.polyline = function (vertices, isOpen, color, lineWidth) {
        if (vertices.length <= 1) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = (lineWidth || 1.0) * this.scale.x;
        this.ctx.moveTo(this.offset.x + vertices[0].x * this.scale.x, this.offset.y + vertices[0].y * this.scale.y);
        for (var i = 0; i < vertices.length; i++) {
            this.ctx.lineTo(this.offset.x + vertices[i].x * this.scale.x, this.offset.y + vertices[i].y * this.scale.y);
        }
        if (!isOpen)
            // && vertices.length > 2 )
            this.ctx.closePath();
        this._fillOrDraw(color);
        this.ctx.closePath();
        this.ctx.setLineDash([]);
        this.ctx.restore();
    };
    /**
     * Draw a text at the given relative position.
     *
     * @method text
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {string=} options.color - The Color to use.
     * @param {string=} options.fontFamily - The font family to use.
     * @param {number=} options.fontSize - The font size (in pixels) to use.
     * @param {FontStyle=} options.fontStyle - The font style to use.
     * @param {FontWeight=} options.fontWeight - The font weight to use.
     * @param {number=} options.lineHeight - The line height (in pixels) to use.
     * @param {number=} options.rotation - The (optional) rotation in radians.
     * @param {string=} options.textAlign - The text align to use. According to the specifiactions (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) valid values are `"left" || "right" || "center" || "start" || "end"`.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.text = function (text, x, y, options) {
        // See https://stackoverflow.com/a/23523697
        var _a, _b, _c;
        options = options || {};
        this.ctx.save();
        var relX = this.offset.x + x * this.scale.x;
        var relY = this.offset.y + y * this.scale.y;
        var color = options.color || "black";
        if (options.fontSize || options.fontFamily) {
            // Scaling of text only works in uniform mode
            this.ctx.font =
                (options.fontWeight ? options.fontWeight + " " : "") +
                    (options.fontStyle ? options.fontStyle + " " : "") +
                    (options.fontSize ? options.fontSize * this.scale.x + "px " : " ") +
                    (options.fontFamily
                        ? options.fontFamily.indexOf(" ") === -1
                            ? options.fontFamily
                            : "\"" + options.fontFamily + "\""
                        : "Arial");
        }
        if (options.textAlign) {
            this.ctx.textAlign = options.textAlign;
        }
        var rotation = (_a = options.rotation) !== null && _a !== void 0 ? _a : 0.0;
        var lineHeight = ((_c = (_b = options.lineHeight) !== null && _b !== void 0 ? _b : options.fontSize) !== null && _c !== void 0 ? _c : 0) * this.scale.x;
        this.ctx.translate(relX, relY);
        this.ctx.rotate(rotation);
        if (this.fillShapes) {
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, 0, lineHeight / 2);
        }
        else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeText(text, 0, lineHeight / 2);
        }
        // this.ctx.translate(-relX, -relY);
        // this.ctx.rotate(-rotation); // is this necessary before 'restore()'?
        this.ctx.restore();
    };
    /**
     * Draw a non-scaling text label at the given position.
     *
     * Note that these are absolute label positions, they are not affected by offset or scale.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians (default=0).
     * @param {string=} color - The color to render the text with (default=black).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutils.prototype.label = function (text, x, y, rotation, color) {
        this.ctx.save();
        this.ctx.font = "lighter 9pt Arial";
        this.ctx.translate(x, y);
        if (typeof rotation !== "undefined")
            this.ctx.rotate(rotation);
        this.ctx.fillStyle = color || "black";
        if (this.fillShapes) {
            this.ctx.fillText(text, 0, 0);
        }
        else {
            this.ctx.strokeText(text, 0, 0);
        }
        this.ctx.restore();
    };
    /**
     * Draw an SVG-like path given by the specified path data.
     *
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
    drawutils.prototype.path = function (pathData, color, lineWidth, options) {
        var d = options && options.inplace ? pathData : drawutilssvg_1.drawutilssvg.copyPathData(pathData);
        drawutilssvg_1.drawutilssvg.transformPathData(d, this.offset, this.scale);
        if (color) {
            this.ctx.strokeStyle = color;
        }
        this.ctx.lineWidth = lineWidth || 1;
        if (this.fillShapes) {
            if (color) {
                this.ctx.fillStyle = color;
            }
            this.ctx.fill(new Path2D(d.join(" ")));
        }
        else {
            if (color) {
                this.ctx.strokeStyle = color;
            }
            this.ctx.stroke(new Path2D(d.join(" ")));
        }
    };
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    drawutils.prototype.clear = function (color) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };
    drawutils.helpers = {
        // A helper function to define the clipping path.
        // This could be a candidate for the draw library.
        clipPoly: function (ctx, offset, scale, vertices) {
            ctx.beginPath();
            // Set clip mask
            ctx.moveTo(offset.x + vertices[0].x * scale.x, offset.y + vertices[0].y * scale.y);
            for (var i = 1; i < vertices.length; i++) {
                var vert = vertices[i];
                ctx.lineTo(offset.x + vert.x * scale.x, offset.y + vert.y * scale.y);
            }
            ctx.closePath();
            ctx.clip();
        }
    };
    return drawutils;
}());
exports.drawutils = drawutils;
//# sourceMappingURL=draw.js.map