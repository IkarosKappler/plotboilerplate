/**
 * @author   Ikaros Kappler
 * @date     2021-12-13
 * @modified 2022-01-10
 * @version  1.0.1
 */

var guiSizeToggler = function (gui, config) {
  return {
    // toggle: function () {
    //   config.guiDoubleSize = !config.guiDoubleSize;
    //   applyGuiSize(gui, config.guiDoubleSize);
    // },
    update: function () {
      applyGuiSize(gui, config.guiDoubleSize);
    }
  };
};

/**
 *
 * @param {boolean} guiDoubleSize
 */
var applyGuiSize = function (gui, guiDoubleSize) {
  gui.domElement.style["transform-origin"] = "100% 0%";
  if (guiDoubleSize) {
    gui.domElement.style["transform"] = "scale(2.0)";
  } else {
    gui.domElement.style["transform"] = "scale(1.0)";
  }
};
