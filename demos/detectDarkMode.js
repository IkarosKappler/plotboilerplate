/**
 * @author  Ikaros Kappler
 * @date    2021-11-07
 * @version 1.0.0
 *
 * @param {Record<string,string>} GUP
 * @returns {boolean}
 */

function detectDarkMode(GUP) {
  console.warn("[detectDarkMode] This function is deprecated. Please use ./cjs/utils/detectDarkMode.js instead.");
  // Respect overrides
  if (typeof GUP !== "undefined" && GUP.hasOwnProperty("darkmode") && GUP["darkmode"]) {
    var overrideValue = GUP["darkmode"];
    if (overrideValue === "0" || overrideValue.toLowerCase() === "false") {
      return false;
    } else if (overrideValue === "1" || overrideValue.toLowerCase() === "true") {
      return true;
    }
  }
  if (globalThis.matchMedia && globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
    // dark mode by system
    return true;
  }
  // else: dark mode by daytime
  var hours = new Date().getHours();
  var isDayTime = hours > 6 && hours < 18;
  return !isDayTime;
}
