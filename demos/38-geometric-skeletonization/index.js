/**
 * A demo to visualize 'Geometric Skeletonization'.
 *
 * This script was inspired by
 *    https://observablehq.com/@veltman/centerline-labeling
 *
 * @requires getAvailableContainerSpace
 * @requires drawutilssvg
 * @requires gup
 * @requires dat.gui
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-12-14
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
        interpolationPointCount: 24 * 4,
        drawOriginalPolygon: true,
        drawVertexNumbers: false,
        drawVoronoiCells: true,
        drawVoronoiGraph: false,
        drawClippedPolygons: false,
        drawOuterGraphVertices: true,
        stripSubEdges: true,
        drawLongestPath: false,
        drawSkeleton: true
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Some prepared 'random' polygon.
    // +-------------------------------
    // prettier-ignore
    var rawData = [{ x: -231, y: -30 }, { x: -225, y: -72 }, { x: -180, y: -93 }, { x: -136, y: -131 }, { x: -86, y: -106 }, { x: -41, y: -130 }, { x: 42, y: -158 }, { x: 108, y: -145 }, { x: 193, y: -105 }, { x: 232, y: -61 }, { x: 214, y: -4 }, { x: 252, y: 37 }, { x: 291, y: 68 }, { x: 311, y: 120 }, { x: 273, y: 163 }, { x: 127, y: 209 }, { x: 103, y: 143 }, { x: 81, y: 67 }, { x: 9, y: 54 }, { x: -69, y: 80 }, { x: -80, y: 124 }, { x: -97, y: 162 }, { x: -201, y: 179 }, { x: -308, y: 128 }];
    // +---------------------------------------------------------------------------------
    // | A prepared square polygon.
    // +-------------------------------
    // var devY = 20;
    // prettier-ignore
    // var rawData = [ { x: -200, y: -200 - devY }, { x: 200, y: -200 - devY }, { x: 200, y: 200 + devY }, { x: -200, y: 200 + devY } ];

    var rawPolygon = new Polygon(
      rawData.map(function (coords) {
        return new Vertex(coords);
      }),
      false
    );
    var polygon = null;

    // +---------------------------------------------------------------------------------
    // | Point list and Voronoi helper.
    // +-------------------------------
    // Array<Vertex>
    var pointList = [];
    // VoronoiHelper
    var voronoiHelper = null;
    // Array<Polygon>
    var cellPolygons = null;
    // Array<Polygon>
    var clippedCells = null;
    // Graph
    var voronoiGraph = null;
    // Graph
    var clippedVoronoiGraph = null;
    // Array<number>
    var outerVertexIndices = null;
    // Array<number>
    var longestPath = [];

    // +---------------------------------------------------------------------------------
    // | Called when the desired interpolation point count changes.
    // | Updates the polygon by interpolation the original one with the new point count.
    // | Also called when a vertex of the raw input polygon was dragged around.
    // +-------------------------------
    var handleInterpolationPointCount = function () {
      longestPath = [];
      polygon = rawPolygon.getEvenDistributionPolygon(config.interpolationPointCount);
      handlePolygonChange();
    };

    // +---------------------------------------------------------------------------------
    // | Called when a vertex in the polygon changed.
    // | Re-calculates the Voronoi graph.
    // +-------------------------------
    var handlePolygonChange = function () {
      var boundingBox = polygon.getBounds();
      var boundingBoxPolygon = boundingBox.toPolygon().scale(1.2, boundingBox.getCenter());
      pointList = polygon.vertices.concat(boundingBoxPolygon.vertices);

      pb.removeAll(false, false);
      pb.add(polygon, false);
      for (var i in polygon.vertices) {
        polygon.vertices[i].attr.visible = true;
        polygon.vertices[i].attr.draggable = false;
        polygon.vertices[i].attr.selectable = false;
      }
      if (config.drawOriginalPolygon) {
        pb.add(rawPolygon);
      }

      voronoiHelper = new VoronoiHelper(cloneVertexArray(pointList));
      voronoiHelper.triangulate();
      voronoiHelper.makeVoronoiDiagram();
      computeLongestPath();
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Install drag listeners to the polygon vertices (e.g. when polygon was added to the canvas).
    // +-------------------------------
    var installDragEndListeners = function (polygon, listener) {
      for (var i = 0; i < polygon.vertices.length; i++) {
        polygon.vertices[i].listeners.addDragEndListener(listener); // handlePolygonChange);
      }
    };
    installDragEndListeners(rawPolygon, handleInterpolationPointCount);
    // var longestPath = [];

    // +---------------------------------------------------------------------------------
    // | Install drag listeners to the polygon vertices (e.g. when polygon was added to the canvas).
    // +-------------------------------
    var computeLongestPath = function () {
      cellPolygons = voronoiHelper.voronoiCellsToPolygons();
      // Convert voronoi cells to graph { vertices, edges }
      voronoiGraph = new voronoi2graph(cellPolygons, 0.0000001);
      // Clip the voronoi cells before proceeding
      // Array<Polygon>
      clippedCells = voronoiHelper.clipVoronoiDiagram(polygon);
      // Convert the (clipped) Voronoi cells to a graph
      // and find the shortest path.
      clippedVoronoiGraph = new voronoi2graph(clippedCells, 0.0000001);
      outerVertexIndices = stripOuterClipGraphEdges(clippedVoronoiGraph, polygon, config.stripSubEdges, 0.0000001);
      // Find longest path
      longestPath = findLongestPathUAG(clippedVoronoiGraph, outerVertexIndices);
      // console.log("longestPath", longestPath);
    };

    // +---------------------------------------------------------------------------------
    // | Removes or add the original polygon depending on the config setting.
    // +-------------------------------
    var toggleOriginalPolygon = function () {
      if (config.drawOriginalPolygon) {
        pb.add(rawPolygon);
      } else {
        pb.remove(rawPolygon, true, true);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Render additional stuff after tghe default elements were draw.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      if (config.drawVoronoiCells) {
        drawVoronoiDiagram(draw, fill);
      }

      if (config.drawVertexNumbers) {
        var color = getContrastColor(Color.parse(pb.config.backgroundColor)).setAlpha(0.5).cssRGBA();
        drawVertexNumbers(draw, fill, polygon.vertices, color);
      }

      if (config.drawSkeleton || config.drawVoronoiGraph) {
        if (config.drawVoronoiGraph) {
          drawVoronoiGraph(draw, voronoiGraph, "rgba(192,0,192,0.2)", 5);
        }

        if (config.drawSkeleton) {
          if (config.drawClippedPolygons) {
            drawPolygonSet(clippedCells, draw, fill, "rgba(0,128,192,0.4)", 3);
          }
          drawVoronoiGraph(draw, clippedVoronoiGraph, "rgba(0,128,128,0.8)", 3);
          if (config.drawOuterGraphVertices) {
            drawOuterGraphVertices(draw, fill, outerVertexIndices, clippedVoronoiGraph, config.drawVertexNumbers);
          }
          if (config.drawLongestPath) {
            for (var p = 0; p + 1 < longestPath.length; p++) {
              var i = longestPath[p];
              var j = longestPath[p + 1];
              var vertA = clippedVoronoiGraph.vertices[i];
              var vertB = clippedVoronoiGraph.vertices[j];
              draw.line(vertA, vertB, "red", 1);
            }
          }
        }
      }
    };

    var drawVertexNumbers = function (draw, fill, vertices, color) {
      for (var i = 0; i < vertices.length; i++) {
        var p = vertices[i];
        fill.text("" + i, p.x + 5, p.y, { color: color, fontSize: 11 / draw.scale.x });
      }
    };

    var drawVoronoiGraph = function (draw, graph, color, lineWidth) {
      for (var e = 0; e < graph.edges.length; e++) {
        var edge = graph.edges[e];
        var vertA = graph.vertices[edge.i];
        var vertB = graph.vertices[edge.j];
        if (!vertA || !vertB) {
          console.log("err ", e, edge, vertA, vertB);
        }
        draw.line(vertA.clone(), vertB.clone(), color, lineWidth);
      }
    };

    /**
     * Draw the stored voronoi diagram.
     */
    var drawVoronoiDiagram = function (draw, fill) {
      for (var v in voronoiHelper.voronoiDiagram) {
        var cell = voronoiHelper.voronoiDiagram[v];
        var poly = cell.toPolygon();
        draw.polyline(poly.vertices, poly.isOpen, "rgba(128,128,128,0.333)", 1);
      }
    };

    /**
     * Draw the stored voronoi diagram.
     */
    var drawPolygonSet = function (polygons, draw, fill, color, lineWidth) {
      for (var p in polygons) {
        var poly = polygons[p];
        draw.polyline(poly.vertices, poly.isOpen, color, lineWidth);
      }
    };

    var drawOuterGraphVertices = function (draw, fill, vertexIndices, graph, drawLabels) {
      for (var i = 0; i < vertexIndices.length; i++) {
        var index = vertexIndices[i];
        var vertex = graph.vertices[index];
        fill.diamondHandle(vertex, 3, "red");
        if (drawLabels) {
          fill.text("" + index, vertex.x + 5, vertex.y, { color: "red", fontSize: 11 / draw.scale.x });
        }
      }
    };

    var redraw = function () {
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    // var gui = new dat.gui.GUI();
    var gui = pb.createGUI();
    gui.remember(config);
    var guiSize = guiSizeToggler(gui, config);
    if (isMobileDevice()) {
      config.guiDoubleSize = true;
      guiSize.update();
    }
    gui.add(config, "guiDoubleSize").title("Double size GUI?").onChange(guiSize.update);

    var f0 = gui.addFolder("Settings");
    // prettier-ignore
    f0.add(config, "interpolationPointCount").min(1).max(100).title("The interpolation point count.").onChange( handleInterpolationPointCount );
    f0.add(config, "drawVertexNumbers").title("Check if polygon vertex numbers should be drawn.").onChange(redraw);
    f0.add(config, "drawOriginalPolygon").title("Draw original polygon?").onChange(toggleOriginalPolygon);
    f0.add(config, "drawVoronoiCells").title("Draw voronoi cells?").onChange(redraw);
    f0.add(config, "drawVoronoiGraph").title("Draw voronoi graph?").onChange(redraw);
    f0.add(config, "drawClippedPolygons").title("Draw clipped polygons?").onChange(redraw);
    f0.add(config, "stripSubEdges").title("Strip sub edges from clipped graph?").onChange(handlePolygonChange);
    f0.add(config, "drawOuterGraphVertices").title("Draw vertices located on the outer graph bounds?").onChange(redraw);
    f0.add(config, "drawLongestPath").title("Draw longest detected path?").onChange(redraw);
    f0.add(config, "drawSkeleton").title("Draw skeleton?").onChange(redraw);
    f0.open();

    handleInterpolationPointCount();
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(window);
