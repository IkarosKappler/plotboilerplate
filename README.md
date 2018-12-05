# Plotting boilerplate
For Javascript and canvas with 2d-context.

![Current demo](screenshot-20181128_0.png "Current demo")

[Live Demo](https://www.int2byte.de/public/plot-boilerplate/main-dist.html "Live Demo")

## Install webpack
This will install the npm-webpack package for you from the package.json file.
~~~~
 $ npm install
~~~~


## Run webpack
This will generate the ./dist/plot-boilerplate.min.js file for you
from the sources code files in ./src/*.
~~~~
 $ npm run webpack
~~~~

## The HTML file
See main-dist.html


## Usage
 * [SHIFT] + [Click] : Select vertex
 * [Y] + [Click]: Toggle Bézier auto-adjustment
 * [CTRL] + [Mousedown] + [Drag] : Pan the area
 * [Mousewheel-up] : Zoom in
 * [Mousewheel-down] : Zoom out


### Todos
* Add pad/phone support.
* Implement optional canvas zoom.
* Implement optional canvas rotation.
* SVG export.
* Make Bézier Curves dividable.
* Implement snap-to-grid.
* Add toSVGString to VEllipse class.
* Add toSVGString to Polygon class.


### Changelog
* 2018-12-04
  * Added a simple SVGBuilder.
* 2018-11-30
  * Added the mouse position display.
* 2018-11-28
  * Extended the VertexAttr class (extended the event params by the affected vertex).
  * Added BezierPath.locateCurveBy*Point(Vertex) functions.
  * Added the mousewheel listener to the MouseHandler.
  * Added mousewheel zoom.
  * Added the VEllipse (vertex-ellipse) class and ellipse drawing.
  * Added the Grid class.
  * Added the grid() function to the draw class.
* 2018-11-27
  * Added an attribute model to the VertexAttr class.
  * Changing bezier path points with holding down 'y'+click is now possible (bezier-autoadjust).
  * Added a new function to the draw class: diamondHandle.
* 2018-11-20
  * Bézier curve does now auto adjust when dragging path points and control points.
  * BezierPath implementation now support circular paths.
  * Fixed some issues in the dat.gui interface configuration. Axis independent scaling works now.
* 2018-11-19
  * Re-animated the CubicBezierCurve class and the BezierPath class.
  * Added multi-select and multi-drag option.
  * Made elements selectable (with holding SHIFT).
  * Added panning (move the canvas origin by pressing CTRL and drag).
  * Implemented zoom into dat.gui interface.
* 2018-11-17
  * Added the Polygon class.
  * Added npm/webpack for compiling and code minification.
* 2018-11-11
  * Added a simple KeyHandler for receiving key events.
* 2018-11-10
  * Renamed the js/ direcotory to src/.
* 2018-11-09
  * Refactored the main script to a class.
* 2018-10-31
  * Added the Vertex class from an older project.
  * Added the VertexAttr class (not yet in use).
  * Added the VertexListeners class (not yet in use).
  * Added the MouseListener from an older project.
  * Can drag vertices around now.
* 2018-10-23
  * Init.
  

### Dependencies
* HTML5 Canvas
* HTML5 WebGL



### Used Libraries
* dat.gui