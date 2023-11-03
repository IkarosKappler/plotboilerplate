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
          enableSVGExport: false
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var CLOSE_GAP_TYPE_NONE = 0;
    var CLOSE_GAP_TYPE_ABOVE = 1;
    var CLOSE_GAP_TYPE_BELOW = 2;
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        xSegmentCount: 16,
        ySegmentCount: 16,
        showNormals: false,
        normalsLength: 10.0,
        useTextureImage: true,
        textureImagePath: "checkpattern-512x512.png",
        wireframe: false,
        exportSTL: function () {
          exportSTL();
        },

        sliceHeight: params.getNumber("sliceHeight", 0.5),
        closeGapType: params.getNumber("closeGapType", 0), // { "NONE" : 0, "ABOVE" : 1, "BELOW" : 2 }
        shufflePathColors: params.getNumber("shufflePathColors", false),

        rebuild: function () {
          rebuild();
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

    var bounds2D = new Bounds(new Vertex(-100, -100), new Vertex(100, 100));

    // Array<Line>
    var rawLinearPathSegments = [];
    // Array<GenericPath>
    var pathSegments = [];

    /**
     * Build the contour from the current terrain data.
     */
    var redraw = function (draw, fill) {
      // Draw out stuff
      fill.rect(bounds2D.min, bounds2D.width, bounds2D.height, "rgba(0,0,0,0.75)");
      draw.rect(bounds2D.min, bounds2D.width, bounds2D.height, "green", 2);

      //   var pathSegments = [];

      // Find a level to "splice" the mesh, here at middle of Min/Max
      //   var medianHeight =
      //     terrainGeneration._minHeight + (terrainGeneration._maxHeight - terrainGeneration._minHeight) * config.sliceHeight;
      //   console.log("[redraw] medianHeight", medianHeight, "config.sliceHeight", config.sliceHeight);

      var LO_COLOR = Color.parse("#0000ff");
      var HI_COLOR = Color.parse("#ff0000");
      //   console.log("LO_COLOR", LO_COLOR, "HI_COLOR", HI_COLOR);

      for (var y = 0; y < terrainGeneration.ySegmentCount; y++) {
        for (var x = 0; x < terrainGeneration.xSegmentCount; x++) {
          // Draw a point at (x,y) to indicate the height
          var heightValueA = terrainGeneration.getHeightValueAt(x, y, false);
          var pointPosition = convertCoords2Pos(x, y);
          var heightRatio =
            (heightValueA - terrainGeneration._minHeight) / (terrainGeneration._maxHeight - terrainGeneration._minHeight);
          var color = LO_COLOR.clone().interpolate(HI_COLOR, heightRatio);
          fill.point(pointPosition, color.cssRGB(), 2);
        }
      }

      for (var i in pathSegments) {
        var connectedPath = pathSegments[i];
        for (var j in connectedPath.segments) {
          var color = config.shufflePathColors ? randColor(i, 1.0) : "orange";
          // By construction we now this must be a line (cannot be a curve or so as we didn't add one)
          var line = connectedPath.segments[j];
          draw.line(convertCoords2Pos(line.a.x, line.a.y), convertCoords2Pos(line.b.x, line.b.y), color, 2);
        }
      }
    };

    function lerp(min, max, ratio) {
      return min + (max - min) * ratio;
    }

    /**
     * Test if a given numeric value (`curValue`) is between the given values `valA` and `valB`.
     * Value A and B don't need to be in ascending order, so `valA <= curValue <= valB` and `valB <= curvalue <= valA`
     * will do the job.
     *
     * @param {number} valA - The first of the two bounds.
     * @param {number} valB - The second of the two bounds.
     * @param {number} curValue - The value to check if it is between (or equal) to the given bounds.
     * @returns {boolean}
     */
    function isBetween(valA, valB, curValue) {
      return (valA <= curValue && curValue <= valB) || (valB <= curValue && curValue <= valA);
    }

    /**
     * Get a 'lerp' value - which is some sort of percentage/ratio for the `curValue` inside the
     * range of the given interval `[valA ... valB]`.
     *
     * Examples:
     *  * getLerpRatio(0,100,50) === 0.5
     *  * getLerpRatio(50,100,75) === 0.5
     *  * getLerpRatio(0,100,0) === 0.0
     *  * getLerpRatio(0,100,100) === 1.0
     *  * getLerpRatio(0,100,-50) === -0.5
     *
     * @param {number} valA
     * @param {number} valB
     * @param {number} curValue
     * @returns
     */
    function getLerpRatio(valA, valB, curValue) {
      return (curValue - valA) / (valB - valA);
    }

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
        bounds2D.min.x + (x / (terrainGeneration.xSegmentCount - 1)) * bounds2D.width,
        bounds2D.min.y + (y / (terrainGeneration.ySegmentCount - 1)) * bounds2D.height
      );
    }

    /**
     * Checks if both value are on the same side of the critical value (above or below). The `closeGapType`
     * indictes if `CLOSE_GAP_TYPE_BELOW` or `CLOSE_GAP_TYPE_ABOVE` should be used as a rule.
     *
     * @param {number} valueA
     * @param {number} valueB
     * @param {number} criticalValue
     * @param {number} closeGapType
     * @returns {boolean}
     */
    function areBothValuesOnRequiredPlaneSide(valueA, valueB, criticalValue, closeGapType) {
      return (
        (closeGapType == CLOSE_GAP_TYPE_BELOW && valueA <= criticalValue && valueB <= criticalValue) ||
        (closeGapType == CLOSE_GAP_TYPE_ABOVE && valueA >= criticalValue && valueB >= criticalValue)
      );
    }

    /**
     * This procedure will look at the face4 at the ((x,y),(nextX,nextY)) position – which are four values –
     * and determines the local contour lines for these cases.
     *
     * This is used to detect and calculate edge cases on the borders of the underliying height data:
     *  * left and right border (x=0, x=data.xSegmentCount)
     *  * top and bottom border (x=y, x=data.ySegmentCount)
     *
     * Resulting path segments will be stored in the global `segments` array.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} nextX
     * @param {number} nextY
     * @param {number} criticalHeightValue
     * @param {number} closeGapType - CLOSE_GAP_TYPE_ABOVE or CLOSE_GAP_TYPE_BELOW.
     * @return {void}
     */
    function detectAboveBelowLerpSegment(x, y, nextX, nextY, criticalHeightValue, closeGapType) {
      var heightValueA = terrainGeneration.getHeightValueAt(x, y);
      var heightValueB = terrainGeneration.getHeightValueAt(nextX, nextY);
      //   if (heightValueA >= criticalHeightValue && heightValueB >= criticalHeightValue) {
      if (areBothValuesOnRequiredPlaneSide(heightValueA, heightValueB, criticalHeightValue, closeGapType)) {
        //  Both above
        var line = new Line(new Vertex(x, y), new Vertex(nextX, nextY));
        // pathSegments.push(new GenericPath(line));
        rawLinearPathSegments.push(line);
      } else if (
        (closeGapType === CLOSE_GAP_TYPE_ABOVE && heightValueA >= criticalHeightValue && heightValueB < criticalHeightValue) ||
        (closeGapType === CLOSE_GAP_TYPE_BELOW && heightValueA <= criticalHeightValue && heightValueB > criticalHeightValue)
      ) {
        // Only one of both (first) is above -> interpolate to find exact intersection point
        var lerpValueByHeight = getLerpRatio(heightValueA, heightValueB, criticalHeightValue);
        var interpLine = new Line(
          new Vertex(x, y),
          new Vertex(lerp(x, nextX, lerpValueByHeight), lerp(y, nextY, lerpValueByHeight))
        );
        // pathSegments.push(new GenericPath(interpLine));
        rawLinearPathSegments.push(interpLine);
      } else if (
        (closeGapType === CLOSE_GAP_TYPE_ABOVE && heightValueA < criticalHeightValue && heightValueB >= criticalHeightValue) ||
        (closeGapType === CLOSE_GAP_TYPE_BELOW && heightValueA > criticalHeightValue && heightValueB <= criticalHeightValue)
      ) {
        // Only one of both (second) is above -> interpolate to find exact intersection point
        var lerpValueByHeight = getLerpRatio(heightValueA, heightValueB, criticalHeightValue);
        var interpLine = new Line(
          new Vertex(lerp(x, nextX, lerpValueByHeight), lerp(y, nextY, lerpValueByHeight)),
          new Vertex(nextX, nextY)
        );
        // pathSegments.push(new GenericPath(interpLine));
        rawLinearPathSegments.push(interpLine);
      }
    }

    /**
     * This function will calculate a single intersecion line of the given face4 data
     * segment. If the given face does not intersect with the plane at the given `heightValue`
     * then `null` is returned.
     *
     * @param {number} xIndex - The x position (index) of the data face.
     * @param {number} yIndex - The y position (index) of the data face.
     * @param {[[number,number],[number,number]]} heightFace - The data sample that composes the face4 as a two-dimensional number array.
     * @param {number} heightValue - The height value of the intersection plane to check for.
     * @returns {Line|null}
     */
    function findHeightFaceIntersectionLine(xIndex, yIndex, heightFace, heightValue) {
      var heightValueA = heightFace[0][0]; // value at (x,y)
      var heightValueB = heightFace[1][0];
      var heightValueC = heightFace[1][1];
      var heightValueD = heightFace[0][1];

      var points = [];
      if (isBetween(heightValueA, heightValueB, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueA, heightValueB, heightValue);
        points.push(new Vertex(lerp(xIndex, xIndex + 1, lerpValueByHeight), yIndex));
      }
      if (isBetween(heightValueB, heightValueC, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueB, heightValueC, heightValue);
        points.push(new Vertex(xIndex + 1, lerp(yIndex, yIndex + 1, lerpValueByHeight)));
      }
      if (isBetween(heightValueC, heightValueD, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueC, heightValueD, heightValue);
        points.push(new Vertex(lerp(xIndex + 1, xIndex, lerpValueByHeight), yIndex + 1));
      }
      if (isBetween(heightValueD, heightValueA, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueD, heightValueA, heightValue);
        points.push(new Vertex(xIndex, lerp(yIndex + 1, yIndex, lerpValueByHeight)));
      }

      // Warning: if a plane intersection point is located EXACTLY on the corner
      // edge of a face, then the two adjacent edges will result in 2x the same
      // intersecion point. This must be handled as one, so filter the point list
      // by an epsilon.
      points = clearDuplicateVertices(points, 0.000001);

      if (points.length >= 2) {
        var startPoint = points[0];
        var endPoint = points[1];
        if (points.length > 2) {
          console.warn(
            "[findHeightFaceIntersectionLine] Detected more than 2 points on one face whre only 0 or 2 should appear. At ",
            xIndex,
            yIndex,
            points
          );
        }
        return new Line(startPoint, endPoint);
      } else {
        if (points.length === 1) {
          console.warn("[findHeightFaceIntersectionLine] Point list has only one point (should not happen).");
        }
        return null;
      }
    }

    /**
     * Rebuild the whole paths.
     */
    var rebuildPlotPlane = function () {
      //   var pathSegments = [];
      if (config.clearPathSegments) {
        rawLinearPathSegments = [];
      }

      // Find a level to "splice" the mesh, here at middle of Min/Max
      var medianHeight =
        terrainGeneration._minHeight + (terrainGeneration._maxHeight - terrainGeneration._minHeight) * config.sliceHeight;
      //console.log("[rebuild] medianHeight", medianHeight, "config.sliceHeight", config.sliceHeight);

      // A face element:
      // (x-1,y-1)      (x,y-1)
      //        A-----B
      //        |     |
      //        |     |
      //        D-----C
      // (x-1,y)        (x,y)
      var heightFace = [
        [0, 0],
        [0, 0]
      ];
      for (var y = 0; y + 1 < terrainGeneration.ySegmentCount; y++) {
        for (var x = 0; x + 1 < terrainGeneration.xSegmentCount; x++) {
          terrainGeneration.getHeightFace4At(x, y, heightFace);
          var line = findHeightFaceIntersectionLine(x, y, heightFace, medianHeight);
          if (line) {
            // pathSegments.push(new GenericPath(line));
            rawLinearPathSegments.push(line);
          }
        }
      }

      // Collect value above/below on the y axis
      if (config.closeGapType === CLOSE_GAP_TYPE_ABOVE || config.closeGapType === CLOSE_GAP_TYPE_BELOW) {
        var xExtremes = [0, terrainGeneration.xSegmentCount - 1];
        for (var i = 0; i < xExtremes.length; i++) {
          var x = xExtremes[i];
          for (var y = 0; y + 1 < terrainGeneration.ySegmentCount; y++) {
            var nextX = x;
            var nextY = y + 1;
            detectAboveBelowLerpSegment(x, y, nextX, nextY, medianHeight, config.closeGapType);
          }
        }
        var yExtremes = [0, terrainGeneration.ySegmentCount - 1];
        for (var j = 0; j < yExtremes.length; j++) {
          var y = yExtremes[j];
          for (var x = 0; x + 1 < terrainGeneration.xSegmentCount; x++) {
            var nextX = x + 1;
            var nextY = y;
            detectAboveBelowLerpSegment(x, y, nextX, nextY, medianHeight, config.closeGapType);
          }
        }
      }
      // Detect connected paths
      pathSegments = detectPaths(rawLinearPathSegments, 0.1); // Epsilon?
      // Filter out segments with only a single line of length~=0
      pathSegments = pathSegments.filter(function (pathSegment) {
        return pathSegment.segments.length != 1 || (pathSegment.segments.length === 1 && pathSegment.segments[0].length() > 0.1);
      });
      console.log(pathSegments);
    };

    var terrainGeneration = null;

    var modal = new Modal();

    var rebuild = function () {
      rebuildMesh();
      rebuildPlotPlane();
    };

    var rebuildTerrain = function () {
      terrainGeneration = new TerrainGeneration("three-canvas-input", config.xSegmentCount, config.ySegmentCount); // 16, 16);
    };

    var rebuildMesh = function () {
      terrainGeneration.rebuild(Object.assign({}, config));
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var fold0 = gui.addFolder("Mesh");
      // prettier-ignore
      fold0.add(config, "xSegmentCount").min(4).max(128).onChange( function() { rebuildTerrain(); rebuild(); } ).name('xSegmentCount').title("The number of vertices along the mesh's x axis.");
      // prettier-ignore
      fold0.add(config, "ySegmentCount").min(4).max(128).onChange( function() { rebuildTerrain(); rebuild(); } ).name('ySegmentCount').title("The number of vertices along the mesh's y axis.");

      // prettier-ignore
      fold0.add(config, "showNormals").onChange( function() { rebuild(); } ).name('showNormals').title('Show the vertex normals.');
      // prettier-ignore
      fold0.add(config, "normalsLength").min(1.0).max(20.0).onChange( function() { rebuildMesh() } ).name('normalsLength').title('The length of rendered normals.');
      // prettier-ignore
      fold0.add(config, "useTextureImage").onChange( function() { rebuildMesh() } ).name('useTextureImage').title('Use a texture.');
      // prettier-ignore
      fold0.add(config, "wireframe").onChange( function() { rebuild(); } ).name('wireframe').title('Display the mesh as a wireframe model.');

      // prettier-ignore
      gui.add(config, "sliceHeight").min(0.0).max(1.0).onChange( function() { rebuildPlotPlane(); pb.redraw(); } ).name('sliceHeight').title('Where to slice the current terrain model.');
      // prettier-ignore
      gui.add(config, "closeGapType", { "None" : CLOSE_GAP_TYPE_NONE, "Above" : CLOSE_GAP_TYPE_ABOVE, "Below" : CLOSE_GAP_TYPE_BELOW } ).onChange( function() { rebuildPlotPlane(); pb.redraw(); } ).name('closeGapType').title('Close gap above, below or not at all.');
      // prettier-ignore
      gui.add(config, "shufflePathColors" ).name('shufflePathColors').onChange( function() { pb.redraw(); } ).title('Use different colors for different paths?');

      // prettier-ignore
      gui.add(config, "clearPathSegments").onChange( function() { rebuildPlotPlane(); pb.redraw(); } ).name('clearPathSegments').title('Clear path buffer on each rebuild cycle (default=true).');
    }

    pb.config.postDraw = redraw;
    rebuildTerrain();
    rebuild();
    pb.redraw();
  });
})(window);
