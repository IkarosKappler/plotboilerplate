/**
 * A script for calculating Contour Plots from a given rasterized value model (like a terrain, heat map, or so).
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 * @requires three.js
 *
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  window.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);
    var params = new Params(GUP);

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
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        innerN: params.getNumber("innerN", 5),
        innerRadius: params.getNumber("innerRadius", 100),
        outerN: params.getNumber("outerN", 14),
        outerRadiusA: params.getNumber("outerRadiusA", 200),
        outerRadiusB: params.getNumber("outerRadiusB", 150)
      },
      GUP
    );

    var ngonCenter = new Vertex();
    var nstarCenter = new Vertex();

    var ngon = null;
    var nstar = null;

    var rebuild = function () {
      ngon = new NGons.ngon(config.innerN, config.innerRadius);
      ngon.move(ngonCenter);
      nstar = new NGons.nstar(config.outerN, config.outerRadiusA, config.outerRadiusB);
      nstar.move(nstarCenter);
      pb.removeAll();
      pb.add([ngonCenter, nstarCenter, ngon, nstar]);
    };

    var init = function () {
      rebuild();
    };

    // Install move listeners
    ngonCenter.listeners.addDragListener(function (e) {
      ngon.move(e.params.dragAmount);
    });
    nstarCenter.listeners.addDragListener(function (e) {
      nstar.move(e.params.dragAmount);
    });

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      if (nstar == null || ngon == null) {
        return;
      }
      // Draw our stuff
      fill.polygon(ngon, nstar.containsPolygon(ngon) ? "rgba(0,192,0,0.5)" : "rgba(192,0,0,0.5)");
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // var fold0 = gui.addFolder("Mesh");
      // prettier-ignore
      gui.add(config, "innerN").min(3).max(32).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('innerN').title("How many vertices on the inner polygon?");
      // prettier-ignore
      gui.add(config, "innerRadius").min(0).max(200).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('innerRadius').title("The radius of the inner polygon?");

      // prettier-ignore
      gui.add(config, "outerN").min(3).max(32).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('innerN').title("How many vertices on the inner polygon?");
      // prettier-ignore
      gui.add(config, "outerRadiusA").min(0).max(200).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('outerRadiusA').title("The first radius of the outer start polygon?");
      // prettier-ignore
      gui.add(config, "outerRadiusB").min(0).max(200).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('outerRadiusB').title("The second radius of the outer start polygon?");
    }

    pb.config.postDraw = redraw;
    init();
    pb.redraw();
  });
})(window);
