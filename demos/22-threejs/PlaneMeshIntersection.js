/**
 * Compute the intersection of a mesh and a plane.
 *
 * Inspired by
 *    https://stackoverflow.com/questions/42348495/three-js-find-all-points-where-a-mesh-intersects-a-plane
 *    https://jsfiddle.net/prisoner849/8uxw667m/
 *
 * @co-author Ikaros Kappler
 * @date 2021-06-11
 * @version 1.0.0
 */
(function (context, THREE) {
  var PlaneMeshIntersection = function () {
    //   Vector3[]
    this.pointsOfIntersection = []; // new THREE.Geometry();

    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.c = new THREE.Vector3();
    this.planePointA = new THREE.Vector3();
    this.planePointB = new THREE.Vector3();
    this.planePointC = new THREE.Vector3();
    this.lineAB = new THREE.Line3();
    this.lineBC = new THREE.Line3();
    this.lineCA = new THREE.Line3();

    this.pointOfIntersection = new THREE.Vector3();
  };

  PlaneMeshIntersection.prototype.getIntersectionPoints = function (obj, geometry, plane) {
    this.pointsOfIntersection = [];
    var mathPlane = new THREE.Plane();
    plane.localToWorld(this.planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
    plane.localToWorld(this.planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
    plane.localToWorld(this.planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
    mathPlane.setFromCoplanarPoints(this.planePointA, this.planePointB, this.planePointC);

    var _self = this;
    geometry.faces.forEach(function (face) {
      obj.localToWorld(_self.a.copy(geometry.vertices[face.a]));
      obj.localToWorld(_self.b.copy(geometry.vertices[face.b]));
      obj.localToWorld(_self.c.copy(geometry.vertices[face.c]));
      _self.lineAB = new THREE.Line3(_self.a, _self.b);
      _self.lineBC = new THREE.Line3(_self.b, _self.c);
      _self.lineCA = new THREE.Line3(_self.c, _self.a);
      _self.__setPointOfIntersection(_self.lineAB, mathPlane);
      _self.__setPointOfIntersection(_self.lineBC, mathPlane);
      _self.__setPointOfIntersection(_self.lineCA, mathPlane);
    });

    // var pointsMaterial = new THREE.PointsMaterial({
    //   size: 1,
    //   color: 0xffff00
    // });
    // var points = new THREE.Points(this.pointsOfIntersection, pointsMaterial);

    // var lines = new THREE.LineSegments(
    //   this.pointsOfIntersection,
    //   new THREE.LineBasicMaterial({
    //     color: 0xffffff
    //   })
    // );
    // return { lines: lines, points: points };
    return this.pointsOfIntersection;
  };

  PlaneMeshIntersection.prototype.__setPointOfIntersection = function (line, plane) {
    // this.pointOfIntersection = plane.intersectLine(line, new THREE.Vector3());
    var intersectionPoint = plane.intersectLine(line, this.pointOfIntersection); // new THREE.Vector3());
    if (intersectionPoint) {
      // this.pointOfIntersection) {
      //   this.pointsOfIntersection.vertices.push(intersectionPoint.clone()); // this.pointOfIntersection.clone());
      this.pointsOfIntersection.push(intersectionPoint.clone());
    }
  };

  globalThis.PlaneMeshIntersection = PlaneMeshIntersection;
})(globalThis, THREE);
