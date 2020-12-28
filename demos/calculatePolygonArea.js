/**
 * Calculate the area of the given polygon. Note that this
 * does not work (as expected) for self-intersecting polygons.
 *
 * Found at:
 *   https://stackoverflow.com/questions/16285134/calculating-polygon-area
 *
 * @date 2020-12-28
 */

/**
 * @param {XYCoords[]}
 * @return {number}
 */
var calculatePolygonArea = function(vertices) {
    var total = 0.0;

    for (var i = 0, l = vertices.length; i < l; i++) {
	var addX = vertices[i].x;
	var addY = vertices[(i + 1)%l].y;
	var subX = vertices[(i + 1)%l].x;
	var subY = vertices[i].y;

	total += (addX * addY * 0.5);
	total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
};
