/**
 * Creates a DIV element covering the given canvas by 100% in both dimensions.
 *
 * @author Ikaros Kappler
 * @date 2024-07-19
 * @version 1.0.0
 */

(function (_context) {
  /**
   * Creates a DIV element covering the given canvas by 100% in both dimensions.
   *
   * @param {HTMLCanvasElement|SVGElement} canvas
   * @returns HTMLDivElement
   */
  _context.createCanvasCover = function (canvas, options) {
    var canvas = document.getElementById("my-canvas");
    var canvasParent = canvas.parentElement;
    var effectsNode = document.createElement("div");
    effectsNode.style["position"] = "absolute";
    effectsNode.style["left"] = "0px";
    effectsNode.style["top"] = "0px";
    effectsNode.style["width"] = "100%";
    effectsNode.style["height"] = "100%";
    // This is very important so the backdrop-filter element does not block input events.
    effectsNode.style["pointer-events"] = "none";
    canvasParent.appendChild(effectsNode);
    return effectsNode;
  };
})(globalThis);
