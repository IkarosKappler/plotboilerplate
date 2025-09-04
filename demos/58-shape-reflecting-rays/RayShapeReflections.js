/**
 * A script for calculating ray reflections on any shape.
 *
 * @require Ray
 *
 * @author   Ikaros Kappler
 * @date     2025-03-24
 * @modified 2025-05-05 Refactored and moved to a separate file.
 * @modified 2025-05-09 Fixing an error on muliple self-reflecting shapes.
 * @modified 2025-05-14 Moved the Ray class one level up for re-use.
 * @version  1.0.1
 **/

(function (_context) {
  "use strict";

  /**
   * @param {Array<Vector>} rayCollection
   * @param {number} config.rayCompareEpsilon
   */
  globalThis.RayShapeReflections = function (shapes, rayCollection, config, rayStepLength) {
    var newRays = [];
    // Set rays to normalized step
    for (var j = 0; j < rayCollection.length; j++) {
      rayCollection[j].vector.setLength(rayStepLength);
    }

    if (config.drawPreviewRays) {
      drawLines(draw, fill, rayCollection, "rgba(192,192,192,0.25)");
    }
    newRays = calculateAllReflections(shapes, rayCollection, config);
    return newRays;
  }; // END postDraw

  /**
   * @param {Array<Ray>} rays
   * @return {Array<Ray[]>} An two-dimensional array of vectors; each array for one of the base shapes.
   */
  var calculateAllReflections = function (shapes, rays, config) {
    // Array<Vector[]>
    var resultVectors = [];
    rays.forEach(function (ray) {
      const reflectedRays = [];
      shapes.forEach(function (shape) {
        var reflectedRay = findReflectedRay(shape, ray);
        if (reflectedRay != null && ray.vector.a.distance(reflectedRay.vector.a) > config.rayCompareEpsilon) {
          // && reflectedRay.length() > 0.1) {
          reflectedRays.push(reflectedRay);
        }
      });
      if (reflectedRays.length > 0) {
        resultVectors.push(findClosestRay(ray, reflectedRays));
      } else {
        // Just expand input ray
        resultVectors.push(new Ray(ray.vector.clone().moveTo(ray.vector.b), null, null, ray.properties));
      }
    });
    return resultVectors;
  };

  // Pre: rays.length > 0
  var findClosestRay = function (sourceRay, rays) {
    var dist = sourceRay.vector.a.distance(rays[0].vector.a);
    var resultIndex = 0;
    for (var i = 1; i < rays.length; i++) {
      if (sourceRay.vector.a.distance(rays[i].vector.a) < dist) {
        resultIndex = i;
      }
    }
    return rays[resultIndex];
  };

  /**
   * @param {Intersectable} shape - Some instance of Polygon | Circle | VEllipse | Triangle | CircleSector | VEllipseSector | Line.
   * @param {Ray} ray
   * @returns {Ray}
   */
  var findReflectedRay = function (shape, ray) {
    var reflectedRay = null;
    // Find intersection with min distance

    // Array<Vector>
    // console.log("shape", shape);
    var intersectionTangents = shape.lineIntersectionTangents(ray.vector, true);
    var closestIntersectionTangent = findClosestTangent(intersectionTangents, ray);
    if (closestIntersectionTangent) {
      var angleBetween = closestIntersectionTangent.angle(ray.vector);
      closestIntersectionTangent.rotate(angleBetween);
      reflectedRay = new Ray(closestIntersectionTangent, null, shape, ray.properties);
    } else {
      reflectedRay = null;
    }
    return reflectedRay;
  };

  var findClosestTangent = function (intersectionTangents, ray) {
    return intersectionTangents.reduce(function (accu, curVal) {
      if (accu === null || curVal.a.distance(ray.vector.a) < accu.a.distance(ray.vector.a)) {
        accu = curVal;
      }
      return accu;
    }, null);
  };
})(globalThis);
