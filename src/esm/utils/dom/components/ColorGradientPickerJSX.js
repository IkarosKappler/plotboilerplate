/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
import * as NoReact from "noreact";
export const Test = (name) => {
    const click1 = () => {
        console.log("First clicked");
    };
    const click2 = () => {
        console.log("Second clicked");
    };
    const mouseEnter = (event) => {
        event.target.style["background-color"] = "grey";
    };
    const mouseOut = (event) => {
        event.target.style["background-color"] = "DeepSkyBlue";
    };
    return (NoReact.createElement("div", { className: "NoReact-main" },
        "Hello ",
        name,
        NoReact.createElement("div", { className: "NoReact-child-1", onClick: click1 }, "Hello Nested"),
        NoReact.createElement("div", { className: "NoReact-child-2", onClick: click2, onMouseEnter: mouseEnter, onMouseOut: mouseOut, style: { backgroundColor: "yellow" } }, "Hello Nested 2")));
};
//# sourceMappingURL=ColorGradientPickerJSX.js.map