/**
 * Rotates a 3d point.
 *
 * @requires Vertex3
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

function rotatePoint(point, pitch, roll, yaw) {
  // https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm/34060479

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
