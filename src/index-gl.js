/**
 * The main script of the generic plotter: the Gl version.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, drawgl
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2019-09-18
 * @modified    2019-11-18 Added the triangle demo.
 * @version     0.0.2
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

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
          rasterGrid: true,
          drawOrigin: true,
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
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableGL: true // This one is experimental
        },
        GUP
      )
    );

    if (typeof humane != "undefined") {
      pb.setConsole({
        warn: function () {
          console.warn(arguments);
          humane.log(arguments[0]);
        },
        log: function () {
          console.log(arguments);
          // humane.log(arguments[0]);
        },
        error: function () {
          console.error(arguments);
          humane.log(arguments[0]);
        }
      });
      humane.log("plotboilerplate-gl");
    }

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

    // Use a helper function to build all demo-drawables.
    var drawables = createDemoDrawables(pb.canvasSize, "example-image.png", function () {
      pb.redraw();
    });
    pb.add(drawables);
  });
})(window);
