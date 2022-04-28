/**
 * A script for testing the Greiner-Hormann polygon intersection algorithm with PlotBoilerplate.
 *
 * @requires delaunay
 * @requires earcut
 * @requires findSelfIntersectingPoints
 * @requires getContrastColor
 * @requires greinerHormann
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires greiner-hormann
 *
 * @author   Ikaros Kappler
 * @date     2020-11-29
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    let Orange = Color.makeRGB(255, 128, 0);

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
          drawGrid: true,
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

    var verticesA = [];
    var verticesB = [];
    // Two points for moving whole polygons :)
    var controlPointA = new Vertex(0, 0);
    var controlPointB = new Vertex(0, 0);
    // The polygons themselves
    var polygonA = null;
    var polygonB = null;

    // +---------------------------------------------------------------------------------
    // | Pick a color from the WebColors array.
    // +-------------------------------
    var randomWebColor = function (alpha, index) {
      if (typeof index === "undefined") index = Math.floor(Math.random() * WebColors.length);
      var clone = WebColors[index % WebColors.length].clone();
      clone.a = alpha;
      return clone.cssRGBA();
    };

    // +---------------------------------------------------------------------------------
    // | Set the source and clipping polygons (as vertices).
    // |
    // | PB drawables will not be cleared.
    // |
    // | @param {Vertex[]} sourcesVertices
    // | @param {Vertex[]} clipVertices
    // +-------------------------------
    var setVertices = function (sourceVertices, clipVertices) {
      // Remove old vertices
      removeVertices(verticesA);
      removeVertices(verticesB);

      verticesA = sourceVertices;
      verticesB = clipVertices;
      // Compute bounds to determie a 'middle' point (used to move whole polygons)
      var boundsA = Bounds.computeFromVertices(sourceVertices);
      var boundsB = Bounds.computeFromVertices(clipVertices);
      // Use center of polygon as control points
      pb.add((controlPointA = new Vertex(boundsA.min).scale(0.5, boundsA.max)));
      pb.add((controlPointB = new Vertex(boundsB.min).scale(0.5, boundsB.max)));
      controlPointA.attr.visible = false;
      controlPointB.attr.visible = false;
      for (var i in verticesA) pb.add(verticesA[i], false); // Do not redraw here
      for (var i in verticesB) pb.add(verticesB[i], false);
      // Bind all polygon points to their respective control point
      adjustPolygons();
      installPolygonControlPoint(controlPointA, polygonA);
      installPolygonControlPoint(controlPointB, polygonB);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Construct polygon: regular or convex hull?
    // +-------------------------------
    var adjustPolygons = function () {
      // Bind all polygon points to their respective control point
      polygonA = new Polygon(config.useConvexHullA ? getConvexHull(verticesA) : verticesA, false);
      polygonB = new Polygon(config.useConvexHullB ? getConvexHull(verticesB) : verticesB, false);
    };

    // +---------------------------------------------------------------------------------
    // | Pick a color from the WebColors array.
    // +-------------------------------
    var removeVertices = function (vertices) {
      if (!vertices || !vertices.length) return;
      for (var i = 0; i < vertices.length; i++) {
        pb.remove(vertices[i], false);
      }
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Install a drag handler that moves all polygon points with the given control point.
    // +-------------------------------
    var installPolygonControlPoint = function (controlPoint, polygon) {
      controlPoint.listeners.addDragListener(function (dragEvent) {
        polygon.move(dragEvent.params.dragAmount);
      });
    };

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawAll = function (draw, fill) {
      if (polygonA == null || polygonB == null) return;
      pb.draw.polygon(polygonA, Teal.cssRGB(), 1.0);
      pb.draw.polygon(polygonB, Orange.cssRGB(), 1.0);

      if (config.useConvexAlgorithm) {
        drawConvexIntersection(polygonA, polygonB);
      } else {
        // Array<Vertex>
        var intersectionPoints = drawGreinerHormannIntersection(
          // This is a workaround about a colinearity problem with greiner-hormann:
          // ... add some random jitter.
          new Polygon(addPolygonJitter(cloneVertexArray(polygonA.vertices), 0.001)),
          new Polygon(addPolygonJitter(cloneVertexArray(polygonB.vertices), 0.001))
        );

        // Draw both control points
        drawFancyCrosshair(draw, fill, controlPointA, Teal.cssRGB(), 2.0, 4.0);
        drawFancyCrosshair(draw, fill, controlPointB, Orange.cssRGB(), 2.0, 4.0);

        if (config.drawPointNumbers) {
          var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
          for (var i = 0; i < polygonA.vertices.length; i++) {
            pb.fill.text("" + i, polygonA.vertices[i].x, polygonA.vertices[i].y, { color: contrastColor });
          }
          for (var i = 0; i < polygonB.vertices.length; i++) {
            pb.fill.text("" + i, polygonB.vertices[i].x, polygonB.vertices[i].y, { color: contrastColor });
          }
        }
      }
    };

    var drawConvexIntersection = function (polygonA, polygonB) {
      var result = sutherlandHodgman(polygonA.vertices, polygonB.vertices);
      pb.fill.polyline(result, false, "rgba(0,164,32,0.333)", 2.0);
      pb.draw.polyline(result, false, "rgb(255,64,0)", 2.0);
    };

    /**
     * Draw the intersection polygon as the result of the Greiner-Horman
     * clipping algorihm.
     *
     * @param {Polygon} sourcePolygon
     * @param {Polygon} clipPolygon
     */
    var drawGreinerHormannIntersection = function (sourcePolygon, clipPolygon) {
      // Array<Vertex> | Array<Array<Vertex>>
      // TODO: the algorithm should be more clear here. Just return an array of Polygons.
      //       If there is only one intersection polygon, there should be a returned
      //       array with length 1. (or 0 if there is none; currently the result is null then).
      var intersection = greinerHormann.intersection(sourcePolygon.vertices, clipPolygon.vertices);
      var area = 0.0;
      var triangleArea = 0.0;

      if (intersection) {
        if (typeof intersection[0][0] === "number") {
          // single linear ring
          intersection = [intersection];
        }

        for (var i = 0, len = intersection.length; i < len; i++) {
          // Warning intersection polygons may have duplicate vertices (beginning and end).
          // Remove duplicate vertices from the intersection polygons.
          // These may also occur if two vertices of the clipping and the source polygon are congruent.
          var intrsctn = intersection[i];
          // var intrsctn = clearPolygonDuplicateVertices( intersection[i] );

          var clearedPolys = config.clearSelfIntersections ? splitPolygonToNonIntersecting(intrsctn, 10) : [intrsctn];

          for (var j = 0; j < clearedPolys.length; j++) {
            pb.fill.polyline(clearedPolys[j], false, randomWebColor(0.25, i * intersection.length + j), 2.0); // Polygon is not open

            if (config.triangulate) {
              var triangles = null;
              if (config.triangulationMethod === "Delaunay") {
                triangles = drawTriangulation_delaunay(
                  pb,
                  new Polygon(clearedPolys[j]),
                  sourcePolygon,
                  clipPolygon,
                  config.drawDelaunayCircles
                );
              } else if (config.triangulationMethod === "Earcut") {
                triangles = drawTriangulation_earcut(pb, new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon);
              }
              // Add triangle area
              triangleArea += calculateTrianglesArea(triangles);
            }
            area += Polygon.utils.area(clearedPolys[j]);
          } // END for
        } // END for
      } // END if

      // Update the stats (experimental)
      stats.area = area;
      stats.triangleArea = config.triangulate ? triangleArea : NaN;
      // TODO: think about these areas
      stats.areaA = sourcePolygon.area();
      stats.areaB = clipPolygon.area();
      stats.signedAreaA = sourcePolygon.signedArea();
      stats.signedAreaB = clipPolygon.signedArea();
      stats.polygonsIntersect = intersection !== null && typeof intersection !== "undefined" && intersection.length > 0;
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "polygon-demo")
      .move(function (e) {
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        stats.positionInA = polygonA != null && relPos != null && polygonA.containsVert(relPos);
        stats.positionInB = polygonB != null && relPos != null && polygonB.containsVert(relPos);
        stats.mouseX = relPos.x;
        stats.mouseY = relPos.y;
      })
      .drag(function (e) {
        // When vertices are moved, the convex hull might change
        if (config.useConvexHullA || config.useConvexHullB) adjustPolygons();
      });

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        drawPointNumbers: false,
        useConvexHullA: true,
        useConvexHullB: true,
        useConvexAlgorithm: false,
        triangulate: false,
        triangulationMethod: "Delaunay", // [ "Delaunay", "Earcut" ]
        clearSelfIntersections: true,
        drawDelaunayCircles: false,

        test_random: function () {
          loadRandomTestCase(pb, setVertices);
        },
        test_squares: function () {
          loadSquareTestCase(pb, setVertices);
        },
        test_girih: function () {
          loadGirihTestCase(pb, setVertices);
        }
      },
      GUP
    );

    var stats = {
      area: 0.0,
      triangleArea: NaN,
      signedAreaA: 0.0,
      areaA: 0.0,
      signedAreaB: 0.0,
      areaB: 0.0,
      polygonsIntersect: false,
      positionInA: false,
      positionInB: false,
      mouseX: 0,
      mouseY: 0
    };
    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();

      var fold0 = gui.addFolder("Test Cases");
      // prettier-ignore
      fold0.add(config, 'test_random').name('Random').title('Load the \'Random\' test case.');
      // prettier-ignore
      fold0.add(config, 'test_squares').name('Squares').title('Load the \'Squares\' test case.');
      // prettier-ignore
      fold0.add(config, 'test_girih').name('Girih').title('Load the \'Girih\' test case.');

      var fold1 = gui.addFolder("Greiner-Hormann");
      // prettier-ignore
      fold1.add(config, 'drawPointNumbers').listen().onChange( function() { pb.redraw(); } ).name('drawPointNumbers').title('Tringulate the result?');
      // prettier-ignore
      fold1.add(config, 'useConvexHullA').onChange( function() { setVertices(verticesA,verticesB); pb.redraw(); } ).name('useConvexHullA').title('Use the convex hull of polygon A?');
      // prettier-ignore
      fold1.add(config, 'useConvexHullB').onChange( function() { setVertices(verticesA,verticesB); pb.redraw(); } ).name('useConvexHullB').title('Use the convex hull of polygon B?');
      // prettier-ignore
      fold1.add(config, 'triangulate').listen().onChange( function() { pb.redraw(); } ).name('triangulate').title('Tringulate the result?');
      // prettier-ignore
      fold1.add(config, 'clearSelfIntersections').listen().onChange( function() { pb.redraw(); } ).name('clearSelfIntersections').title('Clear polygons of self intersections before triangulating?');
      // prettier-ignore
      fold1.add(config, 'triangulationMethod', ['Delaunay','Earcut']).listen().onChange( function() { pb.redraw(); } ).name('triangulationMethod').title('The triangulation method to use (Delaunay is not safe here; might result in ivalid triangulations)');
      // prettier-ignore
      fold1.add(config, 'drawDelaunayCircles').listen().onChange( function() { pb.redraw(); } ).name('drawDelaunayCircles').title('Draw triangle circumcircles when in Delaunay mode?');
      // prettier-ignore
      fold1.open();

      var fold2 = gui.addFolder("Sutherland-Hodgman");
      // prettier-ignore
      fold2.add(config, 'useConvexAlgorithm' ).onChange( function() { pb.redraw() } ).name('useConvexAlgorithm').title('Force use of regular convex polygon algorithm. Will fail if any of the polygons is not convex.');
      if (config.useConvedAlgorithm) fold2.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("area").precision(3).suffix(" spx");
      uiStats.add("triangleArea").precision(3).suffix(" spx");
      uiStats.add("areaA").precision(3).suffix(" spx");
      uiStats.add("areaB").precision(3).suffix(" spx");
      uiStats.add("signedAreaA").precision(3).suffix(" spx");
      uiStats.add("signedAreaB").precision(3).suffix(" spx");
      uiStats.add("polygonsIntersect");
      uiStats.add("positionInA");
      uiStats.add("positionInB");
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    // +---------------------------------------------------------------------------------
    // | Initialize
    // +-------------------------------
    pb.config.preDraw = drawAll;
    loadRandomTestCase(pb, setVertices);
    pb.redraw();
  };

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
