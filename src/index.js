/**
 * The main script of the generic plotter.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2018-10-23
 * @modified    2018-11-09 Refactored the old code.
 * @modified    2018-12-17 Added the config.redrawOnResize param.
 * @modified    2019-03-20 Added the 'projectname' tag.
 * @modified    2019-11-18 Added the triangle demo.
 * @version     1.0.4
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
    window.pbInitialized = true;
    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);
    var isInitialized = false;

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
          autoDetectRetina: false,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableGL: false // experimental
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
      humane.log("plotboilerplate");
    }

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    pb.createGUI();

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseX: 0,
      mouseY: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseX");
    uiStats.add("mouseY");

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.eventCatcher).move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
    });

    // Use a helper function to build all demo-drawables.
    var drawables = createDemoDrawables(pb, "example-image.png", function () {
      if (isInitialized) {
        pb.redraw();
      }
    });
    pb.add(drawables);

    // Retrieve desired drawables from the array.
    var polygon = drawables[9];
    var triangles = [drawables[17], drawables[18], drawables[19], drawables[20]];

    function animate(time) {
      polygon.rotate(0.01);
      pb.redraw();
      window.requestAnimationFrame(animate);
    }
    if (GUP.hasOwnProperty("animate") && PlotBoilerplate.utils.fetch.bool(GUP, "animate", true)) {
      console.log("Staring animation");
      animate(0);
    }

    pb.config.postDraw = function () {
      for (var i in triangles) {
        var circle = triangles[i].getIncircle();
        pb.fill.circle(circle.center, circle.radius, "rgba(192,192,192,0.33)", 1.0);
      }
    };
    isInitialized = true;
  }; // End initializePB

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
