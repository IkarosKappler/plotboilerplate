## Todos
 * Add a method to draw connected paths (different types of path segments: linear, curve, arc, ...). Useful for the circle intersections demo.
 * Use a sorted map in the line-point-distance demo.
 * The experimental WebGL support requires Color objects instead of color strings. Otherwise each color string will be parse on each roundtrip which is a nightmare for the performance.
 * The Color.parse(string) function does only recognize HEX, RGB and RGBA strings. HSL is still missing. Required?
 * Replace all color params: replace type string by color. (tinycolor?)
 * Measure the canvas' border when applying fitToParent! Currently a 1px border is expected.
 * Implement snap-to-grid.
 * Make ellipses rotatable.
 * Write better viewport/viewbox export. Some viewers do not understand the current format. Refactor BoundingBox2 for this?
 * Add arcs?
 * Add image flipping.
 * Add Images to the SVGBuiler.
 * Add image/svg support (adding SVG images).
 * [Partially done] Add control button: set to retina resolution (size factors and css scale).
 * Add a demo that draws a proper mathematical xy-grid.
 * Extend the leaf venation generator demo.
 * Add a retina detection; initialize the canvas with double resolution on startup if retina display (optional-flag).
 * Change the behavior of Vector.intersection(...). The intersection should be on both vectors, not only on their line intersection!
 * Rename drawutils class to Drawutils or DrawUtils. Repective name DrawUtilsGL.
 * Use the new Bounds class in the RectSelector helper (use min:Vertex and max:Vertex).
 * Build a feature for line-styles; each 'color' param could also be gradient or a pattern (stroked, dotted, dashed, ... ).
   See ctx.setLineDash(...).
 * Add an internal mapping to remember vertices and their installed listeners (for removing them later).
 * Destroy installed vertex listeners from vertices after removing them (like the Bézier auto-adjuster).
 * Port all demos from vanilla JS to TypeScript.
 * Add a TouchHandler (such as the MouseHandler) to wrap AlloyFinger? Add this to the main demo to keep track of touch positions?
 * Add a removeVertices() function (and use it in the threejs demo).
 * Add class: EllipticSector
 * Extend the demo 25 (multiple circle intersection): add SVG export.
 * Replace drawables-to-svg.js by the new svg-draw library.
 * Remove all 'info' blocks and replace by uistats.

### Todos for future Version 2
 * Remove class member `PlotBoilerplate.ctx` (SVG renderes don't have such a context).
 * Change the Vector.inverse() function to reverse (or something). Currently this is not what the inverse of a vector should be.
 * Change the bezier point path order from [start,end,startContro,endControl] to [start,startControl,endControl,end].
 * Change BezierPath.getPointAt to .getVertexAt (or .getVertAt or vertAt?).
 * Change BezierPath.scale( center, factor ) to BezierPath.scale( factor, center ) and make center optional (like in Polygon).
 * Rename BezierPath.adjustCircular to .isCircular, because cirularity does not only affect vertex adjustment.
 * The inverse-functions are called Vertex.inv() but Vector.inverse(). Harmonize this.
 * CubicBezierCurve.getTangentAt(number) and .getTangent(number) return Vertex, why not a Vector?
 * Add a pointDeleted event handler to PB? Would be helpful to delete objects outside the PB when their associated points are deleted by the user.
 * Tweak the SVGBuilder: make the style classes configurable (colors, line thickness, custom classes, ...).
 * Change `Bounds.computeFromVertices` to `Bounds.fromVertices`.
 * Change draw.image(image, position:Vertex, size:Vertex) to Bounds or XYDimension.
 * Change draw.text(text, x:number, y:number, ...) to (..., position:XYCoords, ...). Same with draw.label(...).
 * draw.text() and draw.label() require color params.
 * Render dashed lines around images that cannot be rendered (e.g. file not found).
 * Each render method should also get the ID of the rendered element; this is required to keep track of changes in SVG documents.
 * Remove the toSVGString methods from all Drawables and the SVGSerializable interface. The drawutilssvg does everything with SVGs now.
 

