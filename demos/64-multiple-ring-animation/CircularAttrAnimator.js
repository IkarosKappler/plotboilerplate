/**
 * Animate a circle or ring in a smooth transition.
 *
 * See demos/64-multiple-ring-animation for examples.
 *
 * @author  Ikaros Kappler
 * @date    2025-10-22
 * @version 1.0.0
 */

var CircularAttrAnimator = function (obj, startAttrName, endAttrName, stepValue) {
  this.obj = obj;
  this.startAttrName = startAttrName;
  this.endAttrName = endAttrName;
  this.stepValue = Math.abs(stepValue);
  this.mode = 0;
};
CircularAttrAnimator.prototype.next = function () {
  // console.log("X");
  if (this.mode === 0) {
    var newVal = this.obj[this.startAttrName] + this.stepValue;
    if (newVal >= 360.0) {
      // console.log("this.mode = 1");
      this.mode = 1;
      this.obj[this.endAttrName] = 0.0;
    } else {
      this.obj[this.startAttrName] = newVal;
    }
  } else if (this.mode === 1) {
    var newVal = this.obj[this.endAttrName] + this.stepValue;
    if (newVal >= 360.0) {
      // console.log("this.mode = 2");
      this.mode = 2;
      this.obj[this.startAttrName] = 0.0;
      this.obj[this.endAttrName] = 0.0;
    } else {
      this.obj[this.endAttrName] = newVal;
    }
  } else {
    var newVal = this.obj[this.endAttrName] + this.stepValue;
    if (newVal >= 360.0) {
      // console.log("this.mode = 0");
      this.mode = 0;
      this.obj[this.startAttrName] = -360.0 + this.stepValue;
      this.obj[this.endAttrName] = 0.0;
    } else {
      this.obj[this.endAttrName] = newVal;
    }
  }
};
