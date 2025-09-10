/**
 * @author  Ikaros Kappler
 * @date    2021-11-07
 * @modified 2023-09-25 Ported to Typescript and added system darkmode detection.
 * @version 1.1.0
 *
 * @param {Record<string,string>} GUP
 * @returns {boolean}
 */
export const detectDarkMode = (GUP) => {
    console.log("detectDarkMode", detectDarkMode);
    var isDarkmode = false;
    // Respect overrides
    if (typeof GUP !== "undefined" && GUP.hasOwnProperty("darkmode") && GUP["darkmode"]) {
        // const overrideValue = PlotBoilerplate.utils.fetch.bool(GUP, "darkmode", null);
        const overrideValue = !!JSON.parse(GUP["darkmode"]);
        if (overrideValue !== null) {
            isDarkmode = overrideValue;
        }
    }
    else if (globalThis.matchMedia && globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
        // dark mode by system
        isDarkmode = true;
    }
    else {
        // else: dark mode by daytime
        const hours = new Date().getHours();
        const isDayTime = hours > 6 && hours < 18;
        isDarkmode = !isDayTime;
    }
    console.log("Adding darkmode to <body>", isDarkmode);
    if (isDarkmode) {
        // Add darkmode class to <body> tag
        document.body.classList.add("darkmode");
    }
    return isDarkmode;
};
//# sourceMappingURL=detectDarkMode.js.map