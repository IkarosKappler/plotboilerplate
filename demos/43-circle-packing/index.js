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
      circle.center.attr.draggable = false;
      // initialCircle.center.attr.selectable = true;
      // initialCircle.center.attr.isInitialCircle = true;
      pb.add(circle);
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
    initialCircle.center.attr.selectable = false;
    initialCircle.center.attr.isInitialCircle = true;
    // We want to draw this in a different color
    initialCircle.center.attr.visible = false;
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
      var maxRadius = Number.MAX_VALUE;
      for (var i in pb.drawables) {
        var circle = pb.drawables[i];
        if (!(circle instanceof Circle)) {
          continue;
        }
        // console.log("i", i, circle.center.distance(position) - circle.radius);
        if (!circle.center.attr.isInitialCircle && circle.containsPoint(position)) {
          return -1;
        }
        // console.log("x", maxRadius, circle.center.distance(position), circle.radius);
        maxRadius = Math.min(maxRadius, Math.abs(circle.center.distance(position) - circle.radius));
      }
      return maxRadius;
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
      // Draw containing circle
      var containingCircle = pb.drawables[0];
      pb.draw.circle(containingCircle.center, containingCircle.radius, "rgb(128,164,0)", 2);
      // ...
      pb.draw.circle(mousePosition, 5, "orange");
      var maxRadius = getMaxRadius(mousePosition);
      if (maxRadius !== -1) {
        // console.log("maxRadius", maxRadius);
        pb.draw.circle(mousePosition, maxRadius, "grey");
        // Draw closest point on containing circle
        var closestPointOnContainingCircle = containingCircle.closestPoint(mousePosition);
        pb.draw.circle(closestPointOnContainingCircle, 5, "red", 2);
      }

      // Draw an extended line?
      if (selectedCircleIndices[0] !== -1) {
        var selectedCircle = pb.drawables[selectedCircleIndices[0]];
        var line = new Line(selectedCircle.center, mousePosition);
        pb.draw.line(line.a, line.b, "grey", 1);
        // Extend line
        pb.draw.line(line.b, line.b.clone().add(line.a.difference(line.b)), "rgba(192,192,192,0.2)", 1);
        // Find extreme points of intersection
        var intersection = containingCircle.lineIntersection(line.a, line.b);
        // console.log("intersection", intersection.a, intersection.b);
        pb.draw.circle(intersection.a, 5, "green", 2);
        pb.draw.circle(intersection.b, 5, "green", 2);
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
        console.log("event.params.buttonNumber", event.params.button, event.params.leftButton);
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
        console.log("Add new circle");
        // newCircle.center.attr.selectable = true;
        selectedCircleIndices[0] = pb.drawables.length;
        addCircle(newCircle);
      });

    new KeyHandler({ trackAll: true }).down("spacebar", function () {
      // Find circle that contains the current mouse position
      var circleIndex = findMinContainingCircle(mousePosition);
      if (circleIndex === -1) {
        return;
      }
      var circle = pb.drawables[circleIndex];
      if (!circle.center.attr.selectable) {
        return;
      }
      circle.center.attr.isSelected = !circle.center.attr.isSelected;
      if (circle.center.attr.isSelected) {
        selectedCircleIndices[0] = circleIndex;
      } else {
        selectedCircleIndices[0] = -1;
      }
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
