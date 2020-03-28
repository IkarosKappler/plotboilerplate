
interface XYCoords {
    x : number;
    y : number;
}

interface Bounds {
    min : XYCoords;
    max : XYCoords;
}

interface Config {
    canvas : HTMLElement;         //  Your canvas element in the DOM (required).
    fullSize?: boolean;           // If set to true the canvas will gain full window size.
    fitToParent?: boolean;        // If set to true the canvas will gain the size of its parent container (overrides fullSize).
    scaleX?:number; // The initial x-zoom. Default is 1.0.
    scaleY?:number; // The initial y-zoom. Default is 1.0.
    offsetX?: number; // The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
    offsetY?: number; // The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
    rasterGrid:? boolean; // If set to true the background grid will be drawn rastered.
    rasterAdjustFactor?: boolean; // The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step).
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
    redrawOnResize?; boolean; //  Switch auto-redrawing on resize on/off (some applications
                              // might want to prevent automatic redrawing to avoid data loss from the draw buffer).
    drawBezierHandleLines?: boolean; // Indicates if Bézier curve handles should be drawn (used for
                              // editors, no required in pure visualizations).
    drawBezierHandlePoints?: boolean; // Indicates if Bézier curve handle points should be drawn.
    preClear?: ()=>void; // A callback function that will be triggered just before the
                           //    draw function clears the canvas (before anything else was drawn).
    preDraw?: ()=>void; // A callback function that will be triggered just before the draw
                          //    function starts.
    postDraw?: ()=>void; // A callback function that will be triggered right after the drawing
                           //   process finished.
    enableMouse?: boolean; // Indicates if the application should handle mouse events for you.
    enableTouch?: boolean; // Indicates if the application should handle touch events for you.
    enableKeys?: boolean; // Indicates if the application should handle key events for you.
    enableMouseWheel?: boolean; // Indicates if the application should handle mouse wheel events for you.
    enableGL?: boolean; // Indicates if the application should use the experimental WebGL features (not recommended).
    enableSVGExport?: boolean; // Indicates if the SVG export should be enabled (default is true). 
                              // Note that changes from the postDraw hook might not be visible in the export.
}

interface DrawSettings {
    color : string;
    lineWidth : number;
}

interface DrawConfig {
    drawVertices : boolean; 
    bezier : {
	color : string;
	lineWidth : number;
	handleLine : DrawSettings;
    },
    polygon : DrawSettings;
    triangle : DrawSettings;
    ellipse : DrawSettings;
    vertex : DrawSettings;
    line : DrawSettings;
    vector : DrawSettings;
    image : DrawSettings;
}
