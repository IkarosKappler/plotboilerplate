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
import * as NoReact from "noreact";
import { Color } from "../../datastructures/Color";
import { ColorGradient } from "../../datastructures/ColorGradient";
export class ColorGradientSelector {
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     */
    constructor(options) {
        this.isDropdownOpen = false;
        this.css_buttonWidth = "100px";
        this.css_buttonHeight = "1.8em";
        this.css_buttonFontSize = "0.725em";
        this.colorGradients = [];
        // TODO: this does not really need to be a pair, does it?
        this.colorGradientOptionRefs = [];
        this.selectedGradientIndex = -1;
        this.installedChangeListeners = [];
        /**
         * Adds custom styles (global STYLE tag).
         *
         * @private
         */
        this.__createCustomStylesElement = () => {
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            return (NoReact.createElement("style", null, `

    #${this.elementID} button {
      border: 0px solid lightgray;
      padding: 0.25em;
      /* background-color: rgba(255,255,255,0.9); */
    }

    #${this.elementID} .positioning-container button {
      border-radius: 0;
    }

    #${this.elementID} .main-button:hover {
      background-color: rgba(216,216,216,0.9);
    }

    #${this.elementID} .option-gradient-button:hover, #${this.elementID} .option-delete-button:hover {
      background-color: rgba(216,216,216,0.9);
    }


    `));
        };
        options = options || {};
        if (options.containerID) {
            const cont = document.getElementById(options.containerID);
            if (!cont) {
                throw "Cannot create ColorGradientPicker. Component ID does not exist.";
            }
            this.container = cont;
        }
        else {
            this.container = document.createElement("div");
        }
        this.isMobileMode = Boolean(options.isMobileMode);
        if (this.isMobileMode) {
            this.css_buttonWidth = "200px";
            this.css_buttonHeight = "2.5em";
            this.css_buttonFontSize = "1.25em";
        }
        this.baseID = Math.floor(Math.random() * 65535);
        this.elementID = `color-gradient-selector-${this.baseID}`;
        this.colorGradients =
            typeof options.initialGradients === "undefined" ? ColorGradientSelector.DEFAULT_COLOR_GRADIENTS : options.initialGradients;
        this.selectedGradientIndex = typeof options.selectedGradientIndex === "undefined" ? 0 : options.selectedGradientIndex;
        document.head.appendChild(this.__createCustomStylesElement());
        this.container.append(this._render());
    } // END constructor
    // TODO: implement this?
    setGradients(gradients, selectedIndex) {
        // First empty the container
        this.__removeAllChildNodes(this.positioningContainerRef.current);
        this.colorGradients = [];
        this.colorGradientOptionRefs = [];
        this.selectedGradientIndex = selectedIndex;
        // Re-render button array
        gradients.map((grad) => {
            this.addGradient(grad);
        });
    }
    addGradient(gradient) {
        // Render a new button
        const index = this.colorGradients.length;
        const refMainContainer = NoReact.useRef();
        const refActionButton = NoReact.useRef();
        const refDeleteButton = NoReact.useRef();
        this.__renderOptionButton(gradient, index, refMainContainer, refActionButton, refDeleteButton);
        this.colorGradients.push(gradient);
        this.colorGradientOptionRefs.push({ mainButton: refActionButton, deleteButton: refDeleteButton });
        // Add to container
        this.positioningContainerRef.current.appendChild(refMainContainer.current);
    }
    // +---------------------------------------------------------------------------------
    // | A helper function to remove all child nodes.
    // +-------------------------------
    __removeAllChildNodes(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
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
    getSelectedColorGradient() {
        return this.colorGradients[this.selectedGradientIndex];
    }
    __fireChangeEvent() {
        const newColorGradient = this.getSelectedColorGradient();
        for (var i = 0; i < this.installedChangeListeners.length; i++) {
            this.installedChangeListeners[i](newColorGradient, this.selectedGradientIndex, this);
        }
    }
    /**
     * Creates a handler for click events on the main button.
     *
     * @returns
     */
    __mainButtonClickHandler() {
        const _self = this;
        return (_evt) => {
            // _self.mainButtonContainerRef.current.style.visibility = "hidden";
            _self.positioningContainerRef.current.style.visibility = _self.isDropdownOpen ? "hidden" : "visible";
            _self.isDropdownOpen = !_self.isDropdownOpen;
        };
    }
    /**
     * Creates a handler for click events on one of the option button in the dropdown.
     *
     * @returns
     */
    __optionButtonClickHandler() {
        const _self = this;
        return (evt) => {
            _self.positioningContainerRef.current.style.visibility = "hidden";
            _self.isDropdownOpen = false;
            const targetButton = evt.currentTarget;
            const clickedIndex_raw = targetButton.dataset["gradientIndex"];
            const clickedIndex = Number.parseInt(clickedIndex_raw);
            console.log("clickedIndex", clickedIndex, clickedIndex_raw, targetButton.dataset, targetButton);
            if (Number.isNaN(clickedIndex)) {
                // Stop here. This is not what we want.
                return;
            }
            // Find child: and set selected.
            _self.__setSelectedIndex(clickedIndex);
            _self.__fireChangeEvent();
        };
    }
    __optionButtonDeleteHandler() {
        const _self = this;
        return (evt) => {
            if (this.colorGradientOptionRefs.length === 1) {
                // Keep the last record
                return;
            }
            const targetButton = evt.currentTarget;
            const clickedIndex_raw = targetButton.dataset["gradientIndex"];
            const clickedIndex = Number.parseInt(clickedIndex_raw);
            console.log("clickedIndex", clickedIndex, clickedIndex_raw, targetButton.dataset, targetButton);
            if (Number.isNaN(clickedIndex)) {
                // Stop here. This is not what we want.
                return;
            }
            // Find child: and remove from DOM
            console.log("this.colorGradientOptionRefs", this.colorGradientOptionRefs, "clickedIndex", clickedIndex);
            const refPair = this.colorGradientOptionRefs[clickedIndex];
            refPair.mainButton.current.parentElement.remove();
            // Remove from logic
            // Remove 1 element at the given index
            this.colorGradients.splice(clickedIndex, 1);
            this.colorGradientOptionRefs.splice(clickedIndex, 1);
            // Update all following elements in the list.
            this.__updateOptionDataSetIndices(clickedIndex);
            if (this.selectedGradientIndex >= clickedIndex) {
                // this.selectedGradientIndex--;
                this.__setSelectedIndex(this.selectedGradientIndex);
            }
            console.log("All refs", this.colorGradientOptionRefs);
        };
    }
    /**
     * Once a slider element was added or removed then the following indices must be updated.
     *
     * @param {number} startIndex - The slider index to start updating at.
     */
    __updateOptionDataSetIndices(startIndex) {
        // Update all elements to the right of the new elelemt
        for (var i = startIndex; i < this.colorGradientOptionRefs.length; i++) {
            this.colorGradientOptionRefs[i].mainButton.current.dataset["gradientIndex"] = `${i}`;
            this.colorGradientOptionRefs[i].deleteButton.current.dataset["gradientIndex"] = `${i}`;
        }
    }
    __setSelectedIndex(newSelectedIndex) {
        for (var i = 0; i < this.colorGradientOptionRefs.length; i++) {
            const ref = this.colorGradientOptionRefs[i].mainButton;
            // Find child: and set selected.
            ref.current.querySelectorAll(".option-gradient-radio-circle")[0].innerHTML = newSelectedIndex === i ? "🞊" : "🞅";
        }
        this.selectedGradientIndex = newSelectedIndex;
        const selectedGradient = this.colorGradients[this.selectedGradientIndex];
        // Display new gradient in the main button
        this.__setMainButtonGradient(selectedGradient);
    }
    /**
     * Sets the backround color of the main button (of this dropdown) element.
     *
     * @param {ColorGradient} gradient - The gradient color to display. Must not be null.
     */
    __setMainButtonGradient(gradient) {
        const colorDisplay = this.mainButtonContainerRef.current.querySelectorAll(".main-button-gradient-display")[0];
        colorDisplay.style["background"] = gradient.toColorGradientString();
    }
    /**
     * Renders a new option button for the dropdown menu.
     *
     * @param {ColorGradient} gradient
     * @returns {JsxElement}
     */
    __renderOptionButton(gradient, index, refMainContainer, refActionButton, refDelButton) {
        return (NoReact.createElement("div", { sx: { d: "flex", flexDirection: "row" }, ref: refMainContainer },
            NoReact.createElement("button", { className: "option-gradient-button", onClick: this.__optionButtonClickHandler(), style: {
                    d: "flex",
                    w: "100%",
                    fontSize: this.css_buttonFontSize,
                    minHeight: this.css_buttonHeight,
                    maxHeight: this.css_buttonHeight
                }, ref: refActionButton, "data-gradientIndex": `${index}` },
                NoReact.createElement("div", { className: "option-gradient-radio-circle", sx: { w: "2em", flexShrink: 2, alignContent: "center" } }, index === 0 ? "🞊" : "🞅"),
                NoReact.createElement("div", { sx: { w: "calc( 100% - 2em )", mr: "1em", background: gradient.toColorGradientString() } }, "\u00A0")),
            NoReact.createElement("button", { classname: "option-delete-button", sx: { fontSize: this.css_buttonFontSize, minHeight: this.css_buttonHeight, maxHeight: this.css_buttonHeight }, onClick: this.__optionButtonDeleteHandler(), "data-gradientIndex": `${index}`, ref: refDelButton },
                NoReact.createElement("div", { sx: { w: "2em", flexShrink: 2, alignContent: "center" } }, "\uD83D\uDDD1"))));
    }
    /**
     * Creates a new array of option buttons (refs).
     * @returns
     */
    _renderAllOptionButtons() {
        const _self = this;
        // First clear all references
        _self.colorGradientOptionRefs = [];
        return this.colorGradients.map((colorGradient, index) => {
            // console.log("num", num, index);
            const refMainContainer = NoReact.useRef();
            const refActionButton = NoReact.useRef();
            const refDelButton = NoReact.useRef();
            _self.colorGradientOptionRefs.push({ mainButton: refActionButton, deleteButton: refDelButton });
            return this.__renderOptionButton(colorGradient, index, refMainContainer, refActionButton, refDelButton);
        });
    }
    /**
     * Init the container contents.
     *
     * @private
     */
    _render() {
        const _self = this;
        // console.log("Rendering ...", NoReact);
        this.containerRef = NoReact.useRef();
        this.mainButtonContainerRef = NoReact.useRef();
        this.positioningContainerRef = NoReact.useRef();
        const selectedGradient = this.colorGradients[this.selectedGradientIndex];
        return (NoReact.createElement("div", { id: this.elementID, className: "color-gradient-selector", style: { minWidth: this.css_buttonWidth, maxWidth: this.css_buttonWidth, pos: "relative" }, ref: this.containerRef },
            NoReact.createElement("button", { className: "main-button", ref: this.mainButtonContainerRef, style: {
                    d: "flex",
                    minWidth: this.css_buttonWidth,
                    maxWidth: this.css_buttonWidth,
                    minHeight: this.css_buttonHeight,
                    maxHeight: this.css_buttonHeight
                }, onClick: this.__mainButtonClickHandler() },
                NoReact.createElement("div", { className: "main-button-gradient-display", sx: { w: `calc( 100% - ${this.css_buttonFontSize} )`, background: selectedGradient.toColorGradientString() } }, "\u00A0"),
                NoReact.createElement("div", { sx: { w: this.css_buttonHeight, flexShrink: 2, fontSize: this.css_buttonFontSize } }, "\u25BE")),
            NoReact.createElement("div", { className: "positioning-container", ref: this.positioningContainerRef, style: {
                    minWidth: this.css_buttonWidth,
                    maxHeight: "25vh",
                    overflowY: "auto",
                    v: "hidden",
                    d: "flex",
                    fd: "column",
                    pos: "absolute",
                    l: 0,
                    zIndex: 999
                } }, _self._renderAllOptionButtons())));
    } // END function render()
}
ColorGradientSelector.DEFAULT_COLOR_GRADIENTS = [
    ColorGradient.createDefault(),
    ColorGradient.createFrom(Color.Red, Color.Green),
    ColorGradient.createFrom(Color.Blue, Color.Gold)
];
//# sourceMappingURL=ColorGradientSelector.js.map