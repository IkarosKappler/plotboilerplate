/**
 * A script for drawing Girihs.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2020-10-30
 * @modified 2026-01-04 Making the line colors and line widths of the Girih demo more configurable.
 * @modified 2026-01-15 Refactoting everything into smaller classes.
 * @version  1.1.0
 **/

// TODOs
//  * DONE: Reset (start over button) with only one tile
//  * DONE: Clear selection button
//  * DONE safe current setup in localstorage
//  * DONE: Fill-highlight the hovering tile
//  * Flip tile?
//  * DONE PolygonTesselationOutlines requires proper documentation.
//  * DONE Avoid removing the last tile.
//  * DONE multiple random start setups
//  * undo/redo pipeline
//  * build auto-generation (random)
//  * build grid of all possible positions (centers only)
//  * detect connecting lines (inner polygons to max paths)

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var isMobile = detectMobileMode(params);
    if (isMobile) {
      try {
        document.body.classList.add("mobile");
      } catch (e) {
        console.warn(e);
      }
    }

    // Initialize templates, one for each Girih tile type.
    var girih = new Girih(GirihTile.DEFAULT_EDGE_LENGTH);

    var title = `Hover over existing tiles to see possible adjacent tiles.

    Press [a] or [d] to navigate through the tile set.
    
    Press [Enter] or click to place new tiles onto the canvas.
    
    Press [o] to toggle the outlines on/off.

    Press [h] to toggle the outer hull on/off.
    
    Press [p] to toggle the outer polygons on/off.
    
    Press [i] to toggle the inner polygons on/off.
    
    Press [t] to toggle the textures on/off.
    
    Press [c] to toggle center points on/off.`;
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
          drawGrid: false,
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
          enableSVGExport: true,
          title: title
        },
        GUP
      )
    );
    pb.drawConfig.polygon.color = Green.cssRGB();
    pb.drawConfig.polygon.lineWidth = 2.0;

    // +---------------------------------------------------------------------------------
    // | A global Girih config that's attached to the lil.gui control interface.
    // +-------------------------------
    var config = {
      drawOutlines: params.getBoolean("drawOutlines", false),
      drawOuterHull: params.getBoolean("drawOuterHull", true),
      outerHullTolerance: params.getNumber("outerHullTolerance", PolygonTesselationOutlines.DEFAULT_TOLERANCE),
      outerHullRemoveExcessiveVerts: params.getBoolean("outerHullRemoveExcessiveVerts", true),
      drawCenters: params.getBoolean("drawCenters", true),
      drawCornerNumbers: params.getBoolean("drawCornerNumbers", false),
      drawTileNumbers: params.getBoolean("drawTileNumbers", false),
      drawOuterPolygons: params.getBoolean("drawOuterPolygons", true),
      drawInnerPolygons: params.getBoolean("drawInnerPolygons", true),
      fillOuterPolygons: params.getBoolean("fillOuterPolygons", false),
      fillInnerPolygons: params.getBoolean("fillInnerPolygons", false),
      lineJoin: params.getString("lineJoin", "round"), // [ "bevel", "round", "miter" ]
      drawTextures: params.getBoolean("drawTextures", false),
      showPreviewOverlaps: params.getBoolean("showPreviewOverlaps", true),
      allowOverlaps: params.getBoolean("allowOverlaps", false),
      drawFullImages: params.getBoolean("drawFullImages", false),
      drawBoundingBoxes: params.getBoolean("drawBoundingBoxes", false),
      texturePath: params.getString("texturePath", "girihtexture-500px-2.png"),
      outlineLineWidth: params.getNumber("drawFullImages", 4.0),
      outlineLineColor: params.getString("outlineLineColor", Color.Navy.cssRGB()),
      innerPolygonLineColor: params.getString("innerPolygonLineColor", "rgb(86,0,255)"),
      innerPolygonLineWidth: params.getNumber("innerPolygonLineWidth", isMobile ? 4.0 : 2.0),
      innerPolygonFillColor: params.getString("innerPolygonFillColor", "rgb(128,128,128)"),
      outerPolygonLineColor: params.getString("outerPolygonLineColor", Color.Teal.cssRGB()),
      outerPolygonLineWidth: params.getNumber("outerPolygonLineWidth", isMobile ? 4.0 : 2.0),
      outerPolygonFillColor: params.getString("outerPolygonFillColor", "rgb(92,92,92)"),
      outerHullLineWidth: params.getNumber("outerHullLineWidth", isMobile ? 24.0 : 12.0),
      outerHullLineColor: params.getString("outerHullLineColor", "rgb(36,31,49)"),
      previewPolygonLineWidth: params.getNumber("previewPolygonLineWidth", isMobile ? 4.0 : 2.0),

      clearSelection: function () {
        clearSelection();
      },
      deleteSelectedTile: function () {
        tilingHelper.handleDeleteTile();
        updateHoverMenu();
      },
      clearScene: function () {
        clearScene();
      },
      randomPreset: function () {
        tilingHelper.removeAllTiles();
        initTiles();
      },
      exportFile: function () {
        exportFile();
      },
      importFile: function () {
        importFile();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Create a new renderer.
    // +-------------------------------
    var girihRenderer = new GirihRenderer(pb, girih, config);

    // +---------------------------------------------------------------------------------
    // | Create a hover menu for mobile devices?
    // +-------------------------------
    var mobileHoverMenu = isMobile ? new MobileHoverMenu("left center-v hidden") : null;
    if (mobileHoverMenu) {
      mobileHoverMenu.addButton("♻", function () {
        tilingHelper.handleDeleteTile();
        updateHoverMenu();
      });
    }

    // +---------------------------------------------------------------------------------
    // | Initialize Stats
    // +-------------------------------
    var stats = {
      intersectionArea: 0.0
    };
    // Add stats
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("intersectionArea").precision(3).suffix(" spx");

    // +---------------------------------------------------------------------------------
    // | Initialize TilingHelper
    // +-------------------------------
    var tilingHelper = new TilingHelper(pb, girih, stats);

    var initTiles = function () {
      // Templates from `girihTemplates.js`
      var templateIndex = Math.floor(Math.random() * GIRIH_TEMPLATES.length);
      var template = GIRIH_TEMPLATES[templateIndex];
      console.log("templateIndex", templateIndex);
      var initialTiles = girihFromJSON(template);
      for (var i in initialTiles) {
        var tile = initialTiles[i].clone();
        tilingHelper.addTile(tile);
      }
    };

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawAll = function (draw, fill) {
      // Draw tesselation graph?
      girihRenderer.drawOuterHull(draw, fill);

      // Draw the preview polygon before other polygons/tiles.
      girihRenderer.drawPreviewIntersectionPolygons(
        draw,
        fill,
        tilingHelper.previewTiles,
        tilingHelper.previewIntersectionPolygons,
        tilingHelper.hoverTileIndex,
        tilingHelper.hoverEdgeIndex,
        tilingHelper.previewTilePointer
      );

      // Draw all tiles
      girihRenderer.drawAllTiles(draw, fill, tilingHelper.hoverTileIndex, girihRenderer.textureImage);

      // Draw intersection polygons? (if there are any)
      girihRenderer.drawIntersectionPolygons(
        draw,
        fill,
        tilingHelper.hoverTileIndex,
        tilingHelper.hoverEdgeIndex,
        tilingHelper.previewTiles,
        tilingHelper.previewTilePointer,
        tilingHelper.previewIntersectionPolygons
      );
    };

    var addPreviewTile = function (doRedraw) {
      // Avoid overlaps?
      if (!config.allowOverlaps && stats.intersectionArea > 1) {
        console.log("Adding overlapping tiles not allowed.");
        if (humane) {
          humane.log("Adding overlapping tiles not allowed.");
        }
        return;
      }

      tilingHelper.addTile(tilingHelper.previewTiles[tilingHelper.previewTilePointer].clone());
      doRedraw && pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.eventCatcher, "girih-demo")
      .move(function (e) {
        if (e.params.isTouchEvent || isMobile) {
          return;
        }
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        handleMouseMove(relPos);
      })
      .click(function (e) {
        var clickedVert = pb.getVertexNear(e.params.pos, PlotBoilerplate.DEFAULT_CLICK_TOLERANCE);
        console.log("clickedVert", clickedVert);
        // Touch and mouse devices handle this differently
        if (e.params.isTouchEvent || isMobile) {
          console.log("isMobile");
          if (clickedVert) {
            console.log("Clicked");
            handleClickedVert(clickedVert);
            updateHoverMenu();
            return;
          }
          // Touch/Mobile mode: first touch identifies edge, second touch places the adjacent tile.
          var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
          var hoverTileAndEdgeIndex = girih.locateContainingTileAndEdge(relPos);
          if (
            hoverTileAndEdgeIndex &&
            (hoverTileAndEdgeIndex.tileIndex != tilingHelper.hoverTileIndex ||
              hoverTileAndEdgeIndex.edgeIndex != tilingHelper.hoverEdgeIndex)
          ) {
            tilingHelper.hoverTileIndex = hoverTileAndEdgeIndex.tileIndex;
            tilingHelper.hoverEdgeIndex = hoverTileAndEdgeIndex.edgeIndex;
            handleActiveHoverIndices();
            updateHoverMenu();
            pb.redraw();
          } else if (
            hoverTileAndEdgeIndex &&
            tilingHelper.hoverTileIndex == hoverTileAndEdgeIndex.tileIndex &&
            tilingHelper.hoverEdgeIndex == hoverTileAndEdgeIndex.edgeIndex
          ) {
            // The last clicked located the active tile and active edge.
            //    -> we can safely add the adjacent tile here
            addPreviewTile(false);
            // Clear selected tile/edge after adding
            tilingHelper.hoverTileIndex = -1;
            tilingHelper.hoverEdgeIndex = -1;
            updateHoverMenu();
            pb.redraw();
          } else {
            // Active
            handleMouseMove(relPos);
          }
        } else if (
          tilingHelper.hoverTileIndex != -1 &&
          tilingHelper.hoverEdgeIndex != -1 &&
          tilingHelper.previewTilePointer < tilingHelper.previewTiles.length
        ) {
          // Desktop mode: just add (if center not clicked)
          if (clickedVert) {
            console.log("center Clicked");
            return;
          }
          addPreviewTile(true);
        }
      });

    var handleClickedVert = function (clickedVert) {
      // Locate the Girih tile with the specified vert at center.
      var clickedTile = girih.getTileByCenter(clickedVert);
      if (clickedTile) {
        clickedTile.position.attr.isSelected = !clickedTile.position.attr.isSelected;
        pb.redraw();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Mobile devices use a hover menu for additional features that would be usable
    // | by keyboard events on desktop devices.
    // +-------------------------------
    var updateHoverMenu = function () {
      if (!mobileHoverMenu) {
        return;
      }
      // Is at least one tile selected?
      var isOneSelected =
        girih.tiles.find(function (tile) {
          return tile.position.attr.isSelected;
        }) != null;
      if (isOneSelected) {
        mobileHoverMenu.show();
      } else {
        mobileHoverMenu.hide();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Add a key listener.
    // +-------------------------------
    var keyHandler = new KeyHandler({ trackAll: true })
      .down("q", function () {
        tilingHelper.handleTurnTile(-1);
      })
      .down("e", function () {
        tilingHelper.handleTurnTile(1);
      })
      .down("uparrow", function (e) {
        tilingHelper.handleMoveTile(0, -1);
      })
      .down("leftarrow", function (e) {
        tilingHelper.handleMoveTile(-1, 0);
      })
      .down("downarrow", function (e) {
        tilingHelper.handleMoveTile(0, 1);
      })
      .down("rightarrow", function (e) {
        tilingHelper.handleMoveTile(1, 0);
      })
      .down("o", function () {
        config.drawOutlines = !config.drawOutlines;
        pb.redraw();
      })
      .down("h", function () {
        config.drawOuterHull = !config.drawOuterHull;
        pb.redraw();
      })
      .down("n", function () {
        config.drawCornerNumbers = !config.drawCornerNumbers;
        pb.redraw();
      })
      .down("c", function () {
        config.drawCenters = !config.drawCenters;
        pb.redraw();
      })
      .down("p", function () {
        config.drawOuterPolygons = !config.drawOuterPolygons;
        pb.redraw();
      })
      .down("i", function () {
        config.drawInnerPolygons = !config.drawInnerPolygons;
        pb.redraw();
      })
      .down("t", function () {
        config.drawTextures = !config.drawTextures;
        pb.redraw();
      })
      .down("d", function () {
        tilingHelper.previewTilePointer = (tilingHelper.previewTilePointer + 1) % tilingHelper.previewTiles.length;
        highlightPreviewTile(tilingHelper.previewTilePointer, pb);
        if (tilingHelper.hoverTileIndex != -1 && tilingHelper.hoverEdgeIndex != -1) {
          tilingHelper.findPreviewIntersections();
          pb.redraw();
        }
      })
      .down("a", function () {
        tilingHelper.previewTilePointer--;
        if (tilingHelper.previewTilePointer < 0) tilingHelper.previewTilePointer = tilingHelper.previewTiles.length - 1;
        highlightPreviewTile(tilingHelper.previewTilePointer, pb);
        if (tilingHelper.hoverTileIndex != -1 && tilingHelper.hoverEdgeIndex != -1) {
          tilingHelper.findPreviewIntersections();
          pb.redraw();
        }
      })
      .down("enter", function () {
        if (tilingHelper.previewTilePointer < tilingHelper.previewTiles.length) {
          addPreviewTile(true);
        }
      })
      .down("delete", function () {
        // console.log("delete");
        tilingHelper.handleDeleteTile();
        updateHoverMenu();
      })
      .down("backspace", function () {
        // console.log("delete");
        tilingHelper.handleDeleteTile();
        updateHoverMenu();
      })
      .down("escape", function () {
        // console.log("clear selection");
        clearSelection();
      });
    // +---------------------------------------------------------------------------------
    // | @param {XYCoords} relPos
    // +-------------------------------
    var handleMouseMove = function (relPos) {
      var hoverTileAndEdgeIndex = girih.locateContainingTileAndEdge(relPos);
      if (hoverTileAndEdgeIndex) {
        if (
          tilingHelper.hoverTileIndex == hoverTileAndEdgeIndex.tileIndex &&
          tilingHelper.hoverEdgeIndex == hoverTileAndEdgeIndex.edgeIndex
        ) {
          return; // Nochange
        }
        tilingHelper.hoverTileIndex = hoverTileAndEdgeIndex.tileIndex;
        tilingHelper.hoverEdgeIndex = hoverTileAndEdgeIndex.edgeIndex;
        // // Set pointer to save range
        tilingHelper.previewTilePointer = Math.min(
          Math.max(tilingHelper.previewTiles.length - 1, tilingHelper.previewTilePointer),
          tilingHelper.previewTilePointer
        );
      } else {
        tilingHelper.hoverTileIndex = -1;
        tilingHelper.hoverEdgeIndex = -1;
        // previewTilePointer = 0;
      }

      handleActiveHoverIndices();
      updateHoverMenu();
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Update adjacent possible preview tiles.
    // +-------------------------------
    var handleActiveHoverIndices = function () {
      tilingHelper.previewTiles = girih.findPossibleAdjacentTiles(tilingHelper.hoverTileIndex, tilingHelper.hoverEdgeIndex);
      // Find any intersections for the new preview tile
      tilingHelper.findPreviewIntersections();
      if (tilingHelper.previewTiles.length != 0) {
        createAdjacentTilePreview(
          tilingHelper.previewTiles,
          tilingHelper.previewTilePointer,
          function (pointer) {
            tilingHelper.setPreviewTilePointer(pointer);
          },
          pb,
          {
            isMobile: detectMobileMode(params)
          }
        );
      }
    };

    // +---------------------------------------------------------------------------------
    // | Clear/reset the scene and add one
    // +-------------------------------
    var clearScene = function () {
      tilingHelper.removeAllTiles();
      tilingHelper.addTile(girih.TILE_TEMPLATES[0].clone());
      updateHoverMenu();
    };

    // +---------------------------------------------------------------------------------
    // | Clears the `selected` flag for all vertices.
    // +-------------------------------
    var clearSelection = function () {
      girih.tiles.forEach(function (tile) {
        tile.position.attr.isSelected = false;
      });
      updateHoverMenu();
      pb.redraw();
    };

    var exportFile = function () {
      var data = girihToJSON(girih.tiles);
      saveAs(new Blob([data], { type: "application/json" }), "girih.json");
    };

    // Handle file-import click
    var importFile = function () {
      var input = document.createElement("input");
      // input.type = "file";
      input.setAttribute("type", "file");
      input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = readerEvent => {
          var content = readerEvent.target.result;
          var jsonData = JSON.parse(content);
          var jsonObject = girihFromJSON(jsonData);
          // girih.replaceTiles(jsonObject);
          tilingHelper.replaceAllTiles(jsonObject);
          pb.redraw();
        };
      };
      input.click();
    };

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
    girihRenderer.textureImage = loadTextureImage(config.texturePath, function () {
      console.log("Texture loaded");
      pb.redraw();
    });

    var imagePath = null;
    function handleTextureChange() {
      imagePath = config.texturePath;
      console.log("handleChange", imagePath);
      // Load texture image
      girihRenderer.textureImage = loadTextureImage(imagePath, function () {
        console.log("Texture loaded");
        pb.redraw();
      });
      pb.redraw();
    }

    // Install DnD
    var fileDrop = new FileDrop(pb.eventCatcher);
    fileDrop.onFileJSONDropped(function (jsonObject) {
      var loadedGirihTiles = girihFromJSON(jsonObject);
      // girih.replaceTiles(loadedGirihTiles);
      tilingHelper.replaceAllTiles(loadedGirihTiles);
      pb.redraw();
    });

    const storeInLocalStorage = function () {
      var setValue = girihToJSON(girih.tiles);
      console.log("[storeInLocalStorage] setValue"); //, setValue);
      localStorage.setItem("GirihEditor", setValue);
    };

    const restoreFromLocalStorage = function () {
      // Storage value to array of ColorGradients
      const value = localStorage.getItem("GirihEditor");
      console.log("[restoreFromLocalStorage] value"); //, value);
      if (!value) {
        return false;
      }
      const jsonArray = JSON.parse(value);
      if (!Array.isArray(jsonArray)) {
        return false;
      }
      var jsonObject = girihFromJSON(jsonArray);
      tilingHelper.removeAllTiles();
      for (var i in jsonObject) {
        var tile = jsonObject[i].clone();
        tilingHelper.addTile(tile);
      }
      return true;
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var foldGirihBasics = gui.addFolder("Girih Settings");
      // prettier-ignore
      foldGirihBasics.add(config, 'drawCornerNumbers').listen().onChange( function() { pb.redraw(); } ).name("drawCornerNumbers").title("Draw the number of each tile corner?");
      // prettier-ignore
      foldGirihBasics.add(config, 'drawTileNumbers').listen().onChange( function() { pb.redraw(); } ).name("drawTileNumbers").title("Draw the index of each tile?");
      // prettier-ignore
      foldGirihBasics.add(config, 'drawCenters').listen().onChange( function() { pb.redraw(); } ).name("drawCenters").title("Draw the center points?");
      // prettier-ignore
      foldGirihBasics.add(config, 'lineJoin', [ "bevel", "round", "miter" ] ).onChange( function() { pb.redraw(); } ).name("lineJoin").title("The shape of the line joins.");
      // prettier-ignore
      foldGirihBasics.add(config, 'drawTextures').listen().onChange( function() { pb.redraw(); } ).name("drawTextures").title("Draw the Girih textures?");
      // prettier-ignore
      foldGirihBasics.add(config, 'showPreviewOverlaps').listen().onChange( function() { pb.redraw(); } ).name('showPreviewOverlaps').title('Detect and show preview overlaps?');
      // prettier-ignore
      foldGirihBasics.add(config, 'allowOverlaps').listen().onChange( function() { pb.redraw(); } ).name('allowOverlaps').title('Allow placement of intersecting tiles?');
      // prettier-ignore
      foldGirihBasics.add(config, 'drawFullImages').listen().onChange( function() { pb.redraw(); } ).name('drawFullImages').title('Show a hint of the full imagse?');
      // prettier-ignore
      foldGirihBasics.add(config, 'drawBoundingBoxes').listen().onChange( function() { pb.redraw(); } ).name('drawBoundingBoxes').title('Show different kind of bounding boxes (textur mode only)?');
      // prettier-ignore
      foldGirihBasics.add(config, 'texturePath', ["girihtexture-500px-2.png", "girih-tiles-spatial-1.png"]).listen().onChange( handleTextureChange ).name('texturePath').title('Choose a texture.');
      foldGirihBasics.close();

      var foldGirihDrawSettings = gui.addFolder("Girih lines and colors");
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'drawOutlines').listen().onChange( function() { pb.redraw(); } ).name("drawOutlines").title("Draw the tile outlines?");
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'outlineLineWidth').min(0.0).max(64.0).step(1.0).title("The line width of the tiles' outline.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.addColor(config, 'outlineLineColor').title("The color of the tiles' outline.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'drawInnerPolygons').listen().onChange( function() { pb.redraw(); } ).name("drawInnerPolygons").title("Draw the inner polygons?");
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'innerPolygonLineWidth').min(0.0).max(64.0).step(1.0).title("The line width of the inner polygons.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.addColor(config, 'innerPolygonLineColor').title("The line color of the inner polygons.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'fillInnerPolygons').listen().onChange( function() { pb.redraw(); } ).title("Fill the inner polygons?");
      // prettier-ignore
      foldGirihDrawSettings.addColor(config, 'innerPolygonFillColor').title("The fill color of the inner polygons.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'drawOuterPolygons').listen().onChange( function() { pb.redraw(); } ).name("drawOuterPolygons").title("Draw the outer polygons?");
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'outerPolygonLineWidth').min(0.0).max(64.0).step(1.0).title("The line width of the outer polygons.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.addColor(config, 'outerPolygonLineColor').title("The line color of the outer polygons.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'fillOuterPolygons').listen().onChange( function() { pb.redraw(); } ).title("Fill the outer polygons?");
      // prettier-ignore
      foldGirihDrawSettings.addColor(config, 'outerPolygonFillColor').title("The fill color of the outer polygons.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'drawOuterHull').listen().onChange( function() { pb.redraw(); } ).title("Calculate and draw the outer hull?");
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'outerHullTolerance').min(0.0).max(4.0).step(0.01).title("The tolerance (max distance) to use for calculating the outer hull.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'outerHullRemoveExcessiveVerts').listen().onChange( function() { pb.redraw(); } ).title("If outer hull is calculated: remove unused vertices?");
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'outerHullLineWidth').min(0.0).max(64.0).step(1.0).title("The line width of the outer hull.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.addColor(config, 'outerHullLineColor').title("The line color of the outer hull.").onChange( function() { pb.redraw(); } );
      // prettier-ignore
      foldGirihDrawSettings.add(config, 'previewPolygonLineWidth').min(0.0).max(64.0).step(1.0).title("The line width of the preview polygon.").onChange( function() { pb.redraw(); } );
      // foldGirihDrawSettings.close();

      // prettier-ignore
      gui.add(config, 'clearSelection').name("Clear Selection").title('De-selects all tiles.');
      // prettier-ignore
      gui.add(config, 'deleteSelectedTile').name("Delete Selected Tile").title('Delete selected tile.');
      // prettier-ignore
      gui.add(config, 'clearScene').name("Clear Scene").title('Clear the whole scene and add one default tile.');
      // prettier-ignore
      gui.add(config, 'randomPreset').name("Load random preset").title('Loads a random preset scene.');

      var foldImport = gui.addFolder("Import");
      foldImport.add(config, "importFile").name("Import Girih from JSON file");

      // Add to internal dat.gui folder (exists as enableSVGExport=true)
      var exportFolder = globalThis.utils.guiFolders["editor_settings.export"];
      exportFolder.add(config, "exportFile").name("Export Girih to JSON file");
    }

    if (!restoreFromLocalStorage()) {
      initTiles();
    }
    pb.config.preDraw = drawAll;
    var container = document.querySelector(".wrapper-bottom");
    // Apply canvas background color (this respects the darkmode in this component)
    container.style["background-color"] = pb.config.backgroundColor;

    setInterval(() => {
      storeInLocalStorage();
    }, 10000);

    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
