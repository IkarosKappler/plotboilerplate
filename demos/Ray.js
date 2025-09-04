/**
 * A script for calculating ray refractions on optical lenses.
 *
 * @author   Ikaros Kappler
 * @date     2025-05-05
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // A helper class to help keeping track of rays and their sources.
  _context.Ray = function (vector, sourceLens, sourceShape, /* rayStartingInsideLens, */ properties) {
    this.vector = vector;
    this.sourceLens = sourceLens; // May be null (initial rays have no source)
    this.sourceShape = sourceShape; // May be null (initial rays have no source)
    // this.rayStartingInsideLens = rayStartingInsideLens;
    this.properties = properties;
  };
})(globalThis);
