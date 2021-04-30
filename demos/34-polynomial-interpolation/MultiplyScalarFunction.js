/**
 * Multiplies the given function with a scalar.
 *
 * @author Ikaros Kappler
 * @date 2021-04-26
 * @version 1.0.0
 */
var MultiplyScalarFunction = function (baseFunction, scalar) {
  this.evaluate = function (x) {
    return baseFunction.evaluate(x) * scalar;
  };
};
