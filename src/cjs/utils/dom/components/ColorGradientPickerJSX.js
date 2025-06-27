"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradientPicker = void 0;
var NoReact = require("noreact");
var ColorGradientPicker = /** @class */ (function () {
    /**
     * The constructor.
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID
     */
    function ColorGradientPicker(containerID) {
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.indicatorWidth_num = 1.0;
        this.indicatorWidth = "1em";
        this.indicatorWidth_half = "0.5em";
        this.indicatorHeight = "1em";
        this.COLORSET = ["red", "orange", "yellow", "green", "blue", "purple"];
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
        // console.log("created", this.container);
        this.baseID = Math.floor(Math.random() * 65535);
        // this.__init();
        // this.__updateBackgroundGradient();
        this.container.append(this.render("test"));
    } // END constructor
    /**
     * Init the container contents.
     *
     * @private
     */
    ColorGradientPicker.prototype.render = function (name) {
        var click1 = function () {
            console.log("First clicked");
        };
        var click2 = function () {
            console.log("Second clicked");
        };
        var mouseEnter = function (event) {
            event.target.style["background-color"] = "grey";
        };
        var mouseOut = function (event) {
            event.target.style["background-color"] = "DeepSkyBlue";
        };
        console.log("Rendering ...", NoReact);
        return (NoReact.createElement("div", { className: "NoReact-main" },
            "Hello ",
            name,
            NoReact.createElement("div", { className: "NoReact-child-1", onClick: click1 }, "Hello Nested"),
            NoReact.createElement("div", { className: "NoReact-child-2", onClick: click2, onMouseEnter: mouseEnter, onMouseOut: mouseOut, style: { backgroundColor: "yellow" } }, "Hello Nested 2")));
    };
    return ColorGradientPicker;
}());
exports.ColorGradientPicker = ColorGradientPicker;
var Test = function (name) {
    var click1 = function () {
        console.log("First clicked");
    };
    var click2 = function () {
        console.log("Second clicked");
    };
    var mouseEnter = function (event) {
        event.target.style["background-color"] = "grey";
    };
    var mouseOut = function (event) {
        event.target.style["background-color"] = "DeepSkyBlue";
    };
    return (NoReact.createElement("div", { className: "NoReact-main" },
        "Hello ",
        name,
        NoReact.createElement("div", { className: "NoReact-child-1", onClick: click1 }, "Hello Nested"),
        NoReact.createElement("div", { className: "NoReact-child-2", onClick: click2, onMouseEnter: mouseEnter, onMouseOut: mouseOut, style: { backgroundColor: "yellow" } }, "Hello Nested 2")));
};
//# sourceMappingURL=ColorGradientPickerJSX.js.map