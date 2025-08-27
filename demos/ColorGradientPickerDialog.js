/**
 * A simple ColorGradientPickerDialog using modal.js.
 *
 * @require ./modal.js
 * @require ./src/cjs/utils/dom/components/ColorGradientPicker.js
 * @require ./src/cjs/utils/dom/components/ColorGradientSelector.js
 *
 * @author  Ikaros Kappler
 * @date    2025-08-05
 * @version 1.0.0
 */

(function (_context) {
  /**
   * Creates a new ColorGradientPickerDialog from a given modal dialog.
   *
   * @param {Modal} modalDialog
   * @param {boolean} options.isMobileMode - In mobile mode the picker element will be rendered bigger for better usability.
   */
  var ColorGradientPickerDialog = function (modalDialog, options) {
    if (!modalDialog) {
      throw Error("Cannot create ColorGradientPickerDialog. `modalDialog` is null.");
    }
    options = options || {};
    this.modalDialog = modalDialog;
    this.colorGradientPicker = new ColorGradientPicker(null, options.isMobileMode ?? false);

    var initialGradients = [0, 1, 2].map(function (num) {
      return ColorGradientSelector.DEFAULT_COLOR_GRADIENTS[num % ColorGradientSelector.DEFAULT_COLOR_GRADIENTS.length];
    });
    this.colorGradientSelector = new ColorGradientSelector({
      containerID: null,
      isMobileMode: options.isMobileMode,
      initialGradients: initialGradients,
      selectedGradientIndex: 0
    });
    var _self = this;
    this.colorGradientSelector.addChangeListener(function (newGradient, _newSelectedIndex, _sourceSelector) {
      _self.colorGradientPicker.setGradient(newGradient);
    });
  };

  ColorGradientPickerDialog.prototype.__handleAddGradientClick = function () {
    var _self = this;
    return function (evt) {
      console.log("Adding current color gradient");
      // Fetch the currently configured gradient from the picker and add it to the selector.
      var currentGradient = _self.colorGradientPicker.getColorGradient();
      _self.colorGradientSelector.addGradient(currentGradient);
    };
  };

  /**
   * Show the gradient picker dialog with the given options.
   *
   * @param {function} options.onAcceptGradient
   * @param {ColorGradient} options.colorGradient
   * @param {boolean} options.isMobileMode
   */
  ColorGradientPickerDialog.prototype.show = function (options) {
    var _self = this;
    var handleAcceptColor = function () {
      _self.modalDialog.close();
      options && options.onAcceptGradient && options.onAcceptGradient(_self.colorGradientPicker.getColorGradient());
    };

    // Display given color gradient (if passed) to gradient picker
    if (options && options.colorGradient) {
      this.colorGradientPicker.setGradient(options.colorGradient);
    }

    const addGradientButton = document.createElement("button");
    addGradientButton.innerHTML = "+";
    addGradientButton.addEventListener("click", this.__handleAddGradientClick());

    var selectorContainer = document.createElement("div");
    selectorContainer.style.display = "flex";
    selectorContainer.style.flexDirection = "row";
    selectorContainer.style.justifyContent = "space-between";
    selectorContainer.appendChild(this.colorGradientSelector.container);
    selectorContainer.appendChild(addGradientButton);

    var modalBody = document.createElement("div");
    // modalBody.appendChild(this.colorGradientSelector.container);
    modalBody.appendChild(selectorContainer);
    modalBody.appendChild(this.colorGradientPicker.container);
    this.modalDialog.setTitle("Color Gradient Picker Dialog");
    this.modalDialog.setFooter("");
    this.modalDialog.setActions([{ label: "Accept", action: handleAcceptColor }, Modal.ACTION_CLOSE]);
    this.modalDialog.setBody(modalBody);
    this.modalDialog.open();
  };

  _context.ColorGradientPickerDialog = ColorGradientPickerDialog;
})(globalThis);
