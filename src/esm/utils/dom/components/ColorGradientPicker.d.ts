/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */
export declare class ColorGradientPicker {
    private container;
    private sliderElements;
    private sliderMin;
    private sliderMax;
    private COLORSET;
    constructor(containerID?: string);
    private __init;
    private __setContainerLayout;
    private __createRangeSlider;
    getColorGradient(): string;
    private __createSliderHandler;
    private __updateBackgroundGradient;
    private __getSliderValue;
    private __getSliderColor;
    private __addCustomStyles;
}
