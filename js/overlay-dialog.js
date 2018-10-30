/**
 * A simple non-jquery blocking modal dialog.
 *
 * Required structure:
 *  <div id="dialog-wrapper" class="overlay-wrapper">
 *     <div class="overlay-blanket">
 *	<div class="overlay-content"></div>
 *     </div>
 *  </div>
 *
 *
 * The conent container will consist of three child elements then having following classes:
 *  .od-hl (healine)
 *  .od-cn (conent node)
 *  .id-bl (button line)
 *
 * @author   Ikaros Kappler
 * @date     2018-08-26
 * @modified 2018-10-24 Fixed some button action issues.
 * @version  1.0.1
 **/


(function(_context) {
    "use strict";


    // +---------------------------------------------------------------------------------
    // | A constructor.
    // |
    // | This constructor will also layout your elements.
    // |
    // | @param wrapperID:string
    // +-------------------------------
    var overlayDialog = function( wrapperID ) {
	// Fetch main elements
	this.wrapper = document.getElementById(wrapperID);
	this.blanket = this.wrapper.getElementsByClassName('overlay-blanket')[0];
	this.content = this.blanket.getElementsByClassName('overlay-content')[0];

	// Set fullscreen and center; hide by default
	_setStyles( this.wrapper, { display : 'none', position : 'fixed', left : '0px', top : '0px', width : '100vw', height : '100vh' } );
	_setStyles( this.blanket, { width : '100%', height : '100%', display : 'flex', 'align-items' : 'center', 'justify-content' : 'center', background : 'rgba(0,0,0,0.5)' } );
	_setStyles( this.content, { width : '500px', height : '500px', 'max-width' : '50%', 'max-height' : '50%', background : 'white', border : '1px solid grey', 'border-radius' : '5px', position : 'relative' } );

	// Add headline, main container and button line
	this._headLine = document.createElement("h3");           
	this._contentNode = document.createElement("div");
	this._buttonLine = document.createElement("div");
	this.content.innerHTML = "";
	this.content.appendChild(this._headLine);
        this.content.appendChild(this._contentNode);
	this.content.appendChild(this._buttonLine);

	this._textArea = null;
	
	// Layout child elements
	_setStyles( this._headLine, { width : 'calc(100% - 10px)', overflow : 'hidden', 'border-bottom' : '1px solid grey', 'margin' : '6px 0px', padding : '0px 5px 3px' } );
	_setStyles( this._contentNode, { width : 'calc(100% - 10px)', overflow : 'hidden', margin : '0px', padding : '0px 5px', position : 'absolute', top : '30px', height : 'calc(100% - 60px)' } );
	_setStyles( this._buttonLine, { width : 'calc(100% - 10px)', overflow : 'hidden', position : 'absolute', top : 'auto', bottom : '0px', 'text-align' : 'right' } );

	_addClass( this._headLine, 'od-hl' );
	_addClass( this._contentNode, 'od-cn' );
	_addClass( this._buttonLine, 'od-bl' );
    };


    // +---------------------------------------------------------------------------------
    // | Show the dialog.
    // |
    // | The 'buttons' param (object or array) is optional.
    // |
    // | @param message:string
    // | @param headline:string
    // | @param buttons:object { name : { label:string, onclick:function }}
    // | @param options:object Optional { messageClass:string }
    // +-------------------------------
    overlayDialog.prototype.show = function( message, headline, buttons, options ) {
	this._headLine.innerHTML = (headline ? headline : 'Please confirm');	
	// this._contentNode.className = "";	
	this.setMessage( message, options );
	this._buttonLine.innerHTML = "";
	if( !buttons ) _addButton( this, 'ok' );
	else {
	    for( var i in buttons ) 
		_addButton(this,buttons[i]);
	}	
	this.wrapper.style.display = 'inherit';
    };

    overlayDialog.prototype.setMessage = function( message, options ) {
	options = {} || options;
	if( typeof message == 'string' ) {
	    this._contentNode.innerHTML = message;
	    if( options.messageClass )
		_addClass(this._contentNode,options.messageClass); // this._contentNode.className = options.messageClass;  
	} else {
	    this._contentNode.innerHTML = "";
	    this._contentNode.appendChild( message );
	}
    };


    // +---------------------------------------------------------------------------------
    // | Show the dialog with a text area instead a simple DIV text.
    // |
    // | The 'buttons' param (object or array) is optional.
    // |
    // | @param message:string
    // | @param headline:string
    // | @param buttons:object { name : { label:string, onclick:function }}
    // +-------------------------------
    overlayDialog.prototype.showTextArea = function( message, headline, buttons, options ) {
	this._textArea = document.createElement('textarea');
	this._textArea.innerHTML = (message?message:'');
	this._textArea.style.width = '100%';
	this._textArea.style.height = '95%';
	this._textArea.style.border = '0px';
	if( options && options.messageClass )
	    this._textArea.className = options.messageClass;
	this.show( this._textArea, headline, buttons, options );
    };


    // +---------------------------------------------------------------------------------
    // | Hide the dialog.
    // +-------------------------------
    overlayDialog.prototype.hide = function() {
	_hide( this );
    };


    // +---------------------------------------------------------------------------------
    // | A helper function for adding custom buttons.
    // +-------------------------------
    function _addButton( dialog, buttonConfig ) {
	if( typeof buttonConfig == 'string' && buttonConfig == 'close' ) {
	    _addButton( dialog, { label : 'Close', onclick : function() { _hide(dialog); } } );
	} else if( typeof buttonConfig == 'string' && buttonConfig == 'ok' ) {
	    console.log( 'add ok button' );
	    _addButton( dialog, { label : 'OK', onclick : function() { _hide(dialog); } } );
	} else {
	    // { label, onclick }
	    // Add button(s)
	    var btn = document.createElement('button');
	    btn.type = 'button';
	    btn.innerHTML = (buttonConfig.label ? buttonConfig.label : 'no-label'); // 'OK';
	    if( typeof buttonConfig.action == 'function' )
		btn.addEventListener( 'click', buttonConfig.action );
	    else if( buttonConfig.action == 'close' )
		btn.addEventListener( 'click', function() { _hide(dialog); } );
	    dialog._buttonLine.appendChild( btn );
	}
    };


    // +---------------------------------------------------------------------------------
    // | A helper function for settings custom styles.
    // +-------------------------------
    function _setStyles( elem, propertyObject ){
	for (var property in propertyObject)
	    elem.style[property] = propertyObject[property];
    }


    // +---------------------------------------------------------------------------------
    // | A helper function for hiding the dialog.
    // +-------------------------------
    function _hide( dialog ) {
	dialog.wrapper.style.display = 'none';
    };


    // +---------------------------------------------------------------------------------
    // | Add the class(es) to the given element.
    // |
    // | @param element:HTMLElement
    // | @param name:string
    // +-------------------------------
    function _addClass(element,name) {
	var arr = element.className.split(" ");
	if( arr.indexOf(name) == -1 ) {
	    arr.push(name);
            element.className = arr.join(' '); // += " " + name;
	    // console.log( element.className );
	}
    }


    // +---------------------------------------------------------------------------------
    // | Remove the class(es) from the given element.
    // |
    // | @param element:HTMLElement
    // | @param name:string
    // +-------------------------------
    /*
    function removeClass(element,names) {
	if( typeof name == 'string' ) {
	    _removeClass( names.split(/(\s+)/) );
	    return;
	}
	var arr;
	arr = element.className.split(" ");
	var pos;
	for( var i in names ) {
	    var name = names[i];
	    if( (pos = arr.indexOf(name)) != -1 ) {
		arr.splice(pos,1);
		element.className = arr.join(' ');
	    }
	}
    }
    */


    /*
    // Found at
    //    https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    // Returns true if it is a DOM node
    function _isNode(o) {
	return (
	    typeof Node === "object" ? o instanceof Node : 
		o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
	);
    }
    // Returns true if it is a DOM element    
    function _isElement(o) {
	return (
	    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
	    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
	);
    }
    */


    // +---------------------------------------------------------------------------------
    // | Export the constructor to the context.
    // +-------------------------------
    _context.overlayDialog = overlayDialog;
    
})(window);
