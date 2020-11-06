"use strict";
/**
 * @classdesc A simple mouse handler for demos.
 * Use to avoid load massive libraries like jQuery.
 *
 *
 * @author   Ikaros Kappler
 * @date     2018-03-19
 * @modified 2018-04-28 Added the param 'wasDragged'.
 * @modified 2018-08-16 Added the param 'dragAmount'.
 * @modified 2018-08-27 Added the param 'element'.
 * @modified 2018-11-11 Changed the scope from a simple global var to a member of window/_context.
 * @modified 2018-11-19 Renamed the 'mousedown' function to 'down' and the 'mouseup' function to 'up'.
 * @modified 2018-11-28 Added the 'wheel' listener.
 * @modified 2018-12-09 Cleaned up some code.
 * @modified 2019-02-10 Cleaned up some more code.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-04-08 Fixed the click event (internally fired a 'mouseup' event) (1.0.10)
 * @modified 2020-04-08 Added the optional 'name' property. (1.0.11)
 * @modified 2020-04-08 The new version always installs internal listenrs to track drag events even
 *                      if there is no external drag listener installed (1.1.0).
 * @modified 2020-10-04 Added extended JSDoc comments.
 * @version  1.1.1
 *
 * @file MouseHandler
 * @public
 **/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MouseHandler = /** @class */ (function () {
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * Usage
     * =====
     * @example
     *   // Javascript
     *   new MouseHandler( document.getElementById('mycanvas') )
     *	    .drag( function(e) {
     *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
     *		if( e.params.leftMouse ) ;
     *		else if( e.params.rightMouse ) ;
     *	    } )
     *	    .move( function(e) {
     *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
     *	    } )
     *          .up( function(e) {
     *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
     *          } )
     *          .down( function(e) {
     *              console.log( 'Mouse down.' );
     *          } )
     *          .click( function(e) {
     *              console.log( 'Click.' );
     *          } )
     *          .wheel( function(e) {
     *              console.log( 'Wheel. delta='+e.deltaY );
     *          } )
     *
     * @example
     *   // Typescript
     *   new MouseHandler( document.getElementById('mycanvas') )
     *	    .drag( (e:XMouseEvent) => {
     *		console.log( 'Mouse dragged: ' + JSON.stringify(e) );
     *		if( e.params.leftMouse ) ;
     *		else if( e.params.rightMouse ) ;
     *	    } )
     *	    .move( (e:XMouseEvent) => {
     *		console.log( 'Mouse moved: ' + JSON.stringify(e.params) );
     *	    } )
     *          .up( (e:XMouseEvent) => {
     *              console.log( 'Mouse up. Was dragged?', e.params.wasDragged );
     *          } )
     *          .down( (e:XMouseEvent) => {
     *              console.log( 'Mouse down.' );
     *          } )
     *          .click( (e:XMouseEvent) => {
     *              console.log( 'Click.' );
     *          } )
     *          .wheel( (e:XWheelEvent) => {
     *              console.log( 'Wheel. delta='+e.deltaY );
     *          } )
     *
     * @constructor
     * @instance
     * @memberof MouseHandler
     * @param {HTMLElement} element
     **/
    function MouseHandler(element, name) {
        this.mouseDownPos = undefined;
        this.mouseDragPos = undefined;
        this.mousePos = undefined;
        this.mouseButton = -1;
        this.listeners = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Some private vars to store the current mouse/position/button state.
        // +-------------------------------------------------
        this.name = name;
        this.element = element;
        this.mouseDownPos = null;
        this.mouseDragPos = null;
        this.mousePos = null;
        this.mouseButton = -1;
        this.listeners = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Define the internal event handlers.
        // |
        // | They will dispatch the modified event (relative mouse position,
        // | drag offset, ...) to the callbacks.
        // +-------------------------------------------------
        var _self = this;
        this.handlers['mousemove'] = function (e) {
            if (_self.listeners.mousemove)
                _self.listeners.mousemove(_self.mkParams(e, 'mousemove'));
            if (_self.mouseDragPos && _self.listeners.drag)
                _self.listeners.drag(_self.mkParams(e, 'drag'));
            if (_self.mouseDownPos)
                _self.mouseDragPos = _self.relPos(e);
        };
        this.handlers['mouseup'] = function (e) {
            if (_self.listeners.mouseup)
                _self.listeners.mouseup(_self.mkParams(e, 'mouseup'));
            _self.mouseDragPos = undefined;
            _self.mouseDownPos = undefined;
            _self.mouseButton = -1;
        };
        this.handlers['mousedown'] = function (e) {
            _self.mouseDragPos = _self.relPos(e);
            _self.mouseDownPos = _self.relPos(e);
            _self.mouseButton = e.button;
            if (_self.listeners.mousedown)
                _self.listeners.mousedown(_self.mkParams(e, 'mousedown'));
        };
        this.handlers['click'] = function (e) {
            if (_self.listeners.click)
                _self.listeners.click(_self.mkParams(e, 'click'));
        };
        this.handlers['wheel'] = function (e) {
            if (_self.listeners.wheel)
                _self.listeners.wheel(_self.mkParams(e, 'wheel'));
        };
        this.element.addEventListener('mousemove', this.handlers['mousemove']);
        this.element.addEventListener('mouseup', this.handlers['mouseup']);
        this.element.addEventListener('mousedown', this.handlers['mousedown']);
        this.element.addEventListener('click', this.handlers['click']);
        this.element.addEventListener('wheel', this.handlers['wheel']);
    }
    /**
     * Get relative position from the given MouseEvent.
     *
     * @name relPos
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {MouseEvent} e - The mouse event to get the relative position for.
     * @return {XYCoords} The relative mouse coordinates.
     */
    MouseHandler.prototype.relPos = function (e) {
        return { x: e.offsetX,
            y: e.offsetY // e.pageY - e.target.offsetTop
        };
    };
    ;
    /**
     * Build the extended event params.
     *
     * @name mkParams
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {MouseEvent} e - The mouse event to get the relative position for.
     * @param {string} eventName - The name of the firing event.
     * @return {XMouseEvent}
     */
    MouseHandler.prototype.mkParams = function (e, eventName) {
        var rel = this.relPos(e);
        var xEvent = e;
        xEvent.params = {
            element: this.element,
            name: eventName,
            pos: rel,
            button: this.mouseButton,
            leftButton: this.mouseButton == 0,
            middleButton: this.mouseButton == 1,
            rightButton: this.mouseButton == 2,
            mouseDownPos: this.mouseDownPos,
            draggedFrom: this.mouseDragPos,
            wasDragged: (this.mouseDownPos != null && (this.mouseDownPos.x != rel.x || this.mouseDownPos.y != rel.y)),
            dragAmount: (this.mouseDownPos != null ? { x: rel.x - this.mouseDragPos.x, y: rel.y - this.mouseDragPos.y } : { x: 0, y: 0 })
        };
        return xEvent;
    };
    /**
     * Install a new listener.
     * Please note that this mouse handler can only handle one listener per event type.
     *
     * @name listenFor
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} eventName - The name of the firing event to listen for.
     * @return {void}
     */
    MouseHandler.prototype.listenFor = function (eventName) {
        if (this.installed[eventName])
            return;
        // In the new version 1.1.0 has all internal listeners installed by default.
        this.installed[eventName] = true;
    };
    /**
     * Un-install a new listener.
     *
     * @name listenFor
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} eventName - The name of the firing event to unlisten for.
     * @return {void}
     */
    MouseHandler.prototype.unlistenFor = function (eventName) {
        if (!this.installed[eventName])
            return;
        // In the new version 1.1.0 has all internal listeners installed by default.
        delete this.installed[eventName];
    };
    /**
     * Installer function to listen for a specific event: mouse-drag.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name drag
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The drag-callback to listen for.
     * @return {MouseHandler} this
     */
    MouseHandler.prototype.drag = function (callback) {
        if (this.listeners.drag)
            this.throwAlreadyInstalled('drag');
        this.listeners.drag = callback;
        this.listenFor('mousedown');
        this.listenFor('mousemove');
        this.listenFor('mouseup');
        //listeners.drag = callback;
        return this;
    };
    ;
    /**
     * Installer function to listen for a specific event: mouse-move.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name move
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The move-callback to listen for.
     * @return {MouseHandler} this
     */
    MouseHandler.prototype.move = function (callback) {
        if (this.listeners.mousemove)
            this.throwAlreadyInstalled('mousemove');
        this.listenFor('mousemove');
        this.listeners.mousemove = callback;
        return this;
    };
    ;
    /**
     * Installer function to listen for a specific event: mouse-up.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name up
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The up-callback to listen for.
     * @return {MouseHandler} this
     */
    MouseHandler.prototype.up = function (callback) {
        if (this.listeners.mouseup)
            this.throwAlreadyInstalled('mouseup');
        this.listenFor('mouseup');
        this.listeners.mouseup = callback;
        return this;
    };
    ;
    /**
     * Installer function to listen for a specific event: mouse-down.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name down
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The down-callback to listen for.
     * @return {MouseHandler} this
     */
    MouseHandler.prototype.down = function (callback) {
        if (this.listeners.mousedown)
            this.throwAlreadyInstalled('mousedown');
        this.listenFor('mousedown');
        this.listeners.mousedown = callback;
        return this;
    };
    ;
    /**
     * Installer function to listen for a specific event: mouse-click.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name click
     * @memberof MouseHandler
     * @instance
     * @param {XMouseCallback} callback - The click-callback to listen for.
     * @return {MouseHandler} this
     */
    MouseHandler.prototype.click = function (callback) {
        if (this.listeners.click)
            this.throwAlreadyInstalled('click');
        this.listenFor('click');
        this.listeners.click = callback;
        return this;
    };
    ;
    /**
     * Installer function to listen for a specific event: mouse-wheel.
     * Pass your callbacks here.
     *
     * Note: this support chaining.
     *
     * @name wheel
     * @memberof MouseHandler
     * @instance
     * @param {XWheelCallback} callback - The wheel-callback to listen for.
     * @return {MouseHandler} this
     */
    MouseHandler.prototype.wheel = function (callback) {
        if (this.listeners.wheel)
            this.throwAlreadyInstalled('wheel');
        this.listenFor('wheel');
        this.listeners.wheel = callback;
        return this;
    };
    ;
    /**
     * An internal function to throw events.
     *
     * @name throwAlreadyInstalled
     * @memberof MouseHandler
     * @instance
     * @private
     * @param {string} name - The name of the event.
     * @return {void}
     */
    MouseHandler.prototype.throwAlreadyInstalled = function (name) {
        throw "This MouseHandler already has a '" + name + "' callback. To keep the code simple there is only room for one.";
    };
    ;
    /**
     * Call this when your work is done.
     *
     * The function will un-install all event listeners.
     *
     * @name destroy
     * @memberof MouseHandler
     * @instance
     * @private
     * @return {void}
     */
    MouseHandler.prototype.destroy = function () {
        this.unlistenFor('mousedown');
        this.unlistenFor('mousemove');
        this.unlistenFor('moseup');
        this.unlistenFor('click');
        this.unlistenFor('wheel');
        this.element.removeEventListener('mousemove', this.handlers['mousemove']);
        this.element.removeEventListener('mouseup', this.handlers['mousedown']);
        this.element.removeEventListener('mousedown', this.handlers['mousedown']);
        this.element.removeEventListener('click', this.handlers['click']);
        this.element.removeEventListener('wheel', this.handlers['wheel']);
    };
    return MouseHandler;
}());
exports.MouseHandler = MouseHandler;
var XMouseEvent = /** @class */ (function (_super) {
    __extends(XMouseEvent, _super);
    function XMouseEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XMouseEvent;
}(MouseEvent));
exports.XMouseEvent = XMouseEvent;
var XWheelEvent = /** @class */ (function (_super) {
    __extends(XWheelEvent, _super);
    function XWheelEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XWheelEvent;
}(WheelEvent));
exports.XWheelEvent = XWheelEvent;
//# sourceMappingURL=MouseHandler.js.map