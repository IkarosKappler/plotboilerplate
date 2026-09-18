/**
 * A simple 2d point set and image triangulation (color fill).
 *
 * @requires Vertex, Triangle, Polygon, VoronoiCell, delaunay, delaunay2voronoi, saveAs
 *
 * @author   Ikaros Kappler
 * @date     2026-09-15
 * @version  1.0.0
 **/

(function () {
  "use strict";

  window.addEventListener("load", function () {
    // Fetch the GET params
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var isMobile = isMobileDevice();

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
          backgroundColor: "#000000",
          drawHandleLines: false,
          drawHandlePoints: false,
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,
          enableMouseWheel: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    var appContext = new AppContext(
      pb,
      // PlotBoilerplate.utils.safeMergeByKeys(
      {
        makeVoronoiDiagram: params.getBoolean("makeVoronoiDiagram", true),
        drawPoints: params.getBoolean("drawPoints", true),
        drawTriangles: params.getBoolean("drawTriangles", false),
        drawCircumCircles: params.getBoolean("drawCircumCircles", false),
        drawCubicCurves: params.getBoolean("drawCubicCurves", false),
        fillVoronoiCells: params.getBoolean("fillVoronoiCells", true),
        voronoiOutlineColor: params.getString("voronoiOutlineColor", "#e5a50a"),
        voronoiCellColor: params.getString("voronoiCellColor", "#0080c0"),
        voronoiCubicThreshold: 1.0,
        voronoiCellScale: 1.0,
        voronoiCellLineWidth: params.getNumber("voronoiCellLineWidth", 2.0),
        clipVoronoiCells: params.getBoolean("clipVoronoiCells", false),
        drawClipBox: params.getBoolean("drawClipBox", false),
        drawUnclippedVoronoiCells: params.getBoolean("drawUnclippedVoronoiCells", false),
        drawVoronoiIncircles: params.getBoolean("drawVoronoiIncircles", false),
        drawVoronoiOutlines: params.getBoolean("drawVoronoiOutlines", true),
        pointCount: params.getNumber("pointCount", 50),
        horizontalSafeArea: params.getNumber("horizontalSafeArea", 0.0),
        verticalSafeArea: params.getNumber("verticalSafeArea", 0.0),
        // Lloyd algorithm setting
        showCentroids: params.getBoolean("showCentroids", true),
        showLloydbox: params.getBoolean("showLloydbox", true),
        showUmbrellaTriangles: params.getBoolean("showUmbrellaTriangles", true),
        runLloydAlgorithm: params.getBoolean("runLloydAlgorithm", true),
        showPolygonCornerNumbers: params.getBoolean("showPolygonCornerNumbers", false),

        // Helper methods
        rebuild: function () {
          updateAnimator();
          rebuild();
        },
        randomize: function () {
          randomize();
        },
        fullCover: function () {
          fullCover();
        },
        animate: params.getBoolean("animate", false),
        animationType: "linear", // 'linear' or 'radial',
        readme: function () {
          globalThis.displayDemoMeta();
        }
      }
      // GUP
      // )
    );
    appContext.rebuild = function () {
      rebuild();
    };
    appContext.toggleAnimation = function () {
      toggleAnimation();
    };
    appContext.updatePointCount = function () {
      updatePointCount();
    };
    appContext.toggleLloydAlgorithm = function () {
      toggleLloydAlgorithm();
    };
    appContext.isMobile = isMobile;

    // These will be used by the VoronoiRenderer
    appContext.triangles = [];
    appContext.trianglesPointCount = -1; // Keep track of the number of points when the triangles were generated.
    appContext.lloydBox = null; // A limiting bounding box to keep cells from diverging into infinity.
    appContext.voronoiCells = []; // An array of VoronoiCells.

    // A set of points.
    appContext.pointSet = new PointSet(pb);
    appContext.pointSet.dragListeners.push(function () {
      rebuild();
    });

    var randomize = function () {
      appContext.pointSet.clear();
      appContext.pointSet.randomPoints(
        appContext.config.pointCount,
        appContext.config.horizontalSafeArea,
        appContext.config.verticalSafeArea
      );
      appContext.trianglesPointCount = -1;
      appContext.lloydBox = appContext.pb.viewport();
      updateAnimator();
      rebuild();
    };

    var updatePointCount = function () {
      appContext.pointSet.updatePointCount(
        appContext.config.pointCount,
        appContext.config.horizontalSafeArea,
        appContext.config.verticalSafeArea
      );
      appContext.trianglesPointCount = -1;
      appContext.lloydBox = appContext.pb.viewport();
      updateAnimator();
      rebuild();
    };

    var fullCover = function () {
      appContext.pointSet.clear();
      appContext.pointSet.randomFullCover(appContext.config.pointCount, false);
      appContext.trianglesPointCount = -1;
      appContext.lloydBox = appContext.pb.viewport();
      updateAnimator();
      rebuild();
    };

    // +---------------------------------------------------------------------------------
    // | Global vars.
    // +-------------------------------
    var voronoiRenderer = new VoronoiRenderer(appContext);

    appContext.pb.config.postDraw = function (draw, fill) {
      // In this demo the PlotBoilerplate only draws the vertices.
      // Everything else is drawn by this script, with the help of some PB functions.
      redraw(draw, fill);
    };

    /**
     * The re-drawing function.
     */
    var redraw = function (draw, fill) {
      // Draw triangles
      if (appContext.config.drawTriangles) {
        voronoiRenderer.drawTriangles(draw);
      }

      // Draw triangles
      if (appContext.config.showLloydbox) {
        draw.rect(appContext.lloydBox.min, appContext.lloydBox.width, appContext.lloydBox.height, "grey", 1.0);
      }

      if (appContext.config.showUmbrellaTriangles) {
        // Draw umbrella triangles
        for (var i = 0; i < appContext.voronoiCells.length; i++) {
          var cell = appContext.voronoiCells[i];
          var umbrellaTris = cell.getUmbrellaTriangles();
          umbrellaTris.forEach(function (tri) {
            VoronoiRenderer.drawTriangle(draw, tri, "rgba(255,128,0,0.15)");
          });
        }
      }

      // Draw cell centroids
      for (var i = 0; i < appContext.voronoiCells.length; i++) {
        // var cell = appContext.voronoiCells[i];
        drawCellPolyWithCentroid(draw, fill, appContext.voronoiCells[i]);
      }

      // Draw voronoi diagram?
      if (appContext.config.makeVoronoiDiagram) {
        // voronoiRenderer.draw(draw, fill);
      }
    };

    var drawCellPolyWithCentroid = function (draw, fill, cell) {
      if (cell.triangles.length <= 2) {
        return;
      }

      var cellPoly = cell.toPolygon().clone();
      // if( appContext.config.showUmbrellaTriangles ) { }
      // console.log("cellPoly.vertices.length", cellPoly.vertices.length);
      if (appContext.config.showPolygonCornerNumbers) {
        drawPolygonIndices(cellPoly, fill, null);
      }

      draw.polygon(cellPoly, "orange", appContext.config.voronoiCellLineWidth);

      if (appContext.config.showCentroids) {
        var centroid = cellPoly.getCentroid(true); // forceClockwise=true
        draw.crosshair(centroid, 7, "red", 1.0);
        draw.line(cell.sharedVertex, centroid, "red", 1.0);
      }
    };

    /**
     * The rebuild function just evaluates the input and
     *  - triangulate the point set?
     *  - build the voronoi diagram?
     */
    var rebuild = function () {
      // Only re-triangulate if the point list changed.
      var isRedrawRequired = true;
      triangulate();
      if (appContext.config.makeVoronoiDiagram || appContext.config.drawCubicCurves) {
        isRedrawRequired = makeVoronoiDiagram();
      }

      if (isRedrawRequired) {
        appContext.pb.redraw();
      }
    };

    /**
     * Make the triangulation (Delaunay).
     */
    var triangulate = function () {
      var delau = new Delaunay(appContext.pointSet.points, {});
      appContext.triangles = delau.triangulate();
      appContext.trianglesPointCount = appContext.pointSet.points.length;
      appContext.voronoiCells = [];
      redraw(appContext.pb.draw, appContext.pb.fill);
    };

    /**
     * Convert the triangle set to the Voronoi diagram.
     */
    var makeVoronoiDiagram = function () {
      var voronoiBuilder = new delaunay2voronoi(appContext.pointSet.points, appContext.triangles);
      appContext.voronoiCells = voronoiBuilder.build();
      redraw(appContext.pb.draw, appContext.pb.fill);
      // Handle errors if vertices are too close and/or co-linear:
      if (voronoiBuilder.failedTriangleSets.length != 0) {
        console.log(
          "The error report contains " + voronoiBuilder.failedTriangleSets.length + " unconnected set(s) of triangles:"
        );
        // Draw illegal triangle sets?
        for (var s = 0; s < voronoiBuilder.failedTriangleSets.length; s++) {
          console.log("Set " + s + ": " + JSON.stringify(voronoiBuilder.failedTriangleSets[s]));
          var n = voronoiBuilder.failedTriangleSets[s].length;
          for (var i = 0; i < n; i++) {
            console.log("highlight triangle " + i);
            var tri = voronoiBuilder.failedTriangleSets[s][i];
            drawTriangle(appContext.pb.draw, tri, "rgb(255," + Math.floor(255 * (i / n)) + ",0)");
            appContext.pb.draw.circle(tri.center, tri.radius, "rgb(255," + Math.floor(255 * (i / n)) + ",0)");
          }
        }
        return false;
      } else {
        return true;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Animate the vertices: make them bounce around and reflect on the walls.
    // +-------------------------------
    var animator = null;
    var toggleAnimation = function () {
      if (animator) {
        animator.stop();
      }
      if (appContext.config.animate) {
        if (appContext.config.animationType == "radial") {
          animator = new CircularVertexAnimator(appContext.pointSet.points, appContext.pb.viewport(), rebuild);
        } else {
          // 'linear'
          animator = new LinearVertexAnimator(appContext.pointSet.points, appContext.pb.viewport(), rebuild);
        }
        animator.start();
      } else {
        animator = null;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Toggle Lloyd's algorithm.
    // +-------------------------------
    var toggleLloydAlgorithm = function () {
      if (!appContext.config.runLloydAlgorithm) {
        return;
      }
      // Run next step
      for (var i = 0; i < appContext.voronoiCells.length; i++) {
        updateLloydStep(appContext.voronoiCells[i]);
      }
      rebuild();
      window.requestAnimationFrame(toggleLloydAlgorithm);
    };

    // +---------------------------------------------------------------------------------
    // | Perform the next step/iteration in Lloyd's algorithm.
    // +-------------------------------
    var updateLloydStep = function (cell) {
      if (cell.triangles.length <= 2) {
        return;
      }
      if (cell.isOpen()) {
        return;
      }
      var cellPoly = cell.toPolygon().clone();
      // console.log("cellPoly.vertices.length", cellPoly.vertices.length);
      // drawPolygonIndices(cellPoly, fill, null);
      var centroid = cellPoly.getCentroid(true); // forceClockwise=true
      // draw.polygon(cellPoly, "orange", 2.0);
      // draw.crosshair(centroid, 7, "red", 1.0);
      // draw.line(cell.sharedVertex, centroid, "red", 1.0);

      // Move point 10% towards the centroid
      cell.sharedVertex.lerp(centroid, 0.1);
      // Wrap back into the limiting box if outside.
      cell.sharedVertex.x = Math.max(Math.min(cell.sharedVertex.x, appContext.lloydBox.max.x), appContext.lloydBox.min.x);
      cell.sharedVertex.y = Math.max(Math.min(cell.sharedVertex.y, appContext.lloydBox.max.y), appContext.lloydBox.min.y);
    };

    // +---------------------------------------------------------------------------------
    // | Unfortunately the animator is not smart, so we have to create a new
    // | one (and stop the old one) each time the vertex count changes.
    // +-------------------------------
    var updateAnimator = function () {
      if (!animator) {
        return;
      }
      animator.stop();
      animator = null;
      toggleAnimation();
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext);

    // Init
    // appContext.pointSet.randomPoints(
    //   appContext.config.pointCount,
    //   appContext.config.horizontalSafeArea,
    //   appContext.config.verticalSafeArea
    // ); // , true, false); // clear ; no full cover
    fullCover();
    updateAnimator();
    rebuild();
    toggleLloydAlgorithm();
    appContext.pb.redraw();

    humane.log('This is an enhanced version of the <a href="../07-voronoi-and-delaunay/">07-voronoi-and-delaunay demo</a>.');
  }); // END document.ready / window.onload
})();
