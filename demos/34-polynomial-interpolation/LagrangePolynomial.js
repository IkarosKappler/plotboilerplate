/**
 * Compute the Lagrange polynomial with the given x-samples at position j.
 *
 * @author Ikaros Kappler
 * @date 2021-04-25
 * @version 1.0.0
 * @param {number[]} xValues
 * @param {number} j
 */
var LagrangePolynomial = function (xValues, j) {
  // See the defintion of a Lagrange polynomial
  //    https://en.wikipedia.org/wiki/Lagrange_polynomial
  this.evaluate = function (x) {
    var result = 1.0;
    var k = xValues.length;
    for (var m = 0; m < k; m++) {
      if (m == j) continue;
      result *= (x - xValues[m]) / (xValues[j] - xValues[m]);
    }
    return result;
  };
};
