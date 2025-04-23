/**
 * A script to demonstrate how to calculate ideal minimal bounding boxes with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 * @author   Ikaros Kappler
 * @date     2025-04-23
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  const RAD_TO_DEG = 180.0 / Math.PI;
  const DEG_TO_RAD = Math.PI / 180.0;
  _context.addEventListener("load", function () {
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );
    // Disable automatically added handle lines
    pb.drawConfig.drawHandleLines = false;

    // Array<Polygon | Circle | VEllipse | Line | CircleSector | VEllipseSector | BezierPath | Triangle>
    var shapes = [];
    var ellipseHelper;
    var cicleSectorHelper;
    var ellipseSectorHelper;
    var bezierHelper;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      showBoundingBoxes: params.getBoolean("showBoundingBoxes", true),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();

    var postDraw = function (draw, fill) {
      // console.log("config.showBoundingBoxes", config.showBoundingBoxes);
      if (config.showBoundingBoxes) {
        drawBoundingBoxes(draw, fill);
      }
      ellipseHelper.drawHandleLines(draw, fill);
      cicleSectorHelper.drawHandleLines(draw, fill);
      ellipseSectorHelper.drawHandleLines(draw, fill);
      bezierHelper.drawHandleLines();
    }; // END postDraw

    var drawBoundingBoxes = function (draw, fill) {
      shapes.forEach(function (shape) {
        if (typeof shape["getBounds"] === "function") {
          var bounds = shape.getBounds();
          draw.rect(bounds.min, bounds.width, bounds.height, "rgba(128,128,128)", 1, { dashOffset: 4, dashArray: [4, 3] });
        } // END if
      });
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShape = function () {
      pb.removeAll(false, false); // Don't trigger redraw

      // Create a new randomized polygon.
      var polygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
      polygon.scale(0.3, polygon.getCentroid());

      var line = new Line(viewport.randomPoint(), viewport.randomPoint());

      var triangle = new Triangle(viewport.randomPoint(), viewport.randomPoint(), viewport.randomPoint());

      // Create circle and ellpise
      var circle = new Circle(new Vertex(-25, -15), 90.0);
      var ellipse = new VEllipse(new Vertex(25, 15), new Vertex(150, 200), -Math.PI * 0.3);
      var circleSector = randomCircleSector(viewport);
      var ellipseSector = randomEllipseSector(viewport);

      // Create a new randomized Bézier curve.
      var tmpPolygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
      tmpPolygon.scale(0.3, polygon.getCentroid());
      var bezierPath = BezierPath.fromCurve(
        new CubicBezierCurve(tmpPolygon.vertices[0], tmpPolygon.vertices[1], tmpPolygon.vertices[2], tmpPolygon.vertices[3])
      );
      bezierHelper = new BezierPathInteractionHelper(pb, [bezierPath]);

      shapes = [polygon, circle, ellipse, circleSector, ellipseSector, bezierPath, line, triangle];
      // Align all shapes on a circle :)
      var alignCircle = new Circle(new Vertex(), viewport.getMinDimension() * 0.333);
      shapes.forEach(function (shape, i) {
        var newPosition = alignCircle.vertAt((i * Math.PI * 2) / shapes.length);
        // console.log("shape ", i, typeof shape);
        shape.move(newPosition);
      });

      // We want to change the ellipse's radii and rotation by dragging points around
      var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);
      if (ellipseHelper) {
        ellipseHelper.destroy();
      }
      ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);

      // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
      var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
      var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
      if (cicleSectorHelper) {
        cicleSectorHelper.destroy();
      }
      cicleSectorHelper = new CircleSectorHelper(circleSector, controlPointA, controlPointB, pb);

      // We want to change the ellipse's radii and rotation by dragging points around
      var startControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.startAngle);
      var endControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.endAngle);
      var rotationControlPoint = ellipseSector.ellipse
        .vertAt(0) // ellipseSector.ellipse.rotation)
        .scale(1.2, ellipseSector.ellipse.center);
      if (ellipseSectorHelper) {
        ellipseSectorHelper.destroy();
      }
      ellipseSectorHelper = new VEllipseSectorHelper(ellipseSector, startControlPoint, endControlPoint, rotationControlPoint);

      pb.add(shapes, false);
      pb.add(
        [ellipseRotationControlPoint, controlPointA, controlPointB, startControlPoint, endControlPoint, rotationControlPoint],
        true
      ); // trigger redraw
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "showBoundingBoxes").name("showBoundingBoxes").title("Check to see shape's bounding boxes.")
        .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "readme").name('readme').title("Display this demo's readme.");
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
  });
})(globalThis);
