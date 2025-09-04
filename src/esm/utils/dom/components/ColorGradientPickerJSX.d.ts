/**
 * Approach for a 'simple' color gradient picker for my PlotBoilerplate library.
 *
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
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
    private indicatorWidth_num;
    private indicatorWidth;
    private indicatorWidth_half;
    private indicatorHeight;
    private COLORSET;
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     */
    constructor(containerID?: string);
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
    getRangeLength(): number;
    /**
     * Creates a callback function for range slider.
     *
     * @returns
     */
    __createSliderChangeHandler: () => (e: Event) => boolean;
    __colorChangeHandler(): (_evt: Event) => boolean;
    /**
     * Removed the current color slider from the DOM and highlights the left neighbour.
     * @returns
     */
    __handleRemoveColor(): boolean;
    __updateSliderDataSetIndices(startIndex: number): void;
    __containerClickHandler(): (evt: MouseEvent) => void;
    private __locateClosestSliderValue;
    __clickEventToRelativeValue(evt: MouseEvent): number;
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
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    private __getSliderValue;
    private __getAllSliderValues;
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    private __updateBackgroundGradient;
    private __updateColorIndicator;
    /**
     * Get a color gradient CSS value string from the current editor settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    getColorGradient(): string;
    /**
     * Get the configured color value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {string} fallback
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
