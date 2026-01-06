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
 * @version  1.0.0
 **/

// TODOs
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
    var isMobile = detectMobileMode(params); // isMobileDevice();
    // console.log("isMobile", isMobileDevice());
    // console.log("agent", navigator.userAgent);

    var textureImage = null;

    // Initialize templates, one for each Girih tile type.
    var girih = new Girih(GirihTile.DEFAULT_EDGE_LENGTH);

    var title = `Hover over existing tiles to see possible adjacent tiles.

    Press [a] or [d] to navigate through the tile set.
    
    Press [Enter] or click to place new tiles onto the canvas.
    
    Press [o] to toggle the outlines on/off.
    
    Press [p] to toggle the outer polygons on/off.
    
    Press [i] to toggle the inner polygons on/off.
    
    Press [t] to toggle the textures on/off.`;
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
      drawOutlines: params.getBoolean("drawOutlines", true),
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
      innerPolygonLineColor: params.getString("innerPolygonLineColor", Color.DeepPink.cssRGB()), // DeepPurple
      innerPolygonLineWidth: params.getNumber("innerPolygonLineWidth", isMobile ? 4.0 : 2.0),
      innerPolygonFillColor: params.getString("innerPolygonFillColor", "rgb(128,128,128)"),
      outerPolygonLineColor: params.getString("outerPolygonLineColor", Color.Teal.cssRGB()),
      outerPolygonLineWidth: params.getNumber("outerPolygonLineWidth", isMobile ? 4.0 : 2.0),
      outerPolygonFillColor: params.getString("outerPolygonFillColor", "rgb(92,92,92)"),

      exportFile: function () {
        exportFile();
      },
      importFile: function () {
        importFile();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Initialize
    // +-------------------------------
    // The index of the tile the mouse is hovering on or nearby (in the tiles-array)
    var hoverTileIndex = -1;
    // The index of the closest edge to the mouse pointer
    var hoverEdgeIndex = -1;
    // If the mouse hovers over an edge the next possible adjacent Girih tile will be this
    var previewTiles = [];
    var previewTilePointer = 0;
    var initTiles = function () {
      for (var i in girih.TILE_TEMPLATES) {
        var tile = girih.TILE_TEMPLATES[i].clone();
        addTile(tile);
      }
    };

    var previewIntersectionPolygons = [];
    var previewIntersectionAreas = [];

    // +---------------------------------------------------------------------------------
    // | Add a tile and install listeners.
    // +-------------------------------
    var addTile = function (tile) {
      tile.position.listeners.addClickListener(
        (function (vertex) {
          return function (clickEvent) {
            vertex.attr.isSelected = !vertex.attr.isSelected;
            pb.redraw();
          };
        })(tile.position)
      );
      tile.position.attr.draggable = false;
      tile.position.attr.visible = false;
      pb.add(tile.position);
      girih.addTile(tile);
    };

    // +---------------------------------------------------------------------------------
    // | Remove the tile at the given index.
    // +-------------------------------
    var removeTile = function (tileIndex) {
      // Remove listeners?
      pb.remove(girih.tiles[tileIndex].position);
      girih.removeTileAt(tileIndex);
    };

    // +---------------------------------------------------------------------------------
    // | Get the contrast color (string) for the given color (object).
    // +-------------------------------
    var toContrastColor = function (color) {
      return getContrastColor(color).cssRGB();
    };

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawAll = function (draw, fill) {
      // Draw the preview polygon first
      if (hoverTileIndex != -1 && hoverEdgeIndex != -1 && 0 <= previewTilePointer && previewTilePointer < previewTiles.length) {
        draw.polygon(previewTiles[previewTilePointer], "rgba(128,128,128,0.5)", 1.0); // Polygon is not open

        // Draw intersection polygons (if there are any)
        if (config.showPreviewOverlaps) {
          for (var i = 0; i < previewIntersectionPolygons.length; i++) {
            pb.fill.polygon(previewIntersectionPolygons[i], "rgba(255,0,0,0.25)");
          }
        }
      }

      // Draw all tiles
      for (var i in girih.tiles) {
        var tile = girih.tiles[i];
        // Fill polygon when highlighted (mouse hover)
        drawTile(draw, fill, tile, i);
      }

      // Draw intersection polygons? (if there are any)
      if (
        config.showPreviewOverlaps &&
        hoverTileIndex != -1 &&
        hoverEdgeIndex != -1 &&
        0 <= previewTilePointer &&
        previewTilePointer < previewTiles.length
      ) {
        for (var i = 0; i < previewIntersectionPolygons.length; i++) {
          fill.polygon(previewIntersectionPolygons[i], "rgba(255,0,0,0.25)");
        }
      }

      if (hoverTileIndex != -1 && hoverEdgeIndex != -1) {
        var tile = girih.tiles[hoverTileIndex];
        var edge = new Line(tile.vertices[hoverEdgeIndex], tile.vertices[(hoverEdgeIndex + 1) % tile.vertices.length]);
        draw.line(edge.a, edge.b, Red.cssRGB(), 2.0);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given tile.
    // |
    // | @param {GirihTile} tile - The tile itself.
    // | @param {number} index - The index in the tiles-array (to highlight hover).
    // +-------------------------------
    var drawTile = function (draw, fill, tile, index) {
      if (config.drawTextures && textureImage.complete && textureImage.naturalHeight !== 0) {
        drawTileTexture(pb, tile, textureImage, config.drawFullImages, config.drawBoundingBoxes);
      }

      if (config.drawOutlines) {
        // draw.polygon(tile, pb.drawConfig.polygon.color, pb.drawConfig.polygon.lineWidth); // Polygon is not open
        draw.polygon(tile, config.outlineLineColor, config.outlineLineWidth, { lineJoin: config.lineJoin }); // Polygon is not open
      }

      // Draw all inner polygons?
      for (var j = 0; j < tile.innerTilePolygons.length; j++) {
        // draw.polygon(tile.innerTilePolygons[j], DeepPurple.cssRGB(), 1.0);
        if (config.fillInnerPolygons) {
          fill.polygon(tile.innerTilePolygons[j], config.innerPolygonFillColor);
        }
        if (config.drawInnerPolygons) {
          draw.polygon(tile.innerTilePolygons[j], config.innerPolygonLineColor, config.innerPolygonLineWidth, {
            lineJoin: config.lineJoin
          });
        }
      }

      // Draw all outer polygons?
      for (var j = 0; j < tile.outerTilePolygons.length; j++) {
        // draw.polygon(tile.outerTilePolygons[j], Teal.cssRGB(), 1.0);
        if (config.fillOuterPolygons) {
          fill.polygon(tile.outerTilePolygons[j], config.outerPolygonFillColor);
        }
        if (config.drawOuterPolygons) {
          draw.polygon(tile.outerTilePolygons[j], config.outerPolygonLineColor, config.outerPolygonLineWidth, {
            lineJoin: config.lineJoin
          });
        }
      }

      // Draw a crosshair at the center
      var isHighlighted = index == hoverTileIndex;
      if (config.drawCenters) {
        drawFancyCrosshair(
          draw,
          fill,
          tile.position,
          tile.position.attr.isSelected ? "red" : isHighlighted ? "rgba(192,0,0,0.5)" : "rgba(0,192,192,0.5)",
          tile.position.attr.isSelected ? 2.0 : 1.0,
          3.0
        );
      }

      var contrastColor = toContrastColor(Color.parse(pb.config.backgroundColor));
      // Draw corner numbers?
      if (config.drawCornerNumbers) {
        for (var i = 0; i < tile.vertices.length; i++) {
          var pos = tile.vertices[i].clone().scale(0.85, tile.position);
          fill.text("" + i, pos.x, pos.y, { color: contrastColor });
        }
      }

      if (config.drawTileNumbers) {
        fill.text("" + index, tile.position.x, tile.position.y, { color: contrastColor });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Turn the tile the mouse is hovering over.
    // | The turnCount is ab abstract number: -1 for one turn left, +1 for one turn right.
    // +-------------------------------
    var handleTurnTile = function (turnCount) {
      if (hoverTileIndex == -1) {
        return;
      }
      girih.turnTile(hoverTileIndex, turnCount);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Move that tile the mouse is hovering over.
    // | The move amounts are abstract numbers, 1 indicating one unit along each axis.
    // +-------------------------------
    var handleMoveTile = function (moveXAmount, moveYAmount) {
      // console.log("move");
      if (hoverTileIndex == -1) {
        return;
      }
      girih.moveTile(hoverTileIndex, moveXAmount, moveYAmount);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | A helper function to find all tiles (indices) that are selected.
    // +-------------------------------
    var findSelectedTileIndices = function () {
      var selectedTileIndices = [];
      for (var i in girih.tiles) {
        if (girih.tiles[i].position.attr.isSelected) selectedTileIndices.push(i);
      }
      return selectedTileIndices;
    };

    // +---------------------------------------------------------------------------------
    // | Delete all selected tiles.
    // +-------------------------------
    var handleDeleteTile = function () {
      // Find selected tiles
      var selectedTileIndices = findSelectedTileIndices();
      for (var i = selectedTileIndices.length - 1; i >= 0; i--) {
        removeTile(selectedTileIndices[i]);
      }
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Set the currently highlighted preview tile from the preview set.
    // +-------------------------------
    var setPreviewTilePointer = function (pointer) {
      previewTilePointer = pointer;
      pb.redraw();
    };

    var addPreviewTile = function (doRedraw) {
      console.log("area", stats, stats.intersectionArea);

      // Avoid overlaps?
      if (!config.allowOverlaps && stats.intersectionArea > 1) {
        console.log("Adding overlapping tiles not allowed.");
        if (humane) {
          humane.log("Adding overlapping tiles not allowed.");
        }
        return;
      }

      addTile(previewTiles[previewTilePointer].clone());
      doRedraw && pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.eventCatcher, "girih-demo")
      .move(function (e) {
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        var cx = document.getElementById("cx");
        var cy = document.getElementById("cy");
        if (cx) cx.innerHTML = relPos.x.toFixed(2);
        if (cy) cy.innerHTML = relPos.y.toFixed(2);

        if (e.params.isTouchEvent || isMobile) {
          return;
        }
        console.log("move");
        handleMouseMove(relPos);
      })
      .click(function (e) {
        console.log("Click");
        var clickedVert = pb.getVertexNear(e.params.pos, PlotBoilerplate.DEFAULT_CLICK_TOLERANCE);
        if (clickedVert) {
          return;
        }
        // Touch and mouse devices handle this differently
        console.log("isTouch", e.params.isTouchEvent, "isMobile", isMobile);
        if (e.params.isTouchEvent || isMobile) {
          // Touch/Mobile mode: first touch identifies edge, second touch places the adjacent tile.
          console.log("hoverTileIndex", hoverTileIndex, "hoverEdgeIndex", hoverEdgeIndex);
          var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
          var hoverTileAndEdgeIndex = girih.locateContainingTileAndEdge(relPos);
          if (
            hoverTileAndEdgeIndex &&
            (hoverTileAndEdgeIndex.tileIndex != hoverTileIndex || hoverTileAndEdgeIndex.edgeIndex != hoverEdgeIndex)
          ) {
            hoverTileIndex = hoverTileAndEdgeIndex.tileIndex;
            hoverEdgeIndex = hoverTileAndEdgeIndex.edgeIndex;
            // handleMouseMove(relPos);
            handleActiveHoverIndices();
            pb.redraw();
          } else if (hoverTileIndex != -1 && hoverEdgeIndex != -1) {
            // The last clicked located the active tile and active edge.
            //    -> we can safely add the adjacent tile here
            addPreviewTile(false);
            // Clear selected tile/edge after adding
            hoverTileIndex = -1;
            hoverEdgeIndex = -1;
            pb.redraw();
          } else {
            // Active
            console.log("e.params.pos", e.params.pos);
            handleMouseMove(relPos);
          }
        } else if (hoverTileIndex != -1 && hoverEdgeIndex != -1 && previewTilePointer < previewTiles.length) {
          // Desktop mode: just add.
          addPreviewTile(true);
        }
      });

    // +---------------------------------------------------------------------------------
    // | Add a key listener.
    // +-------------------------------
    var keyHandler = new KeyHandler({ trackAll: true })
      .down("q", function () {
        handleTurnTile(-1);
      })
      .down("e", function () {
        handleTurnTile(1);
      })
      .down("uparrow", function (e) {
        handleMoveTile(0, -1);
      })
      .down("leftarrow", function (e) {
        handleMoveTile(-1, 0);
      })
      .down("downarrow", function (e) {
        handleMoveTile(0, 1);
      })
      .down("rightarrow", function (e) {
        handleMoveTile(1, 0);
      })
      .down("o", function () {
        config.drawOutlines = !config.drawOutlines;
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
        previewTilePointer = (previewTilePointer + 1) % previewTiles.length;
        highlightPreviewTile(previewTilePointer, pb);
        if ((hoverTileIndex != -1) & (hoverEdgeIndex != -1)) {
          findPreviewIntersections();
          pb.redraw();
        }
      })
      .down("a", function () {
        previewTilePointer--;
        if (previewTilePointer < 0) previewTilePointer = previewTiles.length - 1;
        highlightPreviewTile(previewTilePointer, pb);
        if (hoverTileIndex != -1 && hoverEdgeIndex != -1) {
          findPreviewIntersections();
          pb.redraw();
        }
      })
      .down("enter", function () {
        if (previewTilePointer < previewTiles.length) {
          // addTile( previewTiles[previewTilePointer].clone() );
          // pb.redraw();
          addPreviewTile(true);
        }
      })
      .down("delete", function () {
        console.log("delete");
        handleDeleteTile();
      });
    // +---------------------------------------------------------------------------------
    // | @param {XYCoords} relPos
    // +-------------------------------
    var handleMouseMove = function (relPos) {
      var hoverTileAndEdgeIndex = girih.locateContainingTileAndEdge(relPos);
      if (hoverTileAndEdgeIndex) {
        if (hoverTileIndex == hoverTileAndEdgeIndex.tileIndex && hoverEdgeIndex == hoverTileAndEdgeIndex.edgeIndex) {
          return; // Nochange
        }
        hoverTileIndex = hoverTileAndEdgeIndex.tileIndex;
        hoverEdgeIndex = hoverTileAndEdgeIndex.edgeIndex;
        // previewTiles = girih.findPossibleAdjacentTiles(hoverTileIndex, hoverEdgeIndex);
        // // Set pointer to save range
        previewTilePointer = Math.min(Math.max(previewTiles.length - 1, previewTilePointer), previewTilePointer);
        // // Find any intersections for the new preview tile
        // findPreviewIntersections();
      } else {
        hoverTileIndex = -1;
        hoverEdgeIndex = -1;
        // previewTilePointer = 0;
      }

      handleActiveHoverIndices();
      pb.redraw();
      // if (previewTiles.length != 0) {
      //   createAdjacentTilePreview(previewTiles, previewTilePointer, setPreviewTilePointer, pb, {
      //     isMobile: detectMobileMode(params)
      //   });
      // }
    };

    var handleActiveHoverIndices = function () {
      previewTiles = girih.findPossibleAdjacentTiles(hoverTileIndex, hoverEdgeIndex);
      // Set pointer to save range
      // previewTilePointer = Math.min(Math.max(previewTiles.length - 1, previewTilePointer), previewTilePointer);
      // Find any intersections for the new preview tile
      findPreviewIntersections();
      if (previewTiles.length != 0) {
        createAdjacentTilePreview(previewTiles, previewTilePointer, setPreviewTilePointer, pb, {
          isMobile: detectMobileMode(params)
        });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Find all intersections of the Girih tiles and the
    // | currently selected preview polygon.
    // |
    // | Following global vars will be updated:
    // |  * previewIntersectionPolygons
    // |  * previewIntersectionAreas
    // +-------------------------------
    var findPreviewIntersections = function () {
      previewIntersectionPolygons = [];
      previewIntersectionAreas = [];
      if (hoverTileIndex == -1 || hoverEdgeIndex == -1 || previewTilePointer < 0 || previewTilePointer >= previewTiles.length) {
        stats.intersectionArea = 0.0;
        return;
      }
      var totalArea = 0.0;
      var currentPreviewTile = previewTiles[previewTilePointer];
      for (var i = 0; i < girih.tiles.length; i++) {
        if (i == hoverTileIndex) continue;
        var intersections = findPreviewIntersectionsFor(currentPreviewTile, girih.tiles[i]);
        for (var j = 0; j < intersections.length; j++) {
          var poly = new Polygon(cloneVertexArray(intersections[j]), false);
          var area = poly.area();
          previewIntersectionAreas.push(area);
          previewIntersectionPolygons.push(poly);
          totalArea += area;
        }
      }
      stats.intersectionArea = totalArea;
    };

    // +---------------------------------------------------------------------------------
    // | Find the polygon intersections for the given preview tile and
    // | girih tile.
    // |
    // | @param {Polygon} previewTile - The tile you want to place.
    // | @param {Polygon} girihTile - The tile currently on the canvas.
    // | @return {Vertex[][]} A set of intersection polygons.
    // +-------------------------------
    var findPreviewIntersectionsFor = function (previewTile, girihTile) {
      // Check if there are intersec
      var intersection = greinerHormann.intersection(
        // This is a workaround about a colinearity problem with greiner-hormann:
        // ... add some random jitter.
        addPolygonJitter(cloneVertexArray(girihTile.vertices), 0.0001), // Source
        addPolygonJitter(cloneVertexArray(previewTile.vertices), 0.0001) // Clip
      );
      if (!intersection) {
        return [];
      }

      // Only one single polygon returned?
      if (typeof intersection[0][0] === "number") intersection = [intersection];

      // Calculate size or triangulation here?
      return intersection;
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
          girih.replaceTiles(jsonObject);
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
    textureImage = loadTextureImage(config.texturePath, function () {
      console.log("Texture loaded");
      pb.redraw();
    });

    var imagePath = null;
    function handleTextureChange() {
      imagePath = config.texturePath;
      console.log("handleChange", imagePath);
      // Load texture image
      textureImage = loadTextureImage(imagePath, function () {
        console.log("Texture loaded");
        pb.redraw();
      });
      pb.redraw();
    }

    // Install DnD
    var fileDrop = new FileDrop(pb.eventCatcher);
    fileDrop.onFileJSONDropped(function (jsonObject) {
      var loadedGirihTiles = girihFromJSON(jsonObject);
      girih.replaceTiles(loadedGirihTiles);
      pb.redraw();
    });

    var stats = {
      intersectionArea: 0.0
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
      foldGirihDrawSettings.close();

      var foldImport = gui.addFolder("Import");
      foldImport.add(config, "importFile").name("Import JSON file");

      // Add to internal dat.gui folder (exists as enableSVGExport=true)
      var exportFolder = globalThis.utils.guiFolders["editor_settings.export"];
      exportFolder.add(config, "exportFile").name("Export JSON file");

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("intersectionArea").precision(3).suffix(" spx");
    }

    initTiles();
    pb.config.preDraw = drawAll;
    var container = document.querySelector(".wrapper-bottom");
    // Apply canvas background color (this respects the darkmode in this component)
    container.style["background-color"] = pb.config.backgroundColor;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
