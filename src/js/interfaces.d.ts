interface XYCoords {
    x: number;
    y: number;
}
interface XYDimension {
    width: number;
    height: number;
}
/**
 * @typedef {Object} Bounds
 * @property {Vertex} min The upper left position.
 * @property {Vertex} max The lower right position;.
 */
interface Bounds {
    min: XYCoords;
    max: XYCoords;
}
declare type Drawable = Vertex | Vector | Triangle | PBImage | VEllipse | Polygon | BezierPath | Line;
interface Config {
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
interface PBParams extends Config, DrawSettings {
}
interface DrawSettings {
    color: string;
    lineWidth: number;
}
interface DrawConfig {
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
    vertex: DrawSettings;
    line: DrawSettings;
    vector: DrawSettings;
    image: DrawSettings;
}
interface Function {
    readonly name: string;
}
interface SVGSerializable {
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
interface IHooks {
    saveFile: () => void;
}
