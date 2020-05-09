import { Vertex } from "./Vertex";
import { Vector } from "./Vector";
import { Triangle } from "./Triangle";
import { PBImage } from "./PBImage";
import { VEllipse } from "./VEllipse";
import { Circle } from "./Circle";
import { Polygon } from "./Polygon";
import { BezierPath } from "./BezierPath";
import { Line } from "./Line";
import { PlotBoilerplate } from "./PlotBoilerplate";
export interface XYCoords {
    x: number;
    y: number;
}
export interface XYDimension {
    width: number;
    height: number;
}
/**
 * @typedef {Object} Bounds
 * @property {Vertex} min The upper left position.
 * @property {Vertex} max The lower right position;.
 */
export interface Bounds {
    min: XYCoords;
    max: XYCoords;
}
export declare type Drawable = Vertex | Vector | Triangle | Circle | PBImage | VEllipse | Polygon | BezierPath | Line;
export interface Config {
    canvas: HTMLCanvasElement;
    fullSize?: boolean;
    fitToParent?: boolean;
    scaleX?: number;
    scaleY?: number;
    offsetX?: number;
    offsetY?: number;
    rasterGrid?: boolean;
    rasterAdjustFactor?: number;
    drawOrigin?: boolean;
    autoAdjustOffset?: boolean;
    offsetAdjustXPercent?: number;
    offsetAdjustYPercent?: number;
    defaultCanvasWidth?: number;
    defaultCanvasHeight?: number;
    canvasWidthFactor?: number;
    canvasHeightFactor?: number;
    cssScaleX?: number;
    cssScaleY?: number;
    cssUniformScale?: boolean;
    backgroundColor?: string;
    redrawOnResize?: boolean;
    preClear?: () => void;
    preDraw?: () => void;
    postDraw?: () => void;
    enableMouse?: boolean;
    enableTouch?: boolean;
    enableKeys?: boolean;
    enableMouseWheel?: boolean;
    enableGL?: boolean;
    enableSVGExport?: boolean;
    saveFile?: () => void;
    setToRetina?: () => void;
}
export interface PBParams extends Config, DrawSettings {
}
export interface DrawSettings {
    color: string;
    lineWidth: number;
}
export interface DrawConfig {
    drawVertices: boolean;
    drawBezierHandleLines?: boolean;
    drawBezierHandlePoints?: boolean;
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
    circle: DrawSettings;
    vertex: DrawSettings;
    line: DrawSettings;
    vector: DrawSettings;
    image: DrawSettings;
}
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
    toSVGString: (options: {
        className?: string;
    }) => string;
}
export interface IHooks {
    saveFile: (pb: PlotBoilerplate) => void;
}
