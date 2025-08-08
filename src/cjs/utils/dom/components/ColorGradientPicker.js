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
     */
    function ColorGradientPicker(containerID) {
        var _this = this;
        this._sliderElementRefs = [];
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.indicatorWidth_num = 1.0;
        this.indicatorWidth = "1em";
        // private indicatorWidth_half = "0.5em";
        this.indicatorHeight = "1em";
        this.DEFAULT_COLORSET = [
            { color: Color_1.Color.RED, ratio: 0.0 },
            { color: Color_1.Color.GOLD, ratio: 0.2 },
            { color: Color_1.Color.YELLOW, ratio: 0.4 },
            { color: Color_1.Color.LIME_GREEN, ratio: 0.6 },
            { color: Color_1.Color.MEDIUM_BLUE, ratio: 0.8 },
            { color: Color_1.Color.PURPLE, ratio: 1.0 }
        ];
        this.installedChangeListeners = [];
        /**
         * Creates a callback function for range slider.
         *
         * @returns
         */
        this.__createSliderChangeHandler = function () {
            var _self = _this;
            return function (e) {
                var targetSlider = e.target;
                console.log("Clicked", targetSlider ? targetSlider.getAttribute("id") : null);
                if (!targetSlider) {
                    return false;
                }
                var currentSliderValue = Number.parseFloat(targetSlider.value);
                var rangeSliderIndexRaw = targetSlider.dataset["rangeSliderIndex"];
                console.log("rangeSliderIndexRaw", rangeSliderIndexRaw);
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
        this.colorGradient = new ColorGradient_1.ColorGradient(this.DEFAULT_COLORSET, Math.PI / 2.0);
        // const values: Array<ColorGradientItem> = this._sliderElementRefs.map((_ref: NoReact.Ref<HTMLInputElement>, index: number) => {
        //   return { color: this.__getSliderColor(index, null), ratio: this.__getSliderPercentage(index) };
        // });
        this.container.append(this._render());
        this.__updateColorIndicator(0);
        this.__updateBackgroundGradient();
    } // END constructor
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
        console.log("new _sliderElementRefs", this._sliderElementRefs);
        // Update all elements to the right of the new elelemt
        // for (var i = index + 1; i < this._sliderElementRefs.length; i++) {
        //   this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
        //   this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${this.baseID}-${i}`);
        // }
        this.__updateSliderDataSetIndices(index + 1);
        return (NoReact.createElement("input", { id: "rage-slider-".concat(this.baseID, "-").concat(index), type: "range", min: sliderMin, max: sliderMax, value: initialValue, style: { position: "absolute", left: "0px", top: "0px", width: "100%" }, "data-range-slider-index": index, "data-color-value": initialColor.cssRGB(), onChange: sliderHandler, onClick: sliderHandler, 
            // onMouseDown={mouseDownHandler}
            // onMouseUp={mouseUpHandler}
            ref: ref }));
    };
    ColorGradientPicker.prototype.getRangeLength = function () {
        return this.sliderMax - this.sliderMin;
    };
    ColorGradientPicker.prototype.__colorChangeHandler = function () {
        var _this = this;
        var _self = this;
        return function (_evt) {
            // const colorInput : HTMLInputElement | null = evt.target;
            console.log("__colorChangeHandler");
            var activeSliderIndex_raw = _this.colorInputRef.current.dataset["activeSliderIndex"];
            if (!activeSliderIndex_raw) {
                console.warn("Cannot update color indicator; no active range slider set.");
                return false;
            }
            var activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
            if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self._sliderElementRefs.length) {
                console.warn("Cannot update color indicator; active index invalid or out of bounds.", activeSliderIndex);
                return false;
            }
            var newColor = _self.colorInputRef.current.value;
            var rangeSlider = _self._sliderElementRefs[activeSliderIndex].current;
            rangeSlider.dataset["colorValue"] = newColor;
            // rangeSlider.dataset["colorValue"] = newColor;
            _this.colorIndicatorColorButtonRef.current.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            _self.__fireChangeEvent();
            return true;
        };
    };
    /**
     * Removed the current color slider from the DOM and highlights the left neighbour.
     * @returns
     */
    ColorGradientPicker.prototype.__handleRemoveColor = function () {
        // const colorInput : HTMLInputElement | null = evt.target;
        console.log("__colorChangeHandler");
        var activeSliderIndex_raw = this.colorInputRef.current.dataset["activeSliderIndex"];
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
    ColorGradientPicker.prototype.__updateSliderDataSetIndices = function (startIndex) {
        // Update all elements to the right of the new elelemt
        for (var i = startIndex; i < this._sliderElementRefs.length; i++) {
            this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", "".concat(i));
            this._sliderElementRefs[i].current.setAttribute("id", "rage-slider-".concat(this.baseID, "-").concat(i));
        }
    };
    ColorGradientPicker.prototype.__containerClickHandler = function () {
        var _this = this;
        var _self = this;
        var maxDifference = _self.getRangeLength() * 0.03;
        return function (evt) {
            var relativeValue = _this.__clickEventToRelativeValue(evt);
            if (relativeValue < 0 || relativeValue > 1.0) {
                // Clicked somewhere outside the range
                return;
            }
            var absoluteValue = _this.__relativeToAbsolute(relativeValue);
            console.log("click", "relativeValue", relativeValue, "absoluteValue", absoluteValue);
            // Check if click position (ratio) is far enough away from any slider
            var _a = _self.__locateClosestSliderValue(absoluteValue), leftSliderIndex = _a[0], closestSliderValue = _a[1];
            var diff = Math.abs(closestSliderValue - absoluteValue);
            // console.log(
            //   "[__containerClickHandler] closestSliderValue",
            //   closestSliderValue,
            //   "leftSliderIndex",
            //   leftSliderIndex,
            //   "relativeValue",
            //   relativeValue,
            //   "difference",
            //   diff
            // );
            if (diff >= maxDifference) {
                console.log("Add slider here");
                _self.__addSliderAt(absoluteValue, leftSliderIndex);
            }
            else {
                // console.debug("Don't add slider here.");
            }
        };
    };
    ColorGradientPicker.prototype.__locateClosestSliderValue = function (absoluteValue) {
        var allSliderValues = this.__getAllSliderValues();
        console.log("allSliderValues", allSliderValues);
        if (allSliderValues.length === 0) {
            console.warn("[Warn] All slider values array is empty. This should not happen, cannot proceed.");
            return [NaN, NaN]; // This should not happen: at least two values must be present in a gradient
        }
        console.log("__locateClosestSliderValue", "allSliderValues", allSliderValues);
        // Todo: Find closest ratio value
        // let closestSliderValue = Number.MAX_VALUE;
        var leftSliderIndex = 0;
        var closestSliderValue = allSliderValues[leftSliderIndex];
        for (var i = 1; i < allSliderValues.length; i++) {
            var curVal = allSliderValues[i];
            if (Math.abs(curVal - absoluteValue) < Math.abs(closestSliderValue - absoluteValue)) {
                closestSliderValue = curVal;
                if (curVal > absoluteValue) {
                    leftSliderIndex = i - 1;
                }
                else {
                    leftSliderIndex = i;
                }
            }
        }
        return [leftSliderIndex, closestSliderValue];
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
        console.log("width", width, "x", x, "relativeValue", relativeValue);
        return relativeValue;
    };
    /**
     * Adds a slider at the given interval index.
     *
     * @param {number} absoluteValue - The absolute new slider value.
     * @param {number} leftSliderIndex - The new slider's position (interval index).
     */
    ColorGradientPicker.prototype.__addSliderAt = function (absoluteValue, leftSliderIndex) {
        console.log("__addSliderAt", "absoluteValue", absoluteValue, "leftSliderIndex", leftSliderIndex);
        var leftSlider = this._sliderElementRefs[leftSliderIndex].current;
        // const colorAtPosition = this.__getSliderColorAt(relativeValue);
        var newColor = this.__getSliderColorAt(absoluteValue);
        var newSliderIndex = leftSliderIndex + 1;
        var _newSlider = this.__createColorRangeInput(newSliderIndex, this.sliderMin, this.sliderMax, absoluteValue, newColor // initialColor: string
        );
        var sliderRef = this._sliderElementRefs[newSliderIndex];
        leftSlider.after(sliderRef.current);
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
        console.log("__getSliderColorAt", "absoluteValue", absoluteValue);
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
        console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
        var leftColorObject = Color_1.Color.parse(leftColorString);
        var rightColorObject = Color_1.Color.parse(rightColorString);
        var newColor = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
        // console.log(
        //   "absoluteValue",
        //   absoluteValue,
        //   "leftIndex",
        //   leftIndex,
        //   "leftSliderValue",
        //   leftSliderValue,
        //   "leftColorObject",
        //   leftColorObject.cssRGB(),
        //   "rightSliderValue",
        //   rightSliderValue,
        //   "rightColorObject",
        //   rightColorObject.cssRGB(),
        //   "positionInsideInterval",
        //   positionInsideInterval,
        //   "newColor",
        //   newColor.cssRGB()
        // );
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
        var colorValue = this.__getSliderColorString(rangeSliderIndex, "grey");
        var ratio = this.__getSliderPercentage(rangeSliderIndex);
        this.colorInputContainerRef.current.style["left"] = "calc( ".concat(ratio * 100, "% + ").concat((1.0 - ratio) * this.indicatorWidth_num * 0.5, "em - ").concat(ratio * this.indicatorWidth_num * 0.5, "em)");
        this.colorIndicatorColorButtonRef.current.style["background-color"] = colorValue;
        this.colorInputRef.current.value = colorValue;
        this.colorInputRef.current.dataset["activeSliderIndex"] = "".concat(rangeSliderIndex);
        if (rangeSliderIndex <= 0 || rangeSliderIndex + 1 >= this.getRangeLength()) {
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
        // const values: Array<ColorGradientItem> = this._sliderElementRefs.map((_ref: NoReact.Ref<HTMLInputElement>, index: number) => {
        //   return { color: this.__getSliderColor(index, null), ratio: this.__getSliderPercentage(index) };
        // });
        // return new ColorGradient(values); //.toColorGradientString();
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
        var colorValue = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
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
        console.log("Rendering ...", NoReact);
        this.colorIndicatorColorButtonRef = NoReact.useRef();
        this.colorIndicatorRemoveButtonRef = NoReact.useRef();
        this.colorInputRef = NoReact.useRef();
        this.colorInputContainerRef = NoReact.useRef();
        this.containerRef = NoReact.useRef();
        var handleIndicatorButtonClick = function (evt) {
            evt.preventDefault(); // Prevent other inputs to react to this event.
            evt.stopPropagation();
            // But fake a click on the input element
            _self.colorInputRef.current.click();
        };
        var handleRemoveColorButtonClick = function (evt) {
            evt.preventDefault(); // Prevent other inputs to react to this event.
            evt.stopPropagation();
            console.log("Todo: remove color");
            // TODO
            _self.__handleRemoveColor();
        };
        // const currentColors = [0, 1, 2, 3, 4, 5];
        // const stepCount = this.colorGradient.values.length;
        var elementId = "color-gradient-container-".concat(this.baseID);
        return (NoReact.createElement("div", { id: elementId, style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "32px",
                position: "relative",
                marginBottom: "3em"
            }, ref: this.containerRef, onClick: this.__containerClickHandler() },
            createCustomStylesElement(elementId),
            this.colorGradient.values.map(function (colorGradientItem, index) {
                // const initialColor: string = this.DEFAULT_COLORSET[index % this.DEFAULT_COLORSET.length];
                // const initialValue: number = (100 / (stepCount - 1)) * index;
                var initialValue = _self.__relativeToAbsolute(colorGradientItem.ratio);
                // return this.__createColorRangeInput(index, this.sliderMin, this.sliderMax, initialValue, initialColor);
                return _this.__createColorRangeInput(index, _this.sliderMin, _this.sliderMax, initialValue, colorGradientItem.color);
            }),
            NoReact.createElement("div", { style: { width: "100%" } },
                NoReact.createElement("input", { id: "color-indicator-input-".concat(this.baseID), type: "color", style: { visibility: "hidden" }, "data-active-slider-index": "", ref: this.colorInputRef, onInput: this.__colorChangeHandler() }),
                NoReact.createElement("div", { ref: this.colorInputContainerRef, style: {
                        position: "absolute",
                        bottom: "0px",
                        left: "0%",
                        display: "flex",
                        flexDirection: "column",
                        transform: "translate(0%, 100%)"
                    } },
                    NoReact.createElement("button", { id: "color-indicator-button-".concat(this.baseID), style: {
                            backgroundColor: "grey",
                            borderRadius: "3px",
                            border: "1px solid grey",
                            width: this.indicatorWidth, // "1em",
                            height: this.indicatorHeight, // "1em",
                            transform: "translate(-50%, 0%)"
                        }, onClick: handleIndicatorButtonClick, ref: this.colorIndicatorColorButtonRef }),
                    NoReact.createElement("button", { id: "color-remove-button-".concat(this.baseID), className: "color-remove-button", style: {
                            backgroundColor: "grey",
                            borderRadius: "3px",
                            border: "1px solid grey",
                            width: this.indicatorWidth, // "1em",
                            height: this.indicatorHeight, // "1em",
                            transform: "translate(-50%, 50%)",
                            lineHeight: "0.5em",
                            padding: 0
                        }, onClick: handleRemoveColorButtonClick, ref: this.colorIndicatorRemoveButtonRef },
                        NoReact.createElement("span", { style: { fontSize: "0.5em" } }, "\uD83D\uDDD1"))))));
    };
    return ColorGradientPicker;
}());
exports.ColorGradientPicker = ColorGradientPicker;
/**
 * Adds custom styles (global STYLE tag).
 *
 * @private
 */
var createCustomStylesElement = function (elementId) {
    var thumbWidth = "0.5em";
    var thumbHeight = "1.333em";
    // Thanks to Ana Tudor
    //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
    return (NoReact.createElement("style", null, "\n    #".concat(elementId, " input[type='range'] {\n\n      -webkit-appearance: none;\n\n      grid-column: 1;\n      grid-row: 2;\n      \n      /* same as before */\n      background: none; /* get rid of white Chrome background */\n      color: #000;\n      font: inherit; /* fix too small font-size in both Chrome & Firefox */\n      margin: 0;\n      pointer-events: none; /* let clicks pass through */\n    }\n\n    #").concat(elementId, " input[type='range']::-webkit-slider-runnable-track {\n      -webkit-appearance: none;\n\n      background: none; /* get rid of Firefox track background */\n      height: 100%;\n      width: 100%;\n\n      pointer-events: none;\n    }\n\n    #").concat(elementId, " input[type='range']::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      background: currentcolor;\n      border: none; /* get rid of Firefox thumb border */\n      border-radius: 6px; /* get rid of Firefox corner rounding */\n      pointer-events: auto; /* catch clicks */\n      width: ").concat(thumbWidth, "; \n      height: ").concat(thumbHeight, ";\n    }\n\n    #").concat(elementId, " input[type='range']:focus::-webkit-slider-thumb {\n      border: 2px solid white;\n    }\n\n    #").concat(elementId, " input[type='range']::-moz-range-track {\n      -webkit-appearance: none;\n      background: none; /* get rid of Firefox track background */\n      height: 100%;\n      width: 100%;\n      pointer-events: none;\n    }\n\n    #").concat(elementId, " input[type='range']::-moz-range-thumb {\n      /* -webkit-appearance: none; */\n      background: currentcolor;\n      border: none; /* get rid of Firefox thumb border */\n      border-radius: 6px; /* get rid of Firefox corner rounding */\n      pointer-events: auto; /* catch clicks */\n      width: ").concat(thumbWidth, "; \n      height: ").concat(thumbHeight, ";\n    }\n\n    #").concat(elementId, " input[type='range']:focus::-moz-range-thumb {\n      border: 2px solid white;\n    }\n\n    #").concat(elementId, " input[type='range'] {\n      /* same as before */\n      z-index: 1;\n    }\n    \n    #").concat(elementId, " input[type='range']:focus {\n        z-index: 2;\n        /* outline: dotted 1px orange; */\n        color: darkorange;\n    }\n    ")));
};
//# sourceMappingURL=ColorGradientPicker.js.map