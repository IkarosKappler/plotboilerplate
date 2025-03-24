# Changelog

Imminent todos:

- Optimize infinite pattern demo: compute inner polygons before drawing
- demo 34: fail to compute foutier transform with array length != 8, whats going on here?
- check greiner hormann (27): doing weird stuff when "clearSelfIntersecting=true"
- check if the old color class is still used anywhere
- Add googley eyes to the animated metaballs demo.
- check automatic darkmode detection

* 2025-03-23
  - Making the second parameter `center` of the `Vertex.rotate` method optional.
  - Added the `Bounds.getMinDimension` and `Bounds.getMaxDimension` methods.
* 2025-03-17 [v1.23.3]
  - Finalizing infinite irregular pattern demo.
* 2025-02-12
  - Added the `Polygon.containsVerts` method to test multiple vertices for containment.
* 2024-12-17
  - Outsourced the euclidean distance calculation of `Vertex.distance` to `geomutils.dist4`.
  - Simplified the helper function `utils/algorithms/clearDuplicateVertices`to work with generic sub types of XYCoords as well.
* 2024-12-02
  - Adding the `triggerRedraw` to the `PlotBoilerplate.removeAll` method.
  - Added the `epsilon` param to the `VertTuple.colinear` method. Default is 1.0e-6.
  - Added the `Polygon.elimitateColinearEdges` method.
  - Added the demo 57: how to eliminate co-linear edges from a polygon.
* 2024-11-22
  - Added static utility function `Triangle.utils.determinant(XYCoord,XYCoords,XYCoords)`; adapted method `Triangle.determinant()`.
  - Changing visibility of `Triangle.utils` from `private` to `public`.
  - Adding params `xOffset` and `yOffset` to helper functions `drawPolygonIndices`.
  - Adding `Polygon.getInnerAngleAt(number)` to determine if polygon angle at index is acute or obtuse.
  - Adding helper function `geomutils.mapAngleTo2PI(number)` for mapping any value into the interval `[0,2*PI)`.
  - Adding helper function `geomutils.dotProduct(number)` for calculating the dot product of two vertices (as vectors).
  - Fixing demo 03-random-scripture: darkmode detection failed.
  - Fixed a type error in `utils/algorithms/findPolygonSelfIntersections`.
  - Adding lil-gui style: Override lil-gui scroll setting (activate scrolling) in `./demos/style.css`.
  - Added the `insideBoundsOnly` param to the `splitPolygonToNonIntersecting` algorithm.
* 2024-10-30
  - Added tge `Polygon.getEdges` method.
* 2024-10-12
  - Added the `Polygon.getEdgeAt` method.
* 2024-10-08
  - Adding `cssBackdropFolder` as a class attribute to the `CSSBackdropEffects` class.
* 2024-10-02
  - guiSizeToggler: Added a transition time (CSS style).
* 2024-09-13
  - Class `draw`: Remoed the scaling of `lineWidth` in the `polygon` and `polyline` methods. This makes no sense here and doesn't match up with the behavior of other line functions.
* 2024-09-10
  - Chaging the first param of `VertTuple.pointDistance` from `Vertex` to less strict type `XYCoords`. This should not break anything.
  - Adding the optional `VertTuple.epsilon` param to the `hasPoint` method.
* 2024-08-26 [v1.23.2]
  - Added the `utils/Params.hasParam` method.
  - Decoding URI components in GET params in `utils/gup`.
* 2024-08-25
  - Adding `CSSBackdropEffects` to GUI (if present); optional feature.
  - Added the `CSSBackdropFilterParams` params to the global params (all optional).
  - Extending main class `PlotBoilerplate` optional param `backdropFiltersEnabled`.
* 2024-08-05
  - Disabling backdrop-filter 'drop-shadow'. Currently not supported by canvas elements.
* 2024-07-24
  - drawutilssvg: Caching custom style defs in a private buffer variable.
  - Fixing lightning-algorithm-demo background issue.
* 2024-07-23 [v1.23.1]
  - Finalizing the CSS backdrop-filter effects demo (54).
* 2024-07-17
  - Tweaking the lil-gui extension to handle different input types with checkboxes.
* 2024-07-15
  - Adding lil-gui extension for numbers-with-checkbox.
  - Approach to add a configurable controller set for CSS backdrop filters.
* 2024-07-11
  - Adding vertex animator to the metaballs demo.
* 2024-07-09
  - Adding `PlotBoilerplate.getGUI()` to retrieve the GUI instance.
  - Adding `InitializationObserver` to detect when any demo has loaded and initialized its content.
* 2024-06-28
  - Fixing an initialization bug in the contour plot demo (48).
  - Fixing the demo Draw-to-svg (28).
  - Replaceing dat.gui by lil-gui in all demos.
  - Adding nice colors to the vectorfield demo (04).
* 2024-06-25
  - Replacing dat.gui (deprecated) by lil-gui.
  - Updating demos for lil-gui.
  - Removing gui.remember() calls from all demos (not supported by lil-gui).
  - Adding title() and arrowBounce() polyfills for lil-gui.
  - Adding new lil-gui params interface to 'externals'.
  - Updating Plotboilerplate main class for new lil-gui interface.
  - Updating createGUI function to work with lil-gui.
* 2024-05-19 [v1.23.0]
  - Finalizing the Metaballs demo (demo 52).
  - Adding circle sector helpers and elipse sector helpers to the default demo.
* 2024-03-10
  - Upgraded to Typescript 5.
  - Fixed 35 minor type issues in some classes to obtain Typescript 5 compatibility.
  - Fixed some issues in the `CircleHandler.destroy` method; listeners were not properly removed.
  - Adding the `CircleSectorHandler.destory` method for properly removing installed listeners.
* 2024-03-09
  - Added the `CircleSector.circleSectorIntersection` method to find coherent sector intersections.
  - Added the `CircleSector.angleAt` method to determine any angle at some ratio.
* 2024-03-08
  - Added the optional `precision` param to the `Vertex.toString` method.
  - Added the `CircleSector.containsAngle` method.
  - Adding the demo 53 (circle sector intersections). Sector intersections are required for the metaballs demo.
* 2024-03-01
  - Refactoring the current metaballs calculation to a Typescript class.
  - Added the `CircleSector.getStartPoint` and `CircleSector.getEndPoint` methods.
* 2024-02-26
  - CircleHelper: Removed the constructor param `pb` (unused).
  - CircleHelper: Added `circle` and `radiusPoint` attributes.
  - CircleHelper: Added the `destroy` method.
* 2024-02-23
  - Fixed some minor null-type conflicts in the CircleIntersections algorithms.
* 2024-02-09
  - Demo 25 Multiple Circle Sections: replacing the canvas/svg specific draw functions for arc by the new generic draw lib method.
* 2024-02-07
  - Added the `src/ts/utils/algorithms/arrayResize` utility function.
* 2024-02-06
  - Finilaizing the demo: polygons with round edges.
  - Adding new demo 52: metaballs 2d.
* 2024-01-30
  - Added a missing type in the `drawutilssvg.describeSVGArc` function.
  - Fixing an issue with `drawutilssvg` immutable style sets; changes to the global draw config did not reflect here (do now).
* 2024-01-29
  - Adding new demo 50-reuleaux-polygons.
  - Refactoring the NGons helper and porting it to Typescript.
  - Updating the demo 49-polygon-inside-polygon with the new NGons path.
* 2024-01-28 [v1.22.1]
  - Finalizing a first usable version of the contour plot calculation.
* 2023-11-27
  - Added the `GenericPath.getAllStartEndPoints()` function.
* 2023-11-24
  - Added the `Polygon.containsPolygon(Polygon)' function.
  - Added a new demo 49 for testing the polygon.containsPolygon function and some ngon generation fun.
  - Changed a but in the demo-build-ts script (meta).
* 2023-11-04
  - Adding a new interface for read matrix like data: utils/datastructures/DataGrid2d.
  - Adding an implementation for this working on linear arrays (like buffer or THREE vertex arrays): DataGrid2dListAdapter.
  - Refatoring the contour calculation to a new class: utils/algorithms/ContourLineDetection.
* 2023-10-28
  - Added a new demo for calculating contour plots.
  - Added the `utils/Params` class for retrieving URL params by their proper type.
  - Added/Refactored helper function `utils/clearDuplicateVertices`.
* 2023-10-07 [v1.21.0]
  - Adding the `BezierPath.fromCurve(CubicBezierCurve)` static function.
  - Adding the extended demo: Trimming Bézier curves.
  - Adding the `CubicBezierCurve.trimEnd(number)`, `trimEndAt(number)`, `trimStart(number)`, `trimStartAt(number)` methods.
* 2023-10-06
  - Adding the `BezierPath.toPathPoints()` method.
* 2023-10-04
  - Also adding the param `strokeOptions` to the default `drawutilssvg` library.
* 2023-09-30
  - Added the function `CubicbezierCurve.getSubCurve(number,number)` – similar to `getSubCurveAt(...)` but with absolute position parameters.
  - Adding `DrawLib.strokeOptions` param to these draw function: line, arrow, cubicBezierArrow, cubicBezier, cubicBezierPath, circle, circleArc, ellipse, square, rect, polygon, polyline.
  - Also adding the param `strokeOptions` to the default `draw` library.
* 2023-09-29
  - (createGUI utils) Added try-catch for color attributes; invalid values might break construction of whole gui.
  - Fixed a calculation error in the VertTuple.hasPoint() function; distance measure was broken!
  - Downgraded types for the `Vertex.utils.buildArrowHead` function (replacing Vertex params by more generic XYCoords type).
  - Added initialization checks for null parameters in `drawutilsvg` constructor.
  - Added a missing implementation to the `drawurilssvg.do(XYCoords,string)` function. Didn't draw anything.
  - (DrawLib interface, draw, drawgl and drawutilssvg class) Downgrading all `Vertex` param type to the more generic `XYCoords` type in these render functions: line, arrow, texturedPoly, cubicBezier, cubicBezierPath, handle, handleLine, dot, point, circle, circleArc, ellipse, grid, raster.
  - Adding proper dicionary key and value types to the params of `PlotBoilerplate.utils.safeMergeByKeys` (was `object` before).
  - Chaning param types in `Vector.utils.buildArrowHead()` from `Vertex` to the more generic `XYCoords`.
  - Added the `headLength` parameter to the 'DrawLib.arrow()` function.
  - Added the `arrowHead(...)` function to the 'DrawLib.arrow()` interface.
  - Added the `cubicBezierArrow(...)` function to the 'DrawLib.arrow()` interface.
  - Added the `randomPoint(...)` function declaration to the IBounds interface.
  - Added the `Bounds.randomPoint(...)` method.
  - Added the `Vertex.abs()` method as it seems useful.
* 2023-09-25
  - Added the `Polygon.getInterpolationPolygon(number)` function.
  - Added the `detectDarkMode` helper function.
  - Adding the demo `47-closest-vector-projection-on-polygon`.
  - Changed param type of `Line.intersection()` from Line to VertTuple.
  - Added `Polyon.lineIntersections(VertTuple)` function.
  - Added the `Polygon.closestLineIntersection(Line,boolean)` function.
* 2023-03-06
  - Finalizing the audio demo (demo-46).
* 2023-02-10
  - Fixing an issue of the `style.position` setting when `fitToParent=true` from `absolute` to `static` (default).
  - All non-function attributes of the `Config` interface are now mandatory.
  - The methods `DrawLib.setCurrentClassName` and `DrawLib.setCurrentId` also accept `null` now.
  - Cleaning up most type errors in the main class (mostly null checks).
  - Adding `enableZoom` and `enablePan` (both default true) to have the option to disable these functions.
* 2023-02-04
  - Fixed a bug in the `PlotBoilerplate.drawDrawable` function; fill's current classname was not set.
  - drawutilssvg: Fixed a typo in the CSS classname for cubic Bézier paths: cubicBezier (was cubierBezier).
* 2023-01-23
  - Added `Color.set(Color)` function to set all values (r,g,b,h,s,l,a) simultanoeusly.
* 2023-01-17 (v1.20.1)
  - 2023-01-17 Tweaking the demo `extended-elliptic-conversion`: adding large-arc-flag and sweep-flag.
  - Extending the `parseSVGPathData` and `splitSVGPathData` functions: basic path commands accepting additional sets of params now (ARC-command still missing).
* 2023-01-03 (v1.20.0)
  - Adding SVG processing to the `FileDrop` class.
  - Adding SVG import to the svg-path-import demo.
* 2022-12-21 (winter solstice)
  - Porting the yet experimental SVG path data parser to Typescript (early 0.0.1-alpha).
  - Defining very basic SVG path command types for parsing (early 0.0.1-alpha).
* 2022-12-13
  - Modified the Truchet demo so single cells can be edited.
* 2022-11-28
  - Added the `subXY`, `subX` and `subY` methods to the `Vertex` class.
  - Added the `clone` method to the `Bounds` class.
* 2022-11-23
  - Added `drawRaster` to the `Config` interface.
* 2022-11-10
  - Fixing an export bug: VEllipseSector was missing in the CJS and ESM exports.
* 2022-11-06 (v1.19.0)
  - Adding an XML declaration to the SVG export routine.
  - Added the CairoTileBuilder to the Truchet demo 44.
* 2022-10-25
  - Added `origin` param to the `DrawConfig` interface.
  - Added the `extended-vector-orthogonal` demo.
  - Added `Vector.getOrthogonal` method.
  - Added `origin` to PlotBoilerplate's default draw config.
* 2022-10-17
  - The `CubicBezierCurve` class now implements the new `PathSegment` interface.
  - Adding the `algorithms/detectPaths` function.
  - Changing the return type of `GirihTile.transformTilePositionToAdjacency` from `Polygon`to `Polygon | null`.
  - Adding these methods from the `PathSegment` interface to the `Line` class: getStartPoint, getEndPoint, reverse.
* 2022-10-07
  - Adding the 44-truchet-tiles demo.
  - Adding the `algorithms/arrayShuffle` function.
* 2022-10-09 (v1.18.0)
  - Added the `Bounds.fromDimension` function.
  - Changed the actual return value of the `Line.intersection` function to null (was undefined before).
  - Added the `utils/shuffleArray.ts` helper utils function.
* 2022-09-11
  - Added the extended circle-line-intersection demo (because I am stupid and need visual confirmation).
* 2022-08-23
  - Added the `Circle.lineIntersection(Vertex,Vertex)` function.
  - Added the `Circle.closestPoint(XYCoords)` function.
  - Fixed a type issue in the `draw.polyline` function.
  - Fixed a type issue in the `draw.setConfiguration` function.
  - Fixed a type issue in the `draw.path` function.
* 2022-08-16
  - MouseHandler: Fixed a bug in the mouse button detection.
* 2022-08-15
  - Added the `Circle.containsPoint(XYCoords)` function.
* 2022-08-01
  - Added `title` param to the `PBParams` interface.
* 2022-07-26
  - Adding `alpha` to the `draw.image(...)` function.
* 2022-06-02
  - Adding the demo 42 (Hick's Hexagons).
* 2022-06-01
  - Tweaked the `draw.polyline` function; lineWidth now scales with scale.x.
* 2022-05-11
* Adding new demo: raindrops.
* 2022-05-11
  - Modified the `Color.clone` function by just copying the numeric calues, not re-calculating the whole color.
  - Fixed the `Color.interpolate` function.
* 2022-03-27
  - Added the `texturedPoly` function to the `DrawLib` interface.
  - Added the `texturedPoly` function to the `drawutils` and `drawutilssvg` class.
* 2022-03-25
  - Added the `Bounds.toString()` function.
  - Added the private `nodeDefs` and `bufferedNodeDefs` attributes.
  - Added the `texturedPoly` function to draw textures polygons.
  - Added a demo (demo 40) for showing the way the new `texturePoly` function is working and to be used.
* 2022-03-08
  - Added the `Polygon.clone()` function.
* 2022-02-25
  - Extended the Girih demo: can upload files now per file select.
  - Extended the Gihih demo: can upload files now per file drop.
  - Added `globalThis.util.guiFolders` to gain quick access to the dat.gui folders created by the app (src/cjs/utils/createGui.js).
  - Added a new darkmode detection (already used in the ngdg project) to to demos.
* 2022-02-04 (breaking change)
  - Removed the `toSVGString` function from all drawables. They were no use any more, as `drawutilssvg` is doing their task, and they turned out to be just code overhead. THIS IS A BREAKING CHANGE.
  - Upgraded demo 26-girih: removed SVGBuilder and added proper SVG drawing for preview tiles.
  - Fixed the SVG export in the Girih demo (nothing was rendered/exported at all, just an empty canvas).
* 2022-02-03
  - Added the `DrawLib.cross(...)` function.
  - Added the `draw.cross(...)` function.
  - Added the `drawgl.cross(...)` function.
  - Added the `drawutilssvg.cross(...)` function.
  - Added the optional `lineWidth` param to the `DrawLib.crosshair` function (and thus to the classes `draw`, `drawgl` and `drawutilssvg`)- Changing the element to catch events (eventCatcher instead of canvas) in the `BezierPathInteractionHelper` (did not interact on SVGs so far).
* 2022-02-02 [v1.16.0]
  - Added the `BezierPath.destroy` method for releasing all installed event listeners.
  - Added the `Circle.destroy` method for releasing all installed event listeners.
  - Added the `CirclSector.destroy` method for releasing all installed event listeners.
  - Added the `CubicBezierCurve.destroy` method for releasing all installed event listeners.
  - Added the `KeyHandler.destroy` method for releasing all installed event listeners.
  - Added the `Line.destroy` method for releasing all installed event listeners.
  - Added the `MouseHandler.destroy` method for releasing all installed event listeners.
  - Added the `PBImage.destroy` method for releasing all installed event listeners.
  - Added the `PBText.destroy` method for releasing all installed event listeners.
  - Added the `Polygon.destroy` method for releasing all installed event listeners.
  - Added the `Triangle.destroy` method for releasing all installed event listeners.
  - Added the `Vector.destroy` method for releasing all installed event listeners.
  - Added the `VEllipse.destroy` method for releasing all installed event listeners.
  - Added the `VEllipseSector.destroy` method for releasing all installed event listeners.
  - Added the `Vertex.destroy` method for releasing all installed event listeners.
  - Added the `VertTuple.destroy` method for releasing all installed event listeners.
  - Added the `Vertex.destroy` method for releasing all installed event listeners.
  - Removed the function body of `toSVGString` from all relevant drawable classes (deprecation). Use `drawutilssvg` instead.
* 2022-01-31
  - Added `Vertex.utils.arrayToJSON`.
  - Added `BezierPath.getEvenDistributionVertices(number)`.
  - Added the extende-vertices demo.
  - Added `src/ts/io/FileDrop.ts`.
* 2022-01-10
  - Added utility function `findInVertexArray`.
* 2021-12-17
  - Added the functions `Vertex.lerp` and `Vertex.lerpAbs` for linear interpolations.
* 2021-12-16
  - Added the `Polygon.getEvenDistributionPolygon()` function.
* 2021-12-14
  - Added the `Polygon.perimeter()` function.
* 2021-12-01
  - Changed the type of param of `BezierPath.scale` to XYCoords.
  - Added function `BezierPath.scaleXY` for non uniform scaling.
  - Changed the type of param of `Vertex.scale` to XYCoords.
  - Added function `Vertex.scaleXY` for non uniform scaling.
* 2021-11-24
  - Speeding up the demo page with async script execution.
  - Finalizing the demo page for the new `PBText` element (note: it has this name because `Text` already exists).
* 2021-11-19
  - Fixing the `drawutilssvg.label(text,x,y)` position.
  - Added the `color` param to the `label(...)` function.
* 2021-11-16
  - Added `text` options to the `DrawConfig` interface.
  - Added the `PBText` class.
* 2021-11-15
  - Adding more parameters tot the `drawutilssvg.text()` function: fontSize, textAlign, fontFamily, lineHeight.
* 2021-11-12
  - Adding more parameters tot the `draw.text()` function: fontSize, textAlign, fontFamily, lineHeight.
* 2021-11.07
  - Changed the behavior of `darken` and `lighten`: the passed value is handled relative now which makes values much easier predictable and makes the change feel more 'natural'.
  - Added tests for the Color class. There were some strange things happening the the `ligthen` and `darken` function.
  - Did the same with `saturate` and `desaturate`.
  - Did the same with the `fadein` and `fadeout` functions.
  - Added setR, setG, setB, setH, setS, setL functions to the Color class.
* 2021-11-05
  - Fixing the regex in the Color.parse() function for parsing rgba-strings.
* 2021-10-12
  - Added `DrawConfig.bezier.pathVertex` and `DrawConfig.bezier.controlVertex` attributes, both `DrawSettigs`.
  - Added optional `fill:boolean` to `DrawSettings`. This is useful to give more control over the rendering of Bézier paths.
  - Fixed a tiny init order error in the Bézier demo.
* 2021-10-05
  - Adding `drawutilssvg.addCustomStyleDefs`.
  - Changing classname precedence in drawutilssvg: object classname first, then curClassName. by this curClassName can override the default behavior.
* 2021-10-04
  - Adding the `DrawLib.rect` function to the interface.
  - Adding a new demo: 36-lightning-algorithm.
  - Changing param `position` of the draw, drawsvg and drawgl library from `Vertex` to `XYCoords`.
  - Adding `drawutilssvg.rect` function.
  - Adding `drawutilsgl.rect` function.
  - Adding config check to `drawutilssvg.addStyleDefs` (printing warnings if incomplete).
* 2021-06-21 (mid-sommer)
  - Added `Bounds.getCenter` method.
  - Added `IBounds.getCenter`.
* 2021-05-31
  - Added the `DrawLib.setConfiguration` function`.
  - Added the `drawutils.setConfiguration` function from `DrawLib`.
  - Added the `drawutilssvg.setConfiguration` function from `DrawLib`.
  - Splitted up the `interfaces.ts` into several smaller files.
* 2021-05-25
  - Added BezierPath.fromReducedList( Array<number >).
* 2021-05-21
  - Ported gup (get-URI-params) to typescript.
* 2021-05-04
  - Added Matrix4x4 datastructure for 3d transformations.
* 2021-04-25
  - Extended `PlotBoilerplate.remove` to accept arrays of drawables.
  - Added the polynomial-interpolation demo.
* 2021-03-30
  - Added `DrawLib.endDrawCycle(renderTime)`.
  - Added buffering to the SVG drawing library `drawutilssvg` (this avoids flickering on redraws).
* 2021-03-29
  - Fixed a bug in the `drawutilssvg.text` function (second y param was wrong, used x here).
  - Clearing `currentClassName` and `currentId` after drawing each drawable.
  - Added the `draw` and `fill` params to the `preDraw` and `postDraw` functions (required for full svg export support).
* 2021-03-26 [v1.12.1]
  - Published version 1.12.1
* 2021-03-24
  - Added the `VEllipseSectorHelper` class.
* 2021-03-19
  - Added the `VEllipse.rotate` function.
  - Preparing a conversion function in the the draw-path demo: SVG-Arc to VEllipseSector.
  - Fixed the entry/export for the UIDGenerator (was broken in cjs module).
* 2021-03-15
  - Added `VEllipse.quarterSegmentCount` and `VEllipse.scale` functions.
* 2021-03-09
  - Added the `VEllipse.toCubicBezier` method.
* 2021-03-09
  - Added the `VEllipse.clone` and `VEllipse.rotate` methods.
* 2021-03-05
  - Added the `VEllipse.getFoci`, `.normalAt` and `.tangentAt` methods.
* 2021-03-03
  - Added the `VEllipse.vertAt` and `VEllipse.perimeter` functions.
* 2021-03-01
  - Added `geomutils.wrapMax` function.
  - Added attribute `VEllipse.rotation` to allow rotation of ellipses.
  - Added the `rotation` param to the DrawLib.ellipse(...) function.
  - Changed the second param `center` in the `rotate` function from Vertex to XYCoords.
  - Fixed a bug in the `drawsvgutils.clear` function (curClassName was not cleared).
  - Updated the `PlotBoilerplate.draw(...)` function: ellipses are now rotate-able.
* 2021-02-26
  - Adding first typescript implementation of VEllipseSector class.
  - Added helper function `VEllipseSector.ellipseSectorUtils.decribeSVGArc(...)`.
  - Fixed an error in the CircleSector's svg-arc-calculation (case angle<90deg and anti-clockwise).
* 2021-02-14
  - Added first test implementation of VEllipseSector (plus basic demo for testing).
  - Added functions `VEllipse.radiusH` and `VEllipse.radiusV`.
* 2021-02-23 [v1.12.0]
  - One step closer to use with React.
* 2021-02-22
  - Added the static helper function `drawutilssvg.copyPathData(...)`.
  - Added the `DrawLib.path` drawing function to draw SVG path data (canvas-draw, svg-draw [, gl-draw]).
* 2021-02-19
  - Added the static helper function `drawutilssvg.transformPathData(...)` for svg path transformations (scale and translate).
* 2021-02-18
  - Adding `PlotBoilerplate.adjustOffset(boolean)` function.
* 2021-02-08
  - Added a rollup- and a typescript config to create es2015 modules (in ./src/es2015).
  - Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
  - Ensure es2015 module compatibility of the Color class.
* 2021-02-03
  - Added the static `drawusilssvg.createSvg` function.
  - Fixed the currentId='background' bug on the drawusilssvg.clear() function.
  - Fixed CSSProperty `stroke-width` in drawusilssvg (was line-width before, which is wrong).
  - Added the static `drawusilssvg.HEAD_XML` attribute.
* 2021-02-02
  - Added the `Bounds.toPolygon` method.
* 2021-01-29
  - Added the `Polygon.signedArea` function (was global function in the demos before).
  - Added the `Polygon.isClockwise` function.
  - Added the `Polygon.area` function.
  - Changed the param type for `containsVert` from Vertex to XYCoords.
  - Added an implementation of the Sutherland-Hodgman polygon clipping algorithm.
* 2021-01-27 [v1.11.0]
  - Added the new svg renderer as integrated helper.
* 2021-01-26
  - CircleSectorHelper: Moving control points with center points.
  - PlotBoilerplate class: Replaced the old SVGBuilder by the new `drawutilssvg` library.
* 2021-01-25
  - Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
  - Fixed the `PBParams` interface (inluding DrawConfig).
* 2021-01-24
  - Added `DrawLib.setCurrentId` function.
* 2021-01-22
  - Triangle: Always updating circumcircle when retieving it.
  - Removed `pb.redraw()` call from `CircleHelper` update handlers (changed vertices already triggered redraw).
  - Added the `CircleSectorHelpler` class.
  - Added the `Vertex.angle` function to determine 'angle' of the vertex relative to an origin.
* 2021-01-20
  - Added `UID` interface.
  - Added `UIDGenerator` abstract class.
  - Added uids to all Drawables.
* 2021-01-10
  - Added the `PlotBoilerplate.eventCatcher` to simplify event listening event on complex structures like SVG documents.
* 2021-01-08
  - Added the customizable `PlotBoilerplate.drawAll(...)` function.
* 2021-01-08
  - PlotBoilerplate main class: Added param `draw:DraLib<void>` to the methods `drawVertices`, `drawGrid` and `drawSelectPolygon`.
  - Adding the svg-draw library (testing) in utils/helpers/.
  - Added the customizable `PlotBoilerplate.drawAll(...)` function.
* 2021-01-05
  - Added the image-loaded/broken check.
  - Exposing the `drawDrawables` method as a static utility function (for further use).
* 2021-01-04
  - Avoiding multiple redraw call on adding multiple Drawables (array).
* 2021-01-03
  - Changed property in BezierPathInteractionHelper to `autoAdjustPaths` in the HandlerOptions interface (typo).
  - Added following new functions to BezierPathInteractionHelper: `addPathVertexDragStartListeners`, `removePathVertexDragStartListeners`, `addPathVertexDragEndListeners` and `removePathVertexDragEndListeners`.
* 2020-12-29
  - Constructor `BezierPath` is now private (not explicit use intended).
* 2020-12-28
  - Added the `Triangle.getArea` function.
  - Added the `Triangle.utils.signedArea` helper function.
* 2020-12-17
  - Added the `CircleSector` drawable (class).
  - Added the `SVGPathParams` type.
  - Extended the main class `PlotBoilerplate` for circle sector rendering.
  - Extended the `SVGBuilder` for circle sector rendering.
* 2020-12-11 [v1.10.0]
  - Added the `PlotBoilerplate.removeAll(boolean)` function.
* 2020-12-09
  - Ported function `findPolygonSelfIntersections` to Typescript (added to `utils/algorithms/`).
* 2020-12-08
  - Adding a new demo (27) for presenting polygon clipping and polygon triangulation.
* 2020-12-04
  - The `Line.intersection` function returns undefined if both lines are parallel.
  - Changed `VertTuple.vtutils.dist2` params from `Vertex` to `XYCoords` (generalized).
  - Changed `VertTuple.getClosestT` param from `Vertex` to `XYCoords` (generalized).
  - Added the `VertTuple.hasPoint(XYCoords)` function.
* 2020-11-25
  - Added the `isTouchEvent` param to the XMouseEvent params.
* 2020-11-19
  - Set min, max, width and height to private.
* 2020-11-17
  - Added the `VertexListeners.click(VertListener)` handler.
  - Added pure click handling (no dragEnd and !wasMoved jiggliny any more) to the PlotBoilerplate.
* 2020-11-11
  - Generalized `move(Vertex)` to `move(XYCoords)` in the Polygon class.
  - Generalized the `VertTuple.add` and `VertTuple.sub` param from `Vertex` to `XYCoords`.
  - Girih-demo: ported the GirihTile class from vanilla JS to TypeScript.
* 2020-11-10
  - Added the `Polygon.getBounds()` function.
* 2020-11-06
  - Added the `Polygon.move(XYCoords)` function.
* 2020-11-04
  - Changed `window` to `globalThis`.
* 2020-11-01
  - Migrated the build tools from Webpack-4 to Webpack-5.
  - Moved the build scripts to ./bin.
* 2020-10-31
  - Including utils in the docs now.
  - Added thet `Polygon.getVertexAt` function.
* 2020-10-30
  - Added the static Bounds.computeFromVertices(Vertex[]) function.
  - Added the `Polygon.addVert` function.
* 2020-10-23
  - Added the fillArray and fillMatrix helper function (like in lodash).
  - Added the `Matrix`, `Interval` and `IndexPair` interfaces to the typescript definitions.
  - Ported the `Color` library from vanilla JS to Typescript.
  - Ported the `WebColors` selection from vanilla to TypeScript.
* 2020-10-19
  - Added CircleIntersections algorithm and demo 25.
* 2020-10-18
  - Added CircularIntervalset datastructure.
* 2020-10-16
  - Added the Circle.containsCircle(...) function.
* 2020-10-15
  - Re-added the draw.text() function.
* 2020-10-06
  - Removed the .closePath() instruction from the draw.circleArc function.
* 2020-09-07
  - Added the Circle.circleIntersection(Circle) function.
  - Changed the vertAt function by switching sin and cos! The old version did not return the correct vertex (by angle) according to the assumed circle math. Please re-check your code if you already used this function.
  - Added the drawutils.circleArc(...) function to draw sections of circles.
* 2020-08-19
  - Ported the HobbyPath class from vanilla JS to TypeScript.
  - Ported the CatmullRomPath class from vanilla JS to TypeScript.
  - Ported the CubicSplinePath class from vanilla JS to TypeScript.
  - Added the VertexAttr.visible attribute to toggle on/off the rendering of particular vertices.
  - Added the VertexAnimator.Sinoid to the demos (see Hobby Curve).
* 2020-08-17
  - Ported the convexHull algorithm to TypeScript.
  - Ported the convexPolygonIncircle algorithm to TypeScript.
  - Ported the Delaunay algorithm to TypeScript.
* 2020-08-12
  - BezierPathInteractionHelper: Added a distance check before handling the click/tap event.
  - Ported the VoronoiCell helper class (see demos) from vanilla JS to TypeScript.
* 2020-08-03 (1.8.3)
  - Tweaked the BezierPathInteractionHelper.
  - Added proper JSDoc tags to the MouseHandler and the KeyHandler.
* 2020-07-31
  - Added PlotBoilerplate.getDraggedElementCount().
* 2020-07-28
  - Added PlotBoilerplate.revertMousePosition(number,number) – the inverse function of transformMousePosition(...).
  - Added Bézier curve splitting to the bezier-point-distance demo.
  - KeyHandler: changed the 'delete' key code from 8 to 46.
* 2020-07-27
  - Added the getVertexNear(XYCoords,number) function.
  - Extended the remove(Drawable) function: vertices are now removed, too.
* 2020-07-24 (1.8.2)
  - Fixed an error in the touch handlers 'tap start' function (nullpointerexception if empty area was tapped).
  - Added CubicBezierPath.getClosestT(Vertex) function.
  - Added BezierPath.getClosestT(Vertex) function.
* 2020-07-22
  - Fixed missing dragStart and dragEnd events in touch mode (after switching from Touchy to AlloyFinger).
* 2020-07-21
  - Changed the safeMargeByKeys function: all keys, from source and destination, will be used now.
  - Changed the fetch.bool and fetch.number function: they will try a JSON.parse now on type mismatch (and use the fallback on failure of that).
* 2020-07-15
  - Included the Bounds class into the bundle.
  - Added the PlotBoilerplate.fitToBounds(Bounds) function to make zooming onto particular areas easier.
* 2020-07-14
  - Changed the CubicBezierCurve.moveCurvePoint(...,Vertex) to moveCurvePoint(...,XYCoords), which is more generic.
  - Changed the BezierPath.moveCurvePoint(...,Vertex) to moveCurvePoint(...,XYCoords), which is more generic.
  - Added the autoDetectRetina param to PlotBoilerplate.
* 2020-07-06
  - Added AlloyFinger support (will replace Touchy.js).
  - Following new touch actions are now possible: panning (two fingers), zoominng (two fingers).
* 2020-07-03
  - Fixed the selectedVerticesOnPolyon(Polygon) function: non-selectable vertices were selected too, before.
  - Added the CubicBezierPath.getBounds() function.
  - BezierPath: Made the private helper functions \_locateUIndex, adjustPredecessorControlPoint,
    adjustSuccessorControlPoint to a private function.
  - Added the BezierPath.getBounds() function.
  - Added draw.rect(Vertex,number,number) function.
* 2020-07-01 (1.8.1)
  - Tweaked the pattern gradient demo (rotation and scale).
  - Prepared a new demo: with THREE.js.
  - Changed the scope of BezierPath.fromJSON (is now static, was an instance method before).
* 2020-06-22 (1.8.0)
  - Added the rasterScaleX and rasterScaleY config params.
  - Added a context.clearRect() call to the clear() function; clearing with alpha channel did not work as expected.
* 2020-06-09
  - Defined new private interface IDraggable and move the Draggable class into the main class.
  - Refactored the JSDoc layout template for larger screens.
  - Fixed the problem of undocumented main class (no docs in HTML were generated).
* 2020-05-26 (pap's 74s birthday)
  - Added functions Vertex.addX(number) and Vertex.addY(number).
* 2020-05-25
  - Added the Circle.vertAt and the Circle.tangentAt functions.
  - Added the basics for the gradient-pattern demo.
* 2020-05-20
  - Created a script for the minmal npm package.
* 2020-05-18
  - Added the Triangle.getIncenter() function.
  - Added VoronoiCell.toPolygon() in the demos.
  - Added proper JSDoc tags to the VoronoiCell class.
* 2020-05-15 (v1.7.8)
  - Moved the bezier-autoadjust handling to a private helper function. Fixed the auto-update of last control point.
* 2020-05-12 (v1.7.7)
  - The VertTuple.angle(line) param was still not optional. Changed that.
  - Added the geomutils helper. First helper function: nsectAngle. (moved this from the demos).
  - Added Triangle.getIncircularTriangle().
  - Added Triangle.getIncircle().
  - Changed the license vom CC-BY-4.0 to MIT.
* 2020-05-12 (v1.7.6)
  - Fixed the annoying [Ctrl]-pressed bug; the reason was the missing key-up evend after [Ctrl]+[t].
    This was browser-specific.
  - Drawing any handles (square, circle, diamond) with lineWidth 1 now; this was not reset before.
* 2020-05-11 (v1.7.5)
  - PlotBoilerplat.viewport() now return a proper Bounds instance.
  - Added new class Bounds (implementing IBounds and XYDimension).
  - Renamed interface Bounds to IBounds.
  - Fixed a bug in the Triangle.getCircumcircle function (center was not cloned).
  - Updated all demos with the new Circle class.
  - Removed the BezierPath.\_roundToDigits helper function. Using Number.toFixed instead.
  - Added proper JSDoc class specifications to Bounds, Triangle and Circle.
* 2020-05-09 (v1.7.4)
  - Included the Circle class from the demos into the plot-boilerlplate core repertoire.
* 2020-05-05
  - Added the 'lineWidth' param to the circle(...) function.
  - Finished the circle-in-convex-polygog demo.
* 2020-05-04
  - Added a stub for the circle-in-convex-polygon demo.
  - Fixed a serious bug in the VertTuple.pointDistance function.
  - Refactored the VertTuple class a bit. Added missing JSDoc tags.
  - Added the VertTuple.getClosestPoint(Vertex) function.
* 2020-04-27
  - Added the Urquhart graph demo.
* 2020-04-08
  - Fixed the MouseHandler's click event (internally fired a 'mouseup' event).
  - The new version always installs internal listenrs to track drag events even
    if there is no external drag listener installed (1.1.0).
* 2020-04-07 (v1.7.1)
  - Fixed an error in the draw.grid(...) function. Non-rastered grids were not properly drawn on zoom and
    pan comibinations.
* 2020-04-06
  - Fixed the radius error in the drawutils.circleHandle function. The radius parameter had no effect and circle
    handles were always rendered with radius 3.
* 2020-04-03 (v1.7.0)
  - Fixed broken SVG export (after porting to TS).
  - Fixed broken canvas resizer (after porting to TS).
* 2020-04-01
  - Refactored Jekyll config to work with the new paths (post Typescript migration).
  - Refactored the demos to work with the new paths (post Typescript migration).
* 2020-03-31
  - Reconfigured the typescript compiler for es5.
  - Reconfigured webpack.
  - Tweaked the main demo for some moved files.
* 2020-03-30
  - Ported the main class of PlotBoilerplate to Typescript.
  - Moved the RectSelector from the main class to the demo section.
  - Added a utils wrapper that intializes the GUI (dat.gui.GUI).
  - Updated the logistic-map demo.
* 2020-03-28
  - Ported following classes to Typescript: KeyHandler.
* 2020-03-25
  - Ported following classes to Typescript: drawutils, drawutilsgl, Grid, VEllipse, Triangle, SVGBuilder, MouseHandler.
* 2020-03-24
* Ported following classes to Typescript: CubicBezierCurve, BezierPath, Polygon, gup.
* Added VertTuple<T> to solve the subclassing and clonable problem.
* 2020-03-23
  - Ported following classes to Typescript: Vertex, Line, VertexAttr, VertexListeners.
* 2020-03-17
  - Added the Triangle.toPolygon() function.
  - Added proper JSDoc tags to the Triangle class.
  - Added a new demo: ported the Morley-Triangle visualization (from an older project).
  - Fixed an issue in the safeMergeKeys function ('funcion' type was flawed).
* 2020-03-16
  - Added Triangle.fromArray(Array) function.
  - The Line.angle(Line) parameter is now optional. The baseline (x-axis) will be used if not defined.
* 2020-02-29
  - Added the VertexAttr.selectable attribute.
* 2020-02-22
  - Added 'return this' to VertexListeners addDragListener, addDragStartListener, addDragEnd functions (for chanining).
* 2020-02-11
  - Added 'return this' to the BezierPath.scale(Vertex,number) and to the .translace(Vertex) functions.
* 2020-02-10
  - Added the CubixBezierCurve.reverse() function.
  - Fixed the CubicbezierCurve.translate(Vector) function (returning 'this' was missing).
* 2020-02-09
  - Added the BezierPath.getSubPathAt(number,number) function.
* 2020-02-08
  - Added the CubicBezierCurve isInstance(any) function.
* 2020-02-07
  - Added function BezierPath.locateCurveByEndPoint( Vertex ).
  - Added handling for the end- and end-control-points of non-cirular Bézier paths (was still missing).
  - Added functions Vertex.invX() and Vertex.invY().
  - Added the CubicBezierCurve.getSubCurveAt(number,number) function.
  - Fixed a drag-amount bug in the move handling of end points of Bezier paths (control points was not properly moved when non circular).
  - Fixed a serious bug in the arc lenght calculation (length was never reset, urgh).
* 2020-01-13
  - Added a 'CanvasPointList' to the demos to make point count managing easier.
* 2020-01-09
  - Added the 'lineWidth' param to the draw.ellipse(...) function.
  - Fixed a bug in the Color.parse(string) function. Hex color with three elements were consideres faulty.
  - Added a getContrastColor(color) helper function to the demo directory. This requires a color object, not a string!
* 2019-12-20
  - Added the 'lineWidth' param to the draw.polyline(...) function.
* 2019-12-18
  - Added the draw.quadraticBezier(...) function (for the sake of approximating Lissajous curves).
* 2019-12-15
  - Added the Line.moveTo(Vertex) fucnction.
* 2019-12-11
  - Added the 'color' param to the draw.label(...) function.
  - Fixed the draggable-intersection-point issue in the line-point-distance demo.
  - Added a working bark-beetle-tunnel demo to the line-point-distance demo. There was an odering problem.
* 2019-12-09
  - Fixed the Triangle.determinant() function. The calculation was just wrong.
  - Removed an unnecesary if-condition from the VoronoiCell.\_calculateOpenEdgePoint(...) helper function.
  - Extended the line-point-distance demo with some toy features.
* 2019-12-08 (1.6.3)
  - Fixed a css scale bug in the viewport() function.
  - Added the drawconfig UI panel (line colors and line widths).
* 2019-12-07
  - Added a fallback CSS raster (inline PNG).
  - Added the drawConfig for lines, polygons, ellipse, triangles, bezier curves and image control lines.
  - Added a new demo for bezier spline interpolation.
* 2019-12-04 (1.6.0)
  - Added relative positioned zooming.
  - Added offsetX and offsetY params.
  - Added an 'Set to fullsize retina' button to the GUI config.
  - Added the Vector.inv() function.
* 2019-12-03
  - Fixed a bug in the Bézier perpenicular demo (arc length were not updated after changes or before redraw).
* 2019-12-02 (1.5.1)
  - Fixed the CubicBezierCurve.updateArcLength function. It used the wrong pointAt function.
  - Added the Bézier perpendicular demo (11).
  - Added the demo for simple tween animations (using GSAP).
* 2019-11-22
  - Added the Polygon.rotate(number,Vertex) function.
  - Fixed a bug in Vertex.rotate(...).
  - Added a second workaround for th drawImage bug in Safari.
  - Added a GSAP/TweenMax animation example.
* 2019-11-21
  - Fixed a bug in the rotate(...) function (elements were moved).
* 2019-11-19
  - Fixed a bug in the resizeCanvas function; retina resolution was not possible.
* 2019-11-18 (1.5.0)
  - Added the Triangle class as a direct drawable class to the PlotBoilerplate (was in the demos only before).
  - Added the drawutils.polyline(Vertex[],boolean,color) function.
  - The PlotBoilerplate.add(...) function now works with arrays, too.
  - Added the \_handleColor helper function to determine the render color of non-draggable vertices.
  - Fixed the BezierPath.clone function: adjustCircular attribute was not cloned.
  - Added the Vertex.rotate(number,Vertex) function.
  - Added the BezierPath.rotate(number,Vertex) function.
  - Non-draggable vertices are now be excluded by the locateNear(...) function. There is no use locating
    non-draggable vertcies as they may block underlying draggable vertices.
* 2019-11-13
  - Fixed an issue with the mouse-sensitive area around vertices (were affected by zoom).
* 2019-11-07
  - Added Vertex.toSVGString(object) function.
  - Added Polygon.Added toCubicBezierPath(number) function.
  - Added SVG export for postDraw-rendering in the Voronoi demo.
  - Added the 'Triangle' style class to the SVGBuilder.
* 2019-11-06
  - Added fetch.num, fetch.val, fetch.bool, fetch.func functions for easier config props fetching.
* 2019-10-30
  - Renamed the demo/VertexAnimator to demo/VertexAnimator.Linear.
  - Added a new class demo/VertexAnimator.Cirular.
* 2019-10-25
  - Added proper JSDoc comments to the Voronoi cell code.
  - Polygons are no longer drawn with dashed lines (solid lines instead).
  - Added the Polygon.scale(number,Vertex) function.
  - Fixed a serious bug in the VoronoiCell.toPathArray function; cell with only one vertex (extreme cases) returned invalid arrays which broke the rendering.
* 2019-10-03
  - Added the {draw,drawgl}.beginDrawCycle fuction.
* 2019-09-18
  - Added an experimental GL drawing stub (drawgl).
* 2019-09-12
  - Added JSDoc compliant comments to the (inofficial) Triangle class.
* 2019-09-11
  - (Inofficial) Added the Triangle.scaleToCentroid(Number) function (used by the walking triangle demo).
* 2019-09-02
  - Added the Line.add( Vertex ) function.
  - Added the Vector.perp() function for calculating perpendiculars (required for the upcoming GLSL support).
  - Added the Vector.inverse() function.
  - Added the Line.denominator( Line ) function.
  - Fixed a severe error in the Line.intersection( Line ) function (class Point was renamed to Vertex).
* 2019-04-28
  - Added Math.round to the dot() drawing parameters to really draw a singlt dot.
  - Added the preClear callback param (called before the canvas was cleared on redraw and before any elements are drawn).
  - Fixed a bug in the Line.sub( Vertex ) function (was not working).
* 2019-04-27
  - Fixed a severe drawing bug in the arrow(...) function. Scaling arrows did not work properly.
  - Changed the vectorfield demo to a more beautiful one.
  - Watched the ending of star trek discovery when doing that.
* 2019-04-24
  - Added the Vertex.randomVertex(ViewPort) fuction.
  - Added the VertexAnimator for demos.
* 2019-04-17
  - Added the PlotBoilerplate.removeVertex(Vertex,boolean) function.
* 2019-04-16
  - Added the PlotboilerPlate.remove(drawable) function.
  - Added the draw.cubicBezierPath(path,color) function.
  - Added the Voronoi and Delaunay demo.
* 2019-04-12
  - Added the PlotBoilerplate.drawConfig with 'drawVerices' attribute.
  - Extended the gui a bit.
* 2019-04-11
  - Added the 'drawGrid' config param.
  - Added the simple animation demo.
  - Added the PlotBoilerplate.viewport() function.
* 2019-04-07
  - Re-styled the website, optimized the css, merged jekyll-css with jsdoc-css.
* 2019-04-03
  - Fixed wrong positioning on touch devices when canvas is not located at (0,0). Touch-drag is now working.
  - Tweaked the fit-to-parent function. This is now working and respecting paddings and borders.
  - Added a fix for Touchy.js: e.preventDefault() to avoid window scrolling during element drag (touch-move).
* 2019-03-28
  - Mouse wheel zoom now calls e.preventDefault().
  - Added the unminified-webpack-plugin.
  - Removed the overlay-dialog from the plot-boilerplate as it was not used at all.
* 2019-03-27
  - Renamed the repository from plot-boilerplate to plotboilerplate.
* 2019-03-25
  - Moved the collection demo scripts to demo/.
* 2019-03-23
  - Added more JSDoc code.
  - Changed the default value of config param 'drawOrigin' to false.
  - Swapped the BezierPath.getPoint and getPointAt to match the semantics with linear interpolation in the Line class. This makes the class incompatible with older versions! Thus: BezierPath version 2.0.
* 2019-03-20
  - Added JSDoc inline documentation for these classes: Vertex, Line, Vector, VertexAttr, VertexListeners, Polygon.
* 2019-02-23
  - Removed the 'rebuild' function as it had no purpose.
  - Added scaling of the click-/touch-tolerance with the CSS scale.
  - Added the helper function PlotBoilerplate.utils.buildArrowHead(Vertex,Vertex,Number,Number,Number).
  - Added the Vector.toSVGString function, overriding Line.toSVGString.
  - Tweaked the initial vector field demo a little bit (it's really fancy now but still not yet finished).
* 2019-02-20
  - Removed the 'loadFile' entry from the GUI as it was experimental and never in use.
* 2019-02-19
  - Added the Vertex.difference(Vertex) function.
  - Put the TouchHandler back because it is badly coded and rubbish. Used Touchy.js instead.
  - Added two new constants: DEFAULT_CLICK_TOLERANCE and DEFAULT_TOUCH_TOLERANCE. Touch devices have larger tolerance now.
  - Added the second param to the locatePointNear(Vertex,Number) function.
* 2019-02-14
  - Added the console for debugging (setConsole(object)).
* 2019-02-10
  - Fixed a draggable-bug in PBImage handling (scaling was not possible).
  - Added the 'enableTouch' option (default is true).
* 2019-02-06
  - Vertices (instace of Vertex) can now be added using PlotBoilerplate.add(Object).
  - Added the 'draggable' attribute to the vertex attributes.
  - Added the point-to-line distance demo.
* 2019-02-03
  - Removed the drawBackgroundImage() function, with had no purpose at all. Just add an image to the drawables-list.
* 2019-02-02
  - Added the 'canvasWidthFactor' and 'canvasHeightFactor' params.
* 2019-01-30
  - Fixed the offsetAdjustXPercent and offsetAdjustYPercent bug. They are working properly now.
  - Added the Vector class (subclass of Line).
  - Added the draw.arrow(Vertex,Vertex,color) function for drawing arrow heads.
  - Added the Vertex.setX(Number) and Vertex.setY(Number) functions.
  - Added the PBImage type.
  - Added image rendering.
* 2019-01-14
  - Added params 'drawBezierHandleLines' and 'drawBezierHandlePoints'.
  - Added the 'redraw' param to the add() function.
* 2018-12-30
  - Added the PlotBoilerplate.RectSelector helper for selecting sub
    areas of the current plot without interfering with the current
    plot progress.
* 2018-12-29
  - Renamed the 'autoCenterOffset' param to 'autoAdjustOffset'.
  - Added the params 'offsetAdjustXPercent' and 'offsetAdjustYPercent'.
* 2018-12-29
  - Fixed a bug in the Feigenbaum demo: y was plotted inverted.
* 2018-12-28
  - Removed the unused 'drawLabel' param.
  - Added the 'enableMouse' and 'enableKeys' params.
* 2018-12-21
  - Added the Vertex.inv() function.
  - Fixed the grid offset problem. Grid is now always drawn in visible center.
  - Logarithmic reduction of the grid is now working.
  - Added a small test case for balanced binary search trees.
  - Refactored the redraw() function into several sub-functions for drawing several elements.
* 2018-12-20
  - Fixed a bug in the location-transformation (did not consider the CSS scale yet).
* 2018-12-19
  - Added cssScaling for the canvas. This allows other resolutions than 1:1.
* 2018-12-18
  - Added the config.redrawOnResize param.
  - Added the config.defaultCanvasWidth and config.defaultCanvasHeight params.
  - Fixed the action bugs for the default overlay buttons (OK and cancel had no action assigned).
  - Added a default function for creating a dat.gui interface.
* 2018-12-09
  - Minimal zoom is now 0.01.
  - Added Grid.utils.baseLog(Nnumber,Number) and Grid.utils.mapRasterScale(Number,Number).
  - Bézier control points are not selectable any more.
  - Basic SVG export works now.
  - Added toSVGString to VEllipse class.
  - Added to SVGString to Polygon class.
  - Added a Line class.
  - Changed Bézier control points rendering.
  - Added a demo plot: main-feigenbaum.html.
* 2018-12-06
  - Changed the CTRL key to the ALT key (for panning).
  - Fixed a translate an scale issue in the SVG builder.
  - The constructor's config-param is in use now.
* 2018-12-05
  - Added the Vertex.sub(x,y) function.
  - Added the Line class.
  - Moved the demo code (Line, Polygon, Bezier, Circle) to the index.js file.
  - Expanded the Vertex.add(...) function. Now add(number,number) and add(Vertex) are allowed.
* 2018-12-04
  - Added a simple SVGBuilder.
* 2018-11-30
  - Added the mouse position display.
* 2018-11-28
  - Extended the VertexAttr class (extended the event params by the affected vertex).
  - Added BezierPath.locateCurveBy\*Point(Vertex) functions.
  - Added the mousewheel listener to the MouseHandler.
  - Added mousewheel zoom.
  - Added the VEllipse (vertex-ellipse) class and ellipse drawing.
  - Added the Grid class.
  - Added the grid() function to the draw class.
* 2018-11-27
  - Added an attribute model to the VertexAttr class.
  - Changing bezier path points with holding down 'y'+click is now possible (bezier-autoadjust).
  - Added a new function to the draw class: diamondHandle.
* 2018-11-20
  - Bézier curve does now auto adjust when dragging path points and control points.
  - BezierPath implementation now support circular paths.
  - Fixed some issues in the dat.gui interface configuration. Axis independent scaling works now.
* 2018-11-19
  - Re-animated the CubicBezierCurve class and the BezierPath class.
  - Added multi-select and multi-drag option.
  - Made elements selectable (with holding SHIFT).
  - Added panning (move the canvas origin by pressing CTRL and drag).
  - Implemented zoom into dat.gui interface.
* 2018-11-17
  - Added the Polygon class.
  - Added npm/webpack for compiling and code minification.
* 2018-11-11
  - Added a simple KeyHandler for receiving key events.
* 2018-11-10
  - Renamed the js/ direcotory to src/.
* 2018-11-09
  - Refactored the main script to a class.
* 2018-10-31
  - Added the Vertex class from an older project.
  - Added the VertexAttr class (not yet in use).
  - Added the VertexListeners class (not yet in use).
  - Added the MouseListener from an older project.
  - Can drag vertices around now.
* 2018-10-23
  - Init.
