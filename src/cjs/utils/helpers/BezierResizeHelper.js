"use strict";
/**
 * A helper to resize bezier paths in horizontal and vertical orientation.
 *
 * @requires PlotBoilerplate
 * @requires BezierPath
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2026-04-04 Copied from the ngdg project, made minor type adaptions.
 * @version  1.2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BezierResizeHelper = void 0;
var Vertex_1 = require("../../Vertex");
// A closure to hide helper functions.
var BezierResizeHelper = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @param {PlotBoilerplate} pb
     * @param {BezierPath} bezierPath
     * @param {function} updateCallback
     */
    function BezierResizeHelper(pb, bezierPath, updateCallback) {
        this.pb = pb;
        this.bezierPath = bezierPath;
        // @public
        this.topResizeHandle = new Vertex_1.Vertex(0, 0);
        this.leftResizeHandle = new Vertex_1.Vertex(0, 0);
        this.bottomResizeHandle = new Vertex_1.Vertex(0, 0);
        this.rightResizeHandle = new Vertex_1.Vertex(0, 0);
        // @private
        this.topHandleDragStartPosition = null;
        this.leftHandleDragStartPosition = null;
        this.bottomHandleDragStartPosition = null;
        this.rightHandleDragStartPosition = null;
        this.__listeners = this.__installListeners(this, pb, bezierPath, updateCallback);
        this.updateResizeHandles();
    }
    BezierResizeHelper.prototype.draw = function (draw, fill) {
        this.drawHandleLines(draw, fill, "grey");
        this.drawTriangles(draw, fill, "rgba(0,192,192,1.0)");
    };
    /**
     * Call this method from the outside to see active helper lines for those edges
     * that are currently dragged.
     *
     * @param {DrawLib<any>} draw
     * @param {DrawLib<any>} fill
     * @param {string} lineColor
     */
    BezierResizeHelper.prototype.drawHandleLines = function (draw, fill, lineColor) {
        // console.log("drawResizeHandleLines", bezierResizer.verticalResizeHandleDragStartPosition);
        var bounds = this.bezierPath.getBounds();
        if (this.topHandleDragStartPosition) {
            draw.line({ x: bounds.min.x, y: this.topResizeHandle.y }, { x: bounds.max.x, y: this.topResizeHandle.y }, lineColor, 1.0, {
                dashOffset: 0.0,
                dashArray: [5, 5]
            });
        }
        if (this.leftHandleDragStartPosition) {
            draw.line({ x: this.leftResizeHandle.x, y: bounds.min.y }, { x: this.leftResizeHandle.x, y: bounds.max.y }, lineColor, 1.0, { dashOffset: 0.0, dashArray: [5, 5] });
        }
        if (this.bottomHandleDragStartPosition) {
            draw.line({ x: bounds.min.x, y: this.bottomResizeHandle.y }, { x: bounds.max.x, y: this.bottomResizeHandle.y }, lineColor, 1.0, {
                dashOffset: 0.0,
                dashArray: [5, 5]
            });
        }
        if (this.rightHandleDragStartPosition) {
            draw.line({ x: this.rightResizeHandle.x, y: bounds.min.y }, { x: this.rightResizeHandle.x, y: bounds.max.y }, lineColor, 1.0, { dashOffset: 0.0, dashArray: [5, 5] });
        }
    };
    BezierResizeHelper.prototype.drawTriangles = function (draw, _fill, color) {
        // this.__drawUpTriangle(draw, this.topResizeHandle, color);
        // this.__drawDownTriangle(draw, this.bottomResizeHandle, color);
        // this.__drawLeftTriangle(draw, this.leftResizeHandle, color);
        // this.__drawRightTriangle(draw, this.rightResizeHandle, color);
        this.drawTopTriangle(draw, _fill, color);
        this.drawLeftTriangle(draw, _fill, color);
        this.drawBottomTriangle(draw, _fill, color);
        this.drawRightTriangle(draw, _fill, color);
    };
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.drawTopTriangle = function (draw, _fill, color) {
        this.__drawUpTriangle(draw, _fill, this.topResizeHandle, color);
    };
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.drawLeftTriangle = function (draw, _fill, color) {
        this.__drawLeftTriangle(draw, _fill, this.leftResizeHandle, color);
    };
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.drawBottomTriangle = function (draw, _fill, color) {
        this.__drawDownTriangle(draw, _fill, this.bottomResizeHandle, color);
    };
    /**
     * Draws an right-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.drawRightTriangle = function (draw, _fill, color) {
        this.__drawRightTriangle(draw, _fill, this.rightResizeHandle, color);
    };
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.__drawUpTriangle = function (draw, _fill, position, color) {
        var arrowSize = 6.0;
        var arrowSizeH = arrowSize / this.pb.config.scaleX;
        var arrowSizeV = arrowSize / this.pb.config.scaleY;
        var verts = [
            { x: position.x - arrowSizeH, y: position.y + arrowSizeV * 0.5 }, // left corner
            { x: position.x, y: position.y - arrowSizeV }, // up corner
            { x: position.x + arrowSizeH, y: position.y + arrowSizeV * 0.5 } // right corner
        ];
        draw.polyline(verts, false, color, 1.0);
    };
    /**
     * Draws an left-trinangle at the left handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.__drawLeftTriangle = function (draw, _fill, position, color) {
        var arrowSize = 6.0;
        var arrowSizeH = arrowSize / this.pb.config.scaleX;
        var arrowSizeV = arrowSize / this.pb.config.scaleY;
        var verts = [
            { x: position.x - arrowSizeH, y: position.y }, // left corner
            { x: position.x + arrowSizeH * 0.5, y: position.y - arrowSizeV }, // up corner
            { x: position.x + arrowSizeH * 0.5, y: position.y + arrowSizeV } // down corner
        ];
        draw.polyline(verts, false, color, 1.0);
    };
    /**
     * Draws a down-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.__drawDownTriangle = function (draw, _fill, position, color) {
        var arrowSize = 6.0;
        var arrowSizeH = arrowSize / this.pb.config.scaleX;
        var arrowSizeV = arrowSize / this.pb.config.scaleY;
        var verts = [
            { x: position.x + arrowSizeH, y: position.y - arrowSizeV * 0.5 }, // right corner
            { x: position.x, y: position.y + arrowSizeV }, // down corner
            { x: position.x - arrowSizeH, y: position.y - arrowSizeV * 0.5 } // left corner
        ];
        draw.polyline(verts, false, color, 1.0);
    };
    /**
     * Draws an left-trinangle at the left handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    BezierResizeHelper.prototype.__drawRightTriangle = function (draw, _fill, position, color) {
        var arrowSize = 6.0;
        var arrowSizeH = arrowSize / this.pb.config.scaleX;
        var arrowSizeV = arrowSize / this.pb.config.scaleY;
        var verts = [
            { x: position.x + arrowSizeH, y: position.y }, // left corner
            { x: position.x - arrowSizeH * 0.5, y: position.y - arrowSizeV }, // up corner
            { x: position.x - arrowSizeH * 0.5, y: position.y + arrowSizeV } // down corner
        ];
        draw.polyline(verts, false, color, 1.0);
    };
    /**
     * Destroys this helper by removing all previously installed vertex listeners.
     */
    BezierResizeHelper.prototype.destroy = function () {
        this.topResizeHandle.listeners.removeDragStartListener(this.__listeners[0]);
        this.topResizeHandle.listeners.removeDragEndListener(this.__listeners[1]);
        this.leftResizeHandle.listeners.removeDragStartListener(this.__listeners[2]);
        this.leftResizeHandle.listeners.removeDragEndListener(this.__listeners[3]);
        this.bottomResizeHandle.listeners.removeDragStartListener(this.__listeners[4]);
        this.bottomResizeHandle.listeners.removeDragEndListener(this.__listeners[5]);
        this.rightResizeHandle.listeners.removeDragStartListener(this.__listeners[6]);
        this.rightResizeHandle.listeners.removeDragEndListener(this.__listeners[7]);
    };
    /**
     * Install all required drag-start and drag-end listeners.
     */
    BezierResizeHelper.prototype.__installListeners = function (_self, pb, bezierPath, updateCallback) {
        var listeners = [];
        listeners.push(_self.topResizeHandle.listeners.addDragStartListener(function (e) {
            var relPos = pb.transformMousePosition(e.params.draggedFrom.x, e.params.draggedFrom.y);
            _self.topHandleDragStartPosition = relPos;
        }));
        listeners.push(_self.topResizeHandle.listeners.addDragEndListener(function (e) {
            var relTargetPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
            var targetHeightDifference = _self.topHandleDragStartPosition.y - relTargetPos.y;
            _self.__changePathHeightTop(bezierPath, targetHeightDifference);
            _self.updateResizeHandles();
            _self.topHandleDragStartPosition = null;
            updateCallback();
        }));
        listeners.push(_self.leftResizeHandle.listeners.addDragStartListener(function (e) {
            var relPos = pb.transformMousePosition(e.params.draggedFrom.x, e.params.draggedFrom.y);
            _self.leftHandleDragStartPosition = relPos;
        }));
        listeners.push(_self.leftResizeHandle.listeners.addDragEndListener(function (e) {
            var relTargetPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
            var targetWidthDifference = _self.leftHandleDragStartPosition.x - relTargetPos.x;
            _self.__changePathWidthLeft(bezierPath, targetWidthDifference);
            _self.updateResizeHandles();
            _self.leftHandleDragStartPosition = null;
            updateCallback();
        }));
        listeners.push(_self.bottomResizeHandle.listeners.addDragStartListener(function (e) {
            var relPos = pb.transformMousePosition(e.params.draggedFrom.x, e.params.draggedFrom.y);
            _self.bottomHandleDragStartPosition = relPos;
        }));
        listeners.push(_self.bottomResizeHandle.listeners.addDragEndListener(function (e) {
            var relTargetPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
            var targetHeightDifference = relTargetPos.y - _self.bottomHandleDragStartPosition.y;
            _self.__changePathHeightBottom(bezierPath, targetHeightDifference);
            _self.updateResizeHandles();
            _self.bottomHandleDragStartPosition = null;
            updateCallback();
        }));
        listeners.push(_self.rightResizeHandle.listeners.addDragStartListener(function (e) {
            var relPos = pb.transformMousePosition(e.params.draggedFrom.x, e.params.draggedFrom.y);
            _self.rightHandleDragStartPosition = relPos;
        }));
        listeners.push(_self.rightResizeHandle.listeners.addDragEndListener(function (e) {
            var relTargetPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
            var targetWidthDifference = relTargetPos.x - _self.rightHandleDragStartPosition.x;
            _self.__changePathWidthRight(bezierPath, targetWidthDifference);
            _self.updateResizeHandles();
            _self.rightHandleDragStartPosition = null;
            updateCallback();
        }));
        return listeners;
    };
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} heightAmount - The height difference to apply. Can be positive or negative or zero.
     */
    BezierResizeHelper.prototype.__changePathHeightTop = function (bezierPath, heightAmount) {
        var bounds = bezierPath.getBounds();
        var scaleAnchor = bounds.max;
        var verticalScaleFactor = (bounds.height + heightAmount) / bounds.height;
        bezierPath.scaleXY({ x: 1.0, y: verticalScaleFactor }, scaleAnchor);
    };
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} widthAmount - The width difference to apply. Can be positive or negative or zero.
     */
    BezierResizeHelper.prototype.__changePathWidthLeft = function (bezierPath, widthAmount) {
        var bounds = bezierPath.getBounds();
        var scaleAnchor = bounds.max;
        var horizontalScaleFactor = (bounds.width + widthAmount) / bounds.width;
        bezierPath.scaleXY({ x: horizontalScaleFactor, y: 1.0 }, scaleAnchor);
    };
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} heightAmount - The height difference to apply. Can be positive or negative or zero.
     */
    BezierResizeHelper.prototype.__changePathHeightBottom = function (bezierPath, heightAmount) {
        var bounds = bezierPath.getBounds();
        var scaleAnchor = bounds.min;
        var verticalScaleFactor = (bounds.height + heightAmount) / bounds.height;
        bezierPath.scaleXY({ x: 1.0, y: verticalScaleFactor }, scaleAnchor);
    };
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} widthAmount - The width difference to apply. Can be positive or negative or zero.
     */
    BezierResizeHelper.prototype.__changePathWidthRight = function (bezierPath, widthAmount) {
        var bounds = bezierPath.getBounds();
        var scaleAnchor = bounds.min;
        var horizontalScaleFactor = (bounds.width + widthAmount) / bounds.width;
        bezierPath.scaleXY({ x: horizontalScaleFactor, y: 1.0 }, scaleAnchor);
    };
    /**
     * Set the handles to the new position after the path was resized.
     */
    BezierResizeHelper.prototype.updateResizeHandles = function () {
        var bounds = this.bezierPath.getBounds();
        this.leftResizeHandle.set(bounds.min.x, bounds.min.y + bounds.height / 2.0);
        this.topResizeHandle.set(bounds.min.x + bounds.width / 2.0, bounds.min.y);
        this.rightResizeHandle.set(bounds.max.x, bounds.min.y + bounds.height / 2.0);
        this.bottomResizeHandle.set(bounds.min.x + bounds.width / 2.0, bounds.max.y);
    };
    return BezierResizeHelper;
}()); // END class
exports.BezierResizeHelper = BezierResizeHelper;
//# sourceMappingURL=BezierResizeHelper.js.map