/**
 * Draws elements into an SVG node.
 *
 * Note that this library uses buffers and draw cycles. To draw onto an SVG canvas, do this:
 *   const drawLib = new drawutilssvg( svgNode, ... );
 *   const fillLib = drawLib.copyInstance(true);
 *   // Begin draw cycle
 *   drawLib.beginDrawCycle(time);
 *   // ... draw or fill your stuff ...
 *   drawLib.endDrawCycle(time); // Here the elements become visible
 *
 * @author   Ikaros Kappler
 * @date     2021-01-03
 * @modified 2021-01-24 Fixed the `fillShapes` attribute in the copyInstance function.
 * @modified 2021-01-26 Changed the `isPrimary` (default true) attribute to `isSecondary` (default false).
 * @modified 2021-02-03 Added the static `createSvg` function.
 * @modified 2021-02-03 Fixed the currentId='background' bug on the clear() function.
 * @modified 2021-02-03 Fixed CSSProperty `stroke-width` (was line-width before, which is wrong).
 * @modified 2021-02-03 Added the static `HEAD_XML` attribute.
 * @modified 2021-02-19 Added the static helper function `transformPathData(...)` for svg path transformations (scale and translate).
 * @modified 2021-02-22 Added the static helper function `copyPathData(...)`.
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Fixed a bug in the `clear` function (curClassName was not cleared).
 * @modified 2021-03-29 Fixed a bug in the `text` function (second y param was wrong, used x here).
 * @modified 2021-03-29 Moved this file from `src/ts/utils/helpers/` to `src/ts/`.
 * @modified 2021-03-31 Added 'ellipseSector' the the class names.
 * @modified 2021-03-31 Implemented buffering using a buffer <g> node and the beginDrawCycle and endDrawCycle methods.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2021-11-15 Adding more parameters tot the `text()` function: fontSize, textAlign, fontFamily, lineHeight.
 * @modified 2021-11-19 Fixing the `label(text,x,y)` position.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-26 Added the private `nodeDefs` and `bufferedNodeDefs` attributes.
 * @modified 2022-03-26 Added the `texturedPoly` function to draw textures polygons.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2022-11-10 Tweaking some type issues.
 * @modified 2023-02-04 Fixed a typo in the CSS classname for cubic Bézier paths: cubicBezier (was cubierBezier).
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @modified 2023-09-29 Added initialization checks for null parameters.
 * @modified 2023-09-29 Added a missing implementation to the `drawurilssvg.do(XYCoords,string)` function. Didn't draw anything.
 * @modified 2023-09-29 Downgrading all `Vertex` param type to the more generic `XYCoords` type in these render functions: line, arrow, texturedPoly, cubicBezier, cubicBezierPath, handle, handleLine, dot, point, circle, circleArc, ellipse, grid, raster.
 * @modified 2023-09-29 Added the `headLength` parameter to the 'DrawLib.arrow()` function.
 * @modified 2023-09-29 Added the `arrowHead(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `cubicBezierArrow(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-10-04 Adding `strokeOptions` param to these draw function: line, arrow, cubicBezierArrow, cubicBezier, cubicBezierPath, circle, circleArc, ellipse, square, rect, polygon, polyline.
 *
 * @version  1.6.7
 **/

import { CircleSector } from "./CircleSector";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import {
  DrawConfig,
  DrawLib,
  DrawSettings,
  XYCoords,
  XYDimension,
  SVGPathParams,
  UID,
  DrawLibConfiguration,
  FontStyle,
  FontWeight,
  StrokeOptions
} from "./interfaces";
import { Bounds } from "./Bounds";
import { UIDGenerator } from "./UIDGenerator";
import { Vector } from "./Vector";

const RAD_TO_DEG = 180 / Math.PI;

/**
 * @classdesc A helper class for basic SVG drawing operations. This class should
 * be compatible to the default 'draw' class.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
export class drawutilssvg implements DrawLib<void | SVGElement> {
  static HEAD_XML = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" ',
    '         "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">',
    ""
  ].join("\n");

  /**
   * @member {SVGGElement}
   * @memberof drawutilssvg
   * @instance
   */
  svgNode: SVGElement;

  /**
   * The root elements container <g> in the svgNode.
   */
  private gNode: SVGGElement;

  /**
   * To avoid flickering the lib draws on a buffer, which is replacing the old <g> node at the end of the draw cycle.
   * @member {SVGGelement}
   * @memberof drawutilssvg
   * @instance
   * @private
   */
  private bufferGNode: SVGGElement;

  /**
   * A style node of type `<style>`.
   * @member {SVGGelement}
   * @memberof drawutilssvg
   * @instance
   * @private
   */
  private nodeStyle: SVGStyleElement;

  /**
   * A style node of type `<defs>`.
   * @member {SVGGelement}
   * @memberof drawutilssvg
   * @instance
   * @private
   */
  private nodeDefs: SVGDefsElement;

  /**
   * The buffered nodeDefs.
   * @member {SVGGelement}
   * @memberof drawutilssvg
   * @instance
   * @private
   */
  private bufferedNodeDefs: SVGDefsElement;

  /**
   * @member {Vertex}
   * @memberof drawutilssvg
   * @instance
   */
  scale: Vertex;

  /**
   * @member {Vertex}
   * @memberof drawutilssvg
   * @instance
   */
  offset: Vertex;

  /**
   * @member {boolean}
   * @memberof drawutilssvg
   * @instance
   */
  fillShapes: boolean;

  /**
   * @member {XYDimension}
   * @memberof drawutilssvg
   * @instance
   */
  canvasSize: XYDimension;

  /**
   * The current drawlib configuration to be used for all upcoming draw operations.
   * @member {DrawLibConfiguration}
   * @memberof drawutilssvg
   * @instance
   */
  drawlibConfiguration: DrawLibConfiguration;

  /**
   * The current drawable-ID. This can be any unique ID identifying the following drawn element.
   *
   * @member {UID|null}
   * @memberof drawutilssvg
   * @instance
   */
  private curId: UID | null;

  /**
   * The current drawable-classname.
   */
  private curClassName: string | null;

  /**
   * The SVG element cache. On clear() all elements are kept for possible re-use on next draw cycle.
   */
  private cache: Map<UID, SVGElement>;

  /**
   * Indicates if this library is the primary or seconday instance (draw an fill share the same DOM nodes).
   */
  private isSecondary: boolean;

  /**
   * The constructor.
   *
   * @constructor
   * @name drawutilssvg
   * @param {SVGElement} svgNode - The SVG node to use.
   * @param {XYCoords} offset - The draw offset to use.
   * @param {XYCoords} scale - The scale factors to use.
   * @param {XYDimension} canvasSize - The initial canvas size (use setSize to change).
   * @param {boolean} fillShapes - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
   * @param {DrawConfig} drawConfig - The default draw config to use for CSS fallback styles.
   * @param {boolean=} isSecondary - (optional) Indicates if this is the primary or secondary instance. Only primary instances manage child nodes.
   * @param {SVGGElement=} gNode - (optional) Primary and seconday instances share the same &lt;g> node.
   **/
  constructor(
    svgNode: SVGElement,
    offset: XYCoords,
    scale: XYCoords,
    canvasSize: XYDimension,
    fillShapes: boolean,
    drawConfig: DrawConfig,
    isSecondary?: boolean,
    gNode?: SVGGElement,
    bufferGNode?: SVGGElement,
    nodeDefs?: SVGDefsElement,
    bufferNodeDefs?: SVGDefsElement
  ) {
    this.svgNode = svgNode;
    this.offset = new Vertex(0, 0).set(offset);
    this.scale = new Vertex(1, 1).set(scale);
    this.fillShapes = fillShapes;
    this.isSecondary = Boolean(isSecondary);

    this.drawlibConfiguration = {} as DrawLibConfiguration;
    this.cache = new Map<UID, SVGElement>();
    this.setSize(canvasSize);
    if (isSecondary) {
      if (!gNode || !bufferGNode || !nodeDefs || !bufferNodeDefs) {
        throw "Cannot create secondary svg draw lib with undefinde gNode|bufferGNode|nodeDefs|bufferNodeDefs.";
      }
      this.gNode = gNode;
      this.bufferGNode = bufferGNode;
      this.nodeDefs = nodeDefs;
      this.bufferedNodeDefs = bufferNodeDefs;
    } else {
      this.addStyleDefs(drawConfig);
      this.addDefsNode();
      this.gNode = this.createSVGNode("g") as SVGGElement;
      this.bufferGNode = this.createSVGNode("g") as SVGGElement;
      this.svgNode.appendChild(this.gNode);
    }
  }

  /**
   * Adds a default style defintion based on the passed DrawConfig.
   * Twaek the draw config to change default colors or line thicknesses.
   *
   * @param {DrawConfig} drawConfig
   */
  private addStyleDefs(drawConfig: DrawConfig) {
    this.nodeStyle = this.createSVGNode("style") as SVGStyleElement;
    this.svgNode.appendChild(this.nodeStyle);

    // Which default styles to add? -> All from the DrawConfig.
    // Compare with DrawConfig interface
    const keys = {
      // "bezier": "CubicBezierCurve", // TODO: is this correct?
      "bezierPath": "BezierPath",
      "polygon": "Polygon",
      "triangle": "Triangle",
      "ellipse": "Ellipse",
      "ellipseSector": "EllipseSector",
      "circle": "Circle",
      "circleSector": "CircleSector",
      "vertex": "Vertex",
      "line": "Line",
      "vector": "Vector",
      "image": "Image",
      "text": "Text"
    };
    // Question: why isn't this working if the svgNode is created dynamically? (nodeStyle.sheet is null)
    const rules: Array<string> = [];
    for (var k in keys) {
      const className: string = keys[k];
      const drawSettings: DrawSettings | undefined = drawConfig[k];
      if (drawSettings) {
        rules.push(`.${className} { fill : none; stroke: ${drawSettings.color}; stroke-width: ${drawSettings.lineWidth}px }`);
      } else {
        console.warn(`Warning: your draw config is missing the key '${k}' which is required.`);
      }
    }
    this.nodeStyle.innerHTML = rules.join("\n");
  }

  /**
   * Adds the internal <defs> node.
   */
  private addDefsNode() {
    this.nodeDefs = this.createSVGNode("defs") as SVGDefsElement;
    // this.svgNode.appendChild(this.nodeDefs);
    this.bufferedNodeDefs = this.createSVGNode("defs") as SVGDefsElement;
    this.svgNode.appendChild(this.nodeDefs);
  }

  /**
   * This is a simple way to include custom CSS class mappings to the style defs of the generated SVG.
   *
   * The mapping should be of the form
   *   [style-class] -> [style-def-string]
   *
   * Example:
   *   "rect.red" -> "fill: #ff0000; border: 1px solid red"
   *
   * @param {Map<string,string>} defs
   */
  addCustomStyleDefs(defs: Map<string, string>) {
    const buffer: string[] = [];
    defs.forEach((value: string, key: string) => {
      buffer.push(key + " { " + value + " }");
    });
    this.nodeStyle.innerHTML += "\n/* Custom styles */\n" + buffer.join("\n");
  }

  /**
   * Retieve an old (cached) element.
   * Only if both – key and nodeName – match, the element will be returned (null otherwise).
   *
   * @method findElement
   * @private
   * @memberof drawutilssvg
   * @instance
   * @param {UID} key - The key of the desired element (used when re-drawing).
   * @param {string} nodeName - The expected node name.
   */
  private findElement(key: UID | null, nodeName: string): SVGElement | null {
    if (!key) {
      return null;
    }
    var node: SVGElement | undefined = this.cache.get(key);
    if (node && node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
      this.cache.delete(key);
      return node;
    }
    return null;
  }

  /**
   * Create a new DOM node &lt;svg&gt; in the SVG namespace.
   *
   * @method createSVGNode
   * @private
   * @memberof drawutilssvg
   * @instance
   * @param {string} nodeName - The node name (tag-name).
   * @return {SVGElement} A new element in the SVG namespace with the given node name.
   */
  private createSVGNode(nodeName: string): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", nodeName);
  }

  /**
   * Make a new SVG node (or recycle an old one) with the given node name (circle, path, line, rect, ...).
   *
   * This function is used in draw cycles to re-use old DOM nodes (in hope to boost performance).
   *
   * @method makeNode
   * @private
   * @instance
   * @memberof drawutilssvg
   * @param {string} nodeName - The node name.
   * @return {SVGElement} The new node, which is not yet added to any document.
   */
  private makeNode(nodeName: string): SVGElement {
    // Try to find node in current DOM cache.
    // Unique node keys are strictly necessary.

    // Try to recycle an old element from cache.
    var node: SVGElement | null = this.findElement(this.curId, nodeName);
    if (!node) {
      // If no such old elements exists (key not found, tag name not matching),
      // then create a new one.
      node = this.createSVGNode(nodeName);
    }
    if (this.drawlibConfiguration.blendMode) {
      node.style["mix-blend-mode"] = this.drawlibConfiguration.blendMode;
    }
    // if (this.lineDashEnabled && this.lineDash && this.lineDash.length > 0 && drawutilssvg.nodeSupportsLineDash(nodeName)) {
    //   node.setAttribute("stroke-dasharray", this.lineDash.join(" "));
    // }
    return node;
  }

  /**
   * This is the final helper function for drawing and filling stuff and binding new
   * nodes to the SVG document.
   * It is not intended to be used from the outside.
   *
   * When in draw mode it draws the current shape.
   * When in fill mode it fills the current shape.
   *
   * This function is usually only called internally.
   *
   * @method _bindFillDraw
   * @private
   * @instance
   * @memberof drawutilssvg
   * @param {SVGElement} node - The node to draw/fill and bind.
   * @param {string} className - The class name(s) to use.
   * @param {string} color - A stroke/fill color to use.
   * @param {number=1} lineWidth - (optional) A line width to use for drawing (default is 1).
   * @return {SVGElement} The node itself (for chaining).
   */
  private _bindFillDraw(
    node: SVGElement,
    className: string,
    color?: string | null,
    lineWidth?: number | null,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    this._configureNode(node, className, this.fillShapes, color, lineWidth, strokeOptions);
    return this._bindNode(node, undefined);
  }

  /**
   * Bind this given node to a parent. If no parent is passed then the global
   * node buffer will be used.
   *
   * @method _bindNode
   * @private
   * @instance
   * @memberof drawutilssvg
   * @param {SVGElement} node - The SVG node to bind.
   * @param {SVGElement=} bindingParent - (optional) You may pass node other than the glober buffer node.
   * @returns {SVGElement} The passed node itself.
   */
  private _bindNode(node: SVGElement, bindingParent?: SVGElement): SVGElement {
    if (!node.parentNode) {
      // Attach to DOM only if not already attached
      (bindingParent ?? this.bufferGNode).appendChild(node);
    }
    return node;
  }

  /**
   * Add custom CSS class names and the globally defined CSS classname to the
   * given node.
   *
   * @method addCSSClasses
   * @private
   * @instance
   * @memberof drawutilssvg
   * @param {SVGElement} node - The SVG node to bind.
   * @param {string} className - The additional custom classname to add.
   * @returns {void}
   */
  private _addCSSClasses(node: SVGElement, className: string) {
    if (this.curClassName) {
      node.setAttribute("class", `${className} ${this.curClassName}`);
    } else {
      node.setAttribute("class", className);
    }
  }

  private _configureNode(
    node: SVGElement,
    className: string,
    fillMode: boolean,
    color?: string | null,
    lineWidth?: number | null,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    this._addCSSClasses(node, className);
    node.setAttribute("fill", fillMode && color ? color : "none");
    node.setAttribute("stroke", fillMode ? "none" : color || "none");
    node.setAttribute("stroke-width", `${lineWidth || 1}`);
    if (this.curId) {
      node.setAttribute("id", `${this.curId}`); // Maybe React-style 'key' would be better?
    }
    this.applyStrokeOpts(node, strokeOptions);
    return node;
  }

  /**
   * Sets the size and view box of the document. Call this if canvas size changes.
   *
   * @method setSize
   * @instance
   * @memberof drawutilssvg
   * @param {XYDimension} canvasSize - The new canvas size.
   */
  setSize(canvasSize: XYDimension) {
    this.canvasSize = canvasSize;
    this.svgNode.setAttribute("viewBox", `0 0 ${this.canvasSize.width} ${this.canvasSize.height}`);
    this.svgNode.setAttribute("width", `${this.canvasSize.width}`);
    this.svgNode.setAttribute("height", `${this.canvasSize.height}`);
  }

  /**
   * Creates a 'shallow' (non deep) copy of this instance. This implies
   * that under the hood the same gl context and gl program will be used.
   */
  copyInstance(fillShapes: boolean): drawutilssvg {
    var copy: drawutilssvg = new drawutilssvg(
      this.svgNode,
      this.offset,
      this.scale,
      this.canvasSize,
      fillShapes,
      null as any as DrawConfig, // no DrawConfig – this will work as long as `isSecondary===true`
      true, // isSecondary
      this.gNode,
      this.bufferGNode,
      this.nodeDefs,
      this.bufferedNodeDefs
    );
    return copy;
  }

  /**
   * Set the current drawlib configuration.
   *
   * @name setConfiguration
   * @method
   * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
   */
  setConfiguration(configuration: DrawLibConfiguration): void {
    this.drawlibConfiguration = configuration;
  }

  // /**
  //  * Set or clear the line-dash configuration. Pass `null` for un-dashed lines.
  //  *
  //  * See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
  //  * and https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
  //  * for how line dashes work.
  //  *
  //  * @method
  //  * @param {Array<number> lineDashes - The line-dash array configuration.
  //  * @returns {void}
  //  */
  // setLineDash(lineDashes: Array<number>) {
  //   this.lineDash = lineDashes;
  // }

  /**
   * This method shouled be called each time the currently drawn `Drawable` changes.
   * It is used by some libraries for identifying elemente on re-renders.
   *
   * @name setCurrentId
   * @method
   * @param {UID|null} uid - A UID identifying the currently drawn element(s).
   * @instance
   * @memberof drawutilssvg
   **/
  setCurrentId(uid: UID | null): void {
    this.curId = uid;
  }

  /**
   * This method shouled be called each time the currently drawn `Drawable` changes.
   * Determine the class name for further usage here.
   *
   * @name setCurrentClassName
   * @method
   * @param {string|null} className - A class name for further custom use cases.
   * @instance
   * @memberof drawutilssvg
   **/
  setCurrentClassName(className: string | null): void {
    this.curClassName = className;
  }

  /**
   * Called before each draw cycle.
   * This is required for compatibility with other draw classes in the library.
   *
   * @name beginDrawCycle
   * @method
   * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
   * @instance
   * @memberof drawutilssvg
   **/
  beginDrawCycle(renderTime: number) {
    // Clear non-recycable elements from last draw cycle.
    this.cache.clear();

    // Clearing an SVG is equivalent to removing all its child elements.
    for (var i = 0; i < this.bufferGNode.childNodes.length; i++) {
      // Hide all nodes here. Don't throw them away.
      // We can probably re-use them in the next draw cycle.
      var child: SVGElement = this.bufferGNode.childNodes[i] as SVGElement;
      this.cache.set(child.getAttribute("id") as string, child);
    }
    this.removeAllChildNodes();
  }

  /**
   * Called after each draw cycle.
   *
   * This is required for compatibility with other draw classes in the library (like drawgl).
   *
   * @name endDrawCycle
   * @method
   * @param {number} renderTime
   * @instance
   **/
  endDrawCycle(renderTime: number) {
    if (!this.isSecondary) {
      // All elements are drawn into the buffer; they are NOT yet visible, not did the browser perform any
      // layout updates.
      // Replace the old <g>-node with the buffer node.
      //   https://stackoverflow.com/questions/27442464/how-to-update-a-svg-image-without-seeing-a-blinking
      this.svgNode.replaceChild(this.bufferedNodeDefs, this.nodeDefs);
      this.svgNode.replaceChild(this.bufferGNode, this.gNode);
    }
    const tmpGNode: SVGGElement = this.gNode;
    this.gNode = this.bufferGNode;
    this.bufferGNode = tmpGNode;

    const tmpDefsNode: SVGDefsElement = this.nodeDefs;
    this.nodeDefs = this.bufferedNodeDefs;
    this.bufferedNodeDefs = tmpDefsNode;
  }

  /**
   * A private helper method to apply stroke options to the current
   * context.
   * @param {StrokeOptions=} strokeOptions -
   */
  private applyStrokeOpts(node: SVGElement, strokeOptions?: StrokeOptions) {
    if (
      strokeOptions &&
      strokeOptions.dashArray &&
      strokeOptions.dashArray.length > 0 &&
      drawutilssvg.nodeSupportsLineDash(node.tagName)
    ) {
      node.setAttribute(
        "stroke-dasharray",
        strokeOptions.dashArray
          .map((dashArayElem: number) => {
            return dashArayElem * this.scale.x;
          })
          .join(" ")
      );
      if (strokeOptions.dashOffset) {
        node.setAttribute("stroke-dashoffset", `${strokeOptions.dashOffset * this.scale.x}`);
      }
    }
  }

  private _x(x: number): number {
    return this.offset.x + this.scale.x * x;
  }
  private _y(y: number): number {
    return this.offset.y + this.scale.y * y;
  }

  /**
   * Draw the line between the given two points with the specified (CSS-) color.
   *
   * @method line
   * @param {XYCoords} zA - The start point of the line.
   * @param {XYCoords} zB - The end point of the line.
   * @param {string} color - Any valid CSS color string.
   * @param {number=1} lineWidth? - [optional] The line's width.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   **/
  line(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement {
    // const line: SVGElement = this.makeNode("line");
    // this.applyStrokeOpts(line, strokeOptions);
    // line.setAttribute("x1", `${this._x(zA.x)}`);
    // line.setAttribute("y1", `${this._y(zA.y)}`);
    // line.setAttribute("x2", `${this._x(zB.x)}`);
    // line.setAttribute("y2", `${this._y(zB.y)}`);
    const line = this.makeLineNode(zA, zB, color, lineWidth, strokeOptions);
    return this._bindFillDraw(line, "line", color, lineWidth || 1, strokeOptions);
  }

  /**
   * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
   *
   * @method arrow
   * @param {XYCoords} zA - The start point of the arrow-line.
   * @param {XYCoords} zB - The end point of the arrow-line.
   * @param {string} color - Any valid CSS color string.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {headLength=8} headLength - (optional) The length of the arrow head (default is 8 units).
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   **/
  arrow(
    zA: XYCoords,
    zB: XYCoords,
    color: string,
    lineWidth?: number,
    headLength: number = 8,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    const group: SVGElement = this.makeNode("g");
    const arrowHeadBasePosition: XYCoords = { x: 0, y: 0 };
    // Just create the child nodes, don't bind them to the root node.
    const arrowHead: SVGElement = this.makeArrowHeadNode(zA, zB, color, lineWidth, headLength, undefined, arrowHeadBasePosition);
    const line: SVGElement = this.makeLineNode(zA, arrowHeadBasePosition, color, lineWidth, strokeOptions);
    group.appendChild(line);
    group.appendChild(arrowHead);
    this._addCSSClasses(group, "linear-arrow");
    this._bindNode(group, undefined);
    return group;
  }

  /**
   * Draw a cubic Bézier curve and and an arrow at the end (endControlPoint) of the given line width the specified (CSS-) color and arrow size.
   *
   * @method cubicBezierArrow
   * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
   * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
   * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
   * @param {XYCoords} endControlPoint   - The end control point the cubic Bézier curve.
   * @param {string} color - The CSS color to draw the curve with.
   * @param {number} lineWidth - (optional) The line width to use.
   * @param {headLength=8} headLength - (optional) The length of the arrow head (default is 8 units).
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof DrawLib
   */
  cubicBezierArrow(
    startPoint: XYCoords,
    endPoint: XYCoords,
    startControlPoint: XYCoords,
    endControlPoint: XYCoords,
    color: string,
    lineWidth?: number,
    headLength: number = 8,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    const group: SVGElement = this.makeNode("g");
    // Just create the child nodes, don't bind them to the root node.
    const arrowHeadBasePosition = new Vertex(0, 0);
    const arrowHead: SVGElement = this.makeArrowHeadNode(
      endControlPoint,
      endPoint,
      color,
      lineWidth,
      headLength,
      undefined,
      arrowHeadBasePosition
    );
    const diff = arrowHeadBasePosition.difference(endPoint);
    const bezier: SVGElement = this.makeCubicBezierNode(
      startPoint,
      { x: endPoint.x - diff.x, y: endPoint.y - diff.y },
      startControlPoint,
      { x: endControlPoint.x - diff.x, y: endControlPoint.y - diff.y },
      color,
      lineWidth,
      strokeOptions
    );
    group.appendChild(bezier);
    group.appendChild(arrowHead);
    this._addCSSClasses(group, "cubicbezier-arrow");
    this._bindNode(group, undefined);
    return group;
  }

  /**
   * Draw just an arrow head a the end of an imaginary line (zB) of the given line width the specified (CSS-) color and size.
   *
   * @method arrow
   * @param {XYCoords} zA - The start point of the arrow-line.
   * @param {XYCoords} zB - The end point of the arrow-line.
   * @param {string} color - Any valid CSS color string.
   * @param {number=1} lineWidth - (optional) The line width to use; default is 1.
   * @param {number=8} headLength - (optional) The length of the arrow head (default is 8 pixels).
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof DrawLib
   **/
  arrowHead(
    zA: XYCoords,
    zB: XYCoords,
    color: string,
    lineWidth?: number,
    headLength: number = 8,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    const node: SVGElement = this.makeArrowHeadNode(zA, zB, color, lineWidth, headLength, strokeOptions);
    return this._bindFillDraw(node, "arrowhead", color, lineWidth || 1, strokeOptions);
  }

  /**
   * Draw an image at the given position with the given size.<br>
   * <br>
   * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
   *
   * @method image
   * @param {Image} image - The image object to draw.
   * @param {XYCoords} position - The position to draw the the upper left corner at.
   * @param {XYCoords} size - The x/y-size to draw the image with.
   * @param {number=0.0} alpha - (optional, default=0.0) The transparency (1.0=opaque, 0.0=transparent).
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   **/
  image(image: HTMLImageElement, position: XYCoords, size: XYCoords, alpha: number = 1.0) {
    const node: SVGElement = this.makeNode("image");

    // We need to re-adjust the image if it was not yet fully loaded before.
    const setImageSize = (image: HTMLImageElement) => {
      if (image.naturalWidth) {
        const ratioX = size.x / image.naturalWidth;
        const ratioY = size.y / image.naturalHeight;
        node.setAttribute("width", `${image.naturalWidth * this.scale.x}`);
        node.setAttribute("height", `${image.naturalHeight * this.scale.y}`);
        node.setAttribute("display", null as any as string); // Dislay when loaded
        // if (alpha) {
        node.setAttribute("opacity", `${alpha}`);
        // }
        node.setAttribute("transform", `translate(${this._x(position.x)} ${this._y(position.y)}) scale(${ratioX} ${ratioY})`);
      }
    };
    image.addEventListener("load", event => {
      setImageSize(image);
    });

    // Safari has a transform-origin bug.
    // Use x=0, y=0 and translate/scale instead (see above)
    node.setAttribute("x", `${0}`);
    node.setAttribute("y", `${0}`);
    node.setAttribute("display", "none"); // Hide before loaded
    setImageSize(image);
    node.setAttribute("href", image.src);
    return this._bindFillDraw(node, "image", null, null);
  }

  /**
   * Draw an image at the given position with the given size.<br>
   * <br>
   * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
   *
   * @method texturedPoly
   * @param {Image} textureImage - The image object to draw.
   * @param {Bounds} textureSize - The texture size to use; these are the original bounds to map the polygon vertices to.
   * @param {Polygon} polygon - The polygon to use as clip path.
   * @param {XYCoords} polygonPosition - The polygon's position (relative), measured at the bounding box's center.
   * @param {number} rotation - The rotation to use for the polygon (and for the texture).
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   **/
  texturedPoly(
    textureImage: HTMLImageElement,
    textureSize: Bounds,
    polygon: Polygon,
    polygonPosition: XYCoords,
    rotation: number
  ): SVGElement {
    // const basePolygonBounds: Bounds = polygon.getBounds();
    const rotatedScalingOrigin = new Vertex(textureSize.min).clone().rotate(rotation, polygonPosition);
    // const rotationCenter = polygonPosition.clone().add(rotatedScalingOrigin.difference(textureSize.min).inv());
    // Create something like this
    // ...
    //    <defs>
    //       <clipPath id="shape">
    //         <path fill="none" d="..."/>
    //       </clipPath>
    //    </defs>
    //    ...
    //    <g clip-path="url(#shape)">
    //       <g transform="scale(...)">
    //          <image width="643" height="643" transform="rotate(...)" xlink:href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/222579/beagle400.jpg" >
    //       </g>
    //    </g>
    //    </image>
    // ...
    const clipPathNode: SVGClipPathElement = this.makeNode("clipPath") as SVGClipPathElement;
    const clipPathId: string = `clippath_${UIDGenerator.next()}`; // TODO: use a better UUID generator here?
    clipPathNode.setAttribute("id", clipPathId);

    const gNode = this.makeNode("g") as SVGGElement;
    const imageNode: SVGImageElement = this.makeNode("image") as SVGImageElement;
    imageNode.setAttribute("x", `${this._x(rotatedScalingOrigin.x)}`);
    imageNode.setAttribute("y", `${this._y(rotatedScalingOrigin.y)}`);
    imageNode.setAttribute("width", `${textureSize.width}`);
    imageNode.setAttribute("height", `${textureSize.height}`);
    imageNode.setAttribute("href", textureImage.src);
    // imageNode.setAttribute("opacity", "0.5");
    // SVG rotations in degrees
    imageNode.setAttribute(
      "transform",
      `rotate(${rotation * RAD_TO_DEG}, ${this._x(rotatedScalingOrigin.x)}, ${this._y(rotatedScalingOrigin.y)})`
    );
    const pathNode: SVGPathElement = this.makeNode("path") as SVGPathElement;
    const pathData: string[] = [];
    if (polygon.vertices.length > 0) {
      const self = this;
      pathData.push("M", `${this._x(polygon.vertices[0].x)}`, `${this._y(polygon.vertices[0].y)}`);
      for (var i = 1; i < polygon.vertices.length; i++) {
        pathData.push("L", `${this._x(polygon.vertices[i].x)}`, `${this._y(polygon.vertices[i].y)}`);
      }
    }

    pathNode.setAttribute("d", pathData.join(" "));
    clipPathNode.appendChild(pathNode);
    this.bufferedNodeDefs.appendChild(clipPathNode);

    gNode.appendChild(imageNode);
    gNode.setAttribute("transform-origin", `${this._x(rotatedScalingOrigin.x)} ${this._y(rotatedScalingOrigin.y)}`);
    gNode.setAttribute("transform", `scale(${this.scale.x}, ${this.scale.y})`);

    const clipNode: SVGGElement = this.makeNode("g") as SVGGElement;
    clipNode.appendChild(gNode);
    clipNode.setAttribute("clip-path", `url(#${clipPathId})`);

    // TODO: check if the image class is correct here or if we should use a 'clippedImage' class here
    this._bindFillDraw(clipNode, "image", null, null); // No color, no lineWidth
    return clipNode;
  }

  /**
   * Draw the given (cubic) bézier curve.
   *
   * @method cubicBezier
   * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
   * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
   * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
   * @param {XYCoords} endControlPoint   - The end control point the cubic Bézier curve.
   * @param {string} color - The CSS color to draw the curve with.
   * @param {number} lineWidth - (optional) The line width to use.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  cubicBezier(
    startPoint: XYCoords,
    endPoint: XYCoords,
    startControlPoint: XYCoords,
    endControlPoint: XYCoords,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    const node: SVGElement = this.makeCubicBezierNode(
      startPoint,
      endPoint,
      startControlPoint,
      endControlPoint,
      color,
      lineWidth,
      strokeOptions
    );
    return this._bindNode(node, undefined);
  }

  /**
   * Draw the given (cubic) Bézier path.
   *
   * The given path must be an array with n*3+1 vertices, where n is the number of
   * curves in the path:
   * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre>
   *
   * @method cubicBezierPath
   * @param {XYCoords[]} path - The cubic bezier path as described above.
   * @param {string} color - The CSS colot to draw the path with.
   * @param {number=1} lineWidth - (optional) The line width to use.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  cubicBezierPath(path: Array<XYCoords>, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement {
    const node: SVGElement = this.makeNode("path");
    this.applyStrokeOpts(node, strokeOptions);
    if (!path || path.length == 0) {
      return node;
    }

    // Draw curve
    const d: Array<string | number> = ["M", this._x(path[0].x), this._y(path[0].y)];

    // Draw curve path
    var endPoint: XYCoords;
    var startControlPoint: XYCoords;
    var endControlPoint: XYCoords;
    for (var i = 1; i < path.length; i += 3) {
      startControlPoint = path[i];
      endControlPoint = path[i + 1];
      endPoint = path[i + 2];
      d.push(
        "C",
        this._x(startControlPoint.x),
        this._y(startControlPoint.y),
        this._x(endControlPoint.x),
        this._y(endControlPoint.y),
        this._x(endPoint.x),
        this._y(endPoint.y)
      );
    }
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "cubicBezierPath", color, lineWidth || 1);
  }

  /**
   * Draw the given handle and handle point (used to draw interactive Bézier curves).
   *
   * The colors for this are fixed and cannot be specified.
   *
   * @method handle
   * @param {Vertex} startPoint - The start of the handle.
   * @param {Vertex} endPoint - The end point of the handle.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  handle(startPoint: XYCoords, endPoint: XYCoords): void {
    // TODO: redefine methods like these into an abstract class?
    this.point(startPoint, "rgb(0,32,192)");
    this.square(endPoint, 5, "rgba(0,128,192,0.5)");
  }

  /**
   * Draw a handle line (with a light grey).
   *
   * @method handleLine
   * @param {XYCoords} startPoint - The start point to draw the handle at.
   * @param {XYCoords} endPoint - The end point to draw the handle at.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  handleLine(startPoint: XYCoords, endPoint: XYCoords): void {
    this.line(startPoint, endPoint, "rgb(128,128,128,0.5)");
  }

  /**
   * Draw a 1x1 dot with the specified (CSS-) color.
   *
   * @method dot
   * @param {XYCoords} p - The position to draw the dot at.
   * @param {string} color - The CSS color to draw the dot with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  dot(p: XYCoords, color: string) {
    const node: SVGElement = this.makeNode("line");
    node.setAttribute("x1", `${this._x(p.x)}`);
    node.setAttribute("y1", `${this._y(p.y)}`);
    node.setAttribute("x2", `${this._x(p.x)}`);
    node.setAttribute("y2", `${this._y(p.y)}`);
    return this._bindFillDraw(node, "dot", color, 1);
  }

  /**
   * Draw the given point with the specified (CSS-) color and radius 3.
   *
   * @method point
   * @param {XYCoords} p - The position to draw the point at.
   * @param {string} color - The CSS color to draw the point with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  point(p: XYCoords, color: string) {
    var radius: number = 3;
    const node: SVGElement = this.makeNode("circle");
    node.setAttribute("cx", `${this._x(p.x)}`);
    node.setAttribute("cy", `${this._y(p.y)}`);
    node.setAttribute("r", `${radius}`);
    return this._bindFillDraw(node, "point", color, 1);
  }

  /**
   * Draw a circle with the specified (CSS-) color and radius.<br>
   * <br>
   * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
   *
   * @method circle
   * @param {XYCoords} center - The center of the circle.
   * @param {number} radius - The radius of the circle.
   * @param {string} color - The CSS color to draw the circle with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  circle(center: XYCoords, radius: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions) {
    // Todo: draw ellipse when scalex!=scaley
    const node: SVGElement = this.makeNode("circle");
    this.applyStrokeOpts(node, strokeOptions);

    node.setAttribute("cx", `${this._x(center.x)}`);
    node.setAttribute("cy", `${this._y(center.y)}`);
    node.setAttribute("r", `${radius * this.scale.x}`); // y?

    return this._bindFillDraw(node, "circle", color, lineWidth || 1);
  }

  /**
   * Draw a circular arc (section of a circle) with the given CSS color.
   *
   * @method circleArc
   * @param {XYCoords} center - The center of the circle.
   * @param {number} radius - The radius of the circle.
   * @param {number} startAngle - The angle to start at.
   * @param {number} endAngle - The angle to end at.
   * @param {string} color - The CSS color to draw the circle with.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  circleArc(
    center: XYCoords,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ) {
    const node: SVGElement = this.makeNode("path");
    this.applyStrokeOpts(node, strokeOptions);

    const arcData: SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc(
      this._x(center.x),
      this._y(center.y),
      radius * this.scale.x, // y?
      startAngle,
      endAngle
    );
    node.setAttribute("d", arcData.join(" "));
    return this._bindFillDraw(node, "circleArc", color, lineWidth || 1);
  }

  /**
   * Draw an ellipse with the specified (CSS-) color and thw two radii.
   *
   * @method ellipse
   * @param {XYCoords} center - The center of the ellipse.
   * @param {number} radiusX - The radius of the ellipse.
   * @param {number} radiusY - The radius of the ellipse.
   * @param {string} color - The CSS color to draw the ellipse with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  ellipse(
    center: XYCoords,
    radiusX: number,
    radiusY: number,
    color: string,
    lineWidth?: number,
    rotation?: number,
    strokeOptions?: StrokeOptions
  ) {
    if (typeof rotation === "undefined") {
      rotation = 0.0;
    }
    const node: SVGElement = this.makeNode("ellipse");
    this.applyStrokeOpts(node, strokeOptions);

    node.setAttribute("cx", `${this._x(center.x)}`);
    node.setAttribute("cy", `${this._y(center.y)}`);
    node.setAttribute("rx", `${radiusX * this.scale.x}`);
    node.setAttribute("ry", `${radiusY * this.scale.y}`);
    // node.setAttribute( 'style', `transform: rotate(${rotation} ${center.x} ${center.y})` );
    node.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI} ${this._x(center.x)} ${this._y(center.y)})`);

    return this._bindFillDraw(node, "ellipse", color, lineWidth || 1);
  }

  /**
   * Draw square at the given center, size and with the specified (CSS-) color.<br>
   * <br>
   * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
   *
   * @method square
   * @param {XYCoords} center - The center of the square.
   * @param {number} size - The size of the square.
   * @param {string} color - The CSS color to draw the square with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {SVGElement}
   * @instance
   * @memberof drawutilssvg
   */
  square(center: XYCoords, size: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement {
    const node: SVGElement = this.makeNode("rectangle");
    this.applyStrokeOpts(node, strokeOptions);

    node.setAttribute("x", `${this._x(center.x - size / 2.0)}`);
    node.setAttribute("y", `${this._y(center.y - size / 2.0)}`);
    node.setAttribute("width", `${size * this.scale.x}`);
    node.setAttribute("height", `${size * this.scale.y}`);

    return this._bindFillDraw(node, "square", color, lineWidth || 1);
  }

  /**
   * Draw a rectangle.
   *
   * @param {XYCoords} position - The upper left corner of the rectangle.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @param {string} color - The color to use.
   * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {SVGElement}
   * @instance
   * @memberof drawutilssvg
   **/
  rect(
    position: XYCoords,
    width: number,
    height: number,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    const node: SVGElement = this.makeNode("rect");
    this.applyStrokeOpts(node, strokeOptions);

    node.setAttribute("x", `${this._x(position.x)}`);
    node.setAttribute("y", `${this._y(position.y)}`);
    node.setAttribute("width", `${width * this.scale.x}`);
    node.setAttribute("height", `${height * this.scale.y}`);

    return this._bindFillDraw(node, "rect", color, lineWidth || 1);
  }

  /**
   * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
   *
   * @method grid
   * @param {XYCoords} center - The center of the grid.
   * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
   * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
   * @param {number} sizeX - The horizontal grid size.
   * @param {number} sizeY - The vertical grid size.
   * @param {string} color - The CSS color to draw the grid with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  grid(center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string) {
    const node: SVGElement = this.makeNode("path");
    const d: SVGPathParams = [];

    var yMin: number = -Math.ceil((height * 0.5) / sizeY) * sizeY;
    var yMax: number = height / 2;
    for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
      d.push("M", this._x(center.x + x), this._y(center.y + yMin));
      d.push("L", this._x(center.x + x), this._y(center.y + yMax));
    }

    var xMin: number = -Math.ceil((width * 0.5) / sizeX) * sizeX;
    var xMax: number = width / 2;
    for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
      d.push("M", this._x(center.x + xMin), this._y(center.y + y));
      d.push("L", this._x(center.x + xMax), this._y(center.y + y));
    }
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "grid", color, 1);
  }

  /**
   * Draw a raster of crosshairs in the given grid.<br>
   *
   * This works analogue to the grid() function
   *
   * @method raster
   * @param {XYCoords} center - The center of the raster.
   * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
   * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
   * @param {number} sizeX - The horizontal raster size.
   * @param {number} sizeY - The vertical raster size.
   * @param {string} color - The CSS color to draw the raster with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  raster(center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string) {
    const node: SVGElement = this.makeNode("path");
    const d: SVGPathParams = [];

    for (var x = -Math.ceil((width * 0.5) / sizeX) * sizeX; x < width / 2; x += sizeX) {
      for (var y = -Math.ceil((height * 0.5) / sizeY) * sizeY; y < height / 2; y += sizeY) {
        // Draw a crosshair
        d.push("M", this._x(center.x + x) - 4, this._y(center.y + y));
        d.push("L", this._x(center.x + x) + 4, this._y(center.y + y));

        d.push("M", this._x(center.x + x), this._y(center.y + y) - 4);
        d.push("L", this._x(center.x + x), this._y(center.y + y) + 4);
      }
    }
    node.setAttribute("d", d.join(" "));

    return this._bindFillDraw(node, "raster", color, 1);
  }

  /**
   * Draw a diamond handle (square rotated by 45°) with the given CSS color.
   *
   * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
   * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
   * as even shaped diamonds.
   *
   * @method diamondHandle
   * @param {XYCoords} center - The center of the diamond.
   * @param {number} size - The x/y-size of the diamond.
   * @param {string} color - The CSS color to draw the diamond with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  diamondHandle(center: XYCoords, size: number, color: string) {
    const node: SVGElement = this.makeNode("path");
    const d: SVGPathParams = [
      "M",
      this._x(center.x) - size / 2.0,
      this._y(center.y),
      "L",
      this._x(center.x),
      this._y(center.y) - size / 2.0,
      "L",
      this._x(center.x) + size / 2.0,
      this._y(center.y),
      "L",
      this._x(center.x),
      this._y(center.y) + size / 2.0,
      "Z"
    ];
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "diamondHandle", color, 1);
  }

  /**
   * Draw a square handle with the given CSS color.<br>
   * <br>
   * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
   * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
   * as even shaped squares.
   *
   * @method squareHandle
   * @param {XYCoords} center - The center of the square.
   * @param {XYCoords} size - The x/y-size of the square.
   * @param {string} color - The CSS color to draw the square with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  squareHandle(center: XYCoords, size: number, color: string) {
    const node: SVGElement = this.makeNode("rect");
    node.setAttribute("x", `${this._x(center.x) - size / 2.0}`);
    node.setAttribute("y", `${this._y(center.y) - size / 2.0}`);
    node.setAttribute("width", `${size}`);
    node.setAttribute("height", `${size}`);
    return this._bindFillDraw(node, "squareHandle", color, 1);
  }

  /**
   * Draw a circle handle with the given CSS color.<br>
   * <br>
   * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
   * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
   * as even shaped circles.
   *
   * @method circleHandle
   * @param {XYCoords} center - The center of the circle.
   * @param {number} radius - The radius of the circle.
   * @param {string} color - The CSS color to draw the circle with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  circleHandle(center: XYCoords, radius: number, color: string) {
    radius = radius || 3;

    const node: SVGElement = this.makeNode("circle");
    node.setAttribute("cx", `${this._x(center.x)}`);
    node.setAttribute("cy", `${this._y(center.y)}`);
    node.setAttribute("r", `${radius}`);
    return this._bindFillDraw(node, "circleHandle", color, 1);
  }

  /**
   * Draw a crosshair with given radius and color at the given position.<br>
   * <br>
   * Note that the crosshair radius will not be affected by scaling.
   *
   * @method crosshair
   * @param {XYCoords} center - The center of the crosshair.
   * @param {number} radius - The radius of the crosshair.
   * @param {string} color - The CSS color to draw the crosshair with.
   * @param {number=0.5} lineWidth - (optional, default=0.5) The line width to use.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  crosshair(center: XYCoords, radius: number, color: string, lineWidth?: number) {
    const node: SVGElement = this.makeNode("path");
    const d: SVGPathParams = [
      "M",
      this._x(center.x) - radius,
      this._y(center.y),
      "L",
      this._x(center.x) + radius,
      this._y(center.y),
      "M",
      this._x(center.x),
      this._y(center.y) - radius,
      "L",
      this._x(center.x),
      this._y(center.y) + radius
    ];
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "crosshair", color, lineWidth || 0.5);
  }

  /**
   * Draw a cross with diagonal axes with given radius, color and lineWidth at the given position.<br>
   * <br>
   * Note that the x's radius will not be affected by scaling.
   *
   * @method crosshair
   * @param {XYCoords} center - The center of the crosshair.
   * @param {number} radius - The radius of the crosshair.
   * @param {string} color - The CSS color to draw the crosshair with.
   * @param {number=1} lineWidth - (optional, default=1.0) The line width to use.
   * @return {void}
   * @instance
   * @memberof drawutils
   */
  cross(center: XYCoords, radius: number, color: string, lineWidth?: number) {
    const node: SVGElement = this.makeNode("path");
    const d: SVGPathParams = [
      "M",
      this._x(center.x) - radius,
      this._y(center.y) - radius,
      "L",
      this._x(center.x) + radius,
      this._y(center.y) + radius,
      "M",
      this._x(center.x) - radius,
      this._y(center.y) + radius,
      "L",
      this._x(center.x) + radius,
      this._y(center.y) - radius
    ];
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "cross", color, lineWidth || 1.0);
  }

  /**
   * Draw a polygon.
   *
   * @method polygon
   * @param {Polygon} polygon - The polygon to draw.
   * @param {string} color - The CSS color to draw the polygon with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  polygon(polygon: Polygon, color: string, lineWidth?: number): SVGElement {
    return this.polyline(polygon.vertices, polygon.isOpen, color, lineWidth);
  }

  /**
   * Draw a polygon line (alternative function to the polygon).
   *
   * @method polyline
   * @param {XYCoords[]} vertices - The polygon vertices to draw.
   * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
   * @param {string}   color    - The CSS color to draw the polygon with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  polyline(
    vertices: Array<XYCoords>,
    isOpen: boolean,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    const node: SVGElement = this.makeNode("path");
    this.applyStrokeOpts(node, strokeOptions);

    if (vertices.length == 0) {
      return node;
    }
    // Draw curve
    const d: Array<string | number> = ["M", this._x(vertices[0].x), this._y(vertices[0].y)];
    var n = vertices.length;
    for (var i = 1; i < n; i++) {
      d.push("L", this._x(vertices[i].x), this._y(vertices[i].y));
    }
    if (!isOpen) d.push("Z");
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "polygon", color, lineWidth || 1);
  }

  /**
   * Draw a text at the given relative position.
   *
   * @method text
   * @param {string} text - The text to draw.
   * @param {number} x - The x-position to draw the text at.
   * @param {number} y - The y-position to draw the text at.
   * @param {string=} options.color - The Color to use.
   * @param {string=} options.fontFamily - The font family to use.
   * @param {number=} options.fontSize - The font size (in pixels) to use.
   * @param {FontStyle=} options.fontStyle - The font style to use.
   * @param {FontWeight=} options.fontWeight - The font weight to use.
   * @param {number=} options.lineHeight - The line height (in pixels) to use.
   * @param {number=} options.rotation - The (optional) rotation in radians.
   * @param {string=} options.textAlign - The text align to use. According to the specifiactions (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) valid values are `"left" || "right" || "center" || "start" || "end"`.
   * @return {void}
   * @instance
   * @memberof drawutils
   */
  text(
    text: string,
    x: number,
    y: number,
    options?: {
      color?: string;
      fontFamily?: string;
      fontSize?: number;
      fontStyle?: FontStyle;
      fontWeight?: FontWeight;
      lineHeight?: number;
      textAlign?: CanvasRenderingContext2D["textAlign"];
      rotation?: number;
    }
  ): SVGElement {
    options = options || {};
    const color: string = options.color || "black";
    const lineHeight = (options.lineHeight ?? options.fontSize ?? 0) * this.scale.x;
    // https://www.w3.org/TR/SVG/text.html#TextAnchorProperty
    //    start | middle | end
    const textAlign: "start" | "middle" | "end" =
      options.textAlign === "left" || options.textAlign === "start"
        ? "start"
        : options.textAlign === "center"
        ? "middle"
        : options.textAlign === "right" || options.textAlign === "end"
        ? "end"
        : "start";
    const transformOrigin = `${this._x(x)}px ${this._y(y)}px`;
    const translate = `translate(${this._x(x)} ${this._y(y) + lineHeight / 2})`;
    // Safari has a transform-origin/rotation bug.
    // It's essential to use rotate(r,x,y) here. "rotate(r)"" with transform-origin(x,y) won't do the job.
    // And rotate and translate cannot be used is combination on a text object.
    // So wrap the text inside a <g>, translate the <g>, and rotate the text inside.
    const rotate = options.rotation ? `rotate(${options.rotation * RAD_TO_DEG} 0 0)` : ``;

    const node: SVGElement = this.makeNode("g");
    const curId = this.curId;
    this.curId = curId + "_text";
    const textNode: SVGElement = this.makeNode("text");
    node.appendChild(textNode);
    textNode.setAttribute("font-family", options.fontFamily ?? ""); // May be undefined
    textNode.setAttribute("font-size", options.fontSize ? `${options.fontSize * this.scale.x}` : "");
    textNode.setAttribute("font-style", options.fontStyle ? `${options.fontStyle}` : "");
    textNode.setAttribute("font-weight", options.fontWeight ? `${options.fontWeight}` : "");
    textNode.setAttribute("text-anchor", textAlign);
    textNode.setAttribute("transform-origin", "0 0");
    textNode.setAttribute("transform", rotate);
    node.setAttribute("transform-origin", transformOrigin);
    node.setAttribute("transform", translate);

    textNode.innerHTML = text;
    // Restore old ID
    this.curId = curId;
    return this._bindFillDraw(node, "text", color, 1);
  }

  /**
   * Draw a non-scaling text label at the given position.
   *
   * @method label
   * @param {string} text - The text to draw.
   * @param {number} x - The x-position to draw the text at.
   * @param {number} y - The y-position to draw the text at.
   * @param {number=} rotation - The (optional) rotation in radians.
   * @param {string="black"} color - The color to use (default is black).
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   */
  label(text: string, x: number, y: number, rotation?: number, color?: string): SVGElement {
    const node: SVGElement = this.makeNode("text");
    // For some strange reason SVG rotation transforms use degrees instead of radians
    node.setAttribute("transform", `translate(${x},${y}), rotate(${((rotation || 0) / Math.PI) * 180})`);

    node.setAttribute("font-family", "Arial");
    node.setAttribute("font-size", "9pt");
    node.setAttribute("font-style", "normal");
    node.setAttribute("font-weight", "lighter");

    node.innerHTML = text;
    return this._bindFillDraw(node, "label", color || "black", null);
  }

  /**
   * Draw an SVG-like path given by the specified path data.
   *
   * @method path
   * @param {SVGPathData} pathData - An array of path commands and params.
   * @param {string=null} color - (optional) The color to draw this path with (default is null).
   * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
   * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
   * @param {number=} options.dashOffset - (optional) `See StrokeOptions`.
   * @param {number=[]} options.dashArray - (optional) `See StrokeOptions`.
   *
   * @instance
   * @memberof drawutils
   * @return {R} An instance representing the drawn path.
   */
  path(pathData: SVGPathParams, color?: string, lineWidth?: number, options?: { inplace?: boolean } & StrokeOptions): SVGElement {
    const node: SVGElement = this.makeNode("path");
    this.applyStrokeOpts(node, options);

    // Transform the path: in-place (fast) or copy (slower)
    const d: SVGPathParams = options && options.inplace ? pathData : drawutilssvg.copyPathData(pathData);
    drawutilssvg.transformPathData(d, this.offset, this.scale);
    node.setAttribute("d", d.join(" "));
    return this._bindFillDraw(node, "path", color, lineWidth);
  }

  /**
   * Due to gl compatibility there is a generic 'clear' function required
   * to avoid accessing the context object itself directly.
   *
   * This function just fills the whole canvas with a single color.
   *
   * @param {string} color - The color to clear with.
   * @return {void}
   * @instance
   * @memberof drawutilssvg
   **/
  clear(color: string): void {
    // If this isn't the primary handler then do not remove anything here.
    // The primary handler will do that (no double work).
    if (this.isSecondary) {
      return;
    }

    // Add a covering rect with the given background color
    this.curId = "background";
    this.curClassName = null; // undefined;
    const node: SVGElement = this.makeNode("rect");
    // For some strange reason SVG rotation transforms use degrees instead of radians
    // Note that the background does not scale with the zoom level (always covers full element)
    node.setAttribute("x", "0");
    node.setAttribute("y", "0");
    node.setAttribute("width", `${this.canvasSize.width}`);
    node.setAttribute("height", `${this.canvasSize.height}`);

    // Bind this special element into the document
    this._bindFillDraw(node, this.curId, null, null);
    node.setAttribute("fill", typeof color === "undefined" ? "none" : color);
    // Clear the current ID again
    this.curId = null; // undefined;
  }

  /**
   * A private helper function to clear all SVG nodes from the &gt;g> node.
   *
   * @private
   */
  private removeAllChildNodes() {
    while (this.bufferGNode.lastChild) {
      this.bufferGNode.removeChild(this.bufferGNode.lastChild);
    }
    while (this.bufferedNodeDefs.lastChild) {
      this.bufferedNodeDefs.removeChild(this.bufferedNodeDefs.lastChild);
    }
  }

  /**
   * Create a new and empty `SVGElement` &lt;svg&gt; in the svg-namespace.
   *
   * @name createSvg
   * @static
   * @memberof drawutilssvg
   * @return SVGElement
   */
  static createSvg(): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }

  /**
   * Create a copy of the given path data. As path data only consists of strings and numbers,
   * the copy will be shallow by definition.
   *
   * @name copyPathData
   * @static
   * @memberof drawutilssvg
   */
  static copyPathData(data: SVGPathParams): SVGPathParams {
    const copy: SVGPathParams = new Array(data.length);
    for (var i = 0, n = data.length; i < n; i++) {
      copy[i] = data[i];
    }
    return copy;
  }

  /**
   * Transform the given path data (translate and scale. rotating is not intended here).
   *
   * @name transformPathData
   * @static
   * @memberof drawutilssvg
   * @param {SVGPathParams} data - The data to transform.
   * @param {XYCoords} offset - The translation offset (neutral is x=0, y=0).
   * @param {XYCoords} scale - The scale factors (neutral is x=1, y=1).
   */
  static transformPathData(data: SVGPathParams, offset: XYCoords, scale: XYCoords): void {
    // Scale and translate {x,y}
    const _stx = (index: number): void => {
      data[index] = offset.x + scale.x * Number(data[index]);
    };
    const _sty = (index: number): void => {
      data[index] = offset.y + scale.y * Number(data[index]);
    };
    // scale only {x,y}
    const _sx = (index: number): void => {
      data[index] = scale.x * Number(data[index]);
    };
    const _sy = (index: number): void => {
      data[index] = scale.y * Number(data[index]);
    };

    var i: number = 0;
    var lastPoint: XYCoords = { x: NaN, y: NaN };
    // "save last point"
    var _slp = (index: number) => {
      lastPoint.x = Number(data[index]);
      lastPoint.y = Number(data[index + 1]);
    };
    while (i < data.length) {
      const cmd: string | number = data[i];
      switch (cmd) {
        case "M":
        // MoveTo: M|m x y
        case "L":
        // LineTo L|l x y
        case "T":
          // Shorthand/smooth quadratic Bézier curveto: T|t x y
          _stx(i + 1);
          _sty(i + 2);
          _slp(i + 1);
          i += 3;
          break;
        case "m":
        // MoveTo: M|m x y
        case "l":
        // LineTo L|l x y
        case "t":
          // Shorthand/smooth quadratic Bézier curveto: T|t x y
          _sx(i + 1);
          _sy(i + 2);
          _slp(i + 1);
          i += 3;
          break;

        case "H":
          // HorizontalLineTo: H|h x
          _stx(i + 1);
          lastPoint.x = Number(data[i + 1]);
          i += 2;
          break;
        case "h":
          // HorizontalLineTo: H|h x
          _sx(i + 1);
          lastPoint.x = Number(data[i + 1]);
          i += 2;
          break;
        case "V":
          // VerticalLineTo: V|v y
          _sty(i + 1);
          lastPoint.y = Number(data[i + 1]);
          i += 2;
          break;
        case "v":
          // VerticalLineTo: V|v y
          _sy(i + 1);
          lastPoint.y = Number(data[i + 1]);
          i += 2;
          break;
        case "C":
          // CurveTo: C|c x1 y1 x2 y2 x y
          _stx(i + 1);
          _sty(i + 2);
          _stx(i + 3);
          _sty(i + 4);
          _stx(i + 5);
          _sty(i + 6);
          _slp(i + 5);
          i += 7;
          break;
        case "c":
          // CurveTo: C|c x1 y1 x2 y2 x y
          _sx(i + 1);
          _sy(i + 2);
          _sx(i + 3);
          _sy(i + 4);
          _sx(i + 5);
          _sy(i + 6);
          _slp(i + 5);
          i += 7;
          break;
        case "S":
        case "Q":
          // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
          // QuadraticCurveTo: Q|q x1 y1 x y
          _stx(i + 1);
          _sty(i + 2);
          _stx(i + 3);
          _sty(i + 4);
          _slp(i + 3);
          i += 5;
          break;
        case "s":
        case "q":
          // Shorthand-/SmoothCurveTo: S|s x2 y2 x y
          // QuadraticCurveTo: Q|q x1 y1 x y
          _sx(i + 1);
          _sy(i + 2);
          _sx(i + 3);
          _sy(i + 4);
          _slp(i + 3);
          i += 5;
          break;
        case "A":
          // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
          // Uniform scale: just scale
          // NOTE: here is something TODO
          //  * if scalex!=scaleY this won't work
          //  * Arcs have to be converted to Bézier curves here in that case
          _sx(i + 1);
          _sy(i + 2);
          _stx(i + 6);
          _sty(i + 7);
          _slp(i + 6);
          // Update the arc flag when x _or_ y scale is negative
          if ((scale.x < 0 && scale.y >= 0) || (scale.x >= 0 && scale.y < 0)) {
            data[i + 5] = data[i + 5] ? 0 : 1;
          }
          i += 8;
          break;
        case "a":
          // EllipticalArcTo: A|a rx ry x-axis-rotation large-arc-flag sweep-flag x y
          _sx(i + 1);
          _sy(i + 2);
          _sx(i + 6);
          _sy(i + 7);
          _slp(i + 6);
          i += 8;
          break;
        case "z":
        case "Z":
          // ClosePath: Z|z (no arguments)
          // lastPoint.x = firstPoint.x;
          // lastPoint.y = firstPoint.y;
          i++;
          break;
        // Safepoint: continue reading token by token until something is recognized again
        default:
          i++;
      }
    } // END while
  } // END transformPathData

  private static nodeSupportsLineDash(nodeName: string) {
    return ["line", "path", "circle", "ellipse", "rectangle", "rect"].includes(nodeName);
  }

  /**
   * Creates a basic <line> node with start and end coordinates. The created node will not
   * be bound to any root node.
   *
   * @private
   * @method makeLineNode
   * @param {XYCoords} zA - The line's start position.
   * @param {XYCoords} zB - The line's start position.
   * @param {string} color - The CSS color to draw the point with.
   * @param {number=1} lineWidth - (optional) The line width to use.
   * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
   * @param {string=} classNameOverride - (optional) If nothing is passed the default classname 'path' will be used.
   * @return {SVGLineElement}
   * @instance
   * @memberof drawutilssvg
   */
  private makeLineNode(
    zA: XYCoords,
    zB: XYCoords,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions,
    classNameOverride?: string
  ): SVGLineElement {
    const line: SVGLineElement = this.makeNode("line") as SVGLineElement;
    line.setAttribute("x1", `${this._x(zA.x)}`);
    line.setAttribute("y1", `${this._y(zA.y)}`);
    line.setAttribute("x2", `${this._x(zB.x)}`);
    line.setAttribute("y2", `${this._y(zB.y)}`);
    this._configureNode(line, classNameOverride ?? "line", this.fillShapes, color, lineWidth || 1, strokeOptions);
    return line;
  }

  /**
   * Creates a basic <path> node with given path string data. The created node will not
   * be bound to any root node.
   *
   * @private
   * @method makePathNode
   * @param {string} pathString - The path data (must be a valid path data string).
   * @param {string} color - The CSS color to draw the point with.
   * @param {number=1} lineWidth - (optional) The line width to use.
   * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
   * @param {string=} classNameOverride - (optional) If nothing is passed the default classname 'path' will be used.
   * @return {SVGPathElement}
   * @instance
   * @memberof drawutilssvg
   */
  private makePathNode(
    pathString: string,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions,
    classNameOverride?: string
  ): SVGPathElement {
    const path: SVGPathElement = this.makeNode("path") as SVGPathElement;
    path.setAttribute("d", pathString);
    this._configureNode(path, classNameOverride ?? "path", this.fillShapes, color, lineWidth || 1, strokeOptions);
    return path;
  }

  /**
   * Creates a basic arrow head node (<path> node) at the end of the given line coordinates. The created node will not
   * be bound to any root node.
   *
   * @private
   * @method makeArrowHeadNode
   * @param {string} pathString - The path data (must be a valid path data string).
   * @param {string} color - The CSS color to draw the point with.
   * @param {number=1} lineWidth - (optional) The line width to use.
   * @param {number=8} headLength - (optional) The length of the arrow head; if none is specified then the head will be 8 absolute units long.
   * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
   * @param {XYCoords=} arrowHeadBasePositionBuffer - (optional) If not null, then this position will contain the arrow head's start point (after execution). Some sort of OUT variable.
   * @return {SVGPathElement}
   * @instance
   * @memberof drawutilssvg
   */
  private makeArrowHeadNode(
    zA: XYCoords,
    zB: XYCoords,
    color: string,
    lineWidth?: number,
    headLength: number = 8,
    strokeOptions?: StrokeOptions,
    arrowHeadBasePositionBuffer?: XYCoords
  ): SVGPathElement {
    var vertices: Array<Vertex> = Vector.utils.buildArrowHead(zA, zB, headLength, this.scale.x, this.scale.y);
    const d: Array<string | number> = ["M", this.offset.x + vertices[0].x, this.offset.y + vertices[0].y];
    if (arrowHeadBasePositionBuffer) {
      arrowHeadBasePositionBuffer.x = vertices[0].x / this.scale.x;
      arrowHeadBasePositionBuffer.y = vertices[0].y / this.scale.y;
    }
    for (var i = 1; i <= vertices.length; i++) {
      d.push("L");
      // Note: only use offset here (the vertices are already scaled)
      d.push(this.offset.x + vertices[i % vertices.length].x);
      d.push(this.offset.y + vertices[i % vertices.length].y);
    }
    const node: SVGPathElement = this.makePathNode(d.join(" "), color, lineWidth, strokeOptions, "arrowhead");
    return node;
  }

  /**
   * Creates a basic cubic Bézier path node (<path> node) with the given cubic Bézier data. The created node will not
   * be bound to any root node.
   *
   * @private
   * @method makeCubicBezierNode
   * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
   * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
   * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
   * @param {XYCoords} endControlPoint   - The end control point the cubic Bézier curve.
   * @param {string} color - The CSS color to draw the point with.
   * @param {number=1} lineWidth - (optional) The line width to use.
   * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
   * @param {string=} classNameOverride - (optional) If nothing is passed the default classname 'path' will be used.
   * @param {XYCoords=} arrowHeadBasePositionBuffer - (optional) If not null, then this position will contain the arrow head's start point (after execution). Some sort of OUT variable.
   * @return {SVGPathElement}
   * @instance
   * @memberof drawutilssvg
   */
  private makeCubicBezierNode(
    startPoint: XYCoords,
    endPoint: XYCoords,
    startControlPoint: XYCoords,
    endControlPoint: XYCoords,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ): SVGElement {
    if (startPoint instanceof CubicBezierCurve) {
      return this.cubicBezier(
        startPoint.startPoint,
        startPoint.endPoint,
        startPoint.startControlPoint,
        startPoint.endControlPoint,
        color,
        lineWidth
      );
    }
    // Draw curve
    const d: Array<string | number> = [
      "M",
      this._x(startPoint.x),
      this._y(startPoint.y),
      "C",
      this._x(startControlPoint.x),
      this._y(startControlPoint.y),
      this._x(endControlPoint.x),
      this._y(endControlPoint.y),
      this._x(endPoint.x),
      this._y(endPoint.y)
    ];
    const node: SVGElement = this.makePathNode(d.join(" "), color, lineWidth, strokeOptions, "cubicBezier");
    return node;
  }
}
