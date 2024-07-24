/**
 * A script for testing Urquhart (or Relative Neighbourhood) Graphs.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui, Delaunay, delaunay2urquhart
 *
 * @author   Ikaros Kappler
 * @date     2019-04-27
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);
    // Add an attribute to the attribute model. We will need these later
    // in the delaunay2urquhart conversion.
    VertexAttr.model.pointListIndex = -1;

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

          enableSVGExport: false
        },
        GUP
      )
    );

    var triangles;
    var urquhartEdges;
    var drawAll = function () {
      triangles = triangulate();
      urquhartEdges = delaunay2urquhart(triangles, pointList.pointList);

      if (config.drawDelaunay) {
        for (var t in triangles) {
          var tri = triangles[t];
          pb.draw.polyline([tri.a, tri.b, tri.c], false, "rgba(0,0,0,0.05)", 1.0);
        }
      }

      // console.log('urquhartEdges', urquhartEdges );
      for (var e in urquhartEdges) {
        var edge = urquhartEdges[e];
        pb.draw.line(edge.a, edge.b, "rgba(0,128,255,1.0)", 2);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Make the triangulation (Delaunay).
    // +-------------------------------
    var triangulate = function () {
      var delau = new Delaunay(pointList.pointList, {});
      return delau.triangulate();
    };

    // +---------------------------------------------------------------------------------
    // | Let a poinst list manager do the randomization of the three points.
    // +-------------------------------
    var pointList = new CanvasPointList(pb, function (newVert) {
      newVert.attr.pointListIndex = pointList.pointList.length - 1;
    });
    // Keep a safe border to the left/right and top/bottom (0.1 each)
    pointList.verticalFillRatio = 0.8;
    pointList.horizontalFillRatio = 0.8;

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "hobby-demo")
      .move(function (e) {
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        var cx = document.getElementById("cx");
        var cy = document.getElementById("cy");
        if (cx) cx.innerHTML = relPos.x.toFixed(2);
        if (cy) cy.innerHTML = relPos.y.toFixed(2);
      })
      .up(function (e) {
        if (e.params.wasDragged) return;
        var vert = new Vertex(pb.transformMousePosition(e.params.pos.x, e.params.pos.y));
        addVertex(vert);
      });

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        pointCount: 64,
        drawDelaunay: false,
        animate: false
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Call when the number of desired points changed in config.pointCount.
    // +-------------------------------
    var updatePointList = function () {
      pointList.updatePointCount(config.pointCount, false); // No full cover
      animator = new LinearVertexAnimator(pointList.pointList, pb.viewport(), function () {
        pb.redraw();
      });
    };

    // +---------------------------------------------------------------------------------
    // | Manually add a vertex to the point list (like on click).
    // +-------------------------------
    var addVertex = function (vert) {
      pointList.addVertex(vert);
      config.pointCount++;
      if (animator) animator.stop();
      animator = new LinearVertexAnimator(pointList.pointList, pb.viewport(), function () {
        pb.redraw();
      });
      toggleAnimation();
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Some animation stuff.
    // +-------------------------------
    var animator = null;
    function renderAnimation() {
      if (config.animate)
        window.requestAnimationFrame(renderAnimation); // Animation stopped
      else;
    }

    function toggleAnimation() {
      if (config.animate) {
        if (animator) animator.start();
        renderAnimation();
      } else {
        if (animator) animator.stop();
        pb.redraw();
      }
    }

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      gui
        .add(config, "pointCount")
        .onChange(function () {
          updatePointList();
        })
        .name("Point count")
        .title("Point count");
      gui
        .add(config, "drawDelaunay")
        .onChange(function () {
          pb.redraw();
        })
        .name("Draw Delaunay triangulation")
        .title("Draw the underlying Delaunay triangulation.");
      gui
        .add(config, "animate")
        .onChange(function () {
          toggleAnimation();
        })
        .name("Animate points")
        .title("Animate points.");
    }

    toggleAnimation();
    updatePointList();

    pb.config.preDraw = drawAll;
    pb.redraw();
  };

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
