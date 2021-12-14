/**
 * @author  Ikaros Kappler
 * @date    2021-12-13
 * @version 1.0.0
 */

/**
 *
 * @param {boolean} guiDoubleSize
 */
var toggleGuiSize = function (gui, guiDoubleSize) {
  gui.domElement.style["transform-origin"] = "100% 0%";
  if (guiDoubleSize) {
    gui.domElement.style["transform"] = "scale(2.0)";
  } else {
    gui.domElement.style["transform"] = "scale(1.0)";
  }
};
