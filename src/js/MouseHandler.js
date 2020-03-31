/**
 * A simple mouse handler for demos.
 * Use to avoid load massive libraries like jQuery.
 *
 * Usage:
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
 *              console.log( 'Mouse up.' );
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
 * @version  1.0.9
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
var XMouseEvent = /** @class */ (function (_super) {
    __extends(XMouseEvent, _super);
    function XMouseEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XMouseEvent;
}(MouseEvent));
var XWheelEvent = /** @class */ (function (_super) {
    __extends(XWheelEvent, _super);
    function XWheelEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XWheelEvent;
}(WheelEvent));
var MouseHandler = /** @class */ (function () {
    // private wheelHandlers  : Record<string,(e:XWheelEvent)=>void> = {};
    /**
     * The constructor.
     *
     * Pass the DOM element you want to receive mouse events from.
     *
     * @param {HTMLElement} element
     **/
    function MouseHandler(element) {
        this.mouseDownPos = null;
        this.mouseDragPos = null;
        this.mousePos = null;
        this.mouseButton = -1;
        this.listeners = {};
        // private wheelListeners : Record<string,(e:XWheelEvent)=>void> = {};
        this.installed = {};
        this.handlers = {};
        // +----------------------------------------------------------------------
        // | Some private vars to store the current mouse/position/button state.
        // +-------------------------------------------------
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
            _self.mouseDragPos = null;
            _self.mouseDownPos = null;
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
                _self.listeners.click(_self.mkParams(e, 'mousedown'));
        };
        this.handlers['wheel'] = function (e) {
            if (_self.listeners.wheel)
                _self.listeners.wheel(_self.mkParams(e, 'wheel'));
        };
    }
    // +----------------------------------------------------------------------
    // | Some private vars to store the current mouse/position/button state.
    // +-------------------------------------------------
    MouseHandler.prototype.relPos = function (e) {
        return { x: e.offsetX,
            y: e.offsetY // e.pageY - e.target.offsetTop
        };
    };
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
    MouseHandler.prototype.listenFor = function (eventName) {
        if (this.installed[eventName])
            return;
        this.element.addEventListener(eventName, this.handlers[eventName]);
        this.installed[eventName] = true;
    };
    MouseHandler.prototype.unlistenFor = function (eventName) {
        if (!this.installed[eventName])
            return;
        this.element.removeEventListener(eventName, this.handlers[eventName]);
        delete this.installed[eventName];
    };
    // +----------------------------------------------------------------------
    // | The installer functions.
    // |
    // | Pass your callbacks here.
    // | Note: they support chaining.
    // +-------------------------------------------------
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
    MouseHandler.prototype.move = function (callback) {
        if (this.listeners.mousemove)
            this.throwAlreadyInstalled('mousemove');
        this.listenFor('mousemove');
        this.listeners.mousemove = callback;
        return this;
    };
    ;
    MouseHandler.prototype.up = function (callback) {
        if (this.listeners.mouseup)
            this.throwAlreadyInstalled('mouseup');
        this.listenFor('mouseup');
        this.listeners.mouseup = callback;
        return this;
    };
    ;
    MouseHandler.prototype.down = function (callback) {
        if (this.listeners.mousedown)
            this.throwAlreadyInstalled('mousedown');
        this.listenFor('mousedown');
        this.listeners.mousedown = callback;
        return this;
    };
    ;
    MouseHandler.prototype.click = function (callback) {
        if (this.listeners.click)
            this.throwAlreadyInstalled('click');
        this.listenFor('click');
        this.listeners.click = callback;
        return this;
    };
    ;
    MouseHandler.prototype.wheel = function (callback) {
        if (this.listeners.wheel)
            this.throwAlreadyInstalled('wheel');
        this.listenFor('wheel');
        this.listeners.wheel = callback;
        return this;
    };
    ;
    MouseHandler.prototype.throwAlreadyInstalled = function (name) {
        throw "This MouseHandler already has a '" + name + "' callback. To keep the code simple there is only room for one.";
    };
    // +----------------------------------------------------------------------
    // | Call this when your work is done.
    // |
    // | The function will un-install all event listeners.
    // +-------------------------------------------------
    MouseHandler.prototype.destroy = function () {
        this.unlistenFor('mousedown');
        this.unlistenFor('mousemove');
        this.unlistenFor('moseup');
        this.unlistenFor('click');
        this.unlistenFor('wheel');
    };
    return MouseHandler;
}());
//# sourceMappingURL=MouseHandler.js.map