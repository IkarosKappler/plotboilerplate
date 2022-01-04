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

// TODOs:
//  reducing the polygon fails (only upscaling works)
//  some voronoi GRAPH edges are missing from voronoi2graph

(function (_context) {
  "use strict";

  // Fetch the GET params
  var GUP = gup();
  // globalThis.isDarkMode = detectDarkMode(GUP);

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
    var devY = 20;
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

    // +---------------------------------------------------------------------------------
    // | Called when the desired interpolation point count changes.
    // | Updates the polygon by interpolation the original one with the new point count.
    // | Also called when a vertex of the raw input polygon was dragged around.
    // +-------------------------------
    var handleInterpolationPointCount = function () {
      if (polygon) {
        removeDragListeners();
      }
      polygon = rawPolygon.getEvenDistributionPolygon(config.interpolationPointCount);
      // polygon = evenlyPolygon(rawPolygon, config.interpolationPointCount);
      // console.log("EvenlyPolygon #vertices", polygon.vertices.length);
      handlePolygonChange();
      installDragListeners();
    };

    for (var i in rawPolygon.vertices) {
      rawPolygon.vertices[i].listeners.addDragListener(handleInterpolationPointCount);
    }

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
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Install drag listeners to the polygon vertices (e.g. when polygon was added to the canvas).
    // +-------------------------------
    var installDragListeners = function () {
      for (var i = 0; i < polygon.vertices.length; i++) {
        polygon.vertices[i].listeners.addDragListener(handlePolygonChange);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Uninstall drag listeners (e.g. when polygon is removed from the canvas).
    // +-------------------------------
    var removeDragListeners = function () {
      for (var i = 0; i < polygon.vertices.length; i++) {
        polygon.vertices[i].listeners.removeDragListener(handlePolygonChange);
      }
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
        drawVertexNumbers(draw, fill);
      }

      if (config.drawVoronoiGraph) {
        var cellPolygons = voronoiHelper.voronoiCellsToPolygons();
        // Convert voronoi cells to graph { vertices, edges }
        var voronoiGraph = new voronoi2graph(cellPolygons, 0.0000001);
        drawVoronoiGraph(draw, voronoiGraph, "rgba(192,0,192,0.2)", 1);
        // console.log("voronoiGraph.edges", voronoiGraph.edges.length, "voronoiGraph.vertices", voronoiGraph.vertices.length);
      }

      if (config.drawSkeleton) {
        // Clip the voronoi cells before proceeding
        var clippedCells = voronoiHelper.clipVoronoiDiagram(polygon);
        // Draw clipped voronoi cells
        // drawPolygonSet(clippedCells, draw, fill);

        // Convert the (clipped) Voronoi cells to a graph
        // and find the shortest path.
        var clippedVoronoiGraph = new voronoi2graph(clippedCells, 0.0000001);
        // console.log(
        //   "[before] clippedVoronoiGraph.edges",
        //   clippedVoronoiGraph.edges.length,
        //   "clippedVoronoiGraph.vertices",
        //   clippedVoronoiGraph.vertices.length
        // );
        stripOuterClipGraphEdges(clippedVoronoiGraph, polygon);
        // TODO: shortest path algorithm?
        drawVoronoiGraph(draw, clippedVoronoiGraph, "rgba(0,128,192,0.4)", 3);
        // console.log(
        //   "[after] clippedVoronoiGraph.edges",
        //   clippedVoronoiGraph.edges.length,
        //   "clippedVoronoiGraph.vertices",
        //   clippedVoronoiGraph.vertices.length
        // );

        // Find longest path
        // var longestPathGraphMatrix = longestPathUAG(clippedVoronoiGraph);
        // console.log("longestPathGraphMatrix", longestPathGraphMatrix);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Strip all those edges from the graph that belong to the clipping
    // | polygon (that is the outer border here).
    // |
    // | Note: this only works as the complete clip polygon lies _inside_ the
    // |       Voronoi diagram. This guarantees that all outer graph edges must
    // |       be some former edge segment of the clipping polygon.
    // +-------------------------------
    // TODO: move to separate file
    var stripOuterClipGraphEdges = function (graph, clipPolygon) {
      var edgeComparator = function (edgeA, edgeB) {
        return (edgeA.i === edgeB.i && edgeA.j === edgeB.j) || (edgeA.i === edgeB.j && edgeA.j === edgeB.i);
      };
      var edgeAsLine = new Line(new Vertex(), new Vertex());
      var newEdges = new ArraySet(edgeComparator);
      for (var e = 0; e < graph.edges.length; e++) {
        var edge = graph.edges[e];
        var vertA = graph.vertices[edge.i];
        var vertB = graph.vertices[edge.j];
        // console.log("vertA", vertA, "vertB", vertB);
        edgeAsLine.a.set(vertA);
        edgeAsLine.b.set(vertB);
        // if (e < 5) {
        //   console.log("edgeAsLine", edgeAsLine);
        // }
        // Check if some clipping polygon point is in the near middle of this
        // edge.
        var keepEdge = true;
        for (var i = 0; i < clipPolygon.vertices.length; i++) {
          var polygonPoint = clipPolygon.vertices[i];
          var distA = vertA.distance(polygonPoint);
          var distB = vertB.distance(polygonPoint);
          // if (edgeAsLine.hasPoint(polygonPoint, true)) {
          //   console.log("distA", distA, "distB", distB);
          // }
          // Check if polygon vertex in roughly in the middle of this edge.
          // if (edgeAsLine.hasPoint(polygonPoint, true) && (distA < Vertex.EPSILON || distB < Vertex.EPSILON)) {
          // if (distA < Vertex.EPSILON || distB < Vertex.EPSILON || edgeAsLine.hasPoint(polygonPoint, true)) {
          if (edgeAsLine.hasPoint(polygonPoint, true)) {
            // console.log("Point on outer edge!");
            // Strip this edge from the result (will not be re-added).
            keepEdge = false;
          }
        }
        if (keepEdge) {
          newEdges.add(edge);
        }
      }
      // console.log("oldEdges", graph.edges.length, "newEdges", newEdges.length);
      graph.edges = newEdges;
    };

    var drawVertexNumbers = function (draw, fill) {
      var color = getContrastColor(Color.parse(pb.config.backgroundColor)).setAlpha(0.5).cssRGBA();
      for (var i = 0; i < polygon.vertices.length; i++) {
        var p = polygon.vertices[i];
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
    var drawPolygonSet = function (polygons, draw, fill) {
      for (var p in polygons) {
        var poly = polygons[p];
        draw.polyline(poly.vertices, poly.isOpen, "rgba(0,128,128,0.4)", 1);
      }
    };

    var redraw = function () {
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Add mouse/touch interaction on click.
    // +-------------------------------
    pb.eventCatcher.addEventListener("click", function (event) {
      var bounds = pb.eventCatcher.getBoundingClientRect();
      var pixelPosition = { x: event.offsetX - bounds.left, y: event.offsetY - bounds.top };
      var relPos = pb.transformMousePosition(pixelPosition.x, pixelPosition.y);
      console.log("clicked", pixelPosition, relPos);
      // This was just a helper to construct the initial polygon just by clicking.
      if (config.pointCount > polygon.vertices.length) {
        // polygon.vertices.push(new Vertex(relPos));
        // pb.redraw();
      } else {
        // console.log("polygon", polygon.toSVGString());
        // console.log(
        //   polygon.vertices
        //     .map(function (vert) {
        //       return "{ x: " + vert.x + ", y: " + vert.y + " }";
        //     })
        //     .join(", ")
        // );
      }
    });

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new dat.gui.GUI();
    gui.remember(config);
    if (isMobileDevice()) {
      config.guiDoubleSize = true;
      toggleGuiSize(gui, config.guiDoubleSize);
    }
    gui.add(config, "guiDoubleSize").title("Double size GUI?").onChange(toggleGuiSize);

    var f0 = gui.addFolder("Settings");
    // prettier-ignore
    f0.add(config, "interpolationPointCount").min(1).max(100).title("The interpolation point count.").onChange( handleInterpolationPointCount );
    f0.add(config, "drawVertexNumbers").title("Check if polygon vertex numbers should be drawn.").onChange(redraw);
    f0.add(config, "drawOriginalPolygon").title("Draw original polygon?").onChange(toggleOriginalPolygon);
    f0.add(config, "drawVoronoiCells").title("Draw voronoi cells?").onChange(redraw);
    f0.add(config, "drawVoronoiGraph").title("Draw voronoi graph?").onChange(redraw);
    f0.add(config, "drawSkeleton").title("Draw skeleton?").onChange(redraw);
    f0.open();

    handleInterpolationPointCount();
    // installDragListeners();
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(window);
