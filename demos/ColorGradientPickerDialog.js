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
  var ColorGradientPickerDialog = function (modalDialog) {
    // var modal = new Modal({ closeOnBackdropClick: true });
    this.modalDialog = modalDialog;
    this.colorGradientPicker = new ColorGradientPicker(null);
  };

  /**
   * Show the gradient picker dialog with the given options.
   *
   * @param {function} options.onAcceptGradient
   * @param {ColorGradient} options.colorGradient
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
