/**
 * A slider-with-checkbox extension for lil-gui. Can be used to modify a range value – or disable
 * it completely.
 * For lil-gui see https://github.com/georgealways/lil-gui
 *
 * Demo: https://www.int2byte.de/public/plotboilerplate/tests/test_lilgui_addcolorwithalpha.html
 *
 * Adds a new controller which can be called like
 *  `
 *    const colorGradientDialog = new ColorGradientPickerDialog(new Modal({ closeOnBackdropClick: true }), {
 *       isMobileMode: isMobile
 *    });
 *
 *   new lil.GUI()
 *    .addColorGradient( { myGradient: ColorGradient.createDefaultGradient() },
 *                        "myGradient",
 *                        colorGradientDialog )
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

  /**
   * @private
   */
  var initChildController = function (_self, parent, object, gradientPropertyName, colorGradientDialog) {
    /** Create a new dialog if none is passed by the user */
    colorGradientDialog =
      colorGradientDialog ||
      new ColorGradientPickerDialog(new Modal({ closeOnBackdropClick: true }), {
        isMobileMode: isMobile
      });

    /** Create a new input element like this (lil-gui style checkbox) */
    const gradientButton = document.createElement("button");
    // gradientButton.innerHTML = gradientProperty;
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
        inputGradient: object[gradientPropertyName]
      });
    });

    /** This is just a dummy function so we don't need to check for null */
    _self._handleChange = function (colorGradient, outputGradientString) {
      /* NOOP */
    };

    _self._fireOnChange = function (updatedColorGradient, updatedGradientString) {
      if (_self._handleChange) {
        _self._handleChange(updatedColorGradient, updatedGradientString);
      }
    };

    /**
     *
     * @param {ColorGradient} colorGradient
     */
    _self._handleColorGradientChange = function (colorGradient) {
      // gradientButton.style["background"] = outputGradientString;
      object[gradientPropertyName] = colorGradient;
      gradientButton.style["background"] = colorGradient.toColorGradientString();
    };

    // Remove the old contents
    while (_self.baseController.$widget.firstChild) {
      _self.baseController.$widget.removeChild(_self.baseController.$widget.lastChild);
    }
    // Add the new one
    _self.baseController.$widget.prepend(gradientButton);
    _self._handleColorGradientChange(object[gradientPropertyName]);
  };

  /**
   * Creates a new ColorGradientController as a child controller.
   *
   * @param {*} parent - The lil-gui internal parent element.
   * @param {object} object - Any general object that holds a color gradient value.
   * @param {string} gradientPropertyName - The name of the gradient property in the `object`.
   * @param {ColorGradientDialog?} colorGradientDialog - (optional) The dialog to use; if null then a new dialog will be created.
   */
  lil.ColorGradientController = function (parent, object, gradientPropertyName, colorGradientDialog) {
    this.baseController = new lil.ColorController(parent, object, gradientPropertyName);
    initChildController(this, parent, object, gradientPropertyName, colorGradientDialog);
  };

  /** 'Inherit' from lilgui's default ColorController */
  lil.ColorGradientController.prototype = Object.assign({}, lil.ColorController.prototype);

  /** Finally add the new method 'addColorGradient' to lil.GUI */
  /**
   *
   * @param {object} object - Any general object that holds a color gradient value.
   * @param {string} gradientPropertyName - The name of the gradient property in the `object`.
   * @param {ColorGradientDialog?} colorGradientDialog - (optional) The dialog to use; if null then a new dialog will be created.
   * @returns
   */
  lil.GUI.prototype.addColorGradient = function (object, gradientPropertyName, colorGradientDialog) {
    var cntrlr = new lil.ColorGradientController(this, object, gradientPropertyName, colorGradientDialog);
    copyEssentialControllerProps(cntrlr, cntrlr.baseController);
    return cntrlr;
  };
})(lil);
