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
 * @modified 2021-11-16 Added `text` options to the `DrawConfig`.
 * @modified 2022-08-01 Added `title` param to the `PBParams` interface.
 * @modified 2022-10-25 Added `origin` param to the `DrawConfig` interface.
 * @modified 2022-11-23 Added `drawRaster` to the `Config` interface.
 * @modified 2023-02-10 All non-function attributes of the `Config` interface are now mandatory.
 * @modified 2023-09-29 Added the `randomPoint(...)` function declaration to the IBounds interface.
 * @modified 2024-08-25 Added the `CSSBackdropFilterParams` params to the global params (all optional).
 * @modified 2025-03-29 Added interface `Intersectable`.
 * @modified 2025-04-16 Added interface `IBounded`.
 * @modified 2025-05-07 Added callback `onContentChanged` to PB to track if the drawable content changed.
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
import { PBText } from "../PBText";
import { CSSBackdropFilterParams } from "./externals";
import { VertTuple } from "../VertTuple";
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
    /**
     * Generate a random point inside this bounds object. Safe areas at the border to avoid
     * included.
     *
     * @method randomPoint
     * @param {horizontalSafeArea} - (optional) The horizonal (left and right) safe area. No vertex will be created here. Can be used as percent in (0.0 ... 0.1) interval.
     * @param {verticalSafeArea} - (optional) The vertical (top and bottom) safe area. No vertex will be created here. Can be used as percent in (0.0 ... 0.1) interval
     * @returns {Vertex} A pseudo random point inside these bounds.
     */
    randomPoint: (horizontalSafeArea?: number, verticalSafeArea?: number) => Vertex;
}
/**
 * The types that can be drawn and thus added to the draw queue.
 */
export type Drawable = Vertex | Vector | Triangle | Circle | CircleSector | PBImage | PBText | VEllipse | VEllipseSector | Polygon | BezierPath | Line;
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
 * The interface for PB change events.
 */
export interface IPBChangeEvent {
    type: "DRAWABLES_ADDED" | "DRAWABLES_REMOVED";
    addedDrawables: Array<Drawable>;
    removedDrawables: Array<Drawable>;
}
export type PBContentChangeListener = (event: IPBChangeEvent) => void;
/**
 * The config that's used by PB.
 */
export interface Config extends Record<string, boolean | number | string | Function | HTMLCanvasElement | SVGElement | undefined>, Pick<CSSBackdropFilterParams, "isBackdropFiltersEnabled"> {
    canvas: HTMLCanvasElement | SVGElement | string;
    fullSize: boolean;
    fitToParent: boolean;
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
    rasterGrid: boolean;
    drawRaster: boolean;
    rasterScaleX: number;
    rasterScaleY: number;
    rasterAdjustFactor: number;
    drawOrigin: boolean;
    autoAdjustOffset: boolean;
    offsetAdjustXPercent: number;
    offsetAdjustYPercent: number;
    defaultCanvasWidth: number;
    defaultCanvasHeight: number;
    canvasWidthFactor: number;
    canvasHeightFactor: number;
    cssScaleX: number;
    cssScaleY: number;
    cssUniformScale: boolean;
    backgroundColor: string;
    redrawOnResize: boolean;
    preClear?: () => void;
    preDraw?: (draw: DrawLib<any>, fill: DrawLib<any>) => void;
    postDraw?: (draw: DrawLib<any>, fill: DrawLib<any>) => void;
    enableMouse: boolean;
    enableTouch: boolean;
    enableKeys: boolean;
    enableMouseWheel: boolean;
    enableZoom: boolean;
    enablePan: boolean;
    enableGL?: boolean;
    enableSVGExport: boolean;
    saveFile?: () => void;
    setToRetina?: () => void;
    autoDetectRetina: boolean;
}
/**
 * For initialization the constructor needs a mix of config and draw-settings.
 */
export interface PBParams extends Config, CSSBackdropFilterParams {
    title?: string;
}
export interface DrawSettings {
    color: string;
    lineWidth: number;
    fill?: boolean;
}
export interface DrawConfig {
    drawVertices: boolean;
    drawBezierHandleLines?: boolean;
    drawBezierHandlePoints?: boolean;
    drawHandleLines: boolean;
    drawHandlePoints: boolean;
    drawGrid: boolean;
    drawRaster: boolean;
    bezier: {
        color: string;
        lineWidth: number;
        handleLine: DrawSettings;
        pathVertex: DrawSettings;
        controlVertex: DrawSettings;
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
    text: {
        color: string;
        lineWidth: number;
        fill?: boolean;
        anchor?: boolean;
    };
    origin: {
        color: string;
    };
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
    vindex: number;
    pindex: number;
    pid: number;
    cindex: number;
    isVertex(): boolean;
    setVIndex(vindex: number): IDraggable;
}
/**
 * Shapes should implement this interface if they support intersection calculation.
 */
export interface Intersectable {
    /**
     * Get all line intersections with this polygon.
     *
     * This method returns all intersections (as vertices) with this shape. The returned array of vertices is in no specific order.
     *
     * See demo `47-closest-vector-projection-on-polygon` for how it works.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - (default=false) If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections within this shape's bounds.
     */
    lineIntersections(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vertex>;
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param  {boolean} inVectorBoundsOnly - (default=false) If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vector>} - An array of all intersection tangents within this shape's bounds.
     */
    lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vector>;
}
export interface IBounded {
    /**
     * Get the bounding box (bounds) of this shape.
     *
     * @method getBounds
     * @return {Bounds} The rectangular bounds of this shape.
     **/
    getBounds(): IBounds;
}
export interface IShapeInteractionHelper {
    /**
     * Let this shape helper draw it's handle lines. It's up to the helper what they look like.
     * @param {DrawLib<any>} draw - The draw library to use.
     * @param {DrawLib<any>} fill - The fill library to use.
     */
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>): void;
    /**
     * Destroys this helper. This means that all listeners get released and this helper
     * will not receive or handle any events.
     */
    destroy(): void;
}
