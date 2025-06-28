/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */
import * as NoReact from "noreact";
export class ColorGradientPicker {
    /**
     * The constructor.
     *
     * Pass a container ID or nothing – in the latter case the constructor will create
     * a new DIV element.
     *
     * @param {string?} containerID
     */
    constructor(containerID) {
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.indicatorWidth_num = 1.0;
        this.indicatorWidth = "1em";
        this.indicatorWidth_half = "0.5em";
        this.indicatorHeight = "1em";
        this.COLORSET = ["red", "orange", "yellow", "green", "blue", "purple"];
        if (containerID) {
            const cont = document.getElementById(containerID);
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
    render(name) {
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
        console.log("Rendering ...", NoReact);
        // return (
        //   <div className="NoReact-main">
        //     Hello {name}
        //     <div className="NoReact-child-1" onClick={click1}>
        //       Hello Nested
        //     </div>
        //     <div
        //       className="NoReact-child-2"
        //       onClick={click2}
        //       onMouseEnter={mouseEnter}
        //       onMouseOut={mouseOut}
        //       style={{ backgroundColor: "yellow" }}
        //     >
        //       Hello Nested 2
        //     </div>
        //   </div>
        // );
        return (NoReact.createElement("div", { id: "container", style: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "32px",
                position: "relative",
                background: "linear-gradient(90deg, red 0%, orange 20%, yellow 40%, green 60%, blue 80%, purple 100%)"
            } },
            NoReact.createElement("input", { id: "rage-slider-42520-0", type: "range", min: "0", max: "100", value: "0", style: "position: absolute; left: 0px; top: 0px; width: 100%;", "data-range-slider-index": "0", "data-color-value": "red" }),
            NoReact.createElement("input", { id: "rage-slider-42520-1", type: "range", min: "0", max: "100", value: "20", style: "position: absolute; left: 0px; top: 0px; width: 100%;", "data-range-slider-index": "1", "data-color-value": "orange" }),
            NoReact.createElement("input", { id: "rage-slider-42520-2", type: "range", min: "0", max: "100", value: "40", style: "position: absolute; left: 0px; top: 0px; width: 100%;", "data-range-slider-index": "2", "data-color-value": "yellow" }),
            NoReact.createElement("input", { id: "rage-slider-42520-3", type: "range", min: "0", max: "100", value: "60", style: "position: absolute; left: 0px; top: 0px; width: 100%;", "data-range-slider-index": "3", "data-color-value": "green" }),
            NoReact.createElement("input", { id: "rage-slider-42520-4", type: "range", min: "0", max: "100", value: "80", style: "position: absolute; left: 0px; top: 0px; width: 100%;", "data-range-slider-index": "4", "data-color-value": "blue" }),
            NoReact.createElement("input", { id: "rage-slider-42520-5", type: "range", min: "0", max: "100", value: "100", style: "position: absolute; left: 0px; top: 0px; width: 100%;", "data-range-slider-index": "5", "data-color-value": "purple" }),
            NoReact.createElement("div", { style: "width: 100%;" },
                NoReact.createElement("button", { style: "position: absolute; bottom: 0px; left: 0%; background-color: grey; border-radius: 3px; border: 1px solid grey; width: 1em; height: 1em; transform: translate(-50%, 100%);" })),
            NoReact.createElement("input", { type: "color", style: "visibility: hidden;", "data-active-slider-index": "" })));
    }
}
const Test = (name) => {
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