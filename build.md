[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# An interactive Javascript Plotting Boilerplate
For plotting visual 2D data with Javascript and HTML canvas (in 2d-context).

This is a simple collection of useful functions I am repetitively using for
visualizing 2D geometries. Basic features are
 * adding elements like
   * [vertices](https://plotboilerplate.io/docs_typedoc/classes/vertex.html "Vertex class")
     	([example](https://plotboilerplate.io/repo/demos/basic-Vertex "Vertex example"))
   * [lines](https://plotboilerplate.io/docs_typedoc/classes/line.html "Line class")
     	([example](https://plotboilerplate.io/repo/demos/basic-Line "Line example"))
   * [vectors](https://plotboilerplate.io/docs_typedoc/classes/vector.html "Vector class")
        ([example](https://plotboilerplate.io/repo/demos/basic-Vector "Vector example"))
   * [triangles](https://plotboilerplate.io/docs_typedoc/classes/triangle.html "Triangle class")
        ([example](https://plotboilerplate.io/repo/demos/basic-Triangle "Triangle example"))
   * [curves](https://plotboilerplate.io/docs_typedoc/classes/cubicbeziercurve.html "CubicBezierCurve class")
        ([example](https://plotboilerplate.io/repo/demos/basic-BezierPath "BezierPath example"))
   * [circles](https://plotboilerplate.io/docs_typedoc/classes/circle.html "Circle class")
        ([example](https://plotboilerplate.io/repo/demos/basic-Circle "Circle example"))
   * [circle sectors](https://plotboilerplate.io/docs_typedoc/classes/circlesector.html "CircleSector class")
        ([example](https://plotboilerplate.io/repo/demos/basic-CircleSector "CircleSector example"))
   * [polygons](https://plotboilerplate.io/docs_typedoc/classes/polygon.html "Polygon class")
        ([example](https://plotboilerplate.io/repo/demos/basic-Polygon "Polygon example"))
   * [ellipses](https://plotboilerplate.io/docs_typedoc/classes/vellipse.html "VEllipse class")
        ([example](https://plotboilerplate.io/repo/demos/basic-VEllipse "VEllipse example"))
   * [images](https://plotboilerplate.io/docs_typedoc/classes/pbimage.html "PBImage class")
        ([example](https://plotboilerplate.io/repo/demos/basic-PBImage "PBImage example"))
 * configuration of the canvas behavior (fullsize, interaction, raster)
 * mouse interaction (zoom, pan, drag elements)
 * keyboard interaction
 * touch interaction for dragging vertices (mobile devices: zoom, pan, drag elements)


The compressed library has 103kb.


## Install the package via npm
~~~sh
   $ npm i plotboilerplate # Installs the package
~~~



## The HTML file
For a full example see [main-dist.html](https://github.com/IkarosKappler/plotboilerplate/blob/master/main-dist.html "main-dist.html") :
~~~html
   <canvas id="my-canvas">
      Your browser does not support the canvas tag.
   </canvas>
~~~
The element canvas will be used to draw on.


## The javascript
~~~javascript
   var pb = new PlotBoilerplate( {
       canvas		: document.getElementById('my-canvas'),
       fullSize         : true
    } );
~~~


## Add elements to your canvas
~~~javascript
   // Create two points:
   //   The origin is at the visual center by default.
   var pointA = new Vertex( -100, -100 );
   var pointB = new Vertex( 100, 100 );
   pb.add( new Line(pointA,pointB) );

   // When point A is moved by the user
   //   then move point B in the opposite direction
   pointA.listeners.addDragListener( function(e) {
   	pointB.sub( e.params.dragAmount );
	pb.redraw();
   } );
   
   // and when point B is moved
   //   then move point A
   pointB.listeners.addDragListener( function(e) {
   	pointA.sub( e.params.dragAmount );
	pb.redraw();
   } );
~~~

### Typescript
<details>

 <summary>Using Typescript</summary>
 
 ~~~typescript
    // Usage with Typescript could look like this
    import { PlotBoilerplate, Vertex, Line } from "plotboilerplate";
 
    globalThis.addEventListener( 'load', () => {
    
       const pointA : Vertex = new Vertex( 100,-100);
       const pointB : Vertex = new Vertex(-100, 100);
       console.log( pointA, pointB );

       const line : Line = new Line( pointA, pointB );
    
       const pb : PlotBoilerplate = new PlotBoilerplate( {
   	   canvas     : document.getElementById('my-canvas'),
	   fullSize   : true
       } );
    
       pb.add( line );

    } );
 ~~~
 A full working demo repository about the [Usage with Typescript is here](https://github.com/IkarosKappler/plotboilerplate-typescript-example "usage with Typescript is here").

</details>


### Screenshot

![Simple Demo](https://plotboilerplate.io/repo/screenshots/screenshot-20190220_3_simpledemo.png "The simple demo")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/00-simple/index.html" title="And the simple demo is here">And the simple demo is here</a>



#### API
See [API Documentation](https://plotboilerplate.io/docs.html "API Documentation") for details.


## Screenshot
![Current demo](https://plotboilerplate.io/repo/screenshots/preview-image-large.png "Current demo")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/main-dist.html" title="See the demo">See the demo</a>


## Examples and Demos
[Examples and Demos](examples.md "Examples and Demos")


## Initialization parameters

<div class="table-wrapper" markdown="block">

| Name | Type | Default | Description |
|---|---|---|---|
| `canvas`| _HTMLCanvasElement_ \| _string_ | `null` | The canvas or its query selector string (required). |
| `fullsize`| _boolean_ | `true`| If `true`, then the canvas will always claim tha max available screen size. |
| `fitToParent`| _boolean_ | `true`| If `true`, then the canvas will alway claim the max available parent container size. |
| `scaleX`| _number_ | `1.0` | The initial horizontal zoom. Default is 1.0. |
| `scaleY`| _number_ | `1.0` | The initial vertical zoom. Default is 1.0. |
| `offsetX`| _number_ | `0.0` | The initial offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values. |
| `offsetY`| _number_ | `0.0`| The initial offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values. |
| `drawGrid`| _boolean_ | `true` |  Specifies if the raster should be drawn. |
| `rasterScaleX` | _number_ | `1.0` | Define the default horizontal raster scale. |
| `rasterScaleY` | _number_ | `1.0` | Define the default vertical raster scale. |
| `rasterGrid`| _boolean_ | `true` | If set to true the background grid will be drawn rastered. |
| `rasterAdjustFactor`| _number_ | `2.0` | The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step). |
| `drawOrigin`| _boolean_ | `false` | Draw a crosshair at (0,0). |
| `autoAdjustOffset`| _boolean_ | `true` | When set to true then the origin of the XY plane will be re-adjusted automatically (see the params offsetAdjust{X,Y}Percent for more). |
| `offsetAdjustXPercent`| _number_ | `50` | The x- and y- fallback position for the origin after resizing the canvas. |
| `offsetAdjustYPercent`| _number_ | `50` | The x- and y- fallback position for the origin after resizing the canvas. |
| `defaultCanvasWidth`| _number_ | `1024`| The canvas size fallback if no automatic resizing is switched on. |
| `defaultCanvasHeight`| _number_ | `768` | The canvas size fallback if no automatic resizing is switched on. |
| `canvasWidthFactor`| _number_ | `1.0` | Two scaling factors (width and height) upon the canvas size. In combination with cssScale{X,Y} this can be used to obtain sub pixel resolutions for retina displays. |
| `canvasHeightFactor`| _number_ | `1.0` | Two scaling factors (width and height) upon the canvas size. In combination with cssScale{X,Y} this can be used to obtain sub pixel resolutions for retina displays. |
| `cssScaleX`| _number_ | `1.0` | Visually resize the canvas using CSS transforms (scale x). |
| `cssScaleY`| _number_ | `1.0` | Visually resize the canvas using CSS transforms (scale y). |
| `cssUniformScale`| _boolean_ | `1.0` |  If set to true only cssScaleX applies for both dimensions. |
| `autoDetectRetina` | _boolean_ | `true` | When set to true (default) the canvas will try to use the display's pixel ratio. |
| `backgroundColor`| _string_ | `#ffffff` | A background color (CSS string) for the canvas. |
| `redrawOnResize`| _boolean_ | `true` | Switch auto-redrawing on resize on/off (some applications might want to prevent automatic redrawing to avoid data loss from the drae buffer).|
| `drawBezierHandleLines`| _boolean_ | `true` | Indicates if Bézier curve handle points should be drawn. |
| `drawBezierHandlePoints`| _boolean_ | `true` | Indicates if Bézier curve handle points should be drawn. |
| `preClear`| _function_ | `null` | A callback function that will be triggered just before the draw function clears the canvas (before anything else was drawn).|
| `preDraw`| _function_| `null` | A callback function that will be triggered just before the draw function starts. |
| `postDraw`| _function_| `null` | A callback function that will be triggered right after the drawing process finished.|
| `enableMouse`| _boolean_ | `true` | Indicates if the application should handle touch events for you. |
| `enableTouch`| _boolean_ | `true` | Indicates if the application should handle touch events for you. |
| `enableKeys`| _boolean_ | `true` | Indicates if the application should handle key events for you. |
| `enableMouseWheel`| _boolean_ | `true` | Indicates if the application should handle mouse wheelevents for you. |
| `enableSVGExport`| _boolean_ |  `true` | Indicates if the SVG export should be enabled (default is true). |    
| `enableGL`| _boolean_ | `false` | [Experimental] Indicates if the application should use the experimental WebGL features. |

</div>


#### Example
~~~javascript
 var pb = new PlotBoilerplate( {
  // HTMLElement | string
  //   Your canvas element in the DOM (required).
  canvas			: document.getElementById('my-canvas'),

  // boolean
  //   If set to true the canvas will gain full window size.
  fullSize              	: true,

  // boolean
  //   If set to true the canvas will gain the size of its parent
  //   container.
  // @overrides fullSize
  fitToParent           	: true,

  // float
  //   The initial zoom. Default is 1.0.
  scaleX                	: 1.0,
  scaleY                	: 1.0,

  // float
  //   The initial offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
  offsetX                	: 0.0,
  offsetY                	: 0.0,

  // Specifies if the raster should be drawn.
  drawGrid                : true,

  // If set to true the background grid will be drawn rastered.
  rasterGrid              : true,

  // float
  //    The exponential limit for wrapping down the grid.
  //    (2.0 means: halve the grid each 2.0*n zoom step).
  rasterAdjustFactor    	: 2.0,

  // Draw a crosshair at (0,0).
  drawOrigin              : false,

  // boolean
  //   When set to true then the origin of the XY plane will
  //   be re-adjusted automatically (see the params
  //    offsetAdjust{X,Y}Percent for more).
  autoAdjustOffset      	: true,
  // float
  //   The x- and y- fallback position for the origin after
  //   resizing the canvas.
  offsetAdjustXPercent  	: 50,
  offsetAdjustYPercent  	: 50,

  // int
  //   The canvas size fallback if no automatic resizing
  //   is switched on.
  defaultCanvasWidth    	: 1024,
  defaultCanvasHeight   	: 768,

  // float
  //   Two scaling factors (width and height) upon the canvas size.
  //   In combination with cssScale{X,Y} this can be used to obtain
  //   sub pixel resolutions for retina displays.
  canvasWidthFactor     	: 1.0,
  canvasHeightFactor    	: 1.0,

  // float
  //   Visually resize the canvas using CSS transforms (scale).
  cssScaleX	       	        : 1.0,
  cssScaleY	       	        : 1.0,

  // boolean
  //   If set to true only cssScaleX applies for both dimensions.
  cssUniformScale               : true,

  // boolean
  //   When set to true (default) the canvas will try to use the display's pixel ratio.
  autoDetectRetina              : true,

  // string
  //   A background color (CSS string) for the canvas.
  backgroundColor       	: '#ffffff',

  // boolean
  //   Switch auto-redrawing on resize on/off (some applications
  //   might want to prevent automatic redrawing to avoid data
  //   loss from the drae buffer).
  redrawOnResize        	: true,

  // boolean
  //   Indicates if Bézier curve handles should be drawn (used for
  //   editors, no required in pure visualizations).
  drawBezierHandleLines 	: true,

  // boolean
  //   Indicates if Bézier curve handle points should be drawn.
  drawBezierHandlePoints 	: true,

  // function
  //   A callback function that will be triggered just before the
  //   draw function clears the canvas (before anything else was drawn).
  preClear              	: function() { console.log('before clearing the canvas on redraw.'); },
	
  // function
  //   A callback function that will be triggered just before the
  //   draw function starts.
  preDraw               	: function() { console.log('after clearing and before drawing.'); },

  // function
  //   A callback function that will be triggered right after the
  //   drawing process finished.
  postDraw              	: function() { console.log('after drawing.'); },

  // boolean
  //   Indicates if the application should handle mouse events for you.

  enableMouse           	: true,
  // boolean
  //   Indicates if the application should handle touch events for you.
  enableTouch           	: true,

  // boolean
  //   Indicates if the application should handle key events for you.
  enableKeys            	: true,

  // boolean
  //   Indicates if the application should handle mouse wheelevents for you.
  enableMouseWheel              : true,

  // Indicates if the SVG export should be enabled (default is true). 
  enableSVGExport               : true,

  // boolean
  //   Indicates if the application should use the experimental WebGL features.
  enableGL                      : false
 } );
~~~					  



## Events
The Vertex class has basic drag event support:
~~~javascript
 var vert = new Vertex(100,100);
 vert.listeners.addDragListener( function(e) {
   // e is of type Event.
   // You are encouraged to use the values in the object e.params
   console.log( 'vertex was dragged by: ',
   	        'x='+e.params.dragAmount.x,
	        'y='+e.params.dragAmount.y );
 } );
~~~



### The e.params object
~~~javascript
 {
  // The canvas that fired the event.
  element : [HTMLElement],
    
  // The event name.
  //   Default: 'drag'
  name : string,

  // The current drag position.
  pos : { x : number, y : number },

  // A mouse button indicator (if mouse event).
  //    0=left, 1=middle, 2=right
  button : number,

  // A flag indicating if event comes from left mouse button.
  leftButton : boolean,

  // A flag indicating if event comes from middle mouse button.
  middleButton : boolean,

  // A flag indicating if event comes from right mouse button.
  rightButton : boolean,

  // A mouse-down-position: position where the dragging
  //   started. This will not change during one drag process.
  mouseDownPos : { x : number, y : number },

  // The most recent drag position (position before
  //   current drag step).
  draggedFrom : { x : number, y : number },

  // True if this is a drag event (nothing else available the moment).
  wasDragged : boolean,

  // The x-y-amount of the current drag step.
  //   This is the difference between the recent drag step
  //   and the actual drag position.
  dragAmount : { x : number, y : number }
 }
~~~

<div class="table-wrapper" markdown="block">

| Name | Type | Example value | Description |
|---|---|---|---|
| `element`| _HTMLCanvasElement_ | `[HTMLCanvasElement]` | The canvas that fired the event. |
| `name`| _string_ | `drag` | The event name (default is 'drag'). |
| `pos`| _position_ | `{ x : 20, y : 50 }` | The current drag position. |
| `button`| _number_ | `0` | A mouse button indicator (if mouse event). 0=left, 1=middle, 2=right |
| `leftButton`| _boolean_ | `true` | A flag indicating if event comes from left mouse button. |
| `middleButton`| _boolean_ | `false` | A flag indicating if event comes from middle mouse button. |
| `rightButton`| _boolean_ | `false` | A flag indicating if event comes from right mouse button. |
| `mouseDownPos`| _position_ | `{ x : 0, y : 20 }` | A mouse-down-position: position where the dragging started. This will not change during one drag process. |
| `draggedFrom`| _position_ | `{ x : 10, y : -5 }` | The most recent drag position (position before current drag step). |
| `wasDragged`| _boolean_ | `true` | True if this is a drag event (nothing else available at the moment). |
| `dragAmount`| _position_ | `{ x : 100, y : 34 }` | The x-y-amount of the current drag step. This is the difference between the recent drag step and the actual drag position. |

</div>


## Mouse, Keyboard and Touch interaction
 * [SHIFT] + [Click] : Select/Deselect vertex
 * [Y] + [Click]: Toggle Bézier auto-adjustment for clicked bézier path point
 * [ALT or SPACE] + [Mousedown] + [Drag] : Pan the area
 * [Mousewheel-up] : Zoom in
 * [Mousewheel-down] : Zoom out
 * Touch & move (1 finger): Move item
 * Touch & move (2 fingers): Pan the area
 * Touch & pinch: Zoom in/out



## Minimize the package

The package is minimized with webpack. See the `./bin/webpack.config.js` file.

### Install webpack
This will install the `npm-webpack` package with the required dependencies
for you from the `package.json` file.
~~~bash
 $ npm install
~~~


### Run webpack
This will generate the `./dist/plotboilerplate.min.js` file for you
from the sources code files in `./src/js/*`.
~~~bash
 $ npm run webpack
~~~




## Compile Typescript

The package is compiled with npm typescript. See the `tsconfig.json` file.

### Run the typescript compiler
This is not yet finished; the old vanilla-JS files will soon be dropped and replaced
by generated files, compiled from Typescript.
~~~bash
 $ npm run compile-typescript
~~~
There is also a sandbox script, compiling and running the typescript files inside your browser. Please note that
due to performance reasons it is not recommended to use this in production. Always compile your typescript files
for this purpose.



## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24" height="24" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24" height="24" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24" height="24" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24" height="24" />](http://godban.github.io/browsers-support-badges/)<br>iOS Safari |
| --------- | --------- | --------- | --------- |
| IE11 & Edge| latest    | latest    | latest    |
  



### Credits
* [dat.gui by dataarts](https://github.com/dataarts/dat.gui "dat.gui dataarts")
* [Neolitec's Color.js class](https://gist.github.com/neolitec/1344610 "Neolitec's Color.js class")
* [FileSaver.js](https://www.npmjs.com/package/file-saver "FileSaver.js")
* [AlloyFinger.js](https://github.com/AlloyTeam/AlloyFinger "AlloyFinger.js")
* [Ray Casting Algorithm](https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon "Ray Casting Algorithm") by Aaron Digulla
* [Hobby Curves in Javascript](http://weitz.de/hobby/ "Hobby Curves in Javascript") by [Prof. Dr. Edmund Weitz](http://weitz.de)
* [hobby.pdf](https://ctan.mc1.root.project-creative.net/graphics/pgf/contrib/hobby/hobby.pdf "hobby.pdf")
* [jsHobby](https://github.com/loopspace/jsHobby "jsHobby")
* [Blake Bowen's Catmull-Rom demo](https://codepen.io/osublake/pen/BowJed "Blake Bowen's Catmull-Rom demo")
* [mbostock](https://github.com/mbostock "mbostok") for the great [convex-polygon-incircle implementation](https://observablehq.com/@mbostock/convex-polygon-incircle "convex-polygon-incircle implementation")
  * and for [circle-tangent-to-three-lines](https://observablehq.com/@mbostock/circle-tangent-to-three-lines "circle-tangent-to-three-lines")
* [Circle Intersection in C++ by Robert King](https://stackoverflow.com/questions/3349125/circle-circle-intersection-points "Circle Intersection in C++ by Robert King")
* [The 'Circles and spheres' article by Paul Bourke](http://paulbourke.net/geometry/circlesphere/ "the 'Circles and spheres' article by Paul Bourke")
* [shamansir/draw_svg.js](https://gist.github.com/shamansir/6294f8cfdd555a9d1b9e182007dd0c2f "shamansir/draw_svg.js") for manipulating SVG path data strings
* [opsb's stackoverflow proposal](https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle "opsb's stackoverflow proposal") for converting ellipses sectors to SVG arcs.
* [contrast-color-algorithm](https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y/38542#38542" "contrast-color-algorithm") by Martin Sojka's
* [Peter James Lu](https://www.peterlu.com/) and [Paul Steinhardt](https://paulsteinhardt.org/) for their work on [Girih patterns](https://physics.princeton.edu//~steinh/peterlu_SOM7_sm.pdf "Girih")
* Cronholm144 for the [Girih texture](https://commons.wikimedia.org/wiki/File:Girih_tiles.svg "Girih texture")
* [Mapbox's Earcut polygon algorithm](https://github.com/mapbox/earcut "Mapbox's Earcut polygon algorithm")


## Todos
[What needs to be done](todos.md "Future To-Dos")


## Known bugs
 * SVG resizing does not work in Firefox (aspect ratio is always kept, even if clip box changes). Please use PNGs until this is fixed.
 * The BBTree.iterator() fails if the tree is empty! (Demos)
 * The minifid BBTree and BBTreeCollection files do not export anything. The un-minified does. Why that?
 * Currently no more known. Please report bugs.





