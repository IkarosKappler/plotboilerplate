/**
 * A script to demonstrate how to draw animated circles.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-05-11
 * @version  1.0.0
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

          enableSVGExport: false
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        dropCount: 10,
        animate: true,
        animationDelay: 50,
        dropMaxRadius: 100,
        lineThickness: 2,
        innerCircleDistance: 25,
        drawCircleIntersections: true,
        startColor: "#ff0000", // "rgba(255,0,0,1)",
        endColor: "#00ff00" // "rgba(0,255,0,1)"
      },
      GUP
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

    // Add a mouse listener to track the mouse position.-
    new MouseHandler(pb.eventCatcher).move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
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

    // Array<{ position, radius }>
    var dropList = [];
    var radiusBackdrop = 50; // Add to config?

    var handleDropCountChange = function () {
      if (dropList.length > config.dropCount) {
        // Shrink
        dropList.splice(config.dropCount);
      } else {
        // Enlarge
        while (dropList.length < config.dropCount) {
          dropList.push({ position: randomVertex(), radius: -Math.floor(Math.random() * radiusBackdrop) });
        }
      }
    };
    handleDropCountChange();

    var startColor = Color.parse(config.startColor);
    var endColor = Color.parse(config.endColor);
    var nextStep = function () {
      pb.draw.clear();
      pb.draw.beginDrawCycle();
      for (var i = 0; i < dropList.length; i++) {
        var drop = dropList[i];
        var intensity = 1.0 - drop.radius / config.dropMaxRadius;
        if (intensity > 0.0) {
          var color = startColor.clone().interpolate(endColor, intensity);
          color.a = intensity;
          if (drop.radius >= 0) {
            // pb.draw.circle(drop.position, drop.radius, color.cssRGBA(), config.lineThickness);
            var radius = drop.radius;
            do {
              color.a = intensity * (radius / drop.radius);
              pb.draw.circle(drop.position, radius, color.cssRGBA(), config.lineThickness);
              radius -= config.innerCircleDistance;
            } while (radius >= 0);
          }
          drop.radius += 1;
        } else {
          // new drop here
          drop.position = randomVertex();
          drop.radius = 0;
        }
      }

      // Draw circle intersections?
      if (config.drawCircleIntersections) {
        for (var i = 0; i < dropList.length; i++) {
          // ...
          for (var j = i + 1; j < dropList.length; j++) {
            // ...
            const intersection = new Circle(dropList[i].position, dropList[i].radius).circleIntersection(
              new Circle(dropList[j].position, dropList[j].radius)
            );
            if (intersection) {
              pb.draw.diamondHandle(intersection.a, 5, "rgba(255,0,255,0.5)");
              pb.draw.diamondHandle(intersection.b, 5, "rgba(255,0,255,0.5)");
            }
          }
        }
      }

      pb.draw.endDrawCycle();
    };

    // +---------------------------------------------------------------------------------
    // | This function is called on each frame draw.
    // +-------------------------------
    var renderLoop = function (_time) {
      if (!config.animate) {
        return;
      }
      pb.redraw();
      // Animate here
      window.setTimeout(function () {
        window.requestAnimationFrame(renderLoop);
      }, config.animationDelay);
    };

    // +---------------------------------------------------------------------------------
    // | Starts the animation if it's not yet running.
    // +-------------------------------
    var startAnimation = function () {
      if (!config.animate) {
        return;
      }
      renderLoop();
    };
    startAnimation();

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();

      // prettier-ignore
      gui.add(config, 'dropCount').listen().onChange( handleDropCountChange ).name("dropCount").title("dropCount");
      // prettier-ignore
      gui.add(config, 'animate').listen().onChange( startAnimation ).name("animate").title("animate");
      // prettier-ignore
      gui.add(config, 'animationDelay').listen().name("animationDelay").title("animationDelay");
      // prettier-ignore
      gui.add(config, 'lineThickness').listen().min(1).max(32).step(1).name("lineThickness").title("lineThickness");
      // prettier-ignore
      gui.add(config, 'innerCircleDistance').listen().min(1).max(32).step(1).name("innerCircleDistance").title("innerCircleDistance");
      // prettier-ignore
      gui.add(config, 'drawCircleIntersections').listen().name("drawCircleIntersections").title("drawCircleIntersections");
      // prettier-ignore
      gui.addColor(config, 'startColor').onChange( function() { startColor = Color.parse(config.startColor); } );
      // prettier-ignore
      gui.addColor(config, 'endColor').onChange( function() { endColor = Color.parse(config.endColor); } );
    }

    // pb.config.preDraw = drawSource;
    pb.config.postDraw = nextStep;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
