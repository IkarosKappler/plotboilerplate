/**
 * A script to demonstrate how to draw clipped polygons.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2020-10-30
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);
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
          backgroundColor: isDarkmode ? "#002424" : "#ffffff",
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
        canvasScaleX: 1.0,
        canvasScaleY: 1.0,
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

    // Fetch initial polygon
    var textureImage = null;
    var imagePath = null;
    var textureSize = null;
    var polygon = null; //
    var polygonPosition = new Vertex();
    var polygonCenterOffset = new Vertex();
    var basePolygonBounds = null;
    var polygonRotationCenter = polygonPosition.clone().add(polygonCenterOffset);

    function changeTilePreset() {
      // { polygon : Polygon, polygonPosition : Vertex, centerOffset : Vertex, ... }
      var preset = getTestPreset(config.presetName);
      imagePath = preset.imagePath;
      textureSize = preset.textureSize;
      loadTextureImage();
      pbTop.remove(polygon, false, true); // redraw=false, removeWithVertices=true
      polygon = preset.polygon;
      pbTop.add(polygon);
      polygonCenterOffset.set(preset.centerOffset);
      // Update position and bounds
      basePolygonBounds = polygon.getBounds();
      polygonPosition.set(basePolygonBounds.getCenter());
      polygonRotationCenter.set(polygonPosition).add(preset.centerOffset);
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
    pbBottom.add(polygonPosition);
    pbTop.add(polygonRotationCenter);

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
      var rotation = (config.rotation / 180) * Math.PI;
      var rotationalOffset = basePolygonBounds.getCenter().difference(polygonRotationCenter);
      var rotationalOffsetInv = rotationalOffset.inv();
      var positionOffset = basePolygonBounds.getCenter().difference(polygonPosition);
      var _localRotationCenter = polygonPosition.clone().add(rotationalOffset);

      // Scale around center
      var clonedTextureSize = new Bounds(textureSize.min.clone(), textureSize.max.clone());
      var scaledTextureSize = new Bounds(
        textureSize.min.clone().scale(config.tileScale, polygonRotationCenter).add(rotationalOffsetInv).add(positionOffset),
        textureSize.max.clone().scale(config.tileScale, polygonRotationCenter).add(rotationalOffsetInv).add(positionOffset)
      );

      var boundsPolygon = clonedTextureSize
        .toPolygon()
        .scale(config.tileScale, polygonRotationCenter)
        .move(rotationalOffsetInv)
        .move(positionOffset)
        .rotate(rotation, polygonPosition);

      draw.polygon(boundsPolygon, "orange", 1.0);
      draw.polygon(scaledTextureSize.toPolygon(), "yellow", 1.0);
      draw.polygon(clonedTextureSize.toPolygon(), "green", 1.0);
      draw.crosshair(_localRotationCenter, 4, "green");
      var scaledPolygon = polygon
        .clone()
        .scale(config.tileScale, polygonRotationCenter)
        .move(rotationalOffset)
        .move(positionOffset);
      var rotatedPolygon = scaledPolygon.clone().rotate(rotation, polygonPosition);

      if (config.drawTargetTexture) {
        fill.texturedPoly(textureImage, scaledTextureSize, rotatedPolygon, polygonPosition, rotation);
      }

      draw.polygon(polygon, "rgba(192,192,192,0.5)", 2.0);
      draw.polygon(scaledPolygon, "rgba(255,192,0,0.75)", 1.0); // orange
      draw.polygon(rotatedPolygon, "rgb(0,128,192)", 1.0);
    };

    // Add a mouse listener to track the mouse position.-
    new MouseHandler(pbTop.canvas).move(function (e) {
      var relPos = pbTop.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseXTop = -textureSize.min.x + relPos.x;
      stats.mouseYTop = -textureSize.min.y + relPos.y;
    });

    // Add a mouse listener to track the mouse position.-
    new MouseHandler(pbBottom.eventCatcher).move(function (e) {
      var relPos = pbBottom.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseXTop = e.params.pos.x; // relPos.x;
      stats.mouseYTop = e.params.pos.y; // relPos.y;
    });

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseXTop: 0,
      mouseYTop: 0,
      textureX: 0,
      textureY: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseXTop").precision(1);
    uiStats.add("mouseYTop").precision(1);
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
      gui.add(config, 'canvasScaleX').min(-2.0).max(2.0).listen().onChange( function() { pbBottom.draw.scale.x = pbBottom.fill.scale.x = config.canvasScaleX; pbBottom.redraw(); } ).name("canvasScaleX").title("Scale the canvas horizontally.");
      // prettier-ignore
      gui.add(config, 'canvasScaleY').min(-2.0).max(2.0).listen().onChange( function() { pbBottom.draw.scale.y = pbBottom.fill.scale.y = config.canvasScaleY; pbBottom.redraw();  } ).name("canvasScaleY").title("Scale the canvas vertically.");

      // prettier-ignore
      gui.add(config, 'drawTargetTexture').listen().onChange( function() { pbTop.redraw(); } ).name("drawTargetTexture").title("drawTargetTexture");

      // prettier-ignore
      gui.add(config, 'presetName', presetNames).listen().onChange( function() { changeTilePreset(); } ).name("presetName").title("Name a tile (penrose, pentagon, ...)");
    }

    pbTop.config.preDraw = drawSource;
    pbBottom.config.preDraw = drawTarget;
    pbTop.redraw();
    pbTop.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
