/**
 * Create a set of rays (starting in one point, or parallel ones).
 *
 * @require  Ray, Color, ColorGradient
 * @author   Ikaros Kappler
 * @date     2025-06-07
 * @modified Adding optional `colorGradient` option.
 */

// +---------------------------------------------------------------------------------
// | Create a new set of initial rays – depending on the main 'ray' and
// | the config settings.
// |
// | @param  {Ray}           baseRay
// | @param  {number}        options.createParallelRays
// | @param  {number}        options.initialRayAngle
// | @param  {Color}         options.startColor - A color for the first ray; can be used instead of `colorGradient`.
// | @param  {Color}         options.endColor - A color for the last ray; can be used instead of `colorGradient`.
// | @param  {ColorGradient} options.colorGradient - Can be used instead of `startColor` and `endColor`.
// | @return {Array<Ray>}
// +-------------------------------
var createRayCollection = function (baseRay, numRays, options) {
  if (options.colorGradient) {
    return createRayCollectionByGradient(baseRay, numRays, options.colorGradient, options);
  } else if (options.startColor && options.endColor) {
    return createRayCollectionByGradient(
      baseRay,
      numRays,
      ColorGradient.createFrom(options.startColor, options.endColor),
      options
    );
  } else if (options.startColor && !options.endColor) {
    return createRayCollectionByGradient(
      baseRay,
      numRays,
      ColorGradient.createFrom(options.startColor, options.startColor),
      options
    );
  } else if (!options.startColor && options.endColor) {
    return createRayCollectionByGradient(baseRay, numRays, ColorGradient.createFrom(options.endColor, options.endColor), options);
  } else {
    return createRayCollectionByGradient(baseRay, numRays, null, options);
  }
};

var createRayCollectionByGradient = function (baseRay, numRays, gradient, options) {
  var rays = [];
  console.log("gradient", gradient);
  if (options && options.createParallelRays) {
    var perpRay = baseRay.perp();
    perpRay.moveTo(perpRay.vertAt(-0.5));
    for (var i = 0; i < numRays; i++) {
      rays.push(
        new Ray(baseRay.clone().moveTo(perpRay.vertAt((i + 1) / (numRays + 1))), null, null, {
          color: gradient ? gradient.getColorAt(i / numRays).cssRGB() : null
        })
      );
    }
    return rays;
  } else {
    var rangeAngle = options && typeof options.initialRayAngle !== "undefined" ? options.initialRayAngle : 0.0;
    for (var i = 0; i < numRays; i++) {
      rays.push(
        new Ray(baseRay.clone().rotate(-rangeAngle / 2.0 + rangeAngle * (i / numRays)), null, null, {
          color: gradient ? gradient.getColorAt(i / numRays).cssRGB() : null
        })
      );
    }
    return rays;
  }
};
