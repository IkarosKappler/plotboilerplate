"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2018-11-11 (Alaaf)
 * @modified 2020-03-28 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-07-28 Changed the `delete` key code from 8 to 46.
 * @modified 2020-10-04 Changed `window` to `globalThis`.
 * @modified 2020-10-04 Added extended JSDoc.
 * @modified 2022-02-02 Added the `destroy` method.
 * @version  1.1.0
 *
 * @file KeyHandler
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyHandler = void 0;
/**
 * @classdesc A generic key handler.
 *
 * Example
 * =======
 * @example
 *      // Javascript
 *	new KeyHandler( { trackAll : true } )
 *	    .down('enter',function() { console.log('ENTER was hit.'); } )
 *	    .press('enter',function() { console.log('ENTER was pressed.'); } )
 *	    .up('enter',function() { console.log('ENTER was released.'); } )
 *
 *          .down('e',function() { console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } )
 *
 *	    .up('windows',function() { console.log('windows was released.'); } )
 *	;
 */
var KeyHandler = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @instance
     * @memberof KeyHandler
     * @param {HTMLElement} options.element (optional) The HTML element to listen on; if null then 'window' will be used.
     * @param {boolean} options.trackAll (optional) Set to true if you want to keep track of _all_ keys (keyStatus).
     **/
    function KeyHandler(options) {
        this.downListeners = [];
        this.pressListeners = [];
        this.upListeners = [];
        this.keyStates = {};
        options = options || {};
        this.element = options.element ? options.element : globalThis;
        this.downListeners = [];
        this.pressListeners = [];
        this.upListeners = [];
        this.keyStates = [];
        // This could be made configurable in a later version. It allows to
        // keep track of the key status no matter if there are any listeners
        // on the key or not.
        this.trackAllKeys = options.trackAll || false;
        // Install the listeners
        this.installListeners();
    }
    /**
     * A helper function to fire key events from this KeyHandler.
     *
     * @param {KeyboardEvent} event - The key event to fire.
     * @param {Array<XKeyListener>} listener - The listeners to fire to.
     */
    KeyHandler.prototype.fireEvent = function (event, listeners) {
        var hasListener = false;
        for (var i in listeners) {
            var lis = listeners[i];
            if (lis.keyCode != event.keyCode)
                continue;
            lis.listener(event);
            hasListener = true;
        }
        return hasListener;
    };
    /**
     * Internal function to fire a new keydown event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @name fireDownEvent
     * @memberof KeyHandler
     * @instance
     * @private
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     * @return {void}
     */
    KeyHandler.prototype.fireDownEvent = function (e, handler) {
        if (handler.fireEvent(e, handler.downListeners) || handler.trackAllKeys) {
            // Down event has listeners. Update key state.
            handler.keyStates[e.keyCode] = "down";
        }
    };
    /**
     * Internal function to fire a new keypress event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @name firePressEvent
     * @memberof KeyHandler
     * @instance
     * @private
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     * @return void
     */
    KeyHandler.prototype.firePressEvent = function (e, handler) {
        handler.fireEvent(e, handler.pressListeners);
    };
    /**
     * Internal function to fire a new keyup event to all listeners.
     * You should not call this function on your own unless you know what you do.
     *
     * @name fireUpEvent
     * @memberof KeyHandler
     * @instance
     * @private
     * @param {KeyboardEvent} e
     * @param {KeyHandler} handler
     * @return {void}
     */
    KeyHandler.prototype.fireUpEvent = function (e, handler) {
        if (handler.fireEvent(e, handler.upListeners) || handler.trackAllKeys) {
            // Up event has listeners. Clear key state.
            delete handler.keyStates[e.keyCode];
        }
    };
    /**
     * Resolve the key/name code.
     */
    KeyHandler.key2code = function (key) {
        if (typeof key == "number")
            return key;
        if (typeof key != "string")
            throw "Unknown key name or key type (should be a string or integer): " + key;
        if (KeyHandler.KEY_CODES[key])
            return KeyHandler.KEY_CODES[key];
        throw "Unknown key (cannot resolve key code): " + key;
    };
    /**
     * Install the required listeners into the initially passed element.
     *
     * By default the listeners are installed into the root element specified on
     * construction (or 'window').
     */
    KeyHandler.prototype.installListeners = function () {
        var _self = this;
        this.element.addEventListener("keydown", (this._keyDownListener = function (e) {
            _self.fireDownEvent(e, _self);
        }));
        this.element.addEventListener("keypress", (this._keyPressListener = function (e) {
            _self.firePressEvent(e, _self);
        }));
        this.element.addEventListener("keyup", (this._keyUpListener = function (e) {
            _self.fireUpEvent(e, _self);
        }));
    };
    /**
     *  Remove all installed event listeners from the underlying element.
     */
    KeyHandler.prototype.releaseListeners = function () {
        this.element.removeEventListener("keydown", this._keyDownListener);
        this.element.removeEventListener("keypress", this._keyPressListener);
        this.element.removeEventListener("keyup", this._keyUpListener);
    };
    /**
     * Listen for key down. This function allows chaining.
     *
     * Example: new KeyHandler().down('enter',function() {console.log('Enter hit.')});
     *
     * @name down
     * @memberof KeyHandler
     * @instance
     * @param {string|number} key -  Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void} e -  The callback to be triggered.
     * @return {KeyHandler} this
     */
    KeyHandler.prototype.down = function (key, listener) {
        this.downListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    };
    /**
     * Listen for key press.
     *
     * Example: new KeyHandler().press('enter',function() {console.log('Enter pressed.')});
     *
     * @name press
     * @memberof KeyHandler
     * @instance
     * @param {string|number} key - Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void} listener - The callback to be triggered.
     * @return {KeyHandler} this
     */
    KeyHandler.prototype.press = function (key, listener) {
        this.pressListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    };
    /**
     * Listen for key up.
     *
     * Example: new KeyHandler().up('enter',function() {console.log('Enter released.')});
     *
     * @name up
     * @memberof KeyHandler
     * @instance
     * @param {string} key - Any key identifier, key code or one from the KEY_CODES list.
     * @param {(e:KeyboardEvent)=>void)} e - The callback to be triggered.
     * @return {KeyHandler} this
     */
    KeyHandler.prototype.up = function (key, listener) {
        this.upListeners.push({ key: key, keyCode: KeyHandler.key2code(key), listener: listener });
        return this;
    };
    /**
     * Check if a specific key is currently held pressed.
     *
     * @param {string|number} key - Any key identifier, key code or one from the KEY_CODES list.
     */
    KeyHandler.prototype.isDown = function (key) {
        if (typeof key == "number")
            return this.keyStates[key] ? true : false;
        else
            return this.keyStates[KeyHandler.key2code(key)] ? true : false;
    };
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used any more.
     */
    KeyHandler.prototype.destroy = function () {
        this.releaseListeners();
    };
    /**
     * Source:
     * https://keycode.info/
     */
    // prettier-ignore
    KeyHandler.KEY_CODES = {
        'break': 3,
        'backspace': 8,
        // 'delete'	 : 8, // alternate: 46
        'tab': 9,
        'clear': 12,
        'enter': 13,
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'pause': 19,
        // 'break'	         : 19,
        'capslock': 20,
        'hangul': 21,
        'hanja': 25,
        'escape': 27,
        'conversion': 28,
        'non-conversion': 29,
        'spacebar': 32,
        'pageup': 33,
        'pagedown': 34,
        'end': 35,
        'home': 36,
        'leftarrow': 37,
        'uparrow': 38,
        'rightarrow': 39,
        'downarrow': 40,
        'select': 41,
        'print': 42,
        'execute': 43,
        'printscreen': 44,
        'insert': 45,
        'delete': 46,
        'help': 47,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        ':': 58,
        'semicolon (firefox)': 59,
        'equals': 59,
        '<': 60,
        'equals (firefox)': 61,
        'ß': 63,
        '@ (firefox)': 64,
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,
        'windows': 91,
        'leftcommand': 91,
        'chromebooksearch': 91,
        'rightwindowkey': 92,
        'windowsmenu': 93,
        'rightcommant': 93,
        'sleep': 95,
        'numpad0': 96,
        'numpad1': 97,
        'numpad2': 98,
        'numpad3': 99,
        'numpad4': 100,
        'numpad5': 101,
        'numpad6': 102,
        'numpad7': 103,
        'numpad8': 104,
        'numpad9': 105,
        'multiply': 106,
        'add': 107,
        'numpadperiod': 108,
        'subtract': 109,
        'decimalpoint': 110,
        'divide': 111,
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123,
        'f13': 124,
        'f14': 125,
        'f15': 126,
        'f16': 127,
        'f17': 128,
        'f18': 129,
        'f19': 130,
        'f20': 131,
        'f21': 132,
        'f22': 133,
        'f23': 134,
        'f24': 135,
        'numlock': 144,
        'scrolllock': 145,
        '^': 160,
        '!': 161,
        // '؛' 	 : 162 // (arabic semicolon)
        '#': 163,
        '$': 164,
        'ù': 165,
        'pagebackward': 166,
        'pageforward': 167,
        'refresh': 168,
        'closingparen': 169,
        '*': 170,
        '~+*': 171,
        // 'home'	         : 172,
        'minus': 173,
        // 'mute'           : 173,
        // 'unmute'	 : 173,
        'decreasevolumelevel': 174,
        'increasevolumelevel': 175,
        'next': 176,
        'previous': 177,
        'stop': 178,
        'play/pause': 179,
        'email': 180,
        'mute': 181,
        'unmute': 181,
        //'decreasevolumelevel'	182 // firefox
        //'increasevolumelevel'	183 // firefox
        'semicolon': 186,
        'ñ': 186,
        'equal': 187,
        'comma': 188,
        'dash': 189,
        'period': 190,
        'forwardslash': 191,
        'ç': 191,
        'grave accent': 192,
        //'ñ' 192,
        'æ': 192,
        'ö': 192,
        '?': 193,
        '/': 193,
        '°': 193,
        // 'numpadperiod'	 : 194, // chrome
        'openbracket': 219,
        'backslash': 220,
        'closebracket': 221,
        'å': 221,
        'singlequote': 222,
        'ø': 222,
        'ä': 222,
        '`': 223,
        // 'left or right ⌘ key (firefox)'	224
        'altgr': 225,
        // '< /git >, left back slash'	226
        'GNOME Compose Key': 230,
        'XF86Forward': 233,
        'XF86Back': 234,
        'alphanumeric': 240,
        'hiragana': 242,
        'katakana': 242,
        'half-width': 243,
        'full-width': 243,
        'kanji': 244,
        'unlocktrackpad': 251,
        'toggletouchpad': 255
    };
    return KeyHandler;
}());
exports.KeyHandler = KeyHandler;
//# sourceMappingURL=KeyHandler.js.map