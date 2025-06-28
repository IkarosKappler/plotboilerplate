/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
import { JsxElement } from "typescript";
export declare class ColorGradientPicker {
    private baseID;
    private container;
    private containerRef;
    private _sliderElementRefs;
    private colorInputRef;
    private indicatorContainer;
    private colorIndicatorButtonRef;
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
    createColorRangeInput(baseID: number, index: number, sliderMin: number, sliderMax: number, initialValue: number, initialColor: string): JsxElement;
    /**
     * Creates a callback function for range slider.
     *
     * @returns
     */
    __createSliderChangeHandler: () => (e: Event) => boolean;
    __colorChangeHandler(): (_evt: Event) => boolean;
    /**
     * Get the value of the n-th rangel slider.
     *
     * @param {number} sliderIndex
     * @param {number} fallback
     * @returns
     */
    __getSliderValue(sliderIndex: number, fallback: number): number;
    /**
     * Updates the container's background to display the configured color gradient.
     *
     * @private
     */
    __updateBackgroundGradient(): void;
    __updateColorIndicator(rangeSliderIndex: number): void;
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
