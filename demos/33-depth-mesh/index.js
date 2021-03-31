/**
 * A demo about rendering SVG path data with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
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
          drawBezierHandleLines: true,
          drawBezierHandlePoints: true,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    var Vert3 = function (x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;

      this.clone = function () {
        return new Vert3(this.x, this.y, this.z);
      };
    };

    var makeSphereGeometry = function () {
      var longs = 6;
      var lats = 12;
      var radius = 1;
      var vertices = [];
      var edges = [];
      for (var long = 0; long < longs; long++) {
        var theta = Math.PI / 2 + (long / longs) * Math.PI;
        for (var lat = 0; lat < lats; lat++) {
          var alpha = (lat / lats) * Math.PI * 2;
          // var x = x0 + radius * Math.cos(theta) * Math.sin(alpha);
          // var y = y0 + radius * Math.sin(theta) * Math.sin(alpha);
          // var z = z0 + radius * Math.cos(alpha);
          // var vert = new Vert3(x, y, z);
          var vert = new Vert3(radius, 0, 0);
          vert = rotatePoint(vert, theta, 0, alpha, 0);
          vertices.push(vert);
          // if (lat > 0 && long > 0) {
          if (lat > 0) {
            edges.push([long * lats + lat - 1, long * lats + lat]);
            if (lat + 1 == lats) {
              edges.push([long * lats, long * lats + lat]);
            }
            // edges.push([lat * longs + long - 1, lat * longs + long - 1]);
            if (long > 0) {
              // && long + 1 < longs) {
              edges.push([long * lats + lat - 1, (long - 1) * lats + lat - 1]);
            }
          }
        }
      }
      console.log(vertices);
      return { vertices: vertices, edges: edges };
    };

    var makeBoxGeometry = function () {
      // Box
      // prettier-ignore
      var vertices = [
      new Vert3(-1, -1, -1), 
      new Vert3(-1, -1,  1),
      new Vert3(1, -1, 1),
      new Vert3(1, -1, -1),
      
      new Vert3(-1, 1, -1), 
      new Vert3(-1, 1,  1),
      new Vert3(1, 1, 1),
      new Vert3(1, 1, -1)
    ];
      // prettier-ignore
      var edges = [
      // front
      [0,1], [1,2], [2,3], [3,0],
      // back
      [4,5], [5,6], [6,7], [7,4],
      // sides
      [0,4], [1,5], [2,6], [3,7]
    ];
      return { vertices: vertices, edges: edges };
    };

    // var geometry = makeBoxGeometry();
    var geometry = makeSphereGeometry();

    // +---------------------------------------------------------------------------------
    // | This is the part where the magic happens
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      // console.log("postDraw", draw);
      for (var e in geometry.edges) {
        var a3 = applyRotation(applyScale(geometry.vertices[geometry.edges[e][0]].clone()));
        var b3 = applyRotation(applyScale(geometry.vertices[geometry.edges[e][1]].clone()));
        var a2 = applyProjection(a3);
        var b2 = applyProjection(b3);
        var tA = getThreshold(a3, -config.scale, config.scale);
        var tB = getThreshold(b3, -config.scale, config.scale);
        var threshold = Math.max(0, Math.min(1, Math.min(tA, tB)));
        // console.log("tA", tA, "tB", tB, "threshold", threshold);
        draw.line(a2, b2, "rgba(92,92,92," + threshold + ")", 2);
      }
      for (var v in geometry.vertices) {
        draw.squareHandle(applyProjection(applyRotation(applyScale(geometry.vertices[v].clone()))), 2, "grey", 1);
      }
    };

    var getThreshold = function (p, far, close) {
      return (far - p.z) / (far - close);
    };

    var applyProjection = function (p) {
      // Project
      var threshold = getThreshold(p, config.far, config.close);
      threshold = Math.max(0, threshold);
      return { x: p.x * threshold, y: p.y * threshold };
    };

    var applyScale = function (p) {
      p.x *= config.scale;
      p.y *= config.scale;
      p.z *= config.scale;
      return p;
    };

    function applyRotation(point) {
      return rotatePoint(
        point,
        (config.rotationX * Math.PI) / 180,
        (config.rotationY * Math.PI) / 180,
        (config.rotationZ * Math.PI) / 180
      );
    }

    function rotatePoint(point, pitch, roll, yaw) {
      // https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm/34060479

      // var pitch = (config.rotationX * Math.PI) / 180;
      // var roll = (config.rotationY * Math.PI) / 180;
      // var yaw = (config.rotationZ * Math.PI) / 180;

      var cosa = Math.cos(yaw);
      var sina = Math.sin(yaw);

      var cosb = Math.cos(pitch);
      var sinb = Math.sin(pitch);

      var cosc = Math.cos(roll);
      var sinc = Math.sin(roll);

      var Axx = cosa * cosb;
      var Axy = cosa * sinb * sinc - sina * cosc;
      var Axz = cosa * sinb * cosc + sina * sinc;

      var Ayx = sina * cosb;
      var Ayy = sina * sinb * sinc + cosa * cosc;
      var Ayz = sina * sinb * cosc - cosa * sinc;

      var Azx = -sinb;
      var Azy = cosb * sinc;
      var Azz = cosb * cosc;

      return new Vert3(
        Axx * point.x + Axy * point.y + Axz * point.z,
        Ayx * point.x + Ayy * point.y + Ayz * point.z,
        Azx * point.x + Azy * point.y + Azz * point.z
      );
    }

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        far: -600,
        close: 0,
        scale: 100,
        rotationX: 0.0,
        rotationY: 0.0,
        rotationZ: 0.0,
        animate: false
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "drawsvg-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
    });

    var stats = {
      mouseX: 0,
      mouseY: 0
    };
    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var f0 = gui.addFolder("Path draw settings");

      // prettier-ignore
      f0.add(config, "far").min(-1000).max(1000).title("The 'far' field.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "close").min(-1000).max(1000).title("The 'close' field.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "scale").min(0).max(500).title("The mesh scale.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "rotationX").min(0).max(360).title("The mesh rotationX.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "rotationY").min(0).max(360).title("The mesh rotationY.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "rotationZ").min(0).max(360).title("The mesh rotationz.").listen().onChange(function () { pb.redraw(); });
      // prettier-ignore
      f0.add(config, "animate").title("Animate?").onChange(function () { startAnimation(0) });

      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    var startAnimation = function (time) {
      // console.log(time);
      config.rotationX = (time / 50) % 360;
      config.rotationY = (time / 70) % 360;
      // if (config.rotationX > 360) config.rotationX = 0;
      // console.log(config.rotationX);
      pb.redraw();

      if (config.animate) window.requestAnimationFrame(startAnimation);
    };

    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation(0);
    } else {
      pb.redraw();
    }
  });
})(window);
