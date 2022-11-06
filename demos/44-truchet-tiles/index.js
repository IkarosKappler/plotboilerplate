/**
 * A script to demonstrate how to make truchet tiles.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-10-09
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);

    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("canvas"),
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

          enableSVGExport: true
        },
        GUP
      )
    );

    var randColor = function (i, alpha) {
      var color = WebColorsContrast[i % WebColorsContrast.length].clone();
      if (typeof alpha !== undefined) color.a = alpha;
      return color.cssRGBA();
    };

    var viewport = pb.viewport();

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        tileType: "Triangle2", // [ "Triangle2", "Square2", "Cairo2" ]
        drawSafeZone: false,
        safeZonePct: 0.1,
        countH: 10,
        countV: 10,
        clearTilesOnRedraw: true,
        drawLinearConnections: false,
        drawTruchetRaster: false,
        closePattern: true,
        drawPathLabels: false,
        fillAreas: false,
        longConnectionFactor: 1.0,
        shortConnectionFactor: 0.5 // default values depend on the selected tile type!
      },
      GUP
    );

    var prepareTileBuilder = function () {
      switch (config.tileType) {
        case "Square2":
          tileBuilder = SquareTileBuilder;
          config.longConnectionFactor = SquareTileBuilder.LONG_PATH_FACTOR; // 1.0;
          config.shortConnectionFactor = SquareTileBuilder.SHORT_PATH_FACTOR; // 0.555;
          break;
        case "Cairo2":
          tileBuilder = CairoTileBuilder;
          config.longConnectionFactor = CairoTileBuilder.LONG_PATH_FACTOR; // 1.3;
          config.shortConnectionFactor = CairoTileBuilder.SHORT_PATH_FACTOR; // 0.666;
          break;
        default: // "Triangle2"
          tileBuilder = TriangleTileBuilder;
          config.longConnectionFactor = TriangleTileBuilder.LONG_PATH_FACTOR;
          config.shortConnectionFactor = TriangleTileBuilder.SHORT_PATH_FACTOR;
          break;
      }
    };

    // Initialize this with the help of the config setting
    var tileBuilder = null;
    prepareTileBuilder();

    var tiles = [];
    var paths = [];

    var computeTiles = function () {
      if (config.clearTilesOnRedraw) {
        tiles = [];
      }
      var bounds = new Bounds(
        { x: viewport.min.x + viewport.width * config.safeZonePct, y: viewport.min.y + viewport.height * config.safeZonePct },
        {
          x: viewport.min.x + viewport.width * config.safeZonePct + viewport.width * (1 - 2 * config.safeZonePct),
          y: viewport.min.y + viewport.height * config.safeZonePct + viewport.height * (1 - 2 * config.safeZonePct)
        }
      );
      // var tileBuilder = getTileBuilder(config.tileType);
      tiles = tiles.concat(tileBuilder.computeTiles(bounds, config));

      // Collect all paths segments
      var pathSegments = [];
      for (var tileIndex in tiles) {
        var tile = tiles[tileIndex];
        for (var c in tile.connections) {
          var connection = tile.connections[c];
          pathSegments.push(connection.curveSegment);
        }
      }

      // Find connected paths
      paths = detectPaths(pathSegments, 5.0); // Which epsilon to use?
    };

    // +---------------------------------------------------------------------------------
    // | Draw our custom stuff after everything else in the scene was drawn.
    // +-------------------------------
    var redraw = function (draw, fill) {
      var bounds = new Bounds(
        { x: viewport.min.x + viewport.width * config.safeZonePct, y: viewport.min.y + viewport.height * config.safeZonePct },
        {
          x: viewport.min.x + viewport.width * config.safeZonePct + viewport.width * (1 - 2 * config.safeZonePct),
          y: viewport.min.y + viewport.height * config.safeZonePct + viewport.height * (1 - 2 * config.safeZonePct)
        }
      );
      if (config.drawSafeZone) {
        draw.rect(bounds.min, bounds.width, bounds.height, "orange", 1);
      }
      // var pathSegments = []; // Array<PathSegment>
      for (var tileIndex in tiles) {
        // console.log("tile", tile);
        var tile = tiles[tileIndex];
        if (config.drawTruchetRaster) {
          // console.log("outlinePolygon", tile.outlinePolygon);
          draw.polygon(tile.outlinePolygon, "rgba(0,255,0,0.5)", 1);
        }
        for (var c in tile.connections) {
          var connection = tile.connections[c];
          if (config.drawLinearConnections) {
            draw.line(connection.line.a, connection.line.b, "rgba(192,192,192,0.1)", 3);
          }
          // console.log("connection", connection);
          draw.cubicBezier(
            connection.curveSegment.startPoint,
            connection.curveSegment.endPoint,
            connection.curveSegment.startControlPoint,
            connection.curveSegment.endControlPoint,
            "rgba(192,0,192,0.75)",
            2
          );
          if (config.drawPathLabels) {
            fill.text("SP", connection.curveSegment.startPoint.x - 5, connection.curveSegment.startPoint.y - 1, {
              color: "rgba(128,128,128,0.5)"
            });
            fill.text("EP", connection.curveSegment.endPoint.x + 5, connection.curveSegment.endPoint.y + 1, {
              color: "rgba(128,0,128,0.5)"
            });
          }
          // pathSegments.push(connection.curveSegment);
        }
      }

      // // Find connected paths
      // var paths = detectPaths(pathSegments, 5.0); // Which epsilon to use?

      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var vertexData = cubicBezierPath2VertexArray(path);
        draw.cubicBezierPath(vertexData, randColor(i, 0.5), 2);
        if (config.fillAreas) {
          fill.cubicBezierPath(vertexData, randColor(i, 0.2), 2);
        }
      }
    };

    var cubicBezierPath2VertexArray = function (path) {
      if (path.getSegmentCount() === 0) {
        return [];
      }
      var result = [];
      result.push(path.getSegmentAt(0).startPoint);
      for (var i = 0; i < path.getSegmentCount(); i++) {
        var curve = path.getSegmentAt(i);
        result.push(curve.startControlPoint, curve.endControlPoint, curve.endPoint);
      }
      return result;
    };

    // Add a mouse listener to track the mouse position.
    new MouseHandler(pb.eventCatcher).move(function (event) {
      var relPos = pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
      stats.mouseXTop = relPos.x;
      stats.mouseYTop = relPos.y;
    });

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseXTop: 0,
      mouseYTop: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseXTop").precision(1);
    uiStats.add("mouseYTop").precision(1);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'tileType', [ "Triangle2", "Square2", "Cairo2" ]).listen().onChange(function() { prepareTileBuilder(); computeTiles(); pb.redraw() }).name("tileType").title("tileType");
      // prettier-ignore
      gui.add(config, 'drawSafeZone').listen().onChange(function() { pb.redraw() }).name("drawSafeZone").title("drawSafeZone");
      // prettier-ignore
      gui.add(config, 'safeZonePct').min(0.5).max(1.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("safeZonePct").title("safeZonePct");
      // prettier-ignore
      gui.add(config, 'countH').min(1).max(100).step(1).listen().onChange(function() { computeTiles(); pb.redraw() }).name("countH").title("countH");
      // prettier-ignore
      gui.add(config, 'countV').min(1).max(100).step(1).listen().onChange(function() { computeTiles(); pb.redraw() }).name("countV").title("countV");
      // prettier-ignore
      gui.add(config, 'clearTilesOnRedraw').listen().onChange(function() { pb.redraw() }).name("clearTilesOnRedraw").title("clearTilesOnRedraw");
      // prettier-ignore
      gui.add(config, 'drawLinearConnections').listen().onChange(function() { pb.redraw() }).name("drawLinearConnections").title("drawLinearConnections");
      // prettier-ignore
      gui.add(config, 'drawTruchetRaster').listen().onChange(function() { pb.redraw() }).name("drawTruchetRaster").title("drawTruchetRaster");
      // prettier-ignore
      gui.add(config, 'drawPathLabels').listen().onChange(function() { pb.redraw() }).name("drawPathLabels").title("drawPathLabels");
      // prettier-ignore
      gui.add(config, 'closePattern').listen().onChange(function() { computeTiles(); pb.redraw(); }).name("closePattern").title("closePattern");
      // prettier-ignore
      gui.add(config, 'fillAreas').listen().onChange(function() {  pb.redraw(); }).name("fillAreas").title("fillAreas");
      // prettier-ignore
      gui.add(config, 'longConnectionFactor').min(0.0).max(2.0).step(0.01).listen().onChange(function() { computeTiles(); pb.redraw(); }).name("longConnectionFactor").title("longConnectionFactor");
      // prettier-ignore
      gui.add(config, 'shortConnectionFactor').min(0.0).max(2.0).step(0.01).listen().onChange(function() { computeTiles(); pb.redraw(); }).name("shortConnectionFactor").title("shortConnectionFactor");
    }

    computeTiles();
    pb.config.postDraw = redraw;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
