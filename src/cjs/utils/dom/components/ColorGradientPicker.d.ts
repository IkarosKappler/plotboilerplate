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
import { ColorGradient } from "../../datastructures/ColorGradient";
export type ColorGradientChangeListener = (colorGradient: ColorGradient, source: ColorGradientPicker) => void;
export declare class ColorGradientPicker {
    private readonly baseID;
    private container;
    private containerRef;
    private _sliderElementRefs;
    private colorInputRef;
    private colorIndicatorColorButtonRef;
    private colorIndicatorRemoveButtonRef;
    private colorInputContainerRef;
    private sliderMin;
    private sliderMax;
    private isMobileMode;
    private css_indicatorWidth_num;
    private css_indicatorWidth;
    private css_indicatorHeight;
    private css_thumbWidth;
    private css_thumbHeight;
    private css_containerHeight;
    private colorGradient;
    private installedChangeListeners;
    private __mouseDownPosition;
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     */
    constructor(containerID?: string, isMobileMode?: boolean);
    /**
     * Adds a new color gradient change listener to this ColorGradientPicker.
     *
     * @param {ColorGradientChangeListener} listener - The listener to add.
     * @returns {boolean} True, if the listener was added and did not exist before.
     */
    addChangeListener(listener: ColorGradientChangeListener): boolean;
    /**
     *
     * @param {ColorGradientChangeListener} listener The listener to remove.
     * @returns {boolean} True, if the listener existed and has been removed.
     */
    removeChangeListener(listener: ColorGradientChangeListener): boolean;
    private __fireChangeEvent;
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
    private __createColorRangeInput;
    /**
     * Get the absolute length of this range, in slider units.
     * @returns
     */
    getRangeLength(): number;
    /**
     * Creates a callback function for range slider.
     *
     * @returns
     */
    private __createSliderChangeHandler;
    /**
     * Handles color value changes.
     *
     * @returns
     */
    __colorChangeHandler(): (_evt: Event) => boolean;
    /**
     * Removed the current color slider from the DOM and highlights the left neighbour.
     *
     * @returns {boolean} True if the element could be successfully removed.
     */
    private __handleRemoveColor;
    /**
     * Once a slider element was added or removed then the following indices must be updated.
     *
     * @param {number} startIndex - The slider index to start updating at.
     */
    __updateSliderDataSetIndices(startIndex: number): void;
    /**
     * To avoid too many sliders added on each click, check if the mouse was moved in the meantime (detect drag event).
     *
     * @returns
     */
    private __containerMouseDownHandler;
    /**
     * Creates a handler for click events on the container. If the click event is far
     * enough from existing sliders, then it can be added.
     *
     * @returns
     */
    private __containerClickHandler;
    /**
     * Find that slider (index) that's value is closest to the given absolute value. The function will return
     * the closest value and the left index, indicating the containing interval index.
     *
     * @param {number} absoluteValue - The value to look for.
     * @returns {[number,number]} A pair of left slider index and closest value.
     */
    private __locateClosestSliderValue;
    /**
     * Convert the click event to the relative x value in [0..1].
     *
     * @param {MouseEvent} evt - The mouse event.
     * @returns {number} The relative x value.
     */
    private __clickEventToRelativeValue;
    /**
     * Adds a slider at the given interval index.
     *
     * @param {number} absoluteValue - The absolute new slider value.
     * @param {number} leftSliderIndex - The new slider's position (interval index).
     */
    private __addSliderAt;
    /**
     * Get the slider color at the given absolute value. That value must be inside the [MIN_VALUE, MAX_VALUE] interval.
     * @param absoluteValue
     * @returns
     */
    private __getSliderColorAt;
    /**
     * Locate the slider interval that contains the given (absolute) slider value. The given value must be
     * somewhere between MIN_VALUE and MAX_VALUE (usually between 0 and 100 in the default configuraion.).
     *
     * @param {number} absoluteValue - The absolute value to search for.
     * @returns {number} The left slider inder the containing interval is starting with – or -1 if out of bounds.
     */
    private __locateIntervalAt;
    /**
     * Converts a relative value in [0..1] to [min..max].
     * @param relativeValue
     */
    private __relativeToAbsolute;
    /**
     * Converts a relative value in [0..1] to [min..max].
     * @param relativeValue
     */
    private __absoluteToRelative;
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    private __getSliderValue;
    /**
     * Get all current slider values as an array.
     * @returns
     */
    private __getAllSliderValues;
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    private __updateBackgroundGradient;
    /**
     * After changes this function updates the color indicator button.
     *
     * @param {number} rangeSliderIndex - The new active slider index.
     */
    private __updateColorIndicator;
    /**
     * Get a color gradient CSS value string from the current editor settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {ColorGradient}
     */
    getColorGradient(): ColorGradient;
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    private __getSliderColorString;
    /**
     * Get get color of this gradient picker at the given slider index.
     *
     * @param {number} sliderIndex - The index to get the slider color from. Something between 0 and _sliderElementRefs.length.
     * @param {Color} fallback
     * @returns
     */
    private __getSliderColor;
    /**
     * Get the slider's value in a mapped range of 0.0 ... 1.0.
     *
     * @param sliderIndex
     * @returns
     */
    private __getSliderPercentage;
    /**
     * Init the container contents.
     *
     * @private
     */
    private _render;
}
