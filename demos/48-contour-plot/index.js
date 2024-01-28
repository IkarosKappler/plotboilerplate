/**
 * A script for calculating Contour Plots from a given rasterized value model (like a terrain, heat map, or so).
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires three.js
 *
 * @author   Ikaros Kappler
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);
    var params = new Params(GUP);

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
          enableSVGExport: true
        },
        GUP
      )
    );

    var LO_COLOR = Color.parse("#0000ff");
    var HI_COLOR = Color.parse("#ff0000");

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        xSegmentCount: 16,
        ySegmentCount: 16,
        showNormals: false,
        normalsLength: 10.0,
        useTextureImage: true,
        textureImagePath: "checkpattern-512x512.png",
        wireframe: false,

        pattern: "sine", // { sine, cos, ripple, ripplefull }
        pathDetecEpsilonExp: params.getNumber("pathDetecEpsilon", -1),
        sliceHeight: params.getNumber("sliceHeight", 0.4),
        closeGapType: params.getNumber("closeGapType", 0), // { "NONE" : 0, "ABOVE" : 1, "BELOW" : 2 }
        useTriangles: false,
        pointEliminationEpsilonExp: 6, // 10^(-6)
        pathDetectEpsilonExp: 6, // 10^(-6)
        shufflePathColors: params.getNumber("shufflePathColors", false),
        drawSampleRaster: true,
        drawCurrentContour: true,
        drawRawLineSegments: false,
        drawPolygonNumbers: false,

        rebuild: function () {
          rebuild();
        },

        countourLineSteps: 12,
        collectContourLines: function () {
          startCollectContourLines();
        },
        clearContourLines: function () {
          clearAllContourLines();
        },
        clearPathSegments: params.getNumber("clearPathSegments", true)
      },
      GUP
    );

    var randColor = function (i, alpha) {
      var color = WebColorsContrast[i % WebColorsContrast.length].clone();
      if (typeof alpha !== undefined) color.a = alpha;
      return color.cssRGBA();
    };

    // +---------------------------------------------------------------------------------
    // | These are the bounds to draw the final countour lines in.
    // | Feel free to change to your needs.
    // +-------------------------------
    var bounds2D = new Bounds(new Vertex(-100, -100), new Vertex(100, 100));

    // +---------------------------------------------------------------------------------
    // | A buffer to store the most recent computed path(s) in.
    // | Array<GenericPath>
    // +-------------------------------
    var pathSegments = [];

    // +---------------------------------------------------------------------------------
    // | A buffer to store all computed paths from a sequence in.
    // | Array<{ color:string, pathSegments: GenericPath}>
    // +-------------------------------
    var allContourLines = [];

    var rawLinearSegments = [];

    // +---------------------------------------------------------------------------------
    // | A buffer to store all computed polygons.
    // | Used to calculated the polygon-containment-hierarchy.
    // +-------------------------------
    var polygons = [];

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      // Draw out stuff
      fill.rect(bounds2D.min, bounds2D.width, bounds2D.height, "rgba(0,0,0,0.75)");
      if (config.drawSampleRaster) {
        drawPointRaster(draw, fill);
      }
      if (config.drawCurrentContour) {
        drawPaths(draw, fill, pathSegments, null);
      }
      drawAllContourLines(draw, fill);
      if (config.drawPolygonNumbers) {
        drawPolygonNumbers(draw, fill);
      }

      if (config.drawRawLineSegments && rawLinearSegments.length > 0) {
        // console.log("rawLinearSegments", rawLinearSegments);
        for (var i = 0; i < rawLinearSegments.length; i++) {
          var lineSegment = rawLinearSegments[i];
          draw.line(
            convertCoords2Pos(lineSegment.a.x, lineSegment.a.y),
            convertCoords2Pos(lineSegment.b.x, lineSegment.b.y),
            "purple",
            2
          );
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | A helper function for drawing a nice point set for the data raster.
    // +-------------------------------
    var drawPointRaster = function (draw, fill) {
      for (var y = 0; y < terrainGeneration.dataGrid.ySegmentCount; y++) {
        for (var x = 0; x < terrainGeneration.dataGrid.xSegmentCount; x++) {
          // Draw a point at (x,y) to indicate the height
          var heightValueA = terrainGeneration.dataGrid.getDataValueAt(x, y, false);
          var pointPosition = convertCoords2Pos(x, y);
          //   var heightRatio =
          //     (heightValueA - terrainGeneration._minHeight) / (terrainGeneration._maxHeight - terrainGeneration._minHeight);
          var heightRatio = getRatioByHeightValue(heightValueA);
          var color = LO_COLOR.clone().interpolate(HI_COLOR, heightRatio);
          fill.point(pointPosition, color.cssRGB(), 2);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | A helper function for drawing the most recent calculated path.
    // +-------------------------------
    var drawPaths = function (draw, fill, pathSegments, color) {
      for (var i in pathSegments) {
        var connectedPath = pathSegments[i];
        for (var j in connectedPath.segments) {
          var col = color === null ? (config.shufflePathColors ? randColor(i, 1.0) : "orange") : color;
          // By construction we now this must be a line (cannot be a curve or so as we didn't add one)
          var line = connectedPath.segments[j];
          draw.line(convertCoords2Pos(line.a.x, line.a.y), convertCoords2Pos(line.b.x, line.b.y), col, 2);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | A helper function for drawing all buffered contour lines.
    // +-------------------------------
    var drawAllContourLines = function (draw, fill) {
      for (var i in allContourLines) {
        var contourLine = allContourLines[i];
        // console.log("drawAllContourLines", i, contourLine);
        drawPaths(draw, fill, contourLine.pathSegments, contourLine.color);
      }
    };

    // +---------------------------------------------------------------------------------
    // | A helper function for drawing polygon numbers to each detected path point.
    // +-------------------------------
    var drawPolygonNumbers = function (draw, fill) {
      for (var i = 0; i < polygons.length; i++) {
        var poly = polygons[i];
        // console.log("poly[i].vertices.length", poly.vertices.length);
        for (var j = 0; j < poly.vertices.length; j++) {
          const coords = convertCoords2Pos(poly.vertices[j].x, poly.vertices[j].y);
          fill.text("" + i, coords.x, coords.y, { color: "orange", fontFamily: "Arial", fontSize: 9 });
        }
      }
    };

    /**
     * Convert coordinates on the mesh's XY index raster to a position inside the given
     * 2D bounds for rendering the contour in.
     *
     * @param {number} x
     * @param {number} y
     * @returns
     */
    function convertCoords2Pos(x, y) {
      return new Vertex(
        bounds2D.min.x + (x / (terrainGeneration.dataGrid.xSegmentCount - 1)) * bounds2D.width,
        bounds2D.min.y + (y / (terrainGeneration.dataGrid.ySegmentCount - 1)) * bounds2D.height
      );
    }

    /**
     * Calculate the height value (inside the given data set – min an max values) by
     * given ratio.
     *
     * @param {number} heightRatio – Ideally a value between 0.0 (lowest value) and 1.0 (highest
     * value in the data set).
     * @returns {number} The absolute height value.
     */
    var getHeightValueByRatio = function (heightRatio) {
      var heightValue =
        terrainGeneration.dataGrid.getMinDataValue() +
        (terrainGeneration.dataGrid.getMaxDataValue() - terrainGeneration.dataGrid.getMinDataValue()) * heightRatio;
      //console.log("[rebuild] heightValue", heightValue, "config.sliceHeight", config.sliceHeight);
      return heightValue;
    };

    /**
     * Calculate the height ratio (inside the given data set – min an max values) by
     * given absolute height value.
     *
     * @param {number} heightRatio – Ideally a value between 0.0 (lowest value) and 1.0 (highest
     * value in the data set).
     * @returns {number} The height ratio in the interval [0.0 ... 1.0] - assume the given value was inside bounds.
     */
    var getRatioByHeightValue = function (heightValue) {
      var heightRatio =
        (heightValue - terrainGeneration.dataGrid.getMinDataValue()) /
        (terrainGeneration.dataGrid.getMaxDataValue() - terrainGeneration.dataGrid.getMinDataValue());
      return heightRatio;
    };

    /**
     * Rebuild the whole paths.
     */
    var rebuildCurrentPlotPlane = function () {
      // Find a level to "splice" the mesh, here at middle of Min/Max
      var medianHeight = getHeightValueByRatio(config.sliceHeight);
      //console.log("[rebuild] medianHeight", medianHeight, "config.sliceHeight", config.sliceHeight);
      rebuildPlotPlane(medianHeight, { addTo3DPreview: true, addToContourLines: false });
    };

    /**
     * Rebuild the whole paths.
     */
    var rebuildPlotPlane = function (criticalHeightValue, options) {
      if (config.clearPathSegments) {
        pathSegments = [];
      }

      // For debugging
      var onRawSegmentsDetected = config.drawRawLineSegments
        ? function (rawSegmentsDoNotModifiy) {
            // Copy the array!
            rawLinearSegments = rawSegmentsDoNotModifiy.map(function (segment) {
              return segment;
            });
          }
        : null;

      var contourDetection = new ContourLineDetection(terrainGeneration.dataGrid);
      // Array<GenericPath>
      pathSegments = contourDetection.detectContourPaths(criticalHeightValue, {
        closeGapType: config.closeGapType,
        useTriangles: config.useTriangles,
        pointEliminationEpsilon: 1 / Math.pow(10, config.pointEliminationEpsilonExp),
        pathDetectEpsilon: 1 / Math.pow(10, config.pathDetectEpsilonExp),
        onRawSegmentsDetected: onRawSegmentsDetected
      });

      // Convert paths to polygons
      polygons = pathSegments.map(function (path) {
        var polyVerts = path.getAllStartEndPoints();
        return new Polygon(polyVerts, false); // Don't use open polygons here
      });

      // Array<PolygonContainmentTree>
      var polygonContainmentTrees = computePolygonHierarchy(polygons);
      console.log("polygonContainmentTrees", polygonContainmentTrees);

      if (options.addToContourLines) {
        var heightRatio = getRatioByHeightValue(criticalHeightValue);
        var color = LO_COLOR.clone().interpolate(HI_COLOR, heightRatio);
        // console.log("Adding color ");
        allContourLines.push({ pathSegments: pathSegments, color: color.cssRGB() });
      }
      // if (options.addTo3DPreview) {
      //   // console.log("Add contour");
      //   contourScene.addContour(pathSegments);
      // }
      if (options.addTo3DPreview) {
        // console.log("Add contour");
        // contourScene.addContour(polyonHierarchyTree);
        contourScene.addAllPolygonContainmentTrees(polygonContainmentTrees);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Each time the terrain parameters change (segment count, function for terrain, etc)
    // +-------------------------------
    var terrainGeneration = null;

    // +---------------------------------------------------------------------------------
    // | Compute a polygon hierarchy tree from the path segments.
    // | Each segment must represent a closed polygon to make this work!
    // +-------------------------------
    var computePolygonHierarchy = function (polygons) {
      var polyContainmentLevels = new PolygonContainmentLevel(polygons);
      var hierarchy = polyContainmentLevels.findContainmentTree();
      console.log(polyContainmentLevels.toString());
      return hierarchy;
    };

    // +---------------------------------------------------------------------------------
    // | This renders the computed contour(s) in a 3D mesh
    // +-------------------------------
    var contourScene = new ContourScene("three-canvas-result");

    var rebuild = function () {
      rebuildMesh();
      rebuildCurrentPlotPlane();
    };

    var rebuildTerrain = function () {
      terrainGeneration = new TerrainGeneration("three-canvas-input", config.xSegmentCount, config.ySegmentCount); // 16, 16);
    };

    var rebuildMesh = function () {
      terrainGeneration.rebuild(Object.assign({}, config));
    };

    // Maybe better make this async?
    var startCollectContourLines = function () {
      allContourLines = [];
      for (var i = 1; i <= config.countourLineSteps; i++) {
        var heightValue = getHeightValueByRatio(i / config.countourLineSteps);
        console.log("rebuildPlotPlane at height", heightValue);
        rebuildPlotPlane(heightValue, { addTo3DPreview: false, addToContourLines: true });
      }
      pb.redraw();
    };

    var clearAllContourLines = function () {
      allContourLines = [];
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var fold0 = gui.addFolder("Mesh");
      // prettier-ignore
      fold0.add(config, "xSegmentCount").min(4).max(128).step(1).onChange( function() { rebuildTerrain(); rebuild(); pb.redraw(); } ).name('xSegmentCount').title("The number of vertices along the mesh's x axis.");
      // prettier-ignore
      fold0.add(config, "ySegmentCount").min(4).max(128).step(1).onChange( function() { rebuildTerrain(); rebuild(); pb.redraw(); } ).name('ySegmentCount').title("The number of vertices along the mesh's y axis.");

      // prettier-ignore
      fold0.add(config, "pattern", { "Sine": "sine", "Cos" : "cos", "Ripple": "ripple", "RippleFull": "ripplefull" }).onChange( function() { rebuild(); pb.redraw(); } ).name('pattern').title('Which pattern to use to shape the landscape.');
      // prettier-ignore
      fold0.add(config, "showNormals").onChange( function() { rebuild(); } ).name('showNormals').title('Show the vertex normals.');
      // prettier-ignore
      fold0.add(config, "normalsLength").min(1.0).max(20.0).onChange( function() { rebuildMesh() } ).name('normalsLength').title('The length of rendered normals.');
      // prettier-ignore
      fold0.add(config, "useTextureImage").onChange( function() { rebuildMesh() } ).name('useTextureImage').title('Use a texture.');
      // prettier-ignore
      fold0.add(config, "wireframe").onChange( function() { rebuild(); } ).name('wireframe').title('Display the mesh as a wireframe model.');

      // prettier-ignore
      gui.add(config, "drawSampleRaster").onChange( function() { pb.redraw(); } ).name('drawSampleRaster').title('Draw the sample raster to visualize the underlying data raster.');
      // prettier-ignore
      gui.add(config, "pathDetecEpsilonExp").min(-10).max(0).onChange( function() { pb.redraw(); } ).name('pathDetecEpsilonExp').title('Detection to use with this epsislon (exponent e^x).');
      // prettier-ignore
      gui.add(config, "sliceHeight").min(0.0).max(1.0).onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('sliceHeight').title('Where to slice the current terrain model.');
      // prettier-ignore
      gui.add(config, "closeGapType", { "None" : ContourLineDetection.CLOSE_GAP_TYPE_NONE, "Above" : ContourLineDetection.CLOSE_GAP_TYPE_ABOVE, "Below" : ContourLineDetection.CLOSE_GAP_TYPE_BELOW } ).onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('closeGapType').title('Close gap above, below or not at all.');
      // prettier-ignore
      gui.add(config, "pointEliminationEpsilonExp").min(1).max(10).onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('pointEliminationEpsilonExp').title('The epsilon 10^-exp to use for detecting "equal" points (multiple points considered equal will be removed to clear duplicates).');
      // prettier-ignore
      gui.add(config, "pathDetectEpsilonExp").min(1).max(10).onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('pathDetectEpsilonExp').title('The epsilon 10^-exp to use for path detection to tell "different" points apart. Useful for fine tuning.');
      // prettier-ignore
      gui.add(config, "useTriangles").onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('useTriangles').title('If checked then the algorithm will use triangle faces instead of quad faces.');
      // prettier-ignore
      gui.add(config, "shufflePathColors" ).name('shufflePathColors').onChange( function() { pb.redraw(); } ).title('Use different colors for different paths?');
      // prettier-ignore
      gui.add(config, "drawCurrentContour").onChange( function() { pb.redraw(); } ).name('drawCurrentContour').title('Draw the current single contour?');
      // prettier-ignore
      gui.add(config, "drawRawLineSegments").onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('drawRawLineSegments').title('Keep and draw raw linear segments?');

      // prettier-ignore
      gui.add(config, "drawPolygonNumbers").onChange( function() { pb.redraw(); } ).name('drawPolygonNumbers').title('Draw the assigned polygon number to each detected path point?');

      // prettier-ignore
      gui.add(config, "clearPathSegments").onChange( function() { rebuildCurrentPlotPlane(); pb.redraw(); } ).name('clearPathSegments').title('Clear path buffer on each rebuild cycle (default=true).');
      // prettier-ignore
      gui.add(config, "countourLineSteps").min(2).max(32).name('countourLineSteps').title('The number of contour lines to calculate.');
      // prettier-ignore

      gui.add(config, "collectContourLines").name('collectContourLines').title('Start an iterating process to collect contour lines.');
      // prettier-ignore
      gui.add(config, "clearContourLines").name('clearContourLines').title('Clear the previously collected contour lines.');
    }

    pb.config.postDraw = redraw;
    rebuildTerrain();
    rebuild();
    pb.redraw();
  });
})(window);
