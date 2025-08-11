/**
 * A simple ColorGradientPickerDialog using modal.js.
 *
 * @require ./modal.js
 * @require ./src/cjs/utils/dom/components/ColorGradientPicker.js
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

    var modalBody = document.createElement("div");
    modalBody.appendChild(this.colorGradientPicker.container);
    this.modalDialog.setTitle("Color Gradient Picker Dialog");
    this.modalDialog.setFooter("");
    this.modalDialog.setActions([{ label: "Accept", action: handleAcceptColor }, Modal.ACTION_CLOSE]);
    this.modalDialog.setBody(modalBody);
    this.modalDialog.open();
  };

  _context.ColorGradientPickerDialog = ColorGradientPickerDialog;
})(globalThis);
