/**
 * A script to demonstrate how to construct 2D metaballs with PlotBoilerplate.
 *
 * Note there are some edge cases where the calculation is locally not working correctly.
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
    /* var isDarkmode = detectDarkMode(GUP);
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
        drawOuterHull: params.getBoolean("drawOuterHull", true),
        epsilonPathDetect: 0.1,
        readme: function () {
          globalThis.displayDemoMeta();
        }
      },
      GUP
    );

    // var inputCircles = [];
    var circleHelpers = [];
    var metaballs = new Metaballs([]);

    // Find intersections, radical lines and interval
    // Array<number>
    var innerCircleIndices = null;
    // Matrix<Line | null>
    var radicalLineMatrix = null;
    // Array<CircularIntervalSet>
    var intervalSets = null;
    // Array<Array<CircleSector>>
    var outerPathListSectors = null;

    // Array<Array<CircleSector>>
    // Note: These path sectors are NOT CONNECTED with each others any more.
    var innerPathListSectors = null;

    // Array<CircleSector>
    var allCircleSectors = null;
    // Array<CircleSector>
    var filteredCircleSectors = null;

    // +---------------------------------------------------------------------------------
    // | Just rebuild the whole meta balls set with current settings.
    // +-------------------------------
    var rebuildMetaballs = function () {
      metaballs.rebuild({ metaRadiusAddon: config.metaRadiusAddon });

      // Find intersections, radical lines and interval
      innerCircleIndices = CircleIntersections.findInnerCircles(metaballs.containingCircles);
      radicalLineMatrix = CircleIntersections.buildRadicalLineMatrix(metaballs.containingCircles);
      intervalSets = CircleIntersections.findOuterCircleIntervals(metaballs.containingCircles, radicalLineMatrix);
      outerPathListSectors = CircleIntersections.findOuterPartitionsAsSectors(metaballs.containingCircles, intervalSets);

      // Array<Array<CircleSector>>
      // Note: These path sectors are NOT CONNECTED with each others any more.
      innerPathListSectors = outerPathListSectors.map(function (sectorList) {
        return sectorList.map(function (outerSector) {
          var innerSector = cloneCircleSector(outerSector);
          // Scale down to original radius
          innerSector.circle.radius -= config.metaRadiusAddon;
          return innerSector;
        });
      });

      collectConnectedCircleArcs();
      // Filter out those sectors that are not connected with the global path (usually inner holes).
      filteredCircleSectors = filterConnectedSectors(allCircleSectors, config.epsilonPathDetect);
    };

    // +---------------------------------------------------------------------------------
    // | After calculating the meta balls we need to flatten the result before drawing.
    // +-------------------------------
    var collectConnectedCircleArcs = function () {
      // `innerPathListSectors` is a two-dimensional list/array.
      allCircleSectors = innerPathListSectors.reduce(function (accu, curArray) {
        return curArray.reduce(function (accu2, curVal2) {
          accu2.push(curVal2);
          return accu2;
        }, accu);
      }, []);

      // Collect inverse circle sectors.
      // Array< { circleA, circleB, inverseCircleA, inverseCircleB, doIntersect, circlePointsA:[], circlePointsB:[] } >
      for (var i = 0; i < metaballs.inverseCirclesPairs.length; i++) {
        var circlePair = metaballs.inverseCirclesPairs[i];
        // Step 1: draw inverse circle arcs (these two connect circleA and circleB)
        if (
          !circlePair.doIntersect ||
          circlePair.circleB.containsPoint(circlePair.circleA.center) ||
          circlePair.circleA.containsPoint(circlePair.circleB.center)
        ) {
          // drawInverseCircleArcs(draw, fill, circlePair);
          var circleArcA = createInvserseCircleArc(
            circlePair.inverseCircleA,
            circlePair.circlePointsA[0],
            circlePair.circlePointsB[0]
          );
          var circleArcB = createInvserseCircleArc(
            circlePair.inverseCircleB,
            circlePair.circlePointsB[1],
            circlePair.circlePointsA[1]
          );
          allCircleSectors.push(circleArcA, circleArcB);
        }
        // Step 2: Collect rest of original circles if intersection is not enough for meta connection.
        if (
          circlePair.doIntersect &&
          !circlePair.circleB.containsPoint(circlePair.circleA.center) &&
          !circlePair.circleA.containsPoint(circlePair.circleB.center)
        ) {
          var circleArcA = createInvserseCircleArc(
            circlePair.baseCircleA,
            circlePair.circlePointsA[1],
            circlePair.circlePointsA[0]
          );
          var circleArcB = createInvserseCircleArc(
            circlePair.baseCircleB,
            circlePair.circlePointsB[0],
            circlePair.circlePointsB[1]
          );
          allCircleSectors.push(circleArcA, circleArcB);
        }
      } // END for
    }; // END function collectConnectCircleArcs

    // +---------------------------------------------------------------------------------
    // | The flattened circle sector list muss be filtered: the are a lot of inner
    // | sectors that do not belong to the outline we'd like to draw.
    // | -> keep only those sectors that belong to a larger connected path.
    // +-------------------------------
    var filterConnectedSectors = function (circleSectorList, epsilon) {
      return circleSectorList.filter(function (circleSect, sectorIndex) {
        // Check if this sector is connected with other
        // Include all full circles (probably outside the blob)
        if (Math.abs(circleSect.startAngle, circleSect.endAngle) < 0.001) {
          return true;
        }
        var startPoint = circleSect.getStartPoint();
        var endPoint = circleSect.getEndPoint();
        var hasAdjacentSectors =
          circleSectorList.findIndex(function (tmpSect, tmpIndex) {
            if (tmpIndex === sectorIndex) {
              return false;
            }
            var tmpStartPoint = tmpSect.getStartPoint();
            var tmpEndPoint = tmpSect.getEndPoint();
            return (
              startPoint.distance(tmpStartPoint) < epsilon ||
              startPoint.distance(tmpEndPoint) < epsilon ||
              endPoint.distance(tmpStartPoint) < epsilon ||
              endPoint.distance(tmpEndPoint) < epsilon
            );
          }) !== -1;
        return hasAdjacentSectors;
      });
    };

    // +---------------------------------------------------------------------------------
    // | Generate a random circle.
    // +-------------------------------
    var getRandomCircle = function () {
      var vp = pb.viewport();
      var circle = new Circle(vp.randomPoint(0.35, 0.35), (Math.random() * Math.min(vp.width, vp.height)) / 5);
      return circle;
    };

    // +---------------------------------------------------------------------------------
    // | When circles are dragged around or resized the meta balls need to be
    // | re-calculated.
    // +-------------------------------
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
        // Install resize listeners
        radiusPoint.listeners.addDragListener(function (_evt) {
          rebuildMetaballs();
        });
        // Install move listeners
        metaballs.inputCircles[i].center.listeners.addDragListener(function (e) {
          rebuildMetaballs();
        });
      }
    };

    var reinit = function () {
      arrayResize(metaballs.inputCircles, config.numCircles, getRandomCircle);
      rebuildMetaballs();
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
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      for (var i = 0; i < metaballs.circlesOfInterest.length; i++) {
        const vert = metaballs.circlesOfInterest[i].center;
        // TODO: use contrast color here?
        fill.text("" + i, vert.x, vert.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });
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
        for (var i = 0; i < metaballs.containingCircles.length; i++) {
          var metaball = metaballs.containingCircles[i];
          draw.circle(metaball.center, metaball.radius, "grey", 1.0, { dashOffset: 0, dashArray: [5, 4] });
        }
      }

      // Draw circles at intersection points (inverse circles)
      if (config.drawInverseCircles) {
        for (var i = 0; i < metaballs.inverseCirclesPairs.length; i++) {
          var circlePair = metaballs.inverseCirclesPairs[i];
          var color = circlePair.doIntersect ? "rgba(192,192,192,0.333)" : "rgba(255,192,0,0.5)";
          var lineWidth = 1.0;
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
      // Draw connected paths?
      if (config.drawOuterHull) {
        for (var i = 0; i < outerPathListSectors.length; i++) {
          drawConnectedPath(
            draw,
            fill,
            outerPathListSectors[i],
            pb.drawConfig.circleSector.color,
            pb.drawConfig.circleSector.lineWidth
          );
        }
      }

      for (var i = 0; i < filteredCircleSectors.length; i++) {
        var tmpSect = filteredCircleSectors[i];
        draw.circleArc(
          tmpSect.circle.center,
          tmpSect.circle.radius,
          tmpSect.startAngle,
          tmpSect.endAngle,
          "rgba(0,255,0,0.333)",
          7
        );
      }
    }; // END redraw

    // +---------------------------------------------------------------------------------
    // | Convert a circle and their intersection points to circular arcs.
    // |
    // | Background: we found the circle intersection with a geometrical calculation; but we
    // | need angles for further processing, so convert the circle and two intersection
    // | points to a circle sector.
    // +-------------------------------
    var createInvserseCircleArc = function (inverseCircle, intersectionPoint0, intersectionPoint1) {
      var angleDifference = -Math.PI;
      var intersectionAngleA0 = intersectionPoint0.angle(inverseCircle.center) + angleDifference;
      var intersectionAngleB0 = intersectionPoint1.angle(inverseCircle.center) + angleDifference;
      return new CircleSector(inverseCircle, intersectionAngleB0, intersectionAngleA0);
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
  */

    // ------ NEW
    var effectsConfig = {
      color: "#ff0000",
      colorAlpha: 0.95,
      myNumber: 0.5,
      myNumberEnabled: true
    };

    // var getOpacityPct = function () {
    //   return "" + effectsConfig.colorAlpha * 100.0 + "%";
    // };

    // var getBackdropFilterString = function () {
    //   console.log("getOpacityPct", getOpacityPct());
    //   var buffer = [];
    //   // buffer.push("blur(5px)");
    //   buffer.push("invert(80%)");
    //   buffer.push("sepia(90%)");
    //   buffer.push("blur(2px)");
    //   // buffer.push("brightness(60%)");
    //   buffer.push("contrast(90%)");
    //   // buffer.push("drop-shadow(4px 4px 10px blue)");
    //   // buffer.push("grayscale(30%)");
    //   // buffer.push("hue-rotate(120deg)");
    //   // buffer.push("invert(70%)");
    //   // buffer.push("opacity(20%)");
    //   buffer.push("opacity(" + getOpacityPct() + ")");
    //   // buffer.push("sepia(90%)");
    //   buffer.push("saturate(100%)");

    //   return buffer.join(" ");
    // };

    var canvas = document.getElementById("my-canvas");
    var canvasParent = canvas.parentElement;
    var effectsNode = document.createElement("div");
    effectsNode.style["position"] = "absolute";
    effectsNode.style["left"] = "0px";
    effectsNode.style["top"] = "0px";
    effectsNode.style["width"] = "100%";
    effectsNode.style["height"] = "100%";
    // effectsNode.style["background-color"] = "rgba(255,0,0,0.5)";
    // effectsNode.style["background-color"] = effectsConfig.color;
    // effectsNode.style["opacity"] = effectsConfig.colorAlpha;
    effectsNode.style["pointer-events"] = "none";
    // effectsNode.style["backdrop-filter"] = getBackdropFilterString();
    // effectsNode.style["backdrop-filter"] = "blur(5px)";
    // effectsNode.style["backdrop-filter"] = "invert(80%)";
    // effectsNode.style["backdrop-filter"] = "sepia(90%)";

    canvasParent.appendChild(effectsNode);

    var updateBackdropFilter = function (newBackdropFilterString) {
      console.log("backdropFilter", newBackdropFilterString);
      effectsNode.style["backdrop-filter"] = newBackdropFilterString; // getBackdropFilterString();
    };
    // updateBackdropFilter();
    // ----- /NEW

    globalThis.demoInitializationObserver
      .waitForInitialized()
      .then(function (initializedPB) {
        console.log("initializedPB", initializedPB);
        var pb = initializedPB;
        var gui = pb.getGUI();

        // +---------------------------------------------------------------------------------
        // | Initialize dat.gui
        // +-------------------------------
        try {
          gui.addColor(effectsConfig, "color").onChange(function (newValue) {
            console.log("New value (0)", newValue);
          });
          // gui
          //   .addColorWithAlpha(effectsConfig, "color", "colorAlpha")
          //   .onChange(function (newColorValue, newAlphaValue) {
          //     console.log("New value (1)", newColorValue, newAlphaValue);
          //     updateBackdropFilter();
          //   })
          //   .name("TEST")
          //   .title("test");
          // gui
          //   .addNumberWithCheckbox(effectsConfig, "myNumber", "myNumberEnabled")
          //   .onChange(function (newColorValue, newAlphaValue) {
          //     console.log("New value (1)", newColorValue, newAlphaValue);
          //     updateBackdropFilter();
          //   })
          //   .min(0.0)
          //   .max(1.0)
          //   .step(0.01)
          //   .name("myNumber")
          //   .title("myNumber");

          var cssBackdropFolder = gui.addFolder("CSS Backdrop Filters");
          var result = createCssBackdropFilterSelector(cssBackdropFolder, updateBackdropFilter);
        } catch (exc) {
          console.error(exc);
        }

        // pb.config.postDraw = redraw;
        // init();
        // rebuildMetaballs();
        // pb.redraw();
      })
      .catch(function (error) {
        console.error("Failed to retrieve PB instance.", error);
      });
  });
})(window);
