"use strict";
/**
 * A simple class for rendering dropdowns
 *
 * @author  Ikaros Kappler
 * @date    2025-08-19
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradientSelector = void 0;
var NoReact = require("noreact");
var Color_1 = require("../../datastructures/Color");
var ColorGradient_1 = require("../../datastructures/ColorGradient");
var ColorGradientSelector = /** @class */ (function () {
    /**
     * The constructor: creates a new color gradient picker in the given container.
     * If no container or ID is given then a new unbound `container` will be created (DIV).
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
     */
    function ColorGradientSelector(containerID, isMobileMode) {
        var _this = this;
        this.isDropdownOpen = false;
        this.css_buttonWidth = "100px";
        this.css_buttonHeight = "1.25em";
        this.css_buttonFontSize = "0.625em";
        this.colorGradients = [];
        this.colorGradientOptionRefs = [];
        this.selectedGradientIndex = -1;
        /**
         * Adds custom styles (global STYLE tag).
         *
         * @private
         */
        this.__createCustomStylesElement = function () {
            // Thanks to Ana Tudor
            //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
            return (NoReact.createElement("style", null, "\n    #".concat(_this.elementID, " {\n\n    }\n\n    #").concat(_this.elementID, " button {\n      border: 1px solid lightgray;\n      padding: 0.25em;\n      background-color: rgba(255,255,255,0.9);\n    }\n\n    #").concat(_this.elementID, " .main-button:hover {\n      background-color: rgba(216,216,216,0.9);\n    }\n\n    #").concat(_this.elementID, " .option-gradient-button:hover {\n      background-color: rgba(216,216,216,0.9);\n    }\n\n    ")));
        };
        if (containerID) {
            var cont = document.getElementById(containerID);
            if (!cont) {
                throw "Cannot create ColorGradientPicker. Component ID does not exist.";
            }
            this.container = cont;
        }
        else {
            this.container = document.createElement("div");
        }
        this.isMobileMode = Boolean(isMobileMode);
        if (this.isMobileMode) {
            this.css_buttonWidth = "200px";
            this.css_buttonHeight = "2.5em";
            this.css_buttonFontSize = "1.25em";
        }
        this.baseID = Math.floor(Math.random() * 65535);
        this.elementID = "color-gradient-selector-".concat(this.baseID);
        var tmpColorGradients = [
            ColorGradient_1.ColorGradient.createDefault(),
            ColorGradient_1.ColorGradient.createFrom(Color_1.Color.RED, Color_1.Color.GREEN),
            ColorGradient_1.ColorGradient.createFrom(Color_1.Color.BLUE, Color_1.Color.GOLD)
        ];
        this.colorGradients = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(function (num) { return tmpColorGradients[num % tmpColorGradients.length]; });
        this.selectedGradientIndex = 0;
        document.head.appendChild(this.__createCustomStylesElement());
        this.container.append(this._render());
    } // END constructor
    /**
     * Adds a new color gradient change listener to this ColorGradientPicker.
     *
     * @param {ColorGradientChangeListener} listener - The listener to add.
     * @returns {boolean} True, if the listener was added and did not exist before.
     */
    ColorGradientSelector.prototype.addChangeListener = function (listener) {
        // for (var i = 0; i < this.installedChangeListeners.length; i++) {
        //   if (this.installedChangeListeners[i] === listener) {
        //     return false;
        //   }
        // }
        // this.installedChangeListeners.push(listener);
        return true;
    };
    /**
     *
     * @param {ColorGradientChangeListener} listener The listener to remove.
     * @returns {boolean} True, if the listener existed and has been removed.
     */
    ColorGradientSelector.prototype.removeChangeListener = function (listener) {
        // for (var i = 0; i < this.installedChangeListeners.length; i++) {
        //   if (this.installedChangeListeners[i] === listener) {
        //     this.installedChangeListeners.splice(i, 1);
        //     return true;
        //   }
        // }
        return false;
    };
    ColorGradientSelector.prototype.__fireChangeEvent = function () {
        // const newColorGradient = this.getColorGradient();
        // for (var i = 0; i < this.installedChangeListeners.length; i++) {
        //   this.installedChangeListeners[i](newColorGradient, this);
        // }
    };
    /**
     * Creates a handler for click events on the main button.
     *
     * @returns
     */
    ColorGradientSelector.prototype.__mainButtonClickHandler = function () {
        var _self = this;
        return function (_evt) {
            // _self.mainButtonContainerRef.current.style.visibility = "hidden";
            _self.positioningContainerRef.current.style.visibility = _self.isDropdownOpen ? "hidden" : "visible";
            _self.isDropdownOpen = !_self.isDropdownOpen;
        };
    };
    /**
     * Creates a handler for click events on the main button.
     *
     * @returns
     */
    ColorGradientSelector.prototype.__optionButtonClickHandler = function () {
        var _self = this;
        return function (evt) {
            // _self.mainButtonContainerRef.current.style.visibility = "visible";
            _self.positioningContainerRef.current.style.visibility = "hidden";
            _self.isDropdownOpen = false;
            var targetButton = evt.target;
            var clickedIndex_raw = targetButton.dataset.gradientIndex;
            var clickedIndex = Number.parseInt(clickedIndex_raw);
            console.log("clickedIndex", clickedIndex, clickedIndex_raw);
            // option-gradient-radio-circle
        };
    };
    /**
     * Renders a new option button for the dropdown menu.
     *
     * @param {ColorGradient} gradient
     * @returns {JsxElement}
     */
    ColorGradientSelector.prototype.__renderOptionButton = function (gradient, index, ref) {
        return (NoReact.createElement("button", { className: "option-gradient-button", onClick: this.__optionButtonClickHandler(), style: { d: "flex", w: "100%", fontSize: this.css_buttonFontSize }, ref: ref },
            NoReact.createElement("div", { className: "option-gradient-radio-circle", sx: { w: "2em", flexShrink: 2 } }, index === 0 ? "🞊" : "🞅"),
            NoReact.createElement("div", { sx: { w: "calc( 100% - 2em )", mr: "1em", background: gradient.toColorGradientString() } }, "\u00A0")));
    };
    /**
     * Init the container contents.
     *
     * @private
     */
    ColorGradientSelector.prototype._render = function () {
        var _this = this;
        var _self = this;
        // console.log("Rendering ...", NoReact);
        this.containerRef = NoReact.useRef();
        this.mainButtonContainerRef = NoReact.useRef();
        this.positioningContainerRef = NoReact.useRef();
        var selectedGradient = this.colorGradients[this.selectedGradientIndex];
        return (NoReact.createElement("div", { id: this.elementID, className: "color-gradient-selector", style: { minWidth: this.css_buttonWidth, maxWidth: this.css_buttonWidth, pos: "relative" }, ref: this.containerRef },
            NoReact.createElement("button", { className: "main-button", ref: this.mainButtonContainerRef, style: {
                    d: "flex",
                    minWidth: this.css_buttonWidth,
                    maxWidth: this.css_buttonWidth,
                    minHeight: this.css_buttonHeight,
                    maxHeight: this.css_buttonHeight
                }, onClick: this.__mainButtonClickHandler() },
                NoReact.createElement("div", { sx: { w: "calc( 100% - 2em )", background: selectedGradient.toColorGradientString() } }, "\u00A0"),
                NoReact.createElement("div", { sx: { w: this.css_buttonHeight, flexShrink: 2, fontSize: this.css_buttonFontSize } }, "\u25BE")),
            NoReact.createElement("div", { className: "positioning-container", ref: this.positioningContainerRef, style: {
                    minWidth: this.css_buttonWidth,
                    maxHeight: "25vh",
                    overflowY: "scroll",
                    v: "hidden",
                    d: "flex",
                    fd: "column",
                    pos: "absolute",
                    l: 0
                } }, this.colorGradients.map(function (colorGradient, index) {
                // console.log("num", num, index);
                var ref = NoReact.useRef();
                _self.colorGradientOptionRefs.push(ref);
                // return this.__renderOptionButton(this.colorGradients[index % this.colorGradients.length], index, ref);
                var optionButton = _this.__renderOptionButton(colorGradient, index, ref);
                ref.current.dataset.gradientIndex = "".concat(index);
                return optionButton;
            }))));
    }; // END functionrender()
    return ColorGradientSelector;
}());
exports.ColorGradientSelector = ColorGradientSelector;
//# sourceMappingURL=ColorGradientSelector.js.map