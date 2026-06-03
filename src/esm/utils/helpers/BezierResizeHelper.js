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
import { Vertex } from "../../Vertex";
// A closure to hide helper functions.
export class BezierResizeHelper {
    /**
     * The constructor.
     *
     * @param {PlotBoilerplate} pb
     * @param {BezierPath} bezierPath
     * @param {function} updateCallback
     */
    constructor(pb, bezierPath, updateCallback) {
        this.pb = pb;
        this.bezierPath = bezierPath;
        // @public
        this.topResizeHandle = new Vertex(0, 0);
        this.leftResizeHandle = new Vertex(0, 0);
        this.bottomResizeHandle = new Vertex(0, 0);
        this.rightResizeHandle = new Vertex(0, 0);
        // @private
        this.topHandleDragStartPosition = null;
        this.leftHandleDragStartPosition = null;
        this.bottomHandleDragStartPosition = null;
        this.rightHandleDragStartPosition = null;
        this.__listeners = this.__installListeners(this, pb, bezierPath, updateCallback);
        this.updateResizeHandles();
    }
    draw(draw, fill) {
        this.drawHandleLines(draw, fill, "grey");
        this.drawTriangles(draw, fill, "rgba(0,192,192,1.0)");
    }
    /**
     * Call this method from the outside to see active helper lines for those edges
     * that are currently dragged.
     *
     * @param {DrawLib<any>} draw
     * @param {DrawLib<any>} fill
     * @param {string} lineColor
     */
    drawHandleLines(draw, fill, lineColor) {
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
    }
    drawTriangles(draw, _fill, color) {
        // this.__drawUpTriangle(draw, this.topResizeHandle, color);
        // this.__drawDownTriangle(draw, this.bottomResizeHandle, color);
        // this.__drawLeftTriangle(draw, this.leftResizeHandle, color);
        // this.__drawRightTriangle(draw, this.rightResizeHandle, color);
        this.drawTopTriangle(draw, _fill, color);
        this.drawLeftTriangle(draw, _fill, color);
        this.drawBottomTriangle(draw, _fill, color);
        this.drawRightTriangle(draw, _fill, color);
    }
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawTopTriangle(draw, _fill, color) {
        this.__drawUpTriangle(draw, _fill, this.topResizeHandle, color);
    }
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawLeftTriangle(draw, _fill, color) {
        this.__drawLeftTriangle(draw, _fill, this.leftResizeHandle, color);
    }
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawBottomTriangle(draw, _fill, color) {
        this.__drawDownTriangle(draw, _fill, this.bottomResizeHandle, color);
    }
    /**
     * Draws an right-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    drawRightTriangle(draw, _fill, color) {
        this.__drawRightTriangle(draw, _fill, this.rightResizeHandle, color);
    }
    /**
     * Draws an up-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    __drawUpTriangle(draw, _fill, position, color) {
        const arrowSize = 6.0;
        const arrowSizeH = arrowSize / this.pb.config.scaleX;
        const arrowSizeV = arrowSize / this.pb.config.scaleY;
        const verts = [
            { x: position.x - arrowSizeH, y: position.y + arrowSizeV * 0.5 }, // left corner
            { x: position.x, y: position.y - arrowSizeV }, // up corner
            { x: position.x + arrowSizeH, y: position.y + arrowSizeV * 0.5 } // right corner
        ];
        draw.polyline(verts, false, color, 1.0);
    }
    /**
     * Draws an left-trinangle at the left handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    __drawLeftTriangle(draw, _fill, position, color) {
        const arrowSize = 6.0;
        const arrowSizeH = arrowSize / this.pb.config.scaleX;
        const arrowSizeV = arrowSize / this.pb.config.scaleY;
        const verts = [
            { x: position.x - arrowSizeH, y: position.y }, // left corner
            { x: position.x + arrowSizeH * 0.5, y: position.y - arrowSizeV }, // up corner
            { x: position.x + arrowSizeH * 0.5, y: position.y + arrowSizeV } // down corner
        ];
        draw.polyline(verts, false, color, 1.0);
    }
    /**
     * Draws a down-trinangle at the top handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    __drawDownTriangle(draw, _fill, position, color) {
        const arrowSize = 6.0;
        const arrowSizeH = arrowSize / this.pb.config.scaleX;
        const arrowSizeV = arrowSize / this.pb.config.scaleY;
        const verts = [
            { x: position.x + arrowSizeH, y: position.y - arrowSizeV * 0.5 }, // right corner
            { x: position.x, y: position.y + arrowSizeV }, // down corner
            { x: position.x - arrowSizeH, y: position.y - arrowSizeV * 0.5 } // left corner
        ];
        draw.polyline(verts, false, color, 1.0);
    }
    /**
     * Draws an left-trinangle at the left handle position.
     *
     * @param draw
     * @param position
     * @param color
     */
    __drawRightTriangle(draw, _fill, position, color) {
        const arrowSize = 6.0;
        const arrowSizeH = arrowSize / this.pb.config.scaleX;
        const arrowSizeV = arrowSize / this.pb.config.scaleY;
        const verts = [
            { x: position.x + arrowSizeH, y: position.y }, // left corner
            { x: position.x - arrowSizeH * 0.5, y: position.y - arrowSizeV }, // up corner
            { x: position.x - arrowSizeH * 0.5, y: position.y + arrowSizeV } // down corner
        ];
        draw.polyline(verts, false, color, 1.0);
    }
    /**
     * Destroys this helper by removing all previously installed vertex listeners.
     */
    destroy() {
        this.topResizeHandle.listeners.removeDragStartListener(this.__listeners[0]);
        this.topResizeHandle.listeners.removeDragEndListener(this.__listeners[1]);
        this.leftResizeHandle.listeners.removeDragStartListener(this.__listeners[2]);
        this.leftResizeHandle.listeners.removeDragEndListener(this.__listeners[3]);
        this.bottomResizeHandle.listeners.removeDragStartListener(this.__listeners[4]);
        this.bottomResizeHandle.listeners.removeDragEndListener(this.__listeners[5]);
        this.rightResizeHandle.listeners.removeDragStartListener(this.__listeners[6]);
        this.rightResizeHandle.listeners.removeDragEndListener(this.__listeners[7]);
    }
    /**
     * Install all required drag-start and drag-end listeners.
     */
    __installListeners(_self, pb, bezierPath, updateCallback) {
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
    }
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} heightAmount - The height difference to apply. Can be positive or negative or zero.
     */
    __changePathHeightTop(bezierPath, heightAmount) {
        const bounds = bezierPath.getBounds();
        const scaleAnchor = bounds.max;
        const verticalScaleFactor = (bounds.height + heightAmount) / bounds.height;
        bezierPath.scaleXY({ x: 1.0, y: verticalScaleFactor }, scaleAnchor);
    }
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} widthAmount - The width difference to apply. Can be positive or negative or zero.
     */
    __changePathWidthLeft(bezierPath, widthAmount) {
        const bounds = bezierPath.getBounds();
        const scaleAnchor = bounds.max;
        const horizontalScaleFactor = (bounds.width + widthAmount) / bounds.width;
        bezierPath.scaleXY({ x: horizontalScaleFactor, y: 1.0 }, scaleAnchor);
    }
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} heightAmount - The height difference to apply. Can be positive or negative or zero.
     */
    __changePathHeightBottom(bezierPath, heightAmount) {
        const bounds = bezierPath.getBounds();
        const scaleAnchor = bounds.min;
        const verticalScaleFactor = (bounds.height + heightAmount) / bounds.height;
        bezierPath.scaleXY({ x: 1.0, y: verticalScaleFactor }, scaleAnchor);
    }
    /**
     * @param {BezierPath} bezierPath - The path to update.
     * @param {number} widthAmount - The width difference to apply. Can be positive or negative or zero.
     */
    __changePathWidthRight(bezierPath, widthAmount) {
        const bounds = bezierPath.getBounds();
        const scaleAnchor = bounds.min;
        const horizontalScaleFactor = (bounds.width + widthAmount) / bounds.width;
        bezierPath.scaleXY({ x: horizontalScaleFactor, y: 1.0 }, scaleAnchor);
    }
    /**
     * Set the handles to the new position after the path was resized.
     */
    updateResizeHandles() {
        const bounds = this.bezierPath.getBounds();
        this.leftResizeHandle.set(bounds.min.x, bounds.min.y + bounds.height / 2.0);
        this.topResizeHandle.set(bounds.min.x + bounds.width / 2.0, bounds.min.y);
        this.rightResizeHandle.set(bounds.max.x, bounds.min.y + bounds.height / 2.0);
        this.bottomResizeHandle.set(bounds.min.x + bounds.width / 2.0, bounds.max.y);
    }
} // END class
//# sourceMappingURL=BezierResizeHelper.js.map