"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradientPicker = void 0;
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
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.indicatorWidth_num = 1.0;
        this.indicatorWidth = "1em";
        this.indicatorWidth_half = "0.5em";
        this.indicatorHeight = "1em";
        this.COLORSET = ["red", "orange", "yellow", "green", "blue", "purple"];
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
        // console.log("created", this.container);
        this.baseID = Math.floor(Math.random() * 65535);
        this.__init();
        this.__updateBackgroundGradient();
    }
    /**
     * Init the container contents.
     *
     * @private
     */
    ColorGradientPicker.prototype.__init = function () {
        this.__addCustomStyles();
        this.__setContainerLayout();
        console.log("Init");
        var stepCount = 6;
        this.sliderElements = [];
        for (var i = 0; i < stepCount; i++) {
            this.__createRangeSlider((100 / (stepCount - 1)) * i, i);
        }
        this.__createColorIndicator();
    };
    /**
     * Apply style settings to the main container.
     *
     * @private
     */
    ColorGradientPicker.prototype.__setContainerLayout = function () {
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.width = "100%";
        this.container.style.height = "32px";
        this.container.style.position = "relative";
    };
    /**
     * Create a new range slider for this color gradient picker.
     *
     * @param {number} initialValue
     * @param {number} index
     */
    ColorGradientPicker.prototype.__createRangeSlider = function (initialValue, index) {
        var initialColor = this.COLORSET[index % this.COLORSET.length];
        var rangeSlider = document.createElement("input");
        rangeSlider.setAttribute("id", "rage-slider-".concat(this.baseID, "-").concat(index));
        rangeSlider.setAttribute("type", "range");
        rangeSlider.setAttribute("min", "".concat(this.sliderMin));
        rangeSlider.setAttribute("max", "".concat(this.sliderMax));
        rangeSlider.setAttribute("value", "".concat(initialValue));
        this.container.appendChild(rangeSlider);
        this.sliderElements.push(rangeSlider);
        rangeSlider.style.position = "absolute";
        rangeSlider.style.left = "0";
        rangeSlider.style.top = "0";
        rangeSlider.style.width = "100%";
        rangeSlider.dataset["rangeSliderIndex"] = "".concat(index);
        rangeSlider.dataset["colorValue"] = initialColor;
        var sliderHandler = this.__createSliderChangeHandler();
        // rangeSlider.addEventListener("change", this.__createSliderChangeHandler());
        rangeSlider.addEventListener("change", sliderHandler);
        rangeSlider.addEventListener("click", sliderHandler);
    };
    ColorGradientPicker.prototype.__createColorIndicator = function () {
        this.indicatorContainer = document.createElement("div");
        this.indicatorContainer.style["width"] = "100%";
        // this.indicatorContainer.style["position"] = "100%";
        this.colorIndicatorButton = document.createElement("button");
        this.colorIndicatorButton.style["position"] = "absolute";
        this.colorIndicatorButton.style["bottom"] = "0";
        this.colorIndicatorButton.style["left"] = "0%";
        this.colorIndicatorButton.style["background-color"] = "grey";
        this.colorIndicatorButton.style["border-radius"] = "3px";
        this.colorIndicatorButton.style["border"] = "1px solid grey";
        this.colorIndicatorButton.style["width"] = this.indicatorWidth;
        this.colorIndicatorButton.style["height"] = this.indicatorHeight;
        this.colorIndicatorButton.style["transform"] = "translate(-50%,100%)";
        this.colorInput = document.createElement("input");
        this.colorInput.setAttribute("type", "color");
        this.colorInput.style["visibility"] = "hidden";
        this.colorInput.dataset["activeSliderIndex"] = "";
        this.colorInput.addEventListener("input", this.__colorChangeHandler());
        var _self = this;
        this.colorIndicatorButton.addEventListener("click", function () {
            console.log("clicked");
            // _self.colorInput.dispatchEvent(new Event("input"));
            _self.colorInput.click();
        });
        this.indicatorContainer.appendChild(this.colorIndicatorButton);
        this.container.appendChild(this.indicatorContainer);
        this.container.appendChild(this.colorInput);
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
        for (var i = 0; i < this.sliderElements.length; i++) {
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
     * Creates a callback function for range slider.
     *
     * @returns
     */
    ColorGradientPicker.prototype.__createSliderChangeHandler = function () {
        var _this = this;
        var _self = this;
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
    ColorGradientPicker.prototype.__colorChangeHandler = function () {
        var _this = this;
        var _self = this;
        return function (_evt) {
            // const colorInput : HTMLInputElement | null = evt.target;
            var activeSliderIndex_raw = _this.colorInput.dataset["activeSliderIndex"];
            if (!activeSliderIndex_raw) {
                console.warn("Cannot update color indicator; no active range slider set.");
                return false;
            }
            var activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
            if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self.sliderElements.length) {
                console.warn("Cannot update color indicator; active index invalid or out of bounds.", activeSliderIndex);
                return false;
            }
            var newColor = _self.colorInput.value;
            var rangeSlider = _self.sliderElements[activeSliderIndex];
            rangeSlider.dataset["colorValue"] = newColor;
            // rangeSlider.dataset["colorValue"] = newColor;
            _this.colorIndicatorButton.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            return true;
        };
    };
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    ColorGradientPicker.prototype.__updateBackgroundGradient = function () {
        var colorGradient = this.getColorGradient();
        console.log(colorGradient);
        this.container.style["background"] = colorGradient;
        console.log(this.container);
        // document.body.style["background-color"] = colorGradient;
    };
    ColorGradientPicker.prototype.__updateColorIndicator = function (rangeSliderIndex) {
        var colorValue = this.__getSliderColor(rangeSliderIndex, "grey");
        var ratio = this.__getSliderPercentage(rangeSliderIndex);
        this.colorIndicatorButton.style["left"] = "calc( ".concat(ratio * 100, "% + ").concat((1.0 - ratio) * this.indicatorWidth_num * 0.5, "em - ").concat(ratio * this.indicatorWidth_num * 0.5, "em)");
        this.colorIndicatorButton.style["background-color"] = colorValue;
        this.colorInput.value = colorValue;
        this.colorInput.dataset["activeSliderIndex"] = "".concat(rangeSliderIndex);
    };
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderValue = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        return Number.parseFloat(this.sliderElements[sliderIndex].value);
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
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    ColorGradientPicker.prototype.__getSliderColor = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        var colorValue = this.sliderElements[sliderIndex].dataset["colorValue"];
        return colorValue ? colorValue : fallback;
    };
    /**
     * Adds custom styles (global STYLE tag).
     *
     * @private
     */
    ColorGradientPicker.prototype.__addCustomStyles = function () {
        var headElements = document.querySelector("head");
        if (headElements) {
            var thumbWidth = "0.5em";
            var thumbHeight = "1.333em";
            var styleElement = document.createElement("style");
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            styleElement.innerHTML = "\n      input[type='range'] {\n\n        -webkit-appearance: none;\n\n        grid-column: 1;\n        grid-row: 2;\n        \n        /* same as before */\n        background: none; /* get rid of white Chrome background */\n        color: #000;\n        font: inherit; /* fix too small font-size in both Chrome & Firefox */\n        margin: 0;\n        pointer-events: none; /* let clicks pass through */\n      }\n\n      input[type='range']::-webkit-slider-runnable-track {\n        -webkit-appearance: none;\n\n        background: none; /* get rid of Firefox track background */\n        height: 100%;\n        width: 100%;\n\n        pointer-events: none;\n      }\n\n      input[type='range']::-webkit-slider-thumb {\n        -webkit-appearance: none;\n        background: currentcolor;\n        border: none; /* get rid of Firefox thumb border */\n        border-radius: 6px; /* get rid of Firefox corner rounding */\n        pointer-events: auto; /* catch clicks */\n        width: ".concat(thumbWidth, "; \n        height: ").concat(thumbHeight, ";\n      }\n\n      input[type='range']:focus::-webkit-slider-thumb {\n        border: 2px solid white;\n      }\n\n      input[type='range']::-moz-range-track {\n        -webkit-appearance: none;\n        background: none; /* get rid of Firefox track background */\n        height: 100%;\n        width: 100%;\n        pointer-events: none;\n      }\n\n      input[type='range']::-moz-range-thumb {\n        /* -webkit-appearance: none; */\n        background: currentcolor;\n        border: none; /* get rid of Firefox thumb border */\n        border-radius: 6px; /* get rid of Firefox corner rounding */\n        pointer-events: auto; /* catch clicks */\n        width: ").concat(thumbWidth, "; \n        height: ").concat(thumbHeight, ";\n      }\n\n      input[type='range']:focus::-moz-range-thumb {\n        border: 2px solid white;\n      }\n\n      input[type='range'] {\n        /* same as before */\n        z-index: 1;\n      }\n      \n      input[type='range']:focus {\n          z-index: 2;\n          outline: dotted 1px orange;\n          color: darkorange;\n      }\n      ");
            headElements.appendChild(styleElement);
        }
    };
    return ColorGradientPicker;
}());
exports.ColorGradientPicker = ColorGradientPicker;
//# sourceMappingURL=ColorGradientPicker.js.map