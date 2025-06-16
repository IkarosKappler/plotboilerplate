/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */
export class ColorGradientPicker {
    constructor(containerID) {
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.COLORSET = ["red", "orange", "yellow", "green", "blue", "purple"];
        if (containerID) {
            const cont = document.getElementById(containerID);
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
    __init() {
        this.__addCustomStyles();
        this.__setContainerLayout();
        console.log("Init");
        const stepCount = 6;
        this.sliderElements = [];
        for (var i = 0; i < stepCount; i++) {
            this.__createRangeSlider((100 / (stepCount - 1)) * i, i);
        }
    }
    __setContainerLayout() {
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.width = "100%";
        this.container.style.height = "32px";
        this.container.style.position = "relative";
    }
    __createRangeSlider(value, index) {
        const initialColor = this.COLORSET[index % this.COLORSET.length];
        const rangeSlider = document.createElement("input");
        rangeSlider.setAttribute("id", `rage-slider-${index}`);
        rangeSlider.setAttribute("type", "range");
        rangeSlider.setAttribute("min", `${this.sliderMin}`);
        rangeSlider.setAttribute("max", `${this.sliderMax}`);
        rangeSlider.setAttribute("value", `${value}`);
        this.container.appendChild(rangeSlider);
        this.sliderElements.push(rangeSlider);
        rangeSlider.style.position = "absolute";
        rangeSlider.style.left = "0";
        rangeSlider.style.top = "0";
        rangeSlider.style.width = "100%";
        rangeSlider.dataset["rangeSliderIndex"] = `${index}`;
        rangeSlider.dataset["colorValue"] = initialColor;
        rangeSlider.addEventListener("change", this.__createSliderHandler());
    }
    getColorGradient() {
        // Example:
        //    linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 38%, rgba(161, 210, 108, 1) 68%, rgba(237, 221, 83, 1) 100%)
        const buffer = ["linear-gradient( 90deg, "];
        for (var i = 0; i < this.sliderElements.length; i++) {
            if (i > 0) {
                buffer.push(",");
            }
            const colorValue = this.__getSliderColor(i, "black");
            buffer.push(colorValue);
            const sliderValue = this.__getSliderValue(i, 0.0);
            const percentage = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
            buffer.push(`${percentage * 100}%`);
        }
        buffer.push(")");
        return buffer.join(" ");
    }
    __createSliderHandler() {
        const _self = this;
        return (e) => {
            const targetSlider = e.target;
            console.log("Clicked", targetSlider ? targetSlider.getAttribute("id") : null);
            if (!targetSlider) {
                return false;
            }
            const currentSliderValue = Number.parseFloat(targetSlider.value);
            const rangeSliderIndexRaw = targetSlider.dataset["rangeSliderIndex"];
            if (!rangeSliderIndexRaw) {
                return false;
            }
            const rangeSliderIndex = Number.parseInt(rangeSliderIndexRaw);
            var leftSliderValue = this.__getSliderValue(rangeSliderIndex - 1, _self.sliderMin);
            var rightSliderValue = this.__getSliderValue(rangeSliderIndex + 1, _self.sliderMax);
            if (leftSliderValue >= currentSliderValue) {
                targetSlider.value = `${leftSliderValue}`;
                _self.__updateBackgroundGradient();
                return false;
            }
            else if (rightSliderValue <= currentSliderValue) {
                targetSlider.value = `${rightSliderValue}`;
                _self.__updateBackgroundGradient();
                return false;
            }
            else {
                _self.__updateBackgroundGradient();
                return true;
            }
        };
    }
    __updateBackgroundGradient() {
        const colorGradient = this.getColorGradient();
        console.log(colorGradient);
        this.container.style["background"] = colorGradient;
        console.log(this.container);
        // document.body.style["background-color"] = colorGradient;
    }
    __getSliderValue(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        return Number.parseFloat(this.sliderElements[sliderIndex].value);
    }
    __getSliderColor(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        const colorValue = this.sliderElements[sliderIndex].dataset["colorValue"];
        return colorValue ? colorValue : fallback;
    }
    __addCustomStyles() {
        const headElements = document.querySelector("head");
        if (headElements) {
            const styleElement = document.createElement("style");
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            styleElement.innerHTML = `
      input[type='range'] {

        -webkit-appearance: none;

        grid-column: 1;
        grid-row: 2;
        
        /* same as before */
        background: none; /* get rid of white Chrome background */
        color: #000;
        font: inherit; /* fix too small font-size in both Chrome & Firefox */
        margin: 0;
        pointer-events: none; /* let clicks pass through */
      }

      input[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none;

        background: none; /* get rid of Firefox track background */
        height: 100%;
        width: 100%;

        pointer-events: none;
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: currentcolor;
        border: none; /* get rid of Firefox thumb border */
        border-radius: 0; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: 1em; 
        height: 1em;
      }

      input[type='range']::-moz-range-track {
        -webkit-appearance: none;

        background: none; /* get rid of Firefox track background */
        height: 100%;
        width: 100%;

        pointer-events: none;

      }

      input[type='range']::-moz-range-thumb {
        /* -webkit-appearance: none; */
        background: currentcolor;
        border: none; /* get rid of Firefox thumb border */
        border-radius: 0; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: 1em; 
        height: 1em;
      }

      input[type='range'] {
        /* same as before */
        z-index: 1;
      }
      
      input[type='range']:focus {
          z-index: 2;
          outline: dotted 1px orange;
          color: darkorange;
      }
      `;
            headElements.appendChild(styleElement);
        }
    }
}
//# sourceMappingURL=ColorGradientPicker.js.map