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
        var stepCount = 5;
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
        var rangeSlider = document.createElement("input");
        rangeSlider.setAttribute("id", "rage-slider-".concat(index));
        rangeSlider.setAttribute("type", "range");
        rangeSlider.setAttribute("min", "0");
        rangeSlider.setAttribute("max", "100");
        rangeSlider.setAttribute("value", "".concat(value));
        this.container.appendChild(rangeSlider);
        this.sliderElements.push(rangeSlider);
        rangeSlider.style.position = "absolute";
        rangeSlider.style.left = "0";
        rangeSlider.style.top = "0";
        rangeSlider.style.width = "100%";
        rangeSlider.addEventListener("change", function (e) {
            console.log("Clicked", e.target ? e.target.getAttribute("id") : null);
        });
    };
    ColorGradientPicker.prototype.__addCustomStyles = function () {
        var headElements = document.querySelector("head");
        if (headElements) {
            var styleElement = document.createElement("style");
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            styleElement.innerHTML = "\n      input[type='range'] {\n\n        -webkit-appearance: none;\n\n        grid-column: 1;\n        grid-row: 2;\n        \n        /* same as before */\n        background: none; /* get rid of white Chrome background */\n        color: #000;\n        font: inherit; /* fix too small font-size in both Chrome & Firefox */\n        margin: 0;\n        pointer-events: none; /* let clicks pass through */\n      }\n\n      input[type='range']::-webkit-slider-runnable-track {\n        -webkit-appearance: none;\n\n        background: none; /* get rid of Firefox track background */\n        height: 100%;\n        width: 100%;\n\n        pointer-events: none;\n      }\n\n      input[type='range']::-webkit-slider-thumb {\n        -webkit-appearance: none;\n        background: currentcolor;\n        border: none; /* get rid of Firefox thumb border */\n        border-radius: 0; /* get rid of Firefox corner rounding */\n        pointer-events: auto; /* catch clicks */\n        width: 1em; \n        height: 1em;\n      }\n\n      input[type='range']::-moz-range-track {\n        -webkit-appearance: none;\n\n        background: none; /* get rid of Firefox track background */\n        height: 100%;\n        width: 100%;\n\n        pointer-events: none;\n\n      }\n\n      input[type='range']::-moz-range-thumb {\n        /* -webkit-appearance: none; */\n        background: currentcolor;\n        border: none; /* get rid of Firefox thumb border */\n        border-radius: 0; /* get rid of Firefox corner rounding */\n        pointer-events: auto; /* catch clicks */\n        width: 1em; \n        height: 1em;\n      }\n      ";
            headElements.appendChild(styleElement);
        }
    };
    return ColorGradientPicker;
}());
exports.ColorGradientPicker = ColorGradientPicker;
//# sourceMappingURL=ColorGradientPicker.js.map