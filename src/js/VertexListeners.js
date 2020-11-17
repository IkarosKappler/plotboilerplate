"use strict";
/**
 * @classdesc An event listeners wrapper. This is just a set of three listener
 *              queues (drag, dragStart, dragEnd) and their respective firing
 *              functions.
 *
 * @author   Ikaros Kappler
 * @date     2018-08-27
 * @modified 2018-11-28 Added the vertex-param to the constructor and extended the event. Vertex events now have a 'params' attribute object.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2020-02-22 Added 'return this' to the add* functions (for chanining).
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-11-17 Added the `click` handler.
 * @version  1.1.0
 *
 * @file VertexListeners
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var VertexListeners = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name VertexListeners
     * @param {Vertex} vertex - The vertex to use these listeners on (just a backward reference).
     **/
    function VertexListeners(vertex) {
        this.click = [];
        this.drag = [];
        this.dragStart = [];
        this.dragEnd = [];
        this.vertex = vertex;
    }
    ;
    /**
     * Add a click listener.
     *
     * @method addClickListener
     * @param {VertexListeners~dragListener} listener - The click listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addClickListener = function (listener) {
        VertexListeners._addListener(this.click, listener);
        return this;
    };
    ;
    /**
     * The click listener is a function with a single drag event param.
     * @callback VertexListeners~clickListener
     * @param {Event} e - The (extended) click event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.removeClickListener = function (listener) {
        this.click = VertexListeners._removeListener(this.click, listener);
        return this;
    };
    ;
    /**
     * The click listener is a function with a single drag event param.
     * @callback VertexListeners~clickListener
     * @param {Event} e - The (extended) click event.
     */
    /**
     * Add a drag listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragListener = function (listener) {
        VertexListeners._addListener(this.drag, listener);
        return this;
    };
    ;
    /**
     * The drag listener is a function with a single drag event param.
     * @callback VertexListeners~dragListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a drag listener.
     *
     * @method removeDragListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.removeDragListener = function (listener) {
        this.drag = VertexListeners._removeListener(this.drag, listener);
        return this;
    };
    ;
    /**
     * Add a dragStart listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragStartListener} listener - The drag-start listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragStartListener = function (listener) {
        VertexListeners._addListener(this.dragStart, listener);
        return this;
    };
    ;
    /**
     * The drag-start listener is a function with a single drag event param.
     * @callback VertexListeners~dragStartListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
     * Remove a dragStart listener.
     *
     * @method addDragStartListener
     * @param {VertexListeners~dragListener} listener - The drag listener to remove (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.removeDragStartListener = function (listener) {
        this.dragStart = VertexListeners._removeListener(this.dragStart, listener);
        return this;
    };
    ;
    /**
     * Add a dragEnd listener.
     *
     * @method addDragListener
     * @param {VertexListeners~dragEndListener} listener - The drag-end listener to add (a callback).
     * @return {VertexListeners} this (for chaining)
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.addDragEndListener = function (listener) {
        // this.dragEnd.push( listener );
        VertexListeners._addListener(this.dragEnd, listener);
        return this;
    };
    ;
    /**
     * The drag-end listener is a function with a single drag event param.
     * @callback VertexListeners~dragEndListener
     * @param {Event} e - The (extended) drag event.
     */
    /**
    * Remove a drag listener.
    *
    * @method removeDragEndListener
    * @param {VertexListeners~clickListener} listener - The drag listener to remove (a callback).
    * @return {VertexListeners} this (for chaining)
    * @instance
    * @memberof VertexListeners
    **/
    VertexListeners.prototype.removeDragEndListener = function (listener) {
        // this.drag.push( listener );
        this.dragEnd = VertexListeners._removeListener(this.dragEnd, listener);
        return this;
    };
    ;
    /**
     * Fire a click event with the given event instance to all
     * installed click listeners.
     *
     * @method fireClickEvent
     * @param {VertEvent|XMouseEvent} e - The click event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireClickEvent = function (e) {
        VertexListeners._fireEvent(this, this.click, e);
    };
    ;
    /**
     * Fire a drag event with the given event instance to all
     * installed drag listeners.
     *
     * @method fireDragEvent
     * @param {VertEvent|XMouseEvent} e - The drag event itself to be fired to all installed drag listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragEvent = function (e) {
        VertexListeners._fireEvent(this, this.drag, e);
    };
    ;
    /**
     * Fire a dragStart event with the given event instance to all
     * installed drag-start listeners.
     *
     * @method fireDragStartEvent
     * @param {VertEvent|XMouseEvent} e - The drag-start event itself to be fired to all installed dragStart listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragStartEvent = function (e) {
        VertexListeners._fireEvent(this, this.dragStart, e);
    };
    ;
    /**
     * Fire a dragEnd event with the given event instance to all
     * installed drag-end listeners.
     *
     * @method fireDragEndEvent
     * @param {VertEvent|XMouseEvent} e - The drag-end event itself to be fired to all installed dragEnd listeners.
     * @return {void}
     * @instance
     * @memberof VertexListeners
     **/
    VertexListeners.prototype.fireDragEndEvent = function (e) {
        VertexListeners._fireEvent(this, this.dragEnd, e);
    };
    ;
    /**
     * @private
     **/
    VertexListeners._fireEvent = function (_self, listeners, e) {
        var ve = e;
        if (typeof ve.params == 'undefined')
            ve.params = { vertex: _self.vertex };
        else
            ve.params.vertex = _self.vertex;
        for (var i in listeners) {
            listeners[i](ve);
        }
    };
    ;
    /**
     * @private
     */
    VertexListeners._addListener = function (listeners, newListener) {
        for (var i in listeners) {
            if (listeners[i] == newListener)
                return false;
        }
        listeners.push(newListener);
        return true;
    };
    ;
    /**
     * @private
     */
    VertexListeners._removeListener = function (listeners, oldListener) {
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == oldListener)
                return listeners.splice(i, 1);
        }
        return listeners;
    };
    ;
    return VertexListeners;
}());
exports.VertexListeners = VertexListeners;
//# sourceMappingURL=VertexListeners.js.map