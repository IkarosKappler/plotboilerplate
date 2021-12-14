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

    // prettier-ignore
    var rawData = [{ x: -231, y: -30 }, { x: -225, y: -72 }, { x: -180, y: -93 }, { x: -136, y: -131 }, { x: -86, y: -106 }, { x: -41, y: -130 }, { x: 42, y: -158 }, { x: 108, y: -145 }, { x: 193, y: -105 }, { x: 232, y: -61 }, { x: 214, y: -4 }, { x: 252, y: 37 }, { x: 291, y: 68 }, { x: 311, y: 120 }, { x: 273, y: 163 }, { x: 127, y: 209 }, { x: 103, y: 143 }, { x: 81, y: 67 }, { x: 9, y: 54 }, { x: -69, y: 80 }, { x: -80, y: 124 }, { x: -97, y: 162 }, { x: -201, y: 179 }, { x: -308, y: 128 }];

    var rawPolygon = new Polygon(
      rawData.map(function (coords) {
        return new Vertex(coords);
      }),
      false
    );
    var polygon = evenlyPolygon(rawPolygon, rawData.length * 4);
    pb.add(polygon, false);
    var voronoiHelper = new VoronoiHelper(polygon);

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        guiDoubleSize: false,

        pointCount: 24
      },
      GUP
    );

    var postDraw = function (draw, fill) {
      // TODO: call this only when the polygon changed!
      voronoiHelper.triangulate();
      voronoiHelper.makeVoronoiDiagram();
      console.log("polygon", polygon);
      drawVoronoiDiagram(draw, fill);
    };

    /**
     * Draw the stored voronoi diagram.
     */
    var drawVoronoiDiagram = function (draw, fill) {
      var clipBoxPolygon = Bounds.computeFromVertices(polygon.vertices).toPolygon();
      // if (config.drawClipBox) draw.polygon(clipBoxPolygon, "rgba(192,192,192,0.25)");

      for (var v in voronoiHelper.voronoiDiagram) {
        var cell = voronoiHelper.voronoiDiagram[v];
        var poly = cell.toPolygon();
        // poly.scale(config.voronoiCellScale, cell.sharedVertex);

        // Draw large (unclipped) Voronoi cell
        // if (config.drawVoronoiOutlines && (!config.clipVoronoiCells || config.drawUnclippedVoronoiCells)) {
        draw.polyline(poly.vertices, false, "rgba(128,128,128,0.333)", 1);
        // }

        // Apply clipping?
        // if (config.clipVoronoiCells) {
        //   // Clone the array here: convert Array<XYCoords> to Array<Vertex>
        //   poly = new Polygon(cloneVertexArray(sutherlandHodgman(poly.vertices, clipBoxPolygon.vertices)), false);
        // }

        // if (config.drawVoronoiOutlines && config.clipVoronoiCells) {
        //   draw.polygon(poly, config.voronoiOutlineColor);
        // }

        // if ((!cell.isOpen() || config.clipVoronoiCells) && cell.triangles.length >= 3) {
        //   if (config.drawCubicCurves) {
        //     var cbezier = poly.toCubicBezierData(config.voronoiCubicThreshold);
        //     if (config.fillVoronoiCells) fill.cubicBezierPath(cbezier, config.voronoiCellColor);
        //     else draw.cubicBezierPath(cbezier, config.voronoiCellColor);
        //   }
        //   if (config.drawVoronoiIncircles) {
        //     var result = convexPolygonIncircle(poly);
        //     var circle = result.circle;
        //     var triangle = result.triangle;
        //     // Here we should have found the best inlying circle (and the corresponding triangle)
        //     // inside the Voronoi cell.
        //     draw.circle(circle.center, circle.radius, "rgba(255,192,0,1.0)", 2);
        //   }
        // } // END cell is not open
      }
    };

    // +---------------------------------------------------------------------------------
    // | Add mouse/touch interaction on click.
    // +-------------------------------
    pb.eventCatcher.addEventListener("click", function (event) {
      var bounds = pb.eventCatcher.getBoundingClientRect();
      var pixelPosition = { x: event.offsetX - bounds.left, y: event.offsetY - bounds.top };
      var relPos = pb.transformMousePosition(pixelPosition.x, pixelPosition.y);
      console.log("clicked", pixelPosition, relPos);
      if (config.pointCount > polygon.vertices.length) {
        polygon.vertices.push(new Vertex(relPos));

        pb.redraw();
      } else {
        console.log("polygon", polygon.toSVGString());
        console.log(
          polygon.vertices
            .map(function (vert) {
              return "{ x: " + vert.x + ", y: " + vert.y + " }";
            })
            .join(", ")
        );
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

    var f0 = gui.addFolder("Biome");
    // prettier-ignore
    // f0.add(config, "randomizationThreshold").min(0.0).max(1.0).title("The probabily that a new cell is alive.");
    f0.open();

    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(window);
