/**
 * A demo script for the feigenbaum demo plot.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2018-12-09
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = {}; // gup();

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
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 0, // 100,   // auto-adjust to left- ...
          offsetAdjustYPercent: 0, // 100,  // ... -lower corner
          drawBezierHandleLines: false,
          drawBezierHandlePoints: false,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true
        },
        GUP
      )
    );
    pb.config.autoAdjustOffset = true; // Only once at initialization
    pb.config.preDraw = function (draw, fill) {
      // pre draw
    };
    var rand = function (min, max) {
      return min + Math.random() * (max - min);
    };
    pb.config.postDraw = function (draw, fill) {
      // post draw
    };

    var xSize = 25;
    var ySize = 50;

    for (var y = 0; y < pb.canvasSize.height; y += ySize) {
      var curves = [];
      for (var x = 0; x < pb.canvasSize.width; x += xSize) {
        var curve = [
          new Vertex(rand(x, x + xSize), rand(y, y + ySize)),
          new Vertex(rand(x, x + xSize), rand(y, y + ySize)),
          new Vertex(rand(x, x + xSize), rand(y, y + ySize)),
          new Vertex(rand(x, x + xSize), rand(y, y + ySize))
        ];
        curves.push(curve);
        // console.log( 'Added curve' );
        var curve = [
          new Vertex(rand(x, x + xSize), rand(y, y + ySize)),
          new Vertex(rand(x, x + xSize), rand(y, y + ySize)),
          new Vertex(rand(x, x + xSize), rand(y, y + ySize)),
          new Vertex(rand(x, x + xSize), rand(y, y + ySize))
        ];
        curves.push(curve);
        //console.log( 'Added curve' );

        // Stop word?
        if (Math.random() < 0.1 && x + 2 * xSize < pb.canvasSize.width) {
          pb.add(BezierPath.fromArray(curves), false);
          curves = [];
          x += xSize;
        }
      }

      pb.add(BezierPath.fromArray(curves), false);
    }
    pb.redraw();

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = pb.createGUI();

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        bufferData: false
      },
      GUP
    );

    console.log(JSON.stringify(config));
    var fold2 = gui.addFolder("Plot settings");
  });
})(window);
