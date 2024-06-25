/**
 * This snippet adds an 'arrowBounce' prototype function to all dat.GUI components.
 *
 * It's an adaption of the 'title' polyfill found at
 *    https://stackoverflow.com/questions/27362914/how-to-add-tooltips-to-dat-gui
 *    by greginvm
 *
 * @author   Ikaros Kappler
 * @date     2024-06-25 Copied from dat.gui and adapted for lil-gui
 * version   1.0.0
 **/

(function () {
  /* lil.GUI copies the prototype of superclass Controller to all other controllers, so it is not enough to add it only to 
       the super class as the reference is not maintained */
  var eachController = function (fnc) {
    fnc(lil.Controller);
  };

  var setArrowBounce = function (v, options) {
    options = options || {};
    if (typeof options.fadeDelay == "undefined") {
      options.fadeDelay = 5000;
    }
    options.fadeDelay = options.fadeDelay / 1000;
    var randomkey = "arrowbounce-" + Math.round(Math.random() * Math.pow(2, 16));

    var _self = this;
    removeElement = function () {
      _self.domElement.querySelectorAll(".arrowBounce").forEach(function (elem) {
        elem.parentElement.removeChild(elem);
      });
      _self.domElement.style.overflow = "hidden"; // Restore old overflow
      _self.domElement.style.position = "static";
    };

    // domElement is the root dom element of each controller
    if (v) {
      this.domElement.style.position = "relative";
      this.domElement.style.overflow = "visible";
      //this.domElement.style.overflowX = 'visible';
      //this.domElement.style.overflowY = 'hidden';
      var node = document.createElement("div");
      node.style.position = "absolute";
      // node.style.lineHeight = '24px';
      node.style.left = 0;
      node.style.top = 0;
      node.style.transform = "translateX(-100%)";
      node.style.height = "100%";
      node.classList =
        randomkey + " arrowBounce hideAfterNs" + (typeof options.className != "undefined" ? " " + options.className : "");
      // BEGIN custom Styling
      node.style.paddingRight = "1em";
      // node.style.paddingTop = node.style.paddingBottom = '0em';
      node.style.color = "rgb(0,0,0)";
      // END custom Styling

      node.innerHTML = '<div class="bounce">' + v + '&nbsp;<span style="margin-left: 3em;">➤</span></div>';
      this.domElement.prepend(node);
      if (typeof options.detachAfter == "number")
        globalThis.setTimeout(function () {
          removeElement();
        }, options.detachAfter);
    } else {
      removeElement();
    }

    // --- Unfortunately IE does not support ES6 Template Literals ---
    // --- So use '§' instead '$' here plus string.replace(...)    ---
    // Define a dynamic and local CSS class
    var style = document.createElement("style");
    style.innerHTML = `.§{randomkey}.hideAfterNs {  
	  animation: fadeout 0.5s 1;
	  -webkit-animation: fadeout 0.5s 1;
	  animation-fill-mode: forwards;

	  animation-delay: ${options.fadeDelay}s;
	  -webkit-animation-delay:§{options.fadeDelay}s; /* Safari and Chrome */
	  -webkit-animation-fill-mode: forwards;
	}`.replace(/§\{fadeTime\}/g, (options.fadeDelay / 1000).toString());
    document.getElementsByTagName("head")[0].appendChild(style);
    return this;
  };

  // Define a global CSS class
  var style = document.createElement("style");
  // style.type = "text/css";
  style.innerHTML = `.bounce {
      animation: bounce 2s infinite;
      background: rgba(255,255,255,0.7);
      border-radius: 8px;
      padding-left: 1em;
      padding-right: 1em;
      display: flex;
      align-items: center;
      height: 100%;
	}

	@keyframes bounce {
	    0%, 20%, 50%, 80%, 100% {
		transform: translateX(0);
	    }
	    40% {
		transform: translateX(-30px);
	    }
	    60% {
		transform: translateX(-15px);
	    }
	}
        @keyframes fadeout {
	   from {opacity :1;}
	   to {opacity :0; display:none;}
        }
        @-webkit-keyframes fadeout {
	   from {opacity :1;}
	   to {opacity :0;display:none;}
        }
    
  /* override lil.gui style to make arrowbounce work */
  .lil-gui .children {
    overflow-x: visible !important;
    overflow-y: visible !important;
  }
  `;
  document.getElementsByTagName("head")[0].appendChild(style);

  // Install the new feature
  eachController(function (controller) {
    if (!controller.prototype.hasOwnProperty("arrowBounce")) {
      controller.prototype.arrowBounce = setArrowBounce;
    }
  });
})();
