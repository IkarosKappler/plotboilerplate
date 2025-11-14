/**
 * Define a simple 3d vertex class (like in threejs).
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/

var Vert3 = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.clone = function () {
    return new Vert3(this.x, this.y, this.z);
  };
};
