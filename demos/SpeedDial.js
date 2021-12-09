/**
 * @author  Ikaros Kappler
 * @date    2021-12-08
 * @version 1.0.0
 */

globalThis.SpeedDial = globalThis.SpeedDial || (function() {

    var BUTTON_SIZE = 40;
    var GAP_SIZE = 4;

    var SD = function () {

        var isMobile = typeof isMobileDevice === "function" && isMobileDevice();
        this.buttonSize = isMobile ? BUTTON_SIZE*2 : BUTTON_SIZE;
        this.gapSize = isMobile ? GAP_SIZE*2 : GAP_SIZE;

        this.rootNode = createRootNode(this);
        document.querySelector("body").appendChild( this.rootNode );

        this._buttons = [];
    };

    SD.prototype.addActionButton = function( label, onClick ) {
        var buttonNode = createButtonNode( this, onClick );
        var offset = this._buttons.length+1;
        buttonNode.style["transform"] = "translate(0px,0px)"; 
        buttonNode.style["opacity"] = "0.0";
        buttonNode.style["transition"] = "opacity "+(offset*0.25)+"s, transform 0.5s";
        buttonNode.style["background-color"] = "rgb(206,0,192)";
        buttonNode.style["z-index"] = (-offset); // Something smaller than 100
        buttonNode.innerHTML = label;
        this.rootNode.appendChild( buttonNode );
        this._buttons.push( buttonNode );
    };

    var showDial = function( dial ) {
        dial.rootNode.style["overflow"] = "visible";
        dial.rootNode.style["height"] = ""+((dial._buttons.length+1)*(dial.buttonSize+dial.gapSize))+"px";
        dial._buttons.forEach( function(buttonNode,index) {
            var offset = index+1;
            buttonNode.style["opacity"] = "1.0";
            buttonNode.style["transform"] = "translate(0px,-"+(offset*(dial.buttonSize+dial.gapSize))+"px)";
        });
    }

    var hideDial = function( dial ) {
        // Activate this line to fade-out immediately
        // dial.rootNode.style["overflow"] = "hidden";
        dial.rootNode.style["height"] = ""+dial.buttonSize+"px";
        dial._buttons.forEach( function(buttonNode) {
            buttonNode.style["opacity"] = "0.0";
            buttonNode.style["transform"] = "translate(0px,0px)";
        });
    }

    var createRootNode = function( dial ) {
        var node = document.createElement("div");
        node.style["position"] = "absolute";
        node.style["bottom"] = "0px";
        node.style["left"] = "50vw";
        node.style["transform"] = "translate(-50%, 0px)";
        node.style["width"] = ""+dial.buttonSize+"px";
        node.style["height"] = ""+dial.buttonSize+"px";
        node.style["border-radius"] = ""+(dial.buttonSize/2)+"px";
        node.style["border"] = "0";
        node.style["overflow"] = "hidden";
        node.style["z-index"] = "100";

        var buttonNode = createButtonNode( dial, function() {
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

    var createButtonNode = function( dial, onClick ) {
        var buttonNode = document.createElement("button");
        buttonNode.style["position"] = "absolute";
        buttonNode.style["bottom"] = "0px";
        buttonNode.style["width"] = ""+dial.buttonSize+"px";
        buttonNode.style["height"] = ""+dial.buttonSize+"px";
        buttonNode.style["background-color"] = "rgb(0,128,192)";
        buttonNode.style["border-width"] = "0px";
        buttonNode.style["border-radius"] = ""+(dial.buttonSize/2)+"px";
        buttonNode.style["outline"] = "none";

        buttonNode.addEventListener("click", onClick); 
        return buttonNode;
    }

    return SD;
})();