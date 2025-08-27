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
import * as NoReact from "noreact";
import { Color } from "../../datastructures/Color";
import { ColorGradient } from "../../datastructures/ColorGradient";
export class ColorGradientPicker {
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
    constructor(containerID, isMobileMode) {
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
        this.__createSliderChangeHandler = () => {
            const _self = this;
            return (e) => {
                const targetSlider = e.target;
                // console.log("Clicked", targetSlider ? targetSlider.getAttribute("id") : null);
                if (!targetSlider) {
                    return false;
                }
                const currentSliderValue = Number.parseFloat(targetSlider.value);
                const rangeSliderIndexRaw = targetSlider.dataset["rangeSliderIndex"];
                // console.log("rangeSliderIndexRaw", rangeSliderIndexRaw);
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
        /**
         * Adds custom styles (global STYLE tag).
         *
         * @private
         */
        this.__createCustomStylesElement = () => {
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            return (NoReact.createElement("style", null, `
    #${this.elementID} input[type='range'] {

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

    #${this.elementID} input[type='range']::-webkit-slider-runnable-track {
      -webkit-appearance: none;

      background: none; /* get rid of Firefox track background */
      height: 100%;
      width: 100%;

      pointer-events: none;
    }

    #${this.elementID} input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: currentcolor;
      border: none; /* get rid of Firefox thumb border */
      border-radius: 6px; /* get rid of Firefox corner rounding */
      pointer-events: auto; /* catch clicks */
      width: ${this.css_thumbWidth}; 
      height: ${this.css_thumbHeight};
    }

    #${this.elementID} input[type='range']:focus::-webkit-slider-thumb {
      border: 2px solid white;
    }

    #${this.elementID} input[type='range']::-moz-range-track {
      -webkit-appearance: none;
      background: none; /* get rid of Firefox track background */
      height: 100%;
      width: 100%;
      pointer-events: none;
    }

    #${this.elementID} input[type='range']::-moz-range-thumb {
      /* -webkit-appearance: none; */
      background: currentcolor;
      border: none; /* get rid of Firefox thumb border */
      border-radius: 6px; /* get rid of Firefox corner rounding */
      pointer-events: auto; /* catch clicks */
      width: ${this.css_thumbWidth}; 
      height: ${this.css_thumbHeight};
    }

    #${this.elementID} input[type='range']:focus::-moz-range-thumb {
      border: 2px solid white;
    }

    #${this.elementID} input[type='range'] {
      /* same as before */
      z-index: 1;
    }
    
    #${this.elementID} input[type='range']:focus {
        z-index: 2;
        /* outline: dotted 1px orange; */
        color: darkorange;
    }
    `));
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
        this.elementID = `color-gradient-picker-${this.baseID}`;
        this.colorGradient = ColorGradient.createDefault();
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
    __initializeDataSets() {
        for (var i = 0; i < this._sliderElementRefs.length; i++) {
            const sliderColor = this.colorGradient.values[i].color;
            // console.log("Setting up slider color data set", i, sliderColor, sliderColor.cssRGB(), sliderColor.cssHEX());
            this._sliderElementRefs[i].current.dataset.colorValue = sliderColor.cssRGB();
            this._sliderElementRefs[i].current.dataset.colorValueHEX = sliderColor.cssHEX();
        }
    }
    /**
     * Adds a new color gradient change listener to this ColorGradientPicker.
     *
     * @param {ColorGradientChangeListener} listener - The listener to add.
     * @returns {boolean} True, if the listener was added and did not exist before.
     */
    addChangeListener(listener) {
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            if (this.installedChangeListeners[i] === listener) {
                return false;
            }
        }
        this.installedChangeListeners.push(listener);
        return true;
    }
    /**
     *
     * @param {ColorGradientChangeListener} listener The listener to remove.
     * @returns {boolean} True, if the listener existed and has been removed.
     */
    removeChangeListener(listener) {
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            if (this.installedChangeListeners[i] === listener) {
                this.installedChangeListeners.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    __fireChangeEvent() {
        const newColorGradient = this.getColorGradient();
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            this.installedChangeListeners[i](newColorGradient, this);
        }
    }
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
        // console.log("new _sliderElementRefs", this._sliderElementRefs);
        // Update all elements to the right of the new elelemt
        this.__updateSliderDataSetIndices(index + 1);
        return (NoReact.createElement("input", { id: `rage-slider-${this.baseID}-${index}`, type: "range", min: sliderMin, max: sliderMax, value: initialValue, style: { pos: "absolute", l: "0px", t: "0px", w: "100%", h: "60%" }, "data-range-slider-index": `${index}`, "data-colorValue": initialColor.cssRGB(), "data-colorValueHEX": initialColor.cssHEX(), onChange: sliderHandler, onClick: sliderHandler, ref: ref }));
    }
    /**
     * Get the absolute length of this range, in slider units.
     * @returns
     */
    getRangeLength() {
        return this.sliderMax - this.sliderMin;
    }
    /**
     * Handles color value changes.
     *
     * @returns
     */
    __colorChangeHandler() {
        const _self = this;
        return (_evt) => {
            // console.log("__colorChangeHandler");
            const activeSliderIndex_raw = this.colorInputRef.current.dataset.activeSliderIndex;
            if (!activeSliderIndex_raw) {
                console.warn("Cannot update color indicator; no active range slider set. This is likely a program error and should not happen.");
                return false;
            }
            const activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
            if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self._sliderElementRefs.length) {
                console.warn("Cannot update color indicator; active index invalid or out of bounds. This is likely a program error and should not happen.", activeSliderIndex);
                return false;
            }
            const newColor = _self.colorInputRef.current.value;
            const rangeSlider = _self._sliderElementRefs[activeSliderIndex].current;
            rangeSlider.dataset.colorValue = newColor;
            // rangeSlider.dataset["colorValue"] = newColor;
            this.colorIndicatorColorButtonRef.current.style["background-color"] = newColor;
            _self.__updateBackgroundGradient();
            _self.__fireChangeEvent();
            return true;
        };
    }
    /**
     * Removed the current color slider from the DOM and highlights the left neighbour.
     *
     * @returns {boolean} True if the element could be successfully removed.
     */
    __handleRemoveColor() {
        // const colorInput : HTMLInputElement | null = evt.target;
        // console.log("__colorChangeHandler");
        const activeSliderIndex_raw = this.colorInputRef.current.dataset.activeSliderIndex;
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
        this.__fireChangeEvent();
        return true;
    }
    /**
     * Once a slider element was added or removed then the following indices must be updated.
     *
     * @param {number} startIndex - The slider index to start updating at.
     */
    __updateSliderDataSetIndices(startIndex) {
        // Update all elements to the right of the new elelemt
        for (var i = startIndex; i < this._sliderElementRefs.length; i++) {
            this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
            this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${this.baseID}-${i}`);
        }
    }
    /**
     * To avoid too many sliders added on each click, check if the mouse was moved in the meantime (detect drag event).
     *
     * @returns
     */
    __containerMouseDownHandler() {
        const _self = this;
        return (event) => {
            _self.__mouseDownPosition = { x: event.clientX, y: event.clientY };
            // console.log("__containerMouseDownHandler _self.__mouseDownPosition", _self.__mouseDownPosition);
        };
    }
    /**
     * Creates a handler for click events on the container. If the click event is far
     * enough from existing sliders, then it can be added.
     *
     * @returns
     */
    __containerClickHandler() {
        const _self = this;
        const maxDifference = _self.getRangeLength() * 0.03;
        return (evt) => {
            // console.log("Container click handler");
            const relativeValue = _self.__clickEventToRelativeValue(evt);
            if (relativeValue < 0 || relativeValue > 1.0) {
                // Clicked somewhere outside the range
                return;
            }
            // Check if element was moved in the meantime
            if (_self.__mouseDownPosition && Math.abs(_self.__mouseDownPosition.x - evt.clientX) >= 10.0) {
                // Ignore event if mouse was moved more than 10 pixels between down- and up-event
                console.log("Mouse was moved more than 10 px. Cancelling.");
                _self.__mouseDownPosition = null;
                return;
            }
            const absoluteValue = this.__relativeToAbsolute(relativeValue);
            // console.log("click", "relativeValue", relativeValue, "absoluteValue", absoluteValue);
            // Check if click position (ratio) is far enough away from any slider
            const [leftSliderIndex, closestSliderValue] = _self.__locateClosestSliderValue(absoluteValue);
            const diff = Math.abs(closestSliderValue - absoluteValue);
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
    }
    /**
     * Find that slider (index) that's value is closest to the given absolute value. The function will return
     * the closest value and the left index, indicating the containing interval index.
     *
     * @param {number} absoluteValue - The value to look for.
     * @returns {[number,number]} A pair of left slider index and closest value.
     */
    __locateClosestSliderValue(absoluteValue) {
        // As the colorGradient always reflects the slider values we can just ust the color gradient itself to search.
        const relativeValue = this.__absoluteToRelative(absoluteValue);
        const colorGradientEntry = this.colorGradient.locateClosestRatio(relativeValue);
        return [colorGradientEntry[0], this.__relativeToAbsolute(colorGradientEntry[1].ratio)];
    }
    /**
     * Convert the click event to the relative x value in [0..1].
     *
     * @param {MouseEvent} evt - The mouse event.
     * @returns {number} The relative x value.
     */
    __clickEventToRelativeValue(evt) {
        const target = evt.target;
        const rect = target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const width = rect.width; // target.clientWidth;
        const relativeValue = x / width;
        // console.log("width", width, "x", x, "relativeValue", relativeValue);
        return relativeValue;
    }
    /**
     * Adds a slider at the given interval index.
     *
     * @param {number} absoluteValue - The absolute new slider value.
     * @param {number} leftSliderIndex - The new slider's position (interval index).
     */
    __addSliderAt(absoluteValue, leftSliderIndex) {
        // console.log("__addSliderAt", "absoluteValue", absoluteValue, "leftSliderIndex", leftSliderIndex);
        const leftSlider = this._sliderElementRefs[leftSliderIndex].current;
        // const colorAtPosition = this.__getSliderColorAt(relativeValue);
        const newColor = this.__getSliderColorAt(absoluteValue);
        const newSliderIndex = leftSliderIndex + 1;
        const _newSlider = this.__createColorRangeInput(newSliderIndex, this.sliderMin, this.sliderMax, absoluteValue, newColor // initialColor: string
        );
        const sliderRef = this._sliderElementRefs[newSliderIndex];
        leftSlider.after(sliderRef.current);
        sliderRef.current.dataset.colorValue = newColor.cssRGB();
        sliderRef.current.dataset.colorValueHEX = newColor.cssRGB();
        // No visible change, but let's reflect this in the output gradient anyway
        this.__updateBackgroundGradient();
        // Highlight the newly added range slider
        this.__updateColorIndicator(newSliderIndex);
        this.__fireChangeEvent();
    }
    /**
     * Get the slider color at the given absolute value. That value must be inside the [MIN_VALUE, MAX_VALUE] interval.
     * @param absoluteValue
     * @returns
     */
    __getSliderColorAt(absoluteValue) {
        // console.log("__getSliderColorAt", "absoluteValue", absoluteValue);
        // Locate interval
        const leftIndex = this.__locateIntervalAt(absoluteValue);
        const leftSliderValue = this.__getSliderValue(leftIndex, NaN);
        const rightSliderValue = this.__getSliderValue(leftIndex + 1, NaN);
        if (Number.isNaN(leftSliderValue) || Number.isNaN(rightSliderValue)) {
            console.warn(`[Warn] Failed to determine left/right slider values at indices ${leftIndex} or ${rightSliderValue}. Cannot proceed for absolute value ${absoluteValue}.`);
            return null;
        }
        const leftColorString = this.__getSliderColorString(leftIndex, null);
        const rightColorString = this.__getSliderColorString(leftIndex + 1, null);
        if (!leftColorString || !rightColorString) {
            console.warn(`[Warn] Failed to determine left/right color string values at indices ${leftIndex} or ${rightSliderValue}. Cannot proceed for absolute value ${absoluteValue}.`);
            return null;
        }
        const positionInsideInterval = (absoluteValue - leftSliderValue) / (rightSliderValue - leftSliderValue);
        // console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
        const leftColorObject = Color.parse(leftColorString);
        const rightColorObject = Color.parse(rightColorString);
        const newColor = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
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
     * Converts a relative value in [0..1] to [min..max].
     * @param relativeValue
     */
    __absoluteToRelative(absolute) {
        return (absolute - this.sliderMin) / (this.sliderMax - this.sliderMin);
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
    /**
     * Get all current slider values as an array.
     * @returns
     */
    __getAllSliderValues() {
        return this._sliderElementRefs.map((ref, index) => this.__getSliderValue(index, NaN));
    }
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    __updateBackgroundGradient() {
        // const colorGradient = this.getColorGradient();
        this.colorGradient = new ColorGradient(this.__getAllSliderValues().map((sliderValue, sliderIndex) => ({
            color: this.__getSliderColor(sliderIndex, null),
            ratio: this.__absoluteToRelative(sliderValue)
        })), this.colorGradient.angle);
        this.containerRef.current.style["background"] = this.colorGradient.toColorGradientString();
    }
    /**
     * After changes this function updates the color indicator button.
     *
     * @param {number} rangeSliderIndex - The new active slider index.
     */
    __updateColorIndicator(rangeSliderIndex) {
        const colorValue = this.__getSliderColorHEXString(rangeSliderIndex, "#808080");
        const ratio = this.__getSliderPercentage(rangeSliderIndex);
        // Set left offset of color input container
        this.colorInputContainerRef.current.style["left"] = `calc( ${ratio * 100}% + ${(1.0 - ratio) * this.css_indicatorWidth_num * 0.5}em - ${ratio * this.css_indicatorWidth_num * 0.5}em)`;
        // Also set offset of colot input element (safari will open the native color dialog at this position)
        this.colorInputRef.current.style["left"] = `calc( ${ratio * 100}% + ${(1.0 - ratio) * this.css_indicatorWidth_num * 0.5}em - ${ratio * this.css_indicatorWidth_num * 0.5}em)`;
        this.colorIndicatorColorButtonRef.current.style["background-color"] = colorValue;
        this.colorInputRef.current.value = colorValue;
        // console.log("Setting new color value", this.colorInputRef.current.value, colorValue);
        this.colorInputRef.current.dataset.activeSliderIndex = `${rangeSliderIndex}`;
        if (rangeSliderIndex <= 0 || rangeSliderIndex + 1 >= this._sliderElementRefs.length) {
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
     * @returns {ColorGradient}
     */
    getColorGradient() {
        return this.colorGradient;
    }
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    __getSliderColorString(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        const colorValue = this._sliderElementRefs[sliderIndex].current.dataset.colorValue;
        return colorValue ? colorValue : fallback;
    }
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    __getSliderColorHEXString(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        const colorValue = this._sliderElementRefs[sliderIndex].current.dataset.colorValueHEX;
        return colorValue ? colorValue : fallback;
    }
    /**
     * Get get color of this gradient picker at the given slider index.
     *
     * @param {number} sliderIndex - The index to get the slider color from. Something between 0 and _sliderElementRefs.length.
     * @param {Color} fallback
     * @returns
     */
    __getSliderColor(sliderIndex, fallback) {
        if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
            return fallback;
        }
        const colorValueString = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
        const colorValue = Color.parse(colorValueString);
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
    _render() {
        const _self = this;
        // console.log("Rendering ...", NoReact);
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
        const handleIndicatorButtonClick = (evt) => {
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
        const handleRemoveColorButtonClick = (evt) => {
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
                mb: this.isMobileMode ? "6em" : "3em"
            }, ref: this.containerRef, onMouseDown: this.__containerMouseDownHandler(), onClick: this.__containerClickHandler() },
            this.colorGradient.values.map((colorGradientItem, index) => {
                const initialValue = _self.__relativeToAbsolute(colorGradientItem.ratio);
                return this.__createColorRangeInput(index, this.sliderMin, this.sliderMax, initialValue, colorGradientItem.color);
            }),
            NoReact.createElement("div", { style: { w: "100%" } },
                NoReact.createElement("input", { id: `color-indicator-input-${this.baseID}`, type: "color", style: { v: "hidden", pos: "absolute", l: 0 }, 
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
                    NoReact.createElement("button", { id: `color-indicator-button-${this.baseID}`, style: {
                            backgroundColor: "grey",
                            borderRadius: "10%",
                            border: "1px solid grey",
                            w: this.css_indicatorWidth, // "1em",
                            h: this.css_indicatorHeight, // "1em",
                            transform: "translate(-50%, 0%)"
                        }, onClick: handleIndicatorButtonClick, ref: this.colorIndicatorColorButtonRef }),
                    NoReact.createElement("button", { id: `color-remove-button-${this.baseID}`, className: "color-remove-button", style: {
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
    } // END function render()
}
//# sourceMappingURL=ColorGradientPicker.js.map