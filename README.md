# An interactive Javascript Plotting Boilerplate
For plotting visual 2D data with Javascript and HTML canvas (in 2d-context).

This is a simple collection of useful functions I am repetitively using for
visualizing 2D geometries. Basic features are
 * adding elements like vertices, lines, vectors, triangles, curves, polygons, ellipses, images
 * cofiguration of the canvas behavior (fullsize, interaction, raster)
 * mouse interaction (zoom, pan, drag elements)
 * keyboard interaction
 * touch interaction for dragging vertices (desktop and mobile)


The compressed library has 89kb.


## Install the package via npm
~~~sh
   $ npm i -g npm          # Updates your npm if necessary
   $ npm i plotboilerplate # Installs the package
~~~



## The HTML file
For a full example see [main-dist.html](https://github.com/IkarosKappler/plotboilerplate/blob/master/main-dist.html "main-dist.html") :
~~~html
   <canvas id="my-canvas">
      Your browser does not support the canvas tag.
   </canvas>

   <!-- Optional: a helper to display the mouse/touch position -->
   <div class="info monospace">
      [<span id="cx">-</span>,<span id="cy">-</span>]
   </div>
~~~
The 'info' block is just for displaying the current mouse/touch coordinates.


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


![Simple Demo](https://plotboilerplate.io/repo/screenshots/screenshot-20190220_3_simpledemo.png "The simple demo")

Screenshot
<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/00-simple/index.html" title="And the simple demo is here">And the simple demo is here</a>



#### API
See [API Documentation](https://plotboilerplate.io/docs/PlotBoilerplate.html "API Documentation") for details.



### Typescript
~~~typescript
   // Usage with Typescript could look like this
   import { PlotBoilerplate, Vertex, Line } from "plotboilerplate";

   window.addEventListener( 'load', () => {
    
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




## Examples and screenshots
![Current demo](https://plotboilerplate.io/repo/screenshots/preview-image-large.png "Current demo")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/main-dist.html" title="See the demo">See the demo</a>

### Feigenbaum bifurcation (logistic map)
![Plotting the Feigenbaum bifurcation](https://plotboilerplate.io/repo/screenshots/screenshot-20181212_3_feigenbaum.png "Plotting the Feigenbaum bifurcation")
![Plotting the Feigenbaum bifurcation](https://plotboilerplate.io/repo/screenshots/screenshot-20190223_0_feigenbaum.png "Plotting the Feigenbaum bifurcation")

[For a detailed description of this plot see my Feigenbaum-plot mini-project](https://github.com/IkarosKappler/feigenbaum-plot "Feigenbaum bifurcation diagram")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/06-feigenbaum/index.html" title="See the demo">See the demo</a>

[And here is a tiny article about it](http://www.polygon-berlin.de/deterministisches-chaos "Article about deterministic chaos")


### Perpendiducular point-to-line-distance demo

![Perpendiducular point-to-line distance](https://plotboilerplate.io/repo/screenshots/screenshot-20190220_2_line-to-point.png "Perpendiducular point-to-line distance")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/02-line-point-distance/index.html" title="See the demo">See the demo</a>


### Random-scripture demo

![Random-scripture demo](https://plotboilerplate.io/repo/screenshots/screenshot-20190117-0-random-scripture.png "Random-scripture demo")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/03-random-scripture/index.html" title="See the demo">See the demo</a>


### Vector field test 

![Vectorfield test](https://plotboilerplate.io/repo/screenshots/screenshot-20190428_0_vector_field_changes.png "Vectorfield test demo")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/04-vectorfield/index.html" title="See the demo">See the demo</a>


### Simple circumcircles of walking triangles animation

![Circumcircle animation](https://plotboilerplate.io/repo/screenshots/screenshot-20190415_1_circumcircles.png "Circumcircles (of walking triangles) animation")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/05-circumcircle-animation/index.html" title="See the demo">See the demo</a>


### Interactive Delaunay triangulation and Voronoi diagram

![Delaunay and Voronoi](https://plotboilerplate.io/repo/screenshots/screenshot-20190416_0_voronoi_delaunay.png "Delaunay triangulation and Voronoi diagrams")
![Voronoi Bézier Cells](https://plotboilerplate.io/repo/screenshots/screenshot-20190417_0_voronoi_bezier_cells.png "Voronoi Bézier Cells")
![Voronoi Bézier Cells with scaling](https://plotboilerplate.io/repo/screenshots/screenshot-20191025_1_voronoi_with_scaling.png "Voronoi Bézier with scaling")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/07-voronoi-and-delaunay/index.html" title="See the demo">See the demo</a>


### Walking triangle demo

![Walking Triangles, Demo A](https://plotboilerplate.io/repo/screenshots/screenshot-20190911_0_walking_triangles.png "Walking triangles, demo a")
![Walking Triangles, Demo B](https://plotboilerplate.io/repo/screenshots/screenshot-20190911_1_walking_triangles.png "Walking triangles, demo b")
![Walking Triangles, Demo C](https://plotboilerplate.io/repo/screenshots/screenshot-20190911_2_walking_triangles.png "Walking triangles, demo c")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/08-walking-triangles/index.html" title="See the demo">See the demo</a>


### Simple tweening animation using the GSAP library

![Simple Tweening Animation](https://plotboilerplate.io/repo/screenshots/screenshot-20191218-tweenmax-bezier-animation.png "Simple Tweening Animation")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/10-bezier-animation-gsap/index.html" title="See the demo">See the demo</a>


### Perpendiculars of a Bézier path

![Perpendiculars of a Bézier path](https://plotboilerplate.io/repo/screenshots/screenshot-20191218-bezier-perpendiculars.png "Perpendiculars of a Bézier path")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/11-bezier-perpendiculars/index.html" title="See the demo">See the demo</a>


### Tracing a cubic Bézier spline (finding the tangent values for each vertex)

![Tracing a cubic Bézier spline](https://plotboilerplate.io/repo/screenshots/screenshot-20191218-tracing-bsplines.png "Tracing a cubic Bézier spline")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/12-trace-bspline/index.html" title="See the demo">See the demo</a>


### Drawing pursuit curves (each point following one other point)

![Drawing pursuit curves (each point following one other point)](https://plotboilerplate.io/repo/screenshots/screenshot-2020014-pursuit-curves.png "Drawing pursuit curves")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/14-pursuit-curves/index.html" title="See the demo">See the demo</a>


### Drawing leaf venations (approach inspired by bleeptrack, see [Operation Mindfuck](https://media.ccc.de/v/36c3-66-operation-mindfuck-vol-3#t=2524 "Operation Mindfuck @ 36c3"))

![Drawing leaf venations (venation patterns in a leaf shape)](https://plotboilerplate.io/repo/screenshots/screenshot-20200317-leaf-venation-test.png "Drawing leaf venations")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/15-leaf-venation-patterns/index.html" title="See the demo">See the demo</a>


### Morley triangle

![Presenting the Morley triangle theorem](https://plotboilerplate.io/repo/screenshots/screenshot-20200317-morley-triangle.png "The Morley trisector triangle")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/16-morley-trisectors/index.html" title="See the demo">See the demo</a>


### Hobby Curve

![Hobby Curves](https://plotboilerplate.io/repo/screenshots/screenshot-20200414-1-Hobby-cubic.png "Hobby Curves")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/17-hobby-curves/index.html" title="See the demo">See the demo</a>


### Urquhart graph / Relative Neighbourhood graph

![Urquhart graph](https://plotboilerplate.io/repo/screenshots/screenshot-20200427-relative-neighbour-graph-urquhart.png "Urquhart graph")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/18-relative-neighbourhood-graph/index.html" title="See the demo">See the demo</a>


### Convex Polygon Incircle

![Convex Polygon Incircle](https://plotboilerplate.io/repo/screenshots/screenshot-20200506-convex-polygon-incircle.png "Convex Polygon Incircle")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/19-convex-polygon-incircle/index.html" title="See the demo">See the demo</a>


### Pattern Gradient

![Pattern Gradient](https://plotboilerplate.io/repo/screenshots/screenshot-20200526-0-parquet-deformations.png "Pattern Gradient")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/20-pattern-gradient/index.html" title="See the demo">See the demo</a>


### Pattern Gradient, Variant

![Pattern Gradient, Variant](https://plotboilerplate.io/repo/screenshots/screenshot-20200622-0-parquet-transformation.png "Pattern Gradient, Variant")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/21-parquet-deformation/index.html" title="See the demo">See the demo</a>


### Distance between point and Bézier curve

![Point-Bézier-Distance](https://plotboilerplate.io/repo/screenshots/screenshot-from-20200724-0-bezier-point-distance.png "Point-Bézier-Distance")

<a class="btn btn-link" href="https://plotboilerplate.io/repo/demos/23-bezier-point-distance/index.html" title="See the demo">See the demo</a>




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

The package is minimized with webpack. See the `webpack.config.js` file.

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



## Todos
 * Use a sorted map in the line-point-distance demo.
 * The experimental WebGL support requires Color objects instead of color strings. Otherwise each color string will be parse on each roundtrip which is a nightmare for the performance.
 * The Color.parse(string) function does only recognize HEX, RGB and RGBA strings. HSL is still missing. Required?
 * Replace all color params: replace type string by color. (tinycolor?)
 * Include Touchy.js as a package dependency.
 * Include FileSaver.js as a package dependency.
 * Measure the canvas' border when applying fitToParent! Currently a 1px border is expected.
 * Make Bézier Curves dividable (by double click?).
 * Implement snap-to-grid.
 * Make ellipses rotatable.
 * Write better viewport/viewbox export. Some viewers do not understand the current format. Refactor BoundingBox2 for this?
 * Add arcs?
 * Add image flipping.
 * Add Images to the SVGBuiler.
 * Add image/svg support (adding SVG images).
 * Add a vertex attribute: visible. (to hide vertices).
 * Add control button: reset zoom.
 * Add control button: reset to origin.
 * [Partially done] Add control button: set to retina resolution (size factors and css scale).
 * Add a demo that draws a proper mathematical xy-grid.
 * Extend the leaf venation generator demo.
 * Add a thumbnail generator script for the screenshots (like with imagick).
 * Add a retina detection; initialize the canvas with double resolution on startup if retina display (optional-flag).
 * Change the behavior of Vector.intersection(...). The intersection should be on both vectors, not only on their line intersection!
 * Rename drawutils class to Drawutils or DrawUtils. Repective name DrawUtilsGL.
 * Use the new Bounds class in the RectSelector helper.
 * Adapt the bounds in the RectSelector (use min:Vertex and max:Vertex).
 * Circle lineWidth params also affects circular handles.
 * Build a feature for line-styles; each 'color' param could also be gradient or a pattern (stroked, dotted, dashed, ... ).
   See ctx.setLineDash(...).
 * Add an internal mapping to remember vertices and their installed listeners (for removing them later).
 * Destroy installed vertex listeners from vertices after removing them (like the Bézier auto-adjuster).
 * Port all demos from vanilla JS to TypeScript.
 * Remove the Touchy.js integration soon.
 * Add a TouchHandler (such as the MouseHandler)? Add this to the main demo to keep track of touch positions?
 * Listeners using Vertex.listeners.addDragStopListener() are not triggered on touch events.
 

### Todos for future Version 2
 * Change the Vector.inverse() function to reverse (or something). Currently this is not what the inverse of a vector should be.
 * Change the bezier point path order from [start,end,startContro,endControl] to [start,startControl,endControl,end].
 * Change BezierPath.getPointAt to .getVertexAt (or .getVertAt or vertAt?).
 * Change BezierPath.scale( center, factor ) to BezierPath.scale( factor, center ) and make center optional (like in Polygon).
 * Rename BezierPath.adjustCircular to .isCircular, because cirularity does not only affect vertex adjustment.
 * The inverse-functions are called Vertex.inv() but Vector.inverse(). Harmonize this.
 * CubicBezierCurve.getTangentAt(number) and .getTangent(number) return Vertex, why not a Vector?
 


## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>iOS Safari |
| --------- | --------- | --------- | --------- |
| IE11 & Edge| latest    | latest    | latest    |
  



### Credits
* dat.gui
* Color.js
* [FileSaver.js](https://www.npmjs.com/package/file-saver "FileSaver.js")
* [AlloyFinger.js](https://github.com/AlloyTeam/AlloyFinger "AlloyFinger.js")
* Hobby-Curve quick implementation by Prof. Dr. Edmund Weitz, http://weitz.de/hobby/
* [hobby.pdf](https://ctan.mc1.root.project-creative.net/graphics/pgf/contrib/hobby/hobby.pdf "hobby.pdf")
* [jsHobby](https://github.com/loopspace/jsHobby "jsHobby")
* [Blake Bowen's Catmull-Rom demo](https://codepen.io/osublake/pen/BowJed "Blake Bowen's Catmull-Rom demo")
* [mbostock](https://github.com/mbostock "mbostok") for the great [convex-polygon-incircle implementation](https://observablehq.com/@mbostock/convex-polygon-incircle "convex-polygon-incircle implementation")
* and for [circle-tangent-to-three-lines](https://observablehq.com/@mbostock/circle-tangent-to-three-lines "circle-tangent-to-three-lines")

## Known bugs
 * BezierPath counstructor (from an older implementation) fails. This needs to be refactored.
 * SVG resizing does not work in Firefox (aspect ratio is always kept, even if clip box changes). Please use PNGs until this is fixed.
 * The BBTree.iterator() fails if the tree is empty! (Demos)
 * The minifid BBTree and BBTreeCollection files do not export anything. The un-minified to. Why that?
 * Currently no more known. Please report bugs.





