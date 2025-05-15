/**
 * A script for calculating ray refractions on optical lenses.
 *
 * @author   Ikaros Kappler
 * @date     2025-05-05
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  /* // A helper class to help keeping track of rays and their sources.
  globalThis.Ray = function (vector, sourceLens, sourceShape, rayStartingInsideLens) {
    this.vector = vector;
    this.sourceLens = sourceLens; // May be null (initial rays have no source)
    this.sourceShape = sourceShape; // May be null (initial rays have no source)
    this.rayStartingInsideLens = rayStartingInsideLens;
  }; */

  // Snellius refraction results in two result rays:
  //  - one is reflected
  //  - one is refracted
  globalThis.SnelliusRays = function (reflectedRay, refractedRay, sourceLens, sourceShape) {
    this.reflectedRay = reflectedRay;
    this.refractedRay = refractedRay;
    this.sourceLens = sourceLens; // May be null (initial rays have no source)
    this.sourceShape = sourceShape; // May be null (initial rays have no source)
  };

  /**
   * @param {Array<Ray>} rayCollection
   * @param {number} config.rayCompareEpsilon
   * @param {number} config.baseRefractiveIndex
   */
  globalThis.RayShapeRefractions = function (lenses, rayCollection, config, rayStepLength) {
    var newRays = [];
    // Set rays to normalized step
    for (var j = 0; j < rayCollection.length; j++) {
      rayCollection[j].vector.setLength(rayStepLength);
    }

    if (config.drawPreviewRays) {
      drawLines(draw, fill, rayCollection, "rgba(192,192,192,0.25)");
    }
    newRays = calculateAllReflections(lenses, rayCollection, config);
    return newRays;
  }; // END postDraw

  /**
   * @param {Array<Ray>} rays
   * @return {Array<Ray[]>} An two-dimensional array of vectors; each array for one of the base shapes.
   */
  var calculateAllReflections = function (lenses, rays, config) {
    // Array<Vector[]>
    var resultVectors = [];
    rays.forEach(function (ray) {
      const reflectedRays = [];
      lenses.forEach(function (lens) {
        var shapes = lens.getShapes(); // TODO!
        shapes.forEach(function (shape) {
          var snelliusRays = findSnelliusRays(config, lens, shape, ray);
          if (!snelliusRays) {
            return; // Skip
          }
          // var reflectedRay = snelliusRays.reflectedRay;
          // if (
          //   reflectedRay != null &&
          //   // reflectedRay.sourceShape !== ray.sourceShape &&
          //   ray.vector.a.distance(reflectedRay.vector.a) > config.rayCompareEpsilon
          // ) {
          //   // reflectedRays.push(reflectedRay);
          //   reflectedRays.push(snelliusRays);
          // }
          var refractedRay = snelliusRays.refractedRay;
          if (
            refractedRay != null &&
            refractedRay.sourceShape !== ray.sourceShape &&
            ray.vector.a.distance(refractedRay.vector.a) > config.rayCompareEpsilon
          ) {
            // reflectedRays.push(refractedRay);
            reflectedRays.push(snelliusRays);
          }
        });
      });
      if (reflectedRays.length > 0) {
        resultVectors.push(findClosestSnelliusRays(ray, reflectedRays));
      } else {
        // Just expand input ray
        var extendedRay = new Ray(ray.vector.clone().moveTo(ray.vector.b), null, null, ray.properties);
        // Add fake entry
        resultVectors.push(new SnelliusRays(extendedRay, extendedRay, null, null, ray.properties));
      }
    });
    return resultVectors;
  };

  // Pre: rays.length > 0
  // @param {Ray} sourceRay
  // @param {Array<SnelliusRays>} rays
  var findClosestSnelliusRays = function (sourceRay, rays) {
    console.log("findClosestSnelliusRays", rays[0].reflectedRay);
    var dist = sourceRay.vector.a.distance(rays[0].reflectedRay.vector.a);
    var resultIndex = 0;
    for (var i = 1; i < rays.length; i++) {
      if (sourceRay.vector.a.distance(rays[i].reflectedRay.vector.a) < dist) {
        resultIndex = i;
      }
    }
    return rays[resultIndex];
  };

  /**
   * Find the reflected and the refracted ray.
   *
   * @param {Intersectable} shape - Some instance of Polygon | Circle | VEllipse | Triangle | CircleSector | VEllipseSector | Line.
   * @param {Ray} ray
   * @returns {null | { reflectedRay : Ray, refractedRay : Ray, sourceLens: Lens, sourceShape : Shape }}
   */
  var findSnelliusRays = function (config, lens, shape, ray) {
    // Find intersection with min distance

    var isGoingOut = Boolean(ray.rayStartingInsideLens);

    // TODO: evaluate if ray is going in or out if the lens
    var incomingRefractiveIndex = isGoingOut ? lens.refractiveIndex : config.baseRefractiveIndex; // 1.000293; // Air
    var outgoingRefractiveIndex = isGoingOut ? config.baseRefractiveIndex : lens.refractiveIndex;

    // Array<Vector>
    var intersectionTangents = shape.lineIntersectionTangents(ray.vector, true);
    // Find closest intersection vector
    var closestIntersectionTangent = findClosestTangent(intersectionTangents, ray);
    if (!closestIntersectionTangent) {
      return null;
    }
    var angleBetweenTangentAndRay = closestIntersectionTangent.angle(ray.vector);
    //   closestIntersectionTangent.rotate(angleBetween);
    var reflectedRay = new Ray(
      closestIntersectionTangent.clone().rotate(angleBetweenTangentAndRay),
      lens,
      shape,
      // This requires that no lenses overlap!
      { rayStatringInsideLens: ray.rayStartingInsideLens ? null : lens, color: ray.properties.color }
    );
    var incomingAngle = closestIntersectionTangent.angle(ray.vector) + Math.PI;
    var refractedAngle = Math.asin(incomingRefractiveIndex * Math.sin(incomingAngle)) / outgoingRefractiveIndex;
    // if (isGoingOut) {
    //   incomingAngle -= Math.PI / 2.0;
    // }
    // console.log("refractedAngle", (refractedAngle / Math.PI) * 180);
    var refractedRay = new Ray(
      ray.vector
        .clone()
        .moveTo(closestIntersectionTangent.a)
        // .rotate(angleBetweenTangentAndRay + incomingAngle, closestIntersectionTangent.a),
        .rotate((refractedAngle - Math.PI / 2) * 1.0, closestIntersectionTangent.a),
      lens,
      shape,
      // This requires that no lenses overlap!
      { rayStatringInsideLens: ray.rayStartingInsideLens ? null : lens, color: ray.properties.color }
    );
    return new SnelliusRays(reflectedRay, refractedRay, lens, shape);
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
