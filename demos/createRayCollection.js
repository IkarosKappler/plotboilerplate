/**
 * Create a set of rays (starting in one point, or parallel ones).
 *
 * @require Ray, Color
 * @author Ikaros Kappler
 * @date    2025-
 */

// +---------------------------------------------------------------------------------
// | Create a new set of initial rays – depending on the main 'ray' and
// | the config settings.
// |
// | @param  {Ray} baseRay
// | @param  {number} options.createParallelRays
// | @param  {number} options.initialRayAngle
// | @param  {Color} options.startColor
// | @param  {Color} options.endColor
// | @return {Array<Ray>}
// +-------------------------------
var createRayCollection = function (baseRay, numRays, options) {
  var rayStartColor = options && options.startColor ? options.startColor : null;
  var rayEndColor = options && options.endColor ? options.endColor : null;
  var rays = [];
  // console.log("rayStartColor", rayStartColor, "rayEndColor", rayEndColor);
  if (options && options.createParallelRays) {
    var perpRay = baseRay.perp();
    perpRay.moveTo(perpRay.vertAt(-0.5));
    for (var i = 0; i < numRays; i++) {
      // "rgba(255,192,0,0.5)"
      rays.push(
        new Ray(baseRay.clone().moveTo(perpRay.vertAt((i + 1) / (numRays + 1))), null, null, {
          color: rayStartColor
            ? rayStartColor
                .clone()
                .interpolate(rayEndColor, i / numRays)
                .cssRGB()
            : null
        })
      );
    }
    return rays;
  } else {
    var rangeAngle = options && typeof options.initialRayAngle !== "undefined" ? options.initialRayAngle : 0.0;
    for (var i = 0; i < numRays; i++) {
      rays.push(
        new Ray(baseRay.clone().rotate(-rangeAngle / 2.0 + rangeAngle * (i / numRays)), null, null, {
          color: rayStartColor
            ? rayStartColor
                .clone()
                .interpolate(rayEndColor, i / numRays)
                .cssRGB()
            : null
        })
      );
    }
    return rays;
  }
};
