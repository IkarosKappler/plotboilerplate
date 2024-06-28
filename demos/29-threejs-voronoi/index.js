/**
 * A script for testing the lib with three.js.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires three.js
 *
 * @author   Ikaros Kappler
 * @date     2021-01-10
 * @version  1.0.0
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
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,
          enableSVGExport: false
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    var bezierDistanceT = 0.0;
    var bezierDistanceLine = null;

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        showNormals: false,
        normalsLength: 10.0,
        useTextureImage: false,
        textureImagePath: "wood.png",
        wireframe: false,
        exportSTL: function () {
          exportSTL();
        },

        makeVoronoiDiagram: true,
        drawPoints: true,
        drawCubicCurves: false,
        voronoiOutlineColor: "rgba(0,168,40, 1.0)",
        voronoiCellColor: "rgba(0,128,192, 0.5)",
        voronoiCubicThreshold: 1.0,
        voronoiCellScale: 0.8,
        clipVoronoiCells: true,
        drawVoronoiOutlines: true,

        pointCount: 32,
        rebuild: function () {
          rebuildVoronoi();
        },
        randomize: function () {
          randomPoints(true, false, false);
          trianglesPointCount = -1;
          rebuildVoronoi();
        },
        fullCover: function () {
          randomPoints(true, true, false);
          trianglesPointCount = -1;
          rebuildVoronoi();
        }
      },
      GUP
    );

    var triangles = [];
    var trianglesPointCount = -1; // Keep track of the number of points when the triangles were generated.
    var voronoiDiagram = []; // An array of VoronoiCells.

    // A list of points.
    var pointList = [];

    // +---------------------------------------------------------------------------------
    // | Adds a random point to the point list. Needed for initialization.
    // +-------------------------------
    var addRandomPoint = function () {
      addVertex(randomVertex());
    };

    var addVertex = function (vert) {
      pointList.push(vert);
      pb.add(vert);
      vert.listeners.addDragListener(function () {
        rebuildVoronoi();
      });
    };

    // +---------------------------------------------------------------------------------
    // | Removes a random point from the point list.
    // +-------------------------------
    var removeRandomPoint = function () {
      if (pointList.length > 1) pb.remove(pointList.pop());
    };

    // +---------------------------------------------------------------------------------
    // | Generates a random int value between 0 and max (both inclusive).
    // +-------------------------------
    var randomInt = function (max) {
      return Math.round(Math.random() * max);
    };

    /**
     * The re-drawing function.
     */
    var redraw = function () {
      // Draw voronoi diagram?
      if (config.makeVoronoiDiagram) drawVoronoiDiagram();
    };

    /**
     * Draw the stored voronoi diagram.
     */
    var drawVoronoiDiagram = function () {
      var clipBoxPolygon = Bounds.computeFromVertices(pointList).toPolygon();
      for (var v in voronoiDiagram) {
        var cell = voronoiDiagram[v];
        var polygon = cell.toPolygon();
        polygon.scale(config.voronoiCellScale, cell.sharedVertex);

        // Draw large (unclipped) Voronoi cell
        if (config.drawVoronoiOutlines) {
          pb.draw.polyline(
            polygon.vertices,
            false,
            config.clipVoronoiCells ? "rgba(128,128,128,0.333)" : config.voronoiOutlineColor
          );
        }

        // Apply clipping?
        if (config.clipVoronoiCells) {
          // Clone the array here: convert Array<XYCoords> to Array<Vertex>
          polygon = new Polygon(cloneVertexArray(sutherlandHodgman(polygon.vertices, clipBoxPolygon.vertices)), false);
        }

        if (config.drawVoronoiOutlines && config.clipVoronoiCells) {
          pb.draw.polygon(polygon, config.voronoiOutlineColor);
        }

        if (!cell.isOpen() && cell.triangles.length >= 3) {
          if (config.drawCubicCurves) {
            var cbezier = polygon.toCubicBezierData(config.voronoiCubicThreshold);
            if (config.fillVoronoiCells) pb.fill.cubicBezierPath(cbezier, config.voronoiCellColor);
            else pb.draw.cubicBezierPath(cbezier, config.voronoiCellColor);
          }
          if (config.drawVoronoiIncircles) {
            var result = convexPolygonIncircle(polygon);
            var circle = result.circle;
            var triangle = result.triangle;
            // Here we should have found the best inlying circle (and the corresponding triangle)
            // inside the Voronoi cell.
            pb.draw.circle(circle.center, circle.radius, "rgba(255,192,0,1.0)", 2);
          }
        } // END cell is not open
      }
    };

    /**
     * Draw the circumcircles of all triangles.
     */
    var drawCircumCircles = function () {
      for (var t in triangles) {
        var cc = triangles[t].getCircumcircle();
        pb.draw.circle(cc.center, cc.radius, "#e86800");
      }
    };

    /**
     * The rebuild function just evaluates the input and
     *  - triangulate the point set?
     *  - build the voronoi diagram?
     */
    var rebuildVoronoi = function () {
      // Only re-triangulate if the point list changed.
      var draw = true;
      triangulate();
      if (config.makeVoronoiDiagram || config.drawCubicCurves) draw = makeVoronoiDiagram();

      if (draw) pb.redraw();

      rebuildVoronoiMesh();
    };

    /**
     * Make the triangulation (Delaunay).
     */
    var triangulate = function () {
      var delau = new Delaunay(pointList, {});
      triangles = delau.triangulate();
      trianglesPointCount = pointList.length;
      voronoiDiagram = [];
    };

    /**
     * Convert the triangle set to the Voronoi diagram.
     */
    var makeVoronoiDiagram = function () {
      var voronoiBuilder = new delaunay2voronoi(pointList, triangles);
      voronoiDiagram = voronoiBuilder.build();
      redraw();
      // Handle errors if vertices are too close and/or co-linear:
      if (voronoiBuilder.failedTriangleSets.length != 0) {
        console.log(
          "The error report contains " + voronoiBuilder.failedTriangleSets.length + " unconnected set(s) of triangles:"
        );
        // Draw illegal triangle sets?
        for (var s = 0; s < voronoiBuilder.failedTriangleSets.length; s++) {
          // console.log( 'Set '+s+': ' + JSON.stringify(voronoiBuilder.failedTriangleSets[s]) );
          var n = voronoiBuilder.failedTriangleSets[s].length;
          for (var i = 0; i < n; i++) {
            // console.log('highlight triangle ' + i );
            var tri = voronoiBuilder.failedTriangleSets[s][i];
            drawTriangle(tri, "rgb(255," + Math.floor(255 * (i / n)) + ",0)");
            draw.circle(tri.center, tri.radius, "rgb(255," + Math.floor(255 * (i / n)) + ",0)");
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
        for (var i in pointList) pb.remove(pointList[i], false);
        pointList = [];
      }
      // Generate random points on image border?
      if (fullCover) {
        var remainingPoints = config.pointCount - pointList.length;
        var borderPoints = Math.sqrt(remainingPoints);
        var ratio = pb.canvasSize.height / pb.canvasSize.width;
        var hCount = Math.round((borderPoints / 2) * ratio);
        var vCount = borderPoints / 2 - hCount;

        while (vCount > 0) {
          addVertex(new Vertex(-pb.canvasSize.width / 2, randomInt(pb.canvasSize.height / 2) - pb.canvasSize.height / 2));
          addVertex(new Vertex(pb.canvasSize.width / 2, randomInt(pb.canvasSize.height / 2) - pb.canvasSize.height / 2));
          vCount--;
        }

        while (hCount > 0) {
          addVertex(new Vertex(randomInt(pb.canvasSize.width / 2) - pb.canvasSize.width / 2, 0));
          addVertex(new Vertex(randomInt(pb.canvasSize.width / 2) - pb.canvasSize.width / 2, pb.canvasSize.height / 2));
          hCount--;
        }

        // Additionally add 4 points to the corners
        addVertex(new Vertex(0, 0));
        addVertex(new Vertex(pb.canvasSize.width / 2, 0));
        addVertex(new Vertex(pb.canvasSize.width / 2, pb.canvasSize.height / 2));
        addVertex(new Vertex(0, pb.canvasSize.height / 2));
      }

      // Generate random points.
      for (var i = pointList.length; i < config.pointCount; i++) {
        addRandomPoint();
      }
      // updateAnimator();
      if (doRebuild) rebuildVoronoi();
    };

    /**
     * Called when the desired number of points changes.
     **/
    var updatePointCount = function () {
      if (config.pointCount > pointList.length) randomPoints(false, false, true); // Do not clear ; no full cover ; do rebuild
      else if (config.pointCount < pointList.length) {
        // Remove n-m points
        for (var i = config.pointCount; i < pointList.length; i++) pb.remove(pointList[i]);
        pointList = pointList.slice(0, config.pointCount);
        updateAnimator();
        rebuildVoronoi();
      }
    };

    var voronoiGeneration = new VoronoiGeneration("three-canvas");
    var modal = new Modal();

    // +---------------------------------------------------------------------------------
    // | Export the model as an STL file.
    // +-------------------------------
    var exportSTL = function () {
      function saveFile(data, filename) {
        saveAs(new Blob([data], { type: "application/sla" }), filename);
      }
      modal.setTitle("Export STL");
      modal.setFooter("");
      modal.setActions([
        {
          label: "Cancel",
          action: function () {
            modal.close();
            console.log("canceled");
          }
        }
      ]);
      modal.setBody("Loading ...");
      modal.open();
      try {
        voronoiGeneration.generateSTL({
          onComplete: function (stlData) {
            window.setTimeout(function () {
              modal.setBody("File ready.");
              modal.setActions([Modal.ACTION_CLOSE]);
              saveFile(stlData, "voronoiomodel.stl");
            }, 500);
          }
        });
      } catch (e) {
        modal.setBody("Error: " + e);
        modal.setActions([Modal.ACTION_CLOSE]);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Delay the build a bit. And cancel stale builds.
    // | This avoids too many rebuilds (pretty expensive) on mouse drag events.
    // +-------------------------------
    var buildId = null;
    var rebuildVoronoiMesh = function () {
      var buildId = new Date().getTime();
      var clipBoxPolygon = config.clipVoronoiCells ? Bounds.computeFromVertices(pointList).toPolygon() : null;
      voronoiGeneration.rebuild(Object.assign({ voronoiDiagram: voronoiDiagram, clipPolygon: clipBoxPolygon }, config));
    };

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

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var fold0 = gui.addFolder("Mesh");
      fold0
        .add(config, "showNormals")
        .onChange(function () {
          rebuildVoronoi();
        })
        .name("showNormals")
        .title("Show the vertex normals.");
      fold0
        .add(config, "normalsLength")
        .min(1.0)
        .max(20.0)
        .onChange(function () {
          rebuildVoronoi();
        })
        .name("normalsLength")
        .title("The length of rendered normals.");
      fold0
        .add(config, "useTextureImage")
        .onChange(function () {
          rebuildVoronoi();
        })
        .name("useTextureImage")
        .title("Use a texture image.");
      fold0
        .add(config, "wireframe")
        .onChange(function () {
          rebuildVoronoi();
        })
        .name("wireframe")
        .title("Display the mesh as a wireframe model.");

      var fold1 = gui.addFolder("Export");
      fold1.add(config, "exportSTL").name("STL").title("Export an STL file.");

      var f3 = gui.addFolder("Points");
      f3.add(config, "pointCount")
        .min(3)
        .max(200)
        .onChange(function () {
          config.pointCount = Math.round(config.pointCount);
          updatePointCount();
        })
        .title("The total number of points.");
      f3.add(config, "randomize").name("Randomize").title("Randomize the point set.");
      f3.add(config, "fullCover").name("Full Cover").title("Randomize the point set with full canvas coverage.");

      var f5 = gui.addFolder("Voronoi");
      f5.addColor(config, "voronoiOutlineColor")
        .onChange(function () {
          pb.redraw();
        })
        .title("Choose Voronoi outline color.");
      f5.add(config, "drawCubicCurves").onChange(rebuildVoronoi).title("If checked the Voronoi's cubic curves will be drawn.");
      // f5.add(config, 'drawVoronoiOutlines').onChange( rebuildVoronoi ).title("If checked the Voronoi cells' outlines will be drawn.");
      // f5.add(config, 'drawVoronoiIncircles').onChange( rebuildVoronoi ).title("If checked the Voronoi cells' incircles will be drawn.");
      // f5.add(config, 'fillVoronoiCells').onChange( rebuildVoronoi ).title("If checked the Voronoi cells will be filled.");
      f5.addColor(config, "voronoiCellColor")
        .onChange(function () {
          pb.redraw();
        })
        .title("Choose Voronoi cell color.");
      f5.add(config, "voronoiCubicThreshold")
        .min(0.0)
        .max(1.0)
        .onChange(function () {
          pb.redraw();
        })
        .title("(Experimental) Specifiy the cubic or cell coefficients.");
      f5.add(config, "voronoiCellScale")
        .min(-1.0)
        .max(2.0)
        .onChange(function () {
          pb.redraw();
          rebuildVoronoi();
        })
        .title("Scale each voronoi cell before rendering.");
      f5.add(config, "clipVoronoiCells")
        .onChange(function () {
          pb.redraw();
          rebuildVoronoi();
        })
        .title("Clip Voronoi cells?");
    }

    pb.config.postDraw = redraw;
    randomPoints(true, false, false); // clear ; no full cover ; do not redraw
    rebuildVoronoi();
  });
})(window);
