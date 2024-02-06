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
    // Array< { circleA, circleB, doIntersect } >
    var inverseCirclesPairs = [];

    var rebuildMetaballs = function () {
      inverseCirclesPairs = [];
      for (var i = 0; i < containingCircles.length; i++) {
        var circleA = containingCircles[i];
        for (var j = 0; j < containingCircles.length; j++) {
          if (i == j) {
            continue;
          }
          var circleB = containingCircles[j];
          // We have two different circles here
          // Find intersection line of these two circles
          var radicalLine = circleA.circleIntersection(circleB);
          if (radicalLine == null) {
            // The two circles do not have an intersection.
            // console.log("Circles", i, j, "do not have any intersections");
            continue;
          }
          // But if they have -> compute. outer circle(s).
          // They are symmetrical.
          var outerCircle1 = new Circle(radicalLine.a, config.metaRadiusAddon);
          var outerCircle2 = new Circle(radicalLine.b, config.metaRadiusAddon);
          var doIntersect = outerCircle1.circleIntersection(outerCircle2) != null;
          console.log("doIntersect", doIntersect);
          inverseCirclesPairs.push({ circleA: outerCircle1, circleB: outerCircle2, doIntersect: doIntersect });
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

    var reinit = function () {
      circles = [];
      pb.removeAll();
      for (var i = 0; i < config.numCircles; i++) {
        var vp = pb.viewport();
        var circle = new Circle(vp.randomPoint(0.35, 0.35), (Math.random() * Math.min(vp.width, vp.height)) / 5);
        circles.push(circle);
      }
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
        draw.circle(circlePair.circleA.center, circlePair.circleA.radius, color, lineWidth);
        draw.circle(circlePair.circleB.center, circlePair.circleB.radius, color, lineWidth);
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

    pb.config.preDraw = redraw;
    init();
    rebuildMetaballs();
    pb.redraw();
  });
})(window);
