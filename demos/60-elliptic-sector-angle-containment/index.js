/**
 * A script to demonstrate how to find containted angles in elliptic sectors with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 * @author   Ikaros Kappler
 * @date     2025-04-07
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  window.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);
    var params = new Params(GUP);
    var RAD_TO_DEG = 180 / Math.PI;

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
    pb.drawConfig.ellipse.lineWidth = 1;
    pb.drawConfig.ellipse.color = "rgba(32,192,192,0.5)";
    pb.drawConfig.ellipseSector.lineWidth = 3;
    pb.drawConfig.ellipseSector.color = "rgba(255,0,255,0.333)";

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        numEllipses: params.getNumber("numEllipses", 1),
        drawEllipse: params.getBoolean("drawEllipse", true),
        drawEllipseNumbers: params.getBoolean("drawEllipseNumbers", true),
        readme: function () {
          globalThis.displayDemoMeta();
        }
      },
      GUP
    );

    var ellipseSectors = [];
    var ellipseSectorHelpers = [];
    var anglePoint = pb.viewport().randomPoint(0.35, 0.35);

    var installEllipseSectorHelpers = function () {
      // First: uninstall old listeners
      ellipseSectorHelpers.forEach(function (eshelper) {
        eshelper.destroy();
      });
      // Install a circle helper: change radius via a second control point.
      for (var i = 0; i < ellipseSectors.length; i++) {
        var ellipseSector = ellipseSectors[i];
        // Add the sector to your canvas
        pb.add(ellipseSector);

        // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
        var controlPointA = ellipseSector.ellipse.vertAt(ellipseSector.startAngle);
        var controlPointB = ellipseSector.ellipse.vertAt(ellipseSector.endAngle);
        // var rotationControlPoint = ellipseSector.
        var rotationControlPoint = ellipseSector.ellipse
          // .vertAt(ellipseSector.ellipse.rotation)
          .vertAt(0)
          .scale(1.2, ellipseSector.ellipse.center);
        var csHelper = new VEllipseSectorHelper(ellipseSector, controlPointA, controlPointB, rotationControlPoint);
        ellipseSectorHelpers.push(csHelper);
        pb.add([controlPointA, controlPointB, rotationControlPoint]);
      }
    };

    var reinit = function () {
      var viewport = pb.viewport();
      arrayResize(ellipseSectors, config.numEllipses, function () {
        return randomEllipseSector(viewport);
      });
      pb.removeAll();
      installEllipseSectorHelpers();
      pb.add(anglePoint);
    };

    var init = function () {
      reinit();
    };

    // +---------------------------------------------------------------------------------
    // | For drawing circle labels.
    // +-------------------------------
    var drawEllipseLabels = function (_draw, fill, contrastColor) {
      for (var i = 0; i < ellipseSectors.length; i++) {
        const vert = ellipseSectors[i].ellipse.center;
        // TODO: use contrast color here
        fill.text("[" + i + "][" + ellipseSectors[i].uid + "]", vert.x, vert.y, {
          color: contrastColor,
          fontFamily: "Arial",
          fontSize: 9
        });
      }
    };

    // +---------------------------------------------------------------------------------
    // | For drawing circle labels.
    // +-------------------------------
    var drawAnglePointInfo = function (draw, fill) {
      for (var i = 0; i < ellipseSectors.length; i++) {
        const sector = ellipseSectors[i];
        var angleInEllipseSector = sector.ellipse.center.angle(anglePoint) - sector.ellipse.rotation;
        var pointOnEllipse = sector.ellipse.vertAt(angleInEllipseSector);
        var color = sector.containsAngle(angleInEllipseSector) ? "green" : "red";
        draw.line(sector.ellipse.center, pointOnEllipse, color, 1);
        draw.diamondHandle(pointOnEllipse, 7, color);

        // Draw n test angles
        for (var i = 0; i < 24; i++) {
          var vertAngle = Math.PI * 2 * (i / 24);
          var sectorVertex = sector.ellipse.vertAt(vertAngle).scale(0.9, sector.ellipse.center);
          // draw.diamondHandle(sectorVertex, 7, "orange");
          var containedInSector = sector.containsAngle(vertAngle);
          // console.log("Angle ", i, "vertAngle", vertAngle, "containedInSector", containedInSector);
          draw.diamondHandle(sectorVertex, 7, containedInSector ? "green" : "orange");
        }
        // var vertices = sector.ellipse.getEquidistantVertices(24);
        // for (var i = 0; i < vertices.length; i++) {
        //   var vertAngle = new Line(sector.ellipse.center.clone(), vertices[i]).angle();
        //   var containedInSector = sector.containsAngle(vertAngle);
        //   // console.log("Angle ", i, "vertAngle", vertAngle, "containedInSector", containedInSector);
        //   draw.diamondHandle(vertices[i].clone().scale(0.9, sector.ellipse.center), 7, containedInSector ? "green" : "orange");
        // }
      }
    };

    // +---------------------------------------------------------------------------------
    // | For drawing angle labels.
    // +-------------------------------
    var drawAngleLabels = function (draw, fill, contrastColor) {
      for (var i in ellipseSectors) {
        var sector = ellipseSectors[i];
        draw.line(anglePoint, sector.ellipse.center, "rgba(192,192,192,0.5)", 1, { dashOffset: 0, dashArray: [5, 4] });
        var controlPointA = sector.ellipse.vertAt(sector.startAngle);
        var controlPointB = sector.ellipse.vertAt(sector.endAngle);
        draw.line(sector.ellipse.center, controlPointA, "rgba(128,128,128,0.5)", 2.0);
        draw.line(sector.ellipse.center, controlPointB, "rgba(128,128,128,0.5)", 2.0);
        // prettier-ignore
        fill.text("" + (sector.startAngle*RAD_TO_DEG).toFixed(1) + "°", controlPointA.x, controlPointA.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });
        // prettier-ignore
        fill.text("" + (sector.endAngle*RAD_TO_DEG).toFixed(1) + "°", controlPointB.x, controlPointB.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      fill.text("<Move me>", anglePoint.x, anglePoint.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });

      if (config.drawEllipseNumbers) {
        drawEllipseLabels(draw, fill, contrastColor);
      }

      drawAngleLabels(draw, fill, contrastColor);
      drawAnglePointInfo(draw, fill);
      // drawSectorIntersections(draw, fill);

      // Draw helper(s)
      ellipseSectorHelpers.forEach(function (helper) {
        helper.drawHandleLines(draw, fill);
      });
    }; // END redraw

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "numEllipses").min(1).max(10).step(1).onChange( function() { reinit(); pb.redraw(); } ).name('numEllipses').title("Number of ellipses.");
      // prettier-ignore
      gui.add(config, "drawEllipseNumbers").onChange( function() { pb.redraw(); } ).name('drawEllipseNumbers').title("Draw ellipse numbers?");
      // prettier-ignore
      gui.add(config, "readme").name('readme').title("Display this demo's readme.");
    }

    pb.config.postDraw = redraw;
    init();
    pb.redraw();
  });
})(window);
