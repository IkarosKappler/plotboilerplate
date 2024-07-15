/**
 * A color-with-alpha extension for lil-gui, adding the missing `alpha` control input.
 * For lil-gui see https://github.com/georgealways/lil-gui
 *
 * Demo: https://www.int2byte.de/public/plotboilerplate/tests/test_lilgui_addcolorwithalpha.html
 *
 * Adds a new controller which can be called like
 *  `new lil.GUI()
 *    .addColorWithAlpha( { color: '#ff0000', alpha: 0.0 },
 *                        "color",
 *                        "alpha" )
 *    .onChange( function(newColor,newAlpha) { \/* ... do your stuff ... *\/ } );
 * `
 *
 * @author  Ikaros Kappler
 * @date    2024-07-08
 * @version 1.0.0
 */

lil.ColorWithAlphaController = function (parent, object, colorProperty, alphaProperty, rgbScale) {
  this.baseColorController = new lil.ColorController(parent, object, colorProperty, rgbScale);

  /** Create a new input element for the alpha range 0.0 to 1.0 */
  this.$alpha = document.createElement("input");
  this.$alpha.setAttribute("type", "range");
  this.$alpha.setAttribute("min", "0.0");
  this.$alpha.setAttribute("max", "1.0");
  this.$alpha.setAttribute("step", "0.01");
  this.$alpha.setAttribute("value", object[alphaProperty]);

  /** Create a pure display component showing the selected alpha value */
  this.alphaDisplay = document.createElement("div");
  this.alphaDisplay.style["position"] = "absolute";
  /** Reproduce lil-gui's slider style */
  this.alphaDisplay.style["top"] = "0px";
  this.alphaDisplay.style["width"] = "100%";
  this.alphaDisplay.style["height"] = "100%";
  this.alphaDisplay.style["display"] = "flex";
  this.alphaDisplay.style["flex-direction"] = "column";
  this.alphaDisplay.style["align-content"] = "center";
  this.alphaDisplay.style["justify-content"] = "center";
  this.alphaDisplay.style["text-align"] = "center";
  this.alphaDisplay.style["touch-action"] = "pan-y";
  /** Disable pointer events (display will be located above the slider) */
  this.alphaDisplay.style["pointer-events"] = "none";

  /** Upading before adding to DOM prevents exhaustive render loops */
  this.updateDisplay(object[alphaProperty]);

  /** Create a container for the ranger-slider and display-div */
  var alphaContainer = document.createElement("div");
  alphaContainer.style["position"] = "relative";
  alphaContainer.appendChild(this.$alpha);
  alphaContainer.appendChild(this.alphaDisplay);

  /** Fetch the color-controller's display container and append our additional element */
  // var displayContainer = this.baseColorController.$widget.querySelectorAll(".display")[0];
  // displayContainer.appendChild(alphaContainer);

  /** This is just a dummy function so we don't need to check for null */
  this._handleChange = function () {
    /* NOOP */
  };

  /** Will need this reference later */
  var _self = this;

  /** Handle change events on our range slider */
  this.$alpha.addEventListener("change", function (evt) {
    var newValue = Number.parseFloat(evt.target.value);
    _self._appylNewAlphaValue(newValue);
    _self.updateDisplay(newValue);
    _self._fireOnChange();
  });

  this._appylNewAlphaValue = function (newAlphaValue) {
    object[alphaProperty] = newAlphaValue;
  };

  this._fireOnChange = function () {
    if (this._handleChange) {
      this._handleChange(object[colorProperty], object[alphaProperty]);
    }
  };

  this.baseColorController.onChange(function () {
    _self._fireOnChange();
  });

  this.baseColorController.$widget.appendChild(alphaContainer);
};

/** 'Inherit' from lilgui's default ColorController */
lil.ColorWithAlphaController.prototype = Object.assign({}, lil.ColorController.prototype);

/** Add custom updateDisplay function for alpha values */
lil.ColorWithAlphaController.prototype.updateDisplay = function (newValue) {
  /** Be sure this is really a number :) */
  this.alphaDisplay.innerHTML = typeof newValue === "number" ? newValue.toFixed(2) : newValue;
};

/** Finally add the new method 'addColorWithAlpha' to lil.GUI */
lil.GUI.prototype.addColorWithAlpha = function (object, colorProperty, alphaProperty, rgbScale) {
  var cntrlr = new lil.ColorWithAlphaController(this, object, colorProperty, alphaProperty, rgbScale);
  cntrlr.onChange = function (handler) {
    cntrlr._handleChange = handler;
    return cntrlr;
  };
  /** Apply essential elements */
  cntrlr.domElement = cntrlr.baseColorController.domElement;
  cntrlr.name = cntrlr.baseColorController.name;
  cntrlr.$name = cntrlr.baseColorController.$name;
  cntrlr.load = cntrlr.baseColorController.load;
  cntrlr.reset = cntrlr.baseColorController.reset;
  cntrlr.save = cntrlr.baseColorController.save;
  cntrlr.title = cntrlr.baseColorController.title;

  return cntrlr;
};
