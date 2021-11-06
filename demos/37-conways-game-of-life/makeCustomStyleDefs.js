/**
 * The SVG draw library can be supplied with additional CSS styles which are defined here.
 *
 * The styles depend on the settings in the config.
 *
 * @author  Ikaros Kappler
 * @date    2021-10-06
 * @version 1.0.0
 */

function makeCustomStyleDefs(config, innerSquareSize) {
  var styleDefs = new Map();
  // styleDefs.set("rect", "fill: black;");
  styleDefs.set("rect.background", "fill: #000000;");
  // styleDefs.set("rect.b-none-none-none-none", "stroke-color: none;");
  // styleDefs.set(
  //   "rect.b-top-none-none-none",
  //   `stroke: : ${config.wallColor}; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h * 2 + innerSquareSize.w};`
  // );
  // styleDefs.set(
  //   "rect.b-top-none-bottom-none",
  //   `stroke: ${config.wallColor}; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h},${innerSquareSize.w},${innerSquareSize.h};`
  // );
  // styleDefs.set(
  //   "rect.b-top-none-none-left",
  //   `stroke: ${config.wallColor}; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h + innerSquareSize.w},${
  //     innerSquareSize.h
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-top-none-bottom-left",
  //   `stroke: ${config.deadEndWallColor}; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h},${
  //     innerSquareSize.w + innerSquareSize.h
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-top-right-none-none",
  //   `stroke: ${config.wallColor}; stroke-dasharray: ${innerSquareSize.w + innerSquareSize.h},${
  //     innerSquareSize.h + innerSquareSize.w
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-top-right-bottom-none",
  //   `stroke: ${config.deadEndWallColor}; stroke-dasharray: ${innerSquareSize.w * 2 + innerSquareSize.h},${innerSquareSize.h};`
  // );
  // styleDefs.set(
  //   "rect.b-top-right-none-left",
  //   `stroke: ${config.deadEndWallColor}; stroke-dasharray: ${innerSquareSize.w + innerSquareSize.h},${innerSquareSize.w},${
  //     innerSquareSize.h
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-top-right-bottom-left",
  //   `stroke: ${config.deadEndWallColor}; stroke-dasharray: ${innerSquareSize.w * 2 + innerSquareSize.h * 2};`
  // );
  // styleDefs.set(
  //   "rect.b-none-right-none-none",
  //   `stroke: ${config.wallColor}; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h},${
  //     innerSquareSize.w + innerSquareSize.w
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-none-right-bottom-none",
  //   `stroke: ${config.wallColor}; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h + innerSquareSize.w},${
  //     innerSquareSize.h
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-none-right-none-left",
  //   `stroke: ${config.wallColor}; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h},${innerSquareSize.w},${innerSquareSize.h};`
  // );
  // styleDefs.set(
  //   "rect.b-none-right-bottom-left",
  //   `stroke: ${config.deadEndWallColor}; stroke-dasharray: 0,${innerSquareSize.w},${
  //     innerSquareSize.h + innerSquareSize.w + innerSquareSize.h
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-none-none-bottom-left",
  //   `stroke: ${config.wallColor}; stroke-dasharray: 0,${innerSquareSize.w + innerSquareSize.h},${
  //     innerSquareSize.h + innerSquareSize.w
  //   };`
  // );
  // styleDefs.set(
  //   "rect.b-none-none-none-left",
  //   `stroke: ${config.deadEndWallColor}; stroke-dasharray: 0,${innerSquareSize.w * 2 + innerSquareSize.h},${innerSquareSize.h};`
  // );
  // styleDefs.set(
  //   "rect.b-none-none-bottom-none",
  //   `stroke: ${config.wallColor}; stroke-dasharray: 0,${innerSquareSize.w + innerSquareSize.h},${innerSquareSize.w},${
  //     innerSquareSize.h
  //   };`
  // );
  // styleDefs.set("line.trace", `stroke-color: ${config.traceColor};`);

  return styleDefs;
}
