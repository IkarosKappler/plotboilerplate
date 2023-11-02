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

    function isBetween(valA, valB, curValue) {
      return (valA <= curValue && curValue <= valB) || (valB <= curValue && curValue <= valA);
    }

    function convertCoords2Pos(x, y) {
      return {
        x: bounds2D.min.x + (x / (terrainGeneration.xSegmentCount - 1)) * bounds2D.width,
        y: bounds2D.min.y + (y / (terrainGeneration.ySegmentCount - 1)) * bounds2D.height
      };
    }

    /**
     * The re-drawing function.
     */
    var redraw = function (draw, fill) {
      // ... draw
      draw.rect(bounds2D.min, bounds2D.width, bounds2D.height, "green", 2);

      // Find a level to "splice" the mesh, here at middle of Min/Max
      var medianHeight =
        terrainGeneration._minHeight + (terrainGeneration._maxHeight - terrainGeneration._minHeight) * config.sliceHeight;

      var LO_COLOR = Color.parse("#0000ff");
      var HI_COLOR = Color.parse("#ff0000");
      console.log("LO_COLOR", LO_COLOR, "HI_COLOR", HI_COLOR);

      // A face element:
      //  A-----B
      //  |     |
      //  |     |
      //  D-----C
      for (var y = 1; y < terrainGeneration.ySegmentCount; y++) {
        for (var x = 1; x < terrainGeneration.xSegmentCount; x++) {
          var heightValueA = terrainGeneration.getHeightValueAt(x - 1, y - 1, false);
          var heightValueB = terrainGeneration.getHeightValueAt(x, y - 1);
          var heightValueC = terrainGeneration.getHeightValueAt(x, y);
          var heightValueD = terrainGeneration.getHeightValueAt(x - 1, y);

          // Draw a point to indicate the height
          var pointPosition = convertCoords2Pos(x - 1, y - 1);
          var heightRatio =
            (heightValueA - terrainGeneration._minHeight) / (terrainGeneration._maxHeight - terrainGeneration._minHeight);
          var color = LO_COLOR.clone().interpolate(HI_COLOR, heightRatio);
          //   console.log("heightRatio", heightRatio, color.cssRGB());
          fill.point(pointPosition, color.cssRGB(), 2);

          var points = []; // Should have max two points afterwards

          // Find height intersections on each of the four corners with the current height
          if (isBetween(heightValueA, heightValueB, medianHeight)) {
            points.push({ x: lerp(x - 1, y - 1, 0.5), y: lerp(x, y - 1, 0.5) });
          }
          if (isBetween(heightValueB, heightValueC, medianHeight)) {
            points.push({ x: lerp(x, y - 1, 0.5), y: lerp(x, y, 0.5) });
          }
          if (isBetween(heightValueC, heightValueD, medianHeight)) {
            points.push({ x: lerp(x, y, 0.5), y: lerp(x - 1, y, 0.5) });
          }
          if (isBetween(heightValueD, heightValueA, medianHeight)) {
            points.push({ x: lerp(x - 1, y, 0.5), y: lerp(x - 1, y - 1, 0.5) });
          }

          if (points.length >= 2) {
            var startPoint = convertCoords2Pos(points[0].x, points[0].y);
            var endPoint = convertCoords2Pos(points[1].x, points[1].y);
            draw.line(startPoint, endPoint, "orange", 2);
            if (points.length > 2) {
              console.log("Ooops, detected more than 2 points on one face at ", x, y);
            }
          } else {
            console.log("Ooops, point list has only one point");
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
      fold0.add(config, "sliceHeight").onChange( function() { pb.redraw(); } ).name('sliceHeight').title('Where to slice the current terrain model.');

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
