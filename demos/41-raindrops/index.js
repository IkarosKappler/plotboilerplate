/**
 * A script to demonstrate how to draw clipped polygons.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
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
        rotation: 0.0,
        resetRotation: function () {
          config.rotation = 0.0;
          pbBottom.redraw();
        },
        tileScale: 1.0,
        canvasScaleX: 1.0,
        canvasScaleY: 1.0,
        presetName: GUP["presetName"] || "LU_pentagon", // "LS_penrose"
        drawTargetTexture: true,
        animate: true,
        animationDelay: 50,
        dropMaxRadius: 100
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

    // +---------------------------------------------------------------------------------
    // | This is the actual render function.
    // +-------------------------------
    var drawSource = function (draw, fill) {
      // TODO
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
    var radiusBackdrop = 50;
    for (var i = 0; i < 10; i++) {
      dropList.push({ position: randomVertex(), radius: -Math.floor(Math.random() * radiusBackdrop) });
    }

    var startColor = Color.parse("#ff0000");
    var endColor = Color.parse("#00ff00");
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
            pb.draw.circle(drop.position, drop.radius, color.cssRGBA(), 1);
          }
          drop.radius += 1;
        } else {
          // new drop here
          drop.position = randomVertex();
          drop.radius = 0;
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
      nextStep();
      // console.log("animate");
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
      gui.add(config, 'rotation').min(-180).max(180).step(1).listen().onChange( function() { pb.redraw(); } ).name("rotation").title("Rotation of the tile");
      // prettier-ignore
      gui.add(config, 'resetRotation').name("resetRotation").title("resetRotation");
      // prettier-ignore
      // gui.add(config, 'performClip').listen().onChange( function() { pbTop.redraw(); } ).name("performClip").title("Perform the clipping?");
      // prettier-ignore
      gui.add(config, 'tileScale').min(0.5).max(2.0).listen().onChange( function() { pb.redraw(); } ).name("tileScale").title("Scale the tile up or down.");
      // prettier-ignore
      gui.add(config, 'canvasScaleX').min(-2.0).max(2.0).listen().onChange( function() { pbBottom.draw.scale.x = pbBottom.fill.scale.x = config.canvasScaleX; pbBottom.redraw(); } ).name("canvasScaleX").title("Scale the canvas horizontally.");
      // prettier-ignore
      gui.add(config, 'canvasScaleY').min(-2.0).max(2.0).listen().onChange( function() { pbBottom.draw.scale.y = pbBottom.fill.scale.y = config.canvasScaleY; pbBottom.redraw();  } ).name("canvasScaleY").title("Scale the canvas vertically.");

      // prettier-ignore
      gui.add(config, 'drawTargetTexture').listen().onChange( function() { pb.redraw(); } ).name("drawTargetTexture").title("drawTargetTexture");

      // prettier-ignore
      // gui.add(config, 'presetName', presetNames).listen().onChange( function() { changeTilePreset(); } ).name("presetName").title("Name a tile (penrose, pentagon, ...)");
      // prettier-ignore
      gui.add(config, 'animate').listen().onChange( startAnimation ).name("animate").title("animate");
      // prettier-ignore
      gui.add(config, 'animationDelay').listen().name("animationDelay").title("animationDelay");
    }

    pb.config.preDraw = drawSource;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
