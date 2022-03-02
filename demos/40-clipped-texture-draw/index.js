/**
 * A script for drawing Girihs.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2020-10-30
 * @version  1.0.0
 **/

// TODOs
//  * build auto-generation (random)
//  * build grid of all possible positions (centers only)
//  * detect connecting lines (inner polygons to max paths)

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);

    var textureImage = null;

    // All config params are optional.
    var pbTop = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("top-canvas"),
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
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,

          enableSVGExport: false
        },
        GUP
      )
    );
    var pbBottom = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("bottom-canvas"),
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
          backgroundColor: isDarkmode ? "#002424" : "#a8e8e8",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,

          enableSVGExport: false
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | A texture source,
    // +-------------------------------
    // this.textureSource.min.x = 2 / 500.0;
    // this.textureSource.min.y = 8 / 460.0;
    // this.textureSource.max.x = this.textureSource.min.x + 173 / 500.0;
    // this.textureSource.max.y = this.textureSource.min.y + 56 / 460.0;
    var textureSize = new Bounds({ x: 0, y: 0 }, { x: 500, y: 460 });
    var polygon = new Polygon(
      [
        { x: 2, y: 64 },
        { x: 78, y: 9 },
        { x: 174, y: 9 },
        { x: 97, y: 64 }
      ].map(function (coords) {
        return new Vertex(coords).sub(textureSize.width / 2, textureSize.height / 2);
      })
    );
    pbTop.add(polygon);

    var basePolygonBounds = polygon.getBounds();

    // var polygonPosition = new Vertex(
    //   basePolygonBounds.min.x + basePolygonBounds.width / 2,
    //   basePolygonBounds.min.y + basePolygonBounds.height / 2
    // );
    var polygonPosition = basePolygonBounds.getCenter();
    pbBottom.add(polygonPosition);

    // // +---------------------------------------------------------------------------------
    // // | Get the contrast color (string) for the given color (object).
    // // +-------------------------------
    // var toContrastColor = function (color) {
    //   return getContrastColor(color).cssRGB();
    // };

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawSource = function (draw, fill) {
      //
      var textureImage = textureStore.get("girihtexture-500px-2.png");
      if (textureImage && textureImage.naturalWidth) {
        // var w = textureImage.naturalWidth;
        // var h = textureImage.naturalHeight;
        pbTop.draw.image(
          textureImage,
          { x: -textureSize.width / 2, y: -textureSize.height / 2 },
          { x: textureSize.width, y: textureSize.height }
        );
      }

      pbBottom.redraw();
    };

    var drawTarget = function (draw, fill) {
      // Get the position offset of the polygon
      var targetCenterDifference = polygonPosition.clone().difference(basePolygonBounds.getCenter());
      if (fill.ctx) {
        fill.ctx.save();
        clipPoly(fill.ctx, fill.offset.clone().sub(targetCenterDifference), fill.scale, polygon.vertices);
        var targetTextureOffset = new Vertex(-textureSize.width / 2, -textureSize.height / 2)
          .scaleXY({
            x: fill.scale.x,
            y: fill.scale.y
          })
          .sub(targetCenterDifference.scaleXY({ x: 1 / fill.scale.x, y: 1 / fill.scale.y }));
        var targetTextureSize = new Vertex(textureSize.width, textureSize.height); // .scale(1 / fill.scale.x);
        fill.image(textureImage, targetTextureOffset, targetTextureSize);
        fill.ctx.restore();
      }

      // console.log("targetCenterDifference", targetCenterDifference);
      draw.polyline(
        polygon.vertices.map(function (vert) {
          return { x: vert.x - targetCenterDifference.x, y: vert.y - targetCenterDifference.y };
          // return { x: vert.x, y: vert.y };
        }),
        false,
        "green",
        2
      );
    };

    // A helper function to define the clipping path.
    // This could be a candidate for the draw library.
    var clipPoly = function (ctx, offset, scale, vertices) {
      ctx.beginPath();
      // Set clip mask
      ctx.moveTo(offset.x + vertices[0].x * scale.x, offset.y + vertices[0].y * scale.y);
      for (var i = 1; i < vertices.length; i++) {
        var vert = vertices[i];
        ctx.lineTo(offset.x + vert.x * scale.x, offset.y + vert.y * scale.y);
      }
      ctx.closePath();
      ctx.clip();
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        drawOutlines: true,
        drawCenters: true,
        drawCornerNumbers: false,
        drawTileNumbers: false,
        drawOuterPolygons: true,
        drawInnerPolygons: true,
        lineJoin: "round", // [ "bevel", "round", "miter" ]
        drawTextures: false,
        showPreviewOverlaps: true,
        allowOverlaps: false,
        exportFile: function () {
          exportFile();
        },
        importFile: function () {
          importFile();
        }
      },
      GUP
    );

    // Keep track of loaded textures
    var textureStore = new Map();
    var loadTextureImage = function (path, onLoad) {
      var texture = textureStore.get(path);
      if (!texture) {
        texture = new Image();
        texture.onload = onLoad;
        texture.src = path;
        textureStore.set(path, texture);
      }
      return texture;
    };
    textureImage = loadTextureImage("girihtexture-500px-2.png", function () {
      console.log("Texture loaded");
      pbTop.redraw();
    });

    // // Handle file-import click
    // var importFile = function () {
    //   var input = document.createElement("input");
    //   // input.type = "file";
    //   input.setAttribute("type", "file");
    //   input.onchange = e => {
    //     var file = e.target.files[0];
    //     var reader = new FileReader();
    //     reader.readAsText(file);
    //     reader.onload = readerEvent => {
    //       var content = readerEvent.target.result;
    //       var jsonData = JSON.parse(content);
    //       var jsonObject = girihFromJSON(jsonData);
    //       girih.replaceTiles(jsonObject);
    //       pb.redraw();
    //     };
    //   };
    //   input.click();
    // };

    // // Install DnD
    // var fileDrop = new FileDrop(pb.eventCatcher);
    // fileDrop.onFileJSONDropped(function (jsonObject) {
    //   var loadedGirihTiles = girihFromJSON(jsonObject);
    //   girih.replaceTiles(loadedGirihTiles);
    //   pb.redraw();
    // });

    // var stats = {
    //   intersectionArea: 0.0
    // };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pbTop.createGUI();
      // prettier-ignore
      // gui.add(config, 'drawCornerNumbers').listen().onChange( function() { pbTop.redraw(); } ).name("drawCornerNumbers").title("Draw the number of each tile corner?");
      // // prettier-ignore
      // gui.add(config, 'drawTileNumbers').listen().onChange( function() { pbTop.redraw(); } ).name("drawTileNumbers").title("Draw the index of each tile?");
      // // prettier-ignore
      // gui.add(config, 'drawOutlines').listen().onChange( function() { pbTop.redraw(); } ).name("drawOutlines").title("Draw the tile outlines?");
      // // prettier-ignore
      // gui.add(config, 'drawCenters').listen().onChange( function() { pbTop.redraw(); } ).name("drawCenters").title("Draw the center points?");
      // // prettier-ignore
      // gui.add(config, 'drawOuterPolygons').listen().onChange( function() { pbTop.redraw(); } ).name("drawOuterPolygons").title("Draw the outer polygons?");
      // // prettier-ignore
      // gui.add(config, 'drawInnerPolygons').listen().onChange( function() { pbTop.redraw(); } ).name("drawInnerPolygons").title("Draw the inner polygons?");
      // // prettier-ignore
      // gui.add(config, 'lineJoin', [ "bevel", "round", "miter" ] ).onChange( function() { pbTop.redraw(); } ).name("lineJoin").title("The shape of the line joins.");
      // // prettier-ignore
      // gui.add(config, 'drawTextures').listen().onChange( function() { pbTop.redraw(); } ).name("drawTextures").title("Draw the Girih textures?");
      // // prettier-ignore
      // gui.add(config, 'showPreviewOverlaps').listen().onChange( function() { pbTop.redraw(); } ).name('showPreviewOverlaps').title('Detect and show preview overlaps?');
      // // prettier-ignore
      // gui.add(config, 'allowOverlaps').listen().onChange( function() { pbTop.redraw(); } ).name('allowOverlaps').title('Allow placement of intersecting tiles?');
      // var foldImport = gui.addFolder("Import");
      // foldImport.add(config, "importFile");

      // // Add to internal dat.gui folder (exists as enableSVGExport=true)
      // var exportFolder = globalThis.utils.guiFolders["editor_settings.export"];
      // exportFolder.add(config, "exportFile");

      // Add stats
      // var uiStats = new UIStats(stats);
      // stats = uiStats.proxy;
      // uiStats.add("intersectionArea").precision(3).suffix(" spx");
    }

    pbTop.config.preDraw = drawSource;
    pbBottom.config.preDraw = drawTarget;
    // var container = document.querySelector(".wrapper-bottom");
    // // Apply canvas background color (this respects the darkmode in this component)
    // container.style["background-color"] = pb.config.backgroundColor;
    pbTop.redraw();
    pbTop.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
