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
 * @date     2023-10-28
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);

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
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        showNormals: false,
        normalsLength: 10.0,
        // useTextureImage: true,
        wireframe: false,
        exportSTL: function () {
          exportSTL();
        },

        sliceHeight: 0.5,
        closeGapType: 0, // { "NONE" : 0, "ABOVE" : 1, "BELOW" : 2 }

        rebuild: function () {
          rebuildTerrain();
        }
      },
      GUP
    );

    var bounds2D = new Bounds(new Vertex(-100, -100), new Vertex(100, 100));

    function lerp(min, max, ratio) {
      return min + (max - min) * ratio;
    }

    /**
     * Test if a given numeric value (`curValue`) is between the given values `valA` and `valB`.
     * Value A and B don't need to be in ascending order, so `valA <= valB` and `valB <= valA`
     * will do the job.
     *
     * @param {*} valA
     * @param {*} valB
     * @param {*} curValue
     * @returns
     */
    function isBetween(valA, valB, curValue) {
      return (valA <= curValue && curValue <= valB) || (valB <= curValue && curValue <= valA);
    }

    function getLerpRatio(valA, valB, curValue) {
      return (curValue - valA) / (valB - valA);
    }

    /**
     * Convert coordinates on the mesh's XY index raster to a position inside the given
     * 2D bounds for rendering the contour in.
     **/
    function convertCoords2Pos(x, y) {
      return new Vertex(
        bounds2D.min.x + (x / (terrainGeneration.xSegmentCount - 1)) * bounds2D.width,
        bounds2D.min.y + (y / (terrainGeneration.ySegmentCount - 1)) * bounds2D.height
      );
    }

    function findHeightFaceIntersectionLine(xIndex, yIndex, heightFace, heightValue) {
      var heightValueA = heightFace[0][0];
      var heightValueB = heightFace[1][0];
      var heightValueC = heightFace[1][1];
      var heightValueD = heightFace[0][1];

      var points = [];
      if (isBetween(heightValueA, heightValueB, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueA, heightValueB, heightValue);
        points.push({ x: lerp(xIndex - 1, xIndex, lerpValueByHeight), y: yIndex - 1 });
      }
      if (isBetween(heightValueB, heightValueC, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueB, heightValueC, heightValue);
        points.push({ x: xIndex, y: lerp(yIndex - 1, yIndex, lerpValueByHeight) });
      }
      if (isBetween(heightValueC, heightValueD, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueC, heightValueD, heightValue);
        points.push({ x: lerp(xIndex, xIndex - 1, lerpValueByHeight), y: yIndex });
      }
      if (isBetween(heightValueD, heightValueA, heightValue)) {
        var lerpValueByHeight = getLerpRatio(heightValueD, heightValueA, heightValue);
        points.push({ x: xIndex - 1, y: lerp(yIndex, yIndex - 1, lerpValueByHeight) });
      }

      if (points.length >= 2) {
        var startPoint = convertCoords2Pos(points[0].x, points[0].y);
        var endPoint = convertCoords2Pos(points[1].x, points[1].y);
        // pathSegments.push(new Line(startPoint, endPoint));
        if (points.length > 2) {
          console.log("Ooops, detected more than 2 points on one face at ", xIndex, yIndex);
        }
        return new Line(startPoint, endPoint);
        // draw.line(startPoint, endPoint, "orange", 2);
      } else {
        console.log("Ooops, point list has only one point");
        return null;
      }
    }

    /**
     * The re-drawing function.
     */
    var redraw = function (draw, fill) {
      // Draw out stuff
      fill.rect(bounds2D.min, bounds2D.width, bounds2D.height, "rgba(0,0,0,0.75)");
      draw.rect(bounds2D.min, bounds2D.width, bounds2D.height, "green", 2);

      var pathSegments = [];

      // Find a level to "splice" the mesh, here at middle of Min/Max
      var medianHeight =
        terrainGeneration._minHeight + (terrainGeneration._maxHeight - terrainGeneration._minHeight) * config.sliceHeight;
      console.log("medianHeight", medianHeight);

      var LO_COLOR = Color.parse("#0000ff");
      var HI_COLOR = Color.parse("#ff0000");
      console.log("LO_COLOR", LO_COLOR, "HI_COLOR", HI_COLOR);

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
      for (var y = 1; y < terrainGeneration.ySegmentCount; y++) {
        for (var x = 1; x < terrainGeneration.xSegmentCount; x++) {
          terrainGeneration.getHeightFace4At(x - 1, y - 1, heightFace);
          var heightValueA = heightFace[0][0];
          //   var heightValueB = heightFace[1][0];
          //   var heightValueC = heightFace[1][1];
          //   var heightValueD = heightFace[0][1];

          // Draw a point at (x,y) to indicate the height
          var pointPosition = convertCoords2Pos(x - 1, y - 1);
          var heightRatio =
            (heightValueA - terrainGeneration._minHeight) / (terrainGeneration._maxHeight - terrainGeneration._minHeight);
          var color = LO_COLOR.clone().interpolate(HI_COLOR, heightRatio);
          fill.point(pointPosition, color.cssRGB(), 2);

          var line = findHeightFaceIntersectionLine(x, y, heightFace, medianHeight);
          if (line) {
            draw.line(line.a, line.b, "orange", 2);
          }
        }
      }
    };

    var terrainGeneration = new TerrainGeneration("three-canvas", 16, 16);
    var modal = new Modal();

    var rebuildTerrain = function () {
      terrainGeneration.rebuild(Object.assign({}, config));
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var fold0 = gui.addFolder("Mesh");
      // prettier-ignore
      fold0.add(config, "showNormals").onChange( function() { rebuildTerrain() } ).name('showNormals').title('Show the vertex normals.');
      // prettier-ignore
      fold0.add(config, "normalsLength").min(1.0).max(20.0).onChange( function() { rebuildTerrain() } ).name('normalsLength').title('The length of rendered normals.');
      // prettier-ignore
      // fold0.add(config, "useTextureImage").onChange( function() { rebuildVoronoi() } ).name('useTextureImage').title('Use a texture image.');
      // prettier-ignore
      fold0.add(config, "wireframe").onChange( function() { rebuildTerrain() } ).name('wireframe').title('Display the mesh as a wireframe model.');

      // prettier-ignore
      gui.add(config, "sliceHeight").min(0.0).max(1.0).onChange( function() { pb.redraw(); } ).name('sliceHeight').title('Where to slice the current terrain model.');
      // prettier-ignore
      gui.add(config, "closeGapType", { "None" : 0, "Above" : 1, "Below" : 2 } ).onChange( function() { pb.redraw(); } ).name('closeGapType').title('Close gap above, below or not at all.');

      var fold1 = gui.addFolder("Export");
      // prettier-ignore
      fold1.add(config, "exportSTL").name('STL').title('Export an STL file.');
    }

    pb.config.postDraw = redraw;
    // randomPoints(true, false, false); // clear ; no full cover ; do not redraw
    rebuildTerrain();
    pb.redraw();
  });
})(window);
