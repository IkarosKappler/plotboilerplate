---
layout: page
---
  

# Plotting boilerplate
For Javascript and canvas with 2d-context.

![Current demo](screenshots/screenshot-20181209_0.png "Current demo")

[Live Demo](https://www.int2byte.de/public/plot-boilerplate/main-dist.html "Live Demo")

Feigenbaum bifurcation (logistic map)
![Plotting the Feigenbaum bifurcation](screenshots/screenshot-20181212_3_feigenbaum.png "Plotting the Feigenbaum bifurcation")
![Plotting the Feigenbaum bifurcation](screenshots/screenshot-20190223_0_feigenbaum.png "Plotting the Feigenbaum bifurcation")

[For a detailed description of this plot see my Feigenbaum-plot mini-project](https://github.com/IkarosKappler/feigenbaum-plot "Feigenbaum bifurcation diagram")

[And here is a tiny article about it](http://www.polygon-berlin.de/deterministisches-chaos "Article about deterministic chaos")


Perpendiducular point-to-line-distance demo

![Perpendiducular point-to-line distance](screenshots/screenshot-20190220_2_line-to-point.png "Perpendiducular point-to-line distance")

[See the demo](https://www.int2byte.de/public/plot-boilerplate/main-line-point-distance.html "Random-scripture demo")


Random-scripture demo

![Random-scripture demo](screenshots/screenshot-20190117-0-random-scripture.png "Random-scripture demo")

[See the demo](https://www.int2byte.de/public/plot-boilerplate/main-randomscripture.html "Random-scripture demo")


Vector field test (still in development)

![Vectorfield test](screenshots/screenshot-20190220_1_vectorfield.png "Vectorfield test demo (still in development)")

[See the demo](https://www.int2byte.de/public/plot-boilerplate/main-vectorfield.html "Demo of the vector field implementation ... still in development")


## Install webpack
This will install the npm-webpack package for you from the package.json file.
~~~bash
 $ npm install
~~~


## Run webpack
This will generate the ./dist/plot-boilerplate.min.js file for you
from the sources code files in ./src/*.
~~~bash
 $ npm run webpack
~~~

## The HTML file
For details see main-dist.html:
~~~html
    <canvas id="my-canvas">Your browser does not support the canvas tag.</canvas>

    <div class="info monospace">
      [<span id="cx">-</span>,<span id="cy">-</span>]
    </div>
~~~


## Initialize the canvas
~~~javascript
 var pb = new PlotBoilerplate(
     {  canvas			: document.getElementById('my-canvas'),
      	fullSize              	: true,
	fitToParent           	: true,
	scaleX                	: 1.0,
	scaleY                	: 1.0,
	rasterAdjustFactor    	: 2.0,
	autoAdjustOffset      	: true, // was autoCenterOffset before
	offsetAdjustXPercent  	: 50,
	offsetAdjustYPercent  	: 50,
	defaultCanvasWidth    	: 1024,
	defaultCanvasHeight   	: 768,
	canvasWidthFactor     	: 1.0,
	canvasHeightFactor    	: 1.0,
	cssScaleX	       	: 1.0,
	cssScaleY	       	: 1.0,
	cssUniformScale         : true,
	rasterGrid            	: true,
	backgroundColor       	: '#ffffff',
	redrawOnResize        	: true,
	drawBezierHandleLines 	: true,
	drawBezierHandlePoints 	: true,
	preDraw               	: function() { console.log('before drawing.'); },
	postDraw              	: function() { console.log('after drawing.'); },
	enableMouse           	: true,
	enableTouch           	: true,
	enableKeys            	: true
  } );
~~~					  

## Events
The Vertex class has basic event support:
~~~javascript
	var vert = new Vertex(100,100);
	vert.listeners.addDragListener( function(e) {
	   // e is of type Event
	   // You are encouraged to use the values in the object e.params
	   console.log('vertex was dragged by: ', 'x='+e.params.dragAmount.x, 'y='+e.params.dragAmount.y );
	} );
~~~


### The e.params object
~~~javascript
	{
	   element : [HTMLElement],
	   name : string, //  (the event name. Example: 'drag'),
	   pos : { x : Number, y : Number },
	   button : Number, //  (the mouse button. 0=left, 1=middle, 2=right)
	   leftButton : boolean,
	   middleButton : boolean,
	   rightButton : boolean,
	   mouseDownPos : { x : Number, y : Number }, // The position where the dragging started
	   draggedFrom : mouseDragPos, // The most recent drag position
	   wasDragged : boolean,
	   dragAmount : { x : Number, y : Number }
	}
~~~


## Add elements to your canvas
~~~javascript
	// Create two points. The origin is at the visual center by default.
	var pointA = new Vertex( -100, -100 );
	var pointB = new Vertex( 100, 100 );
	pb.add( new Line(pointA,pointB) );

	// When point A is moved by the user then move point B in the opposite direction
	pointA.listeners.addDragListener( function(e) {
		pointB.sub( e.params.dragAmount );
		pb.redraw();
	} );

	// and when point B is moved then move point A
	pointB.listeners.addDragListener( function(e) {
		pointA.sub( e.params.dragAmount );
		pb.redraw();
	} );
~~~
[And the simple demo is here](https://www.int2byte.de/public/plot-boilerplate/main-simpledemo.html "And the simple demo is here")

![Simple Demo](screenshots/screenshot-20190220_3_simpledemo.png "The simple demo")


## Usage
 * [SHIFT] + [Click] : Select/Deselect vertex
 * [Y] + [Click]: Toggle Bézier auto-adjustment for clicked bézier path point
 * [ALT or CTRL] + [Mousedown] + [Drag] : Pan the area
 * [Mousewheel-up] : Zoom in
 * [Mousewheel-down] : Zoom out



### Todos
 * Make strokes configurable (color, width, style).
 * Implement optional canvas zoom.
 * Implement optional canvas rotation.
 * Make Bézier Curves dividable (by double click?).
 * Implement snap-to-grid.
 * Make ellipses rotatable.
 * Write better viewport/viewbox export. Some viewers do not understand the current format. Refactor BoundingBox2 for this?
 * Add arcs?
 * Add image flipping.
 * Add Images to the SVGBuiler.
 * Move the helper function PlotBoilerplate.utils.buildArrowHead to the Vector class. It belongs there.
 


### Known bugs
 * BezierPath counstructor (from an older implementation) fails. This needs to be refactored.
 * SVG resizing does not work in Firefox (aspect ratio is always kept, even if clip box changes).
 * canvasContext.drawImage(...) with SVG resizing seems not to work in safari and firefox at all. Until there is a solution please use raster images.
 * Currently no more known. Please report bugs.


  

### Dependencies
* HTML5 Canvas


### Used Libraries
* dat.gui
* Color.js
* FileSaver.js
* SGV-arcto to Canvas-arc transform from [canvg](https://github.com/canvg/canvg "canvg") by Gabe Lerner
* [Touchy.js](https://github.com/jairajs89/Touchy.js "Touchy.js") by [jairajs89](https://github.com/jairajs89 "jairajs89") 

## Changelog
[View changelog](changelog/ "View changelog")
