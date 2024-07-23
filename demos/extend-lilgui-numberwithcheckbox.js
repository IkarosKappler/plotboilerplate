/**
 * A slider-with-checkbox extension for lil-gui. Can be used to modify a range value – or disable
 * it completely.
 * For lil-gui see https://github.com/georgealways/lil-gui
 *
 * Demo: https://www.int2byte.de/public/plotboilerplate/tests/test_lilgui_addcolorwithalpha.html
 *
 * Adds a new controller which can be called like
 *  `new lil.GUI()
 *    .addNumberWithCheckbox( { myNumber: 0.5, isEnabled: true },
 *                        "myNumber",
 *                        "isEnabled" )
 *    .onChange( function(newNumberValue,isEnabled) { \/* ... do your stuff ... *\/ } )
 *    .min(0.0)
 *    .max(1.0);
 * `
 *
 * @author  Ikaros Kappler
 * @date    2024-07-14
 * @version 1.0.0
 */

lil.NumberWithCheckboxController = function (parent, object, numberProperty, booleanProperty, rgbScale) {
  this.baseNumberController = new lil.NumberController(parent, object, numberProperty, rgbScale);

  /** Create a new input element like this (lil-gui style checkbox) */
  //     <input type="checkbox" aria-labelledby="lil-gui-name-1">
  this.$checkbox = document.createElement("input");
  this.$checkbox.setAttribute("type", "checkbox");
  if (Boolean(object[booleanProperty])) {
    this.$checkbox.setAttribute("checked", "checked");
  }
  this.$checkbox.style["min-width"] = "var(--checkbox-size)"; // "15px";
  this.$checkbox.style["max-width"] = "var(--checkbox-size)"; // "15px";
  this.$checkbox.style["width"] = "var(--checkbox-size)"; // "15px";

  /** Create a container for the checkbox. Add some padding to its right. */
  var checkboxContainer = document.createElement("div");
  checkboxContainer.style["padding-right"] = "4px";
  checkboxContainer.appendChild(this.$checkbox);

  /** This is just a dummy function so we don't need to check for null */
  this._handleChange = function () {
    /* NOOP */
  };

  /** Will need this reference later */
  var _self = this;

  /** Handle change events on our range slider */
  this.$checkbox.addEventListener("change", function (evt) {
    var newValue = Boolean(evt.target.checked); // evt.target.value);
    _self._appylNewCheckboxValue(newValue);
    _self._handleCheckboxChange(newValue);
    _self._fireOnChange();
  });

  this._appylNewCheckboxValue = function (isChecked) {
    console.log("Setting property value for", booleanProperty, "to", isChecked);
    object[booleanProperty] = isChecked;
  };

  this._handleCheckboxChange = function (newIsChecked) {
    console.log("_handleCheckboxChange", newIsChecked);
    if (newIsChecked) {
      _self._enableByCheckbox();
    } else {
      _self._disableByCheckbox();
    }
  };

  this._fireOnChange = function () {
    if (this._handleChange) {
      this._handleChange(object[numberProperty], object[booleanProperty]);
    }
  };

  this.baseNumberController.onChange(function () {
    _self._fireOnChange();
  });

  this._disableByCheckbox = function () {
    this.baseNumberController.$widget.classList.add("disabled-bycheckbox");
  };

  this._enableByCheckbox = function () {
    console.log("remove");
    this.baseNumberController.$widget.classList.remove("disabled-bycheckbox");
  };

  this.baseNumberController.$widget.prepend(checkboxContainer);
  this._handleCheckboxChange(Boolean(object[booleanProperty])); // Disable input if initially required
};

/** 'Inherit' from lilgui's default ColorController */
lil.NumberWithCheckboxController.prototype = Object.assign({}, lil.ColorController.prototype);

/** Finally add the new method 'addColorWithAlpha' to lil.GUI */
lil.GUI.prototype.addNumberWithCheckbox = function (object, numberProperty, booleanProperty, rgbScale) {
  var cntrlr = new lil.NumberWithCheckboxController(this, object, numberProperty, booleanProperty, rgbScale);
  cntrlr.onChange = function (handler) {
    cntrlr._handleChange = handler;
    return cntrlr;
  };
  /** Apply essential elements */
  cntrlr.domElement = cntrlr.baseNumberController.domElement;
  cntrlr.name = cntrlr.baseNumberController.name;
  cntrlr.$name = cntrlr.baseNumberController.$name;
  cntrlr.load = cntrlr.baseNumberController.load;
  cntrlr.reset = cntrlr.baseNumberController.reset;
  cntrlr.save = cntrlr.baseNumberController.save;
  cntrlr.title = cntrlr.baseNumberController.title;
  cntrlr.min = function (newMin) {
    cntrlr.baseNumberController.min(newMin);
    return cntrlr;
  };
  cntrlr.max = function (newMax) {
    cntrlr.baseNumberController.max(newMax);
    return cntrlr.baseNumberController;
  };
  cntrlr.step = function (newStep) {
    cntrlr.baseNumberController.step(newStep);
    return cntrlr.baseNumberController;
  };
  cntrlr._onUpdateMinMax = cntrlr.baseNumberController._onUpdateMinMax;

  return cntrlr;
};
