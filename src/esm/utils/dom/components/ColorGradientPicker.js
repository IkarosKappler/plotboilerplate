/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */
export class ColorGradientPicker {
    /**
     * The constructor.
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID
     */
    constructor(containerID) {
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.indicatorWidth_num = 1.0;
        this.indicatorWidth = "1em";
        this.indicatorWidth_half = "0.5em";
        this.indicatorHeight = "1em";
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
    __init() {
        this.__addCustomStyles();
        this.__setContainerLayout();
        console.log("Init");
        const stepCount = 6;
        this.sliderElements = [];
        for (var i = 0; i < stepCount; i++) {
            this.__createRangeSlider((100 / (stepCount - 1)) * i, i);
        }
        this.__createColorIndicator();
    }
    /**
     * Apply style settings to the main container.
     *
     * @private
     */
    __setContainerLayout() {
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.width = "100%";
        this.container.style.height = "32px";
        this.container.style.position = "relative";
    }
    /**
     * Create a new range slider for this color gradient picker.
     *
     * @param {number} initialValue
     * @param {number} index
     */
    __createRangeSlider(initialValue, index) {
        const initialColor = this.COLORSET[index % this.COLORSET.length];
        const rangeSlider = document.createElement("input");
        rangeSlider.setAttribute("id", `rage-slider-${this.baseID}-${index}`);
        rangeSlider.setAttribute("type", "range");
        rangeSlider.setAttribute("min", `${this.sliderMin}`);
        rangeSlider.setAttribute("max", `${this.sliderMax}`);
        rangeSlider.setAttribute("value", `${initialValue}`);
        this.container.appendChild(rangeSlider);
        this.sliderElements.push(rangeSlider);
        rangeSlider.style.position = "absolute";
        rangeSlider.style.left = "0";
        rangeSlider.style.top = "0";
        rangeSlider.style.width = "100%";
        rangeSlider.dataset["rangeSliderIndex"] = `${index}`;
        rangeSlider.dataset["colorValue"] = initialColor;
        const sliderHandler = this.__createSliderChangeHandler();
        // rangeSlider.addEventListener("change", this.__createSliderChangeHandler());
        rangeSlider.addEventListener("change", sliderHandler);
        rangeSlider.addEventListener("click", sliderHandler);
    }
    __createColorIndicator() {
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
        const _self = this;
        this.colorIndicatorButton.addEventListener("click", () => {
            console.log("clicked");
            // _self.colorInput.dispatchEvent(new Event("input"));
            _self.colorInput.click();
        });
        this.indicatorContainer.appendChild(this.colorIndicatorButton);
        this.container.appendChild(this.indicatorContainer);
        this.container.appendChild(this.colorInput);
    }
    /**
     * Get a color gradient CSS value string from the current editor settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
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
            // const sliderValue: number = this.__getSliderValue(i, 0.0);
            // const percentage: number = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
            const percentage = this.__getSliderPercentage(i);
            buffer.push(`${percentage * 100}%`);
        }
        buffer.push(")");
        return buffer.join(" ");
    }
    /**
     * Creates a callback function for range slider.
     *
     * @returns
     */
    __createSliderChangeHandler() {
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
                _self.__updateColorIndicator(rangeSliderIndex);
                return false;
            }
            else if (rightSliderValue <= currentSliderValue) {
                targetSlider.value = `${rightSliderValue}`;
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
    }
    __colorChangeHandler() {
        const _self = this;
        return (_evt) => {
            // const colorInput : HTMLInputElement | null = evt.target;
            const activeSliderIndex_raw = this.colorInput.dataset["activeSliderIndex"];
            if (!activeSliderIndex_raw) {
                console.warn("Cannot update color indicator; no active range slider set.");
                return false;
            }
            const activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
            if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self.sliderElements.length) {
                console.warn("Cannot update color indicator; active index invalid or out of bounds.", activeSliderIndex);
                return false;
            }
            const newColor = _self.colorInput.value;
            const rangeSlider = _self.sliderElements[activeSliderIndex];
            rangeSlider.dataset["colorValue"] = newColor;
            // rangeSlider.dataset["colorValue"] = newColor;
            this.colorIndicatorButton.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            return true;
        };
    }
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    __updateBackgroundGradient() {
        const colorGradient = this.getColorGradient();
        console.log(colorGradient);
        this.container.style["background"] = colorGradient;
        console.log(this.container);
        // document.body.style["background-color"] = colorGradient;
    }
    __updateColorIndicator(rangeSliderIndex) {
        const colorValue = this.__getSliderColor(rangeSliderIndex, "grey");
        const ratio = this.__getSliderPercentage(rangeSliderIndex);
        this.colorIndicatorButton.style["left"] = `calc( ${ratio * 100}% + ${(1.0 - ratio) * this.indicatorWidth_num * 0.5}em - ${ratio * this.indicatorWidth_num * 0.5}em)`;
        this.colorIndicatorButton.style["background-color"] = colorValue;
        this.colorInput.value = colorValue;
        this.colorInput.dataset["activeSliderIndex"] = `${rangeSliderIndex}`;
    }
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    __getSliderValue(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        return Number.parseFloat(this.sliderElements[sliderIndex].value);
    }
    /**
     * Get the slider's value in a mapped range of 0.0 ... 1.0.
     *
     * @param sliderIndex
     * @returns
     */
    __getSliderPercentage(sliderIndex) {
        const sliderValue = this.__getSliderValue(sliderIndex, 0.0);
        const percentage = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
        return percentage;
    }
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    __getSliderColor(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this.sliderElements.length) {
            return fallback;
        }
        const colorValue = this.sliderElements[sliderIndex].dataset["colorValue"];
        return colorValue ? colorValue : fallback;
    }
    /**
     * Adds custom styles (global STYLE tag).
     *
     * @private
     */
    __addCustomStyles() {
        const headElements = document.querySelector("head");
        if (headElements) {
            const thumbWidth = "0.5em";
            const thumbHeight = "1.333em";
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
        border-radius: 6px; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: ${thumbWidth}; 
        height: ${thumbHeight};
      }

      input[type='range']:focus::-webkit-slider-thumb {
        border: 2px solid white;
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
        border-radius: 6px; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: ${thumbWidth}; 
        height: ${thumbHeight};
      }

      input[type='range']:focus::-moz-range-thumb {
        border: 2px solid white;
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