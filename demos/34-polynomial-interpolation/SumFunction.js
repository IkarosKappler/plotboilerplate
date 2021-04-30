/**
 * Compute the sum of an array of functions.
 *
 * @author Ikaros Kappler
 * @date 2021-04-25
 * @version 1.0.0
 * @param {*} baseFunctions
 */
var SumFunction = function (baseFunctions) {
  this.evaluate = function (x) {
    var sum = 0;
    for (var i = 0; i < baseFunctions.length; i++) {
      sum += baseFunctions[i].evaluate(x);
    }
    return sum;
  };
};
