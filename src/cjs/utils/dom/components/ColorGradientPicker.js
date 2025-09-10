"use strict";
/**
 * Approach for a 'simple' color gradient picker for my PlotBoilerplate library.
 *
 * As it turned out a bit more complex in the end – due to the fact that color gradient
 * picking is not a super simple task – so I used JSX here. Thus a JSX library is required
 * to get this running: NoReact.
 *
 *
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradientPicker = void 0;
var NoReact = require("noreact");
var Color_1 = require("../../datastructures/Color");
var ColorGradient_1 = require("../../datastructures/ColorGradient");
var ColorGradientPicker = /** @class */ (function () {
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     * @param {boolean?} isMobileMode - (optional) If `true` then the elements are rendered in double size.
     */
    function ColorGradientPicker(containerID, isMobileMode) {
        var _this = this;
        this._sliderElementRefs = [];
        this.sliderMin = 0;
        this.sliderMax = 100;
        // Only used during initialization!
        this.isMobileMode = false;
        this.css_indicatorWidth_num = 1.0;
        this.css_indicatorWidth = "1em";
        this.css_indicatorHeight = "1em";
        this.css_thumbWidth = "0.5em";
        this.css_thumbHeight = "1.333em";
        this.css_containerHeight = "20px";
        this.installedChangeListeners = [];
        this.__mouseDownPosition = null;
        /**
         * Creates a callback function for range slider.
         *
         * @returns
         */
        this.__createSliderChangeHandler = function () {
            var _self = _this;
            return function (e) {
                var targetSlider = e.target;
                // console.log("Clicked", targetSlider ? targetSlider.getAttribute("id") : null);
                if (!targetSlider) {
                    return false;
                }
                var currentSliderValue = Number.parseFloat(targetSlider.value);
                var rangeSliderIndexRaw = targetSlider.dataset["rangeSliderIndex"];
                // console.log("rangeSliderIndexRaw", rangeSliderIndexRaw);
                if (!rangeSliderIndexRaw) {
                    return false;
                }
                var rangeSliderIndex = Number.parseInt(rangeSliderIndexRaw);
                var leftSliderValue = _this.__getSliderValue(rangeSliderIndex - 1, _self.sliderMin);
                var rightSliderValue = _this.__getSliderValue(rangeSliderIndex + 1, _self.sliderMax);
                if (leftSliderValue >= currentSliderValue) {
                    targetSlider.value = "".concat(leftSliderValue);
                    _self.__updateBackgroundGradient();
                    _self.__updateColorIndicator(rangeSliderIndex);
                    return false;
                }
                else if (rightSliderValue <= currentSliderValue) {
                    targetSlider.value = "".concat(rightSliderValue);
                    _self.__updateBackgroundGradient();
                    _self.__updateColorIndicator(rangeSliderIndex);
                    return false;
                }
                else {
                    _self.__updateBackgroundGradient();
                    _self.__updateColorIndicator(rangeSliderIndex);
                    return true;
                }
            };
        };
        /**
         * Adds custom styles (global STYLE tag).
         *
         * @private
         */
        this.__createCustomStylesElement = function () {
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            return (NoReact.createElement("style", null, "\n    #".concat(_this.elementID, " {\n      margin-top: 1em;\n    }\n\n    #").concat(_this.elementID, " input[type='range'] {\n\n      -webkit-appearance: none;\n\n      grid-column: 1;\n      grid-row: 2;\n      \n      /* same as before */\n      background: none; /* get rid of white Chrome background */\n      color: #000;\n      font: inherit; /* fix too small font-size in both Chrome & Firefox */\n      margin: 0;\n      pointer-events: none; /* let clicks pass through */\n    }\n\n    #").concat(_this.elementID, " input[type='range']::-webkit-slider-runnable-track {\n      -webkit-appearance: none;\n\n      background: none; /* get rid of Firefox track background */\n      height: 100%;\n      width: 100%;\n\n      pointer-events: none;\n    }\n\n    #").concat(_this.elementID, " input[type='range']::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      background: currentcolor;\n      border: none; /* get rid of Firefox thumb border */\n      border-radius: 6px; /* get rid of Firefox corner rounding */\n      pointer-events: auto; /* catch clicks */\n      width: ").concat(_this.css_thumbWidth, "; \n      height: ").concat(_this.css_thumbHeight, ";\n    }\n\n    #").concat(_this.elementID, " input[type='range']:focus::-webkit-slider-thumb {\n      border: 2px solid white;\n    }\n\n    #").concat(_this.elementID, " input[type='range']::-moz-range-track {\n      -webkit-appearance: none;\n      background: none; /* get rid of Firefox track background */\n      height: 100%;\n      width: 100%;\n      pointer-events: none;\n    }\n\n    #").concat(_this.elementID, " input[type='range']::-moz-range-thumb {\n      /* -webkit-appearance: none; */\n      background: currentcolor;\n      border: none; /* get rid of Firefox thumb border */\n      border-radius: 6px; /* get rid of Firefox corner rounding */\n      pointer-events: auto; /* catch clicks */\n      width: ").concat(_this.css_thumbWidth, "; \n      height: ").concat(_this.css_thumbHeight, ";\n    }\n\n    #").concat(_this.elementID, " input[type='range']:focus::-moz-range-thumb {\n      border: 2px solid white;\n    }\n\n    #").concat(_this.elementID, " input[type='range'] {\n      /* same as before */\n      z-index: 1;\n    }\n    \n    #").concat(_this.elementID, " input[type='range']:focus {\n        z-index: 2;\n        /* outline: dotted 1px orange; */\n        color: darkorange;\n    }\n    ")));
        };
        if (containerID) {
            var cont = document.getElementById(containerID);
            if (!cont) {
                throw "Cannot create ColorGradientPicker. Component ID does not exist.";
            }
            this.container = cont;
        }
        else {
            this.container = document.createElement("div");
        }
        this.baseID = Math.floor(Math.random() * 65535);
        this.elementID = "color-gradient-picker-".concat(this.baseID);
        this.colorGradient = ColorGradient_1.ColorGradient.createDefault();
        this.isMobileMode = Boolean(isMobileMode);
        if (isMobileMode) {
            // Double size :)
            this.css_indicatorWidth_num = 2.0;
            this.css_indicatorWidth = "2em";
            this.css_indicatorHeight = "2em";
            this.css_thumbWidth = "1.0em";
            this.css_thumbHeight = "2.666em";
            this.css_containerHeight = "40px";
        }
        document.head.appendChild(this.__createCustomStylesElement());
        this.container.append(this._render());
        this.__initializeDataSets();
        this.__updateColorIndicator(0);
        this.__updateBackgroundGradient();
    } // END constructor
    ColorGradientPicker.prototype.setGradient = function (gradient, fireChangeEvent) {
        // We are lazy: just throw away everything and rebuild all.
        this.__removeAllChildNodes(this.container);
        this.colorGradient = gradient;
        this.container.append(this._render());
        this.__initializeDataSets();
        this.__updateColorIndicator(0);
        this.__updateBackgroundGradient();
        if (fireChangeEvent) {
            this.__fireChangeEvent();
        }
    };
    // +---------------------------------------------------------------------------------
    // | A helper function to remove all child nodes.
    // +-------------------------------
    ColorGradientPicker.prototype.__removeAllChildNodes = function (node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    };
    // +---------------------------------------------------------------------------------
    // | Used during initialization: define dataset values for each slider.
    // +-------------------------------
    ColorGradientPicker.prototype.__initializeDataSets = function () {
        for (var i = 0; i < this._sliderElementRefs.length; i++) {
            var sliderColor = this.colorGradient.values[i].color;
            // console.log("Setting up slider color data set", i, sliderColor, sliderColor.cssRGB(), sliderColor.cssHEX());
            this._sliderElementRefs[i].current.dataset.colorValue = sliderColor.cssRGB();
            this._sliderElementRefs[i].current.dataset.colorValueHEX = sliderColor.cssHEX();
        }
    };
    /**
     * Adds a new color gradient change listener to this ColorGradientPicker.
     *
     * @param {ColorGradientChangeListener} listener - The listener to add.
     * @returns {boolean} True, if the listener was added and did not exist before.
     */
    ColorGradientPicker.prototype.addChangeListener = function (listener) {
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            if (this.installedChangeListeners[i] === listener) {
                return false;
            }
        }
        this.installedChangeListeners.push(listener);
        return true;
    };
    /**
     *
     * @param {ColorGradientChangeListener} listener The listener to remove.
     * @returns {boolean} True, if the listener existed and has been removed.
     */
    ColorGradientPicker.prototype.removeChangeListener = function (listener) {
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            if (this.installedChangeListeners[i] === listener) {
                this.installedChangeListeners.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    /**
     * Fires a change event to all installed listeners.
     */
    ColorGradientPicker.prototype.__fireChangeEvent = function () {
        var newColorGradient = this.getColorGradient();
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            this.installedChangeListeners[i](newColorGradient, this);
        }
    };
    /**
     * Creates a new color range input element.
     *
     * @private
     * @param {number} baseID
     * @param index
     * @param sliderMin
     * @param sliderMax
     * @param initialValue
     * @param initialColor
     * @returns
     */
    ColorGradientPicker.prototype.__createColorRangeInput = function (index, sliderMin, sliderMax, initialValue, initialColor) {
        var sliderHandler = this.__createSliderChangeHandler();
        var ref = NoReact.useRef();
        // this._sliderElementRefs.push(ref);
        this._sliderElementRefs.splice(index, 0, ref);
        // console.log("new _sliderElementRefs", this._sliderElementRefs);
        // Update all elements to the right of the new elelemt
        this.__updateSliderDataSetIndices(index + 1);
        return (NoReact.createElement("input", { id: "rage-slider-".concat(this.baseID, "-").concat(index), type: "range", min: sliderMin, max: sliderMax, value: initialValue, style: { pos: "absolute", l: "0px", t: "0px", w: "100%", h: "60%" }, "data-range-slider-index": "".concat(index), "data-colorValue": initialColor.cssRGB(), "data-colorValueHEX": initialColor.cssHEX(), onChange: sliderHandler, onClick: sliderHandler, ref: ref }));
    };
    /**
     * Get the absolute length of this range, in slider units.
     * @returns
     */
    ColorGradientPicker.prototype.getRangeLength = function () {
        return this.sliderMax - this.sliderMin;
    };
    /**
     * Handles color value changes.
     *
     * @returns
     */
    ColorGradientPicker.prototype.__colorChangeHandler = function () {
        var _this = this;
        var _self = this;
        return function (_evt) {
            // console.log("__colorChangeHandler");
            var activeSliderIndex_raw = _this.colorInputRef.current.dataset.activeSliderIndex;
            if (!activeSliderIndex_raw) {
                console.warn("Cannot update color indicator; no active range slider set. This is likely a program error and should not happen.");
                return false;
            }
            var activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
            if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self._sliderElementRefs.length) {
                console.warn("Cannot update color indicator; active index invalid or out of bounds. This is likely a program error and should not happen.", activeSliderIndex);
                return false;
            }
            var newColor = _self.colorInputRef.current.value;
            var rangeSlider = _self._sliderElementRefs[activeSliderIndex].current;
            rangeSlider.dataset.colorValue = newColor;
            // rangeSlider.dataset["colorValue"] = newColor;
            _this.colorIndicatorColorButtonRef.current.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            _self.__fireChangeEvent();
            return true;
        };
    };
    /**
     * Removed the current color slider from the DOM and highlights the left neighbour.
     *
     * @returns {boolean} True if the element could be successfully removed.
     */
    ColorGradientPicker.prototype.__handleRemoveColor = function () {
        // const colorInput : HTMLInputElement | null = evt.target;
        // console.log("__colorChangeHandler");
        var activeSliderIndex_raw = this.colorInputRef.current.dataset.activeSliderIndex;
        if (!activeSliderIndex_raw) {
            console.warn("Cannot remove color indicator; no active range slider set.");
            return false;
        }
        var activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
        if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= this._sliderElementRefs.length) {
            console.warn("Cannot remove color indicator; active index invalid or out of bounds.", activeSliderIndex);
            return false;
        }
        if (activeSliderIndex === 0 || activeSliderIndex + 1 === this.getRangeLength()) {
            console.warn("Cannot remove color indicator; leftmost and rightmost slider must not be removed.", activeSliderIndex);
            return false;
        }
        var sliderElementRef = this._sliderElementRefs[activeSliderIndex];
        sliderElementRef.current.remove();
        this._sliderElementRefs.splice(activeSliderIndex, 1);
        // Update all elements to the right of the removed elelemt
        this.__updateSliderDataSetIndices(activeSliderIndex);
        // Set left element active
        this.__updateColorIndicator(activeSliderIndex - 1);
        this.__updateBackgroundGradient();
        this.__fireChangeEvent();
        return true;
    };
    /**
     * Once a slider element was added or removed then the following indices must be updated.
     *
     * @param {number} startIndex - The slider index to start updating at.
     */
    ColorGradientPicker.prototype.__updateSliderDataSetIndices = function (startIndex) {
        // Update all elements to the right of the new elelemt
        for (var i = startIndex; i < this._sliderElementRefs.length; i++) {
            this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", "".concat(i));
            this._sliderElementRefs[i].current.setAttribute("id", "rage-slider-".concat(this.baseID, "-").concat(i));
        }
    };
    /**
     * To avoid too many sliders added on each click, check if the mouse was moved in the meantime (detect drag event).
     *
     * @returns
     */
    ColorGradientPicker.prototype.__containerMouseDownHandler = function () {
        var _self = this;
        return function (event) {
            _self.__mouseDownPosition = { x: event.clientX, y: event.clientY };
            // console.log("__containerMouseDownHandler _self.__mouseDownPosition", _self.__mouseDownPosition);
        };
    };
    /**
     * Creates a handler for click events on the container. If the click event is far
     * enough from existing sliders, then it can be added.
     *
     * @returns
     */
    ColorGradientPicker.prototype.__containerClickHandler = function () {
        var _this = this;
        var _self = this;
        var maxDifference = _self.getRangeLength() * 0.03;
        return function (evt) {
            // console.log("Container click handler");
            var relativeValue = _self.__clickEventToRelativeValue(evt);
            if (relativeValue < 0 || relativeValue > 1.0) {
                // Clicked somewhere outside the range
                return;
            }
            // Check if element was moved in the meantime
            if (_self.__mouseDownPosition && Math.abs(_self.__mouseDownPosition.x - evt.clientX) >= 10.0) {
                // Ignore event if mouse was moved more than 10 pixels between down- and up-event
                // console.log("Mouse was moved more than 10 px. Cancelling.");
                _self.__mouseDownPosition = null;
                return;
            }
            var absoluteValue = _this.__relativeToAbsolute(relativeValue);
            // console.log("click", "relativeValue", relativeValue, "absoluteValue", absoluteValue);
            // Check if click position (ratio) is far enough away from any slider
            var _a = _self.__locateClosestSliderValue(absoluteValue), leftSliderIndex = _a[0], closestSliderValue = _a[1];
            var diff = Math.abs(closestSliderValue - absoluteValue);
            if (diff >= maxDifference) {
                // console.log("Add slider here");
                _self.__addSliderAt(absoluteValue, leftSliderIndex);
            }
            else {
                // console.debug("Don't add slider here.");
            }
            // Finally clear mousedown-position
            _self.__mouseDownPosition = null;
        };
    };
    /**
     * Find that slider (index) that's value is closest to the given absolute value. The function will return
     * the closest value and the left index, indicating the containing interval index.
     *
     * @param {number} absoluteValue - The value to look for.
     * @returns {[number,number]} A pair of left slider index and closest value.
     */
    ColorGradientPicker.prototype.__locateClosestSliderValue = function (absoluteValue) {
        // As the colorGradient always reflects the slider values we can just ust the color gradient itself to search.
        var relativeValue = this.__absoluteToRelative(absoluteValue);
        var colorGradientEntry = this.colorGradient.locateClosestRatio(relativeValue);
        return [colorGradientEntry[0], this.__relativeToAbsolute(colorGradientEntry[1].ratio)];
    };
    /**
     * Convert the click event to the relative x value in [0..1].
     *
     * @param {MouseEvent} evt - The mouse event.
     * @returns {number} The relative x value.
     */
    ColorGradientPicker.prototype.__clickEventToRelativeValue = function (evt) {
        var target = evt.target;
        var rect = target.getBoundingClientRect();
        var x = evt.clientX - rect.left; //x position within the element.
        var width = rect.width; // target.clientWidth;
        var relativeValue = x / width;
        // console.log("width", width, "x", x, "relativeValue", relativeValue);
        return relativeValue;
    };
    /**
     * Adds a slider at the given interval index.
     *
     * @param {number} absoluteValue - The absolute new slider value.
     * @param {number} leftSliderIndex - The new slider's position (interval index).
     */
    ColorGradientPicker.prototype.__addSliderAt = function (absoluteValue, leftSliderIndex) {
        // console.log("__addSliderAt", "absoluteValue", absoluteValue, "leftSliderIndex", leftSliderIndex);
        var leftSlider = this._sliderElementRefs[leftSliderIndex].current;
        // const colorAtPosition = this.__getSliderColorAt(relativeValue);
        var newColor = this.__getSliderColorAt(absoluteValue);
        var newSliderIndex = leftSliderIndex + 1;
        var _newSlider = this.__createColorRangeInput(newSliderIndex, this.sliderMin, this.sliderMax, absoluteValue, newColor // initialColor: string
        );
        var sliderRef = this._sliderElementRefs[newSliderIndex];
        leftSlider.after(sliderRef.current);
        sliderRef.current.dataset.colorValue = newColor.cssRGB();
        sliderRef.current.dataset.colorValueHEX = newColor.cssHEX();
        // No visible change, but let's reflect this in the output gradient anyway
        this.__updateBackgroundGradient();
        // Highlight the newly added range slider
        this.__updateColorIndicator(newSliderIndex);
        this.__fireChangeEvent();
    };
    /**
     * Get the slider color at the given absolute value. That value must be inside the [MIN_VALUE, MAX_VALUE] interval.
     * @param absoluteValue
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderColorAt = function (absoluteValue) {
        // console.log("__getSliderColorAt", "absoluteValue", absoluteValue);
        // Locate interval
        var leftIndex = this.__locateIntervalAt(absoluteValue);
        var leftSliderValue = this.__getSliderValue(leftIndex, NaN);
        var rightSliderValue = this.__getSliderValue(leftIndex + 1, NaN);
        if (Number.isNaN(leftSliderValue) || Number.isNaN(rightSliderValue)) {
            console.warn("[Warn] Failed to determine left/right slider values at indices ".concat(leftIndex, " or ").concat(rightSliderValue, ". Cannot proceed for absolute value ").concat(absoluteValue, "."));
            return null;
        }
        var leftColorString = this.__getSliderColorString(leftIndex, null);
        var rightColorString = this.__getSliderColorString(leftIndex + 1, null);
        if (!leftColorString || !rightColorString) {
            console.warn("[Warn] Failed to determine left/right color string values at indices ".concat(leftIndex, " or ").concat(rightSliderValue, ". Cannot proceed for absolute value ").concat(absoluteValue, "."));
            return null;
        }
        var positionInsideInterval = (absoluteValue - leftSliderValue) / (rightSliderValue - leftSliderValue);
        // console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
        var leftColorObject = Color_1.Color.parse(leftColorString);
        var rightColorObject = Color_1.Color.parse(rightColorString);
        var newColor = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
        return newColor;
    };
    /**
     * Locate the slider interval that contains the given (absolute) slider value. The given value must be
     * somewhere between MIN_VALUE and MAX_VALUE (usually between 0 and 100 in the default configuraion.).
     *
     * @param {number} absoluteValue - The absolute value to search for.
     * @returns {number} The left slider inder the containing interval is starting with – or -1 if out of bounds.
     */
    ColorGradientPicker.prototype.__locateIntervalAt = function (absoluteValue) {
        for (var i = 0; i + 1 < this._sliderElementRefs.length; i++) {
            if (this.__getSliderValue(i, this.sliderMin) <= absoluteValue &&
                absoluteValue < this.__getSliderValue(i + 1, this.sliderMax)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Converts a relative value in [0..1] to [min..max].
     * @param relativeValue
     */
    ColorGradientPicker.prototype.__relativeToAbsolute = function (relativeValue) {
        return this.sliderMin + (this.sliderMax - this.sliderMin) * relativeValue;
    };
    /**
     * Converts a relative value in [0..1] to [min..max].
     * @param relativeValue
     */
    ColorGradientPicker.prototype.__absoluteToRelative = function (absolute) {
        return (absolute - this.sliderMin) / (this.sliderMax - this.sliderMin);
    };
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderValue = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        return Number.parseFloat(this._sliderElementRefs[sliderIndex].current.value);
    };
    /**
     * Get all current slider values as an array.
     * @returns
     */
    ColorGradientPicker.prototype.__getAllSliderValues = function () {
        var _this = this;
        return this._sliderElementRefs.map(function (ref, index) { return _this.__getSliderValue(index, NaN); });
    };
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    ColorGradientPicker.prototype.__updateBackgroundGradient = function () {
        var _this = this;
        // const colorGradient = this.getColorGradient();
        this.colorGradient = new ColorGradient_1.ColorGradient(this.__getAllSliderValues().map(function (sliderValue, sliderIndex) { return ({
            color: _this.__getSliderColor(sliderIndex, null),
            ratio: _this.__absoluteToRelative(sliderValue)
        }); }), this.colorGradient.angle);
        this.containerRef.current.style["background"] = this.colorGradient.toColorGradientString();
    };
    /**
     * After changes this function updates the color indicator button.
     *
     * @param {number} rangeSliderIndex - The new active slider index.
     */
    ColorGradientPicker.prototype.__updateColorIndicator = function (rangeSliderIndex) {
        var colorValue = this.__getSliderColorHEXString(rangeSliderIndex, "#808080");
        var ratio = this.__getSliderPercentage(rangeSliderIndex);
        // Set left offset of color input container
        this.colorInputContainerRef.current.style["left"] = "calc( ".concat(ratio * 100, "% + ").concat((1.0 - ratio) * this.css_indicatorWidth_num * 0.5, "em - ").concat(ratio * this.css_indicatorWidth_num * 0.5, "em)");
        // Also set offset of colot input element (safari will open the native color dialog at this position)
        this.colorInputRef.current.style["left"] = "calc( ".concat(ratio * 100, "% + ").concat((1.0 - ratio) * this.css_indicatorWidth_num * 0.5, "em - ").concat(ratio * this.css_indicatorWidth_num * 0.5, "em)");
        this.colorIndicatorColorButtonRef.current.style["background-color"] = colorValue;
        this.colorInputRef.current.value = colorValue;
        // console.log("Setting new color value", this.colorInputRef.current.value, colorValue);
        this.colorInputRef.current.dataset.activeSliderIndex = "".concat(rangeSliderIndex);
        if (rangeSliderIndex <= 0 || rangeSliderIndex + 1 >= this._sliderElementRefs.length) {
            this.colorIndicatorRemoveButtonRef.current.style["visibility"] = "hidden";
        }
        else {
            this.colorIndicatorRemoveButtonRef.current.style["visibility"] = "visible";
        }
    };
    /**
     * Get a color gradient CSS value string from the current editor settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {ColorGradient}
     */
    ColorGradientPicker.prototype.getColorGradient = function () {
        return this.colorGradient;
    };
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderColorString = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        var colorValue = this._sliderElementRefs[sliderIndex].current.dataset.colorValue;
        return colorValue ? colorValue : fallback;
    };
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderColorHEXString = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        var colorValue = this._sliderElementRefs[sliderIndex].current.dataset.colorValueHEX;
        return colorValue ? colorValue : fallback;
    };
    /**
     * Get get color of this gradient picker at the given slider index.
     *
     * @param {number} sliderIndex - The index to get the slider color from. Something between 0 and _sliderElementRefs.length.
     * @param {Color} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderColor = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        var colorValueString = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
        var colorValue = Color_1.Color.parse(colorValueString);
        return colorValue ? colorValue : fallback;
    };
    /**
     * Get the slider's value in a mapped range of 0.0 ... 1.0.
     *
     * @param sliderIndex
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderPercentage = function (sliderIndex) {
        var sliderValue = this.__getSliderValue(sliderIndex, 0.0);
        var percentage = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
        return percentage;
    };
    /**
     * Init the container contents.
     *
     * @private
     */
    ColorGradientPicker.prototype._render = function () {
        var _this = this;
        var _self = this;
        // console.log("Rendering ...", NoReact);
        this._sliderElementRefs = [];
        this.colorIndicatorColorButtonRef = NoReact.useRef();
        this.colorIndicatorRemoveButtonRef = NoReact.useRef();
        this.colorInputRef = NoReact.useRef();
        this.colorInputContainerRef = NoReact.useRef();
        this.containerRef = NoReact.useRef();
        /**
         * This helper method is called when the tiny color button below the active slider is clicked. The method
         * triggers the colorInput dialog to be triggered.
         *
         * @param {Event} evt
         */
        var handleIndicatorButtonClick = function (evt) {
            evt.preventDefault(); // Prevent other inputs to react to this event.
            evt.stopPropagation();
            // But fake a click on the input element
            // console.log("Current selected color: " + _self.colorInputRef.current.value);
            _self.colorInputRef.current.click();
        };
        /**
         * This helper method is called when the remove-color button is clicked. It removes the
         * currently active color slider – if possible (leftmost and rightmost slider cannot be removed).
         * @param evt
         */
        var handleRemoveColorButtonClick = function (evt) {
            evt.preventDefault(); // Prevent other inputs to react to this event.
            evt.stopPropagation();
            _self.__handleRemoveColor();
        };
        return (NoReact.createElement("div", { id: this.elementID, style: {
                d: "flex",
                fd: "column",
                w: "100%",
                h: this.css_containerHeight,
                pos: "relative",
                mb: this.isMobileMode ? "5em" : "3em"
            }, ref: this.containerRef, onMouseDown: this.__containerMouseDownHandler(), onClick: this.__containerClickHandler() },
            this.colorGradient.values.map(function (colorGradientItem, index) {
                var initialValue = _self.__relativeToAbsolute(colorGradientItem.ratio);
                return _this.__createColorRangeInput(index, _this.sliderMin, _this.sliderMax, initialValue, colorGradientItem.color);
            }),
            NoReact.createElement("div", { style: { w: "100%" } },
                NoReact.createElement("input", { id: "color-indicator-input-".concat(this.baseID), type: "color", style: { v: "hidden", pos: "absolute", l: 0 }, 
                    // data-active-slider-index=""
                    ref: this.colorInputRef, onInput: this.__colorChangeHandler() }),
                NoReact.createElement("div", { ref: this.colorInputContainerRef, style: {
                        pos: "absolute",
                        b: "0px",
                        l: "0%",
                        d: "flex",
                        fd: "column",
                        transform: "translate(0%, 100%)"
                    } },
                    NoReact.createElement("button", { id: "color-indicator-button-".concat(this.baseID), style: {
                            backgroundColor: "grey",
                            borderRadius: "10%",
                            border: "1px solid grey",
                            w: this.css_indicatorWidth, // "1em",
                            h: this.css_indicatorHeight, // "1em",
                            transform: "translate(-50%, 0%)"
                        }, onClick: handleIndicatorButtonClick, ref: this.colorIndicatorColorButtonRef }),
                    NoReact.createElement("button", { id: "color-remove-button-".concat(this.baseID), className: "color-remove-button", style: {
                            backgroundColor: "grey",
                            borderRadius: "10%",
                            border: "1px solid grey",
                            w: this.css_indicatorWidth, // "1em",
                            h: this.css_indicatorHeight, // "1em",
                            transform: "translate(-50%, 50%)",
                            lineHeight: "0.5em",
                            p: 0
                        }, onClick: handleRemoveColorButtonClick, ref: this.colorIndicatorRemoveButtonRef },
                        NoReact.createElement("span", { style: { fontSize: this.isMobileMode ? "1.0em" : "0.5em" } }, "\uD83D\uDDD1"))))));
    }; // END function render()
    return ColorGradientPicker;
}());
exports.ColorGradientPicker = ColorGradientPicker;
//# sourceMappingURL=ColorGradientPicker.js.map