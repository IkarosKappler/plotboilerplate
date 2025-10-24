/**
 * Animate any numeric value between two values.
 *
 * See demos/64-multiple-ring-animation for examples.
 *
 * @author  Ikaros Kappler
 * @date    2025-10-22
 * @version 1.0.0
 */

var AttrAnimator = function (obj, attrName, min, max, stepValue) {
  this.obj = obj;
  this.attrName = attrName;
  this.min = min;
  this.max = max;
  this.stepValue = stepValue;
};
AttrAnimator.prototype.next = function () {
  this.obj[this.attrName] += this.stepValue;
  if (this.obj[this.attrName] < this.min || this.obj[this.attrName] > this.max) {
    this.stepValue = -this.stepValue;
  }
};
