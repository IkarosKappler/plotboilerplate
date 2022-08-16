/**
 * A script to demonstrate how to make circle packings.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-08-15
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
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

    var addCircle = function (circle) {
      initialCircle.center.attr.draggable = false;
      // initialCircle.center.attr.selectable = true;
      initialCircle.center.attr.isInitialCircle = true;
      pb.add(initialCircle);
      // circle.center.listeners.addClickListener(function (event) {
      //   if (event.params.leftButton) {
      //     return;
      //   }
      //   circle.center.attr.isSelected = !circle.center.attr.isSelected;
      //   pb.redraw();
      // });
    };

    // Create an initial wrapper circle
    var initialViewport = pb.viewport();
    var initialCircleRadius = Math.min(initialViewport.width, initialViewport.height) / 3;
    var initialCircle = new Circle(new Vertex(0, 0), initialCircleRadius);
    // initialCircle.center.attr.draggable = false;
    // // initialCircle.center.attr.selectable = true;
    initialCircle.center.attr.isInitialCircle = true;
    // pb.add(initialCircle);
    addCircle(initialCircle);

    // A point to use for the next circle center
    var mousePosition = new Vertex();
    var selectedCircleIndices = [-1, -1];

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        lineThickness: 12
      },
      GUP
    );

    var getMaxRadius = function (position) {
      var minRadius = Number.MAX_VALUE;
      for (var i in pb.drawables) {
        var circle = pb.drawables[i];
        if (!(circle instanceof Circle)) {
          continue;
        }
        console.log("i", i, circle.center.distance(position) - circle.radius);
        if (!circle.center.attr.isInitialCircle && circle.containsPoint(position)) {
          return -1;
        }
        console.log("x", minRadius, circle.center.distance(position), circle.radius);
        minRadius = Math.min(minRadius, Math.abs(circle.center.distance(position) - circle.radius));
      }
      return minRadius;
    };

    var findMinContainingCircle = function (position) {
      var index = -1;
      var minRadius = Number.MAX_VALUE;
      for (var i in pb.drawables) {
        var circle = pb.drawables[i];
        if (!(circle instanceof Circle)) {
          continue;
        }
        if ((index === -1 || minRadius > circle.radius) && circle.containsPoint(position)) {
          index = i;
          minRadius = circle.radius;
        }
      }
      return index;
    };

    var redraw = function () {
      // ...
      pb.draw.circle(mousePosition, 5, "orange");
      var maxRadius = getMaxRadius(mousePosition);
      pb.draw.circle(mousePosition, maxRadius, "grey");

      // Draw an extended line?
      if (selectedCircleIndices[0] !== -1) {
        var selectedCircle = pb.drawables[selectedCircleIndices[0]];
        var line = new Line(mousePosition, selectedCircle.center);
        pb.draw.line(line.a, line.b, 1, "grey");
      }
    };

    // Add a mouse listener to track the mouse position.-
    new MouseHandler(pb.eventCatcher)
      .move(function (event) {
        var relPos = pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
        stats.mouseXTop = relPos.x;
        stats.mouseYTop = relPos.y;
        mousePosition.set(relPos);
        pb.redraw();
      })
      .click(function (event) {
        console.log("event.params.buttonNumber", event.params.buttonNumber, event.params.leftButton);
        if (!event.params.leftButton) {
          return;
        }
        var newRadius = getMaxRadius(mousePosition);
        console.log("newRadius", newRadius);
        if (newRadius === -1) {
          return;
        }
        var newCircle = new Circle(mousePosition.clone(), newRadius);
        // newCircle.center.attr.draggable = false;
        // pb.add(newCircle);
        addCircle(newCircle);
      });

    var keyHandler = new KeyHandler({ trackAll: true }).down("spacebar", function () {
      // Find circle that contains the current mouse position
      var circleIndex = findMinContainingCircle(mousePosition);
      if (circleIndex === -1) {
        return;
      }
      var circle = pb.drawables[circleIndex];
      circle.center.attr.isSelected = !circle.center.attr.isSelected;
      pb.redraw();
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

    var innerColor = Color.parse(config.startColor);
    var lineColor = Color.parse(config.endColor);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      // gui.add(config, 'hexWidth').min(10).max(160).step(1).listen().onChange(function() { config.hexHeight = config.hexWidth * (HEX_RATIO+config.hexDistort); pb.redraw() }).name("hexWidth").title("hexWidth");
      // prettier-ignore
      // gui.add(config, 'heightOffset').min(-1.0).max(1.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("heightOffset").title("heightOffset");
      // prettier-ignore
      gui.add(config, 'lineThickness').listen().onChange(function() { pb.redraw() }).name("lineThickness").title("lineThickness");
      // // prettier-ignore
      // gui.add(config, 'hexDistort').min(-1).max(1).step(0.01).listen().onChange(function() { config.hexHeight = config.hexWidth * (HEX_RATIO+config.hexDistort); pb.redraw() }).name("hexDistort").title("hexDistort");
      // // prettier-ignore
      // gui.add(config, 'innerScale').min(0.0).max(1.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("innerScale").title("innerScale");

      // // prettier-ignore
      // gui.addColor(pb.config, 'backgroundColor').onChange( function() { pb.redraw(); } );
      // // prettier-ignore
      // gui.addColor(config, 'innerColor').onChange( function() { innerColor = Color.parse(config.innerColor); pb.redraw(); } );
      // // prettier-ignore
      // gui.addColor(config, 'lineColor').onChange( function() { lineColor = Color.parse(config.lineColor); pb.redraw(); } );
    }

    // pb.config.preDraw = drawSource;
    pb.config.postDraw = redraw;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
