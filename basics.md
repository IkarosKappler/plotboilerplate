## How to use basic classes

### Main class
~~~javascript
   var pb = new PlotBoilerplate( {
       canvas		: document.getElementById('my-canvas'),
       fullSize         : true
   } );
~~~


### Vertex
~~~javascript
   var vertex   = new Vertex(100,200);
   pb.add( vertex );
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-Vertex/ "Demo")


### Line
~~~javascript
   var vertA  = new Vertex(  100, 200 );
   var vertB  = new Vertex( -200,-100 );
   var line   = new Line( vertA, vertB );
   pb.add( line );
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-Line/ "Demo")


### Vector
~~~javascript
   var vertA  = new Vertex(  100, 200 );
   var vertB  = new Vertex( -200, -100 );
   var vector = new Vector( vertA, vertB );
   pb.add( vector );
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-Vector/ "Demo")


### Triangle
~~~javascript
   var vertA  = new Vertex( -100,  34 );
   var vertB  = new Vertex(  100,  34 );
   var vertC  = new Vertex(    0, -34 );	
   var triangle = new Triangle( vertA, vertB, vertC );
   pb.add( triangle );
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-Triangle/ "Demo")


### Circle
~~~
   var center = new Vertex( 0, 0 );
   var radius = 100.0;
   var circle = new Circle( center, radius );
   pb.add( circle );
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-Circle/ "Demo")


### VEllipse
~~~
   var center = new Vertex( 0, 0 );
   var axis = new Vertex( 100.0, 50.0 );
   var ellipse = new VEllipse( center, axis );
   pb.add( ellipse );
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-VEllipse/ "Demo")


### CubicBezierCurve
~~~
   var start        = new Vertex( -100, 0 );
   var end          = new Vertex(  100, 0 );
   var startControl = new Vertex( -80,  100 );
   var endControl   = new Vertex(  80,  100 );
   var curve        = new CubicBezierCurve( start, end, startControl, endControl );
   // Note: you can not add single curves. Create a path from the curve.
~~~
-no demo for this class. See BeziePath-


### BezierPath
~~~
   var pathPoints = [
       [ new Vertex( -300, 0 ),
         new Vertex(    0, 0 ),
         new Vertex( -200, -200 ),
         new Vertex( -100, -200 )
       ],
       [ new Vertex(    0, 0 ),
         new Vertex(  300, 0 ),
         new Vertex(  100, 200 ),
         new Vertex(  200, 200 )
       ]
   ];
   var path = BezierPath.fromArray( pathPoints );
   pb.add( path );

   // Useful hint: if you want to keep your bezier paths smooth
   //              then you should set their point attributes to bezierAutoAdjust=true
   path.bezierCurves[1].startPoint.attr.bezierAutoAdjust = true;
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-BezierPath/ "Demo")



### PBImage
~~~
   var imageSource = new Image(50,50);
   var leftUpperCorner = new Vertex(-25,-25);
   var rightLowerCorner = new Vertex(25,25);
   var image = new PBImage( imageSource, leftUpperCorner, rightLowerCorner );
   pb.add( image );
   // You can load the source later
   imageSource.addEventListener('load', function() { pb.redraw(); } );
   // Note: Firefox does not scale SVGs properly at the moment, so better use pixel graphics
   imageSource.src = 'example-image.png';
~~~
[Demo](https://plotboilerplate.io/repo/demos/basic-PBImage/ "Demo")
