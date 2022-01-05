/**
 * @author  Ikaros Kappler
 * @date    2021-12-16
 * @version 1.0.0
 */

/**
 * Creata new set, based on array.
 *
 * @param {function(itemA,itemB)} comparator - Must return true if both items are considered equal.
 */
var ArraySet = function (comparator) {
  Array.call(this);
  this.comparator =
    comparator ||
    function (a, b) {
      return a === b;
    };
};

ArraySet.prototype.add = function (item) {
  for (var i = 0; i < this.length; i++) {
    if (this.comparator(this[i], item)) {
      return i;
    }
  }
  Array.prototype.push.call(this, item);
  return this.length - 1;
};
