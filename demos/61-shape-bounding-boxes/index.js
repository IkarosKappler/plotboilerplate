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
    var interactionHelpers = [];

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      showBoundingBoxes: params.getBoolean("showBoundingBoxes", true),
      showEllipseExtremes: params.getBoolean("showEllipseExtremes", true),
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
      interactionHelpers.forEach(function (helper) {
        helper.drawHandleLines(draw, fill);
      });

      // Draw extreme points from ellipse?
      if (config.showEllipseExtremes) {
        for (var i in shapes) {
          if (shapes[i] instanceof VEllipse) {
            var extremes = shapes[i].getExtremePoints();
            for (var p in extremes) {
              draw.circle(extremes[p], 5, "orange");
            }
          }
        }
      }
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
      var randomShapesAndHelpers = createRandomShapes(pb, viewport);

      // Destroy old helpers to release all unused listeners.
      interactionHelpers.forEach(function (helper) {
        helper.destroy();
      });
      interactionHelpers = randomShapesAndHelpers.helpers;
      shapes = randomShapesAndHelpers.shapes;
      pb.add(randomShapesAndHelpers.shapes, false);
      pb.add(randomShapesAndHelpers.helperPoints, true);
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
      gui.add(config, "showEllipseExtremes").name("showEllipseExtremes").title("Check to see elliptic extreme points.")
        .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "readme").name('readme').title("Display this demo's readme.");
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
  });
})(globalThis);
