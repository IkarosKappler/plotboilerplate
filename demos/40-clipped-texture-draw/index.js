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
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    // Cronholm144 or Lund-University template
    // See testPresets.js
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        rotation: 0.0,
        resetRotation: function () {
          config.rotation = 0.0;
          pbBottom.redraw();
        },
        tileScale: 1.0,
        presetName: GUP["presetName"] || "LU_pentagon", // "LS_penrose"
        drawTargetTexture: true
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
    // textureImage = loadTextureImage(imagePath, function () {
    //   console.log("Texture loaded");
    //   pbTop.redraw();
    // });

    // Fetch initial polygon
    var textureImage = null;
    var imagePath = null;
    var textureSize = null;
    var polygon = null; //
    var polygonPosition = new Vertex();
    var polygonCenterOffset = new Vertex();
    var basePolygonBounds = null; // polygon.getBounds();
    // var polygonPosition = new Vertex(); // basePolygonBounds.getCenter();

    function changeTilePreset() {
      // { polygon : Polygon, polygonPosition : Vertex, centerOffset : Vertex, ... }
      var preset = getTestPreset(config.presetName);
      console.log("Found preset", preset);
      imagePath = preset.imagePath;
      textureSize = preset.textureSize;
      loadTextureImage();
      pbTop.remove(polygon, false, true); // redraw=false, removeWithVertices=true
      polygon = preset.polygon;
      pbTop.add(polygon);
      // polygonPosition.set(preset.polygonPosition);
      polygonCenterOffset.set(preset.centerOffset);
      // Update position and bounds
      basePolygonBounds = polygon.getBounds();
      polygonPosition.set(basePolygonBounds.getCenter());
      // Load texture image
      textureImage = loadTextureImage(imagePath, function () {
        console.log("Texture loaded");
        pbTop.redraw();
      });
      pbTop.redraw();
    }
    changeTilePreset();

    // +---------------------------------------------------------------------------------
    // | Add texture source and source polygon.
    // +-------------------------------
    // pbTop.add(polygon);

    // var basePolygonBounds = polygon.getBounds();
    // var polygonPosition = basePolygonBounds.getCenter();
    // TODO: define according to type
    // var polygonRotationCenter = polygonPosition.clone().addY(-5); // ONLY PENTAGON
    pbBottom.add(polygonPosition);

    var polygonRotationCenter = polygonPosition.clone().add(polygonCenterOffset); // addXY(0, -5);
    // polygonPosition.listeners.addDragListener(function (event) {
    //   console.log("move", event.params);
    //   polygonRotationCenter.add(event.params.dragAmount);
    //   pbTop.redraw();
    // });
    pbTop.add(polygonRotationCenter);

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
      var textureImage = textureStore.get(imagePath);
      if (textureImage && textureImage.complete && textureImage.naturalWidth) {
        draw.image(
          textureImage,
          { x: -textureSize.width / 2, y: -textureSize.height / 2 },
          { x: textureSize.width, y: textureSize.height }
        );
      }

      pbBottom.redraw();
    };

    var drawTarget = function (draw, fill) {
      // basePolygonBounds = polygon.getBounds(); // Only required on editable polygons
      var rotation = (config.rotation / 180) * Math.PI; // Math.PI / 4;
      // var rotationalOffset = new Vertex(0, -5); //* config.tileScale);
      var rotationalOffset = basePolygonBounds.getCenter().difference(polygonRotationCenter);
      var positionOffset = basePolygonBounds.getCenter().difference(polygonPosition);
      var localRotationCenter = polygonPosition.clone().add(rotationalOffset);

      // Scale around center
      // var scaledTextureSize = new Bounds(
      //   textureSize.min.clone().add(positionOffset).scale(config.tileScale, localRotationCenter),
      //   textureSize.max.clone().add(positionOffset).scale(config.tileScale, localRotationCenter)
      // );
      var scaledTextureSize = new Bounds(
        textureSize.min.clone(), // .scale(config.tileScale, polygonRotationCenter).add(positionOffset.inv()),
        // .rotate(rotation, polygonPosition),
        textureSize.max.clone() // .scale(config.tileScale, polygonRotationCenter).add(positionOffset.inv())
        // .rotate(rotation, polygonPosition)
      );
      var boundsPolygon = scaledTextureSize
        .toPolygon()
        .scale(config.tileScale, polygonRotationCenter)
        .move(rotationalOffset.inv())
        .move(positionOffset)
        .rotate(rotation, polygonPosition);
      draw.polygon(boundsPolygon, "orange", 1.0);
      draw.crosshair(localRotationCenter, 4, "green");
      var scaledPolygon = polygon
        .clone()
        .scale(config.tileScale, polygonRotationCenter)
        .move(rotationalOffset)
        .move(positionOffset);
      var rotatedPolygon = scaledPolygon.clone().rotate(rotation, polygonPosition); //.move(positionOffset);

      if (config.drawTargetTexture) {
        // fill.texturedPoly(textureImage, textureSize, polygon, polygonPosition, rotation, polygonRotationCenter);
        fill.texturedPoly(textureImage, scaledTextureSize, rotatedPolygon, polygonPosition, rotation, localRotationCenter);
      }

      draw.polygon(polygon, "rgba(192,192,192,0.5)", 2.0);
      draw.polygon(scaledPolygon, "white", 1.0);
      draw.polygon(rotatedPolygon, "rgb(0,128,192)", 1.0);
    };

    function _crosshairAtZero(ctx) {
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 10);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }

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

    // var changeTilePreset = function () {};

    // // Keep track of loaded textures
    // var textureStore = new Map();
    // var loadTextureImage = function (path, onLoad) {
    //   var texture = textureStore.get(path);
    //   if (!texture) {
    //     texture = new Image();
    //     texture.onload = onLoad;
    //     texture.src = path;
    //     textureStore.set(path, texture);
    //   }
    //   return texture;
    // };
    // textureImage = loadTextureImage(imagePath, function () {
    //   console.log("Texture loaded");
    //   pbTop.redraw();
    // });

    // Add a mouse listener to track the mouse position.-
    new MouseHandler(pbTop.canvas).move(function (e) {
      var relPos = pbTop.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = -textureSize.min.x + relPos.x;
      stats.mouseY = -textureSize.min.y + relPos.y;
    });

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseX: 0,
      mouseY: 0,
      textureX: 0,
      textureY: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseX").precision(1);
    uiStats.add("mouseY").precision(1);
    uiStats.add("textureX").precision(1);
    uiStats.add("textureY").precision(1);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pbTop.createGUI();
      // prettier-ignore
      gui.add(config, 'rotation').min(-180).max(180).step(1).listen().onChange( function() { pbTop.redraw(); } ).name("rotation").title("Rotation of the tile");
      // prettier-ignore
      gui.add(config, 'resetRotation').name("resetRotation").title("resetRotation");
      // prettier-ignore
      // gui.add(config, 'performClip').listen().onChange( function() { pbTop.redraw(); } ).name("performClip").title("Perform the clipping?");
      // prettier-ignore
      gui.add(config, 'tileScale').min(0.5).max(2.0).listen().onChange( function() { pbTop.redraw(); } ).name("tileScale").title("Scale the tile up or down.");
      // prettier-ignore
      gui.add(config, 'drawTargetTexture').listen().onChange( function() { pbTop.redraw(); } ).name("drawTargetTexture").title("drawTargetTexture");

      // prettier-ignore
      gui.add(config, 'presetName', presetNames).listen().onChange( function() { changeTilePreset(); } ).name("presetName").title("Name a tile (penrose, pentagon, ...)");
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
