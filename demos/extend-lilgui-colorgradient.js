/**
 * A slider-with-checkbox extension for lil-gui. Can be used to modify a range value – or disable
 * it completely.
 * For lil-gui see https://github.com/georgealways/lil-gui
 *
 * Demo: https://www.int2byte.de/public/plotboilerplate/tests/test_lilgui_addcolorwithalpha.html
 *
 * Adds a new controller which can be called like
 *  `const colorGradientDialog = new ColorGradientPickerDialog(new Modal({ closeOnBackdropClick: true }), {
      isMobileMode: isMobile
    });

 *   new lil.GUI()
 *    .addColorGradient( { myGradient: ColorGradient.createDefaultGradient() },
 *                        "myGradient",
 *                        "colorGradientDialog )
 *    .onChange( function(newGradient) { document.body.style["background"] = newGradient.toColorGradientString() } )
 * `
 *
 * @author  Ikaros Kappler
 * @date    2025-08-08
 * @version 1.0.0
 */

(function (_lil) {
  var copyEssentialControllerProps = function (targetController, sourceController) {
    targetController.domElement = sourceController.domElement;
    targetController.name = sourceController.name;
    targetController.$name = sourceController.$name;
    targetController.load = sourceController.load;
    targetController.reset = sourceController.reset;
    targetController.save = sourceController.save;
    targetController.title = sourceController.title;
    targetController.listen = sourceController.listen;
    targetController.disable = function () {
      // targetController._disableByCheckbox();
      targetController.$checkbox.setAttribute("disabled", true);
      sourceController.$widget.parentElement.classList.add("disabled");
    };
    targetController.enable = function () {
      // targetController._enableByCheckbox();
      targetController.$checkbox.removeAttribute("disabled");
      sourceController.$widget.parentElement.classList.remove("disabled");
    };
    targetController.min = function (newMin) {
      sourceController.min(newMin);
      return targetController;
    };
    targetController.max = function (newMax) {
      sourceController.max(newMax);
      return targetController;
    };
    targetController.step = function (newStep) {
      sourceController.step(newStep);
      return targetController;
    };
    targetController._onUpdateMinMax = sourceController._onUpdateMinMax;

    targetController.onChange = function (handler) {
      targetController._handleChange = handler;
      return targetController;
    };
  };

  var initChildController = function (_self, parent, object, gradientProperty, colorGradientDialog) {
    // var _self = this;
    /** Create a new input element like this (lil-gui style checkbox) */
    const gradientButton = document.createElement("button");
    gradientButton.innerHTML = "Gradient";
    gradientButton.addEventListener("click", function () {
      // Open the dialog
      colorGradientDialog.show({
        onAcceptGradient: function (updatedColorGradient) {
          const outputGradientString = updatedColorGradient.toColorGradientString();
          console.log(outputGradientString);
          // gradientButton.style["background"] = outputGradientString;
          _self._handleColorGradientChange(updatedColorGradient);
          _self._fireOnChange(updatedColorGradient, outputGradientString);
        },
        inputGradient: object[gradientProperty]
      });
    });

    /** This is just a dummy function so we don't need to check for null */
    _self._handleChange = function (colorGradient, outputGradientString) {
      /* NOOP */
    };

    _self._fireOnChange = function (updatedColorGradient, updatedGradientString) {
      if (this._handleChange) {
        this._handleChange(updatedColorGradient, updatedGradientString);
      }
    };

    _self.baseController.onChange(function () {
      _self._fireOnChange();
    });

    /**
     *
     * @param {ColorGradient} colorGradient
     */
    _self._handleColorGradientChange = function (colorGradient) {
      console.log("_handleChange");
      // gradientButton.style["background"] = outputGradientString;
      object[gradientProperty] = colorGradient;
      gradientButton.style["background"] = colorGradient.toColorGradientString();
    };

    // Remove the old contents
    while (_self.baseController.$widget.firstChild) {
      _self.baseController.$widget.removeChild(_self.baseController.$widget.lastChild);
    }
    // Add the new one
    _self.baseController.$widget.prepend(gradientButton);
    _self._handleColorGradientChange(object[gradientProperty]);
  };

  /**
   *
   * @param {*} parent
   * @param {object} object
   * @param {string} gradientProperty
   * @param {ColorGradientDialog} colorGradientDialog
   */
  lil.ColorGradientController = function (parent, object, gradientProperty, colorGradientDialog) {
    this.baseController = new lil.ColorController(parent, object, gradientProperty);
    initChildController(this, parent, object, gradientProperty, colorGradientDialog);
  };

  /** 'Inherit' from lilgui's default ColorController */
  lil.ColorGradientController.prototype = Object.assign({}, lil.ColorController.prototype);

  /** Finally add the new method 'addColorWithCheckbox' to lil.GUI */
  /**
   *
   * @param {*} parent
   * @param {object} object
   * @param {string} gradientProperty
   * @param {ColorGradientDialog} colorGradientDialog
   * @returns
   */
  lil.GUI.prototype.addColorGradient = function (object, gradientProperty, colorGradientDialog) {
    var cntrlr = new lil.ColorGradientController(this, object, gradientProperty, colorGradientDialog);
    copyEssentialControllerProps(cntrlr, cntrlr.baseController);
    return cntrlr;
  };
})(lil);
