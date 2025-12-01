/**
 * Define a simple 3d vertex class (like in threejs).
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

var Vert3 = function (x, y, z) {
  this.x = typeof x === "number" ? x : 0;
  this.y = typeof y === "number" ? y : 0;
  this.z = typeof z === "number" ? z : 0;

  /**
   * Perform a linear interpolation towards the given target vertex.
   * The amount value `t` is relative, `t=0.0` means no change, `t=1.0`
   * means this point will be moved to the exact target position.
   *
   * `t=0.5` will move this point to the middle of the connecting
   * linear segment.
   *
   * @param {XYCoords} target - The target position to lerp this vertex to.
   * @param {number} t - The relative amount, usually in [0..1], but other values will work, too.
   * @returns
   */
  this.lerp = function (target, t) {
    // var diff = this.difference(target);
    // // return new Vertex(this.x + diff.x * t, this.y + diff.y * t);
    // this.x += diff.x * t;
    // this.y += diff.y * t;
    // this.z += diff.z * t;
    Vert3.utils.lerp(this, target, t);
    return this;
  };

  /**
   * Get the difference to the passed point.<br>
   * <br>
   * The difference is (vert.x-this.x, vert.y-this.y).
   *
   * @method difference
   * @param {Vertex} vert - The vertex to measure the x-y-difference to.
   * @return {Vertex} A new vertex.
   * @instance
   * @memberof Vertex
   **/
  this.difference = function (vert) {
    return Vert3.utils.difference(this, vert); // new Vert3(vert.x - this.x, vert.y - this.y, vert.z - this.z);
  };

  this.clone = function () {
    return new Vert3(this.x, this.y, this.z);
  };
};

Vert3.utils = {
  lerp: function (source, target, t) {
    var diff = Vert3.utils.difference(source, target);
    // return new Vertex(this.x + diff.x * t, this.y + diff.y * t);
    source.x += diff.x * t;
    source.y += diff.y * t;
    source.z += diff.z * t;
    return source;
  },

  difference: function (source, vert) {
    return new Vert3(vert.x - source.x, vert.y - source.y, vert.z - source.z);
  }
};
