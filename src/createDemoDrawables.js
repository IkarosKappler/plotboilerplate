/**
 * @date 2018-10-23
 * @modified 2021-01-04 Placed into a function.
 */

/**
 * @param {Bounds} canvasSize
 */
function createDemoDrawables(canvasSize, imagePath, drawCallback) {
  // +---------------------------------------------------------------------------------
  // | Add some elements to draw (demo).
  // +-------------------------------
  var diameter = Math.min(canvasSize.width, canvasSize.height) / 4.5;
  var radius = diameter * 0.5;
  var hypo = Math.sqrt(radius * radius * 2);
  var D2R = Math.PI / 180.0;

  var drawables = [];

  // +---------------------------------------------------------------------------------
  // | Add an image.
  // +-------------------------------
  // var img = new Image(50,50);
  var img = new PBImage(new Image(50, 50), new Vertex(-25, -25), new Vertex(25, 25));
  drawables.push(img);

  // +---------------------------------------------------------------------------------
  // | Add some Lines.
  // +-------------------------------
  drawables.push(new Line(new Vertex(-diameter, -diameter), new Vertex(-hypo, -hypo)));
  drawables.push(new Line(new Vertex(-diameter, diameter), new Vertex(-hypo, hypo)));
  drawables.push(new Line(new Vertex(diameter, -diameter), new Vertex(hypo, -hypo)));
  drawables.push(new Line(new Vertex(diameter, diameter), new Vertex(hypo, hypo)));

  // +---------------------------------------------------------------------------------
  // | Add some Vectors.
  // +-------------------------------
  drawables.push(new Vector(new Vertex(-diameter * 1.6, 0), new Vertex(-diameter * 1.2, 0)));
  drawables.push(new Vector(new Vertex(diameter * 1.6, 0), new Vertex(diameter * 1.2, 0)));
  drawables.push(new Vector(new Vertex(0, -diameter * 1.6), new Vertex(0, -diameter * 1.2)));
  drawables.push(new Vector(new Vertex(0, diameter * 1.6), new Vertex(0, diameter * 1.2)));

  // +---------------------------------------------------------------------------------
  // | Add polygon (here a hexagon).
  // +-------------------------------
  let n = 6;
  var polygonRadius = radius;
  var polygonVerts = [];
  for (var i = 0; i < n; i++) {
    let vert = new Vertex(polygonRadius, 0).rotate(((Math.PI * 2) / n) * i);
    vert.attr.draggable = vert.attr.selectable = false;
    polygonVerts.push(vert);
  }
  var polygon = new Polygon(polygonVerts);
  drawables.push(polygon);

  // +---------------------------------------------------------------------------------
  // | Add an ellipse, intitially drawn as circle.
  // +-------------------------------
  var ellipse = new VEllipse(new Vertex(0, 0), new Vertex(radius, radius));
  drawables.push(ellipse);

  // +---------------------------------------------------------------------------------
  // | Add a circle.
  // +-------------------------------
  var circle = new Circle(new Vertex(0, 0), diameter);
  drawables.push(circle);

  // +---------------------------------------------------------------------------------
  // | Add four circle sectors.
  // +-------------------------------
  var csectorA = new CircleSector(new Circle(new Vertex(diameter * 0.8, 0), diameter), -20 * D2R, 20 * D2R);
  var csectorB = new CircleSector(new Circle(new Vertex(0, diameter * 0.8), diameter), (90 - 25) * D2R, (90 + 25) * D2R);
  var csectorC = new CircleSector(new Circle(new Vertex(-diameter * 0.8, 0), diameter), (180 - 20) * D2R, (180 + 20) * D2R);
  var csectorD = new CircleSector(new Circle(new Vertex(0, -diameter * 0.8), diameter), (270 - 25) * D2R, (270 + 25) * D2R);

  drawables.push(csectorA);
  drawables.push(csectorB);
  drawables.push(csectorC);
  drawables.push(csectorD);

  // +---------------------------------------------------------------------------------
  // | Add a circular connected bezier path.
  // +-------------------------------
  var fract = 0.5;
  var bpath = [];
  bpath[0] = [
    new Vertex(0, -diameter),
    new Vertex(diameter, 0),
    new Vertex(diameter * fract, -diameter),
    new Vertex(diameter * fract, 0)
  ];
  bpath[1] = [
    bpath[0][1], // Use same reference
    new Vertex(0, diameter),
    new Vertex(diameter, diameter * fract),
    new Vertex(0, diameter * fract)
  ];
  bpath[2] = [
    bpath[1][1], // Use same reference
    new Vertex(-diameter, 0),
    new Vertex(-diameter * fract, diameter),
    new Vertex(-diameter * fract, 0)
  ];
  bpath[3] = [
    bpath[2][1], // Use same reference
    bpath[0][0], // Use same reference
    new Vertex(-diameter, -diameter * fract),
    new Vertex(0, -diameter * fract)
  ];
  // Construct
  var path = BezierPath.fromArray(bpath);
  path.adjustCircular = true;
  drawables.push(path);

  // +---------------------------------------------------------------------------------
  // | Add four equilateral triangles.
  // +-------------------------------
  let triangles = [
    new Triangle(
      new Vertex(-hypo * 1.5, -diameter * 1.45),
      new Vertex(-diameter * 1.45, -hypo * 1.5),
      new Vertex(-diameter * 1.6, -diameter * 1.6)
    ),
    new Triangle(
      new Vertex(diameter * 1.45, -hypo * 1.5),
      new Vertex(hypo * 1.5, -diameter * 1.45),
      new Vertex(diameter * 1.6, -diameter * 1.6)
    ),
    new Triangle(
      new Vertex(-diameter * 1.45, hypo * 1.5),
      new Vertex(-hypo * 1.5, diameter * 1.45),
      new Vertex(-diameter * 1.6, diameter * 1.6)
    ),
    new Triangle(
      new Vertex(hypo * 1.5, diameter * 1.45),
      new Vertex(diameter * 1.45, hypo * 1.5),
      new Vertex(diameter * 1.6, diameter * 1.6)
    )
  ];
  var setEquilateral = function (triangle) {
    const vec = new Vector(triangle.a, triangle.b);
    const mid = vec.vertAt(0.5);
    const perp = vec.perp().add(mid).sub(vec.a);
    perp.setLength((vec.length() * Math.sqrt(3)) / 2); // The height of a equilateral triangle
    triangle.c.set(perp.b);
  };
  for (var i in triangles) {
    let tri = triangles[i];
    tri.c.attr.draggable = tri.c.attr.selectable = false;
    tri.a.listeners.addDragListener(function (e) {
      setEquilateral(tri);
    });
    tri.b.listeners.addDragListener(function (e) {
      setEquilateral(tri);
    });
  }
  // drawables.push( triangles );
  for (var i = 0; i < triangles.length; i++) {
    drawables.push(triangles[i]);
  }

  // +---------------------------------------------------------------------------------
  // | Add an auto-adjusting bezier path.
  // +-------------------------------
  var bpath2 = [];
  fract *= 0.66;
  bpath2[0] = [
    new Vertex(0, -diameter),
    new Vertex(diameter, 0),
    new Vertex(diameter * fract, -diameter),
    new Vertex(diameter, -diameter * fract)
  ];
  bpath2[1] = [
    bpath2[0][1], // Use same reference
    new Vertex(0, diameter),
    new Vertex(diameter, diameter * fract),
    new Vertex(diameter * fract, diameter)
  ];
  bpath2[2] = [
    bpath2[1][1], // Use same reference
    new Vertex(-diameter, -0),
    new Vertex(-diameter * fract, diameter),
    new Vertex(-diameter, diameter * fract)
  ];
  bpath2[3] = [
    bpath2[2][1], // Use same reference
    bpath2[0][0], // Use same reference
    new Vertex(-diameter, -diameter * fract),
    new Vertex(-diameter * fract, -diameter)
  ];
  // Construct
  var path2 = BezierPath.fromArray(bpath2);
  path2.adjustCircular = true;
  path2.scale(new Vertex(0, 0), 1.6);
  path2.rotate(Math.PI / 4);
  for (var i in path2.bezierCurves) {
    path2.bezierCurves[i].startPoint.attr.bezierAutoAdjust = true;
    path2.bezierCurves[i].endPoint.attr.bezierAutoAdjust = true;
  }
  // pb.add( path2 );
  drawables.push(path2);

  // +---------------------------------------------------------------------------------
  // | Finally load an image.
  // +-------------------------------
  img.image.addEventListener("load", drawCallback);
  img.image.src = imagePath; // 'example-image.png';

  return drawables;
}
