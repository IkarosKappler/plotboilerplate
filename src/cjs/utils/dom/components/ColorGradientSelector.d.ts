/**
 * A simple class for rendering color gradient dropdowns.
 *
 * As native dropdown do not support custom stylings in the way we need, we will implement
 * our own dropdown class.
 *
 * @author  Ikaros Kappler
 * @date    2025-08-19
 * @version 1.0.0
 */
import { ColorGradient } from "../../datastructures/ColorGradient";
export type ColorGradientSelectorChangeListener = (colorGradient: ColorGradient, gradientIndex: number, source: ColorGradientSelector) => void;
/**
 * The initial properties to use.
 */
export interface ColorGradientSelectorProps {
    containerID?: string;
    initialGradients?: Array<ColorGradient>;
    selectedGradientIndex?: number;
    isMobileMode?: boolean;
}
export declare class ColorGradientSelector {
    private readonly baseID;
    private readonly elementID;
    private container;
    private containerRef;
    private mainButtonContainerRef;
    private positioningContainerRef;
    private isMobileMode;
    private isDropdownOpen;
    private css_buttonWidth;
    private css_buttonHeight;
    private css_buttonFontSize;
    private colorGradients;
    private colorGradientOptionRefs;
    private selectedGradientIndex;
    private readonly installedChangeListeners;
    static readonly DEFAULT_COLOR_GRADIENTS: Array<ColorGradient>;
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     */
    constructor(options?: ColorGradientSelectorProps);
    setGradients(gradients: Array<ColorGradient>, selectedIndex: number): void;
    addGradient(gradient: ColorGradient): void;
    private __removeAllChildNodes;
    /**
     * Adds a new color gradient change listener to this ColorGradientPicker.
     *
     * @param {ColorGradientChangeListener} listener - The listener to add.
     * @returns {boolean} True, if the listener was added and did not exist before.
     */
    addChangeListener(listener: ColorGradientSelectorChangeListener): boolean;
    /**
     *
     * @param {ColorGradientChangeListener} listener The listener to remove.
     * @returns {boolean} True, if the listener existed and has been removed.
     */
    removeChangeListener(listener: ColorGradientSelectorChangeListener): boolean;
    getSelectedColorGradient(): ColorGradient;
    private __fireChangeEvent;
    /**
     * Creates a handler for click events on the main button.
     *
     * @returns
     */
    private __mainButtonClickHandler;
    /**
     * Creates a handler for click events on one of the option button in the dropdown.
     *
     * @returns
     */
    private __optionButtonClickHandler;
    private __optionButtonDeleteHandler;
    /**
     * Once a slider element was added or removed then the following indices must be updated.
     *
     * @param {number} startIndex - The slider index to start updating at.
     */
    __updateOptionDataSetIndices(startIndex: number): void;
    private __setSelectedIndex;
    /**
     * Sets the backround color of the main button (of this dropdown) element.
     *
     * @param {ColorGradient} gradient - The gradient color to display. Must not be null.
     */
    private __setMainButtonGradient;
    /**
     * Renders a new option button for the dropdown menu.
     *
     * @param {ColorGradient} gradient
     * @returns {JsxElement}
     */
    private __renderOptionButton;
    /**
     * Creates a new array of option buttons (refs).
     * @returns
     */
    private _renderAllOptionButtons;
    /**
     * Init the container contents.
     *
     * @private
     */
    private _render;
    storeInLocalStorage(): void;
    restoreFromLocalStorage(): void;
    /**
     * Adds custom styles (global STYLE tag).
     *
     * @private
     */
    private __createCustomStylesElement;
}
