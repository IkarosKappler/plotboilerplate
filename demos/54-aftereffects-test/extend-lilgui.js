lil.ColorWithAlphaController = function (parent, object, colorProperty, alphaProperty, rgbScale) {
  //   console.log("parent", parent);
  this.baseColorController = new lil.ColorController(parent, object, colorProperty, rgbScale);
  // Object.call(lil.ColorController.constuctor, parent, object, property, rgbScale);
  //   this.parent = parent;
  //   lil.ColorController.call(this);
  //   lil.ColorController.constructor.call(this, parent, object, property, rgbScale);

  this.$alpha = document.createElement("input");
  this.$alpha.setAttribute("type", "range");
  this.$alpha.setAttribute("min", "0.0");
  this.$alpha.setAttribute("max", "1.0");
  this.$alpha.setAttribute("step", "0.05");
  this.$alpha.setAttribute("value", object[alphaProperty]);

  var _self = this;
  this.$displayContainer = this.baseColorController.$widget.querySelectorAll(".display")[0];
  this.$displayContainer.style["position"] = "relative";

  this.alphaDisplay = document.createElement("div");
  this.alphaDisplay.style["position"] = "absolute";
  this.alphaDisplay.style["top"] = "0px";
  this.alphaDisplay.style["width"] = "100%";
  this.alphaDisplay.style["height"] = "100%";
  this.alphaDisplay.style["display"] = "flex";
  this.alphaDisplay.style["flex-direction"] = "column";
  this.alphaDisplay.style["align-content"] = "center";
  this.alphaDisplay.style["justify-content"] = "center";
  this.alphaDisplay.style["text-align"] = "center";
  this.alphaDisplay.style["pointer-events"] = "none";

  // this.alphaDisplay.innerHTML = "50%";
  this.updateDisplay(object[alphaProperty]);

  // this.$displayContainer.appendChild(this.alphaDisplay);
  this.$displayContainer.appendChild(this.alphaDisplay);

  this._handleChange = function () {
    /* NOOP */
  };

  this.$alpha.addEventListener("change", function (evt, value) {
    console.log("value", evt.target.value);
    // var displayContainer = controller.$widget.querySelectorAll(".display")[0];
    // console.log(displayContainer);
    // _self.alphaDisplay.innerHTML = evt.target.value;
    _self._appylNewAlphaValue(evt.target.value);
    _self.updateDisplay(object[alphaProperty]);
    _self._fireOnChange();
  });

  this._appylNewAlphaValue = function (newAlphaValue) {
    object[alphaProperty] = newAlphaValue;
  };

  this._fireOnChange = function () {
    if (this._handleChange) {
      this._handleChange(object[colorProperty], object[alphaProperty]); // newAlphaValue);
    }
  };

  this.baseColorController.onChange(function (newColorValue) {
    _self._fireOnChange();
  });

  this.baseColorController.$widget.appendChild(this.$alpha);
};
// lil.ColorWithAlphaController.prototype = lil.ColorController.prototype;
lil.ColorWithAlphaController.prototype = Object.assign({}, lil.ColorController.prototype);
lil.ColorWithAlphaController.prototype.updateDisplay = function (newValue) {
  this.alphaDisplay.innerHTML = newValue.toFixed(2);
};
lil.GUI.prototype.addColorWithAlpha = function (object, colorProperty, alphaProperty, rgbScale) {
  var cntrlr = new lil.ColorWithAlphaController(this, object, colorProperty, alphaProperty, rgbScale);
  cntrlr.onChange = function (handler) {
    // // Create a new 'change' event
    // var event = new Event("change");
    // // Dispatch it.
    // cntrlr.dispatchEvent(event);
    console.log("inner onchange");
    cntrlr._handleChange = handler;
  };
  // cntrlr.$alpha
  return cntrlr;
};
