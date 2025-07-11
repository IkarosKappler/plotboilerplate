"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradientPicker = void 0;
var NoReact = require("noreact");
var Color_1 = require("../../datastructures/Color");
var ColorGradientPicker = /** @class */ (function () {
    /**
     * The constructor.
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID
     */
    function ColorGradientPicker(containerID) {
        var _this = this;
        this._sliderElementRefs = [];
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.indicatorWidth_num = 1.0;
        this.indicatorWidth = "1em";
        this.indicatorWidth_half = "0.5em";
        this.indicatorHeight = "1em";
        this.COLORSET = ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0000ff", "#8800ff"];
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
        this.container.append(this._render("test"));
        this.__updateColorIndicator(0);
        this.__updateBackgroundGradient();
    } // END constructor
    ColorGradientPicker.prototype.createColorRangeInput = function (baseID, index, sliderMin, sliderMax, initialValue, initialColor) {
        var sliderHandler = this.__createSliderChangeHandler();
        var ref = NoReact.useRef();
        // this._sliderElementRefs.push(ref);
        this._sliderElementRefs.splice(index, 0, ref);
        for (var i = index + 1; i < this._sliderElementRefs.length; i++) {
            this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", "".concat(i));
            this._sliderElementRefs[i].current.setAttribute("id", "rage-slider-".concat(baseID, "-").concat(i));
        }
        return (NoReact.createElement("input", { id: "rage-slider-".concat(baseID, "-").concat(index), type: "range", min: sliderMin, max: sliderMax, value: initialValue, style: { position: "absolute", left: "0px", top: "0px", width: "100%" }, "data-range-slider-index": index, "data-color-value": initialColor, onChange: sliderHandler, onClick: sliderHandler, ref: ref }));
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
            _this.colorIndicatorButtonRef.current.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            return true;
        };
    };
    ColorGradientPicker.prototype.__containerClickHandler = function () {
        var _self = this;
        var maxDifference = 0.01;
        return function (evt) {
            console.log("click");
            // e = Mouse click event.
            var target = evt.target;
            var rect = target.getBoundingClientRect();
            var x = evt.clientX - rect.left; //x position within the element.
            var width = rect.width; // target.clientWidth;
            var relativeValue = x / width;
            // TODO: check if ratio is far enough away from any slider
            var allSliderValues = _self.__getAllSliderValues();
            if (allSliderValues.length === 0) {
                return; // This should not happen: at least two values must be present in a gradient
            }
            console.log("width", width, "x", x, "relativeValue", relativeValue, "allSliderValues", allSliderValues);
            // Todo: Find closest ratio value
            // let closestSliderValue = Number.MAX_VALUE;
            var leftSliderIndex = 0;
            var closestSliderValue = allSliderValues[leftSliderIndex];
            for (var i = 1; i < allSliderValues.length; i++) {
                var curVal = allSliderValues[i];
                if (Math.abs(closestSliderValue - relativeValue) > Math.abs(curVal - relativeValue)) {
                    closestSliderValue = curVal;
                    leftSliderIndex = i - 1;
                }
            }
            var diff = Math.abs(closestSliderValue - relativeValue);
            console.log("closestSliderValue", closestSliderValue, "relativeValue", relativeValue, "difference", diff);
            if (diff >= maxDifference) {
                console.log("Add slider here");
                _self._addSliderAt(relativeValue, leftSliderIndex);
            }
            else {
                console.log("Don't add slider here.");
            }
        };
    };
    ColorGradientPicker.prototype._addSliderAt = function (relativeValue, leftSliderIndex) {
        var leftSlider = this._sliderElementRefs[leftSliderIndex].current;
        // const colorAtPosition = this.__getSliderColorAt(relativeValue);
        var newColor = this.__getSliderColorAt(relativeValue);
        var newSlider = this.createColorRangeInput(this.baseID, leftSliderIndex + 1, this.sliderMin, this.sliderMax, relativeValue, //  initialValue
        newColor.cssRGB() // initialColor: string
        );
        var sliderRef = this._sliderElementRefs[leftSliderIndex + 1];
        leftSlider.after(sliderRef.current);
    };
    ColorGradientPicker.prototype.__getSliderColorAt = function (relativePosition) {
        // Locate interval
        var leftIndex = this.__locateIntervalAt(relativePosition);
        var leftSliderValue = this.__getSliderValue(leftIndex, 0.5);
        var rightSliderValue = this.__getSliderValue(leftIndex + 1, 0.5);
        var positionInsideInterval = (relativePosition - leftSliderValue) / (rightSliderValue - leftSliderValue);
        var leftColorString = this.__getSliderColor(leftIndex, "#000000");
        var rightColorString = this.__getSliderColor(leftIndex + 1, "#000000");
        console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
        var leftColorObject = Color_1.Color.parse(leftColorString);
        var rightColorObject = Color_1.Color.parse(rightColorString);
        var newColor = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
        return newColor;
    };
    ColorGradientPicker.prototype.__locateIntervalAt = function (relativePosition) {
        for (var i = 0; i < this._sliderElementRefs.length; i++) {
            if (this.__getSliderValue(i, 1.0) <= relativePosition) {
                return i;
            }
        }
        return -1;
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
    ColorGradientPicker.prototype.__getAllSliderValues = function () {
        var _this = this;
        return this._sliderElementRefs.map(function (ref, index) { return _this.__getSliderPercentage(index); });
    };
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    ColorGradientPicker.prototype.__updateBackgroundGradient = function () {
        var colorGradient = this.getColorGradient();
        this.containerRef.current.style["background"] = colorGradient;
    };
    ColorGradientPicker.prototype.__updateColorIndicator = function (rangeSliderIndex) {
        var colorValue = this.__getSliderColor(rangeSliderIndex, "grey");
        var ratio = this.__getSliderPercentage(rangeSliderIndex);
        // console.log("__updateColorIndicator", colorValue, ratio);
        this.colorIndicatorButtonRef.current.style["left"] = "calc( ".concat(ratio * 100, "% + ").concat((1.0 - ratio) * this.indicatorWidth_num * 0.5, "em - ").concat(ratio * this.indicatorWidth_num * 0.5, "em)");
        this.colorIndicatorButtonRef.current.style["background-color"] = colorValue;
        this.colorInputRef.current.value = colorValue;
        this.colorInputRef.current.dataset["activeSliderIndex"] = "".concat(rangeSliderIndex);
    };
    /**
     * Get a color gradient CSS value string from the current editor settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    ColorGradientPicker.prototype.getColorGradient = function () {
        // Example:
        //    linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 38%, rgba(161, 210, 108, 1) 68%, rgba(237, 221, 83, 1) 100%)
        var buffer = ["linear-gradient( 90deg, "];
        for (var i = 0; i < this._sliderElementRefs.length; i++) {
            if (i > 0) {
                buffer.push(",");
            }
            var colorValue = this.__getSliderColor(i, "black");
            buffer.push(colorValue);
            // const sliderValue: number = this.__getSliderValue(i, 0.0);
            // const percentage: number = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
            var percentage = this.__getSliderPercentage(i);
            buffer.push("".concat(percentage * 100, "%"));
        }
        buffer.push(")");
        return buffer.join(" ");
    };
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderColor = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        var colorValue = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
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
    ColorGradientPicker.prototype._render = function (name) {
        var _this = this;
        var _self = this;
        console.log("Rendering ...", NoReact);
        this.colorIndicatorButtonRef = NoReact.useRef();
        this.colorInputRef = NoReact.useRef();
        this.containerRef = NoReact.useRef();
        var handleIndicatorButtonClick = function () {
            _self.colorInputRef.current.click();
        };
        var currentColors = [0, 1, 2, 3, 4, 5];
        var stepCount = currentColors.length;
        var elementId = "color-gradient-container-".concat(this.baseID);
        return (NoReact.createElement("div", { id: elementId, style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "32px",
                position: "relative"
            }, ref: this.containerRef, onClick: this.__containerClickHandler() },
            createCustomStylesElement(elementId),
            currentColors.map(function (index) {
                var initialColor = _this.COLORSET[index % _this.COLORSET.length];
                var initialValue = (100 / (stepCount - 1)) * index;
                return _this.createColorRangeInput(_this.baseID, index, _this.sliderMin, _this.sliderMax, initialValue, initialColor);
            }),
            NoReact.createElement("div", { style: { width: "100%" } },
                NoReact.createElement("button", { id: "color-indicator-button-1234", style: {
                        position: "absolute",
                        bottom: "0px",
                        left: "0%",
                        backgroundColor: "grey",
                        borderRadius: "3px",
                        border: "1px solid grey",
                        width: this.indicatorWidth, // "1em",
                        height: this.indicatorHeight, // "1em",
                        transform: "translate(-50%, 100%)"
                    }, onClick: handleIndicatorButtonClick, ref: this.colorIndicatorButtonRef })),
            NoReact.createElement("input", { type: "color", style: { visibility: "hidden" }, "data-active-slider-index": "", ref: this.colorInputRef, onInput: this.__colorChangeHandler() })));
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
//# sourceMappingURL=ColorGradientPickerJSX.js.map