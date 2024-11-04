/**
 * @requires lil-gui
 *
 * @author   Ikaros Kappler
 * @date     2021-12-13
 * @modified 2022-01-10
 * @modified 2024-06-25 Ported to typescript and moved to utils/dom (was located inside demos before).
 * @modified 2024-10-02 Added a transition time.
 * @version  1.1.1
 */
/**
 * @param {GUI} gui - The GUI (compatible with dat.gui and lil-gui).
 * @param {boolean} guiDoubleSize - True or false.
 * @param {Record<string,string>} cssProps - The CSS props to use.
 */
const applyGuiSize = (gui, guiDoubleSize, cssProps) => {
    if (cssProps && cssProps.hasOwnProperty("transformOrigin")) {
        gui.domElement.style["transform-origin"] = cssProps["transformOrigin"];
    }
    else {
        gui.domElement.style["transform-origin"] = "100% 0%";
    }
    const transform = cssProps && cssProps.hasOwnProperty("transform") ? cssProps["transform"] + " " : "";
    console.log("transform", transform);
    if (guiDoubleSize) {
        gui.domElement.style["transform"] = transform + "scale(2.0)";
    }
    else {
        gui.domElement.style["transform"] = transform + "scale(1.0)";
    }
};
export const guiSizeToggler = (gui, config, cssProps) => {
    gui.domElement.style["transition"] = "transform 0.5s";
    return {
        update: function () {
            applyGuiSize(gui, Boolean(config.guiDoubleSize), cssProps);
        }
    };
};
//# sourceMappingURL=guiSizeToggler.js.map