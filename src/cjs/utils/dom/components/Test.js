"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2025-06-25
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
var NoReact = require("noreact");
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
exports.Test = Test;
//# sourceMappingURL=Test.js.map