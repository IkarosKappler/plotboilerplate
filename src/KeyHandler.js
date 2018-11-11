/**
 * A generic key handler.
 *
 * Example
 * =======
 * 
 *	new KeyHandler()
 *	    .down('enter',function() { console.log('ENTER was hit.'); } )
 *	    .press('enter',function() { console.log('ENTER was pressed.'); } )
 *	    .up('enter',function() { console.log('ENTER was released.'); } )
 *
 *	    .down('e',function() { console.log('e was hit.'); } )
 *
 *	    .up('windows',function() { console.log('windows was released.'); } )
 *	;
 *
 * @author  Ikaros Kappler
 * @date    2018-11-11 (Alaaf)
 * @version 1.0.0
 **/

(function(_context) {
    'use strict';

    // +----------------------------------------------------------------------
    // | The constructor.
    // |
    // | @param element (optional) The HTML element to listen on; if null then 'window' will be used.
    // +-------------------------------------------------
    var KeyHandler = function( element ) {
	this.element = element ? element : window;
	this.downListeners = [];
	this.pressListeners = [];
	this.upListeners = [];
	this._keyDownListener = null;
	this._keyPressListener = null;
	this._keyUpListener = null;
	this.installListeners();
    };

    
    // +----------------------------------------------------------------------
    // | A helper function to fire key events from this KeyHandler.
    // +-------------------------------------------------
    var fireEvent = function( event, listeners ) {
	for( var i in listeners ) {
	    var lis = listeners[i];
	    if( lis.keyCode == event.keyCode )
		lis.listener(event);
	}
    };


    // +----------------------------------------------------------------------
    // | Resolve the key/name code.
    // +-------------------------------------------------
    var key2code = function( key ) {
	if( typeof key == 'number' ) 
	    return key;
	if( typeof key != 'string' )
	    throw "Unknown key name or key type (should be a string or integer): " + key;
	if( KeyHandler.KEY_CODES[key] )
	    return KeyHandler.KEY_CODES[key];
	throw "Unknown key (cannot resolve key code): " + key;
    };
    

    // +----------------------------------------------------------------------
    // | Source:
    // |    https://keycode.info/
    // +-------------------------------------------------
    KeyHandler.KEY_CODES = {
	'break'          : 3,
	'backspace'      : 8,
	'delete'	 : 8,
	'tab'	         : 9,
	'clear'	         : 12,
	'enter'	         : 13,
	'shift'	         : 16,
	'ctrl'	         : 17,
	'alt'	         : 18,
	'pause'          : 19,
	'break'	         : 19,
	'capslock'	 : 20,
	'hangul'	 : 21,
	'hanja'	         : 25,
	'escape'	 : 27,
	'conversion' 	 : 28,
	'non-conversion' : 29,
	'spacebar'	 : 32,
	'pageup'	 : 33,
	'pagedown'	 : 34,
	'end'	         : 35,
	'home'	         : 36,
	'leftarrow'	 : 37,
	'uparrow'	 : 38,
	'rightarrow'	 : 39,
	'downarrow'	 : 40,
	'select'	 : 41,
	'print'	         : 42,
	'execute'	 : 43,
	'printscreen'	 : 44,
	'insert'	 : 45,
	'delete'	 : 46,
	'help'	         : 47,
	'0'              : 48,
	'1'              : 49,
	'2'              : 50,
	'3'              : 51,
	'4'              : 52,
	'5'              : 53,
	'6'              : 54,
	'7'              : 55,
	'8'              : 56,
	'9'              : 57,
	':'              : 58,
	'semicolon (firefox)' : 59,
	'equals'	 : 59,
	'<'	         : 60,
	'equals (firefox)' : 61,
	'ß'	         : 63,
	'@ (firefox)'	 : 64,
	'a'	         : 65,
	'b'	         : 66,
	'c'	         : 67,
	'd'	         : 68,
	'e'	         : 69,
	'f'	         : 70,
	'g'	         : 71,
	'h'	         : 72,
	'i'	         : 73,
	'j'	         : 74,
	'k'	         : 75,
	'l'	         : 76,
	'm'	         : 77,
	'n'	         : 78,
	'o'	         : 79,
	'p'	         : 80,
	'q'	         : 81,
	'r'	         : 82,
	's'	         : 83,
	't'	         : 84,
	'u'	         : 85,
	'v'	         : 86,
	'w'	         : 87,
	'x'	         : 88,
	'y'	         : 89,
	'z'	         : 90,
	'windows'        : 91,
	'leftcommand'	 : 91, // left ⌘
	'chromebooksearch' : 91,
	'rightwindowkey' : 92,
	'windowsmenu'	 : 93,
	'rightcommant'   : 93, // right ⌘
	'sleep'	         : 95,
	'numpad0'	 : 96,
	'numpad1'	 : 97,
	'numpad2'	 : 98,
	'numpad3'	 : 99,
	'numpad4'	 : 100,
	'numpad5'	 : 101,
	'numpad6'	 : 102,
	'numpad7'	 : 103,
	'numpad8'	 : 104,
	'numpad9'	 : 105,
	'multiply'	 : 106,
	'add'	         : 107,
	'numpadperiod'	 : 108, // firefox
	'subtract'	 : 109,
	'decimalpoint'	 : 110,
	'divide'	 : 111,
	'f1'	         : 112,
	'f2'	         : 113,
	'f3'	         : 114,
	'f4'	         : 115,
	'f5'	         : 116,
	'f6'	         : 117,
	'f7'	         : 118,
	'f8'	         : 119,
	'f9'	         : 120,
	'f10'	         : 121,
	'f11'	         : 122,
	'f12'	         : 123,
	'f13'	         : 124,
	'f14'	         : 125,
	'f15'	         : 126,
	'f16'	         : 127,
	'f17'	         : 128,
	'f18'	         : 129,
	'f19'	         : 130,
	'f20'	         : 131,
	'f21'	         : 132,
	'f22'	         : 133,
	'f23'	         : 134,
	'f24'	         : 135,
	'numlock'	 : 144,
	'scrolllock'	 : 145,
	'^'	         : 160,
	'!'	         : 161,
	// '؛' 	 : 162 // (arabic semicolon)
	'#'	         : 163,
	'$'	         : 164,
	'ù'	         : 165,
	'pagebackward'	 : 166,
	'pageforward'	 : 167,
	'refresh'	 : 168,
	'closingparen'	 : 169, // (AZERTY)
	'*'         	 : 170,
	'~+*'	         : 171,
	'home'	         : 172,
	'minus'	         : 173, // firefox
	'mute'           : 173,
	'unmute'	 : 173,
	'decreasevolumelevel' : 174,
	'increasevolumelevel' :	175,
	'next'	         : 176,
	'previous'	 : 177,
	'stop'	         : 178,
	'play/pause'	 : 179,
	'email'	         : 180,
	'mute'	         : 181, // firefox
	'unmute'         : 181,
	//'decreasevolumelevel'	182 // firefox
	//'increasevolumelevel'	183 // firefox
	'semicolon'      : 186,
	'ñ'   	         : 186,
	'equal'	         : 187,
	'comma'	         : 188,
	'dash'	         : 189,
	'period'	 : 190,
	'forwardslash'   : 191,
	'ç'	         : 191,
	'grave accent'   : 192,
	//'ñ' 192,
	'æ'              : 192,
	'ö'	         : 192,
	'?'              : 193,
	'/'              : 193,
	'°'	         : 193,
	'numpadperiod'	 : 194, // chrome
	'openbracket'	 : 219,
	'backslash'	 : 220,
	'closebracket'   : 221,
	'å'   	         : 221,
	'singlequote'    : 222,
	'ø'              : 222,
	'ä'	         : 222,
	'`'	         : 223,
	// 'left or right ⌘ key (firefox)'	224
	'altgr'	         : 225,
	// '< /git >, left back slash'	226
	'GNOME Compose Key' : 230,
	'ç'	         : 231,
	'XF86Forward'	 : 233,
	'XF86Back'	 : 234,
	'non-conversion' : 235,
	'alphanumeric'	 : 240,
	'hiragana'       : 242,
	'katakana'	 : 242,
	'half-width'     : 243,
	'full-width'	 : 243,
	'kanji'	         : 244,
	'unlocktrackpad' : 251, // Chrome/Edge
	'toggletouchpad' : 255
    };

        
    // +----------------------------------------------------------------------
    // | Install the required listeners into the initially passed element.
    // |
    // | By default the listeners are installed into the root element specified on
    // | construction (or 'window').
    // +-------------------------------------------------
    KeyHandler.prototype.installListeners = function() {
	var _self = this;
	this.element.addEventListener('keydown',this.keyDownListener=function(e) { fireEvent(e,_self.downListeners); });
	this.element.addEventListener('keypress',this.keyPressListener=function(e) { fireEvent(e,_self.pressListeners); } );
	this.element.addEventListener('keyup',this.keyUpListener=function(e) { fireEvent(e,_self.upListeners); } );
    };


    // +----------------------------------------------------------------------
    // | Remove all installed event listeners from the underlying element.
    // +-------------------------------------------------
    KeyHandler.prototype.releaseListeners = function() {
	this.element.removeEventListener('keydown',this.keyDownListener);
	this.element.removeEventListener('keypress',this.keyPressListener);
	this.element.removeEventListener('keyup',this.keyUpListener);
    };

    // +----------------------------------------------------------------------
    // | Listen for key down. This function allows chaining.
    // |
    // | Example: new KeyHandler().down('enter',function() {console.log('Enter hit.')});
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // | @param listener:function(e) The callback to be triggered.
    // +-------------------------------------------------
    KeyHandler.prototype.down = function( key, listener ) {
	this.downListeners.push( { key : key, keyCode : key2code(key), listener : listener } );
	return this;
    };

    // +----------------------------------------------------------------------
    // | Listen for key press.
    // |
    // | Example: new KeyHandler().press('enter',function() {console.log('Enter pressed.')});
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // | @param listener:function(e) The callback to be triggered.
    // +-------------------------------------------------
    KeyHandler.prototype.press = function( key, listener ) {
	this.pressListeners.push( { key : key, keyCode : key2code(key), listener : listener } );
	return this;
    };

    // +----------------------------------------------------------------------
    // | Listen for key up.
    // |
    // | Example: new KeyHandler().up('enter',function() {console.log('Enter released.')});
    // |
    // | @param key:string Any key identifier, key code or one from the KEY_CODES list.
    // | @param listener:function(e) The callback to be triggered.
    // +-------------------------------------------------
    KeyHandler.prototype.up = function( key, listener ) {
	this.upListeners.push( { key : key, keyCode : key2code(key), listener : listener } );
	return this;
    };

    
    _context.KeyHandler = KeyHandler;

})(window);
