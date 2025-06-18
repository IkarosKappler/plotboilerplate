/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */
export declare class ColorGradientPicker {
    private baseID;
    private container;
    private sliderElements;
    private colorInput;
    private indicatorContainer;
    private colorIndicatorButton;
    private sliderMin;
    private sliderMax;
    private indicatorWidth_num;
    private indicatorWidth;
    private indicatorWidth_half;
    private indicatorHeight;
    private COLORSET;
    /**
     * The constructor.
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID
     */
    constructor(containerID?: string);
    /**
     * Init the container contents.
     *
     * @private
     */
    private __init;
    /**
     * Apply style settings to the main container.
     *
     * @private
     */
    private __setContainerLayout;
    /**
     * Create a new range slider for this color gradient picker.
     *
     * @param {number} initialValue
     * @param {number} index
     */
    private __createRangeSlider;
    private __createColorIndicator;
    /**
     * Get a color gradient CSS value string from the current editor settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    getColorGradient(): string;
    /**
     * Creates a callback function for range slider.
     *
     * @returns
     */
    private __createSliderChangeHandler;
    private __colorChangeHandler;
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    private __updateBackgroundGradient;
    private __updateColorIndicator;
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    private __getSliderValue;
    /**
     * Get the slider's value in a mapped range of 0.0 ... 1.0.
     *
     * @param sliderIndex
     * @returns
     */
    private __getSliderPercentage;
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
     * @returns
     */
    private __getSliderColor;
    /**
     * Adds custom styles (global STYLE tag).
     *
     * @private
     */
    private __addCustomStyles;
}
