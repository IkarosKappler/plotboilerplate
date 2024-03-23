/**
 * A script to demonstrate how to construct 2D metaballs with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2024-02-06
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
          enableSVGExport: true
        },
        GUP
      )
    );
    pb.drawConfig.circle.lineWidth = 1;
    pb.drawConfig.circle.color = "rgba(32,192,192,0.5)";
    pb.drawConfig.circleSector.lineWidth = 3;
    pb.drawConfig.circleSector.color = "rgba(255,64,0,0.333)";

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        numCircles: params.getNumber("numCircles", 2),
        metaRadiusAddon: params.getNumber("metaRadiusAddon", 40),
        drawCircles: params.getBoolean("drawCircles", true),
        drawCircleNumbers: params.getBoolean("drawCircleNumber", true),
        drawContainingCircles: params.getBoolean("drawContainingCircle", true),
        drawInverseCircles: params.getBoolean("drawInverseCircles", true),
        drawOuterHull: params.getBoolean("drawOuterHull", true)
      },
      GUP
    );

    // var inputCircles = [];
    var circleHelpers = [];
    var metaballs = new Metaballs([]);

    var rebuildMetaballs = function () {
      metaballs.rebuild({ metaRadiusAddon: config.metaRadiusAddon });
    };

    // +---------------------------------------------------------------------------------
    // | Generate a random circle.
    // +-------------------------------
    var getRandomCircle = function () {
      var vp = pb.viewport();
      var circle = new Circle(vp.randomPoint(0.35, 0.35), (Math.random() * Math.min(vp.width, vp.height)) / 5);
      return circle;
    };

    var installCircleHelpers = function () {
      // First: uninstall old listeners
      circleHelpers.forEach(function (chelper) {
        chelper.destroy();
      });
      circleHelpers = [];
      // Install a circle helper: change radius via a second control point.
      for (var i = 0; i < metaballs.inputCircles.length; i++) {
        var circle = metaballs.inputCircles[i];
        var radiusPoint = circle.vertAt(Math.PI * 1.75);
        pb.add(radiusPoint);
        circleHelpers.push(new CircleHelper(circle, radiusPoint));
        radiusPoint.listeners.addDragListener(function (_evt) {
          rebuildMetaballs();
        });
      }
    };

    var reinit = function () {
      arrayResize(metaballs.inputCircles, config.numCircles, getRandomCircle);
      rebuildMetaballs();
      // Install move listeners
      for (var i = 0; i < metaballs.inputCircles.length; i++) {
        metaballs.inputCircles[i].center.listeners.addDragListener(function (e) {
          rebuildMetaballs();
        });
      }

      pb.removeAll();
      installCircleHelpers();
      pb.add(metaballs.inputCircles);
    };

    var init = function () {
      reinit();
    };

    // TODO: global function?
    var cloneCircle = function (circle) {
      return new Circle(circle.center.clone(), circle.radius);
    };

    // TODO: global function?
    var cloneCircleSector = function (circleSector) {
      return new CircleSector(cloneCircle(circleSector.circle), circleSector.startAngle, circleSector.endAngle);
    };

    var drawCircleLabels = function (draw, fill) {
      for (var i = 0; i < metaballs.circlesOfInterest.length; i++) {
        const vert = metaballs.circlesOfInterest[i].center;
        // TODO: use contrast color here
        fill.text("" + i, vert.x, vert.y, { color: "white", fontFamily: "Arial", fontSize: 9 });
      }
    };

    // // +---------------------------------------------------------------------------------
    // // | A hole can be found this way: a group of inverse circles with mutually contained centers.
    // // +-------------------------------
    // var detectHoles = function (circles) {
    //   var n = circles.length;
    //   console.log("circles", circles);
    //   // var isInverseCircleVisited = arrayFill(n, false); // Array<number>
    //   var visitedCount = 0;
    //   var nonVisitedSet = new Set();
    //   var holeGroups = []; // Array<number[]>
    //   for (var i = 0; i < n; i++) {
    //     nonVisitedSet.add(i);
    //   }
    //   var iteration = 0;
    //   while (visitedCount < n && iteration++ < n * n) {
    //     var curIndex = Array.from(nonVisitedSet)[Math.floor(Math.random() * nonVisitedSet.size)];
    //     var holeGroupIndices = detectHoleGroup(circles, nonVisitedSet, curIndex);
    //     visitedCount += holeGroupIndices.length;
    //     holeGroups.push(holeGroupIndices);
    //   }
    //   return holeGroups;
    // };

    // var detectHoleGroup = function (circles, nonVisitedSet, index) {
    //   var holeGroupIndices = [index];
    //   // Mark as visited
    //   nonVisitedSet.delete(index);
    //   for (var i = 0; i < circles.length; i++) {
    //     if (!nonVisitedSet.has(i)) {
    //       // Already visited
    //       continue;
    //     }
    //     // Circles mutually contain their centers?
    //     var circleA = circles[index];
    //     var circleB = circles[i];
    //     if (circleA.containsPoint(circleB.center) && circleB.containsPoint(circleA.center)) {
    //       holeGroupIndices.push(i);
    //       nonVisitedSet.delete(i);
    //     }
    //   }
    //   return holeGroupIndices;
    // };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      if (config.drawCircleNumbers) {
        drawCircleLabels(draw, fill);
      }

      // Draw outer containing circles?
      if (config.drawContainingCircles) {
        for (var i = 0; i < metaballs.containingCircles.length; i++) {
          // var metaball = new Circle(circles[i].center, circles[i].radius * config.metalballFactor);
          // var metaball = new Circle(circles[i].center, circles[i].radius + config.metaRadiusAddon);
          var metaball = metaballs.containingCircles[i];

          // dashOffset?: number;
          // dashArray?: Array<number>;
          draw.circle(metaball.center, metaball.radius, "grey", 1.0, { dashOffset: 0, dashArray: [5, 4] });
        }
      }

      // Draw circles at intersection points (inverse circles)
      if (config.drawInverseCircles) {
        for (var i = 0; i < metaballs.inverseCirclesPairs.length; i++) {
          var circlePair = metaballs.inverseCirclesPairs[i];
          var color = circlePair.doIntersect ? "rgba(192,192,192,0.333)" : "rgba(255,192,0,0.5)";
          var lineWidth = circlePair.doIntersect ? 1.0 : 2.0;
          draw.circle(circlePair.inverseCircleA.center, circlePair.inverseCircleA.radius, color, lineWidth);
          draw.circle(circlePair.inverseCircleB.center, circlePair.inverseCircleB.radius, color, lineWidth);

          // And draw intersection points
          draw.diamondHandle(circlePair.circlePointsA[0], 5, "red");
          draw.diamondHandle(circlePair.circlePointsA[1], 5, "red");
          draw.diamondHandle(circlePair.circlePointsB[0], 5, "red");
          draw.diamondHandle(circlePair.circlePointsB[1], 5, "red");
        }
      }

      // Draw partial arcs.

      // Find intersections, radical lines and interval
      var innerCircleIndices = CircleIntersections.findInnerCircles(metaballs.containingCircles);
      var radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(metaballs.containingCircles);
      var intervalSets = CircleIntersections.findOuterCircleIntervals(metaballs.containingCircles, radicalLineMatrix);
      // Array<Array<CircleSector>>
      var outerPathListSectors = CircleIntersections.findOuterPartitionsAsSectors(metaballs.containingCircles, intervalSets);

      // Draw connected paths?
      if (config.drawOuterHull) {
        var iteration = 0;
        for (var i = 0; i < outerPathListSectors.length; i++) {
          drawConnectedPath(
            draw,
            fill,
            outerPathListSectors[i],
            pb.drawConfig.circleSector.color,
            pb.drawConfig.circleSector.lineWidth
          ); //iteration, i);
        }
      }

      // Array<Array<CircleSector>>
      // Note: These path sectors are NOT CONNECTED with each others any more.
      var innerPathListSectors = outerPathListSectors.map(function (sectorList) {
        return sectorList.map(function (outerSector) {
          var innerSector = cloneCircleSector(outerSector);
          // Scale down to original radius
          innerSector.circle.radius -= config.metaRadiusAddon;
          return innerSector;
        });
      });

      console.log(
        "outerPathListSectors.length",
        outerPathListSectors.length,
        "innerPathListSectors.length",
        innerPathListSectors.length,
        "metaballs.circlesOfInterest.length",
        metaballs.circlesOfInterest.length
      );

      // Draw circle sectors that need to be kept
      for (var i = 0; i < innerPathListSectors.length; i++) {
        for (var j = 0; j < innerPathListSectors[i].length; j++) {
          // console.log(i, j, innerPathListSectors[i][j], outerPathListSectors[i][j]);
          var tmpSect = innerPathListSectors[i][j];
          var sectorStart = tmpSect.getStartPoint();
          var sectorEnd = tmpSect.getEndPoint();
          draw.diamondHandle(sectorStart, 10, "red");
          draw.diamondHandle(sectorEnd, 10, "red");

          // if (Metaballs.metaballsUtils.anyCircleContainsAllPoints(metaballs.circlesOfInterest, [sectorStart, sectorEnd], i)) {
          //   // Do not draw sectors that are fully contained inside any other circle
          //   continue;
          // }
          draw.circleArc(
            tmpSect.circle.center,
            tmpSect.circle.radius,
            tmpSect.startAngle,
            tmpSect.endAngle,
            "rgba(0,255,0,0.333)",
            7
          );
        }
      } // END for

      // Draw inverse circle sectors.
      // Array< { circleA, circleB, inverseCircleA, inverseCircleB, doIntersect, circlePointsA:[], circlePointsB:[] } >
      for (var i = 0; i < metaballs.inverseCirclesPairs.length; i++) {
        var pair = metaballs.inverseCirclesPairs[i];
        // if (pair.doIntersect && !pair.circleB.containsPoint(pair.circleA.center)) {
        //   continue;
        // }
        if (!pair.doIntersect || pair.circleB.containsPoint(pair.circleA.center)) {
          // TODO: do not only draw, also collect for connected path detection
          // Step 1: draw inverse circle arcs (these two connect circleA and circleB)
          drawInverseCircleArcs(draw, fill, pair);
        }

        // Step 2: draw rest of original circles if intersection is not enough for meta connection.
        if (pair.doIntersect && !pair.circleB.containsPoint(pair.circleA.center)) {
          drawInvserseCircleArc(draw, fill, pair.baseCircleA, pair.circlePointsA[1], pair.circlePointsA[0]);
          drawInvserseCircleArc(draw, fill, pair.baseCircleB, pair.circlePointsB[0], pair.circlePointsB[1]);
        }

        // Detect ...
        // if (Metaballs.metaballsUtils.anyCircleContainsPoint(metaballs.circlesOfInterest, pair.inverseCircleA, -1)) {
        //   // Do not draw sectors that are fully contained inside any other circle
        //   fill.circleArc(
        //     pair.inverseCircleA.center,
        //     pair.inverseCircleA.radius,
        //     tmpSect.startAngle,
        //     tmpSect.endAngle,
        //     "rgba(255,255,0,0.133)",
        //     7
        //   );
        // }
      } // END for
    }; // END redraw

    var drawInverseCircleArcs = function (draw, fill, circlePair) {
      drawInvserseCircleArc(draw, fill, circlePair.inverseCircleA, circlePair.circlePointsA[0], circlePair.circlePointsB[0]);
      drawInvserseCircleArc(draw, fill, circlePair.inverseCircleB, circlePair.circlePointsB[1], circlePair.circlePointsA[1]);
    };

    var drawInvserseCircleArc = function (draw, fill, inverseCircle, intersectionPoint0, intersectionPoint1) {
      var angleDifference = -Math.PI;
      var intersectionAngleA0 = intersectionPoint0.angle(inverseCircle.center) + angleDifference;
      var intersectionAngleB0 = intersectionPoint1.angle(inverseCircle.center) + angleDifference;
      draw.circleArc(
        inverseCircle.center,
        inverseCircle.radius,
        intersectionAngleB0,
        intersectionAngleA0,
        "rgba(0,255,0,0.333)",
        7
      );

      // TEST: fill suspicious arcs ...
      if (
        Metaballs.metaballsUtils.anyCircleContainsPoint(metaballs.circlesOfInterest, inverseCircle.center, -1) ||
        Metaballs.metaballsUtils.anyCircleContainsPoint(metaballs.circlesOfInterest, inverseCircle.center, -1)
      ) {
        fill.circleArc(
          inverseCircle.center,
          inverseCircle.radius,
          intersectionAngleB0,
          intersectionAngleA0,
          "rgba(255,255,0,0.133)"
        );
      }
    };

    // ===ZZZ START

    // +---------------------------------------------------------------------------------
    // | This is kind of a hack to draw connected arc paths (which is currently not directly
    // | supported by the `draw` library).
    // |
    // | The function switches between canvas.ellipse draw or SVG path draw.
    // |
    // | @param {CircleSector[]} path
    // | @param {number} iteration
    // | @param {number} pathNumber
    // +-------------------------------
    var drawConnectedPath = function (draw, fill, path, color, lineWidth) {
      // This might be optimized
      if (config.drawAsSVGArcs || draw instanceof drawutilssvg) drawConnectedPathAsSVGArcs(draw, fill, path, color, lineWidth);
      else drawConnectedPathAsEllipses(path, color, lineWidth, config.fillNestedCircles ? fill : draw);
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given path as ellipses (using canvs.ellipse function).
    // |
    // | @param {CircleSector[]} path
    // | @param {string} color
    // | @param {drawutils} draw
    // +-------------------------------
    var drawConnectedPathAsEllipses = function (path, color, lineWidth, draw) {
      draw.ctx.save();
      draw.ctx.beginPath();
      for (var i = 0; i < path.length; i++) {
        var sector = path[i];
        draw.circleArc(sector.circle.center, sector.circle.radius, sector.startAngle, sector.endAngle, color, config.lineWidth, {
          asSegment: true
        });
      }
      draw.ctx.closePath();
      draw.ctx.lineWidth = lineWidth;
      draw.ctx.lineJoin = config.lineJoin;
      draw._fillOrDraw(color);
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given path as ellipses (using canvs.ellipse function).
    // |
    // | @param {CircleSector[]} path
    // | @param {string} color
    // | @param {drawutils} draw
    // +-------------------------------
    var drawConnectedPathAsSVGArcs = function (draw, fill, path, color, lineWidth) {
      var svgData = pathToSVGData(path, { x: 0, y: 0 }, { x: 1, y: 1 });
      if (draw.ctx) draw.ctx.lineJoin = config.lineJoin;
      if (config.fillNestedCircles) {
        fill.path(svgData, color, lineWidth);
      } else {
        draw.path(svgData, color, lineWidth);
      }
    };
    // ===ZZZ END

    // +---------------------------------------------------------------------------------
    // | Changes the color of the original circles from transparent to opaque depending
    // | on selected visibility.
    // +-------------------------------
    var toggleCircleVisibility = function () {
      if (config.drawCircles) {
        pb.drawConfig.circle.color = "#22a8a8";
      } else {
        pb.drawConfig.circle.color = "rgba(0,0,0,0)";
      }
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "numCircles").min(1).max(10).step(1).onChange( function() { reinit(); rebuildMetaballs(); pb.redraw(); } ).name('numCircles').title("Number of circles.");
      // prettier-ignore
      gui.add(config, "metaRadiusAddon").min(0).max(100).step(1).onChange(function () {
        rebuildContainingCircles();
        rebuildMetaballs();
        pb.redraw();
      }).name("metaRadiusAddon").title("The metaball connection factor.");
      // prettier-ignore
      gui.add(config, "drawCircles").onChange( function() { toggleCircleVisibility(); pb.redraw(); } ).name('drawCircles').title("Draw circles?");
      // prettier-ignore
      gui.add(config, "drawContainingCircles").onChange( function() { pb.redraw(); } ).name('drawContainingCircles').title("Draw containing circles?");
      // prettier-ignore
      gui.add(config, "drawInverseCircles").onChange( function() { pb.redraw(); } ).name('drawInverseCircles').title("Draw inverse circles at intersection points?");
      // prettier-ignore
      gui.add(config, "drawCircleNumbers").onChange( function() { pb.redraw(); } ).name('drawCircleNumbers').title("Draw circle numbers?");
      // prettier-ignore
      gui.add(config, "drawOuterHull").onChange( function() { pb.redraw(); } ).name('drawOuterHull').title("Draw outer hull?");
    }

    pb.config.postDraw = redraw;
    init();
    rebuildMetaballs();
    pb.redraw();
  });
})(window);
