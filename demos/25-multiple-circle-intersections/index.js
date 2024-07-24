/**
 * A script for finding the intersection points of two circles (the 'radical line').
 *
 * Here's a tiny article about how it's working:
 *    http://www.polygon-berlin.de/circle-section-math
 *
 *
 * The intersection outline can be drawn/filled in two ways:
 *  + canvas.ellipse(...)
 *  + SVG path (arc command)
 *
 *
 * Based on the C++ implementation by Robert King
 *    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 *    http://paulbourke.net/geometry/circlesphere/
 *
 *
 * Is actual implementation of the circle intersection algorithm is located at
 * ./src/ts/utils/algoriths/CircleIntersections.ts
 *
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 * @requires path2d-polyfill (IE only)
 *
 *
 * @author   Ikaros Kappler
 * @date     2020-10-05
 * @modified 2020-11-13 Fixed the drawing of sector lines.
 * @modified 2020-12-17 Added basic SVG export (experimental).
 * @modified 2024-02-09 Replacing the canvas/svg specific draw functions for arc by the new generic draw lib method.
 * @version  1.3.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
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

          enableSVGExport: true
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    // +---------------------------------------------------------------------------------
    // | Initialize n random circles and store them in the array.
    // +-------------------------------
    var numCircles = Math.max(1, PlotBoilerplate.utils.fetch.num(GUP, "numCircles", 7));
    var centerPoints = [];
    var radiusPoints = [];
    var circles = [];
    for (var i = 0; i < numCircles; i++) {
      var center = randomVertex();
      var randomRadius = Math.random() * pb.canvasSize.height * 0.25;
      var circle = new Circle(center, randomRadius);
      var radiusPoint = new Vertex(
        center.clone().addXY(circle.radius * Math.sin(Math.PI / 4), circle.radius * Math.cos(Math.PI / 4))
      );
      pb.add(radiusPoint);
      pb.add(circle.center);

      circles[i] = circle;
      centerPoints[i] = circle.center;
      radiusPoints[i] = radiusPoint;

      new CircleHelper(circle, radiusPoint, pb);
    }

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawAll = function (draw, fill) {
      if (circles.length == 0) return;
      var iteration = 0;
      var visibleCircles = drawCircleSet(draw, fill, circles, config.drawRadicalLines, iteration++);
      if (config.drawNestedCircles) {
        // Scale down visible circles
        while (visibleCircles.length > 0) {
          // Scale down
          var scaledCircles = [];
          for (var i = 0; i < visibleCircles.length; i++) {
            var scaledCircle = new Circle(visibleCircles[i].center, visibleCircles[i].radius - config.nestedCircleStep);
            if (scaledCircle.radius > 0) scaledCircles.push(scaledCircle);
          }
          visibleCircles = drawCircleSet(draw, fill, scaledCircles, false, iteration++);
          iteration++;
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the intersection outline(s) for the given circles.
    // +-------------------------------
    var drawCircleSet = function (draw, fill, circles, drawRadicalLines, iteration) {
      // Find intersections, radical lines and interval
      var innerCircleIndices = CircleIntersections.findInnerCircles(circles);
      var radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(circles);
      var intervalSets = CircleIntersections.findOuterCircleIntervals(circles, radicalLineMatrix);
      var pathListSectors = CircleIntersections.findOuterPartitionsAsSectors(circles, intervalSets);

      // Draw what is required to be drawn
      for (var i = 0; i < circles.length; i++) {
        if (config.alwaysDrawFullCircles) {
          draw.circle(circles[i].center, circles[i].radius, "rgba(34,168,168,0.333)", 1.0);
        }
        if (drawRadicalLines) {
          for (var j = 0; j < circles.length; j++) {
            if (radicalLineMatrix[i][j])
              draw.line(radicalLineMatrix[i][j].a, radicalLineMatrix[i][j].b, "rgba(34,168,168,0.333)", 1.0);
          }
        }
        if (config.drawCircleSections) {
          drawCircleSections(draw, fill, circles[i], radicalLineMatrix[i]);
        }
        if (config.sectionDrawPct != 100) {
          drawOpenCircleIntervals(draw, fill, circles[i], intervalSets[i]);
        }
        if (config.drawCircleNumbers) {
          fill.text("" + i, circles[i].center.x, circles[i].center.y);
        }
      }

      // Draw connected paths?
      if (config.sectionDrawPct == 100) {
        for (var i = 0; i < pathListSectors.length; i++) {
          drawConnectedPath(draw, fill, pathListSectors[i], iteration, i);
        }
      }

      var affectedCircles = [];
      for (var i = 0; i < circles.length; i++) {
        if (!innerCircleIndices.includes(i)) {
          affectedCircles.push(circles[i]);
        }
      }
      return affectedCircles;
    };

    // +---------------------------------------------------------------------------------
    // | Draw the inner angles of intersecions.
    // +-------------------------------
    var drawCircleSections = function (draw, fill, circle, radicalLines) {
      for (var r = 0; r < radicalLines.length; r++) {
        if (radicalLines[r] == null) continue;
        draw.line(circle.center, radicalLines[r].a, "rgba(0,192,192,0.25)", 1.0);
        draw.line(circle.center, radicalLines[r].b, "rgba(0,192,192,0.25)", 1.0);
      }
    };

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
      var color = randomWebColor(iteration + pathNumber);

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

    // // +---------------------------------------------------------------------------------
    // // | This is kind of a hack to draw connected arc paths (which is currently not directly
    // // | supported by the `draw` library).
    // // |
    // // | The function switches between canvas.ellipse draw or SVG path draw.
    // // |
    // // | @param {CircleSector[]} path
    // // | @param {number} iteration
    // // | @param {number} pathNumber
    // // +-------------------------------
    // var drawConnectedPath = function (draw, fill, path, iteration, pathNumber) {
    //   var color = randomWebColor(iteration + pathNumber, config.colorSet);
    //   // console.log("color", color);
    //   drawConnectedPathArcs(path, color, config.fillNestedCircles ? fill : draw);
    // };

    // // +---------------------------------------------------------------------------------
    // // | Draw the given path as ellipses (using canvs.ellipse function).
    // // |
    // // | @param {CircleSector[]} path
    // // | @param {string} color
    // // | @param {drawutils} draw
    // // +-------------------------------
    // var drawConnectedPathArcs = function (path, color, draw) {
    //   if (draw instanceof drawutilssvg) {
    //     console.log("svg");
    //     for (var i = 0; i + 1 < path.length; i++) {
    //       var sector = path[i];
    //       // prettier-ignore
    //       draw.circleArc(sector.circle.center, sector.circle.radius, sector.startAngle, sector.endAngle, color, config.lineWidth, {
    //       asSegment: true
    //     });
    //     }
    //     var i = path.length - 1;
    //     if (i >= 0) {
    //       var sector = path[i];
    //       // prettier-ignore
    //       draw.circleArc(sector.circle.center, sector.circle.radius, sector.startAngle, sector.endAngle, color, config.lineWidth, {
    //       asSegment: false
    //     });
    //     }
    //   } else {
    //     // console.log("canvas");
    //     // draw.ctx.beginPath();
    //     for (var i = 0; i < path.length; i++) {
    //       var sector = path[i];
    //       // prettier-ignore
    //       draw.circleArc(sector.circle.center, sector.circle.radius, sector.startAngle, sector.endAngle, color, config.lineWidth, {
    //         asSegment: false
    //       });
    //     }
    //   }
    // };

    // +---------------------------------------------------------------------------------
    // | Draw the outer circle sectors of intersections (as separate segments).
    // |
    // | This is quick and easy, but the intersection points might not be rendered
    // | properly as the path is not drawn in one single line.
    // +-------------------------------
    var drawOpenCircleIntervals = function (draw, fill, circle, intervalSet) {
      for (var i = 0; i < intervalSet.intervals.length; i++) {
        var interval = intervalSet.intervals[i];
        if (config.fillNestedCircles) {
          fill.circleArc(
            circle.center,
            circle.radius,
            interval[0],
            interval[0] + (interval[1] - interval[0]) * (config.sectionDrawPct / 100),
            "rgba(34,168,168,1.0)",
            config.lineWidth
          );
        } else {
          draw.circleArc(
            circle.center,
            circle.radius,
            interval[0],
            interval[0] + (interval[1] - interval[0]) * (config.sectionDrawPct / 100),
            "rgba(34,168,168,1.0)",
            config.lineWidth
          );
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "circle-intersection-demo").move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      var cx = document.getElementById("cx");
      var cy = document.getElementById("cy");
      if (cx) cx.innerHTML = relPos.x.toFixed(2);
      if (cy) cy.innerHTML = relPos.y.toFixed(2);
    });

    // +---------------------------------------------------------------------------------
    // | After circles were moved their radius control points must be updated
    // | to match the circles' radii again.
    // +-------------------------------
    var updateRadiusPoints = function () {
      for (var i in circles) {
        radiusPoints[i].set(
          circles[i].center.x + circle.radius * Math.sin(Math.PI / 4),
          circles[i].center.y + circle.radius * Math.cos(Math.PI / 4)
        );
      }
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Animate the vertices: make them bounce around and reflect on the walls.
    // +-------------------------------
    var animator = null;
    var toggleAnimation = function () {
      if (config.animate) {
        if (animator) animator.stop();
        if (config.animationType == "radial")
          animator = new CircularVertexAnimator(centerPoints, pb.viewport(), updateRadiusPoints);
        // 'linear'
        else animator = new LinearVertexAnimator(centerPoints, pb.viewport(), updateRadiusPoints);
        animator.start();
      } else {
        if (animator) animator.stop();
        animator = null;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Unfortunately the animator is not smart, so we have to create a new
    // | one (and stop the old one) each time the vertex count changes.
    // +-------------------------------
    var updateAnimator = function () {
      if (!animator) return;
      animator.stop();
      animator = null;
      toggleAnimation();
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        alwaysDrawFullCircles: false,
        drawCircleSections: false,
        lineWidth: 3.0,
        lineJoin: "round", // [ "bevel", "round", "miter" ]
        drawAsSVGArcs: false,
        drawRadicalLines: false,
        drawCircleNumbers: false,
        sectionDrawPct: 100, // [0..100]
        drawNestedCircles: true,
        nestedCircleStep: 25,
        fillNestedCircles: false,
        colorSet: "WebColors", // [ "WebColors", "Mixed", "Malachite" ]
        animate: false,
        animationType: "radial" // 'linear' or 'radial'
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'lineWidth').min(1).max(100).step(1).onChange( function() { pb.redraw(); } ).name("lineWidth").title("The line width of circle sections.");
      // prettier-ignore
      gui.add(config, 'lineJoin', [ "bevel", "round", "miter" ] ).onChange( function() { pb.redraw(); } ).name("lineJoin").title("The shape of the line joins.");
      // prettier-ignore
      gui.add(config, 'alwaysDrawFullCircles').onChange( function() { pb.redraw(); } ).name("alwaysDrawFullCircles").title("Always draw full circles?");
      // prettier-ignore
      gui.add(config, 'drawCircleSections').onChange( function() { pb.redraw(); } ).name("drawCircleSections").title("Draw the circle sections separately?");
      // prettier-ignore
      gui.add(config, 'drawAsSVGArcs').onChange( function() { pb.redraw(); } ).name("drawAsSVGArcs").title("Draw the circle sections using SVG arcs instead of canvas ellipses?");
      // prettier-ignore
      gui.add(config, 'drawRadicalLines').onChange( function() { pb.redraw(); } ).name("drawRadicalLines").title("Draw the radical lines?");
      // prettier-ignore
      gui.add(config, 'drawCircleNumbers').onChange( function() { pb.redraw(); } ).name("drawCircleNumbers").title("Draw circle numbers?");
      // prettier-ignore
      gui.add(config, 'sectionDrawPct').min(0).max(100).step(1).onChange( function() { pb.redraw(); } ).name("sectionDrawPct").title("How much to draw?");
      // prettier-ignore
      gui.add(config, 'drawNestedCircles').onChange( function() { pb.redraw(); } ).name("drawNestedCircles").title("Draw nested (inner) circles?");
      // prettier-ignore
      gui.add(config, 'nestedCircleStep').min(2).max(100).step(1).onChange( function() { pb.redraw(); } ).name("nestedCircleStep").title("Distance of nested circles.");
      // prettier-ignore
      gui.add(config, 'fillNestedCircles').onChange( function() { pb.redraw(); } ).name("fillNestedCircles").title("Fill circles?");
      // prettier-ignore
      gui.add(config, 'colorSet', [ "WebColors", "Mixed", "Malachite" ] ).onChange( function() { pb.redraw(); } ).name("colorSet").title("Which color set to use.");
      // prettier-ignore
      gui.add(config, 'animate').onChange( toggleAnimation ).title("Toggle point animation on/off.");
      // prettier-ignore
      gui.add(config, 'animationType', { Linear: 'linear', Radial : 'radial' } ).onChange( function() { toggleAnimation(); } );
    }

    pb.config.preDraw = drawAll;
    pb.redraw();
  };

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
