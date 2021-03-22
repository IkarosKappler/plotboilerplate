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
    // console.log( 'init. canvas: ', document.getElementById('my-canvas') );
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
          autoAdjustOffset: false, // true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: false
        },
        GUP
      )
    );

    pb.config.postDraw = function () {
      redraw();
    };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        lineWidth: 2.0,
        arcRotation: 0.0,
        fitToRange: function () {
          setView(viewRangeX, viewRangeY);
        }
      },
      GUP
    );

    var time = 0;

    var randColor = function (i) {
      return WebColorsContrast[i % WebColorsContrast.length].cssRGB();
    };

    // Define a shape with SVG path data attributes only with _absolute_
    // path commands.
    // prettier-ignore
    var svgDataAbsolute = [
		'M', -10, -7.5,
		    'V', -10, 
		    'L', 0, -10,
		    'C', -5, -15, 10, -15, 5, -10,
		    'H', 10,
		    'C', 5, -7.5, 5, -7.5, 10, -5,
		    'S', 15, 0, 10, 0,
		    'Q', 5, 5, 0, 0,
		    'T', -10, 0,
		    'A', 5, 4, 0, 1, 1, -10, -5,    
		    'Z'
	    ];

    // Now define the same shape. But only y with _relative_
    // path commands.
    // prettier-ignore
    var svgDataRelative = [
		'M', -10, -7.5,
		'v', -2.5, 
		'l', 10, 0,
		'c', -5, -5, 10, -5, 5, 0,
		'h', 5,
		'c', -5, 2.5, -5, 2.5, 0, 5,
		's', 5, 5, 0, 5,
		'q', -5, 5, -10, 0,
		't', -10, 0,
		'a', 5, 4, 0, 1, 1, 0, -5,    
		'z'
	    ];
    drawutilssvg.transformPathData(svgDataRelative, { x: 25, y: 0 }, { x: 1, y: 1 });

    var viewRangeX = new Interval(-11, 52);
    var viewRangeY = new Interval(-11, 22);

    var setView = function (rangeX, rangeY) {
      pb.config.scaleX = pb.draw.scale.x = pb.fill.scale.x = pb.canvasSize.width / rangeX.length();
      pb.config.scaleY = pb.draw.scale.y = pb.fill.scale.y = pb.config.scaleX; // pb.canvasSize.height / rangeY.length();
      pb.config.offsetX = pb.draw.offset.x = pb.fill.offset.x = pb.canvasSize.width / 3;
      pb.config.offsetY = pb.draw.offset.y = pb.fill.offset.y = pb.canvasSize.height / 1.5;
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | This is the part where the magic happens
    // +-------------------------------

    var redraw = function () {
      var D2R = Math.PI / 180;
      // Print and draw on the canvas.
      console.log("svgTestData", svgDataAbsolute);
      // drawutilssvg.transformPathData( svgDataAbsolute, pb.draw.offset, pb.draw.scale );
      pb.draw.path(svgDataAbsolute, "rgb(255,0,0)", config.lineWidth, false);

      // Print and draw on the canvas (and move 25 units to see them better)
      console.log("svgTestDataRelative", svgDataRelative);
      // drawutilssvg.transformPathData( svgDataRelative, pb.draw.offset, pb.draw.scale );
      pb.draw.path(svgDataRelative, "rgb(0,255,0)", config.lineWidth, false);

      var axisRotation = config.arcRotation; // (config.arcRotation / 180) * Math.PI;
      // prettier-ignore
      var arcOnly = ["M", -10, 0, "A", 5, 4, axisRotation, 1, 1, -10, -5];
      drawutilssvg.transformPathData(arcOnly, { x: 25, y: 10 }, { x: 1, y: 1 });
      pb.draw.path(arcOnly, "rgb(0,255,255)", config.lineWidth, false);
      // var sector = svgArcToEllipseSector(arcOnly[1], arcOnly[2], 5, 4, axisRouation, true, true, -10, -5);
      var fa = 1;
      var fs = 1;
      var sector = getCenterParameters(
        arcOnly[1], // x1
        arcOnly[2], // y1
        arcOnly[9], // x2
        arcOnly[10], // y2
        fa,
        fs,
        arcOnly[4], // rx
        arcOnly[5], // ry
        arcOnly[6] * D2R // arcOnly[6] // rotation
      );
      // var sector = svgArcToCenterParam(
      //   arcOnly[1], // x1
      //   arcOnly[2], // y1
      //   5,
      //   4,
      //   axisRotation * D2R,
      //   fa,
      //   fs,
      //   arcOnly[9], // x2
      //   arcOnly[10] // y1
      // );
      console.log("sector", sector);
      var bezier = sector.toCubicBezier(16);
      var offs = { x: 0.0, y: 0.0 };
      for (var i = 0; i < bezier.length; i++) {
        pb.draw.cubicBezier(
          bezier[i].startPoint.add(offs),
          bezier[i].endPoint.add(offs),
          bezier[i].startControlPoint.add(offs),
          bezier[i].endControlPoint.add(offs),
          "purple",
          1
        );
      }
    };

    // svg : [A | a] (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+

    // function radian(ux, uy, vx, vy) {
    //   var dot = ux * vx + uy * vy;
    //   var mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    //   var rad = Math.acos(dot / mod);
    //   if (ux * vy - uy * vx < 0.0) {
    //     rad = -rad;
    //   }
    //   return rad;
    // }
    // //conversion_from_endpoint_to_center_parameterization
    // //sample :  svgArcToCenterParam(200,200,50,50,0,1,1,300,200)
    // // x1 y1 rx ry φ fA fS x2 y2
    // function svgArcToCenterParam(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
    //   var cx, cy, startAngle, deltaAngle, endAngle;
    //   var PIx2 = Math.PI * 2.0;
    //   var R2D = 180 / Math.PI;
    //   var D2R = Math.PI / 180;

    //   if (rx < 0) {
    //     rx = -rx;
    //   }
    //   if (ry < 0) {
    //     ry = -ry;
    //   }
    //   if (rx == 0.0 || ry == 0.0) {
    //     // invalid arguments
    //     throw Error("rx and ry can not be 0");
    //   }

    //   var s_phi = Math.sin(phi);
    //   var c_phi = Math.cos(phi);
    //   var hd_x = (x1 - x2) / 2.0; // half diff of x
    //   var hd_y = (y1 - y2) / 2.0; // half diff of y
    //   var hs_x = (x1 + x2) / 2.0; // half sum of x
    //   var hs_y = (y1 + y2) / 2.0; // half sum of y

    //   // F6.5.1
    //   var x1_ = c_phi * hd_x + s_phi * hd_y;
    //   var y1_ = c_phi * hd_y - s_phi * hd_x;

    //   // F.6.6 Correction of out-of-range radii
    //   //   Step 3: Ensure radii are large enough
    //   var lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
    //   if (lambda > 1) {
    //     rx = rx * Math.sqrt(lambda);
    //     ry = ry * Math.sqrt(lambda);
    //   }

    //   var rxry = rx * ry;
    //   var rxy1_ = rx * y1_;
    //   var ryx1_ = ry * x1_;
    //   var sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
    //   if (!sum_of_sq) {
    //     throw Error("start point can not be same as end point");
    //   }
    //   var coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
    //   if (fA == fS) {
    //     coe = -coe;
    //   }

    //   // F6.5.2
    //   var cx_ = (coe * rxy1_) / ry;
    //   var cy_ = (-coe * ryx1_) / rx;

    //   // F6.5.3
    //   cx = c_phi * cx_ - s_phi * cy_ + hs_x;
    //   cy = s_phi * cx_ + c_phi * cy_ + hs_y;

    //   var xcr1 = (x1_ - cx_) / rx;
    //   var xcr2 = (x1_ + cx_) / rx;
    //   var ycr1 = (y1_ - cy_) / ry;
    //   var ycr2 = (y1_ + cy_) / ry;

    //   // F6.5.5
    //   startAngle = radian(1.0, 0.0, xcr1, ycr1);

    //   // F6.5.6
    //   deltaAngle = radian(xcr1, ycr1, -xcr2, -ycr2);
    //   while (deltaAngle > PIx2) {
    //     deltaAngle -= PIx2;
    //   }
    //   while (deltaAngle < 0.0) {
    //     deltaAngle += PIx2;
    //   }
    //   if (fS == false || fS == 0) {
    //     deltaAngle -= PIx2;
    //   }
    //   endAngle = startAngle + deltaAngle;
    //   while (endAngle > PIx2) {
    //     endAngle -= PIx2;
    //   }
    //   while (endAngle < 0.0) {
    //     endAngle += PIx2;
    //   }

    //   var outputObj = {
    //     /* cx, cy, startAngle, deltaAngle */ cx: cx,
    //     cy: cy,
    //     startAngle: startAngle,
    //     deltaAngle: deltaAngle,
    //     endAngle: endAngle,
    //     clockwise: fS == true || fS == 1
    //   };

    //   // return outputObj;
    //   var center = new Vertex(cx, cy);
    //   var ellipse = new VEllipse(center, center.clone().addXY(rx, ry));
    //   // ellipse.rotate(phi);

    //   return ellipse;
    // }

    function getCenterParameters(_x1, _y1, _x2, _y2, fa, fs, rx, ry, phi) {
      // https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
      console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2, "fa", fa, "fs", fs, "rx", rx, "ry", ry, "phi", phi);
      pb.draw.circleHandle({ x: _x1, y: _y1 }, 3, "green");
      pb.draw.circleHandle({ x: _x2, y: _y2 }, 3, "green");
      // const { abs, sin, cos, sqrt } = Math;
      var abs = Math.abs;
      var sin = Math.sin;
      var cos = Math.cos;
      var sqrt = Math.sqrt;
      var R2D = 180 / Math.PI;
      var D2R = Math.PI / 180;
      const pow = n => Math.pow(n, 2);

      // Rotate points to 'neutral' position (rotation=0)
      var pointA = new Vertex(_x1, _y1);
      var pointB = new Vertex(_x2, _y2);
      // pointB.rotate(-phi * D2R, pointA);
      pointB.rotate(-phi, pointA);
      pb.draw.circleHandle(pointA, 4, "red");
      pb.draw.circleHandle(pointB, 4, "red");
      pb.draw.line({ x: _x1, y: _y1 }, pointA, 3, "grey");
      pb.draw.line({ x: _x2, y: _y2 }, pointB, 3, "grey");
      // var x1 = pointA.x;
      // var y1 = pointA.y;
      // var x2 = pointB.x;
      // var y2 = pointB.y;
      var x1 = _x1; // pointA.x;
      var y1 = _y1; // pointA.y;
      var x2 = _x2; // pointB.x;
      var y2 = _y2; // pointB.y;

      const sinphi = sin(phi),
        cosphi = cos(phi);
      // const sinphi = 0.0;
      // const cosphi = 1.0;

      // Step 1: simplify through translation/rotation
      const x = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2,
        y = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;

      const px = pow(x),
        py = pow(y),
        prx = pow(rx),
        pry = pow(ry);
      console.log("x", x, "y", y, "py", py, "prx", prx, "pry", pry);

      // correct of out-of-range radii
      const L = px / prx + py / pry;

      if (L > 1) {
        rx = sqrt(L) * abs(rx);
        ry = sqrt(L) * abs(ry);
      } else {
        rx = abs(rx);
        ry = abs(ry);
      }

      // Step 2 + 3: compute center
      const sign = fa === fs ? -1 : 1;
      const M = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;
      //const M = sqrt(Math.abs((prx * pry - prx * py - pry * px) / (prx * py + pry * px))) * sign;
      // console.log((prx * pry - prx * py - pry * px) / (prx * py + pry * px));

      const _cx = (M * (rx * y)) / ry,
        _cy = (M * (-ry * x)) / rx;

      const cx = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2,
        cy = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;
      console.log("M", M, "cy", cy, "sign", sign, "_cx", _cx, "_cy", _cy);

      // Step 4: compute θ and dθ
      const theta = vectorAngle([1, 0], [(x - _cx) / rx, (y - _cy) / ry]);
      console.log("theta", theta);

      let _dTheta = deg(vectorAngle([(x - _cx) / rx, (y - _cy) / ry], [(-x - _cx) / rx, (-y - _cy) / ry])) % 360;

      if (fs === 0 && _dTheta > 0) _dTheta -= 360;
      if (fs === 1 && _dTheta < 0) _dTheta += 360;

      // return { cx, cy, theta, dTheta: rad(_dTheta) };
      // var phiR = rad(phi);
      var center = new Vertex(cx, cy);
      var axis = center.clone().addXY(rx, ry);
      var ellipse = new VEllipse(center, axis, 0);
      ellipse.rotate(phi); //  * D2R);
      // Move Ellipse back to pointA
      // var diff = ellipse.center.difference({ x: cx, y: cy });
      // ellipse.center.add(diff);
      // ellipse.axis.add(diff);
      // return new VEllipseSector(ellipse, theta, theta + rad(_dTheta));
      // return new VEllipseSector(ellipse, rad(theta), rad(theta) + rad(_dTheta));
      // return new VEllipseSector(ellipse, theta, theta + rad(_dTheta));
      var startAngle = new Line(ellipse.center, new Vertex(x1, y1)).angle();
      var endAngle = new Line(ellipse.center, new Vertex(x2, y2)).angle();

      pb.draw.crosshair(ellipse.center, 5, "blue");
      pb.draw.crosshair(ellipse.axis, 5, "blue");
      // return ellipse;
      return new VEllipseSector(ellipse, startAngle - phi, endAngle - phi);
    }

    function __getCenterParameters(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
      // https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
      console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2, "fa", fa, "fs", fs, "rx", rx, "ry", ry, "phi", phi);
      // const { abs, sin, cos, sqrt } = Math;
      var abs = Math.abs;
      var sin = Math.sin;
      var cos = Math.cos;
      var sqrt = Math.sqrt;
      const pow = n => Math.pow(n, 2);

      const sinphi = sin(phi),
        cosphi = cos(phi);

      // Step 1: simplify through translation/rotation
      const x = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2,
        y = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;

      const px = pow(x),
        py = pow(y),
        prx = pow(rx),
        pry = pow(ry);
      console.log("x", x, "y", y, "py", py, "prx", prx, "pry", pry);

      // correct of out-of-range radii
      const L = px / prx + py / pry;

      if (L > 1) {
        rx = sqrt(L) * abs(rx);
        ry = sqrt(L) * abs(ry);
      } else {
        rx = abs(rx);
        ry = abs(ry);
      }

      // Step 2 + 3: compute center
      const sign = fa === fs ? -1 : 1;
      // const M = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;
      const M = sqrt(Math.abs((prx * pry - prx * py - pry * px) / (prx * py + pry * px))) * sign;
      // console.log((prx * pry - prx * py - pry * px) / (prx * py + pry * px));

      const _cx = (M * (rx * y)) / ry,
        _cy = (M * (-ry * x)) / rx;

      const cx = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2,
        cy = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;
      console.log("M", M, "cy", cy, "sign", sign, "_cx", _cx, "_cy", _cy);

      // Step 4: compute θ and dθ
      const theta = vectorAngle([1, 0], [(x - _cx) / rx, (y - _cy) / ry]);
      console.log("theta", theta);

      let _dTheta = deg(vectorAngle([(x - _cx) / rx, (y - _cy) / ry], [(-x - _cx) / rx, (-y - _cy) / ry])) % 360;

      if (fs === 0 && _dTheta > 0) _dTheta -= 360;
      if (fs === 1 && _dTheta < 0) _dTheta += 360;

      // return { cx, cy, theta, dTheta: rad(_dTheta) };
      var phiR = rad(phi);
      var center = new Vertex(cx, cy);
      var axis = center.clone().addXY(rx, ry);
      var ellipse = new VEllipse(center, axis, 0);
      //ellipse.rotate(phiR);
      // return new VEllipseSector(ellipse, theta, theta + rad(_dTheta));
      // return new VEllipseSector(ellipse, rad(theta), rad(theta) + rad(_dTheta));
      // return new VEllipseSector(ellipse, theta, theta + rad(_dTheta));
      var startAngle = new Line(ellipse.center, new Vertex(x1, x1)).angle();
      var endAngle = new Line(ellipse.center, new Vertex(x2, x2)).angle();
      // return new VEllipse(ellipse, startAngle, endAngle);
      return ellipse;
    }

    // function vectorAngle([ux, uy], [vx, vy]) {
    function vectorAngle(u, v) {
      var ux = u[0];
      var uy = u[1];
      var vx = v[0];
      var vy = v[1];
      // const { acos, sqrt } = Math;
      var acos = Math.acos;
      var sqrt = Math.sqrt;
      const sign = ux * vy - uy * vx < 0 ? -1 : 1,
        ua = sqrt(ux * ux + uy * uy),
        va = sqrt(vx * vx + vy * vy),
        dot = ux * vx + uy * vy;

      return sign * acos(dot / (ua * va));
    }

    var deg = function (r) {
      return (r / Math.PI) * 180;
    };
    var rad = function (d) {
      return (d / 180) * Math.PI;
    };

    // var svgArcToEllipseSector = function (startx, starty, radiusH, radiusV, axisRotation, sweepFlag, largeArcFlag, endx, endy) {

    // };
    /* function svgArcToEllipseSector(lastX, lastY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
      // https://stackoverflow.com/questions/6729056/mapping-svg-arcto-to-html-canvas-arcto
      //--------------------
      // rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y
      // are the 6 data items in the SVG path declaration following the A
      //
      // lastX and lastY are the previous point on the path before the arc
      //--------------------
      // useful functions
      var m = function (v) {
        return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
      };
      var r = function (u, v) {
        return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v));
      };
      var ang = function (u, v) {
        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v));
      };
      //--------------------

      var currpX = (Math.cos(xAxisRotation) * (lastX - x)) / 2.0 + (Math.sin(xAxisRotation) * (lastY - y)) / 2.0;
      var currpY = (-Math.sin(xAxisRotation) * (lastX - x)) / 2.0 + (Math.cos(xAxisRotation) * (lastY - y)) / 2.0;

      var l = Math.pow(currpX, 2) / Math.pow(rx, 2) + Math.pow(currpY, 2) / Math.pow(ry, 2);
      if (l > 1) {
        rx *= Math.sqrt(l);
        ry *= Math.sqrt(l);
      }
      var s =
        (largeArcFlag == sweepFlag ? -1 : 1) *
        Math.sqrt(
          (Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(currpY, 2) - Math.pow(ry, 2) * Math.pow(currpX, 2)) /
            (Math.pow(rx, 2) * Math.pow(currpY, 2) + Math.pow(ry, 2) * Math.pow(currpX, 2))
        );
      if (isNaN(s)) s = 0;

      var cppX = (s * rx * currpY) / ry;
      var cppY = (s * -ry * currpX) / rx;
      var centpX = (lastX + x) / 2.0 + Math.cos(xAxisRotation) * cppX - Math.sin(xAxisRotation) * cppY;
      var centpY = (lastY + y) / 2.0 + Math.sin(xAxisRotation) * cppX + Math.cos(xAxisRotation) * cppY;

      var ang1 = ang([1, 0], [(currpX - cppX) / rx, (currpY - cppY) / ry]);
      var a = [(currpX - cppX) / rx, (currpY - cppY) / ry];
      var b = [(-currpX - cppX) / rx, (-currpY - cppY) / ry];
      var angd = ang(a, b);
      if (r(a, b) <= -1) angd = Math.PI;
      if (r(a, b) >= 1) angd = 0;

      var rad = rx > ry ? rx : ry;
      var sx = rx > ry ? 1 : rx / ry;
      var sy = rx > ry ? ry / rx : 1;

      //   Context.translate(centpX, centpY);
      //   Context.rotate(xAxisRotation);
      //   Context.scale(sx, sy);
      //   Context.arc(0, 0, rad, ang1, ang1 + angd, 1 - sweepFlag);
      //   Context.scale(1 / sx, 1 / sy);
      //   Context.rotate(-xAxisRotation);
      //   Context.translate(-centpX, -centpY);
      var anticlockwise = Boolean(1 - sweepFlag);
      var center = new Vertex(centpX, centpY);
      var axis = center.clone().add(rx, ry);
      console.log(UIDGenerator);
      return new VEllipseSector(new VEllipse(center, axis, xAxisRotation), ang1, ang1 + angd);
    } */

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
      var f0 = gui.addFolder("Points");

      // prettier-ignore
      f0.add(config, "lineWidth").min(1).max(20).title("The line with to use.").onChange(function () {
          pb.redraw();
        });
      // prettier-ignore
      f0.add(config, "arcRotation").min(0).max(360).title("The test rotation to use.").onChange(function () {
          pb.redraw();
        });
      f0.add(config, "fitToRange").title("Reset view to best range fit.");
      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation();
    } else {
      setView(viewRangeX, viewRangeY);
      pb.redraw();
    }
  });
})(window);
