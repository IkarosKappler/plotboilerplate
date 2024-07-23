/**
 * A demo to whow how to get n 'equidistant' points on a Bézier path.
 *
 * @requires gup
 * @requires lil-gui
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2022-01-31
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  var GUP = gup();

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
          drawOrigin: false,
          rasterAdjustFactor: 2.0,
          redrawOnResize: true,
          defaultCanvasWidth: 1024,
          defaultCanvasHeight: 768,
          canvasWidthFactor: 1.0,
          canvasHeightFactor: 1.0,
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          drawBezierHandleLines: true,
          drawBezierHandlePoints: true,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        guiDoubleSize: false,

        pointCount: 24,
        drawPointLabels: false
      },
      GUP
    );

    // prettier-ignore
    var bezierJson = '[ { "startPoint" : [-122,77.80736634304651], "endPoint" : [-65.59022229786551,21.46778533702511], "startControlPoint": [-121.62058129515852,25.08908859418696], "endControlPoint" : [-79.33419353770395,48.71529293460728] }, { "startPoint" : [-65.59022229786551,21.46778533702511], "endPoint" : [-65.66917273472913,-149.23537680826058], "startControlPoint": [-52.448492057756646,-4.585775770903305], "endControlPoint" : [-86.16188690013742,-62.11613821618975] }, { "startPoint" : [-65.66917273472913,-149.23537680826058], "endPoint" : [-61.86203591980055,-243.8368165606738], "startControlPoint": [-53.701578771473564,-200.1123697454778], "endControlPoint" : [-69.80704300441666,-205.36451303641783] }, { "startPoint" : [-61.86203591980055,-243.8368165606738], "endPoint" : [-21.108966092052256,-323], "startControlPoint": [-54.08681426887413,-281.486963896856], "endControlPoint" : [-53.05779349623559,-323] } ]';
    var bezierPath = BezierPath.fromJSON(bezierJson);
    for (var i = 1; i < bezierPath.bezierCurves.length; i++) {
      // Set curve points to auto-adjust
      bezierPath.bezierCurves[i].startPoint.attr.bezierAutoAdjust = true;
    }
    pb.add(bezierPath);

    // +---------------------------------------------------------------------------------
    // | After all static elements on the canvas (the Bèzier path) were drawn
    // | just draw our custom stuff.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      bezierPath.updateArcLengths();
      var vertices = bezierPath.getEvenDistributionVertices(config.pointCount);
      for (var i = 0; i < vertices.length; i++) {
        draw.circleHandle(vertices[i], 3, "rgba(192,0,128,1.0)");
        if (config.drawPointLabels) {
          fill.text("" + i, vertices[i].x, vertices[i].y);
        }
      }
      // Calculate area
      var bounds = bezierPath.getBounds();
      vertices.push(new Vertex(bounds.max));
      var polygon = new Polygon(vertices, false);
      draw.polygon(polygon, "rgba(192,192,192,0.5)", 2);
      fill.polygon(polygon, "rgba(192,192,192,0.3)", 2);
      fill.text("Area: " + polygon.area().toFixed(3) + "px²", bounds.max.x, bounds.max.y);
    };

    // +---------------------------------------------------------------------------------
    // | Just redraw everything.
    // +-------------------------------
    var redraw = function () {
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = pb.createGUI();
    var guiSize = guiSizeToggler(gui, config, { transformOrigin: "top right" });
    if (isMobileDevice()) {
      config.guiDoubleSize = true;
      guiSize.update();
    }
    gui.add(config, "guiDoubleSize").title("Double size GUI?").onChange(guiSize.update);

    var f0 = gui.addFolder("Settings");
    // prettier-ignore
    f0.add(config, "pointCount").min(2).max(100).title("The point count.").onChange( redraw );
    // prettier-ignore
    f0.add(config, "drawPointLabels").title("Draw point labels?").onChange( redraw );
    f0.open();

    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(window);
