/**
 * A simple 2d point set and image triangulation (color fill).
 *
 * @requires Vertex, Triangle, Polygon, VoronoiCell, delaunay, delaunay2voronoi, saveAs
 *
 * @author   Ikaros Kappler
 * @date     2017-07-31
 * @modified 2018-04-03 Added the voronoi-from-delaunay computation.
 * @modified 2018-04-11 Added the option to draw circumcircles.
 * @modified 2018-04-14 Added quadratic bezier Voronoi cells.
 * @modified 2018-04-16 Added cubic bezier Voronoi cells.
 * @modified 2018-04-22 Added SVG export for cubic and quadratic voronoi cells.
 * @modified 2018-04-28 Added a better mouse handler.
 * @modified 2018-04-29 Added web colors.
 * @modified 2018-05-04 Drawing voronoi cells by their paths now, not the triangles' circumcenters.
 * @modified 2019-04-24 Refactored the whole code and added an animator.
 * @modified 2019-10-25 Using draw.polygon(...) to draw Voronoi cells now. Added configurable colors.
 * @modified 2020-05-18 Replaced new Polygon(cell.toPathArray(),...) by cell.toPolygon().
 * @modified 2020-05-18 Added convex-polygon-incircles to Voronoi cells.
 * @version  2.1.0
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
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          makeVoronoiDiagram: params.getBoolean("makeVoronoiDiagram", true),
          drawPoints: params.getBoolean("drawPoints", true),
          drawTriangles: params.getBoolean("drawTriangles", true),
          drawCircumCircles: params.getBoolean("drawCircumCircles", false),
          drawCubicCurves: params.getBoolean("drawCubicCurves", false),
          fillVoronoiCells: params.getBoolean("fillVoronoiCells", true),
          voronoiOutlineColor: "#00a828", // "rgba(0,168,40,1.0)",
          voronoiCellColor: "#0080c0", // "rgba(0,128,192, 0.5)",
          voronoiCubicThreshold: 1.0,
          voronoiCellScale: 0.8,
          clipVoronoiCells: params.getBoolean("clipVoronoiCells", false),
          drawClipBox: params.getBoolean("drawClipBox", false),
          drawUnclippedVoronoiCells: params.getBoolean("drawUnclippedVoronoiCells", false),
          drawVoronoiIncircles: params.getBoolean("drawVoronoiIncircles", false),
          drawVoronoiOutlines: params.getBoolean("drawVoronoiOutlines", true),
          pointCount: 25,
          rebuild: function () {
            rebuild();
          },
          randomize: function () {
            randomPoints(true, false, false);
            trianglesPointCount = -1;
            rebuild();
          },
          fullCover: function () {
            randomPoints(true, true, false);
            trianglesPointCount = -1;
            rebuild();
          },
          animate: params.getBoolean("animate", false),
          animationType: "linear", // 'linear' or 'radial',
          readme: function () {
            globalThis.displayDemoMeta();
          }
        },
        GUP
      )
    );
    //   {
    //   startAngleDeg: params.getNumber("startAngleDeg", 0.0),
    //   sectorLength: params.getNumber("sectorLength", 60.0),
    //   // radiusep: params.getNumber("radiusStep", 5.0),
    //   // radiusStep: params.getNumber("radiusStep", 5.0),
    //   // circleRadius: params.getNumber("circleRadius", 8.0),
    //   // iterations: params.getNumber("iterations", 100),
    //   // arcThreshold: params.getNumber("arcThreshold", 0.666),
    //   // showSpiralTangents: params.getBoolean("showSpiralTangents", false),
    //   // spiralType: params.getString("spiralType", SPIRAL_TYPES[1]),
    //   readme: function () {
    //     globalThis.displayDemoMeta();
    //   }
    // });
    appContext.rebuild = function () {
      rebuild();
    };
    appContext.toggleAnimation = function () {
      toggleAnimation();
    };
    appContext.updatePointCount = function () {
      updatePointCount();
    };
    appContext.isMobile = isMobile;

    appContext.pb.config.postDraw = function (draw, fill) {
      // In this demo the PlotBoilerplate only draws the vertices.
      // Everything else is drawn by this script, with the help of some PB functions.
      redraw(draw, fill);
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(appContext.pb.eventCatcher).move(function (e) {
      var relPos = appContext.pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      var cx = document.getElementById("cx");
      var cy = document.getElementById("cy");
      if (cx) cx.innerHTML = relPos.x.toFixed(2);
      if (cy) cy.innerHTML = relPos.y.toFixed(2);
    });

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    // var config = PlotBoilerplate.utils.safeMergeByKeys(
    //   {
    //     makeVoronoiDiagram: true,
    //     drawPoints: true,
    //     drawTriangles: true,
    //     drawCircumCircles: false,
    //     drawCubicCurves: false,
    //     fillVoronoiCells: true,
    //     voronoiOutlineColor: "#00a828", // "rgba(0,168,40,1.0)",
    //     voronoiCellColor: "#0080c0", // "rgba(0,128,192, 0.5)",
    //     voronoiCubicThreshold: 1.0,
    //     voronoiCellScale: 0.8,
    //     clipVoronoiCells: false,
    //     drawClipBox: false,
    //     drawUnclippedVoronoiCells: false,
    //     drawVoronoiIncircles: false,
    //     drawVoronoiOutlines: true,
    //     pointCount: 25,
    //     rebuild: function () {
    //       rebuild();
    //     },
    //     randomize: function () {
    //       randomPoints(true, false, false);
    //       trianglesPointCount = -1;
    //       rebuild();
    //     },
    //     fullCover: function () {
    //       randomPoints(true, true, false);
    //       trianglesPointCount = -1;
    //       rebuild();
    //     },
    //     animate: false,
    //     animationType: "linear" // 'linear' or 'radial'
    //   },
    //   GUP
    // );

    var triangles = [];
    var trianglesPointCount = -1; // Keep track of the number of points when the triangles were generated.
    var voronoiDiagram = []; // An array of VoronoiCells.

    // A list of points.
    var pointList = [];

    // +---------------------------------------------------------------------------------
    // | Adds a random point to the point list. Needed for initialization.
    // +-------------------------------
    var addRandomPoint = function () {
      addVertex(Vertex.randomVertex(appContext.pb.viewport()).scale(0.5));
    };

    var addVertex = function (vert) {
      pointList.push(vert);
      appContext.pb.add(vert);
      vert.listeners.addDragListener(function () {
        rebuild();
      });
    };

    // +---------------------------------------------------------------------------------
    // | Generates a random int value between 0 and max (both inclusive).
    // +-------------------------------
    var randomInt = function (max) {
      return Math.round(Math.random() * max);
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given triangle with the specified (CSS-) color.
    // +-------------------------------
    var drawTriangle = function (draw, t, color) {
      draw.line(t.a, t.b, color);
      draw.line(t.b, t.c, color);
      draw.line(t.c, t.a, color);
    };

    /**
     * The re-drawing function.
     */
    var redraw = function (drawLib, fillLib) {
      // Draw triangles
      if (appContext.config.drawTriangles) {
        drawTriangles(drawLib);
      }

      // Draw circumcircles
      if (appContext.config.drawCircumCircles) {
        drawCircumCircles(drawLib);
      }

      // Draw voronoi diagram?
      if (appContext.config.makeVoronoiDiagram) {
        drawVoronoiDiagram(drawLib, fillLib);
      }
    };

    /**
     * A function for drawing the triangles.
     */
    var drawTriangles = function (draw) {
      for (var i in triangles) {
        var t = triangles[i];
        drawTriangle(draw, t, appContext.config.makeVoronoiDiagram ? "rgba(0,128,224,0.33)" : "#0088d8");
      }
    };

    /**
     * Draw the stored voronoi diagram.
     */
    var drawVoronoiDiagram = function (draw, fill) {
      var clipBoxPolygon = Bounds.computeFromVertices(pointList).toPolygon();
      if (appContext.config.drawClipBox) {
        draw.polygon(clipBoxPolygon, "rgba(192,192,192,0.25)");
      }

      for (var v in voronoiDiagram) {
        var cell = voronoiDiagram[v];
        var polygon = cell.toPolygon();
        polygon.scale(appContext.config.voronoiCellScale, cell.sharedVertex);

        // Draw large (unclipped) Voronoi cell
        if (
          appContext.config.drawVoronoiOutlines &&
          (!appContext.config.clipVoronoiCells || appContext.config.drawUnclippedVoronoiCells)
        ) {
          draw.polyline(
            polygon.vertices,
            false,
            appContext.config.clipVoronoiCells ? "rgba(128,128,128,0.333)" : appContext.config.voronoiOutlineColor
          );
        }

        // Apply clipping?
        if (appContext.config.clipVoronoiCells) {
          // Clone the array here: convert Array<XYCoords> to Array<Vertex>
          polygon = new Polygon(cloneVertexArray(sutherlandHodgman(polygon.vertices, clipBoxPolygon.vertices)), false);
        }

        if (appContext.config.drawVoronoiOutlines && appContext.config.clipVoronoiCells) {
          draw.polygon(polygon, config.voronoiOutlineColor);
        }

        if ((!cell.isOpen() || appContext.config.clipVoronoiCells) && cell.triangles.length >= 3) {
          if (appContext.config.drawCubicCurves) {
            var cbezier = polygon.toCubicBezierData(appContext.config.voronoiCubicThreshold);
            if (config.fillVoronoiCells) {
              fill.cubicBezierPath(cbezier, appContext.config.voronoiCellColor);
            } else {
              draw.cubicBezierPath(cbezier, appContext.config.voronoiCellColor);
            }
          }
          if (appContext.config.drawVoronoiIncircles) {
            var result = convexPolygonIncircle(polygon);
            var circle = result.circle;
            var triangle = result.triangle;
            // Here we should have found the best inlying circle (and the corresponding triangle)
            // inside the Voronoi cell.
            draw.circle(circle.center, circle.radius, "rgba(255,192,0,1.0)", 2);
          }
        } // END cell is not open
      }
    };

    /**
     * Draw the circumcircles of all triangles.
     */
    var drawCircumCircles = function (draw) {
      for (var t in triangles) {
        var cc = triangles[t].getCircumcircle();
        draw.circle(cc.center, cc.radius, "#e86800");
      }
    };

    /**
     * The rebuild function just evaluates the input and
     *  - triangulate the point set?
     *  - build the voronoi diagram?
     */
    var rebuild = function () {
      // Only re-triangulate if the point list changed.
      var draw = true;
      triangulate();
      if (appContext.config.makeVoronoiDiagram || appContext.config.drawCubicCurves) {
        draw = makeVoronoiDiagram();
      }

      if (draw) appContext.pb.redraw();
    };

    /**
     * Make the triangulation (Delaunay).
     */
    var triangulate = function () {
      var delau = new Delaunay(pointList, {});
      triangles = delau.triangulate();
      trianglesPointCount = pointList.length;
      voronoiDiagram = [];
      redraw(appContext.pb.draw, appContext.pb.fill);
    };

    /**
     * Convert the triangle set to the Voronoi diagram.
     */
    var makeVoronoiDiagram = function () {
      var voronoiBuilder = new delaunay2voronoi(pointList, triangles);
      voronoiDiagram = voronoiBuilder.build();
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

    /**
     * Add or remove n random points; depends on the config settings.
     *
     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
     */
    var randomPoints = function (clear, fullCover, doRebuild) {
      if (clear) {
        for (var i in pointList) appContext.pb.remove(pointList[i], false);
        pointList = [];
      }
      // Generate random points on image border?
      if (fullCover) {
        var remainingPoints = config.pointCount - pointList.length;
        var borderPoints = Math.sqrt(remainingPoints);
        var ratio = appContext.pb.canvasSize.height / appContext.pb.canvasSize.width;
        var hCount = Math.round((borderPoints / 2) * ratio);
        var vCount = borderPoints / 2 - hCount;

        while (vCount > 0) {
          addVertex(
            new Vertex(
              -appContext.pb.canvasSize.width / 2,
              randomInt(appContext.pb.canvasSize.height / 2) - appContext.pb.canvasSize.height / 2
            )
          );
          addVertex(
            new Vertex(
              appContext.pb.canvasSize.width / 2,
              randomInt(appContext.pb.canvasSize.height / 2) - appContext.pb.canvasSize.height / 2
            )
          );
          vCount--;
        }

        while (hCount > 0) {
          addVertex(new Vertex(randomInt(appContext.pb.canvasSize.width / 2) - appContext.pb.canvasSize.width / 2, 0));
          addVertex(
            new Vertex(
              randomInt(appContext.pb.canvasSize.width / 2) - appContext.pb.canvasSize.width / 2,
              appContext.pb.canvasSize.height / 2
            )
          );
          hCount--;
        }

        // Additionally add 4 points to the corners
        addVertex(new Vertex(0, 0));
        addVertex(new Vertex(appContext.pb.canvasSize.width / 2, 0));
        addVertex(new Vertex(appContext.pb.canvasSize.width / 2, appContext.pb.canvasSize.height / 2));
        addVertex(new Vertex(0, appContext.pb.canvasSize.height / 2));
      }

      // Generate random points.
      for (var i = pointList.length; i < appContext.config.pointCount; i++) {
        addRandomPoint();
      }
      updateAnimator();
      if (doRebuild) rebuild();
    };

    /**
     * Called when the desired number of points changes.
     **/
    var updatePointCount = function () {
      if (appContext.config.pointCount > pointList.length) {
        randomPoints(false, false, true);
      }
      // Do not clear ; no full cover ; do rebuild
      else if (appContext.config.pointCount < pointList.length) {
        // Remove n-m points
        for (var i = appContext.config.pointCount; i < pointList.length; i++) {
          appContext.pb.remove(pointList[i]);
        }
        pointList = pointList.slice(0, appContext.config.pointCount);
        updateAnimator();
        rebuild();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Animate the vertices: make them bounce around and reflect on the walls.
    // +-------------------------------
    var animator = null;
    var toggleAnimation = function () {
      if (config.animate) {
        if (animator) animator.stop();
        if (config.animationType == "radial") animator = new CircularVertexAnimator(pointList, appContext.pb.viewport(), rebuild);
        // 'linear'
        else animator = new LinearVertexAnimator(pointList, appContext.pb.viewport(), rebuild);
        animator.start();
      } else {
        if (animator) animator.stop();
        animator = null;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Unfortunately the animator is not smart, so we have to create a new
    // | one (and stop the old one) each time the vertex count changes.
    // +-------------------------------
    var updateAnimator = function () {
      if (!animator) return;
      animator.stop();
      animator = null;
      toggleAnimation();
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext);

    // // +---------------------------------------------------------------------------------
    // // | Initialize dat.gui
    // // +-------------------------------
    // {
    //   var gui = appContext.pb.createGUI();

    //   // prettier-ignore
    //   gui.add(config, "rebuild").name("Rebuild all").title("Rebuild all.");

    //   var f0 = gui.addFolder("Points");
    //   // prettier-ignore
    //   f0.add(config, "pointCount").min(3).max(200).onChange(function () { config.pointCount = Math.round(config.pointCount);
    //       updatePointCount();
    //     })
    //   .title("The total number of points.");
    //   // prettier-ignore
    //   f0.add(config, "randomize").name("Randomize").title("Randomize the point set.");
    //   // prettier-ignore
    //   f0.add(config, "fullCover").name("Full Cover").title("Randomize the point set with full canvas coverage.");
    //   // prettier-ignore
    //   f0.add(config, "animate").onChange(toggleAnimation).title("Toggle point animation on/off.");
    //   // prettier-ignore
    //   f0.add(config, "animationType", { Linear: "linear", Radial: "radial" }).onChange(function () {
    //     toggleAnimation();
    //   });
    //   f0.open();

    //   var f1 = gui.addFolder("Delaunay");
    //   // prettier-ignore
    //   f1.add(config, "drawTriangles")
    //     .onChange(function () {
    //       appContext.pb.redraw();
    //     })
    //     .title("If checked the triangle edges will be drawn.");
    //   // prettier-ignore
    //   f1.add(config, "drawCircumCircles")
    //     .onChange(function () {
    //       appContext.pb.redraw();
    //     })
    //     .title("If checked the triangles circumcircles will be drawn.");

    //   var f2 = gui.addFolder("Voronoi");
    //   // prettier-ignore
    //   f2.add(config, "makeVoronoiDiagram").onChange(rebuild).title("Make voronoi diagram from the triangle set.");
    //   // prettier-ignore
    //   f2.addColor(config, "voronoiOutlineColor")
    //     .onChange(function () {
    //       appContext.pb.redraw();
    //     })
    //     .title("Choose Voronoi outline color.");
    //   // prettier-ignore
    //   f2.add(config, "drawCubicCurves").onChange(rebuild).title("If checked the Voronoi's cubic curves will be drawn.");
    //   // prettier-ignore
    //   f2.add(config, "drawVoronoiOutlines").onChange(rebuild).title("If checked the Voronoi cells' outlines will be drawn.");
    //   // prettier-ignore
    //   f2.add(config, "drawVoronoiIncircles").onChange(rebuild).title("If checked the Voronoi cells' incircles will be drawn.");
    //   // prettier-ignore
    //   f2.add(config, "fillVoronoiCells").onChange(rebuild).title("If checked the Voronoi cells will be filled.");
    //   // prettier-ignore
    //   f2.add(config, "clipVoronoiCells")
    //     .onChange(rebuild)
    //     .title("If checked the Voronoi cells will be clipped by the bounding rectangle.");
    //   // prettier-ignore
    //   f2.add(config, "drawClipBox").onChange(rebuild).title("If checked the clipbox will be draw.");
    //   // prettier-ignore
    //   f2.add(config, "drawUnclippedVoronoiCells")
    //     .onChange(rebuild)
    //     .title("If checked unclipped Voronoi cells will always be drawn.");
    //   // prettier-ignore
    //   f2.addColor(config, "voronoiCellColor")
    //     .onChange(function () {
    //       appContext.pb.redraw();
    //     })
    //     .title("Choose Voronoi cell color.");
    //   // prettier-ignore
    //   f2.add(config, "voronoiCubicThreshold")
    //     .min(0.0)
    //     .max(1.0)
    //     .onChange(function () {
    //       appContext.pb.redraw();
    //     })
    //     .title("(Experimental) Specifiy the cubic or cell coefficients.");
    //   // prettier-ignore
    //   f2.add(config, "voronoiCellScale")
    //     .min(-1.0)
    //     .max(2.0)
    //     .onChange(function () {
    //       appContext.pb.redraw();
    //     })
    //     .title("Scale each voronoi cell before rendering.");

    //   if (config.animate) toggleAnimation();
    // }

    // Init
    randomPoints(true, false, false); // clear ; no full cover ; do not redraw
    rebuild();
    appContext.pb.redraw();
  }); // END document.ready / window.onload
})();
