"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradientPicker = void 0;
var ColorGradientPicker = /** @class */ (function () {
    function ColorGradientPicker(containerID) {
        this.sliderMin = 0;
        this.sliderMax = 100;
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
        console.log("created", this.container);
        this.__init();
    }
    ColorGradientPicker.prototype.__init = function () {
        this.__addCustomStyles();
        this.__setContainerLayout();
        console.log("Init");
        var stepCount = 6;
        this.sliderElements = [];
        for (var i = 0; i < stepCount; i++) {
            this.__createRangeSlider((100 / (stepCount - 1)) * i, i);
        }
    };
    ColorGradientPicker.prototype.__setContainerLayout = function () {
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.width = "100%";
        this.container.style.height = "32px";
        this.container.style.position = "relative";
    };
    ColorGradientPicker.prototype.__createRangeSlider = function (value, index) {
        var initialColor = this.COLORSET[index % this.COLORSET.length];
        var rangeSlider = document.createElement("input");
        rangeSlider.setAttribute("id", "rage-slider-".concat(index));
        rangeSlider.setAttribute("type", "range");
        rangeSlider.setAttribute("min", "".concat(this.sliderMin));
        rangeSlider.setAttribute("max", "".concat(this.sliderMax));
        rangeSlider.setAttribute("value", "".concat(value));
        this.container.appendChild(rangeSlider);
        this.sliderElements.push(rangeSlider);
        rangeSlider.style.position = "absolute";
        rangeSlider.style.left = "0";
        rangeSlider.style.top = "0";
        rangeSlider.style.width = "100%";
        rangeSlider.dataset["rangeSliderIndex"] = "".concat(index);
        rangeSlider.dataset["colorValue"] = initialColor;
        rangeSlider.addEventListener("change", this.__createSliderHandler());
    };
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
            var sliderValue = this.__getSliderValue(i, 0.0);
            var percentage = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
            buffer.push("".concat(percentage * 100, "%"));
        }
        buffer.push(")");
        return buffer.join(" ");
    };
    ColorGradientPicker.prototype.__createSliderHandler = function () {
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
                return false;
            }
            else if (rightSliderValue <= currentSliderValue) {
                targetSlider.value = "".concat(rightSliderValue);
                _self.__updateBackgroundGradient();
                return false;
            }
            else {
                _self.__updateBackgroundGradient();
                return true;
            }
        };
    };
    ColorGradientPicker.prototype.__updateBackgroundGradient = function () {
        var colorGradient = this.getColorGradient();
        console.log(colorGradient);
        this.container.style["background"] = colorGradient;
        console.log(this.container);
        // document.body.style["background-color"] = colorGradient;
    };
    ColorGradientPicker.prototype.__getSliderValue = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        return Number.parseFloat(this.sliderElements[sliderIndex].value);
    };
    ColorGradientPicker.prototype.__getSliderColor = function (sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        var colorValue = this.sliderElements[sliderIndex].dataset["colorValue"];
        return colorValue ? colorValue : fallback;
    };
    ColorGradientPicker.prototype.__addCustomStyles = function () {
        var headElements = document.querySelector("head");
        if (headElements) {
            var styleElement = document.createElement("style");
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            styleElement.innerHTML = "\n      input[type='range'] {\n\n        -webkit-appearance: none;\n\n        grid-column: 1;\n        grid-row: 2;\n        \n        /* same as before */\n        background: none; /* get rid of white Chrome background */\n        color: #000;\n        font: inherit; /* fix too small font-size in both Chrome & Firefox */\n        margin: 0;\n        pointer-events: none; /* let clicks pass through */\n      }\n\n      input[type='range']::-webkit-slider-runnable-track {\n        -webkit-appearance: none;\n\n        background: none; /* get rid of Firefox track background */\n        height: 100%;\n        width: 100%;\n\n        pointer-events: none;\n      }\n\n      input[type='range']::-webkit-slider-thumb {\n        -webkit-appearance: none;\n        background: currentcolor;\n        border: none; /* get rid of Firefox thumb border */\n        border-radius: 0; /* get rid of Firefox corner rounding */\n        pointer-events: auto; /* catch clicks */\n        width: 1em; \n        height: 1em;\n      }\n\n      input[type='range']::-moz-range-track {\n        -webkit-appearance: none;\n\n        background: none; /* get rid of Firefox track background */\n        height: 100%;\n        width: 100%;\n\n        pointer-events: none;\n\n      }\n\n      input[type='range']::-moz-range-thumb {\n        /* -webkit-appearance: none; */\n        background: currentcolor;\n        border: none; /* get rid of Firefox thumb border */\n        border-radius: 0; /* get rid of Firefox corner rounding */\n        pointer-events: auto; /* catch clicks */\n        width: 1em; \n        height: 1em;\n      }\n\n      input[type='range'] {\n        /* same as before */\n        z-index: 1;\n      }\n      \n      input[type='range']:focus {\n          z-index: 2;\n          outline: dotted 1px orange;\n          color: darkorange;\n      }\n      ";
            headElements.appendChild(styleElement);
        }
    };
    return ColorGradientPicker;
}());
exports.ColorGradientPicker = ColorGradientPicker;
//# sourceMappingURL=ColorGradientPicker.js.map