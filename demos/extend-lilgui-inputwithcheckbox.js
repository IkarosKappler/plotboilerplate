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
 * @date    2024-07-18
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
    targetController.min = function (newMin) {
      sourceController.min(newMin);
      return targetController;
    };
    targetController.max = function (newMax) {
      sourceController.max(newMax);
      return sourceController;
    };
    targetController.step = function (newStep) {
      sourceController.step(newStep);
      return sourceController;
    };
    targetController._onUpdateMinMax = sourceController._onUpdateMinMax;

    targetController.onChange = function (handler) {
      targetController._handleChange = handler;
      return targetController;
    };
  };

  var initChildController = function (_self, parent, object, numberProperty, booleanProperty, rgbScale) {
    /** Create a new input element like this (lil-gui style checkbox) */
    //     <input type="checkbox" aria-labelledby="lil-gui-name-1">
    _self.$checkbox = document.createElement("input");
    _self.$checkbox.setAttribute("type", "checkbox");
    if (Boolean(object[booleanProperty])) {
      _self.$checkbox.setAttribute("checked", "checked");
    }
    _self.$checkbox.style["min-width"] = "var(--checkbox-size)"; // "15px";
    _self.$checkbox.style["max-width"] = "var(--checkbox-size)"; // "15px";
    _self.$checkbox.style["width"] = "var(--checkbox-size)"; // "15px";

    /** Create a container for the checkbox. Add some padding to its right. */
    var checkboxContainer = document.createElement("div");
    checkboxContainer.style["padding-right"] = "4px";
    checkboxContainer.appendChild(_self.$checkbox);

    /** This is just a dummy function so we don't need to check for null */
    _self._handleChange = function () {
      /* NOOP */
    };

    /** Will need this reference later */
    // var _self = _self;

    /** Handle change events on our range slider */
    _self.$checkbox.addEventListener("change", function (evt) {
      var newValue = Boolean(evt.target.checked); // evt.target.value);
      _self._appylNewCheckboxValue(newValue);
      _self._handleCheckboxChange(newValue);
      _self._fireOnChange();
    });

    _self._appylNewCheckboxValue = function (isChecked) {
      console.log("Setting property value for", booleanProperty, "to", isChecked);
      object[booleanProperty] = isChecked;
    };

    _self._handleCheckboxChange = function (newIsChecked) {
      console.log("_handleCheckboxChange", newIsChecked);
      if (newIsChecked) {
        _self._enableByCheckbox();
      } else {
        _self._disableByCheckbox();
      }
    };

    _self._fireOnChange = function () {
      if (this._handleChange) {
        this._handleChange(object[numberProperty], object[booleanProperty]);
      }
    };

    _self.baseController.onChange(function () {
      _self._fireOnChange();
    });

    _self._disableByCheckbox = function () {
      this.baseController.$widget.classList.add("disabled-bycheckbox");
    };

    _self._enableByCheckbox = function () {
      console.log("remove");
      this.baseController.$widget.classList.remove("disabled-bycheckbox");
    };

    _self.baseController.$widget.prepend(checkboxContainer);
    _self._handleCheckboxChange(Boolean(object[booleanProperty])); // Disable input if initially required
  };

  lil.NumberWithCheckboxController = function (parent, object, numberProperty, booleanProperty, rgbScale) {
    this.baseController = new lil.NumberController(parent, object, numberProperty, rgbScale);
    initChildController(this, parent, object, numberProperty, booleanProperty, rgbScale);
  };

  lil.BooleanWithCheckboxController = function (parent, object, numberProperty, booleanProperty, rgbScale) {
    this.baseController = new lil.BooleanController(parent, object, numberProperty, rgbScale);
    initChildController(this, parent, object, numberProperty, booleanProperty, rgbScale);
  };

  lil.ColorWithCheckboxController = function (parent, object, numberProperty, booleanProperty, rgbScale) {
    this.baseController = new lil.ColorController(parent, object, numberProperty, rgbScale);
    initChildController(this, parent, object, numberProperty, booleanProperty, rgbScale);
  };

  /** 'Inherit' from lilgui's default ColorController */
  lil.NumberWithCheckboxController.prototype = Object.assign({}, lil.ColorController.prototype);

  /** Finally add the new method 'addNumberWithCheckbox' to lil.GUI */
  lil.GUI.prototype.addNumberWithCheckbox = function (object, numberProperty, booleanProperty, rgbScale) {
    var cntrlr = new lil.NumberWithCheckboxController(this, object, numberProperty, booleanProperty, rgbScale);
    copyEssentialControllerProps(cntrlr, cntrlr.baseController);
    return cntrlr;
  };

  /** Finally add the new method 'addBooleanWithCheckbox' to lil.GUI */
  lil.GUI.prototype.addBooleanWithCheckbox = function (object, numberProperty, booleanProperty, rgbScale) {
    var cntrlr = new lil.BooleanWithCheckboxController(this, object, numberProperty, booleanProperty, rgbScale);
    copyEssentialControllerProps(cntrlr, cntrlr.baseController);
    return cntrlr;
  };

  /** Finally add the new method 'addColorWithCheckbox' to lil.GUI */
  lil.GUI.prototype.addColorWithCheckbox = function (object, numberProperty, booleanProperty, rgbScale) {
    var cntrlr = new lil.ColorWithCheckboxController(this, object, numberProperty, booleanProperty, rgbScale);
    copyEssentialControllerProps(cntrlr, cntrlr.baseController);
    return cntrlr;
  };

  /** Finally add the new method 'addColorWithCheckbox' to lil.GUI */
  lil.GUI.prototype.addWithCheckbox = function (object, propertyName, isEnabledPropertyName, rgbScale) {
    var cntrlr = null;
    if (typeof object[propertyName] === "number") {
      cntrlr = this.addNumberWithCheckbox(object, propertyName, isEnabledPropertyName, rgbScale);
    } else {
      cntrlr = this.addBooleanWithCheckbox(object, propertyName, isEnabledPropertyName, rgbScale);
    }
    copyEssentialControllerProps(cntrlr, cntrlr.baseController);
    return cntrlr;
  };
})(lil);
