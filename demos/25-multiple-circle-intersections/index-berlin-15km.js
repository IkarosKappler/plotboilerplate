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
 * @version  1.2.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    var mapImage = new Image();
    var map = new PBImage(mapImage, new Vertex(0, 0), new Vertex(0, 0));

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

          enableSVGExport: false
        },
        GUP
      )
    );

    function addMap() {
      if (mapImage.naturalHeight) {
        var w = mapImage.naturalWidth;
        var h = mapImage.naturalHeight;
        map.upperLeft.set(-w / 2, -h / 2);
        map.lowerRight.set(w / 2, h / 2);
        pb.add(map);

        // Adapt zoom
        var wRatio = pb.canvasSize.width / w;
        var hRatio = pb.canvasSize.height / h;

        // Set zoom to 'contain' mode
        if (wRatio < hRatio) {
          pb.draw.scale.x = pb.config.scaleX = pb.fill.scale.x = wRatio;
          pb.draw.scale.y = pb.config.scaleY = pb.fill.scale.y = wRatio;
        } else {
          pb.draw.scale.x = pb.config.scaleX = pb.fill.scale.x = hRatio;
          pb.draw.scale.y = pb.config.scaleY = pb.fill.scale.y = hRatio;
        }
        // console.log( wRatio, hRatio, w, h, pb.draw.scale );
        pb.redraw();
      }
    }

    // +---------------------------------------------------------------------------------
    // | Pick a color from the WebColors array.
    // +-------------------------------
    var randomWebColor = function (index) {
      switch (config.colorSet) {
        case "Malachite":
          return WebColorsMalachite[index % WebColorsMalachite.length].cssRGB();
        case "Mixed":
          return WebColorsContrast[index % WebColorsContrast.length].cssRGB();
        case "WebColors":
        default:
          return WebColors[index % WebColors.length].cssRGB();
      }
    };

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
    var numCircles = 14; // Math.max( 1, PlotBoilerplate.utils.fetch.num(GUP,'numCircles',7) );
    var centerPoints = [];
    var radiusPoints = [];
    var range = 325;
    var circles = [
      new Circle(new Vertex(343.9972263714975, -93.1492576839511), range), // 325.60856228392635),
      new Circle(new Vertex(-394.58864757670517, 274.5735972768898), range), //  327.31825339066734),
      new Circle(new Vertex(-419.2949653574839, -40.883831462954426), range), //  326.39228746209204),
      new Circle(new Vertex(-454.5423494977126, 213.38278547476165), range), //  326.1927002820355),
      new Circle(new Vertex(-405.00017573585455, -192.07543546647165), range), //  329.5991398319258),
      new Circle(new Vertex(0.35082264971649657, 299.806933912972), range), //  319.0538983176854),
      new Circle(new Vertex(515.4457121572375, 130.2801743067399), range), //  327.4290155977364),
      new Circle(new Vertex(171.18382514795817, -352.6543526912121), range), //  310.67698332958514), // 7
      new Circle(new Vertex(368.44711837338605, 381.35723246060303), range), //  315.7732547162698), // 8
      new Circle(new Vertex(432.36285928073954, 304.9943573953167), range), //  313.07563290803506), // 9
      new Circle(new Vertex(93.48779065168279, -410.8779161938335), range), //  335.39520846456975),
      new Circle(new Vertex(-182.5794315581207, -374.3682682608377), range), //  333.00243861808514),
      new Circle(new Vertex(492.5386674043467, 215.0669975058168), range), //  317.7335110234094)
      new Circle(new Vertex(-263.240917085836, -291.19525449959514), range) // 339.380391006981) // 13
    ];
    for (var i = 0; i < numCircles; i++) {
      if (circles[i]) {
        var center = circles[i].center;
        var radius = circles[i].radius;
        var circle = circles[i];
      } else {
        var center = randomVertex();
        var radius = Math.random() * pb.canvasSize.height * 0.25;
        var circle = new Circle(center, radius);
      }
      var radiusPoint = new Vertex(
        center.clone().addXY(circle.radius * Math.sin(Math.PI / 4), circle.radius * Math.cos(Math.PI / 4))
      );
      pb.add(radiusPoint);
      pb.add(circle.center);

      circles[i] = circle;
      centerPoints[i] = circle.center;
      radiusPoints[i] = radiusPoint;

      new CircleHelper(circle, radiusPoint, pb);

      (function (c, rp, index) {
        c.center.listeners.addDragEndListener(function (e) {
          console.log(index, c.center);
        });
        rp.listeners.addDragEndListener(function (e) {
          console.log(index, c.center, rp.distance(c.center));
        });
      })(circle, radiusPoint, i);
    }

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawAll = function () {
      if (circles.length == 0) return;
      var iteration = 0;
      var visibleCircles = drawCircleSet(circles, config.drawRadicalLines, iteration++);
      if (config.drawNestedCircles) {
        // Scale down visible circles
        while (visibleCircles.length > 0) {
          // Scale down
          var scaledCircles = [];
          for (var i = 0; i < visibleCircles.length; i++) {
            var scaledCircle = new Circle(visibleCircles[i].center, visibleCircles[i].radius - config.nestedCircleStep);
            if (scaledCircle.radius > 0) scaledCircles.push(scaledCircle);
          }
          visibleCircles = drawCircleSet(scaledCircles, false, iteration++);
          iteration++;
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the intersection outline(s) for the given circles.
    // +-------------------------------
    var drawCircleSet = function (circles, drawRadicalLines, iteration) {
      // Find intersections, radical lines and interval
      var innerCircleIndices = CircleIntersections.findInnerCircles(circles);
      var radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(circles);
      var intervalSets = CircleIntersections.findOuterCircleIntervals(circles, radicalLineMatrix);
      var pathListSectors = CircleIntersections.findOuterPartitionsAsSectors(circles, intervalSets);

      // Draw what is required to be drawn
      for (var i = 0; i < circles.length; i++) {
        if (config.alwaysDrawFullCircles) {
          pb.draw.circle(circles[i].center, circles[i].radius, "rgba(34,168,168,0.333)", 1.0);
        }
        if (drawRadicalLines) {
          for (var j = 0; j < circles.length; j++) {
            if (radicalLineMatrix[i][j])
              pb.draw.line(radicalLineMatrix[i][j].a, radicalLineMatrix[i][j].b, "rgba(34,168,168,0.333)", 1.0);
          }
        }
        if (config.drawCircleSections) {
          drawCircleSections(circles[i], radicalLineMatrix[i]);
        }
        if (config.sectionDrawPct != 100) {
          drawOpenCircleIntervals(circles[i], intervalSets[i]);
        }
        if (config.drawCircleNumbers) {
          pb.fill.text("" + i, circles[i].center.x, circles[i].center.y);
        }
      }

      // Draw connected paths?
      if (config.sectionDrawPct == 100) {
        for (var i = 0; i < pathListSectors.length; i++) {
          drawConnectedPath(pathListSectors[i], iteration, i);
        }
      }

      var affectedCircles = [];
      for (var i = 0; i < circles.length; i++) {
        if (!innerCircleIndices.includes(i)) affectedCircles.push(circles[i]);
      }
      return affectedCircles;
    };

    // +---------------------------------------------------------------------------------
    // | Draw the inner angles of intersecions.
    // +-------------------------------
    var drawCircleSections = function (circle, radicalLines) {
      for (var r = 0; r < radicalLines.length; r++) {
        if (radicalLines[r] == null) continue;
        pb.draw.line(circle.center, radicalLines[r].a, "rgba(0,192,192,0.25)", 1.0);
        pb.draw.line(circle.center, radicalLines[r].b, "rgba(0,192,192,0.25)", 1.0);
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
    var drawConnectedPath = function (path, iteration, pathNumber) {
      var color = randomWebColor(iteration + pathNumber);
      var draw = config.fillNestedCircles ? pb.fill : pb.draw;

      if (config.drawAsSVGArcs) drawConnectedPathAsSVGArcs(path, color, draw);
      else drawConnectedPathAsEllipses(path, color, draw);
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
        pb.draw.circleArc(
          sector.circle.center,
          sector.circle.radius,
          sector.startAngle,
          sector.endAngle,
          color,
          config.lineWidth,
          { asSegment: true }
        );
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
    var drawConnectedPathAsSVGArcs = function (path, color, draw) {
      var svgData = pathToSVGData(path, draw.offset, draw.scale);
      draw.ctx.save();
      draw.ctx.beginPath();
      draw.ctx.lineWidth = config.lineWidth;
      draw.ctx.lineJoin = config.lineJoin;
      if (config.fillNestedCircles) {
        draw.ctx.fillStyle = color;
        draw.ctx.fill(new Path2D(svgData.join(" ")));
      } else {
        draw.ctx.strokeStyle = color;
        draw.ctx.stroke(new Path2D(svgData.join(" ")));
      }
      draw.ctx.restore();
    };

    // +---------------------------------------------------------------------------------
    // | Draw the outer circle sectors of intersections (as separate segments).
    // |
    // | This is quick and easy, but the intersection points might not be rendered
    // | properly as the path is not drawn in one single line.
    // +-------------------------------
    var drawOpenCircleIntervals = function (circle, intervalSet) {
      for (var i = 0; i < intervalSet.intervals.length; i++) {
        var interval = intervalSet.intervals[i];
        if (config.fillNestedCircles) {
          pb.fill.circleArc(
            circle.center,
            circle.radius,
            interval[0],
            interval[0] + (interval[1] - interval[0]) * (config.sectionDrawPct / 100),
            "rgba(34,168,168,1.0)",
            config.lineWidth
          );
        } else {
          pb.draw.circleArc(
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
    // | Build and export the outer paths a an SVG file.
    // | This is a really dirty and quick hack.
    // +-------------------------------
    var exportSVG = function () {
      // Do the same as in the draw function (refactor?)
      // var innerCircleIndices   = CircleIntersections.findInnerCircles( circles );
      var radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(circles);
      var intervalSets = CircleIntersections.findOuterCircleIntervals(circles, radicalLineMatrix);
      var pathListArcs = CircleIntersections.findOuterPartitionsAsSectors(circles, intervalSets);

      var canvasSize = pb.canvasSize;
      var offset = pb.draw.offset;
      var scale = pb.draw.scale;
      // TODO: writer a better SVGBuilder so we do not have to write pure SVG code here.
      var svgBuffer = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg viewBox="0 0 ' +
          canvasSize.width +
          " " +
          canvasSize.height +
          '" width="' +
          canvasSize.width +
          '" height="' +
          canvasSize.height +
          '" xmlns="http://www.w3.org/2000/svg">',
        "<defs><style>.main-g { transform: scale(" +
          scale.x +
          "," +
          scale.y +
          ") translate(" +
          offset.x +
          "px," +
          offset.y +
          "px); } .bg { background-color: " +
          pb.config.backgroundColor +
          "; } .CircleArcPath { fill : none; stroke : green; stroke-width : 2px; } </style></defs>",
        '<rect class="bg" x="0px" y="0px" width="' + canvasSize.width + 'px" height="' + canvasSize.height + 'px" />',
        '<g class="main-g">'
      ];
      for (var i = 0; i < pathListArcs.length; i++) {
        var pathData = pathToSVGData(
          pathListArcs[i],
          // Scaling and offset is already part of the SVG viewport
          { x: 0, y: 0 }, // pb.draw.offset,
          { x: 1, y: 1 } // pb.draw.scale
        );
        svgBuffer.push('<path class="CircleArcPath" d="' + pathData.join(" ") + '" />');
      }
      svgBuffer.push("</g></svg>");

      var svgString = svgBuffer.join("\n");
      // console.log( svgString );
      saveAs(new Blob([svgString], { type: "image/svg" }), "circles-" + getFormattedTime() + ".svg");
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

    mapImage.addEventListener("load", function () {
      addMap();
    });
    mapImage.src = "berlin-map.jpg";
    addMap();

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
        drawNestedCircles: false,
        nestedCircleStep: 25,
        fillNestedCircles: false,
        colorSet: "WebColors", // [ "WebColors", "Mixed", "Malachite" ]
        animate: false,
        animationType: "radial", // 'linear' or 'radial'
        exportSVG: function () {
          exportSVG();
        }
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      gui
        .add(config, "lineWidth")
        .min(1)
        .max(100)
        .step(1)
        .onChange(function () {
          pb.redraw();
        })
        .name("lineWidth")
        .title("The line width of circle sections.");
      gui
        .add(config, "lineJoin", ["bevel", "round", "miter"])
        .onChange(function () {
          pb.redraw();
        })
        .name("lineJoin")
        .title("The shape of the line joins.");
      gui
        .add(config, "alwaysDrawFullCircles")
        .onChange(function () {
          pb.redraw();
        })
        .name("alwaysDrawFullCircles")
        .title("Always draw full circles?");
      gui
        .add(config, "drawCircleSections")
        .onChange(function () {
          pb.redraw();
        })
        .name("drawCircleSections")
        .title("Draw the circle sections separately?");
      gui
        .add(config, "drawAsSVGArcs")
        .onChange(function () {
          pb.redraw();
        })
        .name("drawAsSVGArcs")
        .title("Draw the circle sections using SVG arcs instead of canvas ellipses?");
      gui
        .add(config, "drawRadicalLines")
        .onChange(function () {
          pb.redraw();
        })
        .name("drawRadicalLines")
        .title("Draw the radical lines?");
      gui
        .add(config, "drawCircleNumbers")
        .onChange(function () {
          pb.redraw();
        })
        .name("drawCircleNumbers")
        .title("Draw circle numbers?");
      gui
        .add(config, "sectionDrawPct")
        .min(0)
        .max(100)
        .step(1)
        .onChange(function () {
          pb.redraw();
        })
        .name("sectionDrawPct")
        .title("How much to draw?");
      gui
        .add(config, "drawNestedCircles")
        .onChange(function () {
          pb.redraw();
        })
        .name("drawNestedCircles")
        .title("Draw nested (inner) circles?");
      gui
        .add(config, "nestedCircleStep")
        .min(2)
        .max(100)
        .step(1)
        .onChange(function () {
          pb.redraw();
        })
        .name("nestedCircleStep")
        .title("Distance of nested circles.");
      gui
        .add(config, "fillNestedCircles")
        .onChange(function () {
          pb.redraw();
        })
        .name("fillNestedCircles")
        .title("Fill circles?");
      gui
        .add(config, "colorSet", ["WebColors", "Mixed", "Malachite"])
        .onChange(function () {
          pb.redraw();
        })
        .name("colorSet")
        .title("Which color set to use.");
      gui.add(config, "animate").onChange(toggleAnimation).title("Toggle point animation on/off.");
      gui.add(config, "animationType", { Linear: "linear", Radial: "radial" }).onChange(function () {
        toggleAnimation();
      });
      gui.add(config, "exportSVG").name("exportSVG").title("Export the current view as an SVG file");
    }

    pb.config.postDraw = drawAll;
    pb.redraw();
  };

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
