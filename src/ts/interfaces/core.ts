/**
 * @author Ikaros Kappler
 * @modified 2021-01-10 Added the `CanvasWrapper` interface.
 * @modified 2021-01-20 Added the `UID` type.
 * @modified 2021-01-25 Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
 * @modified 2021-01-25 Fixed the `PBParams` interface (inluding DrawConfig).
 * @modified 2021-02-08 Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Added the `rotation` param to the DrawLib.ellipse(...) function.
 * @modified 2021-03-02 Added the `VEllipseSector` as to the `Drawable` type.
 * @modified 2021-03-29 Added the `draw` and `fill` params to the `preDraw` and `postDraw` function (required for full svg export support).
 * @modified 2021-03-30 Added the `endDrawCycle` function to `DrawLib`.
 * @modified 2021-05-31 Added the `drawLib.setConfiguration` function.
 * @modified 2021-05-31 Splitted the large interfaces.ts file into this one and others.
 * @modified 2021-06-21 Added `IBounds.getCenter()`.
 **/

import { Vertex } from "../Vertex";
import { Vector } from "../Vector";
import { Triangle } from "../Triangle";
import { PBImage } from "../PBImage";
import { VEllipse } from "../VEllipse";
import { VEllipseSector } from "../VEllipseSector";
import { Circle } from "../Circle";
import { CircleSector } from "../CircleSector";
import { Polygon } from "../Polygon";
import { BezierPath } from "../BezierPath";
import { Line } from "../Line";
import { PlotBoilerplate } from "../PlotBoilerplate";
import { DrawLib } from "./DrawLib";

/**
 * @classdesc Coordinates (x,y) on the plane.
 *
 * @interface
 * @class
 * @name XYCoords
 **/
export interface XYCoords {
  x: number;
  y: number;
}

/**
 * @classdesc Object with `width` and `height`.
 *
 * @interface
 * @name XYDimension
 */
export interface XYDimension {
  width: number;
  height: number;
}

/**
 * @typedef {Object} IBounds
 * @property {XYCoords} min The upper left position.
 * @property {XYCoords} max The lower right position;.
 */
export interface IBounds {
  min: XYCoords;
  max: XYCoords;
  getCenter(): Vertex;
}

/**
 * The types that can be drawn and thus added to the draw queue.
 */
export type Drawable =
  | Vertex
  | Vector
  | Triangle
  | Circle
  | CircleSector
  | PBImage
  | VEllipse
  | VEllipseSector
  | Polygon
  | BezierPath
  | Line;

/**
 * A unique identifier (UID) to tell drawables apart in a performant manner.
 */
export type UID = string;

/**
 * This is used to wrap 2d/gl/svg canvas elements together.
 */
export interface CanvasWrapper {
  setSize: (width: number, height: number) => void;
  element: HTMLCanvasElement | SVGElement;
}
/**
 * The config that's used by PB.
 */
export interface Config {
  canvas: HTMLCanvasElement | string; //  Your canvas element in the DOM (required).
  fullSize?: boolean; // If set to true the canvas will gain full window size.
  fitToParent?: boolean; // If set to true the canvas will gain the size of its parent container (overrides fullSize).
  scaleX?: number; // The initial x-zoom. Default is 1.0.
  scaleY?: number; // The initial y-zoom. Default is 1.0.
  offsetX?: number; // The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
  offsetY?: number; // The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
  rasterGrid?: boolean; // If set to true the background grid will be drawn rastered.
  rasterScaleX?: number; // Define the default horizontal raster scale (default=1.0).
  rasterScaleY?: number; // Define the default vertical raster scale (default=1.0).
  rasterAdjustFactor?: number; // The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step).
  drawOrigin?: boolean; // Draw a crosshair at (0,0).
  autoAdjustOffset?: boolean; //  When set to true then the origin of the XY plane will
  // be re-adjusted automatically (see the params
  // offsetAdjust{X,Y}Percent for more).
  offsetAdjustXPercent?: number; // The x-fallback position for the origin after
  // resizing the canvas.
  offsetAdjustYPercent?: number; // The y-fallback position for the origin after
  // resizing the canvas.
  defaultCanvasWidth?: number; //  The canvas size fallback (width) if no automatic resizing
  // is switched on.
  defaultCanvasHeight?: number; //  The canvas size fallback (height) if no automatic resizing
  // is switched on.
  canvasWidthFactor?: number; // Scaling factor (width) upon the canvas size.
  // In combination with cssScale{X,Y} this can be used to obtain
  // sub pixel resolutions for retina displays.
  canvasHeightFactor?: number; // Scaling factor (height) upon the canvas size.
  // In combination with cssScale{X,Y} this can be used to obtain
  // sub pixel resolutions for retina displays.
  cssScaleX?: number; // Visually resize the canvas (horizontally) using CSS transforms (scale).
  cssScaleY?: number; // Visually resize the canvas (vertically) using CSS transforms (scale).
  cssUniformScale?: boolean; // CSS scale x and y obtaining aspect ratio.
  backgroundColor?: string; // The backround color.
  redrawOnResize?: boolean; //  Switch auto-redrawing on resize on/off (some applications
  // might want to prevent automatic redrawing to avoid data loss from the draw buffer).
  preClear?: () => void; // A callback function that will be triggered just before the
  //    draw function clears the canvas (before anything else was drawn).
  preDraw?: (draw: DrawLib<any>, fill: DrawLib<any>) => void; // A callback function that will be triggered just before the draw
  //    function starts.
  postDraw?: (draw: DrawLib<any>, fill: DrawLib<any>) => void; // A callback function that will be triggered right after the drawing
  //   process finished.
  enableMouse?: boolean; // Indicates if the application should handle mouse events for you.
  enableTouch?: boolean; // Indicates if the application should handle touch events for you.
  enableKeys?: boolean; // Indicates if the application should handle key events for you.
  enableMouseWheel?: boolean; // Indicates if the application should handle mouse wheel events for you.
  enableGL?: boolean; // Indicates if the application should use the experimental WebGL features (not recommended).
  enableSVGExport?: boolean; // Indicates if the SVG export should be enabled (default is true).
  // Note that changes from the postDraw hook might not be visible in the export.
  saveFile?: () => void; // When called the save-file dialog will be triggered.
  setToRetina?: () => void; // When called the resolution will be set to retina.

  autoDetectRetina?: boolean; // When set to true (default) the canvas will try to use the display's pixel ratio.
}

/**
 * For initialization the constructor needs a mix of config and draw-settings.
 */
export interface PBParams extends Config {
  // , DrawConfig {
  // No additional attributes, just merge two interfaces.
}

export interface DrawSettings {
  color: string;
  lineWidth: number;
}

export interface DrawConfig {
  drawVertices: boolean;
  drawBezierHandleLines?: boolean; // Indicates if Bézier curve handles should be drawn (used for
  // editors, no required in pure visualizations).
  drawBezierHandlePoints?: boolean; // Indicates if Bézier curve handle points should be drawn.
  drawHandleLines: boolean;
  drawHandlePoints: boolean;
  drawGrid: boolean;
  bezier: {
    color: string;
    lineWidth: number;
    handleLine: DrawSettings;
  };
  polygon: DrawSettings;
  triangle: DrawSettings;
  ellipse: DrawSettings;
  ellipseSector: DrawSettings;
  circle: DrawSettings;
  circleSector: DrawSettings;
  vertex: DrawSettings;
  selectedVertex: DrawSettings;
  line: DrawSettings;
  vector: DrawSettings;
  image: DrawSettings;
}

/** This is a fix for the problem, that the constructor's "name" attribute is not
 * visible in ES6:
 *   >> The 'name' property is part of ES6 that's why you don't see it in lib.d.ts.
 *   >> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
 * ... does this collide with anything?
 */
export interface SVGSerializable {
  /**
   * Required to generate proper CSS classes and other class related IDs.
   **/
  readonly className: string;

  /**
   * Convert this vertex to SVG code.
   *
   * @method toSVGString
   * @param {object=} options - An optional set of options, like 'className'.
   * @return {string} A string representing the SVG code for this vertex.
   * @instance
   * @memberof Vertex
   **/
  toSVGString: (options: { className?: string }) => string;
}

/**
 * A type for SVG &lt;path d="..." /> params.
 * Example: [ 'A':string, radiusx:number, radiusy:number, rotation:number, largeArcFlag=1|0, sweepFlag=1|0, endx:number, endy:number ]
 */
export type SVGPathParams = Array<string | number>;

export interface IHooks {
  saveFile: (pb: PlotBoilerplate) => void;
}

/**
 * A wrapper class/interface for draggable items (mostly vertices).
 * @private
 **/
export interface IDraggable {
  item: any;
  typeName: string;
  vindex: number; // Vertex-index
  pindex: number; // Point-index (on path)
  pid: number; // Point-ID (on curve)
  cindex: number; // Curve-index
  isVertex(): boolean;
  setVIndex(vindex: number): IDraggable;
}
