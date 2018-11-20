# Plotting boilerplate
For Javascript and canvas with 2d-context.

![Current demo](screenshot-20181031_1.png "Current demo")

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


### Todos
* Add pad/phone support.
* Implement zoom into dat.gui interface.
* Implement optional canvas zoom.
* Implement optional canvas rotation.
* SVG export.


### Changelog
* 2018-11-20
  * Bézier curve does now auto adjust when dragging path points and control points.
  * BezierPath implementation now support circular paths.
  * Fixed some issues in the dat.gui interface configuration. Axis independent scaling works now.
* 2018-11-19
  * Re-animated the CubicBezierCurve class and the BezierPath class.
  * Added multi-select and multi-drag option.
  * Made elements selectable (with holding SHIFT).
  * Added panning (move the canvas origin by pressing CTRL and drag).
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