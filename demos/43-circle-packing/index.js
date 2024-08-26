/**
 * A script to demonstrate how to make circle packings.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-08-15
 * @modified 2022-09-27 Code cleanup.
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
      pb.add(circle);
    };

    // Create an initial wrapper circle
    var initialViewport = pb.viewport();
    var initialCircleRadius = Math.min(initialViewport.width, initialViewport.height) / 3;
    var initialCircle = new Circle(new Vertex(0, 0), initialCircleRadius);
    initialCircle.center.attr.selectable = false;
    initialCircle.center.attr.isInitialCircle = true;
    // We want to draw this in a different color
    initialCircle.center.attr.visible = false;
    addCircle(initialCircle);

    // A point to use for the next circle center
    var mousePosition = new Vertex();
    var selectedCircleIndices = [-1, -1];

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys({}, GUP);

    // +---------------------------------------------------------------------------------
    // | Get the maximal available radius for a circle at the given position
    // | wihout intersecting with any other circl around.
    // +-------------------------------
    var getMaxRadius = function (position) {
      var maxRadius = Number.MAX_VALUE;
      for (var i in pb.drawables) {
        var circle = pb.drawables[i];
        if (!(circle instanceof Circle)) {
          continue;
        }
        if (!circle.center.attr.isInitialCircle && circle.containsPoint(position)) {
          return -1;
        }
        maxRadius = Math.min(maxRadius, Math.abs(circle.center.distance(position) - circle.radius));
      }
      return maxRadius;
    };

    // +---------------------------------------------------------------------------------
    // | Find the minimal circle (index) that conatins the given point.
    // +-------------------------------
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

    // +---------------------------------------------------------------------------------
    // | Find the closest intersection point of the given line (possibly null, will return
    // | null then) and all available circles relative to the given position.
    // +-------------------------------
    function getClosestLinePoint(lineOrNull, position) {
      if (lineOrNull) {
        if (lineOrNull.a.distance(position) < lineOrNull.b.distance(position)) {
          return lineOrNull.a;
        } else {
          return lineOrNull.b;
        }
      }
      return null;
    }

    // +---------------------------------------------------------------------------------
    // | Draw our custom stuff after everything else in the scene was drawn.
    // +-------------------------------
    var redraw = function (draw, fill) {
      // Draw containing circle
      var containingCircle = pb.drawables[0];
      pb.draw.circle(containingCircle.center, containingCircle.radius, "rgb(128,164,0)", 2);
      pb.draw.circle(mousePosition, 5, "orange");
      var maxRadius = getMaxRadius(mousePosition);
      if (maxRadius !== -1) {
        pb.draw.circle(mousePosition, maxRadius, "grey");
        // Draw closest point on containing circle
        var closestPointOnContainingCircle = containingCircle.closestPoint(mousePosition);
        pb.draw.line(containingCircle.center, closestPointOnContainingCircle, "rgba(0,192,192,0.5)", 1);
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
        for (var i = 0; i < pb.drawables.length; i++) {
          var childCircle = pb.drawables[i];
          var intersection = childCircle.lineIntersection(childCircle.center, mousePosition);
          if (intersection) {
            pb.draw.line(childCircle.center, mousePosition, "rgba(192,192,192,0.25)", 1);
            var closestLinePoint = getClosestLinePoint(intersection, mousePosition);
            pb.draw.circle(closestLinePoint, 5, "green", 2);
          }
          var rootIntersection = childCircle.lineIntersection(selectedCircle.center, mousePosition);
          if (rootIntersection) {
            pb.draw.line(childCircle.center, mousePosition, "rgba(192,192,192,0.25)", 1);
            var closestLinePoint = getClosestLinePoint(rootIntersection, mousePosition);
            pb.draw.circle(closestLinePoint, 3, "yellow", 2);
          }
        }
      }
    };

    function setSelectedCircleByPosition(position) {
      var circleIndex = findMinContainingCircle(position);
      if (circleIndex === -1) {
        return false;
      }
      var circle = pb.drawables[circleIndex];
      if (!circle.center.attr.selectable) {
        return false;
      }
      circle.center.attr.isSelected = !circle.center.attr.isSelected;
      if (circle.center.attr.isSelected) {
        selectedCircleIndices[0] = circleIndex;
      } else {
        selectedCircleIndices[0] = -1;
      }
      return true;
    }

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
        if (!event.params.leftButton) {
          return;
        }
        var newRadius = getMaxRadius(mousePosition);
        if (newRadius === -1) {
          // This means: the position is INSIDE a circle -> select it
          if (setSelectedCircleByPosition(mousePosition)) {
            pb.redraw();
          }
          return;
        }
        var newCircle = new Circle(mousePosition.clone(), newRadius);
        selectedCircleIndices[0] = pb.drawables.length;
        addCircle(newCircle);
      });

    // Maybe this is not the best solution from a UX point of view, as the [spacebar]
    // event does not exist in most mobile devices.
    new KeyHandler({ trackAll: true }).down("spacebar", function () {
      if (setSelectedCircleByPosition(mousePosition)) {
        pb.redraw();
      }
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

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // Well, not really much happens here
    }

    pb.config.postDraw = redraw;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
