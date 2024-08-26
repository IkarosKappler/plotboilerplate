/**
 * A script for making simple animations.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2019-04-11
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  window.addEventListener("load", function () {
    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas"),
          fullSize: true,
          fitToParent: true,
          scaleX: 1.0,
          scaleY: 1.0,
          drawGrid: false,
          rasterGrid: true,
          drawOrigin: false,
          rasterAdjustFactor: 2.0,
          redrawOnResize: true,
          defaultCanvasWidth: 1024,
          defaultCanvasHeight: 768,
          canvasWidthFactor: 1.0,
          canvasHeightFactor: 1.0,
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          drawHandleLines: false,
          drawHandlePoints: false,
          enableMouse: true,
          enableKeys: true,
          enableTouch: true
        },
        GUP
      )
    );

    pb.drawConfig.drawVertices = false;

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    pb.createGUI();
    // END init dat.gui

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas).move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      var cx = document.getElementById("cx");
      var cy = document.getElementById("cy");
      if (cx) cx.innerHTML = relPos.x.toFixed(2);
      if (cy) cy.innerHTML = relPos.y.toFixed(2);
    });

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    // +---------------------------------------------------------------------------------
    // | Add some interactive elements: point sets (triangles) and circles.
    // +-------------------------------
    var triangles = [];
    function updateCircles() {
      for (var i in triangles) {
        triangles[i].calcCircumcircle();
        var circumCircle = triangles[i].getCircumcircle();
        triangles[i]._circle.center.set(circumCircle.center);
        triangles[i]._circle.axis.set(new Vertex(circumCircle.center).add(circumCircle.radius, circumCircle.radius));
      }
      pb.redraw();
    }

    var pA = randomVertex();
    var pB = randomVertex();
    pb.add(pA);
    pb.add(pB);

    pA.listeners.addDragListener(function () {
      updateCircles();
    });
    pB.listeners.addDragListener(function () {
      updateCircles();
    });

    for (var i = 0; i < 10; i++) {
      var p = randomVertex();
      var tri = new Triangle(pA, pB, p);
      var circumCircle = tri.getCircumcircle();
      var circle = new VEllipse(
        new Vertex(circumCircle.center),
        new Vertex(circumCircle.center).add(circumCircle.radius, circumCircle.radius)
      );
      // Set circles un-draggable
      circle.center.attr.selectable = circle.center.attr.draggable = false;
      circle.axis.attr.selectable = circle.axis.attr.draggable = false;

      // Remember circumcircle with triangle
      tri._circle = circle;

      pb.add(circle);
      pb.add(p);
      triangles.push(tri);

      p.listeners.addDragListener(updateCircles);
    }

    // Animate the vertices: make them bounce around and reflect on the walls.
    var animator = new LinearVertexAnimator(pb.vertices, pb.viewport(), updateCircles);
    animator.start();
  });
})(window);
