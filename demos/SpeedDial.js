/**
 * @author  Ikaros Kappler
 * @date    2021-12-08
 * @version 1.0.0
 */

globalThis.SpeedDial = globalThis.SpeedDial || (function() {
    
    var BUTTON_SIZE = 40;
    var GAP_SIZE = 4;

    var SD = function () {
        this.rootNode = createRootNode(this);
        document.querySelector("body").appendChild( this.rootNode );

        this._buttons = [];
    };

    SD.prototype.addActionButton = function( label, onClick ) {
        var buttonNode = createButtonNode( onClick );
        var offset = this._buttons.length+1;
        buttonNode.style["transform"] = "translateY(-"+(offset*(BUTTON_SIZE+GAP_SIZE))+"px)";
        buttonNode.style["opacity"] = "0.0";
        buttonNode.style["transition"] = "opacity "+(offset*0.25)+"s";
        buttonNode.style["background-color"] = "rgb(206,0,192)";
        buttonNode.innerHTML = label;
        this.rootNode.appendChild( buttonNode );
        this._buttons.push( buttonNode );
    };

    var showDial = function( dial ) {
        dial.rootNode.style["overflow"] = "visible";
        dial.rootNode.style["height"] = ""+((dial._buttons.length+1)*(BUTTON_SIZE+GAP_SIZE))+"px";
        dial._buttons.forEach( function(button) {
            button.style["opacity"] = "1.0";
        });
    }

    var hideDial = function( dial ) {
        dial.rootNode.style["overflow"] = "hidden";
        dial.rootNode.style["height"] = ""+BUTTON_SIZE+"px";
        dial._buttons.forEach( function(button) {
            button.style["opacity"] = "0.0";
        });
    }

    var createRootNode = function( dial ) {
        var node = document.createElement("div");
        node.style["position"] = "absolute";
        node.style["bottom"] = "0px";
        node.style["left"] = "50vw";
        node.style["transform"] = "translate(-50%)";
        node.style["width"] = ""+BUTTON_SIZE+"px";
        node.style["height"] = ""+BUTTON_SIZE+"px";
        node.style["border-radius"] = "20px";
        node.style["border"] = "0";
        node.style["overflow"] = "hidden";

        var buttonNode = createButtonNode(function() {
            console.log("click");
        } );

        buttonNode.addEventListener("mouseenter", function() {
            showDial(dial);
        });
        node.addEventListener("mouseleave", function() {
            hideDial(dial);
        });
        buttonNode.addEventListener("click", function() {
            console.log("click");
        }); 

        node.appendChild( buttonNode );
        return node;
    };

    var createButtonNode = function( onClick ) {
        var buttonNode = document.createElement("button");
        buttonNode.style["position"] = "absolute";
        buttonNode.style["bottom"] = "0px";
        buttonNode.style["width"] = ""+BUTTON_SIZE+"px";
        buttonNode.style["height"] = ""+BUTTON_SIZE+"px";
        buttonNode.style["background-color"] = "rgb(0,128,192)";
        buttonNode.style["border-width"] = "0px";
        buttonNode.style["border-radius"] = "20px";
        buttonNode.style["outline"] = "none";

        buttonNode.addEventListener("click", onClick); 
        return buttonNode;
    }

    return SD;
})();