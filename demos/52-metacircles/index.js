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
        metaRadiusAddon: params.getNumber("metaRadiusAddon", 20),
        drawCircles: false,
        drawRadii: false,
        drawVertNumbers: false
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
      drawCircleLabels(draw, fill);

      for (var i = 0; i < containingCircles.length; i++) {
        // var metaball = new Circle(circles[i].center, circles[i].radius * config.metalballFactor);
        // var metaball = new Circle(circles[i].center, circles[i].radius + config.metaRadiusAddon);
        var metaball = containingCircles[i];

        // dashOffset?: number;
        // dashArray?: Array<number>;
        draw.circle(metaball.center, metaball.radius, "grey", 1.0, { dashOffset: 0, dashArray: [5, 4] });
      }

      // Draw outer circles
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

      // Draw partial arcs.
      for (var i = 0; i < circles.length; i++) {
        var innerCircle = circles[i];
        // var outerCircle = containingCircles[i];
        // Collect all points on this circle
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
      // // prettier-ignore
      // gui.add(config, "drawRadii").onChange( function() { pb.redraw(); } ).name('drawRadii').title("Draw Radii?");
      // // prettier-ignore
      // gui.add(config, "drawVertNumbers").onChange( function() { pb.redraw(); } ).name('drawVertNumbers').title("Draw vertex numbers?");
    }

    pb.config.postDraw = redraw;
    init();
    rebuildMetaballs();
    pb.redraw();
  });
})(window);
