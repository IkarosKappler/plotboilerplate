/** The Bend modifier lets you bend the current selection up to 90 degrees about a single axis,
 * producing a uniform bend in an object's geometry.
 * You can control the angle and direction of the bend on any of three axes.
 * The geometry has to have rather large number of polygons!
 * options:
 * 	 direction - deformation direction (in local coordinates!).
 * 	 axis - deformation axis (in local coordinates!). Vector of direction and axis are perpendicular.
 * 	 angle - deformation angle.
 * @author Vildanov Almaz / alvild@gmail.com
 * The algorithm of a bend is based on the chain line cosh: y = 1/b * cosh(b*x) - 1/b. It can be used only in three.js.
 */

// import {
//   EventDispatcher,
//   MOUSE,
//   Quaternion,
//   Spherical,
//   TOUCH,
//   Vector2,
//   Vector3,
//   Matrix3,
//   Matrix4,
//   BufferGeometry,
//   BufferAttribute
// } from "https://threejs.org/build/three.module.js";
var Vector3 = THREE.Vector3;
var Matrix4 = THREE.Matrix4;
var Matrix3 = THREE.Matrix3;
var BufferAttribute = THREE.BufferAttribute;

var BendModifier = function () {
  this.set = function (direction, axis, angle) {
    this.direction = new Vector3();
    this.direction.copy(direction);
    this.axis = new Vector3();
    this.axis.copy(axis);
    if (angle > Math.PI / 2.5) angle = Math.PI / 2.5;
    this.angle = angle;
    return this;
  };

  this._sign = function (a) {
    return 0 > a ? -1 : 0 < a ? 1 : 0;
  };

  this._cosh = function (x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  };

  this._sinhInverse = function (x) {
    return Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
  };

  this.modify = function (geometry) {
    var thirdAxis = new Vector3();
    thirdAxis.crossVectors(this.direction, this.axis);

    // P - matrices of the change-of-coordinates
    var P = new Matrix4();
    P.set(
      thirdAxis.x,
      thirdAxis.y,
      thirdAxis.z,
      0,
      this.direction.x,
      this.direction.y,
      this.direction.z,
      0,
      this.axis.x,
      this.axis.y,
      this.axis.z,
      0,
      0,
      0,
      0,
      1
    ).transpose();

    // var InverseP = new Matrix4().copy(P).invert();
    var InverseP = new THREE.Matrix4().getInverse(P);
    var newVertices = [];
    var oldVertices = [];
    var anglesBetweenOldandNewVertices = [];

    var meshGeometryBoundingBoxMaxx = 0;
    var meshGeometryBoundingBoxMinx = 0;
    var meshGeometryBoundingBoxMaxy = 0;
    var meshGeometryBoundingBoxMiny = 0;

    const buf_vertices = geometry.getAttribute("position").array;
    var vertices = [];

    for (var i = 0; i < buf_vertices.length; i += 3) {
      //console.log( i + " : " + buf_vertices[i] );
      vertices[i / 3] = new Vector3();
      vertices[i / 3].x = buf_vertices[i];
      vertices[i / 3].y = buf_vertices[i + 1];
      vertices[i / 3].z = buf_vertices[i + 2];
      //console.log( i/3 + " : " + vertices[i/3].z );
    }

    for (var i = 0; i < vertices.length; i++) {
      newVertices[i] = new Vector3();
      newVertices[i].copy(vertices[i]).applyMatrix4(InverseP);
      //newVertices[i] = new Vector3(); newVertices[i].copy( vertices[i] ).applyMatrix3( InverseP );
      if (newVertices[i].x > meshGeometryBoundingBoxMaxx) {
        meshGeometryBoundingBoxMaxx = newVertices[i].x;
      }
      if (newVertices[i].x < meshGeometryBoundingBoxMinx) {
        meshGeometryBoundingBoxMinx = newVertices[i].x;
      }
      if (newVertices[i].y > meshGeometryBoundingBoxMaxy) {
        meshGeometryBoundingBoxMaxy = newVertices[i].y;
      }
      if (newVertices[i].y < meshGeometryBoundingBoxMiny) {
        meshGeometryBoundingBoxMiny = newVertices[i].y;
      }
    }

    var meshWidthold = meshGeometryBoundingBoxMaxx - meshGeometryBoundingBoxMinx;
    var meshDepth = meshGeometryBoundingBoxMaxy - meshGeometryBoundingBoxMiny;
    var ParamB = (2 * this._sinhInverse(Math.tan(this.angle))) / meshWidthold;
    var oldMiddlex = (meshGeometryBoundingBoxMaxx + meshGeometryBoundingBoxMinx) / 2;
    var oldMiddley = (meshGeometryBoundingBoxMaxy + meshGeometryBoundingBoxMiny) / 2;

    for (var i = 0; i < vertices.length; i++) {
      oldVertices[i] = new Vector3();
      oldVertices[i].copy(newVertices[i]);
      newVertices[i].x =
        ((this._sign(newVertices[i].x - oldMiddlex) * 1) / ParamB) * this._sinhInverse((newVertices[i].x - oldMiddlex) * ParamB);
    }

    var meshWidth = (2 / ParamB) * this._sinhInverse((meshWidthold / 2) * ParamB);

    var NewParamB = (2 * this._sinhInverse(Math.tan(this.angle))) / meshWidth;

    var rightEdgePos = new Vector3(meshWidth / 2, -meshDepth / 2, 0);
    rightEdgePos.y = (1 / NewParamB) * this._cosh(NewParamB * rightEdgePos.x) - 1 / NewParamB - meshDepth / 2;

    var bendCenter = new Vector3(0, rightEdgePos.y + rightEdgePos.x / Math.tan(this.angle), 0);

    for (var i = 0; i < vertices.length; i++) {
      var x0 =
        ((this._sign(oldVertices[i].x - oldMiddlex) * 1) / ParamB) * this._sinhInverse((oldVertices[i].x - oldMiddlex) * ParamB);
      var y0 = (1 / NewParamB) * this._cosh(NewParamB * x0) - 1 / NewParamB;

      var k = new Vector3(bendCenter.x - x0, bendCenter.y - (y0 - meshDepth / 2), bendCenter.z).normalize();

      var Q = new Vector3();
      Q.addVectors(new Vector3(x0, y0 - meshDepth / 2, oldVertices[i].z), k.multiplyScalar(oldVertices[i].y + meshDepth / 2));
      newVertices[i].x = Q.x;
      newVertices[i].y = Q.y;
    }

    let middle = (oldMiddlex * meshWidth) / meshWidthold;

    for (var i = 0; i < vertices.length; i++) {
      var O = new Vector3(oldMiddlex, oldMiddley, oldVertices[i].z);
      var p = new Vector3();
      p.subVectors(oldVertices[i], O);
      var q = new Vector3();
      q.subVectors(newVertices[i], O);

      anglesBetweenOldandNewVertices[i] = Math.acos(1 / this._cosh(ParamB * newVertices[i].x)) * this._sign(newVertices[i].x);

      newVertices[i].x = newVertices[i].x + middle;

      vertices[i].copy(newVertices[i].applyMatrix4(P));
      //vertices[i][0]= newVertices[i].applyMatrix4( P ).x;
    }

    var new_buf_vertices = [];
    //	console.log( " l________________ " );
    //	console.log( " lenn : " + vertices.length );
    for (var i = 0; i < vertices.length; i++) {
      //new_buf_vertices[ 3*i ] = vertices[i].x;
      //new_buf_vertices[ 3*i+1 ] = vertices[i].y;
      //new_buf_vertices[ 3*i+2 ] = vertices[i].z;
      let arra = [vertices[i].x, vertices[i].y, vertices[i].z];
      //arra[0] = vertices[i].x;
      //arra[1] = vertices[i].y;
      //new_buf_vertices[i][2] = vertices[i].z;
      new_buf_vertices.push(...arra);
      //console.log( i + " : " + new_buf_vertices[i] );
    }

    geometry.getAttribute("position").needsUpdate = true;

    var arr = new Float32Array(new_buf_vertices, 3);
    for (var i = 0; i < arr.length; i++) {
      //console.log( i + " : " + arr[i] );
    }

    const posAttrib = new BufferAttribute(new Float32Array(new_buf_vertices), 3);
    geometry.setAttribute("position", posAttrib);

    const buf_normales = geometry.getAttribute("normal").array;

    for (var i = 0; i < buf_normales.length; i += 3) {
      var angle = anglesBetweenOldandNewVertices[i / 3];
      let x = this.axis.x;
      let y = this.axis.y;
      let z = this.axis.z;

      var rotateMatrix = new Matrix3();
      rotateMatrix.set(
        Math.cos(angle) + (1 - Math.cos(angle)) * x * x,
        (1 - Math.cos(angle)) * x * y - Math.sin(angle) * z,
        (1 - Math.cos(angle)) * x * z + Math.sin(angle) * y,
        (1 - Math.cos(angle)) * y * x + Math.sin(angle) * z,
        Math.cos(angle) + (1 - Math.cos(angle)) * y * y,
        (1 - Math.cos(angle)) * y * z - Math.sin(angle) * x,
        (1 - Math.cos(angle)) * z * x - Math.sin(angle) * y,
        (1 - Math.cos(angle)) * z * y + Math.sin(angle) * x,
        Math.cos(angle) + (1 - Math.cos(angle)) * z * z
      );
      let vec = new Vector3(buf_normales[i], buf_normales[i + 1], buf_normales[i + 2]);
      vec.copy(vec.applyMatrix3(rotateMatrix));
      buf_normales[i] = vec.x;
      buf_normales[i + 1] = vec.y;
      buf_normales[i + 2] = vec.z;
      //face.vertexNormals[ v ].applyMatrix3( rotateMatrix );

      //console.log( i + " : " + buf_vertices[i] );
      //vertices[i/3] = new Vector3();
      //vertices[i/3].x = buf_vertices[i];
      //vertices[i/3].y = buf_vertices[i+1];
      //vertices[i/3].z = buf_vertices[i+2];
      //console.log( i/3 + " : " + vertices[i/3].z );
    }

    geometry.setAttribute("normal", new BufferAttribute(new Float32Array(buf_normales), 3));

    //geometry.computeFaceNormals();
    //geometry.verticesNeedUpdate = true;
    //geometry.normalsNeedUpdate = true;
    /*
		// compute Vertex Normals
		var fvNames = [ 'a', 'b', 'c', 'd' ];

		for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

			var face = geometry.faces[ f ];
			if ( face.vertexNormals === undefined ) {
				continue;
			}
			for ( var v = 0, vl = face.vertexNormals.length; v < vl; v ++ ) {

				var angle = anglesBetweenOldandNewVertices[ face[ fvNames[ v ] ] ];
				x = this.axis.x; y = this.axis.y; z = this.axis.z;

				var rotateMatrix = new Matrix3();
				rotateMatrix.set ( Math.cos(angle) + (1-Math.cos(angle))*x*x, (1-Math.cos(angle))*x*y - Math.sin(angle)*z, (1-Math.cos(angle))*x*z + Math.sin(angle)*y,
								(1-Math.cos(angle))*y*x + Math.sin(angle)*z, Math.cos(angle) + (1-Math.cos(angle))*y*y, (1-Math.cos(angle))*y*z - Math.sin(angle)*x,
								(1-Math.cos(angle))*z*x - Math.sin(angle)*y, (1-Math.cos(angle))*z*y + Math.sin(angle)*x, Math.cos(angle) + (1-Math.cos(angle))*z*z );

				face.vertexNormals[ v ].applyMatrix3( rotateMatrix );

				}

			}
		// end compute Vertex Normals			
*/
    return this;
  };
};

// BendModifier.prototype = Object.create(EventDispatcher.prototype);
// BendModifier.prototype.constructor = BendModifier;

// var MapControls = function (object, domElement) {
//   BendModifier.call(this, object, domElement);

//   this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

//   this.mouseButtons.LEFT = MOUSE.PAN;
//   this.mouseButtons.RIGHT = MOUSE.ROTATE;

//   this.touches.ONE = TOUCH.PAN;
//   this.touches.TWO = TOUCH.DOLLY_ROTATE;
// };

// MapControls.prototype = Object.create(EventDispatcher.prototype);
// MapControls.prototype.constructor = MapControls;

// export { BendModifier, MapControls };

THREE.BendModifier = BendModifier;
