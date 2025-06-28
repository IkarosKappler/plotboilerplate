/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
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
    render(name: string): HTMLElement;
}
