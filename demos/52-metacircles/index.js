/**
 * A script to demonstrate how to construct irregular Reuleaux polygons with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires three.js
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
    // globalThis.pb = pb;
    pb.drawConfig.circleSector.lineWidth = 3;
    pb.drawConfig.circleSector.color = "rgba(255,64,0,0.75)";

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

    var circles = [];
    var containingCircles = [];
    // Array< { circleA, circleB, outerCircleA, outerCircleB, doIntersect, circlePointsA:[], circlePointsB:[] } >
    var inverseCirclesPairs = [];

    var rebuildMetaballs = function () {
      inverseCirclesPairs = [];

      var radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(containingCircles);
      for (var i = 0; i < containingCircles.length; i++) {
        var circleA = containingCircles[i];
        var centerCircleA = circles[i];
        for (var j = i + 1; j < containingCircles.length; j++) {
          var radicalLine = radicalLineMatrix[i][j];
          if (radicalLine == null) {
            // The two circles do not have an intersection.
            // console.log("Circles", i, j, "do not have any intersections");
            continue;
          }
          var circleB = containingCircles[j];
          var centerCircleB = circles[j];
          // But if they have -> compute. outer circle(s).
          // They are symmetrical.
          var outerCircle1 = new Circle(radicalLine.a, config.metaRadiusAddon);
          var outerCircle2 = new Circle(radicalLine.b, config.metaRadiusAddon);
          var doIntersect = outerCircle1.circleIntersection(outerCircle2) != null;
          // console.log("doIntersect", doIntersect);
          // Now find the intersection points between inner and outer circles.
          // We will need them later.
          var circlePointsA = [centerCircleA.closestPoint(outerCircle1.center), centerCircleA.closestPoint(outerCircle2.center)];
          var circlePointsB = [centerCircleB.closestPoint(outerCircle1.center), centerCircleB.closestPoint(outerCircle2.center)];

          inverseCirclesPairs.push({
            baseCircleIndexA: i,
            baseCircleIndexB: j,
            circleA: circleA,
            outerCircleA: outerCircle1,
            circleB: circleB,
            outerCircleB: outerCircle2,
            doIntersect: doIntersect,
            circlePointsA: circlePointsA,
            circlePointsB: circlePointsB
          });
        }
      }
    };

    var rebuildContainingCircles = function () {
      containingCircles = [];
      for (var i = 0; i < config.numCircles; i++) {
        var metaball = new Circle(circles[i].center, circles[i].radius + config.metaRadiusAddon);
        containingCircles.push(metaball);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Generate a random circle.
    // +-------------------------------
    var getRandomCircle = function () {
      var vp = pb.viewport();
      var circle = new Circle(vp.randomPoint(0.35, 0.35), (Math.random() * Math.min(vp.width, vp.height)) / 5);
      // circles.push(circle);

      // Install a circle helper: change radius via a second control point.
      var radiusPoint = circle.vertAt(Math.PI * 1.75);
      pb.add(radiusPoint);
      new CircleHelper(circle, radiusPoint, pb);
      radiusPoint.listeners.addDragListener(function (e) {
        rebuildContainingCircles();
        rebuildMetaballs();
      });
      return circle;
    };

    var reinit = function () {
      pb.removeAll();
      arrayResize(circles, config.numCircles, getRandomCircle);
      pb.add(circles);
      // Install move listeners
      for (var i = 0; i < config.numCircles; i++) {
        circles[i].center.listeners.addDragListener(function (e) {
          rebuildMetaballs();
        });
      }

      rebuildContainingCircles();
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
      for (var i = 0; i < circles.length; i++) {
        const vert = circles[i].center;
        fill.text("" + i, vert.x, vert.y, { color: "white", fontFamily: "Arial", fontSize: 9 });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      if (config.drawCircleNumbers) {
        drawCircleLabels(draw, fill);
      }

      // Draw outer containing circles?
      if (config.drawContainingCircles) {
        for (var i = 0; i < containingCircles.length; i++) {
          // var metaball = new Circle(circles[i].center, circles[i].radius * config.metalballFactor);
          // var metaball = new Circle(circles[i].center, circles[i].radius + config.metaRadiusAddon);
          var metaball = containingCircles[i];

          // dashOffset?: number;
          // dashArray?: Array<number>;
          draw.circle(metaball.center, metaball.radius, "grey", 1.0, { dashOffset: 0, dashArray: [5, 4] });
        }
      }

      // Draw circles at intersection points (inverse circles)
      if (config.drawInverseCircles) {
        for (var i = 0; i < inverseCirclesPairs.length; i++) {
          var circlePair = inverseCirclesPairs[i];
          var color = circlePair.doIntersect ? "rgba(192,192,192,0.5)" : "orange";
          var lineWidth = circlePair.doIntersect ? 1.0 : 2.0;
          draw.circle(circlePair.outerCircleA.center, circlePair.outerCircleA.radius, color, lineWidth);
          draw.circle(circlePair.outerCircleB.center, circlePair.outerCircleB.radius, color, lineWidth);

          // And draw intersection points
          draw.diamondHandle(circlePair.circlePointsA[0], 5, "red");
          draw.diamondHandle(circlePair.circlePointsA[1], 5, "red");
          draw.diamondHandle(circlePair.circlePointsB[0], 5, "red");
          draw.diamondHandle(circlePair.circlePointsB[1], 5, "red");
        }
      }

      // Draw partial arcs.
      // for (var i = 0; i < circles.length; i++) {
      //   var innerCircle = circles[i];
      //   // var outerCircle = containingCircles[i];
      //   // Collect all points on this circle
      // }

      // Find intersections, radical lines and interval
      var innerCircleIndices = CircleIntersections.findInnerCircles(containingCircles);
      var radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(containingCircles);
      var intervalSets = CircleIntersections.findOuterCircleIntervals(containingCircles, radicalLineMatrix);
      // Array<Array<CircleSector>>
      var outerPathListSectors = CircleIntersections.findOuterPartitionsAsSectors(containingCircles, intervalSets);

      // Draw connected paths?
      if (config.drawOuterHull) {
        var iteration = 0;
        for (var i = 0; i < outerPathListSectors.length; i++) {
          drawConnectedPath(draw, fill, outerPathListSectors[i], iteration, i);
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

      var iteration = 1;
      // Draw circle sectors that need to be kept
      for (var i = 0; i < innerPathListSectors.length; i++) {
        for (var j = 0; j < innerPathListSectors[i].length; j++) {
          // console.log(i, j, innerPathListSectors[i][j], outerPathListSectors[i][j]);
          const tmpSect = innerPathListSectors[i][j];
          draw.circleArc(
            tmpSect.circle.center,
            tmpSect.circle.radius,
            tmpSect.startAngle,
            tmpSect.endAngle,
            "rgba(0,255,0,0.333)",
            7
          );
        }
      }

      // Draw inverse circle sectors.
      // Array< { circleA, circleB, outerCircleA, outerCircleB, doIntersect, circlePointsA:[], circlePointsB:[] } >
      for (var i = 0; i < inverseCirclesPairs.length; i++) {
        var pair = inverseCirclesPairs[i];
        // if (pair.doIntersect && !pair.circleB.containsPoint(pair.circleA.center)) {
        //   continue;
        // }
        if (!pair.doIntersect || pair.circleB.containsPoint(pair.circleA.center)) {
          // TODO: do not only draw, also collect for connected path detection
          // Step 1: draw inverse circle arcs (these two connect circleA and circleB)
          drawInverseCircleArcs(draw, pair);
        }

        // Step 2: draw rest of original circles if intersection is not enough for meta connection.
        if (pair.doIntersect && !pair.circleB.containsPoint(pair.circleA.center)) {
          // drawInvserseCircleArc(draw, circlePair.outerCircleA, circlePair.circlePointsA[0], circlePair.circlePointsB[0]);
          // drawInvserseCircleArc(draw, circlePair.outerCircleB, circlePair.circlePointsB[1], circlePair.circlePointsA[1]);
          drawInvserseCircleArc(draw, circlePair.circleB, circlePair.circlePointsA[1], circlePair.circlePointsA[0]);
        }
      }
    };

    var drawInverseCircleArcs = function (draw, circlePair) {
      // var outerCircleA = cloneCircle(circlePair.outerCircleA);
      // var angleDifference = -Math.PI; // 0.0; // outerCircleA.center.angle(pair.circleA);
      // // var circleB = cloneCircle(pair.outerCircleA);
      // var intersectionAngleA0 = circlePair.circlePointsA[0].angle(outerCircleA.center) + angleDifference;
      // var intersectionAngleB0 = circlePair.circlePointsB[0].angle(outerCircleA.center) + angleDifference;

      // draw.circleArc(
      //   outerCircleA.center,
      //   outerCircleA.radius,
      //   intersectionAngleB0,
      //   intersectionAngleA0,
      //   "rgba(0,255,0,0.333)",
      //   7
      // );
      drawInvserseCircleArc(draw, circlePair.outerCircleA, circlePair.circlePointsA[0], circlePair.circlePointsB[0]);
      drawInvserseCircleArc(draw, circlePair.outerCircleB, circlePair.circlePointsB[1], circlePair.circlePointsA[1]);
    };

    var drawInvserseCircleArc = function (draw, outerCircle, intersectionPoint0, intersectionPoint1) {
      // var outerCircle = cloneCircle(pair.outerCircleA);
      var angleDifference = -Math.PI; // 0.0; // outerCircleA.center.angle(pair.circleA);
      // var circleB = cloneCircle(pair.outerCircleA);
      var intersectionAngleA0 = intersectionPoint0.angle(outerCircle.center) + angleDifference;
      var intersectionAngleB0 = intersectionPoint1.angle(outerCircle.center) + angleDifference;
      draw.circleArc(outerCircle.center, outerCircle.radius, intersectionAngleB0, intersectionAngleA0, "rgba(0,255,0,0.333)", 7);
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
    var drawConnectedPath = function (draw, fill, path, iteration, pathNumber) {
      var color = randomWebColor(iteration + pathNumber, null);

      // This might be optimized
      if (config.drawAsSVGArcs || draw instanceof drawutilssvg) drawConnectedPathAsSVGArcs(draw, fill, path, color);
      else drawConnectedPathAsEllipses(path, color, config.fillNestedCircles ? fill : draw);
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given path as ellipses (using canvs.ellipse function).
    // |
    // | @param {CircleSector[]} path
    // | @param {string} color
    // | @param {drawutils} draw
    // +-------------------------------
    var drawConnectedPathAsEllipses = function (path, color, draw) {
      draw.ctx.save();
      draw.ctx.beginPath();
      for (var i = 0; i < path.length; i++) {
        var sector = path[i];
        draw.circleArc(sector.circle.center, sector.circle.radius, sector.startAngle, sector.endAngle, color, config.lineWidth, {
          asSegment: true
        });
      }
      draw.ctx.closePath();
      draw.ctx.lineWidth = config.lineWidth;
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
    var drawConnectedPathAsSVGArcs = function (draw, fill, path, color) {
      var svgData = pathToSVGData(path, { x: 0, y: 0 }, { x: 1, y: 1 });
      if (draw.ctx) draw.ctx.lineJoin = config.lineJoin;
      if (config.fillNestedCircles) {
        fill.path(svgData, color, config.lineWidth);
      } else {
        draw.path(svgData, color, config.lineWidth);
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
