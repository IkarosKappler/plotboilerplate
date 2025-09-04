/**
 * Approach for a 'simple' color gradient picker for my PlotBoilerplate library.
 *
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
import * as NoReact from "noreact";
import { Color } from "../../datastructures/Color";
export class ColorGradientPicker {
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     */
    constructor(containerID) {
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
        this.__createSliderChangeHandler = () => {
            const _self = this;
            return (e) => {
                const targetSlider = e.target;
                console.log("Clicked", targetSlider ? targetSlider.getAttribute("id") : null);
                if (!targetSlider) {
                    return false;
                }
                const currentSliderValue = Number.parseFloat(targetSlider.value);
                const rangeSliderIndexRaw = targetSlider.dataset["rangeSliderIndex"];
                console.log("rangeSliderIndexRaw", rangeSliderIndexRaw);
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
        };
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
        this.baseID = Math.floor(Math.random() * 65535);
        this.container.append(this._render("test"));
        this.__updateColorIndicator(0);
        this.__updateBackgroundGradient();
    } // END constructor
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
    __createColorRangeInput(index, sliderMin, sliderMax, initialValue, initialColor) {
        const sliderHandler = this.__createSliderChangeHandler();
        const ref = NoReact.useRef();
        // this._sliderElementRefs.push(ref);
        this._sliderElementRefs.splice(index, 0, ref);
        console.log("new _sliderElementRefs", this._sliderElementRefs);
        // Update all elements to the right of the new elelemt
        // for (var i = index + 1; i < this._sliderElementRefs.length; i++) {
        //   this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
        //   this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${this.baseID}-${i}`);
        // }
        this.__updateSliderDataSetIndices(index + 1);
        return (NoReact.createElement("input", { id: `rage-slider-${this.baseID}-${index}`, type: "range", min: sliderMin, max: sliderMax, value: initialValue, style: { position: "absolute", left: "0px", top: "0px", width: "100%" }, "data-range-slider-index": index, "data-color-value": initialColor, onChange: sliderHandler, onClick: sliderHandler, 
            // onMouseDown={mouseDownHandler}
            // onMouseUp={mouseUpHandler}
            ref: ref }));
    }
    getRangeLength() {
        return this.sliderMax - this.sliderMin;
    }
    __colorChangeHandler() {
        const _self = this;
        return (_evt) => {
            // const colorInput : HTMLInputElement | null = evt.target;
            console.log("__colorChangeHandler");
            const activeSliderIndex_raw = this.colorInputRef.current.dataset["activeSliderIndex"];
            if (!activeSliderIndex_raw) {
                console.warn("Cannot update color indicator; no active range slider set.");
                return false;
            }
            const activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
            if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self._sliderElementRefs.length) {
                console.warn("Cannot update color indicator; active index invalid or out of bounds.", activeSliderIndex);
                return false;
            }
            const newColor = _self.colorInputRef.current.value;
            const rangeSlider = _self._sliderElementRefs[activeSliderIndex].current;
            rangeSlider.dataset["colorValue"] = newColor;
            // rangeSlider.dataset["colorValue"] = newColor;
            this.colorIndicatorColorButtonRef.current.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            return true;
        };
    }
    /**
     * Removed the current color slider from the DOM and highlights the left neighbour.
     * @returns
     */
    __handleRemoveColor() {
        // const colorInput : HTMLInputElement | null = evt.target;
        console.log("__colorChangeHandler");
        const activeSliderIndex_raw = this.colorInputRef.current.dataset["activeSliderIndex"];
        if (!activeSliderIndex_raw) {
            console.warn("Cannot remove color indicator; no active range slider set.");
            return false;
        }
        const activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
        if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= this._sliderElementRefs.length) {
            console.warn("Cannot remove color indicator; active index invalid or out of bounds.", activeSliderIndex);
            return false;
        }
        if (activeSliderIndex === 0 || activeSliderIndex + 1 === this.getRangeLength()) {
            console.warn("Cannot remove color indicator; leftmost and rightmost slider must not be removed.", activeSliderIndex);
            return false;
        }
        const sliderElementRef = this._sliderElementRefs[activeSliderIndex];
        sliderElementRef.current.remove();
        this._sliderElementRefs.splice(activeSliderIndex, 1);
        // Update all elements to the right of the removed elelemt
        this.__updateSliderDataSetIndices(activeSliderIndex);
        // Set left element active
        this.__updateColorIndicator(activeSliderIndex - 1);
        this.__updateBackgroundGradient();
        return true;
    }
    __updateSliderDataSetIndices(startIndex) {
        // Update all elements to the right of the new elelemt
        for (var i = startIndex; i < this._sliderElementRefs.length; i++) {
            this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
            this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${this.baseID}-${i}`);
        }
    }
    __containerClickHandler() {
        const _self = this;
        const maxDifference = _self.getRangeLength() * 0.01;
        return (evt) => {
            const relativeValue = this.__clickEventToRelativeValue(evt);
            if (relativeValue < 0 || relativeValue > 1.0) {
                // Clicked somewhere outside the range
                return;
            }
            const absoluteValue = this.__relativeToAbsolute(relativeValue);
            console.log("click", "relativeValue", relativeValue, "absoluteValue", absoluteValue);
            // Check if click position (ratio) is far enough away from any slider
            const [leftSliderIndex, closestSliderValue] = _self.__locateClosestSliderValue(absoluteValue);
            const diff = Math.abs(closestSliderValue - absoluteValue);
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
                console.debug("Don't add slider here.");
            }
        };
    }
    __locateClosestSliderValue(absoluteValue) {
        const allSliderValues = this.__getAllSliderValues();
        console.log("allSliderValues", allSliderValues);
        if (allSliderValues.length === 0) {
            console.warn("[Warn] All slider values array is empty. This should not happen, cannot proceed.");
            return [NaN, NaN]; // This should not happen: at least two values must be present in a gradient
        }
        console.log("__locateClosestSliderValue", "allSliderValues", allSliderValues);
        // Todo: Find closest ratio value
        // let closestSliderValue = Number.MAX_VALUE;
        let leftSliderIndex = 0;
        let closestSliderValue = allSliderValues[leftSliderIndex];
        for (var i = 1; i < allSliderValues.length; i++) {
            const curVal = allSliderValues[i];
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
    }
    __clickEventToRelativeValue(evt) {
        const target = evt.target;
        const rect = target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const width = rect.width; // target.clientWidth;
        const relativeValue = x / width;
        console.log("width", width, "x", x, "relativeValue", relativeValue);
        return relativeValue;
    }
    __addSliderAt(absoluteValue, leftSliderIndex) {
        console.log("__addSliderAt", "absoluteValue", absoluteValue, "leftSliderIndex", leftSliderIndex);
        const leftSlider = this._sliderElementRefs[leftSliderIndex].current;
        // const colorAtPosition = this.__getSliderColorAt(relativeValue);
        const newColor = this.__getSliderColorAt(absoluteValue);
        const newSliderIndex = leftSliderIndex + 1;
        const _newSlider = this.__createColorRangeInput(newSliderIndex, this.sliderMin, this.sliderMax, absoluteValue, newColor.cssRGB() // initialColor: string
        );
        const sliderRef = this._sliderElementRefs[newSliderIndex];
        leftSlider.after(sliderRef.current);
        // No visible change, but let's reflect this in the output gradient anyway
        this.__updateBackgroundGradient();
        // Highlight the newly added range slider
        this.__updateColorIndicator(newSliderIndex);
    }
    /**
     * Get the slider color at the given absolute value. That value must be inside the [MIN_VALUE, MAX_VALUE] interval.
     * @param absoluteValue
     * @returns
     */
    __getSliderColorAt(absoluteValue) {
        console.log("__getSliderColorAt", "absoluteValue", absoluteValue);
        // Locate interval
        const leftIndex = this.__locateIntervalAt(absoluteValue);
        const leftSliderValue = this.__getSliderValue(leftIndex, NaN);
        const rightSliderValue = this.__getSliderValue(leftIndex + 1, NaN);
        if (Number.isNaN(leftSliderValue) || Number.isNaN(rightSliderValue)) {
            console.warn(`[Warn] Failed to determine left/right slider values at indices ${leftIndex} or ${rightSliderValue}. Cannot proceed for absolute value ${absoluteValue}.`);
            return null;
        }
        const leftColorString = this.__getSliderColor(leftIndex, null);
        const rightColorString = this.__getSliderColor(leftIndex + 1, null);
        if (!leftColorString || !rightColorString) {
            console.warn(`[Warn] Failed to determine left/right color string values at indices ${leftIndex} or ${rightSliderValue}. Cannot proceed for absolute value ${absoluteValue}.`);
            return null;
        }
        const positionInsideInterval = (absoluteValue - leftSliderValue) / (rightSliderValue - leftSliderValue);
        console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
        const leftColorObject = Color.parse(leftColorString);
        const rightColorObject = Color.parse(rightColorString);
        const newColor = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
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
    }
    /**
     * Locate the slider interval that contains the given (absolute) slider value. The given value must be
     * somewhere between MIN_VALUE and MAX_VALUE (usually between 0 and 100 in the default configuraion.).
     *
     * @param {number} absoluteValue - The absolute value to search for.
     * @returns {number} The left slider inder the containing interval is starting with – or -1 if out of bounds.
     */
    __locateIntervalAt(absoluteValue) {
        for (var i = 0; i + 1 < this._sliderElementRefs.length; i++) {
            if (this.__getSliderValue(i, this.sliderMin) <= absoluteValue &&
                absoluteValue < this.__getSliderValue(i + 1, this.sliderMax)) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Converts a relative value in [0..1] to [min..max].
     * @param relativeValue
     */
    __relativeToAbsolute(relativeValue) {
        return this.sliderMin + (this.sliderMax - this.sliderMin) * relativeValue;
    }
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    __getSliderValue(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        return Number.parseFloat(this._sliderElementRefs[sliderIndex].current.value);
    }
    __getAllSliderValues() {
        // return this._sliderElementRefs.map((ref, index: number) => this.__getSliderPercentage(index));
        return this._sliderElementRefs.map((ref, index) => this.__getSliderValue(index, NaN));
    }
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    __updateBackgroundGradient() {
        const colorGradient = this.getColorGradient();
        this.containerRef.current.style["background"] = colorGradient;
    }
    __updateColorIndicator(rangeSliderIndex) {
        const colorValue = this.__getSliderColor(rangeSliderIndex, "grey");
        const ratio = this.__getSliderPercentage(rangeSliderIndex);
        // console.log("__updateColorIndicator", colorValue, ratio);
        // this.colorIndicatorButtonRef.current.style["left"] = `calc( ${ratio * 100}% + ${
        //   (1.0 - ratio) * this.indicatorWidth_num * 0.5
        // }em - ${ratio * this.indicatorWidth_num * 0.5}em)`;
        this.colorInputContainerRef.current.style["left"] = `calc( ${ratio * 100}% + ${(1.0 - ratio) * this.indicatorWidth_num * 0.5}em - ${ratio * this.indicatorWidth_num * 0.5}em)`;
        this.colorIndicatorColorButtonRef.current.style["background-color"] = colorValue;
        this.colorInputRef.current.value = colorValue;
        this.colorInputRef.current.dataset["activeSliderIndex"] = `${rangeSliderIndex}`;
        if (rangeSliderIndex <= 0 || rangeSliderIndex + 1 >= this.getRangeLength()) {
            this.colorIndicatorRemoveButtonRef.current.style["visibility"] = "hidden";
        }
        else {
            this.colorIndicatorRemoveButtonRef.current.style["visibility"] = "visible";
        }
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
        for (var i = 0; i < this._sliderElementRefs.length; i++) {
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
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    __getSliderColor(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        const colorValue = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
        return colorValue ? colorValue : fallback;
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
     * Init the container contents.
     *
     * @private
     */
    _render(name) {
        const _self = this;
        console.log("Rendering ...", NoReact);
        this.colorIndicatorColorButtonRef = NoReact.useRef();
        this.colorIndicatorRemoveButtonRef = NoReact.useRef();
        this.colorInputRef = NoReact.useRef();
        this.colorInputContainerRef = NoReact.useRef();
        this.containerRef = NoReact.useRef();
        const handleIndicatorButtonClick = (evt) => {
            evt.preventDefault(); // Prevent other inputs to react to this event.
            evt.stopPropagation();
            // But fake a click on the input element
            _self.colorInputRef.current.click();
        };
        const handleRemoveColorButtonClick = (evt) => {
            evt.preventDefault(); // Prevent other inputs to react to this event.
            evt.stopPropagation();
            console.log("Todo: remove color");
            // TODO
            _self.__handleRemoveColor();
        };
        const currentColors = [0, 1, 2, 3, 4, 5];
        const stepCount = currentColors.length;
        const elementId = `color-gradient-container-${this.baseID}`;
        return (NoReact.createElement("div", { id: elementId, style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "32px",
                position: "relative"
            }, ref: this.containerRef, onClick: this.__containerClickHandler() },
            createCustomStylesElement(elementId),
            currentColors.map((index) => {
                const initialColor = this.COLORSET[index % this.COLORSET.length];
                const initialValue = (100 / (stepCount - 1)) * index;
                return this.__createColorRangeInput(index, this.sliderMin, this.sliderMax, initialValue, initialColor);
            }),
            NoReact.createElement("div", { style: { width: "100%" } },
                NoReact.createElement("input", { id: `color-indicator-input-${this.baseID}`, type: "color", style: { visibility: "hidden" }, "data-active-slider-index": "", ref: this.colorInputRef, onInput: this.__colorChangeHandler() }),
                NoReact.createElement("div", { ref: this.colorInputContainerRef, style: {
                        position: "absolute",
                        bottom: "0px",
                        left: "0%",
                        display: "flex",
                        flexDirection: "column",
                        transform: "translate(0%, 100%)"
                    } },
                    NoReact.createElement("button", { id: `color-indicator-button-${this.baseID}`, style: {
                            backgroundColor: "grey",
                            borderRadius: "3px",
                            border: "1px solid grey",
                            width: this.indicatorWidth, // "1em",
                            height: this.indicatorHeight, // "1em",
                            transform: "translate(-50%, 0%)"
                        }, onClick: handleIndicatorButtonClick, ref: this.colorIndicatorColorButtonRef }),
                    NoReact.createElement("button", { id: `color-remove-button-${this.baseID}`, className: "color-remove-button", style: {
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
    }
}
/**
 * Adds custom styles (global STYLE tag).
 *
 * @private
 */
const createCustomStylesElement = (elementId) => {
    const thumbWidth = "0.5em";
    const thumbHeight = "1.333em";
    // Thanks to Ana Tudor
    //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
    return (NoReact.createElement("style", null, `
    #${elementId} input[type='range'] {

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

    #${elementId} input[type='range']::-webkit-slider-runnable-track {
      -webkit-appearance: none;

      background: none; /* get rid of Firefox track background */
      height: 100%;
      width: 100%;

      pointer-events: none;
    }

    #${elementId} input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: currentcolor;
      border: none; /* get rid of Firefox thumb border */
      border-radius: 6px; /* get rid of Firefox corner rounding */
      pointer-events: auto; /* catch clicks */
      width: ${thumbWidth}; 
      height: ${thumbHeight};
    }

    #${elementId} input[type='range']:focus::-webkit-slider-thumb {
      border: 2px solid white;
    }

    #${elementId} input[type='range']::-moz-range-track {
      -webkit-appearance: none;
      background: none; /* get rid of Firefox track background */
      height: 100%;
      width: 100%;
      pointer-events: none;
    }

    #${elementId} input[type='range']::-moz-range-thumb {
      /* -webkit-appearance: none; */
      background: currentcolor;
      border: none; /* get rid of Firefox thumb border */
      border-radius: 6px; /* get rid of Firefox corner rounding */
      pointer-events: auto; /* catch clicks */
      width: ${thumbWidth}; 
      height: ${thumbHeight};
    }

    #${elementId} input[type='range']:focus::-moz-range-thumb {
      border: 2px solid white;
    }

    #${elementId} input[type='range'] {
      /* same as before */
      z-index: 1;
    }
    
    #${elementId} input[type='range']:focus {
        z-index: 2;
        /* outline: dotted 1px orange; */
        color: darkorange;
    }
    `));
};
//# sourceMappingURL=ColorGradientPickerJSX.js.map